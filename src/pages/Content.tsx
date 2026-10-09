import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ProductCard } from '../components/product/ProductCard'
import { BOTTOMS_CHART, SizeTable, TOPS_CHART } from '../components/product/SizeGuide'
import { BrandIcon } from '../components/ui/BrandIcon'
import { Accordion, ButtonLink, PageHeader } from '../components/ui/primitives'
import { SITE } from '../config/site'
import { CLIPS } from '../data/media'
import { PRODUCTS } from '../data/products'
import { money } from '../lib/format'
import { waLink } from '../lib/whatsapp'
import { useShop } from '../store/shop'
import { useDocumentTitle } from './shared'

/* ───────────────────────── Wishlist ───────────────────────── */

export function WishlistPage() {
  const { wishlist } = useShop()
  useDocumentTitle('Wishlist')
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id))
  return (
    <>
      <PageHeader eyebrow="Saved" title="Wishlist" intro={items.length ? `${items.length} saved ${items.length === 1 ? 'piece' : 'pieces'}. Stored on this device.` : undefined} />
      <div className="container-x pb-28">
        {items.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="rounded-3xl border hairline p-12 text-center">
            <Heart className="mx-auto size-10 text-fog" />
            <p className="mt-4 text-lg font-semibold">Nothing saved yet</p>
            <p className="mt-1 text-muted">Tap the heart on any piece to keep it here.</p>
            <ButtonLink to="/shop" className="mt-6">Browse the drop</ButtonLink>
          </div>
        )}
      </div>
    </>
  )
}

/* ───────────────────────── FAQ ───────────────────────── */

const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: 'Ordering on WhatsApp',
    items: [
      { q: 'How does ordering on WhatsApp work?', a: `Add pieces to your bag and tap “Checkout on WhatsApp” — or tap “Order on WhatsApp” on any product. WhatsApp opens with your order pre-written to ${SITE.whatsappDisplay}. Hit send and a member of our team confirms stock, size and delivery with you in the chat.` },
      { q: 'Do I need to create an account?', a: 'No. There are no accounts and no card forms. Your bag and wishlist are saved on your device, and your order lives in your WhatsApp chat with us.' },
      { q: 'How quickly will you reply?', a: `Usually within the hour during studio hours (${SITE.hours}). Messages sent overnight are answered first thing the next morning.` },
      { q: 'Can I change or cancel my order?', a: 'Yes — just reply in the same chat any time before we dispatch it. Once shipped, you can use our free return/exchange process.' },
    ],
  },
  {
    title: 'Payment',
    items: [
      { q: 'Which payment methods do you accept?', a: 'Cash on Delivery across India, UPI, and bank transfer. For UPI and bank transfer we send payment details in the chat after confirming your order — we never ask for card details.' },
      { q: 'Are prices inclusive of tax?', a: 'Yes, all prices on the site include GST. Shipping is free on orders above ' + money(SITE.freeShippingThreshold) + ', otherwise ' + money(SITE.shippingFee) + '.' },
    ],
  },
  {
    title: 'Shipping & returns',
    items: [
      { q: 'When will my order arrive?', a: `We dispatch within ${SITE.dispatchDays} of confirmation. Delivery takes ${SITE.deliveryDays[0]}–${SITE.deliveryDays[1]} business days depending on your pincode. You’ll get a tracking link on WhatsApp.` },
      { q: 'What is your return policy?', a: `${SITE.returnDays} days from delivery for returns or size exchanges. Items must be unworn with tags. Message us your order ID on WhatsApp and we arrange a pickup.` },
    ],
  },
  {
    title: 'Fit & product',
    items: [
      { q: 'How do I find my size?', a: 'Each product page lists the fit and the model’s size, and the size guide has garment measurements. Still unsure? Send us your height, weight and usual size on WhatsApp.' },
      { q: 'Is the video on the product page the actual product?', a: 'Yes. Every film is real footage of the garment in motion — no renders, AI mock-ups or illustrations.' },
    ],
  },
]

export function FaqPage() {
  useDocumentTitle('FAQ', 'Answers about WhatsApp ordering, Cash on Delivery, shipping, returns and sizing.')
  return (
    <>
      <PageHeader eyebrow="Help" title="Questions" intro="Everything about ordering on WhatsApp, payment, delivery and fit." />
      <div className="container-x grid gap-14 pb-28 lg:grid-cols-12">
        <div className="space-y-14 lg:col-span-8">
          {FAQ_GROUPS.map((g) => (
            <section key={g.title}>
              <h2 className="mb-4 text-xl font-semibold">{g.title}</h2>
              <Accordion defaultOpen={null} items={g.items.map((i) => ({ title: i.q, content: <p>{i.a}</p> }))} />
            </section>
          ))}
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl bg-ink p-7 text-bone">
            <p className="text-xl font-semibold">Still stuck?</p>
            <p className="mt-2 text-bone/70">A real person will answer — usually within the hour.</p>
            <a href={waLink(`Hi ${SITE.name}! I have a question.`)} target="_blank" rel="noopener noreferrer" className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-wa font-semibold text-ink">
              <BrandIcon name="whatsapp" className="size-5" /> Ask on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </>
  )
}

/* ───────────────────────── Policy pages ───────────────────────── */

function Prose({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  useDocumentTitle(title)
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} />
      <article className="container-x prose-vestra pb-28">{children}</article>
    </>
  )
}

export function ShippingReturnsPage() {
  return (
    <Prose eyebrow="Help" title="Shipping & Returns" intro={`Free shipping over ${money(SITE.freeShippingThreshold)}, Cash on Delivery across India and ${SITE.returnDays}-day returns.`}>
      <h2>Shipping</h2>
      <ul>
        <li>Orders are dispatched within {SITE.dispatchDays} of confirmation on WhatsApp.</li>
        <li>Delivery takes {SITE.deliveryDays[0]}–{SITE.deliveryDays[1]} business days depending on your pincode.</li>
        <li>Shipping is free on orders above {money(SITE.freeShippingThreshold)}; otherwise a flat {money(SITE.shippingFee)}.</li>
        <li>Tracking details are shared in your WhatsApp chat as soon as your parcel leaves the studio.</li>
      </ul>
      <h2>Cash on Delivery</h2>
      <p>COD is available on all serviceable pincodes. Please keep the exact amount ready. We may call or message to verify COD orders before dispatch.</p>
      <h2>Returns & exchanges</h2>
      <ul>
        <li>You have {SITE.returnDays} days from delivery to request a return or size exchange.</li>
        <li>Items must be unworn, unwashed and have original tags attached.</li>
        <li>Message your order ID on WhatsApp — we arrange a reverse pickup from your address.</li>
        <li>Refunds are issued to your UPI ID or bank account within 5–7 business days of the item reaching us.</li>
      </ul>
      <h2>Damaged or wrong item?</h2>
      <p>Send us a photo on WhatsApp within 48 hours of delivery and we’ll replace it at no cost.</p>
    </Prose>
  )
}

export function SizeGuidePage() {
  useDocumentTitle('Size guide')
  return (
    <>
      <PageHeader eyebrow="Help" title="Size guide" intro="Garment measurements taken flat. Compare against a piece you already own for the best fit." />
      <div className="container-x space-y-12 pb-28">
        <section>
          <h2 className="mb-4 text-xl font-semibold">Tops, hoodies, outerwear & knitwear</h2>
          <SizeTable chart={TOPS_CHART} caption="Tops size chart in inches" />
        </section>
        <section>
          <h2 className="mb-4 text-xl font-semibold">Denim & bottoms</h2>
          <SizeTable chart={BOTTOMS_CHART} caption="Bottoms size chart in inches" />
        </section>
        <section className="prose-vestra">
          <h2>How to measure</h2>
          <ul>
            <li><b>Chest:</b> lay a tee flat and measure armpit to armpit, then double it.</li>
            <li><b>Length:</b> from the highest point of the shoulder to the hem.</li>
            <li><b>Waist:</b> measure around your natural waist where you wear your jeans.</li>
          </ul>
          <p>
            Between sizes? <a href={waLink(`Hi ${SITE.name}! Can you help me with sizing? My height is __ and weight is __.`)} target="_blank" rel="noopener noreferrer">Ask us on WhatsApp</a> with your height and weight.
          </p>
        </section>
      </div>
    </>
  )
}

export function PrivacyPage() {
  return (
    <Prose eyebrow="Legal" title="Privacy Policy" intro="Plain-language summary of what we collect and why. Replace with your own policy before launch.">
      <h2>What we collect</h2>
      <p>This website has no accounts and no online payments. Your bag, wishlist and delivery details are stored only in your own browser (localStorage) so you don’t have to retype them.</p>
      <p>When you tap an order button, WhatsApp opens with a message you can review before sending. If you send it, we receive the details in that message — your name, phone number, delivery address and order — via WhatsApp.</p>
      <h2>How we use it</h2>
      <ul>
        <li>To confirm, ship and support your order.</li>
        <li>To reply to questions you send us.</li>
        <li>We never sell or share your details with third parties, except the courier delivering your parcel.</li>
      </ul>
      <h2>Third-party media</h2>
      <p>Videos stream from the Pexels CDN and images from Unsplash. Those services may receive standard request data (like your IP address) when media loads.</p>
      <h2>Your choices</h2>
      <p>Clear your browser storage to remove saved bag and address data. To delete chat history or order records, message us on WhatsApp or email {SITE.email}.</p>
    </Prose>
  )
}

export function TermsPage() {
  return (
    <Prose eyebrow="Legal" title="Terms of Service" intro="Template terms — have these reviewed for your business before launch.">
      <h2>Orders</h2>
      <p>An order is confirmed only once our team replies on WhatsApp confirming stock, price and delivery. We may decline an order if an item is out of stock or a pincode is unserviceable.</p>
      <h2>Pricing</h2>
      <p>Prices are in Indian Rupees and include GST. If a price on the site is listed incorrectly, we’ll let you know before confirming and you can cancel at no cost.</p>
      <h2>Product representation</h2>
      <p>We film every product to show it as accurately as possible. Colours may vary slightly between screens.</p>
      <h2>Returns</h2>
      <p>See our <Link to="/shipping-returns">Shipping & Returns</Link> policy.</p>
      <h2>Contact</h2>
      <p>{SITE.legalName} · {SITE.studio} · {SITE.email}</p>
    </Prose>
  )
}

export function CreditsPage() {
  useDocumentTitle('Film credits')
  return (
    <>
      <PageHeader eyebrow="Credits" title="Film credits" intro="All footage on this site is real, filmed video licensed under the Pexels License; product photography via Unsplash." />
      <div className="container-x pb-28">
        <ul className="grid gap-px overflow-hidden rounded-3xl border hairline bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(CLIPS).map(([key, c]) => (
            <li key={key} className="bg-bone p-5">
              <img src={c.poster.replace('w=1280', 'w=480')} alt="" loading="lazy" className="aspect-video w-full rounded-xl object-cover" />
              <p className="mt-3 font-semibold">{c.title}</p>
              <a href={c.source} target="_blank" rel="noopener noreferrer" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
                View on Pexels
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
