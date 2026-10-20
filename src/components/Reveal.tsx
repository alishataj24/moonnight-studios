import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"
import { useReveal } from "../hooks/useReveal"

type Variant = "rise" | "frame" | "curtain" | "line"

type Props = {
  children: ReactNode
  /** Four reveal gestures, chosen per context — not one fade applied everywhere. */
  variant?: Variant
  as?: ElementType
  delay?: number
  threshold?: number
  className?: string
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className">

export function Reveal({
  children,
  variant = "rise",
  as: Tag = "div",
  delay = 0,
  threshold,
  className,
  ...rest
}: Props) {
  const ref = useReveal<HTMLElement>({ delay, threshold })
  return (
    <Tag ref={ref} data-reveal={variant} className={className} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * Splits a line on the `*pivot*` convention used in `content.ts`.
 * Everything outside the asterisks is roman; the marked word is set in
 * the serif italic.
 */
function typeset(line: string) {
  return line.split(/(\*[^*]+\*)/).filter(Boolean).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

/**
 * A headline that rises out of a clipped line. Pass each visual line
 * separately so the mask follows the typeset composition.
 */
export function Headline({
  text,
  className,
  baseDelay = 0,
}: {
  /** Raw copy, carrying its own `|` breaks and `*pivot*` mark. */
  text: string
  className?: string
  baseDelay?: number
}) {
  const lines = text.split("|")
  return (
    <>
      {lines.map((line, index) => (
        <span className="mask-line" key={line}>
          <Reveal
            as="span"
            variant="line"
            delay={baseDelay + index * 110}
            threshold={0.05}
            className={className}
          >
            {/* The trailing space collapses visually but keeps the heading
                readable as a sentence to assistive technology. */}
            {typeset(index < lines.length - 1 ? `${line} ` : line)}
          </Reveal>
        </span>
      ))}
    </>
  )
}
