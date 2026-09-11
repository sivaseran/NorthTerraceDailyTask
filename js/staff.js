import {getSession,clearSession} from './auth.js';
import {todayISO,formatLongDate,ensureTasksForDate,watchTasksForDate,completeTask,percent,SLOT_DEFS,slotLabelForDate} from './store.js';
import {escapeHtml,statusView,showToast,initNetworkStatus,registerAppServiceWorker} from './ui.js';
const $=s=>document.querySelector(s),user=getSession();
if(!user||(user.role!=='staff'&&user.role!=='assignee')) location.href='login.html';
$('#staffTitle').textContent=user.name||'Staff';$('#staffDate').textContent=formatLongDate(todayISO());

function render(all){
  const tasks=all.filter(t=>t.assignedTo===user.id&&t.status!=='cancelled');
  $('#staffPct').textContent=`${percent(tasks)}%`;
  $('#staffTasks').innerHTML=SLOT_DEFS.map(slot=>{
    const rows=tasks.filter(t=>t.slotId===slot.id);if(!rows.length)return'';
    return `<section class="task-section"><div class="task-section-head"><h3>${escapeHtml(slotLabelForDate(slot.id,todayISO()))}</h3><span class="task-count">${rows.length} task${rows.length===1?'':'s'}</span></div><div class="task-list">
      ${rows.map(t=>`<article class="task-item"><div class="task-time">${t.checkpoint?escapeHtml(t.checkpoint):'◷'}</div><div><h3>${escapeHtml(t.taskName)}</h3><div class="task-meta">${Number(t.effortMinutes)>0?`${t.effortMinutes} min effort · `:''}${t.photoRequired?'📷 Send photo to WhatsApp group':'No photo required'}</div></div><div>${statusView(t.status)}</div>${t.status!=='completed'&&t.status!=='missed'?`<button class="complete-btn" data-id="${t.id}">Complete</button>`:''}</article>`).join('')}
    </div></section>`;
  }).join('')||'<div class="card"><div class="empty-state"><h3>You’re all clear</h3><p>No tasks are currently assigned to you today.</p></div></div>';
  document.querySelectorAll('.complete-btn').forEach(b=>b.onclick=async()=>{b.disabled=true;b.textContent='Saving…';try{await completeTask(b.dataset.id,user);showToast('Task completed.','success');}catch{b.disabled=false;b.textContent='Complete';showToast('Could not complete task.','error');}});
}
await ensureTasksForDate(todayISO());watchTasksForDate(todayISO(),render,()=>showToast('Live updates unavailable.','error'));
$('#logout').onclick=()=>{clearSession();location.href='login.html';};
initNetworkStatus();registerAppServiceWorker();
