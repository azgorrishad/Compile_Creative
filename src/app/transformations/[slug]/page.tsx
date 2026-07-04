import { CASE_STUDIES } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { C } from "@/components/design/Tokens";
import { Eyebrow } from "@/components/design/Elements";
import { EditorialText, SineWaveDivider } from "@/components/MotionGraphics";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({
    slug: c.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default function TransformationPage({ params }: { params: { slug: string } }) {
  const study = CASE_STUDIES.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === params.slug
  );

  if (!study) return notFound();

  return (
    <div className="flex min-h-screen flex-col pt-32 pb-24" style={{ background: C.base }}>
      <div className="mx-auto max-w-5xl w-full px-5 md:px-10">
        
        <Link 
          href="/transformations" 
          className="font-label mb-12 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--gold)]"
          style={{ color: C.sage }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to All Transformations
        </Link>

        <header className="mb-20">
          <Eyebrow>{study.industry}</Eyebrow>
          <h1 
            className="font-display mt-6 text-[clamp(3rem,7vw,6rem)] font-500 leading-[1.02] tracking-[-0.02em]"
            style={{ color: C.forest }}
          >
            {study.name}
          </h1>
        </header>

        <div className="relative aspect-video w-full overflow-hidden rounded-[8px] bg-[#E8E7E0] shadow-2xl mb-24">
          {study.image && (
            <Image 
              src={study.image} 
              alt={study.name} 
              fill 
              priority
              sizes="100vw"
              className="object-cover" 
            />
          )}
        </div>

        <div className="grid gap-16 md:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="font-display text-2xl font-500 mb-6" style={{ color: C.forest }}>The Problem</h2>
            <div className="text-[16px] leading-relaxed" style={{ color: C.sage }}>
              {study.problem}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-500 mb-6" style={{ color: C.forest }}>Our Decision</h2>
            <div className="text-[16px] leading-relaxed" style={{ color: C.sage }}>
              {study.decision}
            </div>
          </div>
        </div>

        <SineWaveDivider color={C.gold} className="my-24" />

        <div>
          <h2 className="font-display text-3xl font-500 mb-10 text-center" style={{ color: C.forest }}>The Outcome</h2>
          <div className="text-[18px] leading-relaxed md:text-[20px] text-center max-w-3xl mx-auto" style={{ color: C.forest }}>
            {study.outcome}
          </div>
        </div>

        {study.gallery && study.gallery.length > 0 && (
          <div className="mt-32">
            <h2 className="font-display text-2xl font-500 mb-12" style={{ color: C.forest }}>Project Gallery</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {study.gallery.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-[4px] bg-[#E8E7E0]">
                  <Image src={img} alt={`Gallery image ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
