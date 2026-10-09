import { SITE, type PaymentOption } from '../config/site'
import type { Product } from '../data/products'
import { money, pad } from './format'

export const waLink = (text: string) => `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`

export const openWhatsApp = (text: string) => {
  window.open(waLink(text), '_blank', 'noopener,noreferrer')
}

const productUrl = (p: Product) => `${window.location.origin}${import.meta.env.BASE_URL}product/${p.slug}`

/** One-tap order for a single product from the product page / quick view. */
export function productOrderMessage(p: Product, opts: { size?: string; color?: string; qty?: number }) {
  const qty = opts.qty ?? 1
  return [
    `Hi ${SITE.name}! I'd like to order:`,
    '',
    `*${p.name}*`,
    opts.color ? `Colour: ${opts.color}` : null,
    opts.size ? `Size: ${opts.size}` : 'Size: (please help me choose)',
    `Qty: ${qty}`,
    `Price: ${money(p.price * qty)}`,
    '',
    productUrl(p),
    '',
    'Please confirm availability and delivery to my pincode.',
  ]
    .filter((l) => l !== null)
    .join('\n')
}

export function productQuestionMessage(p: Product) {
  return `Hi ${SITE.name}! I have a question about the *${p.name}* (${money(p.price)}).\n${productUrl(p)}`
}

export type OrderLine = { name: string; color: string; size: string; qty: number; price: number; slug: string }

export type OrderCustomer = {
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  payment: PaymentOption
  notes?: string
}

export type Order = {
  id: string
  createdAt: string
  lines: OrderLine[]
  subtotal: number
  shipping: number
  total: number
  customer: OrderCustomer
}

export function newOrderId(d = new Date()) {
  const stamp = `${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `${SITE.orderPrefix}-${stamp}-${rand}`
}

/** Full order summary sent to the store's WhatsApp from checkout. */
export function orderMessage(o: Order) {
  const items = o.lines.map(
    (l, i) => `${i + 1}. ${l.name} — ${l.color} / ${l.size} × ${l.qty} = ${money(l.price * l.qty)}`,
  )
  const c = o.customer
  return [
    `*New order — ${SITE.name}*`,
    `Order ID: ${o.id}`,
    '',
    ...items,
    '',
    `Subtotal: ${money(o.subtotal)}`,
    `Shipping: ${o.shipping === 0 ? 'FREE' : money(o.shipping)}`,
    `*Total: ${money(o.total)}*`,
    `Payment: ${c.payment}`,
    '',
    '*Deliver to*',
    c.name,
    c.phone,
    `${c.address}, ${c.city}, ${c.state} – ${c.pincode}`,
    c.notes ? `\nNote: ${c.notes}` : null,
    '',
    'Please confirm my order. Thank you!',
  ]
    .filter((l) => l !== null)
    .join('\n')
}
