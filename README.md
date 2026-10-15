# Clearwater Roleplay — Live RTO v2

A multiplayer browser radio using Socket.IO for presence/signaling and WebRTC for peer-to-peer voice. Departments (LEO, TFD, EMS, DOT) have distinct server-authorized channels. Existing dashboard appearance is preserved.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and replace all four secrets with distinct random strings at least 12 characters long. **Never commit `.env`.**
4. Run `npm start` and visit `http://localhost:3000`.
5. Open another browser/device, sign in with a different callsign and the same department secret. Both must select the same channel. Allow microphone permissions and hold PTT.

## Deploy

**GitHub Pages cannot run this server.** Store the repository on GitHub, then deploy the Node.js service to a host supporting persistent WebSockets (e.g. Render, Railway, a VPS). Set all four `PASSCODE_*` environment variables on the host and enable HTTPS. Use the host's public HTTPS URL, not a github.io URL, for live voice. Do not expose department codes in frontend files.

## Architecture and limitations

- Server checks passcodes, isolates Socket.IO room signaling and presence by department+channel, and permits only one active PTT holder per channel.
- WebRTC streams are peer-to-peer, microphone tracks are muted unless PTT is granted. Panic alerts are sent to the current channel.
- Default ICE uses public STUN only. **Some users will not connect across restrictive NAT/firewalls without TURN.** Configure TURN credentials securely for reliable production voice.
- Peer-to-peer mesh is suited to small channels (roughly 2–8 users depending on bandwidth); for large radio rooms use an SFU such as LiveKit or mediasoup.
- A shared department passcode is **not individual identity verification**. For strong access control use per-user accounts, administrator approval, expiring sessions, revocation, audit logs, and rate limiting backed by Redis.
- Socket.IO signaling and audio are encrypted in transit when deployed over HTTPS/WSS; this is not a certified public-safety radio system and should only be used for roleplay.
- OBS overlay opens a separate browser window; capture it in OBS. This is not a native Roblox in-game UI.
- The server stores presence only in memory. Restart clears all connections.
- Browsers may require a click to enable audio playback.
