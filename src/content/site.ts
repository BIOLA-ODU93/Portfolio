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
  statement: 'Hi, I’m Biola. Nine years in design, from insurance campaigns in Lagos to product teams in Dublin, and *one job the whole way:* making things people understand.',
  start: {
    label: 'Where it began',
    text: 'I studied mass communication at Babcock University, and one lesson stuck: a message only works if people get it. I started as a designer in 2017, creating campaigns at AIICO Insurance for five years. In 2022 I moved into product design at Sky Capital in Lagos, and grew from designing for one office to leading design across Lagos, Sierra Leone and The Gambia. In 2024 I came to Dublin for an MSc in Interactive Digital Media.',
    portrait: { src: '/images/about-headshot@1x.webp', src2x: '/images/about-headshot@2x.webp', alt: 'Abiola Oduyemi in a black suit and shirt' },
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
    { value: '40%', label: 'fewer support tickets', where: 'Sky Capital · fintech' },
    { value: '50%', label: 'higher user retention', where: 'Sky Capital · fintech' },
    { value: '3', label: 'countries designed for', where: 'Lagos · Sierra Leone · The Gambia' },
    { value: '9+', label: 'years in design', where: 'Brand, graphic & product' },
  ],
  best: {
    label: 'How I work',
    skills: 'User research (interviews, surveys, competitive analysis), journey mapping, sitemaps, user flows, wireframes, prototyping, usability and A/B testing, accessible UI (WCAG), design systems, developer handoff, brand identity, logo design and illustration. Figma, Framer, Adobe Illustrator & Photoshop, HTML/CSS.',
    story: 'Research first, then flows, prototypes and testing, and a design system so it all stays consistent after launch. My brand and graphic background means it looks right too.',
    now: 'Currently Product & Graphic Designer at King’s Court, Dublin, leading the design of the organisation’s new website. Open to Product Designer roles in Ireland and remote.',
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
  /** short id for the stop's own link, e.g. /#sky-capital */
  slug: string;
  /** optional photo for the stop panel (otherwise a quiet placeholder) */
  photo?: string;
  /** case studies linked from the stop panel */
  caseStudies?: { label: string; href: string }[];
};

export const journey = {
  kicker: 'The journey',
  title: 'From Lagos to Dublin',
  intro: 'Travel my path — by danfo, by plane, by car — and see what changed because of the work.',
  stops: [
    {
      when: '2010 – 2014',
      title: 'Babcock University',
      slug: 'babcock',
      photo: '/images/journey/babcock.webp',
      role: 'BSc Mass Communication',
      place: 'Ilishan-Remo, Ogun State',
      pos: [3.7224, 6.8901],
      zoom: 12,
      points: [
        'Where it started: storytelling, media and how messages land with people.',
        'In 300 Level I was elected Social Director of my department, my first taste of bringing people together around an idea.',
        '2013: first design internship at Lawson Thomas & Colleague, working alongside an art director and learning the Adobe tools.',
      ],
    },
    {
      when: '2015 – 2016',
      title: 'NYSC',
      slug: 'nysc',
      photo: '/images/journey/nysc.webp',
      role: 'Fine Art Teacher · Ibadan Grammar School',
      place: 'Ibadan, Oyo State',
      pos: [3.8972, 7.3784],
      zoom: 11.5,
      by: 'danfo',
      route: 'babcock-ibadan',
      midZoom: 9.4,
      points: ['A year of national service, teaching Fine Art at Ibadan Grammar School.', 'I also played in the NYSC Ibadan band, putting my music to work in the corps’ community service.'],
    },
    {
      when: '2017 – 2022',
      title: 'AIICO Insurance',
      slug: 'aiico',
      photo: '/images/journey/aiico.webp',
      role: 'Junior Designer',
      place: 'Victoria Island, Lagos',
      pos: [3.4185, 6.4295],
      zoom: 14.3,
      by: 'danfo',
      route: 'ibadan-aiico',
      midZoom: 9.2,
      points: [
        'Designed all creative for the Bancassurance channel: insurance sold through partner banks.',
        'Produced marketing materials across the company’s products and campaigns.',
      ],
    },
    {
      when: '2022 – 2024',
      title: 'Sky Capital & Allied Financial Services',
      slug: 'sky-capital',
      photo: '/images/journey/sky-capital.webp',
      role: 'Product Designer & Graphic Designer',
      place: 'Victoria Island, Lagos',
      pos: [3.426, 6.43],
      zoom: 14.3,
      by: 'danfo',
      route: 'aiico-vi',
      midZoom: 13.6,
      points: [
        'Grew from designing for the Lagos office to leading design for the Lagos, Sierra Leone and The Gambia branches.',
        'Redesigned onboarding, transaction, reporting and account flows across web and mobile.',
      ],
      metrics: ['40% fewer support tickets', '50% higher retention', '3 countries'],
    },
    {
      when: 'Oct 2024',
      title: 'Leaving Lagos',
      slug: 'leaving-lagos',
      photo: '/images/journey/leaving-lagos.webp',
      role: 'Murtala Muhammed International Airport',
      place: 'Ikeja, Lagos',
      pos: [3.3209, 6.5743],
      zoom: 14,
      by: 'danfo',
      route: 'vi-los',
      midZoom: 11.3,
      points: ['Next stop: Dublin, and a master’s degree.'],
    },
    {
      when: 'Oct 2024',
      title: 'Hello, Dublin',
      slug: 'hello-dublin',
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
      slug: 'griffith',
      photo: '/images/journey/griffith.webp',
      role: 'MSc Interactive Digital Media',
      place: 'Dublin, Ireland',
      pos: [-6.2782, 53.3306],
      zoom: 14.5,
      by: 'car',
      route: 'dub-griffith',
      midZoom: 11.8,
      points: ['Graduated in October 2025.'],
    },
    {
      when: 'Jan – Jul 2025',
      title: 'Gontrel',
      slug: 'gontrel',
      role: 'Junior Product Designer (Contract)',
      place: 'Dublin, Ireland',
      pos: [-6.2607, 53.3505],
      zoom: 15,
      by: 'car',
      route: 'griffith-oconnell',
      midZoom: 13.6,
      points: [
        'Designed features for a restaurant discovery app that ranks restaurants by user satisfaction.',
        'User interviews, journey mapping, usability testing and engineering-ready specs.',
      ],
    },
    {
      when: 'Jul 2025 – Now',
      title: 'King’s Court',
      slug: 'kings-court',
      role: 'Product & Graphic Designer',
      place: 'Dublin, Ireland',
      pos: [-6.2607, 53.3505],
      zoom: 15.6,
      points: ['Leading the design of the organisation’s new website, from user flows to responsive UI.', 'Monthly campaigns and visual communications for its events and programmes.'],
    },
    {
      when: 'Now',
      title: 'Shipping & building',
      slug: 'shipping',
      role: 'Lead Designer on live products',
      place: 'Dublin & online',
      pos: [-6.2607, 53.3505],
      zoom: 13.5,
      points: ['Live products I’ve designed, from a festival site rebuilt in two weeks to fashion e-commerce with AI try-on and a research marketplace.'],
      caseStudies: [
        { label: 'Praisetival Ireland', href: '/work/praisetival' },
        { label: 'Luciana', href: '/work/luciana' },
      ],
      links: [
        { label: 'shop-luciana.co', href: 'https://shop-luciana.co' },
        { label: 'praisetivalireland.ie', href: 'https://praisetivalireland.ie' },
        { label: 'ansarr.com', href: 'https://ansarr.com' },
      ],
    },
  ] satisfies Stop[],
};
