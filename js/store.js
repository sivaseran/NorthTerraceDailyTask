import {SUNDAY_ROTATION_ANCHOR,SUNDAY_ROTATION} from './final-config.js';
import {
  db,collection,doc,getDoc,getDocs,setDoc,updateDoc,deleteDoc,query,where,
  onSnapshot,serverTimestamp,writeBatch,runTransaction,documentId
} from './firebase.js';

export const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const WEEK_DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export const SLOT_DEFS=[
  {id:'S1',label:'05:30–09:00',start:'05:30',end:'09:00'},
  {id:'S2',label:'09:00–14:00',start:'09:00',end:'14:00'},
  {id:'S3',label:'14:00–18:00',start:'14:00',end:'18:00'},
  {id:'S4',label:'18:00–20:00',start:'18:00',end:'20:00'},
  {id:'S5',label:'20:00–Close',start:'20:00',end:'22:00'}
];

export function dateFromISO(value){
  const [y,m,d]=String(value).split('-').map(Number);
  return new Date(y,m-1,d,12,0,0,0);
}
export function isoDate(d=new Date()){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function addDaysISO(value,days){
  const d=dateFromISO(value); d.setDate(d.getDate()+Number(days)); return isoDate(d);
}
export function dayKey(value){ return DAYS[dateFromISO(value).getDay()]; }
export function formatLongDate(value){
  return dateFromISO(value).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
}
export function todayISO(){ return isoDate(new Date()); }
// Date Only scheduling is allowed from today through today + 90 calendar days.
// This does not limit permanent recurring rules, completed history, or existing
// exceptions already recorded outside the window.
export const DATE_ONLY_MAX_AHEAD_DAYS=90;
export function dateOnlyMaxISO(){ return addDaysISO(todayISO(),DATE_ONLY_MAX_AHEAD_DAYS); }
export function isDateOnlyAllowed(date){
  return /^\d{4}-\d{2}-\d{2}$/.test(String(date||'')) &&
    isoDate(dateFromISO(date))===date && date>=todayISO() && date<=dateOnlyMaxISO();
}
export function assertDateOnlyAllowed(date){
  if(!isDateOnlyAllowed(date))throw new Error(`One-time tasks and date-only edits must be between today and ${dateOnlyMaxISO()} (90 days ahead). Recurring schedules are not limited.`);
}
// Review the first 90 days of an edited recurrence, including its start date.
export function recurringReviewEndISO(effectiveFrom){return addDaysISO(effectiveFrom,DATE_ONLY_MAX_AHEAD_DAYS);}

export function compareISO(a,b){ return String(a).localeCompare(String(b)); }


export function sundayEveningRotatorForDate(date){
  if(!date||String(date)<SUNDAY_ROTATION_ANCHOR) return '';
  const d=dateFromISO(date);
  if(d.getDay()!==0) return '';
  const anchor=dateFromISO(SUNDAY_ROTATION_ANCHOR);
  const weeks=Math.floor((d-anchor)/(7*24*60*60*1000));
  if(weeks<0) return '';
  return SUNDAY_ROTATION[((weeks%SUNDAY_ROTATION.length)+SUNDAY_ROTATION.length)%SUNDAY_ROTATION.length]||'';
}

export function isSundayEveningRotationTime(date,clock){
  const userId=sundayEveningRotatorForDate(date);
  const minutes=hmToMinutes(clock);
  return Boolean(userId && minutes!==null && minutes>=13*60+30);
}

export function weekStartISO(value){
  const d=dateFromISO(value), js=d.getDay(), delta=js===0?-6:1-js;
  d.setDate(d.getDate()+delta); return isoDate(d);
}
export function weekEndISO(value){ return addDaysISO(weekStartISO(value),6); }

function hmToMinutes(v=''){
  const m=String(v).match(/(\d{1,2}):(\d{2})/);
  return m?Number(m[1])*60+Number(m[2]):null;
}
function minutesToHM(n){
  const h=Math.floor(n/60)%24,m=n%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
export function slotEndForDate(slotId,date){
  if(slotId!=='S5') return SLOT_DEFS.find(s=>s.id===slotId)?.end||'22:00';
  const day=dayKey(date);
  return day==='Fri'||day==='Sat'?'23:00':'22:00';
}
export function slotLabelForDate(slotId,date){
  const slot=SLOT_DEFS.find(s=>s.id===slotId);
  if(!slot) return 'Unslotted';
  return `${slot.start}–${slotEndForDate(slotId,date)}`;
}
export function slotCapacityMinutes(slotId,date){
  const slot=SLOT_DEFS.find(s=>s.id===slotId);
  if(!slot) return 0;
  return hmToMinutes(slotEndForDate(slotId,date))-hmToMinutes(slot.start);
}
export function slotForClock(clock,date){
  const x=hmToMinutes(clock);
  if(x===null) return '';
  for(const s of SLOT_DEFS){
    const a=hmToMinutes(s.start), b=hmToMinutes(slotEndForDate(s.id,date));
    if(x>=a&&x<b) return s.id;
  }
  return x>=20*60?'S5':'';
}

export async function getUsers(){
  const s=await getDocs(collection(db,'users'));
  return s.docs.map(d=>({id:d.id,...d.data()}));
}

export async function getSystemState(){
  const s=await getDoc(doc(db,'system','app'));
  return s.exists()?s.data():null;
}
export async function getAssignableUsers(){
  const users=await getUsers();
  return users.filter(u=>{
    return u.active!==false&&(u.role==='staff'||u.role==='assignee');
  }).sort((a,b)=>{
    const ai=Number(a.staffId)||999,bi=Number(b.staffId)||999;
    return ai-bi||String(a.name||'').localeCompare(String(b.name||''));
  });
}
export async function validateUserUniqueness(documentId,{pin,staffId,role}){
  const users=await getUsers();
  const others=users.filter(u=>u.id!==documentId);
  if(pin&&others.some(u=>String(u.pin||'')===String(pin))) return {ok:false,field:'pin',message:'This PIN is already used by another person.'};
  if(role==='staff'&&staffId&&others.some(u=>u.role==='staff'&&String(u.staffId||'')===String(staffId))) return {ok:false,field:'staffId',message:'This Staff ID is already used.'};
  return {ok:true};
}
export async function saveUser(id,data){ await setDoc(doc(db,'users',id),data,{merge:true}); }

export async function createPerson(data){
  const slug=String(data.name||'person').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,28)||'person';
  const id=`person_${slug}_${Date.now().toString().slice(-6)}`;
  await setDoc(doc(db,'users',id),{...data,createdAt:serverTimestamp()});
  return id;
}


export async function getStaffAvailability(){
  const snap=await getDoc(doc(db,'system','staffAvailability'));
  return snap.exists()?snap.data():null;
}

export async function saveStaffAvailability(week,actor){
  await setDoc(doc(db,'system','staffAvailability'),{
    week,
    updatedAt:serverTimestamp(),
    updatedByUserId:actor?.id||'',
    updatedByName:actor?.name||''
  },{merge:true});
}

export async function getWeeklyTemplate(){
  const s=await getDocs(collection(db,'weeklyTemplates'));
  return s.docs.map(d=>({id:d.id,...d.data()}))
    .sort((a,b)=>(Number(a.sortOrder)||9999)-(Number(b.sortOrder)||9999)||String(a.taskName||'').localeCompare(String(b.taskName||'')));
}

// Read-only batched lookup for initial weekday assignments saved by the
// Compliance and Initial Cooking modules. It does not create assignments,
// regenerate daily records, or inspect the staff rota. The document-ID query
// uses Firestore's built-in index, so no composite index is required.
export async function getSavedWeekdayAssignmentSnapshots(docIds){
  const ids=[...new Set((docIds||[]).filter(id=>typeof id==='string'&&/^[a-zA-Z0-9_-]+$/.test(id)))];
  const out=new Map();
  // Keep the query comfortably below Firestore's `in` operand limit.
  const batches=[];
  for(let i=0;i<ids.length;i+=10){
    const batch=ids.slice(i,i+10);
    batches.push(getDocs(query(collection(db,'system'),where(documentId(),'in',batch))));
  }
  for(const snap of await Promise.all(batches)){
    for(const row of snap.docs)out.set(row.id,row.data());
  }
  return out;
}

export async function getShiftCoverRules(){
  const s=await getDocs(collection(db,'shiftCoverRules'));
  return s.docs.map(d=>({id:d.id,...d.data()}))
    .filter(r=>r.active!==false);
}

function applyShiftCoverRulesToRow(row,date,rules,users){
  const weekday=dayKey(date);
  const applicable=rules
    .filter(r=>
      r.active!==false &&
      String(r.weekday||'')===weekday &&
      String(r.slotId||'')===String(row.slotId||'') &&
      String(r.effectiveFrom||'0000-01-01')<=date
    )
    .sort((a,b)=>
      String(a.effectiveFrom||'').localeCompare(String(b.effectiveFrom||'')) ||
      String(a.createdKey||a.id||'').localeCompare(String(b.createdKey||b.id||''))
    );

  let assignedTo=row.assignedTo||'';
  let assignedName=row.assignedName||'Unassigned';
  let appliedRuleId='';

  for(const rule of applicable){
    if(String(rule.fromUserId||'')===String(assignedTo||'')){
      assignedTo=rule.toUserId||'';
      const target=users.find(u=>u.id===assignedTo);
      assignedName=target?.name||rule.toName||'Unassigned';
      appliedRuleId=rule.id||'';
    }
  }

  return {
    ...row,
    assignedTo,
    assignedName,
    shiftCoverRuleId:appliedRuleId
  };
}

// One-day cover is an explicit exception to the underlying recurring assignee.
// Apply all affected pending tasks atomically and preserve their original IDs.
export async function saveDateShiftCover({date,slotId,fromUserId,toUserId,taskIds},actor){
  if(!date||date<todayISO()||!slotId||!fromUserId||!toUserId||fromUserId===toUserId)
    throw new Error('Choose a current/future date, slot and two different people.');
  const ids=[...new Set(taskIds||[])];
  if(!ids.length||ids.length>180)throw new Error('Select between 1 and 180 pending tasks for one atomic cover.');
  const users=await getUsers(),target=users.find(u=>u.id===toUserId),source=users.find(u=>u.id===fromUserId);
  if(!target||target.active===false)throw new Error('The covering staff member is no longer active.');
  const refs=ids.map(id=>doc(db,'dailyTasks',id));
  const audit=doc(db,'taskManagerAudit',`shift_cover_date_${Date.now()}_${Math.random().toString(36).slice(2,8)}`);
  await runTransaction(db,async tx=>{
    const rows=await Promise.all(refs.map(ref=>tx.get(ref)));
    for(const snap of rows){
      if(!snap.exists())throw new Error('A selected task is missing. Refresh the cover preview.');
      const t=snap.data();
      if(t.date!==date||t.slotId!==slotId||t.assignedTo!==fromUserId||['completed','cancelled'].includes(t.status))
        throw new Error('A task changed since the cover preview. Nothing was saved.');
    }
    rows.forEach((snap,i)=>{
      const t=snap.data();
      tx.update(refs[i],{
        assignedTo:toUserId,assignedName:target.name||'Unassigned',
        dayOnlyOverride:true,
        dayOnlyFields:[...new Set([...(t.dayOnlyFields||[]),'assignedTo','assignedName'])],
        shiftCoverScope:'date',shiftCoveredFromUserId:fromUserId,
        shiftCoveredFromName:source?.name||'',shiftCoverDate:date,
        updatedAt:serverTimestamp(),updatedByUserId:actor?.id||'',updatedByName:actor?.name||''
      });
    });
    tx.set(audit,{type:'date_shift_cover',date,slotId,fromUserId,toUserId,taskIds:ids,
      actorId:actor?.id||'',at:serverTimestamp()});
  });
  return {updated:ids.length};
}

export async function saveFutureShiftCover({date,slotId,fromUserId,toUserId},actor){
  if(!date||!slotId||!fromUserId||!toUserId) throw new Error('Cover details are incomplete.');
  if(fromUserId===toUserId) throw new Error('Choose two different people.');

  const users=await getUsers();
  const from=users.find(u=>u.id===fromUserId);
  const to=users.find(u=>u.id===toUserId);
  if(!to) throw new Error('Covering person could not be found.');

  const weekday=dayKey(date);
  const ruleId=`cover_${date}_${weekday}_${slotId}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

  await setDoc(doc(db,'shiftCoverRules',ruleId),{
    effectiveFrom:date,
    weekday,
    slotId,
    fromUserId,
    fromName:from?.name||'',
    toUserId,
    toName:to.name||'',
    active:true,
    createdKey:`${date}_${Date.now()}`,
    createdAt:serverTimestamp(),
    createdByUserId:actor?.id||'',
    createdByName:actor?.name||''
  });

  // Update already-generated matching snapshots. Future dates not yet
  // generated will pick up this rule automatically in getPlannedTasksForDate().
  const futureQ=query(collection(db,'dailyTasks'),where('date','>=',date));
  const future=await getDocs(futureQ);
  const matching=future.docs.filter(d=>{
    const x=d.data();
    return dayKey(x.date)===weekday &&
      x.slotId===slotId &&
      x.assignedTo===fromUserId &&
      x.status!=='cancelled' &&
      x.status!=='completed';
  });

  let updated=0;
  for(let i=0;i<matching.length;i+=400){
    const batch=writeBatch(db);
    matching.slice(i,i+400).forEach(d=>{
      batch.update(d.ref,{
        assignedTo:toUserId,
        assignedName:to.name||'Unassigned',
        shiftCoverRuleId:ruleId,
        shiftCoverScope:'future',
        shiftCoveredFromUserId:fromUserId,
        shiftCoveredFromName:from?.name||'',
        shiftCoverEffectiveFrom:date,
        updatedAt:serverTimestamp(),
        updatedByUserId:actor?.id||'',
        updatedByName:actor?.name||''
      });
    });
    await batch.commit();
    updated+=matching.slice(i,i+400).length;
  }

  return {ruleId,updated,weekday,toName:to.name||'Unassigned'};
}

function normaliseVersions(daySchedule){
  if(!daySchedule) return [];
  if(Array.isArray(daySchedule.versions)) return daySchedule.versions;
  // V1 compatibility
  if(Object.prototype.hasOwnProperty.call(daySchedule,'active')){
    return [{
      effectiveFrom:'2026-01-01',
      active:daySchedule.active!==false,
      slotId:'',
      assigneeId:'',
      assigneeKey:'',
      legacyAssignee:String(daySchedule.assignee||''),
      effortMinutes:null,
      sourceTime:String(daySchedule.time||'')
    }];
  }
  return [];
}
export function ruleForDate(task,date){
  const dkey=dayKey(date);
  const versions=normaliseVersions(task.schedule?.[dkey])
    .filter(v=>String(v.effectiveFrom||'0000-01-01')<=date&&(!v.effectiveTo||String(v.effectiveTo)>=date))
    .sort((a,b)=>String(b.effectiveFrom||'').localeCompare(String(a.effectiveFrom||'')));
  return versions[0]||null;
}

async function resolveAssignee(rule,users){
  if(!rule) return {id:'',name:'Unassigned'};
  if(rule.assigneeId){
    const u=users.find(x=>x.id===rule.assigneeId);
    return {id:rule.assigneeId,name:u?.name||rule.assigneeName||'Unknown'};
  }
  const key=String(rule.assigneeKey||'');
  if(key.startsWith('staffId:')){
    const staffId=key.split(':')[1];
    const u=users.find(x=>x.role==='staff'&&String(x.staffId||'')===staffId);
    return u?{id:u.id,name:u.name||`Staff ${staffId}`}:{id:'',name:'Unassigned'};
  }
  if(key.startsWith('person:')){
    const name=key.split(':').slice(1).join(':');
    const wanted=name.toLowerCase()==='parth'?'parthy':name.toLowerCase();
    const u=users.find(x=>String(x.name||'').toLowerCase()===wanted);
    return u?{id:u.id,name:u.name}:{id:'',name:'Unassigned'};
  }
  return {id:'',name:'Unassigned'};
}

export async function getPlannedTasksForDate(date){
  const [templates,users,coverRules,lifecycle]=await Promise.all([getWeeklyTemplate(),getUsers(),getShiftCoverRules(),getTaskLifecycleRules()]);
  const rows=[];
  for(const t of templates){
    const rule=ruleForDate(t,date);
    if(!rule||rule.active===false||isLifecycleInactive(lifecycle.get(t.id)||[],date)) continue;
    let assigned=await resolveAssignee(rule,users);
    // Default Sunday rotation applies only until a manager explicitly takes ownership
    // of this task/weekday assignment. A deliberate recurring assignment must win.
    if(isSundayEveningRotationTime(date,rule.sourceTime||'')&&!rule.rotationAssignmentOverride){
      const rotationId=sundayEveningRotatorForDate(date);
      const rotationUser=users.find(u=>u.id===rotationId);
      assigned={id:rotationId,name:rotationUser?.name||'Sunday rotation'};
    }
    if(t.recurring&&t.frequencyMinutes){
      const source=String(rule.sourceTime||'');
      const mm=[...source.matchAll(/(\d{1,2}):(\d{2})/g)];
      if(mm.length>=2){
        let start=Number(mm[0][1])*60+Number(mm[0][2]);
        const end=Number(mm[1][1])*60+Number(mm[1][2]);
        for(;start<end;start+=Number(t.frequencyMinutes)){
          const clock=minutesToHM(start);
          rows.push({
            virtualId:`${date}_${t.id}_${clock.replace(':','')}`,
            templateTaskId:t.id, taskName:rule.taskName||t.taskName, date,
            slotId:slotForClock(clock,date), sourceTime:clock,
            effortMinutes:rule.effortMinutes??null,
            assignedTo:assigned.id, assignedName:assigned.name,
            legacyAssignee:rule.legacyAssignee||'',
            photoRequired:rule.photoRequired??Boolean(t.photoRequired),reportCategory:rule.reportCategory||t.reportCategory||'', temperatureRequired:Boolean(t.temperatureRequired), recurring:true, checkpoint:clock,
            status:'planned'
          });
        }
        continue;
      }
    }
    rows.push({
      virtualId:`${date}_${t.id}`,templateTaskId:t.id,taskName:rule.taskName||t.taskName,date,
      slotId:rule.slotId||'',
      sourceTime:rule.sourceTime||'',
      effortMinutes:rule.effortMinutes??null,
      assignedTo:assigned.id,assignedName:assigned.name,
      legacyAssignee:rule.legacyAssignee||'',
      photoRequired:rule.photoRequired??Boolean(t.photoRequired),reportCategory:rule.reportCategory||t.reportCategory||'',temperatureRequired:Boolean(t.temperatureRequired),recurring:Boolean(t.recurring),status:'planned'
    });
  }
  return rows.map(row=>applyShiftCoverRulesToRow(row,date,coverRules,users));
}

function completedDate(value){
  if(!value) return null;
  if(typeof value.toDate==='function') return value.toDate();
  const d=new Date(value); return Number.isNaN(d.getTime())?null:d;
}
function statusForTask(t){
  if(t.status==='cancelled') return 'cancelled';
  if(t.status==='completed') return 'completed';
  const today=todayISO();
  if(t.date<today) return 'missed';
  if(t.date>today) return 'upcoming';
  const now=new Date();
  const start=hmToMinutes(SLOT_DEFS.find(s=>s.id===t.slotId)?.start||'00:00');
  const end=hmToMinutes(slotEndForDate(t.slotId,t.date));
  const mins=now.getHours()*60+now.getMinutes();
  if(start===null||end===null) return 'upcoming';
  if(mins>=end) return 'overdue';
  if(mins>=start) return 'due';
  return 'upcoming';
}
export function isTaskLate(t){
  if(t.status!=='completed'||!t.completedAt||!t.slotId) return false;
  const c=completedDate(t.completedAt); if(!c) return false;
  const [h,m]=slotEndForDate(t.slotId,t.date).split(':').map(Number);
  const end=dateFromISO(t.date); end.setHours(h,m,0,0);
  return c>end;
}
function normaliseDaily(d){
  const t={id:d.id,...d.data()};
  return {...t,status:statusForTask(t),late:isTaskLate(t)};
}
function sortTasks(rows){
  const order=Object.fromEntries(SLOT_DEFS.map((s,i)=>[s.id,i]));
  const taskTime=row=>String(row.sourceTime||row.checkpoint||'99:99');
  return [...rows].sort((a,b)=>
    (order[a.slotId]??99)-(order[b.slotId]??99) ||
    taskTime(a).localeCompare(taskTime(b)) ||
    String(a.taskName||'').localeCompare(String(b.taskName||''))
  );
}

async function plannedToDaily(row,users){
  return {
    date:row.date,
    templateTaskId:row.templateTaskId||'',
    taskName:row.taskName,
    slotId:row.slotId,
    sourceTime:row.sourceTime||'',
    effortMinutes:row.effortMinutes??null,
    originalAssignedTo:row.assignedTo||'',
    originalAssignedName:row.assignedName||'Unassigned',
    assignedTo:row.assignedTo||'',
    assignedName:row.assignedName||'Unassigned',
    legacyAssignee:row.legacyAssignee||'',
    status:'pending',
    photoRequired:Boolean(row.photoRequired),
    reportCategory:row.reportCategory||'',
    temperatureRequired:Boolean(row.temperatureRequired),
    temperatureC:null,
    recurring:Boolean(row.recurring),
    checkpoint:row.checkpoint||'',
    completedAt:null,
    completedByUserId:'',
    completedByName:'',
    dayOnlyOverride:false,
    createdAt:serverTimestamp(),
    updatedAt:serverTimestamp()
  };
}

function plannedMatch(existing,planned){
  if(String(existing.templateTaskId||'')!==String(planned.templateTaskId||'')) return false;
  const pClock=String(planned.checkpoint||planned.sourceTime||'');
  const eClock=String(existing.checkpoint||existing.sourceTime||'');
  // Ordinary recurring tasks have a stable date+template ID. Changing their
  // scheduled time must UPDATE that task, not create a duplicate and cancel the
  // edited occurrence. Repeated-frequency/checkpoint tasks remain clock-specific.
  if((pClock||eClock)&&(planned.checkpoint||existing.checkpoint)&&pClock!==eClock) return false;
  return true;
}

export async function reconcileDailyTasksForDate(date){
  // Historical completion/audit records are immutable.
  if(date<todayISO()) return {created:0,updated:0,removed:0};

  const [planned,existingSnap]=await Promise.all([
    getPlannedTasksForDate(date),
    getDocs(query(collection(db,'dailyTasks'),where('date','==',date)))
  ]);

  const existing=existingSnap.docs.map(d=>({id:d.id,ref:d.ref,...d.data()}));
  const used=new Set();
  const operations=[];

  for(const p of planned){
    const matchIndex=existing.findIndex((e,i)=>!used.has(i)&&plannedMatch(e,p));

    if(matchIndex<0){
      operations.push({
        type:'set',
        ref:doc(db,'dailyTasks',p.virtualId),
        data:await plannedToDaily(p)
      });
      continue;
    }

    used.add(matchIndex);
    const e=existing[matchIndex];
    // Historical completions and explicit workflow cancellations are immutable;
    // do not rewrite their task details or silently return them to pending.
    if(e.status==='completed'||(e.status==='cancelled'&&e.cancelReason!=='Removed from current schedule'))continue;

    // Only preserve an assignment as a date-only override when the manager
    // explicitly saved it for this date. Older snapshots used assignment
    // differences as an implicit override, which could make stale assignees
    // win over the latest weekly template.
    const hasDayOverride=Boolean(e.dayOnlyOverride||e.shiftCoverScope==='date'&&e.shiftCoverDate===date);
    const overrideFields=[...new Set([...(Array.isArray(e.dayOnlyFields)?e.dayOnlyFields:[]),...(e.shiftCoverScope==='date'&&e.shiftCoverDate===date?['assignedTo','assignedName']:[]),...(hasDayOverride&&!Array.isArray(e.dayOnlyFields)?['assignedTo','assignedName']:[])])];
    const keep=(key,value)=>hasDayOverride&&overrideFields.includes(key)?e[key]:value;
    const assignedTo=keep('assignedTo',p.assignedTo||'');
    const assignedName=keep('assignedName',p.assignedName||'Unassigned');

    const patch={
      taskName:keep('taskName',p.taskName),
      slotId:keep('slotId',p.slotId),
      sourceTime:keep('sourceTime',p.sourceTime||''),
      effortMinutes:keep('effortMinutes',p.effortMinutes??null),
      photoRequired:keep('photoRequired',Boolean(p.photoRequired)),
      reportCategory:keep('reportCategory',p.reportCategory||''),
      temperatureRequired:Boolean(p.temperatureRequired),
      recurring:Boolean(p.recurring),
      checkpoint:p.checkpoint||'',
      originalAssignedTo:p.assignedTo||'',
      originalAssignedName:p.assignedName||'Unassigned',
      assignedTo,
      assignedName,
      dayOnlyOverride:hasDayOverride,
      updatedAt:serverTimestamp()
    };

    // A task that was previously removed but is active again must return.
    if(e.status==='cancelled'){
      patch.status='pending';
      patch.cancelledAt=null;
    }

    // Avoid a Firestore write when the saved snapshot already matches the plan.
    // This is important on the always-on Galaxy shop tablet and for free quotas.
    // It also avoids unnecessary touches to operational records.
    const differs=Object.entries(patch).some(([key,value])=>{
      if(key==='updatedAt')return false;
      const previous=e[key];
      return !(previous===value||(previous==null&&value==null));
    });
    if(differs)operations.push({type:'update',ref:e.ref,data:patch});
  }

  // Anything left is a saved template task that no longer belongs on this day.
  // Keep completed rows for audit, and leave ad-hoc tasks alone.
  existing.forEach((e,i)=>{
    if(used.has(i)) return;
    if(!e.templateTaskId||e.adHoc||e.status==='completed'||e.status==='cancelled') return;
    // Safety: never delete live operational rows during reconciliation.
    // Cancel obsolete pending rows so history cannot disappear and regenerate as fresh pending work.
    operations.push({type:'update',ref:e.ref,data:{status:'cancelled',cancelReason:'Removed from current schedule',cancelledAt:serverTimestamp(),updatedAt:serverTimestamp()}});
  });

  // A plain batch.set() can overwrite a task completed by a different browser
  // between snapshot-read and batch-commit. Create missing rows conditionally
  // in a Firestore transaction, and consult the durable completion ledger.
  let created=0,updated=0,removed=0;
  const inserts=operations.filter(op=>op.type==='set');
  for(let i=0;i<inserts.length;i+=120){
    const chunk=inserts.slice(i,i+120);
    created+=await runTransaction(db,async tx=>{
      const observed=await Promise.all(chunk.map(op=>tx.get(op.ref)));
      // All transaction reads must happen before any writes.
      const ledgers=await Promise.all(chunk.map((op,j)=>observed[j].exists()?Promise.resolve(null):tx.get(doc(db,'taskCompletionLedger',op.ref.id))));
      let wrote=0;
      chunk.forEach((op,j)=>{
        if(observed[j].exists())return; // another device already created/completed it
        const prior=ledgers[j]?.data();
        const data=prior?.status==='completed'?{
          ...op.data,status:'completed',completedAt:prior.completedAt||serverTimestamp(),
          completedByUserId:prior.completedByUserId||'',completedByName:prior.completedByName||'',
          restoredFromCompletionLedger:true
        }:op.data;
        tx.set(op.ref,data);wrote++;
      });
      return wrote;
    });
  }
  const updates=operations.filter(op=>op.type==='update');
  for(let i=0;i<updates.length;i+=350){
    const batch=writeBatch(db);
    for(const op of updates.slice(i,i+350)){batch.update(op.ref,op.data);updated++;}
    await batch.commit();
  }

  return {created,updated,removed};
}

export async function ensureTasksForDate(date){
  const result=await reconcileDailyTasksForDate(date);
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  const snap=await getDocs(q);
  return {created:result.created>0,count:snap.size,...result};
}



export async function clearAllOperationalData(){
  throw new Error('Live safety lock: bulk operational deletion is disabled.');
}
export async function clearDailyTasksFrom(){
  throw new Error('Live safety lock: deleting today/future task history is disabled.');
}
export async function resetTasksForDate(){
  throw new Error('Live safety lock: destructive task reset is disabled. Reconcile safely instead.');
}

export async function getTasksForDate(date,{ensure=true}={}){
  if(ensure) await ensureTasksForDate(date);
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  const s=await getDocs(q);
  return sortTasks(s.docs.map(normaliseDaily));
}

export async function getSetupTasksForDate(date){
  // LIVE EDITOR SOURCE OF TRUTH: Staff Assignment must show only records that
  // currently exist for the selected date. Do not reconcile, seed, or synthesise
  // missing template tasks while merely opening the editor.
  const existing=await getTasksForDate(date,{ensure:false});
  return sortTasks(existing.filter(row=>row.status!=='cancelled').map(row=>({
    ...row,
    _virtual:false
  })));
}

export function watchTasksForDate(date,cb,onError=()=>{}){
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  return onSnapshot(q,s=>cb(sortTasks(s.docs.map(normaliseDaily))),onError);
}

export async function completeTask(id,user,extra={},linkedRecord=null){
  const ref=doc(db,'dailyTasks',id),snap=await getDoc(ref);
  if(!snap.exists())throw new Error('Task does not exist. Refresh the task list.');
  if(snap.data().status==='cancelled')throw new Error('This task has been cancelled. Refresh the task list.');
  if(snap.data().status==='completed')throw new Error('This task is already completed. Refresh the task list.');
  const completedAt=serverTimestamp();
  const patch={status:'completed',completedAt,completedByUserId:user.id,completedByName:user.name||'Staff',updatedAt:serverTimestamp()};
  if(Object.prototype.hasOwnProperty.call(extra,'temperatureC')){
    if(extra.temperatureC===null||extra.temperatureC==='')throw new Error('Enter a valid temperature in °C.');
    const value=Number(extra.temperatureC);
    if(!Number.isFinite(value)||value<-50||value>200)throw new Error('Enter a valid temperature in °C.');
    patch.temperatureC=value;
  }
  // Only accepted operational result fields, not arbitrary task identity/assignment.
  for(const key of ['hotFoodResult','hotFoodSessionId','hotFoodCheckId','actualReadingTime','hotFoodExpiryResult']){
    if(Object.prototype.hasOwnProperty.call(extra,key))patch[key]=extra[key];
  }
  const batch=writeBatch(db);
  batch.update(ref,patch);
  // Compliance report record and completion are committed together.
  if(linkedRecord){
    if(linkedRecord.collection!=='complianceRecords'||linkedRecord.id!==id)throw new Error('Unsupported linked task record.');
    batch.set(doc(db,'complianceRecords',id),{...linkedRecord.data,completedAt,updatedAt:serverTimestamp()},{merge:true});
  }
  batch.set(doc(db,'taskCompletionLedger',id),{
    taskId:id,date:snap.data().date,status:'completed',completedAt,
    completedByUserId:user.id,completedByName:user.name||'Staff',updatedAt:serverTimestamp()
  });
  await batch.commit();
}
export async function uncompleteTask(id){
  const ref=doc(db,'dailyTasks',id),snap=await getDoc(ref);
  if(!snap.exists())throw new Error('Task does not exist.');
  const batch=writeBatch(db);
  batch.update(ref,{status:'pending',completedAt:null,completedByUserId:'',completedByName:'',updatedAt:serverTimestamp()});
  batch.set(doc(db,'taskCompletionLedger',id),{taskId:id,date:snap.data().date,status:'pending',updatedAt:serverTimestamp()});
  await batch.commit();
}
export async function updateDailyTask(id,changes,actor){
  // The older Day Editor uses this generic update method for one-day edits.
  if(changes?.dayOnlyOverride===true){
    const snap=await getDoc(doc(db,'dailyTasks',id));
    if(!snap.exists())throw new Error('Task not found. Refresh the schedule.');
    assertDateOnlyAllowed(snap.data().date);
    if(['completed','cancelled'].includes(snap.data().status))throw new Error('Completed or cancelled tasks cannot be edited.');
  }
  await updateDoc(doc(db,'dailyTasks',id),{
    ...changes,updatedAt:serverTimestamp(),
    updatedByUserId:actor?.id||'',updatedByName:actor?.name||''
  });
}

function previousISO(date){ return addDaysISO(date,-1); }


export async function bulkUpdateWeeklyTemplateRows(changes,actor){
  if(!Array.isArray(changes)||!changes.length) return {updated:0,snapshotsUpdated:0};

  const templateSnap=await getDocs(collection(db,'weeklyTemplates'));
  const docs=new Map(templateSnap.docs.map(d=>[d.id,{ref:d.ref,data:d.data()}]));
  let updated=0;

  const byTemplate=new Map();
  for(const c of changes){
    if(!c?.templateTaskId||!c?.dayKey) continue;
    if(!byTemplate.has(c.templateTaskId)) byTemplate.set(c.templateTaskId,[]);
    byTemplate.get(c.templateTaskId).push(c);
  }

  for(const [templateTaskId,items] of byTemplate){
    const existing=docs.get(templateTaskId);
    if(!existing) continue;
    const data=structuredClone(existing.data);
    data.schedule=data.schedule||{};
    let changed=false;

    for(const item of items){
      const day=data.schedule[item.dayKey];
      if(!day?.versions?.length) continue;
      const active=day.versions.map((v,i)=>({v,i}))
        .filter(({v})=>v.active!==false&&!v.effectiveTo)
        .sort((a,b)=>String(a.v.effectiveFrom||'').localeCompare(String(b.v.effectiveFrom||'')));
      const target=active.at(-1);
      if(!target) continue;

      day.versions[target.i]={
        ...day.versions[target.i],
        assigneeId:item.assigneeId||'',
        assigneeKey:'',
        legacyAssignee:'',
        effortMinutes:Number(item.effortMinutes)>0?Number(item.effortMinutes):null,
        updatedByUserId:actor?.id||'',
        updatedByName:actor?.name||''
      };
      changed=true; updated++;
    }

    if(changed){
      await updateDoc(existing.ref,{
        schedule:data.schedule,
        updatedAt:serverTimestamp(),
        updatedByUserId:actor?.id||'',
        updatedByName:actor?.name||''
      });
    }
  }

  const today=todayISO();
  const futureSnap=await getDocs(query(collection(db,'dailyTasks'),where('date','>=',today)));
  const users=await getUsers();
  const names=new Map(users.map(u=>[u.id,u.name||'Unassigned']));
  const byKey=new Map(changes.map(c=>[`${c.templateTaskId}|${c.dayKey}`,c]));

  const matching=futureSnap.docs.filter(d=>{
    const x=d.data();
    return byKey.has(`${x.templateTaskId}|${dayKey(x.date)}`) && !x.dayOnlyOverride && x.status!=='completed' && x.status!=='cancelled';
  });

  for(let i=0;i<matching.length;i+=400){
    const batch=writeBatch(db);
    matching.slice(i,i+400).forEach(d=>{
      const x=d.data();
      const c=byKey.get(`${x.templateTaskId}|${dayKey(x.date)}`);
      batch.update(d.ref,{
        assignedTo:c.assigneeId||'',
        assignedName:c.assigneeId?(names.get(c.assigneeId)||'Unassigned'):'Unassigned',
        effortMinutes:Number(c.effortMinutes)>0?Number(c.effortMinutes):null,
        updatedAt:serverTimestamp(),
        updatedByUserId:actor?.id||'',
        updatedByName:actor?.name||''
      });
    });
    await batch.commit();
  }

  return {updated,snapshotsUpdated:matching.length};
}

export async function saveFutureRule(templateTaskId,date,changes,actor){
  const ref=doc(db,'weeklyTemplates',templateTaskId);
  const snap=await getDoc(ref);
  if(!snap.exists()) throw new Error('Template task not found.');
  const task={id:snap.id,...snap.data()};
  const dkey=dayKey(date);
  const schedule={...(task.schedule||{})};
  const existing=normaliseVersions(schedule[dkey]);
  const before=existing.filter(v=>String(v.effectiveFrom||'0000-01-01')<date)
    .sort((a,b)=>String(b.effectiveFrom||'').localeCompare(String(a.effectiveFrom||'')))[0];

  const kept=existing.filter(v=>String(v.effectiveFrom||'0000-01-01')<date).map(v=>({...v}));
  if(before){
    const i=kept.indexOf(before);
    // indexOf will not find cloned object; update the most recent pre-date version instead.
    const sortedIndexes=kept.map((v,i)=>({i,v})).filter(x=>String(x.v.effectiveFrom||'')<date)
      .sort((a,b)=>String(b.v.effectiveFrom||'').localeCompare(String(a.v.effectiveFrom||'')));
    if(sortedIndexes[0]) kept[sortedIndexes[0].i].effectiveTo=previousISO(date);
  }

  const current=ruleForDate(task,date)||{};
  const next={
    effectiveFrom:date,
    active:changes.active!==undefined?Boolean(changes.active):current.active!==false,
    slotId:(task.recurring&&task.frequencyMinutes)?'AUTO':(changes.slotId??current.slotId??''),
    assigneeId:changes.assignedTo!==undefined?changes.assignedTo:(current.assigneeId||''),
    assigneeKey:'',
    legacyAssignee:'',
    effortMinutes:changes.effortMinutes!==undefined?changes.effortMinutes:(current.effortMinutes??null),
    sourceTime:changes.sourceTime!==undefined?changes.sourceTime:(current.sourceTime||''),
    taskName:changes.taskName!==undefined?changes.taskName:(current.taskName||task.taskName),
    photoRequired:changes.photoRequired!==undefined?Boolean(changes.photoRequired):(current.photoRequired??Boolean(task.photoRequired)),
    reportCategory:changes.reportCategory!==undefined?changes.reportCategory:(current.reportCategory||task.reportCategory||''),
    rotationAssignmentOverride:changes.rotationAssignmentOverride!==undefined?Boolean(changes.rotationAssignmentOverride):Boolean(current.rotationAssignmentOverride)
  };
  schedule[dkey]={versions:[...kept,next]};
  await updateDoc(ref,{
    schedule,updatedAt:serverTimestamp(),
    updatedByUserId:actor?.id||'',updatedByName:actor?.name||''
  });

  // Update already-generated future snapshots for this weekday.
  const futureQ=query(collection(db,'dailyTasks'),where('date','>=',date),where('date','<=',recurringReviewEndISO(date)));
  const future=await getDocs(futureQ);
  const people=await getUsers();
  const assignee=people.find(u=>u.id===next.assigneeId);
  const batch=writeBatch(db);
  let touched=0;
  future.docs.forEach(d=>{
    const x=d.data();
    if(x.templateTaskId===templateTaskId&&dayKey(x.date)===dkey&&x.status!=='completed'&&x.status!=='cancelled'&&!x.dayOnlyOverride){
      const patch={
        taskName:changes.taskName??x.taskName,
        effortMinutes:next.effortMinutes,
        assignedTo:next.assigneeId,
        assignedName:assignee?.name||'Unassigned',
        photoRequired:changes.photoRequired!==undefined?Boolean(changes.photoRequired):Boolean(x.photoRequired),
        sourceTime:changes.sourceTime!==undefined?changes.sourceTime:(x.sourceTime||''),
        updatedAt:serverTimestamp()
      };
      if(!(task.recurring&&task.frequencyMinutes)&&changes.slotId) patch.slotId=changes.slotId;
      batch.update(d.ref,patch); touched++;
    }
  });
  if(touched) await batch.commit();
}

// Single-date and same-weekday recurring creation share the multi-day data
// model and a single atomic Firestore write. This avoids orphan templates.
export async function createTaskForDate(date,data,scope,actor){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<todayISO())throw new Error('Choose a current or future date.');
  if(scope==='day')assertDateOnlyAllowed(date);
  if(!['day','future'].includes(scope)||!String(data.taskName||'').trim()||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(String(data.sourceTime||'')))throw new Error('Enter a valid task name and HH:MM time.');
  const existing=await getTasksForDate(date,{ensure:false});
  if(existing.some(t=>t.status!=='cancelled'&&String(t.taskName||'').trim().toLowerCase()===String(data.taskName||'').trim().toLowerCase()&&t.sourceTime===data.sourceTime))
    throw new Error('This task already exists at the selected time on this date.');
  const users=await getUsers(),assigned=users.find(u=>u.id===data.assignedTo),name=assigned?.name||'Unassigned';
  const templateId=`task_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
  const dailyId=scope==='future'?`${date}_${templateId}`:`${date}_adhoc_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const schedule={};WEEK_DAYS.forEach(day=>schedule[day]={versions:[]});
  if(scope==='future')schedule[dayKey(date)]={versions:[{effectiveFrom:date,active:true,
    slotId:data.slotId,assigneeId:data.assignedTo||'',assigneeKey:'',legacyAssignee:'',
    effortMinutes:data.effortMinutes??null,sourceTime:data.sourceTime,
    taskName:data.taskName,reportCategory:data.reportCategory||'Daily Operations',photoRequired:!!data.photoRequired}]};
  const auditId=`create_day_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  await runTransaction(db,async tx=>{
    if(scope==='future')tx.set(doc(db,'weeklyTemplates',templateId),{
      taskName:data.taskName,reportCategory:data.reportCategory||'Daily Operations',
      photoRequired:!!data.photoRequired,recurring:true,frequencyMinutes:null,
      schedule,schemaVersion:2,sortOrder:Date.now(),createdAt:serverTimestamp(),updatedAt:serverTimestamp(),
      createdByUserId:actor?.id||'',createdByName:actor?.name||''});
    tx.set(doc(db,'dailyTasks',dailyId),{
      date,templateTaskId:scope==='future'?templateId:'',
      taskName:data.taskName,reportCategory:data.reportCategory||'Daily Operations',
      slotId:data.slotId,sourceTime:data.sourceTime,effortMinutes:data.effortMinutes??null,
      originalAssignedTo:data.assignedTo||'',originalAssignedName:name,
      assignedTo:data.assignedTo||'',assignedName:name,
      legacyAssignee:'',status:'pending',photoRequired:!!data.photoRequired,
      recurring:scope==='future',checkpoint:'',adHoc:scope!=='future',
      completedAt:null,completedByUserId:'',completedByName:'',
      createdAt:serverTimestamp(),updatedAt:serverTimestamp(),
      createdByUserId:actor?.id||'',createdByName:actor?.name||''});
    tx.set(doc(db,'taskManagerAudit',auditId),{type:'task_created',date,scope,taskId:dailyId,
      templateId:scope==='future'?templateId:null,actorId:actor?.id||'',at:serverTimestamp()});
  });
  return dailyId;
}

// V4.3 — create one task on several selected weekdays, with a single recurring
// template for future weeks or individual dated occurrences for this week only.
// One transaction includes all generated records; completed/history documents
// are never overwritten. A duplicate preflight prevents accidental double adds.
export async function createWeeklyMultiDayTask({weekStart,effectiveFrom=weekStart,weekdays,scope,data},actor){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)||!['week','future'].includes(scope))throw new Error('Choose a week and save scope.');
  const days=[...new Set(weekdays||[])];if(!days.length||days.some(x=>!WEEK_DAYS.includes(x)))throw new Error('Choose at least one valid weekday.');
  if(!String(data.taskName||'').trim()||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(data.sourceTime)||!(Number(data.effortMinutes)>0))throw new Error('Enter task name, time and a positive effort.');
  if(scope==='future'&&(!/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom)||effectiveFrom<todayISO()))throw new Error('Choose a current or future effective date.');
  const dates=days.map(day=>scope==='future'?addDaysISO(effectiveFrom,(WEEK_DAYS.indexOf(day)-WEEK_DAYS.indexOf(dayKey(effectiveFrom))+7)%7):addDaysISO(weekStart,WEEK_DAYS.indexOf(day)));
  if(dates.some(date=>date<todayISO()))throw new Error('Cannot create a one-time task in the past. Choose a current or future week.');
  if(scope==='week')dates.forEach(assertDateOnlyAllowed);
  const [person,found]=await Promise.all([getUsers(),Promise.all(dates.map(date=>getTasksForDate(date,{ensure:false})))]);
  if(found.some((tasks,i)=>tasks.some(t=>t.status!=='cancelled'&&String(t.taskName||'').trim().toLowerCase()===String(data.taskName).trim().toLowerCase()&&t.sourceTime===data.sourceTime)))
    throw new Error('A matching task already exists on a selected date. Review the week before creating a duplicate.');
  const name=person.find(x=>x.id===data.assignedTo)?.name||'Unassigned';
  const id=`ntmulti_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
  const tpl=scope==='future'?doc(db,'weeklyTemplates',id):null;
  const weekSchedule={};WEEK_DAYS.forEach(day=>weekSchedule[day]={versions:[]});
  if(tpl)for(const day of days){const date=dates[days.indexOf(day)];weekSchedule[day]={versions:[{effectiveFrom:date,active:true,slotId:data.slotId,sourceTime:data.sourceTime,assigneeId:data.assignedTo||'',assigneeKey:'',legacyAssignee:'',effortMinutes:Number(data.effortMinutes),taskName:String(data.taskName).trim(),reportCategory:data.reportCategory||'Daily Operations',photoRequired:!!data.photoRequired}]};}
  await runTransaction(db,async tx=>{
    if(tpl)tx.set(tpl,{taskName:data.taskName,reportCategory:data.reportCategory||'Daily Operations',photoRequired:!!data.photoRequired,recurring:true,frequencyMinutes:null,schedule:weekSchedule,schemaVersion:2,sortOrder:Date.now(),createdAt:serverTimestamp(),updatedAt:serverTimestamp(),createdByUserId:actor?.id||''});
    for(const date of dates){const id2=`${date}_${id}`;tx.set(doc(db,'dailyTasks',id2),{date,templateTaskId:tpl?id:'',taskName:data.taskName,reportCategory:data.reportCategory||'Daily Operations',slotId:data.slotId,sourceTime:data.sourceTime,effortMinutes:Number(data.effortMinutes),originalAssignedTo:data.assignedTo||'',originalAssignedName:name,assignedTo:data.assignedTo||'',assignedName:name,status:'pending',photoRequired:!!data.photoRequired,recurring:!!tpl,adHoc:!tpl,checkpoint:'',completedAt:null,completedByUserId:'',completedByName:'',createdAt:serverTimestamp(),updatedAt:serverTimestamp()});}
    tx.set(doc(db,'taskManagerAudit',`create_multi_${id}`),{type:'multi_day_task_created',taskName:data.taskName,dates,scope,effectiveFrom:scope==='future'?effectiveFrom:null,templateId:tpl?id:'',actorId:actor?.id||'',at:serverTimestamp()});
  });
  return {templateId:tpl?id:null,dates};
}
export async function cancelTaskToday(id,actor,reason=''){
  const ref=doc(db,'dailyTasks',id),audit=doc(db,'taskManagerAudit',`cancel_${Date.now()}_${Math.random().toString(36).slice(2,8)}`);
  await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);if(!snap.exists())throw new Error('Task not found. Refresh.');
    const t=snap.data();assertDateOnlyAllowed(t.date);
    if(t.status==='completed')throw new Error('Completed history cannot be cancelled.');
    if(t.date<todayISO()||t.status==='cancelled')throw new Error('This task is not available for cancellation.');
    tx.update(ref,{status:'cancelled',cancelReason:String(reason||'Skipped for this date'),cancelledAt:serverTimestamp(),updatedAt:serverTimestamp(),updatedByUserId:actor?.id||''});
    tx.set(audit,{type:'cancel_once',taskId:id,date:t.date,reason:String(reason||''),actorId:actor?.id||'',at:serverTimestamp()});
  });
}
export async function stopTaskFuture(templateTaskId,date,actor){
  await saveFutureRule(templateTaskId,date,{active:false},actor);
}

export function workloadBySlot(tasks,date){
  const result={};
  tasks.filter(t=>t.status!=='cancelled').forEach(t=>{
    if(!t.assignedTo||!t.slotId) return;
    const key=`${t.slotId}|${t.assignedTo}`;
    if(!result[key]) result[key]={
      slotId:t.slotId,assignedTo:t.assignedTo,assignedName:t.assignedName||'Unassigned',
      effort:0,missing:0,capacity:slotCapacityMinutes(t.slotId,date),taskCount:0
    };
    result[key].taskCount++;
    if(Number.isFinite(Number(t.effortMinutes))&&Number(t.effortMinutes)>0) result[key].effort+=Number(t.effortMinutes);
    else result[key].missing++;
  });
  return Object.values(result);
}
export function capacityForDraft(tasks,date,draft,excludeId=''){
  if(!draft.assignedTo||!draft.slotId||!Number(draft.effortMinutes)) return null;
  const effort=tasks.filter(t=>t.id!==excludeId&&t.status!=='cancelled'&&t.assignedTo===draft.assignedTo&&t.slotId===draft.slotId)
    .reduce((sum,t)=>sum+(Number(t.effortMinutes)||0),0)+Number(draft.effortMinutes);
  const capacity=slotCapacityMinutes(draft.slotId,date);
  return {effort,capacity,overBy:Math.max(0,effort-capacity)};
}

export async function getTasksInRange(start,end){
  const q=query(collection(db,'dailyTasks'),where('date','>=',start),where('date','<=',end));
  const s=await getDocs(q);
  return sortTasks(s.docs.map(normaliseDaily));
}

export const percent=rows=>rows.length?Math.round(rows.filter(t=>t.status==='completed').length/rows.length*100):0;

// Unified Manager Editor: lifecycle events are separate from weekly templates
// and never destroy previous completion records.
export async function getTaskLifecycleRules(){
  const rows=await getDocs(collection(db,'taskScheduleLifecycles'));
  return new Map(rows.docs.map(d=>[d.id,d.data().events||[]]));
}
export function isLifecycleInactive(events,date){
  const applicable=(events||[]).filter(x=>x.date<=date&&(x.type!=='pause'||!x.until||date<=x.until)).sort((a,b)=>a.date.localeCompare(b.date)||String(a.key||'').localeCompare(String(b.key||'')));
  let ended=false;
  for(const x of applicable){if(x.type==='pause'||x.type==='end')ended=true;else if(x.type==='resume'||x.type==='restart')ended=false;}
  return ended;
}
export async function saveLifecycleAction({templateTaskId,type,date,until='',reason=''},actor){
  if(!templateTaskId||!['pause','resume','end','restart'].includes(type)||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)||date<todayISO())throw new Error('Invalid task action or historical date.');
  if(type==='pause'&&(!until||until<date))throw new Error('Choose an end date on or after the pause start.');
  const ref=doc(db,'taskScheduleLifecycles',templateTaskId),auditId=`task_lifecycle_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  const event={key:auditId,type,date,until:type==='pause'?until:'',reason:String(reason||''),by:actor?.id||'',at:Date.now()};
  await runTransaction(db,async tx=>{
    const [tpl,prev]=await Promise.all([tx.get(doc(db,'weeklyTemplates',templateTaskId)),tx.get(ref)]);
    if(!tpl.exists())throw new Error('Task template not found. Refresh.');
    tx.set(ref,{templateTaskId,events:[...(prev.exists()?prev.data().events||[]:[]),event],updatedAt:serverTimestamp()});
    tx.set(doc(db,'taskManagerAudit',auditId),{type:'lifecycle_action',templateTaskId,event,actorId:actor?.id||'',at:serverTimestamp()});
  });return event;
}
export async function saveDayTaskEdit(taskId,date,changes,actor){
  assertDateOnlyAllowed(date);
  const keys=['taskName','sourceTime','slotId','effortMinutes','assignedTo','photoRequired','reportCategory'];
  const selected=Object.fromEntries(keys.filter(k=>Object.hasOwn(changes,k)).map(k=>[k,changes[k]]));
  const people=await getUsers(),person=people.find(x=>x.id===selected.assignedTo);
  if(Object.hasOwn(selected,'assignedTo'))selected.assignedName=person?.name||'Unassigned';
  const ref=doc(db,'dailyTasks',taskId),audit=doc(db,'taskManagerAudit',`single_day_${Date.now()}_${Math.random().toString(36).slice(2,8)}`);
  await runTransaction(db,async tx=>{
    const snap=await tx.get(ref);if(!snap.exists()||snap.data().date!==date||['completed','cancelled'].includes(snap.data().status))throw new Error('This task is no longer editable. Refresh.');
    const fields=[...new Set([...(snap.data().dayOnlyFields||[]),...Object.keys(selected)])];
    tx.update(ref,{...selected,dayOnlyOverride:true,dayOnlyFields:fields,updatedAt:serverTimestamp(),updatedByUserId:actor?.id||''});
    tx.set(audit,{type:'date_only_edit',taskId,date,changes:selected,actorId:actor?.id||'',at:serverTimestamp()});
  });
}
// Query only occurrences belonging to the selected recurring templates. The old
// date >= effectiveFrom query downloaded ALL future tasks in the station before
// showing Review & Save; that could leave the manager button stuck on Reviewing.
// Equality / IN on a single indexed field avoids a compound Firestore index.
async function getRecurringCandidateDocs(changes){
  const ids=[...new Set(changes.map(x=>x.templateTaskId).filter(Boolean))];
  const docs=[];
  for(let i=0;i<ids.length;i+=10){
    const group=ids.slice(i,i+10);
    const constraint=group.length===1?where('templateTaskId','==',group[0]):where('templateTaskId','in',group);
    // This read happens before any save transaction. If offline or blocked,
    // fail safely instead of leaving Manager reviewing/saving indefinitely.
    let timeout;
    const read=getDocs(query(collection(db,'dailyTasks'),constraint));
    let result;
    try{
      result=await Promise.race([
        read,
        new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Task review could not reach Firebase within 12 seconds. Nothing was saved; check connection and retry.')),12000);})
      ]);
    }finally{clearTimeout(timeout);}
    docs.push(...result.docs);
  }
  return docs;
}
export async function previewRecurringExceptions(changes,effectiveFrom){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom)||effectiveFrom<todayISO())throw new Error('Choose a current or future recurring effective date.');
  const reviewEnd=recurringReviewEndISO(effectiveFrom);
  const wanted=new Set(changes.map(c=>`${c.templateTaskId}|${c.day}`));
  const docs=await getRecurringCandidateDocs(changes);
  return docs.map(d=>({id:d.id,...d.data()})).filter(x=>
    typeof x.date==='string'&&x.date>=effectiveFrom&&x.date<=reviewEnd&&x.dayOnlyOverride&&
    !['completed','cancelled'].includes(x.status)&&wanted.has(`${x.templateTaskId}|${dayKey(x.date)}`)
  ).map(x=>({id:x.id,date:x.date,taskName:x.taskName}));
}
export async function saveBulkDayEdits(entries,actor){
  if(!entries.length||entries.length>180)throw new Error('Choose between 1 and 180 task/date changes for one atomic save.');
  entries.forEach(x=>assertDateOnlyAllowed(x.date));
  const users=await getUsers(),names=new Map(users.map(x=>[x.id,x.name||'Unassigned']));
  const refs=entries.map(x=>doc(db,'dailyTasks',x.taskId)),audit=doc(db,'taskManagerAudit',`bulk_day_${Date.now()}_${Math.random().toString(36).slice(2,8)}`);
  await runTransaction(db,async tx=>{
    const snaps=await Promise.all(refs.map(r=>tx.get(r)));
    for(let i=0;i<snaps.length;i++){const s=snaps[i];if(!s.exists()||s.data().date!==entries[i].date||['completed','cancelled'].includes(s.data().status))throw new Error('Selected task changed. No changes were saved.');}
    snaps.forEach((snap,i)=>{
      const c=entries[i].changes;
      const patch={...c,dayOnlyOverride:true,dayOnlyFields:[...new Set([...(snap.data().dayOnlyFields||[]),...Object.keys(c),...(Object.hasOwn(c,'assignedTo')?['assignedName']:[])])],updatedAt:serverTimestamp(),updatedByUserId:actor?.id||''};
      if(Object.hasOwn(c,'assignedTo'))patch.assignedName=names.get(c.assignedTo)||'Unassigned';
      tx.update(refs[i],patch);
    });
    tx.set(audit,{type:'bulk_date_only',entries:entries.map(x=>({taskId:x.taskId,date:x.date,changes:x.changes})),actorId:actor?.id||'',at:serverTimestamp()});
  });return entries.length;
}
export async function saveBulkRecurringEdits({changes,effectiveFrom,replaceExceptions=false},actor){
  if(!Array.isArray(changes)||!changes.length||effectiveFrom<todayISO())throw new Error('Choose tasks and a current/future effective date.');
  const reviewEnd=recurringReviewEndISO(effectiveFrom);
  const selected=new Map();
  for(const c of changes){if(!c.templateTaskId||!WEEK_DAYS.includes(c.day))throw new Error('Invalid recurring task selection.');selected.set(`${c.templateTaskId}|${c.day}`,c);}
  const values=[...selected.values()],ids=[...new Set(values.map(c=>c.templateTaskId))];
  const future=await getRecurringCandidateDocs(values);
  const rows=future.filter(d=>typeof d.data().date==='string'&&d.data().date>=effectiveFrom&&d.data().date<=reviewEnd&&selected.has(`${d.data().templateTaskId}|${dayKey(d.data().date)}`)&&!['completed','cancelled'].includes(d.data().status));
  if(ids.length+rows.length>350)throw new Error('Too many existing future records for one atomic save. Select fewer tasks. Nothing saved.');
  const staff=await getUsers(),names=new Map(staff.map(x=>[x.id,x.name||'Unassigned']));
  const refs=ids.map(id=>doc(db,'weeklyTemplates',id)),audit=doc(db,'taskManagerAudit',`bulk_rule_${Date.now()}_${Math.random().toString(36).slice(2,8)}`);
  await runTransaction(db,async tx=>{
    const snapshots=await Promise.all([...refs,...rows.map(d=>d.ref)].map(r=>tx.get(r)));
    if(snapshots.some(x=>!x.exists()))throw new Error('A task was changed during saving. No changes saved.');
    const live=new Map(snapshots.slice(0,ids.length).map(d=>[d.id,{id:d.id,...d.data()}]));
    for(const id of ids){
      const task=live.get(id),schedule=structuredClone(task.schedule||{});
      for(const c of values.filter(v=>v.templateTaskId===id)){
        const offset=(WEEK_DAYS.indexOf(c.day)-WEEK_DAYS.indexOf(dayKey(effectiveFrom))+7)%7,date=addDaysISO(effectiveFrom,offset),old=normaliseVersions(schedule[c.day]);
        const current=ruleForDate(task,date)||{};
        const kept=old.filter(v=>String(v.effectiveFrom||'')!==date).map(v=>({...v}));
        const before=kept.map((v,i)=>({v,i})).filter(x=>String(x.v.effectiveFrom||'')<date).sort((a,b)=>String(b.v.effectiveFrom).localeCompare(String(a.v.effectiveFrom)))[0];
        if(before)kept[before.i].effectiveTo=addDaysISO(date,-1);
        const later=kept.filter(v=>v.effectiveFrom>date).sort((a,b)=>a.effectiveFrom.localeCompare(b.effectiveFrom))[0];
        const ch=c.changes,next={effectiveFrom:date,active:ch.active??(current.active!==false),slotId:ch.slotId??current.slotId??'',assigneeId:ch.assignedTo??current.assigneeId??'',assigneeKey:'',legacyAssignee:'',effortMinutes:ch.effortMinutes!==undefined?ch.effortMinutes:current.effortMinutes??null,sourceTime:ch.sourceTime??current.sourceTime??'',taskName:ch.taskName??current.taskName??task.taskName,photoRequired:ch.photoRequired??current.photoRequired??task.photoRequired??false,reportCategory:ch.reportCategory??current.reportCategory??task.reportCategory??'',rotationAssignmentOverride:ch.rotationAssignmentOverride??(Object.hasOwn(ch,'assignedTo')?true:(current.rotationAssignmentOverride??false))};
        if(later)next.effectiveTo=addDaysISO(later.effectiveFrom,-1);
        schedule[c.day]={versions:[...kept,next]};
      }
      tx.update(doc(db,'weeklyTemplates',id),{schedule,updatedAt:serverTimestamp(),updatedByUserId:actor?.id||''});
    }
    for(const snap of snapshots.slice(ids.length)){
      const x=snap.data(),c=selected.get(`${x.templateTaskId}|${dayKey(x.date)}`);if(!c)continue;
      if(x.dayOnlyOverride&&!replaceExceptions)continue;
      const patch={...c.changes,updatedAt:serverTimestamp(),updatedByUserId:actor?.id||''};
      if(Object.hasOwn(c.changes,'assignedTo'))patch.assignedName=names.get(c.changes.assignedTo)||'Unassigned';
      if(x.dayOnlyOverride&&replaceExceptions){patch.dayOnlyOverride=false;patch.dayOnlyFields=[];}
      tx.update(snap.ref,patch);
    }
    tx.set(audit,{type:'bulk_recurring_edit',effectiveFrom,reviewEnd,selected:values,replaceExceptions,actorId:actor?.id||'',at:serverTimestamp()});
  });return {changed:values.length};
}
