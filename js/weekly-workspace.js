/* North Terrace V4.4 — desktop-first unified schedule workspace.
   No changes to the General View layout or other manager tabs. */
import {
  WEEK_DAYS,weekStartISO,addDaysISO,todayISO,dateOnlyMaxISO,isDateOnlyAllowed,dayKey,slotForClock,SLOT_DEFS,slotLabelForDate,
  getWeeklyTemplate,getSetupTasksForDate,getStaffAvailability,getTasksForDate,ensureTasksForDate,
  getSavedWeekdayAssignmentSnapshots,sundayEveningRotatorForDate,isSundayEveningRotationTime,
  ruleForDate,getTaskLifecycleRules,isLifecycleInactive,saveDayTaskEdit,
  saveBulkDayEdits,saveBulkRecurringEdits,previewRecurringExceptions,
  saveLifecycleAction,cancelTaskToday,createWeeklyMultiDayTask
} from './store.js';
import {getHotFoodConfig} from './hot-food-store.js';
import {getCleaningConfig,projectCleaningSchedule,getComplianceConfig,COMPLIANCE_STANDARD,ensureSpecialTasksForDate,updateComplianceRecurringRule,previewComplianceRecurringExceptions} from './special-tasks.js';
import {ensureHotFoodDay} from './hot-food-engine.js';
import {escapeHtml,showToast,confirmAction,setButtonLoading,runActionOnce} from './ui.js';
import {reportCategoryForTask} from './task-category.js';
const $=s=>document.querySelector(s),clean=s=>escapeHtml(String(s??''));
const HHMM=/^([01]\d|2[0-3]):[0-5]\d$/;
const categories=['Daily Operations','Cleaning','Daily Safety','Weekly Safety','Temperature Log','SFBB','Hot Food'];
const slots=SLOT_DEFS.map(s=>({value:s.id,label:s.label}));
const field=(root,name)=>root.querySelector(`[name="${name}"]`);
const optionHTML=(choices,selected)=>choices.map(x=>`<option value="${clean(x.value)}" ${x.value===selected?'selected':''}>${clean(x.label)}</option>`).join('');
const nextWeekday=(from,day)=>addDaysISO(from,(WEEK_DAYS.indexOf(day)-WEEK_DAYS.indexOf(dayKey(from))+7)%7);
const minutes=t=>HHMM.test(String(t))?Number(t.slice(0,2))*60+Number(t.slice(3)):null;
const splitShift=s=>String(s||'').split(',').map(x=>x.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/)).filter(Boolean).map(m=>[Number(m[1])*60+Number(m[2]),Number(m[3])*60+Number(m[4])]);
// Review is READ-ONLY. A slow/offline Firestore read must never trap the editor
// behind a permanent spinner or accidentally proceed without checking exceptions.
const REVIEW_READ_LIMIT_MS=12000;
function reviewRead(promise,label){
  let timer;
  return Promise.race([
    promise,
    new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(`${label} took too long. Check Firebase connectivity and try Review & Save again. Nothing was saved.`)),REVIEW_READ_LIMIT_MS);})
  ]).finally(()=>clearTimeout(timer));
}


export function initUnifiedScheduleWorkspace({getDate,getPeople,refreshDay,user}){
  let view='day',anchor=weekStartISO(todayISO()),templates=[],weekRows=[],lifecycle=new Map(),selected=new Set(),bulk=false,cleaningConfig=null,complianceConfig=null,hotFoodConfig=null,storedOwners=new Map(),ownerLookupFailed=false;
  const dayPane=$('#ntDayWorkspace'),weekPane=$('#ntWeeklyWorkspace');
  const week=()=>weekStartISO(anchor),dateOf=d=>addDaysISO(week(),WEEK_DAYS.indexOf(d));
  const people=()=>getPeople().filter(p=>p.active!==false&&(p.role==='staff'||p.role==='assignee'));
  const staffOptions=value=>optionHTML([{value:'',label:'Unassigned'},...people().map(p=>({value:p.id,label:p.name||p.id}))],value);
  const staffName=id=>getPeople().find(x=>x.id===id)?.name||'Unassigned';
  // A projected week can have no dailyTasks snapshots yet. Project the real
  // recurring assignee from its saved weekday rule, not from today's rota.
  function projectedOperationsAssignee(rule,date){
    if(!rule)return 'Not assigned yet';
    if(isSundayEveningRotationTime(date,rule.sourceTime||'')&&!rule.rotationAssignmentOverride){
      const id=sundayEveningRotatorForDate(date);
      return id?staffName(id):'Not assigned yet';
    }
    if(rule.assigneeId)return staffName(rule.assigneeId);
    const key=String(rule.assigneeKey||'');
    if(key.startsWith('staffId:')){
      const staffId=key.slice('staffId:'.length);
      return getPeople().find(p=>p.role==='staff'&&String(p.staffId||'')===staffId)?.name||'Not assigned yet';
    }
    if(key.startsWith('person:')){
      const wanted=key.slice('person:'.length).toLowerCase().replace(/^parth$/,'parthy');
      return getPeople().find(p=>String(p.name||'').toLowerCase()===wanted)?.name||'Not assigned yet';
    }
    return 'Not assigned yet';
  }
  function ownerForCompliance(key,day){
    const stable=String(key).replace(/[^a-zA-Z0-9_-]/g,'_');
    return storedOwners.get(`complianceAssignee_${stable}_${day}`)||null;
  }
  function storedStaffName(id,fallback=''){
    if(id)return getPeople().find(p=>p.id===id)?.name||fallback||'Unassigned';
    return ownerLookupFailed?'Assignment unavailable':'Not assigned yet';
  }

  async function setView(which){
    view=which;dayPane.hidden=which!=='day';weekPane.hidden=which!=='week';
    $('#ntDayTab').classList.toggle('active',which==='day');$('#ntWeekTab').classList.toggle('active',which==='week');
    $('#ntDayTab').setAttribute('aria-pressed',String(which==='day'));$('#ntWeekTab').setAttribute('aria-pressed',String(which==='week'));
    if(which==='week')await loadWeek();
  }
  $('#ntDayTab').onclick=()=>setView('day');$('#ntWeekTab').onclick=()=>setView('week');
  $('#ntWeekPrev').onclick=()=>{anchor=addDaysISO(week(),-7);loadWeek();};
  $('#ntWeekNext').onclick=()=>{anchor=addDaysISO(week(),7);loadWeek();};
  $('#ntWeekToday').onclick=()=>{anchor=weekStartISO(todayISO());loadWeek();};
  $('#ntWeekReload').onclick=loadWeek;
  $('#ntWeekDate').onchange=e=>{if(e.target.value){anchor=weekStartISO(e.target.value);loadWeek();}};
  $('#ntWeekCreate').onclick=()=>{if(!document.querySelector('.nt-edit-overlay'))openWeeklyCreator();};
  $('#ntBulkToggle').onclick=()=>{bulk=!bulk;selected.clear();$('#ntBulkControl').hidden=!bulk;$('#ntBulkToggle').textContent=bulk?'Exit Bulk Edit':'▢ Bulk Edit';$('#ntBulkReviewPanel').hidden=true;renderWeek();};
  $('#ntBulkField').onchange=drawBulkValue;
  $('#ntBulkAddField').onclick=addBulkField;
  $('#ntBulkScope').onchange=()=>$('#ntBulkEffective').closest('label').hidden=$('#ntBulkScope').value==='once';
  $('#ntBulkEffective').value=todayISO();drawBulkValue();$('#ntBulkReview').onclick=()=>runActionOnce($('#ntBulkReview'),reviewBulk);
  async function loadWeek(){
    $('#ntWeekRows').innerHTML='<tr><td colspan="8">Loading weekly schedule…</td></tr>';
    selected.clear();$('#ntBulkReviewPanel').hidden=true;
    try{
      const [all,rows,cfg,rules,cleanCfg,compCfg]=await Promise.all([
        getWeeklyTemplate(),Promise.all(WEEK_DAYS.map(d=>getSetupTasksForDate(dateOf(d)))),getHotFoodConfig(),getTaskLifecycleRules(),getCleaningConfig(),getComplianceConfig()
      ]);
      cleaningConfig=cleanCfg;complianceConfig=compCfg;hotFoodConfig=cfg;
      templates=all.filter(t=>!(cfg.enabled&&/^Check hot food temperature\s+\d{1,2}:\d{2}$/i.test(t.taskName||'')));
      // Read existing stable ownership (not staff availability) for modules
      // whose occurrences have not been generated yet. This lookup is read-only.
      const complianceRules=[
        ...COMPLIANCE_STANDARD.map(x=>({key:x.key,days:x.key==='weekly'?[compCfg.weeklyDay||'Wed']:WEEK_DAYS})),
        ...(compCfg.customTasks||[]).filter(x=>x.active!==false).map(x=>({key:'custom_'+x.id,days:x.days||[]}))
      ];
      const ownerIds=[...new Set(complianceRules.flatMap(rule=>rule.days.map(d=>`complianceAssignee_${String(rule.key).replace(/[^a-zA-Z0-9_-]/g,'_')}_${d}`)))];
      if(cfg.enabled)ownerIds.push(...WEEK_DAYS.slice(0,5).map(d=>`hotFoodCookingAssignee_${d}`));
      try{storedOwners=await getSavedWeekdayAssignmentSnapshots(ownerIds);ownerLookupFailed=false;}
      catch(err){
        // A future-view read must not block the editor or create a new owner.
        // Existing daily records, config overrides and normal templates remain visible.
        storedOwners=new Map();ownerLookupFailed=true;console.warn('Saved weekday owners unavailable',err);
      }
      weekRows=rows;lifecycle=rules;$('#ntWeekDate').value=week();renderWeek();
    }catch(error){$('#ntWeekRows').innerHTML=`<tr><td colspan="8">${clean(error.message||'Schedule could not load.')}</td></tr>`;}
  }
  function renderWeek(){
    $('#ntWeekHead').innerHTML=`<tr><th>Task · Category</th>${WEEK_DAYS.map(d=>`<th>${d}<br><small>${dateOf(d).slice(5)}</small></th>`).join('')}</tr>`;
    const sorted=templates.map(t=>{
      const entries=WEEK_DAYS.map((day,i)=>{
        const date=dateOf(day),rule=ruleForDate(t,date),active=Boolean(rule&&rule.active!==false&&!isLifecycleInactive(lifecycle.get(t.id)||[],date));
        const row=weekRows[i]?.find(r=>r.templateTaskId===t.id&&r.status!=='cancelled');
        return {day,date,rule,active,row};
      });
      return {t,entries,sort:entries.filter(e=>e.active).map(e=>e.rule.sourceTime||'99:99').sort()[0]||'99:99'};
    }).sort((a,b)=>a.sort.localeCompare(b.sort)||a.t.taskName.localeCompare(b.t.taskName));
    $('#ntWeekRows').innerHTML=sorted.map(({t,entries})=>`<tr>
      <th><b>${clean(t.taskName)}</b><small>${clean(t.reportCategory||reportCategoryForTask(t))}</small><div class="nt-weekday-dots">${entries.map(e=>`<span class="${e.active?'on':''}">${e.day}</span>`).join('')}</div></th>
      ${entries.map(e=>{
        const key=t.id+'|'+e.day,selectedClass=selected.has(key)?'selected':'',time=e.row?.sourceTime??e.rule?.sourceTime??'';
        const display=e.active?`<b>${clean(e.row?.assignedName||projectedOperationsAssignee(e.rule,e.date))}</b><small>${clean(slotLabelForDate(e.row?.slotId||e.rule.slotId||slotForClock(time,e.date),e.date))}</small><small>${clean(time)}</small>`:'<b>＋</b><small>Not scheduled</small>';
        return `<td><button type="button" class="nt-week-cell ${e.active?'':'empty'} ${selectedClass}" data-template="${clean(t.id)}" data-day="${e.day}" ${e.date<todayISO()?'disabled title="Past dates are read only"':''}>${display}</button></td>`;
      }).join('')}</tr>`).join('')||'<tr><td colspan="8">No recurring tasks configured.</td></tr>';
    renderSpecialRows();
    $('#ntBulkCount').textContent=selected.size+' selected';
  }
  // Dedicated module tasks are presented as a holistic weekly overview.
  // Cleaning has one row across the week even if multiple area rules apply.
  // Hot Food hourly checks remain a single informational row and are never
  // mistaken for fixed recurring tasks.
  function renderSpecialRows(){
    if(cleaningConfig){
      const all=[];for(let i=0;i<7;i++)all.push(...projectCleaningSchedule(cleaningConfig,dateOf(WEEK_DAYS[i]),dateOf(WEEK_DAYS[i]),getPeople(),weekRows[i]||[]));
      $('#ntWeekRows').insertAdjacentHTML('beforeend',`<tr><th><b>Cleaning Rotation</b><small>Staff & rotation managed in Cleaning Rotation</small></th>${WEEK_DAYS.map(d=>{const cells=all.filter(x=>x.date===dateOf(d));return `<td>${cells.length?cells.map(x=>`<button class="nt-week-cell" type="button" data-special="cleaning" data-date="${x.date}" data-rule="${clean(x.ruleId)}" ${x.date<todayISO()?'disabled':''}><b>${clean(x.assignedName)}</b><small>${clean(slotLabelForDate(x.slotId,x.date))}</small><small>${clean(x.sourceTime)}</small></button>`).join(''):'<span class="nt-readonly">—</span>'}</td>`}).join('')}</tr>`);
    }
    if(complianceConfig?.enabled!==false){
      const custom=(complianceConfig.customTasks||[]).filter(x=>x.active!==false).map(x=>({key:'custom_'+x.id,name:x.name,days:x.days||[],time:x.time||'09:00'}));
      const regular=COMPLIANCE_STANDARD.map(x=>({key:x.key,name:complianceConfig.taskNames?.[x.key]||x.name,days:x.key==='weekly'?[complianceConfig.weeklyDay||'Wed']:WEEK_DAYS,time:complianceConfig.scheduleOverrides?.[x.key]?.Mon?.time||''}));
      for(const type of [...regular,...custom]){
        $('#ntWeekRows').insertAdjacentHTML('beforeend',`<tr><th><b>${clean(type.name)}</b><small>Compliance Checks · name locked</small></th>${WEEK_DAYS.map((day,i)=>{const date=dateOf(day),active=type.days.includes(day),record=(weekRows[i]||[]).find(x=>x.specialType==='compliance'&&x.complianceRuleId===type.key);
          if(!active)return '<td><div class="nt-week-cell empty">—</div></td>';
          const owner=ownerForCompliance(type.key,day),candidate=complianceConfig.scheduleOverrides?.[type.key]?.[day]||{};
          const override=String(candidate.effectiveFrom||'0000-01-01')<=date?candidate:{};
          const id=override.staffId??owner?.staffId??'';
          const person=record?.assignedName||storedStaffName(id,owner?.staffName||'');
          const time=record?.sourceTime||override.time||owner?.initialTime||type.time||'';
          const slot=record?.slotId||override.slotId||(time?slotForClock(time,date):'');
          return `<td><button class="nt-week-cell" type="button" data-special="compliance" data-date="${date}" data-rule="${clean(type.key)}" ${date<todayISO()?'disabled':''}><b>${clean(person)}</b><small>${clean(slot?slotLabelForDate(slot,date):'Time not assigned')}</small><small>${clean(time||'—')}</small></button></td>`;}).join('')}</tr>`);
      }
    }
    if(hotFoodConfig?.enabled){
      $('#ntWeekRows').insertAdjacentHTML('beforeend',`<tr><th><b>Initial Cooking</b><small>Hot Food · Weekday ${clean(hotFoodConfig.initialCookingTime||'06:00')}</small></th>${WEEK_DAYS.map((d,i)=>{const date=dateOf(d),dow=i+1,record=(weekRows[i]||[]).find(x=>x.hotFoodType==='cooking_initial');
        const owner=storedOwners.get(`hotFoodCookingAssignee_${d}`),explicit=hotFoodConfig.initialCookingStaffByDay?.[d]||'';
        const staffId=explicit||owner?.staffId||'';
        const name=record?.assignedName||storedStaffName(staffId,owner?.staffName||'');
        const time=record?.sourceTime||hotFoodConfig.initialCookingTime||'06:00';
        return `<td>${dow<=5?`<button class="nt-week-cell" data-special="hotfood" data-date="${date}" ${date<todayISO()?'disabled':''}><b>${clean(name)}</b><small>${clean(slotLabelForDate(record?.slotId||slotForClock(time,date),date))}</small><small>${clean(time)}</small></button>`:'<div class="nt-week-cell empty">Manual start</div>'}</td>`}).join('')}</tr>`);
      $('#ntWeekRows').insertAdjacentHTML('beforeend',`<tr><th><b>Hot Food Hourly Display Checks</b><small>Automatically generated per batch · not fixed tasks</small></th>${WEEK_DAYS.map((day,i)=>{const d=dateOf(day),checks=(weekRows[i]||[]).filter(t=>t.hotFood&&t.hotFoodType==='temperature_check');return `<td><button type="button" class="nt-week-cell ${checks.length?'':'empty'}" data-hotgroup-date="${d}"><b>${checks.length?checks.length+' checks':'Automatic'}</b><small>${checks.length?checks.map(t=>t.sourceTime||'').filter(Boolean).sort().join(', '):'Display start + hourly'}</small><small>View details</small></button></td>`;}).join('')}</tr>`);
    }
  }
  $('#ntWeekRows').addEventListener('click',async e=>{
    const button=e.target.closest('button[data-hotgroup-date]');if(!button)return;
    return runActionOnce(button, async()=>{
    const date=button.dataset.hotgroupDate;
    try{
      if(date===todayISO())await ensureHotFoodDay(date);
      const rows=(await getTasksForDate(date,{ensure:false})).filter(t=>t.hotFood===true&&t.hotFoodType==='temperature_check');
      const groups=new Map();for(const row of rows){const key=row.hotFoodSessionId||'Unknown batch';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);}
      dialog('Hot Food Hourly Display Checks',`${date} · Automatic batch-based tasks`,`
        <section class="nt-editor-section"><p class="nt-editor-note">Checks are generated from each batch's confirmed cooking completion/display start time. Temperatures are entered by staff through Hot Food, not in this recurring editor.</p>
        ${groups.size?[...groups].map(([id,tasks])=>`<div class="nt-editor-warning"><b>Batch ${clean(id)}</b><div>${tasks.sort((a,b)=>String(a.sourceTime).localeCompare(String(b.sourceTime))).map(t=>`<div>${clean(t.sourceTime||'')} · ${clean(t.assignedName||'Unassigned')} · ${clean(t.status||'Pending')}</div>`).join('')}</div></div>`).join(''):'<p>No batch has created hourly checks for this date yet. The first check will be one hour after the recorded display start, then hourly while stock remains, before the four-hour deadline.</p>'}
        </section><div class="nt-editor-actions"><button type="button" class="btn secondary" data-close>Close</button></div>`);
    }catch(err){showToast(err.message||'Could not load hourly checks.','error');}
    });
  });
  $('#ntWeekRows').addEventListener('click',async e=>{
    const b=e.target.closest('button[data-special]');if(!b)return;
    return runActionOnce(b,async()=>{
    const date=b.dataset.date,day=dayKey(date),type=b.dataset.special;
    try{
      if(type==='hotfood')await ensureHotFoodDay(date);else await ensureSpecialTasksForDate(date);
      const rows=await getTasksForDate(date,{ensure:false});
      const record=rows.find(x=>type==='cleaning'?x.specialType==='cleaning'&&x.cleaningRuleId===b.dataset.rule:type==='compliance'?x.specialType==='compliance'&&x.complianceRuleId===b.dataset.rule:x.hotFoodType==='cooking_initial');
      if(!record)return showToast('No task can be opened for this date. Check the source module configuration and rota.','warning');
      await openEditor(null,date,day,record);
    }catch(err){showToast(err.message||'Could not open special task','error');}
    });
  });
  $('#ntWeekRows').addEventListener('click',async event=>{
    const btn=event.target.closest('button[data-template]');if(!btn)return;
    const id=btn.dataset.template,day=btn.dataset.day,date=dateOf(day),tpl=templates.find(t=>t.id===id);if(!tpl)return;
    if(bulk){const key=id+'|'+day;if(selected.has(key))selected.delete(key);else selected.add(key);$('#ntBulkReviewPanel').hidden=true;renderWeek();return;}
    await runActionOnce(btn,()=>openEditor(tpl,date,day,(weekRows[WEEK_DAYS.indexOf(day)]||[]).find(x=>x.templateTaskId===id&&x.status!=='cancelled')));
  });
  // Click the existing Day Editor row to open the shared compact modal.
  $('#managerSlots').addEventListener('click',e=>{
    const btn=e.target.closest('.open-row-edit');if(!btn)return;
    e.preventDefault();e.stopPropagation();
    const row=btn.closest('[data-id]');if(!row)return;
    runActionOnce(btn,async()=>{
      const date=getDate(),snap=(await getTasksForDate(date,{ensure:false})).find(x=>x.id===row.dataset.id);
      if(!snap)throw new Error('Task changed. Refresh the day.');
      const tpl=snap.templateTaskId?(await getWeeklyTemplate()).find(t=>t.id===snap.templateTaskId):null;
      await openEditor(tpl,date,dayKey(date),snap);
    }).catch(error=>showToast(error.message||'Could not open editor','error'));
  },true);
  function dialog(title,subtitle,html){
    const outer=document.createElement('div');outer.className='nt-edit-overlay';
    outer.innerHTML=`<section class="nt-edit-dialog" role="dialog" aria-modal="true" aria-label="${clean(title)}"><h2>${clean(title)}</h2><p class="nt-dialog-sub">${clean(subtitle)}</p>${html}<div class="nt-editor-error" role="alert"></div></section>`;
    document.body.append(outer);outer.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{if(outer.dataset.saving!=='true')outer.remove();});outer.onclick=e=>{if(e.target===outer&&outer.dataset.saving!=='true')outer.remove();};return outer;
  }
  const error=(outer,message)=>outer.querySelector('.nt-editor-error').textContent=message;
  const changeValues=outer=>{const form=outer.querySelector('.nt-editor-form');return {
    taskName:field(form,'taskName').value.trim(),sourceTime:field(form,'sourceTime').value,slotId:field(form,'slotId').value,
    assignedTo:field(form,'assignedTo').value,effortMinutes:field(form,'effortMinutes').value===''?null:Number(field(form,'effortMinutes').value),
    reportCategory:field(form,'reportCategory').value,photoRequired:field(form,'photoRequired').checked
  };};
  async function availabilityWarnings(date,c,excludeId=''){
    const result=[];if(c.sourceTime&&slotForClock(c.sourceTime,date)!==c.slotId)result.push('Time is outside selected time slot.');
    if(!c.assignedTo)return result;
    try{
      const [av,rows]=await reviewRead(Promise.all([getStaffAvailability(),getTasksForDate(date,{ensure:false})]),'Availability check');
      const periods=splitShift(av?.week?.[c.assignedTo]?.[dayKey(date).toLowerCase()]);
      if(!periods.some(([a,b])=>minutes(c.sourceTime)>=a&&minutes(c.sourceTime)<b))result.push('Assigned person is outside their recorded shift.');
      const effort=rows.filter(r=>r.id!==excludeId&&r.assignedTo===c.assignedTo&&r.slotId===c.slotId&&r.status!=='cancelled').reduce((sum,r)=>sum+(Number(r.effortMinutes)||0),0)+(Number(c.effortMinutes)||0);
      const capacity=periods.reduce((sum,[a,b])=>{const slot=SLOT_DEFS.find(s=>s.id===c.slotId);const start=minutes(slot?.start||''),end=minutes(slot?.end||'');return sum+(start===null||end===null?0:Math.max(0,Math.min(end,b)-Math.max(start,a)));},0);
      if(effort>capacity)result.push(`Assigned effort ${effort} minutes exceeds recorded available time ${capacity} minutes.`);
    }catch{result.push('Availability check unavailable. Assignment can still be saved.');}
    return result;
  }
  async function openEditor(tpl,date,day,row=null){
    if(document.querySelector('.nt-edit-overlay'))return;
    if(date<todayISO())return showToast('Historical tasks cannot be edited.','warning');
    const rule=tpl?ruleForDate(tpl,date):null;
    const name=row?.taskName||rule?.taskName||tpl?.taskName||'New task',time=row?.sourceTime||rule?.sourceTime||'09:00';
    const slot=row?.slotId||rule?.slotId||slotForClock(time,date),effort=row?.effortMinutes??rule?.effortMinutes??'',who=row?.assignedTo??rule?.assigneeId??'';
    const photo=row?.photoRequired??rule?.photoRequired??tpl?.photoRequired??false;
    const category=row?.reportCategory||rule?.reportCategory||tpl?.reportCategory||reportCategoryForTask(tpl||row||{});
    const special=row?.specialType|| (row?.hotFood?'hotfood':'');
    const locked=Boolean(special);const cleaning=special==='cleaning',cooking=special==='hotfood';
    const dots=tpl?WEEK_DAYS.map(d=>`${ruleForDate(tpl,nextWeekday(todayISO(),d))?.active?'●':'○'} ${d}`).join('  '):'Date Only';
    const outer=dialog('Edit Task',`${day} ${date} · ${row?.status||'Recurring schedule'}`,`
      <form class="nt-editor-form" onsubmit="return false">
      <label class="nt-wide">Task name<input name="taskName" value="${clean(name)}" ${locked?'readonly title="Name is managed in its source module"':''} required></label>
      <label>Scheduled time<input name="sourceTime" type="time" value="${clean(time)}" required></label>
      <label>Time slot<select name="slotId">${optionHTML(slots,slot)}</select></label>
      <label>Assigned staff<select name="assignedTo" ${cleaning?'disabled title="Managed in Cleaning Rotation"':''}>${staffOptions(who)}</select></label>
      <label>Effort minutes<input name="effortMinutes" type="number" min="1" step="1" value="${clean(effort)}"></label>
      <label>Category<select name="reportCategory" ${locked?'disabled':''}>${optionHTML([...new Set([...categories,category])].map(x=>({value:x,label:x})),category)}</select></label>
      <label class="nt-check-photo">Photo required<input name="photoRequired" type="checkbox" ${locked?'disabled':''} ${photo?'checked':''}></label>
      </form><p class="nt-editor-note">Weekdays: ${clean(dots)}</p>
      <section class="nt-editor-section"><h3>Save scope</h3><select id="ntEditScope"><option value="once">This date only</option>${tpl||special==='compliance'?'<option value="future">Every '+clean(day)+' from effective date</option>':''}</select>
      <label id="ntEditEffectiveLabel" hidden>Effective date<input id="ntEditEffective" type="date" value="${date}" min="${todayISO()}"></label></section>
      <div id="ntEditConflicts" hidden></div>
      <div class="nt-editor-actions"><button type="button" class="btn secondary" data-close>Close</button>
      <button type="button" class="btn secondary" id="ntMoreActions">More Actions</button><button type="button" class="btn" id="ntSaveEdit">Review & Save</button></div>`);
    if(locked)outer.querySelector('.nt-editor-note').textContent=(cleaning?'Cleaning assignments and permanent settings':'Task definitions and permanent settings')+' are managed in their source module. Changes here affect a selected date'+(special==='compliance'?' or future recurring compliance occurrences.':'.');
    const scope=outer.querySelector('#ntEditScope');
    if(!isDateOnlyAllowed(date)){
      const single=scope.querySelector('option[value="once"]');
      if(single){single.disabled=true;single.textContent='This date only (maximum 90 days ahead)';}
      scope.value='future';
      outer.querySelector('.nt-editor-note').textContent+=' Date Only changes are available only until '+dateOnlyMaxISO()+'.';
    }
    if(tpl&&!row){scope.value='future';outer.querySelector('#ntEditEffectiveLabel').hidden=false;}
    scope.onchange=()=>outer.querySelector('#ntEditEffectiveLabel').hidden=scope.value!=='future';
    outer.querySelector('#ntEditEffectiveLabel').hidden=scope.value!=='future';
    field(outer,'sourceTime').onchange=e=>{const computed=slotForClock(e.target.value,date);if(computed)field(outer,'slotId').value=computed;};
    outer.querySelector('#ntMoreActions').onclick=()=>openActions(tpl,date,day,outer,row);
    const saveEditButton=outer.querySelector('#ntSaveEdit');
    // Existing one-off records beyond the new limit remain stored but cannot
    // receive a new one-day override; they have no recurring save alternative.
    if(!isDateOnlyAllowed(date)&&!tpl&&special!=='compliance'){
      saveEditButton.disabled=true;
      error(outer,'Existing Date Only task is outside the 90-day edit window. Its record is preserved.');
    }
    let saveBusy=false;
    saveEditButton.onclick=async()=>{
      // A second tap during validation/confirmation must not start another save.
      if(saveBusy)return;
      saveBusy=true;
      outer.dataset.saving='true';
      setButtonLoading(saveEditButton,true,'Reviewing…');
      let savedFeedback='Task saved.',savedNotice='success';
      const entered=changeValues(outer);error(outer,'');
      if(locked){delete entered.taskName;delete entered.reportCategory;delete entered.photoRequired;if(cleaning)delete entered.assignedTo;}
      const original={taskName:name,sourceTime:time,slotId:slot,assignedTo:who,
        effortMinutes:effort===''?null:Number(effort),reportCategory:category,photoRequired:Boolean(photo)};
      const c=Object.fromEntries(Object.entries(entered).filter(([key,value])=>value!==original[key]));
      // The on-screen staff member is sometimes a Sunday rotating default.
      // Saving unrelated fields must NEVER convert that default to a permanent
      // recurring assignment. Only a manager's actual staff change overrides it.
      if(scope.value==='future'&&Object.hasOwn(c,'assignedTo'))c.rotationAssignmentOverride=true;
      if(!Object.keys(c).length&&!(scope.value==='future'&&tpl&&(!rule||rule.active===false))){error(outer,'No changes detected. Choose a different value before saving.');saveBusy=false;delete outer.dataset.saving;setButtonLoading(saveEditButton,false);return;}
      if((!locked&&!entered.taskName)||!HHMM.test(entered.sourceTime)||entered.effortMinutes!==null&&(!Number.isInteger(entered.effortMinutes)||entered.effortMinutes<=0)){error(outer,'Check task name, time and effort minutes.');saveBusy=false;delete outer.dataset.saving;setButtonLoading(saveEditButton,false);return;}
      try{
        if(scope.value==='future'&&special==='compliance'){
          const effective=outer.querySelector('#ntEditEffective').value;
          if(!/^\d{4}-\d{2}-\d{2}$/.test(effective)||effective<todayISO())throw new Error('Choose a current or future recurring effective date.');
          const target=nextWeekday(effective,day);
          setButtonLoading(saveEditButton,true,'Checking exceptions…');
          const conflicts=await reviewRead(previewComplianceRecurringExceptions(row.complianceRuleId,day,target),'Compliance exception review');
          if(conflicts.length){const box=outer.querySelector('#ntEditConflicts');box.hidden=false;box.innerHTML=`<div class="nt-editor-warning">${conflicts.length} date-only exception(s): ${conflicts.map(x=>clean(x.date)).join(', ')}</div><label><input type="radio" name="ntSpecialReplace" value="keep" checked> Keep existing date-only edits</label><label><input type="radio" name="ntSpecialReplace" value="replace"> Replace date-only edits</label>`;}
          setButtonLoading(saveEditButton,true,'Awaiting confirmation…');
          const ok=await confirmAction({title:'Update future compliance scheduling?',message:`Change ${name} every ${day} from ${target}?`,details:`Only date-only exceptions through ${addDaysISO(target,90)} are reviewed. Older protected exceptions and completed history remain unchanged. Task name and checklist stay in Compliance Checks.`,confirmText:'Save Recurrence'});if(!ok)return;
          setButtonLoading(saveEditButton,true,'Saving…');
          await updateComplianceRecurringRule(row.complianceRuleId,day,{staffId:entered.assignedTo,time:entered.sourceTime,slotId:entered.slotId,effortMinutes:entered.effortMinutes},target,user,outer.querySelector('[name="ntSpecialReplace"]:checked')?.value==='replace');
        }else if(scope.value==='future'){
          const effective=outer.querySelector('#ntEditEffective').value;
          if(!/^\d{4}-\d{2}-\d{2}$/.test(effective)||effective<todayISO())throw new Error('Choose a current or future recurring effective date.');
          const target=nextWeekday(effective,day);
          const changes=[{templateTaskId:tpl.id,day,changes:{...c,active:true}}];
          setButtonLoading(saveEditButton,true,'Checking exceptions…');
          const conflicts=await reviewRead(previewRecurringExceptions(changes,target),'Recurring exception review');
          let replace=false;
          if(conflicts.length){
            const box=outer.querySelector('#ntEditConflicts');box.hidden=false;
            box.innerHTML=`<div class="nt-editor-warning"><b>${conflicts.length} date-only exception(s)</b> · ${conflicts.slice(0,10).map(x=>clean(x.date)).join(', ')}</div><label><input type="radio" name="ntReplace" value="keep" checked> Keep existing exceptions</label><label><input type="radio" name="ntReplace" value="replace"> Replace existing exceptions</label>`;
          }
          setButtonLoading(saveEditButton,true,'Checking availability…');
          const warnings=await availabilityWarnings(target,entered,row?.id||'');
          setButtonLoading(saveEditButton,true,'Awaiting confirmation…');
          const ok=await confirmAction({title:'Save recurring task change?',message:`Apply ${name} every ${day} from ${target}?`,details:`${Object.hasOwn(c,'assignedTo')?`Assigned staff: ${staffName(who)} → ${staffName(entered.assignedTo)}. `:''}${conflicts.length} existing one-day exception(s) through ${addDaysISO(target,90)}. Existing exceptions beyond that window and completed history are protected. ${warnings.join(' ')}`,confirmText:'Save Recurrence'});
          if(!ok)return;
          replace=outer.querySelector('input[name="ntReplace"]:checked')?.value==='replace';
          setButtonLoading(saveEditButton,true,'Saving…');
          await saveBulkRecurringEdits({changes,effectiveFrom:target,replaceExceptions:replace},user);
          if(!replace&&conflicts.some(x=>x.date===date)){savedFeedback='Recurring schedule saved, but this date kept an existing date-only exception. Today’s displayed assignment will not change.';savedNotice='warning';}
          else savedFeedback=`Recurring ${day} assignment updated from ${target}${Object.hasOwn(c,'assignedTo')?` to ${staffName(entered.assignedTo)}`:''}.`;
        }else{
          if(!isDateOnlyAllowed(date))return error(outer,'Date Only changes can be made only through '+dateOnlyMaxISO()+' (90 days from today).');
          if(!row?.id)return error(outer,'No saved occurrence exists for this date. Choose future recurrence instead.');
          setButtonLoading(saveEditButton,true,'Checking availability…');
          const warnings=await availabilityWarnings(date,entered,row.id);
          setButtonLoading(saveEditButton,true,'Awaiting confirmation…');
          const ok=await confirmAction({title:'Save selected date only?',message:`Change ${name} on ${date} only?`,details:`${Object.hasOwn(c,'assignedTo')?`Assigned staff: ${staffName(who)} → ${staffName(entered.assignedTo)}. `:''}Other days unchanged. ${warnings.join(' ')}`,confirmText:'Save This Date'});
          if(!ok)return;
          setButtonLoading(saveEditButton,true,'Saving…');
          await saveDayTaskEdit(row.id,date,c,user);
          savedFeedback=`Saved for ${day} ${date} only${Object.hasOwn(c,'assignedTo')?`: ${staffName(who)} → ${staffName(entered.assignedTo)}`:''}. Other dates unchanged.`;
        }
        // Remove the editor only after the one confirmed save succeeds.
        outer.remove();if(view==='week')await loadWeek();else await refreshDay();showToast(savedFeedback,savedNotice);
      }catch(e){error(outer,e.message||'Save failed. No success reported.');}
      finally{saveBusy=false;delete outer.dataset.saving;if(outer.isConnected)setButtonLoading(saveEditButton,false);}
    };
  }
  async function openActions(tpl,date,day,parent,row){
    const name=tpl?.taskName||row?.taskName||'Task';
    const outer=dialog('More Actions',`${name} · ${day} ${date}`,`
      <section class="nt-editor-section"><h3>Task schedule actions</h3>
      <label>Action<select id="ntLifeKind"><option value="cancel">Cancel once (one date)</option>${tpl?'<option value="pause">Pause for a period</option><option value="resume">Resume</option><option value="end">End future recurrence</option><option value="restart">Restart</option>':''}</select></label>
      <label>Start / occurrence date<input type="date" id="ntLifeDate" value="${date}" min="${todayISO()}"></label>
      <label id="ntLifeUntilLabel" hidden>Pause until (inclusive)<input type="date" id="ntLifeUntil" value="${addDaysISO(date,7)}" min="${date}"></label>
      <label>Reason (optional)<textarea rows="2" id="ntLifeReason" placeholder="Optional note"></textarea></label>
      <p class="nt-editor-note">Past completions and audit history are never deleted.</p></section>
      <div class="nt-editor-actions"><button type="button" class="btn secondary" data-close>Back</button><button type="button" id="ntLifeConfirm" class="btn">Confirm Action</button></div>`);
    const kind=outer.querySelector('#ntLifeKind');kind.onchange=()=>outer.querySelector('#ntLifeUntilLabel').hidden=kind.value!=='pause';
    const lifecycleButton=outer.querySelector('#ntLifeConfirm');
    lifecycleButton.onclick=()=>runActionOnce(lifecycleButton,async()=>{
      outer.dataset.saving='true';
      setButtonLoading(lifecycleButton,true,'Reviewing…');
      try{
      const type=kind.value,chosen=outer.querySelector('#ntLifeDate').value,until=outer.querySelector('#ntLifeUntil').value,reason=outer.querySelector('#ntLifeReason').value;
      if(chosen<todayISO()||type==='pause'&&until<chosen)return error(outer,'Choose valid current or future dates.');
      if(type==='cancel'&&!isDateOnlyAllowed(chosen))return error(outer,'One-day cancellation is limited to '+dateOnlyMaxISO()+' (90 days ahead).');
      try{
        const ok=await confirmAction({title:'Confirm schedule action?',message:`${type==='cancel'?'Cancel':type} ${name} ${type==='cancel'?'on':'from'} ${chosen}${type==='pause'?' to '+until:''}?`,details:'Completed history remains unchanged; reason optional.',confirmText:'Confirm Action'});
        if(!ok)return;
        if(type==='cancel'){
          await ensureTasksForDate(chosen);
          const record=(await getTasksForDate(chosen,{ensure:false})).find(x=>tpl?x.templateTaskId===tpl.id:x.id===row?.id);
          if(!record)throw new Error('No scheduled occurrence found on that date.');
          await cancelTaskToday(record.id,user,reason);
        }else await saveLifecycleAction({templateTaskId:tpl.id,type,date:chosen,until,reason},user);
        outer.remove();parent?.remove();showToast('Task action saved.','success');await refreshDay();if(view==='week')await loadWeek();
      }catch(e){error(outer,e.message||'Action could not be saved.');}
      }finally{delete outer.dataset.saving;if(outer.isConnected)setButtonLoading(lifecycleButton,false);}
    });
  }
  function openWeeklyCreator(){
    const begin=week(),outer=dialog('Create Task',`Week commencing ${begin} · Select days first`,`
      <div id="ntCreateStep1"><h3>1. Select weekdays</h3><div class="nt-create-days">${WEEK_DAYS.map(d=>`<label><input type="checkbox" data-create-day="${d}"> ${d}</label>`).join('')}</div><button id="ntCreateWeekdays" class="btn secondary small">Weekdays</button> <button id="ntCreateEveryday" class="btn secondary small">Every day</button></div>
      <form class="nt-editor-form" onsubmit="return false"><label class="nt-wide">Task name<input name="taskName" required placeholder="Enter task name"></label>
      <label>Category<select name="reportCategory">${optionHTML(categories.map(x=>({value:x,label:x})),'Daily Operations')}</select></label>
      <label>Scheduled time<input type="time" name="sourceTime" value="09:00" required></label>
      <label>Time slot<select name="slotId">${optionHTML(slots,slotForClock('09:00',begin))}</select></label>
      <label>Assigned staff<select name="assignedTo">${staffOptions('')}</select></label>
      <label>Effort (minutes)<input type="number" name="effortMinutes" value="15" min="1" step="1"></label>
      <label class="nt-check-photo">Photo required<input type="checkbox" name="photoRequired"></label></form>
      <section class="nt-editor-section"><h3>2. Choose save scope</h3><label><input type="radio" name="ntCreateScope" value="week"> One-time · selected dates in this week (within 90 days)</label><label><input type="radio" name="ntCreateScope" value="future" checked> Recurring · selected weekdays going forward</label><label id="ntCreateEffectiveLabel">Recurring effective from<input id="ntCreateEffective" type="date" value="${begin<todayISO()?todayISO():begin}" min="${todayISO()}"></label><p class="nt-editor-note">Each weekday can be edited independently after creation. Past dates cannot be created.</p></section>
      <div id="ntCreateReview" hidden></div><div class="nt-editor-actions"><button type="button" class="btn secondary" data-close>Cancel</button><button type="button" id="ntCreateReviewButton" class="btn">Review Task</button></div>`);
    outer.querySelector('#ntCreateWeekdays').onclick=()=>outer.querySelectorAll('[data-create-day]').forEach(x=>x.checked=WEEK_DAYS.indexOf(x.dataset.createDay)<5);
    outer.querySelector('#ntCreateEveryday').onclick=()=>outer.querySelectorAll('[data-create-day]').forEach(x=>x.checked=true);
    field(outer,'sourceTime').onchange=ev=>field(outer,'slotId').value=slotForClock(ev.target.value,begin);
    outer.querySelectorAll('[name="ntCreateScope"]').forEach(x=>x.onchange=()=>outer.querySelector('#ntCreateEffectiveLabel').hidden=outer.querySelector('[name="ntCreateScope"]:checked').value!=='future');
    const createReviewButton=outer.querySelector('#ntCreateReviewButton');
    createReviewButton.onclick=()=>runActionOnce(createReviewButton,async()=>{
      const c=changeValues(outer),days=[...outer.querySelectorAll('[data-create-day]:checked')].map(x=>x.dataset.createDay),saveScope=outer.querySelector('[name="ntCreateScope"]:checked').value,effectiveFrom=outer.querySelector('#ntCreateEffective').value;
      if(!days.length||!c.taskName||!HHMM.test(c.sourceTime)||!(Number(c.effortMinutes)>0))return error(outer,'Select weekdays and enter valid task name, time and effort.');
      if(saveScope==='future'&&(!effectiveFrom||effectiveFrom<todayISO()))return error(outer,'Select a valid current/future effective date.');
      if(saveScope==='week'&&days.some(d=>!isDateOnlyAllowed(dateOf(d))))return error(outer,'One-time tasks must be between today and '+dateOnlyMaxISO()+'. Choose another week or recurring scope.');
      const review=outer.querySelector('#ntCreateReview');review.hidden=false;
      review.innerHTML=`<div class="nt-editor-warning"><b>${clean(c.taskName)}</b><p>${days.join(', ')} · ${clean(c.sourceTime)} · ${clean(staffName(c.assignedTo))} · ${c.effortMinutes} min</p><p>${saveScope==='week'?'This week only · one-time':'Recurring every selected weekday'} from ${clean(saveScope==='week'?begin:effectiveFrom)}</p></div><button type="button" class="btn" id="ntCreateConfirm">Confirm & Create</button>`;
      review.querySelector('#ntCreateConfirm').onclick=()=>runActionOnce(review.querySelector('#ntCreateConfirm'),async()=>{
        const b=review.querySelector('#ntCreateConfirm');
        outer.dataset.saving='true';setButtonLoading(b,true,'Creating…');
        try{await createWeeklyMultiDayTask({weekStart:begin,effectiveFrom,weekdays:days,scope:saveScope,data:c},user);outer.remove();showToast('Selected task days created.','success');await loadWeek();await refreshDay();}
        catch(err){error(outer,err.message||'Could not create task');}
        finally{delete outer.dataset.saving;if(outer.isConnected)setButtonLoading(b,false);}
      });
    });
  }
  const bulkChoices=[['assignedTo','Assigned staff'],['sourceTime','Scheduled time'],['slotId','Time slot'],['effortMinutes','Effort minutes'],['reportCategory','Category'],['photoRequired','Photo required']];
  function bulkValueHTML(key,controlId){
    const id=clean(controlId);
    if(key==='assignedTo')return `<select id="${id}">${staffOptions('')}</select>`;
    if(key==='sourceTime')return `<input id="${id}" type="time" value="10:00">`;
    if(key==='effortMinutes')return `<input id="${id}" type="number" min="1" value="15">`;
    if(key==='photoRequired')return `<select id="${id}"><option value="yes">Yes</option><option value="no">No</option></select>`;
    if(key==='reportCategory')return `<select id="${id}">${optionHTML(categories.map(x=>({value:x,label:x})),'Daily Operations')}</select>`;
    return `<select id="${id}">${optionHTML(slots,'S2')}</select>`;
  }
  function drawBulkValue(){
    $('#ntBulkValueHolder').innerHTML=bulkValueHTML($('#ntBulkField').value,'ntBulkValue');
  }
  let bulkNextId=0;
  function addBulkField(){
    const available=bulkChoices.filter(x=>!new Set([$('#ntBulkField').value,...[...document.querySelectorAll('.nt-bulk-extra-field')].map(e=>e.value)]).has(x[0]));
    if(!available.length)return showToast('All available fields are already included.','info');
    const id='ntBulkExtra'+(++bulkNextId),wrapper=document.createElement('div');wrapper.className='nt-bulk-extra-row';
    wrapper.innerHTML=`<label>Also change<select class="nt-bulk-extra-field">${optionHTML(available.map(([value,label])=>({value,label})),available[0][0])}</select></label><label>New value<span class="nt-bulk-extra-value">${bulkValueHTML(available[0][0],id)}</span></label><button type="button" class="btn secondary small nt-bulk-remove">Remove</button>`;
    wrapper.querySelector('.nt-bulk-extra-field').onchange=e=>{wrapper.querySelector('.nt-bulk-extra-value').innerHTML=bulkValueHTML(e.target.value,id);};
    wrapper.querySelector('.nt-bulk-remove').onclick=()=>wrapper.remove();
    $('#ntBulkExtraRows').append(wrapper);
  }
  function collectBulkChanges(){
    const input=[[$('#ntBulkField').value,$('#ntBulkValue').value],...[...document.querySelectorAll('.nt-bulk-extra-row')].map(row=>[row.querySelector('.nt-bulk-extra-field').value,row.querySelector('.nt-bulk-extra-value input,.nt-bulk-extra-value select')?.value||''])];
    const changes={};
    for(const [key,raw] of input){
      if(Object.hasOwn(changes,key))throw new Error('Each field can be changed only once. Remove duplicate fields.');
      const value=key==='effortMinutes'?Number(raw):key==='photoRequired'?raw==='yes':raw;
      if(key==='effortMinutes'&&(!Number.isInteger(value)||value<=0)||key==='sourceTime'&&!HHMM.test(String(value)))throw new Error('Enter valid positive effort and HH:MM scheduled times.');
      changes[key]=value;
    }
    return changes;
  }
  async function reviewBulk(){
    const box=$('#ntBulkReviewPanel');box.hidden=true;
    if(!selected.size)return showToast('Select task/day cells first.','warning');
    const scope=$('#ntBulkScope').value,effective=$('#ntBulkEffective').value;
    if(scope==='once'&&[...selected].some(k=>!isDateOnlyAllowed(dateOf(k.split('|')[1]))))return showToast('Date-only bulk changes must be no later than '+dateOnlyMaxISO()+' (90 days ahead).','warning');
    if(scope==='future'&&(!/^\d{4}-\d{2}-\d{2}$/.test(effective)||effective<todayISO()))return showToast('Choose a current or future recurring effective date.','warning');
    let changes;try{changes=collectBulkChanges();}catch(e){return showToast(e.message,'warning');}
    const edits=[...selected].map(k=>{const [templateTaskId,day]=k.split('|');return {templateTaskId,day,changes:{...changes}};});
    let conflicts,warnings;
    try{
      conflicts=scope==='future'?await reviewRead(previewRecurringExceptions(edits,effective),'Bulk exception review'):[];
      warnings=(await reviewRead(Promise.all(edits.map(async c=>{
        const task=templates.find(t=>t.id===c.templateTaskId),date=scope==='future'?nextWeekday(effective,c.day):dateOf(c.day),rule=ruleForDate(task,date)||{};
        const draft={sourceTime:rule.sourceTime||'',slotId:rule.slotId||'',assignedTo:rule.assigneeId||'',effortMinutes:rule.effortMinutes??0,...c.changes};
        return availabilityWarnings(date,draft);
      })),'Bulk availability review')).flat();
    }catch(e){showToast(e.message||'Review failed. Nothing saved.','error',{duration:10000});return;}
    const beforeAfter=edits.map(c=>{const tpl=templates.find(t=>t.id===c.templateTaskId),date=scope==='future'?nextWeekday(effective,c.day):dateOf(c.day),rule=ruleForDate(tpl,date)||{};
      const lines=Object.entries(changes).map(([key,value])=>{const before=key==='assignedTo'?staffName(rule.assigneeId):rule[key]??tpl[key]??'—';return `${key}: ${String(before)} → ${key==='assignedTo'?staffName(value):String(value)}`;});return {c,tpl,date,lines};});
    box.hidden=false;
    box.innerHTML=`<div class="nt-editor-section"><h3>Review ${edits.length} changes</h3>
      <p>Changing <b>${clean(Object.keys(changes).join(', '))}</b></p>
      <p>Scope: <b>${scope==='future'?'Future recurrence from '+clean(effective):'These dates only'}</b></p><p class="nt-editor-note">${scope==='future'?'Exception review ends '+clean(addDaysISO(effective,90))+'; existing exceptions beyond that date remain protected.':'Date Only limit: '+clean(dateOnlyMaxISO())+'.'}</p>
      <div class="nt-bulk-review-list">${beforeAfter.map(x=>`<div>${clean(x.tpl?.taskName)} · ${x.c.day} (${x.date}) <small>${x.lines.map(clean).join('<br>')}</small></div>`).join('')}</div>
      ${conflicts.length?`<div class="nt-editor-warning">${conflicts.length} one-day exceptions: ${conflicts.slice(0,12).map(x=>clean(x.date+' '+x.taskName)).join(' · ')}</div><label><input type="radio" name="ntBulkConflict" value="keep" checked> Keep All</label><label><input type="radio" name="ntBulkConflict" value="replace"> Replace All</label>`:''}
      ${warnings.length?`<div class="nt-editor-warning">Rota / workload warnings (saving allowed): ${[...new Set(warnings)].map(clean).join(' · ')}</div>`:''}
      <p class="nt-editor-note">Date-only changes are limited to 90 days ahead. Recurring rules continue indefinitely. Existing exceptions outside the review window and completed history stay untouched.</p>
      <div class="nt-editor-actions"><button type="button" id="ntBulkBack" class="btn secondary">Back</button><button type="button" id="ntBulkCommit" class="btn">Confirm & Save</button></div><div class="nt-editor-error"></div></div>`;
    box.querySelector('#ntBulkBack').onclick=()=>box.hidden=true;
    box.querySelector('#ntBulkCommit').onclick=()=>runActionOnce(box.querySelector('#ntBulkCommit'),async()=>{
      const button=box.querySelector('#ntBulkCommit');button.disabled=true;
      try{
        if(scope==='future')await saveBulkRecurringEdits({changes:edits,effectiveFrom:effective,replaceExceptions:box.querySelector('input[name="ntBulkConflict"]:checked')?.value==='replace'},user);
        else{
          const dates=[...new Set(edits.map(c=>dateOf(c.day)))];await Promise.all(dates.map(ensureTasksForDate));
          const rows=await Promise.all(dates.map(d=>getTasksForDate(d,{ensure:false}))),byDate=new Map(dates.map((d,i)=>[d,rows[i]]));
          const patches=edits.map(c=>{const date=dateOf(c.day),task=byDate.get(date).find(x=>x.templateTaskId===c.templateTaskId&&!['completed','cancelled'].includes(x.status));if(!task)throw new Error('One selected task is no longer editable.');return {taskId:task.id,date,changes:c.changes};});
          await saveBulkDayEdits(patches,user);
        }
        selected.clear();box.hidden=true;showToast('Bulk changes saved.','success');await loadWeek();await refreshDay();
      }catch(e){box.querySelector('.nt-editor-error').textContent=e.message||'Bulk save failed.';}finally{button.disabled=false;}
    });
  }
}
