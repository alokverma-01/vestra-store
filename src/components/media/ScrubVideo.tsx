import { useEffect, useRef } from 'react'
import { useReducedMotion, type MotionValue } from 'motion/react'
import { CLIPS, type ClipKey } from '../../data/media'
import { prefersLightMedia } from '../../lib/hooks'

type Props = {
  clip: ClipKey
  /** 0 → 1 scroll progress mapped onto the clip's timeline */
  progress: MotionValue<number>
  className?: string
  onLoadProgress?: (p: number) => void
  onReady?: () => void
}

/**
 * Scroll-scrubbed video ("Apple-style"). The whole file is fetched into memory first
 * so seeking is local and instant, then currentTime eases toward the scroll position
 * every frame for buttery motion in both directions.
 */
export function ScrubVideo({ clip, progress, className, onLoadProgress, onReady }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const cb = useRef({ onLoadProgress, onReady })
  cb.current = { onLoadProgress, onReady }

  // Load: stream the file with progress → blob URL. Falls back to direct streaming.
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const c = CLIPS[clip]
    const src = prefersLightMedia() ? c.sd : c.hd
    const ctrl = new AbortController()
    let objectUrl: string | null = null
    let readyFired = false
    const fireReady = () => {
      if (readyFired) return
      readyFired = true
      cb.current.onReady?.()
      // iOS needs one play() before it will paint frames on seek.
      video.play().then(() => video.pause()).catch(() => {})
    }
    video.addEventListener('loadeddata', fireReady)

    if (reduce) {
      video.src = src
      video.loop = true
      video.play().catch(() => {})
      return () => video.removeEventListener('loadeddata', fireReady)
    }

    ;(async () => {
      try {
        const res = await fetch(src, { signal: ctrl.signal })
        if (!res.ok || !res.body) throw new Error('stream unavailable')
        const total = Number(res.headers.get('content-length')) || 0
        const reader = res.body.getReader()
        const chunks: Uint8Array[] = []
        let loaded = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          loaded += value.length
          if (total) cb.current.onLoadProgress?.(loaded / total)
        }
        objectUrl = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: 'video/mp4' }))
        video.src = objectUrl
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        video.src = src // progressive fallback
      }
    })()

    return () => {
      ctrl.abort()
      video.removeEventListener('loadeddata', fireReady)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [clip, reduce])

  // Scrub loop
  useEffect(() => {
    if (reduce) return
    const video = ref.current
    if (!video) return
    let raf = 0
    let current = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const d = video.duration
      if (d && Number.isFinite(d) && video.readyState >= 2) {
        const target = Math.min(1, Math.max(0, progress.get())) * (d - 0.05)
        current += (target - current) * (1 - Math.exp(-9 * dt)) // same feel at 60Hz and 120Hz
        if (Math.abs(video.currentTime - current) > 0.012 && !video.seeking) {
          video.currentTime = current
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress, reduce])

  return (
    <video
      ref={ref}
      className={className}
      poster={CLIPS[clip].poster}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden
    />
  )
}
