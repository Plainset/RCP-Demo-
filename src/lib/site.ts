/* ------------------------------------------------------------------ *
 *  Company facts — scraped & structured from rubenscapital.nl
 *  (figures cross-checked against the firm's public portfolio page)
 * ------------------------------------------------------------------ */

export const company = {
  name: "Rubens Capital Partners",
  shortName: "RCP",
  tagline: "An independent real estate asset & investment management platform.",
  established: 2004,
  aum: "€4.0bn",
  aumLong: "€4.0 billion",
  email: "info@rubenscapital.nl",
  phone: "+31 20 755 9000",
  phoneHref: "+31207559000",
  address: {
    line1: "Atrium South Tower",
    line2: "Parnassusweg 729, 10th floor",
    city: "1077 DG Amsterdam",
    country: "The Netherlands",
  },
  intro:
    "Rubens Capital Partners is an independent real estate asset and investment management firm. We invest and operate on behalf of institutional investors and family offices across the Netherlands and the United States — combining disciplined capital allocation with deep operational control of the assets we manage.",
} as const;

/**
 * Prefix a path with the deployment base path so self-hosted /public assets
 * resolve under a GitHub Pages project subpath (e.g. /RCP-Demo-/team/x.jpg).
 * NEXT_PUBLIC_BASE_PATH is inlined at build time (empty locally).
 */
export const asset = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;

/**
 * Headline statistics. `to` (+ optional formatting) drives the count-up
 * animation; entries without `to` render `value` statically.
 */
export type Stat = {
  value: string;
  label: string;
  sub?: string;
  to?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  commas?: boolean;
};

export const stats: Stat[] = [
  { value: "€4.0bn", to: 4.0, prefix: "€", suffix: "bn", decimals: 1, label: "Assets under management", sub: "Netherlands & United States" },
  { value: "14,800", to: 14800, commas: true, label: "Residential units managed", sub: "across four strategies" },
  { value: "2004", to: 2004, label: "Established", sub: "20+ years of cycles" },
  { value: "AFM", label: "Licensed manager", sub: "regulated since 2017" },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Strategies", href: "/portfolio" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

/* ------------------------------------------------------------------ *
 *  Services — from the firm's "About" page
 * ------------------------------------------------------------------ */
export const services: { title: string; body: string }[] = [
  {
    title: "Acquisition & Underwriting",
    body: "Sourcing and rigorously underwriting off-market and competitive opportunities through our network across Dutch and US markets.",
  },
  {
    title: "Investment Analysis",
    body: "Bottom-up analysis of cash flows, leverage and exit scenarios — every thesis stress-tested before capital is committed.",
  },
  {
    title: "Portfolio Strategy",
    body: "Designing and implementing portfolio strategy aligned to each mandate's risk, return and liquidity profile.",
  },
  {
    title: "Asset Management",
    body: "Hands-on, value-add asset management: leasing, capex, repositioning and operational performance across the hold period.",
  },
  {
    title: "Disposal Strategy",
    body: "Timing and structuring exits to capture value, recycle capital and deliver distributions to our investors.",
  },
  {
    title: "Fund Structuring & Management",
    body: "Structuring and managing regulated funds end-to-end, from formation and onboarding to reporting and wind-down.",
  },
  {
    title: "Project Management",
    body: "Coordinating development, refurbishment and capital works programmes with our technical and delivery teams.",
  },
  {
    title: "ESG & Energy Programmes",
    body: "Energy-saving and sustainability programmes that future-proof assets and improve their environmental performance.",
  },
];

/* ------------------------------------------------------------------ *
 *  Portfolio strategies — figures from the firm's portfolio page
 * ------------------------------------------------------------------ */
export type Strategy = {
  slug: string;
  name: string;
  geography: string;
  aum: string;
  units: string;
  vintage?: string;
  image: string;
  blurb: string;
  points: string[];
};

export const strategies: Strategy[] = [
  {
    slug: "dutch-residential",
    name: "Dutch Residential",
    geography: "Netherlands",
    aum: "€3.0bn",
    units: "13,000 units",
    image:
      "https://images.unsplash.com/photo-1558517259-165ae4b10f7f?auto=format&fit=crop&w=1400&q=80",
    blurb:
      "Our anchor strategy: a large, diversified portfolio of Dutch residential assets in supply-constrained urban markets with structural demand.",
    points: [
      "Mid-market rental housing in the Randstad and regional cities",
      "Active management: refurbishment, mutation uplift and ESG retrofits",
      "Long-duration income with embedded rental reversion",
    ],
  },
  {
    slug: "us-multifamily",
    name: "US Multifamily",
    geography: "United States",
    aum: "$310m",
    units: "1,300 units",
    vintage: "Since 2017",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80",
    blurb:
      "Core-plus and value-add multifamily in high-growth US markets, executed alongside trusted local operating partners.",
    points: [
      "High-growth Sun Belt and gateway metros",
      "Core-plus and value-add business plans with local partners",
      "Active since 2017 with a disciplined entry discipline",
    ],
  },
  {
    slug: "dutch-offices",
    name: "Dutch Offices",
    geography: "Netherlands",
    aum: "€840m",
    units: "10 buildings",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
    blurb:
      "A focused portfolio of well-located office buildings, repositioned for the flight-to-quality and stricter energy standards.",
    points: [
      "Prime and near-prime locations in major Dutch cities",
      "Capex and ESG programmes to meet rising energy-label requirements",
      "Repositioning to capture occupier flight-to-quality",
    ],
  },
  {
    slug: "senior-care-housing",
    name: "Senior & Care Housing",
    geography: "Netherlands",
    aum: "€70m",
    units: "500 units",
    image:
      "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?auto=format&fit=crop&w=1400&q=80",
    blurb:
      "Purpose-built senior living and care housing — a growing, demographically-driven strategy with resilient, indexed income.",
    points: [
      "Demographically-driven demand from an ageing population",
      "Operator partnerships delivering care-enabled housing",
      "Indexed, resilient income with social impact",
    ],
  },
];

/* ------------------------------------------------------------------ *
 *  Team — names & roles scraped from the firm's team page.
 *  Short bios authored for the demo (the live site has none).
 * ------------------------------------------------------------------ */
export type Member = {
  name: string;
  role: string;
  group: "Leadership" | "Management" | "Investment & Asset Team";
  bio?: string;
  photo?: string; // self-hosted /public path (carried over from the live site)
};

export const team: Member[] = [
  {
    name: "Jan Arend de Vos van Steenwijk",
    role: "Managing Partner",
    group: "Leadership",
    photo: "/team/jan-arend.jpg",
    bio: "Leads the firm's strategy and capital allocation, with more than two decades structuring and managing real estate vehicles for institutional capital.",
  },
  {
    name: "Patrick Steenstra Toussaint",
    role: "Partner",
    group: "Leadership",
    photo: "/team/patrick.jpg",
    bio: "Oversees investment activity and investor mandates across the Dutch platform.",
  },
  {
    name: "Robert-Jan van Duijn",
    role: "Partner",
    group: "Leadership",
    photo: "/team/robert-jan.jpg",
    bio: "Responsible for transactions, structuring and the firm's lender and partner relationships.",
  },
  {
    name: "Jordy de Jong",
    role: "Partner",
    group: "Leadership",
    photo: "/team/jordy.jpg",
    bio: "Drives portfolio strategy and the firm's value-add and ESG programmes.",
  },
  { name: "Bert Vos", role: "Finance Manager", group: "Management", photo: "/team/bert.jpg", bio: "Leads finance, treasury and fund accounting across the platform." },
  { name: "Simone Janssens", role: "Chief Operating Officer", group: "Management", photo: "/team/simone.jpg", bio: "Owns operations, compliance and the firm's regulatory framework." },
  { name: "Karin Leijnse", role: "Investor Relations", group: "Management", photo: "/team/karin.jpg", bio: "Single point of contact for our institutional investors, reporting and onboarding." },
  { name: "Bas Schotanus", role: "Technical Director", group: "Management", photo: "/team/bas.jpg", bio: "Heads the technical, capex and sustainability delivery teams." },
  { name: "Victor Groot", role: "Asset Manager", group: "Investment & Asset Team", photo: "/team/victor.jpg" },
  { name: "Rob Bongers", role: "Investment Manager", group: "Investment & Asset Team", photo: "/team/rob.jpg" },
  { name: "John van der Logt", role: "Investment Manager", group: "Investment & Asset Team", photo: "/team/john.jpg" },
  { name: "Theo Cheng", role: "Investment Manager", group: "Investment & Asset Team", photo: "/team/theo.jpg" },
  { name: "Rany Skaff", role: "Investment Manager", group: "Investment & Asset Team", photo: "/team/rany.jpg" },
  { name: "Vera Overbeek", role: "Investment Manager", group: "Investment & Asset Team", photo: "/team/vera.jpg" },
  { name: "Joost Hobbel", role: "ISA Vastgoedmanagement", group: "Investment & Asset Team", photo: "/team/joost.jpg" },
  { name: "Paul Roelfzema", role: "Asset Manager", group: "Investment & Asset Team", photo: "/team/paul.jpg" },
];

/* The firm's regulatory documents — links to the actual PDFs published on
   rubenscapital.nl (opened in a new tab). Six entries fill the 2-column grid. */
export const compliance: { label: string; href: string }[] = [
  { label: "AFM License (24 July 2017)", href: "https://www.rubenscapital.nl/wp-content/uploads/2018/10/afm-vergunning-rcp-de-dato-24-juli-2017.pdf" },
  { label: "Articles of Association", href: "https://www.rubenscapital.nl/wp-content/uploads/2018/10/statuten-rubens-capital-partners-b.v.-de-dato-21-juni-2017.pdf" },
  { label: "2025 Compensation Policy", href: "https://www.rubenscapital.nl/wp-content/uploads/2025/03/bijlage-d-samenvatting-beloningsbeleid-2025.pdf" },
  { label: "SFDR Disclosure", href: "https://www.rubenscapital.nl/wp-content/uploads/2021/03/sfdr-disclosure-website-rcp-2021.pdf" },
  { label: "Privacy Statement", href: "https://www.rubenscapital.nl/wp-content/uploads/2024/07/website-privacyverklaring-rcp-2024-2.pdf" },
  { label: "Chamber of Commerce Extract", href: "https://www.rubenscapital.nl/wp-content/uploads/2018/09/kvk-uittreksel-rubens-capital-partners-b.v.-28052018.pdf" },
];

/** Initials helper for avatar fallbacks. */
export function initials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}
