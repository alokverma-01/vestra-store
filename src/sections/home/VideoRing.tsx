import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { LazyVideo } from '../../components/media/LazyVideo'
import type { ClipKey } from '../../data/media'
import { getProduct } from '../../data/products'
import { useIsDesktop } from '../../lib/hooks'
import { money } from '../../lib/format'

const RING: { clip: ClipKey; slug: string }[] = [
  { clip: 'streetGirls', slug: 'night-shell-windbreaker' },
  { clip: 'denimJump', slug: 'ritual-denim-jacket' },
  { clip: 'gothic', slug: 'noir-slip-dress' },
  { clip: 'staircase', slug: 'drift-boxy-hoodie' },
  { clip: 'cropStreet', slug: 'signal-heavyweight-tee' },
  { clip: 'denimModels', slug: 'contour-wide-leg-jeans' },
  { clip: 'studioLight', slug: 'satin-column-dress' },
  { clip: 'rack', slug: 'atelier-oxford-shirt' },
]

/**
 * A true CSS-3D cylinder of vertical films. Scrolling spins the ring; cards facing
 * the viewer brighten, the far side dims — real footage on every face.
 */
export function VideoRing() {
  const ref = useRef<HTMLElement>(null)
  const desktop = useIsDesktop()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 })
  const rotate = useTransform(smooth, [0, 1], [20, -340])
  const tilt = useTransform(smooth, [0, 0.5, 1], [-10, -4, -10])
  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])

  const N = RING.length
  const step = 360 / N
  const w = desktop ? 230 : 140
  const h = Math.round(w * 1.7)
  const radius = Math.round((w / (2 * Math.tan(Math.PI / N))) * 1.28)

  return (
    <section ref={ref} className="relative h-[320vh] bg-ink text-bone" aria-label="The ring — eight films, eight pieces">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden [perspective:1100px] md:[perspective:1500px]">
        <div className="pointer-events-none absolute inset-x-0 top-20 flex justify-between px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone/60 md:top-24 md:px-[3vw]">
          <span>(02) The Ring</span>
          <span>{N} films · {N} pieces</span>
        </div>

        <div className="relative [transform-style:preserve-3d]" style={{ width: w, height: h }}>
          {/* Title plane sits at z=0 inside the 3D scene so near cards pass in front of it */}
          <motion.h2
            style={{ scale: titleScale }}
            className="font-display pointer-events-none absolute top-1/2 left-1/2 w-[92vw] -translate-x-1/2 -translate-y-1/2 text-center text-[17vw] text-bone md:text-[11vw]"
          >
            Motion is the <span className="font-serif font-normal normal-case italic tracking-normal text-signal">material</span>
          </motion.h2>

          <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateY: rotate, rotateX: tilt }}>
            {RING.map((item, i) => (
              <RingCard key={item.clip} index={i} step={step} radius={radius} rotate={rotate} {...item} />
            ))}
          </motion.div>
        </div>

        <p className="absolute bottom-8 left-1/2 w-max -translate-x-1/2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-bone/50">
          Keep scrolling to spin · tap a film to shop
        </p>
      </div>
    </section>
  )
}

function RingCard({ index, step, radius, rotate, clip, slug }: { index: number; step: number; radius: number; rotate: MotionValue<number>; clip: ClipKey; slug: string }) {
  const p = getProduct(slug)!
  const angle = index * step
  // facing = 1 when the card points at the camera, -1 when it's behind the ring
  const facing = useTransform(rotate, (r) => Math.cos(((angle + r) * Math.PI) / 180))
  const opacity = useTransform(facing, [-1, 0, 1], [0.28, 0.6, 1])
  const brightness = useTransform(facing, [-1, 1], [0.35, 1])
  const filter = useTransform(brightness, (b) => `brightness(${b})`)
  const captionOpacity = useTransform(facing, [0, 0.35], [0, 1]) // hide mirrored text on the far side

  return (
    <motion.div
      className="absolute inset-0 [backface-visibility:visible]"
      style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)`, opacity }}
    >
      <Link to={`/product/${p.slug}`} className="group relative block size-full overflow-hidden rounded-2xl bg-graphite" data-cursor="Shop" aria-label={`${p.name}, ${money(p.price)}`}>
        <motion.div className="size-full" style={{ filter }}>
          <LazyVideo clip={clip} quality="sd" className="size-full object-cover" />
        </motion.div>
        <motion.div style={{ opacity: captionOpacity }} className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-3 pt-10">
          <p className="truncate text-[13px] font-semibold">{p.name}</p>
          <p className="text-xs text-bone/70 tabular-nums">{money(p.price)}</p>
        </motion.div>
      </Link>
    </motion.div>
  )
}
