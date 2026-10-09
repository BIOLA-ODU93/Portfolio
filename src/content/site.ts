/**
 * SITE CONTENT — everything you'll want to edit lives here.
 * Text in [square brackets] is a placeholder.
 */

export const site = {
  name: 'Abiola Oduyemi',
  displayName: 'Biola Odu',
  role: 'Brand, graphic & UI designer',
  // The line under the hero headline (from Figma: Hero — Option A)
  roles: 'Graphics designer | UI designer',
  location: 'Dublin, Ireland',
  tagline: 'Design that does more.',
  // ⚠️ Replace with your real email address.
  email: '[you@yourdomain.com]',
  description:
    'Portfolio of Abiola (Biola) Oduyemi — brand, graphic and UI designer based in Dublin.',
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
 * THE JOURNEY — the 3D map section (from your CV).
 * Each stop is a place on the map, in date order. `at` is its position on the
 * map (world units — leave as is unless you move a stop). Text in [brackets]
 * is a placeholder: replace it with the real year/city.
 */
export type Stop = {
  when: string;
  title: string;
  role: string;
  place: string;
  region: 'nigeria' | 'route' | 'ireland';
  at: [number, number];
  points: string[];
  metrics?: string[];
  links?: { label: string; href: string }[];
};

export const journey = {
  kicker: 'The journey',
  title: 'From Nigeria to Dublin',
  intro: 'Scroll to travel through my path — the places, the roles and what changed because of the work.',
  stops: [
    {
      when: '[Year – Year]',
      title: 'Babcock University',
      role: 'BSc (Hons) Mass Communication',
      place: 'Ogun State, Nigeria',
      region: 'nigeria',
      at: [250, 1240],
      points: ['Where it started: storytelling, media and how messages land with people.'],
    },
    {
      when: '[Year]',
      title: 'Learning design',
      role: 'Brand Identity Design · UI/UX Design',
      place: '[City], Nigeria',
      region: 'nigeria',
      at: [175, 1322],
      points: ['Brand Identity Design — Orange Academy.', 'UI/UX Design Certification — Design with Dezyn.'],
    },
    {
      when: '2022 – 2023',
      title: 'Sky Capital & Financial',
      role: 'Product Designer',
      place: '[City], Nigeria',
      region: 'nigeria',
      at: [335, 1290],
      points: [
        'Redesigned onboarding, transaction, reporting and account flows across web and mobile.',
        'Built reusable component libraries and visual standards.',
      ],
      metrics: ['~40% fewer support tickets', '~50% higher retention'],
    },
    {
      when: '2024',
      title: 'Freelance',
      role: 'UI/UX & Product Designer',
      place: 'Remote',
      region: 'route',
      at: [448, 687],
      points: [
        'End-to-end product design for fintech and logistics start-ups.',
        'Modular design systems; interface assets for investor demos and user pilots.',
      ],
    },
    {
      when: '[Year]',
      title: 'Griffith College Dublin',
      role: 'MSc (Hons) Interactive Digital Media',
      place: 'Dublin, Ireland',
      region: 'ireland',
      at: [1880, 500],
      points: ['MSc in Interactive Digital Media.', 'Professional Diploma in Design — UCD Professional Academy.'],
    },
    {
      when: 'Jan – Mar 2025',
      title: 'HNG',
      role: 'Product Designer',
      place: 'Remote',
      region: 'route',
      at: [1415, 446],
      points: ['Restructured product dashboards and partnered with Sales on demo assets.'],
      metrics: ['~35% fewer navigation errors'],
    },
    {
      when: 'Apr 2025 – Now',
      title: 'Gontrel',
      role: 'UX / Product Designer',
      place: 'Dublin, Ireland',
      region: 'ireland',
      at: [1928, 452],
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
      region: 'ireland',
      at: [1872, 420],
      points: ['Luciana — AI virtual try-on for premium fashion.', 'Ansarr — two-sided research marketplace.', 'Praisetival Ireland — worship & events platform.'],
      links: [
        { label: 'shop-luciana.co', href: 'https://shop-luciana.co' },
        { label: 'ansarr.com', href: 'https://ansarr.com' },
        { label: 'praisetivalireland.ie', href: 'https://praisetivalireland.ie' },
      ],
    },
  ] satisfies Stop[],
};
