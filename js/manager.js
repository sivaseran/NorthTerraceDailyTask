import {getSession,clearSession,saveSession} from './auth.js';
import {
  SLOT_DEFS,todayISO,addDaysISO,formatLongDate,slotLabelForDate,slotCapacityMinutes,
  getUsers,getAssignableUsers,validateUserUniqueness,saveUser,createPerson,
  ensureTasksForDate,resetTasksForDate,watchTasksForDate,getTasksForDate,
  updateDailyTask,saveFutureRule,createTaskForDate,cancelTaskToday,stopTaskFuture,clearDailyTasksFrom,
  workloadBySlot,capacityForDraft,completeTask,saveUser as mergeUser
} from './store.js';
import {seedV2Template} from './seed.js';
import {initReports} from './reports.js';
import {
  escapeHtml,statusView,showToast,confirmAction,setButtonLoading,setInlineMessage,
  setFieldError,clearFieldError,initNetworkStatus,registerAppServiceWorker
} from './ui.js';

const $=s=>document.querySelector(s);
const user=getSession();
if(!user||user.role!=='manager') location.href='login.html';

let selectedDate=todayISO(),tasks=[],people=[],unsubscribe=null;
const personOptions=()=>`<option value="">Unassigned</option>`+people.map(p=>`<option value="${p.id}">${escapeHtml(p.name||p.id)}</option>`).join('');
const slotOptions=selected=>SLOT_DEFS.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${escapeHtml(slotLabelForDate(s.id,selectedDate))}</option>`).join('');
const effortText=v=>Number(v)>0?`${Number(v)} min`:'Not set';

function updateDateUI(){
  $('#managerDate').textContent=formatLongDate(selectedDate);
  $('#mgrNavDate').textContent=formatLongDate(selectedDate);
  $('#mgrDatePicker').value=selectedDate;
}
function draftFromRow(row){
  return {
    taskName:row.querySelector('.edit-task-name').value.trim(),
    slotId:row.querySelector('.edit-slot').value,
    effortMinutes:row.querySelector('.edit-effort').value.trim()?Number(row.querySelector('.edit-effort').value):null,
    assignedTo:row.querySelector('.edit-assignee').value,
    photoRequired:row.querySelector('.edit-photo').checked
  };
}
function slotCapacityHTML(slotId){
  const loads=workloadBySlot(tasks,selectedDate).filter(x=>x.slotId===slotId);
  if(!loads.length) return '<span class="capacity-empty">No effort values entered yet.</span>';
  return loads.map(x=>`<span class="capacity-chip ${x.effort>x.capacity?'over':''}">
    ${escapeHtml(x.assignedName)} · ${x.effort}m / ${x.capacity}m${x.missing?` · ${x.missing} unset`:''}
  </span>`).join('');
}

function taskEditor(t){
  const past=selectedDate<todayISO();
  return `<article class="manager-task-editor ${past?'read-only-editor':''}" data-id="${t.id}" data-template="${escapeHtml(t.templateTaskId||'')}">
    <div class="editor-grid">
      <div class="field editor-name"><label>Task</label><input class="edit-task-name" value="${escapeHtml(t.taskName||'')}" ${past?'disabled':''}></div>
      <div class="field"><label>Slot</label><select class="edit-slot" ${past?'disabled':''}>${slotOptions(t.slotId)}</select></div>
      <div class="field"><label>Task effort (min)</label><input class="edit-effort" type="number" min="1" step="5" placeholder="Optional" value="${Number(t.effortMinutes)>0?Number(t.effortMinutes):''}" ${past?'disabled':''}></div>
      <div class="field"><label>Assignee</label><select class="edit-assignee" ${past?'disabled':''}>${personOptions()}</select></div>
      <label class="check-field"><input class="edit-photo" type="checkbox" ${t.photoRequired?'checked':''} ${past?'disabled':''}> Photo required</label>
    </div>
    <div class="editor-meta">
      ${statusView(t.status)}
      ${t.legacyAssignee&&(!t.assignedTo)?`<span class="legacy-note">Source assignment: ${escapeHtml(t.legacyAssignee)}</span>`:''}
      ${t.completedByName?`<span>Completed by ${escapeHtml(t.completedByName)}</span>`:''}
    </div>
    ${past?'<div class="editor-actions"><span class="history-lock">🔒 Historical record — read only</span></div>':`<div class="editor-actions">
      <button class="btn small save-day" type="button">Save this date only</button>
      ${t.templateTaskId?`<button class="btn secondary small save-future" type="button">Every ${new Date(selectedDate+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'})} going forward</button>`:''}
      <button class="link-btn cancel-today" type="button">Cancel this date</button>
      ${t.templateTaskId?`<button class="link-btn stop-future" type="button">Stop future</button>`:''}
    </div>`}
    <div class="inline-message row-message" hidden></div>
  </article>`;
}
function newTaskEditor(slotId){
  return `<div class="new-task-editor" data-new-slot="${slotId}" hidden>
    <div class="editor-grid">
      <div class="field editor-name"><label>New task name</label><input class="new-task-name" placeholder="Task name"></div>
      <div class="field"><label>Slot</label><select class="new-slot">${slotOptions(slotId)}</select></div>
      <div class="field"><label>Task effort (min)</label><input class="new-effort" type="number" min="1" step="5" placeholder="Optional"></div>
      <div class="field"><label>Assignee</label><select class="new-assignee">${personOptions()}</select></div>
      <label class="check-field"><input class="new-photo" type="checkbox"> Photo required</label>
    </div>
    <div class="editor-actions"><button class="btn small create-day">Create this date only</button><button class="btn secondary small create-future">Every ${new Date(selectedDate+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'})} going forward</button><button class="link-btn close-new">Cancel</button></div>
    <div class="inline-message new-message" hidden></div>
  </div>`;
}

function renderSchedule(rows){
  tasks=rows;
  $('#managerSlots').innerHTML=SLOT_DEFS.map(slot=>{
    const a=rows.filter(t=>t.slotId===slot.id&&t.status!=='cancelled');
    return `<section class="manager-slot-card" data-slot="${slot.id}">
      <div class="manager-slot-head">
        <div><span class="slot-kicker">Fixed operational slot</span><h3>${escapeHtml(slotLabelForDate(slot.id,selectedDate))}</h3><p>${a.length} active task${a.length===1?'':'s'} · capacity check is advisory</p></div>
        ${selectedDate<todayISO()?'':`<button class="btn secondary small add-task" data-slot="${slot.id}">+ Add task</button>`}
      </div>
      <div class="capacity-strip">${slotCapacityHTML(slot.id)}</div>
      <div class="manager-task-list">${a.map(taskEditor).join('')||'<div class="slot-empty">No tasks in this slot.</div>'}</div>
      ${newTaskEditor(slot.id)}
    </section>`;
  }).join('');
  // Set assignee dropdowns after HTML is built.
  document.querySelectorAll('.manager-task-editor').forEach(row=>{
    const t=rows.find(x=>x.id===row.dataset.id);
    row.querySelector('.edit-assignee').value=t?.assignedTo||'';
  });
}

async function bindDate(){
  if(unsubscribe){unsubscribe();unsubscribe=null;}
  updateDateUI();
  $('#managerSlots').innerHTML='<div class="card"><div class="empty-state"><h3>Loading schedule…</h3></div></div>';
  if(selectedDate>=todayISO()) await ensureTasksForDate(selectedDate);
  unsubscribe=watchTasksForDate(selectedDate,renderSchedule,()=>showToast('Live manager schedule unavailable.','error'));
}
async function loadPeople(){
  people=await getAssignableUsers();
  const all=await getUsers();
  $('#peopleRows').innerHTML=all.sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''))).map(p=>`<tr>
    <td>${escapeHtml(p.name||p.id)}</td><td>${escapeHtml(p.role||'')}</td><td>${escapeHtml(p.staffId||'—')}</td><td>${p.pin?'••••':'—'}</td><td>${p.active!==false?'Active':'Inactive'}</td>
    <td><button class="link-btn edit-person" data-id="${p.id}">Edit</button></td></tr>`).join('');
  const opts=personOptions();
  $('#coverFrom').innerHTML=opts;$('#coverTo').innerHTML=opts;
  $('#coverSlot').innerHTML=SLOT_DEFS.map(s=>`<option value="${s.id}">${slotLabelForDate(s.id,selectedDate)}</option>`).join('');
}

async function maybeWarnCapacity(draft,excludeId=''){
  const cap=capacityForDraft(tasks,selectedDate,draft,excludeId);
  if(!cap||cap.overBy<=0) return true;
  return confirmAction({
    title:'Capacity warning',
    message:`This assignment would exceed the person’s available slot capacity by ${cap.overBy} minutes.`,
    details:`Allocated effort would become ${cap.effort} minutes in a ${cap.capacity}-minute slot.\nYou can save anyway, or cancel and change the assignee, slot or effort.`,
    confirmText:'Save Anyway'
  });
}
async function saveRow(row,scope){
  const t=tasks.find(x=>x.id===row.dataset.id); if(!t) return;
  const draft=draftFromRow(row);
  const msg=row.querySelector('.row-message');
  if(!draft.taskName){setInlineMessage(msg,'Task name is required.','error');return;}
  if(!await maybeWarnCapacity(draft,t.id)) return;
  const button=row.querySelector(scope==='day'?'.save-day':'.save-future');setButtonLoading(button,true,'Saving…');
  try{
    const assigned=people.find(p=>p.id===draft.assignedTo);
    if(scope==='day'){
      await updateDailyTask(t.id,{...draft,assignedName:assigned?.name||'Unassigned'},user);
    }else{
      await saveFutureRule(t.templateTaskId,selectedDate,draft,user);
      await updateDailyTask(t.id,{...draft,assignedName:assigned?.name||'Unassigned'},user);
    }
    setInlineMessage(msg,scope==='day'?'✓ Saved for this date only.':`✓ Saved for every ${new Date(selectedDate+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'})} from this date onward.`,'success');
    showToast('Schedule saved.','success');
  }catch(e){setInlineMessage(msg,e.message||'Could not save.','error');}
  finally{setButtonLoading(button,false);}
}
async function createFromBox(box,scope){
  const draft={
    taskName:box.querySelector('.new-task-name').value.trim(),
    slotId:box.querySelector('.new-slot').value,
    effortMinutes:box.querySelector('.new-effort').value?Number(box.querySelector('.new-effort').value):null,
    assignedTo:box.querySelector('.new-assignee').value,
    photoRequired:box.querySelector('.new-photo').checked
  };
  const msg=box.querySelector('.new-message');
  if(!draft.taskName){setInlineMessage(msg,'Task name is required.','error');return;}
  if(!await maybeWarnCapacity(draft,'')) return;
  const btn=box.querySelector(scope==='day'?'.create-day':'.create-future');setButtonLoading(btn,true,'Creating…');
  try{await createTaskForDate(selectedDate,draft,scope,user);setInlineMessage(msg,'✓ Task created.','success');showToast('Task created and published to the live schedule.','success');}
  catch(e){setInlineMessage(msg,e.message||'Could not create task.','error');}
  finally{setButtonLoading(btn,false);}
}

$('#managerSlots').addEventListener('change',e=>{
  if(e.target.classList.contains('edit-slot')){
    const row=e.target.closest('.manager-task-editor'),newSlot=e.target.value;
    const target=document.querySelector(`.manager-slot-card[data-slot="${newSlot}"] .manager-task-list`);
    if(target&&row.parentElement!==target){target.appendChild(row);showToast('Task moved on screen. Save to confirm the change.','info',{title:'Unsaved slot change'});}
  }
  if(e.target.classList.contains('new-slot')){
    const box=e.target.closest('.new-task-editor'); box.dataset.newSlot=e.target.value;
  }
});
$('#managerSlots').addEventListener('click',async e=>{
  const row=e.target.closest('.manager-task-editor'), box=e.target.closest('.new-task-editor');
  if(e.target.closest('.add-task')){
    const slot=e.target.closest('.add-task').dataset.slot;
    const n=document.querySelector(`.new-task-editor[data-new-slot="${slot}"]`);n.hidden=false;n.querySelector('.new-task-name').focus();return;
  }
  if(e.target.closest('.close-new')){box.hidden=true;return;}
  if(e.target.closest('.save-day')) return saveRow(row,'day');
  if(e.target.closest('.save-future')) return saveRow(row,'future');
  if(e.target.closest('.create-day')) return createFromBox(box,'day');
  if(e.target.closest('.create-future')) return createFromBox(box,'future');
  if(e.target.closest('.cancel-today')){
    const ok=await confirmAction({title:'Cancel task for this date?',message:'The task will remain in future recurring schedules.',confirmText:'Cancel This Date'});
    if(ok) await cancelTaskToday(row.dataset.id,user);return;
  }
  if(e.target.closest('.stop-future')){
    const t=tasks.find(x=>x.id===row.dataset.id);if(!t?.templateTaskId)return;
    const ok=await confirmAction({title:'Stop this recurring task?',message:`Stop it on every ${new Date(selectedDate+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'})} from this date onward?`,details:'Past dates remain unchanged.',confirmText:'Stop Future',danger:true});
    if(ok){await stopTaskFuture(t.templateTaskId,selectedDate,user);await cancelTaskToday(t.id,user);}return;
  }
});

$('#mgrPrevDate').onclick=()=>{selectedDate=addDaysISO(selectedDate,-1);bindDate();};
$('#mgrNextDate').onclick=()=>{selectedDate=addDaysISO(selectedDate,1);bindDate();};
$('#mgrToday').onclick=()=>{selectedDate=todayISO();bindDate();};
$('#mgrDatePicker').onchange=e=>{if(e.target.value){selectedDate=e.target.value;bindDate();}};

document.querySelectorAll('.manager-nav button').forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll('.manager-nav button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  document.querySelectorAll('.manager-section').forEach(s=>s.hidden=true);$('#'+btn.dataset.section).hidden=false;
  if(btn.dataset.section==='people') loadPeople();
});

function clearPerson(){
  $('#personEditId').value='';$('#personName').value='';$('#personRole').value='staff';$('#personStaffId').value='';$('#personPin').value='';$('#personPinConfirm').value='';$('#personActive').value='true';setInlineMessage($('#personResult'),'');
}
$('#clearPersonForm').onclick=clearPerson;
$('#peopleRows').addEventListener('click',async e=>{
  const b=e.target.closest('.edit-person');if(!b)return;
  const all=await getUsers(),p=all.find(x=>x.id===b.dataset.id);if(!p)return;
  $('#personEditId').value=p.id;$('#personName').value=p.name||'';$('#personRole').value=p.role||'assignee';$('#personStaffId').value=p.staffId||'';$('#personPin').value=p.pin||'';$('#personPinConfirm').value=p.pin||'';$('#personActive').value=String(p.active!==false);
  window.scrollTo({top:document.querySelector('#people').offsetTop-20,behavior:'smooth'});
});
$('#savePersonBtn').onclick=async()=>{
  const btn=$('#savePersonBtn'),id=$('#personEditId').value,name=$('#personName').value.trim(),role=$('#personRole').value,staffId=$('#personStaffId').value.trim(),pin=$('#personPin').value.trim(),confirm=$('#personPinConfirm').value.trim(),active=$('#personActive').value==='true';
  if(!name){setInlineMessage($('#personResult'),'Name is required.','error');return;}
  if(role==='staff'&&!/^\d{4}$/.test(pin)){setInlineMessage($('#personResult'),'Staff PIN must be exactly 4 digits.','error');return;}
  if(role==='assignee'&&pin&&!/^\d{4}$/.test(pin)){setInlineMessage($('#personResult'),'If an Assignee has a PIN, use exactly 4 digits.','error');return;}
  if(role==='manager'&&!/^\d{4,8}$/.test(pin)){setInlineMessage($('#personResult'),'Manager PIN must be 4–8 digits.','error');return;}
  if(pin!==confirm){setInlineMessage($('#personResult'),'PINs do not match.','error');return;}
  const unique=await validateUserUniqueness(id,{pin,staffId,role});if(!unique.ok){setInlineMessage($('#personResult'),unique.message,'error');return;}
  setButtonLoading(btn,true,'Saving…');
  try{
    const data={name,role,staffId:role==='staff'?staffId:'',pin,active,updatedAt:new Date().toISOString()};
    if(id) await saveUser(id,data); else await createPerson(data);
    clearPerson();setInlineMessage($('#personResult'),`✓ ${name} saved.`,'success');showToast(`${name} saved.`,'success',{title:'Person saved'});await loadPeople();await bindDate();
  }catch(e){setInlineMessage($('#personResult'),'Could not save person.','error');}
  finally{setButtonLoading(btn,false);}
};

$('#coverBtn').onclick=async()=>{
  if(selectedDate<todayISO()){setInlineMessage($('#coverResult'),'Historical dates are read only.','warning');return;}
  const from=$('#coverFrom').value,to=$('#coverTo').value,slot=$('#coverSlot').value;
  if(!from||!to||from===to){setInlineMessage($('#coverResult'),'Choose two different people.','error');return;}
  const affected=tasks.filter(t=>t.assignedTo===from&&t.slotId===slot&&t.status!=='cancelled');
  if(!affected.length){setInlineMessage($('#coverResult'),'No matching tasks in this slot.','warning');return;}
  const target=people.find(p=>p.id===to);
  const ok=await confirmAction({title:'Apply whole-slot cover?',message:`Move ${affected.length} task(s) to ${target?.name||'the covering person'} for ${slotLabelForDate(slot,selectedDate)} on ${formatLongDate(selectedDate)}?`,confirmText:'Apply Cover'});
  if(!ok)return;
  const btn=$('#coverBtn');setButtonLoading(btn,true,'Applying…');
  try{
    for(const t of affected) await updateDailyTask(t.id,{assignedTo:to,assignedName:target?.name||'Unassigned'},user);
    setInlineMessage($('#coverResult'),`✓ ${affected.length} task(s) moved for this date only.`,'success');
  }catch(e){setInlineMessage($('#coverResult'),'Could not apply cover.','error');}
  finally{setButtonLoading(btn,false);}
};

$('#changeManagerPinBtn').onclick=async()=>{
  const pin=$('#managerNewPin').value.trim(),confirm=$('#managerConfirmPin').value.trim(),btn=$('#changeManagerPinBtn');
  if(!/^\d{4,8}$/.test(pin)||pin!==confirm){setInlineMessage($('#managerPinResult'),'Enter matching 4–8 digit PINs.','error');return;}
  const unique=await validateUserUniqueness(user.id,{pin,staffId:'',role:'manager'});if(!unique.ok){setInlineMessage($('#managerPinResult'),unique.message,'error');return;}
  setButtonLoading(btn,true,'Changing…');try{await mergeUser(user.id,{pin});user.pin=pin;saveSession(user);setInlineMessage($('#managerPinResult'),'✓ Manager PIN changed.','success');}finally{setButtonLoading(btn,false);}
};

$('#seedBtn').onclick=async()=>{
  const ok=await confirmAction({title:'Upgrade schedule to V2?',message:'Replace the weekly template with the confirmed five-slot structure and rebuild today?',details:'Users/PINs and historical daily records are kept. Today’s current test records will be rebuilt.',confirmText:'Upgrade to V2'});
  if(!ok)return;
  const btn=$('#seedBtn');setButtonLoading(btn,true,'Upgrading…');
  try{const count=await seedV2Template();await clearDailyTasksFrom(todayISO());const today=await ensureTasksForDate(todayISO());setInlineMessage($('#seedResult'),`✓ V2 schedule loaded: ${count} master tasks. Today rebuilt with ${today.count} task records.`,'success');await loadPeople();selectedDate=todayISO();await bindDate();}
  catch(e){console.error(e);setInlineMessage($('#seedResult'),'Could not upgrade the schedule.','error');}
  finally{setButtonLoading(btn,false);}
};

$('#logout').onclick=()=>{clearSession();location.href='login.html';};

initReports({root:document.querySelector('#reports'),userProvider:()=>user});
initNetworkStatus();registerAppServiceWorker();
await loadPeople();await bindDate();
