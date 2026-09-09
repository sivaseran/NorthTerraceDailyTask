import {getSession,clearSession,saveSession} from './auth.js';
import {ensureTodayTasks,watchTodayTasks,getUsers,getWeeklyTemplate,reassignTask,coverShift,percent,saveUser,validateUserUniqueness,formatDate} from './store.js';
import {seedStarterTemplate} from './seed.js';
import {escapeHtml,statusView,setButtonLoading,setInlineMessage,setFieldError,clearFieldError,showToast,confirmAction,tableSkeleton,initNetworkStatus,registerAppServiceWorker} from './ui.js';

const $=s=>document.querySelector(s);
const user=getSession();
if(!user||user.role!=='manager') location.href='login.html';

let tasks=[];
let users=[];

$('#managerDate').textContent=formatDate();
$('#managerRows').innerHTML=tableSkeleton(5,6);
$('#usersRows').innerHTML=tableSkeleton(7,4);
$('#reportRows').innerHTML=tableSkeleton(4,4);

function activeStaff(){return users.filter(u=>u.role==='staff'&&u.active!==false)}
function staffName(id){const match=users.find(u=>u.role==='staff'&&String(u.staffId)===String(id));return match?.name||`Staff ${id||'—'}`}
function maskPin(pin){return pin?'•'.repeat(Math.max(4,String(pin).length)):'—'}

async function loadUsers(){
  users=await getUsers();
  const staff=activeStaff();
  const options=staff.map(s=>`<option value="${escapeHtml(s.staffId)}">${escapeHtml(s.name||`Staff ${s.staffId}`)} (${escapeHtml(s.staffId)})</option>`).join('');
  $('#reassignStaff').innerHTML=options;
  $('#offStaff').innerHTML=options;
  $('#coverStaff').innerHTML=options;

  if(!users.length){
    $('#usersRows').innerHTML='<tr><td colspan="7">No users found.</td></tr>';
  }else{
    $('#usersRows').innerHTML=users
      .sort((a,b)=>String(a.role).localeCompare(String(b.role))||String(a.name||'').localeCompare(String(b.name||'')))
      .map(u=>`<tr>
        <td><code>${escapeHtml(u.id)}</code></td>
        <td>${escapeHtml(u.name||'—')}</td>
        <td>${escapeHtml(u.staffId||'—')}</td>
        <td>${escapeHtml(u.role||'—')}</td>
        <td>${maskPin(u.pin)}</td>
        <td><span class="user-status ${u.active!==false?'active':''}">${u.active!==false?'Active':'Inactive'}</span></td>
        <td><button class="link-btn edit-user" type="button" data-id="${escapeHtml(u.id)}">Edit</button></td>
      </tr>`).join('');
  }
  renderReports();
  renderReassignPreview();
  renderCoverPreview();
}

function render(all){
  tasks=all;
  const completed=tasks.filter(t=>t.status==='completed').length;
  $('#mgrOverall').textContent=`${percent(tasks)}%`;
  $('#mgrCompleted').textContent=String(completed);
  $('#mgrPending').textContent=String(tasks.length-completed);
  $('#mgrOverdue').textContent=String(tasks.filter(t=>t.status==='overdue').length);

  if(!tasks.length){
    $('#managerRows').innerHTML='<tr><td colspan="5"><div class="empty-state"><h3>No tasks today</h3><p>Check the weekly template in Setup.</p></div></td></tr>';
  }else{
    $('#managerRows').innerHTML=tasks.map(t=>{
      const moved=String(t.originalStaff)!==String(t.assignedStaff);
      return `<tr>
        <td><strong>${escapeHtml(t.time||'—')}</strong></td>
        <td>${escapeHtml(t.taskName||'Untitled task')}</td>
        <td><span class="staff-chip">${escapeHtml(t.originalStaff||'—')}</span></td>
        <td>${moved?`<span class="assignment-changed"><span class="staff-chip">${escapeHtml(t.assignedStaff||'—')}</span> changed</span>`:`<span class="staff-chip">${escapeHtml(t.assignedStaff||'—')}</span>`}</td>
        <td>${statusView(t.status)}</td>
      </tr>`;
    }).join('');
  }

  $('#taskSelect').innerHTML=tasks.map(t=>`<option value="${escapeHtml(t.id)}">${escapeHtml(t.time||'')} — ${escapeHtml(t.taskName||'')} (Staff ${escapeHtml(t.assignedStaff||'—')})</option>`).join('');
  renderReports();
  renderReassignPreview();
  renderCoverPreview();
}

function renderReports(){
  const staff=users.filter(u=>u.role==='staff');
  if(!staff.length){$('#reportRows').innerHTML='<tr><td colspan="4">No staff users found.</td></tr>';return;}
  $('#reportRows').innerHTML=staff.map(s=>{
    const assigned=tasks.filter(t=>String(t.assignedStaff)===String(s.staffId));
    const complete=assigned.filter(t=>t.status==='completed').length;
    const pct=assigned.length?Math.round(complete/assigned.length*100):0;
    return `<tr><td>${escapeHtml(s.name||`Staff ${s.staffId}`)}</td><td>${assigned.length}</td><td>${complete}</td><td><strong>${pct}%</strong></td></tr>`;
  }).join('');
}

function renderReassignPreview(){
  const task=tasks.find(t=>t.id===$('#taskSelect').value)||tasks[0];
  const target=$('#reassignStaff').value;
  if(!task){$('#reassignPreview').innerHTML='<span class="muted">No task available to reassign.</span>';return;}
  $('#reassignPreview').innerHTML=`<span class="staff-chip">${escapeHtml(task.assignedStaff||'—')}</span><strong>${escapeHtml(staffName(task.assignedStaff))}</strong><span class="preview-arrow">→</span><span class="staff-chip">${escapeHtml(target||'—')}</span><strong>${escapeHtml(staffName(target))}</strong><span class="muted">· ${escapeHtml(task.taskName||'')}</span>`;
}

function renderCoverPreview(){
  const off=$('#offStaff').value,shift=$('#offShift').value,cover=$('#coverStaff').value;
  const count=tasks.filter(t=>String(t.assignedStaff)===String(off)&&t.shift===shift).length;
  $('#coverPreview').innerHTML=`<strong>${escapeHtml(staffName(off))}</strong><span class="muted">${escapeHtml(shift)} shift</span><span class="preview-arrow">→</span><strong>${escapeHtml(staffName(cover))}</strong><span class="muted">${count} task${count===1?'':'s'} will move</span>`;
}

function selectSection(id){
  document.querySelectorAll('.manager-nav button').forEach(b=>b.classList.toggle('active',b.dataset.section===id));
  document.querySelectorAll('.manager-section').forEach(s=>s.hidden=s.id!==id);
}

document.querySelectorAll('.manager-nav button').forEach(button=>button.addEventListener('click',()=>selectSection(button.dataset.section)));
$('#taskSelect').addEventListener('change',renderReassignPreview);
$('#reassignStaff').addEventListener('change',renderReassignPreview);
['offStaff','offShift','coverStaff'].forEach(id=>$('#'+id).addEventListener('change',renderCoverPreview));

$('#reassignBtn').addEventListener('click',async()=>{
  const button=$('#reassignBtn');
  const task=tasks.find(t=>t.id===$('#taskSelect').value);
  const target=$('#reassignStaff').value;
  setInlineMessage($('#reassignResult'),'');
  if(!task){setInlineMessage($('#reassignResult'),'Select a task to reassign.','error');return;}
  if(!target){setInlineMessage($('#reassignResult'),'Select the staff member who will receive this task.','error');return;}
  if(String(task.assignedStaff)===String(target)){
    setInlineMessage($('#reassignResult'),`${staffName(target)} is already assigned to this task.`,'warning');
    return;
  }
  const previous=String(task.assignedStaff||'');
  setButtonLoading(button,true,'Reassigning…');
  try{
    await reassignTask(task.id,target);
    const message=`${task.taskName} reassigned to ${staffName(target)} for today only.`;
    setInlineMessage($('#reassignResult'),`✓ ${message}`,'success');
    showToast(message,'success',{title:'Task reassigned',actionLabel:'Undo',duration:8000,onAction:async()=>{
      try{await reassignTask(task.id,previous);showToast(`Task returned to ${staffName(previous)}.`,'info',{title:'Reassignment undone'});}catch{showToast('Could not undo the reassignment.','error');}
    }});
  }catch(error){
    setInlineMessage($('#reassignResult'),'Could not save the reassignment. Check your connection and try again.','error');
    showToast('Could not save the task reassignment.','error',{title:'Save failed'});
  }finally{setButtonLoading(button,false);}
});

$('#coverBtn').addEventListener('click',async()=>{
  const button=$('#coverBtn');
  const off=$('#offStaff').value,shift=$('#offShift').value,cover=$('#coverStaff').value;
  setInlineMessage($('#coverResult'),'');
  if(!off||!cover){setInlineMessage($('#coverResult'),'Select both the absent staff member and the covering staff member.','error');return;}
  if(String(off)===String(cover)){setInlineMessage($('#coverResult'),'The covering staff member must be different from the staff member who is off.','error');return;}
  const count=tasks.filter(t=>String(t.assignedStaff)===String(off)&&t.shift===shift).length;
  if(!count){setInlineMessage($('#coverResult'),`${staffName(off)} has no ${shift} tasks currently assigned today.`,'warning');return;}

  const confirmed=await confirmAction({
    title:'Apply shift cover?',
    message:`Move all ${shift} tasks currently assigned to ${staffName(off)} over to ${staffName(cover)}?`,
    details:`${count} task${count===1?'':'s'} will be transferred.\nThis changes today only. The weekly master schedule will not be changed.`,
    confirmText:'Confirm Cover'
  });
  if(!confirmed) return;

  setButtonLoading(button,true,'Applying cover…');
  try{
    const moved=await coverShift(off,shift,cover);
    const message=`${moved} ${shift} task${moved===1?'':'s'} transferred from ${staffName(off)} to ${staffName(cover)} for today.`;
    setInlineMessage($('#coverResult'),`✓ ${message}`,'success');
    showToast(message,'success',{title:'Shift cover applied'});
  }catch(error){
    setInlineMessage($('#coverResult'),'Could not apply shift cover. Check your connection and try again.','error');
    showToast('Could not apply the shift cover.','error',{title:'Save failed'});
  }finally{setButtonLoading(button,false);}
});

function clearUserForm(){
  ['userDocId','userName','userStaffId','userPin','userPinConfirm'].forEach(id=>{$('#'+id).value='';clearFieldError($('#'+id));});
  $('#userRole').value='staff';
  $('#userActive').value='true';
  $('#userStaffId').disabled=false;
  setInlineMessage($('#userResult'),'');
  $('#userDocId').focus();
}

function updateRoleForm(){
  const manager=$('#userRole').value==='manager';
  $('#userStaffId').disabled=manager;
  if(manager){$('#userStaffId').value='';clearFieldError($('#userStaffId'));}
}
$('#userRole').addEventListener('change',updateRoleForm);
$('#clearUserForm').addEventListener('click',clearUserForm);

['userPin','userPinConfirm','managerNewPin','managerConfirmPin','userStaffId'].forEach(id=>{
  const input=$('#'+id);
  input?.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'');clearFieldError(input);});
});
['userDocId','userName'].forEach(id=>$('#'+id).addEventListener('input',()=>clearFieldError($('#'+id))));

$('#saveUserBtn').addEventListener('click',async()=>{
  const button=$('#saveUserBtn');
  const id=$('#userDocId').value.trim();
  const name=$('#userName').value.trim();
  const staffId=$('#userStaffId').value.trim();
  const pin=$('#userPin').value.trim();
  const confirmPin=$('#userPinConfirm').value.trim();
  const role=$('#userRole').value;
  const active=$('#userActive').value==='true';
  const fields=['userDocId','userName','userStaffId','userPin','userPinConfirm'];
  fields.forEach(x=>clearFieldError($('#'+x)));
  setInlineMessage($('#userResult'),'');

  let valid=true;
  if(!id){setFieldError($('#userDocId'),'Document ID is required.');valid=false;}
  else if(!/^[A-Za-z0-9_-]+$/.test(id)){setFieldError($('#userDocId'),'Use letters, numbers, hyphens or underscores only.');valid=false;}
  if(!name){setFieldError($('#userName'),'Name is required.');valid=false;}
  if(role==='staff'&&!staffId){setFieldError($('#userStaffId'),'Staff ID is required for staff users.');valid=false;}
  if(role==='staff'&&!/^\d{4}$/.test(pin)){setFieldError($('#userPin'),'Staff PIN must be exactly 4 digits.');valid=false;}
  if(role==='manager'&&!/^\d{4,8}$/.test(pin)){setFieldError($('#userPin'),'Manager PIN must contain 4 to 8 digits.');valid=false;}
  if(pin!==confirmPin){setFieldError($('#userPinConfirm'),'PINs do not match.');valid=false;}
  if(!valid){setInlineMessage($('#userResult'),'Please correct the highlighted fields.','error');return;}

  setButtonLoading(button,true,'Validating…');
  try{
    const unique=await validateUserUniqueness(id,{pin,staffId,role});
    if(!unique.ok){
      const field=unique.field==='pin'?$('#userPin'):$('#userStaffId');
      setFieldError(field,unique.message);
      setInlineMessage($('#userResult'),unique.message,'error');
      return;
    }
    setButtonLoading(button,true,'Saving…');
    const data={name,pin,role,active};
    if(role==='staff') data.staffId=staffId;
    else data.staffId='';
    await saveUser(id,data);
    setInlineMessage($('#userResult'),`✓ ${name} saved successfully.`,'success');
    showToast(`${name} saved successfully.`,'success',{title:'User saved'});
    await loadUsers();
  }catch(error){
    setInlineMessage($('#userResult'),'Could not save this user. Check your connection and try again.','error');
    showToast('Could not save the user.','error',{title:'Save failed'});
  }finally{setButtonLoading(button,false);}
});

$('#usersRows').addEventListener('click',event=>{
  const button=event.target.closest('.edit-user');
  if(!button) return;
  const u=users.find(x=>x.id===button.dataset.id);
  if(!u) return;
  $('#userDocId').value=u.id;
  $('#userName').value=u.name||'';
  $('#userStaffId').value=u.staffId||'';
  $('#userPin').value=u.pin||'';
  $('#userPinConfirm').value=u.pin||'';
  $('#userRole').value=u.role||'staff';
  $('#userActive').value=String(u.active!==false);
  updateRoleForm();
  ['userDocId','userName','userStaffId','userPin','userPinConfirm'].forEach(id=>clearFieldError($('#'+id)));
  setInlineMessage($('#userResult'),`Editing ${u.name||u.id}.`,'info');
  window.scrollTo({top:document.querySelector('#staffmanage').offsetTop-20,behavior:'smooth'});
});

$('#changeManagerPinBtn').addEventListener('click',async()=>{
  const button=$('#changeManagerPinBtn');
  const pin=$('#managerNewPin').value.trim();
  const confirm=$('#managerConfirmPin').value.trim();
  clearFieldError($('#managerNewPin'));clearFieldError($('#managerConfirmPin'));setInlineMessage($('#managerPinResult'),'');
  if(!/^\d{4,8}$/.test(pin)){setFieldError($('#managerNewPin'),'Manager PIN must contain 4 to 8 digits.');return;}
  if(pin!==confirm){setFieldError($('#managerConfirmPin'),'PINs do not match.');return;}
  if(String(user.pin||'')===pin){setFieldError($('#managerNewPin'),'Choose a different PIN from your current PIN.');return;}

  setButtonLoading(button,true,'Changing PIN…');
  try{
    const unique=await validateUserUniqueness(user.id,{pin,role:'manager',staffId:''});
    if(!unique.ok){setFieldError($('#managerNewPin'),unique.message);return;}
    await saveUser(user.id,{pin});
    user.pin=pin;saveSession(user);
    $('#managerNewPin').value='';$('#managerConfirmPin').value='';
    setInlineMessage($('#managerPinResult'),'✓ Manager PIN changed successfully. Use the new PIN next time you log in.','success');
    showToast('Manager PIN changed successfully.','success',{title:'PIN updated'});
    await loadUsers();
  }catch(error){
    setInlineMessage($('#managerPinResult'),'Could not change the manager PIN. Please try again.','error');
    showToast('Could not change the manager PIN.','error',{title:'Save failed'});
  }finally{setButtonLoading(button,false);}
});

$('#seedBtn').addEventListener('click',async()=>{
  const button=$('#seedBtn');
  setInlineMessage($('#seedResult'),'');
  try{
    const existing=await getWeeklyTemplate();
    if(existing.length){
      const confirmed=await confirmAction({
        title:'Update starter template?',
        message:'A weekly template already exists.',
        details:'Running this setup again will update the starter template records. Existing daily tasks for today will not be replaced.',
        confirmText:'Update Template'
      });
      if(!confirmed) return;
    }
    setButtonLoading(button,true,'Creating…');
    await seedStarterTemplate();
    setInlineMessage($('#seedResult'),'✓ Starter weekly template saved successfully.','success');
    showToast('Weekly template saved successfully.','success',{title:'Setup complete'});
  }catch(error){
    setInlineMessage($('#seedResult'),'Could not save the weekly template. Check your connection and try again.','error');
    showToast('Could not save the weekly template.','error',{title:'Setup failed'});
  }finally{setButtonLoading(button,false);}
});

$('#logout').addEventListener('click',()=>{clearSession();location.href='login.html';});

try{
  await loadUsers();
  await ensureTodayTasks();
  watchTodayTasks(render,()=>showToast('Live task updates are temporarily unavailable.','error'));
}catch(error){
  $('#managerRows').innerHTML='<tr><td colspan="5" class="error">Could not load manager data. Check your connection and refresh.</td></tr>';
  showToast('Could not load manager data. Check your connection.','error');
}

initNetworkStatus();
registerAppServiceWorker();
