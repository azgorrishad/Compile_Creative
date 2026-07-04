"use client";

import { useSyncExternalStore, useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Hydration safety
const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

// Reduced motion safety
const useReducedMotion = () => {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Touch device detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
};

export interface Brand {
  name: string;
  logoUrl?: string;
  shortName: string;
}

const DEFAULT_BRANDS: Brand[] = [
  { name: "ARIA MILANO", shortName: "AM", logoUrl: "/work/aria-milano-banner.png" },
  { name: "GHERA", shortName: "G", logoUrl: "/work/ghera-logo-real.png" },
  { name: "FLEX CITY", shortName: "FC", logoUrl: "/work/flex-city-logo.png" },
  { name: "MT HUT", shortName: "MT", logoUrl: "/work/mt-hut-logo-real.jpeg" },
  { name: "SIGNATURE STYLE", shortName: "SS", logoUrl: "/work/ss-signature-logo.png" },
  { name: "LOOKS MATTER", shortName: "LM", logoUrl: "/work/looks-matter-logo.jpg" },
  { name: "NAKSHA BARI", shortName: "N", logoUrl: "/work/naksha-bari-mascot.png" },
  { name: "SUMICO", shortName: "SC", logoUrl: "/work/sumico-banner-real.jpg" },
];

export function BrandCarousel3D({ brands = DEFAULT_BRANDS }: { brands?: Brand[] }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Continuous logical position
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { damping: 25, stiffness: 150 });
  
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const total = brands.length;

  // Auto-rotate logic
  useEffect(() => {
    if (reduced || isHovered || isDragging) return;
    
    // Smooth continuous auto-rotation
    const controls = animate(progress, progress.get() + total * 10, {
      duration: total * 10 * 4, // 4 seconds per slide
      ease: "linear",
    });
    
    return () => controls.stop();
  }, [reduced, isHovered, isDragging, total, progress]);

  // Update active index for dots
  useEffect(() => {
    const unsub = smoothProgress.on("change", (latest) => {
      // Normalize to 0 -> total-1
      const normalized = ((Math.round(latest) % total) + total) % total;
      setActiveIndex(normalized);
    });
    return unsub;
  }, [smoothProgress, total]);

  const handleNext = () => {
    progress.set(Math.round(progress.get()) + 1);
  };

  const handlePrev = () => {
    progress.set(Math.round(progress.get()) - 1);
  };

  const handleDotClick = (i: number) => {
    const current = progress.get();
    const currentNorm = ((Math.round(current) % total) + total) % total;
    let diff = i - currentNorm;
    
    // Choose shortest path
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    
    progress.set(Math.round(current) + diff);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!mounted) return <div className="h-[600px] w-full" />;

  return (
    <div 
      className="relative w-full max-w-[1400px] mx-auto py-12 flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="3D Interactive Brand Carousel"
      role="region"
    >
      
      {/* 3D Track */}
      <div 
        ref={containerRef}
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden"
        style={{ perspective: 1200 }}
      >
        {/* Invisible drag overlay */}
        <motion.div
          className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragStart={() => setIsDragging(true)}
          onDrag={(e, info) => {
            const dragFactor = isMobile ? 200 : 350;
            progress.set(progress.get() - info.delta.x / dragFactor);
          }}
          onDragEnd={(e, info) => {
            setIsDragging(false);
            const current = progress.get();
            const target = Math.round(current - info.velocity.x / 800);
            animate(progress, target, { type: "spring", stiffness: 150, damping: 25 });
          }}
          onWheel={(e) => {
             // Optional scroll horizontal mapping
             if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                progress.set(progress.get() + e.deltaX / 1000);
             }
          }}
        />

        <div className="relative w-[280px] md:w-[340px] h-[340px] md:h-[420px] flex items-center justify-center transform-style-3d pointer-events-none">
          {brands.map((brand, i) => (
            <CarouselCard 
              key={i} 
              index={i} 
              brand={brand} 
              progress={smoothProgress} 
              total={total}
              isMobile={isMobile}
            />
          ))}
        </div>
        
        {/* Left / Right Navigation Buttons */}
        <div className="absolute inset-y-0 left-2 md:left-8 flex items-center z-[60]">
          <button 
            onClick={handlePrev}
            aria-label="Previous brand"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[#C6A56B]/40 text-[#C6A56B] bg-[#F5F4EE]/80 backdrop-blur hover:bg-[#C6A56B] hover:text-white transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-[#C6A56B]"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 md:right-8 flex items-center z-[60]">
          <button 
            onClick={handleNext}
            aria-label="Next brand"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[#C6A56B]/40 text-[#C6A56B] bg-[#F5F4EE]/80 backdrop-blur hover:bg-[#C6A56B] hover:text-white transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-[#C6A56B]"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="mt-8 flex items-center justify-center gap-4 relative z-[60]" role="tablist">
        {brands.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            role="tab"
            aria-selected={activeIndex === i}
            aria-label={`Go to brand ${i + 1}`}
            className={`transition-all duration-300 rounded-full border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C6A56B] ${
              activeIndex === i 
                ? "w-3 h-3 bg-[#C6A56B] border-[#C6A56B]" 
                : "w-2.5 h-2.5 bg-transparent border-[#C6A56B]/50 hover:border-[#C6A56B]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function CarouselCard({ 
  brand, 
  index, 
  progress, 
  total,
  isMobile
}: { 
  brand: Brand, 
  index: number, 
  progress: any, 
  total: number,
  isMobile: boolean
}) {
  const cardProgress = useTransform(progress, (p: number) => {
    let dist = ((index - p) % total + total * 1.5) % total - total * 0.5;
    return dist;
  });

  const width = isMobile ? 260 : 340;
  const gap = isMobile ? 30 : 60;
  const xOffset = width + gap;

  // Visual Transforms
  const x = useTransform(cardProgress, (dist) => dist * xOffset);
  const rotateY = useTransform(cardProgress, (dist) => dist * -20); // angled slightly inward
  const scale = useTransform(cardProgress, (dist) => 1 - Math.abs(dist) * 0.15); // fade to 0.85, 0.7
  const opacity = useTransform(cardProgress, (dist) => 1 - Math.abs(dist) * 0.35); // fade out
  const zIndex = useTransform(cardProgress, (dist) => 100 - Math.round(Math.abs(dist) * 10));
  
  // Shadow dynamic intensity based on depth
  const boxShadow = useTransform(
    cardProgress, 
    (dist) => {
      const alpha = Math.max(0, 0.15 - Math.abs(dist) * 0.05);
      return `0 20px 40px rgba(198,165,107,${alpha * 0.8}), 0 10px 20px rgba(39,51,44,${alpha * 0.4})`;
    }
  );

  return (
    <motion.div
      className="absolute w-[280px] md:w-[340px] h-[340px] md:h-[420px]"
      style={{
        x,
        rotateY,
        scale,
        opacity,
        zIndex,
        boxShadow,
        transformStyle: "preserve-3d"
      }}
    >
      <div className="w-full h-full p-[10px] flex flex-col bg-gradient-to-br from-[#F5F4EE] to-[#EAE9E3] border border-[#C6A56B]/30 rounded-[4px] overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
        
        {/* Soft Ambient Glow inside card */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/70 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full bg-white rounded-sm shadow-[inset_0_0_20px_rgba(198,165,107,0.05)] px-6 py-10">
          
            <div className="relative w-full h-40 mb-6 flex items-center justify-center">
              <Image 
                src={brand.logoUrl} 
                alt={`${brand.name} logo`}
                fill
                sizes="(max-width: 768px) 250px, 300px"
                className="object-contain"
              />
            </div>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C6A56B]/30 to-transparent my-6" />

          <h3 className="font-label text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-[#C6A56B] text-center w-full">
             {brand.name}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
