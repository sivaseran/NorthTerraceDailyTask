import {
  SLOT_DEFS,todayISO,addDaysISO,formatLongDate,weekStartISO,weekEndISO,slotLabelForDate,
  ensureTasksForDate,getTasksForDate,watchTasksForDate,getPlannedTasksForDate,percent,dayKey
} from './store.js';
import {loginWithPin} from './auth.js';
import {completeTask} from './store.js';
import {escapeHtml,statusView,showToast,confirmAction,promptPin,initNetworkStatus,registerAppServiceWorker} from './ui.js';

const $=s=>document.querySelector(s);
let selectedDate=todayISO();
let mode='day';
let unsubscribe=null;
let currentTasks=[];

function navText(){
  if(mode==='day') return formatLongDate(selectedDate);
  const a=weekStartISO(selectedDate),b=weekEndISO(selectedDate);
  const da=new Date(a+'T12:00:00'), db=new Date(b+'T12:00:00');
  return `${da.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} – ${db.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}`;
}
function updateNav(){
  $('#navDateText').textContent=navText();
  $('#datePicker').value=selectedDate;
  $('#pageTitle').textContent=mode==='day'?(selectedDate===todayISO()?'Today at a glance':'Day at a glance'):'Week at a glance';
  $('#dateLabel').textContent=mode==='day'?formatLongDate(selectedDate):navText();
}
function fmtEffort(v){return Number(v)>0?`${Number(v)} min`:'Effort not set';}

function renderDay(tasks){
  currentTasks=tasks;
  const active=tasks.filter(t=>t.status!=='cancelled');
  const done=active.filter(t=>t.status==='completed').length;
  $('#overallPct').textContent=`${percent(active)}%`;
  $('#overallCount').textContent=`${done} of ${active.length} completed`;
  $('#completedCount').textContent=String(done);
  $('#remainingCount').textContent=String(active.filter(t=>t.status!=='completed').length);
  $('#overdueCount').textContent=String(active.filter(t=>t.status==='overdue'||t.status==='missed').length);

  $('#slotSchedule').innerHTML=SLOT_DEFS.map(slot=>{
    const rows=tasks.filter(t=>t.slotId===slot.id&&t.status!=='cancelled');
    if(!rows.length) return '';
    return `<section class="ops-slot-card">
      <div class="ops-slot-head">
        <div><span class="slot-kicker">Operational slot</span><h3>${escapeHtml(slotLabelForDate(slot.id,selectedDate))}</h3><p>${rows.length} task${rows.length===1?'':'s'}</p></div>
        <span class="slot-progress">${rows.filter(t=>t.status==='completed').length}/${rows.length} complete</span>
      </div>
      <div class="ops-task-list">
        ${rows.map(t=>`<article class="ops-task-row">
          <div class="ops-task-main">
            <strong>${escapeHtml(t.taskName)}${t.checkpoint?` · ${escapeHtml(t.checkpoint)}`:''}</strong>
            <div class="ops-task-meta">
              <span>${escapeHtml(t.assignedName||'Unassigned')}</span>
              <span>•</span><span>${escapeHtml(fmtEffort(t.effortMinutes))}</span>
              ${t.photoRequired?'<span class="mini-pill photo-pill">📷 Photo</span>':''}
              ${t.completedByName?`<span>• Completed by ${escapeHtml(t.completedByName)}</span>`:''}
            </div>
          </div>
          <div class="ops-task-actions">
            ${statusView(t.status)}
            ${selectedDate===todayISO()&&t.status!=='completed'&&t.status!=='missed'?`<button class="btn small complete-public" data-id="${t.id}" type="button">Complete</button>`:''}
          </div>
        </article>`).join('')}
      </div>
    </section>`;
  }).join('') || `<div class="card elevated"><div class="empty-state"><h3>No saved schedule for this date</h3><p>${selectedDate<todayISO()?'Historical records are available only from dates when the app generated the daily schedule.':'No tasks are planned for this day.'}</p></div></div>`;
}

async function completeFromGeneral(task){
  const pin=await promptPin({title:'Complete task',message:`Enter your staff PIN to complete “${task.taskName}”.`});
  if(!pin) return;
  try{
    const user=await loginWithPin(pin);
    if(user.role!=='staff'&&user.role!=='assignee') throw new Error('Use a staff/assignee PIN to complete tasks.');
    if(task.assignedTo&&task.assignedTo!==user.id){
      const ok=await confirmAction({
        title:'Complete another person’s task?',
        message:`This task is assigned to ${task.assignedName||'another person'}. Complete it as ${user.name||'this user'}?`,
        details:'The app will keep both the assigned person and the actual completer in the audit history.',
        confirmText:'Complete Task'
      });
      if(!ok) return;
    }
    await completeTask(task.id,user);
    showToast(`Completed by ${user.name||'staff'}.`,'success',{title:'Task completed'});
  }catch(error){
    showToast(error.message||'Could not complete the task.','error',{title:'Completion failed'});
  }
}

$('#slotSchedule').addEventListener('click',e=>{
  const btn=e.target.closest('.complete-public'); if(!btn) return;
  const task=currentTasks.find(t=>t.id===btn.dataset.id); if(task) completeFromGeneral(task);
});

async function bindDay(){
  if(unsubscribe){unsubscribe();unsubscribe=null;}
  $('#slotSchedule').innerHTML='<div class="card elevated"><div class="empty-state"><h3>Loading schedule…</h3><p>Connecting to the live task list.</p></div></div>';
  if(selectedDate>=todayISO()) await ensureTasksForDate(selectedDate);
  unsubscribe=watchTasksForDate(selectedDate,renderDay,()=>showToast('Live schedule updates are unavailable.','error'));
}

async function renderWeek(){
  if(unsubscribe){unsubscribe();unsubscribe=null;}
  const start=weekStartISO(selectedDate);
  const dates=Array.from({length:7},(_,i)=>addDaysISO(start,i));
  const plans=[];
  for(const date of dates){
    let rows=await getTasksForDate(date,{ensure:false});
    if(!rows.length&&date>=todayISO()) rows=await getPlannedTasksForDate(date);
    plans.push({date,rows});
  }
  $('#weekSummary').innerHTML=plans.map(({date,rows})=>`<article class="week-day-card ${date===todayISO()?'is-today':''}">
    <div class="week-day-top"><strong>${dayKey(date).toUpperCase()}</strong>${date===todayISO()?'<span class="today-chip">Today</span>':''}</div>
    <div class="week-day-total">${rows.filter(t=>t.status!=='cancelled').length}</div>
    <div class="week-day-label">${dateFromText(date)}</div>
    <div class="week-day-split"><span>${rows.filter(t=>t.status==='completed').length} done</span><span>${rows.filter(t=>t.status==='overdue'||t.status==='missed').length} attention</span></div>
  </article>`).join('');

  $('#weekSchedule').innerHTML=SLOT_DEFS.map(slot=>`<section class="week-shift-card">
    <div class="week-shift-head"><div class="shift-title-wrap"><span class="shift-icon">◷</span><div><span class="shift-kicker">FIXED SLOT</span><h3>${escapeHtml(slot.label)}</h3><p>Named task ownership across the week</p></div></div></div>
    <div class="week-table-wrap"><table class="week-table"><thead><tr><th class="week-task-head">Task</th>${plans.map(p=>`<th class="${p.date===todayISO()?'is-today-col':''}">${dayKey(p.date)}</th>`).join('')}</tr></thead>
    <tbody>${weekRowsForSlot(slot.id,plans)}</tbody></table></div>
  </section>`).join('');
}
function dateFromText(date){return new Date(date+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'});}
function weekRowsForSlot(slotId,plans){
  const names=[...new Set(plans.flatMap(p=>p.rows.filter(t=>t.slotId===slotId&&t.status!=='cancelled').map(t=>t.taskName)))];
  if(!names.length) return `<tr><td colspan="8"><span class="muted">No tasks in this slot.</span></td></tr>`;
  return names.map(name=>`<tr><td class="week-task-cell"><div class="week-task-name">${escapeHtml(name)}</div></td>${
    plans.map(p=>{
      const rows=p.rows.filter(t=>t.slotId===slotId&&t.taskName===name&&t.status!=='cancelled');
      if(!rows.length) return `<td class="${p.date===todayISO()?'is-today-col':''}"><span class="week-off">—</span></td>`;
      const assignees=[...new Set(rows.map(r=>r.assignedName||'Unassigned'))];
      return `<td class="${p.date===todayISO()?'is-today-col':''}"><span class="assignment-pill">${escapeHtml(assignees.join(', '))}</span></td>`;
    }).join('')
  }</tr>`).join('');
}

async function refresh(){
  updateNav();
  if(mode==='day'){ $('#todayView').hidden=false;$('#weekView').hidden=true;await bindDay(); }
  else{ $('#todayView').hidden=true;$('#weekView').hidden=false;await renderWeek(); }
}
$('#todayTab').onclick=async()=>{mode='day';$('#todayTab').classList.add('active');$('#weekTab').classList.remove('active');await refresh();};
$('#weekTab').onclick=async()=>{mode='week';$('#weekTab').classList.add('active');$('#todayTab').classList.remove('active');await refresh();};
$('#prevDate').onclick=async()=>{selectedDate=addDaysISO(selectedDate,mode==='day'?-1:-7);await refresh();};
$('#nextDate').onclick=async()=>{selectedDate=addDaysISO(selectedDate,mode==='day'?1:7);await refresh();};
$('#goToday').onclick=async()=>{selectedDate=todayISO();await refresh();};
$('#datePicker').onchange=async e=>{if(e.target.value){selectedDate=e.target.value;await refresh();}};

function clock(){const e=$('#liveClock');if(e)e.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}
clock();setInterval(clock,30000);initNetworkStatus();registerAppServiceWorker();refresh();
