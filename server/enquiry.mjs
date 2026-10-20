import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { enquiryToText, validateEnquiry } from "../shared/enquirySchema.mjs"

const hits = new Map()

function rateLimited(ip, now) {
  const windowMs = 10 * 60 * 1000
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < windowMs)
  if (recent.length >= 5) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

async function deliverLog(data, env) {
  const dir = env.ENQUIRY_LOG_DIR || ".enquiries"
  await mkdir(dir, { recursive: true })
  const file = join(dir, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`)
  await writeFile(
    file,
    JSON.stringify({ receivedAt: new Date().toISOString(), ...data }, null, 2),
    "utf8",
  )
  return "stored"
}

async function deliverResend(data, env) {
  if (!env.RESEND_API_KEY || !env.ENQUIRY_FROM_EMAIL || !env.ENQUIRY_TO_EMAIL) {
    const error = new Error("Resend is not fully configured.")
    error.status = 503
    throw error
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.ENQUIRY_FROM_EMAIL,
      to: [env.ENQUIRY_TO_EMAIL],
      reply_to: data.email,
      subject: `Project enquiry — ${data.company || data.name}`,
      text: enquiryToText(data),
    }),
  })
  if (!response.ok) {
    const error = new Error("The mail service did not accept the enquiry.")
    error.status = 502
    throw error
  }
  return "sent"
}

async function deliverWebhook(data, env) {
  if (!env.WEBHOOK_URL) {
    const error = new Error("The enquiry webhook is not configured.")
    error.status = 503
    throw error
  }
  const headers = { "Content-Type": "application/json" }
  if (env.WEBHOOK_SECRET) headers["X-Enquiry-Secret"] = env.WEBHOOK_SECRET
  const response = await fetch(env.WEBHOOK_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ receivedAt: new Date().toISOString(), enquiry: data }),
  })
  if (!response.ok) {
    const error = new Error("The enquiry webhook did not accept the submission.")
    error.status = 502
    throw error
  }
  return "sent"
}

export async function handleEnquiry(raw, env, context = {}) {
  const now = context.now ?? Date.now()
  const ip = context.ip || "local"
  if (rateLimited(ip, now)) {
    return {
      status: 429,
      body: { ok: false, message: "Too many enquiries from this connection. Please try again shortly." },
    }
  }

  let payload = raw
  if (typeof raw === "string") {
    try {
      payload = JSON.parse(raw)
    } catch {
      return { status: 400, body: { ok: false, message: "The enquiry could not be read." } }
    }
  }

  const result = validateEnquiry(payload, now)
  if (!result.ok) {
    if (result.spam) return { status: 200, body: { ok: true, delivery: "stored" } }
    return { status: 400, body: { ok: false, errors: result.errors } }
  }

  const provider = (env.FORM_PROVIDER || "").trim().toLowerCase()
  if (!provider) {
    return {
      status: 503,
      body: {
        ok: false,
        message: "Enquiry delivery is not configured yet. Nothing was sent.",
      },
    }
  }

  try {
    let delivery = "sent"
    if (provider === "log") delivery = await deliverLog(result.data, env)
    else if (provider === "resend") delivery = await deliverResend(result.data, env)
    else if (provider === "webhook") delivery = await deliverWebhook(result.data, env)
    else {
      return {
        status: 503,
        body: { ok: false, message: "The selected enquiry provider is not recognised. Nothing was sent." },
      }
    }
    return { status: 200, body: { ok: true, delivery } }
  } catch (error) {
    const status = error.status || 502
    return {
      status,
      body: {
        ok: false,
        message:
          status === 503
            ? "Enquiry delivery is not configured yet. Nothing was sent."
            : "The enquiry could not be delivered. Nothing was marked as sent. Please try again.",
      },
    }
  }
}

export function resetEnquiryLimits() {
  hits.clear()
}
