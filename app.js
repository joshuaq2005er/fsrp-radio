/* RTO Roleplay Radio - client-side prototype */
const departmentPasscodes = {
  "LEO": "blueunit23",
  "TFD": "flame88",
  "EMS": "medic911",
  "DOT": "route66"
};

const overlays = [
  { id: 'overlay1', name: 'RTO Banner', url: 'overlays/rto_banner.png' },
  { id: 'overlay-ticker', name: 'Dispatch Ticker', url: 'overlays/ticker.png' }
];

let current = { dept: null, unit: null, loggedIn: false, demo: false };
let mediaRecorder = null;
let audioChunks = [];
let audioVolume = 0.8;
let broadcastScope = 'department';

document.addEventListener('DOMContentLoaded', () => {
  setupUI();
  populateOverlays();
  setStatus('Offline');
  appendMessage({
    type: 'text',
    dept: 'SYS',
    unit: 'RTO',
    ts: Date.now(),
    text: 'Welcome to the radio. Login to begin.'
  });
});

function setupUI() {
  document.getElementById('btnLogin').onclick = doLogin;
  document.getElementById('btnDemo').onclick = doDemoLogin;
  document.getElementById('btn-overlays').onclick = () => togglePanel('overlayPanel', true);
  document.getElementById('btnCloseOverlay').onclick = () => togglePanel('overlayPanel', false);
  document.getElementById('btn-settings').onclick = () => togglePanel('settingsPanel', true);
  document.getElementById('btnCloseSettings').onclick = () => togglePanel('settingsPanel', false);
  document.getElementById('btnLogout').onclick = logout;
  document.getElementById('holdButton').addEventListener('mousedown', startPTT);
  document.getElementById('holdButton').addEventListener('mouseup', stopPTT);
  document.getElementById('holdButton').addEventListener('touchstart', (e)=>{ e.preventDefault(); startPTT(); });
  document.getElementById('holdButton').addEventListener('touchend', (e)=>{ e.preventDefault(); stopPTT(); });
  document.getElementById('btnSendTxt').onclick = sendText;
  document.getElementById('broadcastScope').onchange = (e) => broadcastScope = e.target.value;
  document.getElementById('volumeRange').oninput = (e) => audioVolume = parseFloat(e.target.value);
}

function togglePanel(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  show ? el.classList.remove('hidden') : el.classList.add('hidden');
}

function setStatus(text) {
  document.getElementById('status').textContent = text;
}

function populateOverlays() {
  const list = document.getElementById('overlayList');
  overlays.forEach(o => {
    const node = document.createElement('div');
    node.className = 'overlay-item';
    node.innerHTML = `
      <img src="${o.url}" alt="${o.name}" onerror="this.style.opacity=.2" />
      <div style="flex:1">${o.name}</div>
      <div><button onclick="viewOverlay('${o.url}')">View</button></div>
      <div><a href="${o.url}" download>Download</a></div>
    `;
    list.appendChild(node);
  });
}

function viewOverlay(url) {
  window.open(url, '_blank');
}

function doLogin() {
  const dept = document.getElementById('deptSelect').value;
  const unit = document.getElementById('unitInput').value.trim() || 'UNKN';
  const pass = document.getElementById('passcodeInput').value;

  if (!dept || !pass) {
    alert('Select department and enter passcode');
    return;
  }

  if (departmentPasscodes[dept] && departmentPasscodes[dept] === pass) {
    completeLogin(dept, unit, false);
  } else {
    alert('Invalid passcode for ' + dept);
  }
}

function doDemoLogin() {
  const dept = document.getElementById('deptSelect').value;
  const unit = document.getElementById('unitInput').value.trim() || 'DEMO';
  completeLogin(dept, unit, true);
}

function completeLogin(dept, unit, demo) {
  current = { dept, unit, loggedIn: true, demo };
  document.getElementById('login-card').classList.add('hidden');
  document.getElementById('radio-card').classList.remove('hidden');
  document.getElementById('badgeDept').textContent = dept;
  document.getElementById('badgeUnit').textContent = unit;
  setStatus(demo ? 'Demo mode' : 'Connected');
  appendMessage({ type: 'text', dept: 'SYS', unit: 'RTO', ts: Date.now(), text: `${dept} ${unit} has joined the channel.` });
}

function appendMessage(msg) {
  const feed = document.getElementById('message-feed');
  const node = document.createElement('div');
  node.className = 'msg';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = `${msg.dept} • ${msg.unit} • ${new Date(msg.ts).toLocaleTimeString()}`;
  node.appendChild(meta);

  if (msg.type === 'audio') {
    const label = document.createElement('div');
    label.textContent = 'Voice message';
    node.appendChild(label);
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play';
    playBtn.onclick = () => playAudioURL(msg.url);
    node.appendChild(playBtn);
  } else if (msg.type === 'text') {
    const txt = document.createElement('div');
    txt.textContent = msg.text;
    node.appendChild(txt);
  }

  feed.appendChild(node);
  feed.scrollTop = feed.scrollHeight;
}

function playAudioURL(url) {
  const audio = new Audio(url);
  audio.volume = audioVolume;
  audio.play().catch((e) => console.warn('Play failed', e));
}

async function startPTT() {
  if (!current.loggedIn) {
    alert('Login first');
    return;
  }

  document.getElementById('holdButton').textContent = 'RECORDING...';
  audioChunks = [];

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const msg = { type: 'audio', dept: current.dept, unit: current.unit, ts: Date.now(), url };
      appendMessage(msg);
      stream.getTracks().forEach(track => track.stop());
    };
    mediaRecorder.start();
  } catch (e) {
    console.error('Microphone access failed', e);
    alert('Microphone access was denied or unavailable.');
    document.getElementById('holdButton').textContent = 'HOLD TO TALK';
  }
}

function stopPTT() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  document.getElementById('holdButton').textContent = 'HOLD TO TALK';
}

function sendText() {
  if (!current.loggedIn) {
    alert('Login first');
    return;
  }

  const text = document.getElementById('txtToSend').value.trim();
  if (!text) return;

  appendMessage({ type: 'text', dept: current.dept, unit: current.unit, ts: Date.now(), text });
  document.getElementById('txtToSend').value = '';
}

function logout() {
  current = { dept: null, unit: null, loggedIn: false, demo: false };
  document.getElementById('radio-card').classList.add('hidden');
  document.getElementById('login-card').classList.remove('hidden');
  setStatus('Offline');
}
