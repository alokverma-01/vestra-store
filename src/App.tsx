import { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Cursor, Grain, Preloader, WhatsAppFab } from './components/layout/Chrome'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { CartDrawer, QuickAddSheet, SearchOverlay, Toasts } from './components/layout/Overlays'
import { LoaderProvider } from './lib/loader'
import { SmoothScroll, useScrollTop } from './lib/smooth'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { ShopProvider } from './store/shop'

const Shop = lazy(() => import('./pages/Shop'))
const Product = lazy(() => import('./pages/Product'))
const Lookbook = lazy(() => import('./pages/Lookbook'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const CartPage = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.CheckoutPage })))
const OrderSentPage = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.OrderSentPage })))
const WishlistPage = lazy(() => import('./pages/Content').then((m) => ({ default: m.WishlistPage })))
const FaqPage = lazy(() => import('./pages/Content').then((m) => ({ default: m.FaqPage })))
const ShippingReturnsPage = lazy(() => import('./pages/Content').then((m) => ({ default: m.ShippingReturnsPage })))
const SizeGuidePage = lazy(() => import('./pages/Content').then((m) => ({ default: m.SizeGuidePage })))
const PrivacyPage = lazy(() => import('./pages/Content').then((m) => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import('./pages/Content').then((m) => ({ default: m.TermsPage })))
const CreditsPage = lazy(() => import('./pages/Content').then((m) => ({ default: m.CreditsPage })))

function Layout() {
  const { pathname } = useLocation()
  const scrollTop = useScrollTop()
  // Reset scroll on page change only — query-only changes (shop filters) keep their position.
  useEffect(() => scrollTop(true), [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-[100svh] flex-col">
      <a href="#main" className="sr-only z-[80] rounded-full bg-ink px-4 py-2 text-bone focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Header />
      <motion.main id="main" key={pathname} className="flex-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </motion.main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <QuickAddSheet />
      <Toasts />
      <WhatsAppFab />
      <Cursor />
      <Grain />
    </div>
  )
}

function PageFallback() {
  return (
    <div className="grid min-h-[100svh] place-items-center">
      <span className="size-8 animate-spin rounded-full border-2 border-ink/15 border-t-ink" aria-label="Loading page" />
    </div>
  )
}

function Providers({ children }: { children: ReactNode }) {
  return (
    <LoaderProvider>
      <ShopProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </ShopProvider>
    </LoaderProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <Providers>
        <Preloader />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<Product />} />
            <Route path="lookbook" element={<Lookbook />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-sent" element={<OrderSentPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="shipping-returns" element={<ShippingReturnsPage />} />
            <Route path="size-guide" element={<SizeGuidePage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="credits" element={<CreditsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Providers>
    </BrowserRouter>
  )
}
