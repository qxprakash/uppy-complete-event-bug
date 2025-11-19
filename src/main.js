import Uppy from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import XHRUpload from '@uppy/xhr-upload'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import './style.css'

const uploadEndpoint =
  import.meta.env.VITE_UPLOAD_ENDPOINT ?? 'http://localhost:4500/upload'

const app = document.querySelector('#app')

app.innerHTML = `
  <main>
    <section class="hero">
      <h1>Uppy complete event repro</h1>
      <p>Drop a file below to reproduce the issue.</p>
      <p class="endpoint">Current endpoint: ${uploadEndpoint}</p>
    </section>
    <div id="uppy" class="uppy-container" aria-live="polite"></div>
    <section class="log-panel">
      <h2>Event log</h2>
      <pre id="event-log">Waiting for uploads…</pre>
    </section>
  </main>
`

const logEl = document.querySelector('#event-log')

const appendLog = (message) => {
  const time = new Date().toLocaleTimeString()
  logEl.textContent = `[${time}] ${message}\n` + logEl.textContent
}

const uppy = new Uppy({
  autoProceed: true,
  debug: true,
})
  .use(Dashboard, {
    inline: true,
    target: '#uppy',
    hideUploadButton: true,
    hideRetryButton: true,
    hidePauseResumeButton: true,
    hideCancelButton: false,
    proudlyDisplayPoweredByUppy: false,
    disableThumbnailGenerator: true,
    showRemoveButtonAfterComplete: true,
  })
  .use(XHRUpload, {
    endpoint: uploadEndpoint,
    fieldName: 'file',
    // limit: 4,
  })

uppy.on('complete', (result) => {
  console.log('<-------- upload complete ----->')
  console.log('successful files:', result.successful)
  console.log('failed files:', result.failed)
  appendLog(
    `Complete: ${result.successful.length} successful, ${result.failed.length} failed`
  )
})

uppy.on('upload-error', (file, error) => {
  console.error('Upload error', { file, error })
  appendLog(`Error: ${file?.name ?? 'unknown file'} -> ${error}`)
})
