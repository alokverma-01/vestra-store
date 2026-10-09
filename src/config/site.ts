/**
 * Store configuration — edit this file to make the store yours.
 *
 * WHATSAPP: set `whatsappNumber` to your WhatsApp Business number in full
 * international format, digits only (country code + number, no "+", spaces or dashes).
 * Example for India: "919812345678".
 */
export const SITE = {
  name: 'VESTRA',
  legalName: 'Vestra Studio',
  tagline: 'Garments in motion',
  description:
    'A motion-first clothing label. Every piece is filmed, not rendered — so what you see is exactly what arrives.',

  // ─── WhatsApp ordering ────────────────────────────────────────────
  whatsappNumber: '910000000000', // ← REPLACE with your number (digits only)
  whatsappDisplay: '+91 00000 00000', // ← how the number is shown on the site

  // ─── Contact ──────────────────────────────────────────────────────
  email: 'hello@vestra.studio',
  studio: 'Studio 04, Mumbai, India',
  hours: 'Mon – Sat · 10:00 – 20:00 IST',
  instagramHandle: '@vestra.studio',
  instagramUrl: 'https://www.instagram.com/',
  youtubeUrl: 'https://www.youtube.com/',

  // ─── Commerce rules ───────────────────────────────────────────────
  currency: { code: 'INR', locale: 'en-IN' },
  freeShippingThreshold: 2999,
  shippingFee: 99,
  returnDays: 7,
  dispatchDays: '24–48 hours',
  deliveryDays: [3, 6] as const,
  orderPrefix: 'VST',
  paymentOptions: ['Cash on Delivery', 'UPI (pay on confirmation)', 'Bank transfer'] as const,

  // ─── Next drop (countdown on the home page) ───────────────────────
  nextDrop: {
    name: 'Drop 02 — Weightless',
    date: '2026-11-14T19:00:00+05:30',
  },
} as const

export type PaymentOption = (typeof SITE.paymentOptions)[number]
