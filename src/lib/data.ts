import { CaseStudy, ProcessStep, FounderProfile } from "@/types";

export const NAV_LINKS = [
  { label: "Portfolio", href: "/#work" },
  { label: "The Compile Method", href: "/#method" },
  { label: "About", href: "/about" },
  { label: "Client Portal", href: "/login" },
];

export const POSITIONING = [
  { ai: "AI gives ideas.", expert: "Experts make decisions." },
  { ai: "AI creates options.", expert: "Experts create outcomes." },
];

export const PERCEPTION_CHAPTERS = [
  "Most businesses don't have a marketing problem.",
  "They have a perception problem.",
  "That's why they stay invisible.",
  "That's why they compete on price.",
  "That's why they never become the obvious choice.",
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "01",
    name: "Aria Milano",
    industry: "Luxury Fragrance",
    image: "/work/aria-milano-banner.png",
    gallery: ["/work/aria-milano-banner.png", "/work/aria-milano-guide.png"],
    problem: "A premium Italian fragrance priced like luxury but perceived like a commodity.",
    decision: "Reframed the brief from 'we need a better logo' to 'we need a luxury identity that commands respect'.",
    transformation: "Aligned strategy, identity, packaging direction, and communication to a single perception.",
    result: "The brand finally looked as premium as the scent itself.",
    meaning: "Luxury perception must align with pricing across every single touchpoint.",
  },
  {
    id: "02",
    name: "Looks Matter",
    industry: "Premium Clothing",
    image: "/work/looks-matter-logo.jpg",
    gallery: ["/work/looks-matter-logo.jpg", "/work/looks-matter-guide.png"],
    problem: "No clear identity beyond a basic logo. A premium line presented without editorial quality.",
    decision: "Engineered a minimalist visual system to communicate craftsmanship before a customer sees the clothes.",
    transformation: "Built a needle-and-thread mark and a cohesive, polished social presence.",
    result: "A refined clothing brand with a distinct mark and an identity that fits the product.",
    meaning: "A premium brand must look the part; aesthetics are the first filter of trust.",
  },
  {
    id: "03",
    name: "Naksha Bari",
    industry: "Cultural Fashion",
    image: "/work/naksha-bari-mascot.png",
    gallery: ["/work/naksha-bari-mascot.png", "/work/naksha-bari-poster.png"],
    problem: "Heritage was invisible. Traditional patterns had no modern visual language, failing to connect with a younger audience.",
    decision: "Repositioned Bangladeshi heritage as aspirational rather than simply nostalgic.",
    transformation: "Created modern branding that celebrates craft for a new generation.",
    result: "A culturally rooted brand system that makes heritage highly desirable.",
    meaning: "Turn constraints into your brand’s most powerful differentiator.",
  },
  {
    id: "04",
    name: "SumiCo",
    industry: "Collectibles & Lifestyle Toys",
    image: "/work/sumico-banner-real.jpg",
    gallery: ["/work/sumico-banner-real.jpg", "/work/sumico-product1.jpg", "/work/sumico-packaging.png"],
    problem: "No brand identity to anchor the collectibles line, making it hard for customers to bond with it.",
    decision: "Treated personality as the primary product, not just the packaging.",
    transformation: "Designed a brand character people form an emotional connection with before they buy.",
    result: "A character-driven lifestyle brand with a distinct, playful identity.",
    meaning: "Emotional connection is the ultimate moat in a crowded market.",
  },
  {
    id: "05",
    name: "Nexus OS",
    industry: "Software Platform",
    image: "/work/nexus-os.jpg",
    problem: "A capable product that looked like a generic tool. Technical credibility wasn’t translating into trust.",
    decision: "Moved from a feature-led story to an outcome-led strategic position.",
    transformation: "Built a brand system that signals reliability and vision before the demo begins.",
    result: "A premium tech brand whose identity matches the sophistication of the product.",
    meaning: "Shift decision-maker perception from 'tool' to 'strategic partner'.",
  },
  {
    id: "06",
    name: "Aura Botanica",
    industry: "Botanical Wellness",
    image: "/work/aura-botanica.jpg",
    problem: "A crowded market where 'natural ingredients' alone could no longer justify a premium position.",
    decision: "Built perception on feeling, calm, and ritual rather than just ingredient lists.",
    transformation: "Replaced the 'natural' cliché with a highly credible botanical brand system.",
    result: "A wellness brand that feels like a considered ritual, giving it room to hold its premium price.",
    meaning: "When everyone claims 'natural', differentiation comes from the experience.",
  },
  {
    id: "07",
    name: "Luxe Skin",
    industry: "Premium Skincare",
    image: "/work/luxe-skin.jpg",
    problem: "Premium formulation trapped in generic packaging. Customers couldn't feel the quality before purchase.",
    decision: "Used restraint as the proof of quality rather than decoration as the proof of effort.",
    transformation: "Aligned packaging, voice, and visual system into a single luxury signal.",
    result: "A skincare brand where every detail communicates the quality of what’s inside.",
    meaning: "Packaging and price must form one believable luxury signal.",
  },
  {
    id: "08",
    name: "Ember",
    industry: "Ambient Lifestyle",
    image: "/work/ember.jpg",
    problem: "A beautiful product lost in a saturated 'aesthetic candle' market with no reason to be remembered.",
    decision: "Positioned the brand around warmth as a feeling rather than just a physical product.",
    transformation: "Built a brand system based on mood and ritual, not just objects.",
    result: "A brand that owns a feeling, making it memorable far beyond the shelf.",
    meaning: "Give customers a reason to return that isn’t just about price.",
  },
  {
    id: "09",
    name: "Ghera",
    industry: "Cultural Clothing",
    image: "/work/ghera-logo-real.png",
    gallery: ["/work/ghera-logo-real.png", "/work/ghera-banner.png", "/work/ghera-ecommerce.png"],
    problem: "Cultural roots were treated as decoration. The identity felt borrowed and lacked conviction.",
    decision: "Made culture the starting point, not just a superficial styling choice.",
    transformation: "Engineered a brand born from its roots to speak powerfully to a modern audience.",
    result: "A cultural clothing brand whose authenticity became its competitive advantage.",
    meaning: "Authenticity scales when it is built into the strategic foundation.",
  },
  {
    id: "10",
    name: "MT-Hut",
    industry: "E-commerce",
    image: "/work/mt-hut-logo-real.jpeg",
    gallery: ["/work/mt-hut-logo-real.jpeg", "/work/mthut-ecommerce.png", "/work/mthut-packaging.png"],
    problem: "Traffic existed but trust didn’t. Customers dropped off before checkout due to low confidence.",
    decision: "Treated consistency as the conversion strategy rather than discounts as the lever.",
    transformation: "Built a brand that earns trust before the customer even reaches the product page.",
    result: "A storefront that feels like a true brand, not a marketplace listing.",
    meaning: "Trust is the reason customers return and recommend, not just the reason they arrive.",
  },
  {
    id: "11",
    name: "Signature Style",
    industry: "Clothing & Lifestyle",
    image: "/work/ss-signature-logo.png",
    gallery: ["/work/ss-signature-logo.png", "/work/ss-signature-guide.png"],
    problem: "The brief was 'look cleaner,' but cleanliness without intention reads as empty minimalist noise.",
    decision: "Replaced minimalism-as-absence with absolute intentionality.",
    transformation: "Created a system where every element earns its place and signals premium quality.",
    result: "A brand system where restraint is the direct evidence of refined taste.",
    meaning: "Every single detail reinforces the perception of premium value.",
  },
  {
    id: "12",
    name: "Flex City",
    industry: "Streetwear & Sneakers",
    image: "/work/flex-city-logo.png",
    gallery: ["/work/flex-city-logo.png", "/work/flex-city-guide.png"],
    problem: "A streetwear brand with energy but no visual system. The identity didn't match the culture it represented.",
    decision: "Built an aggressive, electric identity system that channels street culture into a premium brand experience.",
    transformation: "Designed a bold slash-mark logo, defined a Matte Black + Electric Blue palette, and created a full packaging system.",
    result: "A streetwear brand that commands attention and looks like it belongs next to global players.",
    meaning: "Street culture deserves premium execution — the identity must hit as hard as the product.",
  },
];

export const EVIDENCE = [
  {
    project: "Aria Milano",
    note: "“Compile Creative completely reframed how we think about our brand. We’re finally perceived as the luxury option we always were.”",
  },
  {
    project: "SumiCo",
    note: "“The character-driven approach changed everything. Our customers don't just buy our products anymore; they bond with our brand.”",
  },
  {
    project: "Nexus OS",
    note: "“We look like a true enterprise partner now. Our technical credibility finally matches our brand presentation.”",
  },
  {
    project: "Luxe Skin",
    note: "“Every detail was considered. They aligned our packaging and pricing into a single, believable luxury signal.”",
  },
];

export const METHOD_STAGES: ProcessStep[] = [
  {
    num: "01",
    title: "Observe",
    desc: "We study your market, competitors and customers before touching a single pixel. Deep research into perception, competitive landscape and customer psychology.",
  },
  {
    num: "02",
    title: "Position",
    desc: "We find the gap between what you do and what your market believes. Strategic positioning that creates clear differentiation and a narrative impossible to ignore.",
  },
  {
    num: "03",
    title: "Design",
    desc: "Every visual decision is a strategic decision. Nothing is decoration. Identity, digital experience and communication systems built from strategy — not trends.",
  },
  {
    num: "04",
    title: "Deploy",
    desc: "Systems that work without you. Processes that scale. We build the infrastructure, documentation and workflows that let your brand operate consistently at any scale.",
  },
  {
    num: "05",
    title: "Refine",
    desc: "Measure. Learn. Optimize. We track perception shifts, engagement patterns and business metrics to continuously refine the brand system over time.",
  },
];

export const FOUNDER_TIMELINE = [
  {
    year: "2019",
    title: "The Question",
    desc: "Started questioning why great products fail while mediocre ones thrive. The answer, it turned out, was never about the product.",
  },
  {
    year: "2021",
    title: "First Transformation",
    desc: "Led the first real brand transformation — and watched positioning change a business before a single pixel of the product changed.",
  },
  {
    year: "2023",
    title: "Compile Creative",
    desc: "Founded Compile Creative on a single conviction: perception is the most undervalued lever in modern business.",
  },
  {
    year: "2024",
    title: "Across Markets",
    desc: "Expanded across multiple markets, applying the same strategic system to industries from luxury fragrance to software platforms.",
  },
  {
    year: "2025",
    title: "A Repeatable System",
    desc: "Turned the Compile Method into a repeatable system — strategy, design and operations engineered to compound enterprise value.",
  },
];

export const PILLARS = [
  {
    num: "01",
    title: "Decoration is not design.",
    desc: "Design that isn’t carrying strategy is just noise. Every decision must earn its place by moving perception.",
  },
  {
    num: "02",
    title: "Perception precedes pricing.",
    desc: "Customers decide what you’re worth before they read a word. Price follows perception — never the other way around.",
  },
  {
    num: "03",
    title: "Strategy creates leverage.",
    desc: "Great strategy turns one decision into a thousand aligned ones. It is the highest-leverage work a founder can invest in.",
  },
  {
    num: "04",
    title: "Systems compound.",
    desc: "A brand built on systems gets stronger with every touchpoint. One-off work decays; systems accumulate.",
  },
];

export const COMPILE_FOUNDER: FounderProfile = {
  name: "Saleh Azgor Rishad",
  role: "Founder & Creative Director",
  metrics: {
    years: "6+",
    projects: "40+",
    markets: "7",
  },
  primaryImage: "/founder-primary.jpg",
  lifestyleImage: "/founder-lifestyle.jpg",
  philosophy: [
    "Perception precedes pricing.",
    "Strategy creates leverage.",
    "Systems compound.",
    "Design only matters when it changes business outcomes."
  ]
};
