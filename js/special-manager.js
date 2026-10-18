/* V4.3 Manager — module configuration is the source of truth.
   Monthly projections are read only and never create tasks merely by viewing. */
import {
  getCleaningConfig,saveCleaningConfig,projectCleaningSchedule,syncFutureCleaningRules,
  getComplianceConfig,saveComplianceConfig,getComplianceRecords,COMPLIANCE_STANDARD,
  createComplianceOneWeek,syncFutureComplianceDefinitions
} from './special-tasks.js';
import {getAssignableUsers,todayISO,weekStartISO,addDaysISO,getTasksInRange,slotForClock} from './store.js';
import {showToast,escapeHtml,confirmAction,protectClickHandler} from './ui.js';
const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];const $=s=>document.querySelector(s);const e=v=>escapeHtml(String(v??''));
const monthRange=m=>{const [year,month]=m.split('-').map(Number);return [m+'-01',`${m}-${String(new Date(year,month,0).getDate()).padStart(2,'0')}`]};
const currentMonth=()=>todayISO().slice(0,7);
const cleanStatus=s=>({completed:'Completed',cancelled:'Cancelled',missed:'Missed',pending:'Pending',scheduled:'Scheduled'}[s]||s);
const timeSlots=[['S1','05:30–09:00'],['S2','09:00–14:00'],['S3','14:00–18:00'],['S4','18:00–20:00'],['S5','20:00–22:00']];
const names=users=>new Map(users.map(u=>[u.id,u.name||u.id]));
const slotFrom=(date,time)=>timeSlots.find(x=>x[0]===slotForClock(time,date))?.[1]||'Scheduled';
function goDay(date){document.querySelector('.manager-nav [data-section="schedule"]')?.click();$('#ntDayTab')?.click();const input=$('#mgrDatePicker');if(input){input.value=date;input.dispatchEvent(new Event('change',{bubbles:true}));}}
function tabs(target,names){return `<nav class="nt-module-tabs">${names.map(([id,label],i)=>`<button type="button" data-tab="${id}" class="${i===0?'active':''}">${e(label)}</button>`).join('')}</nav>`;}
function setTab(section,name){section.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));section.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==name);}
const td=s=>`<td>${e(s)}</td>`;
export async function initSpecialManager(user){
  if($('[data-section="cleaning"]'))return;
  const nav=$('.manager-nav'),hot=nav.querySelector('[data-section="hotfood"]');
  hot.insertAdjacentHTML('beforebegin','<button data-section="cleaning">Cleaning Rotation</button><button data-section="compliance">Compliance Checks</button>');
  const main=$('main.container');main.insertAdjacentHTML('beforeend',`
    <section id="cleaning" class="manager-section" hidden>
      <div class="page-heading"><div><h2>Cleaning Rotation</h2><p>One rotation sequence · one schedule · monthly visibility.</p></div></div>
      ${tabs('cleaning',[['settings','Rotation Settings'],['month','Monthly Schedule'],['workload','Workload Summary'],['history','History & Exceptions']])}
      <div data-panel="settings" class="card elevated"><div class="section-intro"><h3>Cleaning rules & rotation areas</h3><button class="btn" id="cleanSave">Save Permanent Settings</button></div><p class="muted">Changes here affect future occurrences. Default effort is 60 minutes; staff assignment and area order are managed only here.</p><div id="cleanRows" class="special-config-list"></div><button id="cleanAdd" class="btn secondary" type="button">+ Add Cleaning Rule</button></div>
      <div data-panel="month" class="card elevated" hidden><h3>Monthly Cleaning Schedule</h3><div class="nt-module-tools"><label>Month<input id="cleanMonth" type="month" value="${currentMonth()}"></label><label>Staff<select id="cleanStaffFilter"><option value="">All staff</option></select></label><label>Status<select id="cleanStatusFilter"><option value="">All statuses</option><option value="scheduled">Scheduled</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="missed">Missed</option><option value="cancelled">Cancelled</option></select></label><label>Area<input id="cleanAreaFilter" placeholder="Find area"></label><button class="btn" id="cleanLoad">Load Month</button></div><div id="cleanMonthly"></div></div>
      <div data-panel="workload" class="card elevated" hidden><h3>Cleaning Workload Summary</h3><p class="muted">Planned minutes based on 60-minute default, per-rule setting and saved date-only exceptions.</p><div id="cleanWorkload"></div></div>
      <div data-panel="history" class="card elevated" hidden><h3>Cleaning History & Exceptions</h3><div id="cleanHistory"></div></div>
    </section>
    <section id="compliance" class="manager-section" hidden>
      <div class="page-heading"><div><h2>Compliance Checks</h2><p>Manage checklist definitions and review every scheduled check against its completion.</p></div></div>
      ${tabs('compliance',[['settings','Check Settings'],['tasks','Scheduled Checks'],['report','Monthly Compliance Report'],['history','Issues & History']])}
      <div data-panel="settings" class="card elevated"><div class="section-intro"><h3>Checklist Settings</h3><button class="btn" id="compSave">Save Settings</button></div><div id="compSettings"></div></div>
      <div data-panel="tasks" class="card elevated" hidden><div class="section-intro"><h3>Compliance Task Types</h3><button class="btn" id="compAddTask">＋ Create Compliance Task</button></div><div id="compTaskRows"></div><div id="compTaskEdit"></div></div>
      <div data-panel="report" class="card elevated" hidden><div class="section-intro"><h3>Monthly Compliance Report</h3><button id="compPrint" class="btn secondary">Print / Save PDF</button></div><div class="nt-module-tools"><label>Month<input id="compMonth" type="month" value="${currentMonth()}"></label><label>Status<select id="compStatus"><option value="">All statuses</option><option value="completed">Completed</option><option value="scheduled">Scheduled</option><option value="missed">Missed</option><option value="issue">Issue</option></select></label><button id="compLoad" class="btn">Load Report</button></div><div id="compReport"></div></div>
      <div data-panel="history" class="card elevated" hidden><h3>Compliance Issues & Full Responses</h3><p class="muted">Issues are reported to management via the official WhatsApp channel. This app stores the result and staff confirmation only—no photos or resolution workflow.</p><div id="compHistory"></div></div>
    </section>`);
  for(const sectionName of ['cleaning','compliance']){
    const section=$('#'+sectionName),btn=nav.querySelector(`[data-section="${sectionName}"]`);
    btn.onclick=()=>{nav.querySelectorAll('button[data-section]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelectorAll('.manager-section').forEach(p=>p.hidden=true);section.hidden=false;};
    section.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{setTab(section,b.dataset.tab);if(sectionName==='cleaning'&&b.dataset.tab!=='settings')loadCleaningMonth();if(sectionName==='compliance'&&b.dataset.tab==='tasks')renderComplianceTasks();if(sectionName==='compliance'&&['report','history'].includes(b.dataset.tab))loadComplianceMonth();});
  }
  const users=await getAssignableUsers(),byId=names(users),userSelect=(selected='')=>users.map(u=>`<option value="${e(u.id)}" ${u.id===selected?'selected':''}>${e(u.name||u.id)}</option>`).join('');
  let cleaning=await getCleaningConfig(),compliance=await getComplianceConfig(),lastCleaning=[];
  const cfgSelect=(value,values)=>values.map(x=>`<option value="${e(x[0])}" ${x[0]===value?'selected':''}>${e(x[1])}</option>`).join('');
  function renderCleaning(){
    $('#cleanRows').innerHTML=(cleaning.items||[]).map((r,i)=>`<div class="special-rule" data-i="${i}">
      <div class="special-rule-head"><strong>${e(byId.get(r.staffId)||r.staffId||'Unassigned')}</strong><button class="btn secondary small" data-remove>Remove</button></div>
      <div class="form-grid"><label class="field">Assigned staff<select data-k="staffId">${userSelect(r.staffId)}</select></label><label class="field">Scheduled time<input type="time" data-k="time" value="${e(r.time||'14:01')}"></label>
        <label class="field">Default effort (minutes)<input type="number" min="1" max="1440" data-k="effortMinutes" value="${Number(r.effortMinutes??60)}"></label>
        <label class="field">Rotation mode<select data-k="mode">${cfgSelect(r.mode||'rotate',[['rotate','Next area in sequence'],['fixed','Same area each week']])}</select></label>
        <label class="field">Next task number<input type="number" min="1" data-k="nextIndex" value="${Number(r.nextIndex||0)+1}"></label></div>
      <div class="day-checks">${DAYS.map(d=>`<label><input type="checkbox" data-day="${d}" ${r.days?.includes(d)?'checked':''}> ${d}</label>`).join('')}</div>
      <label class="field">Cleaning areas — one per line, in sequence<textarea rows="5" data-k="areas">${e((r.areas||[]).join('\n'))}</textarea></label>
      <div class="day-checks"><label><input type="checkbox" data-k="missingLabels" ${r.missingLabels?'checked':''}> Place missing labels</label><label><input type="checkbox" data-k="photo" ${r.photo?'checked':''}> Existing cleaning photo requirement</label><label><input type="checkbox" data-k="active" ${r.active!==false?'checked':''}> Active</label></div>
      <div class="nt-readonly">Next area: ${e((r.areas||[])[Number(r.nextIndex||0)%(r.areas||[]).length]||'—')} · Preview preserves rotation position</div></div>`).join('');
    $('#cleanRows').querySelectorAll('.special-rule').forEach(el=>{const i=Number(el.dataset.i);el.querySelector('[data-remove]').onclick=()=>{if(!confirm('Remove this rule from future schedules? Historical records remain.'))return;collectCleaning();cleaning.items.splice(i,1);renderCleaning();};});
  }
  function collectCleaning(){for(const el of $('#cleanRows').querySelectorAll('.special-rule')){const r=cleaning.items[Number(el.dataset.i)];const val=k=>el.querySelector(`[data-k="${k}"]`);r.staffId=val('staffId').value;r.time=val('time').value;r.effortMinutes=Number(val('effortMinutes').value);if(!Number.isInteger(r.effortMinutes)||r.effortMinutes<1)throw Error('Effort must be at least 1 minute.');r.mode=val('mode').value;r.nextIndex=Math.max(0,Number(val('nextIndex').value||1)-1);r.days=[...el.querySelectorAll('[data-day]:checked')].map(x=>x.dataset.day);r.areas=val('areas').value.split('\n').map(x=>x.trim()).filter(Boolean);r.missingLabels=val('missingLabels').checked;r.photo=val('photo').checked;r.active=val('active').checked;}}
  renderCleaning();$('#cleanAdd').onclick=()=>{try{collectCleaning();cleaning.items.push({id:'rule-'+Date.now(),staffId:users[0]?.id||'',days:['Mon'],time:'14:01',effortMinutes:60,mode:'rotate',areas:['New cleaning area'],nextIndex:0,missingLabels:false,photo:false,active:true});renderCleaning();}catch(err){showToast(err.message,'error');}};
  $('#cleanSave').onclick=async()=>{try{collectCleaning();await saveCleaningConfig(cleaning.items,user);await syncFutureCleaningRules(cleaning,user);showToast('Cleaning rules saved. Completed history is unchanged.','success');}catch(err){showToast(err.message,'error');}};
  protectClickHandler($('#cleanSave'));
  $('#cleanStaffFilter').insertAdjacentHTML('beforeend',userSelect());
  async function loadCleaningMonth(){
    const month=$('#cleanMonth').value;if(!month)return;const [from,to]=monthRange(month);
    try{
      const actual=await getTasksInRange(from,to);
      lastCleaning=projectCleaningSchedule(cleaning,from,to,users,actual);
      const staff=$('#cleanStaffFilter').value,area=$('#cleanAreaFilter').value.toLowerCase(),status=$('#cleanStatusFilter').value;
      const visible=lastCleaning.filter(x=>(!staff||x.assignedTo===staff)&&(!area||x.area.toLowerCase().includes(area))&&(!status||x.status===status));
      const counts={scheduled:lastCleaning.length,completed:lastCleaning.filter(x=>x.status==='completed').length,remaining:lastCleaning.filter(x=>!['completed','cancelled'].includes(x.status)).length};
      $('#cleanMonthly').innerHTML=`<div class="nt-module-grid">${Object.entries(counts).map(([k,v])=>`<div class="nt-module-stat"><small>${e(k)}</small><strong>${v}</strong></div>`).join('')}</div><div class="nt-module-table-wrap"><table class="nt-module-table"><thead><tr><th>Date</th><th>Cleaning area</th><th>Assigned staff</th><th>Time / slot</th><th>Effort</th><th>Status</th><th>Go to day</th></tr></thead><tbody>${visible.map(r=>`<tr><td>${e(r.date)}</td>${td(r.area)}${td(r.assignedName)}<td>${e(r.sourceTime)}<br><small>${e(slotFrom(r.date,r.sourceTime))}</small></td>${td(r.effortMinutes+' min')}${td(cleanStatus(r.status))}<td><button class="btn secondary small" data-clean-date="${r.date}">Open</button></td></tr>`).join('')||'<tr><td colspan="7">No matching cleaning tasks</td></tr>'}</tbody></table></div>`;
      $('#cleanMonthly').querySelectorAll('[data-clean-date]').forEach(b=>b.onclick=()=>goDay(b.dataset.cleanDate));
      const groups=new Map();for(const r of lastCleaning){const rec=groups.get(r.assignedName)||{minutes:0,tasks:0,complete:0};rec.minutes+=r.effortMinutes;rec.tasks++;if(r.status==='completed')rec.complete++;groups.set(r.assignedName,rec);}
      $('#cleanWorkload').innerHTML=`<p>Month: ${e(month)}</p><div class="nt-module-table-wrap"><table class="nt-module-table"><thead><tr><th>Staff</th><th>Planned tasks</th><th>Completed</th><th>Effort minutes</th></tr></thead><tbody>${[...groups].map(([staff,r])=>`<tr>${td(staff)}${td(r.tasks)}${td(r.complete)}${td(r.minutes)}</tr>`).join('')}</tbody></table></div>`;
      const audit=actual.filter(x=>x.specialType==='cleaning'&&(x.status==='completed'||x.status==='cancelled'||x.status==='missed'||x.dayOnlyOverride));
      $('#cleanHistory').innerHTML=`<p class="muted">${e(month)} — saved task history, not predictions</p><div class="nt-module-table-wrap"><table class="nt-module-table"><thead><tr><th>Date</th><th>Task</th><th>Staff</th><th>Status</th><th>Date override</th></tr></thead><tbody>${audit.map(r=>`<tr>${td(r.date)}${td(r.taskName)}${td(r.assignedName)}${td(cleanStatus(r.status))}${td(r.dayOnlyOverride?'Yes':'No')}</tr>`).join('')||'<tr><td colspan="5">No saved cleaning history</td></tr>'}</tbody></table></div>`;
    }catch(err){$('#cleanMonthly').textContent=err.message||'Monthly schedule unavailable.';}
  }
  $('#cleanLoad').onclick=loadCleaningMonth;['cleanStaffFilter','cleanStatusFilter','cleanAreaFilter'].forEach(id=>$('#'+id).onchange=loadCleaningMonth);
  // Compliance configuration and checklist versioning. Changes to the arrays
  // do not overwrite checklist snapshots already stored on daily occurrences.
  function renderCompSettings(){const field=(key,label,rows)=>`<label class="field"><span class="field-label">${label} — one item per line</span><textarea data-checklist="${key}" rows="${rows}">${e((compliance[key]||[]).join('\n'))}</textarea></label>`;
    $('#compSettings').innerHTML=`<h3>Temperature limits</h3><div class="form-grid">${(compliance.tempPoints||[]).map((p,i)=>`<label class="field"><span class="field-label">${e(p.name)} limit °C</span><input type="number" step="0.1" data-temp="${i}" value="${Number(p.limit)}"></label>`).join('')}</div>${field('dailyItems','Daily Safety',7)}${field('weeklyItems','Weekly Safety',6)}${field('sfbbOpening','SFBB Opening',8)}${field('sfbbClosing','SFBB Closing',8)}<p class="muted">Changes apply to newly generated checks. Submitted records retain their original questions and results. Issue reports go through the official WhatsApp channel.</p><details><summary>Checklist definition version history (up to 25 previous versions)</summary><div id="compVersions">${(compliance.definitionHistory||[]).slice().reverse().map(h=>`<p>Version ${e(h.version)} — ${e(new Date(h.savedAtMs||0).toLocaleString('en-GB'))} · ${e(h.modifiedBy||'Manager')}</p>`).join('')||'No previous versions'}</div></details>`;}
  function collectCompSettings(){document.querySelectorAll('[data-temp]').forEach(el=>compliance.tempPoints[Number(el.dataset.temp)].limit=Number(el.value));document.querySelectorAll('[data-checklist]').forEach(el=>compliance[el.dataset.checklist]=el.value.split('\n').map(x=>x.trim()).filter(Boolean));}
  renderCompSettings();$('#compSave').onclick=async()=>{try{collectCompSettings();compliance.configVersion=Number(compliance.configVersion||1)+1;await saveComplianceConfig(compliance,user);await syncFutureComplianceDefinitions(compliance,user);showToast('Checklists saved for future checks. Existing results unchanged.','success');}catch(err){showToast(err.message,'error');}};
  protectClickHandler($('#compSave'));
  const definitions=()=>[...COMPLIANCE_STANDARD.map(t=>({id:t.key,name:compliance.taskNames?.[t.key]||t.name,effort:Number(compliance.effortMinutes?.[t.key]??t.effort),days:t.key==='weekly'?[compliance.weeklyDay||'Wed']:DAYS,items:t.type==='daily'?compliance.dailyItems:t.type==='weekly'?compliance.weeklyItems:t.type==='sfbb_open'?compliance.sfbbOpening:t.type==='sfbb_close'?compliance.sfbbClosing:compliance.tempPoints.map(x=>x.name),standard:true})),...(compliance.customTasks||[]).map(t=>({...t,id:'custom_'+t.id,effort:Number(t.effortMinutes??10),standard:false}))];
  function renderComplianceTasks(){const arr=definitions();$('#compTaskRows').innerHTML=`<div class="nt-module-table-wrap"><table class="nt-module-table"><thead><tr><th>Task name</th><th>Days</th><th>Effort</th><th>Checklist items</th><th></th></tr></thead><tbody>${arr.map(t=>`<tr><td><b>${e(t.name)}</b></td>${td((t.days||[]).join(', '))}${td(t.effort+' min')}${td((t.items||[]).length)}<td><button class="btn secondary small" data-comp-edit="${e(t.id)}">Configure</button> ${t.id==='temp_am'||t.id==='temp_pm'?'':`<button class="btn secondary small" data-comp-copy="${e(t.id)}">Duplicate</button>`}</td></tr>`).join('')}</tbody></table></div>`;
    $('#compTaskRows').querySelectorAll('[data-comp-edit]').forEach(b=>b.onclick=()=>openComplianceEditor(b.dataset.compEdit));
    $('#compTaskRows').querySelectorAll('[data-comp-copy]').forEach(b=>b.onclick=()=>openComplianceEditor(null,definitions().find(x=>x.id===b.dataset.compCopy)));
  }
  function openComplianceEditor(id=null,copy=null){const source=definitions().find(x=>x.id===id)||copy;const original=Boolean(id&&source);const keys=source?.items||[];
    $('#compTaskEdit').innerHTML=`<div class="card elevated" style="margin-top:18px"><div class="section-intro"><h3>${original?'Edit Compliance Task':copy?'Duplicate Compliance Task':'Create Compliance Task'}</h3><button type="button" class="btn secondary small" id="compEditorClose">Close</button></div><p class="muted">Task definitions live here. Day/Weekly Editors can change scheduling without renaming the task.</p>
    <div class="form-grid"><label class="field">Task name<input id="compEditorName" value="${e(copy?'Copy of '+copy.name:source?.name||'')}" required></label><label class="field">Scheduled time<input id="compEditorTime" type="time" value="${e(source?.time||'09:00')}"></label><label class="field">Assigned staff<select id="compEditorStaff">${userSelect(source?.staffId||users[0]?.id)}</select></label><label class="field">Effort minutes<input id="compEditorEffort" type="number" min="1" value="${source?.effort||10}"></label></div>
    <label class="field">Checklist questions (one per line)<textarea id="compEditorItems" rows="6" ${source?.id==='temp_am'||source?.id==='temp_pm'?'readonly':''}>${e(keys.join('\n'))}</textarea></label>
    <div class="nt-create-days">${DAYS.map(d=>`<label><input type="checkbox" data-comp-day="${d}" ${source?.days?.includes(d)?'checked':''}>${d}</label>`).join('')}</div>
    ${!original?`<label class="field">Apply schedule<select id="compEditorScope"><option value="future">All Future Weeks</option><option value="week">This Week Only</option></select></label><label class="field">Week commencing<input id="compEditorWeek" type="date" value="${weekStartISO(todayISO())}"></label>`:'<p class="muted">Permanent task name/checklist changes are made here. To adjust one scheduled date, use the Day Editor.</p>'}
    <button class="btn" id="compEditorSave">${original?'Save Definition':'Review & Create Task'}</button><div id="compEditorStatus" role="status"></div></div>`;
    $('#compEditorClose').onclick=()=>$('#compTaskEdit').innerHTML='';
    $('#compEditorSave').onclick=async()=>{try{
      const name=$('#compEditorName').value.trim(),time=$('#compEditorTime').value,staffId=$('#compEditorStaff').value,effortMinutes=Number($('#compEditorEffort').value),items=$('#compEditorItems').value.split('\n').map(x=>x.trim()).filter(Boolean),days=[...$('#compTaskEdit').querySelectorAll('[data-comp-day]:checked')].map(x=>x.dataset.compDay);
      if(!name||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)||!Number.isInteger(effortMinutes)||effortMinutes<1||!items.length||!days.length)throw Error('Enter a name, valid time, effort, at least one question and weekdays.');
      if(original){
        if(source.standard){compliance.taskNames={...(compliance.taskNames||{}),[id]:name};compliance.effortMinutes={...(compliance.effortMinutes||{}),[id]:effortMinutes};if(id==='weekly')compliance.weeklyDay=days[0];if(id==='daily')compliance.dailyItems=items;if(id==='weekly')compliance.weeklyItems=items;if(id==='sfbb_open')compliance.sfbbOpening=items;if(id==='sfbb_close')compliance.sfbbClosing=items;}
        else{const t=(compliance.customTasks||[]).find(x=>'custom_'+x.id===id);Object.assign(t,{name,days,time,staffId,effortMinutes,items});}
        await saveComplianceConfig(compliance,user);await syncFutureComplianceDefinitions(compliance,user);renderCompSettings();renderComplianceTasks();$('#compTaskEdit').innerHTML='';showToast('Definition saved. Completed responses preserved.','success');
      }else{
        const scope=$('#compEditorScope').value,weekStart=$('#compEditorWeek').value;if(scope==='week'){
          const ok=await confirmAction({title:'Create one-week compliance tasks?',message:`Create ${name} on ${days.join(', ')} in the selected week?`,details:'Each selected date becomes an individual Compliance Check, with checklist answers in the Compliance Report.',confirmText:'Create This Week'});if(!ok)return;
          await createComplianceOneWeek({name,days,weekStart,time,slotId:slotForClock(time,weekStart),effortMinutes,staffId,items},user);
        }else{
          const ok=await confirmAction({title:'Create recurring compliance task?',message:`Create ${name} every ${days.join(', ')} from the selected week?`,details:'The Compliance Checks module owns the task name and checklist. Day/Weekly Editors own date-specific scheduling.',confirmText:'Create Future Recurrence'});if(!ok)return;
          compliance.customTasks=[...(compliance.customTasks||[]),{id:'custom_'+Date.now()+'_'+Math.random().toString(36).slice(2,5),name,days,time,staffId,effortMinutes,items,effectiveFrom:weekStart,active:true}];await saveComplianceConfig(compliance,user);
        }
        renderComplianceTasks();$('#compTaskEdit').innerHTML='';showToast('Compliance task created.','success');
      }
    }catch(err){$('#compEditorStatus').textContent=err.message||'Could not save.';}};
    protectClickHandler($('#compEditorSave'));
  }
  $('#compAddTask').onclick=()=>openComplianceEditor();
  async function loadComplianceMonth(){const month=$('#compMonth').value;if(!month)return;const [from,to]=monthRange(month);
    try{
      const [tasks,records]=await Promise.all([getTasksInRange(from,to),getComplianceRecords(from,to)]),all=tasks.filter(t=>t.specialType==='compliance'),actual=new Map(all.map(x=>[x.date+'|'+(x.complianceRuleId||x.complianceType),x]));
      const rows=[];let d=new Date(from+'T12:00:00'),end=new Date(to+'T12:00:00');
      while(d<=end){const date=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,day=DAYS[(d.getDay()+6)%7];for(const t of definitions()){
        if(!t.days?.includes(day)||t.active===false||date<(t.effectiveFrom||'0000-01-01'))continue;
        const found=actual.get(date+'|'+t.id)||all.find(x=>x.date===date&&x.taskName===t.name);
        const result=records.find(r=>r.taskId===found?.id),issue=result?.result?.overall==='issue'||(result?.result?.checks||[]).some(c=>c.status==='issue')||(result?.result?.temperatures||[]).some(c=>c.outOfRange);
        rows.push({date,name:found?.taskName||t.name,staff:found?.assignedName||'Recurring assignment',time:found?.sourceTime||t.time||'Shift-based',effort:found?.effortMinutes??t.effort,status:found?.status||((date<todayISO())?'missed':'scheduled'),result,issue});
      }d.setDate(d.getDate()+1);}
      // Date Only special checks must appear, even if they have no recurrence.
      for(const t of all.filter(x=>x.adHoc&&!rows.some(r=>r.result?.taskId===t.id&&r.date===t.date&&r.name===t.taskName)))rows.push({date:t.date,name:t.taskName,staff:t.assignedName,time:t.sourceTime,effort:t.effortMinutes,status:t.status,result:records.find(x=>x.taskId===t.id),issue:false});
      rows.sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time));
      const stats=[['Expected',rows.length],['Completed',rows.filter(x=>x.status==='completed').length],['Missed',rows.filter(x=>x.status==='missed').length],['Issues',rows.filter(x=>x.issue).length]];
      const filter=$('#compStatus').value,visible=rows.filter(x=>!filter||(filter==='issue'?x.issue:x.status===filter));
      $('#compReport').innerHTML=`<div class="nt-module-grid">${stats.map(([k,n])=>`<div class="nt-module-stat"><small>${k}</small><strong>${n}</strong></div>`).join('')}</div><div class="nt-module-table-wrap"><table class="nt-module-table"><thead><tr><th>Date</th><th>Check</th><th>Assigned</th><th>Time</th><th>Status</th><th>Result</th></tr></thead><tbody>${visible.map(x=>`<tr>${td(x.date)}${td(x.name)}${td(x.staff)}${td(x.time)}${td(cleanStatus(x.status))}<td>${x.issue?'⚠ Issue':x.status==='completed'?'✓ OK':'—'}</td></tr>`).join('')||'<tr><td colspan="6">No matching checks</td></tr>'}</tbody></table></div>`;
      $('#compHistory').innerHTML=`<p>${records.length} recorded submissions in ${e(month)}</p><div class="nt-module-table-wrap"><table class="nt-module-table"><thead><tr><th>Date</th><th>Check</th><th>Completed by</th><th>Detailed results</th></tr></thead><tbody>${records.map(r=>`<tr>${td(r.date)}${td(r.taskName)}${td(r.completedByName)}<td>${e((r.result?.checks||[]).map(x=>x.item+': '+x.status+(x.managementAware?' · WhatsApp confirmed':'')).join(' | ')||(r.result?.temperatures||[]).map(x=>x.id+': '+x.reading+'°C'+(x.outOfRange?' ⚠':'' )).join(' | ')||'—')}</td></tr>`).join('')||'<tr><td colspan="4">No submitted compliance checks</td></tr>'}</tbody></table></div>`;
    }catch(err){$('#compReport').textContent=err.message||'Compliance report unavailable.';}
  }
  $('#compLoad').onclick=loadComplianceMonth;$('#compStatus').onchange=loadComplianceMonth;$('#compPrint').onclick=()=>window.print();
}
