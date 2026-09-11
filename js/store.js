import {
  db,collection,doc,getDoc,getDocs,setDoc,updateDoc,deleteDoc,query,where,
  onSnapshot,serverTimestamp,writeBatch
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
export function compareISO(a,b){ return String(a).localeCompare(String(b)); }

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
export async function getAssignableUsers(){
  const users=await getUsers();
  return users.filter(u=>u.active!==false&&(u.role==='staff'||u.role==='assignee'))
    .sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
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

export async function getWeeklyTemplate(){
  const s=await getDocs(collection(db,'weeklyTemplates'));
  return s.docs.map(d=>({id:d.id,...d.data()}))
    .sort((a,b)=>(Number(a.sortOrder)||9999)-(Number(b.sortOrder)||9999)||String(a.taskName||'').localeCompare(String(b.taskName||'')));
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
    const u=users.find(x=>String(x.name||'').toLowerCase()===name.toLowerCase());
    return u?{id:u.id,name:u.name}:{id:'',name:'Unassigned'};
  }
  return {id:'',name:'Unassigned'};
}

export async function getPlannedTasksForDate(date){
  const [templates,users]=await Promise.all([getWeeklyTemplate(),getUsers()]);
  const rows=[];
  for(const t of templates){
    const rule=ruleForDate(t,date);
    if(!rule||rule.active===false) continue;
    const assigned=await resolveAssignee(rule,users);
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
            templateTaskId:t.id, taskName:t.taskName, date,
            slotId:slotForClock(clock,date), sourceTime:clock,
            effortMinutes:rule.effortMinutes??null,
            assignedTo:assigned.id, assignedName:assigned.name,
            legacyAssignee:rule.legacyAssignee||'',
            photoRequired:Boolean(t.photoRequired), recurring:true, checkpoint:clock,
            status:'planned'
          });
        }
        continue;
      }
    }
    rows.push({
      virtualId:`${date}_${t.id}`,templateTaskId:t.id,taskName:t.taskName,date,
      slotId:rule.slotId||'',
      sourceTime:rule.sourceTime||'',
      effortMinutes:rule.effortMinutes??null,
      assignedTo:assigned.id,assignedName:assigned.name,
      legacyAssignee:rule.legacyAssignee||'',
      photoRequired:Boolean(t.photoRequired),recurring:Boolean(t.recurring),status:'planned'
    });
  }
  return rows;
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
  return [...rows].sort((a,b)=>(order[a.slotId]??99)-(order[b.slotId]??99)||String(a.taskName||'').localeCompare(String(b.taskName||''))||String(a.checkpoint||'').localeCompare(String(b.checkpoint||'')));
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
    recurring:Boolean(row.recurring),
    checkpoint:row.checkpoint||'',
    completedAt:null,
    completedByUserId:'',
    completedByName:'',
    createdAt:serverTimestamp(),
    updatedAt:serverTimestamp()
  };
}

export async function ensureTasksForDate(date){
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  const existing=await getDocs(q);
  if(!existing.empty) return {created:false,count:existing.size};
  if(date<todayISO()) return {created:false,count:0}; // never fabricate historical completion data
  const planned=await getPlannedTasksForDate(date);
  if(!planned.length) return {created:false,count:0};
  const batch=writeBatch(db);
  for(const row of planned){
    batch.set(doc(db,'dailyTasks',row.virtualId),await plannedToDaily(row));
  }
  await batch.commit();
  return {created:true,count:planned.length};
}


export async function clearDailyTasksFrom(date){
  const q=query(collection(db,'dailyTasks'),where('date','>=',date));
  const snap=await getDocs(q);
  if(snap.empty) return 0;
  // Firestore batches are limited; this app is small, but chunk defensively.
  const docs=[...snap.docs];
  let count=0;
  for(let i=0;i<docs.length;i+=400){
    const batch=writeBatch(db);
    docs.slice(i,i+400).forEach(d=>batch.delete(d.ref));
    await batch.commit();
    count+=Math.min(400,docs.length-i);
  }
  return count;
}

export async function resetTasksForDate(date){
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  const existing=await getDocs(q);
  if(!existing.empty){
    const b=writeBatch(db); existing.docs.forEach(d=>b.delete(d.ref)); await b.commit();
  }
  return ensureTasksForDate(date);
}

export async function getTasksForDate(date,{ensure=true}={}){
  if(ensure) await ensureTasksForDate(date);
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  const s=await getDocs(q);
  return sortTasks(s.docs.map(normaliseDaily));
}
export function watchTasksForDate(date,cb,onError=()=>{}){
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  return onSnapshot(q,s=>cb(sortTasks(s.docs.map(normaliseDaily))),onError);
}

export async function completeTask(id,user){
  await updateDoc(doc(db,'dailyTasks',id),{
    status:'completed',completedAt:serverTimestamp(),
    completedByUserId:user.id,completedByName:user.name||'Staff',
    updatedAt:serverTimestamp()
  });
}
export async function uncompleteTask(id){
  await updateDoc(doc(db,'dailyTasks',id),{
    status:'pending',completedAt:null,completedByUserId:'',completedByName:'',updatedAt:serverTimestamp()
  });
}
export async function updateDailyTask(id,changes,actor){
  await updateDoc(doc(db,'dailyTasks',id),{
    ...changes,updatedAt:serverTimestamp(),
    updatedByUserId:actor?.id||'',updatedByName:actor?.name||''
  });
}

function previousISO(date){ return addDaysISO(date,-1); }

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
    slotId:task.recurring?'AUTO':(changes.slotId??current.slotId??''),
    assigneeId:changes.assignedTo!==undefined?changes.assignedTo:(current.assigneeId||''),
    assigneeKey:'',
    legacyAssignee:'',
    effortMinutes:changes.effortMinutes!==undefined?changes.effortMinutes:(current.effortMinutes??null),
    sourceTime:current.sourceTime||''
  };
  schedule[dkey]={versions:[...kept,next]};
  await updateDoc(ref,{
    taskName:changes.taskName??task.taskName,
    photoRequired:changes.photoRequired!==undefined?Boolean(changes.photoRequired):Boolean(task.photoRequired),
    schedule,updatedAt:serverTimestamp(),
    updatedByUserId:actor?.id||'',updatedByName:actor?.name||''
  });

  // Update already-generated future snapshots for this weekday.
  const futureQ=query(collection(db,'dailyTasks'),where('date','>=',date));
  const future=await getDocs(futureQ);
  const people=await getUsers();
  const assignee=people.find(u=>u.id===next.assigneeId);
  const batch=writeBatch(db);
  let touched=0;
  future.docs.forEach(d=>{
    const x=d.data();
    if(x.templateTaskId===templateTaskId&&dayKey(x.date)===dkey){
      const patch={
        taskName:changes.taskName??x.taskName,
        effortMinutes:next.effortMinutes,
        assignedTo:next.assigneeId,
        assignedName:assignee?.name||'Unassigned',
        photoRequired:changes.photoRequired!==undefined?Boolean(changes.photoRequired):Boolean(x.photoRequired),
        updatedAt:serverTimestamp()
      };
      if(!task.recurring&&changes.slotId) patch.slotId=changes.slotId;
      batch.update(d.ref,patch); touched++;
    }
  });
  if(touched) await batch.commit();
}

export async function createTaskForDate(date,data,scope,actor){
  const people=await getUsers();
  const assignee=people.find(u=>u.id===data.assignedTo);
  const name=assignee?.name||'Unassigned';
  const templateId=`task_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  const dailyId=`${date}_${scope==='future'?templateId:`adhoc_${Date.now()}`}`;

  if(scope==='future'){
    const schedule={};
    WEEK_DAYS.forEach(day=>schedule[day]={versions:[]});
    const dkey=dayKey(date);
    schedule[dkey]={versions:[{
      effectiveFrom:date,active:true,slotId:data.slotId,assigneeId:data.assignedTo||'',
      assigneeKey:'',legacyAssignee:'',effortMinutes:data.effortMinutes??null,sourceTime:''
    }]};
    await setDoc(doc(db,'weeklyTemplates',templateId),{
      taskName:data.taskName,photoRequired:Boolean(data.photoRequired),recurring:false,
      frequencyMinutes:null,schedule,schemaVersion:2,sortOrder:Date.now(),
      createdAt:serverTimestamp(),updatedAt:serverTimestamp(),
      createdByUserId:actor?.id||'',createdByName:actor?.name||''
    });
  }

  await setDoc(doc(db,'dailyTasks',dailyId),{
    date,templateTaskId:scope==='future'?templateId:'',
    taskName:data.taskName,slotId:data.slotId,sourceTime:'',
    effortMinutes:data.effortMinutes??null,
    originalAssignedTo:data.assignedTo||'',originalAssignedName:name,
    assignedTo:data.assignedTo||'',assignedName:name,
    legacyAssignee:'',status:'pending',photoRequired:Boolean(data.photoRequired),
    recurring:false,checkpoint:'',adHoc:scope!=='future',
    completedAt:null,completedByUserId:'',completedByName:'',
    createdAt:serverTimestamp(),updatedAt:serverTimestamp(),
    createdByUserId:actor?.id||'',createdByName:actor?.name||''
  });
  return dailyId;
}

export async function cancelTaskToday(id,actor){
  await updateDailyTask(id,{status:'cancelled',cancelledAt:serverTimestamp()},actor);
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
