import { handleEnquiry } from "../server/enquiry.mjs"

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body
  if (typeof req.body === "string") return req.body
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, message: "Method not allowed." })
    return
  }
  const raw = await readBody(req)
  const ip = String(req.headers["x-forwarded-for"] || "vercel").split(",")[0].trim()
  const result = await handleEnquiry(raw, process.env, { ip })
  res.status(result.status).json(result.body)
}
