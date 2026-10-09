import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Columns2, Columns3, Columns4, SlidersHorizontal, X } from 'lucide-react'
import { LazyVideo } from '../components/media/LazyVideo'
import { ProductCard } from '../components/product/ProductCard'
import { Button } from '../components/ui/primitives'
import { CATEGORIES, PRODUCTS, type Category, type Gender } from '../data/products'
import { cn, money } from '../lib/format'
import { useScrollLock } from '../lib/smooth'
import { useDocumentTitle } from './shared'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
] as const
type SortId = (typeof SORTS)[number]['id']

const PRICE_BANDS = [
  { id: 'u2', label: `Under ${money(2000)}`, test: (p: number) => p < 2000 },
  { id: '2-4', label: `${money(2000)} – ${money(4000)}`, test: (p: number) => p >= 2000 && p <= 4000 },
  { id: 'o4', label: `Over ${money(4000)}`, test: (p: number) => p > 4000 },
]
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36', '38']
const GENDERS: { id: Gender; label: string }[] = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'unisex', label: 'Unisex' },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') as Category | null
  const gender = params.get('gender') as Gender | null
  const sort = (params.get('sort') as SortId) || 'featured'
  const sizes = params.get('size')?.split(',').filter(Boolean) ?? []
  const price = params.get('price')
  const [cols, setCols] = useState<2 | 3 | 4>(4)
  const [filtersOpen, setFiltersOpen] = useState(false)
  useScrollLock(filtersOpen)

  const cat = CATEGORIES.find((c) => c.id === category)
  useDocumentTitle(cat ? cat.label : 'Shop all', cat?.blurb)

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const toggleSize = (s: string) => set('size', (sizes.includes(s) ? sizes.filter((x) => x !== s) : [...sizes, s]).join(',') || null)

  const products = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        (!category || p.category === category) &&
        (!gender || p.gender === gender || (gender !== 'unisex' && p.gender === 'unisex')) &&
        (!sizes.length || sizes.some((s) => p.sizes.includes(s) && !p.soldOut?.includes(s))) &&
        (!price || PRICE_BANDS.find((b) => b.id === price)?.test(p.price)),
    )
    if (sort === 'new') list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'featured') list = [...list].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    return list
  }, [category, gender, sizes, price, sort])

  const activeCount = (gender ? 1 : 0) + sizes.length + (price ? 1 : 0)
  const gridCols = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }[cols]

  const filterPanel = (
    <div className="space-y-8">
      <fieldset>
        <legend className="eyebrow text-muted">Fit for</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <Chip key={g.id} active={gender === g.id} onClick={() => set('gender', gender === g.id ? null : g.id)}>
              {g.label}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow text-muted">Size</legend>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {ALL_SIZES.map((s) => (
            <Chip key={s} active={sizes.includes(s)} onClick={() => toggleSize(s)} square>
              {s}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="eyebrow text-muted">Price</legend>
        <div className="mt-3 flex flex-col items-start gap-2">
          {PRICE_BANDS.map((b) => (
            <Chip key={b.id} active={price === b.id} onClick={() => set('price', price === b.id ? null : b.id)}>
              {b.label}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  )

  return (
    <>
      {/* Category hero with real footage */}
      <section className="relative h-[62svh] min-h-[420px] overflow-hidden bg-ink text-bone md:h-[70svh]">
        <AnimatePresence mode="popLayout">
          <motion.div key={cat?.id ?? 'all'} className="absolute inset-0" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <LazyVideo clip={cat?.video ?? 'hangers'} eager className="size-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        <div className="container-x relative flex h-full flex-col justify-end pb-10">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold uppercase tracking-[0.16em] text-bone/70">
            <Link to="/" className="hover:text-bone">Home</Link> / <Link to="/shop" className="hover:text-bone">Shop</Link>
            {cat && <> / {cat.label}</>}
          </nav>
          <h1 className="font-display mt-3 text-[clamp(4rem,14vw,13rem)]">{cat?.label ?? 'Shop all'}</h1>
          <p className="max-w-lg text-bone/80">{cat?.blurb ?? 'Every piece in the current drop — each one filmed in motion, so you know exactly how it falls.'}</p>
        </div>
      </section>

      {/* Category pills */}
      <div className="border-b hairline bg-bone">
        <div className="container-x no-scrollbar flex gap-2 overflow-x-auto py-3">
          <Chip active={!category} onClick={() => set('category', null)}>
            All
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => set('category', c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="container-x py-8 md:py-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setFiltersOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-full border hairline px-4 text-sm font-semibold hover:bg-ink hover:text-bone lg:hidden">
              <SlidersHorizontal className="size-4" /> Filters {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-signal text-[11px] text-white">{activeCount}</span>}
            </button>
            <p className="text-sm text-muted" aria-live="polite">
              {products.length} {products.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => set('sort', e.target.value === 'featured' ? null : e.target.value)} className="h-10 rounded-full border hairline bg-transparent px-4 text-sm font-semibold">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            <div className="hidden items-center rounded-full border hairline p-1 lg:flex" aria-label="Grid density">
              {([2, 3, 4] as const).map((n) => {
                const Icon = n === 2 ? Columns2 : n === 3 ? Columns3 : Columns4
                return (
                  <button key={n} onClick={() => setCols(n)} aria-label={`${n} columns`} aria-pressed={cols === n} className={cn('grid size-8 place-items-center rounded-full', cols === n ? 'bg-ink text-bone' : 'hover:bg-ink/5')}>
                    <Icon className="size-4" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-40">{filterPanel}</div>
            {activeCount > 0 && (
              <button onClick={() => setParams(category ? { category } : {}, { replace: true })} className="mt-8 text-sm font-semibold underline underline-offset-4">
                Clear filters
              </button>
            )}
          </aside>

          {products.length ? (
            <motion.ul layout className={cn('grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5', gridCols)}>
              <AnimatePresence>
                {products.map((p, i) => (
                  <motion.li key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.03 }}>
                    <ProductCard product={p} priority={i < 4} sizes={cols === 2 ? '(min-width:1024px) 40vw, 50vw' : undefined} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <div className="rounded-3xl border hairline p-12 text-center">
              <p className="text-xl font-semibold">Nothing matches those filters</p>
              <p className="mt-2 text-muted">Try another size or price band — or ask us on WhatsApp, we restock fast.</p>
              <Button className="mt-6" onClick={() => setParams({}, { replace: true })}>Reset</Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-bone p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-lg font-semibold">Filters</p>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                  <X className="size-5" />
                </button>
              </div>
              {filterPanel}
              <div className="mt-8 grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setParams(category ? { category } : {}, { replace: true })}>Clear</Button>
                <Button onClick={() => setFiltersOpen(false)}>Show {products.length}</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Chip({ active, onClick, children, square }: { active: boolean; onClick: () => void; children: React.ReactNode; square?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-full border text-sm font-semibold whitespace-nowrap transition-colors',
        square ? 'h-10 rounded-lg px-0' : 'h-10 px-4',
        active ? 'border-ink bg-ink text-bone' : 'hairline hover:border-ink',
      )}
    >
      {children}
    </button>
  )
}
