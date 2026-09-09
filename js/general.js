import {ensureTodayTasks,watchTodayTasks,getWeeklyTemplate,percent,formatDate} from './store.js';
import {escapeHtml,statusView,tableSkeleton,showToast,initNetworkStatus,registerAppServiceWorker} from './ui.js';

const $=s=>document.querySelector(s);

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
    <td>${escapeHtml(t.taskName||'Untitled task')}${t.photoRequired?' <span title="Photo reminder">📷</span>':''}</td>
    <td><span class="staff-chip">${escapeHtml(t.assignedStaff||'—')}</span></td>
    <td>${escapeHtml(t.shift||'—')}</td>
    <td>${statusView(t.status)}</td>
  </tr>`).join('');
}

async function renderWeek(){
  $('#weekRows').innerHTML=tableSkeleton(8,5);
  try{
    const rows=await getWeeklyTemplate();
    const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    if(!rows.length){
      $('#weekRows').innerHTML='<tr><td colspan="8"><div class="empty-state"><h3>No weekly template yet</h3><p>The manager can initialise it from Setup.</p></div></td></tr>';
      return;
    }
    $('#weekRows').innerHTML=rows.map(t=>`<tr>
      <td><strong>${escapeHtml(t.taskName||'')}</strong><br><span class="muted">${escapeHtml(t.time||'')} · ${escapeHtml(t.shift||'')}</span></td>
      ${days.map(d=>`<td><span class="staff-chip">${escapeHtml(t.assignments?.[d]||'—')}</span></td>`).join('')}
    </tr>`).join('');
  }catch(error){
    $('#weekRows').innerHTML='<tr><td colspan="8" class="error">Could not load the weekly schedule.</td></tr>';
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
  if(!today) renderWeek();
}

$('#todayTab').addEventListener('click',()=>setTab('today'));
$('#weekTab').addEventListener('click',()=>setTab('week'));
$('#dateLabel').textContent=formatDate();
$('#todayRows').innerHTML=tableSkeleton(5,6);

try{
  await ensureTodayTasks();
  watchTodayTasks(renderToday,()=>{
    $('#todayRows').innerHTML='<tr><td colspan="5" class="error">Live updates are temporarily unavailable.</td></tr>';
    showToast('Live task updates are unavailable. Check your internet connection.','error');
  });
}catch(error){
  $('#todayRows').innerHTML='<tr><td colspan="5" class="error">Could not load today\'s tasks.</td></tr>';
  showToast('Could not load today\'s tasks. Check your connection and refresh.','error');
}

function clock(){
  const el=$('#liveClock');
  if(el) el.textContent=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
}
clock();
setInterval(clock,30000);
initNetworkStatus();
registerAppServiceWorker();
