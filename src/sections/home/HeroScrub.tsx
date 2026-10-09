import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { ScrubVideo } from '../../components/media/ScrubVideo'
import { WhatsAppButton } from '../../components/ui/primitives'
import { getProduct } from '../../data/products'
import { useIsDesktop } from '../../lib/hooks'
import { useLoader } from '../../lib/loader'
import { money, pad } from '../../lib/format'
import { openWhatsApp, productOrderMessage } from '../../lib/whatsapp'

const HERO_PRODUCT = getProduct('orbit-oversized-tee')!

/**
 * Scroll-scrubbed 360° turn. The frame starts as a tilted 3D card and flattens
 * to full-bleed while the footage advances frame-by-frame with the scroll.
 */
export function HeroScrub() {
  const ref = useRef<HTMLElement>(null)
  const desktop = useIsDesktop()
  const { report, markReady } = useLoader()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const scale = useTransform(p, [0, 0.28], [desktop ? 0.58 : 0.8, 1])
  const rotateX = useTransform(p, [0, 0.28], [desktop ? 26 : 14, 0])
  const rotateZ = useTransform(p, [0, 0.28], [desktop ? -2 : 0, 0])
  const radius = useTransform(p, [0, 0.28], [desktop ? 28 : 20, 0])
  const y = useTransform(p, [0, 0.28], ['6vh', '0vh'])

  const leftX = useTransform(p, [0, 0.3], ['0vw', '-60vw'])
  const rightX = useTransform(p, [0, 0.3], ['0vw', '60vw'])
  const headOpacity = useTransform(p, [0.12, 0.28], [1, 0])
  const hint = useTransform(p, [0, 0.05], [1, 0])

  const c1 = useTransform(p, [0.32, 0.4, 0.56, 0.63], [0, 1, 1, 0])
  const c1y = useTransform(p, [0.32, 0.4, 0.56, 0.63], [50, 0, 0, -40])
  const c2 = useTransform(p, [0.67, 0.76], [0, 1])
  const c2y = useTransform(p, [0.67, 0.76], [60, 0])

  const [deg, setDeg] = useState(0)
  useMotionValueEvent(p, 'change', (v) => setDeg(Math.round(Math.min(1, v) * 360)))

  return (
    <section ref={ref} className="relative h-[440vh] bg-bone md:h-[520vh]" aria-label="The Orbit Tee, filmed in a full 360 degree turn">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-bone [perspective:1400px]">
        {/* The film — 3D card → full-bleed */}
        <motion.div
          className="absolute inset-0 origin-center overflow-hidden bg-[#c9c9c7] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.45)] will-change-transform"
          style={{ scale, rotateX, rotateZ, y, borderRadius: radius }}
        >
          <ScrubVideo clip="turn" progress={p} onLoadProgress={report} onReady={markReady} className="size-full object-cover" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/25 to-transparent md:h-1/3" />
        </motion.div>

        {/* Editorial headline — splits apart as the frame opens */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-[16vh] text-white mix-blend-difference md:py-[11vh]">
          <motion.h1 style={{ x: leftX, opacity: headOpacity }} className="font-display px-4 text-[21vw] md:px-[3vw] md:text-[15.5vw]">
            Garments
          </motion.h1>
          <motion.p style={{ x: rightX, opacity: headOpacity }} className="font-display self-end px-4 text-right text-[21vw] md:px-[3vw] md:text-[15.5vw]">
            in <span className="font-serif font-normal normal-case italic tracking-normal">motion</span>
          </motion.p>
        </div>

        {/* Corner meta */}
        <div className="pointer-events-none absolute inset-x-0 top-20 flex justify-between px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white mix-blend-difference md:top-24 md:px-[3vw]">
          <span>SS26 — Drop 01</span>
          <motion.span style={{ opacity: hint }} className="flex items-center gap-2">
            Scroll to turn <ArrowDown className="size-3.5 animate-bounce" />
          </motion.span>
        </div>
        <div className="pointer-events-none absolute bottom-5 left-4 flex items-end gap-3 text-white mix-blend-difference md:bottom-8 md:left-[3vw]">
          <span className="font-display text-5xl tabular-nums md:text-7xl">{pad(deg, 3)}°</span>
          <span className="pb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]">Rotation</span>
        </div>

        {/* Caption 1 */}
        <motion.div style={{ opacity: c1, y: c1y }} className="absolute bottom-24 left-4 max-w-md md:bottom-auto md:top-1/2 md:left-[3vw] md:-translate-y-1/2">
          <p className="eyebrow text-ink/70">01 / The Orbit Tee</p>
          <h2 className="font-display mt-3 text-6xl text-ink md:text-8xl">
            320 GSM.
            <br />
            Built to move.
          </h2>
          <p className="mt-4 font-serif text-2xl italic text-ink/80">One take. No renders. Every angle real.</p>
        </motion.div>

        {/* Caption 2 + CTA */}
        <motion.div
          style={{ opacity: c2, y: c2y }}
          className="absolute inset-x-4 bottom-24 rounded-3xl bg-bone/85 p-5 backdrop-blur-md md:inset-x-auto md:right-[3vw] md:bottom-auto md:top-1/2 md:w-[380px] md:-translate-y-1/2 md:p-7"
        >
          <p className="eyebrow text-muted">Full turn complete</p>
          <p className="mt-2 text-2xl font-semibold">{HERO_PRODUCT.name}</p>
          <p className="mt-1 text-muted">{HERO_PRODUCT.short}</p>
          <p className="mt-4 text-3xl font-semibold tabular-nums">{money(HERO_PRODUCT.price)}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link to={`/product/${HERO_PRODUCT.slug}`} className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-ink text-sm font-semibold text-bone transition hover:bg-graphite">
              Shop the tee <ArrowUpRight className="size-4" />
            </Link>
            <WhatsAppButton className="px-3" onClick={() => openWhatsApp(productOrderMessage(HERO_PRODUCT, { color: 'Rose', qty: 1 }))}>
              Order
            </WhatsAppButton>
          </div>
        </motion.div>

        {/* Scroll progress */}
        <motion.div className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-signal" style={{ scaleX: p }} />
      </div>
    </section>
  )
}
