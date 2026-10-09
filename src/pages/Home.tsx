import { Marquee } from '../components/ui/primitives'
import { HeroScrub } from '../sections/home/HeroScrub'
import { HorizontalLookbook } from '../sections/home/HorizontalLookbook'
import { Manifesto } from '../sections/home/Manifesto'
import { AtelierTeaser, DropCountdown, FeaturedProducts, Promises, ReelsShop } from '../sections/home/ShopSections'
import { StackedCollections } from '../sections/home/StackedCollections'
import { VideoRing } from '../sections/home/VideoRing'
import { useDocumentTitle } from './shared'

export default function Home() {
  useDocumentTitle()
  return (
    <>
      <HeroScrub />
      <div className="bg-ink py-5 text-bone">
        <Marquee
          className="font-display text-[clamp(2.5rem,6vw,5rem)]"
          items={['Oversized tees', 'Ripstop shells', 'Heavy fleece', 'Raw denim', 'Bias satin', 'Undyed knit']}
          duration={40}
        />
      </div>
      <Manifesto />
      <FeaturedProducts />
      <VideoRing />
      <StackedCollections />
      <Promises />
      <HorizontalLookbook />
      <ReelsShop />
      <AtelierTeaser />
      <DropCountdown />
    </>
  )
}
