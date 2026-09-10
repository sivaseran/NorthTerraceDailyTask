import {ensureTodayTasks,watchTodayTasks,getWeeklyTemplate,percent,formatDate} from './store.js';
import {escapeHtml,statusView,tableSkeleton,showToast,initNetworkStatus,registerAppServiceWorker} from './ui.js';

const $=s=>document.querySelector(s);
const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
let weekRowsCache=[];
let weekFilter='ALL';
const collapsedShifts={AM:false,PM:false};

function renderToday(tasks){
  const completed=tasks.filter(t=>t.status==='completed').length;
  const am=tasks.filter(t=>t.shift==='AM');
  const pm=tasks.filter(t=>t.shift==='PM');
  const overall=percent(tasks);

  $('#overallPct').textContent=`${overall}%`;
  $('#amPct').textContent=`${percent(am)}%`;
  $('#pmPct').textContent=`${percent(pm)}%`;
  $('#overdueCount').textContent=String(tasks.filter(t=>t.status==='overdue').length);
  $('#overallCount').textContent=tasks.length?`${completed} of ${tasks.length} completed`:'No tasks today';
  $('#amCount').textContent=am.length?`${am.filter(t=>t.status==='completed').length} of ${am.length} completed`:'No AM tasks';
  $('#pmCount').textContent=pm.length?`${pm.filter(t=>t.status==='completed').length} of ${pm.length} completed`:'No PM tasks';
  $('#progressText').textContent=`${completed} of ${tasks.length} completed`;
  $('#overallProgress').style.width=`${overall}%`;
  $('#overallProgress').classList.toggle('complete',overall===100&&tasks.length>0);

  if(!tasks.length){
    $('#todayRows').innerHTML='<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">✓</div><h3>No tasks generated for today</h3><p>Ask a manager to check the weekly template.</p></div></td></tr>';
    return;
  }

  $('#todayRows').innerHTML=tasks.map(t=>`<tr>
    <td><strong>${escapeHtml(t.time||'—')}</strong></td>
    <td>
      ${escapeHtml(t.taskName||'Untitled task')}${t.photoRequired?' <span title="Photo reminder">📷</span>':''}
      ${t.recurring?'<br><span class="muted">Hourly checkpoint</span>':''}
    </td>
    <td><span class="staff-chip">${escapeHtml(t.assignedStaff||'—')}</span></td>
    <td>${escapeHtml(t.shift||'—')}</td>
    <td>${statusView(t.status)}</td>
  </tr>`).join('');
}

function currentDayKey(){
  const jsDay=new Date().getDay(); // Sun 0
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][jsDay];
}

function weekDateRange(){
  const now=new Date();
  const day=now.getDay();
  const diffToMon=day===0?-6:1-day;
  const monday=new Date(now);
  monday.setHours(12,0,0,0);
  monday.setDate(now.getDate()+diffToMon);
  const sunday=new Date(monday);
  sunday.setDate(monday.getDate()+6);

  const sameMonth=monday.getMonth()===sunday.getMonth() && monday.getFullYear()===sunday.getFullYear();
  const sameYear=monday.getFullYear()===sunday.getFullYear();
  const monthFmt=new Intl.DateTimeFormat('en-GB',{month:'long'});
  const fullFmt=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'});

  if(sameMonth){
    return `${monday.getDate()}–${sunday.getDate()} ${monthFmt.format(monday)} ${monday.getFullYear()}`;
  }
  if(sameYear){
    return `${monday.getDate()} ${monthFmt.format(monday)} – ${sunday.getDate()} ${monthFmt.format(sunday)} ${monday.getFullYear()}`;
  }
  return `${fullFmt.format(monday)} – ${fullFmt.format(sunday)}`;
}

function activeSlot(task,day){
  if(task.schedule) return task.schedule?.[day]?.active!==false && Boolean(task.schedule?.[day]);
  return Boolean(task.assignments?.[day]);
}

function slotFor(task,day){
  if(task.schedule){
    const slot=task.schedule?.[day];
    if(!slot || slot.active===false) return null;
    return {assignee:String(slot.assignee||''),time:String(slot.time||'')};
  }
  const assignee=task.assignments?.[day];
  return assignee ? {assignee:String(assignee),time:String(task.time||'')} : null;
}

function commonTime(task){
  const times=DAYS.map(d=>slotFor(task,d)?.time).filter(Boolean);
  if(!times.length) return String(task.time||task.section||'');
  const counts=new Map();
  times.forEach(t=>counts.set(t,(counts.get(t)||0)+1));
  return [...counts.entries()].sort((a,b)=>b[1]-a[1])[0][0];
}

function assignmentLabel(value){
  const v=String(value||'').trim();
  if(!v) return '—';
  return /^\d+$/.test(v) ? `Staff ${v}` : v;
}

function renderWeekSummary(rows){
  const today=currentDayKey();
  $('#weekSummary').innerHTML=DAYS.map(day=>{
    const active=rows.filter(t=>activeSlot(t,day));
    const am=active.filter(t=>t.shift==='AM').length;
    const pm=active.filter(t=>t.shift==='PM').length;
    const isToday=day===today;
    return `<article class="week-day-card ${isToday?'is-today':''}">
      <div class="week-day-top">
        <strong>${day.toUpperCase()}</strong>
        ${isToday?'<span class="today-chip">Today</span>':''}
      </div>
      <div class="week-day-total">${active.length}</div>
      <div class="week-day-label">scheduled activities</div>
      <div class="week-day-split"><span>AM ${am}</span><span>PM ${pm}</span></div>
    </article>`;
  }).join('');
}

function sectionOrder(value){
  const s=String(value||'');
  const m=s.match(/(\d{1,2})[:.]?(\d{2})?/);
  if(!m) return 9999;
  let h=Number(m[1]), min=Number(m[2]||0);
  if(h<5) h+=12; // PM source sections may be written as 2.00 etc.
  return h*60+min;
}

function renderDayHeader(day){
  const isToday=day===currentDayKey();
  return `<th class="${isToday?'is-today-col':''}">
    <div class="week-day-heading">${day}${isToday?'<span>Today</span>':''}</div>
  </th>`;
}

function renderWeekCell(task,day,usualTime){
  const slot=slotFor(task,day);
  const isToday=day===currentDayKey();
  if(!slot) return `<td class="week-day-cell ${isToday?'is-today-col':''}"><span class="week-off">—</span></td>`;

  const showTime=slot.time && slot.time!==usualTime;
  return `<td class="week-day-cell ${isToday?'is-today-col':''}">
    <span class="assignment-pill">${escapeHtml(assignmentLabel(slot.assignee))}</span>
    ${showTime?`<span class="assignment-time">${escapeHtml(slot.time)}</span>`:''}
  </td>`;
}

function renderTaskRow(task){
  const usualTime=commonTime(task);
  return `<tr>
    <td class="week-task-cell">
      <div class="week-task-name">${escapeHtml(task.taskName||'Untitled task')}</div>
      <div class="week-task-meta">
        ${usualTime?`<span>${escapeHtml(usualTime)}</span>`:''}
        ${task.recurring?'<span class="mini-pill recurring-pill">↻ Hourly</span>':''}
        ${task.photoRequired?'<span class="mini-pill photo-pill">📷 Photo</span>':''}
      </div>
    </td>
    ${DAYS.map(d=>renderWeekCell(task,d,usualTime)).join('')}
  </tr>`;
}

function renderShift(shift,rows){
  const shiftRows=rows.filter(t=>t.shift===shift);
  if(!shiftRows.length) return '';

  const sections=[...new Set(shiftRows.map(t=>t.section||'Other'))]
    .sort((a,b)=>sectionOrder(a)-sectionOrder(b));

  const shiftLabel=shift==='AM'?'Morning operations':'Afternoon & closing';
  const shiftHours=shift==='AM'?'05:30 – 14:00':'14:00 – 22:00';
  const icon=shift==='AM'?'☀':'◐';
  const collapsed=collapsedShifts[shift];

  const tableRows=sections.map(section=>{
    const sectionTasks=shiftRows.filter(t=>(t.section||'Other')===section);
    return `<tr class="week-section-row"><td colspan="8"><span>${escapeHtml(section)}</span><small>${sectionTasks.length} activit${sectionTasks.length===1?'y':'ies'}</small></td></tr>
      ${sectionTasks.map(renderTaskRow).join('')}`;
  }).join('');

  return `<section class="week-shift-card" data-shift="${shift}">
    <button class="week-shift-head" type="button" data-collapse-shift="${shift}" aria-expanded="${!collapsed}">
      <div class="shift-title-wrap">
        <span class="shift-icon">${icon}</span>
        <div>
          <span class="shift-kicker">${shift} SHIFT</span>
          <h3>${shiftLabel}</h3>
          <p>${shiftHours} · ${shiftRows.length} master activities</p>
        </div>
      </div>
      <span class="collapse-label">${collapsed?'Show':'Hide'} <span aria-hidden="true">${collapsed?'▾':'▴'}</span></span>
    </button>
    <div class="week-shift-body" ${collapsed?'hidden':''}>
      <div class="week-table-wrap">
        <table class="week-table">
          <thead><tr><th class="week-task-head">Task / usual time</th>${DAYS.map(renderDayHeader).join('')}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <div class="week-table-hint">Tip: scroll horizontally to see all days. The task column and day header stay visible.</div>
    </div>
  </section>`;
}

function renderWeekExperience(){
  const rows=weekRowsCache;
  renderWeekSummary(rows);

  const filtered=weekFilter==='ALL' ? rows : rows.filter(t=>t.shift===weekFilter);
  if(!filtered.length){
    $('#weekSchedule').innerHTML='<div class="card elevated"><div class="empty-state"><h3>No tasks in this view</h3><p>Try a different AM / PM filter.</p></div></div>';
    return;
  }

  $('#weekSchedule').innerHTML=
    (weekFilter==='ALL' ? renderShift('AM',filtered)+renderShift('PM',filtered) : renderShift(weekFilter,filtered));

  document.querySelectorAll('[data-collapse-shift]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const shift=btn.dataset.collapseShift;
      collapsedShifts[shift]=!collapsedShifts[shift];
      renderWeekExperience();
    });
  });
}

async function renderWeek(){
  $('#weekSchedule').innerHTML='<div class="card elevated"><div class="empty-state"><h3>Loading weekly schedule…</h3><p>Preparing the planning view.</p></div></div>';
  try{
    weekRowsCache=await getWeeklyTemplate();
    if(!weekRowsCache.length){
      $('#weekSummary').innerHTML='';
      $('#weekSchedule').innerHTML='<div class="card elevated"><div class="empty-state"><h3>No weekly template yet</h3><p>The manager can initialise it from Setup.</p></div></div>';
      return;
    }
    renderWeekExperience();
  }catch(error){
    $('#weekSummary').innerHTML='';
    $('#weekSchedule').innerHTML='<div class="card elevated"><div class="empty-state"><h3>Could not load the weekly schedule</h3><p>Check your connection and try again.</p></div></div>';
    showToast('Could not load the weekly schedule. Check your connection and try again.','error');
  }
}

function setTab(tab){
  const today=tab==='today';
  $('#todayView').hidden=!today;
  $('#weekView').hidden=today;
  $('#todayTab').classList.toggle('active',today);
  $('#weekTab').classList.toggle('active',!today);
  $('#todayTab').setAttribute('aria-selected',String(today));
  $('#weekTab').setAttribute('aria-selected',String(!today));

  $('#pageTitle').textContent=today?'Today at a glance':'Week at a glance';
  $('#dateLabel').textContent=today?formatDate():weekDateRange();

  if(!today) renderWeek();
}

$('#todayTab').addEventListener('click',()=>setTab('today'));
$('#weekTab').addEventListener('click',()=>setTab('week'));

document.querySelectorAll('[data-week-filter]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    weekFilter=btn.dataset.weekFilter;
    document.querySelectorAll('[data-week-filter]').forEach(b=>b.classList.toggle('active',b===btn));
    renderWeekExperience();
  });
});

$('#pageTitle').textContent='Today at a glance';
$('#dateLabel').textContent=formatDate();
$('#todayRows').innerHTML=tableSkeleton(5,6);

try{
  await ensureTodayTasks();
  watchTodayTasks(renderToday,()=>{
    $('#todayRows').innerHTML='<tr><td colspan="5" class="error">Live updates are temporarily unavailable.</td></tr>';
    showToast('Live task updates are unavailable. Check your internet connection.','error');
  });
}catch(error){
  $('#todayRows').innerHTML='<tr><td colspan="5" class="error">Could not load today\\'s tasks.</td></tr>';
  showToast('Could not load today\\'s tasks. Check your connection and refresh.','error');
}

function clock(){
  const el=$('#liveClock');
  if(el) el.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
}
clock();
setInterval(clock,30000);
initNetworkStatus();
registerAppServiceWorker();
