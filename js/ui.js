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

export function confirmAction({title='Confirm action', message='', details='', confirmText='Confirm', danger=false}={}) {
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
    const finish = value => {
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

export function registerAppServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('./service-worker.js').then(reg => {
    reg.update().catch(() => {});
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          showToast('A newer version of the app is ready.', 'info', {
            title:'Update available',
            actionLabel:'Update now',
            duration:0,
            onAction: () => {
              worker.postMessage({type:'SKIP_WAITING'});
              let reloading = false;
              navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!reloading) { reloading = true; location.reload(); }
              });
            }
          });
        }
      });
    });
  }).catch(() => {});
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
        <input id="pinActionInput" class="pin-action-input" type="password" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="••••">
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
