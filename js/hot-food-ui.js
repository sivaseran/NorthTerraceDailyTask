import {cookingDefaults,submitCooking,temperatureCheckContext,submitTemperatureCheck,expiryContext,submitExpiry,canStartHotFood,getOverdueTemperatureTasks} from './hot-food-engine.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nowHM=()=>new Date().toTimeString().slice(0,5);
// The modal owns submission: never dismiss the form or report success until the
// underlying Firestore action has completed. Validation errors are editable in place.
function modal(title,body,confirmText,onSubmit){
  return new Promise(resolve=>{
    const wrap=document.createElement('div');wrap.className='modal-overlay hf-modal-overlay';
    wrap.innerHTML=`<section class="modal hf-modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header class="hf-dialog-head"><h2>${esc(title)}</h2><p>Complete the required fields, then submit the record.</p></header><div class="hf-modal-body">${body}</div><div class="hf-validation-error" role="alert" aria-live="assertive"></div><div class="modal-actions"><button type="button" class="btn secondary hf-cancel">Cancel</button><button type="button" class="btn hf-confirm">${esc(confirmText)}</button></div></section>`;
    document.body.append(wrap);document.body.classList.add('modal-open');
    const close=value=>{wrap.remove();if(!document.querySelector('.modal-overlay'))document.body.classList.remove('modal-open');resolve(value);};
    const bodyRoot=wrap.querySelector('.hf-modal-body'), error=wrap.querySelector('.hf-validation-error'),submit=wrap.querySelector('.hf-confirm');
    const warn=(message,field)=>{error.textContent=message;if(field)field.focus();error.scrollIntoView({block:'nearest'});};
    wrap.querySelector('.hf-cancel').onclick=()=>{if(!submit.disabled)close(false);};
    wrap.addEventListener('click',event=>{
      if(event.target===wrap&& !submit.disabled){close(false);return;}
      const retest=event.target.closest('.hf-add-retest');
      if(retest){const box=retest.parentElement.querySelector('.hf-core-readings');const input=document.createElement('input');input.className='hf-temp';input.type='number';input.step='0.1';input.placeholder='Retest °C';box.append(input);input.focus();}
      const add=event.target.closest('.hf-add-product-btn');
      if(add){const select=wrap.querySelector('.hf-add-product-select'),id=select?.value;const row=[...wrap.querySelectorAll('.hf-cook-row')].find(r=>r.dataset.id===id);if(row){row.hidden=false;row.querySelector('.hf-use').checked=true;select.value='';row.scrollIntoView({block:'nearest'});}}
    });
    wrap.addEventListener('change',event=>{
      if(event.target.matches('.hf-no-cooking')){const off=event.target.checked;wrap.querySelectorAll('.hf-cook-row').forEach(row=>{row.classList.toggle('hf-disabled',off);row.querySelectorAll('input,button').forEach(el=>el.disabled=off);});}
    });
    submit.onclick=async()=>{
      error.textContent='';
      const time=bodyRoot.querySelector('.hf-time,.hf-actual-time,.hf-exp-time');
      if(time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time.value)){warn('Enter a valid time (HH:MM). All entries are preserved.',time);return;}
      try{submit.disabled=true;submit.textContent='Saving…';await onSubmit(bodyRoot,warn);close(true);}
      catch(ex){warn(ex?.message||'Could not save. Correct the entries and try again.');}
      finally{if(wrap.isConnected){submit.disabled=false;submit.textContent=confirmText;}}
    };
  });
}
function selectedItems(root){return [...root.querySelectorAll('.hf-cook-row')].filter(row=>row.querySelector('.hf-use').checked).map(row=>{
  const temps=[...row.querySelectorAll('.hf-temp')];
  if(!/^\d+$/.test(row.querySelector('.hf-qty').value)||Number(row.querySelector('.hf-qty').value)<1)throw new Error(`Enter a whole quantity greater than zero for ${row.dataset.name}.`);
  if(temps.some(x=>x.value.trim()===''||!Number.isFinite(Number(x.value))))throw new Error(`Enter all core temperature readings for ${row.dataset.name}.`);
  const coreReadings=temps.map(x=>Number(x.value));
  return {productId:row.dataset.id,productName:row.dataset.name,qty:Number(row.querySelector('.hf-qty').value),coreTempC:coreReadings.at(-1),coreReadings,wasteFailed:row.querySelector('.hf-failed-waste').checked};
});}
function depletedBatchSellOuts(product,currentQty){let sold=Math.max(0,Number(product.currentSystemQty)-Number(currentQty)),out=[];for(const b of product.batches||[]){const remaining=Number(b.remainingQty)||0;if(sold>=remaining&&remaining>0){out.push(b);sold-=remaining;}else break;}return out;}
function renderSellOutFields(ctx,root){
  for(const row of root.querySelectorAll('.hf-temp-row')){
    const p=ctx.products.find(x=>x.productId===row.dataset.id);if(!p)continue;
    const box=row.querySelector('.hf-sell-out-batches');if(!box)continue;
    const qtyValue=row.querySelector('.hf-current').value;
    if(qtyValue===''||!Number.isFinite(Number(qtyValue))){box.innerHTML='';continue;}
    const depleted=depletedBatchSellOuts(p,Number(qtyValue));
    const existing=new Map([...box.querySelectorAll('[data-batch]')].map(e=>[e.dataset.batch,e.value]));
    const defaultTime=root.querySelector('.hf-actual-time')?.value||nowHM();
    box.innerHTML=depleted.map(b=>`<label>Sell-out time — ${esc(b.productName||p.productName)} batch ${esc(b.timeOutOven)}<input type="time" class="hf-batch-sell-time" data-batch="${esc(b.id)}" value="${esc(existing.get(b.id)||defaultTime)}" required></label>`).join('');
  }
}
export async function openCookingTask(task,actor,{source}={}){
  const initial=task?.hotFoodType==='cooking_initial'||source==='start_hot_food';
  const d=await cookingDefaults(task.date,initial?'initial':'second'),planned=new Map(d.planned.map(x=>[x.productId,x.qty]));
  const ordered=[...d.products].sort((a,b)=>Number(planned.has(b.id))-Number(planned.has(a.id))||String(a.name).localeCompare(String(b.name)));
  const rows=ordered.map(p=>`<div class="hf-cook-row ${planned.has(p.id)?'planned':''}" ${!planned.has(p.id)?'hidden':''} data-id="${esc(p.id)}" data-name="${esc(p.name)}"><label class="hf-product-check"><input class="hf-use" type="checkbox" ${planned.has(p.id)?'checked':''}><span><b>${esc(p.name)}</b>${planned.has(p.id)?'<small>Today’s plan</small>':''}</span></label><label>Quantity<input class="hf-qty" type="number" min="1" step="1" value="${planned.get(p.id)||''}"></label><label>Core °C<div class="hf-core-readings"><input class="hf-temp" type="number" step="0.1" placeholder="75.0"></div><button type="button" class="btn secondary small hf-add-retest">+ Reheat / Retest</button></label><label class="hf-failed-waste-label"><input class="hf-failed-waste" type="checkbox"> Waste if final core fails</label></div>`).join('');
  const heading=initial?'Initial Cooking':'New Cooking / Top Up';
  const available=ordered.filter(p=>!planned.has(p.id));
  const productPicker=available.length?`<div class="hf-add-product"><select class="hf-add-product-select" aria-label="Additional product"><option value="">Select product to add…</option>${available.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}</select><button type="button" class="btn secondary hf-add-product-btn">+ Add Product</button></div>`:'';
  const body=`<div class="hf-note">${initial?'Planned products are preselected. Change quantities or deselect what is not cooked.':'Select products cooked now.'} Record the actual oven-out time and core readings.</div><label class="hf-time-label">Time Out Oven<input class="hf-time" type="time" value="${nowHM()}"></label><div class="hf-cook-grid">${rows||'<p>No active products. Ask a manager to add products.</p>'}</div>${productPicker}<label class="hf-no-cook"><input type="checkbox" class="hf-no-cooking"><span><b>No cooking required today</b><small>Other scheduled Hot Food tasks are closed; staff can use Start Hot Food before 14:00.</small></span></label>`;
  return modal(heading,body,'Confirm Cooking',async root=>{
    const no=root.querySelector('.hf-no-cooking').checked,time=root.querySelector('.hf-time').value;
    const items=no?[]:selectedItems(root);
    if(!no&&!items.length)throw new Error('Select at least one product or choose No cooking required today.');
    await submitCooking({date:task.date,taskId:task.id||'',actor,timeOutOven:time,items,noCooking:no,source:source||task.hotFoodType});
  });
}
function updateWasteField(row,pass){
  const tempEl=row.querySelector('.hf-reading'),qtyEl=row.querySelector('.hf-current'),wasteEl=row.querySelector('.hf-waste');
  const reason=row.querySelector('.hf-waste-reason'),details=row.querySelector('.hf-waste-details');
  const qty=Number(qtyEl.value),reading=tempEl.value.trim()===''?null:Number(tempEl.value);
  const failed=qty>0&&reading!==null&&Number.isFinite(reading)&&reading<Number(pass);
  if(failed){wasteEl.value=String(qty);wasteEl.disabled=true;reason.value='temperature_issue';reason.disabled=true;}
  else{if(wasteEl.disabled)wasteEl.value='0';wasteEl.disabled=false;reason.disabled=false;}
  details.hidden=!failed&&Number(wasteEl.value)<=0;
}
export async function openTemperatureTask(task,actor){
  const overdue=await getOverdueTemperatureTasks(task.date,task),taskIds=overdue.length?overdue.map(x=>x.id):[task.id],scheduledTimes=overdue.length?overdue.map(x=>x.sourceTime):[task.sourceTime];
  const ctx=await temperatureCheckContext(task.date,task.sourceTime);if(!ctx.products.length)throw new Error('No eligible active Hot Food products for this check.');
  const rows=ctx.products.map(p=>`<section class="hf-temp-row" data-id="${esc(p.productId)}" data-name="${esc(p.productName)}"><div class="hf-temp-product"><b>${esc(p.productName)}</b><small>System stock: ${p.currentSystemQty}</small></div><label>Current qty<input class="hf-current" type="number" min="0" step="1" value="${p.currentSystemQty}"></label><label>Lowest °C<input class="hf-reading" type="number" step="0.1" placeholder="${ctx.config.holdingPassC}"></label><label>Waste now<input class="hf-waste" type="number" min="0" step="1" value="0"></label><div class="hf-waste-details" hidden><label>Waste reason<select class="hf-waste-reason"><option value="">No waste</option><option value="temperature_issue">Temperature issue</option><option value="quality_issue">Quality issue</option><option value="damaged_contaminated">Damaged/contaminated</option><option value="end_of_service">End of service</option><option value="other">Other</option></select></label><label>Comment<input class="hf-waste-comment" placeholder="Required for Other"></label></div><div class="hf-sell-out-batches"></div></section>`).join('');
  const body=`<div class="hf-note">${scheduledTimes.length>1?`<b>Catch-up:</b> actual reading will close ${esc(scheduledTimes.join(', '))} without inventing earlier readings.<br>`:''}Enter physically present quantity <b>before</b> waste and the lowest reading measured. Pass ≥ ${ctx.config.holdingPassC}°C.</div><label class="hf-time-label">Actual reading time<input class="hf-actual-time" type="time" value="${nowHM()}"></label><div class="hf-temp-grid">${rows}</div>`;
  // Render required per-batch sell-out fields *inside* the form; no browser prompt.
  const result=modal(`${task.sourceTime} Hot Food Temperature Check`,body,'Confirm Temperature Check',async root=>{
    renderSellOutFields(ctx,root);
    const actualReadingTime=root.querySelector('.hf-actual-time').value,readings=[];
    for(const r of root.querySelectorAll('.hf-temp-row')){
      const qtyEl=r.querySelector('.hf-current'),tempEl=r.querySelector('.hf-reading'),wasteEl=r.querySelector('.hf-waste');
      const qty=Number(qtyEl.value),wasteQty=Number(wasteEl.value);
      if(qtyEl.value.trim()===''||!Number.isInteger(qty)||qty<0)throw new Error(`Enter a valid current quantity for ${r.dataset.name}.`);
      const source=ctx.products.find(p=>p.productId===r.dataset.id);
      if(qty>Number(source.currentSystemQty))throw new Error(`${r.dataset.name}: quantity exceeds recorded stock. Record missed cooking first.`);
      if(qty>0&&(tempEl.value.trim()===''||!Number.isFinite(Number(tempEl.value))))throw new Error(`Enter the lowest measured temperature for ${r.dataset.name}.`);
      if(wasteEl.value.trim()===''||!Number.isInteger(wasteQty)||wasteQty<0||wasteQty>qty)throw new Error(`Enter a valid waste quantity for ${r.dataset.name}.`);
      const sellOutTimes={};
      for(const input of r.querySelectorAll('.hf-batch-sell-time')){
        if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.value))throw new Error(`${r.dataset.name}: enter the Sell Out Time for every sold-out batch.`);
        sellOutTimes[input.dataset.batch]=input.value;
      }
      readings.push({productId:r.dataset.id,productName:r.dataset.name,qty,temperatureC:qty===0?null:Number(tempEl.value),wasteQty,wasteReason:r.querySelector('.hf-waste-reason').value,wasteComment:r.querySelector('.hf-waste-comment').value,sellOutTime:actualReadingTime,sellOutTimes});
    }
    await submitTemperatureCheck({date:task.date,taskId:task.id,taskIds,actor,scheduledTimes,actualReadingTime,readings});
  });
  // Modal exists synchronously; keep sell-out inputs current while quantities change.
  const active=[...document.querySelectorAll('.hf-modal-overlay')].at(-1);
  if(active){const bodyRoot=active.querySelector('.hf-modal-body');renderSellOutFields(ctx,bodyRoot);bodyRoot.addEventListener('change',event=>{if(event.target.matches('.hf-current,.hf-actual-time'))renderSellOutFields(ctx,bodyRoot);});bodyRoot.addEventListener('input',event=>{const row=event.target.closest('.hf-temp-row');if(row&&event.target.matches('.hf-current,.hf-reading,.hf-waste'))updateWasteField(row,ctx.config.holdingPassC);});}
  return result;
}
export async function openExpiryTask(task,actor){
  const b=await expiryContext(task.hotFoodBatchId);
  return modal(`4-Hour Expiry — ${b.productName}`,`<div class="hf-note">Oven out ${esc(b.timeOutOven)} · Estimated remaining <b>${Number(b.remainingQty)||0}</b>. Confirm actual waste/removal and time.</div><label>Actual quantity wasted<input class="hf-exp-waste" type="number" min="0" value="${Number(b.remainingQty)||0}"></label><label class="hf-time-label">Actual removal/waste time<input class="hf-exp-time" type="time" value="${nowHM()}"></label><label>Reason if removed early<select class="hf-exp-reason"><option value="">—</option><option value="temperature_issue">Temperature issue</option><option value="quality_issue">Quality issue</option><option value="damaged_contaminated">Damaged/contaminated</option><option value="end_of_service">End of service</option><option value="other">Other</option></select></label><label>Comment<input class="hf-exp-comment" placeholder="Required for Other"></label><label>Sell Out Time (if waste is 0)<input class="hf-exp-sell" type="time"></label>`,'Confirm Expiry / Removal',async root=>{
    const waste=root.querySelector('.hf-exp-waste');if(waste.value.trim()===''||!Number.isInteger(Number(waste.value))||Number(waste.value)<0)throw new Error('Enter a valid whole quantity wasted.');
    await submitExpiry({taskId:task.id,batchId:b.id,actor,actualWasteQty:Number(waste.value),removalTime:root.querySelector('.hf-exp-time').value,sellOutTime:root.querySelector('.hf-exp-sell').value,earlyReason:root.querySelector('.hf-exp-reason').value,earlyComment:root.querySelector('.hf-exp-comment').value});
  });
}
export async function completeHotFoodTask(task,actor){if(task.hotFoodType==='temperature_check')return openTemperatureTask(task,actor);if(task.hotFoodType==='expiry')return openExpiryTask(task,actor);return openCookingTask(task,actor);}
export async function renderStartHotFoodButton(date,container,actorProvider){if(!container)return;const ok=await canStartHotFood(date);let b=container.querySelector('#startHotFoodBtn');if(!ok){b?.remove();return;}if(!b){b=document.createElement('button');b.id='startHotFoodBtn';b.className='btn hf-start-btn';b.textContent='Start Hot Food';container.prepend(b);}b.onclick=async()=>{const actor=await actorProvider();if(!actor)return;try{await openCookingTask({id:'',date,hotFoodType:'cooking_initial'},actor,{source:'start_hot_food'});}catch(e){const message=document.createElement('div');message.className='hf-validation-error';message.setAttribute('role','alert');message.textContent=e.message||String(e);b.after(message);setTimeout(()=>message.remove(),9000);}};}
