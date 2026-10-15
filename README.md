const PASSCODES = {
  LEO: 'blueunit23',
  TFD: 'flame88',
  EMS: 'medic911',
  DOT: 'route66'
};

const state = {
  loggedIn: false,
  dept: null,
  unit: null,
  isRecording: false,
  recorder: null,
  stream: null,
  chunks: []
};

const statusText = document.getElementById('statusText');
const screenTop = document.getElementById('screenTop');
const screenMessage = document.getElementById('screenMessage');
const loginPanel = document.getElementById('loginPanel');
const menuBtn = document.getElementById('menuBtn');
const msgsBtn = document.getElementById('msgsBtn');
const menuPanel = document.getElementById('menuPanel');
const msgsPanel = document.getElementById('msgsPanel');
const msgList = document.getElementById('msgList');
const talkBtn = document.getElementById('talkBtn');
const deptLabel = document.getElementById('deptLabel');

function updateStatus(text) {
  if (statusText) statusText.textContent = text;
}

function addMessage(text, style = 'normal') {
  const item = document.createElement('div');
  item.className = 'msg-item';
  item.textContent = text;
  if (style === 'system') item.style.opacity = '0.7';
  if (msgList) msgList.prepend(item);
}

function setScreen(title, message) {
  if (screenTop) screenTop.textContent = title;
  if (screenMessage) screenMessage.textContent = message;
}

function validateLogin() {
  const dept = document.getElementById('deptSelect').value;
  const unit = document.getElementById('unitInput').value.trim();
  const code = document.getElementById('passcodeInput').value.trim();

  if (!unit) {
    alert('Please enter a unit ID.');
    return null;
  }

  if (!code) {
    alert('Please enter your department passcode.');
    return null;
  }

  if (PASSCODES[dept] && PASSCODES[dept] === code) {
    return { dept, unit };
  }

  alert('Incorrect passcode for ' + dept);
  return null;
}

document.getElementById('loginBtn').addEventListener('click', () => {
  const user = validateLogin();
  if (!user) return;

  state.loggedIn = true;
  state.dept = user.dept;
  state.unit = user.unit;

  deptLabel.textContent = user.dept;
  setScreen(user.dept, `${user.unit} online`);
  updateStatus('Connected');
  loginPanel.classList.add('hidden');
  addMessage(`${user.dept} ${user.unit} logged in`, 'system');
});

document.getElementById('demoBtn').addEventListener('click', () => {
  state.loggedIn = true;
  state.dept = document.getElementById('deptSelect').value;
  state.unit = (document.getElementById('unitInput').value || 'DEMO').trim() || 'DEMO';
  deptLabel.textContent = state.dept;
  setScreen(state.dept, `${state.unit} online`);
  updateStatus('Demo mode');
  loginPanel.classList.add('hidden');
  addMessage(`${state.dept} ${state.unit} joined demo`, 'system');
});

function startRecording() {
  if (!state.loggedIn) {
    alert('Please login first.');
    return;
  }

  if (state.isRecording) return;

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      state.stream = stream;
      state.recorder = new MediaRecorder(stream);
      state.chunks = [];

      state.recorder.ondataavailable = (e) => {
        if (e.data.size > 0) state.chunks.push(e.data);
      };

      state.recorder.onstop = () => {
        const blob = new Blob(state.chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        addMessage(`${state.dept} ${state.unit}: voice message received`);
        const playBtn = document.createElement('button');
        playBtn.textContent = 'Play';
        playBtn.style.marginTop = '6px';
        playBtn.onclick = () => {
          const audio = new Audio(url);
          audio.play().catch(() => {});
        };
        const last = msgList.lastElementChild;
        if (last) last.appendChild(playBtn);

        if (state.stream) {
          state.stream.getTracks().forEach((track) => track.stop());
          state.stream = null;
        }
      };

      state.recorder.start();
      state.isRecording = true;
      talkBtn.classList.add('recording');
      talkBtn.textContent = 'RECORDING...';
      setScreen(state.dept, 'Transmitting');
      updateStatus('Recording');
    })
    .catch(() => {
      alert('Microphone access was denied or unavailable.');
    });
}

function stopRecording() {
  if (!state.isRecording || !state.recorder) return;
  state.recorder.stop();
  state.isRecording = false;
  talkBtn.classList.remove('recording');
  talkBtn.textContent = 'HOLD TO TALK';
  setScreen(state.dept, `${state.unit} online`);
  updateStatus('Connected');
}

talkBtn.addEventListener('mousedown', startRecording);
talkBtn.addEventListener('mouseup', stopRecording);
talkBtn.addEventListener('mouseleave', stopRecording);
talkBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startRecording();
});
talkBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  stopRecording();
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !state.isRecording) {
    e.preventDefault();
    startRecording();
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && state.isRecording) {
    e.preventDefault();
    stopRecording();
  }
});

menuBtn.addEventListener('click', () => {
  menuPanel.classList.toggle('hidden');
  msgsPanel.classList.add('hidden');
});

msgsBtn.addEventListener('click', () => {
  msgsPanel.classList.toggle('hidden');
  menuPanel.classList.add('hidden');
});

document.addEventListener('click', (event) => {
  if (!menuPanel.contains(event.target) && !menuBtn.contains(event.target)) {
    menuPanel.classList.add('hidden');
  }
  if (!msgsPanel.contains(event.target) && !msgsBtn.contains(event.target)) {
    msgsPanel.classList.add('hidden');
  }
});

window.addEventListener('beforeunload', () => {
  if (state.stream) {
    state.stream.getTracks().forEach((track) => track.stop());
  }
});

setScreen('CLEARWATER', 'Select your department');
updateStatus('Offline');
addMessage('System ready', 'system');

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  updateStatus('Mic unavailable');
}

