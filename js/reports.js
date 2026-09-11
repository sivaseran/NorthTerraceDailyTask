import {getTasksInRange,todayISO,weekStartISO,weekEndISO,addDaysISO,slotLabelForDate,SLOT_DEFS,isTaskLate,slotCapacityMinutes} from './store.js';
import {escapeHtml,showToast,setButtonLoading} from './ui.js';

const fmtMin=m=>{
  const n=Number(m)||0,h=Math.floor(n/60),mm=n%60;
  if(!n) return '—';
  return h?`${h}h ${mm?`${mm}m`:''}`:`${mm}m`;
};
const group=(rows,keyFn)=>{
  const m=new Map(); rows.forEach(r=>{const k=keyFn(r);if(!m.has(k))m.set(k,[]);m.get(k).push(r)});return [...m.entries()];
};
const completed=r=>r.status==='completed';
const missed=r=>r.status==='missed';
const late=r=>Boolean(r.late||isTaskLate(r));
const reassigned=r=>Boolean(r.originalAssignedTo&&r.assignedTo&&r.originalAssignedTo!==r.assignedTo);
const completedByOther=r=>Boolean(r.completedByUserId&&r.assignedTo&&r.completedByUserId!==r.assignedTo);

function period(type,startInput,endInput){
  const today=todayISO();
  if(type==='today') return {start:today,end:today};
  if(type==='week') return {start:weekStartISO(today),end:weekEndISO(today)};
  if(type==='month'){
    const d=new Date(today+'T12:00:00');
    const start=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`;
    const last=new Date(d.getFullYear(),d.getMonth()+1,0);
    const end=`${last.getFullYear()}-${String(last.getMonth()+1).padStart(2,'0')}-${String(last.getDate()).padStart(2,'0')}`;
    return {start,end};
  }
  return {start:startInput||today,end:endInput||startInput||today};
}
function pct(n,d){return d?Math.round(n/d*100):0;}

export function initReports({root,userProvider}){
  const $=s=>root.querySelector(s);
  let lastRows=[],lastPeriod={start:todayISO(),end:todayISO()};

  async function load(){
    const type=$('#reportPeriod').value;
    const p=period(type,$('#reportStart').value,$('#reportEnd').value);
    if(p.start>p.end){showToast('Report start date must be before the end date.','error');return;}
    lastPeriod=p;
    const btn=$('#runReportBtn'); setButtonLoading(btn,true,'Generating…');
    try{
      const rows=(await getTasksInRange(p.start,p.end)).filter(r=>r.status!=='cancelled');
      lastRows=rows; render(rows,p);
    }catch(e){showToast('Could not generate the report.','error');}
    finally{setButtonLoading(btn,false);}
  }

  function render(rows,p){
    const done=rows.filter(completed), miss=rows.filter(missed), lateRows=rows.filter(late);
    const reassign=rows.filter(reassigned), other=rows.filter(completedByOther);
    const effort=rows.reduce((s,r)=>s+(Number(r.effortMinutes)||0),0);
    const missingEffort=rows.filter(r=>!Number(r.effortMinutes)).length;
    const dates=[...new Set(rows.map(r=>r.date))];

    $('#reportSummary').innerHTML=`
      <article class="stat-card primary"><span>Scheduled</span><strong>${rows.length}</strong><small>${p.start} to ${p.end}</small></article>
      <article class="stat-card good"><span>Completed</span><strong>${done.length}</strong><small>${pct(done.length,rows.length)}% completion</small></article>
      <article class="stat-card alert"><span>Missed / Late</span><strong>${miss.length} / ${lateRows.length}</strong><small>management exceptions</small></article>
      <article class="stat-card"><span>Known task effort</span><strong>${fmtMin(effort)}</strong><small>${missingEffort} task record(s) without effort</small></article>`;

    $('#reportCoverage').textContent=`Data coverage: ${dates.length} day(s) with saved schedule records in this period. Reports never fabricate missing historical days.`;

    $('#staffReportRows').innerHTML=group(rows,r=>r.assignedTo||`unassigned:${r.assignedName||'Unassigned'}`)
      .map(([k,a])=>`<tr><td>${escapeHtml(a[0].assignedName||'Unassigned')}</td><td>${a.length}</td><td>${a.filter(completed).length}</td><td>${a.filter(late).length}</td><td>${a.filter(missed).length}</td><td>${a.filter(reassigned).length}</td><td>${pct(a.filter(completed).length,a.length)}%</td><td>${fmtMin(a.reduce((s,r)=>s+(Number(r.effortMinutes)||0),0))}</td></tr>`).join('')||empty(8);

    $('#taskReportRows').innerHTML=group(rows,r=>r.taskName||'Untitled')
      .sort((a,b)=>b[1].length-a[1].length)
      .map(([name,a])=>`<tr><td>${escapeHtml(name)}</td><td>${a.length}</td><td>${a.filter(completed).length}</td><td>${a.filter(late).length}</td><td>${a.filter(missed).length}</td><td>${pct(a.filter(completed).length,a.length)}%</td></tr>`).join('')||empty(6);

    $('#slotReportRows').innerHTML=SLOT_DEFS.map(slot=>{
      const a=rows.filter(r=>r.slotId===slot.id); if(!a.length) return '';
      return `<tr><td>${escapeHtml(slot.label)}</td><td>${a.length}</td><td>${a.filter(completed).length}</td><td>${a.filter(late).length}</td><td>${a.filter(missed).length}</td><td>${fmtMin(a.reduce((s,r)=>s+(Number(r.effortMinutes)||0),0))}</td></tr>`;
    }).join('')||empty(6);

    const exceptions=[
      ...miss.map(r=>['Missed',r]),
      ...lateRows.map(r=>['Late',r]),
      ...reassign.map(r=>['Reassigned',r]),
      ...other.map(r=>['Completed by another person',r]),
      ...rows.filter(r=>!r.assignedTo).map(r=>['Unassigned',r]),
      ...rows.filter(r=>!Number(r.effortMinutes)).map(r=>['Effort not set',r])
    ];
    $('#exceptionRows').innerHTML=exceptions.slice(0,250).map(([type,r])=>`<tr><td>${escapeHtml(r.date)}</td><td>${escapeHtml(type)}</td><td>${escapeHtml(r.taskName)}</td><td>${escapeHtml(r.assignedName||'Unassigned')}</td><td>${escapeHtml(r.completedByName||'—')}</td><td>${escapeHtml(r.slotId||'—')}</td></tr>`).join('')||empty(6);
  }
  function empty(cols){return `<tr><td colspan="${cols}" class="muted">No report records for this period.</td></tr>`;}

  $('#reportPeriod').addEventListener('change',e=>{
    const custom=e.target.value==='custom';$('#customReportDates').hidden=!custom;
  });
  $('#runReportBtn').addEventListener('click',load);
  $('#exportReportBtn').addEventListener('click',()=>{
    if(!lastRows.length){showToast('Generate a report before exporting.','warning');return;}
    const headers=['Date','Task','Slot','Assigned to','Completed by','Status','Late','Effort minutes','Original assignee'];
    const lines=[headers,...lastRows.map(r=>[r.date,r.taskName,r.slotId,r.assignedName,r.completedByName,r.status,r.late?'Yes':'No',r.effortMinutes??'',r.originalAssignedName||''])];
    const csv=lines.map(row=>row.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`north-terrace-report-${lastPeriod.start}-to-${lastPeriod.end}.csv`;a.click();URL.revokeObjectURL(url);
  });

  $('#reportStart').value=todayISO();$('#reportEnd').value=todayISO();load();
}
