import {getComplianceConfig} from './special-tasks.js';
import {completeTask} from './store.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// PIN authenticates the actor in General View; this dialog owns the *entire*
// compliance submission. Cancellation never writes data or shows success.
function openForm(title,body,validateAndSave){
  return new Promise(resolve=>{
    const w=document.createElement('div');w.className='compliance-modal-backdrop';
    w.innerHTML=`<section class="compliance-modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2>${esc(title)}</h2>${body}<div class="inline-message error compliance-validation" data-error role="alert" hidden></div><div class="compliance-actions"><button type="button" class="btn secondary" data-cancel>Cancel</button><button type="button" class="btn" data-ok>Confirm & Complete</button></div></section>`;
    document.body.appendChild(w);
    const save=w.querySelector('[data-ok]');
    const err=w.querySelector('[data-error]');
    w.querySelector('[data-cancel]').onclick=()=>{if(!save.disabled){w.remove();resolve(false);}};
    save.onclick=async()=>{
      err.hidden=true;err.textContent='';save.disabled=true;save.textContent='Saving…';
      try{await validateAndSave(w);w.remove();resolve(true);}
      catch(error){err.textContent=error?.message||'Could not save. Correct the form and try again.';err.hidden=false;}
      finally{if(w.isConnected){save.disabled=false;save.textContent='Confirm & Complete';}}
    };
  });
}
const issueBlock=()=>`<div class="compliance-issue" hidden><strong>Issue detected</strong><p>Report through the official station WhatsApp channel (outside this app).</p><label class="form-check"><input type="checkbox" data-aware> <span>I have informed management via the official WhatsApp channel</span></label></div>`;
export async function completeComplianceTask(task,user){
  const cfg=await getComplianceConfig();
  const store=async result=>await completeTask(task.id,user,{}, {
    collection:'complianceRecords',id:task.id,
    data:{date:task.date,taskId:task.id,type:task.complianceType,taskName:task.taskName,
      assignedTo:task.assignedTo||'',assignedName:task.assignedName||'',
      completedByUserId:user.id,completedByName:user.name||'',result,
      completedAt:new Date(),updatedAt:new Date()}
  });
  if(task.complianceType==='temperature'){
    const rows=(cfg.tempPoints||[]).map(p=>`<div class="temp-entry" data-id="${esc(p.id)}" data-type="${esc(p.type)}" data-limit="${Number(p.limit)}"><label>${esc(p.name)} <small>Expected ≤ ${Number(p.limit)}°C</small><input type="number" step="0.1" data-reading required placeholder="°C"></label><div data-recheck hidden><label>Recheck temperature<input type="number" step="0.1" data-recheck-value placeholder="°C"></label><p class="warning-text">Outside expected range — recheck and report to management.</p><label class="form-check"><input type="checkbox" data-aware> <span>I have informed management via the official WhatsApp channel</span></label></div></div>`).join('');
    const promise=openForm(task.taskName,`<p>Enter the actual temperatures for every unit.</p>${rows}`,async w=>{
      const temperatures=[];
      for(const r of w.querySelectorAll('.temp-entry')){
        const input=r.querySelector('[data-reading]');
        if(input.value.trim()===''||!Number.isFinite(Number(input.value)))throw new Error('Enter all temperature readings.');
        const reading=Number(input.value),bad=reading>Number(r.dataset.limit);let recheck=null;
        if(bad){const v=r.querySelector('[data-recheck-value]');
          if(v.value.trim()===''||!Number.isFinite(Number(v.value))||!r.querySelector('[data-aware]').checked)throw new Error('Enter the recheck temperature and confirm management was informed via WhatsApp.');
          recheck=Number(v.value);
        }
        temperatures.push({id:r.dataset.id,reading,recheck,outOfRange:bad});
      }
      await store({temperatures});
    });
    const w=[...document.querySelectorAll('.compliance-modal-backdrop')].at(-1);
    w.querySelectorAll('[data-reading]').forEach(input=>input.oninput=()=>{
      const r=input.closest('.temp-entry'),bad=input.value.trim()!==''&&Number(input.value)>Number(r.dataset.limit);
      r.querySelector('[data-recheck]').hidden=!bad;
    });
    return promise;
  }
  const list=Array.isArray(task.checklistSnapshot)&&task.checklistSnapshot.length?task.checklistSnapshot:task.complianceType==='daily'?cfg.dailyItems:task.complianceType==='weekly'?cfg.weeklyItems:task.complianceType==='sfbb_open'?cfg.sfbbOpening:task.complianceType==='sfbb_close'?cfg.sfbbClosing:(cfg.customTasks||[]).find(x=>'custom_'+x.id===task.complianceRuleId)?.items||[];
  if(!Array.isArray(list)||!list.length)throw new Error('The checklist is not configured. Ask the manager.');
  // SFBB Opening and Closing use the same item-by-item response form as
  // all other checklists. No single overall shortcut for either form.
  const body=`<p>Check each item and select OK or Issue. <strong class="compliance-progress">0/${list.length} answered</strong></p><div class="compliance-checklist">${list.map((x,i)=>`<div class="check-row" data-check="${i}"><span>${esc(x)}</span><select aria-label="${esc(x)} result"><option value="">Select status…</option><option value="ok">✓ OK</option><option value="issue">⚠ Issue</option></select>${issueBlock()}</div>`).join('')}</div>`;
  const result=openForm(task.taskName,body,async w=>{
    const checks=[];
    for(const row of w.querySelectorAll('.check-row')){
      const status=row.querySelector('select').value;
      if(!status)throw new Error('Answer every checklist item before submitting.');
      if(status==='issue'&&!row.querySelector('[data-aware]').checked)throw new Error('Confirm each issue has been reported via the official WhatsApp channel.');
      checks.push({item:list[Number(row.dataset.check)],status,managementAware:status==='issue',reportedViaWhatsApp:status==='issue'});
    }
    await store({checks,checklistVersion:task.checklistVersion||task.updatedAt||null,overall:checks.some(c=>c.status==='issue')?'issue':'ok'});
  });
  const w=[...document.querySelectorAll('.compliance-modal-backdrop')].at(-1);
  w.querySelectorAll('.check-row select').forEach(select=>select.onchange=()=>{
    select.closest('.check-row').querySelector('.compliance-issue').hidden=select.value!=='issue';
    const answered=[...w.querySelectorAll('.check-row select')].filter(x=>x.value).length;
    w.querySelector('.compliance-progress').textContent=answered+'/'+list.length+' answered';
  });
  return result;
}
