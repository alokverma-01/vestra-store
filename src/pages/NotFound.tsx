import { LazyVideo } from '../components/media/LazyVideo'
import { ButtonLink } from '../components/ui/primitives'
import { useDocumentTitle } from './shared'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-bone">
      <LazyVideo clip="darkness" eager className="absolute inset-0 size-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
      <div className="container-x relative pb-16">
        <p className="eyebrow text-bone/60">Error 404</p>
        <h1 className="font-display mt-3 text-[clamp(4.5rem,16vw,15rem)]">
          Lost in <span className="font-serif font-normal normal-case italic tracking-normal">motion</span>
        </h1>
        <p className="mt-3 max-w-md text-bone/70">This page walked off into the dark. Let’s get you back to the clothes.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/" variant="bone">Home</ButtonLink>
          <ButtonLink to="/shop" variant="outline-light">Shop all</ButtonLink>
        </div>
      </div>
    </section>
  )
}
