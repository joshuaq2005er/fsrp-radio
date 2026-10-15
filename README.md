# fsrp-radio

This repository contains a polished roleplay RTO radio UI with:
- Department login: LEO, TFD, EMS, DOT
- Unit ID + passcode entry
- Demo audio PTT for local browser use
- Text message feed
- Overlay panel for Roblox/streaming overlays
- GitHub Pages friendly static site

## Files
- `index.html` — main page structure
- `styles.css` — dark radio UI styling
- `app.js` — login, PTT, text, overlay logic

## Local preview
Open `index.html` in a browser, or run a local static web server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy to GitHub Pages
1. Push this repo to GitHub.
2. Go to Settings → Pages.
3. Select the default branch and root folder.
4. Save and wait for the Pages deployment.

## Notes
- The passcodes are demo-only and are stored in the browser-side JavaScript.
- The site is intentionally built as a static front-end prototype, easy to expand with Firebase or a backend.
