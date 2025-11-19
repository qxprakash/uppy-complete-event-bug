import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadsDir = path.resolve(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now()
    const safeName = file.originalname.replace(/[^\w.\-]+/g, '_')
    cb(null, `${timestamp}_${safeName}`)
  },
})

const upload = multer({ storage })

export function createUploadApp() {
  const app = express()

  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'X-Requested-With'],
    })
  )

  app.get('/health', (_req, res) => {
    res.json({ ok: true, uploadsDir })
  })

  app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      res.status(400).json({ ok: false, message: 'Missing "file" field' })
      return
    }

    res.json({
      ok: true,
      file: {
        originalName: req.file.originalname,
        savedAs: path.basename(req.file.path),
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      timestamp: Date.now(),
    })
  })

  app.use((err, _req, res, _next) => {
    console.error('[upload-server] error', err)
    res.status(500).json({ ok: false, message: 'Upload server error' })
  })

  return app
}

export function startUploadServer(port = process.env.UPLOAD_PORT ?? 4500) {
  const app = createUploadApp()
  const server = app.listen(port, () => {
    console.log(`Uppy upload server listening on http://localhost:${port}`)
  })
  return server
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = startUploadServer()
  if (process.argv.includes('--test')) {
    server.close(() => process.exit(0))
  }
}
