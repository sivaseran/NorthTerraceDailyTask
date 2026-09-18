import {getSession,clearSession} from './auth.js';
import {
  SLOT_DEFS,todayISO,addDaysISO,formatLongDate,slotLabelForDate,slotCapacityMinutes,
  getUsers,getAssignableUsers,getSystemState,getStaffAvailability,saveStaffAvailability,getWeeklyTemplate,getSetupTasksForDate,bulkUpdateWeeklyTemplateRows,validateUserUniqueness,saveUser,createPerson,
  ensureTasksForDate,resetTasksForDate,watchTasksForDate,getTasksForDate,
  updateDailyTask,saveFutureRule,createTaskForDate,cancelTaskToday,stopTaskFuture,saveFutureShiftCover,
  workloadBySlot,capacityForDraft,completeTask
} from './store.js';
import {initializeV22,migrateParthToParthy,ensureV30TaskModel,ensureV321TemperatureNames,ensureV322TemperatureRepair,reconcileTemperatureTasks} from './seed.js';
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
let bulkWeekAnchor=todayISO();
let bulkRowsData=[];
let bulkDirty=new Map();
let effortWeekAnchor=todayISO();
let effortRowsData=[];
let effortDirty=new Map();
let staffAvailability={};
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
  if(btn.dataset.section==='availability') await loadStaffAvailability();
  if(btn.dataset.section==='cover'){
    if(!coverDate) coverDate=selectedDate||todayISO();
    await loadCoverDate();
  }
  if(btn.dataset.section==='bulk') await loadBulkSetup();
  if(btn.dataset.section==='effort') await loadEffortAllocation();
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







const AVAIL_DAY_ORDER=['mon','tue','wed','thu','fri','sat','sun'];
const DEFAULT_STAFF_AVAILABILITY={
  staff1:{mon:'05:30-13:00, 15:00-20:00',tue:'08:00-13:00',wed:'08:00-12:00, 14:00-20:00',thu:'08:00-20:00',fri:'12:00-23:00',sat:'08:00-12:00, 14:00-20:00',sun:''},
  staff2:{mon:'',tue:'',wed:'',thu:'',fri:'08:00-13:30',sat:'',sun:'07:00-13:30'},
  staff3:{mon:'13:00-18:00',tue:'05:30-14:00',wed:'16:30-22:00',thu:'13:00-16:00',fri:'12:00-20:00',sat:'12:00-17:00',sun:''},
  staff4:{mon:'',tue:'',wed:'',thu:'14:30-22:00',fri:'',sat:'',sun:'13:30-22:00'},
  staff5:{mon:'',tue:'',wed:'05:30-13:45',thu:'05:30-13:45',fri:'',sat:'',sun:''},
  staff6:{mon:'18:00-22:00',tue:'',wed:'12:00-16:30',thu:'',fri:'09:30-12:00',sat:'',sun:'11:00-20:00'},
  staff7:{mon:'',tue:'14:00-22:00',wed:'',thu:'',fri:'05:30-09:30',sat:'',sun:'07:00-11:00'},
  staff8:{mon:'',tue:'',wed:'',thu:'',fri:'',sat:'17:00-23:00',sun:''},
  staff9:{mon:'08:00-15:00',tue:'13:00-20:00',wed:'',thu:'',fri:'',sat:'05:30-14:00',sun:''}
};

function parseTimeMinutes(value){
  const m=String(value||'').trim().match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if(!m) return null;
  return Number(m[1])*60+Number(m[2]);
}
function parseShiftText(text){
  return String(text||'').split(',').map(part=>part.trim()).filter(Boolean).map(part=>{
    const m=part.match(/^(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})$/);
    if(!m) return null;
    const start=parseTimeMinutes(m[1]),end=parseTimeMinutes(m[2]);
    if(start===null||end===null||end<=start) return null;
    return {start,end,label:`${m[1].padStart(5,'0')}–${m[2].padStart(5,'0')}`};
  }).filter(Boolean);
}
function validateShiftText(text){
  const raw=String(text||'').trim();
  if(!raw) return true;
  const parts=raw.split(',').map(x=>x.trim()).filter(Boolean);
  return parts.length>0&&parseShiftText(raw).length===parts.length;
}
function dayKeyLower(date){return bulkDayKey(date);}
function availabilityTextFor(userId,date){
  return staffAvailability?.[userId]?.[dayKeyLower(date)]||'';
}
function slotWindowForDate(slotId,date){
  const slot=SLOT_DEFS.find(s=>s.id===slotId);
  if(!slot) return null;
  let end=slot.end;
  if(slotId==='S5'){
    const dow=new Date(date+'T12:00:00').getDay();
    end=(dow===5||dow===6)?'23:00':'22:00';
  }
  return {start:parseTimeMinutes(slot.start),end:parseTimeMinutes(end)};
}
function availabilityForRows(person,date,rows){
  const shifts=parseShiftText(availabilityTextFor(person.id,date));
  if(!shifts.length) return {level:'none',label:'Off rota',shiftText:''};

  const checkpoints=rows.map(r=>parseTimeMinutes(r.checkpoint)).filter(v=>v!==null);
  if(checkpoints.length){
    const covered=checkpoints.filter(cp=>shifts.some(s=>cp>=s.start&&cp<=s.end)).length;
    const level=covered===checkpoints.length?'full':covered>0?'partial':'none';
    return {level,label:level==='full'?'Full':'Partial',shiftText:availabilityTextFor(person.id,date)};
  }

  const windows=rows.map(r=>slotWindowForDate(r.slotId,date)).filter(Boolean);
  if(!windows.length) return {level:'partial',label:'Partial',shiftText:availabilityTextFor(person.id,date)};
  const start=Math.min(...windows.map(w=>w.start)),end=Math.max(...windows.map(w=>w.end));

  const full=shifts.some(s=>s.start<=start&&s.end>=end);
  const overlap=shifts.some(s=>Math.max(s.start,start)<Math.min(s.end,end));
  return {
    level:full?'full':overlap?'partial':'none',
    label:full?'Full':overlap?'Partial':'Off rota',
    shiftText:availabilityTextFor(person.id,date)
  };
}
function availablePersonOptions(date,rows,selected=''){
  const full=[],partial=[];
  for(const p of people){
    const a=availabilityForRows(p,date,rows);
    if(a.level==='full') full.push({p,a});
    else if(a.level==='partial') partial.push({p,a});
  }

  const availableIds=new Set([...full,...partial].map(x=>x.p.id));
  const options=['<option value="">Unassigned</option>'];

  if(full.length){
    options.push('<optgroup label="✓ Available for full task window">');
    for(const {p,a} of full) options.push(`<option value="${p.id}" ${p.id===selected?'selected':''}>✓ ${escapeHtml(p.name||p.id)} · ${escapeHtml(a.shiftText)}</option>`);
    options.push('</optgroup>');
  }
  if(partial.length){
    options.push('<optgroup label="◐ Partially available">');
    for(const {p,a} of partial) options.push(`<option value="${p.id}" ${p.id===selected?'selected':''}>◐ ${escapeHtml(p.name||p.id)} · ${escapeHtml(a.shiftText)}</option>`);
    options.push('</optgroup>');
  }

  if(selected&&!availableIds.has(selected)){
    const current=people.find(p=>p.id===selected);
    if(current) options.push(`<optgroup label="Current assignment"><option value="${current.id}" selected>⚠ ${escapeHtml(current.name||current.id)} · outside rota</option></optgroup>`);
  }
  return options.join('');
}

async function loadStaffAvailability(){
  if(!people.length) await loadPeople();
  let stored=await getStaffAvailability();
  if(!stored?.week){
    staffAvailability=structuredClone(DEFAULT_STAFF_AVAILABILITY);
    await saveStaffAvailability(staffAvailability,user);
  }else{
    staffAvailability={...structuredClone(DEFAULT_STAFF_AVAILABILITY),...stored.week};
  }

  const team=people.filter(p=>/^staff\d+$/.test(p.id)).sort((a,b)=>(Number(a.staffId)||999)-(Number(b.staffId)||999));
  $('#availabilityRows').innerHTML=team.map(p=>`
    <tr data-user="${p.id}">
      <th>${escapeHtml(p.name||p.id)}</th>
      ${AVAIL_DAY_ORDER.map(day=>`<td><input class="availability-input" data-day="${day}" value="${escapeHtml(staffAvailability?.[p.id]?.[day]||'')}" placeholder="Off"></td>`).join('')}
    </tr>`).join('');
}
$('#saveAvailability').onclick=async()=>{
  const next=structuredClone(staffAvailability||{});
  let invalid=null;

  document.querySelectorAll('#availabilityRows tr[data-user]').forEach(row=>{
    const id=row.dataset.user;
    next[id]=next[id]||{};
    row.querySelectorAll('.availability-input').forEach(input=>{
      const value=input.value.trim();
      input.classList.remove('invalid');
      if(!validateShiftText(value)&&!invalid){
        invalid=input;
      }
      next[id][input.dataset.day]=value;
    });
  });

  if(invalid){
    invalid.classList.add('invalid');
    invalid.focus();
    setInlineMessage($('#availabilityResult'),'Use HH:MM-HH:MM. For two shifts use a comma, e.g. 05:30-13:00, 15:00-20:00.','error');
    return;
  }

  const btn=$('#saveAvailability');
  setButtonLoading(btn,true,'Saving…');
  try{
    await saveStaffAvailability(next,user);
    staffAvailability=next;
    setInlineMessage($('#availabilityResult'),'✓ Staff availability saved. Staff Assignment will now use these hours.','success');
    showToast('Staff availability saved.','success');
    if(!$('#bulk').hidden) await loadBulkSetup();
  }catch(error){
    console.error(error);
    setInlineMessage($('#availabilityResult'),error.message||'Could not save staff availability.','error');
  }finally{
    setButtonLoading(btn,false);
  }
};

const BULK_DAY_LABELS={mon:'Monday',tue:'Tuesday',wed:'Wednesday',thu:'Thursday',fri:'Friday',sat:'Saturday',sun:'Sunday'};
const BULK_DAY_ORDER=['mon','tue','wed','thu','fri','sat','sun'];

function bulkWeekStart(date){
  const d=new Date(date+'T12:00:00');
  const diff=(d.getDay()+6)%7;
  d.setDate(d.getDate()-diff);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function bulkWeekDates(){
  const start=bulkWeekStart(bulkWeekAnchor);
  return Array.from({length:7},(_,i)=>addDaysISO(start,i));
}
function bulkDayKey(date){
  return ['sun','mon','tue','wed','thu','fri','sat'][new Date(date+'T12:00:00').getDay()];
}
function bulkWeekRangeText(){
  const dates=bulkWeekDates();
  const a=new Date(dates[0]+'T12:00:00'),b=new Date(dates[6]+'T12:00:00');
  return `${a.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} – ${b.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}`;
}
function nextSameWeekdayOnOrAfter(sourceDate,fromDate=todayISO()){
  const source=new Date(sourceDate+'T12:00:00');
  const from=new Date(fromDate+'T12:00:00');
  const delta=(source.getDay()-from.getDay()+7)%7;
  from.setDate(from.getDate()+delta);
  return `${from.getFullYear()}-${String(from.getMonth()+1).padStart(2,'0')}-${String(from.getDate()).padStart(2,'0')}`;
}
function bulkFutureEffectiveDateFor(row){
  return row.date<todayISO()?nextSameWeekdayOnOrAfter(row.date,todayISO()):row.date;
}
function bulkMasterKey(row){
  // Recurring checkpoints from the same master task become one weekly row.
  if(row.templateTaskId) return `tpl:${row.templateTaskId}`;
  return `adhoc:${String(row.taskName||'').trim().toLowerCase()}|${row.slotId||''}`;
}
function bulkMasterSlot(rows){
  if(rows.some(r=>r.checkpoint)) return 'AUTO';
  const slots=[...new Set(rows.map(r=>r.slotId).filter(Boolean))];
  return slots.length===1?slots[0]:'MULTI';
}
function bulkMasterLabel(rows){
  return rows[0]?.taskName||'Untitled task';
}
function cellDraft(row){
  return bulkDirty.get(row.id)||row;
}
function matrixGroups(){
  const groups=new Map();

  for(const row of bulkRowsData){
    // Tasks removed in Effort Allocation must not appear in Staff Assignment.
    if(row.status==='cancelled') continue;
    const key=bulkMasterKey(row);
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(row);
  }

  return [...groups.entries()].map(([key,rows])=>({
    key,
    rows,
    taskName:bulkMasterLabel(rows),
    slotId:bulkMasterSlot(rows),
    recurring:Boolean(rows.some(r=>r.templateTaskId)),
    checkpoint:Boolean(rows.some(r=>r.checkpoint)),
    byDay:Object.fromEntries(BULK_DAY_ORDER.map(day=>[
      day,
      rows.filter(r=>bulkDayKey(r.date)===day)
    ]))
  })).sort((a,b)=>{
    const slotRank=id=>id==='AUTO'?-1:SLOT_DEFS.findIndex(s=>s.id===id);
    return slotRank(a.slotId)-slotRank(b.slotId)||String(a.taskName).localeCompare(String(b.taskName));
  });
}
function filteredMatrixGroups(){
  const slot=$('#bulkSlotFilter').value;
  const ua=$('#bulkOnlyUnassigned').checked;

  return matrixGroups().filter(group=>{
    if(slot!=='all'&&group.slotId!==slot) return false;

    const cells=group.rows.map(cellDraft).filter(r=>r.status!=='cancelled');
    if(!cells.length) return false;
    if(ua&&!cells.some(r=>!r.assignedTo)) return false;
    return true;
  });
}
function updateBulkWeekUI(){
  $('#bulkWeekText').textContent=`Week ${bulkWeekRangeText()}`;
  $('#bulkWeekPicker').value=bulkWeekStart(bulkWeekAnchor);

  const dates=bulkWeekDates();
  BULK_DAY_ORDER.forEach((day,i)=>{
    const th=document.querySelector(`#bulk .bulk-matrix-table th[data-day="${day}"]`);
    if(th){
      th.innerHTML=`${BULK_DAY_LABELS[day]}<small>${new Date(dates[i]+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</small>`;
    }
  });
}
function updateBulkSummary(){
  const all=bulkRowsData.map(cellDraft).filter(r=>r.status!=='cancelled');
  const savedDays=new Set(bulkRowsData.map(r=>r.date)).size;
  $('#bulkSummary').innerHTML=`
    <span><strong>${savedDays}/7</strong> saved days</span>
    <span><strong>${filteredMatrixGroups().length}</strong> task rows</span>
    <span><strong>${bulkDirty.size}</strong> changed assignment records</span>
    <span><strong>${all.filter(r=>!r.assignedTo).length}</strong> unassigned</span>`;
}
function renderMatrixCell(dayRows,group){
  if(!dayRows.length){
    return `<td class="bulk-matrix-empty"><span>—</span></td>`;
  }

  const activeRows=dayRows.filter(r=>cellDraft(r).status!=='cancelled');
  if(!activeRows.length){
    return `<td class="bulk-matrix-empty"><span>Removed</span></td>`;
  }

  const base=cellDraft(activeRows[0]);
  const dirty=activeRows.some(r=>bulkDirty.has(r.id));
  const historical=activeRows[0].date<todayISO();
  const cellId=activeRows.map(r=>r.id).join('|');
  const avail=base.assignedTo
    ?availabilityForRows(people.find(p=>p.id===base.assignedTo)||{id:base.assignedTo},activeRows[0].date,activeRows)
    :null;

  return `<td class="bulk-matrix-cell assignment-cell ${dirty?'bulk-cell-dirty':''}" data-cell="${escapeHtml(cellId)}">
    <select class="bulk-cell-assignee">
      ${availablePersonOptions(activeRows[0].date,activeRows,base.assignedTo||'')}
    </select>
    <div class="assignment-cell-meta">
      ${group.checkpoint?`<span>${activeRows.length} checkpoints</span>`:`<span>${statusView(base.status)}</span>`}
      ${avail?.level==='full'?'<span class="availability-badge full">✓ Full</span>':''}
      ${avail?.level==='partial'?'<span class="availability-badge partial">◐ Partial</span>':''}
      ${avail?.level==='none'?'<span class="availability-badge unavailable">⚠ Outside rota</span>':''}
      ${historical?'<span class="historical-view-badge">History</span>':''}
    </div>
  </td>`;
}
function renderBulkRows(){
  const groups=filteredMatrixGroups();

  $('#bulkMatrixRows').innerHTML=groups.map(group=>`
    <tr data-group="${escapeHtml(group.key)}">
      <th class="bulk-task-sticky bulk-task-info">
        <strong>${escapeHtml(group.taskName)}</strong>
        <div>
          ${group.rows[0]?.temperatureRequired&&group.rows[0]?.sourceTime?`<span class="temperature-time-label">🌡 ${escapeHtml(group.rows[0].sourceTime)}</span>`:''}
          <span>${group.slotId==='AUTO'?'Hourly / automatic':group.slotId==='MULTI'?'Multiple slots':escapeHtml(slotLabelForDate(group.slotId,bulkWeekStart(bulkWeekAnchor)))}</span>
          ${group.recurring?'<span class="mini-pill recurring-pill">Recurring</span>':'<span class="mini-pill">Date only</span>'}
        </div>
      </th>
      ${BULK_DAY_ORDER.map(day=>renderMatrixCell(group.byDay[day],group)).join('')}
    </tr>`).join('')||'<tr><td colspan="8" class="muted report-empty-cell">No existing tasks found for this week/filter.</td></tr>';

  updateBulkSummary();
}
async function loadBulkSetup(){
  try{
    if(!people.length) await loadPeople();
    if(!Object.keys(staffAvailability||{}).length){ const a=await getStaffAvailability(); staffAvailability=a?.week||structuredClone(DEFAULT_STAFF_AVAILABILITY); }
    updateBulkWeekUI();
    setInlineMessage($('#bulkResult'),'');
    $('#bulkMatrixRows').innerHTML='<tr><td colspan="8" class="muted report-empty-cell">Loading existing Firebase week…</td></tr>';

    const dates=bulkWeekDates();
    const results=await Promise.all(dates.map(date=>getSetupTasksForDate(date)));
    bulkRowsData=results.flat();
    bulkDirty.clear();

    const selectedSlot=$('#bulkSlotFilter').value||'all';
    $('#bulkSlotFilter').innerHTML='<option value="all">All slots</option>'+
      '<option value="AUTO">Hourly / automatic</option>'+
      SLOT_DEFS.map(s=>`<option value="${s.id}">${escapeHtml(slotLabelForDate(s.id,dates[0]))}</option>`).join('')+
      '<option value="MULTI">Multiple slots</option>';
    if([...$('#bulkSlotFilter').options].some(o=>o.value===selectedSlot)) $('#bulkSlotFilter').value=selectedSlot;

    renderBulkRows();

    const foundDays=new Set(bulkRowsData.map(r=>r.date));
    if(foundDays.size<7){
      const missing=dates.filter(d=>!foundDays.has(d))
        .map(d=>new Date(d+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}));
      setInlineMessage(
        $('#bulkResult'),
        `${foundDays.size} saved day(s) found.${missing.length?` Blank columns/cells remain for missing saved days: ${missing.join(', ')}.`:''}`,
        'warning'
      );
    }
  }catch(error){
    console.error(error);
    setInlineMessage($('#bulkResult'),'Could not load the existing Firebase week.','error');
  }
}
function rowsForCell(cell){
  const ids=String(cell.dataset.cell||'').split('|').filter(Boolean);
  return ids.map(id=>bulkRowsData.find(r=>r.id===id)).filter(Boolean);
}
function writeCellDraft(cell){
  const rows=rowsForCell(cell).filter(r=>r.status!=='cancelled');
  if(!rows.length) return;

  const assignedTo=cell.querySelector('.bulk-cell-assignee')?.value||'';

  for(const original of rows){
    const draft={...original,assignedTo};
    const unchanged=assignedTo===(original.assignedTo||'');
    if(unchanged) bulkDirty.delete(original.id);
    else bulkDirty.set(original.id,draft);
  }
  renderBulkRows();
}
async function saveBulkWeek(){
  if(!bulkDirty.size){
    showToast('There are no changes to save.','info');
    return;
  }

  const writable=[...bulkDirty.values()].filter(r=>r.date>=todayISO());
  const historical=[...bulkDirty.values()].filter(r=>r.date<todayISO());

  if(!writable.length){
    showToast('All changed cells are historical. Use Apply Changed Tasks to Future Schedule instead.','warning');
    return;
  }

  const ok=await confirmAction({
    title:'Save changes to this loaded week?',
    message:`Update ${writable.length} existing daily task record${writable.length===1?'':'s'} from today/future dates in this week?`,
    details:`${historical.length?`${historical.length} historical record(s) will be skipped. `:''}The recurring weekly schedule will not change.`,
    confirmText:'Save This Week'
  });
  if(!ok) return;

  const btn=$('#bulkSaveWeek');setButtonLoading(btn,true,'Saving…');
  try{
    const names=new Map(people.map(p=>[p.id,p.name||'Unassigned']));

    for(const draft of writable){
      if(draft._virtual) continue;
      await updateDailyTask(draft.id,{
        assignedTo:draft.assignedTo||'',
        assignedName:draft.assignedTo?(names.get(draft.assignedTo)||'Unassigned'):'Unassigned'
      },user);
    }

    setInlineMessage($('#bulkResult'),`✓ ${writable.length} existing daily record(s) updated in this week.${historical.length?` ${historical.length} historical record(s) were protected.`:''}`,'success');
    await loadBulkSetup();
    if(bulkWeekDates().includes(selectedDate)) await bindDate();
  }catch(error){
    console.error(error);
    setInlineMessage($('#bulkResult'),error.message||'Could not save weekly changes.','error');
  }finally{
    setButtonLoading(btn,false);
  }
}
async function saveBulkFuture(){
  if(!bulkDirty.size){
    showToast('There are no changes to apply.','info');
    return;
  }

  const rawEligible=[...bulkDirty.values()].filter(r=>r.templateTaskId);
  const dateOnly=[...bulkDirty.values()].filter(r=>!r.templateTaskId);

  // One future rule per recurring master task + weekday.
  const eligibleMap=new Map();
  for(const draft of rawEligible){
    eligibleMap.set(`${draft.templateTaskId}|${bulkDayKey(draft.date)}`,draft);
  }
  const eligible=[...eligibleMap.values()];

  if(!eligible.length){
    showToast('None of the changed cells are linked to a recurring template.','warning');
    return;
  }

  const ok=await confirmAction({
    title:'Apply staff assignments to the future schedule?',
    message:`Apply ${eligible.length} recurring weekday change${eligible.length===1?'':'s'} using this matrix as the source?`,
    details:`Each assignment affects only its own weekday. Historical source cells begin from the next occurrence of that weekday. Earlier history remains unchanged.${dateOnly.length?` ${dateOnly.length} date-only/ad-hoc changed record(s) will be skipped.`:''}`,
    confirmText:'Apply to Future Schedule'
  });
  if(!ok) return;

  const btn=$('#bulkSaveFuture');setButtonLoading(btn,true,'Updating future…');
  try{
    for(const draft of eligible){
      const effectiveFrom=bulkFutureEffectiveDateFor(draft);
      await saveFutureRule(draft.templateTaskId,effectiveFrom,{
        taskName:draft.taskName,
        slotId:draft.slotId,
        assignedTo:draft.assignedTo||'',
        effortMinutes:draft.effortMinutes
      },user);
    }

    setInlineMessage($('#bulkResult'),`✓ ${eligible.length} recurring weekday change(s) applied to the future schedule.${dateOnly.length?` ${dateOnly.length} date-only record(s) were skipped.`:''}`,'success');
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

$('#bulkPrevWeek').onclick=()=>{bulkWeekAnchor=addDaysISO(bulkWeekStart(bulkWeekAnchor),-7);loadBulkSetup();};
$('#bulkNextWeek').onclick=()=>{bulkWeekAnchor=addDaysISO(bulkWeekStart(bulkWeekAnchor),7);loadBulkSetup();};
$('#bulkThisWeek').onclick=()=>{bulkWeekAnchor=todayISO();loadBulkSetup();};
$('#bulkWeekPicker').onchange=e=>{if(e.target.value){bulkWeekAnchor=e.target.value;loadBulkSetup();}};
$('#bulkLoadWeek').onclick=loadBulkSetup;

$('#bulkMatrixRows').addEventListener('change',e=>{
  const cell=e.target.closest('.bulk-matrix-cell[data-cell]');
  if(!cell) return;
  if(e.target.classList.contains('bulk-cell-assignee')){
    writeCellDraft(cell);
  }
});
['bulkSlotFilter','bulkOnlyUnassigned'].forEach(id=>{
  $('#'+id).addEventListener('change',renderBulkRows);
});
$('#bulkResetFilters').onclick=()=>{
  $('#bulkSlotFilter').value='all';
  $('#bulkOnlyUnassigned').checked=false;
  renderBulkRows();
};
$('#bulkSaveWeek').onclick=saveBulkWeek;
$('#bulkSaveFuture').onclick=saveBulkFuture;





function effortWeekStart(date){
  const d=new Date(date+'T12:00:00');
  const diff=(d.getDay()+6)%7;
  d.setDate(d.getDate()-diff);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function effortWeekDates(){
  const start=effortWeekStart(effortWeekAnchor);
  return Array.from({length:7},(_,i)=>addDaysISO(start,i));
}
function effortWeekRangeText(){
  const dates=effortWeekDates();
  const a=new Date(dates[0]+'T12:00:00'),b=new Date(dates[6]+'T12:00:00');
  return `${a.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} – ${b.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}`;
}
function effortVersions(dayData){
  if(!dayData) return [];
  if(Array.isArray(dayData.versions)) return dayData.versions.filter(Boolean);
  if(dayData&&typeof dayData==='object') return [dayData];
  return [];
}
function effortDayName(day){
  return {mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat',sun:'Sun'}[day];
}
function effortRuleForDate(template,date){
  const dayName=effortDayName(bulkDayKey(date));
  return effortVersions(template.schedule?.[dayName])
    .filter(v=>String(v.effectiveFrom||'0000-01-01')<=date&&(!v.effectiveTo||String(v.effectiveTo)>=date))
    .sort((a,b)=>String(b.effectiveFrom||'').localeCompare(String(a.effectiveFrom||'')))[0]||null;
}
function effortBaseRule(template){
  const candidates=[];
  for(const day of ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']){
    candidates.push(...effortVersions(template.schedule?.[day]));
  }
  return candidates
    .filter(Boolean)
    .sort((a,b)=>String(b.effectiveFrom||'').localeCompare(String(a.effectiveFrom||'')))[0]||{};
}
function validHHMM(value){
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(value||''));
}
function timeSortValue(value){
  if(!validHHMM(value)) return 99999;
  const [h,m]=value.split(':').map(Number);
  return h*60+m;
}
function slotFromTime(value,fallback='S1'){
  if(!validHHMM(value)) return fallback||'S1';
  const mins=timeSortValue(value);
  if(mins<9*60) return 'S1';
  if(mins<14*60) return 'S2';
  if(mins<18*60) return 'S3';
  if(mins<20*60) return 'S4';
  return 'S5';
}
function slotStartTime(slotId){
  return SLOT_DEFS.find(s=>s.id===slotId)?.start||'';
}
function inferredRuleTime(rule){
  if(!rule||rule.active===false) return '';
  if(validHHMM(rule.sourceTime)) return rule.sourceTime;
  return slotStartTime(rule.slotId)||'';
}
function effortGroups(){
  const dates=effortWeekDates();

  return effortRowsData.map(template=>{
    const base=effortBaseRule(template);
    const byDay={};

    BULK_DAY_ORDER.forEach((day,i)=>{
      const date=dates[i];
      const rule=effortRuleForDate(template,date);
      byDay[day]={
        day,
        date,
        rule,
        time:inferredRuleTime(rule),
        assignedTo:rule?.assigneeId||''
      };
    });

    // Monday is the default template time. If Monday is missing, use the first
    // active weekday so the task is still easy to initialise across the week.
    const firstExistingTime=BULK_DAY_ORDER.map(day=>byDay[day].time).find(Boolean)||inferredRuleTime(base)||'';
    const mondayTime=byDay.mon.time||firstExistingTime;

    // User wants every task populated across all days initially. Missing weekday
    // rules therefore inherit Monday/default time in the setup screen; clearing a
    // time explicitly removes that weekday.
    const defaultDayTimes={};
    BULK_DAY_ORDER.forEach(day=>{
      defaultDayTimes[day]=byDay[day].time||mondayTime;
    });

    const efforts=BULK_DAY_ORDER
      .map(day=>Number(byDay[day].rule?.effortMinutes)||0)
      .filter(Boolean);
    const defaultEffort=efforts[0]||Number(base.effortMinutes)||null;

    return {
      key:`tpl:${template.id}`,
      templateTaskId:template.id,
      template,
      taskName:template.taskName||'Untitled task',
      byDay,
      defaultDayTimes,
      defaultEffort,
      recurring:Boolean(template.recurring),
      checkpoint:Boolean(template.frequencyMinutes),
      temperatureRequired:Boolean(template.temperatureRequired)
    };
  }).sort((a,b)=>{
    const ad=effortDraftForGroupRaw(a);
    const bd=effortDraftForGroupRaw(b);
    const aKey=ad.dayTimes.mon||BULK_DAY_ORDER.map(d=>ad.dayTimes[d]).find(Boolean)||'';
    const bKey=bd.dayTimes.mon||BULK_DAY_ORDER.map(d=>bd.dayTimes[d]).find(Boolean)||'';
    return timeSortValue(aKey)-timeSortValue(bKey)||String(a.taskName).localeCompare(String(b.taskName));
  });
}
function effortDraftForGroupRaw(group){
  return effortDirty.get(group.key)||{
    effortMinutes:group.defaultEffort,
    dayTimes:{...group.defaultDayTimes}
  };
}
function effortDraftForGroup(group){
  const draft=effortDraftForGroupRaw(group);
  return {
    effortMinutes:draft.effortMinutes,
    dayTimes:{...draft.dayTimes}
  };
}
function filteredEffortGroups(){
  const slot=$('#effortSlotFilter').value;
  const missing=$('#effortOnlyMissing').checked;

  return effortGroups().filter(g=>{
    const draft=effortDraftForGroup(g);
    if(slot!=='all'){
      const anyInSlot=BULK_DAY_ORDER.some(day=>{
        const t=draft.dayTimes[day];
        return t&&slotFromTime(t)==slot;
      });
      if(!anyInSlot) return false;
    }
    if(missing&&Number(draft.effortMinutes)>0) return false;
    return true;
  });
}
function updateEffortWeekUI(){
  $('#effortWeekText').textContent=`Week ${effortWeekRangeText()}`;
  $('#effortWeekPicker').value=effortWeekStart(effortWeekAnchor);
  const dates=effortWeekDates();

  BULK_DAY_ORDER.forEach((day,i)=>{
    const th=document.querySelector(`#effort .effort-template-table th[data-effort-day="${day}"]`);
    if(th){
      th.innerHTML=`${BULK_DAY_LABELS[day]}<small>${new Date(dates[i]+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</small>`;
    }
  });
}
function updateEffortSummary(){
  const groups=effortGroups();
  const visible=filteredEffortGroups();
  const missingEffort=groups.filter(g=>!Number(effortDraftForGroup(g).effortMinutes)).length;
  const hiddenDays=groups.reduce((sum,g)=>{
    const d=effortDraftForGroup(g);
    return sum+BULK_DAY_ORDER.filter(day=>!d.dayTimes[day]).length;
  },0);

  $('#effortSummary').innerHTML=`
    <span><strong>${visible.length}</strong> task rows</span>
    <span><strong>${effortDirty.size}</strong> changed tasks</span>
    <span><strong>${missingEffort}</strong> effort not set</span>
    <span><strong>${hiddenDays}</strong> hidden task-days</span>`;
}
function effortSlotBadge(time){
  if(!time) return '<span class="effort-day-slot off">Hidden</span>';
  const slot=slotFromTime(time);
  return `<span class="effort-day-slot">${escapeHtml(slotLabelForDate(slot,effortWeekStart(effortWeekAnchor)))}</span>`;
}
function renderEffortMatrix(){
  const groups=filteredEffortGroups();

  $('#effortMatrixRows').innerHTML=groups.map(group=>{
    const draft=effortDraftForGroup(group);

    return `<tr data-effort-group="${escapeHtml(group.key)}" class="${effortDirty.has(group.key)?'effort-row-dirty':''}">
      <th class="effort-task-sticky effort-task-info">
        <strong>${escapeHtml(group.taskName)}</strong>
        <div>
          ${group.recurring?'<span class="mini-pill recurring-pill">Recurring</span>':'<span class="mini-pill">Date only</span>'}
          ${group.temperatureRequired?'<span class="mini-pill temperature-time-label">Hot food</span>':''}
        </div>
      </th>

      <td class="effort-single-value">
        <div class="effort-value-wrap">
          <input class="effort-template-input" type="number" min="1" step="5" placeholder="—" value="${Number(draft.effortMinutes)>0?Number(draft.effortMinutes):''}">
          <span>min</span>
        </div>
      </td>

      ${BULK_DAY_ORDER.map(day=>{
        const time=draft.dayTimes[day]||'';
        return `<td class="effort-day-time-cell ${time?'has-time':'no-time'}" data-day="${day}">
          <input class="effort-day-time-input" data-day="${day}" type="time" step="60" value="${escapeHtml(time)}" aria-label="${BULK_DAY_LABELS[day]} task time">
          ${effortSlotBadge(time)}
        </td>`;
      }).join('')}
    </tr>`;
  }).join('')||'<tr><td colspan="9" class="muted report-empty-cell">No tasks match this filter.</td></tr>';

  updateEffortSummary();
}
async function loadEffortAllocation(){
  try{
    updateEffortWeekUI();
    setInlineMessage($('#effortResult'),'');
    $('#effortMatrixRows').innerHTML='<tr><td colspan="9" class="muted report-empty-cell">Loading master weekly task setup…</td></tr>';

    effortRowsData=await getWeeklyTemplate();
    effortDirty.clear();

    const selected=$('#effortSlotFilter').value||'all';
    $('#effortSlotFilter').innerHTML='<option value="all">All slots</option>'+
      SLOT_DEFS.map(s=>`<option value="${s.id}">${escapeHtml(slotLabelForDate(s.id,effortWeekDates()[0]))}</option>`).join('');
    if([...$('#effortSlotFilter').options].some(o=>o.value===selected)) $('#effortSlotFilter').value=selected;

    renderEffortMatrix();
  }catch(error){
    console.error(error);
    setInlineMessage($('#effortResult'),'Could not load the weekly task setup.','error');
  }
}
function readEffortGroupDraft(rowEl,{copyMonday=false}={}){
  const key=rowEl.dataset.effortGroup;
  const group=effortGroups().find(g=>g.key===key);
  if(!group) return;

  const effortMinutes=Number(rowEl.querySelector('.effort-template-input')?.value)>0
    ?Number(rowEl.querySelector('.effort-template-input').value)
    :null;

  const dayTimes={};
  BULK_DAY_ORDER.forEach(day=>{
    dayTimes[day]=String(rowEl.querySelector(`.effort-day-time-input[data-day="${day}"]`)?.value||'');
  });

  if(copyMonday&&dayTimes.mon){
    BULK_DAY_ORDER.slice(1).forEach(day=>dayTimes[day]=dayTimes.mon);
  }

  const originalTimes=group.defaultDayTimes;
  const sameEffort=Number(effortMinutes||0)===Number(group.defaultEffort||0);
  const sameTimes=BULK_DAY_ORDER.every(day=>(dayTimes[day]||'')===(originalTimes[day]||''));

  if(sameEffort&&sameTimes){
    effortDirty.delete(key);
  }else{
    effortDirty.set(key,{effortMinutes,dayTimes});
  }
}
async function saveWeeklyEffortSetup(){
  // Save the complete master-week model, not only touched rows. This guarantees
  // missing weekday rules are created from the visible times.
  const groups=effortGroups();
  const changes=groups.map(group=>({group,draft:effortDraftForGroup(group)}));

  const invalid=changes.find(({draft})=>
    BULK_DAY_ORDER.some(day=>draft.dayTimes[day]&&!validHHMM(draft.dayTimes[day]))
  );
  if(invalid){
    showToast('Please use valid HH:MM task times.','warning');
    return;
  }

  const ok=await confirmAction({
    title:'Save complete weekly task setup?',
    message:`Save ${changes.length} master task${changes.length===1?'':'s'} across Monday–Sunday?`,
    details:'A day with a time is active. A blank time is removed from that weekday. Each time automatically determines the operational slot and task order.',
    confirmText:'Save Weekly Setup'
  });
  if(!ok) return;

  const btn=$('#effortSaveTemplate');
  setButtonLoading(btn,true,'Saving…');

  try{
    let activeSaved=0,hiddenSaved=0;
    const dates=effortWeekDates();

    for(const {group,draft} of changes){
      const sourceBase=effortBaseRule(group.template);

      for(let i=0;i<BULK_DAY_ORDER.length;i++){
        const day=BULK_DAY_ORDER[i];
        const time=draft.dayTimes[day]||'';
        const sourceDate=dates[i];
        const effectiveFrom=sourceDate<todayISO()
          ?nextSameWeekdayOnOrAfter(sourceDate,todayISO())
          :sourceDate;
        const currentRule=group.byDay[day]?.rule;
        const currentlyActive=Boolean(currentRule&&currentRule.active!==false);

        if(time){
          const slotId=slotFromTime(time,currentRule?.slotId||sourceBase.slotId||'S1');
          await saveFutureRule(group.templateTaskId,effectiveFrom,{
            active:true,
            taskName:group.taskName,
            slotId,
            assignedTo:currentRule?.assigneeId||sourceBase.assigneeId||'',
            effortMinutes:draft.effortMinutes,
            sourceTime:time
          },user);
          activeSaved++;
        }else if(currentlyActive){
          await stopTaskFuture(group.templateTaskId,effectiveFrom,user);
          hiddenSaved++;
        }
      }
    }

    setInlineMessage(
      $('#effortResult'),
      `✓ Weekly task setup saved. ${activeSaved} active task-day rule(s) saved and ${hiddenSaved} task-day rule(s) hidden.`,
      'success'
    );
    effortDirty.clear();
    await loadEffortAllocation();
    await bindDate();
  }catch(error){
    console.error(error);
    setInlineMessage($('#effortResult'),error.message||'Could not save weekly task setup.','error');
  }finally{
    setButtonLoading(btn,false);
  }
}

$('#effortPrevWeek').onclick=()=>{effortWeekAnchor=addDaysISO(effortWeekStart(effortWeekAnchor),-7);loadEffortAllocation();};
$('#effortNextWeek').onclick=()=>{effortWeekAnchor=addDaysISO(effortWeekStart(effortWeekAnchor),7);loadEffortAllocation();};
$('#effortThisWeek').onclick=()=>{effortWeekAnchor=todayISO();loadEffortAllocation();};
$('#effortWeekPicker').onchange=e=>{if(e.target.value){effortWeekAnchor=e.target.value;loadEffortAllocation();}};
$('#effortLoadWeek').onclick=loadEffortAllocation;

$('#effortMatrixRows').addEventListener('input',e=>{
  const row=e.target.closest('tr[data-effort-group]');
  if(!row) return;

  if(e.target.classList.contains('effort-template-input')){
    readEffortGroupDraft(row);
    row.classList.add('effort-row-dirty');
    updateEffortSummary();
  }
});
$('#effortMatrixRows').addEventListener('change',e=>{
  const row=e.target.closest('tr[data-effort-group]');
  if(!row) return;

  if(e.target.classList.contains('effort-day-time-input')){
    const day=e.target.dataset.day;
    if(day==='mon'&&e.target.value){
      // Monday is the quick-fill master: populate all other weekdays.
      BULK_DAY_ORDER.slice(1).forEach(other=>{
        const input=row.querySelector(`.effort-day-time-input[data-day="${other}"]`);
        if(input) input.value=e.target.value;
      });
      readEffortGroupDraft(row,{copyMonday:true});
    }else{
      readEffortGroupDraft(row);
    }
    renderEffortMatrix(); // re-order rows immediately based on Monday/first active time
  }
});
$('#effortSlotFilter').onchange=renderEffortMatrix;
$('#effortOnlyMissing').onchange=renderEffortMatrix;
$('#effortResetFilters').onclick=()=>{
  $('#effortSlotFilter').value='all';
  $('#effortOnlyMissing').checked=false;
  renderEffortMatrix();
};
$('#effortSaveTemplate').onclick=saveWeeklyEffortSetup;


$('#repairTemperatureTasks').onclick=async()=>{
  const btn=$('#repairTemperatureTasks');
  setButtonLoading(btn,true,'Repairing…');
  try{
    const result=await reconcileTemperatureTasks();
    await loadEffortAllocation();
    await bindDate();
    setInlineMessage(
      $('#effortResult'),
      `✓ Temperature tasks repaired. ${result.legacyRemoved.length} legacy temperature template(s) removed and exactly ${result.canonicalCount} hourly hot-food temperature tasks confirmed.`,
      'success'
    );
    showToast('Temperature task list repaired.','success');
  }catch(error){
    console.error(error);
    setInlineMessage($('#effortResult'),error.message||'Could not repair temperature tasks.','error');
  }finally{
    setButtonLoading(btn,false);
  }
};


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

await ensureV30TaskModel();
  await ensureV321TemperatureNames();
  await ensureV322TemperatureRepair();
  await reconcileTemperatureTasks();
  await loadPeople();
  { const a=await getStaffAvailability(); staffAvailability=a?.week||structuredClone(DEFAULT_STAFF_AVAILABILITY); }
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
