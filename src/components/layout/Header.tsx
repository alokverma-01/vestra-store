import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowUpRight, Heart, Menu, Search, X } from 'lucide-react'
import { SITE } from '../../config/site'
import { CATEGORIES, type Category } from '../../data/products'
import { useShop } from '../../store/shop'
import { useScrollLock } from '../../lib/smooth'
import { cn } from '../../lib/format'
import { waLink } from '../../lib/whatsapp'
import { LazyVideo } from '../media/LazyVideo'
import { BrandIcon } from '../ui/BrandIcon'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/about', label: 'Story' },
  { to: '/contact', label: 'Contact' },
]

/** Pages built around full-bleed video keep a transparent, blend-mode header the whole way down. */
const IMMERSIVE = ['/', '/lookbook', '/about', '/shop', '/contact']

export function Header() {
  const { pathname } = useLocation()
  const { count, setCartOpen, setSearchOpen, wishlist } = useShop()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const immersive = IMMERSIVE.includes(pathname)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 160 && y > prev && !menuOpen)
  })

  useEffect(() => {
    setMenuOpen(false)
    setMega(false)
  }, [pathname])

  // Difference-blend reads on any background at the top of a page; content pages switch to a solid bar once scrolled.
  const solid = !immersive && scrolled
  const blend = !mega && !solid

  return (
    <>
      <motion.header
        className={cn('fixed inset-x-0 top-0 z-40', blend ? 'text-white mix-blend-difference' : 'text-ink')}
        animate={{ y: hidden && !mega ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onMouseLeave={() => setMega(false)}
      >
        <div
          className={cn(
            'transition-colors duration-300',
            solid && 'border-b hairline bg-bone/85 backdrop-blur-md',
            mega && 'bg-bone',
          )}
        >
          <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[72px]">
            <nav aria-label="Primary" className="flex items-center gap-1">
              <button className="-ml-2 grid size-11 place-items-center lg:hidden" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
                <Menu className="size-6" />
              </button>
              <ul className="hidden items-center gap-7 lg:flex">
                {NAV.map((n) => (
                  <li key={n.to} onMouseEnter={() => setMega(n.to === '/shop')}>
                    <NavLink
                      to={n.to}
                      onFocus={() => setMega(n.to === '/shop')}
                      className={({ isActive }) =>
                        cn('relative py-2 text-[13px] font-semibold uppercase tracking-[0.14em] after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100', isActive && 'after:scale-x-100')
                      }
                    >
                      {n.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <Link to="/" className="font-display text-[30px] leading-none tracking-[0.02em] md:text-[34px]" aria-label={`${SITE.name} home`}>
              {SITE.name}
              <sup className="ml-0.5 align-super text-[10px] font-semibold not-italic">®</sup>
            </Link>

            <div className="flex items-center justify-end gap-0.5 md:gap-2">
              <button onClick={() => setSearchOpen(true)} className="grid size-11 place-items-center" aria-label="Search">
                <Search className="size-[21px]" />
              </button>
              <Link to="/wishlist" className="relative hidden size-11 place-items-center sm:grid" aria-label={`Wishlist, ${wishlist.length} items`}>
                <Heart className="size-[21px]" />
                {wishlist.length > 0 && <span className="absolute top-2 right-1.5 text-[10px] font-bold">{wishlist.length}</span>}
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="flex h-11 items-center gap-1 pl-2 text-[13px] font-semibold uppercase tracking-[0.14em]"
                aria-label={`Open bag, ${count} items`}
              >
                Bag<span className="tabular-nums">({count})</span>
              </button>
            </div>
          </div>
        </div>

        <MegaMenu open={mega} onClose={() => setMega(false)} />
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState<Category>('tees')
  const cat = CATEGORIES.find((c) => c.id === active)!
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="hidden overflow-hidden border-b hairline bg-bone lg:block"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="container-x grid grid-cols-12 gap-8 py-10">
            <div className="col-span-3">
              <p className="eyebrow text-muted">Categories</p>
              <ul className="mt-4 space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/shop?category=${c.id}`}
                      onMouseEnter={() => setActive(c.id)}
                      onFocus={() => setActive(c.id)}
                      onClick={onClose}
                      className={cn('font-display block text-4xl transition-colors', active === c.id ? 'text-ink' : 'text-fog hover:text-ink')}
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-3 flex flex-col justify-between">
              <div>
                <p className="eyebrow text-muted">Edit</p>
                <ul className="mt-4 space-y-2 text-[15px] font-medium">
                  <li><Link to="/shop?sort=new" onClick={onClose} className="hover:underline">New arrivals</Link></li>
                  <li><Link to="/shop?gender=men" onClick={onClose} className="hover:underline">Men</Link></li>
                  <li><Link to="/shop?gender=women" onClick={onClose} className="hover:underline">Women</Link></li>
                  <li><Link to="/shop?gender=unisex" onClick={onClose} className="hover:underline">Unisex</Link></li>
                  <li><Link to="/lookbook" onClick={onClose} className="hover:underline">Lookbook — SS26</Link></li>
                </ul>
              </div>
              <p className="max-w-[26ch] text-sm text-muted">{cat.blurb}</p>
            </div>
            <Link to={`/shop?category=${cat.id}`} onClick={onClose} className="group relative col-span-6 aspect-[16/8] overflow-hidden rounded-2xl bg-ink" data-cursor="Shop">
              <AnimatePresence mode="popLayout">
                <motion.div key={cat.id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                  <LazyVideo clip={cat.video} quality="sd" eager className="size-full object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/70 to-transparent p-6 text-bone">
                <span className="font-display text-6xl">{cat.label}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold">
                  Shop all <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useScrollLock(open)
  const links = [{ to: '/', label: 'Home' }, ...NAV, { to: '/wishlist', label: 'Wishlist' }, { to: '/faq', label: 'Help' }]
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink text-bone"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          data-lenis-prevent
        >
          <div className="container-x flex h-16 items-center justify-between">
            <span className="font-display text-[30px]">{SITE.name}</span>
            <button onClick={onClose} aria-label="Close menu" className="-mr-2 grid size-11 place-items-center">
              <X className="size-6" />
            </button>
          </div>
          <nav className="container-x mt-4 flex-1" aria-label="Mobile">
            <ul>
              {links.map((l, i) => (
                <li key={l.to} className="overflow-hidden border-b hairline-light">
                  <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                    <NavLink to={l.to} onClick={onClose} className={({ isActive }) => cn('font-display flex items-center justify-between py-3 text-[13vw] leading-[0.95]', isActive ? 'text-signal' : 'text-bone')}>
                      {l.label}
                      <ArrowUpRight className="size-6 opacity-60" />
                    </NavLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-4 gap-2 pb-4">
              {CATEGORIES.slice(0, 8).map((c) => (
                <Link key={c.id} to={`/shop?category=${c.id}`} onClick={onClose} className="rounded-full border hairline-light py-2 text-center text-xs font-semibold">
                  {c.label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="container-x pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <a href={waLink(`Hi ${SITE.name}! I'd like some help choosing.`)} target="_blank" rel="noopener noreferrer" className="flex h-14 items-center justify-center gap-2 rounded-full bg-wa font-semibold text-ink">
              <BrandIcon name="whatsapp" /> Chat & order on WhatsApp
            </a>
            <div className="mt-4 flex items-center justify-center gap-6 text-bone/70">
              <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><BrandIcon name="instagram" /></a>
              <a href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><BrandIcon name="youtube" /></a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
