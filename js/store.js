
import {db,collection,doc,getDocs,setDoc,updateDoc,query,where,onSnapshot,serverTimestamp,writeBatch} from './firebase.js';

const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function isoDate(d=new Date()){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export const formatDate=()=>new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

function parseMinutes(text=''){
  const matches=[...String(text).matchAll(/(\d{1,2}):(\d{2})/g)];
  if(!matches.length) return 9999;
  return Number(matches[0][1])*60+Number(matches[0][2]);
}

function minutesToTime(total){
  const h=Math.floor(total/60)%24;
  const m=total%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function parseRange(text=''){
  const matches=[...String(text).matchAll(/(\d{1,2}):(\d{2})/g)];
  if(matches.length<2) return null;
  const start=Number(matches[0][1])*60+Number(matches[0][2]);
  const end=Number(matches[1][1])*60+Number(matches[1][2]);
  if(end<=start) return null;
  return {start,end};
}

function deriveStatus(t){
  if(t.status==='completed') return 'completed';
  const x=t.time||'';
  const lower=x.toLowerCase();
  if(!x||lower.includes('min')||lower.includes('any ')) return 'upcoming';

  const n=new Date(),m=n.getHours()*60+n.getMinutes();
  let a=null,b=null;

  if(lower.startsWith('after ')){
    const r=x.match(/(\d{1,2}):(\d{2})/);
    if(r) a=Number(r[1])*60+Number(r[2]);
  }else{
    const r=[...x.matchAll(/(\d{1,2}):(\d{2})/g)];
    if(r[0]) a=Number(r[0][1])*60+Number(r[0][2]);
    if(r[1]) b=Number(r[1][1])*60+Number(r[1][2]);
  }

  if(a===null) return 'upcoming';
  if(b!==null&&m>b) return 'overdue';
  if(b===null&&m>a+60) return 'overdue';
  if(m>=a) return 'due';
  return 'upcoming';
}

function normaliseTask(d){
  const t={id:d.id,...d.data()};
  return {...t,status:deriveStatus(t)};
}

function sortTasks(rows){
  return [...rows].sort((a,b)=>{
    const sa=a.shift==='AM'?0:1,sb=b.shift==='AM'?0:1;
    if(sa!==sb) return sa-sb;
    const ta=parseMinutes(a.time),tb=parseMinutes(b.time);
    if(ta!==tb) return ta-tb;
    return String(a.taskName||'').localeCompare(String(b.taskName||''));
  });
}

export async function getUsers(){
  const s=await getDocs(collection(db,'users'));
  return s.docs.map(d=>({id:d.id,...d.data()}));
}

export async function validateUserUniqueness(documentId,{pin,staffId,role}){
  const users=await getUsers();
  const others=users.filter(u=>u.id!==documentId);
  if(pin&&others.some(u=>String(u.pin)===String(pin))) return {ok:false,field:'pin',message:'This PIN is already used by another user.'};
  if(role==='staff'&&staffId&&others.some(u=>u.role==='staff'&&String(u.staffId)===String(staffId))) return {ok:false,field:'staffId',message:'This Staff ID is already used by another staff member.'};
  return {ok:true};
}

export async function getWeeklyTemplate(){
  const s=await getDocs(collection(db,'weeklyTemplates'));
  return s.docs
    .map(d=>({id:d.id,...d.data()}))
    .sort((a,b)=>(Number(a.sortOrder)||9999)-(Number(b.sortOrder)||9999)||String(a.taskName||'').localeCompare(String(b.taskName||'')));
}

function dailyRecordsFromTemplateTask(t,day,date){
  // New full-schedule schema
  if(t.schedule){
    const slot=t.schedule?.[day];
    if(!slot||slot.active===false) return [];
    const assignee=String(slot.assignee||'');
    const time=String(slot.time||'');

    if(t.recurring&&t.frequencyMinutes){
      const range=parseRange(time);
      if(range){
        const rows=[];
        for(let start=range.start;start<range.end;start+=Number(t.frequencyMinutes)){
          const end=Math.min(start+Number(t.frequencyMinutes),range.end);
          const checkpoint=minutesToTime(start);
          rows.push({
            id:`${date}_${t.id}_${checkpoint.replace(':','')}`,
            data:{
              date,
              templateTaskId:t.id,
              taskName:t.taskName,
              shift:t.shift,
              section:t.section||'',
              time:`${minutesToTime(start)}-${minutesToTime(end)}`,
              checkpoint,
              recurring:true,
              originalStaff:assignee,
              assignedStaff:assignee,
              status:'pending',
              photoRequired:Boolean(t.photoRequired),
              completedAt:null,
              completedBy:null,
              createdAt:serverTimestamp()
            }
          });
        }
        return rows;
      }
    }

    return [{
      id:`${date}_${t.id}`,
      data:{
        date,
        templateTaskId:t.id,
        taskName:t.taskName,
        shift:t.shift,
        section:t.section||'',
        time,
        originalStaff:assignee,
        assignedStaff:assignee,
        status:'pending',
        photoRequired:Boolean(t.photoRequired),
        completedAt:null,
        completedBy:null,
        createdAt:serverTimestamp()
      }
    }];
  }

  // Compatibility with the earlier starter schema.
  const original=t.assignments?.[day]||'';
  if(!original) return [];
  return [{
    id:`${date}_${t.id}`,
    data:{
      date,
      templateTaskId:t.id,
      taskName:t.taskName,
      shift:t.shift,
      time:t.time,
      originalStaff:original,
      assignedStaff:original,
      status:'pending',
      photoRequired:Boolean(t.photoRequired),
      completedAt:null,
      completedBy:null,
      createdAt:serverTimestamp()
    }
  }];
}

export async function ensureTodayTasks(){
  const date=isoDate();
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  const existing=await getDocs(q);
  if(!existing.empty) return {created:false,count:existing.size};

  const template=await getWeeklyTemplate();
  if(!template.length) return {created:false,count:0};

  const day=days[new Date().getDay()];
  const rows=template.flatMap(t=>dailyRecordsFromTemplateTask(t,day,date));
  if(!rows.length) return {created:false,count:0};

  const batch=writeBatch(db);
  rows.forEach(row=>batch.set(doc(db,'dailyTasks',row.id),row.data));
  await batch.commit();
  return {created:true,count:rows.length};
}

export async function resetTodayTasks(){
  const date=isoDate();
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  const existing=await getDocs(q);
  if(!existing.empty){
    const batch=writeBatch(db);
    existing.docs.forEach(d=>batch.delete(d.ref));
    await batch.commit();
  }
  return ensureTodayTasks();
}

export async function getTodayTasks(){
  await ensureTodayTasks();
  const q=query(collection(db,'dailyTasks'),where('date','==',isoDate()));
  const s=await getDocs(q);
  return sortTasks(s.docs.map(normaliseTask));
}

export function watchTodayTasks(cb,onError=()=>{}){
  const q=query(collection(db,'dailyTasks'),where('date','==',isoDate()));
  return onSnapshot(q,s=>cb(sortTasks(s.docs.map(normaliseTask))),onError);
}

export async function completeTask(id,staffId){
  await updateDoc(doc(db,'dailyTasks',id),{
    status:'completed',
    completedAt:serverTimestamp(),
    completedBy:String(staffId)
  });
}

export async function uncompleteTask(id){
  await updateDoc(doc(db,'dailyTasks',id),{
    status:'pending',
    completedAt:null,
    completedBy:null
  });
}

export async function reassignTask(id,staffId){
  await updateDoc(doc(db,'dailyTasks',id),{
    assignedStaff:String(staffId),
    reassignedAt:serverTimestamp()
  });
}

export async function coverShift(off,shift,cover){
  const date=isoDate();
  const q=query(collection(db,'dailyTasks'),where('date','==',date));
  const s=await getDocs(q);
  const rows=s.docs.map(d=>({id:d.id,...d.data()})).filter(t=>String(t.assignedStaff)===String(off)&&t.shift===shift);
  const batch=writeBatch(db);
  rows.forEach(t=>batch.update(doc(db,'dailyTasks',t.id),{
    assignedStaff:String(cover),
    shiftCoverFrom:String(off),
    shiftCoveredAt:serverTimestamp()
  }));
  if(rows.length) await batch.commit();

  await setDoc(doc(collection(db,'shiftCover')),{date,shift,staffOff:String(off),coveredBy:String(cover),taskCount:rows.length,createdAt:serverTimestamp()});
  return rows.length;
}

export const percent=t=>t.length?Math.round(t.filter(x=>x.status==='completed').length/t.length*100):0;

export async function saveUser(id,data){
  await setDoc(doc(db,'users',id),data,{merge:true});
}
