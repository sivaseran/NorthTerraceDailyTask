import {db,doc,getDoc,getDocs,setDoc,updateDoc,collection,query,where,serverTimestamp} from './firebase.js';
import {getHotFoodConfig,getHotFoodProducts,getInitialCookingPlan,addHotFoodAudit,isHotFoodWeekLocked} from './hot-food-store.js';
import {getUsers,getStaffAvailability,getTasksForDate,slotForClock,dayKey} from './store.js';

const pad=n=>String(n).padStart(2,'0');
const mins=s=>{const m=String(s||'').match(/^(\d{1,2}):(\d{2})/);return m?+m[1]*60 + +m[2]:null};
const hm=n=>`${pad(Math.floor(n/60)%24)}:${pad(n%60)}`;
const isoDate=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const nowHM=()=>hm(new Date().getHours()*60+new Date().getMinutes());
const dayLower=d=>dayKey(d).toLowerCase();
const parseShift=s=>String(s||'').split(',').map(x=>x.trim()).map(x=>{const m=x.match(/(\d{1,2}):?(\d{2})?\s*[-–]\s*(\d{1,2}):?(\d{2})?/);return m?{a:+m[1]*60+(+m[2]||0),b:+m[3]*60+(+m[4]||0)}:null}).filter(Boolean);
const activeStatus=x=>!['completed','cancelled','missed'].includes(x.status);

export function hotFoodSchedule(date){
  const sun=new Date(date+'T12:00:00').getDay()===0;
  return {initial:sun?'07:00':'06:00',second:sun?'11:00':'10:00',firstCheck:sun?'07:55':'06:55'};
}
export async function isHotFoodEnabled(){return (await getHotFoodConfig()).enabled===true;}

async function chooseAssignee(date,time){
  const [users,av,tasks]=await Promise.all([getUsers(),getStaffAvailability(),getTasksForDate(date,{ensure:false})]);
  const people=users.filter(u=>u.active!==false&&(u.role==='staff'||u.role==='assignee'));
  const t=mins(time), week=av?.week||{};
  const available=people.filter(p=>parseShift(week?.[p.id]?.[dayLower(date)]||'').some(w=>t>=w.a&&t<w.b));
  const pool=available.length?available:people;
  const slot=slotForClock(time,date);
  const scored=pool.map(p=>({p,load:tasks.filter(x=>x.slotId===slot&&x.assignedTo===p.id&&x.status!=='cancelled').reduce((a,x)=>a+(Number(x.effortMinutes)||0),0)})).sort((a,b)=>a.load-b.load||String(a.p.id).localeCompare(String(b.p.id)));
  return scored[0]?.p||null;
}
async function upsertHFTask(id,data){
  const ref=doc(db,'dailyTasks',id), snap=await getDoc(ref);
  if(snap.exists()) return {id,...snap.data()};
  const assignee=await chooseAssignee(data.date,data.sourceTime||data.checkpoint||'06:00');
  const row={hotFood:true,status:'pending',photoRequired:false,effortMinutes:5,assignedTo:assignee?.id||'',assignedName:assignee?.name||'Unassigned',...data,createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
  await setDoc(ref,row); return {id,...row};
}
export async function ensureHotFoodDay(date){
  const cfg=await getHotFoodConfig(); if(!cfg.enabled) return;
  const dow=new Date(date+'T12:00:00').getDay();
  // Saturday/Sunday are manual-start days: no automatic Initial/Second Cooking tasks.
  if(dow===0||dow===6){
    const q=await getDocs(query(collection(db,'dailyTasks'),where('date','==',date)));
    for(const d of q.docs){
      const x=d.data();
      if(x.hotFood===true&&['cooking_initial','cooking_second'].includes(x.hotFoodType)&&activeStatus(x))
        await updateDoc(d.ref,{status:'cancelled',cancelReason:'Weekend Hot Food is manual start',updatedAt:serverTimestamp()});
    }
    await reconcileHotFoodDay(date);
    return;
  }
  const s=hotFoodSchedule(date);
  await upsertHFTask(`hf_${date}_initial`,{date,taskName:'Initial Cooking',hotFoodType:'cooking_initial',sourceTime:s.initial,checkpoint:s.initial,slotId:slotForClock(s.initial,date),effortMinutes:15});
  await upsertHFTask(`hf_${date}_second`,{date,taskName:'New Cooking / Top Up',hotFoodType:'cooking_second',sourceTime:s.second,checkpoint:s.second,slotId:slotForClock(s.second,date),effortMinutes:10});
  await reconcileHotFoodDay(date);
}
async function batchesForDate(date){const s=await getDocs(query(collection(db,'hotFoodBatches'),where('date','==',date)));return s.docs.map(d=>({id:d.id,...d.data()}));}
export async function getActiveBatches(date){return (await batchesForDate(date)).filter(x=>x.status==='active');}

async function cancelFutureTemperatureTasks(date,afterTime,reason='No active Hot Food remains'){
  const q=await getDocs(query(collection(db,'dailyTasks'),where('date','==',date)));
  for(const d of q.docs){const x=d.data();if(x.hotFood===true&&x.hotFoodType==='temperature_check'&&activeStatus(x)&&mins(x.sourceTime)>mins(afterTime))await updateDoc(d.ref,{status:'cancelled',cancelReason:reason,updatedAt:serverTimestamp()});}
}
async function cancelBatchExpiryTask(date,batchId,reason){
  const ref=doc(db,'dailyTasks',`hf_${date}_expiry_${batchId}`),snap=await getDoc(ref);if(snap.exists()&&activeStatus(snap.data()))await updateDoc(ref,{status:'cancelled',cancelReason:reason||'Batch closed before expiry',updatedAt:serverTimestamp()});
}
async function checksForDate(date){const s=await getDocs(query(collection(db,'hotFoodChecks'),where('date','==',date)));return s.docs.map(d=>({id:d.id,...d.data()}));}

export async function reconcileHotFoodDay(date){
  const cfg=await getHotFoodConfig(); if(!cfg.enabled)return;
  const batches=await getActiveBatches(date); if(!batches.length)return;
  const schedule=hotFoodSchedule(date), first=mins(schedule.firstCheck), now=date===isoDate(new Date())?(new Date().getHours()*60+new Date().getMinutes()):23*60+59;
  const latest=23*60+55;
  for(let t=first;t<=latest;t+=60){
    const eligible=batches.some(b=>mins(b.timeOutOven)+Number(cfg.eligibilityMinutes||15)<=t && mins(b.timeOutOven)+Number(cfg.holdingMinutes||240)>t);
    if(eligible) await upsertHFTask(`hf_${date}_check_${hm(t).replace(':','')}`,{date,taskName:'Hot Food Temperature Check',hotFoodType:'temperature_check',sourceTime:hm(t),checkpoint:hm(t),slotId:slotForClock(hm(t),date),effortMinutes:5});
  }
  for(const b of batches){
    const exp=mins(b.timeOutOven)+Number(cfg.holdingMinutes||240); if(exp<24*60){
      await upsertHFTask(`hf_${date}_expiry_${b.id}`,{date,taskName:`4-Hour Expiry — ${b.productName}`,hotFoodType:'expiry',hotFoodBatchId:b.id,sourceTime:hm(exp),checkpoint:hm(exp),slotId:slotForClock(hm(exp),date),effortMinutes:3});
    }
  }
}

export async function cookingDefaults(date,type='initial'){
  const products=await getHotFoodProducts({includeInactive:false});
  if(type!=='initial')return {products,planned:[]};
  const plan=await getInitialCookingPlan(), key=dayKey(date);
  const planned=products.map(p=>({productId:p.id,productName:p.name,qty:Number(plan?.[p.id]?.[key]||plan?.[key]?.[p.id]||0)})).filter(x=>x.qty>0);
  return {products,planned};
}

export async function submitCooking({date,taskId,actor,timeOutOven,items,noCooking=false,source='scheduled'}){
  if(await isHotFoodWeekLocked(date))throw new Error('This compliance week has been signed off. Ask a Manager to reopen the week.');
  const cfg=await getHotFoodConfig(); if(!cfg.enabled)throw new Error('Hot Food is disabled.');
  const cutoff=mins(cfg.cookingCutoff||'14:00'); if(mins(timeOutOven)>cutoff)throw new Error(`New cooking is not allowed after ${cfg.cookingCutoff}.`);
  if(noCooking){
    if(taskId)await updateDoc(doc(db,'dailyTasks',taskId),{status:'completed',completedAt:serverTimestamp(),completedByUserId:actor.id,completedByName:actor.name,hotFoodResult:'no_cooking',updatedAt:serverTimestamp()});
    if(source==='cooking_initial'){
      const q=await getDocs(query(collection(db,'dailyTasks'),where('date','==',date)));
      for(const d of q.docs){const x=d.data();if(x.hotFood===true&&d.id!==taskId&&activeStatus(x))await updateDoc(d.ref,{status:'cancelled',cancelReason:'No cooking required at Initial Cooking',updatedAt:serverTimestamp()});}
      await setDoc(doc(db,'hotFoodDayState',date),{date,initialCancelled:true,hotFoodActive:false,updatedAt:serverTimestamp()},{merge:true});
    }
    await addHotFoodAudit('no_cooking_required',{date,taskId,source},actor); return {batches:[]};
  }
  const valid=(items||[]).filter(x=>Number(x.qty)>0);
  if(!valid.length)throw new Error('Add at least one cooked product or choose No cooking required.');
  for(const x of valid){
    const readings=(Array.isArray(x.coreReadings)?x.coreReadings:[x.coreTempC]).map(Number).filter(Number.isFinite);
    if(!readings.length)throw new Error(`Enter core temperature for ${x.productName}.`);
    x.coreReadings=readings;x.coreTempC=readings[readings.length-1];
    if(Number(x.coreTempC)<Number(cfg.corePassC)&&!x.wasteFailed)throw new Error(`${x.productName} is below ${cfg.corePassC}°C. Reheat/retest and add the new reading, or choose Waste if failed.`);
  }
  const sessionId=`hfs_${date}_${Date.now()}`; const made=[];
  for(const x of valid){
    const id=`hfb_${date}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    const failed=Number(x.coreTempC)<Number(cfg.corePassC); const row={date,sessionId,productId:x.productId,productName:x.productName,qtyCooked:Number(x.qty),remainingQty:failed?0:Number(x.qty),coreTempC:Number(x.coreTempC),coreReadings:x.coreReadings,timeOutOven,status:failed?'closed':'active',closeReason:failed?'failed_core_waste':'',quantityWasted:failed?Number(x.qty):0,source,createdByUserId:actor.id,createdByName:actor.name,createdAt:serverTimestamp(),createdAtMs:Date.now()};
    await setDoc(doc(db,'hotFoodBatches',id),row); made.push({id,...row});
  }
  await setDoc(doc(db,'hotFoodDayState',date),{date,initialCancelled:false,hotFoodActive:true,updatedAt:serverTimestamp()},{merge:true});
  await setDoc(doc(db,'hotFoodSessions',sessionId),{date,timeOutOven,source,taskId:taskId||'',batchIds:made.map(x=>x.id),createdByUserId:actor.id,createdByName:actor.name,createdAt:serverTimestamp(),createdAtMs:Date.now()});
  if(taskId)await updateDoc(doc(db,'dailyTasks',taskId),{status:'completed',completedAt:serverTimestamp(),completedByUserId:actor.id,completedByName:actor.name,hotFoodSessionId:sessionId,updatedAt:serverTimestamp()});
  await addHotFoodAudit('cooking_recorded',{date,sessionId,timeOutOven,items:valid.map(x=>({productId:x.productId,productName:x.productName,qty:+x.qty,coreTempC:+x.coreTempC,coreReadings:x.coreReadings}))},actor);
  await reconcileHotFoodDay(date); return {sessionId,batches:made};
}

export async function getOverdueTemperatureTasks(date,currentTask){
  const tasks=await getTasksForDate(date,{ensure:false});const now=mins(nowHM());
  return tasks.filter(t=>t.hotFood&&t.hotFoodType==='temperature_check'&&activeStatus(t)&&mins(t.sourceTime)<=now&&mins(t.sourceTime)<=mins(currentTask.sourceTime)).sort((a,b)=>mins(a.sourceTime)-mins(b.sourceTime));
}
export async function temperatureCheckContext(date,scheduledTime){
  const cfg=await getHotFoodConfig(), all=await getActiveBatches(date), t=mins(scheduledTime);
  const eligible=all.filter(b=>mins(b.timeOutOven)+Number(cfg.eligibilityMinutes)<=t && mins(b.timeOutOven)+Number(cfg.holdingMinutes)>t);
  const by=new Map(); for(const b of eligible){const x=by.get(b.productId)||{productId:b.productId,productName:b.productName,currentSystemQty:0,batches:[]};x.currentSystemQty+=Number(b.remainingQty)||0;x.batches.push(b);by.set(b.productId,x)}
  return {config:cfg,products:[...by.values()]};
}
async function applyFifo(date,productId,targetQty,{wasteQty=0,reason='',sellOutTime='',sellOutTimes={}},actor){
  const batches=(await getActiveBatches(date)).filter(b=>b.productId===productId).sort((a,b)=>mins(a.timeOutOven)-mins(b.timeOutOven));
  let system=batches.reduce((a,b)=>a+(+b.remainingQty||0),0), sold=Math.max(0,system-Number(targetQty)), waste=Math.max(0,Number(wasteQty)||0);
  let soldLeft=sold,wasteLeft=waste;
  for(const b of batches){let rem=+b.remainingQty||0; const s=Math.min(rem,soldLeft);rem-=s;soldLeft-=s; const w=Math.min(rem,wasteLeft);rem-=w;wasteLeft-=w; const patch={remainingQty:rem,updatedAt:serverTimestamp()}; if(rem<=0){patch.status='closed';patch.closedAt=serverTimestamp(); if(w>0){patch.closeReason='waste';patch.quantityWasted=(+b.quantityWasted||0)+w;}else{patch.closeReason='sold';patch.sellOutTime=sellOutTimes?.[b.id]||sellOutTime||nowHM();}} else if(w>0)patch.quantityWasted=(+b.quantityWasted||0)+w; await updateDoc(doc(db,'hotFoodBatches',b.id),patch);if(rem<=0)await cancelBatchExpiryTask(date,b.id,patch.closeReason==='sold'?'Batch sold out before expiry':'Batch closed by waste before expiry');}
  return {sold,wasted:waste,remaining:Math.max(0,Number(targetQty)-waste)};
}
export async function submitTemperatureCheck({date,taskId,taskIds,actor,scheduledTimes,actualReadingTime,readings}){
  if(await isHotFoodWeekLocked(date))throw new Error('This compliance week has been signed off. Ask a Manager to reopen the week.');
  const cfg=await getHotFoodConfig();
  for(const r of readings){
    if(Number(r.qty)<0)throw new Error('Current quantity cannot be negative.');
    if(Number(r.qty)>0&&!Number.isFinite(Number(r.temperatureC)))throw new Error(`Enter temperature for ${r.productName}.`);
    if(Number(r.wasteQty||0)<0||Number(r.wasteQty||0)>Number(r.qty))throw new Error(`Waste quantity for ${r.productName} must be between 0 and Current Qty.`);
    if(Number(r.wasteQty||0)>0&&!r.wasteReason)throw new Error(`Select a waste/removal reason for ${r.productName}.`);
    if(r.wasteReason==='other'&&!String(r.wasteComment||'').trim())throw new Error(`Add a short comment for Other waste reason (${r.productName}).`);
    for(const [batchId,t] of Object.entries(r.sellOutTimes||{})){const b=(await expiryContext(batchId));if(!/^\d{2}:\d{2}$/.test(t)||mins(t)<mins(b.timeOutOven)||mins(t)>mins(actualReadingTime))throw new Error(`Sell Out Time for ${r.productName} must be between ${b.timeOutOven} and ${actualReadingTime}.`);}
  }
  const eventId=`hfc_${date}_${Date.now()}`; const results=[];
  for(const r of readings){
    const fail=Number(r.qty)>0&&Number(r.temperatureC)<Number(cfg.holdingPassC); const waste=fail?Number(r.qty):Number(r.wasteQty||0);
    const stock=await applyFifo(date,r.productId,Number(r.qty),{wasteQty:waste,reason:fail?'temperature_failure':r.wasteReason||'',sellOutTime:r.sellOutTime||actualReadingTime,sellOutTimes:r.sellOutTimes||{}},actor);
    results.push({...r,failed:fail,...stock});
  }
  await setDoc(doc(db,'hotFoodChecks',eventId),{date,scheduledTimes,actualReadingTime,readings:results,performedByUserId:actor.id,performedByName:actor.name,createdAt:serverTimestamp(),createdAtMs:Date.now()});
  for(const id of (taskIds?.length?taskIds:(taskId?[taskId]:[])))await updateDoc(doc(db,'dailyTasks',id),{status:'completed',completedAt:serverTimestamp(),completedByUserId:actor.id,completedByName:actor.name,hotFoodCheckId:eventId,actualReadingTime,updatedAt:serverTimestamp()});
  await addHotFoodAudit('temperature_check_recorded',{date,eventId,scheduledTimes,actualReadingTime,readings:results},actor); if(!(await getActiveBatches(date)).length)await cancelFutureTemperatureTasks(date,actualReadingTime); await reconcileHotFoodDay(date); return results;
}

export async function expiryContext(batchId){const s=await getDoc(doc(db,'hotFoodBatches',batchId));if(!s.exists())throw new Error('Batch not found.');return {id:s.id,...s.data()};}
export async function submitExpiry({taskId,batchId,actor,actualWasteQty,removalTime,sellOutTime='',earlyReason='',earlyComment=''}){
  const b=await expiryContext(batchId);if(await isHotFoodWeekLocked(b.date))throw new Error('This compliance week has been signed off. Ask a Manager to reopen the week.');
  const waste=Math.max(0,Number(actualWasteQty)||0), expected=Math.max(0,Number(b.remainingQty)||0);
  if(mins(removalTime)<mins(b.timeOutOven))throw new Error('Removal/waste time cannot be before Time Out Oven.');
  if(b.date===isoDate(new Date())&&mins(removalTime)>mins(nowHM()))throw new Error('Removal/waste time cannot be later than the submission time.');
  const cfg=await getHotFoodConfig(), expiryAt=mins(b.timeOutOven)+Number(cfg.holdingMinutes||240), early=mins(removalTime)<expiryAt;
  if(early&&!earlyReason)throw new Error('Select a reason for early removal.');
  if(early&&earlyReason==='other'&&!String(earlyComment||'').trim())throw new Error('Add a short comment for Other early-removal reason.');
  const patch={remainingQty:0,status:'closed',closedAt:serverTimestamp(),actualRemovalTime:removalTime,earlyRemoval:early,earlyRemovalReason:early?earlyReason:'',earlyRemovalComment:early?String(earlyComment||'').trim():'',updatedAt:serverTimestamp()};
  if(waste>0){patch.closeReason=early?'early_waste':'expiry_waste';patch.quantityWasted=(+b.quantityWasted||0)+waste;if(waste>expected)patch.stockDiscrepancyQty=waste-expected;}else{patch.closeReason='sold';patch.sellOutTime=sellOutTime||removalTime;}
  await updateDoc(doc(db,'hotFoodBatches',batchId),patch);
  await updateDoc(doc(db,'dailyTasks',taskId),{status:'completed',completedAt:serverTimestamp(),completedByUserId:actor.id,completedByName:actor.name,hotFoodExpiryResult:{actualWasteQty:waste,removalTime},updatedAt:serverTimestamp()});
  await addHotFoodAudit('expiry_completed',{batchId,productName:b.productName,expectedRemaining:b.remainingQty,actualWasteQty:waste,stockDiscrepancyQty:patch.stockDiscrepancyQty||0,removalTime,sellOutTime:patch.sellOutTime||'',earlyRemoval:patch.earlyRemoval,earlyRemovalReason:patch.earlyRemovalReason||'',earlyRemovalComment:patch.earlyRemovalComment||''},actor); if(!(await getActiveBatches(b.date)).length)await cancelFutureTemperatureTasks(b.date,removalTime); return patch;
}

export async function canStartHotFood(date){const cfg=await getHotFoodConfig();if(!cfg.enabled||mins(nowHM())>=mins(cfg.cookingCutoff))return false;const active=await getActiveBatches(date);if(active.length)return false;const tasks=await getTasksForDate(date,{ensure:false});return !tasks.some(t=>t.hotFood&&['cooking_initial','cooking_second'].includes(t.hotFoodType)&&activeStatus(t));}
