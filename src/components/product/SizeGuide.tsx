import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useScrollLock } from '../../lib/smooth'

export const TOPS_CHART = {
  head: ['Size', 'Chest (in)', 'Length (in)', 'Shoulder (in)'],
  rows: [
    ['XS', '42', '26', '20'],
    ['S', '44', '27', '21'],
    ['M', '46', '28', '22'],
    ['L', '48', '29', '23'],
    ['XL', '50', '30', '24'],
    ['XXL', '52', '31', '25'],
  ],
}
export const BOTTOMS_CHART = {
  head: ['Waist', 'Waist (in)', 'Hip (in)', 'Inseam (in)'],
  rows: [
    ['26', '26–27', '36', '32'],
    ['28', '28–29', '38', '32'],
    ['30', '30–31', '40', '32'],
    ['32', '32–33', '42', '32'],
    ['34', '34–35', '44', '32'],
    ['36', '36–37', '46', '32'],
    ['38', '38–39', '48', '32'],
  ],
}

export function SizeTable({ chart, caption }: { chart: typeof TOPS_CHART; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border hairline">
      <table className="w-full min-w-[420px] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-ink text-bone">
          <tr>
            {chart.head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/10">
          {chart.rows.map((r) => (
            <tr key={r[0]} className="odd:bg-paper">
              {r.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-4 py-3 font-semibold">{c}</th>
                ) : (
                  <td key={i} className="px-4 py-3 tabular-nums text-muted">{c}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SizeGuideModal({ open, onClose, bottoms }: { open: boolean; onClose: () => void; bottoms?: boolean }) {
  useScrollLock(open)
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-bone p-6 md:inset-auto md:top-1/2 md:left-1/2 md:w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-5xl">Size guide</h2>
              <button onClick={onClose} aria-label="Close size guide" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-muted">Garment measurements, laid flat. Between sizes? Message us your height and usual size on WhatsApp — we reply within the hour.</p>
            <div className="mt-6">
              {bottoms ? <SizeTable chart={BOTTOMS_CHART} caption="Bottoms size chart" /> : <SizeTable chart={TOPS_CHART} caption="Tops size chart" />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
