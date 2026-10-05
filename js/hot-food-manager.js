import {getSession} from './auth.js';
import {escapeHtml,showToast,confirmAction,setButtonLoading} from './ui.js';
import {
  HOT_FOOD_DAYS,getHotFoodConfig,saveHotFoodConfig,setHotFoodEnabled,
  getHotFoodProducts,saveHotFoodProduct,setHotFoodProductActive,
  getInitialCookingPlan,saveInitialCookingPlan,ensureInitialCookingBaseline,getHotFoodAudit,getHotFoodComplianceData,getWeekSignoff,signOffHotFoodWeek,reopenHotFoodWeek,mondayOf,sundayOf,managerCorrectHotFoodRecord
} from './hot-food-store.js';

const $=s=>document.querySelector(s);
const user=getSession();
let config=null,products=[],plan={},dirtyPlan=false,initialised=false;

function moduleState(){
  const on=Boolean(config?.enabled);
  $('#hfStateBadge').textContent=on?'ENABLED':'DISABLED';
  $('#hfStateBadge').className=`hf-state-badge ${on?'enabled':'disabled'}`;
  $('#hfEnableToggle').checked=on;
  $('#hfDisabledNotice').hidden=on;
}

async function loadSettings(){
  config=await getHotFoodConfig(); moduleState();
  $('#hfCorePass').value=config.corePassC;
  $('#hfHoldingPass').value=config.holdingPassC;
  $('#hfEligibility').value=config.eligibilityMinutes;
  $('#hfCutoff').value=config.cookingCutoff;
  $('#hfHoldingMinutes').value=config.holdingMinutes;
}

async function loadProducts(){
  products=await getHotFoodProducts();
  $('#hfProductRows').innerHTML=products.length?products.map(p=>`<tr data-id="${p.id}"><td><input class="hf-product-name" value="${escapeHtml(p.name||'')}"></td><td>${p.active===false?'<span class="hf-pill muted">Inactive</span>':'<span class="hf-pill good">Active</span>'}</td><td class="hf-actions"><button class="btn secondary small hf-save-product">Save</button><button class="btn secondary small hf-toggle-product">${p.active===false?'Reactivate':'Deactivate'}</button></td></tr>`).join(''):'<tr><td colspan="3" class="muted">No Hot Food products yet. Add the first product below.</td></tr>';
}

function planCell(product,day){
  const value=Number(plan?.[product.id]?.[day]||0)||'';
  return `<td><input class="hf-plan-qty" data-product="${product.id}" data-day="${day}" type="number" min="0" step="1" value="${value}" placeholder="—"></td>`;
}
function renderPlan(){
  const active=products.filter(p=>p.active!==false);
  $('#hfPlanRows').innerHTML=active.length?active.map(p=>`<tr><th>${escapeHtml(p.name)}</th>${HOT_FOOD_DAYS.map(d=>planCell(p,d)).join('')}</tr>`).join(''):'<tr><td colspan="8" class="muted">Add active Hot Food products first.</td></tr>';
  $('#hfPlanDirty').hidden=!dirtyPlan;
}
async function loadPlan(){plan=await getInitialCookingPlan();dirtyPlan=false;renderPlan();}

async function loadAudit(){
  const staff=($('#hfAuditStaff')?.value||'').toLowerCase(),type=($('#hfAuditType')?.value||'').toLowerCase(),from=$('#hfAuditFrom')?.value||'',to=$('#hfAuditTo')?.value||''; const rows=(await getHotFoodAudit()).filter(r=>(!staff||String(r.actorName||'').toLowerCase().includes(staff))&&(!type||String(r.type||'').toLowerCase().includes(type))&&(!from||new Date(r.createdAtMs||0).toISOString().slice(0,10)>=from)&&(!to||new Date(r.createdAtMs||0).toISOString().slice(0,10)<=to)).slice(0,300);
  $('#hfAuditRows').innerHTML=rows.length?rows.map(r=>`<tr><td>${r.createdAtMs?new Date(r.createdAtMs).toLocaleString('en-GB'):'—'}</td><td>${escapeHtml(r.actorName||'System')}</td><td>${escapeHtml(String(r.type||'').replaceAll('_',' '))}</td><td><code>${escapeHtml(JSON.stringify(r.details||{}))}</code></td></tr>`).join(''):'<tr><td colspan="4" class="muted">No Hot Food audit events yet.</td></tr>';
}


const iso=d=>{const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
function reportHtml(data,start,end,signoffs=[]){
 const prod=data.batches.map(b=>`<tr><td>${escapeHtml(b.date)}</td><td></td><td>${escapeHtml(b.productName||'')}</td><td>${b.qtyCooked??''}</td><td>${escapeHtml(b.timeOutOven||'')}</td><td>${b.coreTempC??''}</td><td>${escapeHtml(b.createdByName||'')}</td><td>${escapeHtml(b.sellOutTime||'')}</td><td>${b.quantityWasted||0}</td><td><button class="btn secondary small hf-correct-batch" data-id="${b.id}">Correct</button></td></tr>`).join('');
 const hold=data.checks.flatMap(c=>(c.readings||[]).map(r=>`<tr><td>${escapeHtml(c.date)}</td><td>${escapeHtml((c.scheduledTimes||[]).join(', '))}</td><td>${escapeHtml(c.actualReadingTime||'')}</td><td>${escapeHtml(r.productName||'')}</td><td>${r.qty??''}</td><td>${r.temperatureC??''}</td><td>${escapeHtml(c.performedByName||'')}</td><td>${r.failed?'FAIL / WASTED':((c.scheduledTimes||[]).some(t=>t<(c.actualReadingTime||''))?'Late':'Pass')}</td><td><button class="btn secondary small hf-correct-check" data-id="${c.id}" data-time="${escapeHtml(c.actualReadingTime||'')}">Correct time</button></td></tr>`)).join('');
 const allSigned=signoffs.length&&signoffs.every(x=>x.status==='signed');const draft=allSigned?'SIGNED PERIOD':'DRAFT — ONE OR MORE WEEKS NOT YET SIGNED OFF';
 const signBlock=signoffs.length?`<h3>Weekly Sign-off</h3><div class="hf-signoff-report">${signoffs.map(x=>`<p><b>${escapeHtml(x.weekStart)} — ${escapeHtml(x.weekEnd)}</b>: ${x.status==='signed'?`SIGNED — ${escapeHtml(x.signedByName||'Manager')} · ${x.signedAtMs?new Date(x.signedAtMs).toLocaleString('en-GB'):''}${x.comment?` · ${escapeHtml(x.comment)}`:''}`:'DRAFT — NOT YET SIGNED OFF'}</p>`).join('')}</div>`:'';
 return `<div class="hf-paper"><header><h2>NORTH TERRACE SERVICE STATION</h2><h3>CountryChoice — Hot Food Temperature & Production Control Sheet</h3><p>${escapeHtml(start)} to ${escapeHtml(end)} · <b>${draft}</b></p></header><h3>Production Control</h3><div class="table-wrap"><table><thead><tr><th>Date</th><th>Component Product</th><th>Final Product</th><th>Qty</th><th>Time Out Oven</th><th>Core Temp °C</th><th>Staff Name</th><th>Sell Out Time</th><th>Qty Wasted</th><th></th></tr></thead><tbody>${prod||'<tr><td colspan="10">No production records</td></tr>'}</tbody></table></div><h3>Hot Holding Temperature Log</h3><div class="table-wrap"><table><thead><tr><th>Date</th><th>Scheduled</th><th>Actual</th><th>Product</th><th>Current Qty</th><th>Lowest °C</th><th>Staff</th><th>Status</th><th></th></tr></thead><tbody>${hold||'<tr><td colspan="9">No holding records</td></tr>'}</tbody></table></div>${data.exceptions.length?`<h3>Exceptions</h3><ul>${data.exceptions.map(x=>`<li>${escapeHtml(x.date)} — ${escapeHtml(x.description)}</li>`).join('')}</ul>`:''}${signBlock}</div>`;
}
async function loadReport(){const a=$('#hfReportFrom')?.value,b=$('#hfReportTo')?.value;if(!a||!b)return;if(a>b){showToast('From date must be before To date.','warning');return;}const data=await getHotFoodComplianceData(a,b);const signoffs=[];let w=mondayOf(a);while(w<=b){signoffs.push(await getWeekSignoff(w));const d=new Date(w+'T12:00:00');d.setDate(d.getDate()+7);w=iso(d);}$('#hfReportStatus').innerHTML=`<b>${data.batches.length}</b> production rows · <b>${data.checks.length}</b> reading event(s) · <b>${data.exceptions.length}</b> exception(s) · <b>${signoffs.filter(x=>x.status==='signed').length}/${signoffs.length}</b> week(s) signed`;$('#hfReportPreview').innerHTML=reportHtml(data,a,b,signoffs);}
async function loadSignoff(){const d=$('#hfSignoffDate')?.value;if(!d)return;const s=await getWeekSignoff(d),data=await getHotFoodComplianceData(s.weekStart,s.weekEnd);$('#hfSignoffSummary').innerHTML=`<div class="hf-sign-card"><b>${s.weekStart} — ${s.weekEnd}</b><span class="hf-pill ${s.status==='signed'?'good':'muted'}">${s.status==='signed'?'SIGNED':'DRAFT'}</span><p>${data.batches.length} production row(s) · ${data.checks.length} reading event(s) · <b>${data.exceptions.length} exception(s)</b></p>${s.status==='signed'?`<p>Signed by ${escapeHtml(s.signedByName||'Manager')} ${s.signedAtMs?new Date(s.signedAtMs).toLocaleString('en-GB'):''}</p>`:''}</div>`;$('#hfSignWeek').disabled=s.status==='signed';$('#hfReopenWeek').disabled=s.status!=='signed';if(s.comment)$('#hfSignoffComment').value=s.comment;}

export async function initHotFoodManager(){
  if(!$('#hotfood')) return;
  await ensureInitialCookingBaseline(user);
  if(initialised){await Promise.all([loadSettings(),loadProducts()]);await loadPlan();return;}
  initialised=true;
  await Promise.all([loadSettings(),loadProducts()]);
  await loadPlan();

  document.querySelectorAll('.hf-subnav button').forEach(btn=>btn.onclick=async()=>{
    document.querySelectorAll('.hf-subnav button').forEach(b=>b.classList.toggle('active',b===btn));
    document.querySelectorAll('.hf-panel').forEach(p=>p.hidden=p.dataset.hfPanel!==btn.dataset.hfTarget);
    if(btn.dataset.hfTarget==='audit') await loadAudit(); if(btn.dataset.hfTarget==='reports') await loadReport(); if(btn.dataset.hfTarget==='signoff') await loadSignoff();
  });

  $('#hfEnableToggle').onchange=async e=>{
    const desired=e.target.checked;
    if(desired){
      const ok=await confirmAction({title:'Enable Hot Food & Compliance?',message:'This will make the Hot Food module available. Existing North Terrace features remain unchanged.',confirmText:'Enable Hot Food'});
      if(!ok){e.target.checked=false;return;}
    }
    e.target.disabled=true;
    try{
      const result=await setHotFoodEnabled(desired,user);
      if(!result.ok){
        e.target.checked=true;
        showToast(`Cannot disable yet: ${result.activeBatches} active batch(es) and ${result.outstandingTasks} outstanding Hot Food task(s).`,'warning');
      }else{
        config={...config,enabled:desired}; moduleState();
        showToast(`Hot Food module ${desired?'enabled':'disabled'}.`,'success');
      }
    }catch(err){e.target.checked=!desired;showToast(err.message||'Could not change module state.','error');}
    finally{e.target.disabled=false;}
  };

  $('#hfSaveSettings').onclick=async e=>{
    const btn=e.currentTarget;setButtonLoading(btn,true);
    try{
      const changes={corePassC:Number($('#hfCorePass').value),holdingPassC:Number($('#hfHoldingPass').value),eligibilityMinutes:Number($('#hfEligibility').value),cookingCutoff:$('#hfCutoff').value,holdingMinutes:Number($('#hfHoldingMinutes').value)};
      if(!(changes.corePassC>0&&changes.holdingPassC>0&&changes.eligibilityMinutes>=0&&changes.holdingMinutes>0&&changes.cookingCutoff)) throw new Error('Check all Hot Food settings.');
      config=await saveHotFoodConfig(changes,user);showToast('Hot Food settings saved.','success');
    }catch(err){showToast(err.message||'Could not save settings.','error');}finally{setButtonLoading(btn,false);}
  };

  $('#hfAddProduct').onclick=async()=>{
    const name=$('#hfNewProduct').value.trim();if(!name){showToast('Enter a product name.','warning');return;}
    try{await saveHotFoodProduct({name,active:true},user);$('#hfNewProduct').value='';await loadProducts();renderPlan();showToast('Hot Food product added.','success');}catch(err){showToast(err.message||'Could not add product.','error');}
  };
  $('#hfProductRows').onclick=async e=>{
    const row=e.target.closest('tr[data-id]');if(!row)return;
    const item=products.find(p=>p.id===row.dataset.id);if(!item)return;
    try{
      if(e.target.closest('.hf-save-product')) await saveHotFoodProduct({id:item.id,name:row.querySelector('.hf-product-name').value,active:item.active!==false},user);
      if(e.target.closest('.hf-toggle-product')) await setHotFoodProductActive(item.id,item.active===false,user);
      await loadProducts();renderPlan();showToast('Product updated.','success');
    }catch(err){showToast(err.message||'Could not update product.','error');}
  };

  $('#hfPlanRows').oninput=e=>{if(e.target.classList.contains('hf-plan-qty')){dirtyPlan=true;$('#hfPlanDirty').hidden=false;}};
  $('#hfSavePlan').onclick=async e=>{
    const next={};document.querySelectorAll('.hf-plan-qty').forEach(input=>{const n=Math.max(0,Math.floor(Number(input.value)||0));if(n){next[input.dataset.product]??={};next[input.dataset.product][input.dataset.day]=n;}});
    const btn=e.currentTarget;setButtonLoading(btn,true);
    try{await saveInitialCookingPlan(next,user);plan=next;dirtyPlan=false;renderPlan();showToast('Initial Cooking Plan saved.','success');}catch(err){showToast(err.message||'Could not save plan.','error');}finally{setButtonLoading(btn,false);}
  };

  const today=iso(new Date()); if($('#hfReportFrom')){$('#hfReportFrom').value=today;$('#hfReportTo').value=today;$('#hfSignoffDate').value=today;}
  $('#hfReportPreview')?.addEventListener('click',async e=>{try{const b=e.target.closest('.hf-correct-batch');if(b){const row=(await getHotFoodComplianceData($('#hfReportFrom').value,$('#hfReportTo').value)).batches.find(x=>x.id===b.dataset.id);if(!row)return;const core=prompt('Correct core temperature °C',row.coreTempC??'');if(core===null)return;const sell=prompt('Correct Sell Out Time (HH:MM, blank if not sold out)',row.sellOutTime||'');if(sell===null)return;const waste=prompt('Correct Quantity Wasted',row.quantityWasted||0);if(waste===null)return;await managerCorrectHotFoodRecord('batch',row.id,{coreTempC:Number(core),sellOutTime:sell,quantityWasted:Number(waste)},user);showToast('Production record corrected; original values retained in audit.','success');await loadReport();return;}const c=e.target.closest('.hf-correct-check');if(c){const t=prompt('Correct actual reading time (HH:MM)',c.dataset.time||'');if(t===null||!t)return;await managerCorrectHotFoodRecord('check',c.dataset.id,{actualReadingTime:t},user);showToast('Reading time corrected; original value retained in audit.','success');await loadReport();}}catch(err){showToast(err.message||'Could not correct record.','error')}});
  $('#hfReportFrom')?.addEventListener('change',loadReport);$('#hfReportTo')?.addEventListener('change',loadReport);
  $('#hfReportToday')?.addEventListener('click',()=>{$('#hfReportFrom').value=today;$('#hfReportTo').value=today;loadReport()});
  $('#hfReportWeek')?.addEventListener('click',()=>{$('#hfReportFrom').value=mondayOf(today);$('#hfReportTo').value=sundayOf(today);loadReport()});
  $('#hfPrintReport')?.addEventListener('click',()=>{const html=$('#hfReportPreview').innerHTML;if(!html){showToast('Load a report first.','warning');return;}const w=window.open('','_blank');w.document.write(`<html><head><title>Hot Food Compliance Report</title><style>body{font-family:Arial;padding:18px;color:#111}h2,h3{text-align:center}table{border-collapse:collapse;width:100%;font-size:11px;margin:12px 0 24px}th,td{border:1px solid #555;padding:5px}th{background:#eee}@media print{button{display:none}}</style></head><body>${html}<script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();});
  $('#hfSignoffDate')?.addEventListener('change',loadSignoff);
  $('#hfSignWeek')?.addEventListener('click',async()=>{try{const ok=await confirmAction({title:'Sign off this compliance week?',message:'Staff editing for this Monday-Sunday week will be locked.',confirmText:'Sign Off Week'});if(!ok)return;await signOffHotFoodWeek($('#hfSignoffDate').value,$('#hfSignoffComment').value,user);showToast('Compliance week signed off.','success');await loadSignoff();}catch(e){showToast(e.message||'Could not sign off week.','error')}});
  $('#hfReopenWeek')?.addEventListener('click',async()=>{try{const ok=await confirmAction({title:'Reopen this compliance week?',message:'The week will return to Draft and can be corrected before re-signing.',confirmText:'Reopen Week'});if(!ok)return;await reopenHotFoodWeek($('#hfSignoffDate').value,user);showToast('Compliance week reopened.','success');await loadSignoff();}catch(e){showToast(e.message||'Could not reopen week.','error')}});
  ['hfAuditStaff','hfAuditType','hfAuditFrom','hfAuditTo'].forEach(id=>$('#'+id)?.addEventListener('input',loadAudit));

  window.addEventListener('beforeunload',e=>{if(dirtyPlan){e.preventDefault();e.returnValue='';}});
}
