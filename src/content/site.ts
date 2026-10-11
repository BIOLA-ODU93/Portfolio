/**
 * SITE CONTENT — everything you'll want to edit lives here.
 * Text in [square brackets] is a placeholder.
 */

export const site = {
  name: 'Abiola Oduyemi',
  displayName: 'Biola Odu',
  role: 'Product Designer & Graphic Designer',
  // The line under the hero headline (from Figma: Hero — Option A)
  roles: 'Product Designer | Graphic Designer',
  location: 'Dublin, Ireland',
  tagline: 'Design that does more.',
  email: 'abiolaoduyemi@outlook.com',
  // Used by "Let's talk": phone for Call, the same number for WhatsApp (digits only, with country code)
  phone: '+353 87 000 6960',
  whatsapp: '353870006960',
  whatsappMessage: 'Hi Biola, I saw your portfolio and would love to chat.',
  linkedin: 'https://www.linkedin.com/in/abiolaoduyemi',
  cv: '/abiola-oduyemi-cv.pdf',
  description:
    'Portfolio of Abiola (Biola) Oduyemi — product designer and graphic designer based in Dublin, designing web and mobile products for fintech and B2B.',
};

/**
 * The desk — a photo of your real workspace. Your projects play on its screen.
 *
 * 1. Put the photo in /public/images/ and set `src` (e.g. '/images/desk.jpg').
 * 2. Set `width` and `height` to the photo's pixel size.
 * 3. `screen` is the four corners of the laptop/monitor screen, as percentages
 *    of the photo: top-left, top-right, bottom-right, bottom-left. The project
 *    images are warped to fit those corners exactly (perspective included).
 * 4. `focus` is the point that must stay visible on narrow (phone) screens —
 *    usually the middle of the screen.
 */
export const desk = {
  photo: { src: '/images/desk.jpg', alt: 'Biola’s desk in Dublin: a curved monitor and laptop on a wooden desk in warm evening light', width: 1500, height: 2000 },
  screen: [
    [22.1, 18.2],
    [73.0, 18.6],
    [73.7, 40.0],
    [24.0, 45.0],
  ] as [number, number][],
  focus: [48, 33] as [number, number],
};

/** Projects shown on the screen, in order. `href` links to the case study or live site. */
export const projects = [
  {
    name: 'Luciana',
    type: 'Web application',
    image: '/images/work/luciana.jpg',
    href: '',
  },
];

/**
 * ABOUT ME — four short chapters, then the proof:
 * statement → 01 where it began → 02 off the clock → line → what changed → 03 how I work.
 * Wrap words in *asterisks* for the accent colour. [brackets] = placeholder.
 */
export const about = {
  statement: 'Hi, I’m Biola. I take products that feel complicated and make them *feel obvious,* then I check the numbers to be sure.',
  start: {
    label: 'Where it began',
    text: 'I studied mass communication at Babcock University, and one lesson stuck: a message only works if people get it. In 2019 I started designing in Ikeja, brand identity first, then UI/UX. By 2022 I was building fintech products at Sky Capital in Lagos, and in 2024 I moved to Dublin for an MSc in Interactive Digital Media.',
    portrait: { src: '/images/portrait-colour@1x.webp', src2x: '/images/portrait-colour@2x.webp', alt: 'Abiola Oduyemi in a striped shirt and patterned tie' },
  },
  outside: {
    label: 'Off the clock',
    text: 'When I’m not designing, I’m behind a drum kit. A drummer keeps time for everyone else, and that’s taught me a lot about rhythm, timing and knowing when to hold back, which is most of good interface design too. The rest of the time, I’m out with friends.',
    // Photos for the scrolling strip. Leave src '' for a labelled placeholder.
    photos: [
      { src: '/images/outside/drums.webp', alt: 'Biola playing drums on stage, in black and white', caption: 'Behind the kit' },
      { src: '/images/outside/friends.webp', alt: 'Biola with two friends at a night out', caption: 'With friends' },
      { src: '/images/outside/evening.webp', alt: 'Biola in a red number 18 jersey on a balcony at sunset', caption: 'Golden hour' },
      { src: '/images/desk.jpg', alt: 'My desk in Dublin', caption: 'My desk, Dublin' },
    ],
  },
  focus: 'Pretty screens are easy. I care about the ones that *change the numbers.*',
  resultsLabel: 'What changed',
  results: [
    { value: '40%', label: 'less workflow friction', where: 'Gontrel · B2B data product' },
    { value: '35%', label: 'fewer navigation errors', where: 'HNG · dashboards' },
    { value: '40%', label: 'fewer support tickets', where: 'Sky Capital · fintech' },
    { value: '50%', label: 'higher user retention', where: 'Sky Capital · fintech' },
  ],
  best: {
    label: 'How I work',
    skills: 'UX research, user flows, journey mapping, interaction design, UI design, prototyping, usability testing, design systems, dashboards, web & mobile, Figma, Framer, brand & visual design.',
    story: 'Research first, then flows, prototypes and testing, and a design system so it all stays consistent after launch. My brand background means it looks right too.',
    now: 'Currently leading end-to-end design at Gontrel, a data-centric B2B product in Dublin.',
  },
};

/**
 * THE JOURNEY — the map section (from your CV).
 * Stops are in date order. `pos` is [longitude, latitude] (area level — never a
 * home address). `by` is how you arrived at this stop; `route` is the saved
 * driving route used for that leg (src/data/journey-routes.json).
 * Text in [brackets] is a placeholder.
 */
export type Stop = {
  when: string;
  title: string;
  role: string;
  place: string;
  pos: [number, number];
  zoom: number;
  by?: 'danfo' | 'plane' | 'car';
  route?: string;
  midZoom?: number;
  points: string[];
  metrics?: string[];
  links?: { label: string; href: string }[];
};

export const journey = {
  kicker: 'The journey',
  title: 'From Nigeria to Dublin',
  intro: 'Travel my path — by danfo, by plane, by car — and see what changed because of the work.',
  stops: [
    {
      when: '2014',
      title: 'Babcock University',
      role: 'BSc (Hons) Mass Communication',
      place: 'Ilishan-Remo, Ogun State',
      pos: [3.7224, 6.8901],
      zoom: 12,
      points: ['Graduated in 2014. Where it started: storytelling, media and how messages land with people.'],
    },
    {
      when: '2015',
      title: 'NYSC',
      role: 'National Youth Service Corps',
      place: 'Ibadan, Oyo State',
      pos: [3.8972, 7.3784],
      zoom: 11.5,
      by: 'danfo',
      route: 'babcock-ibadan',
      midZoom: 9.4,
      points: ['A year of national service in Ibadan.'],
    },
    {
      when: '2019',
      title: 'Learning design',
      role: 'Brand Identity Design · UI/UX Design',
      place: 'Ikeja, Lagos',
      pos: [3.3516, 6.6016],
      zoom: 12.5,
      by: 'danfo',
      route: 'ibadan-ikeja',
      midZoom: 9.2,
      points: ['Brand Identity Design — Orange Academy.', 'UI/UX Design Certification — Design with Dezyn.'],
    },
    {
      when: '2022 – 2023',
      title: 'Sky Capital & Financial',
      role: 'Product Designer',
      place: 'Victoria Island, Lagos',
      pos: [3.426, 6.43],
      zoom: 13.2,
      by: 'danfo',
      route: 'ikeja-vi',
      midZoom: 11.3,
      points: [
        'Redesigned onboarding, transaction, reporting and account flows across web and mobile.',
        'Built reusable component libraries and visual standards.',
      ],
      metrics: ['~40% fewer support tickets', '~50% higher retention'],
    },
    {
      when: 'Jan – Oct 2024',
      title: 'Freelance',
      role: 'UI/UX & Product Designer',
      place: 'Magodo, Lagos',
      pos: [3.3778, 6.6181],
      zoom: 13,
      by: 'danfo',
      route: 'vi-magodo',
      midZoom: 11.3,
      points: [
        'End-to-end product design for fintech and logistics start-ups.',
        'Modular design systems; interface assets for investor demos and user pilots.',
      ],
    },
    {
      when: 'Oct 2024',
      title: 'Leaving Lagos',
      role: 'Murtala Muhammed International Airport',
      place: 'Ikeja, Lagos',
      pos: [3.3209, 6.5743],
      zoom: 13,
      by: 'danfo',
      route: 'magodo-los',
      midZoom: 12,
      points: ['Next stop: Dublin, and a master’s degree.'],
    },
    {
      when: 'Oct 2024',
      title: 'Hello, Dublin',
      role: 'Dublin Airport',
      place: 'Dublin, Ireland',
      pos: [-6.2473, 53.4283],
      zoom: 12.5,
      by: 'plane',
      midZoom: 2.6,
      points: ['A new city, a new chapter.'],
    },
    {
      when: 'Oct 2024 – Oct 2025',
      title: 'Griffith College Dublin',
      role: 'MSc (Hons) Interactive Digital Media',
      place: 'Dublin, Ireland',
      pos: [-6.2782, 53.3306],
      zoom: 14.5,
      by: 'car',
      route: 'dub-griffith',
      midZoom: 11.8,
      points: ['Graduated in October 2025.', 'Professional Diploma in Design — UCD Professional Academy.'],
    },
    {
      when: 'Jan – Mar 2025',
      title: 'HNG',
      role: 'Product Designer (Internship) · Remote',
      place: 'Dublin, Ireland',
      pos: [-6.2607, 53.3505],
      zoom: 15,
      by: 'car',
      route: 'griffith-oconnell',
      midZoom: 13.6,
      points: ['Restructured product dashboards and partnered with Sales on demo assets.'],
      metrics: ['~35% fewer navigation errors'],
    },
    {
      when: 'Apr 2025 – Now',
      title: 'Gontrel',
      role: 'UX / Product Designer',
      place: 'Dublin, Ireland',
      pos: [-6.2607, 53.3505],
      zoom: 15.6,
      points: [
        'Leading end-to-end design of a data-centric B2B product for enterprise users.',
        'User interviews, workflow mapping, usability testing and engineering-ready specs.',
      ],
      metrics: ['~40% less workflow friction'],
    },
    {
      when: 'Now',
      title: 'Shipping & building',
      role: 'Lead Designer on live products',
      place: 'Dublin & online',
      pos: [-6.2607, 53.3505],
      zoom: 13.5,
      points: ['Luciana — AI virtual try-on for premium fashion.', 'Ansarr — two-sided research marketplace.', 'Teel — payment experience for restaurant merchants.', 'Praisetival Ireland — worship & events platform.'],
      links: [
        { label: 'shop-luciana.co', href: 'https://shop-luciana.co' },
        { label: 'ansarr.com', href: 'https://ansarr.com' },
        { label: 'teel.ie', href: 'https://teel.ie' },
        { label: 'praisetivalireland.ie', href: 'https://praisetivalireland.ie' },
      ],
    },
  ] satisfies Stop[],
};
