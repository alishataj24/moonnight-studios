import { budgetRanges, contactMethods, projectTypes } from "./options.mjs"

export { budgetRanges, contactMethods, projectTypes }

const projectTypeValues = new Set(projectTypes.map((item) => item.value))
const budgetValues = new Set(budgetRanges.map((item) => item.value))
const methodValues = new Set(contactMethods.map((item) => item.value))

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[0-9+().\-\s]{6,24}$/

function text(value, max) {
  if (typeof value !== "string") return ""
  return value.replace(/\s+/g, " ").trim().slice(0, max)
}

function block(value, max) {
  if (typeof value !== "string") return ""
  return value.replace(/\r/g, "").trim().slice(0, max)
}

function isHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

export function validateEnquiry(input, now = Date.now()) {
  const source = input && typeof input === "object" ? input : {}
  const errors = {}

  if (typeof source.website_confirm === "string" && source.website_confirm.trim()) {
    return { ok: false, spam: true, errors: {} }
  }

  const startedAt = Number(source.startedAt)
  if (!Number.isFinite(startedAt) || now - startedAt < 1500) {
    errors.form = "Please take a moment to review the form, then send it again."
  }
  if (Number.isFinite(startedAt) && startedAt - now > 60_000) {
    errors.form = "Please refresh the page and send the form again."
  }

  const name = text(source.name, 120)
  const email = text(source.email, 160).toLowerCase()
  const company = text(source.company, 160)
  const projectType = text(source.projectType, 40)
  const brief = block(source.brief, 4000)
  const website = text(source.website, 300)
  const budget = text(source.budget, 40)
  const deliveryDate = text(source.deliveryDate, 80)
  const contactMethod = text(source.contactMethod, 20)
  const phone = text(source.phone, 24)
  const references = block(source.references, 2000)
  const projectRef = text(source.projectRef, 80)

  if (name.length < 2) errors.name = "Please enter your full name."
  if (!emailPattern.test(email)) errors.email = "Enter a work email we can reply to."
  if (company && company.length < 2) errors.company = "Tell us the brand or company."
  if (!projectTypeValues.has(projectType)) errors.projectType = "Choose a type of project."
  if (brief.length < 20) errors.brief = "Share a short brief — a sentence or two is enough to begin."
  if (website && !isHttpUrl(website)) {
    errors.website = "Enter a full address, including https://."
  }
  if (budget && !budgetValues.has(budget)) errors.budget = "Choose a budget range, or leave this blank."
  if (deliveryDate && deliveryDate.length < 2) {
    errors.deliveryDate = "Add a little more detail, or leave this blank."
  }
  if (contactMethod && !methodValues.has(contactMethod)) {
    errors.contactMethod = "Choose a contact method, or leave this blank."
  }
  if (phone && !phonePattern.test(phone)) {
    errors.phone = "Enter a phone number with the country code, or leave this blank."
  }
  if (contactMethod === "phone" && !phone) {
    errors.phone = "Add a phone number, or choose email as the contact method."
  }

  if (Object.keys(errors).length) return { ok: false, errors }

  return {
    ok: true,
    data: {
      name,
      email,
      company,
      projectType,
      brief,
      website,
      budget,
      deliveryDate,
      contactMethod,
      phone,
      references,
      projectRef,
    },
  }
}

export function enquiryToText(data) {
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Brand: ${data.company}`,
    `Project type: ${data.projectType}`,
    data.projectRef ? `About: ${data.projectRef}` : "",
    data.website ? `Website: ${data.website}` : "",
    data.budget ? `Budget: ${data.budget}` : "",
    data.deliveryDate ? `Desired timeline: ${data.deliveryDate}` : "",
    data.contactMethod ? `Preferred contact: ${data.contactMethod}` : "",
    data.phone ? `Phone: ${data.phone}` : "",
    "",
    data.brief,
    data.references ? `\nReferences:\n${data.references}` : "",
  ]
  return lines.filter((line) => line !== "").join("\n")
}
