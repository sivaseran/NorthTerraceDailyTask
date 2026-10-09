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
const issueBlock=()=>`<div class="compliance-issue" hidden><strong>Issue found</strong><p>Report the issue to management. Send photos directly to management, not through this app.</p><label class="form-check"><input type="checkbox" data-aware> <span>Management is aware</span></label></div>`;
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
    const rows=(cfg.tempPoints||[]).map(p=>`<div class="temp-entry" data-id="${esc(p.id)}" data-type="${esc(p.type)}" data-limit="${Number(p.limit)}"><label>${esc(p.name)} <small>Expected ≤ ${Number(p.limit)}°C</small><input type="number" step="0.1" data-reading required placeholder="°C"></label><div data-recheck hidden><label>Recheck temperature<input type="number" step="0.1" data-recheck-value placeholder="°C"></label><p class="warning-text">Outside expected range — recheck and report to management.</p><label class="form-check"><input type="checkbox" data-aware> <span>Management is aware</span></label></div></div>`).join('');
    const promise=openForm(task.taskName,`<p>Enter the actual temperatures for every unit.</p>${rows}`,async w=>{
      const temperatures=[];
      for(const r of w.querySelectorAll('.temp-entry')){
        const input=r.querySelector('[data-reading]');
        if(input.value.trim()===''||!Number.isFinite(Number(input.value)))throw new Error('Enter all temperature readings.');
        const reading=Number(input.value),bad=reading>Number(r.dataset.limit);let recheck=null;
        if(bad){const v=r.querySelector('[data-recheck-value]');
          if(v.value.trim()===''||!Number.isFinite(Number(v.value))||!r.querySelector('[data-aware]').checked)throw new Error('Enter the recheck temperature and confirm management is aware.');
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
  const list=task.complianceType==='daily'?cfg.dailyItems:task.complianceType==='weekly'?cfg.weeklyItems:task.complianceType==='sfbb_open'?cfg.sfbbOpening:cfg.sfbbClosing;
  if(!Array.isArray(list)||!list.length)throw new Error('The checklist is not configured. Ask the manager.');
  const sfbb=String(task.complianceType).startsWith('sfbb');
  if(sfbb){
    const body=`<p>Read every statement before confirming.</p><ul class="sfbb-review-list">${list.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><label class="sfbb-overall-label">Result<select class="sfbb-overall"><option value="ok">✓ Everything above is OK</option><option value="issue">⚠ Report an Issue</option></select></label>${issueBlock()}`;
    const result=openForm(task.taskName,body,async w=>{
      const status=w.querySelector('.sfbb-overall').value;
      if(status==='issue'&&!w.querySelector('[data-aware]').checked)throw new Error('Report the issue and confirm management is aware.');
      await store({checks:list.map(item=>({item,status,managementAware:status==='issue'})),overall:status});
    });
    const w=[...document.querySelectorAll('.compliance-modal-backdrop')].at(-1);
    w.querySelector('.sfbb-overall').onchange=e=>{w.querySelector('.compliance-issue').hidden=e.target.value!=='issue';};
    return result;
  }
  const body=`<p>Check each item and select OK or Issue.</p><div class="compliance-checklist">${list.map((x,i)=>`<div class="check-row" data-check="${i}"><span>${esc(x)}</span><select aria-label="${esc(x)} result"><option value="ok">✓ OK</option><option value="issue">⚠ Issue</option></select>${issueBlock()}</div>`).join('')}</div>`;
  const result=openForm(task.taskName,body,async w=>{
    const checks=[];
    for(const row of w.querySelectorAll('.check-row')){
      const status=row.querySelector('select').value;
      if(status==='issue'&&!row.querySelector('[data-aware]').checked)throw new Error('Confirm management is aware of every reported issue.');
      checks.push({item:list[Number(row.dataset.check)],status,managementAware:status==='issue'});
    }
    await store({checks});
  });
  const w=[...document.querySelectorAll('.compliance-modal-backdrop')].at(-1);
  w.querySelectorAll('.check-row select').forEach(select=>select.onchange=()=>{
    select.closest('.check-row').querySelector('.compliance-issue').hidden=select.value!=='issue';
  });
  return result;
}
