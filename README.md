# Uppy complete event repro

Minimal Vanilla Vite + Uppy dashboard project used to reproduce an issue with the `complete` event firing.

## Stack

- Vite 7 (vanilla JS template)
- @uppy/core + Dashboard + XHRUpload

## Getting started

```bash
npm install
npm run server        # starts the Express upload endpoint on port 4500
npm run dev           # launch Vite once the server is running
```

Visit `http://localhost:5173` and drop any file inside the inline Dashboard. Uploads POST to the Express server exposed at `http://localhost:4500/upload`, which streams files onto disk inside the local `uploads/` directory before returning JSON metadata. Use the on-page log or open the browser console to inspect the `complete` event payloads.

Need to hit a different backend? Override the endpoint via `VITE_UPLOAD_ENDPOINT`:

```bash
VITE_UPLOAD_ENDPOINT=https://api.example.com/uploads npm run dev
```

## Building for repro attachments

```bash
npm run build
npm run preview
```

Use the preview server when you need a static reproduction build to share.
