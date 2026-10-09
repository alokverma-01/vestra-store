import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { Banknote, Check, Heart, MapPin, RotateCcw, Ruler, Truck } from 'lucide-react'
import { LazyVideo } from '../components/media/LazyVideo'
import { ProductCard } from '../components/product/ProductCard'
import { SizeGuideModal } from '../components/product/SizeGuide'
import { BrandIcon } from '../components/ui/BrandIcon'
import { Accordion, Button, Price, QtyStepper, RevealText, WhatsAppButton } from '../components/ui/primitives'
import { SITE } from '../config/site'
import { CLIPS } from '../data/media'
import { PRODUCTS, categoryLabel, getProduct, img, imgSrcSet } from '../data/products'
import { cn, deliveryWindow, money } from '../lib/format'
import { openWhatsApp, productOrderMessage, productQuestionMessage } from '../lib/whatsapp'
import { useShop } from '../store/shop'
import NotFound from './NotFound'
import { useDocumentTitle } from './shared'

export default function ProductPage() {
  const { slug = '' } = useParams()
  const p = getProduct(slug)
  if (!p) return <NotFound />
  return <ProductView key={p.id} slug={slug} />
}

function ProductView({ slug }: { slug: string }) {
  const p = getProduct(slug)!
  const { addToCart, toggleWishlist, isWished } = useShop()
  const [color, setColor] = useState(p.colors[0].name)
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [guide, setGuide] = useState(false)
  const [slide, setSlide] = useState(0)
  const buyRef = useRef<HTMLDivElement>(null)
  const buyVisible = useInView(buyRef, { margin: '0px 0px -10% 0px' })
  const isBottom = p.category === 'denim' || p.category === 'bottoms'
  useDocumentTitle(p.name, p.short)

  const media = useMemo(
    () => [
      { kind: 'video' as const, key: 'v' },
      { kind: 'image' as const, key: 'i0', id: p.images[0] },
      { kind: 'image' as const, key: 'i1', id: p.images[1] },
    ],
    [p],
  )
  const related = useMemo(() => {
    const same = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category)
    const rest = PRODUCTS.filter((x) => x.id !== p.id && x.category !== p.category && x.featured)
    return [...same, ...rest].slice(0, 4)
  }, [p])

  const requireSize = () => {
    if (!size) {
      setSizeError(true)
      document.getElementById('size-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }
  const onAdd = () => requireSize() && addToCart(p.id, size, color, qty)
  const onWhatsApp = () => openWhatsApp(productOrderMessage(p, { size: size || undefined, color, qty }))
  const wished = isWished(p.id)

  return (
    <>
      <div className="container-x pt-20 md:pt-24">
        <nav aria-label="Breadcrumb" className="py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          <Link to="/" className="hover:text-ink">Home</Link> / <Link to="/shop" className="hover:text-ink">Shop</Link> /{' '}
          <Link to={`/shop?category=${p.category}`} className="hover:text-ink">{categoryLabel(p.category)}</Link>
        </nav>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Gallery — mobile carousel */}
          <div className="-mx-4 lg:hidden">
            <div
              className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
              onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
            >
              {media.map((m) => (
                <div key={m.key} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-sand">
                  {m.kind === 'video' ? (
                    <LazyVideo clip={p.video} eager className="size-full object-cover" label={`${p.name} filmed in motion`} />
                  ) : (
                    <img src={img(m.id, 900)} srcSet={imgSrcSet(m.id)} sizes="100vw" alt={`${p.name} — view`} className="size-full object-cover" />
                  )}
                  {m.kind === 'video' && <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-bone">● Real footage</span>}
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-center gap-1.5">
              {media.map((m, i) => (
                <span key={m.key} className={cn('h-1 rounded-full transition-all', i === slide ? 'w-6 bg-ink' : 'w-2 bg-ink/20')} />
              ))}
            </div>
          </div>

          {/* Gallery — desktop editorial stack */}
          <div className="hidden gap-2 lg:col-span-7 lg:grid lg:grid-cols-2">
            <div className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-2xl bg-sand xl:aspect-[5/5]">
              <LazyVideo clip={p.video} eager className="size-full object-cover" label={`${p.name} filmed in motion`} />
              <span className="absolute top-5 left-5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-bone backdrop-blur">● Real footage — {CLIPS[p.video].title}</span>
            </div>
            {p.images.map((id, i) => (
              <div key={id} className="aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
                <img src={img(id, 900)} srcSet={imgSrcSet(id)} sizes="30vw" alt={`${p.name} — view ${i + 1}`} loading="lazy" className="size-full object-cover transition-transform duration-[1.2s] hover:scale-[1.04]" />
              </div>
            ))}
          </div>

          {/* Buy box */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              {p.badge && <span className="inline-block rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-bone">{p.badge}</span>}
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{p.name}</h1>
              <Price value={p.price} compareAt={p.compareAt} className="mt-2 text-xl font-semibold" />
              <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
              <p className="mt-4 text-[15px] text-muted">{p.short}</p>

              <div className="mt-7">
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Colour — <span className="text-muted">{color}</span>
                </p>
                <div className="mt-3 flex gap-2.5">
                  {p.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      aria-pressed={color === c.name}
                      className={cn('size-10 rounded-full ring-1 ring-ink/15 ring-offset-2 ring-offset-bone transition', color === c.name && 'ring-2 ring-ink')}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-7" id="size-picker">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    Size {size && <span className="text-muted">— {size}</span>}
                  </p>
                  <button onClick={() => setGuide(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-4">
                    <Ruler className="size-3.5" /> Size guide
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-6 gap-2" role="radiogroup" aria-label="Select size">
                  {p.sizes.map((s) => {
                    const out = p.soldOut?.includes(s)
                    return (
                      <button
                        key={s}
                        role="radio"
                        aria-checked={size === s}
                        disabled={out}
                        onClick={() => {
                          setSize(s)
                          setSizeError(false)
                        }}
                        className={cn(
                          'h-12 rounded-xl border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:text-fog disabled:line-through',
                          size === s ? 'border-ink bg-ink text-bone' : sizeError ? 'border-signal' : 'hairline hover:border-ink',
                        )}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
                <AnimatePresence>
                  {sizeError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-sm font-medium text-signal" role="alert">
                      Please choose a size first.
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="mt-3 text-xs text-muted">{p.fit}</p>
              </div>

              <div ref={buyRef} className="mt-7 flex gap-2">
                <QtyStepper value={qty} onChange={setQty} />
                <Button className="flex-1" onClick={onAdd}>
                  Add to bag — {money(p.price * qty)}
                </Button>
                <button
                  onClick={() => toggleWishlist(p.id)}
                  aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-pressed={wished}
                  className="grid size-12 shrink-0 place-items-center rounded-full border hairline hover:border-ink"
                >
                  <Heart className={cn('size-5', wished && 'fill-signal text-signal')} />
                </button>
              </div>
              <WhatsAppButton className="mt-2 w-full" onClick={onWhatsApp}>
                Order on WhatsApp — confirm in chat
              </WhatsAppButton>

              <PincodeCheck />

              <ul className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { icon: Truck, t: `Free over ${money(SITE.freeShippingThreshold)}` },
                  { icon: Banknote, t: 'Cash on Delivery' },
                  { icon: RotateCcw, t: `${SITE.returnDays}-day returns` },
                ].map(({ icon: Icon, t }) => (
                  <li key={t} className="rounded-xl bg-paper px-2 py-3">
                    <Icon className="mx-auto size-5" strokeWidth={1.6} />
                    <span className="mt-1.5 block font-medium">{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Accordion
                  items={[
                    { title: 'Description', content: <p>{p.description}</p> },
                    {
                      title: 'Details & fabric',
                      content: (
                        <>
                          <ul className="list-disc space-y-1 pl-5">
                            {p.details.map((d) => <li key={d}>{d}</li>)}
                          </ul>
                          <p className="mt-3"><b className="text-ink">Fabric:</b> {p.fabric}</p>
                          <p className="mt-1"><b className="text-ink">Care:</b> {p.care.join(' · ')}</p>
                        </>
                      ),
                    },
                    {
                      title: 'Shipping & returns',
                      content: (
                        <p>
                          Dispatched in {SITE.dispatchDays}. Delivered in {SITE.deliveryDays[0]}–{SITE.deliveryDays[1]} business days across India. Free shipping over{' '}
                          {money(SITE.freeShippingThreshold)}, otherwise {money(SITE.shippingFee)}. {SITE.returnDays}-day returns and exchanges — just message us on WhatsApp.{' '}
                          <Link to="/shipping-returns" className="font-semibold text-ink underline underline-offset-4">Full policy</Link>
                        </p>
                      ),
                    },
                  ]}
                />
                <button onClick={() => openWhatsApp(productQuestionMessage(p))} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">
                  <BrandIcon name="whatsapp" className="size-4" /> Ask a question about this piece
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-bleed film */}
      <section className="relative mt-24 h-[80svh] overflow-hidden bg-ink text-bone md:mt-32" aria-label={`${p.name} in motion`}>
        <LazyVideo clip={p.video} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="container-x relative flex h-full flex-col justify-end pb-12">
          <p className="eyebrow text-bone/70">See it move</p>
          <h2 className="font-display mt-3 text-[clamp(3.5rem,11vw,10rem)]">{p.name}</h2>
        </div>
      </section>

      <section className="container-x py-24 md:py-32" aria-labelledby="related-title">
        <RevealText as="h2" text="Complete the look" className="font-display text-[clamp(3rem,8vw,7rem)]" />
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
          {related.map((r) => <ProductCard key={r.id} product={r} />)}
        </div>
      </section>

      {/* Sticky mobile buy bar */}
      <AnimatePresence>
        {!buyVisible && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-30 border-t hairline bg-bone/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted">{size ? `${color} · ${size}` : 'Select a size'} · {money(p.price)}</p>
              </div>
              <Button className="h-11 px-5" onClick={onAdd}>Add</Button>
              <button onClick={onWhatsApp} aria-label="Order on WhatsApp" className="grid size-11 place-items-center rounded-full bg-wa text-ink">
                <BrandIcon name="whatsapp" className="size-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SizeGuideModal open={guide} onClose={() => setGuide(false)} bottoms={isBottom} />
    </>
  )
}

function PincodeCheck() {
  const [pin, setPin] = useState('')
  const [result, setResult] = useState<null | { ok: boolean; text: string }>(null)
  useEffect(() => setResult(null), [pin])
  const check = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[1-9][0-9]{5}$/.test(pin)) return setResult({ ok: false, text: 'Enter a valid 6-digit pincode.' })
    const w = deliveryWindow()
    setResult({ ok: true, text: `Estimated delivery ${w.start} – ${w.end}. Cash on Delivery available.` })
  }
  return (
    <form onSubmit={check} className="mt-6 rounded-2xl border hairline p-4">
      <label htmlFor="pincode" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <MapPin className="size-4" /> Check delivery
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id="pincode"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="Pincode"
          className="field h-11 py-0"
          aria-describedby="pincode-result"
        />
        <Button type="submit" variant="outline" className="h-11 px-5">Check</Button>
      </div>
      <p id="pincode-result" className={cn('mt-2 min-h-5 text-sm', result?.ok ? 'text-ink' : 'text-signal')} aria-live="polite">
        {result && (
          <span className="inline-flex items-start gap-1.5">
            {result.ok && <Check className="mt-0.5 size-4 shrink-0" />}
            {result.text}
          </span>
        )}
      </p>
    </form>
  )
}
