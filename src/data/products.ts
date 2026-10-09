import type { ClipKey } from './media'

export type Category =
  | 'tees'
  | 'hoodies'
  | 'outerwear'
  | 'knitwear'
  | 'shirts'
  | 'denim'
  | 'bottoms'
  | 'dresses'

export type Gender = 'men' | 'women' | 'unisex'

export type Product = {
  id: string
  slug: string
  name: string
  category: Category
  gender: Gender
  price: number
  compareAt?: number
  badge?: 'New' | 'Bestseller' | 'Limited' | 'Low stock'
  colors: { name: string; hex: string }[]
  sizes: string[]
  soldOut?: string[]
  /** Unsplash photo ids (first = main, second = hover/alt) */
  images: string[]
  video: ClipKey
  short: string
  description: string
  details: string[]
  fabric: string
  care: string[]
  fit: string
  createdAt: string
  featured?: boolean
}

export const CATEGORIES: { id: Category; label: string; video: ClipKey; blurb: string }[] = [
  { id: 'tees', label: 'Tees', video: 'turn', blurb: 'Heavyweight cotton, cut boxy and dropped at the shoulder.' },
  { id: 'hoodies', label: 'Hoodies', video: 'staircase', blurb: 'Brushed-back fleece with a structured hood that holds its shape.' },
  { id: 'outerwear', label: 'Outerwear', video: 'jacketNight', blurb: 'Shells, trenches and wool — layers built for weather and motion.' },
  { id: 'knitwear', label: 'Knitwear', video: 'desert', blurb: 'Soft-hand knits in undyed, earth-toned yarns.' },
  { id: 'shirts', label: 'Shirts', video: 'dressmaker', blurb: 'Linen and oxford cloth, finished by hand in the studio.' },
  { id: 'denim', label: 'Denim', video: 'denimJump', blurb: '14oz selvedge-look denim washed for a lived-in hand.' },
  { id: 'bottoms', label: 'Bottoms', video: 'crewBridge', blurb: 'Cargos and wide trousers with room to move.' },
  { id: 'dresses', label: 'Dresses', video: 'silk', blurb: 'Bias-cut satin that moves like liquid.' },
]

const TOPS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const WAIST = ['28', '30', '32', '34', '36', '38']

export const PRODUCTS: Product[] = [
  {
    id: 'p01',
    slug: 'orbit-oversized-tee',
    name: 'Orbit Oversized Tee',
    category: 'tees',
    gender: 'unisex',
    price: 1499,
    badge: 'Bestseller',
    colors: [
      { name: 'Rose', hex: '#d98b9a' },
      { name: 'Black', hex: '#111111' },
      { name: 'Bone', hex: '#e9e4da' },
    ],
    sizes: TOPS,
    soldOut: ['XS'],
    images: ['photo-1627225925683-1da7021732ea', 'photo-1627225793904-a2f900a6e4cf'],
    video: 'turn',
    short: '320 GSM cotton. Dropped shoulder. Boxy, cropped body.',
    description:
      'The tee we filmed spinning in our hero. Knitted from 320 GSM combed cotton that keeps its structure wash after wash, cut boxy with a dropped shoulder and a slightly cropped hem so it sits right over cargos and denim.',
    details: ['Ribbed 2.5cm collar that won’t bacon', 'Dropped shoulder, boxy fit', 'Enzyme + silicone washed for a soft hand', 'Pre-shrunk'],
    fabric: '100% combed cotton, 320 GSM single jersey',
    care: ['Machine wash cold, inside out', 'Do not tumble dry', 'Iron on reverse'],
    fit: 'Oversized. Take your usual size for the intended slouch, or one down for a closer fit. Model is 6’0” wearing L.',
    createdAt: '2026-09-28',
    featured: true,
  },
  {
    id: 'p02',
    slug: 'signal-heavyweight-tee',
    name: 'Signal Heavyweight Tee',
    category: 'tees',
    gender: 'unisex',
    price: 1299,
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Optic White', hex: '#f7f7f5' },
    ],
    sizes: TOPS,
    images: ['photo-1622519407650-3df9883f76a5', 'photo-1616006897093-5e4635c0de35'],
    video: 'cropStreet',
    short: 'A cleaner, regular-fit staple in the same heavy cotton.',
    description:
      'Our everyday heavyweight in a regular fit. Same dense 300 GSM cotton, a cleaner silhouette and a neckline that stays flat — the tee you will reach for more than any other.',
    details: ['Regular fit, true to size', 'Taped shoulder seams', 'Side-seamed for a sharper drape'],
    fabric: '100% cotton, 300 GSM',
    care: ['Machine wash cold', 'Line dry', 'Warm iron'],
    fit: 'Regular. True to size. Model is 5’11” wearing M.',
    createdAt: '2026-09-12',
  },
  {
    id: 'p03',
    slug: 'night-shell-windbreaker',
    name: 'Night Shell Windbreaker',
    category: 'outerwear',
    gender: 'unisex',
    price: 4999,
    badge: 'New',
    colors: [
      { name: 'Ice / Navy', hex: '#c9d6e3' },
      { name: 'Black', hex: '#111111' },
    ],
    sizes: TOPS,
    images: ['photo-1553632786-0cfb0ce7dacb', 'photo-1660486044177-45cd45bb5e99'],
    video: 'jacketNight',
    short: 'Water-resistant ripstop shell with a packable hood.',
    description:
      'A lightweight ripstop shell that cuts wind and light rain. Colour-blocked panels, a stowaway hood and reflective trims that catch the light after dark — filmed exactly as it moves.',
    details: ['DWR-coated ripstop nylon', 'Packable hood in collar', 'Reflective piping', 'Two-way YKK zip'],
    fabric: 'Shell: 100% nylon ripstop. Lining: 100% polyester mesh',
    care: ['Hand wash cold', 'Do not iron', 'Hang dry'],
    fit: 'Relaxed. Room for a hoodie underneath.',
    createdAt: '2026-10-02',
    featured: true,
  },
  {
    id: 'p04',
    slug: 'meridian-trench',
    name: 'Meridian Trench',
    category: 'outerwear',
    gender: 'women',
    price: 7999,
    compareAt: 9499,
    badge: 'Limited',
    colors: [
      { name: 'Sand', hex: '#c8b49a' },
      { name: 'Charcoal', hex: '#3a3a3a' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    soldOut: ['XS', 'S'],
    images: ['photo-1676716105765-e19fe6a01851', 'photo-1663343683182-70885ae0a792'],
    video: 'trench',
    short: 'Cotton gabardine trench with a storm flap and deep vent.',
    description:
      'A modern take on the classic trench in dense cotton gabardine. Long back vent for movement, a storm flap and a removable belt so it works open, tied or cinched.',
    details: ['Water-repellent gabardine', 'Removable self-belt', 'Horn-effect buttons', 'Numbered limited run of 150'],
    fabric: '100% cotton gabardine, viscose lining',
    care: ['Dry clean only'],
    fit: 'Relaxed, calf-length. Size down for a closer fit.',
    createdAt: '2026-09-20',
    featured: true,
  },
  {
    id: 'p05',
    slug: 'halo-wool-coat',
    name: 'Halo Wool Coat',
    category: 'outerwear',
    gender: 'women',
    price: 8499,
    colors: [
      { name: 'Ivory', hex: '#efebe2' },
      { name: 'Black', hex: '#111111' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['photo-1541123528198-f724e428cab5', 'photo-1553175007-57ef66d90ffa'],
    video: 'whiteCoat',
    short: 'Double-faced wool blend, collarless and unlined.',
    description:
      'A collarless coat in double-faced wool that needs no lining — clean seams inside and out. Cut long and straight with dropped shoulders for an easy, sculptural line.',
    details: ['Double-faced construction', 'Hidden snap closure', 'Welt pockets'],
    fabric: '70% wool, 30% polyamide',
    care: ['Dry clean only', 'Store on a wide hanger'],
    fit: 'Oversized. Take your usual size.',
    createdAt: '2026-08-30',
  },
  {
    id: 'p06',
    slug: 'dune-knit-sweater',
    name: 'Dune Knit Sweater',
    category: 'knitwear',
    gender: 'unisex',
    price: 3999,
    colors: [
      { name: 'Oat', hex: '#d9cdb8' },
      { name: 'Stone', hex: '#9c968c' },
    ],
    sizes: TOPS,
    images: ['photo-1574201635302-388dd92a4c3f', 'photo-1610901157620-340856d0a50f'],
    video: 'desert',
    short: 'Chunky rib knit in undyed cotton-wool.',
    description:
      'A chunky rib-knit crew in an undyed cotton and wool blend — soft against skin, warm without weight. Shot in the dunes where the colour came from.',
    details: ['5-gauge rib knit', 'Fully fashioned shoulders', 'Undyed yarn'],
    fabric: '60% cotton, 40% wool',
    care: ['Hand wash cold', 'Dry flat'],
    fit: 'Relaxed. True to size.',
    createdAt: '2026-09-05',
    featured: true,
  },
  {
    id: 'p07',
    slug: 'drift-boxy-hoodie',
    name: 'Drift Boxy Hoodie',
    category: 'hoodies',
    gender: 'unisex',
    price: 2999,
    badge: 'Bestseller',
    colors: [
      { name: 'Ash', hex: '#bdbab4' },
      { name: 'Black', hex: '#111111' },
      { name: 'Ecru', hex: '#ece6d8' },
    ],
    sizes: TOPS,
    images: ['photo-1564557287817-3785e38ec1f5', 'photo-1611817757591-c3f345024273'],
    video: 'staircase',
    short: '480 GSM brushed fleece, double-layer hood.',
    description:
      'Our heaviest hoodie: 480 GSM brushed-back fleece cut boxy and short in the body, with a double-layer hood that stands up on its own. No drawcords, no logos — just weight and shape.',
    details: ['Double-layer hood', 'Kangaroo pocket with hidden phone sleeve', 'Ribbed cuffs and hem'],
    fabric: '100% cotton fleece, 480 GSM',
    care: ['Machine wash cold, inside out', 'Do not tumble dry'],
    fit: 'Boxy and cropped. Take your usual size.',
    createdAt: '2026-09-25',
    featured: true,
  },
  {
    id: 'p08',
    slug: 'static-pullover-hoodie',
    name: 'Static Pullover Hoodie',
    category: 'hoodies',
    gender: 'unisex',
    price: 3299,
    colors: [
      { name: 'Off White', hex: '#f1efe9' },
      { name: 'Washed Black', hex: '#2b2b2b' },
    ],
    sizes: TOPS,
    images: ['photo-1615397587950-3cbb55f95b77', 'photo-1614214191247-5b2d3a734f1b'],
    video: 'crewStairs',
    short: 'Garment-dyed loopback with a longer line.',
    description:
      'A longer-line pullover in garment-dyed loopback cotton. The dye settles unevenly into the seams for a broken-in look from day one.',
    details: ['Garment dyed', 'Flat-lock seams', 'Split hem'],
    fabric: '100% cotton loopback, 420 GSM',
    care: ['Wash with similar colours', 'Line dry'],
    fit: 'Relaxed, longer line.',
    createdAt: '2026-08-18',
  },
  {
    id: 'p09',
    slug: 'ritual-denim-jacket',
    name: 'Ritual Denim Jacket',
    category: 'denim',
    gender: 'unisex',
    price: 4499,
    badge: 'New',
    colors: [{ name: 'Mid Wash', hex: '#6f87a5' }],
    sizes: TOPS,
    images: ['photo-1516257984-b1b4d707412e', 'photo-1555583743-991174c11425'],
    video: 'denimJump',
    short: '14oz denim, boxy trucker cut, stone washed.',
    description:
      'A boxy trucker in 14oz denim, stone washed for a lived-in hand. Built to be thrown on, jumped in and worn for a decade.',
    details: ['14oz cotton denim', 'Copper shank buttons', 'Adjustable waist tabs'],
    fabric: '100% cotton denim, 14oz',
    care: ['Wash rarely, cold, inside out', 'Line dry'],
    fit: 'Boxy. Take your usual size.',
    createdAt: '2026-10-04',
    featured: true,
  },
  {
    id: 'p10',
    slug: 'contour-wide-leg-jeans',
    name: 'Contour Wide-Leg Jeans',
    category: 'denim',
    gender: 'women',
    price: 3499,
    colors: [
      { name: 'Light Wash', hex: '#a9bbd0' },
      { name: 'Indigo', hex: '#2f3d5c' },
    ],
    sizes: ['26', ...WAIST.slice(0, 5)],
    images: ['photo-1598554747436-c9293d6a588f', 'photo-1610241532145-96771e5088e8'],
    video: 'denimModels',
    short: 'High rise, wide leg, full-length hem.',
    description:
      'High-rise jeans that fall straight and wide from the hip, cut long enough to pool over sneakers. Rigid denim that softens to you.',
    details: ['High rise', 'Five-pocket construction', 'Unfinished hem to cut to length'],
    fabric: '100% cotton rigid denim, 12oz',
    care: ['Wash cold, inside out', 'Line dry'],
    fit: 'True to waist size. Inseam 32”.',
    createdAt: '2026-09-08',
  },
  {
    id: 'p11',
    slug: 'utility-cargo-pant',
    name: 'Utility Cargo Pant',
    category: 'bottoms',
    gender: 'unisex',
    price: 3199,
    colors: [
      { name: 'Lavender', hex: '#b9b0cf' },
      { name: 'Black', hex: '#111111' },
      { name: 'Olive', hex: '#5d6146' },
    ],
    sizes: WAIST,
    images: ['photo-1789110520465-efc5ff05c95e', 'photo-1552902865-b72c031ac5ea'],
    video: 'crewBridge',
    short: 'Cotton twill cargos with drawcord waist and toggles.',
    description:
      'Relaxed cargos in brushed cotton twill with six pockets, a drawcord waist and toggle hems you can cinch above the ankle. Our most-worn bottoms on the team.',
    details: ['Six pockets', 'Drawcord + belt loops', 'Toggle hem adjusters'],
    fabric: '100% cotton twill, 280 GSM',
    care: ['Machine wash cold', 'Tumble dry low'],
    fit: 'Relaxed. True to waist.',
    createdAt: '2026-09-16',
    featured: true,
  },
  {
    id: 'p12',
    slug: 'field-bomber-jacket',
    name: 'Field Bomber Jacket',
    category: 'outerwear',
    gender: 'men',
    price: 5299,
    colors: [
      { name: 'Moss', hex: '#4f5a3a' },
      { name: 'Black', hex: '#111111' },
    ],
    sizes: TOPS,
    soldOut: ['XXL'],
    badge: 'Low stock',
    images: ['photo-1652845008007-2a785735199c', 'photo-1551794840-8ae3b9c181f8'],
    video: 'tealNight',
    short: 'Padded nylon bomber with ribbed trims.',
    description:
      'A lightly padded bomber in matte nylon with ribbed collar, cuffs and hem. Utility sleeve pocket, quilted lining and just enough warmth for Indian winters.',
    details: ['Light recycled-poly padding', 'Sleeve utility pocket', 'Quilted lining'],
    fabric: 'Shell: 100% nylon. Padding: recycled polyester',
    care: ['Hand wash cold', 'Hang dry'],
    fit: 'Regular. True to size.',
    createdAt: '2026-09-29',
  },
  {
    id: 'p13',
    slug: 'linen-camp-shirt',
    name: 'Linen Camp Shirt',
    category: 'shirts',
    gender: 'men',
    price: 2499,
    colors: [
      { name: 'White', hex: '#f5f3ee' },
      { name: 'Sky', hex: '#a9c1d9' },
    ],
    sizes: TOPS,
    images: ['photo-1713881587420-113c1c43e28a', 'photo-1627686011747-74adda3d2343'],
    video: 'dressmaker',
    short: 'Washed European linen, camp collar, boxy fit.',
    description:
      'A boxy camp-collar shirt in washed linen that gets better every summer. Pattern-cut and finished in our studio — you can watch it being traced.',
    details: ['Camp collar', 'Corozo buttons', 'Straight hem with side vents'],
    fabric: '100% linen',
    care: ['Machine wash cold', 'Line dry', 'Iron damp'],
    fit: 'Boxy. True to size.',
    createdAt: '2026-08-22',
  },
  {
    id: 'p14',
    slug: 'atelier-oxford-shirt',
    name: 'Atelier Oxford Shirt',
    category: 'shirts',
    gender: 'unisex',
    price: 2799,
    colors: [
      { name: 'Blue', hex: '#9fb6d4' },
      { name: 'White', hex: '#f6f6f3' },
    ],
    sizes: TOPS,
    images: ['photo-1713881842156-3d9ef36418cc', 'photo-1542406775-ade58c52d2e4'],
    video: 'tailor',
    short: 'Heavy oxford cloth, button-down, relaxed.',
    description:
      'A relaxed button-down in heavy oxford cloth with a soft, unfused collar. Cut by hand in small batches — the tailor in the film is cutting this exact cloth.',
    details: ['Unfused button-down collar', 'Box pleat at back', 'Single chest pocket'],
    fabric: '100% cotton oxford',
    care: ['Machine wash 30°', 'Iron while damp'],
    fit: 'Relaxed. True to size.',
    createdAt: '2026-09-02',
  },
  {
    id: 'p15',
    slug: 'noir-slip-dress',
    name: 'Noir Slip Dress',
    category: 'dresses',
    gender: 'women',
    price: 3799,
    badge: 'New',
    colors: [{ name: 'Black', hex: '#111111' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['photo-1594739033447-80ab21e24b4c', 'photo-1656284518334-710b60cd63a0'],
    video: 'silk',
    short: 'Bias-cut satin slip with adjustable straps.',
    description:
      'A bias-cut slip in fluid satin that moves like the silk in our film. Adjustable straps, a cowl neckline and a hem that hits mid-calf.',
    details: ['Bias cut', 'Adjustable straps', 'Cowl neckline'],
    fabric: '100% polyester satin (silk-feel)',
    care: ['Hand wash cold', 'Hang dry', 'Cool iron on reverse'],
    fit: 'Close at the bust, fluid through the hip. True to size.',
    createdAt: '2026-10-01',
    featured: true,
  },
  {
    id: 'p16',
    slug: 'satin-column-dress',
    name: 'Satin Column Dress',
    category: 'dresses',
    gender: 'women',
    price: 4199,
    colors: [
      { name: 'Cocoa', hex: '#6b4a3a' },
      { name: 'Black', hex: '#111111' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['photo-1780301662392-6fea210dcd87', 'photo-1622445275992-e7efb32d2257'],
    video: 'silk2',
    short: 'Floor-length satin column with a low back.',
    description:
      'A floor-length column dress in heavy satin with a low scooped back. Simple from the front, quietly dramatic from behind.',
    details: ['Floor length', 'Low back', 'Invisible side zip'],
    fabric: '100% polyester heavy satin',
    care: ['Dry clean recommended'],
    fit: 'Close-fitting. Size up if between sizes.',
    createdAt: '2026-08-26',
  },
  {
    id: 'p17',
    slug: 'cloud-knit-cardigan',
    name: 'Cloud Knit Cardigan',
    category: 'knitwear',
    gender: 'women',
    price: 3599,
    colors: [
      { name: 'Cream', hex: '#efe7d6' },
      { name: 'Mocha', hex: '#8a6f5a' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['photo-1601379327928-bedfaf9da2d0', 'photo-1600369672890-ac00f1907858'],
    video: 'desert3',
    short: 'Brushed knit cardigan, oversized and airy.',
    description:
      'A brushed, airy cardigan that weighs almost nothing. Oversized, with dropped shoulders and oversized horn buttons.',
    details: ['Brushed finish', 'Horn-effect buttons', 'Patch pockets'],
    fabric: '50% cotton, 30% acrylic, 20% alpaca',
    care: ['Hand wash cold', 'Dry flat'],
    fit: 'Oversized. Size down for a closer fit.',
    createdAt: '2026-09-10',
  },
  {
    id: 'p18',
    slug: 'shadow-zip-hoodie',
    name: 'Shadow Zip Hoodie',
    category: 'hoodies',
    gender: 'men',
    price: 3399,
    colors: [
      { name: 'Earth', hex: '#6d5644' },
      { name: 'Black', hex: '#111111' },
    ],
    sizes: TOPS,
    images: ['photo-1578768079052-aa76e52ff62e', 'photo-1503342484812-ee33283508a5'],
    video: 'crewStairs',
    short: 'Full-zip heavyweight hoodie with a double zip.',
    description:
      'A full-zip heavyweight hoodie with a two-way zip and a hood that zips all the way to the chin. Made for night walks and cold stairwells.',
    details: ['Two-way metal zip', 'Funnel hood', 'Thumb-hole cuffs'],
    fabric: '100% cotton fleece, 450 GSM',
    care: ['Machine wash cold', 'Do not tumble dry'],
    fit: 'Regular. True to size.',
    createdAt: '2026-09-18',
  },
]

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug)
export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id)
export const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)?.label ?? c

/** Unsplash image URL with on-the-fly crop/resize (imgix params). */
export const img = (id: string, w = 800, ar = '4:5') =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&crop=entropy&w=${w}&ar=${ar}&q=78`

export const imgSrcSet = (id: string, ar = '4:5') =>
  [400, 640, 900, 1200].map((w) => `${img(id, w, ar)} ${w}w`).join(', ')
