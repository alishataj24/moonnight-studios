/** Shared enquiry options. Change project types here; the form reads this file. */

export const projectTypes = [
  { value: "brand-film", label: "Brand film" },
  { value: "hospitality", label: "Resort / hospitality" },
  { value: "architecture", label: "Architecture" },
  { value: "product", label: "Product visuals" },
  { value: "website", label: "Website" },
  { value: "mobile-app", label: "Mobile app" },
  { value: "portraits", label: "Portraits / lifestyle" },
  { value: "other", label: "Other" },
]

/** The resort CTA and the ?project= parameter both resolve to this value. */
export const resortProjectType = "hospitality"

export const budgetRanges = [
  { value: "under-25000", label: "Under ₹25,000" },
  { value: "25000-50000", label: "₹25,000–₹50,000" },
  { value: "50000-100000", label: "₹50,000–₹1,00,000" },
  { value: "100000-plus", label: "₹1,00,000+" },
  { value: "guidance", label: "Need guidance" },
]

export const contactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "either", label: "Either" },
]

/** Paths included in the sitemap. The site is a single page. */
export const publicPaths = ["/"]
