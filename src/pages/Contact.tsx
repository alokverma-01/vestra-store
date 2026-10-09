import { useState } from 'react'
import { Clock, Mail, MapPin } from 'lucide-react'
import { LazyVideo } from '../components/media/LazyVideo'
import { BrandIcon } from '../components/ui/BrandIcon'
import { RevealText, WhatsAppButton } from '../components/ui/primitives'
import { SITE } from '../config/site'
import { openWhatsApp, waLink } from '../lib/whatsapp'
import { useDocumentTitle } from './shared'

const TOPICS = ['Place an order', 'Size help', 'Order status', 'Return / exchange', 'Wholesale & collabs', 'Something else']

export default function Contact() {
  useDocumentTitle('Contact', `Chat with ${SITE.name} on WhatsApp — orders, sizing and returns.`)
  const [name, setName] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim().length < 5) return setError('Tell us a little more so we can help.')
    setError('')
    openWhatsApp([`Hi ${SITE.name}!${name ? ` I'm ${name.trim()}.` : ''}`, `Topic: ${topic}`, '', message.trim()].join('\n'))
  }

  return (
    <>
      <section className="relative h-[70svh] min-h-[460px] overflow-hidden bg-ink text-bone">
        <LazyVideo clip="hangers" eager className="absolute inset-0 size-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-ink/20" />
        <div className="container-x relative flex h-full flex-col justify-end pb-12">
          <p className="eyebrow text-bone/70">Contact</p>
          <RevealText as="h1" text="Talk to a human" className="font-display mt-3 text-[clamp(4rem,13vw,12rem)]" />
        </div>
      </section>

      <section className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <a href={waLink(`Hi ${SITE.name}!`)} target="_blank" rel="noopener noreferrer" className="group block rounded-3xl bg-wa p-7 text-ink transition hover:brightness-105">
            <BrandIcon name="whatsapp" className="size-9" />
            <p className="mt-6 text-sm font-semibold uppercase tracking-wider">Fastest — WhatsApp</p>
            <p className="mt-1 text-3xl font-semibold">{SITE.whatsappDisplay}</p>
            <p className="mt-2 text-ink/70">Orders, sizing, returns. Usually replies within the hour.</p>
          </a>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={`mailto:${SITE.email}`} className="rounded-3xl bg-paper p-6 hover:bg-white">
              <Mail className="size-6" />
              <p className="mt-4 text-sm text-muted">Email</p>
              <p className="font-semibold break-all">{SITE.email}</p>
            </a>
            <div className="rounded-3xl bg-paper p-6">
              <Clock className="size-6" />
              <p className="mt-4 text-sm text-muted">Hours</p>
              <p className="font-semibold">{SITE.hours}</p>
            </div>
            <div className="rounded-3xl bg-paper p-6 sm:col-span-2">
              <MapPin className="size-6" />
              <p className="mt-4 text-sm text-muted">Studio (by appointment)</p>
              <p className="font-semibold">{SITE.studio}</p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border hairline px-5 text-sm font-semibold hover:bg-ink hover:text-bone">
              <BrandIcon name="instagram" className="size-4" /> {SITE.instagramHandle}
            </a>
            <a href={SITE.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full border hairline px-5 text-sm font-semibold hover:bg-ink hover:text-bone">
              <BrandIcon name="youtube" className="size-4" /> YouTube
            </a>
          </div>
        </div>

        <form onSubmit={send} className="rounded-3xl border hairline p-6 md:p-10 lg:col-span-7" noValidate>
          <h2 className="text-2xl font-semibold">Send us a message</h2>
          <p className="mt-1 text-muted">It opens in WhatsApp, pre-written — just tap send.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold">Your name</label>
              <input id="c-name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="c-topic" className="mb-1.5 block text-sm font-semibold">Topic</label>
              <select id="c-topic" className="field" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {TOPICS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="c-msg" className="mb-1.5 block text-sm font-semibold">Message</label>
            <textarea
              id="c-msg"
              rows={6}
              className="field resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'c-msg-err' : undefined}
              placeholder="e.g. I'm 5'10&quot; and 72kg — which size in the Drift Hoodie?"
            />
            {error && <p id="c-msg-err" className="mt-1.5 text-sm text-[#c2410c]">{error}</p>}
          </div>
          <WhatsAppButton type="submit" className="mt-6 h-14 w-full sm:w-auto sm:px-8">
            Send on WhatsApp
          </WhatsAppButton>
        </form>
      </section>
    </>
  )
}
