import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { LazyVideo } from '../../components/media/LazyVideo'
import type { ClipKey } from '../../data/media'

const FRAMES: { clip: ClipKey; title: string; caption: string; wide?: boolean }[] = [
  { clip: 'crewBridge', title: 'Under the bridge', caption: 'Ritual Denim · Utility Cargo', wide: true },
  { clip: 'tealNight', title: 'Teal light', caption: 'Field Bomber · Signal Tee' },
  { clip: 'whiteCoat', title: 'Ivory', caption: 'Halo Wool Coat', wide: true },
  { clip: 'trench', title: 'The turn', caption: 'Meridian Trench' },
  { clip: 'crewStairs', title: 'Stairwell, 2AM', caption: 'Shadow Zip Hoodie', wide: true },
]

/** Vertical scroll drives a horizontal film strip with inner parallax. */
export function HorizontalLookbook() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [vh, setVh] = useState(800)

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth))
      setVh(window.innerHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  return (
    <section ref={section} className="relative bg-ink text-bone" style={{ height: distance + vh }} aria-label="Lookbook — After Dark">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex h-full w-max items-center gap-4 px-4 md:gap-8 md:px-[3vw]">
          <div className="flex h-[72svh] w-[82vw] shrink-0 flex-col justify-between md:w-[34vw]">
            <p className="eyebrow text-bone/60">(04) Lookbook — SS26</p>
            <div>
              <h2 className="font-display text-[22vw] md:text-[10vw]">
                After
                <br />
                <span className="font-serif font-normal normal-case italic tracking-normal">dark</span>
              </h2>
              <p className="mt-4 max-w-sm text-bone/70">Five scenes shot on the streets at night. Every garment you see is in the store.</p>
              <Link to="/lookbook" className="mt-6 inline-flex items-center gap-2 border-b border-bone/40 pb-1 text-sm font-semibold hover:border-bone">
                Full lookbook <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {FRAMES.map((f, i) => (
            <Frame key={f.clip} index={i} progress={scrollYProgress} {...f} />
          ))}

          <div className="flex h-[72svh] w-[70vw] shrink-0 flex-col items-start justify-center md:w-[28vw]">
            <p className="font-serif text-4xl italic text-bone/80">Seen enough?</p>
            <Link to="/shop" data-cursor="Shop" className="font-display mt-2 text-[16vw] text-signal hover:text-bone md:text-[7vw]">
              Shop all →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Frame({ index, progress, clip, title, caption, wide }: (typeof FRAMES)[number] & { index: number; progress: MotionValue<number> }) {
  const innerX = useTransform(progress, [0, 1], ['-8%', '8%'])
  return (
    <figure className={`relative shrink-0 ${wide ? 'w-[86vw] md:w-[52vw]' : 'w-[64vw] md:w-[30vw]'}`}>
      <div className={`relative overflow-hidden rounded-2xl bg-graphite ${index % 2 ? 'h-[58svh]' : 'h-[68svh]'}`}>
        <motion.div className="absolute inset-y-0 -inset-x-[10%]" style={{ x: innerX }}>
          <LazyVideo clip={clip} className="size-full object-cover" />
        </motion.div>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm">
        <span className="font-semibold">
          <span className="text-bone/50 tabular-nums">0{index + 1} — </span>
          {title}
        </span>
        <span className="text-bone/60">{caption}</span>
      </figcaption>
    </figure>
  )
}
