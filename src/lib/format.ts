import { SITE } from '../config/site'

const currency = new Intl.NumberFormat(SITE.currency.locale, {
  style: 'currency',
  currency: SITE.currency.code,
  maximumFractionDigits: 0,
})

export const money = (n: number) => currency.format(n)

export const cn = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

export const pad = (n: number, len = 2) => String(n).padStart(len, '0')

/** Delivery window from today, skipping Sundays. */
export function deliveryWindow(from = new Date()) {
  const addBusinessDays = (d: Date, days: number) => {
    const out = new Date(d)
    let added = 0
    while (added < days) {
      out.setDate(out.getDate() + 1)
      if (out.getDay() !== 0) added++
    }
    return out
  }
  const fmt = new Intl.DateTimeFormat(SITE.currency.locale, { weekday: 'short', day: 'numeric', month: 'short' })
  return {
    start: fmt.format(addBusinessDays(from, SITE.deliveryDays[0])),
    end: fmt.format(addBusinessDays(from, SITE.deliveryDays[1])),
  }
}
