import {db,doc,setDoc} from "./firebase.js";
const tasks=[
["t1","Sweep floor / tidy coffee machine","08:00-08:45","AM",{Mon:"3",Tue:"3",Wed:"4",Thu:"1",Fri:"3",Sat:"3",Sun:"2"},false],
["t2","Check out of date: sandwich chiller, eggs, bread","08:00-08:45","AM",{Mon:"3",Tue:"3",Wed:"4",Thu:"1",Fri:"3",Sat:"3",Sun:"2"},false],
["t3","Fill drinks, beers & wine chiller","09:30-12:30","AM",{Mon:"1",Tue:"3",Wed:"1",Thu:"1",Fri:"1",Sat:"1",Sun:"4"},false],
["t4","Face-up entire shop","12:30-13:00","AM",{Mon:"1",Tue:"3",Wed:"1",Thu:"1",Fri:"3",Sat:"3",Sun:"4"},true],
["t5","Office paperwork","13:30-14:30","PM",{Mon:"3",Tue:"3",Wed:"4",Thu:"3",Fri:"3",Sat:"3",Sun:"2"},false],
["t6","Hot food unit cleaning / oven check","14:30-15:00","PM",{Mon:"3",Tue:"3",Wed:"4",Thu:"1",Fri:"3",Sat:"3",Sun:"2"},false],
["t7","Fill crisps from back stock","15:00-19:00","PM",{Mon:"1",Tue:"3",Wed:"1",Thu:"1",Fri:"1",Sat:"1",Sun:"4"},false],
["t8","Forecourt / pump cleaning","15:00-19:00","PM",{Mon:"1",Tue:"7",Wed:"1",Thu:"1",Fri:"1",Sat:"1",Sun:"4"},true],
["t9","Toilet cleaning","15 min","PM",{Mon:"3",Tue:"7",Wed:"1",Thu:"5",Fri:"6",Sat:"4",Sun:"2"},true],
["t10","Final shop face-up","After 20:00","PM",{Mon:"1",Tue:"3",Wed:"1",Thu:"1",Fri:"3",Sat:"3",Sun:"4"},true]];
export async function seedStarterTemplate(){for(const [id,taskName,time,shift,assignments,photoRequired] of tasks){await setDoc(doc(db,"weeklyTemplates",id),{taskName,time,shift,assignments,photoRequired},{merge:true})}}
