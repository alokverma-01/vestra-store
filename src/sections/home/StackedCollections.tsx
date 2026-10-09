import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { LazyVideo } from '../../components/media/LazyVideo'
import type { ClipKey } from '../../data/media'

const COLLECTIONS: { no: string; title: string; serif: string; copy: string; clip: ClipKey; to: string; light?: boolean }[] = [
  { no: '01', title: 'Outerwear', serif: 'after dark', copy: 'Ripstop shells, gabardine trenches and padded bombers — reflective where it counts.', clip: 'jacketNight', to: '/shop?category=outerwear' },
  { no: '02', title: 'Knitwear', serif: 'undyed', copy: 'Chunky ribs and brushed cardigans in the colour of the dunes we shot them in.', clip: 'desert', to: '/shop?category=knitwear', light: true },
  { no: '03', title: 'Denim', serif: 'built to last', copy: '14oz denim, cut boxy and washed for a decade of wear.', clip: 'crewBridge', to: '/shop?category=denim' },
  { no: '04', title: 'Slip & Satin', serif: 'liquid', copy: 'Bias-cut satin that moves exactly like the film.', clip: 'silk', to: '/shop?category=dresses' },
]

/** Sticky full-bleed video cards that stack and recede as the next one arrives. */
export function StackedCollections() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const n = COLLECTIONS.length

  return (
    <section ref={ref} className="relative bg-bone" aria-label="Collections">
      <div className="container-x pt-24 pb-6 md:pt-36">
        <p className="eyebrow text-muted">(03) Collections</p>
        <h2 className="font-display mt-4 text-[clamp(3rem,9vw,8.5rem)]">Four ways to move</h2>
      </div>
      {COLLECTIONS.map((c, i) => (
        <Card key={c.title} index={i} progress={scrollYProgress} range={[i / n, 1]} targetScale={1 - (n - i) * 0.045} {...c} />
      ))}
    </section>
  )
}

function Card({
  index,
  progress,
  range,
  targetScale,
  no,
  title,
  serif,
  copy,
  clip,
  to,
  light,
}: (typeof COLLECTIONS)[number] & { index: number; progress: MotionValue<number>; range: [number, number]; targetScale: number }) {
  const scale = useTransform(progress, range, [1, targetScale])
  const ink = light ? 'text-ink' : 'text-bone'
  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center px-3 md:px-6">
      <motion.div
        style={{ scale, top: `calc(${index * 22}px)` }}
        className="relative h-[82svh] w-full max-w-[1500px] origin-top overflow-hidden rounded-[28px] bg-ink"
      >
        <LazyVideo clip={clip} className="absolute inset-0 size-full object-cover" />
        <div className={light ? 'absolute inset-0 bg-gradient-to-r from-bone/70 via-bone/10 to-transparent' : 'absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent'} />
        <div className={`relative flex h-full flex-col justify-between p-6 md:p-12 ${ink}`}>
          <div className="flex items-start justify-between">
            <span className="font-display text-5xl md:text-7xl">{no}</span>
            <span className="eyebrow">Collection</span>
          </div>
          <div className="max-w-2xl">
            <h3 className="font-display text-[clamp(3.5rem,12vw,11rem)]">{title}</h3>
            <p className="font-serif -mt-1 text-3xl italic md:text-5xl">{serif}</p>
            <p className="mt-4 max-w-md text-[15px] opacity-85 md:text-base">{copy}</p>
            <Link
              to={to}
              data-cursor="Shop"
              className={`mt-6 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold transition ${light ? 'bg-ink text-bone hover:bg-graphite' : 'bg-bone text-ink hover:bg-white'}`}
            >
              Explore {title} <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
