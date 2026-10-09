/**
 * Real filmed footage — no renders, no illustrations.
 * All clips are free-licence stock (Pexels License) streamed from the Pexels CDN,
 * which serves them with CORS + byte-range support (needed for scroll-scrubbing).
 * To self-host: download the files, drop them in /public/media and swap the URLs.
 */
export type Clip = {
  hd: string
  sd: string
  poster: string
  orientation: 'landscape' | 'portrait'
  title: string
  source: string
}

const px = (id: string, file: string) => `https://videos.pexels.com/video-files/${id}/${file}.mp4`
const poster = (path: string) => `https://images.pexels.com/videos/${path}?auto=compress&cs=tinysrgb&w=1280`
const page = (slug: string) => `https://www.pexels.com/video/${slug}/`

export const CLIPS = {
  turn: {
    hd: px('9558217', '9558217-hd_1366_720_25fps'),
    sd: px('9558217', '9558217-sd_960_506_25fps'),
    poster: poster('9558217/pexels-photo-9558217.jpeg'),
    orientation: 'landscape',
    title: 'Oversized tee, full 360° turn',
    source: page('a-man-wearing-shirt-while-turning-around-9558217'),
  },
  float: {
    hd: px('8102666', '8102666-hd_1366_720_25fps'),
    sd: px('8102666', '8102666-sd_960_506_25fps'),
    poster: poster('8102666/pexels-photo-8102666.jpeg'),
    orientation: 'landscape',
    title: 'Garment floating mid-air',
    source: page('clothing-flying-in-the-air-8102666'),
  },
  silk: {
    hd: px('7677321', '7677321-hd_1280_720_25fps'),
    sd: px('7677321', '7677321-sd_960_540_25fps'),
    poster: poster('7677321/abstract-art-background-blur-7677321.jpeg'),
    orientation: 'landscape',
    title: 'Black silk in slow motion',
    source: page('close-up-video-of-a-black-silk-cloth-7677321'),
  },
  silk2: {
    hd: px('7677180', '7677180-hd_1280_720_25fps'),
    sd: px('7677180', '7677180-sd_960_540_25fps'),
    poster: poster('7677180/pexels-photo-7677180.jpeg'),
    orientation: 'landscape',
    title: 'Satin drape',
    source: page('a-black-silky-fabric-7677180'),
  },
  jacketNight: {
    hd: px('10380604', '10380604-hd_1366_720_25fps'),
    sd: px('10380604', '10380604-sd_960_506_25fps'),
    poster: poster('10380604/pexels-photo-10380604.jpeg'),
    orientation: 'landscape',
    title: 'Windbreaker after dark',
    source: page('man-standing-by-car-at-night-10380604'),
  },
  crewBridge: {
    hd: px('10378786', '10378786-hd_1366_720_25fps'),
    sd: px('10378786', '10378786-sd_960_506_25fps'),
    poster: poster('10378786/pexels-photo-10378786.jpeg'),
    orientation: 'landscape',
    title: 'Crew under the bridge',
    source: page('women-and-man-standing-at-night-10378786'),
  },
  crewStairs: {
    hd: px('10378793', '10378793-hd_1366_720_25fps'),
    sd: px('10378793', '10378793-sd_960_506_25fps'),
    poster: poster('10378793/pexels-photo-10378793.jpeg'),
    orientation: 'landscape',
    title: 'Night stairwell',
    source: page('women-and-man-standing-sitting-and-crouching-in-city-10378793'),
  },
  tealNight: {
    hd: px('10380615', '10380615-hd_1366_720_25fps'),
    sd: px('10380615', '10380615-sd_960_506_25fps'),
    poster: poster('10380615/pexels-photo-10380615.jpeg'),
    orientation: 'landscape',
    title: 'Teal shell, night light',
    source: page('light-on-women-and-man-standing-at-night-10380615'),
  },
  desert: {
    hd: px('5840828', '5840828-hd_1366_720_25fps'),
    sd: px('5840828', '5840828-sd_960_506_25fps'),
    poster: poster('5840828/pexels-photo-5840828.jpeg'),
    orientation: 'landscape',
    title: 'Knitwear in the dunes',
    source: page('male-models-in-the-desert-5840828'),
  },
  desert3: {
    hd: px('5840821', '5840821-hd_1366_720_25fps'),
    sd: px('5840821', '5840821-sd_960_506_25fps'),
    poster: poster('5840821/pexels-photo-5840821.jpeg'),
    orientation: 'landscape',
    title: 'Three in the dunes',
    source: page('three-models-posing-in-the-desert-5840821'),
  },
  whiteCoat: {
    hd: px('7304450', '7304450-hd_1366_720_25fps'),
    sd: px('7304450', '7304450-sd_960_506_25fps'),
    poster: poster('7304450/pexels-photo-7304450.jpeg'),
    orientation: 'landscape',
    title: 'White wool coat editorial',
    source: page('woman-wearing-white-coat-posing-in-the-camera-7304450'),
  },
  trench: {
    hd: px('8343223', '8343223-hd_1366_720_25fps'),
    sd: px('8343223', '8343223-sd_960_506_25fps'),
    poster: poster('8343223/pexels-photo-8343223.jpeg'),
    orientation: 'landscape',
    title: 'Trench, turning',
    source: page('a-fashionable-woman-turning-around-8343223'),
  },
  darkness: {
    hd: px('10140474', '10140474-hd_1366_720_25fps'),
    sd: px('10140474', '10140474-sd_960_506_25fps'),
    poster: poster('10140474/pexels-photo-10140474.jpeg'),
    orientation: 'landscape',
    title: 'Walking out of the dark',
    source: page('woman-walking-out-of-darkness-10140474'),
  },
  fabricWave: {
    hd: px('10143261', '10143261-hd_1366_720_25fps'),
    sd: px('10143261', '10143261-sd_960_506_25fps'),
    poster: poster('10143261/abstract-adult-art-beach-10143261.jpeg'),
    orientation: 'landscape',
    title: 'Fabric in the wind',
    source: page('men-posing-with-fabric-waving-over-their-heads-10143261'),
  },
  tailor: {
    hd: px('6765471', '6765471-hd_1280_720_25fps'),
    sd: px('6765471', '6765471-sd_960_540_25fps'),
    poster: poster('6765471/pexels-photo-6765471.jpeg'),
    orientation: 'landscape',
    title: 'Cutting black wool in the atelier',
    source: page('an-elderly-man-cutting-a-black-fabric-6765471'),
  },
  dressmaker: {
    hd: px('6460176', '6460176-hd_1280_720_25fps'),
    sd: px('6460176', '6460176-sd_960_540_25fps'),
    poster: poster('6460176/buttons-chalk-clothing-fitting-6460176.jpeg'),
    orientation: 'landscape',
    title: 'Tracing the pattern',
    source: page('dressmaker-tracing-pattern-on-fabric-6460176'),
  },
  hangers: {
    hd: px('9594994', '9594994-hd_1366_720_25fps'),
    sd: px('9594994', '9594994-sd_960_506_25fps'),
    poster: poster('9594994/adult-art-baby-bed-9594994.jpeg'),
    orientation: 'landscape',
    title: 'On the rail',
    source: page('garments-on-clothes-hangers-9594994'),
  },
  denimJump: {
    hd: px('6770921', '6770921-hd_720_1280_25fps'),
    sd: px('6770921', '6770921-sd_540_960_25fps'),
    poster: poster('6770921/pexels-photo-6770921.jpeg'),
    orientation: 'portrait',
    title: 'Denim, mid-jump',
    source: page('man-wearing-denim-jacket-jumping-6770921'),
  },
  streetGirls: {
    hd: px('9512077', '9512077-hd_720_1366_25fps'),
    sd: px('9512077', '9512077-sd_506_960_25fps'),
    poster: poster('9512077/activity-adult-architecture-beautiful-9512077.jpeg'),
    orientation: 'portrait',
    title: 'Boxy hoodie, street',
    source: page('fashionable-girls-looking-at-the-camera-9512077'),
  },
  cropStreet: {
    hd: px('18156298', '18156298-hd_720_1280_25fps'),
    sd: px('18156298', '18156298-sd_540_960_25fps'),
    poster: poster('18156298/pexels-photo-18156298.jpeg'),
    orientation: 'portrait',
    title: 'Crop and cargo',
    source: page('a-woman-in-a-crop-top-and-pants-standing-on-the-street-18156298'),
  },
  staircase: {
    hd: px('5561960', '5561960-hd_720_1280_25fps'),
    sd: px('5561960', '5561960-sd_540_960_25fps'),
    poster: poster('5561960/pexels-photo-5561960.jpeg'),
    orientation: 'portrait',
    title: 'Staircase portrait',
    source: page('man-posing-on-a-staircase-5561960'),
  },
  denimModels: {
    hd: px('6770045', '6770045-hd_720_1280_25fps'),
    sd: px('6770045', '6770045-sd_540_960_25fps'),
    poster: poster('6770045/afro-hair-beautiful-clothes-denim-6770045.jpeg'),
    orientation: 'portrait',
    title: 'Double denim',
    source: page('models-in-denim-clothes-6770045'),
  },
  rack: {
    hd: px('8322393', '8322393-hd_720_1366_25fps'),
    sd: px('8322393', '8322393-sd_506_960_25fps'),
    poster: poster('8322393/pexels-photo-8322393.jpeg'),
    orientation: 'portrait',
    title: 'The rack',
    source: page('hanging-clothes-8322393'),
  },
  gothic: {
    hd: px('34373833', '14561896_720_1280_30fps'),
    sd: px('34373833', '14561895_540_960_30fps'),
    poster: poster('34373833/pexels-photo-34373833.jpeg'),
    orientation: 'portrait',
    title: 'Black dress, studio',
    source: page('gothic-fashion-shoot-with-model-in-black-dress-34373833'),
  },
  studioLight: {
    hd: px('36726516', '15565108_720_1280_30fps'),
    sd: px('36726516', '15565104_540_960_30fps'),
    poster: poster('36726516/pexels-photo-36726516.jpeg'),
    orientation: 'portrait',
    title: 'Under the strobe',
    source: page('fashionable-woman-in-studio-with-lighting-36726516'),
  },
  runwayRed: {
    hd: px('19862866', '19862866-hd_720_1280_30fps'),
    sd: px('19862866', '19862866-sd_540_960_30fps'),
    poster: poster('19862866/beauty-model-black-model-black-models-face-model-19862866.jpeg'),
    orientation: 'portrait',
    title: 'Runway in red',
    source: page('fashion-model-19862866'),
  },
} satisfies Record<string, Clip>

export type ClipKey = keyof typeof CLIPS
