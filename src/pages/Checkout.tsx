import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Lock, ShoppingBag, Trash2 } from 'lucide-react'
import { BrandIcon } from '../components/ui/BrandIcon'
import { Button, ButtonLink, PageHeader, QtyStepper, WhatsAppButton } from '../components/ui/primitives'
import { SITE, type PaymentOption } from '../config/site'
import { img } from '../data/products'
import { cn, money } from '../lib/format'
import { newOrderId, openWhatsApp, orderMessage, waLink, type Order, type OrderCustomer } from '../lib/whatsapp'
import { useShop } from '../store/shop'
import { useDocumentTitle } from './shared'

/* ───────────────────────── Cart page ───────────────────────── */

export function CartPage() {
  const { cart, subtotal, shipping, total, updateQty, removeFromCart } = useShop()
  useDocumentTitle('Your bag')
  const remaining = Math.max(0, SITE.freeShippingThreshold - subtotal)

  return (
    <>
      <PageHeader eyebrow="Your bag" title={cart.length ? `${cart.reduce((s, l) => s + l.qty, 0)} pieces` : 'Bag is empty'} />
      <div className="container-x pb-28">
        {cart.length === 0 ? (
          <div className="rounded-3xl border hairline p-12 text-center">
            <ShoppingBag className="mx-auto size-10 text-fog" />
            <p className="mt-4 text-lg font-semibold">Nothing here yet</p>
            <ButtonLink to="/shop" className="mt-6">Shop the drop</ButtonLink>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            <ul className="divide-y divide-ink/10 border-y hairline lg:col-span-8">
              {cart.map((l) => (
                <li key={l.key} className="flex gap-4 py-6 md:gap-6">
                  <Link to={`/product/${l.product.slug}`} className="w-24 shrink-0 overflow-hidden rounded-xl bg-sand md:w-32">
                    <img src={img(l.product.images[0], 320)} alt="" className="aspect-[4/5] size-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link to={`/product/${l.product.slug}`} className="text-lg font-semibold hover:underline">{l.product.name}</Link>
                        <p className="text-sm text-muted">{l.color} · Size {l.size} · {money(l.product.price)} each</p>
                      </div>
                      <p className="font-semibold tabular-nums">{money(l.product.price * l.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <QtyStepper size="sm" value={l.qty} onChange={(v) => updateQty(l.key, v)} />
                      <button onClick={() => removeFromCart(l.key)} className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
                        <Trash2 className="size-4" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="lg:col-span-4">
              <div className="sticky top-24 rounded-3xl bg-paper p-6">
                <h2 className="text-lg font-semibold">Summary</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{money(subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="tabular-nums">{shipping ? money(shipping) : 'Free'}</dd></div>
                  <div className="flex justify-between border-t hairline pt-3 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{money(total)}</dd></div>
                </dl>
                {remaining > 0 && <p className="mt-3 text-xs text-muted">Add {money(remaining)} more for free shipping.</p>}
                <ButtonLink to="/checkout" variant="wa" className="mt-6 w-full">
                  <BrandIcon name="whatsapp" className="size-[18px]" /> Checkout on WhatsApp
                </ButtonLink>
                <p className="mt-4 flex items-start gap-2 text-xs text-muted">
                  <Lock className="mt-0.5 size-3.5 shrink-0" /> No card details needed. Your order is sent to our team on WhatsApp — pay by Cash on Delivery or UPI after we confirm.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}

/* ───────────────────────── Checkout (WhatsApp) ───────────────────────── */

const STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu', 'Lakshadweep']

type Errors = Partial<Record<keyof OrderCustomer, string>>

export function CheckoutPage() {
  const { cart, subtotal, shipping, total, saveOrder } = useShop()
  const navigate = useNavigate()
  useDocumentTitle('Checkout')
  const [form, setForm] = useState<OrderCustomer>(() => {
    try {
      const saved = localStorage.getItem('vestra:customer')
      if (saved) return { ...JSON.parse(saved), notes: '' }
    } catch {
      /* ignore */
    }
    return { name: '', phone: '', address: '', city: '', state: '', pincode: '', payment: 'Cash on Delivery', notes: '' }
  })
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (cart.length === 0) navigate('/cart', { replace: true })
  }, [cart.length, navigate])

  const set = <K extends keyof OrderCustomer>(k: K, v: OrderCustomer[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = () => {
    const e: Errors = {}
    if (form.name.trim().length < 2) e.name = 'Please enter your full name.'
    if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid 10-digit mobile number.'
    if (form.address.trim().length < 8) e.address = 'Please enter your full address (house, street, area).'
    if (form.city.trim().length < 2) e.city = 'Enter your city.'
    if (!form.state) e.state = 'Select your state.'
    if (!/^[1-9][0-9]{5}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode.'
    setErrors(e)
    return e
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const found = validate()
    const firstInvalid = (['name', 'phone', 'address', 'city', 'state', 'pincode'] as const).find((k) => found[k])
    if (firstInvalid) {
      document.getElementById(`co-${firstInvalid}`)?.focus()
      return
    }
    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      lines: cart.map((l) => ({ name: l.product.name, color: l.color, size: l.size, qty: l.qty, price: l.product.price, slug: l.product.slug })),
      subtotal,
      shipping,
      total,
      customer: { ...form, name: form.name.trim(), address: form.address.trim(), city: form.city.trim() },
    }
    try {
      const { notes: _notes, ...remember } = order.customer
      localStorage.setItem('vestra:customer', JSON.stringify(remember))
    } catch {
      /* ignore */
    }
    saveOrder(order)
    openWhatsApp(orderMessage(order))
    navigate('/order-sent', { state: { fresh: true } })
  }

  const field = (k: keyof OrderCustomer, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`co-${k}`} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={`co-${k}`}
        className="field"
        value={form[k] as string}
        onChange={(e) => set(k, e.target.value as never)}
        aria-invalid={Boolean(errors[k])}
        aria-describedby={errors[k] ? `co-${k}-err` : undefined}
        {...props}
      />
      {errors[k] && (
        <p id={`co-${k}-err`} className="mt-1.5 text-sm text-[#c2410c]">
          {errors[k]}
        </p>
      )}
    </div>
  )

  return (
    <div className="container-x pt-28 pb-28 md:pt-32">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Back to bag
      </Link>
      <h1 className="font-display mt-4 text-[clamp(3.5rem,10vw,8rem)]">Checkout</h1>
      <ol className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        <li className="font-semibold text-ink">1. Delivery details</li>
        <li aria-hidden>→</li>
        <li>2. Send order on WhatsApp</li>
        <li aria-hidden>→</li>
        <li>3. We confirm & ship</li>
      </ol>

      <form onSubmit={submit} noValidate className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <div className="grid gap-5 sm:grid-cols-2">
            {field('name', 'Full name', { autoComplete: 'name', required: true })}
            {field('phone', 'Mobile (WhatsApp)', { autoComplete: 'tel', inputMode: 'tel', placeholder: '98xxxxxxxx', required: true })}
          </div>
          {field('address', 'Address', { autoComplete: 'street-address', placeholder: 'House no., building, street, area', required: true })}
          <div className="grid gap-5 sm:grid-cols-3">
            {field('city', 'City', { autoComplete: 'address-level2', required: true })}
            <div>
              <label htmlFor="co-state" className="mb-1.5 block text-sm font-semibold">State</label>
              <select
                id="co-state"
                className="field"
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
                aria-invalid={Boolean(errors.state)}
                aria-describedby={errors.state ? 'co-state-err' : undefined}
                autoComplete="address-level1"
              >
                <option value="">Select</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {errors.state && <p id="co-state-err" className="mt-1.5 text-sm text-[#c2410c]">{errors.state}</p>}
            </div>
            {field('pincode', 'Pincode', { autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 6, required: true })}
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Payment preference</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {SITE.paymentOptions.map((opt: PaymentOption) => (
                <label key={opt} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition', form.payment === opt ? 'border-ink bg-ink text-bone' : 'hairline hover:border-ink')}>
                  <input type="radio" name="payment" value={opt} checked={form.payment === opt} onChange={() => set('payment', opt)} className="sr-only" />
                  <span className={cn('grid size-4 place-items-center rounded-full border', form.payment === opt ? 'border-bone' : 'border-ink/40')}>
                    {form.payment === opt && <Check className="size-3" />}
                  </span>
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="co-notes" className="mb-1.5 block text-sm font-semibold">
              Note <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea id="co-notes" rows={3} className="field resize-none" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Landmark, gift note, preferred delivery time…" />
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl bg-ink p-6 text-bone md:p-8">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <ul className="mt-5 max-h-[38vh] space-y-4 overflow-y-auto pr-1" data-lenis-prevent>
              {cart.map((l) => (
                <li key={l.key} className="flex items-center gap-3">
                  <span className="relative">
                    <img src={img(l.product.images[0], 160)} alt="" className="size-14 rounded-lg object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-bone text-[11px] font-bold text-ink">{l.qty}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{l.product.name}</span>
                    <span className="text-xs text-bone/60">{l.color} · {l.size}</span>
                  </span>
                  <span className="text-sm tabular-nums">{money(l.product.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 border-t hairline-light pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-bone/60">Subtotal</dt><dd className="tabular-nums">{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-bone/60">Shipping</dt><dd className="tabular-nums">{shipping ? money(shipping) : 'Free'}</dd></div>
              <div className="flex justify-between pt-2 text-lg font-semibold"><dt>Total</dt><dd className="tabular-nums">{money(total)}</dd></div>
            </dl>
            <WhatsAppButton type="submit" className="mt-6 h-14 w-full text-base">
              Send order on WhatsApp
            </WhatsAppButton>
            <p className="mt-4 text-xs leading-relaxed text-bone/60">
              Tapping the button opens WhatsApp with your full order pre-written to {SITE.whatsappDisplay}. Just hit send — we’ll confirm stock, delivery date and payment in the chat. Nothing is charged online.
            </p>
          </div>
        </aside>
      </form>
    </div>
  )
}

/* ───────────────────────── Order sent ───────────────────────── */

export function OrderSentPage() {
  const { lastOrder, clearCart } = useShop()
  const fresh = Boolean((useLocation().state as { fresh?: boolean } | null)?.fresh)
  useDocumentTitle('Order sent')
  // Empty the bag only when arriving straight from checkout (not on a later revisit).
  useEffect(() => {
    if (fresh && lastOrder) clearCart()
  }, [fresh, lastOrder, clearCart])

  if (!lastOrder)
    return (
      <div className="container-x pt-40 pb-28 text-center">
        <p className="text-lg">No recent order found.</p>
        <ButtonLink to="/shop" className="mt-6">Shop now</ButtonLink>
      </div>
    )

  const o = lastOrder
  return (
    <div className="container-x pt-32 pb-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-wa text-ink">
          <BrandIcon name="whatsapp" className="size-8" />
        </span>
        <p className="eyebrow mt-6 text-muted">Order {o.id}</p>
        <h1 className="font-display mt-3 text-[clamp(3.5rem,10vw,7.5rem)]">One last tap</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          WhatsApp has opened with your order pre-written. <b className="text-ink">Hit send</b> and our team will confirm stock, delivery date and payment — usually within the hour ({SITE.hours}).
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={waLink(orderMessage(o))} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center gap-2 rounded-full bg-wa px-7 font-semibold text-ink">
            <BrandIcon name="whatsapp" /> Didn’t open? Send again
          </a>
          <ButtonLink to="/shop" variant="outline" className="h-14 px-7">Keep shopping</ButtonLink>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-2xl rounded-3xl bg-paper p-6 md:p-8">
        <h2 className="font-semibold">What we received</h2>
        <ul className="mt-4 divide-y divide-ink/10">
          {o.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-4 py-3 text-sm">
              <span>{l.name} — {l.color} / {l.size} × {l.qty}</span>
              <span className="tabular-nums">{money(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t hairline pt-3 font-semibold">
          <span>Total ({o.customer.payment})</span>
          <span className="tabular-nums">{money(o.total)}</span>
        </div>
        <p className="mt-4 text-sm text-muted">
          Delivering to {o.customer.name}, {o.customer.address}, {o.customer.city}, {o.customer.state} – {o.customer.pincode}
        </p>
      </div>
      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={() => openWhatsApp(`Hi ${SITE.name}! Checking on my order ${o.id}.`)}>Track this order on WhatsApp</Button>
      </div>
    </div>
  )
}
