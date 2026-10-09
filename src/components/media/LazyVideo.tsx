import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { CLIPS, type ClipKey } from '../../data/media'
import { prefersLightMedia } from '../../lib/hooks'
import { cn } from '../../lib/format'

type Props = {
  clip: ClipKey
  className?: string
  /** auto = play while on screen · hover = play while `active` and on screen · manual = play while `active` */
  mode?: 'auto' | 'hover' | 'manual'
  active?: boolean
  quality?: 'auto' | 'hd' | 'sd'
  /** Fade the video in once frames are playing (lets an image underneath act as placeholder). */
  fadeIn?: boolean
  showPoster?: boolean
  eager?: boolean
  label?: string
}

/**
 * Real-footage video that only downloads when near the viewport,
 * plays when visible and pauses off-screen to keep scrolling smooth.
 */
export function LazyVideo({
  clip,
  className,
  mode = 'auto',
  active = false,
  quality = 'auto',
  fadeIn = false,
  showPoster = true,
  eager = false,
  label,
}: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [near, setNear] = useState(eager)
  const [visible, setVisible] = useState(false)
  const [playing, setPlaying] = useState(false)
  const c = CLIPS[clip]

  const src = useMemo(() => {
    if (quality === 'hd') return c.hd
    if (quality === 'sd') return c.sd
    return prefersLightMedia() ? c.sd : c.hd
  }, [c, quality])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const nearObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          nearObs.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
    nearObs.observe(el)
    visObs.observe(el)
    return () => {
      nearObs.disconnect()
      visObs.disconnect()
    }
  }, [])

  const shouldPlay =
    !reduce && near && (mode === 'auto' ? visible : mode === 'hover' ? active && visible : active)

  useEffect(() => {
    const el = ref.current
    if (!el || !near) return
    el.muted = true
    if (shouldPlay) {
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [shouldPlay, near, src])

  return (
    <video
      ref={ref}
      className={cn(className, fadeIn && 'transition-opacity duration-500', fadeIn && !playing && 'opacity-0')}
      src={near ? src : undefined}
      poster={showPoster ? c.poster : undefined}
      muted
      playsInline
      loop
      preload={near ? 'metadata' : 'none'}
      disablePictureInPicture
      onPlaying={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}
