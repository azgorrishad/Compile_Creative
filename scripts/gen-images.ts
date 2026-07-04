import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "public", "work");
fs.mkdirSync(OUT, { recursive: true });

const STYLE =
  "deep sage green, warm cream and muted gold palette, soft directional light, editorial luxury magazine aesthetic, minimal, refined, high-end, no text, no words, no letters, no logo";

const IMAGES: { name: string; size: string; prompt: string }[] = [
  {
    name: "og-image",
    size: "1344x768",
    prompt: `Premium brand composition for a strategic growth consultancy, abstract concentric gold arcs compiling into a single point over a deep sage green field with soft cream glow, ${STYLE}, wide banner composition`,
  },
  {
    name: "aria-milano",
    size: "1344x768",
    prompt: `Luxury perfume bottle on a polished stone pedestal, warm golden rim light, deep sage green background, ${STYLE}, fragrance editorial`,
  },
  {
    name: "looks-matter",
    size: "1344x768",
    prompt: `Neatly folded premium garments on a cream marble surface, sage green backdrop, subtle gold accents, ${STYLE}, fashion still life`,
  },
  {
    name: "naksha-bari",
    size: "1344x768",
    prompt: `Close detail of modern Bangladeshi cultural fashion fabric, heritage embroidery patterns reimagined, sage and gold thread on cream, ${STYLE}, textile editorial`,
  },
  {
    name: "sumico",
    size: "1344x768",
    prompt: `A refined designer collectible character sculpture, premium studio product photography, cream and sage tones, ${STYLE}, playful yet sophisticated`,
  },
  {
    name: "nexus-os",
    size: "1344x768",
    prompt: `Abstract software product brand visual, layered geometric panels and thin gold connecting lines over deep sage, ${STYLE}, premium tech`,
  },
  {
    name: "aura-botanica",
    size: "1344x768",
    prompt: `Botanical wellness bottles arranged with green leaves, natural soft light, cream background, gold accents, ${STYLE}, wellness editorial`,
  },
  {
    name: "luxe-skin",
    size: "1344x768",
    prompt: `Premium skincare serum bottle resting on cream silk with a soft sage shadow and gold cap, ${STYLE}, luxury cosmetic editorial`,
  },
  {
    name: "ember",
    size: "1344x768",
    prompt: `A warm glowing candle with soft amber glow against deep sage green, gold and ember tones, ${STYLE}, ambient product editorial`,
  },
  {
    name: "ghera",
    size: "1344x768",
    prompt: `Modern cultural clothing brand, a single textured fabric fold in sage and cream with a thin gold thread, ${STYLE}, editorial`,
  },
  {
    name: "mt-hut",
    size: "1344x768",
    prompt: `Curated premium e-commerce product flatlay on cream, sage and gold palette, ${STYLE}, minimal editorial commerce`,
  },
  {
    name: "signature-style",
    size: "1344x768",
    prompt: `Minimalist premium lifestyle brand still life, clean composition, sage green and cream with a single gold detail, ${STYLE}, editorial fashion`,
  },
];

async function main() {
  const zai = await ZAI.create();
  for (const img of IMAGES) {
    const outPath = path.join(OUT, `${img.name}.jpg`);
    if (fs.existsSync(outPath)) {
      console.log(`skip ${img.name} (exists)`);
      continue;
    }
    try {
      console.log(`generating ${img.name} ...`);
      const res = await zai.images.generations.create({
        prompt: img.prompt,
        size: img.size as never,
      });
      const b64 = res.data[0].base64;
      fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
      console.log(`ok ${img.name} -> ${outPath}`);
    } catch (e) {
      console.error(`fail ${img.name}:`, (e as Error).message);
    }
  }
  console.log("DONE");
}

main();
