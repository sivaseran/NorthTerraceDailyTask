import {ensureFinalV36Schedule} from '../js/final-config.js';
import {getSession,clearSession} from '../js/auth.js';
import {todayISO,formatLongDate,ensureTasksForDate,watchTasksForDate,completeTask,percent,SLOT_DEFS,slotLabelForDate} from '../js/store.js';
import {escapeHtml,statusView,showToast,initNetworkStatus} from '../js/ui.js';
import {ensureHotFoodDay} from '../js/hot-food-engine.js';
import {completeHotFoodTask} from '../js/hot-food-ui.js';
import {ensureSpecialTasksForDate,ensureSafeUpgrades} from '../js/special-tasks.js';
import {completeComplianceTask} from '../js/compliance-ui.js';
await ensureFinalV36Schedule();
await ensureSafeUpgrades();

const $=s=>document.querySelector(s),user=getSession();
if(!user||(user.role!=='staff'&&user.role!=='assignee')) location.href='./';
$('#staffTitle').textContent=user.name||'Staff';$('#staffDate').textContent=formatLongDate(todayISO());


let staffAlerts=localStorage.getItem('ntStaffAlertsEnabled')==='1',staffAlertTimers=[];
function updateStaffAlertButton(){const b=$('#staffAlerts');if(b)b.textContent=staffAlerts?'🔔 Alerts On':'Enable Alerts';}
function dueDate(t){const m=String(t.sourceTime||'').match(/(\d{1,2}):(\d{2})/);if(!m)return null;const d=new Date(t.date+'T12:00:00');d.setHours(+m[1],+m[2],0,0);return d;}
async function staffNotify(title,body,tag){try{if(Notification.permission==='granted'){const r=await navigator.serviceWorker.ready;r.showNotification(title,{body,tag,requireInteraction:true,vibrate:[220,110,220]});}}catch{}}
function scheduleStaffAlerts(rows){staffAlertTimers.forEach(clearTimeout);staffAlertTimers=[];if(!staffAlerts)return;const now=Date.now();for(const t of rows.filter(x=>x.assignedTo===user.id&&x.status!=='completed'&&x.status!=='cancelled')){const d=dueDate(t);if(!d)continue;for(const mb of [30,5,0]){const at=d.getTime()-mb*60000;if(at<=now)continue;staffAlertTimers.push(setTimeout(()=>staffNotify(mb?`Task due in ${mb} minutes`:'Task due now',t.taskName,`staff-${t.id}-${mb}`),at-now));}}}
$('#staffAlerts').onclick=async()=>{if(!staffAlerts&&'Notification'in window&&Notification.permission==='default')await Notification.requestPermission();staffAlerts=!staffAlerts;localStorage.setItem('ntStaffAlertsEnabled',staffAlerts?'1':'0');updateStaffAlertButton();};updateStaffAlertButton();

function render(all){
  scheduleStaffAlerts(all);
  const tasks=all.filter(t=>t.assignedTo===user.id&&t.status!=='cancelled');
  $('#staffPct').textContent=`${percent(tasks)}%`;
  $('#staffTasks').innerHTML=SLOT_DEFS.map(slot=>{
    const rows=tasks.filter(t=>t.slotId===slot.id);if(!rows.length)return'';
    return `<section class="task-section"><div class="task-section-head"><h3>${escapeHtml(slotLabelForDate(slot.id,todayISO()))}</h3><span class="task-count">${rows.length} task${rows.length===1?'':'s'}</span></div><div class="task-list">
      ${rows.map(t=>`<article class="task-item">
        <div class="task-time">${t.temperatureRequired&&t.sourceTime?escapeHtml(t.sourceTime):(t.checkpoint?escapeHtml(t.checkpoint):'◷')}</div>
        <div>
          <h3>${t.hotFood?'<span class="hf-badge">HOT FOOD</span> ':''}${escapeHtml(t.taskName)}</h3>
          <div class="task-meta">${Number(t.effortMinutes)>0?`${t.effortMinutes} min effort · `:''}${t.photoRequired?'📷 Send photo to WhatsApp group':'No photo required'}</div>
        </div>
        <div>${statusView(t.status)}</div>
        ${t.status!=='completed'&&t.status!=='missed'?`<button class="complete-btn" data-id="${t.id}">Complete</button>`:''}
      </article>`).join('')}
    </div></section>`;
  }).join('')||'<div class="card"><div class="empty-state"><h3>You’re all clear</h3><p>No tasks are currently assigned to you today.</p></div></div>';
  document.querySelectorAll('.complete-btn').forEach(b=>b.onclick=async()=>{
    b.disabled=true;
    b.textContent='Saving…';
    try{
      const task=tasks.find(t=>t.id===b.dataset.id);
      if(task?.hotFood) await completeHotFoodTask(task,user); else if(task?.specialType==='compliance') await completeComplianceTask(task,user); else await completeTask(b.dataset.id,user);
      showToast('Task completed.','success');
    }catch(error){
      b.disabled=false;
      b.textContent='Complete';
      showToast(error.message||'Could not complete task.','error');
    }
  });
}
await ensureSpecialTasksForDate(todayISO());await ensureTasksForDate(todayISO());await ensureHotFoodDay(todayISO());watchTasksForDate(todayISO(),render,()=>showToast('Live updates unavailable.','error'));
$('#logout').onclick=()=>{clearSession();location.href='./';};
initNetworkStatus();if('serviceWorker' in navigator) navigator.serviceWorker.register('/NorthTerraceDailyTask/staff-app/sw.js',{scope:'/NorthTerraceDailyTask/staff-app/'}).catch(()=>{});
