/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit everything on the page from this file.
 * ─────────────────────────────────────────────────────────────
 *
 *  Anything wrapped in [square brackets] is a PLACEHOLDER.
 *  Placeholders are styled on the page with a dashed outline so
 *  they're easy to spot. Replace the text (and remove the brackets)
 *  and the placeholder styling disappears automatically.
 *
 *  Images: drop files into /public/images/work/ and reference them
 *  as '/images/work/your-file.jpg'. Leave `src` empty ('') to show
 *  a labelled placeholder frame instead.
 */

export const site = {
  name: 'Abiola Oduyemi',
  // The short name used as your wordmark and the big hero title.
  displayName: 'Biola Odu',
  shortName: 'Abiola',
  roles: ['Brand design', 'Graphic design', 'UI design'],
  title: 'Abiola Oduyemi — Brand, graphic & UI designer',
  description:
    'Portfolio of Abiola Oduyemi, a brand, graphic and UI designer moving from visual identity into digital products and live websites.',
  // Optional: where you're based. Leave '' to hide.
  location: 'Dublin, Ireland',
};

export const contact = {
  // ⚠️ Replace with your real email address.
  email: '[you@yourdomain.com]',
  // Set `href` to your profile URL. Remove any you don't use.
  socials: [
    { label: 'LinkedIn', href: '' },
    { label: 'Behance', href: '' },
    { label: 'Dribbble', href: '' },
    { label: 'Instagram', href: '' },
  ],
  // Optional: link to a CV / résumé PDF placed in /public (e.g. '/abiola-oduyemi-cv.pdf').
  cv: '',
};

// The six chapters — used by the menu and the header's "current chapter" indicator.
export const chapters = [
  { id: 'top', label: 'Opening', note: 'The dial' },
  { id: 'about', label: 'About me', note: 'Five years' },
  { id: 'work', label: 'Selected work', note: 'Projects' },
  { id: 'process', label: 'How I work', note: 'Process' },
  { id: 'next', label: 'What’s next', note: 'Direction' },
  { id: 'contact', label: 'Contact', note: 'Say hello' },
];

/* ── 01 · Opening — the adire dial ──────────────────────────── */
/*  The first screen. Drag (or use ← →) to turn the dial; ENTER takes
    you to that place. `go` is either a map stop number (1–4, in the
    order of `atlas.locations`) or a link like '#contact'.
    `motif` is one of: rings | sun | leaf | grid | spiral.            */
export const dial = {
  // The script word is an image exported from Figma (Filmotype Yukon).
  scriptWord: { src: '/brand/design-word.png', alt: 'Design' },
  headline: 'That does more',
  hint: 'Drag the dial to turn',
  sections: [
    { label: 'About me', blurb: 'Who I am and how I got here', motif: 'rings', go: 1 },
    { label: 'Graphic works', blurb: 'Posters, layouts and visual pieces', motif: 'sun', go: 2 },
    { label: 'Brand identities', blurb: 'Marks, colour and the systems behind them', motif: 'leaf', go: 3 },
    { label: 'UI & web', blurb: 'Interfaces and websites that are live', motif: 'grid', go: 4 },
    { label: 'Contact', blurb: 'Start a project or just say hello', motif: 'spiral', go: '#contact' },
  ],
};

/* ── The map (3D atlas) — follows the dial ─────────────────── */
/*  The hero is a map you travel through by scrolling. Each location
    is one stop. The order here is the order of the journey; `id`
    must stay one of: about | graphics | identity | ui.               */
export const atlas = {
  title: 'Four places, one practice.',
  roles: 'The map',
  scrollHint: 'Scroll to explore',
  locations: [
    {
      id: 'about',
      label: 'About me',
      kicker: 'Start here',
      text: 'I’m Abiola Oduyemi — a brand, graphic and UI designer. Over five years my work has grown from graphics and identity into websites that are live and in use.',
      cta: { label: 'Read my story', href: '#about' },
    },
    {
      id: 'graphics',
      label: 'Graphic works',
      kicker: 'Where it began',
      text: 'Posters, layouts and visual pieces — the craft my practice was built on.',
      cta: { label: 'See graphic works', href: '#work-graphics' },
    },
    {
      id: 'identity',
      label: 'Brand identities',
      kicker: 'Giving brands a face',
      text: 'Marks, colour, type and the systems that hold a brand together.',
      cta: { label: 'See brand identities', href: '#work-identity' },
    },
    {
      id: 'ui',
      label: 'UI & web',
      kicker: 'Live and in use',
      text: 'Interfaces and websites designed around what people need to do — and shipped.',
      cta: { label: 'See UI & web work', href: '#work-ui' },
    },
  ],
};

/* ── 02 · About me ────────────────────────────────────────── */
export const about = {
  title: 'About *me*',
  // Short paragraphs about you. Edit freely — keep it in your own voice.
  bio: [
    'I’m Abiola Oduyemi — Biola — a brand, graphic and UI designer. I started out making graphics and visual identities, and over five years my work has moved steadily toward the screen.',
    'Today I design websites that are live and in use. I’m excited by how closely design and technology now work together, and I keep learning the tools that help ideas become real products.',
  ],
  // Put a portrait in /public/images/ and set the path, e.g. '/images/portrait.jpg'.
  portrait: { src: '', alt: 'Portrait of Abiola Oduyemi' },
  facts: [
    { label: 'Based in', value: 'Dublin, Ireland' },
    { label: 'Practice', value: 'Brand · Graphic · UI' },
    { label: 'Experience', value: '5 years' },
  ],
};

/* ── The journey (part of About me)  ─────────────────────────────────────── */
/*  Five waypoints across five years. Replace each `when` with the
    real year(s), and adjust the copy so it's true to your path.     */
export const journey = {
  title: 'Five years, *one widening practice*.',
  intro:
    'My work started with graphics and identity, then moved steadily toward the screen. Each step kept what came before and added something new.',
  stops: [
    {
      when: '[Year 1]',
      label: 'Graphics',
      title: 'Learning to make images *work*',
      body: 'Where it began: graphics, layouts and visual pieces that had to communicate quickly and clearly.',
      skills: ['Composition', 'Typography', 'Layout'],
    },
    {
      when: '[Year 2]',
      label: 'Identity',
      title: 'Giving brands a *recognisable* face',
      body: 'Moving from single pieces to visual identities — marks, colour, type and the rules that hold them together.',
      skills: ['Logo design', 'Colour systems', 'Brand guidelines'],
    },
    {
      when: '[Year 3]',
      label: 'Systems',
      title: 'Thinking in *systems*, not pieces',
      body: 'Learning that a strong identity has to stretch across many touchpoints — and starting to design for screens.',
      skills: ['Visual systems', 'Templates', '[Add skill]'],
    },
    {
      when: '[Year 4]',
      label: 'Interface',
      title: 'Designing for *people using things*',
      body: 'Bringing brand thinking into UI: structure, flows and interfaces designed around what people need to do.',
      skills: ['UI design', 'Wireframes', 'Prototyping'],
    },
    {
      when: '[Year 5 — now]',
      label: 'Live',
      title: 'Websites that are *live and in use*',
      body: 'Designing websites that have shipped and are used today — and working closely with how they get built.',
      skills: ['Web design', 'Responsive design', 'Design-to-build handoff'],
    },
  ],
};

/* ── 03 · Selected work ───────────────────────────────────── */
/*  Add, remove or reorder projects here. `category` decides which map
    location and which work group a project appears in. The first image
    of each project also appears on the map. Every field is optional
    except `name`. `outcomes` only appears if you add real results —
    leave it as an empty array [] to hide it.                        */
export type Category = 'graphics' | 'identity' | 'ui';

// Headings for the three groups in the Selected work section.
export const categories: { id: Category; label: string }[] = [
  { id: 'graphics', label: 'Graphic works' },
  { id: 'identity', label: 'Brand identities' },
  { id: 'ui', label: 'UI & web' },
];

export type Project = {
  slug: string;
  /** Which map location + work group this project belongs to. */
  category: Category;
  name: string;
  year: string;
  discipline: string;
  tags: string[];
  summary: string;
  challenge: string;
  role: string;
  contribution: string[];
  story: string[];
  outcomes: string[];
  liveUrl?: string;
  media: { src: string; alt: string; caption?: string; ratio?: 'wide' | 'tall' | 'square' }[];
};

export const work = {
  title: 'Selected *work*',
  intro:
    'A mix of identity and digital work. Each project shows the problem, what I did and how the design came together.',
  projects: [
    {
      slug: 'project-one',
      category: 'ui',
      name: '[Project One]',
      year: '[Year]',
      discipline: 'Website design',
      tags: ['UI design', 'Web', 'Live site'],
      summary: '[One line: what this website is and who it serves.]',
      challenge:
        '[What was the context? Who was the client or audience, and what needed to change or be made?]',
      role: '[e.g. Lead designer / Sole designer / UI designer in a team of 3]',
      contribution: ['[Site structure & wireframes]', '[UI design]', '[Design handoff to developer]'],
      story: [
        '[How did you approach it? What directions did you explore, and why did you choose the final one?]',
        '[What design decisions are you proud of — type, layout, interactions, content structure?]',
      ],
      outcomes: [],
      liveUrl: '',
      media: [
        { src: '', alt: '[Homepage on desktop]', caption: 'Homepage — desktop', ratio: 'wide' },
        { src: '', alt: '[Key screens on mobile]', caption: 'Mobile views', ratio: 'tall' },
        { src: '', alt: '[Detail or component close-up]', caption: 'Detail', ratio: 'square' },
      ],
    },
    {
      slug: 'project-two',
      category: 'identity',
      name: '[Project Two]',
      year: '[Year]',
      discipline: 'Brand identity',
      tags: ['Identity', 'Logo', 'Guidelines'],
      summary: '[One line: the brand and what the identity needed to say.]',
      challenge: '[What was the brand, and what problem did the identity need to solve?]',
      role: '[Your role]',
      contribution: ['[Research & moodboards]', '[Logo & wordmark]', '[Colour & type system]', '[Brand guidelines]'],
      story: [
        '[Where did the idea for the mark come from?]',
        '[How did the system extend across applications — print, social, packaging, web?]',
      ],
      outcomes: [],
      liveUrl: '',
      media: [
        { src: '', alt: '[Logo / primary mark]', caption: 'Primary mark', ratio: 'square' },
        { src: '', alt: '[Identity applied across touchpoints]', caption: 'Applications', ratio: 'wide' },
      ],
    },
    {
      slug: 'project-three',
      category: 'ui',
      name: '[Project Three]',
      year: '[Year]',
      discipline: 'Brand + website',
      tags: ['Identity', 'UI design', 'Web'],
      summary: '[One line: a project where identity and website came together.]',
      challenge: '[Context and challenge.]',
      role: '[Your role]',
      contribution: ['[Visual identity]', '[Website design]', '[Responsive layouts]'],
      story: ['[How did the brand shape the digital experience?]'],
      outcomes: [],
      liveUrl: '',
      media: [
        { src: '', alt: '[Website hero with brand identity]', caption: 'Brand in use online', ratio: 'wide' },
        { src: '', alt: '[Brand elements]', caption: 'Brand elements', ratio: 'square' },
      ],
    },
    {
      slug: 'project-four',
      category: 'graphics',
      name: '[Project Four]',
      year: '[Year]',
      discipline: 'Graphic design',
      tags: ['Graphics', 'Campaign', 'Print'],
      summary: '[One line: a graphic or campaign project.]',
      challenge: '[Context and challenge.]',
      role: '[Your role]',
      contribution: ['[Art direction]', '[Graphic design]'],
      story: ['[What was the idea, and how did you bring it to life?]'],
      outcomes: [],
      liveUrl: '',
      media: [{ src: '', alt: '[Key visual]', caption: 'Key visual', ratio: 'wide' }],
    },
    {
      slug: 'project-five',
      category: 'graphics',
      name: '[Project Five]',
      year: '[Year]',
      discipline: 'Graphic design',
      tags: ['Graphics', 'Poster', 'Social'],
      summary: '[One line: a graphic project.]',
      challenge: '[Context and challenge.]',
      role: '[Your role]',
      contribution: ['[Graphic design]'],
      story: ['[What was the idea, and how did you bring it to life?]'],
      outcomes: [],
      liveUrl: '',
      media: [{ src: '', alt: '[Key visual]', caption: 'Key visual', ratio: 'tall' }],
    },
    {
      slug: 'project-six',
      category: 'identity',
      name: '[Project Six]',
      year: '[Year]',
      discipline: 'Brand identity',
      tags: ['Identity', 'Logo'],
      summary: '[One line: the brand and what the identity needed to say.]',
      challenge: '[Context and challenge.]',
      role: '[Your role]',
      contribution: ['[Logo & wordmark]', '[Colour & type system]'],
      story: ['[Where did the idea come from?]'],
      outcomes: [],
      liveUrl: '',
      media: [{ src: '', alt: '[Logo / primary mark]', caption: 'Primary mark', ratio: 'square' }],
    },
  ] satisfies Project[],
};

/* ── 04 · How I work ──────────────────────────────────────── */
export const process = {
  title: 'How I *work*',
  intro:
    'A clear, collaborative process — moving from understanding the problem to designs that are ready to build.',
  steps: [
    {
      name: 'Understand',
      body: 'Get clear on the goal, the audience and the constraints before drawing anything. Ask a lot of questions.',
      together: 'Kick-off conversation, brief review, references',
      output: 'A shared, written brief',
    },
    {
      name: 'Explore',
      body: 'Push several directions wide and early — moodboards, sketches, rough type and colour — so we can compare real options.',
      together: 'Review session to pick a direction',
      output: 'Two or three distinct directions',
    },
    {
      name: 'Shape the system',
      body: 'Turn the chosen direction into a visual system: type, colour, grid, components and the rules that keep it consistent.',
      together: 'Feedback rounds on the core system',
      output: 'Identity and UI foundations',
    },
    {
      name: 'Design the experience',
      body: 'Apply the system to real pages and flows — designed mobile and desktop, with real content wherever possible.',
      together: 'Prototype walkthroughs and refinement',
      output: 'Responsive screens and prototype',
    },
    {
      name: 'Prepare to build',
      body: 'Organise files, specify states and spacing, and stay close to the build so what ships matches what was designed.',
      together: 'Handoff with developers, design QA',
      output: 'Build-ready files and specs',
    },
  ],
};

/* ── 05 · What's next ─────────────────────────────────────── */
export const next = {
  title: 'Where design meets *technology*.',
  body: [
    'Design is becoming more connected to how products are built, and that’s where I want to be. I want to make digital products that are both useful and visually strong — products where the brand and the experience feel like one thing.',
    'I keep learning the tools and skills that help ideas reach real people, and I want to work closely with the people building them.',
  ],
  // What you're currently exploring or learning. Replace with your own.
  exploring: ['[Tool or skill you’re learning]', '[e.g. Prototyping with code]', '[e.g. Design systems]', '[e.g. Motion for interfaces]'],
  // What kind of work or role you're open to. Edit freely.
  openTo: 'Open to product design, brand + UI roles and collaborations.',
};

/* ── 06 · Contact ─────────────────────────────────────────── */
export const closing = {
  title: 'Let’s make something *worth using*.',
  body: 'Have a brand, a website or a product idea in mind? I’d love to hear about it. The quickest way to reach me is email.',
};
