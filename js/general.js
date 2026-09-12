import {
  SLOT_DEFS,todayISO,addDaysISO,formatLongDate,weekStartISO,weekEndISO,slotLabelForDate,slotEndForDate,
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

let expandedSlots=new Set();
let focusedSlotId='';
let lastRenderedDate='';
let lastCurrentSlotId='';
let slotTapTimer=null;
let lastSlotTap={id:'',time:0};

let alertsArmed=false;
let audioContext=null;
let wakeLock=null;
let appToday=todayISO();
let slotAlertTimers=[];
let slotBoundaryTimer=null;

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

function hmToMinutes(value=''){
  const m=String(value).match(/(\d{1,2}):(\d{2})/);
  return m?Number(m[1])*60+Number(m[2]):null;
}
function nowMinutes(){
  const d=new Date();
  return d.getHours()*60+d.getMinutes();
}
function slotForNow(date=selectedDate){
  if(date!==todayISO()) return '';
  const mins=nowMinutes();

  for(const slot of SLOT_DEFS){
    const start=hmToMinutes(slot.start);
    const end=hmToMinutes(slotEndForDate(slot.id,date));
    if(mins>=start&&mins<end) return slot.id;
  }

  // Before opening, preview the opening slot. After close, keep the
  // final slot visible because any unfinished closing tasks need attention.
  const firstStart=hmToMinutes(SLOT_DEFS[0].start);
  if(mins<firstStart) return SLOT_DEFS[0].id;
  return SLOT_DEFS[SLOT_DEFS.length-1].id;
}
function liveStatus(task){
  if(task.status==='completed'||task.status==='cancelled') return task.status;

  const today=todayISO();
  if(task.date<today) return 'missed';
  if(task.date>today) return 'upcoming';

  const slot=SLOT_DEFS.find(s=>s.id===task.slotId);
  if(!slot) return 'upcoming';

  const start=hmToMinutes(slot.start);
  const end=hmToMinutes(slotEndForDate(task.slotId,task.date));
  const mins=nowMinutes();

  if(mins>=end) return 'overdue';
  if(mins>=start) return 'due';
  return 'upcoming';
}

function defaultExpandedSlot(tasks){
  if(selectedDate===todayISO()) return slotForNow(selectedDate);
  return SLOT_DEFS.find(slot=>tasks.some(t=>t.slotId===slot.id&&t.status!=='cancelled'))?.id||'';
}
function prepareSlotState(tasks){
  const dateChanged=lastRenderedDate!==selectedDate;
  const current=selectedDate===todayISO()?slotForNow(selectedDate):'';

  if(dateChanged){
    expandedSlots.clear();
    focusedSlotId='';
    document.body.classList.remove('general-slot-focus-active');
    const initial=defaultExpandedSlot(tasks);
    if(initial) expandedSlots.add(initial);
  }else if(current&&current!==lastCurrentSlotId){
    // Operational handover:
    // normal view moves to the new current slot;
    // focus view remains full-screen and follows the new current slot.
    expandedSlots.clear();
    expandedSlots.add(current);
    if(focusedSlotId) focusedSlotId=current;
  }

  lastRenderedDate=selectedDate;
  lastCurrentSlotId=current;
}

function attentionText(rows){
  const overdue=rows.filter(t=>t.status==='overdue'||t.status==='missed').length;
  const due=rows.filter(t=>t.status==='due').length;
  if(overdue) return `${overdue} overdue`;
  if(due) return `${due} due now`;
  return '';
}

function renderDay(tasks,{skipAlertCheck=false}={}){
  const liveTasks=tasks.map(t=>({...t,status:liveStatus(t)}));
  currentTasks=liveTasks;
  prepareSlotState(liveTasks);

  const active=liveTasks.filter(t=>t.status!=='cancelled');
  const done=active.filter(t=>t.status==='completed').length;
  $('#overallPct').textContent=`${percent(active)}%`;
  $('#overallCount').textContent=`${done} of ${active.length} completed`;
  $('#completedCount').textContent=String(done);
  $('#remainingCount').textContent=String(active.filter(t=>t.status!=='completed').length);
  $('#overdueCount').textContent=String(active.filter(t=>t.status==='overdue'||t.status==='missed').length);

  const currentSlot=selectedDate===todayISO()?slotForNow(selectedDate):'';

  $('#slotSchedule').innerHTML=SLOT_DEFS.map(slot=>{
    const rows=liveTasks.filter(t=>t.slotId===slot.id&&t.status!=='cancelled');
    if(!rows.length) return '';

    const isCurrent=slot.id===currentSlot;
    const expanded=expandedSlots.has(slot.id)||focusedSlotId===slot.id;
    const focused=focusedSlotId===slot.id;
    const attention=attentionText(rows);
    const incomplete=rows.filter(t=>t.status!=='completed').length;

    return `<section class="ops-slot-card live-slot-card ${isCurrent?'is-current-slot':''} ${expanded?'is-expanded':'is-collapsed'} ${focused?'is-slot-focused':''}" data-slot="${slot.id}">
      <div class="ops-slot-head live-slot-head" role="button" tabindex="0" aria-expanded="${expanded?'true':'false'}" title="Tap once to expand/collapse. Double-tap for focus view.">
        <div class="live-slot-title">
          <div class="live-slot-kicker-row">
            <span class="slot-kicker">Operational slot</span>
            ${isCurrent?'<span class="current-slot-chip">CURRENT</span>':''}
            ${attention?`<span class="slot-attention-chip">${escapeHtml(attention)}</span>`:''}
          </div>
          <h3>${escapeHtml(slotLabelForDate(slot.id,selectedDate))}</h3>
          <p>${rows.length} task${rows.length===1?'':'s'} · ${incomplete} remaining</p>
        </div>

        <div class="live-slot-head-actions">
          <span class="slot-progress">${rows.filter(t=>t.status==='completed').length}/${rows.length} complete</span>
          ${isCurrent&&!focused?'<span class="double-tap-hint">Double-tap for focus</span>':''}
          ${focused?'<button class="btn secondary small exit-slot-focus" type="button">Normal view</button>':''}
          <span class="slot-chevron" aria-hidden="true">${expanded?'▴':'▾'}</span>
        </div>
      </div>

      <div class="ops-task-list live-slot-task-list">
        ${rows.map(t=>`<article class="ops-task-row ${t.status==='overdue'?'is-overdue-task':''}">
          <div class="ops-task-main">
            <strong>${escapeHtml(t.taskName)}${t.checkpoint?` · ${escapeHtml(t.checkpoint)}`:''}</strong>
            <div class="ops-task-meta">
              <span class="${!t.assignedTo?'general-unassigned':''}">${escapeHtml(t.assignedName||'Unassigned')}</span>
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

  document.body.classList.toggle('general-slot-focus-active',Boolean(focusedSlotId));

}

function toggleSlot(slotId){
  if(focusedSlotId) return;
  if(expandedSlots.has(slotId)) expandedSlots.delete(slotId);
  else expandedSlots.add(slotId);
  renderDay(currentTasks,{skipAlertCheck:true});
}

function toggleSlotFocus(slotId){
  if(focusedSlotId===slotId){
    focusedSlotId='';
  }else{
    focusedSlotId=slotId;
    expandedSlots.add(slotId);
  }
  renderDay(currentTasks,{skipAlertCheck:true});
}

function slotAlertStorageKey(){
  return `northTerraceSlotAlerts:${todayISO()}`;
}
function alertedMilestones(){
  try{return new Set(JSON.parse(localStorage.getItem(slotAlertStorageKey())||'[]'));}
  catch{return new Set();}
}
function saveAlertedMilestones(set){
  try{localStorage.setItem(slotAlertStorageKey(),JSON.stringify([...set]));}catch{}
}
function clearSlotAlertTimers(){
  slotAlertTimers.forEach(id=>clearTimeout(id));
  slotAlertTimers=[];
}
function clearSlotBoundaryTimer(){
  if(slotBoundaryTimer){
    clearTimeout(slotBoundaryTimer);
    slotBoundaryTimer=null;
  }
}
function slotEndDate(slotId,date=todayISO()){
  const end=slotEndForDate(slotId,date);
  const [hh,mm]=String(end).split(':').map(Number);
  const d=new Date(date+'T12:00:00');
  d.setHours(hh,mm,0,0);
  return d;
}
function incompleteForSlot(slotId){
  return currentTasks.filter(t=>
    t.slotId===slotId &&
    t.status!=='completed' &&
    t.status!=='cancelled'
  );
}
function milestoneCopy(minutesBefore,slotLabel,count){
  if(minutesBefore===60){
    return {title:`${slotLabel}: 1 hour remaining`,body:`${count} task${count===1?'':'s'} still incomplete.`};
  }
  if(minutesBefore===30){
    return {title:`${slotLabel}: 30 minutes remaining`,body:`${count} task${count===1?'':'s'} still incomplete.`};
  }
  return {title:`${slotLabel}: tasks now due`,body:`${count} task${count===1?'':'s'} still incomplete at the end of this slot.`};
}

async function ensureAudioContext(){
  if(!audioContext){
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx) return false;
    audioContext=new Ctx();
  }
  if(audioContext.state==='suspended') await audioContext.resume();
  return audioContext.state==='running';
}
async function playAlarm({due=false,test=false}={}){
  if(!alertsArmed) return;
  try{
    if(!await ensureAudioContext()) return;
    const start=audioContext.currentTime+0.02;
    const count=due?3:1;

    for(let i=0;i<count;i++){
      const osc=audioContext.createOscillator();
      const gain=audioContext.createGain();
      osc.type='sine';
      osc.frequency.setValueAtTime(test?720:880,start+i*0.30);
      gain.gain.setValueAtTime(0.0001,start+i*0.30);
      gain.gain.exponentialRampToValueAtTime(test?0.10:0.22,start+i*0.30+0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001,start+i*0.30+0.18);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(start+i*0.30);
      osc.stop(start+i*0.30+0.20);
    }
  }catch(error){
    console.warn('Alarm sound unavailable',error);
  }
}
async function showSystemNotification(title,body,tag){
  if(!('Notification' in window)||Notification.permission!=='granted') return;
  try{
    if('serviceWorker' in navigator){
      const registration=await navigator.serviceWorker.ready;
      await registration.showNotification(title,{
        body,
        tag,
        renotify:false,
        requireInteraction:true,
        vibrate:[220,110,220]
      });
    }else{
      new Notification(title,{body,tag});
    }
  }catch(error){
    console.warn('System notification unavailable',error);
  }
}
async function fireSlotMilestone(slotId,minutesBefore){
  if(!alertsArmed||mode!=='day'||selectedDate!==todayISO()) return;

  const remaining=incompleteForSlot(slotId);
  if(!remaining.length) return;

  const key=`${slotId}:${minutesBefore}`;
  const fired=alertedMilestones();
  if(fired.has(key)) return;

  fired.add(key);
  saveAlertedMilestones(fired);

  const label=slotLabelForDate(slotId,todayISO());
  const copy=milestoneCopy(minutesBefore,label,remaining.length);

  showToast(copy.body,minutesBefore===0?'warning':'info',{title:copy.title});
  await playAlarm({due:minutesBefore===0});
  await showSystemNotification(copy.title,copy.body,`north-terrace-${todayISO()}-${slotId}-${minutesBefore}`);
}
function scheduleSlotAlerts(){
  clearSlotAlertTimers();
  if(!alertsArmed||mode!=='day'||selectedDate!==todayISO()) return;

  const now=Date.now();
  const fired=alertedMilestones();

  for(const slot of SLOT_DEFS){
    const end=slotEndDate(slot.id,todayISO()).getTime();
    const milestones=[
      {minutesBefore:60,at:end-60*60*1000},
      {minutesBefore:30,at:end-30*60*1000},
      {minutesBefore:0,at:end}
    ];

    for(const milestone of milestones){
      const key=`${slot.id}:${milestone.minutesBefore}`;
      if(fired.has(key)||milestone.at<=now) continue;

      const timer=setTimeout(
        ()=>fireSlotMilestone(slot.id,milestone.minutesBefore),
        milestone.at-now
      );
      slotAlertTimers.push(timer);
    }
  }
}
function scheduleNextSlotBoundary(){
  clearSlotBoundaryTimer();
  if(mode!=='day'||selectedDate!==todayISO()) return;

  const now=Date.now();
  const futureEnds=SLOT_DEFS
    .map(slot=>slotEndDate(slot.id,todayISO()).getTime())
    .filter(time=>time>now);

  if(!futureEnds.length) return;

  const next=Math.min(...futureEnds);
  slotBoundaryTimer=setTimeout(()=>{
    // Exact slot handover. No 20/30-second polling is needed.
    if(currentTasks.length) renderDay(currentTasks,{skipAlertCheck:true});
    scheduleNextSlotBoundary();
    scheduleSlotAlerts();
  },Math.max(250,next-now+150));
}

async function requestWakeLock(){
  if(!alertsArmed||!('wakeLock' in navigator)||document.visibilityState!=='visible') return;
  try{
    if(wakeLock&&!wakeLock.released) return;
    wakeLock=await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release',()=>{wakeLock=null;});
  }catch(error){
    console.warn('Screen wake lock unavailable',error);
  }
}
async function releaseWakeLock(){
  try{if(wakeLock&&!wakeLock.released) await wakeLock.release();}catch{}
  wakeLock=null;
}
function updateAlertButton(){
  const btn=$('#enableAlerts');
  if(!btn) return;
  btn.textContent=alertsArmed?'Alerts On':'Enable Alerts';
  btn.classList.toggle('alerts-active',alertsArmed);
  btn.title=alertsArmed
    ?'Overdue sound and notifications are enabled. Tap to pause.'
    :'Enable overdue sound, notifications and keep-screen-awake support.';
}

async function enableAlerts(){
  let notificationState='unsupported';

  if('Notification' in window){
    notificationState=Notification.permission;
    if(notificationState==='default'){
      try{notificationState=await Notification.requestPermission();}catch{}
    }
  }

  alertsArmed=true;
  await ensureAudioContext();
  await requestWakeLock();
  updateAlertButton();
  await playAlarm({test:true});
  scheduleSlotAlerts();
  scheduleNextSlotBoundary();

  const notificationMessage=notificationState==='granted'
    ?'Sound and system notifications are enabled.'
    :notificationState==='denied'
      ?'Sound is enabled. Browser notifications are blocked in site settings.'
      :'Sound alerts are enabled on this device.';

  showToast(`${notificationMessage} One reminder is scheduled 1 hour before the slot ends, one at 30 minutes, and one at the due time. The due-time alarm is three beeps once only.`,'success',{title:'Live alerts enabled'});
}
async function disableAlerts(){
  alertsArmed=false;
  clearSlotAlertTimers();
  await releaseWakeLock();
  updateAlertButton();
  showToast('Overdue sound alerts are paused.','info',{title:'Alerts paused'});
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
  const completeBtn=e.target.closest('.complete-public');
  if(completeBtn){
    const task=currentTasks.find(t=>t.id===completeBtn.dataset.id);
    if(task) completeFromGeneral(task);
    return;
  }

  const exitBtn=e.target.closest('.exit-slot-focus');
  if(exitBtn){
    const card=exitBtn.closest('.live-slot-card');
    if(card) toggleSlotFocus(card.dataset.slot);
    return;
  }

  const head=e.target.closest('.live-slot-head');
  if(!head) return;

  const card=head.closest('.live-slot-card');
  if(!card) return;
  const slotId=card.dataset.slot;
  const now=Date.now();

  if(lastSlotTap.id===slotId&&now-lastSlotTap.time<340){
    if(slotTapTimer){clearTimeout(slotTapTimer);slotTapTimer=null;}
    lastSlotTap={id:'',time:0};
    toggleSlotFocus(slotId);
    return;
  }

  lastSlotTap={id:slotId,time:now};
  if(slotTapTimer) clearTimeout(slotTapTimer);
  slotTapTimer=setTimeout(()=>{
    slotTapTimer=null;
    if(lastSlotTap.id===slotId) lastSlotTap={id:'',time:0};
    toggleSlot(slotId);
  },280);
});

$('#slotSchedule').addEventListener('keydown',e=>{
  const head=e.target.closest('.live-slot-head');
  if(!head) return;
  if(e.key==='Enter'||e.key===' '){
    e.preventDefault();
    const slotId=head.closest('.live-slot-card')?.dataset.slot;
    if(slotId) toggleSlot(slotId);
  }
});

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&focusedSlotId){
    const old=focusedSlotId;
    focusedSlotId='';
    renderDay(currentTasks,{skipAlertCheck:true});
    showToast(`${slotLabelForDate(old,selectedDate)} returned to normal view.`,'info');
  }
});

$('#enableAlerts').onclick=async()=>{
  if(alertsArmed) await disableAlerts();
  else await enableAlerts();
};

document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible'){
    if(alertsArmed){
      requestWakeLock();
      scheduleSlotAlerts();
    }
    scheduleNextSlotBoundary();
    if(mode==='day'&&selectedDate===todayISO()&&currentTasks.length){
      renderDay(currentTasks,{skipAlertCheck:true});
    }
  }
});

async function bindDay(){
  if(unsubscribe){unsubscribe();unsubscribe=null;}
  clearSlotBoundaryTimer();
  clearSlotAlertTimers();
  $('#slotSchedule').innerHTML='<div class="card elevated"><div class="empty-state"><h3>Loading schedule…</h3><p>Connecting to the live task list.</p></div></div>';
  if(selectedDate>=todayISO()) await ensureTasksForDate(selectedDate);
  unsubscribe=watchTasksForDate(
    selectedDate,
    rows=>{
      renderDay(rows);
      scheduleNextSlotBoundary();
      scheduleSlotAlerts();
    },
    ()=>showToast('Live schedule updates are unavailable.','error')
  );
}

async function renderWeek(){
  if(unsubscribe){unsubscribe();unsubscribe=null;}
  clearSlotBoundaryTimer();
  clearSlotAlertTimers();
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
$('#todayTab').onclick=async()=>{mode='day';focusedSlotId='';lastRenderedDate='';clearSlotBoundaryTimer();clearSlotAlertTimers();$('#todayTab').classList.add('active');$('#weekTab').classList.remove('active');await refresh();};
$('#weekTab').onclick=async()=>{mode='week';focusedSlotId='';clearSlotBoundaryTimer();clearSlotAlertTimers();document.body.classList.remove('general-slot-focus-active');$('#weekTab').classList.add('active');$('#todayTab').classList.remove('active');await refresh();};
$('#prevDate').onclick=async()=>{selectedDate=addDaysISO(selectedDate,mode==='day'?-1:-7);lastRenderedDate='';await refresh();};
$('#nextDate').onclick=async()=>{selectedDate=addDaysISO(selectedDate,mode==='day'?1:7);lastRenderedDate='';await refresh();};
$('#goToday').onclick=async()=>{selectedDate=todayISO();lastRenderedDate='';await refresh();};
$('#datePicker').onchange=async e=>{if(e.target.value){selectedDate=e.target.value;lastRenderedDate='';await refresh();}};

function clock(){const e=$('#liveClock');if(e)e.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});}

function minuteHousekeeping(){
  clock();

  const nowToday=todayISO();
  if(nowToday!==appToday){
    const wasFollowingToday=selectedDate===appToday;
    appToday=nowToday;

    if(wasFollowingToday&&mode==='day'){
      selectedDate=nowToday;
      lastRenderedDate='';
      refresh();
    }
  }
}

updateAlertButton();
clock();
setInterval(minuteHousekeeping,60000);
initNetworkStatus();
registerAppServiceWorker();
refresh();
