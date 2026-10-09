import {cookingDefaults,submitCooking,temperatureCheckContext,submitTemperatureCheck,expiryContext,submitExpiry,canStartHotFood,getOverdueTemperatureTasks} from './hot-food-engine.js';
import {getHotFoodConfig} from './hot-food-store.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nowHM=()=>new Date().toTimeString().slice(0,5);
// The modal owns submission: never dismiss the form or report success until the
// underlying Firestore action has completed. Validation errors are editable in place.
function modal(title,body,confirmText,onSubmit,{kind=""}={}){
  return new Promise(resolve=>{
    const wrap=document.createElement('div');wrap.className='modal-overlay hf-modal-overlay';
    wrap.innerHTML=`<section class="modal hf-modal ${esc(kind)}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header class="hf-dialog-head"><h2>${esc(title)}</h2><p>Complete the required fields, then submit the record.</p></header><div class="hf-modal-body">${body}</div><div class="hf-validation-error" role="alert" aria-live="assertive"></div><div class="modal-actions"><button type="button" class="btn secondary hf-cancel">Cancel</button><button type="button" class="btn hf-confirm">${esc(confirmText)}</button></div></section>`;
    document.body.append(wrap);document.body.classList.add('modal-open');
    const close=value=>{wrap.remove();if(!document.querySelector('.modal-overlay'))document.body.classList.remove('modal-open');resolve(value);};
    const bodyRoot=wrap.querySelector('.hf-modal-body'), error=wrap.querySelector('.hf-validation-error'),submit=wrap.querySelector('.hf-confirm');
    const warn=(message,field)=>{error.textContent=message;if(field){field.classList.add('hf-invalid');field.focus();}error.scrollIntoView({block:'nearest'});};
    wrap.addEventListener('input',e=>{if(e.target.matches('input,select')){e.target.classList.remove('hf-invalid');error.textContent='';}});
    wrap.querySelector('.hf-cancel').onclick=()=>{if(!submit.disabled)close(false);};
    wrap.addEventListener('click',event=>{
      const retest=event.target.closest('.hf-add-retest');
      if(retest){
        const row=retest.closest('.hf-cook-row'),box=row.querySelector('.hf-core-readings');
        const input=document.createElement('input');input.className='hf-temp hf-retest-field';input.type='number';input.step='0.1';input.inputMode='decimal';input.placeholder='New core °C';input.setAttribute('aria-label','Core temperature after reheat');
        box.append(input);input.focus();row.dispatchEvent(new Event('hf-refresh',{bubbles:true}));return;
      }
      const add=event.target.closest('.hf-add-product-btn');
      if(add){
        const select=wrap.querySelector('.hf-add-product-select'),id=select?.value;
        const row=[...wrap.querySelectorAll('.hf-cook-row')].find(r=>r.dataset.id===id);
        if(row){row.hidden=false;row.querySelector('.hf-use').checked=true;[...select.options].find(o=>o.value===id)?.remove();select.value='';row.dispatchEvent(new Event('hf-refresh',{bubbles:true}));}
      }
      const manualWaste=event.target.closest('.hf-manual-waste');
      if(manualWaste){const row=manualWaste.closest('.hf-temp-row');row.dataset.manualWaste=row.dataset.manualWaste==='true'?'false':'true';row.dispatchEvent(new Event('hf-refresh',{bubbles:true}));}
    });
    wrap.addEventListener('change',event=>{
      if(event.target.matches('.hf-no-cooking')){
        const off=event.target.checked;
        wrap.querySelectorAll('.hf-cook-row').forEach(row=>{
          row.classList.toggle('hf-disabled',off);
          row.querySelectorAll('input,button').forEach(el=>el.disabled=off);
        });
        const picker=wrap.querySelector('.hf-add-product');
        if(picker)picker.querySelectorAll('button,select').forEach(el=>el.disabled=off);
      }
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
function updateCookingRow(row,pass){
  const enabled=row.querySelector('.hf-use').checked;
  row.classList.toggle('hf-unselected',!enabled);
  const values=[...row.querySelectorAll('.hf-temp')].map(el=>el.value.trim());
  const last=values.at(-1)||'';
  const valid=last!==''&&Number.isFinite(Number(last))&&Number(last)>=-50&&Number(last)<=200;
  const fail=valid&&Number(last)<Number(pass);
  const readings=values.filter(v=>v!=='').length;
  const status=row.querySelector('.hf-cook-status'),extra=row.querySelector('.hf-cook-extra');
  if(!enabled){status.textContent='Not selected';status.className='hf-cook-status hf-neutral';}
  else if(!last){status.textContent=readings>0?'Retest needed':'Awaiting reading';status.className='hf-cook-status hf-neutral';}
  else if(!valid){status.textContent='Check °C';status.className='hf-cook-status hf-fail';}
  else if(fail){status.textContent=`Below ${pass}°C`;status.className='hf-cook-status hf-fail';}
  else{status.textContent=readings>1?'Pass · retested':'Pass';status.className='hf-cook-status hf-pass';}
  extra.hidden=!enabled||(!fail&&values.length===1);
  if(!fail)row.querySelector('.hf-failed-waste').checked=false;
  const hint=row.querySelector('.hf-core-hint');
  hint.textContent=fail?`Below ${pass}°C: reheat and enter a new measured reading, or confirm waste.`:'Each retest reading stays in the record.';
  row.querySelector('.hf-add-retest').hidden=!fail;
  row.querySelector('.hf-failed-waste-label').hidden=!fail;
}
function updateHoldingRow(row,pass){
  const qtyText=row.querySelector('.hf-current').value.trim();
  const t=row.querySelector('.hf-reading').value.trim();
  const wasteEl=row.querySelector('.hf-waste');
  const reason=row.querySelector('.hf-waste-reason');
  const status=row.querySelector('.hf-holding-status');
  const qty=Number(qtyText),reading=Number(t);
  const goodQty=qtyText!==''&&Number.isInteger(qty)&&qty>=0;
  const sold=goodQty&&qty===0;
  const goodTemp=t!==''&&Number.isFinite(reading)&&reading>=-50&&reading<=200;
  const failed=goodQty&&qty>0&&goodTemp&&reading<Number(pass);
  const previousFailed=row.dataset.wasFailed==='true';
  row.dataset.wasFailed=String(failed);
  row.querySelector('.hf-reading').disabled=sold;
  row.querySelector('.hf-confirm-all-waste').hidden=!failed;
  if(!failed)row.querySelector('.hf-waste-confirmed').checked=false;
  if(failed){
    wasteEl.value=String(qty);wasteEl.disabled=true;reason.value='temperature_issue';reason.disabled=true;
    row.dataset.manualWaste='true';
  } else {
    if(previousFailed){wasteEl.value='0';if(reason.value==='temperature_issue')reason.value='';row.dataset.manualWaste='false';}
    wasteEl.disabled=false;reason.disabled=false;
  }
  const wasteQty=Number(wasteEl.value)||0;
  const manual=row.dataset.manualWaste==='true';
  const details=row.querySelector('.hf-waste-details');
  details.hidden=!(failed||manual||wasteQty>0);
  row.querySelector('.hf-manual-waste').hidden=failed||sold;
  row.querySelector('.hf-manual-waste').textContent=manual?'Hide waste entry':'+ Record waste';
  const sell=row.querySelector('.hf-sell-out-batches');
  const soldRows=sell&&sell.childElementCount>0;
  row.querySelector('.hf-temp-extras').hidden=!(!details.hidden||soldRows);
  if(!goodQty){status.textContent='Check quantity';status.className='hf-holding-status hf-fail';}
  else if(sold){status.textContent='Sold out';status.className='hf-holding-status hf-neutral';}
  else if(!t){status.textContent='Awaiting reading';status.className='hf-holding-status hf-neutral';}
  else if(!goodTemp){status.textContent='Check °C';status.className='hf-holding-status hf-fail';}
  else if(failed){status.textContent=`Below ${pass}°C · waste all`;status.className='hf-holding-status hf-fail';}
  else{status.textContent='Pass';status.className='hf-holding-status hf-pass';}
}
export async function openCookingTask(task,actor,{source}={}){
  const initial=task?.hotFoodType==='cooking_initial'||source==='start_hot_food';
  const [d,cfg]=await Promise.all([cookingDefaults(task.date,initial?'initial':'second'),getHotFoodConfig()]);
  const pass=Number(cfg.corePassC||75);
  const planned=new Map(d.planned.map(x=>[x.productId,x.qty]));
  const planOrder=new Map(d.planned.map((x,i)=>[x.productId,i]));
  const ordered=[...d.products].sort((a,b)=>Number(planned.has(b.id))-Number(planned.has(a.id))||(planned.has(a.id)?planOrder.get(a.id)-planOrder.get(b.id):String(a.name).localeCompare(String(b.name))));
  const rows=ordered.map(p=>`<div class="hf-cook-row ${planned.has(p.id)?'planned':''}" ${!planned.has(p.id)?'hidden':''} data-id="${esc(p.id)}" data-name="${esc(p.name)}">
    <label class="hf-product-check"><input class="hf-use" type="checkbox" aria-label="Include ${esc(p.name)}" ${planned.has(p.id)?'checked':''}><span>${esc(p.name)}</span></label>
    <label class="hf-cell-field"><span class="hf-mobile-label">Qty</span><input class="hf-qty" type="number" inputmode="numeric" min="1" step="1" value="${planned.get(p.id)||''}" aria-label="Quantity for ${esc(p.name)}"></label>
    <label class="hf-cell-field"><span class="hf-mobile-label">Core °C</span><div class="hf-core-readings"><input class="hf-temp" type="number" inputmode="decimal" step="0.1" placeholder="°C" aria-label="Core temperature for ${esc(p.name)}"></div></label>
    <span class="hf-cook-status hf-neutral" role="status">Awaiting reading</span>
    <div class="hf-cook-extra" hidden><small class="hf-core-hint"></small><button type="button" class="btn secondary small hf-add-retest">+ Reheat / Retest</button><label class="hf-failed-waste-label" hidden><input class="hf-failed-waste" type="checkbox"> Waste product (failed core)</label></div>
  </div>`).join('');
  const heading=initial?'Initial Cooking':'New Cooking / Top Up';
  const available=ordered.filter(p=>!planned.has(p.id));
  const picker=available.length?`<div class="hf-add-product"><select class="hf-add-product-select" aria-label="Additional product"><option value="">Select another product…</option>${available.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')}</select><button type="button" class="btn secondary hf-add-product-btn">+ Add Product</button></div>`:'';
  const body=`<div class="hf-compact-top"><span class="hf-brief">${initial?'Today’s plan · quantities editable':'Select products cooked now'} · Minimum core ${pass}°C</span><label class="hf-inline-time">Time Out Oven <input class="hf-time" type="time" value="${nowHM()}" required></label></div>
    <div class="hf-grid-caption hf-cook-columns"><span>PRODUCT</span><span>QTY</span><span>CORE °C</span><span>RESULT</span></div>
    <div class="hf-cook-grid">${rows||'<p>No active products. Ask a manager to add products.</p>'}</div>
    ${picker}<label class="hf-no-cook"><input type="checkbox" class="hf-no-cooking"><span>No cooking required today <small>Stops this planned cooking. Start Hot Food is available before 14:00.</small></span></label>`;
  const result=modal(heading,body,'Confirm Cooking',async root=>{
    const no=root.querySelector('.hf-no-cooking').checked,time=root.querySelector('.hf-time').value;
    const items=no?[]:selectedItems(root);
    if(!no&&!items.length)throw new Error('Select at least one product or choose No cooking required today.');
    for(const x of items){
      if(x.coreReadings.some(t=>t<-50||t>200))throw new Error(`${x.productName}: enter a measured core temperature between −50°C and 200°C.`);
      if(x.coreTempC<pass&&!x.wasteFailed)throw new Error(`${x.productName}: below ${pass}°C. Reheat and retest, or confirm waste.`);
    }
    await submitCooking({date:task.date,taskId:task.id||'',actor,timeOutOven:time,items,noCooking:no,source:source||task.hotFoodType});
  },{kind:'hf-compact hf-compact-cooking'});
  const wrap=[...document.querySelectorAll('.hf-modal-overlay')].at(-1);
  if(wrap){
    wrap.querySelectorAll('.hf-cook-row').forEach(row=>updateCookingRow(row,pass));
    const refresh=e=>{const row=e.target.closest('.hf-cook-row');if(row)updateCookingRow(row,pass);};
    wrap.addEventListener('input',refresh);wrap.addEventListener('change',refresh);
    wrap.addEventListener('hf-refresh',refresh);
    // Prevent automatic completed state simply from opening the form: modal
    // returns true only after all required records are written successfully.
  }
  return result;
}
function depletedBatchSellOuts(product,currentQty){
  let sold=Math.max(0,Number(product.currentSystemQty)-Number(currentQty)),out=[];
  for(const b of product.batches||[]){const remaining=Number(b.remainingQty)||0;if(sold>=remaining&&remaining>0){out.push(b);sold-=remaining;}else break;}
  return out;
}
function renderSellOutFields(ctx,root){
  for(const row of root.querySelectorAll('.hf-temp-row')){
    const p=ctx.products.find(x=>x.productId===row.dataset.id);if(!p)continue;
    const box=row.querySelector('.hf-sell-out-batches');if(!box)continue;
    const qtyValue=row.querySelector('.hf-current').value;
    if(qtyValue===''||!Number.isFinite(Number(qtyValue))){box.innerHTML='';continue;}
    const depleted=depletedBatchSellOuts(p,Number(qtyValue));
    const existing=new Map([...box.querySelectorAll('[data-batch]')].map(e=>[e.dataset.batch,e.value]));
    const defaultTime=root.querySelector('.hf-actual-time')?.value||nowHM();
    // Rebuild only on stock/time edits; preserve manually entered sell-out times.
    box.innerHTML=depleted.map(b=>`<label>Sold-out batch · ${esc(b.timeOutOven)}<input type="time" class="hf-batch-sell-time" data-batch="${esc(b.id)}" value="${esc(existing.get(b.id)||defaultTime)}" required></label>`).join('');
  }
}
export async function openTemperatureTask(task,actor){
  const overdue=await getOverdueTemperatureTasks(task.date,task);
  const taskIds=overdue.length?overdue.map(x=>x.id):[task.id];
  const scheduledTimes=overdue.length?overdue.map(x=>x.sourceTime):[task.sourceTime];
  const ctx=await temperatureCheckContext(task.date,task.sourceTime);
  if(!ctx.products.length)throw new Error('No eligible active Hot Food products for this check.');
  const pass=Number(ctx.config.holdingPassC||63);
  const rows=ctx.products.map(p=>`<section class="hf-temp-row" data-id="${esc(p.productId)}" data-name="${esc(p.productName)}" data-manual-waste="false" data-was-failed="false">
    <div class="hf-temp-product"><b>${esc(p.productName)}</b><small>Expected stock: ${Number(p.currentSystemQty)||0}</small></div>
    <label class="hf-cell-field"><span class="hf-mobile-label">CURRENT QTY</span><input class="hf-current" type="number" inputmode="numeric" min="0" step="1" value="${Number(p.currentSystemQty)||0}" aria-label="Current quantity for ${esc(p.productName)}"></label>
    <label class="hf-cell-field"><span class="hf-mobile-label">LOWEST °C</span><input class="hf-reading" type="number" inputmode="decimal" step="0.1" placeholder="°C" aria-label="Lowest temperature for ${esc(p.productName)}"></label>
    <div class="hf-holding-result"><span class="hf-holding-status hf-neutral" role="status">Awaiting reading</span><button type="button" class="hf-manual-waste" aria-label="Record voluntary waste for ${esc(p.productName)}">+ Record waste</button></div>
    <div class="hf-temp-extras" hidden>
      <div class="hf-waste-details" hidden><label>Waste quantity<input class="hf-waste" type="number" min="0" step="1" value="0"></label><label>Waste reason<select class="hf-waste-reason"><option value="">Select reason…</option><option value="temperature_issue">Temperature issue</option><option value="quality_issue">Quality issue</option><option value="damaged_contaminated">Damaged/contaminated</option><option value="end_of_service">End of service</option><option value="other">Other</option></select></label><label class="hf-waste-comment-wrap">Comment<input class="hf-waste-comment" placeholder="Required for Other"></label></div>
      <label class="hf-confirm-all-waste" hidden><input type="checkbox" class="hf-waste-confirmed"> I confirm all current items were wasted</label><div class="hf-sell-out-batches"></div>
    </div>
  </section>`).join('');
  const body=`<div class="hf-compact-top"><span class="hf-brief">Qty physically present <b>before waste</b> · Minimum holding ${pass}°C ${scheduledTimes.length>1?`· Catch-up ${esc(scheduledTimes.join(', '))}`:''}</span><label class="hf-inline-time">Reading Time<input class="hf-actual-time" type="time" value="${nowHM()}" required></label></div>
  <div class="hf-grid-caption hf-temp-columns"><span>PRODUCT</span><span>CURRENT QTY</span><span>LOWEST °C</span><span>RESULT</span></div>
  <div class="hf-temp-grid">${rows}</div>`;
  const result=modal(`${task.sourceTime} Hot Food Temperature Check`,body,'Confirm Check',async root=>{
    const actualReadingTime=root.querySelector('.hf-actual-time').value,readings=[];
    for(const r of root.querySelectorAll('.hf-temp-row')){
      const qtyEl=r.querySelector('.hf-current'),tempEl=r.querySelector('.hf-reading'),wasteEl=r.querySelector('.hf-waste');
      const qty=Number(qtyEl.value),wasteQty=Number(wasteEl.value);
      if(qtyEl.value.trim()===''||!Number.isInteger(qty)||qty<0)throw new Error(`Enter a valid current quantity for ${r.dataset.name}.`);
      const source=ctx.products.find(p=>p.productId===r.dataset.id);
      if(qty>Number(source.currentSystemQty))throw new Error(`${r.dataset.name}: quantity exceeds recorded stock. Record missed cooking first.`);
      if(qty>0&&(tempEl.value.trim()===''||!Number.isFinite(Number(tempEl.value))||Number(tempEl.value)<-50||Number(tempEl.value)>200))throw new Error(`Enter a valid lowest measured temperature for ${r.dataset.name}.`);
      if(wasteEl.value.trim()===''||!Number.isInteger(wasteQty)||wasteQty<0||wasteQty>qty)throw new Error(`Enter a valid waste quantity for ${r.dataset.name}.`);
      const below=qty>0&&Number(tempEl.value)<pass;
      if(below&&wasteQty!==qty)throw new Error(`${r.dataset.name}: below ${pass}°C, so all ${qty} items must be wasted.`);
      if(below&&!r.querySelector('.hf-waste-confirmed').checked)throw new Error(`${r.dataset.name}: confirm that all ${qty} items were actually wasted.`);
      const reason=r.querySelector('.hf-waste-reason').value,comment=r.querySelector('.hf-waste-comment').value;
      if(wasteQty>0&&!reason)throw new Error(`${r.dataset.name}: select a waste reason.`);
      if(wasteQty>0&&reason==='other'&&!comment.trim())throw new Error(`${r.dataset.name}: enter a reason for Other waste.`);
      const sellOutTimes={};
      for(const input of r.querySelectorAll('.hf-batch-sell-time')){
        if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.value))throw new Error(`${r.dataset.name}: enter the Sell Out Time for every sold-out batch.`);
        sellOutTimes[input.dataset.batch]=input.value;
      }
      readings.push({productId:r.dataset.id,productName:r.dataset.name,qty,temperatureC:qty===0?null:Number(tempEl.value),wasteQty,wasteReason:reason,wasteComment:comment,sellOutTime:actualReadingTime,sellOutTimes});
    }
    await submitTemperatureCheck({date:task.date,taskId:task.id,taskIds,actor,scheduledTimes,actualReadingTime,readings});
  },{kind:'hf-compact hf-compact-holding'});
  const wrap=[...document.querySelectorAll('.hf-modal-overlay')].at(-1);
  if(wrap){
    const bodyRoot=wrap.querySelector('.hf-modal-body');
    const refresh=()=>{renderSellOutFields(ctx,bodyRoot);bodyRoot.querySelectorAll('.hf-temp-row').forEach(r=>updateHoldingRow(r,pass));};
    refresh();
    bodyRoot.addEventListener('input',event=>{if(event.target.matches('.hf-current,.hf-reading,.hf-waste')){if(event.target.matches('.hf-current'))refresh();else updateHoldingRow(event.target.closest('.hf-temp-row'),pass);}});
    bodyRoot.addEventListener('change',event=>{if(event.target.matches('.hf-current,.hf-actual-time'))refresh();});
    bodyRoot.addEventListener('hf-refresh',event=>{const row=event.target.closest('.hf-temp-row');if(row)updateHoldingRow(row,pass);});
  }
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
