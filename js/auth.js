import {db,collection,getDocs,query,where} from './firebase.js';

export async function loginWithPin(pin){
  const clean=String(pin||'').trim();
  if(!/^\d{4,8}$/.test(clean)) throw new Error('Enter a valid PIN using 4 to 8 digits.');
  const q=query(collection(db,'users'),where('pin','==',clean),where('active','==',true));
  const snap=await getDocs(q);
  if(snap.empty) throw new Error('PIN not recognised. Please check it and try again.');
  const matches=snap.docs.map(d=>({id:d.id,...d.data()}));
  if(matches.length>1) throw new Error('This PIN is assigned to more than one user. Ask the manager to correct it.');
  const user=matches[0];
  if(!['staff','manager'].includes(user.role)) throw new Error('This user does not have a valid app role.');
  if(user.role==='staff'&&!user.staffId) throw new Error('This staff account has no Staff ID. Ask the manager to update it.');
  return user;
}

export function saveSession(user){sessionStorage.setItem('ntUser',JSON.stringify(user));}
export function getSession(){try{return JSON.parse(sessionStorage.getItem('ntUser')||'null')}catch{return null}}
export function clearSession(){sessionStorage.removeItem('ntUser')}
