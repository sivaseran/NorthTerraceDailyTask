import {getSession,clearSession} from './auth.js';
import {ensureTodayTasks,watchTodayTasks,completeTask,uncompleteTask,percent,formatDate} from './store.js';
import {escapeHtml,statusView,setButtonLoading,showToast,initNetworkStatus,registerAppServiceWorker,formatTimestamp} from './ui.js';

const $=s=>document.querySelector(s);
const user=getSession();
if(!user||user.role!=='staff') location.href='login.html';

$('#staffTitle').textContent=user.name||`Staff ${user.staffId}`;
$('#staffDate').textContent=formatDate();

function section(title,rows){
  if(!rows.length) return '';
  return `<section class="task-section">
    <div class="task-section-head"><h3>${escapeHtml(title)}</h3><span class="task-count">${rows.length} task${rows.length===1?'':'s'}</span></div>
    <div class="task-list">${rows.map(taskCard).join('')}</div>
  </section>`;
}

function taskCard(t){
  const completed=t.status==='completed';
  const completedTime=formatTimestamp(t.completedAt);
  return `<article class="task-item status-${escapeHtml(t.status)}">
    <div class="task-time">${escapeHtml(t.time||'—')}</div>
    <div>
      <h3>${escapeHtml(t.taskName||'Untitled task')}</h3>
      <div class="task-meta">
        <span>${escapeHtml(t.shift||'')}</span>
        <span>${t.photoRequired?'📷 Send photo to WhatsApp group':'No photo required'}</span>
        ${completedTime?`<span>Completed ${escapeHtml(completedTime)}</span>`:''}
        ${!completed?statusView(t.status):''}
      </div>
    </div>
    <button class="complete-btn ${completed?'done':''}" data-id="${escapeHtml(t.id)}" type="button" ${completed?'disabled':''}>${completed?'✓ Completed':'Complete'}</button>
  </article>`;
}

function render(all){
  $('#staffLoading').hidden=true;
  const tasks=all.filter(t=>String(t.assignedStaff)===String(user.staffId));
  const done=tasks.filter(t=>t.status==='completed');
  const attention=tasks.filter(t=>t.status==='overdue'||t.status==='due');
  const upcoming=tasks.filter(t=>t.status==='upcoming');
  const pct=percent(tasks);
  const remaining=tasks.length-done.length;

  $('#staffPct').textContent=`${pct}%`;
  $('#staffProgress').style.width=`${pct}%`;
  $('#staffProgress').classList.toggle('complete',pct===100&&tasks.length>0);
  $('#remainingText').textContent=tasks.length?(remaining===0?'All assigned tasks are complete.':`${remaining} task${remaining===1?'':'s'} remaining`):'No tasks assigned today.';

  if(!tasks.length){
    $('#staffTasks').innerHTML='<div class="empty-state" style="margin-top:20px"><div class="empty-icon">✓</div><h3>You\'re all clear</h3><p>No tasks are assigned to you today.</p></div>';
    return;
  }

  $('#staffTasks').innerHTML=
    section('Needs attention',attention)+
    section('Upcoming',upcoming)+
    section('Completed',done);

  document.querySelectorAll('.complete-btn:not([disabled])').forEach(button=>{
    button.addEventListener('click',async()=>{
      const task=tasks.find(t=>t.id===button.dataset.id);
      if(!task) return;
      setButtonLoading(button,true,'Saving…');
      try{
        await completeTask(task.id,user.staffId);
        const now=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
        showToast(`${task.taskName} completed at ${now}.`,'success',{
          title:'Task completed',
          actionLabel:'Undo',
          duration:8000,
          onAction:async()=>{
            try{
              await uncompleteTask(task.id);
              showToast('Task completion was undone.','info',{title:'Undone'});
            }catch{
              showToast('Could not undo the completion.','error');
            }
          }
        });
      }catch(error){
        setButtonLoading(button,false);
        showToast('Could not save this task. Check your connection and try again.','error',{title:'Save failed'});
      }
    });
  });
}

$('#logout').addEventListener('click',()=>{clearSession();location.href='login.html';});

try{
  await ensureTodayTasks();
  watchTodayTasks(render,()=>{
    $('#staffLoading').hidden=true;
    $('#staffTasks').innerHTML='<div class="empty-state" style="margin-top:20px"><h3>Live tasks unavailable</h3><p>Check your internet connection and refresh.</p></div>';
    showToast('Live task updates are unavailable.','error');
  });
}catch(error){
  $('#staffLoading').hidden=true;
  $('#staffTasks').innerHTML='<div class="empty-state" style="margin-top:20px"><h3>Could not load tasks</h3><p>Check your connection and try again.</p></div>';
  showToast('Could not load your tasks.','error');
}

initNetworkStatus();
registerAppServiceWorker();
