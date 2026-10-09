import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Search, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import { SITE } from '../../config/site'
import { CATEGORIES, PRODUCTS, getProductById, img } from '../../data/products'
import { useShop } from '../../store/shop'
import { useScrollLock } from '../../lib/smooth'
import { cn, money } from '../../lib/format'
import { openWhatsApp, productOrderMessage } from '../../lib/whatsapp'
import { Button, Price, QtyStepper, WhatsAppButton } from '../ui/primitives'

const ease = [0.16, 1, 0.3, 1] as const

function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])
}

function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      aria-hidden
    />
  )
}

/* ───────────────────────── Cart drawer ───────────────────────── */

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, subtotal, shipping, total, updateQty, removeFromCart, count } = useShop()
  const navigate = useNavigate()
  const close = () => setCartOpen(false)
  useScrollLock(cartOpen)
  useEscape(cartOpen, close)
  const remaining = Math.max(0, SITE.freeShippingThreshold - subtotal)
  const pct = Math.min(100, (subtotal / SITE.freeShippingThreshold) * 100)

  const quickWhatsApp = () => {
    const lines = cart.map((l, i) => `${i + 1}. ${l.product.name} — ${l.color} / ${l.size} × ${l.qty} = ${money(l.product.price * l.qty)}`)
    openWhatsApp(
      [`Hi ${SITE.name}! I'd like to order:`, '', ...lines, '', `Subtotal: ${money(subtotal)}`, `Shipping: ${shipping ? money(shipping) : 'FREE'}`, `*Total: ${money(total)}*`, '', 'I’ll share my delivery address here.'].join('\n'),
    )
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <Backdrop onClick={close} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col bg-bone"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center justify-between border-b hairline px-5 py-4">
              <h2 className="text-lg font-semibold">
                Bag <span className="text-muted">({count})</span>
              </h2>
              <button onClick={close} aria-label="Close bag" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                <X className="size-5" />
              </button>
            </div>

            {cart.length > 0 && (
              <div className="border-b hairline px-5 py-3">
                <p className="flex items-center gap-2 text-sm">
                  <Truck className="size-4" />
                  {remaining > 0 ? (
                    <span>
                      You’re <b>{money(remaining)}</b> away from free shipping
                    </span>
                  ) : (
                    <span>You’ve unlocked <b>free shipping</b></span>
                  )}
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
                  <motion.div className="h-full bg-ink" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease }} />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5" data-lenis-prevent>
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <ShoppingBag className="size-10 text-fog" />
                  <p className="text-lg font-semibold">Your bag is empty</p>
                  <p className="max-w-xs text-sm text-muted">Every piece is filmed before it’s sold. Find something that moves you.</p>
                  <Button onClick={() => { close(); navigate('/shop') }}>Shop the drop</Button>
                </div>
              ) : (
                <ul className="divide-y divide-ink/10">
                  {cart.map((l) => (
                    <li key={l.key} className="flex gap-4 py-5">
                      <Link to={`/product/${l.product.slug}`} onClick={close} className="w-20 shrink-0 overflow-hidden rounded-lg bg-sand">
                        <img src={img(l.product.images[0], 240)} alt="" className="aspect-[4/5] size-full object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link to={`/product/${l.product.slug}`} onClick={close} className="truncate font-semibold hover:underline">
                            {l.product.name}
                          </Link>
                          <span className="shrink-0 font-semibold tabular-nums">{money(l.product.price * l.qty)}</span>
                        </div>
                        <p className="text-sm text-muted">
                          {l.color} · {l.size}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <QtyStepper size="sm" value={l.qty} onChange={(v) => updateQty(l.key, v)} />
                          <button onClick={() => removeFromCart(l.key)} className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink" aria-label={`Remove ${l.product.name}`}>
                            <Trash2 className="size-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-3 border-t hairline px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="tabular-nums">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="tabular-nums">{shipping ? money(shipping) : 'Free'}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="tabular-nums">{money(total)}</span>
                </div>
                <WhatsAppButton className="w-full" onClick={() => { close(); navigate('/checkout') }}>
                  Checkout on WhatsApp
                </WhatsAppButton>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-11" onClick={() => { close(); navigate('/cart') }}>
                    View bag
                  </Button>
                  <Button variant="ghost" className="h-11 border hairline" onClick={quickWhatsApp}>
                    Quick message
                  </Button>
                </div>
                <p className="text-center text-xs text-muted">Cash on Delivery · UPI · {SITE.returnDays}-day returns</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ───────────────────────── Search ───────────────────────── */

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop()
  const [q, setQ] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const close = () => setSearchOpen(false)
  useScrollLock(searchOpen)
  useEscape(searchOpen, close)

  useEffect(() => {
    if (searchOpen) {
      setQ('')
      window.setTimeout(() => input.current?.focus(), 80)
    }
  }, [searchOpen])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    return PRODUCTS.filter((p) =>
      [p.name, p.category, p.gender, p.short, ...p.colors.map((c) => c.name)].join(' ').toLowerCase().includes(term),
    ).slice(0, 8)
  }, [q])

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <Backdrop onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed inset-x-0 top-0 z-50 max-h-[90dvh] overflow-y-auto bg-bone pb-8"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.55, ease }}
            data-lenis-prevent
          >
            <div className="container-x pt-6">
              <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
                <Search className="size-6 shrink-0" />
                <label htmlFor="site-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="site-search"
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search hoodies, denim, black…"
                  className="w-full bg-transparent py-2 text-2xl font-semibold outline-none placeholder:text-fog md:text-4xl"
                  autoComplete="off"
                />
                <button onClick={close} aria-label="Close search" className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-ink/5">
                  <X className="size-6" />
                </button>
              </div>

              {!q && (
                <div className="mt-6">
                  <p className="eyebrow text-muted">Browse</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <Link key={c.id} to={`/shop?category=${c.id}`} onClick={close} className="rounded-full border hairline px-4 py-2 text-sm font-medium hover:bg-ink hover:text-bone">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {q && results.length === 0 && <p className="mt-8 text-muted">No pieces match “{q}”. Try “tee”, “denim” or a colour.</p>}

              {results.length > 0 && (
                <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link to={`/product/${p.slug}`} onClick={close} className="group block">
                        <div className="overflow-hidden rounded-xl bg-sand">
                          <img src={img(p.images[0], 500)} alt="" className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" />
                        </div>
                        <p className="mt-2 text-sm font-semibold">{p.name}</p>
                        <Price value={p.price} className="text-sm text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ───────────────────────── Quick add (touch) ───────────────────────── */

export function QuickAddSheet() {
  const { quickAddId, setQuickAddId, addToCart } = useShop()
  const p = quickAddId ? getProductById(quickAddId) : undefined
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const close = () => setQuickAddId(null)
  useScrollLock(Boolean(p))
  useEscape(Boolean(p), close)

  useEffect(() => {
    if (p) {
      setColor(p.colors[0].name)
      setSize('')
    }
  }, [p])

  return (
    <AnimatePresence>
      {p && (
        <>
          <Backdrop onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick add ${p.name}`}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-bone px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:inset-x-auto md:right-6 md:bottom-6 md:w-[420px] md:rounded-3xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '110%' }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/20 md:hidden" />
            <div className="flex gap-4">
              <img src={img(p.images[0], 240)} alt="" className="aspect-[4/5] w-20 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-semibold">{p.name}</p>
                <Price value={p.price} compareAt={p.compareAt} className="text-sm" />
                <Link to={`/product/${p.slug}`} onClick={close} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4">
                  Full details <ArrowRight className="size-3" />
                </Link>
              </div>
              <button onClick={close} aria-label="Close" className="grid size-9 place-items-center rounded-full hover:bg-ink/5">
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wider">Colour — <span className="text-muted">{color}</span></p>
            <div className="mt-2 flex gap-2">
              {p.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  className={cn('size-9 rounded-full ring-1 ring-ink/15 ring-offset-2 ring-offset-bone transition', color === c.name && 'ring-2 ring-ink')}
                  style={{ background: c.hex }}
                />
              ))}
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wider">Size</p>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {p.sizes.map((s) => {
                const out = p.soldOut?.includes(s)
                return (
                  <button
                    key={s}
                    disabled={out}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={cn('h-11 rounded-lg border hairline text-sm font-semibold transition disabled:text-fog disabled:line-through', size === s && 'border-ink bg-ink text-bone')}
                  >
                    {s}
                  </button>
                )
              })}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button
                disabled={!size}
                onClick={() => {
                  addToCart(p.id, size, color)
                  close()
                }}
              >
                {size ? 'Add to bag' : 'Select a size'}
              </Button>
              <WhatsAppButton className="px-3" onClick={() => openWhatsApp(productOrderMessage(p, { size, color, qty: 1 }))}>
                WhatsApp
              </WhatsAppButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ───────────────────────── Toasts ───────────────────────── */

export function Toasts() {
  const { toasts, setCartOpen } = useShop()
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[58] flex flex-col gap-2 md:bottom-6 md:left-6" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease }}
            className="pointer-events-auto flex w-[min(340px,calc(100vw-2rem))] items-center gap-3 rounded-2xl bg-ink p-2.5 pr-4 text-bone shadow-2xl"
          >
            {t.image && <img src={img(t.image, 120)} alt="" className="size-12 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.body && <p className="truncate text-xs text-bone/70">{t.body}</p>}
            </div>
            {t.title === 'Added to bag' && (
              <button onClick={() => setCartOpen(true)} className="text-xs font-semibold underline underline-offset-4">
                View
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
