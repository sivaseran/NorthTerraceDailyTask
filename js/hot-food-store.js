import {db,doc,getDoc,setDoc,collection,getDocs,serverTimestamp} from './firebase.js';

export const HOT_FOOD_DEFAULTS={
  enabled:false,
  corePassC:75,
  holdingPassC:63,
  eligibilityMinutes:15,
  cookingCutoff:'14:00',
  holdingMinutes:240
};

export const HOT_FOOD_DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export async function getHotFoodConfig(){
  const snap=await getDoc(doc(db,'system','hotFood'));
  return {...HOT_FOOD_DEFAULTS,...(snap.exists()?snap.data():{})};
}

export async function saveHotFoodConfig(changes,actor){
  const current=await getHotFoodConfig();
  const next={...current,...changes};
  await setDoc(doc(db,'system','hotFood'),{
    ...next,
    updatedAt:serverTimestamp(),updatedByUserId:actor?.id||'',updatedByName:actor?.name||''
  },{merge:true});
  await addHotFoodAudit('settings_changed',{changes},actor);
  return next;
}

export async function canDisableHotFood(){
  const [batches,tasks]=await Promise.all([
    getDocs(collection(db,'hotFoodBatches')),
    getDocs(collection(db,'dailyTasks'))
  ]);
  const activeBatches=batches.docs.filter(d=>{
    const x=d.data(); return x.status==='active';
  });
  const outstanding=tasks.docs.filter(d=>{
    const x=d.data(); return x.hotFood===true && !['completed','cancelled','missed'].includes(x.status);
  });
  return {ok:activeBatches.length===0&&outstanding.length===0,activeBatches:activeBatches.length,outstandingTasks:outstanding.length};
}

export async function setHotFoodEnabled(enabled,actor){
  if(!enabled){
    const guard=await canDisableHotFood();
    if(!guard.ok) return {...guard,enabled:false};
  }
  await saveHotFoodConfig({enabled:Boolean(enabled)},actor);
  await addHotFoodAudit(enabled?'module_enabled':'module_disabled',{},actor);
  return {ok:true,enabled:Boolean(enabled)};
}

export async function getHotFoodProducts({includeInactive=true}={}){
  const snap=await getDocs(collection(db,'hotFoodProducts'));
  return snap.docs.map(d=>({id:d.id,...d.data()}))
    .filter(x=>includeInactive||x.active!==false)
    .sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
}

export async function saveHotFoodProduct(product,actor){
  const name=String(product.name||'').trim();
  if(!name) throw new Error('Enter a product name.');
  const id=product.id||`hf_product_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
  await setDoc(doc(db,'hotFoodProducts',id),{
    name,active:product.active!==false,
    updatedAt:serverTimestamp(),updatedByUserId:actor?.id||'',updatedByName:actor?.name||''
  },{merge:true});
  await addHotFoodAudit(product.id?'product_updated':'product_created',{productId:id,name,active:product.active!==false},actor);
  return id;
}

export async function setHotFoodProductActive(id,active,actor){
  const snap=await getDoc(doc(db,'hotFoodProducts',id));
  if(!snap.exists()) throw new Error('Product not found.');
  await setDoc(doc(db,'hotFoodProducts',id),{active:Boolean(active),updatedAt:serverTimestamp(),updatedByUserId:actor?.id||'',updatedByName:actor?.name||''},{merge:true});
  await addHotFoodAudit(active?'product_reactivated':'product_deactivated',{productId:id,name:snap.data().name||''},actor);
}

export async function getInitialCookingPlan(){
  const snap=await getDoc(doc(db,'hotFoodConfig','initialCookingPlan'));
  return snap.exists()?(snap.data().plan||{}):{};
}

export async function saveInitialCookingPlan(plan,actor){
  await setDoc(doc(db,'hotFoodConfig','initialCookingPlan'),{
    plan,updatedAt:serverTimestamp(),updatedByUserId:actor?.id||'',updatedByName:actor?.name||''
  },{merge:true});
  await addHotFoodAudit('initial_plan_changed',{},actor);
}



const INITIAL_BASELINE_PRODUCTS=[
  ['Sausage Roll',5],['Potato dog',2],['Bacon cheese',1],['Cheese onion',1],
  ['Steak Bake',1],['Chicken tikka',1],['Cornish Pasty',1]
];

// One-time live-data migration for the agreed North Terrace baseline.
// It creates only missing products and fills only blank plan cells, so later Manager edits are preserved.
export async function ensureInitialCookingBaseline(actor={}){
  const markerRef=doc(db,'hotFoodConfig','baseline_20261005');
  const marker=await getDoc(markerRef);
  if(marker.exists()) return {changed:false};

  const existing=await getHotFoodProducts();
  const byName=new Map(existing.map(x=>[String(x.name||'').trim().toLowerCase(),x]));
  const ids=[];
  for(const [name] of INITIAL_BASELINE_PRODUCTS){
    let product=byName.get(name.toLowerCase());
    if(!product){
      const id=`hf_product_baseline_${name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}`;
      await setDoc(doc(db,'hotFoodProducts',id),{name,active:true,createdByBaseline:true,updatedAt:serverTimestamp(),updatedByUserId:actor?.id||'',updatedByName:actor?.name||''},{merge:true});
      product={id,name,active:true};
    }
    ids.push([product.id,name]);
  }

  const current=await getInitialCookingPlan();
  const next=structuredClone(current||{});
  for(const [id,name] of ids){
    next[id]=next[id]||{};
    const qty=INITIAL_BASELINE_PRODUCTS.find(x=>x[0]===name)[1];
    for(const day of ['Mon','Tue','Wed','Thu','Fri']){
      if(next[id][day]===undefined||next[id][day]===null||next[id][day]==='') next[id][day]=qty;
    }
    // Saturday/Sunday intentionally remain blank: staff start Hot Food manually if needed.
  }
  await setDoc(doc(db,'hotFoodConfig','initialCookingPlan'),{plan:next,updatedAt:serverTimestamp(),updatedByUserId:actor?.id||'',updatedByName:actor?.name||''},{merge:true});
  await setDoc(markerRef,{applied:true,appliedAt:serverTimestamp(),products:ids.map(x=>x[1])});
  await addHotFoodAudit('initial_baseline_applied',{weekdays:['Mon','Tue','Wed','Thu','Fri'],weekend:'manual_start'},actor);
  return {changed:true};
}

export async function addHotFoodAudit(type,details={},actor={}){
  const id=`${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  await setDoc(doc(db,'hotFoodAudit',id),{
    type,details,actorUserId:actor?.id||'',actorName:actor?.name||'',createdAt:serverTimestamp(),createdAtMs:Date.now()
  });
}

export async function getHotFoodAudit(){
  const snap=await getDocs(collection(db,'hotFoodAudit'));
  return snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAtMs||0)-(a.createdAtMs||0));
}

const dateInRange=(d,a,b)=>String(d||'')>=a&&String(d||'')<=b;
export async function getHotFoodComplianceData(startDate,endDate){
  const [bs,cs,ts]=await Promise.all([getDocs(collection(db,'hotFoodBatches')),getDocs(collection(db,'hotFoodChecks')),getDocs(collection(db,'dailyTasks'))]);
  const batches=bs.docs.map(d=>({id:d.id,...d.data()})).filter(x=>dateInRange(x.date,startDate,endDate)).sort((a,b)=>String(a.date+a.timeOutOven).localeCompare(String(b.date+b.timeOutOven)));
  const checks=cs.docs.map(d=>({id:d.id,...d.data()})).filter(x=>dateInRange(x.date,startDate,endDate)).sort((a,b)=>String(a.date+(a.actualReadingTime||'')).localeCompare(String(b.date+(b.actualReadingTime||''))));
  const tasks=ts.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.hotFood===true&&dateInRange(x.date,startDate,endDate));
  const exceptions=tasks.filter(x=>!['completed','cancelled'].includes(x.status)).map(x=>({date:x.date,type:'incomplete_task',taskId:x.id,description:`${x.taskName||'Hot Food task'} ${x.sourceTime||x.checkpoint||''} is ${x.status||'pending'}`}));
  return {batches,checks,tasks,exceptions};
}
export function mondayOf(date){const d=new Date(date+'T12:00:00');const day=d.getDay()||7;d.setDate(d.getDate()-day+1);return d.toISOString().slice(0,10)}
export function sundayOf(date){const d=new Date(mondayOf(date)+'T12:00:00');d.setDate(d.getDate()+6);return d.toISOString().slice(0,10)}
export async function getWeekSignoff(anyDate){const weekStart=mondayOf(anyDate);const s=await getDoc(doc(db,'hotFoodSignoffs',weekStart));return {weekStart,weekEnd:sundayOf(anyDate),...(s.exists()?s.data():{})};}
export async function signOffHotFoodWeek(anyDate,comment,actor){
  const weekStart=mondayOf(anyDate),weekEnd=sundayOf(anyDate),data=await getHotFoodComplianceData(weekStart,weekEnd);
  if(data.exceptions.length&&!String(comment||'').trim())throw new Error('Manager comment is required because this week has compliance exceptions.');
  const prior=await getWeekSignoff(anyDate),history=Array.isArray(prior.history)?prior.history:[];
  if(prior.status==='signed')history.push({action:'previous_signoff',signedByName:prior.signedByName||'',signedAtMs:prior.signedAtMs||0,comment:prior.comment||''});
  const row={weekStart,weekEnd,status:'signed',comment:String(comment||'').trim(),exceptionCount:data.exceptions.length,signedByUserId:actor?.id||'',signedByName:actor?.name||'',signedAt:serverTimestamp(),signedAtMs:Date.now(),history};
  await setDoc(doc(db,'hotFoodSignoffs',weekStart),row,{merge:true});await addHotFoodAudit('week_signed_off',{weekStart,weekEnd,exceptionCount:data.exceptions.length,comment:row.comment},actor);return row;
}
export async function reopenHotFoodWeek(anyDate,actor){const prior=await getWeekSignoff(anyDate);if(prior.status!=='signed')throw new Error('This week is not currently signed off.');const history=Array.isArray(prior.history)?[...prior.history]:[];history.push({action:'reopened',previousSignedByName:prior.signedByName||'',previousSignedAtMs:prior.signedAtMs||0,reopenedByName:actor?.name||'',reopenedAtMs:Date.now()});await setDoc(doc(db,'hotFoodSignoffs',prior.weekStart),{status:'draft',reopenedByUserId:actor?.id||'',reopenedByName:actor?.name||'',reopenedAt:serverTimestamp(),reopenedAtMs:Date.now(),history},{merge:true});await addHotFoodAudit('week_reopened',{weekStart:prior.weekStart},actor);return getWeekSignoff(anyDate)}
export async function isHotFoodWeekLocked(date){return (await getWeekSignoff(date)).status==='signed'}
export async function managerCorrectHotFoodRecord(kind,id,changes,actor){
  const map={batch:'hotFoodBatches',check:'hotFoodChecks'};if(!map[kind])throw new Error('Unsupported correction type.');const ref=doc(db,map[kind],id),snap=await getDoc(ref);if(!snap.exists())throw new Error('Record not found.');const before=snap.data(),safe={...changes,managerCorrectedAt:serverTimestamp(),managerCorrectedByUserId:actor?.id||'',managerCorrectedByName:actor?.name||''};await setDoc(ref,safe,{merge:true});await addHotFoodAudit('manager_correction',{kind,id,before:Object.fromEntries(Object.keys(changes).map(k=>[k,before[k]??null])),after:changes},actor);return {id,...before,...changes};
}
