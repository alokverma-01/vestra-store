# VESTRA — motion-first clothing store with WhatsApp ordering

A fully responsive fashion e-commerce site built around **real filmed footage** (no renders, no illustrations), scroll-driven 3D video effects, and **direct ordering on WhatsApp** with Cash on Delivery.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion (motion.dev) · Lenis smooth scroll · React Router · Lucide + Simple Icons

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to /dist
npm run preview  # serve the production build locally
```

## Make it yours (5-minute checklist)

1. **WhatsApp number** — `src/config/site.ts` → `whatsappNumber` (digits only, with country code, e.g. `919812345678`) and `whatsappDisplay`.
2. **Brand & contact** — same file: `name`, `email`, `studio`, `hours`, Instagram/YouTube URLs.
3. **Commerce rules** — `freeShippingThreshold`, `shippingFee`, `returnDays`, `deliveryDays`, `paymentOptions`, `nextDrop` (countdown).
4. **Products** — `src/data/products.ts`. Each product has name, price, colours, sizes, sold-out sizes, two photos and one film.
5. **Films** — `src/data/media.ts`. Swap in your own footage (see below).
6. **Legal pages** — Privacy and Terms in `src/pages/Content.tsx` are templates; have them reviewed before launch.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Preloader tied to real video download → 360° scroll-scrubbed hero → manifesto with inline video → product drop → **3D video ring** → stacked collection cards → horizontal film strip → shoppable reels → atelier → drop countdown |
| `/shop` | Category video hero, category pills, filters (fit, size, price), sort, 2/3/4-column grid; state lives in the URL |
| `/product/:slug` | Real-footage gallery, colour/size/qty, add to bag, **one-tap WhatsApp order**, pincode delivery estimate, size-guide modal, sticky mobile buy bar, related products |
| `/cart`, `/checkout`, `/order-sent` | Bag → delivery form (validated) → full order composed into a WhatsApp message (order ID, items, totals, payment, address) |
| `/lookbook` | **3D depth tunnel** (films fly toward you on the Z axis) + horizontal film strip |
| `/about` | Story + sticky "how it's made" film that changes per step |
| `/contact` | WhatsApp-first contact, form that opens a pre-written WhatsApp message |
| `/wishlist`, `/faq`, `/shipping-returns`, `/size-guide`, `/privacy`, `/terms`, `/credits`, 404 | Supporting pages |

## How WhatsApp ordering works

No payment gateway, no accounts. Every order button builds a `https://wa.me/<number>?text=…` link (`src/lib/whatsapp.ts`):

- **Product page** → product, colour, size, qty, price and the product URL.
- **Bag drawer → "Quick message"** → the whole bag, address collected in chat.
- **Checkout** → validated name / mobile / address / pincode / payment preference, sent as a formatted order with an ID like `VST-261010-4821`. The bag and last order are stored in `localStorage`.

## The video techniques

- **Scroll-scrub (`ScrubVideo.tsx`)** — downloads the clip into memory with streamed progress (which drives the preloader), then eases `currentTime` toward the scroll position each frame (frame-rate independent).
- **3D ring (`VideoRing.tsx`)** — CSS `preserve-3d` cylinder of video cards; scroll rotates it, faces dim and captions hide as they turn away.
- **Depth tunnel (`Lookbook.tsx`)** — cards placed along Z; scroll moves the camera through them.
- **LazyVideo** — loads only near the viewport, plays only while visible, picks SD on phones / data-saver.
- `prefers-reduced-motion` disables smooth scroll, scrubbing and autoplay.

## Swapping in your own footage

Clips currently stream from the Pexels CDN (Pexels License — free for commercial use; credits on `/credits`). For production, host your own:

1. Put files in `public/media/` (MP4/H.264; ~1366px wide for desktop, ~960px for mobile; 8–15 s loops).
2. In `src/data/media.ts`, point `hd`, `sd` and `poster` at `/media/your-file.mp4`.
3. For the smoothest scroll-scrub on the hero, encode with frequent keyframes:
   `ffmpeg -i in.mp4 -vf scale=1366:-2 -c:v libx264 -g 6 -crf 22 -an -movflags +faststart hero.mp4`

AI-generated product spins (e.g. Higgsfield, Kling, Veo) drop in the same way — a 360° turn of your garment is ideal for the hero.

## Deploy

Static SPA — any static host works. `vercel.json` and `public/_redirects` (Netlify) already route all paths to `index.html`.

```bash
npm run build   # upload /dist
```

## Image credits

Product photography from Unsplash (Unsplash License); film from Pexels (Pexels License). Replace with your own shoot before launch — product names in this template are paired with the closest-matching stock imagery.
