import { useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ChevronDown, Minus, Plus } from 'lucide-react'
import { cn, money } from '../../lib/format'
import { useFinePointer } from '../../lib/hooks'
import { BrandIcon } from './BrandIcon'

/* ───────────────────────── Button ───────────────────────── */

type Variant = 'ink' | 'bone' | 'outline' | 'outline-light' | 'wa' | 'ghost'
const variants: Record<Variant, string> = {
  ink: 'bg-ink text-bone hover:bg-graphite',
  bone: 'bg-bone text-ink hover:bg-white',
  outline: 'border border-ink/80 text-ink hover:bg-ink hover:text-bone',
  'outline-light': 'border border-bone/70 text-bone hover:bg-bone hover:text-ink',
  wa: 'bg-wa text-ink hover:bg-[#2fe074]',
  ghost: 'text-ink hover:bg-ink/5',
}
const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 h-12 text-sm font-semibold tracking-wide transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none select-none'

type BtnProps = { variant?: Variant; className?: string; children: ReactNode }

export function Button({ variant = 'ink', className, ...rest }: BtnProps & ComponentPropsWithoutRef<'button'>) {
  return <button className={cn(base, variants[variant], className)} {...rest} />
}

export function ButtonLink({
  variant = 'ink',
  className,
  to,
  ...rest
}: BtnProps & { to: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>) {
  const external = /^https?:/.test(to)
  if (external)
    return <a href={to} target="_blank" rel="noopener noreferrer" className={cn(base, variants[variant], className)} {...rest} />
  return <Link to={to} className={cn(base, variants[variant], className)} {...rest} />
}

export function WhatsAppButton({
  onClick,
  children = 'Order on WhatsApp',
  className,
  variant = 'wa',
  ...rest
}: { children?: ReactNode; variant?: Variant } & ComponentPropsWithoutRef<'button'>) {
  return (
    <Button variant={variant} onClick={onClick} className={className} {...rest}>
      <BrandIcon name="whatsapp" className="size-[18px]" />
      {children}
    </Button>
  )
}

/* ──────────────────── Magnetic (desktop only) ──────────────────── */

export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 })
  if (!fine || reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────── Marquee ───────────────────────── */

export function Marquee({
  items,
  className,
  duration = 30,
  reverse = false,
  separator,
}: {
  items: ReactNode[]
  className?: string
  duration?: number
  reverse?: boolean
  separator?: ReactNode
}) {
  const sep = separator ?? <Star4 className="size-3.5 shrink-0" />
  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          {it}
          {sep}
        </span>
      ))}
    </div>
  )
  return (
    <div className={cn('flex overflow-hidden', className)} aria-hidden>
      <div
        className={cn('flex w-max', reverse ? 'animate-marquee-reverse' : 'animate-marquee')}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        {row}
        {row}
      </div>
    </div>
  )
}

export function Star4({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  )
}

/* ───────────────────── Reveal (in-view) ───────────────────── */

/** Splits text into words that slide up out of a mask when scrolled into view. */
export function RevealText({
  text,
  className,
  as: Tag = 'h2',
  delay = 0,
  stagger = 0.045,
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  stagger?: number
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const reduce = useReducedMotion()
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%' }}
            animate={inView ? { y: '0%' } : undefined}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function FadeIn({ children, className, delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ───────────────────────── Misc ───────────────────────── */

export function Price({ value, compareAt, className }: { value: number; compareAt?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-baseline gap-2 tabular-nums', className)}>
      <span>{money(value)}</span>
      {compareAt && compareAt > value && (
        <>
          <span className="text-muted line-through decoration-1">{money(compareAt)}</span>
          <span className="text-xs font-semibold text-signal">−{Math.round((1 - value / compareAt) * 100)}%</span>
        </>
      )}
    </span>
  )
}

export function QtyStepper({ value, onChange, min = 1, max = 10, size = 'md' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-9' : 'h-12'
  return (
    <div className={cn('inline-flex items-center rounded-full border hairline', h)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        className={cn('grid aspect-square place-items-center rounded-full hover:bg-ink/5 disabled:opacity-30', h)}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={cn('grid aspect-square place-items-center rounded-full hover:bg-ink/5 disabled:opacity-30', h)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}

export function Accordion({ items, defaultOpen = 0 }: { items: { title: string; content: ReactNode }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  return (
    <div className="divide-y border-y hairline divide-ink/10">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.title}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between py-5 text-left text-sm font-semibold uppercase tracking-[0.12em]"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {it.title}
                <ChevronDown className={cn('size-4 transition-transform duration-300', isOpen && 'rotate-180')} />
              </button>
            </h3>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-6 text-[15px] leading-relaxed text-muted">{it.content}</div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

export function PageHeader({ eyebrow, title, intro, className }: { eyebrow?: string; title: string; intro?: ReactNode; className?: string }) {
  return (
    <header className={cn('container-x pt-32 pb-10 md:pt-40 md:pb-14', className)}>
      {eyebrow && <p className="eyebrow text-muted">{eyebrow}</p>}
      <RevealText as="h1" text={title} className="font-display mt-4 text-[clamp(3.5rem,11vw,10rem)]" />
      {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted text-pretty">{intro}</div>}
    </header>
  )
}
