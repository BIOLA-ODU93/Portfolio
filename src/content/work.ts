/**
 * WORK — case studies. Each one is a page under /work/<slug>.
 * Text in [square brackets] is a placeholder. Images live in /public/images/work/<slug>/.
 */

export const praisetival = {
  slug: 'praisetival',
  kicker: 'Case study · Product design',
  client: 'Praisetival Ireland',
  title: 'Turning a static festival page into a site that sells tickets',
  summary:
    'Praisetival had outgrown its website. In two weeks, as the sole designer, I redesigned it into an interactive, mobile-ready experience built around one job: taking people from curious to ticket-holder before sales opened.',
  // the live site's hero, rebuilt for the opening (video from praisetivalireland.ie, used with the client's site)
  live: {
    video: '/images/work/praisetival/hero.mp4',
    logo: '/images/work/praisetival/logo-white.png',
    event: { name: 'Shekinah Glory', place: 'Glasnevin, Dublin', thumb: '/images/work/praisetival/event-thumb.webp', at: '2026-12-11T18:30:00Z', label: '11 Dec 2026' },
  },
  meta: [
    { k: 'Role', v: 'Sole product designer' },
    { k: 'Timeline', v: '2 weeks' },
    { k: 'Scope', v: 'Website redesign · desktop & mobile' },
    { k: 'Tools', v: 'Figma' },
    { k: 'Live', v: 'praisetivalireland.ie', href: 'https://praisetivalireland.ie' },
  ],
  glance: [
    { k: 'The problem', v: 'A growing, international audience and a well-known lineup, presented on a static page with no motion, no urgency and no clear path to buy.' },
    { k: 'What I did', v: 'Restructured the site around the ticket journey, then designed every page for desktop and mobile: a video hero, a live countdown, a curated lineup, and testimonials that lead into the call to action.' },
    { k: 'The result', v: 'Shipped ahead of the September ticket-sale date. Live at praisetivalireland.ie, with tickets sold through Eventbrite.' },
  ],
  context: {
    title: 'A festival that had outgrown its website',
    text: 'Praisetival is an annual worship and music gathering with an increasingly international audience and a lineup of well-known ministers. It already had a website, but the site still looked like the event’s early days: functional, static and quiet. The brief was clear: make it feel interactive, and make it sell.',
    constraints: [
      { k: 'Deadline', v: 'A fixed external date: ticket sales opened in September 2026.' },
      { k: 'Starting point', v: 'A working but static site: no motion, no urgency, no global feel.' },
      { k: 'Research', v: 'No time for a formal UX phase, so I benchmarked against Awwwards, Landingbook and Behance.' },
    ],
  },
  goals: [
    { k: 'Feel alive', v: 'Motion and a sense of scale that match a festival with a global audience.' },
    { k: 'Sell tickets', v: 'Every section should move people one step closer to “Get tickets”.' },
    { k: 'Earn trust', v: 'Let the lineup and past attendees do the persuading, not the copy.' },
  ],
  process: {
    title: 'Judgement in place of a research phase',
    text: 'Two weeks against a fixed ticket date left no room for a separate research stage. I ran a tight brief-to-build loop instead, and designed desktop and mobile side by side.',
    steps: [
      { k: 'Audit the brief', v: 'Kept what worked, fixed the feel. Defined what “interactive” meant: motion, urgency, scale.' },
      { k: 'Benchmark', v: 'Set a quality bar from Awwwards, Landingbook and Behance: not to copy, but to calibrate.' },
      { k: 'Structure the journey', v: 'Mapped every page around one primary action: Get tickets.' },
      { k: 'Design & hand off', v: 'Straight to high fidelity for desktop and mobile, then specs for build.' },
    ],
    sitemap: { root: 'Home', pages: ['About Us', 'Our Impact', 'Partner With Us', 'Contact Us'], action: 'Get tickets → Eventbrite' },
    // Biola's paper sketches of the structure, redrawn after launch (the original two weeks went straight to high fidelity)
    sketches: {
      note: 'The structure, sketched on paper. Redrawn after launch: the two weeks went straight to high fidelity.',
      items: [
        { src: '/images/work/praisetival/sketch-pages.webp', w: 1180, h: 820, cap: 'The four pages under Home, and what each one holds', alt: 'Pen sketch of four pages: About Us (about, vision and mission, those who shaped it), Our Impact (past ministers, fuel the praise), Partner With Us (give, ways to give) and Contact Us (become a volunteer).' },
        { src: '/images/work/praisetival/sketch-hero.webp', w: 930, h: 735, cap: 'The hero: display copy and sub-heading over video, tickets top right, the next events bottom right', alt: 'Pen sketch titled Site Structure, the hero section: a large frame with display copy and a sub-heading at bottom left, a button at top right and stacked cards at bottom right.' },
      ],
    },
  },
  decisions: [
    {
      title: 'Make the first screen do the selling',
      problem: 'The old site was static: nothing on arrival said “this is happening, and soon”.',
      decision: 'A video hero, a live countdown to the event, and the next events as cards, with “Get tickets” always in view.',
      why: 'It answers the “make it interactive” brief and builds urgency at the same time: the countdown points at a real date.',
      image: '/images/work/praisetival/hero.webp',
      // zoom: scale, and the point (0–1 of the image) to centre on; pan: tall screens scroll top → bottom
      focus: { scale: 1.9, x: 0.737, y: 0.737 },
    },
    {
      title: 'A curated lineup, not a directory',
      problem: 'Ten-plus ministers in an even stack of cards reads like a staff list, not a festival.',
      decision: 'A staggered grid with portrait photography under one headline, “10+ Ministers, One Stage”, and bios on demand: press + and the card flips to tell the story.',
      why: 'The lineup is the strongest trust signal on the site. Rhythm keeps a long roster scannable, and the flip keeps ten bios one tap away without turning the page into a directory.',
      image: '/images/work/praisetival/lineup.webp',
      pan: true,
      // a working copy of the live lineup (photos and bios from praisetivalireland.ie)
      lineup: [
        { name: "Abayomi Eniade", role: "Music Minister", photo: '/images/work/praisetival/ministers/abayomi-eniade.webp', bio: "Abayomi Eniade is a worship leader and music minister passionate about leading people into genuine encounters with God through worship and sound.\n\nHe is the convener of Praisetival, a worship gathering that continues to grow as a space for revival, heartfelt worship, and spiritual renewal through music.\n\nHis ministry reflects a deep burden for God’s presence and a consistent drive to see lives impacted through music and worship encounters." },
        { name: "Paul Tomisin", role: "Music Minister", photo: '/images/work/praisetival/ministers/paul-tomisin.webp', bio: "Paul Tomisin is a worship minister and revival voice known for carrying sounds that stir hunger, prayer, and deeper encounters with God.\n\nHe is a Nigerian gospel minister, songwriter, and worship leader whose ministry is marked by passionate worship and a deep hunger for God’s presence.\n\nThrough songs like Iyin Ye and Reckless Lover, he continues to inspire lives and lead people into heartfelt worship and deeper intimacy with God." },
        { name: "Peter Akomere", role: "Music Minister", photo: '/images/work/praisetival/ministers/peter-akomere.webp', bio: "Peter Akomere is a passionate gospel musician and worship leader with a heart for drawing people closer to God through music. He currently serves as the Music Director of Christ Church Worldwide (CCW) Ireland, where he leads with excellence and spiritual depth.\n\nHis journey in music ministry began at Covenant University, where he served as Assistant Music Director and later Music Director of the university choir from 2015 to 2017. Peter is known for his powerful worship moments, authentic sound, and unwavering passion for the gospel. His music reflects a deep love for God and a desire to see lives transformed through the power of worship." },
        { name: "Surefunmi Eniade", role: "Music Minister", photo: '/images/work/praisetival/ministers/surefunmi-eniade.webp', bio: "Surefunmi Eniade is a gospel music minister, vocal director, and worship leader with over a decade of experience shaping voices and leading worship expressions.\n\nIn the last 4 editions of Praisetival till date, she has played a key role in guiding the vocal excellence of the platform, helping ministers and teams carry clarity and depth in worship.\n\nBeyond her work behind the scenes, she also expresses her own heart through music, with her recent single You Reign reflecting deep reverence for God’s presence and majesty." },
        { name: "Dami Salami", role: "Minister", photo: '/images/work/praisetival/ministers/damilola-salami.webp', bio: "Minister Dami Salami Shokunbi (popularly known online as Dami Shoks) is an ordained Christian minister, preacher, and digital content creator.\n\nShe is primarily recognized for teaching the gospel, sharing Christocentric messages, and her active ministry across international Christian communities.\n\nMinister Dami was officially ordained at The LOGIC Church under the spiritual leadership and mentorship of Apostle Flourish Peters." },
      ],
    },
    {
      title: 'Trust first, then the ask',
      problem: 'The client wanted visitors to act (buy, give, volunteer), not just admire the event.',
      decision: 'Testimonials from past attendees sit directly before the ticket and partner calls to action.',
      why: 'Social proof (“Blessed by 1,500+ people worldwide”) does the persuading right before the site asks for anything.',
      image: '/images/work/praisetival/testimonials.webp',
      pan: true,
    },
  ],
  mobile: {
    title: 'Designed for the phone in your hand',
    text: 'Every page was designed for mobile alongside desktop, not squeezed down afterwards: the hero, lineup and testimonials each have their own phone layout.',
    image: '/images/work/praisetival/mobile.webp',
    // where each phone starts scrolling, as px from the top of the 440px-wide mobile page
    phones: [
      { cap: 'Hero: countdown and next events', start: 0 },
      { cap: 'Lineup: one column, same rhythm', start: 2441 },
      { cap: 'Testimonials, then the ask', start: 3937 },
    ],
    pageHeight: 5811,
  },
  outcome: {
    title: 'Shipped ahead of the deadline',
    text: 'The redesigned site went live before ticket sales opened and is the festival’s home online today.',
    stats: [
      { value: '2', unit: 'weeks', label: 'From brief to shipped site' },
      { value: 'Live', unit: '', label: 'praisetivalireland.ie, tickets via Eventbrite' },
      { value: '100', unit: '%', label: 'Of pages designed for desktop and mobile' },
    ],
    placeholder: '[Add a real number: tickets sold vs last year, visits, or clicks on “Get tickets”]',
  },
  reflection: [
    { k: 'Test before launch', v: 'With more time, I’d run quick usability tests on the lineup grid and the ticket flow instead of relying on the brief and references alone.' },
    { k: 'Measure from day one', v: 'I’d set up analytics on the ticket button before launch, so the redesign’s impact on sales could be shown, not just felt.' },
  ],
};

/**
 * THE WORK SECTION (homepage) — two tracks, one switch.
 * Product design: case-study cards (label: client · role · medium · year, plus one result line).
 * Graphic design: an index of groups; hover previews follow the cursor, click opens a gallery.
 * `href: null` = case study not written yet (shown as "Case study coming soon").
 * Text in [square brackets] is a placeholder.
 */
type Piece = { title: string; src: string; sm: string };
const g = (group: string, items: [string, string][]): Piece[] =>
  items.map(([file, title]) => ({ title, src: `/images/work/graphic/${group}/${file}.webp`, sm: `/images/work/graphic/${group}/${file}-sm.webp` }));

export const work = {
  title: 'Selected work',
  intro: 'Product design and graphic design, side by side. Pick a track: each has its own link, so you can go straight to the work you’re hiring for.',
  product: [
    {
      slug: 'ansarr',
      client: 'Ansarr',
      role: 'Lead product designer',
      medium: 'Two-sided marketplace',
      year: '2026',
      title: 'A research marketplace where honest answers get paid',
      result: 'Android live in 3 months · iOS in beta',
      image: '/images/work/ansarr/reel-poster.webp',
      video: '/images/work/ansarr/reel.mp4', // both apps' real screens gliding past; rendered as a seamless 16 s loop
      href: '/work/ansarr',
    },
    {
      slug: 'praisetival',
      client: 'Praisetival Ireland',
      role: 'Sole product designer',
      medium: 'Website · desktop & mobile',
      year: '2026',
      title: 'Turning a static festival page into a site that sells tickets',
      result: 'Shipped in 2 weeks, ahead of ticket sales',
      image: '/images/work/praisetival/hero.webp',
      video: '/images/work/praisetival/hero.mp4',
      href: '/work/praisetival',
    },
    {
      slug: 'luciana',
      client: 'Luciana',
      role: 'Product designer · UI/UX',
      medium: 'Fashion e-commerce · AI try-on',
      year: '2026',
      title: 'Premium fashion, tried on before it’s bought',
      result: 'Live at shop-luciana.co',
      image: '/images/work/luciana.webp',
      href: '/work/luciana',
    },
    {
      slug: 'kluckin',
      client: 'Kluckin',
      role: 'Product designer · self-initiated',
      medium: 'Mobile web app · in progress',
      year: '2026',
      title: 'Attendance you can trust, instead of a paper book',
      result: 'Prototype built · pilot planned',
      image: '/images/work/kluckin.webp',
      href: '/work/kluckin',
    },
  ],
  graphic: [
    {
      slug: 'sky-capital',
      client: 'Sky Capital',
      type: 'Social campaigns · fintech',
      year: '2022 – 2024',
      note: 'A year of moments for an investment brand: Independence Day, Valentine’s, Workers’ Day and more, each one tied back to money and growth.',
      pieces: g('sky-capital', [['independence-receipt', 'Independence receipt'], ['dream-it', 'Dream it. Drive it. Own it.'], ['peak-is-possible', 'The peak is possible'], ['take-a-break', 'Workers’ Day'], ['valentines', 'Valentine’s Day'], ['every-risk', 'Every risk is worth it'], ['march', 'Start March on the right foot'], ['customer-service-week', 'Customer Service Week'], ['jewel', 'The jewel in every success story'], ['ramadan', 'Ramadan'], ['democracy-day', 'Democracy Day'], ['chapter-7', 'Chapter 7: new month'], ['greener-earth', 'World Environment Day']]),
    },
    {
      slug: 'ansarr',
      client: 'Ansarr',
      type: 'Launch campaign',
      year: '2026',
      note: 'Waitlist campaign for a paid-research marketplace: bold type, one strong object per post, and a single call to action.',
      pieces: g('ansarr', [['waitlist', 'The waitlist is growing'], ['comfort-zone', 'Your comfort zone, your earning zone'], ['no-borders', 'Your research has no borders'], ['get-heard', 'Get heard. Get rewarded.'], ['ansarr-it', 'Don’t just start the week. Ansarr it.'], ['good-ideas', 'Good ideas don’t check the calendar'], ['fill-this-month', 'Fill this month with Ansarrs'], ['independence-66', 'Nigeria at 66']]),
    },
    {
      slug: 'kings-court',
      client: 'King’s Court Dublin',
      type: 'Event posters',
      year: '2025 – now',
      note: 'Monthly event artwork: big, sculptural type and one clear piece of information hierarchy (what, when, where).',
      pieces: g('kings-court', [['the-almighty-god', 'The Almighty God'], ['cultural-sunday', 'Cultural Sunday'], ['games-night', 'Games Night'], ['mentor-father-leader', 'Mentor, Father, Leader']]),
    },
    {
      slug: 'brands',
      client: 'Selected brands',
      type: 'Campaigns · finance, retail & sport',
      year: '2022 – 2024',
      note: 'One-off campaigns across categories: insurance, lending, retail, watches, construction and sports betting. Each one finds a single visual idea that carries the message.',
      pieces: g('brands', [['globalpath-fathers-day', 'GlobalPath Funds: Father’s Day'], ['b5-valentine', 'B5 Plus: Valentine’s Day'], ['casio', 'Casio: Indulge in luxury'], ['trm-trust', 'Trusted Risk Managers: Customer Service Week'], ['easefinance-fathers-day', 'easefinance: Father’s Day'], ['ease-fathers-day', 'ease.ng: Father’s Day'], ['gobet-afcon', 'GObet247: AFCON']]),
    },
    {
      slug: 'bantel',
      client: 'Bantel',
      type: 'Automotive campaign',
      year: '2026',
      note: 'Campaigns for a car dealer: a single strong image per post, like a car driving down the green-white-green road for Independence Day, with a short, honest line.',
      pieces: g('bantel', [['independence-66', 'Nigeria at 66: still moving forward'], ['september', 'September']]),
    },
    {
      slug: 'brand-identity',
      client: '[Brand identity guides]',
      type: 'Logos & brand guidelines',
      year: '[Year]',
      note: '[Add your brand identity work: logo, colour, type and usage pages.]',
      pieces: [] as Piece[],
    },
  ],
};

/**
 * LUCIANA — case study (/work/luciana). From the Figma case study, with fixes:
 * research figures relabelled as industry data (add sources), Montserrat copy corrected.
 */
export const luciana = {
  slug: 'luciana',
  kicker: 'Case study · Product design',
  client: 'Luciana',
  title: 'Designing an AI-powered fashion experience for effortless discovery and confident styling',
  summary:
    'Luciana is a global women’s fashion brand built around elevated, aesthetic-first shopping. I designed its shopping experience and an AI try-on built right into the product page: shoppers tap a dress and see it on a model or on themselves, turning passive browsing into a confident decision.',
  meta: [
    { k: 'Project', v: 'shop-luciana.co', href: 'https://shop-luciana.co' },
    { k: 'Industry', v: 'Fashion' },
    { k: 'Platform', v: 'Mobile & web' },
    { k: 'Role', v: 'Product designer · UI/UX' },
    { k: 'Tools', v: 'Figma, Photoshop' },
  ],
  glance: [
    { k: 'The problem', v: 'Shoppers hesitate and abandon carts, not because they dislike a piece, but because they can’t picture themselves in it.' },
    { k: 'What I did', v: 'Designed an editorial shopping flow with a “Try It On” prompt on every product page and a guided, one-step AI try-on.' },
    { k: 'The result', v: 'Live at shop-luciana.co: a premium storefront where try-on sits exactly where doubt usually creeps in.' },
  ],
  problem: {
    text: 'Fashion e-commerce sells a feeling, but most shopping apps only sell a photo. Shoppers hesitate, second-guess fit and style, and abandon carts. Luciana needed a shopping flow that closes that gap without sacrificing the premium, editorial feel the brand is built on.',
    quote: 'Shoppers don’t abandon carts because they don’t like the dress. They abandon because they *can’t picture themselves in it.*',
  },
  solution:
    'AI-powered virtual try-on, built into the shopping flow rather than bolted on. A single “Try It On” prompt sits right on the product page: no extra navigation, no separate app. Shoppers see themselves in a piece in seconds with a guided photo upload, so the experience still feels like an editorial fashion house, but replaces guesswork with confidence at the exact moment a shopper would otherwise leave.',
  goals: [
    { k: 'Elevate the aesthetic', v: 'Make Luciana feel like a premium fashion house, not a generic storefront.' },
    { k: 'Reduce purchase hesitation', v: 'Give shoppers a fast, confident way to visualise fit and style.' },
    { k: 'Make AI feel invisible, not gimmicky', v: 'Try-on should feel like a natural extension of browsing, not a tacked-on tech demo.' },
  ],
  research: {
    title: 'What the industry data says',
    note: 'Industry figures, not our own research. They pointed at the real problem: fit, not taste, is what sends fashion back.',
    stats: [
      { value: 70.22, label: 'The average share of online shopping carts that are abandoned, across 50 published studies (all e-commerce, not just fashion).', source: 'Baymard Institute', href: 'https://baymard.com/lists/cart-abandonment-rate' },
      { value: 53, label: 'Of US clothing brands and retailers name size and fit as the top reason for online returns.', source: 'Coresight Research with 3DLOOK, a fit-tech company · 2023 survey of 100 decision-makers', href: 'https://3dlook.ai/content-hub/the-true-cost-of-apparel-returns/' },
      { value: 24.4, label: 'The average return rate for online clothing orders, in the 12 months to March 2023.', source: 'Coresight Research with 3DLOOK · same study', href: 'https://3dlook.ai/content-hub/the-true-cost-of-apparel-returns/' },
    ],
  },
  // benchmarking: what came from luxury houses (dior.com, gucci.com) and what was left behind on purpose
  luxury: {
    title: 'What I took from luxury houses, and what I left behind',
    text: 'There was no sitemap or formal research phase. I studied how Dior and Gucci sell online, kept the conventions that make a shop feel like a fashion house, and broke one on purpose where it stopped serving Luciana’s shoppers.',
    rows: [
      { tag: 'Took', k: 'Story before the catalogue', them: 'Dior’s women’s page opens on its season campaign, and campaign tiles sit inside the dress grid itself.', us: 'Discover leads with the collection’s mood and full looks before any product list.' },
      { tag: 'Took', k: 'The photo is the page', them: 'Dior’s product page is a full-height image, the name, and a sticky Add to cart with the price. Nothing competes with the garment.', us: 'Product pages open on a full-height image of the piece.' },
      { tag: 'Took', k: 'A service, not just a shop', them: 'Both offer Book an appointment, and Gucci adds Client Advisors by phone.', us: 'An in-store appointment, “a tailor-made visit”, sits in the top bar.' },
      { tag: 'Left behind', k: 'Fit help behind a link', them: 'Both answer “will it fit?” with a small Size Guide link and a person you phone or visit. That works when there’s a boutique nearby.', us: 'Luciana ships to West Africa, the UK and North America, so most shoppers can’t drop in. Try It On sits right under the product image instead.' },
    ],
  },
  flow: {
    title: 'Try-on extends browsing, never interrupts it',
    text: 'From the product grid, one tap opens try-on directly, with a single motion back to browsing.',
  },
  steps: [
    { k: 'Discover', v: 'The journey starts with the collection, not the catalogue. Luciana leads with editorial storytelling and full-look styling, so shoppers connect with the season’s mood before they ever filter a product list.', image: '/images/work/luciana/discover.webp' },
    { k: 'Consider', v: 'Every product page carries a quiet, persistent prompt: Try It On. Placed directly beneath the product image rather than buried in a menu, it turns hesitation into action at the exact moment doubt creeps in.', image: '/images/work/luciana/consider.webp' },
    { k: 'Visualize', v: 'One guided step removes the guesswork: clear photo requirements up front, no dead ends. Shoppers aren’t asked to trust a black box; they’re told exactly what makes the render accurate, which builds confidence before the result loads.', image: '/images/work/luciana/visualize.webp' },
  ],
  // the live site's try-on panel, rebuilt (copy from shop-luciana.co)
  tryon: {
    product: 'Double Layered Floral Dress',
    tips: ['Full-body, front-facing', 'Good, even lighting', 'Fitted, simple clothing', 'Arms slightly away from your body', 'Avoid bulky sleeves, cuffs, or high collars'],
  },
  type: [
    { role: 'Headings', family: 'Spectral', css: "'Spectral', Georgia, serif", v: 'Titles, the hero statement, section headings and key UI moments. Spectral gives the brand a bold, premium and confident voice while keeping the interface easy to scan.' },
    { role: 'Body', family: 'Montserrat', css: "'Montserrat', system-ui, sans-serif", v: 'Body copy, product details and interface labels. Montserrat’s clean, geometric shapes keep long descriptions easy to read and sit quietly under Spectral’s editorial headlines.' },
  ],
  colours: [
    { name: 'Ink', hex: '#141618' },
    { name: 'Blush', hex: '#FCEBEC' },
    { name: 'Sand', hex: '#F7E4CD' },
    { name: 'Cream', hex: '#FBF1E6' },
    { name: 'Try-on', hex: '#FF5A1F' },
  ],
  closing: 'The biggest lever in fashion e-commerce isn’t better photography or copy. It’s *closing the gap between imagining a fit and seeing it.*',
  outcome: '[Add a real number: try-on usage, conversion on try-on products, or fewer returns]',
};

const A = '/images/work/ansarr/';
export const ansarr = {
  slug: 'ansarr',
  kicker: 'Case study · Product design',
  client: 'Ansarr',
  title: 'Designing a research marketplace where honest answers get paid',
  summary:
    'Ansarr is a two-sided research marketplace, starting in Nigeria. Researchers post studies and pay only for the answers they approve; respondents answer the studies they qualify for and get paid in Naira. I led the design of both sides: two mobile apps, the design system behind them, and the waitlist that launched it.',
  meta: [
    { k: 'Project', v: 'ansarr.com', href: 'https://ansarr.com' },
    { k: 'Industry', v: 'Research · payments' },
    { k: 'Platform', v: 'Android (live) · iOS (beta)' },
    { k: 'Role', v: 'Lead product designer' },
    { k: 'Timeline', v: 'Jun – Sep 2026' },
    { k: 'Tools', v: 'Figma' },
  ],
  glance: [
    { k: 'The problem', v: 'Researchers struggle to get honest answers, and the people who give them rarely get paid. Each side has a reason not to trust the other.' },
    { k: 'What I did', v: 'Designed two apps on one design system: Give Ansarr for respondents and Seek Ansarr for researchers, with every money rule visible on screen.' },
    { k: 'The result', v: 'Android went live in September 2026, three months after design started. iOS is in beta.' },
  ],
  problem: {
    text: 'A marketplace only works if both sides trust it. Researchers need to know the answers are real and the cost won’t change. Respondents need to know their time will be paid and their identity stays private. Every screen that touched money had to make that trust visible.',
    quote: 'Researchers doubt the answers. Respondents doubt the payout. *The design had to earn trust on both sides.*',
  },
  sides: [
    {
      id: 'give', name: 'Give Ansarr', who: 'Respondents',
      line: 'Answer the studies you qualify for and get paid in Naira.',
      jobs: ['Prove you’re real once, then unlock better-paying studies', 'See what a study pays and how long it takes before starting', 'Cash out every Friday to your own bank account'],
      screens: [[A + 'welcome.webp', 'Welcome screen: Get paid for your point of view'], [A + 'feed.webp', 'Available studies with reward, fill and tags'], [A + 'wallet.webp', 'Wallet with available, pending and lifetime earnings']],
    },
    {
      id: 'seek', name: 'Seek Ansarr', who: 'Researchers',
      line: 'Post a study, reach the right people, and pay only for answers you approve.',
      jobs: ['Price a study before creating it', 'Target respondents by who they are, never by name', 'Fund once, then approve each response'],
      screens: [[A + 'workspace.webp', 'Researcher workspace: projects, pool and calculator'], [A + 'participant.webp', 'Participants: describe who you need and see how many match'], [A + 'study-live.webp', 'A funded, live study with its cost breakdown']],
    },
  ],
  approach: {
    title: 'No research budget, so the rules became the brief',
    text: 'We didn’t run formal user research before launch. Instead, I treated the marketplace’s rules as the brief: wherever money, privacy or approval was involved, the screen had to show the rule before asking for an action.',
    rules: [
      { k: 'Full cost up front', v: 'Rewards plus a flat 15% fee, shown before any payment.' },
      { k: 'Pay for approved answers only', v: 'Each reward is held until the researcher approves that response.' },
      { k: 'Anonymous by default', v: 'Researchers see anonymous codes and profile tags, never names or contact details.' },
      { k: 'Paid every Friday', v: 'Respondents withdraw from ₦10,000 to their own Nigerian bank account.' },
    ],
  },
  steps: [
    { k: 'Fund', title: 'Two checks before going live', v: 'The fund screen shows the whole bill, rewards plus the 15% fee, and asks for two quick checks: open the survey to make sure it works, and add a confirmation code to its last page. Respondents never hit a broken link, and every completion can be confirmed.', image: A + 'fund-study.webp' },
    { k: 'Live', title: 'Funded, with one next step', v: 'Once paid, the study shows exactly what was funded and offers a single action: review responses. No dashboard to decode.', image: A + 'study-live.webp' },
    { k: 'Consent', title: 'Everything known before starting', v: 'Respondents only see studies they qualify for. Before starting, they see the reward, the time it takes and the spots left, plus a plain consent note: answers are shared anonymously, and they can stop at any time.', image: A + 'consent.webp' },
    { k: 'Approve', title: 'Approval you can see', v: 'When a researcher approves a response, the reward moves to the respondent’s wallet and the study turns green. Responses left unreviewed for 5 days are approved automatically, so nobody waits forever.', image: A + 'approved.webp' },
    { k: 'Cash out', title: 'Money, without the small print', v: 'Available, pending and lifetime earnings sit in one card, and the withdrawal minimum is right under the button, not hidden in a FAQ. Withdrawals go to the respondent’s own bank account.', image: A + 'wallet.webp' },
  ],
  verify: {
    title: 'Trust, earned in levels',
    text: 'Respondents prove they’re real in small steps. A 15–20 second voice note unlocks higher-paying studies; a government ID unlocks the best-paying ones. Each step says what it unlocks, and that the data stays private, before it asks for anything.',
    screens: [[A + 'demographics.webp', 'Profile', 'Profile questions match people to studies.'], [A + 'voice-check.webp', 'Voice check', 'Three random words and one question, recorded in 20 seconds.'], [A + 'id-verified.webp', 'ID check', 'The top level: the best-paying studies open up.']],
  },
  system: {
    title: 'One system, two apps, two themes',
    text: 'Both apps run on one Figma design system: variables for colour, spacing, radius and type, components from buttons to tables, and light and dark themes built on the same tokens. Violet is the brand and every action; green is kept for money earned.',
  },
  type: { family: 'Geist', css: "'Geist', system-ui, sans-serif", v: 'One family for everything, from 72px display numbers to 12px labels. Geist’s tabular figures keep Naira amounts aligned in lists and receipts.' },
  colours: [
    { name: 'Violet 600', hex: '#6935F0' },
    { name: 'Violet 50', hex: '#F0EBFE' },
    { name: 'Earnings', hex: '#168A50' },
    { name: 'Green 50', hex: '#E7F6EE' },
    { name: 'Ink', hex: '#0E1116' },
    { name: 'Mist', hex: '#F6F7F9' },
  ],
  timeline: [
    { when: 'Jun 2026', k: 'Design starts', v: 'A waitlist page with one toggle for each side, Seek Ansarr and Give Ansarr, plus the launch campaign.' },
    { when: 'Sep 2026', k: 'Android live', v: 'Both apps launch on Android, for respondents and researchers.' },
    { when: 'Now', k: 'iOS in beta', v: 'The iPhone app is in beta testing. A laptop version for researchers is on the way.' },
  ],
  outcome: ['[Studies run]', '[Responses approved]', '[Paid to respondents]'],
  next: 'Because we launched without formal research, usability testing comes next: new respondents going through verification, where the effort is highest, and first-time researchers funding a study, where the money is.',
  closing: 'In a marketplace, trust isn’t a feature. *It’s every screen that touches money.*',
};

const K = '/images/work/kluckin/';
export const kluckin = {
  slug: 'kluckin',
  kicker: 'Product design · Kluckin',
  client: 'Kluckin',
  title: 'Replacing a paper sign-in book with attendance you can trust',
  summary:
    'Every week I watched the ushers pass round a paper book for about 300 volunteers to sign. Nobody asked me to change it. I designed Kluckin, a phone check-in that only works on the building’s Wi-Fi and confirms who you are with Face ID or a fingerprint, and built a working prototype of the check-in.',
  meta: [
    { k: 'Status', v: 'In progress · pilot planned' },
    { k: 'Role', v: 'Product designer · self-initiated' },
    { k: 'Platform', v: 'Mobile web app (installable)' },
    { k: 'Users', v: 'About 300 volunteers' },
    { k: 'Tools', v: 'Figma · Next.js prototype' },
  ],
  glance: [
    { k: 'The problem', v: 'Relatives signed in people who weren’t there, nobody recorded arrival times, and the admin had no way to check an entry.' },
    { k: 'What I did', v: 'Wrote the product spec, mapped the flows, built the design system in Figma, and prototyped the check-in on real phones.' },
    { k: 'Where it is', v: 'The spec is on its fourth version. A two-department pilot, run alongside the paper book, comes next.' },
  ],
  reframe: {
    first: 'Make the book digital.',
    flaw: 'A digital book has the same flaw: anyone can still sign for anyone.',
    real: 'Prove the person is *actually in the room.*',
  },
  checks: [
    { k: 'Presence', v: 'Check-in only works on the building’s Wi-Fi. Browsers can’t read the network name, so the server checks that the phone is using the building’s internet connection.' },
    { k: 'Identity', v: 'Each account has a passkey: Face ID, a fingerprint or the phone’s PIN. A relative in the room can’t check in someone who isn’t there.' },
    { k: 'Time', v: 'The arrival time comes from the server, not the phone, so changing the phone’s clock changes nothing.' },
  ],
  screens: [
    // time, wifi and bar match each screenshot (status-bar clock, connection, tab-bar colour) for the phone mockups
    { src: K + 'off-wifi.webp', k: 'Off the Wi-Fi', v: 'Check-in is blocked, and the screen says exactly how to fix it.', time: '9:43', wifi: false, bar: '#f0edf1' },
    { src: K + 'today.webp', k: 'Ready to check in', v: 'One button. The board shows the time now and the on-time cut-off.', time: '9:43', wifi: true, bar: '#f0edf1' },
    { src: K + 'checked-in.webp', k: 'Checked in', v: 'The arrival time, the status and a confirmation code.', time: '9:43', wifi: true, bar: '#fafafe' },
  ],
  decisions: [
    { tag: 'Changed', before: 'Check-in opened at 9:00 for the volunteers’ meeting.', after: 'One check-in on arrival, open from 6:00.', why: 'Someone who arrived at 8:45 was turned away and then forgot. Early arrivals, often the most senior people, were the ones being missed.' },
    { tag: 'Removed', before: 'A weekly roll-call check by every team leader.', after: 'A “Not seen” flag any time, plus surprise spot checks.', why: 'A weekly chore gets skipped, and stops whenever a leader is away. A check nobody can predict still keeps cheating risky.' },
    { tag: 'Removed', before: 'Six user roles.', after: 'Three roles, plus two add-on permissions.', why: 'Two of the “roles” were jobs given to people, not different kinds of user. Fewer roles means fewer screens and fewer mistakes.' },
    { tag: 'Changed', before: 'Late “I was here early” claims counted straight away.', after: 'They stay pending until someone confirms them.', why: 'It was a trust gap for the most senior people, who are also the hardest to question.' },
    { tag: 'Added', before: 'If the internet went down, there was no record at all.', after: 'Outage mode: leaders take a quick roll call instead.', why: 'One bad morning shouldn’t mean a missing Sunday.' },
    { tag: 'Added', before: 'Volunteers without a smartphone were listed as a risk.', after: 'Their team leader checks them in.', why: 'They’re a real group of people, so they needed a real plan, not a footnote.' },
  ],
  limits: [
    { k: 'Passkeys sync', v: 'A passkey follows the person to their other devices through iCloud or Google, so the account is tied to the person, not one handset. The spec says so plainly.' },
    { k: 'A lent phone', v: 'Someone could lend their unlocked phone to a relative. Software can’t catch that, so the “Not seen” flag and spot checks are there for it.' },
    { k: 'Privacy', v: 'No GPS tracking. Only name, phone, team and attendance are stored, and every admin change is logged.' },
  ],
  pilot: [
    { value: '≤2', unit: '%', label: 'Target: largest gap between the app’s count and an usher headcount' },
    { value: '≥90', unit: '%', label: 'Target: volunteers set up by week 4' },
    { value: '≤10', unit: 's', label: 'Target: median time to check in' },
  ],
  next: 'Before the pilot, I need to check my assumptions with the people the app depends on: the administrator who will own the records, the senior leaders, the team leads, and whoever runs the Wi-Fi, because 300 phones joining at once would overwhelm a home-grade router.',
  closing: 'The first idea was to digitise the book. *The real job was making every name in it true.*',
};
