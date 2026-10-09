import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Banknote, Film, Heart, RotateCcw, Truck } from 'lucide-react'
import { LazyVideo } from '../../components/media/LazyVideo'
import { ProductCard } from '../../components/product/ProductCard'
import { BrandIcon } from '../../components/ui/BrandIcon'
import { ButtonLink, FadeIn, Magnetic, RevealText } from '../../components/ui/primitives'
import { SITE } from '../../config/site'
import type { ClipKey } from '../../data/media'
import { PRODUCTS, getProduct, img } from '../../data/products'
import { cn, money, pad } from '../../lib/format'
import { useCountdown } from '../../lib/hooks'
import { openWhatsApp, productOrderMessage, waLink } from '../../lib/whatsapp'
import { useShop } from '../../store/shop'

/* ───────────────────────── Featured grid ───────────────────────── */

const TABS = [
  { id: 'new', label: 'New in' },
  { id: 'best', label: 'Bestsellers' },
  { id: 'outer', label: 'Outerwear' },
] as const

export function FeaturedProducts() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('new')
  const items = useMemo(() => {
    if (tab === 'outer') return PRODUCTS.filter((p) => p.category === 'outerwear').slice(0, 4)
    if (tab === 'best') return PRODUCTS.filter((p) => p.featured).slice(0, 8)
    return [...PRODUCTS].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8)
  }, [tab])

  return (
    <section className="container-x pb-28 md:pb-40" aria-labelledby="featured-title">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-muted">(01) The drop</p>
          <RevealText as="h2" text="Filmed this season" className="font-display mt-4 text-[clamp(3rem,9vw,8.5rem)]" />
        </div>
        <div className="flex items-center gap-1 rounded-full border hairline p-1" role="tablist" aria-label="Filter products" id="featured-title">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn('relative h-10 rounded-full px-4 text-sm font-semibold transition-colors', tab === t.id ? 'text-bone' : 'text-ink hover:bg-ink/5')}
            >
              {tab === t.id && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:mt-14 md:gap-x-5 lg:grid-cols-4"
        >
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-14 flex justify-center">
        <Magnetic>
          <ButtonLink to="/shop" variant="outline" className="h-14 px-8">
            View all {PRODUCTS.length} pieces <ArrowRight className="size-4" />
          </ButtonLink>
        </Magnetic>
      </div>
    </section>
  )
}

/* ───────────────────────── Reels (Instagram-style shoppable) ───────────────────────── */

const REELS: { clip: ClipKey; slug: string }[] = [
  { clip: 'denimJump', slug: 'ritual-denim-jacket' },
  { clip: 'streetGirls', slug: 'night-shell-windbreaker' },
  { clip: 'gothic', slug: 'noir-slip-dress' },
  { clip: 'cropStreet', slug: 'utility-cargo-pant' },
  { clip: 'staircase', slug: 'drift-boxy-hoodie' },
  { clip: 'denimModels', slug: 'contour-wide-leg-jeans' },
  { clip: 'runwayRed', slug: 'satin-column-dress' },
  { clip: 'rack', slug: 'linen-camp-shirt' },
]

export function ReelsShop() {
  const scroller = useRef<HTMLDivElement>(null)
  const { toggleWishlist, isWished } = useShop()
  const scrollBy = (dir: number) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section className="overflow-hidden bg-bone py-28 md:py-40" aria-labelledby="reels-title">
      <div className="container-x flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow flex items-center gap-2 text-muted">
            <BrandIcon name="instagram" className="size-4" /> {SITE.instagramHandle}
          </p>
          <h2 id="reels-title" className="font-display mt-4 text-[clamp(3rem,9vw,8.5rem)]">
            Shop the <span className="font-serif font-normal normal-case italic tracking-normal">reels</span>
          </h2>
        </div>
        <div className="hidden gap-2 md:flex">
          <button onClick={() => scrollBy(-1)} aria-label="Previous reels" className="grid size-12 place-items-center rounded-full border hairline hover:bg-ink hover:text-bone">
            <ArrowLeft className="size-5" />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Next reels" className="grid size-12 place-items-center rounded-full border hairline hover:bg-ink hover:text-bone">
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      <div ref={scroller} className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 md:mt-14 md:gap-5 md:scroll-px-[3vw] md:px-[3vw]">
        {REELS.map((r) => {
          const p = getProduct(r.slug)!
          const wished = isWished(p.id)
          return (
            <article key={r.clip} className="relative aspect-[9/16] w-[68vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-graphite sm:w-[42vw] md:w-[22vw] lg:w-[17.5vw]">
              <LazyVideo clip={r.clip} quality="sd" className="absolute inset-0 size-full object-cover" label={`Reel: ${p.name}`} />
              <div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/50 to-transparent p-3 text-bone">
                <span className="grid size-7 place-items-center rounded-full bg-bone text-[10px] font-black text-ink">V</span>
                <span className="text-xs font-semibold">{SITE.instagramHandle.replace('@', '')}</span>
                <span className="ml-auto rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">Reel</span>
              </div>
              <button
                onClick={() => toggleWishlist(p.id)}
                aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-pressed={wished}
                className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-bone backdrop-blur"
              >
                <Heart className={cn('size-5', wished && 'fill-signal text-signal')} />
              </button>
              <div className="absolute inset-x-2 bottom-2 rounded-xl bg-bone/95 p-2 backdrop-blur">
                <Link to={`/product/${p.slug}`} className="flex items-center gap-2">
                  <img src={img(p.images[0], 120)} alt="" className="size-11 rounded-lg object-cover" loading="lazy" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">{p.name}</span>
                    <span className="text-xs text-muted tabular-nums">{money(p.price)}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0" />
                </Link>
                <button
                  onClick={() => openWhatsApp(productOrderMessage(p, { color: p.colors[0].name }))}
                  className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-wa text-xs font-semibold text-ink"
                >
                  <BrandIcon name="whatsapp" className="size-4" /> Order this look
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

/* ───────────────────────── Next drop countdown ───────────────────────── */

export function DropCountdown() {
  const t = useCountdown(SITE.nextDrop.date)
  const units = [
    { v: t.days, l: 'Days' },
    { v: t.hours, l: 'Hrs' },
    { v: t.minutes, l: 'Min' },
    { v: t.seconds, l: 'Sec' },
  ]
  return (
    <section className="relative overflow-hidden bg-[#e8e3d8]" aria-labelledby="drop-title">
      <LazyVideo clip="float" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#e8e3d8]/90 via-[#e8e3d8]/40 to-transparent" />
      <div className="container-x relative flex min-h-[88svh] flex-col justify-center py-24">
        <p className="eyebrow text-ink/70">Coming next</p>
        <h2 id="drop-title" className="font-display mt-4 max-w-4xl text-[clamp(3.5rem,11vw,10rem)]">
          {SITE.nextDrop.name.split('—')[0]}
          <span className="font-serif block font-normal normal-case italic tracking-normal">{SITE.nextDrop.name.split('—')[1]?.trim()}</span>
        </h2>
        <div className="mt-8 flex gap-3 md:gap-5" role="timer" aria-label="Time until the next drop">
          {units.map((u) => (
            <div key={u.l} className="w-[4.6rem] rounded-2xl bg-bone/80 py-3 text-center backdrop-blur md:w-28 md:py-5">
              <span className="font-display block text-4xl tabular-nums md:text-6xl">{pad(u.v)}</span>
              <span className="eyebrow text-muted">{u.l}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={waLink(`Hi ${SITE.name}! Please notify me when ${SITE.nextDrop.name} goes live.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2 rounded-full bg-ink px-7 font-semibold text-bone transition hover:bg-graphite"
          >
            <BrandIcon name="whatsapp" className="size-5" /> Notify me on WhatsApp
          </a>
          <ButtonLink to="/lookbook" variant="outline" className="h-14 px-7">
            Watch the teaser
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Promise strip ───────────────────────── */

const PROMISES = [
  { icon: Film, title: 'Filmed, not rendered', body: 'Every product page has real footage of the garment in motion.' },
  { icon: Banknote, title: 'Cash on Delivery', body: 'Pay when it arrives — anywhere in India. UPI on confirmation too.' },
  { icon: Truck, title: `Free over ₹${SITE.freeShippingThreshold.toLocaleString('en-IN')}`, body: `Dispatched in ${SITE.dispatchDays}, delivered in ${SITE.deliveryDays[0]}–${SITE.deliveryDays[1]} days.` },
  { icon: RotateCcw, title: `${SITE.returnDays}-day returns`, body: 'Wrong size? Message us on WhatsApp and we arrange a pickup.' },
]

export function Promises() {
  return (
    <section className="container-x py-20 md:py-28" aria-label="Why order from us">
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border hairline bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {PROMISES.map((p, i) => (
          <FadeIn key={p.title} delay={i * 0.06} className="bg-bone p-7 md:p-9">
            <p.icon className="size-7" strokeWidth={1.5} />
            <h3 className="mt-6 text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-[15px] text-muted">{p.body}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── Atelier teaser ───────────────────────── */

export function AtelierTeaser() {
  const p = getProduct('atelier-oxford-shirt')!
  return (
    <section className="container-x grid items-center gap-10 pb-28 md:grid-cols-12 md:pb-40" aria-labelledby="atelier-title">
      <div className="relative overflow-hidden rounded-3xl md:col-span-7">
        <LazyVideo clip="tailor" className="aspect-[16/11] w-full object-cover" label="A tailor cutting black wool in the atelier" />
        <span className="absolute top-4 left-4 rounded-full bg-bone/90 px-3 py-1.5 text-xs font-semibold backdrop-blur">● Live from the atelier</span>
      </div>
      <div className="md:col-span-5">
        <p className="eyebrow text-muted">(05) The atelier</p>
        <h2 id="atelier-title" className="font-display mt-4 text-[clamp(3rem,7vw,6.5rem)]">
          Cut by hand.
          <br />
          <span className="font-serif font-normal normal-case italic tracking-normal">Shipped by us.</span>
        </h2>
        <p className="mt-5 max-w-md text-muted">
          Small batches, pattern-cut in our studio. The cloth on that table is the {p.name} — when you order on WhatsApp, the
          person who replies works ten metres from it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/about">Our story</ButtonLink>
          <ButtonLink to={`/product/${p.slug}`} variant="outline">
            Shop the shirt
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
