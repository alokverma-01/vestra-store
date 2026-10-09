import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { LazyVideo } from '../components/media/LazyVideo'
import { ButtonLink, RevealText } from '../components/ui/primitives'
import type { ClipKey } from '../data/media'
import { getProduct } from '../data/products'
import { useIsDesktop } from '../lib/hooks'
import { money } from '../lib/format'
import { HorizontalLookbook } from '../sections/home/HorizontalLookbook'
import { useDocumentTitle } from './shared'

const TUNNEL: { clip: ClipKey; title: string; slug: string }[] = [
  { clip: 'jacketNight', title: 'Night shell', slug: 'night-shell-windbreaker' },
  { clip: 'trench', title: 'The turn', slug: 'meridian-trench' },
  { clip: 'desert', title: 'Dune', slug: 'dune-knit-sweater' },
  { clip: 'whiteCoat', title: 'Ivory', slug: 'halo-wool-coat' },
  { clip: 'tealNight', title: 'Teal light', slug: 'field-bomber-jacket' },
  { clip: 'silk', title: 'Liquid', slug: 'noir-slip-dress' },
  { clip: 'crewBridge', title: 'Crew', slug: 'utility-cargo-pant' },
]
const GAP = 1150

export default function Lookbook() {
  useDocumentTitle('Lookbook SS26', 'After Dark — the SS26 lookbook. Seven films, every garment shoppable.')
  return (
    <>
      <section className="relative h-[100svh] overflow-hidden bg-ink text-bone">
        <LazyVideo clip="darkness" eager className="absolute inset-0 size-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
        <div className="container-x relative flex h-full flex-col justify-end pb-14">
          <p className="eyebrow text-bone/70">Lookbook · SS26</p>
          <RevealText as="h1" text="After dark" className="font-display mt-3 text-[clamp(5rem,20vw,19rem)]" />
          <p className="mt-2 flex items-center gap-2 text-sm text-bone/70">
            Scroll to fly through seven films <ArrowDown className="size-4 animate-bounce" />
          </p>
        </div>
      </section>
      <DepthTunnel />
      <HorizontalLookbook />
      <section className="container-x py-28 text-center md:py-40">
        <p className="font-serif text-3xl italic text-muted md:text-5xl">Every garment in every film is in the store.</p>
        <ButtonLink to="/shop" className="mt-8 h-14 px-8">Shop the lookbook</ButtonLink>
      </section>
    </>
  )
}

/** Films are placed along the Z axis; scrolling flies the camera through them. */
function DepthTunnel() {
  const ref = useRef<HTMLElement>(null)
  const desktop = useIsDesktop()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 })
  const total = (TUNNEL.length - 1) * GAP + 900
  const camera = useTransform(p, [0, 1], [0, total])
  const counter = useTransform(p, (v) => `0${Math.min(TUNNEL.length, Math.floor(v * TUNNEL.length) + 1)}`)

  return (
    <section ref={ref} className="relative bg-ink text-bone" style={{ height: `${TUNNEL.length * 85 + 100}vh` }} aria-label="Depth tunnel of lookbook films">
      <div className="sticky top-0 h-[100svh] overflow-hidden [perspective:900px]">
        <div className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-between px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/60 md:top-24 md:px-[3vw]">
          <span>Chapter <motion.span>{counter}</motion.span> / 0{TUNNEL.length}</span>
          <span>Fly-through</span>
        </div>
        <motion.div className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]" style={{ z: camera }}>
          {TUNNEL.map((t, i) => (
            <TunnelCard key={t.clip} index={i} camera={camera} desktop={desktop} {...t} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TunnelCard({ index, camera, desktop, clip, title, slug }: (typeof TUNNEL)[number] & { index: number; camera: MotionValue<number>; desktop: boolean }) {
  const p = getProduct(slug)!
  const z = -index * GAP
  const side = index % 2 === 0 ? -1 : 1
  const w = desktop ? 560 : 280
  const h = Math.round(w * 0.62)
  const x = side * (desktop ? 300 : 70) - w / 2
  const y = (index % 3 === 1 ? -1 : index % 3 === 2 ? 1 : 0) * (desktop ? 90 : 120) - h / 2
  // world-space depth of this card relative to the camera
  const depth = useTransform(camera, (c) => z + c)
  const opacity = useTransform(depth, [-GAP * 5, -GAP * 3, -160, 420], [0, 1, 1, 0])
  const pointerEvents = useTransform(depth, (d) => (d > -GAP * 1.6 && d < 260 ? 'auto' : 'none'))

  return (
    <motion.div className="absolute" style={{ width: w, height: h, x, y, z, opacity, pointerEvents }}>
      <Link to={`/product/${p.slug}`} className="group relative block size-full overflow-hidden rounded-2xl bg-graphite" data-cursor="Shop">
        <LazyVideo clip={clip} quality="sd" className="size-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent p-4 pt-12">
          <div>
            <p className="font-display text-3xl md:text-5xl">{title}</p>
            <p className="text-xs text-bone/70">{p.name} · {money(p.price)}</p>
          </div>
          <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.div>
  )
}
