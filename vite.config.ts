import { writeFileSync } from "node:fs"
import { join } from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Connect, type Plugin, type ViteDevServer } from "vite"
import { handleEnquiry } from "./server/enquiry.mjs"
import { publicPaths } from "./shared/options.mjs"

function readRequestBody(req: Connect.IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on("data", (chunk: Buffer) => {
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

function enquiryApi(defaultProvider: string | false): Plugin {
  const attach = (server: ViteDevServer) => {
    server.middlewares.use(async (req, res, next) => {
      const path = req.url?.split("?")[0]
      if (path !== "/api/enquiry") return next()
      if (req.method !== "POST") {
        res.statusCode = 405
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ ok: false, message: "Method not allowed." }))
        return
      }
      try {
        const raw = await readRequestBody(req)
        const env = {
          ...process.env,
          FORM_PROVIDER: process.env.FORM_PROVIDER || defaultProvider || "",
        }
        const result = await handleEnquiry(raw, env, { ip: req.socket.remoteAddress || "local" })
        res.statusCode = result.status
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(result.body))
      } catch {
        res.statusCode = 400
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ ok: false, message: "The enquiry could not be read." }))
      }
    })
  }

  return {
    name: "enquiry-api",
    configureServer: attach,
    configurePreviewServer: attach,
  }
}

function sitemap(): Plugin {
  return {
    name: "sitemap",
    apply: "build",
    closeBundle() {
      const env = loadEnv(process.env.NODE_ENV || "production", process.cwd(), "")
      const site = (env.VITE_SITE_URL || process.env.VITE_SITE_URL || "").replace(/\/$/, "")
      const out = join(process.cwd(), "dist")
      if (!site) {
        writeFileSync(join(out, "robots.txt"), "User-agent: *\nAllow: /\n")
        return
      }
      const urls = publicPaths
        .map((path) => `  <url><loc>${site}${path}</loc></url>`)
        .join("\n")
      writeFileSync(
        join(out, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
      writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  Object.assign(process.env, env)
  return {
    plugins: [react(), enquiryApi("log"), sitemap()],
    build: {
      assetsInlineLimit: 4096,
    },
  }
})
