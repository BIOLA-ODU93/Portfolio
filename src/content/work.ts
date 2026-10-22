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
    sitemap: { root: 'Home', pages: ['About Us', 'Our Impact', 'Give', 'Contact Us'], action: 'Get tickets → Eventbrite' },
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
      slug: 'sky-capital',
      client: 'Sky Capital & Allied Financial Services',
      role: 'Product designer',
      medium: 'Fintech · web & mobile',
      year: '2022 – 2024',
      title: 'Clearer money flows across three countries',
      result: '40% fewer support tickets · 50% higher retention',
      image: null,
      href: null,
    },
    {
      slug: 'luciana',
      client: 'Luciana',
      role: 'Product designer · UI/UX',
      medium: 'Fashion e-commerce · AI try-on',
      year: '[Year]',
      title: 'Premium fashion, tried on before it’s bought',
      result: 'Live at shop-luciana.co',
      image: '/images/work/luciana.webp',
      href: '/work/luciana',
    },
    {
      slug: 'ansarr',
      client: 'Ansarr',
      role: 'Lead product designer',
      medium: 'Two-sided marketplace',
      year: '2026',
      title: 'A research marketplace where honest answers get paid',
      result: 'Android live in 3 months · iOS in beta',
      image: '/images/work/ansarr.webp',
      href: '/work/ansarr',
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
    note: 'Desk research that framed the problem. [Add the source for each figure.]',
    stats: [
      { value: 86, label: 'Fashion carts are abandoned 78–86% of the time, one of the highest rates of any e-commerce category.', source: '[Source]' },
      { value: 81, label: 'Shoppers feel more confident buying, even high-value items, when sizing and fit doubts are resolved.', source: '[Source]' },
      { value: 30, label: 'Physical retail converts at 23–30%, where shoppers can try before they buy. Fashion e-commerce sits at 1–2%.', source: '[Source]' },
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
