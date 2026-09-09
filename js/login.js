import {loginWithPin,saveSession} from './auth.js';
import {setButtonLoading,setFieldError,clearFieldError,setInlineMessage,initNetworkStatus,registerAppServiceWorker} from './ui.js';

const pin=document.querySelector('#pin');
const button=document.querySelector('#login');
const message=document.querySelector('#loginMessage');

pin.addEventListener('input',()=>{
  pin.value=pin.value.replace(/\D/g,'').slice(0,8);
  clearFieldError(pin);
  setInlineMessage(message,'');
});

async function login(){
  const value=pin.value.trim();
  clearFieldError(pin);
  setInlineMessage(message,'');
  if(!/^\d{4,8}$/.test(value)){
    setFieldError(pin,'Enter a PIN using 4 to 8 digits.');
    pin.focus();
    return;
  }

  setButtonLoading(button,true,'Checking…');
  try{
    const user=await loginWithPin(value);
    saveSession(user);
    button.innerHTML='✓ Access granted';
    button.classList.add('success');
    setTimeout(()=>{location.href=user.role==='manager'?'manager.html':'staff.html';},220);
  }catch(error){
    setButtonLoading(button,false);
    setInlineMessage(message,error.message||'Login failed. Please try again.','error');
    pin.select();
  }
}

button.addEventListener('click',login);
pin.addEventListener('keydown',e=>{if(e.key==='Enter') login();});
setTimeout(()=>pin.focus(),120);
initNetworkStatus();
registerAppServiceWorker();
