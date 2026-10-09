import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { SITE } from '../config/site'
import { getProductById, type Product } from '../data/products'
import type { Order } from '../lib/whatsapp'

export type CartItem = { key: string; productId: string; size: string; color: string; qty: number }
export type CartLine = CartItem & { product: Product }
type Toast = { id: number; title: string; body?: string; image?: string }

type ShopState = {
  cart: CartLine[]
  count: number
  subtotal: number
  shipping: number
  total: number
  addToCart: (productId: string, size: string, color: string, qty?: number) => void
  updateQty: (key: string, qty: number) => void
  removeFromCart: (key: string) => void
  clearCart: () => void

  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isWished: (productId: string) => boolean

  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  quickAddId: string | null
  setQuickAddId: (id: string | null) => void

  toasts: Toast[]
  notify: (t: Omit<Toast, 'id'>) => void

  lastOrder: Order | null
  saveOrder: (o: Order) => void
}

const ShopContext = createContext<ShopState | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) — state still works in memory */
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => load('vestra:cart', []))
  const [wishlist, setWishlist] = useState<string[]>(() => load('vestra:wishlist', []))
  const [lastOrder, setLastOrder] = useState<Order | null>(() => load('vestra:last-order', null))
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickAddId, setQuickAddId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastId = useRef(0)

  useEffect(() => persist('vestra:cart', items), [items])
  useEffect(() => persist('vestra:wishlist', wishlist), [wishlist])

  const notify = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastId.current
    setToasts((prev) => [...prev.slice(-2), { ...t, id }])
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3200)
  }, [])

  const addToCart = useCallback(
    (productId: string, size: string, color: string, qty = 1) => {
      const key = `${productId}__${size}__${color}`
      setItems((prev) => {
        const found = prev.find((i) => i.key === key)
        if (found) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
        return [...prev, { key, productId, size, color, qty }]
      })
      const p = getProductById(productId)
      if (p) notify({ title: 'Added to bag', body: `${p.name} — ${color} / ${size}`, image: p.images[0] })
    },
    [notify],
  )

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(10, qty) } : i)),
    )
  }, [])

  const removeFromCart = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clearCart = useCallback(() => setItems([]), [])

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const has = prev.includes(productId)
        const p = getProductById(productId)
        if (p) notify({ title: has ? 'Removed from wishlist' : 'Saved to wishlist', body: p.name, image: p.images[0] })
        return has ? prev.filter((id) => id !== productId) : [...prev, productId]
      })
    },
    [notify],
  )

  const saveOrder = useCallback((o: Order) => {
    setLastOrder(o)
    persist('vestra:last-order', o)
  }, [])

  const value = useMemo<ShopState>(() => {
    const cart = items
      .map((i) => ({ ...i, product: getProductById(i.productId) }))
      .filter((l): l is CartLine => Boolean(l.product))
    const subtotal = cart.reduce((s, l) => s + l.product.price * l.qty, 0)
    const shipping = subtotal === 0 || subtotal >= SITE.freeShippingThreshold ? 0 : SITE.shippingFee
    return {
      cart,
      count: cart.reduce((s, l) => s + l.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      isWished: (id) => wishlist.includes(id),
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      quickAddId,
      setQuickAddId,
      toasts,
      notify,
      lastOrder,
      saveOrder,
    }
  }, [items, wishlist, cartOpen, searchOpen, quickAddId, toasts, lastOrder, addToCart, updateQty, removeFromCart, clearCart, toggleWishlist, notify, saveOrder])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
  return ctx
}
