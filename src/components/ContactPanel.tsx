import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { projectTypes } from "../../shared/options.mjs"
import { studio } from "../data/studio"

type Errors = Partial<Record<"name" | "email" | "projectType" | "brief" | "form", string>>
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WHATSAPP = studio.whatsapp.replace(/\D/g, "")

function whatsappLink(payload: {
  name: string
  email: string
  projectType: string
  brief: string
}) {
  if (!WHATSAPP) return ""
  const type = projectTypes.find((item) => item.value === payload.projectType)?.label ?? payload.projectType
  const text = [
    "Project enquiry — Moonnight Studios",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Project: ${type}`,
    "",
    payload.brief,
  ].join("\n")
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
}

/**
 * The contact panel.
 *
 * Slides in over the last frame so the journey is never unwound to reach
 * it. Behaves like a dialog: focus moves in, Tab is trapped, Escape closes,
 * focus returns to whatever opened it, and the page behind does not scroll.
 *
 * It posts to `/api/enquiry` and reports exactly what the server says. It
 * distinguishes "emailed" from "written to the local log" rather than
 * showing one cheerful message for both, and it never claims a send that
 * did not happen.
 */
export function ContactPanel({
  open,
  presetType,
  onClose,
}: {
  open: boolean
  presetType: string | null
  onClose: () => void
}) {
  const uid = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const restoreTo = useRef<Element | null>(null)

  const [projectType, setProjectType] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const startedAt = useRef(Date.now())

  useEffect(() => {
    if (!presetType) return
    setProjectType(presetType)
  }, [presetType])

  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement
    document.body.classList.add("is-locked")
    startedAt.current = Date.now()
    // Into the first field, not the close button — the point is to write.
    const id = window.setTimeout(() => firstFieldRef.current?.focus(), 420)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== "Tab") return
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey, true)
    return () => {
      window.clearTimeout(id)
      document.removeEventListener("keydown", onKey, true)
      document.body.classList.remove("is-locked")
      ;(restoreTo.current as HTMLElement | null)?.focus?.()
    }
  }, [open, onClose])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Captured before the first await: React clears currentTarget by then.
    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      projectType: String(data.get("projectType") ?? ""),
      brief: String(data.get("brief") ?? "").trim(),
      website_confirm: String(data.get("website_confirm") ?? ""),
      startedAt: startedAt.current,
    }

    const next: Errors = {}
    if (payload.name.length < 2) next.name = "Please enter your name."
    if (!EMAIL.test(payload.email)) next.email = "Enter an email address we can reply to."
    if (!payload.projectType) next.projectType = "Choose a type of project."
    if (payload.brief.length < 20) next.brief = "A sentence or two is enough — at least 20 characters."

    if (Object.keys(next).length) {
      setErrors(next)
      setStatus({ kind: "idle" })
      form
        .querySelector<HTMLElement>('[data-invalid="true"] :is(input, select, textarea)')
        ?.focus()
      return
    }

    setErrors({})

    const whatsapp = whatsappLink(payload)
    if (whatsapp) {
      // A filled honeypot is a bot. Do not open a chat.
      if (!payload.website_confirm) {
        const opened = window.open(whatsapp, "_blank", "noopener,noreferrer")
        if (!opened) window.location.assign(whatsapp)
      }
      setStatus({
        kind: "ok",
        message: "WhatsApp is open with your note. Press send there and it reaches the studio.",
      })
      form.reset()
      setProjectType("")
      startedAt.current = Date.now()
      return
    }

    setStatus({ kind: "sending" })

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; delivery?: string; errors?: Errors }
        | null

      if (response.ok && body?.ok) {
        setStatus({
          kind: "ok",
          message:
            body.delivery === "stored"
              ? "Received and stored on the server. Email delivery is not switched on in this environment, so nothing was emailed."
              : "Thank you — your enquiry is on its way. We reply to everything we can take on.",
        })
        form.reset()
        setProjectType("")
        startedAt.current = Date.now()
        return
      }

      if (body?.errors) {
        setErrors(body.errors)
        setStatus({ kind: "error", message: "Please check the highlighted fields." })
        return
      }

      setStatus({
        kind: "error",
        message:
          body?.message ??
          "The enquiry could not be delivered. Nothing was sent — please try again shortly.",
      })
    } catch {
      setStatus({
        kind: "error",
        message:
          "We could not reach the server, so nothing was sent. Please check your connection and try again.",
      })
    }
  }

  if (!open) return null

  return createPortal(
    <div
      className="enquiry-scrim"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="enquiry"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        ref={panelRef}
      >
        <button
          ref={closeRef}
          type="button"
          className="enquiry-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <div className="enquiry-body">
          <h2 className="head-sm" id={`${uid}-title`}>
            Let&rsquo;s make something worth watching.
          </h2>

          <form className="form" ref={formRef} onSubmit={onSubmit} noValidate>
            <div className="form-row">
              <Field id={`${uid}-name`} label="Name" error={errors.name}>
                <input
                  ref={firstFieldRef}
                  id={`${uid}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                />
              </Field>

              <Field id={`${uid}-email`} label="Email" error={errors.email}>
                <input
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                />
              </Field>
            </div>

            <Field id={`${uid}-type`} label="Project type" error={errors.projectType}>
              <select
                id={`${uid}-type`}
                name="projectType"
                required
                value={projectType}
                onChange={(event) => setProjectType(event.target.value)}
                aria-invalid={Boolean(errors.projectType)}
                aria-describedby={errors.projectType ? `${uid}-type-error` : undefined}
              >
                <option value="">Select one</option>
                {projectTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field id={`${uid}-brief`} label="About the project" error={errors.brief}>
              <textarea
                id={`${uid}-brief`}
                name="brief"
                rows={4}
                required
                minLength={20}
                placeholder="What the film is for, and roughly when you need it."
                aria-invalid={Boolean(errors.brief)}
                aria-describedby={errors.brief ? `${uid}-brief-error` : undefined}
              />
            </Field>

            {/* Honeypot. Real people never see or fill this. */}
            <div className="hp" aria-hidden="true">
              <label htmlFor={`${uid}-confirm`}>Leave this field empty</label>
              <input
                id={`${uid}-confirm`}
                name="website_confirm"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="form-foot">
              <button type="submit" className="cta cta-solid" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? "Sending…" : WHATSAPP ? "Send on WhatsApp" : "Send"}
                {status.kind !== "sending" && (
                  <span className="arrow" aria-hidden="true">
                    ↗
                  </span>
                )}
              </button>
            </div>

            <p
              className="form-status"
              role="status"
              aria-live="polite"
              data-kind={status.kind === "ok" ? "ok" : status.kind === "error" ? "error" : undefined}
            >
              {status.kind === "ok" || status.kind === "error" ? status.message : ""}
            </p>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="field" data-invalid={Boolean(error)}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
