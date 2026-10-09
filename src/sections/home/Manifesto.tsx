import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { LazyVideo } from '../../components/media/LazyVideo'
import type { ClipKey } from '../../data/media'

type Token = { word: string; serif?: boolean } | { clip: ClipKey }

const TOKENS: Token[] = [
  ...'We make clothes for people who never'.split(' ').map((word) => ({ word })),
  { clip: 'fabricWave' },
  ...'stand still. Every piece is'.split(' ').map((word) => ({ word })),
  { word: 'filmed', serif: true },
  ...'in motion before it’s sold —'.split(' ').map((word) => ({ word })),
  { clip: 'silk' },
  ...'no renders, no illustrations — so what you see is'.split(' ').map((word) => ({ word })),
  { word: 'exactly', serif: true },
  ...'what arrives at your door.'.split(' ').map((word) => ({ word })),
]

/** Scroll-linked word reveal with inline video capsules. */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const n = TOKENS.length

  return (
    <section className="container-x py-28 md:py-44" aria-label="Manifesto">
      <p className="eyebrow mb-8 text-muted">(Manifesto)</p>
      <p
        ref={ref}
        className="max-w-[22ch] text-[clamp(2.1rem,5.4vw,5.6rem)] leading-[1.02] font-semibold tracking-[-0.03em] md:max-w-[20ch]"
        aria-label="We make clothes for people who never stand still. Every piece is filmed in motion before it’s sold — no renders, no illustrations — so what you see is exactly what arrives at your door."
      >
        {TOKENS.map((t, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / n, Math.min(1, (i + 1.5) / n)]}>
            {'clip' in t ? (
              <span className="mx-[0.12em] inline-block h-[0.78em] w-[1.9em] overflow-hidden rounded-full align-[-0.06em]">
                <LazyVideo clip={t.clip} quality="sd" className="size-full object-cover" />
              </span>
            ) : (
              <span className={t.serif ? 'font-serif font-normal italic tracking-normal' : undefined}>{t.word}</span>
            )}
          </Word>
        ))}
      </p>
    </section>
  )
}

function Word({ children, progress, range }: { children: ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="inline" aria-hidden>
      {children}{' '}
    </motion.span>
  )
}
