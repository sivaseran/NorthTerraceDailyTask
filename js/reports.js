import {
  getTasksInRange,getAssignableUsers,todayISO,weekStartISO,weekEndISO,
  SLOT_DEFS,isTaskLate
} from './store.js';
import {escapeHtml,showToast,setButtonLoading} from './ui.js';

const fmtMin=m=>{
  const n=Number(m)||0,h=Math.floor(n/60),mm=n%60;
  if(!n) return '—';
  return h?`${h}h ${mm?`${mm}m`:''}`:`${mm}m`;
};
const group=(rows,keyFn)=>{
  const m=new Map();
  rows.forEach(r=>{
    const k=keyFn(r);
    if(!m.has(k)) m.set(k,[]);
    m.get(k).push(r);
  });
  return [...m.entries()];
};
const completed=r=>r.status==='completed';
const missed=r=>r.status==='missed';
const late=r=>Boolean(r.late||isTaskLate(r));
const reassigned=r=>Boolean(r.originalAssignedTo&&r.assignedTo&&r.originalAssignedTo!==r.assignedTo);
const completedByOther=r=>Boolean(r.completedByUserId&&r.assignedTo&&r.completedByUserId!==r.assignedTo);
const effortMissing=r=>!Number(r.effortMinutes);
const pct=(n,d)=>d?Math.round(n/d*100):0;

function monthRange(today){
  const d=new Date(today+'T12:00:00');
  const start=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`;
  const last=new Date(d.getFullYear(),d.getMonth()+1,0);
  const end=`${last.getFullYear()}-${String(last.getMonth()+1).padStart(2,'0')}-${String(last.getDate()).padStart(2,'0')}`;
  return {start,end};
}
function period(type,startInput,endInput){
  const today=todayISO();
  if(type==='today') return {start:today,end:today,label:'Today'};
  if(type==='week') return {start:weekStartISO(today),end:weekEndISO(today),label:'This Week'};
  if(type==='month') return {...monthRange(today),label:'This Month'};
  return {start:startInput||today,end:endInput||startInput||today,label:'Custom Range'};
}
function niceDate(iso){
  if(!iso) return '';
  return new Date(iso+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}
function empty(cols,message='No report records for this selection.'){
  return `<tr><td colspan="${cols}" class="muted report-empty-cell">${escapeHtml(message)}</td></tr>`;
}
function safeFilePart(value){
  return String(value||'all-staff').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

export function initReports({root,userProvider}){
  const $=s=>root.querySelector(s);

  let currentTab='overview';
  let currentPeriod='today';
  let lastRawRows=[];
  let lastRows=[];
  let lastPeriod={start:todayISO(),end:todayISO(),label:'Today'};
  let people=[];
  let loading=false;

  async function loadPeople(){
    try{
      people=(await getAssignableUsers())
        .filter(p=>p.active!==false)
        .sort((a,b)=>{
          const ai=Number(a.staffId)||999,bi=Number(b.staffId)||999;
          return ai-bi||String(a.name||'').localeCompare(String(b.name||''));
        });

      const select=$('#reportStaff');
      const previous=select.value||'all';
      select.innerHTML=`<option value="all">All Staff</option>`+
        people.map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name||p.id)}</option>`).join('')+
        `<option value="__unassigned__">Unassigned tasks</option>`;
      if([...select.options].some(o=>o.value===previous)) select.value=previous;
    }catch(error){
      console.error(error);
      showToast('Could not load staff for report filters.','warning');
    }
  }

  function selectedStaffName(){
    const value=$('#reportStaff').value;
    if(value==='all') return 'All Staff';
    if(value==='__unassigned__') return 'Unassigned';
    const p=people.find(x=>x.id===value);
    return p?.name||'Selected Staff';
  }

  function applyStaffFilter(rows){
    const staffId=$('#reportStaff').value;
    const involvement=$('#reportInvolvement').value;

    if(staffId==='all') return rows;
    if(staffId==='__unassigned__') return rows.filter(r=>!r.assignedTo);

    if(involvement==='completed'){
      return rows.filter(r=>r.completedByUserId===staffId);
    }
    if(involvement==='either'){
      return rows.filter(r=>r.assignedTo===staffId||r.completedByUserId===staffId);
    }
    return rows.filter(r=>r.assignedTo===staffId);
  }

  function updateScope(p){
    const staffName=selectedStaffName();
    const involvement=$('#reportInvolvement').value;
    const staffSelected=$('#reportStaff').value!=='all'&&$('#reportStaff').value!=='__unassigned__';
    let involvementLabel='';
    if(staffSelected){
      involvementLabel=involvement==='completed'?' · Completed by':
        involvement==='either'?' · Assigned or completed':' · Assigned to';
    }

    const rangeText=p.start===p.end
      ? niceDate(p.start)
      : `${niceDate(p.start)} – ${niceDate(p.end)}`;

    $('#reportScopeText').textContent=`${p.label}: ${rangeText} · ${staffName}${involvementLabel}`;
  }

  async function load({silent=false}={}){
    if(loading) return;

    const p=period(currentPeriod,$('#reportStart').value,$('#reportEnd').value);
    if(p.start>p.end){
      showToast('Report start date must be before the end date.','error');
      return;
    }

    lastPeriod=p;
    updateScope(p);
    loading=true;

    const btn=$('#runReportBtn');
    if(btn&&!silent) setButtonLoading(btn,true,'Applying…');

    try{
      lastRawRows=(await getTasksInRange(p.start,p.end)).filter(r=>r.status!=='cancelled');
      lastRows=applyStaffFilter(lastRawRows);
      render(lastRows,p,lastRawRows);
    }catch(error){
      console.error(error);
      showToast('Could not generate the report.','error');
    }finally{
      loading=false;
      if(btn&&!silent) setButtonLoading(btn,false);
    }
  }

  function render(rows,p,rawRows){
    const done=rows.filter(completed);
    const miss=rows.filter(missed);
    const lateRows=rows.filter(late);
    const reassign=rows.filter(reassigned);
    const other=rows.filter(completedByOther);
    const unassigned=rows.filter(r=>!r.assignedTo);
    const effortUnset=rows.filter(effortMissing);
    const effort=rows.reduce((s,r)=>s+(Number(r.effortMinutes)||0),0);
    const photoRequired=rows.filter(r=>r.photoRequired);
    const photoCompleted=photoRequired.filter(completed);
    const dates=[...new Set(rows.map(r=>r.date))];
    const rawDates=[...new Set(rawRows.map(r=>r.date))];

    $('#reportSummary').innerHTML=`
      <article class="stat-card primary">
        <span>Scheduled</span><strong>${rows.length}</strong>
        <small>${dates.length} saved day${dates.length===1?'':'s'} in filtered view</small>
      </article>
      <article class="stat-card good">
        <span>Completed</span><strong>${done.length}</strong>
        <small>${pct(done.length,rows.length)}% completion</small>
      </article>
      <article class="stat-card alert">
        <span>Missed / Late</span><strong>${miss.length} / ${lateRows.length}</strong>
        <small>${reassign.length} reassigned · ${other.length} done by another</small>
      </article>
      <article class="stat-card">
        <span>Known workload</span><strong>${fmtMin(effort)}</strong>
        <small>${effortUnset.length} task${effortUnset.length===1?'':'s'} without effort</small>
      </article>`;

    $('#reportCoverage').textContent=
      `Saved schedule coverage: ${rawDates.length} day${rawDates.length===1?'':'s'} in this period. Missing historical days are not fabricated.`;

    $('#reportOutcomeBreakdown').innerHTML=`
      ${kpi('Completion rate',`${pct(done.length,rows.length)}%`,`${done.length} of ${rows.length} scheduled tasks completed`,'good')}
      ${kpi('Completed on recorded schedule',String(done.length),'Completed task records','neutral')}
      ${kpi('Missed',String(miss.length),'Past tasks not completed','alert')}
      ${kpi('Late',String(lateRows.length),'Completed late or currently overdue','warning')}
      ${kpi('Photo-required completed',`${photoCompleted.length}/${photoRequired.length}`,photoRequired.length?'Completion of photo-required tasks':'No photo-required tasks in scope','neutral')}
    `;

    $('#reportExceptionSnapshot').innerHTML=`
      ${kpi('Reassigned',String(reassign.length),'Assignment changed from original','neutral')}
      ${kpi('Completed by another person',String(other.length),'Completed by someone other than current assignee','warning')}
      ${kpi('Unassigned',String(unassigned.length),'Needs management allocation','alert')}
      ${kpi('Effort not set',String(effortUnset.length),'Not included in workload-minute totals','warning')}
    `;

    const staffRows=staffTableSource(rows);
    $('#staffReportRows').innerHTML=staffRows||empty(9);
    $('#staffReportNote').textContent=$('#reportStaff').value==='all'
      ? 'All people appearing in the filtered task records.'
      : `Filtered for ${selectedStaffName()} using “${$('#reportInvolvement').selectedOptions[0]?.textContent||'Assigned to them'}”.`;

    $('#taskReportRows').innerHTML=group(rows,r=>r.taskName||'Untitled')
      .sort((a,b)=>b[1].length-a[1].length||String(a[0]).localeCompare(String(b[0])))
      .map(([name,a])=>{
        const knownEffort=a.reduce((s,r)=>s+(Number(r.effortMinutes)||0),0);
        return `<tr>
          <td><strong>${escapeHtml(name)}</strong></td>
          <td>${a.length}</td>
          <td>${a.filter(completed).length}</td>
          <td>${a.filter(late).length}</td>
          <td>${a.filter(missed).length}</td>
          <td>${pct(a.filter(completed).length,a.length)}%</td>
          <td>${fmtMin(knownEffort)}</td>
        </tr>`;
      }).join('')||empty(7);

    $('#slotReportRows').innerHTML=SLOT_DEFS.map(slot=>{
      const a=rows.filter(r=>r.slotId===slot.id);
      if(!a.length) return '';
      return `<tr>
        <td><strong>${escapeHtml(slot.label)}</strong></td>
        <td>${a.length}</td>
        <td>${a.filter(completed).length}</td>
        <td>${a.filter(late).length}</td>
        <td>${a.filter(missed).length}</td>
        <td>${pct(a.filter(completed).length,a.length)}%</td>
        <td>${fmtMin(a.reduce((s,r)=>s+(Number(r.effortMinutes)||0),0))}</td>
        <td>${a.filter(effortMissing).length}</td>
      </tr>`;
    }).join('')||empty(8);

    const exceptions=buildExceptions(rows);
    $('#exceptionCountBadge').textContent=`${exceptions.length} exception${exceptions.length===1?'':'s'}`;
    $('#exceptionRows').innerHTML=exceptions.slice(0,500).map(({type,r})=>`<tr>
      <td>${escapeHtml(r.date||'—')}</td>
      <td><span class="report-exception-type">${escapeHtml(type)}</span></td>
      <td>${escapeHtml(r.taskName||'Untitled')}</td>
      <td>${escapeHtml(r.assignedName||'Unassigned')}</td>
      <td>${escapeHtml(r.completedByName||'—')}</td>
      <td>${escapeHtml(slotName(r))}</td>
      <td>${fmtMin(r.effortMinutes)}</td>
    </tr>`).join('')||empty(7,'No exceptions for this selection.');
  }

  function staffTableSource(rows){
    const staffId=$('#reportStaff').value;
    const involvement=$('#reportInvolvement').value;

    // When a staff filter is active, preserve one clear row for that person,
    // even if "completed by" filtering means the current assignment belongs to somebody else.
    if(staffId!=='all'&&staffId!=='__unassigned__'){
      const person=people.find(p=>p.id===staffId);
      const assignedRows=lastRawRows.filter(r=>r.assignedTo===staffId);
      const completedRows=lastRawRows.filter(r=>r.completedByUserId===staffId);
      const scopeRows=rows;

      return `<tr>
        <td><strong>${escapeHtml(person?.name||selectedStaffName())}</strong></td>
        <td>${assignedRows.length}</td>
        <td>${completedRows.filter(completed).length}</td>
        <td>${scopeRows.filter(late).length}</td>
        <td>${assignedRows.filter(missed).length}</td>
        <td>${assignedRows.filter(reassigned).length}</td>
        <td>${assignedRows.filter(completedByOther).length}</td>
        <td>${pct(assignedRows.filter(completed).length,assignedRows.length)}%</td>
        <td>${fmtMin(scopeRows.reduce((s,r)=>s+(Number(r.effortMinutes)||0),0))}</td>
      </tr>`;
    }

    return group(rows,r=>r.assignedTo||`unassigned:${r.assignedName||'Unassigned'}`)
      .sort((a,b)=>String(a[1][0]?.assignedName||'').localeCompare(String(b[1][0]?.assignedName||'')))
      .map(([key,a])=>`<tr>
        <td><strong>${escapeHtml(a[0].assignedName||'Unassigned')}</strong></td>
        <td>${a.length}</td>
        <td>${a.filter(completed).length}</td>
        <td>${a.filter(late).length}</td>
        <td>${a.filter(missed).length}</td>
        <td>${a.filter(reassigned).length}</td>
        <td>${a.filter(completedByOther).length}</td>
        <td>${pct(a.filter(completed).length,a.length)}%</td>
        <td>${fmtMin(a.reduce((s,r)=>s+(Number(r.effortMinutes)||0),0))}</td>
      </tr>`).join('');
  }

  function slotName(r){
    const slot=SLOT_DEFS.find(s=>s.id===r.slotId);
    return slot?.label||r.slotId||'—';
  }

  function buildExceptions(rows){
    const result=[];
    rows.filter(missed).forEach(r=>result.push({type:'Missed',r}));
    rows.filter(late).forEach(r=>result.push({type:'Late',r}));
    rows.filter(reassigned).forEach(r=>result.push({type:'Reassigned',r}));
    rows.filter(completedByOther).forEach(r=>result.push({type:'Completed by another person',r}));
    rows.filter(r=>!r.assignedTo).forEach(r=>result.push({type:'Unassigned',r}));
    rows.filter(effortMissing).forEach(r=>result.push({type:'Effort not set',r}));

    return result.sort((a,b)=>
      String(b.r.date||'').localeCompare(String(a.r.date||''))||
      String(a.type).localeCompare(String(b.type))
    );
  }

  function kpi(label,value,detail,tone='neutral'){
    return `<div class="report-kpi-item ${tone}">
      <div><span>${escapeHtml(label)}</span><small>${escapeHtml(detail)}</small></div>
      <strong>${escapeHtml(value)}</strong>
    </div>`;
  }

  function switchTab(tab){
    currentTab=tab;
    root.querySelectorAll('[data-report-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.reportTab===tab));
    root.querySelectorAll('[data-report-panel]').forEach(panel=>{
      const active=panel.dataset.reportPanel===tab;
      panel.hidden=!active;
      panel.classList.toggle('active',active);
    });
  }

  function selectPeriod(value){
    currentPeriod=value;
    root.querySelectorAll('[data-report-period]').forEach(btn=>btn.classList.toggle('active',btn.dataset.reportPeriod===value));
    const custom=value==='custom';
    $('#customReportDates').hidden=!custom;
    if(!custom) load({silent:true});
    else updateScope(period(value,$('#reportStart').value,$('#reportEnd').value));
  }

  root.querySelectorAll('[data-report-tab]').forEach(btn=>{
    btn.addEventListener('click',()=>switchTab(btn.dataset.reportTab));
  });

  root.querySelectorAll('[data-report-period]').forEach(btn=>{
    btn.addEventListener('click',()=>selectPeriod(btn.dataset.reportPeriod));
  });

  $('#reportStaff').addEventListener('change',()=>{
    const selected=$('#reportStaff').value;
    $('#reportInvolvementField').hidden=selected==='all'||selected==='__unassigned__';
    load({silent:true});
  });

  $('#reportInvolvement').addEventListener('change',()=>load({silent:true}));
  $('#runReportBtn').addEventListener('click',()=>load());
  $('#reportStart').addEventListener('change',()=>updateScope(period('custom',$('#reportStart').value,$('#reportEnd').value)));
  $('#reportEnd').addEventListener('change',()=>updateScope(period('custom',$('#reportStart').value,$('#reportEnd').value)));

  $('#resetReportFilters').addEventListener('click',()=>{
    $('#reportStaff').value='all';
    $('#reportInvolvement').value='assigned';
    $('#reportInvolvementField').hidden=true;
    $('#reportStart').value=todayISO();
    $('#reportEnd').value=todayISO();
    selectPeriod('today');
  });

  $('#exportReportBtn').addEventListener('click',()=>{
    if(!lastRows.length){
      showToast('There are no filtered report records to export.','warning');
      return;
    }

    const headers=[
      'Date','Task','Slot','Assigned to','Original assignee','Completed by',
      'Status','Late','Effort minutes','Photo required','Reassigned','Completed by another person'
    ];
    const lines=[
      headers,
      ...lastRows.map(r=>[
        r.date,r.taskName,slotName(r),r.assignedName,r.originalAssignedName||'',
        r.completedByName||'',r.status,late(r)?'Yes':'No',r.effortMinutes??'',
        r.photoRequired?'Yes':'No',reassigned(r)?'Yes':'No',completedByOther(r)?'Yes':'No'
      ])
    ];

    const csv=lines.map(row=>row.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=`north-terrace-report-${lastPeriod.start}-to-${lastPeriod.end}-${safeFilePart(selectedStaffName())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });

  (async()=>{
    $('#reportStart').value=todayISO();
    $('#reportEnd').value=todayISO();
    await loadPeople();
    switchTab('overview');
    selectPeriod('today');
  })();
}
