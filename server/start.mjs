import { createReadStream, existsSync, readFileSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, sep } from "node:path"
import { handleEnquiry } from "./enquiry.mjs"

function loadEnvFile() {
  const file = join(process.cwd(), ".env")
  if (!existsSync(file)) return
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const index = trimmed.indexOf("=")
    if (index < 0) continue
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

loadEnvFile()

const root = join(process.cwd(), "dist")
const port = Number(process.env.PORT || 4173)

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
}

function headers() {
  return {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on("data", (chunk) => {
      size += chunk.length
      if (size > 100_000) {
        reject(Object.assign(new Error("too large"), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

function send(res, status, body, extra = {}) {
  res.writeHead(status, { ...headers(), ...extra })
  res.end(body)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`)

  if (url.pathname === "/api/enquiry") {
    if (req.method !== "POST") {
      send(res, 405, JSON.stringify({ ok: false, message: "Method not allowed." }), {
        "Content-Type": "application/json; charset=utf-8",
        Allow: "POST",
      })
      return
    }
    try {
      const raw = await readBody(req)
      const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local").split(",")[0].trim()
      const result = await handleEnquiry(raw, process.env, { ip })
      send(res, result.status, JSON.stringify(result.body), {
        "Content-Type": "application/json; charset=utf-8",
      })
    } catch (error) {
      const status = error.status || 400
      send(res, status, JSON.stringify({ ok: false, message: "The enquiry could not be read." }), {
        "Content-Type": "application/json; charset=utf-8",
      })
    }
    return
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed.")
    return
  }

  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "")
  let filePath = join(root, relative)
  const rootPrefix = root.endsWith(sep) ? root : root + sep
  if (filePath !== root && !filePath.startsWith(rootPrefix)) {
    send(res, 400, "Bad request.")
    return
  }

  let isFile = false
  try {
    isFile = statSync(filePath).isFile()
  } catch {
    isFile = false
  }

  if (!isFile) {
    filePath = join(root, "index.html")
  }

  const ext = extname(filePath)
  const cache = filePath.includes(`${join(root, "assets")}`)
    ? "public, max-age=31536000, immutable"
    : ext === ".html"
      ? "no-cache"
      : "public, max-age=86400"

  res.writeHead(200, {
    ...headers(),
    "Content-Type": types[ext] || "application/octet-stream",
    "Cache-Control": cache,
  })
  if (req.method === "HEAD") {
    res.end()
    return
  }
  createReadStream(filePath).pipe(res)
})

server.listen(port, () => {
  console.log(`Serving dist on http://localhost:${port}`)
})
