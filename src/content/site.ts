/**
 * SITE CONTENT — everything you'll want to edit lives here.
 * Text in [square brackets] is a placeholder.
 */

export const site = {
  name: 'Abiola Oduyemi',
  displayName: 'Biola Odu',
  role: 'Brand, graphic & UI designer',
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
  photo: { src: '', alt: 'Biola’s desk in Dublin', width: 3000, height: 2000 },
  screen: [
    [36, 26],
    [64, 26],
    [64, 56],
    [36, 56],
  ] as [number, number][],
  focus: [50, 41] as [number, number],
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
