const TYPE_ICON = {
  success: '✓',
  error: '!',
  warning: '!',
  info: 'i'
};

export function escapeHtml(value='') {
  return String(value)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

export function statusView(status='upcoming') {
  const map = {
    completed: {icon:'✓', label:'Completed'},
    overdue: {icon:'!', label:'Overdue'},
    due: {icon:'●', label:'Due now'},
    upcoming: {icon:'○', label:'Upcoming'},
    missed: {icon:'!', label:'Missed'},
    cancelled: {icon:'×', label:'Cancelled'},
    planned: {icon:'○', label:'Planned'}
  };
  const item = map[status] || map.upcoming;
  return `<span class="badge ${escapeHtml(status)}"><span aria-hidden="true">${item.icon}</span>${item.label}</span>`;
}

export function setButtonLoading(button, loading, loadingText='Saving…') {
  if (!button) return;
  if (loading) {
    if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
    button.disabled = true;
    button.classList.add('is-loading');
    button.innerHTML = `<span class="spinner" aria-hidden="true"></span>${escapeHtml(loadingText)}`;
  } else {
    button.disabled = false;
    button.classList.remove('is-loading');
    if (button.dataset.originalHtml) {
      button.innerHTML = button.dataset.originalHtml;
      delete button.dataset.originalHtml;
    }
  }
}

// Prevent the same button or cell from starting overlapping async saves/reviews.
// The lock starts before validation and remains until the last awaited refresh.
const runningActions = new WeakSet();
export async function runActionOnce(element, action, loadingText='Working…') {
  if (!element || runningActions.has(element)) return;
  runningActions.add(element);
  const wasDisabled = Boolean(element.disabled);
  const previousBusy = element.getAttribute('aria-busy');
  if (!wasDisabled) element.disabled = true;
  element.setAttribute('aria-busy', 'true');
  try { return await action(); }
  finally {
    runningActions.delete(element);
    if (element.isConnected) {
      element.disabled = wasDisabled;
      if (previousBusy === null) element.removeAttribute('aria-busy');
      else element.setAttribute('aria-busy', previousBusy);
    }
  }
}

// Wrap a bound onclick handler without changing its validation, database calls or
// success/error messages. Useful for existing Manager and module save buttons.
export function protectClickHandler(button) {
  if (!button || typeof button.onclick !== 'function' || button.dataset.singleFlightProtected === 'true') return;
  const original = button.onclick;
  button.dataset.singleFlightProtected = 'true';
  button.onclick = function(event) {
    return runActionOnce(button, () => original.call(this, event));
  };
}

export function setInlineMessage(element, message='', type='info') {
  if (!element) return;
  element.className = `inline-message ${type}`;
  element.textContent = message;
  element.hidden = !message;
}

export function setFieldError(input, message='') {
  if (!input) return;
  const field = input.closest('.field') || input.parentElement;
  const error = field?.querySelector('.field-error');
  input.classList.toggle('invalid', Boolean(message));
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) {
    error.textContent = message;
    error.hidden = !message;
  }
}

export function clearFieldError(input) {
  setFieldError(input, '');
}

function toastRoot() {
  let root = document.getElementById('toastRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toastRoot';
    root.className = 'toast-root';
    root.setAttribute('aria-live','polite');
    root.setAttribute('aria-atomic','true');
    document.body.appendChild(root);
  }
  return root;
}

export function showToast(message, type='success', options={}) {
  const root = toastRoot();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  icon.textContent = TYPE_ICON[type] || TYPE_ICON.info;

  const body = document.createElement('div');
  body.className = 'toast-body';
  const title = document.createElement('strong');
  title.textContent = options.title || (type === 'success' ? 'Saved' : type === 'error' ? 'Something went wrong' : type === 'warning' ? 'Attention' : 'Update');
  const text = document.createElement('span');
  text.textContent = message;
  body.append(title, text);

  toast.append(icon, body);

  if (options.actionLabel && typeof options.onAction === 'function') {
    const action = document.createElement('button');
    action.className = 'toast-action';
    action.type = 'button';
    action.textContent = options.actionLabel;
    action.addEventListener('click', async () => {
      try { await options.onAction(); } finally { toast.remove(); }
    });
    toast.append(action);
  }

  const close = document.createElement('button');
  close.className = 'toast-close';
  close.type = 'button';
  close.setAttribute('aria-label','Dismiss notification');
  close.textContent = '×';
  close.addEventListener('click', () => toast.remove());
  toast.append(close);

  root.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const duration = options.duration ?? 4500;
  if (duration > 0) {
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 220);
    }, duration);
  }
  return toast;
}

function ensureConfirmModal() {
  let overlay = document.getElementById('confirmOverlay');
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = 'confirmOverlay';
  overlay.className = 'modal-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
      <div class="modal-icon" aria-hidden="true">?</div>
      <h2 id="confirmTitle">Confirm action</h2>
      <p id="confirmMessage" class="modal-message"></p>
      <div id="confirmDetails" class="modal-details" hidden></div>
      <div class="modal-actions">
        <button id="confirmCancel" class="btn secondary" type="button">Cancel</button>
        <button id="confirmOk" class="btn" type="button">Confirm</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  return overlay;
}

// A single shared overlay must never have multiple unresolved confirmation promises.
// Without this guard each tap adds another OK listener, causing repeated saves.
let confirmationPending = false;
export function confirmAction({title='Confirm action', message='', details='', confirmText='Confirm', danger=false}={}) {
  if (confirmationPending) return Promise.resolve(false);
  confirmationPending = true;
  const overlay = ensureConfirmModal();
  const titleEl = overlay.querySelector('#confirmTitle');
  const messageEl = overlay.querySelector('#confirmMessage');
  const detailsEl = overlay.querySelector('#confirmDetails');
  const ok = overlay.querySelector('#confirmOk');
  const cancel = overlay.querySelector('#confirmCancel');

  titleEl.textContent = title;
  messageEl.textContent = message;
  detailsEl.textContent = details;
  detailsEl.hidden = !details;
  ok.textContent = confirmText;
  ok.className = danger ? 'btn danger' : 'btn';
  overlay.hidden = false;
  document.body.classList.add('modal-open');

  return new Promise(resolve => {
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      confirmationPending = false;
      overlay.hidden = true;
      document.body.classList.remove('modal-open');
      ok.removeEventListener('click', onOk);
      cancel.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlay);
      document.removeEventListener('keydown', onKey);
      resolve(value);
    };
    const onOk = () => finish(true);
    const onCancel = () => finish(false);
    const onOverlay = e => { if (e.target === overlay) finish(false); };
    const onKey = e => { if (e.key === 'Escape') finish(false); };
    ok.addEventListener('click', onOk);
    cancel.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
    document.addEventListener('keydown', onKey);
    setTimeout(() => cancel.focus(), 0);
  });
}

export function initNetworkStatus() {
  const pill = document.getElementById('connectionStatus');
  if (!pill) return;
  let first = true;
  const update = () => {
    const online = navigator.onLine;
    pill.className = `connection-pill ${online ? 'online' : 'offline'}`;
    pill.innerHTML = `<span class="connection-dot" aria-hidden="true"></span>${online ? 'Live' : 'Offline'}`;
    pill.setAttribute('title', online ? 'Connected to the internet' : 'No internet connection');
    if (!first) {
      showToast(
        online ? 'Connection restored. Live updates are available again.' : 'You are offline. Some changes may not save until the connection returns.',
        online ? 'success' : 'warning',
        {title: online ? 'Back online' : 'Offline'}
      );
    }
    first = false;
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

export function formatTimestamp(value) {
  if (!value) return '';
  let d;
  if (typeof value?.toDate === 'function') d = value.toDate();
  else d = value instanceof Date ? value : new Date(value);
  if (!d || Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

export function tableSkeleton(cols=5, rows=5) {
  return Array.from({length: rows}, () => `<tr class="skeleton-row">${Array.from({length:cols}, () => '<td><span class="skeleton-line"></span></td>').join('')}</tr>`).join('');
}

// PWA update coordination. An installed update can activate before the user
// presses Apply, so listening only for controllerchange can strand the dialog.
let ntUpdateDialogVisible=false;
let ntUpdateReloading=false;
let ntUpdateInProgress=false;
function showAppUpdateDialog(worker,registration){
  if(ntUpdateDialogVisible||ntUpdateReloading||!worker) return;
  // Only an actually waiting update should block the current screen.
  if(worker.state==='activated'||worker.state==='redundant') return;
  ntUpdateDialogVisible=true;
  const overlay=document.createElement('div');
  overlay.id='ntUpdateOverlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','New app version available');
  overlay.innerHTML=`<div class="nt-update-panel"><div class="nt-update-symbol">↻</div><h2>New app update available</h2><p>A new version of North Terrace Daily Task is ready. Update now to continue using the latest version.</p><p class="nt-update-note">Your saved tasks and Firebase records will not be deleted.</p><button type="button" id="ntUpdateApply">Update &amp; Reload</button><button type="button" id="ntUpdateLater">Continue for now</button><p id="ntUpdateStatus" aria-live="polite"></p></div>`;
  document.body.appendChild(overlay);
  const button=overlay.querySelector('#ntUpdateApply');
  const later=overlay.querySelector('#ntUpdateLater');
  const status=overlay.querySelector('#ntUpdateStatus');
  let fallbackTimer=null;
  let closed=false;
  function finishUpdate(){
    if(closed||ntUpdateReloading||!ntUpdateInProgress) return;
    ntUpdateReloading=true;
    if(fallbackTimer)clearTimeout(fallbackTimer);
    status.textContent='Update installed. Reloading…';
    location.reload();
  }
  function activated(){
    return worker.state==='activated';
  }
  function dismiss(){
    if(closed||ntUpdateReloading)return;
    closed=true;
    if(fallbackTimer)clearTimeout(fallbackTimer);
    navigator.serviceWorker.removeEventListener('controllerchange',onControllerChange);
    worker.removeEventListener('statechange',onWorkerStateChange);
    ntUpdateInProgress=false;
    ntUpdateDialogVisible=false;
    overlay.remove();
  }
  function onControllerChange(){
    if(closed)return;
    if(ntUpdateInProgress)finishUpdate();
    else if(activated())dismiss();
  }
  function onWorkerStateChange(){
    if(closed)return;
    if(ntUpdateInProgress&&activated())finishUpdate();
    else if(activated())dismiss();
  }
  later.addEventListener('click',dismiss);
  // Attach listeners before sending SKIP_WAITING, then check state again.
  navigator.serviceWorker.addEventListener('controllerchange',onControllerChange);
  worker.addEventListener('statechange',onWorkerStateChange);
  button.addEventListener('click',()=>{
    if(ntUpdateInProgress||ntUpdateReloading)return;
    ntUpdateInProgress=true;
    button.disabled=true;
    button.textContent='Updating…';
    status.textContent='Applying the latest version…';
    // The worker may have activated between opening the dialog and this tap.
    if(activated()){finishUpdate();return;}
    if(worker.state==='redundant'){
      ntUpdateInProgress=false;
      button.disabled=false;
      button.textContent='Retry update';
      status.textContent='The update was replaced. Please retry or refresh this page.';
      return;
    }
    try{worker.postMessage({type:'SKIP_WAITING'});}
    catch(err){
      ntUpdateInProgress=false;
      button.disabled=false;
      button.textContent='Retry update';
      status.textContent='The browser could not apply this update. Please try again.';
      return;
    }
    // Covers browsers that do not emit controllerchange after activation.
    fallbackTimer=setTimeout(()=>{
      if(ntUpdateReloading)return;
      if(activated()){finishUpdate();return;}
      ntUpdateInProgress=false;
      button.disabled=false;
      button.textContent='Retry update';
      status.textContent='Update is taking longer than expected. Try again, or continue using the current screen.';
    },12000);
  });
  // Avoid leaving a stale modal if another tab activates the update.
  if(activated())dismiss();
}
export function registerAppServiceWorker(){
  if(!('serviceWorker' in navigator))return;
  navigator.serviceWorker.register('/NorthTerraceDailyTask/service-worker.js',{scope:'/NorthTerraceDailyTask/'}).then(reg=>{
    const check=()=>reg.update().catch(()=>{});
    check();
    if(reg.waiting&&navigator.serviceWorker.controller)showAppUpdateDialog(reg.waiting,reg);
    reg.addEventListener('updatefound',()=>{
      const worker=reg.installing;
      if(!worker)return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&navigator.serviceWorker.controller&&reg.waiting===worker)showAppUpdateDialog(worker,reg);
      });
    });
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
    window.addEventListener('focus',check);
  }).catch(()=>{});
}

export function promptPin({title='Complete task',message='Enter your 4-digit staff PIN.'}={}){
  let overlay=document.getElementById('pinOverlay');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='pinOverlay';
    overlay.className='modal-overlay';
    overlay.hidden=true;
    overlay.innerHTML=`
      <div class="modal pin-modal" role="dialog" aria-modal="true" aria-labelledby="pinTitle">
        <div class="modal-icon" aria-hidden="true">#</div>
        <h2 id="pinTitle"></h2>
        <p id="pinMessage" class="modal-message"></p>
        <input id="pinActionInput" class="pin-action-input" type="text" inputmode="numeric" maxlength="8" autocomplete="one-time-code" data-pin-input="true" placeholder="••••">
        <div id="pinActionError" class="field-error" hidden></div>
        <div class="modal-actions">
          <button id="pinCancel" class="btn secondary" type="button">Cancel</button>
          <button id="pinOk" class="btn" type="button">Continue</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  const input=overlay.querySelector('#pinActionInput');
  const error=overlay.querySelector('#pinActionError');
  overlay.querySelector('#pinTitle').textContent=title;
  overlay.querySelector('#pinMessage').textContent=message;
  input.value=''; error.hidden=true; error.textContent='';
  overlay.hidden=false; document.body.classList.add('modal-open');

  return new Promise(resolve=>{
    const ok=overlay.querySelector('#pinOk'), cancel=overlay.querySelector('#pinCancel');
    const finish=v=>{
      overlay.hidden=true; document.body.classList.remove('modal-open');
      ok.removeEventListener('click',onOk); cancel.removeEventListener('click',onCancel);
      input.removeEventListener('keydown',onKey); overlay.removeEventListener('click',onOverlay);
      resolve(v);
    };
    const onOk=()=>{
      const pin=input.value.trim();
      if(!pin){error.textContent='Enter a PIN.';error.hidden=false;return;}
      finish(pin);
    };
    const onCancel=()=>finish('');
    const onKey=e=>{if(e.key==='Enter')onOk();if(e.key==='Escape')onCancel();};
    const onOverlay=e=>{if(e.target===overlay)onCancel();};
    ok.addEventListener('click',onOk); cancel.addEventListener('click',onCancel);
    input.addEventListener('keydown',onKey); overlay.addEventListener('click',onOverlay);
    setTimeout(()=>input.focus(),0);
  });
}
