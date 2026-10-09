import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { SITE } from '../../config/site'
import { CATEGORIES } from '../../data/products'
import { waLink } from '../../lib/whatsapp'
import { LazyVideo } from '../media/LazyVideo'
import { BrandIcon } from '../ui/BrandIcon'
import { Magnetic, Marquee } from '../ui/primitives'

const HELP = [
  { to: '/faq', label: 'FAQ' },
  { to: '/shipping-returns', label: 'Shipping & Returns' },
  { to: '/size-guide', label: 'Size Guide' },
  { to: '/contact', label: 'Contact' },
  { to: '/cart', label: 'Your Bag' },
]
const COMPANY = [
  { to: '/about', label: 'Our Story' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/credits', label: 'Film Credits' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative mt-auto bg-ink text-bone">
      <Marquee
        className="border-y hairline-light py-4 text-sm font-semibold uppercase tracking-[0.2em]"
        items={['Order on WhatsApp', 'Cash on Delivery', `Free shipping over ₹${SITE.freeShippingThreshold.toLocaleString('en-IN')}`, `${SITE.returnDays}-day easy returns`, 'Filmed, not rendered']}
        duration={36}
      />

      <div className="container-x grid gap-12 pt-20 pb-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-bone/60">Order in one message</p>
          <h2 className="font-display mt-4 text-[clamp(3rem,7vw,6.5rem)]">
            No checkout.
            <br />
            Just <span className="font-serif normal-case italic tracking-normal text-signal">WhatsApp</span>.
          </h2>
          <p className="mt-5 max-w-md text-bone/70">
            Pick your pieces, tap order, and we confirm size, stock and delivery with you personally in chat. Cash on Delivery
            available across India.
          </p>
          <Magnetic className="mt-8">
            <a
              href={waLink(`Hi ${SITE.name}! I'd like to place an order.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-wa px-7 font-semibold text-ink transition hover:bg-[#2fe074]"
            >
              <BrandIcon name="whatsapp" /> {SITE.whatsappDisplay}
            </a>
          </Magnetic>
        </div>

        <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7" aria-label="Footer">
          <div>
            <p className="eyebrow text-bone/50">Shop</p>
            <ul className="mt-5 space-y-2.5">
              <li><Link to="/shop" className="hover:text-signal">All pieces</Link></li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link to={`/shop?category=${c.id}`} className="hover:text-signal">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-bone/50">Help</p>
            <ul className="mt-5 space-y-2.5">
              {HELP.map((l) => (
                <li key={l.to}><Link to={l.to} className="hover:text-signal">{l.label}</Link></li>
              ))}
              <li>
                <a href={waLink(`Hi ${SITE.name}! I'd like to track my order. Order ID: `)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-signal">
                  Track order <ArrowUpRight className="size-3.5" />
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="eyebrow text-bone/50">Studio</p>
            <ul className="mt-5 space-y-2.5">
              {COMPANY.map((l) => (
                <li key={l.to}><Link to={l.to} className="hover:text-signal">{l.label}</Link></li>
              ))}
            </ul>
            <address className="mt-8 space-y-1 text-sm not-italic text-bone/60">
              <p>{SITE.studio}</p>
              <p>{SITE.hours}</p>
              <p><a href={`mailto:${SITE.email}`} className="hover:text-bone">{SITE.email}</a></p>
            </address>
            <div className="mt-5 flex gap-4">
              <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-signal"><BrandIcon name="instagram" /></a>
              <a href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-signal"><BrandIcon name="youtube" /></a>
              <a href={waLink('Hi!')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-signal"><BrandIcon name="whatsapp" /></a>
            </div>
          </div>
        </nav>
      </div>

      {/* Giant wordmark with real footage playing through the letters */}
      <div className="relative overflow-hidden" aria-hidden>
        <LazyVideo clip="fabricWave" quality="sd" className="absolute inset-0 size-full object-cover" />
        <p className="font-display relative bg-ink pb-[1vw] text-center text-[27.5vw] leading-[0.78] text-white mix-blend-multiply select-none">
          {SITE.name}
        </p>
      </div>

      <div className="container-x flex flex-col gap-3 border-t hairline-light py-6 text-xs text-bone/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} {SITE.legalName}. All rights reserved.</p>
        <p>Cash on Delivery · UPI · Bank transfer — confirmed on WhatsApp</p>
      </div>
    </footer>
  )
}
