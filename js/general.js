import {ensureFinalV36Schedule} from './final-config.js';
import {
  SLOT_DEFS,todayISO,addDaysISO,formatLongDate,weekStartISO,weekEndISO,slotLabelForDate,slotEndForDate,
  ensureTasksForDate,getTasksForDate,watchTasksForDate,getPlannedTasksForDate,percent,dayKey,slotForClock
} from './store.js';
import {loginWithPin} from './auth.js';
import {completeTask} from './store.js';
import {escapeHtml,statusView,showToast,confirmAction,promptPin,initNetworkStatus,registerAppServiceWorker} from './ui.js';
import {ensureHotFoodDay} from './hot-food-engine.js';
import {completeHotFoodTask,renderStartHotFoodButton} from './hot-food-ui.js';
import {ensureSpecialTasksForDate,ensureSafeUpgrades} from './special-tasks.js';
import {completeComplianceTask} from './compliance-ui.js';
import {reportCategoryForTask} from './task-category.js';

await ensureFinalV36Schedule();
await ensureSafeUpgrades();

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

let alertsArmed=localStorage.getItem('ntAlertsEnabled')==='1';
const ALARM_PREF_KEY='ntShopAlarmPrefsV1';
const ALARM_TONES=new Set(['classic','double','chime','attention']);
function validAlarmPrefs(value){
  return {
    tone:ALARM_TONES.has(value?.tone)?value.tone:'classic',
    volume:Number.isFinite(Number(value?.volume))?Math.max(10,Math.min(100,Math.round(Number(value.volume)/5)*5)):55
  };
}
function loadAlarmPrefs(){
  try{return validAlarmPrefs(JSON.parse(localStorage.getItem(ALARM_PREF_KEY)||'{}'));}
  catch{return validAlarmPrefs({});}
}
let alarmPrefs=loadAlarmPrefs();
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
        ${rows.map(t=>`<article class="ops-task-row ${t.status==='overdue'?'is-overdue-task':''}" data-task-id="${escapeHtml(t.id)}">
          <div class="ops-task-main">
            <div class="task-title-and-category"><strong>${escapeHtml(t.taskName)}${t.checkpoint?` · ${escapeHtml(t.checkpoint)}`:''}</strong><small class="task-report-category" data-report-category="${escapeHtml(reportCategoryForTask(t))}">${escapeHtml(reportCategoryForTask(t))}</small></div>
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
  if(selectedDate===todayISO()) renderStartHotFoodButton(selectedDate,document.querySelector('#todayView'),async()=>{
    const pin=await promptPin({title:'Start Hot Food',message:'Enter your staff PIN.'}); if(!pin)return null;
    try{const u=await loginWithPin(pin); if(u.role!=='staff'&&u.role!=='assignee')throw new Error('Wrong PIN'); return u;}catch(e){showToast(e.message||'Wrong PIN','error');return null;}
  }).catch(()=>{});

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
// Oscillator-only alarm sounds: no external files or Firebase writes.
// The browser requires a user gesture to unlock Web Audio on some Android devices.
function alarmNotes(tone,due){
  const notes={
    classic:[[0,880,.18,'sine'],[.30,880,.18,'sine'],[.60,880,.18,'sine']],
    double:[[0,780,.12,'square'],[.22,780,.12,'square']],
    chime:[[0,660,.30,'sine'],[.28,880,.42,'sine']],
    attention:[[0,920,.19,'triangle'],[.27,640,.19,'triangle'],[.54,920,.19,'triangle']]
  };
  const selected=notes[tone]||notes.classic;
  return due?selected:[selected[0]];
}
async function playAlarm({due=false,test=false,prefs=alarmPrefs}={}){
  if(!alertsArmed&&!test) return false;
  try{
    if(!await ensureAudioContext()) return false;
    const choices=validAlarmPrefs(prefs);
    const start=audioContext.currentTime+0.025;
    const maximumGain=.14*(choices.volume/100);
    for(const [offset,pitch,duration,wave] of alarmNotes(choices.tone,due||test)){
      const time=start+offset;
      const osc=audioContext.createOscillator();
      const gain=audioContext.createGain();
      osc.type=wave;
      osc.frequency.setValueAtTime(pitch,time);
      gain.gain.setValueAtTime(.0001,time);
      gain.gain.exponentialRampToValueAtTime(maximumGain,time+.02);
      gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(time);
      osc.stop(time+duration+.02);
    }
    return true;
  }catch(error){
    console.warn('Alarm sound unavailable',error);
    return false;
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
function taskDueDate(task){
  const clock=task.sourceTime||task.checkpoint||slotEndForDate(task.slotId,task.date);
  const m=String(clock||'').match(/(\d{1,2}):(\d{2})/); if(!m)return null;
  const d=new Date(task.date+'T12:00:00');d.setHours(Number(m[1]),Number(m[2]),0,0);return d;
}
let overdueRepeatTimer=null,activeAlarmLoop=null;
function stopActiveAlarmLoop(){if(activeAlarmLoop){clearInterval(activeAlarmLoop);activeAlarmLoop=null;}}
function startActiveAlarmLoop(){stopActiveAlarmLoop();activeAlarmLoop=setInterval(()=>playAlarm({due:true}),4000);}
function showAlarmPanel(rows){
  let panel=document.querySelector('#shopAlarmPanel');
  if(!panel){panel=document.createElement('div');panel.id='shopAlarmPanel';panel.className='shop-alarm-panel';document.body.appendChild(panel);}
  panel.innerHTML=`<strong>⚠ ${rows.length} task${rows.length===1?'':'s'} require attention</strong><span>${rows.slice(0,3).map(x=>escapeHtml(x.taskName)).join(' · ')}</span><button type="button" class="btn shop-alarm-view">View Tasks</button><button type="button" class="btn secondary shop-alarm-stop">Stop Alarm</button>`;
  panel.hidden=false;
  const acknowledge=()=>{
    panel.hidden=true;stopActiveAlarmLoop();
    localStorage.setItem('ntAlarmAckTasks',JSON.stringify(rows.map(x=>x.id)));
    localStorage.setItem('ntAlarmAckUntil',String(Date.now()+10*60*1000));
    if(overdueRepeatTimer)clearTimeout(overdueRepeatTimer);
    overdueRepeatTimer=setTimeout(()=>fireOverdueAlarm(),10*60*1000);
  };
  panel.querySelector('.shop-alarm-stop').onclick=acknowledge;
  panel.querySelector('.shop-alarm-view').onclick=()=>{
    const first=rows[0];acknowledge();
    if(!first)return;
    expandedSlots.add(first.slotId);
    renderDay(currentTasks,{skipAlertCheck:true});
    const target=[...document.querySelectorAll('[data-task-id]')].find(n=>n.dataset.taskId===first.id);
    target?.scrollIntoView({behavior:'smooth',block:'center'});
    target?.classList.add('alarm-task-highlight');
    const button=target?.querySelector('.complete-public');button?.focus({preventScroll:true});
  };
}
async function fireTaskWarning(task,minutesBefore){
  if(!alertsArmed||task.status==='completed'||task.status==='cancelled')return;
  const key=`task:${task.id}:${minutesBefore}`,fired=alertedMilestones();if(fired.has(key))return;fired.add(key);saveAlertedMilestones(fired);
  const title=minutesBefore===30?'Task due in 30 minutes':minutesBefore===5?'Task due in 5 minutes':'Task is due now';
  showToast(task.taskName,minutesBefore===0?'warning':'info',{title});await playAlarm({due:minutesBefore===0});await showSystemNotification(title,task.taskName,`nt-${task.id}-${minutesBefore}`);
  if(minutesBefore===0) fireOverdueAlarm();
}
async function fireOverdueAlarm(){
  if(!alertsArmed){stopActiveAlarmLoop();return;}
  if(selectedDate!==todayISO()||mode!=='day'){stopActiveAlarmLoop();return;}
  const rows=currentTasks.filter(t=>t.status!=='completed'&&t.status!=='cancelled'&&taskDueDate(t)&&taskDueDate(t).getTime()<=Date.now());
  if(!rows.length){stopActiveAlarmLoop();const panel=document.querySelector('#shopAlarmPanel');if(panel)panel.hidden=true;return;}
  const ack=Number(localStorage.getItem('ntAlarmAckUntil')||0);
  const acknowledged=new Set(JSON.parse(localStorage.getItem('ntAlarmAckTasks')||'[]'));
  if(Date.now()<ack&&rows.every(t=>acknowledged.has(t.id))){stopActiveAlarmLoop();return;}
  if(Date.now()<ack){localStorage.removeItem('ntAlarmAckUntil');} // a NEW due task rings immediately

  showAlarmPanel(rows);await playAlarm({due:true});startActiveAlarmLoop();await showSystemNotification('North Terrace — tasks require attention',`${rows.length} task${rows.length===1?'':'s'} due/overdue. Open General View and acknowledge.`,`nt-overdue-${todayISO()}`);
  if(overdueRepeatTimer)clearTimeout(overdueRepeatTimer);overdueRepeatTimer=setTimeout(()=>{localStorage.removeItem('ntAlarmAckUntil');fireOverdueAlarm();},10*60*1000);
}
function scheduleSlotAlerts(){
  clearSlotAlertTimers();if(overdueRepeatTimer){clearTimeout(overdueRepeatTimer);overdueRepeatTimer=null;}
  if(!alertsArmed||mode!=='day'||selectedDate!==todayISO())return;const now=Date.now(),fired=alertedMilestones();
  for(const task of currentTasks){if(task.status==='completed'||task.status==='cancelled')continue;const due=taskDueDate(task);if(!due)continue;for(const mb of [30,5,0]){const at=due.getTime()-mb*60000,key=`task:${task.id}:${mb}`;if(fired.has(key))continue;if(at<=now){if(mb===0)continue;else continue;}slotAlertTimers.push(setTimeout(()=>fireTaskWarning(task,mb),at-now));}}
  fireOverdueAlarm();
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
    ?'Overdue sound is enabled; tap to pause or use the Test Alarm button.'
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
  localStorage.setItem('ntAlertsEnabled','1');
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

  showToast(`${notificationMessage} Reminders are scheduled 30 minutes and 5 minutes before each task. At due/overdue time the shop alarm repeats until acknowledged, and returns after 10 minutes while work remains incomplete.`,'success',{title:'Live alerts enabled'});
}
async function disableAlerts(){
  alertsArmed=false;
  stopActiveAlarmLoop();
  localStorage.setItem('ntAlertsEnabled','0');
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
    if(user.role!=='staff'&&user.role!=='assignee') throw new Error(task.hotFood?'Wrong PIN':'Use a staff/assignee PIN to complete tasks.');
    if(task.assignedTo&&task.assignedTo!==user.id){
      const ok=await confirmAction({
        title:'Complete another person’s task?',
        message:`This task is assigned to ${task.assignedName||'another person'}. Complete it as ${user.name||'this user'}?`,
        details:'The app will keep both the assigned person and the actual completer in the audit history.',
        confirmText:'Complete Task'
      });
      if(!ok) return;
    }
    let completed;
    if(task.hotFood) completed=await completeHotFoodTask(task,user);
    else if(task.specialType==='compliance') completed=await completeComplianceTask(task,user);
    else { await completeTask(task.id,user); completed=true; }
    if(completed===false) return;
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

function openAlarmSoundSettings(){
  const panel=$('#alarmSoundSettings');
  panel.hidden=false;
  const tone=panel.querySelector(`input[name="ntAlarmTone"][value="${alarmPrefs.tone}"]`);
  if(tone)tone.checked=true;
  $('#alarmVolume').value=String(alarmPrefs.volume);
  $('#alarmVolumeValue').textContent=`${alarmPrefs.volume}%`;
  $('#alarmSoundFeedback').textContent='';
  $('#alarmSoundSettingsButton').setAttribute('aria-expanded','true');
  tone?.focus();
}
function closeAlarmSoundSettings(){
  $('#alarmSoundSettings').hidden=true;
  $('#alarmSoundSettingsButton').setAttribute('aria-expanded','false');
  $('#alarmSoundSettingsButton').focus();
}
function selectedAlarmPrefs(){
  return validAlarmPrefs({
    tone:document.querySelector('input[name="ntAlarmTone"]:checked')?.value,
    volume:Number($('#alarmVolume').value)
  });
}
$('#alarmSoundSettingsButton').addEventListener('click',()=>{
  if($('#alarmSoundSettings').hidden)openAlarmSoundSettings();
  else closeAlarmSoundSettings();
});
$('#closeAlarmSoundSettings').addEventListener('click',closeAlarmSoundSettings);
$('#cancelAlarmSoundSettings').addEventListener('click',closeAlarmSoundSettings);
$('#alarmVolume').addEventListener('input',()=>{
  $('#alarmVolumeValue').textContent=`${$('#alarmVolume').value}%`;
});
$('#previewAlarmSound').addEventListener('click',async()=>{
  const ok=await playAlarm({test:true,prefs:selectedAlarmPrefs()});
  $('#alarmSoundFeedback').textContent=ok?'Sound played. Adjust media volume on the tablet if needed.':'Audio unavailable. Tap Enable Alerts or check your browser audio settings.';
});
$('#saveAlarmSoundSettings').addEventListener('click',()=>{
  alarmPrefs=selectedAlarmPrefs();
  localStorage.setItem(ALARM_PREF_KEY,JSON.stringify(alarmPrefs));
  closeAlarmSoundSettings();
  showToast('Alarm sound and volume saved on this device.','success');
});
$('#alarmSoundSettings').addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();closeAlarmSoundSettings();}
});
$('#testShopAlarm')?.addEventListener('click',async()=>{
  const ok=await playAlarm({test:true});
  showToast(ok?'Test sound played. Adjust Galaxy Tab media volume if needed.':'Could not play sound. Check your device audio settings.',ok?'info':'warning');
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
  if(selectedDate>=todayISO()){ await ensureSpecialTasksForDate(selectedDate); await ensureTasksForDate(selectedDate);}
  if(selectedDate>=todayISO()) await ensureHotFoodDay(selectedDate);
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
  const plans=await Promise.all(dates.map(async date=>{
    // Today/future must be reconciled against the latest weekly template before
    // the week grid is rendered. Previously the week view could use an older
    // dailyTasks snapshot, so a changed exact time/slot appeared correctly in
    // Day View but disappeared from the expected slot in Week View.
    let rows=await getTasksForDate(date,{ensure:date>=todayISO()});
    if(!rows.length&&date>=todayISO()) rows=await getPlannedTasksForDate(date);

    // Exact sourceTime is the source of truth for slot placement. This also
    // protects the weekly display if a legacy snapshot still carries an old
    // slotId after a time edit.
    rows=rows.map(row=>({
      ...row,
      slotId:row.sourceTime?(slotForClock(row.sourceTime,date)||row.slotId):row.slotId
    }));
    return {date,rows};
  }));
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
