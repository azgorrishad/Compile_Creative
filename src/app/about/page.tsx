import { C } from "@/components/design/Tokens";
import { COMPILE_FOUNDER, FOUNDER_TIMELINE } from "@/lib/data";
import { Eyebrow } from "@/components/design/Elements";
import { SineWaveDivider } from "@/components/MotionGraphics";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col pt-32 pb-24" style={{ background: C.base }}>
      <div className="mx-auto max-w-5xl w-full px-5 md:px-10">
        
        <Link 
          href="/" 
          className="font-label mb-12 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--gold)]"
          style={{ color: C.sage }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back Home
        </Link>

        <header className="mb-20 text-center">
          <Eyebrow>About the Founder</Eyebrow>
          <h1 
            className="font-display mt-6 text-[clamp(2.8rem,6vw,5rem)] font-500 leading-[1.02] tracking-[-0.02em]"
            style={{ color: C.forest }}
          >
            {COMPILE_FOUNDER.name}
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-[16px] leading-relaxed md:text-[18px]" style={{ color: C.sage }}>
            I am a strategic growth partner masquerading as a creative director. I build perception engines for ambitious founders.
          </p>
        </header>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start mb-24">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[8px] shadow-2xl" style={{ background: C.forest }}>
            <Image 
              src={COMPILE_FOUNDER.primaryImage} 
              alt={COMPILE_FOUNDER.name} 
              fill 
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover" 
            />
          </div>
          
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-500" style={{ color: C.forest }}>The Backstory</h2>
            <div className="space-y-6 text-[16px] leading-relaxed" style={{ color: C.sage }}>
              <p>
                Compile Creative was not born out of a desire to make things look pretty. It was born out of frustration.
              </p>
              <p>
                For years, I watched brilliant founders with superior products lose market share to competitors with inferior offerings but better positioning. Perception dictates reality in the marketplace.
              </p>
              <p>
                I realized that design without strategy is just decoration. But strategy combined with high-level aesthetic execution is an unstoppable force. That's what we do here.
              </p>
            </div>
          </div>
        </div>

        <SineWaveDivider color={C.gold} className="my-24" />

        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-500 mb-12 text-center" style={{ color: C.forest }}>The Journey</h2>
          <div className="relative pl-8">
            <div className="absolute left-0 top-2 bottom-0 w-px" style={{ background: "rgba(75,99,85,0.15)" }} />
            <div className="space-y-16">
              {FOUNDER_TIMELINE.map((t, i) => (
                <div key={t.year} className="relative">
                  <div className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full" style={{ background: C.gold, boxShadow: `0 0 0 4px ${C.base}` }} />
                  <div className="flex flex-col md:flex-row md:items-baseline md:gap-8">
                    <span className="font-display text-2xl font-500 md:w-24 md:shrink-0" style={{ color: C.gold }}>
                      {t.year}
                    </span>
                    <div>
                      <h4 className="font-display text-xl font-500" style={{ color: C.forest }}>
                        {t.title}
                      </h4>
                      <p className="mt-3 text-[15px] leading-relaxed" style={{ color: C.sage }}>
                        {t.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
