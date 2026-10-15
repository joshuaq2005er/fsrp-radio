* { box-sizing: border-box; }

:root {
  --bg-deep: #071a2d;
  --bg-mid: #0b2d47;
  --panel-dark: #0f1419;
  --panel-mid: #1d2328;
  --radio-dark: #21272d;
  --radio-gunmetal: #101417;
  --screen-bg: #dfeaf4;
  --screen-ink: #1f2c3a;
  --blue: #4ea1ff;
  --blue-deep: #2b7edb;
  --warning: #ff4d4d;
  --muted: #a9b6c2;
  --white: #edf8ff;
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  background: linear-gradient(180deg, #051728 0%, #0a2339 100%);
}

body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: var(--white);
}

.page-shell {
  width: 100%;
  max-width: 820px;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-header {
  align-self: flex-start;
  margin-left: 120px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: var(--white);
  opacity: 0.9;
}

.brand-badge {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.15);
  font-weight: 900;
}

.radio-wrap {
  position: relative;
  width: 320px;
  margin-top: 8px;
}

.antenna {
  position: absolute;
  top: -26px;
  right: 85px;
  width: 6px;
  height: 34px;
  border-radius: 6px;
  background: linear-gradient(180deg, #101417, #242d33);
  box-shadow: 0 0 0 2px rgba(0,0,0,0.25);
}

.antenna::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -7px;
  width: 18px;
  height: 18px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: linear-gradient(180deg, #1c2128, #0c161d);
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.15);
}

.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 0 10px 8px;
}

.dial-group {
  display: flex;
  gap: 12px;
}

.dial {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 35% 35%, #2b3034, #11171a 60%);
  border: 2px solid rgba(255,255,255,0.04);
  box-shadow: inset 0 2px 10px rgba(255,255,255,0.08), inset 0 -8px 10px rgba(0,0,0,0.54);
}

.dial span {
  font-size: 11px;
  color: var(--muted);
  font-weight: 700;
}

.panic-btn {
  border: none;
  border-radius: 8px;
  background: linear-gradient(180deg, #1c2a32, #0d1418);
  color: var(--white);
  font-size: 11px;
  font-weight: 700;
  padding: 9px 10px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);
}

.radio-body {
  background: linear-gradient(180deg, #1f252b, #0a0d12 62%);
  border-radius: 26px 26px 20px 20px;
  border: 3px solid rgba(0,0,0,0.45);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.03), 0 8px 50px rgba(0,0,0,0.7);
  padding: 14px 16px 18px;
}

.radio-screen {
  background: linear-gradient(180deg, #c7d6df, #dfeaf3);
  border-radius: 8px;
  border: 2px solid rgba(0,0,0,0.35);
  padding: 0 0 10px;
  overflow: hidden;
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px 4px;
  color: #0d1f2d;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: 700;
}

.screen-display {
  height: 160px;
  background: rgba(255,255,255,0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--screen-ink);
  padding: 16px 12px;
}

.screen-top {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.screen-message {
  font-size: 13px;
  letter-spacing: 1px;
  color: #2d3c4a;
}

.screen-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  margin-top: 0;
}

.screen-btn {
  border: 0;
  background: linear-gradient(180deg, #4ca2f6, #2e7ad5);
  color: #f5fbff;
  font-weight: 800;
  letter-spacing: 1px;
  font-size: 12px;
  padding: 11px 0;
  cursor: pointer;
}

.screen-btn + .screen-btn {
  border-left: 1px solid rgba(0,0,0,0.2);
}

.status-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 11px;
  margin: 12px 0 8px;
  padding: 0 4px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--warning);
  box-shadow: 0 0 8px rgba(255,77,77,0.7);
}

.keypad-wrap {
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.04));
  border-radius: 12px;
  padding: 16px 10px 10px;
}

.left-pad {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.mini-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(180deg, #2d3136, #151b1f);
  color: var(--white);
  font-size: 18px;
  box-shadow: inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -4px 8px rgba(0,0,0,0.5);
}

.nav-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.nav-middle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.nav-arrow {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #30363b, #171a1f);
  color: var(--white);
  font-size: 18px;
  cursor: pointer;
}

.confirm-btn {
  width: 58px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #f3fcff, #d2ebff 50%, #c0dffb 100%);
  color: #102433;
  font-weight: 900;
  font-size: 14px;
}

.num-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 10px;
}

.num-btn {
  width: 100%;
  background: linear-gradient(180deg, #2a2d30, #121619);
  color: var(--white);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 12px 6px;
  min-height: 56px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.num-btn small {
  display: block;
  margin-top: 4px;
  font-size: 9px;
  color: var(--muted);
}

.num-btn.special {
  background: linear-gradient(180deg, #303538, #121719);
}

.num-btn.zero {
  font-size: 20px;
}

.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  gap: 12px;
}

.quit-btn {
  border: none;
  background: linear-gradient(180deg, #d33f3a, #ab2422);
  color: white;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: 900;
  letter-spacing: 1px;
  min-width: 96px;
}

.tx-rx {
  display: flex;
  gap: 10px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}

.login-panel {
  width: min(100%, 460px);
  background: rgba(13, 25, 35, 0.8);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 16px;
  border-radius: 14px;
  margin-top: 22px;
  display: grid;
  gap: 12px;
}

.login-panel label {
  display: grid;
  gap: 6px;
  color: #dfeaf9;
  font-size: 13px;
}

.login-panel select,
.login-panel input {
  width: 100%;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: var(--white);
  padding: 10px 12px;
}

.login-buttons {
  display: flex;
  gap: 10px;
}

.primary-btn, .secondary-btn {
  flex: 1;
  border-radius: 8px;
  padding: 10px 12px;
  border: none;
  font-weight: 800;
  cursor: pointer;
}

.primary-btn {
  background: linear-gradient(180deg, var(--blue), var(--blue-deep));
  color: #061b2f;
}

.secondary-btn {
  background: rgba(255,255,255,0.06);
  color: var(--white);
  border: 1px solid rgba(255,255,255,0.08);
}

.hold-talk {
  margin-top: 22px;
  width: min(100%, 620px);
  background: linear-gradient(180deg, #5bafff, #3a86d9);
  border: none;
  border-radius: 14px;
  color: #062637;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 1px;
  padding: 18px 20px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(58,134,217,0.35);
}

.hold-talk.recording {
  background: linear-gradient(180deg, #f46868, #d63a3a);
  color: white;
}

.hidden {
  display: none !important;
}

.dropdown-panel {
  position: fixed;
  top: 130px;
  right: 30px;
  width: 220px;
  background: rgba(9, 20, 30, 0.96);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 18px 28px rgba(0,0,0,0.28);
}

.dropdown-panel h4 {
  margin: 0 0 8px;
}

.dropdown-panel ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
  color: var(--white);
}

.dropdown-panel li {
  padding: 8px 6px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 14px;
}

.msg-list {
  display: grid;
  gap: 8px;
  max-height: 220px;
  overflow: auto;
  color: var(--white);
  font-size: 12px;
}

.msg-item {
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  padding: 8px;
}

@media (max-width: 640px) {
  .brand-header {
    margin-left: 28px;
  }

  .radio-wrap {
    transform: scale(0.92);
  }

  .hold-talk {
    width: min(100%, 500px);
    font-size: 20px;
  }
}
