import { mkdtemp, readFile, readdir, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import assert from "node:assert/strict"
import { handleEnquiry, resetEnquiryLimits } from "./enquiry.mjs"

const valid = {
  startedAt: Date.now() - 5000,
  name: "Asha Menon",
  email: "asha@example.com",
  company: "North Studio",
  projectType: "brand-film",
  brief: "A quiet film for a new fragrance, built around glass, skin and late light.",
  website: "https://example.com",
  budget: "guidance",
  contactMethod: "email",
}

const dir = await mkdtemp(join(tmpdir(), "enquiry-test-"))

try {
  resetEnquiryLimits()
  const missing = await handleEnquiry({ startedAt: Date.now() - 4000 }, { FORM_PROVIDER: "log" })
  assert.equal(missing.status, 400)
  assert.ok(missing.body.errors.name)

  resetEnquiryLimits()
  const fast = await handleEnquiry({ ...valid, startedAt: Date.now() }, { FORM_PROVIDER: "log" })
  assert.equal(fast.status, 400)

  resetEnquiryLimits()
  const unconfigured = await handleEnquiry(valid, {})
  assert.equal(unconfigured.status, 503)
  assert.equal(unconfigured.body.ok, false)

  resetEnquiryLimits()
  const stored = await handleEnquiry(valid, { FORM_PROVIDER: "log", ENQUIRY_LOG_DIR: dir })
  assert.equal(stored.status, 200)
  assert.equal(stored.body.delivery, "stored")
  const files = await readdir(dir)
  assert.equal(files.length, 1)
  const saved = JSON.parse(await readFile(join(dir, files[0]), "utf8"))
  assert.equal(saved.email, "asha@example.com")
  assert.equal(saved.company, "North Studio")

  resetEnquiryLimits()
  const spam = await handleEnquiry(
    { ...valid, website_confirm: "https://spam.example" },
    { FORM_PROVIDER: "log", ENQUIRY_LOG_DIR: dir },
  )
  assert.equal(spam.status, 200)
  const afterSpam = await readdir(dir)
  assert.equal(afterSpam.length, 1)

  console.log("enquiry tests passed")
} finally {
  await rm(dir, { recursive: true, force: true })
}
