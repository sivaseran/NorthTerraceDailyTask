import {getSession,clearSession} from './auth.js';
import {
  SLOT_DEFS,todayISO,addDaysISO,formatLongDate,slotLabelForDate,slotCapacityMinutes,
  getUsers,getAssignableUsers,getSystemState,getWeeklyTemplate,bulkUpdateWeeklyTemplateRows,validateUserUniqueness,saveUser,createPerson,
  ensureTasksForDate,resetTasksForDate,watchTasksForDate,getTasksForDate,
  updateDailyTask,saveFutureRule,createTaskForDate,cancelTaskToday,stopTaskFuture,saveFutureShiftCover,
  workloadBySlot,capacityForDraft,completeTask
} from './store.js';
import {initializeV22,migrateParthToParthy} from './seed.js';
import {initReports} from './reports.js';
import {
  escapeHtml,statusView,showToast,confirmAction,setButtonLoading,setInlineMessage,
  setFieldError,clearFieldError,initNetworkStatus,registerAppServiceWorker
} from './ui.js';

const $=s=>document.querySelector(s);
const user=getSession();
if(!user||user.role!=='manager') location.href='login.html';

let selectedDate=todayISO(),tasks=[],people=[],unsubscribe=null;
let coverDate=todayISO(),coverTasks=[];
let advancedEditAll=false;
let bulkDate=todayISO();
let bulkRowsData=[];
let bulkDirty=new Map();
const isHistoricalDate=()=>selectedDate<todayISO();
const personOptions=()=>`<option value="">Unassigned</option>`+people.map(p=>`<option value="${p.id}">${escapeHtml(p.name||p.id)}</option>`).join('');
const slotOptions=selected=>SLOT_DEFS.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${escapeHtml(slotLabelForDate(s.id,selectedDate))}</option>`).join('');
const effortText=v=>Number(v)>0?`${Number(v)} min`:'Not set';

function updateDateUI(){
  $('#managerDate').textContent=formatLongDate(selectedDate);
  $('#mgrNavDate').textContent=formatLongDate(selectedDate);
  $('#mgrDatePicker').value=selectedDate;

  const historical=isHistoricalDate();
  $('#historicalReadOnlyBanner').hidden=!historical;
  $('#toggleAdvancedEdit').hidden=historical;
  $('#scheduleModeHelp').textContent=historical
    ?'Historical task records are shown exactly for review; editing is disabled.'
    :'Compact by default. Edit one task at a time.';

  if(historical){
    advancedEditAll=false;
    $('#toggleAdvancedEdit').textContent='▾ Advanced: Edit all tasks';
  }
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
  if(!loads.length){
    return '<span class="capacity-empty">Capacity: effort not entered</span>';
  }
  return loads.map(x=>`<span class="capacity-chip ${x.effort>x.capacity?'over':''}">
    <strong>${escapeHtml(x.assignedName)}</strong>
    <span>${x.effort} / ${x.capacity} min</span>
    ${x.missing?`<em>${x.missing} unset</em>`:''}
  </span>`).join('');
}

function taskEditor(t){
  const assignee=t.assignedName||'Unassigned';
  const unassigned=!t.assignedTo;
  const effort=Number(t.effortMinutes)>0?`${Number(t.effortMinutes)} min`:'—';
  const historical=isHistoricalDate();

  return `<article class="manager-task-editor compact-editor ${historical?'historical-task-row':''}" data-id="${t.id}" data-template="${escapeHtml(t.templateTaskId||'')}">
    <div class="compact-task-view dense-task-row">
      <div class="dense-task-main">
        <strong class="dense-task-title">${escapeHtml(t.taskName||'Untitled task')}</strong>
        <div class="dense-task-badges">
          ${t.photoRequired?'<span class="mini-pill photo-pill">📷 Photo</span>':''}
          ${t.recurring?'<span class="mini-pill recurring-pill">↻ Recurring</span>':''}
        </div>
      </div>

      <div class="dense-task-assignee">
        <span class="mobile-field-label">Assignee</span>
        <span class="assignee-value ${unassigned?'unassigned-value':''}">${escapeHtml(assignee)}</span>
      </div>

      <div class="dense-task-effort">
        <span class="mobile-field-label">Effort</span>
        <span class="${Number(t.effortMinutes)>0?'':'effort-unset'}">${effort}</span>
      </div>

      <div class="dense-task-status">
        <span class="mobile-field-label">Status</span>
        ${statusView(t.status)}
      </div>

      <div class="dense-task-action">
        ${historical
          ?'<span class="historical-view-badge">View only</span>'
          :'<button class="btn secondary small open-row-edit" type="button">Edit</button>'}
      </div>
    </div>

    ${historical?'':`
    <div class="row-edit-panel" hidden>
      ${t.legacyAssignee&&(!t.assignedTo)?`<div class="legacy-editor-note">Original source assignment: ${escapeHtml(t.legacyAssignee)}</div>`:''}
      <div class="editor-grid">
        <div class="field editor-name"><label>Task</label><input class="edit-task-name" value="${escapeHtml(t.taskName||'')}"></div>
        <div class="field"><label>Slot</label><select class="edit-slot">${slotOptions(t.slotId)}</select></div>
        <div class="field"><label>Task effort (min)</label><input class="edit-effort" type="number" min="1" step="5" placeholder="Optional" value="${Number(t.effortMinutes)>0?Number(t.effortMinutes):''}"></div>
        <div class="field"><label>Assignee</label><select class="edit-assignee">${personOptions()}</select></div>
        <label class="check-field"><input class="edit-photo" type="checkbox" ${t.photoRequired?'checked':''}> Photo required</label>
      </div>
      <div class="editor-actions">
        <button class="btn small save-day" type="button">Save this date only</button>
        ${t.templateTaskId?`<button class="btn secondary small save-future" type="button">Every ${new Date(selectedDate+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'})} going forward</button>`:''}
        <button class="link-btn close-row-edit" type="button">Close</button>
        <button class="link-btn cancel-today" type="button">Skip This Date</button>
        ${t.templateTaskId?`<button class="link-btn stop-future" type="button">Remove This Task Completely</button>`:''}
      </div>
      <div class="inline-message row-message" hidden></div>
    </div>`}
  </article>`;
}
function newTaskEditor(slotId){
  if(isHistoricalDate()) return '';
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
    return `<section class="manager-slot-card dense-slot-card" data-slot="${slot.id}">
      <div class="manager-slot-head dense-slot-head">
        <div class="dense-slot-primary">
          <span class="slot-kicker">Fixed operational slot</span>
          <div class="dense-slot-title-line">
            <h3>${escapeHtml(slotLabelForDate(slot.id,selectedDate))}</h3>
            <span class="dense-task-count">${a.length} task${a.length===1?'':'s'}</span>
          </div>
        </div>

        <div class="dense-slot-capacity">
          ${slotCapacityHTML(slot.id)}
        </div>

        <div class="dense-slot-add">
          ${isHistoricalDate()?'':`<button class="btn secondary small add-task" data-slot="${slot.id}">+ Add task</button>`}
        </div>
      </div>

      <div class="desktop-task-columns" aria-hidden="true">
        <span>Task</span>
        <span>Assignee</span>
        <span>Effort</span>
        <span>Status</span>
        <span></span>
      </div>

      <div class="manager-task-list">${a.map(taskEditor).join('')||'<div class="slot-empty">No tasks in this slot.</div>'}</div>
      ${newTaskEditor(slot.id)}
    </section>`;
  }).join('');

  document.querySelectorAll('.manager-task-editor').forEach(row=>{
    const panel=row.querySelector('.row-edit-panel');
    if(panel) panel.hidden=!advancedEditAll;
  });

  // Set assignee dropdowns after HTML is built.
  document.querySelectorAll('.manager-task-editor').forEach(row=>{
    const select=row.querySelector('.edit-assignee');
    if(!select) return;
    const t=rows.find(x=>x.id===row.dataset.id);
    select.value=t?.assignedTo||'';
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
  const visible=all.filter(p=>p.active!==false || ['manager1','staff1','staff2','staff3','staff4','staff5','staff6','staff7','staff8','staff9'].includes(p.id));
  visible.sort((a,b)=>{
    if(a.role==='manager'&&b.role!=='manager') return -1;
    if(b.role==='manager'&&a.role!=='manager') return 1;
    const ai=Number(a.staffId)||999, bi=Number(b.staffId)||999;
    return ai-bi || String(a.name||'').localeCompare(String(b.name||''));
  });
  $('#peopleRows').innerHTML=visible.map(p=>`<tr>
    <td>${p.role==='manager'?'Manager':escapeHtml(p.staffId||'—')}</td>
    <td><strong>${escapeHtml(p.name||p.id)}</strong></td>
    <td><span class="pin-display">${escapeHtml(p.pin||'—')}</span></td>
    <td>${escapeHtml(p.role||'')}</td>
    <td><span class="status-dot ${p.active!==false?'active':'inactive'}"></span>${p.active!==false?'Active':'Inactive'}</td>
    <td><button class="btn secondary small edit-person" data-id="${p.id}">Edit</button></td>
  </tr>`).join('');
  const coverPeople=people.map(p=>`<option value="${p.id}">${escapeHtml(p.name||p.id)}</option>`).join('');
  const currentFrom=$('#coverFrom')?.value||'';
  const currentTo=$('#coverTo')?.value||'';
  if($('#coverFrom')) $('#coverFrom').innerHTML=`<option value="">Select person off</option>${coverPeople}`;
  if($('#coverTo')) $('#coverTo').innerHTML=`<option value="">Select covering person</option>${coverPeople}`;
  if($('#coverFrom')&&people.some(p=>p.id===currentFrom)) $('#coverFrom').value=currentFrom;
  if($('#coverTo')&&people.some(p=>p.id===currentTo)) $('#coverTo').value=currentTo;
  if($('#coverSlot')) $('#coverSlot').innerHTML=SLOT_DEFS.map(s=>`<option value="${s.id}">${slotLabelForDate(s.id,coverDate)}</option>`).join('');
}


function coverWeekdayLong(){
  return new Date(coverDate+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'});
}

function updateCoverDateUI(){
  $('#coverDateHeading').textContent=formatLongDate(coverDate);
  $('#coverNavDate').textContent=formatLongDate(coverDate);
  $('#coverDatePicker').value=coverDate;
  $('#coverSlot').innerHTML=SLOT_DEFS.map(s=>`<option value="${s.id}">${slotLabelForDate(s.id,coverDate)}</option>`).join('');

  const weekday=coverWeekdayLong();
  $('#coverFutureBtn').textContent=`Every ${weekday} From This Date Onward`;
  $('#coverFutureHelpTitle').textContent=`Every ${weekday} going forward`;
  $('#coverFutureHelpText').textContent=`Makes this cover arrangement permanent for every ${weekday} from ${formatLongDate(coverDate)} onward. Previous dates remain unchanged.`;

  const historical=coverDate<todayISO();
  $('#coverDayBtn').disabled=historical;
  $('#coverFutureBtn').disabled=historical;
}

function currentCoverAffected(){
  const from=$('#coverFrom').value;
  const slot=$('#coverSlot').value;
  if(!from||!slot) return [];
  return coverTasks.filter(t=>
    t.assignedTo===from &&
    t.slotId===slot &&
    t.status!=='cancelled' &&
    t.status!=='completed'
  );
}

function renderCoverPreview(){
  const rows=currentCoverAffected();
  const targetId=$('#coverTo').value;
  const target=people.find(p=>p.id===targetId);
  const slot=$('#coverSlot').value;
  const source=people.find(p=>p.id===$('#coverFrom').value);

  $('#coverAffectedCount').textContent=`${rows.length} task${rows.length===1?'':'s'}`;

  if(!$('#coverFrom').value){
    $('#coverPreviewRows').innerHTML='<div class="cover-preview-empty">Select the person who is off to preview their tasks.</div>';
  }else if(!rows.length){
    $('#coverPreviewRows').innerHTML='<div class="cover-preview-empty">No incomplete matching tasks for this person and slot on the selected date.</div>';
  }else{
    $('#coverPreviewRows').innerHTML=rows.map(t=>`<div class="cover-preview-row">
      <div><strong>${escapeHtml(t.taskName||'Untitled task')}</strong>${t.photoRequired?'<span class="mini-pill photo-pill">📷 Photo</span>':''}</div>
      <div>${escapeHtml(t.assignedName||source?.name||'Unassigned')}</div>
      <div>${Number(t.effortMinutes)>0?`${Number(t.effortMinutes)} min`:'—'}</div>
      <div>${statusView(t.status)}</div>
    </div>`).join('');
  }

  if(!slot||!targetId){
    $('#coverCapacityNote').innerHTML='<span class="muted">Select a covering person to check the known workload for this slot.</span>';
    return;
  }

  const knownAffected=rows.reduce((s,t)=>s+(Number(t.effortMinutes)||0),0);
  const existing=coverTasks
    .filter(t=>t.assignedTo===targetId&&t.slotId===slot&&t.status!=='cancelled')
    .reduce((s,t)=>s+(Number(t.effortMinutes)||0),0);
  const unset=rows.filter(t=>!Number(t.effortMinutes)).length;
  const capacity=slotCapacityMinutes(slot,coverDate);
  const total=existing+knownAffected;
  const over=Math.max(0,total-capacity);

  $('#coverCapacityNote').innerHTML=over
    ? `<strong class="cover-capacity-over">Capacity warning:</strong> ${escapeHtml(target?.name||'Covering person')} would have <b>${total} / ${capacity} min</b> known effort in this slot (${over} min over).${unset?` ${unset} moved task(s) also have no effort set.`:''}`
    : `<strong>${escapeHtml(target?.name||'Covering person')}</strong>: ${total} / ${capacity} min known effort after cover.${unset?` ${unset} moved task(s) have no effort set and are not included in the total.`:''}`;
}

async function loadCoverDate(){
  updateCoverDateUI();
  $('#coverPreviewRows').innerHTML='<div class="cover-preview-empty">Loading selected date…</div>';

  if(coverDate>=todayISO()) await ensureTasksForDate(coverDate);
  coverTasks=await getTasksForDate(coverDate);

  // Keep the selected slot if possible when date changes.
  const oldSlot=$('#coverSlot').value||'S1';
  $('#coverSlot').innerHTML=SLOT_DEFS.map(s=>`<option value="${s.id}">${slotLabelForDate(s.id,coverDate)}</option>`).join('');
  if(SLOT_DEFS.some(s=>s.id===oldSlot)) $('#coverSlot').value=oldSlot;

  renderCoverPreview();

  if(coverDate<todayISO()){
    setInlineMessage($('#coverResult'),'Historical dates are read only. Choose today or a future date to apply cover.','warning');
  }else{
    setInlineMessage($('#coverResult'),'');
  }
}

async function confirmCoverCapacity(){
  const rows=currentCoverAffected();
  const targetId=$('#coverTo').value;
  const slot=$('#coverSlot').value;
  if(!rows.length||!targetId||!slot) return true;

  const target=people.find(p=>p.id===targetId);
  const knownAffected=rows.reduce((s,t)=>s+(Number(t.effortMinutes)||0),0);
  const existing=coverTasks
    .filter(t=>t.assignedTo===targetId&&t.slotId===slot&&t.status!=='cancelled')
    .reduce((s,t)=>s+(Number(t.effortMinutes)||0),0);
  const capacity=slotCapacityMinutes(slot,coverDate);
  const total=existing+knownAffected;
  if(total<=capacity) return true;

  return confirmAction({
    title:'Capacity warning',
    message:`${target?.name||'The covering person'} would have ${total} minutes of known effort in a ${capacity}-minute slot.`,
    details:`This is ${total-capacity} minutes over the slot capacity. Tasks without an effort value are not included. You can still save the cover if operationally appropriate.`,
    confirmText:'Apply Anyway'
  });
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
  if(isHistoricalDate()){
    showToast('Historical dates are read only.','warning',{title:'No changes made'});
    return;
  }
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
  if(isHistoricalDate()){
    showToast('Historical dates are read only.','warning',{title:'No changes made'});
    return;
  }
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

$('#toggleAdvancedEdit').onclick=()=>{
  if(isHistoricalDate()){
    showToast('Historical dates are read only.','warning',{title:'No changes made'});
    return;
  }
  advancedEditAll=!advancedEditAll;
  $('#toggleAdvancedEdit').textContent=advancedEditAll?'▴ Advanced: Collapse all':'▾ Advanced: Edit all tasks';
  document.querySelectorAll('.row-edit-panel').forEach(p=>p.hidden=!advancedEditAll);
};

$('#managerSlots').addEventListener('change',e=>{
  if(isHistoricalDate()){
    showToast('Historical schedules are view only.','warning',{title:'Read-only history'});
    renderSchedule(tasks);
    return;
  }
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
  const mutatingTarget=e.target.closest('.open-row-edit,.add-task,.save-day,.save-future,.create-day,.create-future,.cancel-today,.stop-future');
  if(isHistoricalDate()&&mutatingTarget){
    showToast('Historical schedules are view only. Choose today or a future date to make changes.','warning',{title:'Read-only history'});
    return;
  }

  if(e.target.closest('.open-row-edit')){
    if(!advancedEditAll) document.querySelectorAll('.row-edit-panel').forEach(p=>p.hidden=true);
    const row=e.target.closest('.manager-task-editor');
    row.querySelector('.row-edit-panel').hidden=false;
    return;
  }
  if(e.target.closest('.close-row-edit')){
    const row=e.target.closest('.manager-task-editor');
    row.querySelector('.row-edit-panel').hidden=true;
    return;
  }
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
    if(isHistoricalDate()){showToast('Historical dates are read only.','warning');return;}
    const ok=await confirmAction({title:'Skip this date only?',message:'This task will be skipped only on the selected date. Future recurring dates remain unchanged.',confirmText:'Skip This Date'});
    if(ok) await cancelTaskToday(row.dataset.id,user);return;
  }
  if(e.target.closest('.stop-future')){
    if(isHistoricalDate()){showToast('Historical dates are read only.','warning');return;}
    const t=tasks.find(x=>x.id===row.dataset.id);if(!t?.templateTaskId)return;
    const ok=await confirmAction({title:'Remove this task completely?',message:`Remove this task from the selected date and all future ${new Date(selectedDate+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'})} occurrences?`,details:'Previous dates remain unchanged.',confirmText:'Remove Completely',danger:true});
    if(ok){await stopTaskFuture(t.templateTaskId,selectedDate,user);await cancelTaskToday(t.id,user);}return;
  }
});

$('#historicalGoToday').onclick=()=>{selectedDate=todayISO();bindDate();};
$('#mgrPrevDate').onclick=()=>{selectedDate=addDaysISO(selectedDate,-1);bindDate();};
$('#mgrNextDate').onclick=()=>{selectedDate=addDaysISO(selectedDate,1);bindDate();};
$('#mgrToday').onclick=()=>{selectedDate=todayISO();bindDate();};
$('#mgrDatePicker').onchange=e=>{if(e.target.value){selectedDate=e.target.value;bindDate();}};

document.querySelectorAll('.manager-nav button').forEach(btn=>btn.onclick=async()=>{
  document.querySelectorAll('.manager-nav button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  document.querySelectorAll('.manager-section').forEach(s=>s.hidden=true);$('#'+btn.dataset.section).hidden=false;
  if(btn.dataset.section==='people') await loadPeople();
  if(btn.dataset.section==='cover'){
    if(!coverDate) coverDate=selectedDate||todayISO();
    await loadCoverDate();
  }
  if(btn.dataset.section==='bulk') await loadBulkSetup();
});

function clearPerson(){
  $('#personEditId').value='';$('#personName').value='';$('#personRole').value='staff';$('#personStaffId').value='';$('#personPin').value='';$('#personPinConfirm').value='';$('#personActive').value='true';setInlineMessage($('#personResult'),'');
}
function openPersonEditor(mode='add'){
  $('#personEditorCard').hidden=false;
  $('#personEditorKicker').textContent=mode==='edit'?'Edit person':'Add person';
  $('#personEditorTitle').textContent=mode==='edit'?'Edit team member':'Add a new person';
  setTimeout(()=>$('#personName').focus(),0);
  $('#personEditorCard').scrollIntoView({behavior:'smooth',block:'start'});
}
function closePersonEditor(){ $('#personEditorCard').hidden=true; clearPerson(); }
$('#openAddPerson').onclick=()=>{clearPerson();openPersonEditor('add');};
$('#closePersonEditor').onclick=closePersonEditor;
$('#cancelPersonEdit').onclick=closePersonEditor;
$('#peopleRows').addEventListener('click',async e=>{
  const b=e.target.closest('.edit-person');if(!b)return;
  const all=await getUsers(),p=all.find(x=>x.id===b.dataset.id);if(!p)return;
  $('#personEditId').value=p.id;$('#personName').value=p.name||'';$('#personRole').value=p.role||'assignee';$('#personStaffId').value=p.staffId||'';$('#personPin').value=p.pin||'';$('#personPinConfirm').value=p.pin||'';$('#personActive').value=String(p.active!==false);
  openPersonEditor('edit');
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

$('#coverPrevDate').onclick=()=>{coverDate=addDaysISO(coverDate,-1);loadCoverDate();};
$('#coverNextDate').onclick=()=>{coverDate=addDaysISO(coverDate,1);loadCoverDate();};
$('#coverToday').onclick=()=>{coverDate=todayISO();loadCoverDate();};
$('#coverDatePicker').onchange=e=>{if(e.target.value){coverDate=e.target.value;loadCoverDate();}};

['coverFrom','coverTo','coverSlot'].forEach(id=>{
  $('#'+id).addEventListener('change',renderCoverPreview);
});

$('#coverDayBtn').onclick=async()=>{
  if(coverDate<todayISO()){setInlineMessage($('#coverResult'),'Historical dates are read only.','warning');return;}
  const from=$('#coverFrom').value,to=$('#coverTo').value,slot=$('#coverSlot').value;
  if(!from||!to||from===to){setInlineMessage($('#coverResult'),'Choose two different people.','error');return;}

  const affected=currentCoverAffected();
  if(!affected.length){setInlineMessage($('#coverResult'),'No incomplete matching tasks in this slot.','warning');return;}
  if(!await confirmCoverCapacity()) return;

  const target=people.find(p=>p.id===to);
  const source=people.find(p=>p.id===from);
  const ok=await confirmAction({
    title:'Apply cover to this date only?',
    message:`Move ${affected.length} task(s) from ${source?.name||'the person off'} to ${target?.name||'the covering person'} for ${slotLabelForDate(slot,coverDate)} on ${formatLongDate(coverDate)}?`,
    details:'Only this selected date changes. The recurring schedule remains unchanged.',
    confirmText:'Apply This Date'
  });
  if(!ok)return;

  const btn=$('#coverDayBtn');setButtonLoading(btn,true,'Applying…');
  try{
    for(const t of affected){
      await updateDailyTask(t.id,{
        assignedTo:to,
        assignedName:target?.name||'Unassigned',
        shiftCoverScope:'date',
        shiftCoveredFromUserId:from,
        shiftCoveredFromName:source?.name||'',
        shiftCoverDate:coverDate
      },user);
    }
    setInlineMessage($('#coverResult'),`✓ ${affected.length} task(s) moved for ${formatLongDate(coverDate)} only.`,'success');
    showToast('Shift cover applied for the selected date.','success');
    await loadCoverDate();
    if(coverDate===selectedDate) await bindDate();
  }catch(e){
    console.error(e);
    setInlineMessage($('#coverResult'),'Could not apply cover.','error');
  }finally{
    setButtonLoading(btn,false);
  }
};

$('#coverFutureBtn').onclick=async()=>{
  if(coverDate<todayISO()){setInlineMessage($('#coverResult'),'Historical dates are read only.','warning');return;}
  const from=$('#coverFrom').value,to=$('#coverTo').value,slot=$('#coverSlot').value;
  if(!from||!to||from===to){setInlineMessage($('#coverResult'),'Choose two different people.','error');return;}

  const affected=currentCoverAffected();
  if(!affected.length){setInlineMessage($('#coverResult'),'No incomplete matching tasks in this slot on the selected date.','warning');return;}
  if(!await confirmCoverCapacity()) return;

  const target=people.find(p=>p.id===to);
  const source=people.find(p=>p.id===from);
  const weekday=coverWeekdayLong();
  const ok=await confirmAction({
    title:`Change every ${weekday} from this date onward?`,
    message:`Move matching ${slotLabelForDate(slot,coverDate)} tasks from ${source?.name||'the person off'} to ${target?.name||'the covering person'} starting ${formatLongDate(coverDate)}?`,
    details:`This becomes the permanent cover arrangement for this slot on future ${weekday}s. Previous dates remain unchanged. You can later create another future cover from a newer date to change it again.`,
    confirmText:`Every ${weekday} Going Forward`
  });
  if(!ok)return;

  const btn=$('#coverFutureBtn');setButtonLoading(btn,true,'Saving future cover…');
  try{
    const result=await saveFutureShiftCover({
      date:coverDate,slotId:slot,fromUserId:from,toUserId:to
    },user);

    setInlineMessage(
      $('#coverResult'),
      `✓ Future cover saved. Matching ${weekday} tasks from ${formatLongDate(coverDate)} onward will be assigned to ${result.toName}. ${result.updated} already-generated task record(s) were updated.`,
      'success'
    );
    showToast(`Future ${weekday} cover saved.`,'success');
    await loadCoverDate();
    if(coverDate===selectedDate) await bindDate();
  }catch(e){
    console.error(e);
    setInlineMessage($('#coverResult'),e.message||'Could not save future cover.','error');
  }finally{
    setButtonLoading(btn,false);
  }
};




function bulkRowKey(r){return r.id;}
function bulkPersonOptions(selected=''){
  return `<option value="">Unassigned</option>`+
    people.map(p=>`<option value="${p.id}" ${p.id===selected?'selected':''}>${escapeHtml(p.name||p.id)}</option>`).join('');
}
function bulkSlotOptions(selected=''){
  return SLOT_DEFS.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${escapeHtml(slotLabelForDate(s.id,bulkDate))}</option>`).join('');
}
function bulkEffectiveRow(row){
  return bulkDirty.get(row.id)||row;
}
function filteredBulkRows(){
  const slot=$('#bulkSlotFilter').value;
  const unassigned=$('#bulkOnlyUnassigned').checked;
  const missingEffort=$('#bulkOnlyMissingEffort').checked;
  const includeRemoved=$('#bulkIncludeRemoved').checked;

  return bulkRowsData.filter(row=>{
    const x=bulkEffectiveRow(row);
    if(!includeRemoved&&x.status==='cancelled') return false;
    if(slot!=='all'&&x.slotId!==slot) return false;
    if(unassigned&&x.assignedTo) return false;
    if(missingEffort&&Number(x.effortMinutes)>0) return false;
    return true;
  });
}
function updateBulkDateUI(){
  $('#bulkDateText').textContent=formatLongDate(bulkDate);
  $('#bulkDatePicker').value=bulkDate;

  const effectiveFrom=bulkDate<todayISO()?todayISO():bulkDate;
  const weekday=new Date(effectiveFrom+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'});
  $('#bulkFutureHelp').textContent=
    bulkDate<todayISO()
      ? `Using a historical date as your source. Future changes will start today and apply to matching ${weekday} schedules.`
      : `Future changes start from ${formatLongDate(effectiveFrom)} for the matching weekday.`;

  $('#bulkSaveDate').disabled=bulkDate<todayISO();
  $('#bulkSaveDate').title=bulkDate<todayISO()?'Historical daily records are read only. Use Apply to Future Schedule instead.':'';
}
function updateBulkSummary(){
  const visible=filteredBulkRows();
  const all=bulkRowsData.map(bulkEffectiveRow);
  const changed=bulkDirty.size;
  const futureCapable=[...bulkDirty.values()].filter(r=>r.templateTaskId).length;
  $('#bulkSummary').innerHTML=`
    <span><strong>${visible.length}</strong> visible</span>
    <span><strong>${changed}</strong> changed</span>
    <span><strong>${all.filter(r=>!r.assignedTo&&r.status!=='cancelled').length}</strong> unassigned</span>
    <span><strong>${all.filter(r=>!Number(r.effortMinutes)&&r.status!=='cancelled').length}</strong> effort not set</span>
    <span><strong>${futureCapable}</strong> can update future schedule</span>`;
}
function renderBulkRows(){
  const visible=filteredBulkRows();

  $('#bulkRows').innerHTML=visible.map(row=>{
    const x=bulkEffectiveRow(row);
    const dirty=bulkDirty.has(row.id);
    const removed=x.status==='cancelled'||x.removeRequested;
    const futureReady=Boolean(row.templateTaskId);

    return `<tr data-id="${escapeHtml(row.id)}" class="${dirty?'bulk-row-dirty':''} ${removed?'bulk-row-removed':''}">
      <td><input class="bulk-row-select" type="checkbox"></td>
      <td>
        <input class="bulk-task-name" value="${escapeHtml(x.taskName||'')}" ${removed?'disabled':''}>
        <div class="bulk-task-sub">
          ${futureReady?'<span class="mini-pill recurring-pill">Recurring</span>':'<span class="mini-pill">Date only</span>'}
          ${row.photoRequired?'<span class="mini-pill photo-pill">📷 Photo</span>':''}
        </div>
      </td>
      <td><select class="bulk-slot" ${removed?'disabled':''}>${bulkSlotOptions(x.slotId)}</select></td>
      <td><select class="bulk-assignee" ${removed?'disabled':''}>${bulkPersonOptions(x.assignedTo||'')}</select></td>
      <td><input class="bulk-effort" type="number" min="1" step="5" placeholder="—" value="${Number(x.effortMinutes)>0?Number(x.effortMinutes):''}" ${removed?'disabled':''}></td>
      <td>${statusView(x.status)}</td>
      <td>
        ${x.status==='cancelled'
          ?'<span class="historical-view-badge">Removed</span>'
          :`<label class="bulk-remove-label"><input class="bulk-remove" type="checkbox" ${x.removeRequested?'checked':''}> Remove</label>`}
      </td>
    </tr>`;
  }).join('')||'<tr><td colspan="7" class="muted report-empty-cell">No existing tasks found for this date/filter.</td></tr>';

  $('#bulkSelectAll').checked=false;
  updateBulkSummary();
}
async function loadBulkSetup(){
  try{
    if(!people.length) await loadPeople();
    updateBulkDateUI();
    setInlineMessage($('#bulkResult'),'');
    $('#bulkRows').innerHTML='<tr><td colspan="7" class="muted report-empty-cell">Loading existing Firebase tasks…</td></tr>';

    // Important: ensure:false means this screen NEVER generates/recreates tasks.
    bulkRowsData=await getTasksForDate(bulkDate,{ensure:false});
    bulkDirty.clear();

    const selectedSlot=$('#bulkSlotFilter').value||'all';
    $('#bulkSlotFilter').innerHTML='<option value="all">All slots</option>'+
      SLOT_DEFS.map(s=>`<option value="${s.id}">${escapeHtml(slotLabelForDate(s.id,bulkDate))}</option>`).join('');
    if([...$('#bulkSlotFilter').options].some(o=>o.value===selectedSlot)) $('#bulkSlotFilter').value=selectedSlot;

    renderBulkRows();

    if(!bulkRowsData.length){
      setInlineMessage(
        $('#bulkResult'),
        `No daily task records exist in Firebase for ${formatLongDate(bulkDate)}. Choose one of the dates you previously used in the app.`,
        'warning'
      );
    }
  }catch(error){
    console.error(error);
    setInlineMessage($('#bulkResult'),'Could not load the existing daily tasks.','error');
  }
}
function markExistingBulkDirty(rowEl){
  const id=rowEl.dataset.id;
  const original=bulkRowsData.find(r=>r.id===id);
  if(!original) return;

  const removeRequested=Boolean(rowEl.querySelector('.bulk-remove')?.checked);
  const draft={
    ...original,
    taskName:rowEl.querySelector('.bulk-task-name')?.value.trim()||original.taskName,
    slotId:rowEl.querySelector('.bulk-slot')?.value||original.slotId,
    assignedTo:rowEl.querySelector('.bulk-assignee')?.value||'',
    effortMinutes:Number(rowEl.querySelector('.bulk-effort')?.value)>0?Number(rowEl.querySelector('.bulk-effort').value):null,
    removeRequested
  };

  const unchanged=
    draft.taskName===original.taskName &&
    draft.slotId===original.slotId &&
    draft.assignedTo===(original.assignedTo||'') &&
    Number(draft.effortMinutes||0)===Number(original.effortMinutes||0) &&
    !removeRequested;

  if(unchanged) bulkDirty.delete(id);
  else bulkDirty.set(id,draft);

  renderBulkRows();
}
function selectedBulkRowEls(){
  return [...document.querySelectorAll('#bulkRows tr[data-id]')]
    .filter(row=>row.querySelector('.bulk-row-select')?.checked);
}
function applyQuickEffort(minutes){
  const rows=selectedBulkRowEls();
  if(!rows.length){
    showToast('Select one or more task rows first.','warning',{title:'No rows selected'});
    return;
  }
  rows.forEach(row=>{
    const input=row.querySelector('.bulk-effort');
    if(!input||input.disabled) return;
    input.value=minutes;
    const original=bulkRowsData.find(r=>r.id===row.dataset.id);
    const existing=bulkDirty.get(row.dataset.id)||original;
    bulkDirty.set(row.dataset.id,{...existing,effortMinutes:Number(minutes)});
  });
  renderBulkRows();
}
async function saveBulkDateOnly(){
  if(bulkDate<todayISO()){
    showToast('Historical daily records are read only.','warning',{title:'No changes made'});
    return;
  }
  if(!bulkDirty.size){
    showToast('There are no changes to save.','info');
    return;
  }

  const ok=await confirmAction({
    title:'Save changes to this date only?',
    message:`Update ${bulkDirty.size} existing daily task record${bulkDirty.size===1?'':'s'} on ${formatLongDate(bulkDate)}?`,
    details:'The recurring weekly schedule will not change.',
    confirmText:'Save This Date'
  });
  if(!ok) return;

  const btn=$('#bulkSaveDate');setButtonLoading(btn,true,'Saving…');
  try{
    const names=new Map(people.map(p=>[p.id,p.name||'Unassigned']));
    for(const draft of bulkDirty.values()){
      if(draft.removeRequested){
        await cancelTaskToday(draft.id,user);
      }else{
        await updateDailyTask(draft.id,{
          taskName:draft.taskName,
          slotId:draft.slotId,
          assignedTo:draft.assignedTo||'',
          assignedName:draft.assignedTo?(names.get(draft.assignedTo)||'Unassigned'):'Unassigned',
          effortMinutes:draft.effortMinutes
        },user);
      }
    }
    setInlineMessage($('#bulkResult'),`✓ ${bulkDirty.size} existing task record(s) updated for this date only.`,'success');
    await loadBulkSetup();
    if(bulkDate===selectedDate) await bindDate();
  }catch(error){
    console.error(error);
    setInlineMessage($('#bulkResult'),error.message||'Could not save daily task changes.','error');
  }finally{
    setButtonLoading(btn,false);
  }
}
async function saveBulkFuture(){
  if(!bulkDirty.size){
    showToast('There are no changes to apply.','info');
    return;
  }

  const eligible=[...bulkDirty.values()].filter(r=>r.templateTaskId);
  const dateOnly=[...bulkDirty.values()].filter(r=>!r.templateTaskId);
  if(!eligible.length){
    showToast('None of the changed rows are linked to a recurring template.','warning',{title:'Future update unavailable'});
    return;
  }

  const effectiveFrom=bulkDate<todayISO()?todayISO():bulkDate;
  const weekday=new Date(effectiveFrom+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long'});

  const ok=await confirmAction({
    title:'Apply changed tasks to the future schedule?',
    message:`Apply ${eligible.length} changed recurring task${eligible.length===1?'':'s'} from ${formatLongDate(effectiveFrom)} onward?`,
    details:`These changes affect future matching ${weekday}s only. Earlier history is preserved.${dateOnly.length?` ${dateOnly.length} date-only/ad-hoc changed row(s) will be skipped because they have no recurring template.`:''}`,
    confirmText:'Apply to Future Schedule'
  });
  if(!ok) return;

  const btn=$('#bulkSaveFuture');setButtonLoading(btn,true,'Updating future…');
  try{
    for(const draft of eligible){
      if(draft.removeRequested){
        await stopTaskFuture(draft.templateTaskId,effectiveFrom,user);
      }else{
        await saveFutureRule(draft.templateTaskId,effectiveFrom,{
          taskName:draft.taskName,
          slotId:draft.slotId,
          assignedTo:draft.assignedTo||'',
          effortMinutes:draft.effortMinutes
        },user);
      }
    }

    setInlineMessage(
      $('#bulkResult'),
      `✓ ${eligible.length} recurring task change(s) applied from ${formatLongDate(effectiveFrom)} onward.${dateOnly.length?` ${dateOnly.length} date-only row(s) were not applied to the recurring schedule.`:''}`,
      'success'
    );
    bulkDirty.clear();
    await loadBulkSetup();
    await bindDate();
  }catch(error){
    console.error(error);
    setInlineMessage($('#bulkResult'),error.message||'Could not update the future schedule.','error');
  }finally{
    setButtonLoading(btn,false);
  }
}

$('#bulkPrevDate').onclick=()=>{bulkDate=addDaysISO(bulkDate,-1);loadBulkSetup();};
$('#bulkNextDate').onclick=()=>{bulkDate=addDaysISO(bulkDate,1);loadBulkSetup();};
$('#bulkToday').onclick=()=>{bulkDate=todayISO();loadBulkSetup();};
$('#bulkDatePicker').onchange=e=>{if(e.target.value){bulkDate=e.target.value;loadBulkSetup();}};
$('#bulkLoadDate').onclick=loadBulkSetup;

$('#bulkRows').addEventListener('change',e=>{
  const row=e.target.closest('tr[data-id]');
  if(!row) return;
  if(
    e.target.classList.contains('bulk-task-name')||
    e.target.classList.contains('bulk-slot')||
    e.target.classList.contains('bulk-assignee')||
    e.target.classList.contains('bulk-effort')||
    e.target.classList.contains('bulk-remove')
  ){
    markExistingBulkDirty(row);
  }
});
$('#bulkRows').addEventListener('input',e=>{
  const row=e.target.closest('tr[data-id]');
  if(!row) return;
  if(e.target.classList.contains('bulk-task-name')||e.target.classList.contains('bulk-effort')){
    // Keep draft state without re-rendering on every keystroke.
    const original=bulkRowsData.find(r=>r.id===row.dataset.id);
    if(!original) return;
    const current=bulkDirty.get(original.id)||{...original};
    if(e.target.classList.contains('bulk-task-name')) current.taskName=e.target.value;
    if(e.target.classList.contains('bulk-effort')) current.effortMinutes=Number(e.target.value)>0?Number(e.target.value):null;
    bulkDirty.set(original.id,current);
    row.classList.add('bulk-row-dirty');
    updateBulkSummary();
  }
});
['bulkSlotFilter','bulkOnlyUnassigned','bulkOnlyMissingEffort','bulkIncludeRemoved'].forEach(id=>{
  $('#'+id).addEventListener('change',renderBulkRows);
});
$('#bulkResetFilters').onclick=()=>{
  $('#bulkSlotFilter').value='all';
  $('#bulkOnlyUnassigned').checked=false;
  $('#bulkOnlyMissingEffort').checked=false;
  $('#bulkIncludeRemoved').checked=false;
  renderBulkRows();
};
$('#bulkSelectAll').onchange=e=>{
  document.querySelectorAll('#bulkRows .bulk-row-select').forEach(cb=>cb.checked=e.target.checked);
};
document.querySelectorAll('.bulk-effort-chip').forEach(btn=>{
  btn.onclick=()=>applyQuickEffort(Number(btn.dataset.minutes));
});
$('#bulkSaveDate').onclick=saveBulkDateOnly;
$('#bulkSaveFuture').onclick=saveBulkFuture;


async function checkSystemReady(){
  try{
    const state=await getSystemState();
    const ready=Boolean(state?.v22Ready);
    $('#systemInitBanner').hidden=ready;
    return ready;
  }catch(error){
    $('#systemInitBanner').hidden=false;
    setInlineMessage($('#systemInitResult'),'Could not verify system initialization. Check your connection.','error');
    return false;
  }
}

$('#initializeV2Btn').onclick=async()=>{
  const ok=await confirmAction({
    title:'Finish North Terrace V2 setup?',
    message:'Apply the confirmed staff roster/PINs and make sure the five-slot schedule is V2-ready?',
    details:'If your weekly template is already V2, it will be preserved. If old V1 data is detected, the weekly template is migrated and only today/future old snapshots are regenerated. Historical records are not deleted.',
    confirmText:'Finish V2 Setup'
  });
  if(!ok) return;

  const btn=$('#initializeV2Btn');
  setButtonLoading(btn,true,'Finishing setup…');

  try{
    const result=await initializeV22();
    setInlineMessage(
      $('#systemInitResult'),
      result.templateMigrated
        ? `✓ V2 initialized. ${result.masterTasks} master tasks and ${result.rosterCount} staff records applied. Today/future old-format tasks will regenerate automatically.`
        : `✓ V2 initialized. Existing V2 schedule preserved and ${result.rosterCount} staff records/PINs applied.`,
      'success'
    );
    showToast('North Terrace V2 setup complete.','success',{title:'Ready'});
    await loadPeople();
    selectedDate=todayISO();
    await ensureTasksForDate(selectedDate);
    await bindDate();
    setTimeout(()=>{$('#systemInitBanner').hidden=true;},1000);
  }catch(error){
    console.error(error);
    setInlineMessage($('#systemInitResult'),'Could not finish V2 setup. Please try again.','error');
  }finally{
    setButtonLoading(btn,false);
  }
};

$('#logout').onclick=()=>{clearSession();location.href='login.html';};

initReports({root:document.querySelector('#reports'),userProvider:()=>user});
initNetworkStatus();registerAppServiceWorker();

try{
  const merge=await migrateParthToParthy();
  if(merge.duplicateUsers||merge.templateTasks||merge.dailyTasks){
    showToast('Parth has been merged into Parthy across assignments and reports.','success',{title:'Staff identity updated'});
  }
}catch(error){
  console.error('Parth → Parthy migration failed',error);
}

await loadPeople();
updateDateUI();
updateCoverDateUI();
const systemReady=await checkSystemReady();
if(systemReady){
  await bindDate();
}else{
  $('#managerSlots').innerHTML=`<div class="card elevated"><div class="empty-state">
    <h3>One-time V2 setup required</h3>
    <p>Use the “Finish V2 Setup” banner above. After it completes, the schedule will load here and the setup message will disappear permanently.</p>
  </div></div>`;
}
