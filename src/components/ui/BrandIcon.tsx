import { siInstagram, siWhatsapp, siYoutube } from 'simple-icons'

const ICONS = { whatsapp: siWhatsapp, instagram: siInstagram, youtube: siYoutube }

/** Official brand marks from Simple Icons (lucide no longer ships brand logos). */
export function BrandIcon({ name, className = 'size-5' }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden focusable="false">
      <path d={ICONS[name].path} />
    </svg>
  )
}
