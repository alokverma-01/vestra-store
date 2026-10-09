import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'

const LenisContext = createContext<Lenis | null>(null)

/** Lenis smooth scrolling (disabled for prefers-reduced-motion). Elements with data-lenis-prevent scroll natively. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduce) return
    const instance = new Lenis({ autoRaf: true, lerp: 0.095, anchors: true, wheelMultiplier: 0.95 })
    setLenis(instance)
    return () => {
      instance.destroy()
      setLenis(null)
    }
  }, [reduce])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

let locks = 0

/** Freeze page scroll while an overlay (drawer, modal, menu) is open. */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!locked) return
    locks++
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
    return () => {
      locks = Math.max(0, locks - 1)
      if (locks === 0) {
        lenis?.start()
        document.documentElement.style.overflow = ''
      }
    }
  }, [locked, lenis])
}

export function useScrollTop() {
  const lenis = useLenis()
  return (immediate = true) => {
    if (lenis) lenis.scrollTo(0, { immediate, force: true })
    else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}
