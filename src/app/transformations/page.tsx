import { CASE_STUDIES } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { C } from "@/components/design/Tokens";

export default function Transformations() {
  return (
    <div className="flex min-h-screen flex-col pt-32 pb-24 px-5 md:px-10" style={{ background: C.base }}>
      <div className="mx-auto max-w-7xl w-full">
        
        <header className="mb-20">
          <h1 
            className="font-display text-[clamp(2.8rem,6vw,5rem)] font-500 leading-[1.02] tracking-[-0.02em]"
            style={{ color: C.forest }}
          >
            All Transformations
          </h1>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed md:text-[18px]" style={{ color: C.sage }}>
            Every project is an exercise in building perception and leveraging strategy. Explore our complete archive of client transformations.
          </p>
        </header>

        <div className="grid gap-12 sm:grid-cols-2 lg:gap-16 lg:grid-cols-3">
          {CASE_STUDIES.map((c) => (
            <Link 
              href={`/transformations/${c.name.toLowerCase().replace(/\s+/g, "-")}`}
              key={c.id}
              className="group flex flex-col gap-6"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-[#E8E7E0]">
                {c.image ? (
                  <Image 
                    src={c.image} 
                    alt={c.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-label text-[10px] tracking-widest text-black/20">
                    MISSING ASSET
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-transparent" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <h3 className="font-display text-2xl font-500" style={{ color: C.forest }}>{c.name}</h3>
                </div>
                <div className="font-label text-[10px] uppercase tracking-[0.2em]" style={{ color: C.sage }}>
                  {c.industry}
                </div>
                <div className="mt-2 text-[14px] leading-relaxed line-clamp-2" style={{ color: C.sage }}>
                  {c.problem}
                </div>
                <div className="mt-4 font-label inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] transition-colors group-hover:text-[var(--gold)]" style={{ color: C.forest }}>
                  View Project <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
