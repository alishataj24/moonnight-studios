export const projectTypes: { value: string; label: string }[]
export const budgetRanges: { value: string; label: string }[]
export const contactMethods: { value: string; label: string }[]

export function validateEnquiry(
  input: Record<string, unknown>,
  now?: number,
): {
  ok: boolean
  spam?: boolean
  errors?: Record<string, string>
}
