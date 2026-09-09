import {db,collection,getDocs,query,where} from "./firebase.js";
export async function loginWithPin(pin){const q=query(collection(db,"users"),where("pin","==",String(pin)),where("active","==",true));const s=await getDocs(q);if(s.empty)throw new Error("Invalid PIN");const a=s.docs.map(d=>({id:d.id,...d.data()}));if(a.length>1)throw new Error("Duplicate PIN found");return a[0];}
export const saveSession=u=>sessionStorage.setItem("ntUser",JSON.stringify(u));
export function getSession(){try{return JSON.parse(sessionStorage.getItem("ntUser")||"null")}catch{return null}}
export const clearSession=()=>sessionStorage.removeItem("ntUser");
