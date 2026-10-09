import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type LoaderState = {
  progress: number
  ready: boolean
  report: (p: number) => void
  markReady: () => void
}

const LoaderContext = createContext<LoaderState | null>(null)

/** Lets the hero report real video download progress to the preloader. */
export function LoaderProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const report = useCallback((p: number) => setProgress((prev) => Math.max(prev, Math.min(1, p))), [])
  const markReady = useCallback(() => {
    setProgress(1)
    setReady(true)
  }, [])
  const value = useMemo(() => ({ progress, ready, report, markReady }), [progress, ready, report, markReady])
  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
}

export function useLoader() {
  const ctx = useContext(LoaderContext)
  if (!ctx) throw new Error('useLoader must be used inside <LoaderProvider>')
  return ctx
}
