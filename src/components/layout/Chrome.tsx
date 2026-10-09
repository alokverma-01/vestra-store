import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { SITE } from '../../config/site'
import { useLoader } from '../../lib/loader'
import { useFinePointer } from '../../lib/hooks'
import { useScrollLock } from '../../lib/smooth'
import { cn, pad } from '../../lib/format'
import { waLink } from '../../lib/whatsapp'
import { BrandIcon } from '../ui/BrandIcon'

/* ───────────────────────── Preloader ───────────────────────── */

/** Counts to 100 using the hero film's real download progress (home page, first visit per session). */
export function Preloader() {
  const { progress, ready } = useLoader()
  const reduce = useReducedMotion()
  const [waitsForHero] = useState(() => window.location.pathname.replace(/\/$/, '') === import.meta.env.BASE_URL.replace(/\/$/, ''))
  const [shown, setShown] = useState(0)
  // Intro plays on the home page once per session; deep links (e.g. a product shared on Instagram) open straight away.
  const [done, setDone] = useState(() => {
    if (!waitsForHero) return true
    try {
      return sessionStorage.getItem('vestra:intro') === '1'
    } catch {
      return false
    }
  })
  useEffect(() => {
    if (!done) return
    try {
      sessionStorage.setItem('vestra:intro', '1')
    } catch {
      /* storage unavailable */
    }
  }, [done])
  const start = useRef(performance.now())
  const live = useRef({ progress, ready })
  live.current = { progress, ready }
  useScrollLock(!done)

  useEffect(() => {
    if (done) return
    if (reduce) {
      setDone(true)
      return
    }
    let raf = 0
    let value = 0
    let last = performance.now()
    const tick = (now: number) => {
      const t = (now - start.current) / 1000
      const dt = Math.min(0.25, (now - last) / 1000)
      last = now
      const { progress: p, ready: r } = live.current
      const target =
        r || t > 9
          ? 100 // hero film ready (or give up waiting)
          : Math.min(95, Math.max(Math.min(60, t * 30), p * 95)) // real download progress, never stalls at 0
      value += (target - value) * (1 - Math.exp(-5 * dt)) // frame-rate independent easing
      if (target === 100 && value > 99.5) value = 100
      setShown(value)
      if (value >= 100) {
        window.setTimeout(() => setDone(true), 280)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce, done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col justify-between bg-ink p-5 text-bone md:p-10"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-label="Loading"
        >
          <div className="flex items-start justify-between">
            <span className="font-display text-3xl">{SITE.name}®</span>
            <span className="eyebrow text-bone/60">SS26 · Drop 01</span>
          </div>
          <div>
            <p className="font-serif text-2xl italic text-bone/70 md:text-4xl">Filmed, not rendered.</p>
            <div className="mt-4 flex items-end justify-between gap-6">
              <div className="h-px flex-1 bg-bone/15">
                <div className="h-px bg-signal" style={{ width: `${shown}%` }} />
              </div>
              <span className="font-display text-[26vw] leading-[0.75] tabular-nums md:text-[16vw]">{pad(Math.round(shown), 3)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ───────────────────────── Cursor follower ───────────────────────── */

export function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.4 })
  const [label, setLabel] = useState<string | null>(null)
  const [overLink, setOverLink] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!fine || reduce) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const t = e.target as Element | null
      setLabel(t?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? null)
      setOverLink(Boolean(t?.closest('a,button,[role="button"],input,select,textarea,label')))
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [fine, reduce, x, y])

  if (!fine || reduce) return null
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[65]"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <motion.div
        className={cn(
          'grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[11px] font-bold uppercase tracking-[0.14em]',
          label ? 'bg-signal text-white' : 'border border-white mix-blend-difference',
        )}
        animate={{ width: label ? 84 : overLink ? 46 : 22, height: label ? 84 : overLink ? 46 : 22 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        {label}
      </motion.div>
    </motion.div>
  )
}

/* ───────────────────────── WhatsApp FAB ───────────────────────── */

export function WhatsAppFab() {
  const { pathname } = useLocation()
  // These pages already put WhatsApp front and centre.
  const hide = pathname.startsWith('/product/') || ['/checkout', '/contact', '/order-sent'].includes(pathname)
  const [hover, setHover] = useState(false)
  if (hide) return null
  return (
    <a
      href={waLink(`Hi ${SITE.name}! I'd like to place an order / ask a question.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat and order on WhatsApp"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex h-14 items-center overflow-hidden rounded-full bg-wa text-ink shadow-[0_10px_40px_-10px_rgba(37,211,102,0.8)] md:right-6 md:bottom-6"
    >
      <span className="relative grid size-14 shrink-0 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-wa opacity-30 motion-reduce:hidden" />
        <BrandIcon name="whatsapp" className="relative size-7" />
      </span>
      <motion.span
        className="whitespace-nowrap text-sm font-semibold"
        initial={false}
        animate={{ width: hover ? 'auto' : 0, paddingRight: hover ? 20 : 0, opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        Order on WhatsApp
      </motion.span>
    </a>
  )
}

export function Grain() {
  return <div className="grain" aria-hidden />
}
