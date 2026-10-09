import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Play, Plus } from 'lucide-react'
import { img, imgSrcSet, type Product } from '../../data/products'
import { useShop } from '../../store/shop'
import { cn } from '../../lib/format'
import { useFinePointer } from '../../lib/hooks'
import { LazyVideo } from '../media/LazyVideo'
import { Price } from '../ui/primitives'

export function ProductCard({ product: p, priority = false, sizes = '(min-width:1024px) 25vw, 50vw' }: { product: Product; priority?: boolean; sizes?: string }) {
  const { addToCart, toggleWishlist, isWished, setQuickAddId } = useShop()
  const fine = useFinePointer()
  const [hover, setHover] = useState(false)
  const timer = useRef<number>(0)
  const wished = isWished(p.id)
  const available = p.sizes.filter((s) => !p.soldOut?.includes(s))

  return (
    <article
      className="group relative"
      onPointerEnter={() => {
        if (!fine) return
        timer.current = window.setTimeout(() => setHover(true), 180)
      }}
      onPointerLeave={() => {
        window.clearTimeout(timer.current)
        setHover(false)
      }}
    >
      <div className="relative overflow-hidden rounded-[14px] bg-sand">
        <Link to={`/product/${p.slug}`} className="block aspect-[4/5]" data-cursor="View" aria-label={`${p.name}, ${p.colors.length} colours`}>
          <img
            src={img(p.images[0], 800)}
            srcSet={imgSrcSet(p.images[0])}
            sizes={sizes}
            alt={`${p.name} in ${p.colors[0].name}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
          />
          <img
            src={img(p.images[1], 800)}
            srcSet={imgSrcSet(p.images[1])}
            sizes={sizes}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          {fine && (
            <LazyVideo clip={p.video} mode="hover" active={hover} quality="sd" fadeIn showPoster={false} className="absolute inset-0 size-full object-cover" />
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          {p.badge ? (
            <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider', p.badge === 'Limited' || p.badge === 'Low stock' ? 'bg-signal text-white' : 'bg-bone/90 text-ink backdrop-blur')}>
              {p.badge}
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => toggleWishlist(p.id)}
            aria-label={wished ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
            aria-pressed={wished}
            className="pointer-events-auto grid size-9 place-items-center rounded-full bg-bone/85 backdrop-blur transition hover:bg-bone"
          >
            <Heart className={cn('size-4', wished && 'fill-signal text-signal')} />
          </button>
        </div>

        {!fine && (
          <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-ink/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-bone backdrop-blur">
            <Play className="size-3 fill-current" /> Video
          </span>
        )}

        {/* Quick add — desktop hover reveals sizes, touch opens a sheet */}
        {fine ? (
          <div className="absolute inset-x-3 bottom-3 translate-y-[120%] rounded-xl bg-bone/95 p-2 opacity-0 backdrop-blur transition-all duration-300 ease-[var(--ease-out-expo)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">Quick add · {p.colors[0].name}</p>
            <div className="flex flex-wrap gap-1">
              {p.sizes.map((s) => {
                const out = p.soldOut?.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={out}
                    onClick={() => addToCart(p.id, s, p.colors[0].name)}
                    className="h-8 min-w-9 rounded-md border hairline px-2 text-xs font-semibold transition hover:bg-ink hover:text-bone disabled:cursor-not-allowed disabled:text-fog disabled:line-through"
                    aria-label={out ? `${s} sold out` : `Add size ${s} to bag`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          available.length > 0 && (
            <button
              type="button"
              onClick={() => setQuickAddId(p.id)}
              aria-label={`Quick add ${p.name}`}
              className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-ink text-bone shadow-lg"
            >
              <Plus className="size-5" />
            </button>
          )
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold">
            <Link to={`/product/${p.slug}`} className="hover:underline underline-offset-4">
              {p.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-muted">{p.short.split('.')[0]}</p>
        </div>
        <Price value={p.price} compareAt={p.compareAt} className="shrink-0 text-[15px] font-semibold" />
      </div>
      <div className="mt-2 flex items-center gap-1.5" aria-label={`Colours: ${p.colors.map((c) => c.name).join(', ')}`}>
        {p.colors.map((c) => (
          <span key={c.name} title={c.name} className="size-3 rounded-full ring-1 ring-ink/15" style={{ background: c.hex }} />
        ))}
      </div>
    </article>
  )
}
