import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { LazyVideo } from '../components/media/LazyVideo'
import { ButtonLink, FadeIn, RevealText } from '../components/ui/primitives'
import { SITE } from '../config/site'
import type { ClipKey } from '../data/media'
import { cn } from '../lib/format'
import { useDocumentTitle } from './shared'

const STEPS: { no: string; title: string; body: string; clip: ClipKey }[] = [
  { no: '01', title: 'Pattern', body: 'Every silhouette starts as a paper pattern traced by hand. We grade sizes ourselves so the drop of a shoulder is the same on an XS as an XXL.', clip: 'dressmaker' },
  { no: '02', title: 'Cut', body: 'Cloth is laid and cut in small batches — rarely more than 150 of a piece — so nothing sits in a warehouse waiting for a sale.', clip: 'tailor' },
  { no: '03', title: 'Finish', body: 'Garments are washed, pressed and checked on the rail. Anything with a flaw becomes a sample, never a shipment.', clip: 'hangers' },
  { no: '04', title: 'Film', body: 'Before a piece goes on sale, we film it moving. No renders, no AI mock-ups, no illustrations — the footage on the product page is the product.', clip: 'turn' },
  { no: '05', title: 'Ship', body: 'You order in a WhatsApp message, a real person confirms it, and it leaves the studio within 48 hours with Cash on Delivery available everywhere we ship.', clip: 'float' },
]

export default function About() {
  useDocumentTitle('Our story', SITE.description)
  return (
    <>
      <section className="relative h-[100svh] overflow-hidden bg-ink text-bone">
        <LazyVideo clip="fabricWave" eager className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/40" />
        <div className="container-x relative flex h-full flex-col justify-end pb-14">
          <p className="eyebrow text-bone/70">Our story</p>
          <RevealText as="h1" text="Filmed, not rendered." className="font-display mt-3 max-w-6xl text-[clamp(4rem,13vw,12rem)]" />
        </div>
      </section>

      <section className="container-x grid gap-10 py-28 md:grid-cols-12 md:py-40">
        <p className="eyebrow text-muted md:col-span-3">(The idea)</p>
        <div className="md:col-span-9">
          <p className="text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">
            We started {SITE.name} because we were tired of buying clothes from <span className="font-serif font-normal italic">perfect pictures</span> that arrived looking nothing like them.
          </p>
          <div className="mt-10 grid gap-8 text-muted md:grid-cols-2">
            <FadeIn>
              <p>
                Product photos get retouched. Renders get smoothed. Illustrations hide how fabric actually behaves. So we made one rule: if we can’t film it moving, we
                don’t sell it. Every piece in the store has real footage — the way it hangs, swings, creases and catches light.
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p>
                And we kept ordering human. No checkout funnels or card forms — you send a WhatsApp message, someone from the studio replies, checks your size with you
                and confirms delivery. Cash on Delivery, everywhere.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <Process />

      <section className="container-x py-28 md:py-40">
        <div className="grid gap-px overflow-hidden rounded-3xl border hairline bg-ink/10 md:grid-cols-3">
          {[
            { t: 'Small batches', b: 'Most pieces are made in runs of 150 or fewer. When it’s gone, it’s gone.' },
            { t: 'Heavy fabrics', b: '300–480 GSM cottons, 14oz denim and dense gabardine. Built for years, not seasons.' },
            { t: 'Real people', b: `Every order is confirmed by a human on WhatsApp, ${SITE.hours}.` },
          ].map((v) => (
            <div key={v.t} className="bg-bone p-8 md:p-10">
              <h3 className="font-display text-5xl">{v.t}</h3>
              <p className="mt-4 text-muted">{v.b}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/shop" className="h-14 px-8">Shop the drop</ButtonLink>
          <ButtonLink to="/lookbook" variant="outline" className="h-14 px-8">Watch the lookbook</ButtonLink>
        </div>
      </section>
    </>
  )
}

/** Sticky film on one side, steps scroll past on the other; the film swaps per step. */
function Process() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start center', 'end center'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)))))

  return (
    <section ref={ref} className="bg-ink text-bone" aria-label="How a piece is made">
      <div className="container-x grid gap-10 py-24 md:grid-cols-2 md:py-32">
        <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-graphite md:aspect-[4/5]">
            <AnimatePresence mode="popLayout">
              <motion.div key={STEPS[active].clip} className="absolute inset-0" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
                <LazyVideo clip={STEPS[active].clip} eager className="size-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <span className="font-display absolute bottom-5 left-5 text-8xl text-bone/90">{STEPS[active].no}</span>
          </div>
        </div>
        <ol className="md:py-[30vh]">
          <li className="mb-16">
            <p className="eyebrow text-bone/50">(How it’s made)</p>
            <h2 className="font-display mt-4 text-[clamp(3rem,7vw,6rem)]">Five steps, all on film</h2>
          </li>
          {STEPS.map((s, i) => (
            <li key={s.no} className={cn('border-t hairline-light py-10 transition-opacity duration-500 md:min-h-[45vh]', active === i ? 'opacity-100' : 'opacity-35')}>
              <p className="font-display text-2xl text-signal">{s.no}</p>
              <h3 className="font-display mt-2 text-6xl md:text-7xl">{s.title}</h3>
              <p className="mt-4 max-w-md text-bone/70">{s.body}</p>
              <div className="mt-6 aspect-video overflow-hidden rounded-2xl md:hidden">
                <LazyVideo clip={s.clip} quality="sd" className="size-full object-cover" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
