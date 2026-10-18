import {db,collection,doc,getDoc,getDocs,setDoc,updateDoc,query,where,serverTimestamp,runTransaction} from './firebase.js';
import {getUsers,getStaffAvailability,getShiftCoverRules,slotForClock,todayISO} from './store.js';

const CLEANING_DOC='cleaningRotation';
const COMPLIANCE_DOC='complianceConfig';
const DAY={Sun:'sun',Mon:'mon',Tue:'tue',Wed:'wed',Thu:'thu',Fri:'fri',Sat:'sat'};
const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const CLEANING_EFFECTIVE='2026-10-08';

export const DEFAULT_CLEANING={version:1,effectiveFrom:CLEANING_EFFECTIVE,items:[
 {id:'prashanthy',staffId:'staff3',days:['Mon','Fri'],time:'14:01',mode:'rotate',missingLabels:true,photo:true,areas:['KitKat Bay','Hubba Bay & American Bay','Crisps 1 of 2','Crisps 2 of 2 + Cheetos'],nextIndex:0,active:true},
 {id:'himmo',staffId:'staff7',days:['Tue'],time:'14:01',mode:'rotate',missingLabels:true,photo:true,areas:['Carcare near door','Biscuit','Promotion'],nextIndex:0,active:true},
 {id:'parthy-wed',staffId:'staff1',days:['Wed'],time:'14:01',mode:'rotate',missingLabels:true,photo:true,areas:['Butter Chiller (Bottom to Top)','Coke Chiller (Bottom to Top)','2L Drink Bay','Wines Chiller','Beers Chiller'],nextIndex:0,active:true},
 {id:'suku',staffId:'staff4',days:['Thu'],time:'14:01',mode:'rotate',missingLabels:true,photo:true,areas:['Cadbury Bay','Car Care, Oil & Medicine'],nextIndex:0,active:true},
 {id:'parthy-sat',staffId:'staff1',days:['Sat'],time:'14:01',mode:'fixed',missingLabels:true,photo:true,areas:['Milk Chiller'],nextIndex:0,active:true},
 {id:'rishi-sat',staffId:'staff8',days:['Sat'],time:'18:01',mode:'fixed',missingLabels:true,photo:true,areas:['Behind the Till Shelf'],nextIndex:0,active:true},
 {id:'moon-sun',staffId:'staff6',days:['Sun'],time:'14:01',mode:'rotate',missingLabels:true,photo:true,areas:['Petfood & Household','Grocery','Protein Bar Section + Flapjack'],nextIndex:0,active:true},
 {id:'pragash-sun',staffId:'staff9',days:['Sun'],time:'14:01',mode:'rotate',missingLabels:true,photo:true,areas:['Ambient Wines','Ambient Beers'],nextIndex:0,active:true},
 {id:'uday-sun',staffId:'staff2',days:['Sun'],time:'09:01',mode:'fixed',missingLabels:false,photo:true,areas:['Pump deep clean, Carwash mud, Coal bunker, Canopy & fascia dust off'],nextIndex:0,active:true}
]};

export const DEFAULT_COMPLIANCE={version:1,enabled:true,tempPoints:[
 {id:'icecream',name:'Ice Cream',type:'freezer',limit:-18},{id:'freezer1',name:'Freezer 1 (Upstairs)',type:'freezer',limit:-18},
 {id:'dairy1',name:'Dairy-1 (Drinks)',type:'chilled',limit:5},{id:'dairy2',name:'Dairy-2 (BBER)',type:'chilled',limit:5}
],dailyItems:['Fire Extinguisher','Fire Bucket','Speaker','Pumps','Islands','Entrance Access','Fire Exit','First Aid Box','Shop Floor','Emergency Light','Fuel Stop Button'],weeklyItems:['Vent Pipes','Forecourt Signs','Pumps/Nozzles','Lighting','Smoke Alarm','Rubbish Area','Vapour Recovery','Interceptor'],weeklyStaffId:'staff3',weeklyDay:'Wed',weeklyTime:'14:01',sundayDailyStaffId:'staff2',sfbbOpening:['Your fridges, chilled display equipment and freezers are working properly.','All areas are free from evidence of pest activity.','Hot running water is available at all sinks and hand wash basins.','Probe thermometer is working and probe wipes are available.','Allergen information is accurate for all items on sale.','Food on its Use By date has been thrown away.','Dirty cleaning equipment has been cleaned or thrown away.','Waste has been removed and new bags put into the bins.','Floors are swept and clean.'],sfbbClosing:['Food that needs chilling has been put in the fridge or freezer.','Food left on display is protected and stored safely.','Out-of-date or unsafe food has been removed.','All food contact surfaces and equipment have been cleaned and disinfected.','Used cleaning equipment has been cleaned or disposed of.','Waste has been removed and bins are clean and covered.','Floors and work areas are clean and tidy.','No signs of pest activity are present.','Fridges and freezers are operating correctly.','Doors, windows and food storage areas are secured.']};

async function config(name,defaults){const r=doc(db,'system',name),s=await getDoc(r);if(s.exists())return s.data();await setDoc(r,{...defaults,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});return defaults;}
export const getCleaningConfig=()=>config(CLEANING_DOC,DEFAULT_CLEANING);
export async function getComplianceConfig(){const saved=await config(COMPLIANCE_DOC,DEFAULT_COMPLIANCE);const old='Read and confirm the current SFBB closing checks before closing the site.';if(Array.isArray(saved.sfbbClosing)&&saved.sfbbClosing.length===1&&saved.sfbbClosing[0]===old)return {...saved,sfbbClosing:[...DEFAULT_COMPLIANCE.sfbbClosing]};return saved;}
export async function saveCleaningConfig(items,actor){await setDoc(doc(db,'system',CLEANING_DOC),{version:1,effectiveFrom:CLEANING_EFFECTIVE,items,updatedAt:serverTimestamp(),updatedByName:actor?.name||''},{merge:true});}
export async function saveComplianceConfig(data,actor){
  const ref=doc(db,'system',COMPLIANCE_DOC),prior=await getDoc(ref);
  const old=prior.exists()?prior.data():{};
  const fields=['dailyItems','weeklyItems','sfbbOpening','sfbbClosing','tempPoints','customTasks','taskNames'];
  const changed=fields.some(key=>JSON.stringify(old[key]??null)!==JSON.stringify(data[key]??null));
  const history=[...(old.definitionHistory||[])];
  if(changed&&prior.exists()){
    history.push({version:Number(old.definitionVersion||1),savedAtMs:Date.now(),modifiedBy:actor?.name||'',definitions:Object.fromEntries(fields.map(key=>[key,old[key]??null]))});
    if(history.length>25)history.splice(0,history.length-25);
  }
  await setDoc(ref,{...data,definitionHistory:history,definitionVersion:Number(old.definitionVersion||1)+(changed?1:0),updatedAt:serverTimestamp(),updatedByName:actor?.name||''},{merge:true});
} 

function dateObj(s){return new Date(s+'T12:00:00');}
function dayName(date){return DOW[dateObj(date).getDay()];}
function occurrences(item,date,from=CLEANING_EFFECTIVE){let n=0,d=dateObj(from),end=dateObj(date);while(d<=end){if(item.days.includes(DOW[d.getDay()]))n++;d.setDate(d.getDate()+1);}return Math.max(0,n-1);}
async function audit(type,details,actor='system'){const id=`${Date.now()}_${Math.random().toString(36).slice(2,7)}`;await setDoc(doc(db,'auditEvents',id),{type,details,actor,at:serverTimestamp()});}
async function upsertTask(id,data){const ref=doc(db,'dailyTasks',id),snap=await getDoc(ref);if(snap.exists())return false;await setDoc(ref,{...data,status:'pending',completedAt:null,completedByUserId:'',completedByName:'',adHoc:true,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});return true;}

export async function ensureCleaningTasks(date){const cfg=await getCleaningConfig();if(date<String(cfg.effectiveFrom||CLEANING_EFFECTIVE))return;const day=dayName(date),users=await getUsers(),map=new Map(users.map(u=>[u.id,u]));for(const item of (cfg.items||[])){if(item.active===false||!item.days?.includes(day)||!item.areas?.length)continue;const idx=item.mode==='rotate'?(Number(item.nextIndex||0)+occurrences(item,date,String(cfg.effectiveFrom||CLEANING_EFFECTIVE)))%item.areas.length:0,area=item.areas[idx],u=map.get(item.staffId);let name=`Clean ${area}`;if(item.missingLabels)name+=', place missing labels';if(item.photo)name+=' and send photo';await upsertTask(`clean_${date}_${item.id}`,{date,templateTaskId:'',specialType:'cleaning',reportCategory:'Cleaning',cleaningRuleId:item.id,rotationIndex:idx,taskName:name,slotId:slotForClock(item.time,date),sourceTime:item.time,effortMinutes:Number(item.effortMinutes??60),originalAssignedTo:item.staffId,originalAssignedName:u?.name||'Unassigned',assignedTo:item.staffId,assignedName:u?.name||'Unassigned',photoRequired:Boolean(item.photo),temperatureRequired:false,recurring:true,checkpoint:''});}}

// Read-only monthly projection. Viewing future dates must not create dailyTasks.
export function projectCleaningSchedule(cfg,from,to,users=[],actual=[]){
  const known=new Map(users.map(x=>[x.id,x.name||x.id]));const live=new Map(actual.filter(x=>x.specialType==='cleaning').map(x=>[x.date+'|'+x.cleaningRuleId,x]));
  const out=[];let date=dateObj(from),end=dateObj(to);
  while(date<=end){const ds=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;const day=dayName(ds);
    if(ds>=String(cfg.effectiveFrom||CLEANING_EFFECTIVE))for(const r of cfg.items||[]){if(r.active===false||!r.days?.includes(day)||!r.areas?.length)continue;
      const idx=r.mode==='rotate'?(Number(r.nextIndex||0)+occurrences(r,ds,String(cfg.effectiveFrom||CLEANING_EFFECTIVE)))%r.areas.length:0;
      const row=live.get(ds+'|'+r.id);const area=r.areas[idx];
      out.push({date:ds,ruleId:r.id,id:row?.id||'',area:row?.taskName||'Clean '+area,assignedTo:row?.assignedTo||r.staffId,assignedName:row?.assignedName||known.get(r.staffId)||'Unassigned',sourceTime:row?.sourceTime||r.time||'14:01',slotId:row?.slotId||slotForClock(r.time||'14:01',ds),effortMinutes:Number(row?.effortMinutes??r.effortMinutes??60),status:row?.status||'scheduled',rotationIndex:row?.rotationIndex??idx,dayOnlyOverride:!!row?.dayOnlyOverride});
    }date.setDate(date.getDate()+1);
  }return out;
}

// Persist a per-weekday assignment the first time each compliance check is
// generated. Subsequent rota updates do not silently reassign the employee.
async function stableComplianceOwner(key,day,candidate,time){
  const id=String(key).replace(/[^a-zA-Z0-9_-]/g,'_')+'_'+day;
  const ref=doc(db,'system','complianceAssignee_'+id);
  return runTransaction(db,async tx=>{
    const found=await tx.get(ref);
    if(found.exists())return {id:found.data().staffId||'',name:found.data().staffName||'Unassigned',time:found.data().initialTime||time};
    const obj={staffId:candidate?.u?.id||candidate?.id||'',staffName:candidate?.u?.name||candidate?.name||'Unassigned',initialTime:time,createdAt:serverTimestamp()};
    tx.set(ref,obj);return {id:obj.staffId,name:obj.staffName,time};
  });
}

function parseShifts(text){return String(text||'').split(',').map(x=>x.trim()).map(x=>{const m=x.match(/^(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})$/);return m?{start:m[1].padStart(5,'0'),end:m[2].padStart(5,'0')}:null;}).filter(Boolean);}
async function dayWorkers(date){const [a,users]=await Promise.all([getStaffAvailability(),getUsers()]),key=DAY[dayName(date)],rows=[];for(const u of users.filter(x=>x.active!==false&&(x.role==='staff'||x.role==='assignee'))){for(const sh of parseShifts(a?.week?.[u.id]?.[key]||''))rows.push({u,start:sh.start,end:sh.end});}return rows;}
function minusMinutes(hm,n){let [h,m]=hm.split(':').map(Number),x=h*60+m-n;x=Math.max(0,x);return `${String(Math.floor(x/60)).padStart(2,'0')}:${String(x%60).padStart(2,'0')}`;}
export const COMPLIANCE_STANDARD=[
 {key:'temp_am',type:'temperature',name:'AM Temperature Check',effort:10},
 {key:'temp_pm',type:'temperature',name:'PM Temperature Check',effort:10},
 {key:'daily',type:'daily',name:'Daily Safety Check',effort:10},
 {key:'sfbb_open',type:'sfbb_open',name:'SFBB Opening Check',effort:5},
 {key:'sfbb_close',type:'sfbb_close',name:'SFBB Closing Check',effort:5},
 {key:'weekly',type:'weekly',name:'Weekly Safety Check',effort:15}
];
export async function ensureComplianceTasks(date){
  const cfg=await getComplianceConfig();if(cfg.enabled===false)return;
  const day=dayName(date),workers=await dayWorkers(date),starts=[...workers].sort((a,b)=>a.start.localeCompare(b.start));
  const opening=starts[0],closing=[...workers].sort((a,b)=>b.end.localeCompare(a.end))[0];
  const firstByStaff=[];for(const row of starts)if(!firstByStaff.some(x=>x.u.id===row.u.id))firstByStaff.push(row);
  let second=firstByStaff[1]||firstByStaff[0];
  if(day==='Sun'){const x=starts.find(r=>r.u.id===cfg.sundayDailyStaffId);if(x)second=x;}
  const users=await getUsers(),names=new Map(users.map(x=>[x.id,x.name||x.id]));
  const settings=[
    ['temp_am',opening,opening?.start||'06:00'],
    ['temp_pm',closing,minusMinutes(closing?.end||'22:00',30)],
    ['daily',second,second?.start||'06:00'],
    ['sfbb_open',opening,opening?.start||'06:00'],
    ['sfbb_close',closing,minusMinutes(closing?.end||'22:00',20)],
    ['weekly',users.find(x=>x.id===cfg.weeklyStaffId),cfg.weeklyTime||'14:01']
  ];
  for(const [key,worker,computedTime] of settings){
    if(key==='weekly'&&day!==cfg.weeklyDay)continue;
    // No new task with an invented opening/closing time when nobody has ever
    // been assigned and no one is rostered. Once assigned, retain initial time.
    if(!worker&&key!=='weekly'){
      const saved=await getDoc(doc(db,'system','complianceAssignee_'+key+'_'+day));
      if(!saved.exists())continue;
    }
    const rule=COMPLIANCE_STANDARD.find(r=>r.key===key),owner=await stableComplianceOwner(key,day,worker,computedTime);
    const candidate=cfg.scheduleOverrides?.[key]?.[day]||{};
    const override=String(candidate.effectiveFrom||'0000-01-01')<=date?candidate:{};
    const assignedTo=override.staffId??owner.id,time=override.time||owner.time,person=names.get(assignedTo)||owner.name;
    await upsertTask(`comp_${date}_${key}`,{date,specialType:'compliance',complianceType:rule.type,complianceRuleId:key,reportCategory:rule.type==='temperature'?'Temperature Log':rule.type==='daily'?'Daily Safety':rule.type==='weekly'?'Weekly Safety':'SFBB',taskName:cfg.taskNames?.[key]||rule.name,slotId:override.slotId||slotForClock(time,date),sourceTime:time,effortMinutes:Number(override.effortMinutes??cfg.effortMinutes?.[key]??rule.effort),originalAssignedTo:assignedTo,originalAssignedName:person,assignedTo,assignedName:person,photoRequired:false,temperatureRequired:false,recurring:true,checkpoint:'',checklistSnapshot:rule.type==='daily'?[...(cfg.dailyItems||[])]:rule.type==='weekly'?[...(cfg.weeklyItems||[])]:rule.type==='sfbb_open'?[...(cfg.sfbbOpening||[])]:rule.type==='sfbb_close'?[...(cfg.sfbbClosing||[])]:[]});
  }
  for(const t of cfg.customTasks||[]){
    if(t.active===false||!(t.days||[]).includes(day)||date<(t.effectiveFrom||'0000-01-01'))continue;
    const candidate=cfg.scheduleOverrides?.['custom_'+t.id]?.[day]||{};const override=String(candidate.effectiveFrom||'0000-01-01')<=date?candidate:{};const owner=await stableComplianceOwner('custom_'+t.id,day,users.find(x=>x.id===t.staffId),t.time||'09:00');
    const staffId=override.staffId??owner.id,time=override.time||owner.time;
    await upsertTask(`comp_${date}_custom_${t.id}`,{date,specialType:'compliance',complianceType:'custom',complianceRuleId:'custom_'+t.id,reportCategory:'Compliance',taskName:t.name,slotId:override.slotId||slotForClock(time,date),sourceTime:time,effortMinutes:Number(override.effortMinutes??t.effortMinutes??10),originalAssignedTo:staffId,originalAssignedName:names.get(staffId)||owner.name,assignedTo:staffId,assignedName:names.get(staffId)||owner.name,recurring:true,photoRequired:false,temperatureRequired:false,checklistSnapshot:[...(t.items||[])],checkpoint:''});
  }
}
export async function previewComplianceRecurringExceptions(key,day,effectiveFrom){
  const all=await getDocs(query(collection(db,'dailyTasks'),where('date','>=',effectiveFrom)));
  return all.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.specialType==='compliance'&&x.complianceRuleId===key&&dayName(x.date)===day&&x.dayOnlyOverride&&!['completed','cancelled'].includes(x.status)).map(x=>({id:x.id,date:x.date,taskName:x.taskName}));
}
// Permanent compliance changes live in the Compliance module, not ordinary weekly templates.
export async function updateComplianceRecurringRule(key,day,changes,effectiveFrom,actor,replaceExceptions=false){
  if(!DOW.includes(day)||!key||effectiveFrom<todayISO())throw new Error('Choose a valid future date.');
  const cfg=await getComplianceConfig();const overrides={...(cfg.scheduleOverrides||{})};
  overrides[key]={...(overrides[key]||{}),[day]:{...(overrides[key]?.[day]||{}),...changes,effectiveFrom}};
  await saveComplianceConfig({...cfg,scheduleOverrides:overrides},actor);
  // Update pending future occurrences without changing completed records or date-only exceptions.
  const all=await getDocs(query(collection(db,'dailyTasks'),where('date','>=',effectiveFrom)));
  const people=await getUsers();for(const snap of all.docs){const t=snap.data();if(t.specialType!=='compliance'||t.complianceRuleId!==key||dayName(t.date)!==day||['completed','cancelled'].includes(t.status)||(t.dayOnlyOverride&&!replaceExceptions))continue;
    const next={updatedAt:serverTimestamp()};if(t.dayOnlyOverride&&replaceExceptions){next.dayOnlyOverride=false;next.dayOnlyFields=[];}if(changes.staffId!==undefined){next.assignedTo=changes.staffId;next.assignedName=people.find(x=>x.id===changes.staffId)?.name||'Unassigned';}if(changes.time!==undefined)next.sourceTime=changes.time;if(changes.slotId!==undefined)next.slotId=changes.slotId;if(changes.effortMinutes!==undefined)next.effortMinutes=changes.effortMinutes;
    await updateDoc(snap.ref,next);
  }
  await audit('compliance_recurring_change',{key,day,effectiveFrom,changes},actor?.name||'Manager');
}
export async function ensureSpecialTasksForDate(date){
  await ensureCleaningTasks(date);await ensureComplianceTasks(date);
  // Cover affects a pending occurrence only; the stored recurring assignment
  // remains unchanged. Do not overwrite date-only manager assignee choices.
  const [rules,staff,qs]=await Promise.all([getShiftCoverRules(),getUsers(),getDocs(query(collection(db,'dailyTasks'),where('date','==',date)))]);
  const map=new Map(staff.map(x=>[x.id,x.name||x.id]));
  for(const snap of qs.docs){const t=snap.data();if(!['cleaning','compliance'].includes(t.specialType)||['completed','cancelled'].includes(t.status)||t.dayOnlyFields?.includes('assignedTo'))continue;
    const applicable=rules.filter(x=>x.active!==false&&x.weekday===dayName(date)&&x.slotId===t.slotId&&String(x.effectiveFrom||'')<=date&&x.fromUserId===t.originalAssignedTo).sort((a,b)=>String(a.effectiveFrom).localeCompare(String(b.effectiveFrom)));
    const last=applicable.at(-1);if(!last||!last.toUserId||last.id===t.shiftCoverRuleId)continue;
    await updateDoc(snap.ref,{assignedTo:last.toUserId,assignedName:map.get(last.toUserId)||'Unassigned',shiftCoverRuleId:last.id,shiftCoveredFromUserId:t.originalAssignedTo,shiftCoverScope:'future',updatedAt:serverTimestamp()});
  }
}

export async function saveComplianceResult(task,user,result){await setDoc(doc(db,'complianceRecords',task.id),{date:task.date,taskId:task.id,type:task.complianceType,taskName:task.taskName,assignedTo:task.assignedTo,assignedName:task.assignedName,completedByUserId:user.id,completedByName:user.name||'',result,completedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});}
export async function getComplianceRecords(from,to){const s=await getDocs(collection(db,'complianceRecords'));return s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.date>=from&&x.date<=to).sort((a,b)=>String(a.date).localeCompare(String(b.date)));}
export async function getAuditEvents(){const s=await getDocs(collection(db,'auditEvents'));return s.docs.map(d=>({id:d.id,...d.data()}));}
export {audit};
export async function ensureSafeUpgrades(){const stateRef=doc(db,'system','safeUpgrades'),state=await getDoc(stateRef);if(!state.data()?.cleaningReplacement20261008){const ref=doc(db,'weeklyTemplates','pm04'),snap=await getDoc(ref);if(snap.exists()){const data=snap.data(),schedule=structuredClone(data.schedule||{});for(const day of Object.keys(schedule)){const dd=schedule[day];if(!Array.isArray(dd?.versions))continue;dd.versions.forEach(v=>{if(v.active!==false&&!v.effectiveTo&&String(v.effectiveFrom||'')<'2026-10-08')v.effectiveTo='2026-10-07';});dd.versions.push({effectiveFrom:'2026-10-08',active:false,slotId:'',assigneeId:'',assigneeKey:'',legacyAssignee:'',effortMinutes:15,sourceTime:''});}await updateDoc(ref,{schedule,updatedAt:serverTimestamp()});}await setDoc(stateRef,{cleaningReplacement20261008:true,updatedAt:serverTimestamp()},{merge:true});}if(!state.data()?.toiletSwap20261012){const ref=doc(db,'weeklyTemplates','pm15'),snap=await getDoc(ref);if(snap.exists()){const data=snap.data(),schedule=structuredClone(data.schedule||{});for(const [day,staffId] of [['Wed','staff1'],['Fri','staff6']]){const dd=schedule[day]||{versions:[]};const versions=Array.isArray(dd.versions)?dd.versions:[];versions.forEach(v=>{if(v.active!==false&&!v.effectiveTo&&String(v.effectiveFrom||'')<'2026-10-12')v.effectiveTo='2026-10-11';});versions.push({effectiveFrom:'2026-10-12',active:true,slotId:'S2',assigneeId:staffId,assigneeKey:'',legacyAssignee:'',effortMinutes:15,sourceTime:'13:45'});schedule[day]={...dd,versions};}await updateDoc(ref,{schedule,updatedAt:serverTimestamp()});}await setDoc(stateRef,{toiletSwap20261012:true,updatedAt:serverTimestamp()},{merge:true});}}

// This-week-only compliance checklist tasks. They remain special compliance
// occurrences, not ordinary operations tasks, and include an item snapshot.
export async function createComplianceOneWeek({name,days,weekStart,time,slotId,effortMinutes,staffId,items},actor){
  if(!name?.trim()||!days?.length||!items?.length)throw new Error('Task name, weekdays and checklist questions are required.');
  const refs=days.map(day=>{const pos=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(day);if(pos<0)throw new Error('Invalid weekday.');const date=dateObj(weekStart);date.setDate(date.getDate()+pos);const ds=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;if(ds<todayISO())throw new Error('Cannot create a past task.');return {date:ds,ref:doc(db,'dailyTasks',`comp_${ds}_once_${Date.now()}_${pos}`)};});
  const people=await getUsers(),person=people.find(x=>x.id===staffId),data={specialType:'compliance',complianceType:'custom',reportCategory:'Compliance',taskName:name,sourceTime:time,slotId,effortMinutes:Number(effortMinutes),originalAssignedTo:staffId,originalAssignedName:person?.name||'Unassigned',assignedTo:staffId,assignedName:person?.name||'Unassigned',photoRequired:false,checklistSnapshot:items,recurring:false,adHoc:true,status:'pending',completedByUserId:'',completedByName:''};
  await runTransaction(db,async tx=>{for(const r of refs){const old=await tx.get(r.ref);if(old.exists())throw new Error('Task already exists: '+r.date);}for(const r of refs)tx.set(r.ref,{...data,date:r.date,createdAt:serverTimestamp(),updatedAt:serverTimestamp()});tx.set(doc(db,'taskManagerAudit',`comp_created_${Date.now()}`),{type:'compliance_one_week',taskName:name,dates:refs.map(r=>r.date),actorId:actor?.id||'',at:serverTimestamp()});});
  return refs.length;
}

// Apply permanent checklist/name settings to FUTURE pending instances only.
// Existing completed submissions stay unchanged (their recorded item text is
// saved inside the compliance record). Manager may run after settings changes.
export async function syncFutureComplianceDefinitions(cfg,actor){
  const q=await getDocs(query(collection(db,'dailyTasks'),where('date','>=',todayISO())));
  let changed=0;
  for(const snap of q.docs){const t=snap.data();if(t.specialType!=='compliance'||['completed','cancelled','missed'].includes(t.status))continue;
    const key=t.complianceRuleId||t.complianceType;
    const custom=(cfg.customTasks||[]).find(x=>'custom_'+x.id===key);
    const standard=COMPLIANCE_STANDARD.find(x=>x.key===key);
    if(!custom&&!standard)continue;
    const items=custom?.items|| (standard?.type==='daily'?cfg.dailyItems:standard?.type==='weekly'?cfg.weeklyItems:standard?.type==='sfbb_open'?cfg.sfbbOpening:standard?.type==='sfbb_close'?cfg.sfbbClosing:[]);
    const patch={updatedAt:serverTimestamp()};
    if(items.length)patch.checklistSnapshot=[...items];
    if(!t.dayOnlyFields?.includes('taskName'))patch.taskName=custom?.name||cfg.taskNames?.[key]||standard?.name||t.taskName;
    if(Object.keys(patch).length>1){await updateDoc(snap.ref,patch);changed++;}
  }
  await audit('compliance_definition_sync',{affectedFuturePending:changed},actor?.name||'Manager');
  return changed;
}

export async function syncFutureCleaningRules(cfg,actor){
  const [snap,users]=await Promise.all([getDocs(query(collection(db,'dailyTasks'),where('date','>=',todayISO()))),getUsers()]);
  const people=new Map(users.map(u=>[u.id,u.name||u.id]));let updated=0,cancelled=0;
  for(const row of snap.docs){const t=row.data();if(t.specialType!=='cleaning'||['completed','cancelled','missed'].includes(t.status))continue;
    const rule=(cfg.items||[]).find(x=>x.id===t.cleaningRuleId);
    if(!rule||rule.active===false||!rule.days?.includes(dayName(t.date))){
      await updateDoc(row.ref,{status:'cancelled',cancelReason:'Cleaning rule deactivated by manager',updatedAt:serverTimestamp()});cancelled++;continue;
    }
    const changed={},fields=new Set(t.dayOnlyFields||[]);
    if(!fields.has('sourceTime'))changed.sourceTime=rule.time||'14:01';
    if(!fields.has('slotId'))changed.slotId=slotForClock(rule.time||'14:01',t.date);
    if(!fields.has('effortMinutes'))changed.effortMinutes=Number(rule.effortMinutes??60);
    if(!fields.has('assignedTo')){changed.originalAssignedTo=rule.staffId;changed.originalAssignedName=people.get(rule.staffId)||'Unassigned';
      if(!t.shiftCoverRuleId){changed.assignedTo=rule.staffId;changed.assignedName=people.get(rule.staffId)||'Unassigned';}
    }
    await updateDoc(row.ref,{...changed,updatedAt:serverTimestamp()});updated++;
  }
  await audit('cleaning_future_rules_synchronised',{updated,cancelled},actor?.name||'Manager');return {updated,cancelled};
}
