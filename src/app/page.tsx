"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  Linkedin,
  Mail,
  Quote,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import {
  HeroParticleCanvas,
  SectionParticleCanvas,
  FloatingOrbs,
  NoiseGrainOverlay,
} from "@/components/ParticleCanvas";
import { WireframeSphere, GeometricGrid, MotionLinesCanvas } from "@/components/CursorTrail";
import {
  EditorialText, AnimatedRule, GradientTransition,
  TorusKnotWireframe, GeometricConstellation,
  ScrollCubeGallery, TiltCard3D, FoldOutPanel,
  GooBlobBackground, SvgMorphingShape, SineWaveDivider,
  TextScramble, SpotlightCard, CursorGlowBlob,
  ParticleBurstCounter, ScrollParallaxImage, StickyStackDeck, AnimatedSectionDivider
} from "@/components/MotionGraphics";
import { BrandCarousel3D } from "@/components/BrandCarousel3D";

/* ─── Brand tokens ────────────────────────────────── */
import { C } from "@/components/design/Tokens";
import { Eyebrow } from "@/components/design/Elements";

/* ─── Data ──────────────────────────────────────── */

import {
  NAV_LINKS,
  POSITIONING,
  PERCEPTION_CHAPTERS,
  CASE_STUDIES,
  EVIDENCE,
  METHOD_STAGES,
  FOUNDER_TIMELINE,
  PILLARS,
  COMPILE_FOUNDER
} from "@/lib/data";

/* ─── Hooks ─────────────────────────────────────── */

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function useIsDesktop() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIs(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return is;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setR(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return r;
}

/* ─── Motion ────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

function makeReveal(isDesktop: boolean, reduced: boolean) {
  const dur = (d: number) => (reduced ? 0.01 : isDesktop ? d : d * 0.7);
  return (delay = 0, y = 28): Variants => ({
    hidden: { opacity: 0, y: reduced ? 0 : y, filter: reduced ? "none" : "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: dur(0.8), ease: EASE, delay: reduced ? 0 : delay },
    },
  });
}

/* ─── Small shared bits ─────────────────────────── */

function GoldRule({ className = "" }: { className?: string }) {
  return (
    <span
      className={`block h-px w-16 ${className}`}
      style={{ background: `linear-gradient(90deg, ${C.gold}, transparent)` }}
    />
  );
}



/* ─── Scroll Progress ───────────────────────────── */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      style={{ scaleX, background: C.gold }}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left"
    />
  );
}

/* ─── Logo + Wordmark ───────────────────────────── */

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="Compile Creative"
        width={34}
        height={34}
        priority
        className="h-[34px] w-[34px] rounded-[4px] transition-transform duration-500 group-hover:rotate-[8deg]"
      />
      <span
        className="font-label text-[13px] font-600 leading-none tracking-[0.18em] uppercase"
        style={{ color: light ? C.ivory : C.forest }}
      >
        Compile
        <span style={{ color: C.gold }}> Creative</span>
      </span>
    </a>
  );
}

/* ─── Navigation ────────────────────────────────── */

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(245,244,238,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled
            ? `1px solid rgba(75,99,85,0.12)`
            : "1px solid transparent",
        }}
      >
        <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 md:px-10">
          <Logo />
          <div className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-label text-[12px] uppercase tracking-[0.18em] transition-colors duration-300 hover:text-[var(--gold)]"
                style={{ color: C.forest }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <a
              href="#contact"
              className="btn-gold font-label inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-colors duration-300"
              style={{ background: C.forest, color: C.ivory }}
            >
              Book a Strategy Audit
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          {/* Mobile toggle */}
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="flex h-[56px] w-[56px] items-center justify-center md:hidden"
            style={{ color: C.forest }}
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div
            className="mobile-menu-overlay absolute inset-0"
            style={{ background: "rgba(30,42,35,0.97)" }}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative flex h-full flex-col px-6 pt-6"
          >
            <div className="flex items-center justify-between">
              <Logo light />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-[56px] w-[56px] items-center justify-center"
                style={{ color: C.ivory }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-12 flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE }}
                  className="font-display flex min-h-[56px] items-center border-b border-white/10 text-3xl"
                  style={{ color: C.ivory }}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="font-label mt-10 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full px-6 text-[13px] uppercase tracking-[0.2em]"
              style={{ background: C.gold, color: C.darkSage }}
            >
              Book a Strategy Audit
              <ArrowRight className="h-4 w-4" />
            </a>
            <div className="mt-auto flex items-center justify-center pb-8 pt-6">
              <span
                className="font-label text-[11px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(245,244,238,0.5)" }}
              >
                Compile Creative
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

/* ─── Hero ──────────────────────────────────────── */

function Hero({ isDesktop, reduced }: { isDesktop: boolean; reduced: boolean }) {
  const reveal = makeReveal(isDesktop, reduced);
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{ background: C.base }}
    >
      {/* ambient layers */}
      <div className="pointer-events-none absolute inset-0">
        {isDesktop && !reduced && (
          <>
            <HeroParticleCanvas />
            <FloatingOrbs />
            <div className="absolute right-0 top-0 w-[60%] h-full opacity-40">
              <WireframeSphere />
            </div>
            <MotionLinesCanvas />
          </>
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, rgba(198,165,107,0.10), transparent 55%), radial-gradient(80% 60% at 50% 100%, rgba(39,51,44,0.06), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 md:px-10 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8 flex items-center gap-3"
        >
          <Eyebrow>Strategic Growth Partner</Eyebrow>
        </motion.div>

        <motion.h1
          variants={reveal(0.05, 18)}
          initial="hidden"
          animate="visible"
          className="font-display max-w-5xl text-[clamp(2.6rem,8.2vw,7rem)] font-500 leading-[0.98] tracking-[-0.02em]"
          style={{ color: C.forest }}
        >
          <TextScramble text="Build Brands Worth " />
          <span style={{ fontStyle: "italic", color: C.sage }}>More</span>{" "}
          Tomorrow Than They Are{" "}
          <span
            style={{
              background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Today.
          </span>
        </motion.h1>

        <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <motion.p
            variants={reveal(0.22, 20)}
            initial="hidden"
            animate="visible"
            className="font-sans max-w-xl text-[15px] leading-relaxed md:col-span-7 md:text-[17px]"
            style={{ color: C.sage }}
          >
            We partner with ambitious founders to strengthen positioning,
            eliminate operational friction, and build the systems that turn a
            good product into a brand worth more every year.
          </motion.p>

          <motion.div
            variants={reveal(0.34, 20)}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-3 md:col-span-5 md:justify-end"
          >
            <a
              href="#contact"
              className="btn-gold font-label inline-flex min-h-[52px] items-center gap-2 rounded-full px-6 text-[12px] uppercase tracking-[0.18em] md:min-h-[56px]"
              style={{ background: C.forest, color: C.ivory }}
            >
              Book a Strategy Audit
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#work"
              className="font-label inline-flex min-h-[52px] items-center gap-2 rounded-full border px-6 text-[12px] uppercase tracking-[0.18em] transition-colors duration-300 md:min-h-[56px]"
              style={{ borderColor: C.sage, color: C.forest }}
            >
              View the Work
            </a>
          </motion.div>
        </div>
      </div>

      {/* scroll indicator with subtle infinite bounce */}
      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 7, 0], opacity: [0.9, 0.4, 0.9] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
          style={{ color: C.sage }}
        >
          <span className="font-label text-[10px] uppercase tracking-[0.3em]">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </div>

      {/* soft gradient transition into next section */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[160px]"
        style={{
          background: `linear-gradient(to bottom, transparent, ${C.surface} 70%, ${C.surface})`,
        }}
      />
    </section>
  );
}

/* ─── Positioning: AI vs Experts ────────────────── */

function Positioning({ isDesktop, reduced }: { isDesktop: boolean; reduced: boolean }) {
  const reveal = makeReveal(isDesktop, reduced);
  return (
    <section
      className="relative px-5 py-24 md:px-10 md:py-36 overflow-hidden"
      style={{ background: C.surface }}
    >
      {isDesktop && !reduced && (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply">
            <GeometricConstellation className="w-full h-full" />
          </div>
          <div className="pointer-events-none absolute -right-[10%] top-[30%] h-[120%] w-[60%] opacity-[0.08] mix-blend-multiply" style={{ color: C.sage }}>
            <SvgMorphingShape className="w-full h-full" />
          </div>
          <div className="pointer-events-none absolute -left-[20%] -bottom-[20%] h-[140%] w-[70%] opacity-[0.1] mix-blend-multiply">
            <WireframeSphere />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply">
            <FloatingOrbs />
          </div>
        </>
      )}
      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          variants={reveal(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-500" style={{ color: C.forest }}>
            Why hire us instead of doing it by AI?
          </h2>
        </motion.div>

        <div className="space-y-10 md:space-y-14">
          {POSITIONING.map((row, i) => (
            <motion.div
              key={i}
              variants={reveal(0.1 + i * 0.12, 24)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid items-baseline gap-3 md:grid-cols-12"
            >
              <p
                className="font-display text-[clamp(1.8rem,5vw,3.4rem)] font-400 leading-[1.05] md:col-span-5"
                style={{ color: C.sage, fontStyle: "italic" }}
              >
                {row.ai}
              </p>
              <span
                className="font-label hidden self-center text-[11px] uppercase tracking-[0.3em] md:col-span-2 md:block md:text-center"
                style={{ color: C.gold }}
              >
                — but —
              </span>
              <p
                className="font-display text-[clamp(1.8rem,5vw,3.4rem)] font-500 leading-[1.05] md:col-span-5"
                style={{ color: C.forest }}
              >
                {row.expert}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={reveal(0.4, 20)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 flex items-center gap-4"
        >
          <GoldRule />
          <p
            className="font-display text-[clamp(1.4rem,3.4vw,2.2rem)] font-500"
            style={{ color: C.forest }}
          >
            Compile Creative{" "}
            <span style={{ color: C.gold }}>combines both.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Perception Sequence (The Unforgettable Moment) ── */

function PerceptionSequence({
  isDesktop,
  reduced,
}: {
  isDesktop: boolean;
  reduced: boolean;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  
  // 5 text chapters + 1 logo chapter + 1 closing text chapter
  const totalChapters = PERCEPTION_CHAPTERS.length + 2; 

  return (
    <section
      ref={outerRef}
      className="relative"
      style={{ background: C.darkSage, height: `${totalChapters * 100}vh` }}
    >
      <div className="pointer-events-none absolute inset-0">
        <NoiseGrainOverlay />
      </div>

      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">
        {isDesktop && !reduced && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 opacity-60">
              <SectionParticleCanvas dark />
            </div>
            <div className="absolute top-0 left-0 h-full w-[70%] opacity-15 mix-blend-screen" style={{ color: C.goldLight }}>
              <TorusKnotWireframe className="w-full h-full" />
            </div>
            <div className="absolute inset-0 opacity-30 mix-blend-screen">
              <MotionLinesCanvas />
            </div>
            <div className="absolute top-[20%] right-[-20%] h-[120%] w-[80%] opacity-20 mix-blend-screen">
              <WireframeSphere />
            </div>
          </div>
        )}

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10">
          <div className="mb-8 flex items-center justify-between">
            <Eyebrow dark>The Problem</Eyebrow>
            <PerceptionProgress progress={scrollYProgress} total={totalChapters} />
          </div>

          {/* Fixed-height frame — chapters are absolutely positioned inside */}
          <div className="relative w-full" style={{ height: "clamp(120px, 20vw, 220px)" }}>
            {PERCEPTION_CHAPTERS.map((line, i) => (
              <PerceptionChapter
                key={i}
                text={line}
                index={i}
                total={totalChapters}
                progress={scrollYProgress}
              />
            ))}

            {/* Logo Reveal Chapter */}
            <LogoChapter
              index={PERCEPTION_CHAPTERS.length}
              total={totalChapters}
              progress={scrollYProgress}
            />

            {/* Final Conclusion Chapter */}
            <PerceptionChapter
              text="Perception changes everything."
              index={PERCEPTION_CHAPTERS.length + 1}
              total={totalChapters}
              progress={scrollYProgress}
              isClosing
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function PerceptionProgress({
  progress,
  total,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
}) {
  const widthPct = useTransform(progress, [0, 1], [4, 100]);
  const idx = useTransform(progress, (p) =>
    Math.min(total, Math.floor(p * total) + 1)
  );
  const [n, setN] = useState(1);
  useEffect(() => idx.on("change", (v) => setN(v)), [idx]);
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-label text-[11px] uppercase tracking-[0.2em]"
        style={{ color: "rgba(245,244,238,0.5)" }}
      >
        {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span className="block h-px w-16 overflow-hidden" style={{ background: "rgba(245,244,238,0.15)" }}>
        <motion.span style={{ width: widthPct, background: C.gold }} className="block h-full" />
      </span>
    </div>
  );
}

function PerceptionChapter({
  text,
  index,
  total,
  progress,
  isClosing = false,
}: {
  text: string;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  isClosing?: boolean;
}) {
  // Each chapter occupies 1/total of the scroll range.
  // We use tight windows so only one chapter is visible at a time.
  const chunkSize = 1 / total;
  const start  = index * chunkSize;
  const end    = start + chunkSize;
  const peak   = start + chunkSize * 0.5;      // middle of this chunk
  const fadeIn  = start + chunkSize * 0.1;     // start fading in at 10% into chunk
  const fadeOut = end   - chunkSize * 0.1;     // start fading out at 90% of chunk

  const opacity = useTransform(
    progress,
    [start, fadeIn, peak, fadeOut, end],
    [0,     1,      1,    1,       0]
  );
  const y = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [50,    0,      0,       -50]
  );
  const filter = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [12,    0,      0,       12]
  );
  const filterStr = useTransform(filter, (b) => `blur(${b}px)`);
  const scale = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [0.95,  1,      1,       0.95]
  );

  return (
    <motion.div
      style={{ opacity, y, filter: filterStr, scale }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <motion.p
        className="font-display w-full text-center font-500 leading-[1.02] tracking-[-0.02em]"
        style={{
          color: isClosing ? C.gold : C.ivory,
          fontSize: isClosing
            ? "clamp(2rem,6vw,4.4rem)"
            : "clamp(2rem,5.4vw,4.6rem)",
        }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
}

function LogoChapter({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const chunkSize = 1 / total;
  const start  = index * chunkSize;
  const end    = start + chunkSize;
  const fadeIn  = start + chunkSize * 0.1;
  const fadeOut = end   - chunkSize * 0.1;

  const opacity = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [0,     1,      1,       0]
  );
  const scale = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [0.6,   1,      1.05,    1.2]
  );
  const filter = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [20,    0,      0,       10]
  );
  const filterStr = useTransform(filter, (b) => `blur(${b}px)`);

  return (
    <motion.div
      style={{ opacity, scale, filter: filterStr }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative h-40 w-40 md:h-64 md:w-64">
        <Image
          src="/logo.png"
          alt="Compile Creative"
          fill
          className="object-contain drop-shadow-2xl brightness-150"
        />
      </div>
    </motion.div>
  );
}

/* ─── Strategic Insights ────────────────────────── */

function StrategicInsights({ isDesktop, reduced }: { isDesktop: boolean; reduced: boolean }) {
  const reveal = makeReveal(isDesktop, reduced);
  const insights = [
    {
      title: "Brand is not logo.",
      desc: "It is the sum of every interaction someone has with your business. If your logo is premium but your copy is cheap, you are cheap."
    },
    {
      title: "More content does not fix weak positioning.",
      desc: "Publishing more noise from a weak strategic foundation only trains your audience to ignore you faster."
    },
    {
      title: "Price resistance is usually a perception problem.",
      desc: "When customers complain about price, they aren't saying they don't have the money. They are saying your brand hasn't convinced them of the value."
    }
  ];

  return (
    <section className="relative px-5 py-24 md:px-10 md:py-36 overflow-hidden" style={{ background: C.darkSage, color: C.ivory }}>
      {isDesktop && !reduced && (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-15">
            <GeometricConstellation className="w-full h-full" />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen">
            <MotionLinesCanvas />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-screen">
            <FloatingOrbs />
          </div>
          <div className="pointer-events-none absolute -right-[20%] -top-[20%] h-[140%] w-[80%] opacity-20 mix-blend-screen" style={{ color: C.goldLight }}>
            <TorusKnotWireframe className="w-full h-full" />
          </div>
          <div className="pointer-events-none absolute -left-[25%] -bottom-[30%] h-[120%] w-[70%] opacity-[0.08] mix-blend-screen rotate-180" style={{ color: C.goldLight }}>
            <TorusKnotWireframe className="w-full h-full" />
          </div>
        </>
      )}
      <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay">
        <GooBlobBackground />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div variants={reveal(0)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
          <Eyebrow dark>Strategic Insights</Eyebrow>
        </motion.div>
        <motion.h2
          variants={reveal(0.1, 22)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="font-display mt-5 text-[clamp(2.2rem,5.4vw,4rem)] font-500 leading-[1.02] tracking-[-0.02em]"
        >
          Three Things Most Founders Get <span style={{ color: C.gold }}>Wrong.</span>
        </motion.h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-16">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              variants={reveal(0.2 + i * 0.1, 20)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="flex flex-col border-t pt-6"
              style={{ borderColor: "rgba(245,244,238,0.15)" }}
            >
              <h3 className="font-display text-2xl font-500 mb-4" style={{ color: C.ivory }}>
                {insight.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: "rgba(245,244,238,0.7)" }}>
                {insight.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Portfolio ─────────────────────────────────── */

/* ─── Evidence & Outcomes (Replaces Portfolio) ────── */

function FeaturedOutcomes({ isDesktop, reduced }: { isDesktop: boolean; reduced: boolean }) {
  const reveal = makeReveal(isDesktop, reduced);
  
  // Only show the 4 requested featured case studies
  const featuredIds = ["01", "04", "03", "02"];
  const featured = CASE_STUDIES.filter(c => featuredIds.includes(c.id));

  return (
    <section id="work" className="relative px-5 py-24 md:px-10 md:py-36 overflow-hidden" style={{ background: C.base }}>
      {isDesktop && !reduced && (
        <>
          <div className="pointer-events-none absolute -left-[20%] top-[30%] h-[140%] w-[60%] opacity-[0.07] mix-blend-multiply" style={{ color: C.forest }}>
            <SvgMorphingShape className="w-full h-full" />
          </div>
          <div className="pointer-events-none absolute right-[0%] bottom-[-20%] h-[120%] w-[50%] opacity-10 mix-blend-multiply">
            <TorusKnotWireframe className="w-full h-full" />
          </div>
        </>
      )}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24">
          <motion.div variants={reveal(0)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <Eyebrow>Evidence & Outcomes</Eyebrow>
          </motion.div>
          
          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <motion.h2
              variants={reveal(0.1, 22)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="font-display max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] font-500 leading-[1.02] tracking-[-0.02em]"
              style={{ color: C.forest }}
            >
              We don't just build brands.<br/>
              <span style={{ color: C.sage, fontStyle: "italic" }}>We build leverage.</span>
            </motion.h2>
            
            <motion.div 
              variants={reveal(0.2, 18)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="flex gap-8 md:gap-12"
            >
              <div className="flex flex-col gap-1">
                <span className="font-display text-4xl font-500" style={{ color: C.forest }}>40+</span>
                <span className="font-label text-[10px] uppercase tracking-[0.2em]" style={{ color: C.sage }}>Brands</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-4xl font-500" style={{ color: C.forest }}>7</span>
                <span className="font-label text-[10px] uppercase tracking-[0.2em]" style={{ color: C.sage }}>Markets</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-4xl font-500" style={{ color: C.forest }}>6+</span>
                <span className="font-label text-[10px] uppercase tracking-[0.2em]" style={{ color: C.sage }}>Years</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {featured.map((c, i) => (
            <motion.article 
              key={c.id}
              variants={reveal(0.1 + (i * 0.08), 24)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="group flex flex-col gap-6"
            >
              {/* Image Container using Next.js Image directly, NO Parallax */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-[#E8E7E0]">
                {c.image ? (
                  <Image 
                    src={c.image} 
                    alt={c.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={i < 2}
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-label text-[10px] tracking-widest text-black/20">
                    MISSING ASSET
                  </div>
                )}
                <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-transparent" />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-5 px-1">
                <div className="flex items-center gap-4">
                  <h3 className="font-display text-3xl font-500" style={{ color: C.forest }}>{c.name}</h3>
                  <span className="font-label text-[11px] uppercase tracking-[0.2em]" style={{ color: C.sage }}>
                    {c.industry}
                  </span>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.2em]" style={{ color: C.gold }}>Strategic Shift</span>
                    <p className="mt-1 text-[15px] leading-relaxed" style={{ color: C.forest }}>{c.decision}</p>
                  </div>
                  <div>
                    <span className="font-label text-[10px] uppercase tracking-[0.2em]" style={{ color: C.gold }}>Outcome</span>
                    <p className="mt-1 text-[15px] leading-relaxed" style={{ color: C.forest }}>{c.result}</p>
                  </div>
                </div>

                <div className="mt-2">
                  <a 
                    href={`/transformations/${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="font-label inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--gold)]"
                    style={{ color: C.sage }}
                  >
                    View Transformation <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div 
          variants={reveal(0.4, 20)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 flex justify-center md:mt-32"
        >
          <a
            href="/transformations"
            className="btn-gold font-label inline-flex min-h-[56px] items-center gap-3 rounded-full px-8 text-[12px] uppercase tracking-[0.2em] transition-colors"
            style={{ background: C.forest, color: C.ivory }}
          >
            See All Transformations
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}


/* ─── The Compile Method ────────────────────────── */

function TheMethod({ isDesktop, reduced }: { isDesktop: boolean; reduced: boolean }) {
  const reveal = makeReveal(isDesktop, reduced);
  return (
    <section id="method" className="relative px-5 py-24 md:px-10 md:py-36 overflow-hidden" style={{ background: C.base }}>
      {isDesktop && !reduced && (
        <>
          <div className="pointer-events-none absolute -left-[20%] -top-[10%] h-[120%] w-[70%]" style={{ color: "rgba(198,165,107,0.06)" }}>
            <SvgMorphingShape className="w-full h-full" />
          </div>
          <div className="pointer-events-none absolute -right-[15%] top-[10%] h-[140%] w-[70%] opacity-20 mix-blend-multiply">
            <TorusKnotWireframe className="w-full h-full" />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-multiply">
            <GeometricConstellation className="w-full h-full" />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply">
            <FloatingOrbs />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-multiply">
            <SectionParticleCanvas />
          </div>
        </>
      )}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center md:text-left max-w-3xl">
          <motion.div variants={reveal(0)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
            <Eyebrow>The Compile Method</Eyebrow>
          </motion.div>
          <motion.h2
            variants={reveal(0.1, 22)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="font-display mt-5 text-[clamp(2.2rem,5.4vw,4rem)] font-500 leading-[1.02] tracking-[-0.02em]"
            style={{ color: C.forest }}
          >
            A system, not a service.
          </motion.h2>
        </div>

        <div className="mt-16 md:mt-24">
          {/* Desktop Layout: Asymmetrical Staggered Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-16 relative">
            {/* Connecting subtle line behind cards */}
            <div className="absolute top-[10%] bottom-[10%] left-1/2 w-px -translate-x-1/2 opacity-20" style={{ background: `linear-gradient(to bottom, transparent, ${C.forest}, transparent)` }} />
            
            {/* Left Column (Odds) */}
            <div className="flex flex-col gap-16 pr-8">
              {METHOD_STAGES.filter((_, i) => i % 2 === 0).map((s, i) => (
                <motion.div
                  key={s.num}
                  variants={reveal(0.1 + i * 0.1, 30)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative z-10"
                >
                  <SpotlightCard className="h-full rounded-[16px] p-10 border shadow-2xl transition-transform hover:-translate-y-2 duration-500" style={{ borderColor: "rgba(75,99,85,0.08)", background: C.ivory }}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="font-display text-[5rem] opacity-20 leading-none" style={{ color: C.gold }}>{s.num}</div>
                      <div className="h-3 w-3 rounded-full opacity-50" style={{ background: C.gold }} />
                    </div>
                    <h3 className="font-display text-3xl mb-4 font-500" style={{ color: C.forest }}>{s.title}</h3>
                    <p className="text-[15px] leading-relaxed" style={{ color: C.sage }}>{s.desc}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>

            {/* Right Column (Evens) */}
            <div className="flex flex-col gap-16 pl-8 pt-[120px]">
              {METHOD_STAGES.filter((_, i) => i % 2 !== 0).map((s, i) => (
                <motion.div
                  key={s.num}
                  variants={reveal(0.2 + i * 0.1, 30)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative z-10"
                >
                  <SpotlightCard className="h-full rounded-[16px] p-10 border shadow-2xl transition-transform hover:-translate-y-2 duration-500" style={{ borderColor: "rgba(75,99,85,0.08)", background: C.ivory }}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="font-display text-[5rem] opacity-20 leading-none" style={{ color: C.gold }}>{s.num}</div>
                      <div className="h-3 w-3 rounded-full opacity-50" style={{ background: C.gold }} />
                    </div>
                    <h3 className="font-display text-3xl mb-4 font-500" style={{ color: C.forest }}>{s.title}</h3>
                    <p className="text-[15px] leading-relaxed" style={{ color: C.sage }}>{s.desc}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tablet Layout: Timeline */}
          <div className="hidden md:block lg:hidden relative pl-8">
            <div className="absolute left-0 top-2 bottom-0 w-px" style={{ background: "rgba(75,99,85,0.15)" }} />
            <div className="space-y-12">
              {METHOD_STAGES.map((s, i) => (
                <motion.div
                  key={s.num}
                  variants={reveal(0.1 + i * 0.08, 20)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative"
                >
                  <div className="absolute -left-[37px] top-2 w-2.5 h-2.5 rounded-full" style={{ background: C.gold, boxShadow: `0 0 0 4px ${C.base}` }} />
                  <div className="flex items-baseline gap-8">
                    <span className="font-display text-4xl shrink-0" style={{ color: C.gold }}>{s.num}</span>
                    <div>
                      <h3 className="font-display text-2xl font-500" style={{ color: C.forest }}>{s.title}</h3>
                      <p className="mt-3 text-[16px] leading-relaxed max-w-lg" style={{ color: C.sage }}>{s.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Layout: Accordion */}
          <div className="md:hidden flex flex-col gap-4">
            {METHOD_STAGES.map((s, i) => (
              <motion.div
                key={s.num}
                variants={reveal(0.1 + i * 0.08, 10)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <FoldOutPanel title={`${s.num} — ${s.title}`} className="bg-[var(--surface)]">
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: C.sage }}>
                    {s.desc}
                  </p>
                </FoldOutPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Founder ───────────────────────────────────── */

/* ─── Founder ───────────────────────────────────── */

function Founder({ isDesktop, reduced }: { isDesktop: boolean; reduced: boolean }) {
  const reveal = makeReveal(isDesktop, reduced);
  return (
    <section id="about" className="relative overflow-hidden px-5 py-24 md:px-10 md:py-36" style={{ background: C.surface }}>
      {isDesktop && !reduced && (
        <>
          <div className="pointer-events-none absolute -right-[20%] -top-[20%] h-[150%] w-[80%] opacity-[0.06] mix-blend-multiply" style={{ color: C.forest }}>
            <SvgMorphingShape className="w-full h-full" />
          </div>
          <div className="pointer-events-none absolute -left-[10%] bottom-[0%] h-[100%] w-[50%] opacity-[0.12] mix-blend-multiply">
            <TorusKnotWireframe className="w-full h-full" />
          </div>
        </>
      )}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20 items-center">
          
          {/* Images Section - 2 Images Composition */}
          <div className="lg:col-span-5 relative h-full min-h-[500px]">
            {/* Primary Portrait */}
            <motion.div
              initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", opacity: 0, y: 40 }}
              whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: isDesktop ? 1.2 : 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="absolute left-0 top-0 w-[80%] z-10"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] shadow-2xl" style={{ background: C.forest }}>
                <Image
                  src={COMPILE_FOUNDER.primaryImage}
                  alt={`${COMPILE_FOUNDER.name} - Primary Portrait`}
                  fill
                  sizes="(max-width: 768px) 80vw, 35vw"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 rounded-[4px] px-6 py-5 shadow-xl"
                style={{ background: C.forest, color: C.ivory }}
              >
                <div className="font-display text-xl font-500">{COMPILE_FOUNDER.name}</div>
                <div className="font-label text-[10px] uppercase tracking-[0.22em] mt-1" style={{ color: C.gold }}>
                  {COMPILE_FOUNDER.role}
                </div>
              </div>
            </motion.div>

            {/* Supporting Lifestyle Image */}
            <motion.div
              initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0, x: -40 }}
              whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: isDesktop ? 1.2 : 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="absolute -right-12 -bottom-16 w-[90%] md:w-[100%] z-20"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-square overflow-hidden rounded-[4px] shadow-2xl border-[12px]" style={{ background: C.base, borderColor: C.base }}
              >
                <Image
                  src={COMPILE_FOUNDER.lifestyleImage}
                  alt={`${COMPILE_FOUNDER.name} - Lifestyle/Work`}
                  fill
                  sizes="(max-width: 768px) 70vw, 35vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Copy & Philosophy */}
          <div className="lg:col-span-7 flex flex-col justify-center mt-12 lg:mt-0 lg:pl-10">
            <motion.div variants={reveal(0)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
              <Eyebrow>Founder Manifesto</Eyebrow>
            </motion.div>
            
            <EditorialText
              text="I don't build brands. I build perception. Everything else follows."
              delay={0.1}
              isDesktop={isDesktop}
              className="font-display mt-6 text-[clamp(2.4rem,5vw,4.2rem)] font-500 leading-[1.03] tracking-[-0.02em]"
              style={{ color: C.forest, marginLeft: "-2rem", paddingLeft: "2rem", borderLeft: `2px solid ${C.gold}` }}
            />

            <motion.div
              variants={reveal(0.3, 18)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-8 space-y-4 text-[16px] leading-relaxed md:text-[18px]"
              style={{ color: "rgba(39,51,44,0.82)" }}
            >
              <p>
                I started Compile Creative after years of watching brilliant products
                lose to mediocre ones with better positioning. We work with founders who understand that perception is not a
                marketing afterthought. It is the asset that compounds — the
                strategic foundation that makes a business worth more tomorrow than it is today.
              </p>
            </motion.div>

            {/* Philosophy / Pillars */}
            <div className="mt-16 md:mt-20">
              <motion.div variants={reveal(0.4, 16)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
                <Eyebrow>Core Philosophy</Eyebrow>
              </motion.div>
              
              <div className="mt-8 grid gap-4">
                {COMPILE_FOUNDER.philosophy.map((phil, i) => (
                  <motion.div
                    key={i}
                    variants={reveal(0.5 + i * 0.08, 16)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="flex items-center gap-5 rounded-[4px] p-5"
                    style={{ background: "rgba(39,51,44,0.04)" }}
                  >
                    <span className="font-label text-[10px] uppercase tracking-[0.2em]" style={{ color: C.gold }}>
                      0{i + 1}
                    </span>
                    <span className="font-display text-[1.2rem] md:text-[1.4rem]" style={{ color: C.forest }}>
                      {phil}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Closing */}
            <motion.div
              variants={reveal(0.9, 20)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="mt-16 border-t pt-8"
              style={{ borderColor: "rgba(75,99,85,0.15)" }}
            >
              <a href="/about" className="font-label inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--gold)]" style={{ color: C.sage }}>
                Read Full Story <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ─────────────────────────────────── */

function FinalCTA({ isDesktop, reduced }: { isDesktop: boolean; reduced: boolean }) {
  const reveal = makeReveal(isDesktop, reduced);
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-5 py-24 md:px-10 md:py-40"
      style={{ background: C.darkSage, color: C.ivory }}
    >
      {isDesktop && !reduced && (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <SectionParticleCanvas dark />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <GeometricGrid />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay">
            <GooBlobBackground />
          </div>
          <div className="pointer-events-none absolute left-[50%] top-[50%] h-[200%] w-[100%] -translate-x-1/2 -translate-y-1/2 opacity-20 mix-blend-screen" style={{ color: C.goldLight }}>
            <TorusKnotWireframe className="w-full h-full" />
          </div>
        </>
      )}
      <div className="pointer-events-none absolute inset-0">
        <NoiseGrainOverlay />
      </div>
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div variants={reveal(0)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="flex justify-center">
          <Eyebrow dark>Book a Strategy Audit</Eyebrow>
        </motion.div>
        <motion.h2
          variants={reveal(0.1, 22)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="font-display mt-6 text-[clamp(2.4rem,6.4vw,5rem)] font-500 leading-[1.0] tracking-[-0.02em]"
        >
          Build a brand worth{" "}
          <span style={{ color: C.gold }}>more tomorrow.</span>
        </motion.h2>
        <motion.p
          variants={reveal(0.22, 18)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed md:text-[17px]"
          style={{ color: "rgba(245,244,238,0.72)" }}
        >
          If you’re building something that deserves to be worth more next year
          than this one, let’s talk. We take on 3 projects per quarter.
        </motion.p>
        <motion.div
          variants={reveal(0.34, 18)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mt-14 flex max-w-3xl flex-col gap-10 text-left md:flex-row md:gap-16"
        >
          {/* Form Side */}
          <div className="flex-1 rounded-[4px] border p-6 md:p-8" style={{ borderColor: "rgba(245,244,238,0.15)", background: "rgba(245,244,238,0.03)" }}>
            <h3 className="font-display mb-6 text-2xl font-500">Send an Inquiry</h3>
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-[11px] uppercase tracking-[0.1em]" style={{ color: C.goldLight }}>Name</label>
                <input type="text" className="rounded-[4px] border bg-transparent px-4 py-2.5 text-[14px] outline-none transition-colors focus:border-[var(--gold)]" style={{ borderColor: "rgba(245,244,238,0.2)" }} placeholder="Jane Doe" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-[11px] uppercase tracking-[0.1em]" style={{ color: C.goldLight }}>Email</label>
                <input type="email" className="rounded-[4px] border bg-transparent px-4 py-2.5 text-[14px] outline-none transition-colors focus:border-[var(--gold)]" style={{ borderColor: "rgba(245,244,238,0.2)" }} placeholder="jane@company.com" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label text-[11px] uppercase tracking-[0.1em]" style={{ color: C.goldLight }}>Project Details</label>
                <textarea className="min-h-[100px] resize-none rounded-[4px] border bg-transparent px-4 py-2.5 text-[14px] outline-none transition-colors focus:border-[var(--gold)]" style={{ borderColor: "rgba(245,244,238,0.2)" }} placeholder="Tell us about your brand..." required></textarea>
              </div>
              <button
                type="submit"
                className="btn-gold font-label mt-2 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[4px] px-7 text-[12px] uppercase tracking-[0.18em] transition-colors"
                style={{ background: C.gold, color: C.darkSage }}
              >
                Submit Inquiry
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Calendar Side */}
          <div className="flex-1 flex-col justify-center rounded-[4px] border p-6 md:flex md:p-8" style={{ borderColor: "rgba(245,244,238,0.15)", background: "rgba(245,244,238,0.03)" }}>
            <h3 className="font-display mb-3 text-2xl font-500">Book Directly</h3>
            <p className="mb-8 text-[14px] leading-relaxed" style={{ color: "rgba(245,244,238,0.72)" }}>
              Prefer to jump straight into a conversation? Schedule a 30-minute discovery call directly on the founder's calendar.
            </p>
            <a
              href="#"
              className="font-label inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[4px] border px-7 text-[12px] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white/5"
              style={{ borderColor: "rgba(245,244,238,0.25)", color: C.ivory }}
            >
              Open Calendar
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────── */

function Footer() {
  return (
    <footer className="mt-auto" style={{ background: C.forest, color: C.ivory }}>
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo light />
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed" style={{ color: "rgba(245,244,238,0.65)" }}>
              A founder-led strategic growth partner. We build brands worth more
              tomorrow than they are today — through positioning, design, and
              systems that compound.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300"
                style={{ borderColor: "rgba(245,244,238,0.2)" }}
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:compilecreative@gmail.com"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300"
                style={{ borderColor: "rgba(245,244,238,0.2)" }}
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="font-label mb-4 text-[11px] uppercase tracking-[0.22em]" style={{ color: C.gold }}>
              Explore
            </div>
            <ul className="space-y-2.5 text-[14px]" style={{ color: "rgba(245,244,238,0.7)" }}>
              <li><a href="#work" className="transition-colors hover:text-white">Portfolio</a></li>
              <li><a href="#method" className="transition-colors hover:text-white">The Compile Method</a></li>
              <li><a href="#about" className="transition-colors hover:text-white">About the Founder</a></li>
              <li><a href="#contact" className="transition-colors hover:text-white">Start a Project</a></li>
            </ul>
          </div>



          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Image src="/founder-portrait.jpg" alt="Saleh Azgor Rishad" width={44} height={44} className="h-11 w-11 rounded-full object-cover object-top" style={{ boxShadow: `0 0 0 1px ${C.gold}` }} />
              <div>
                <div className="text-[13px] font-500">Saleh Azgor Rishad</div>
                <div className="font-label text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(245,244,238,0.5)" }}>
                  Founder
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-[12px] md:flex-row"
          style={{ borderColor: "rgba(245,244,238,0.12)", color: "rgba(245,244,238,0.45)" }}
        >
          <span>© {new Date().getFullYear()} Compile Creative. All rights reserved.</span>
          <span className="font-label text-[10px] uppercase tracking-[0.22em]">
            Strategy · Design · Systems · Growth
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Marquee strip (Replaced by BrandCarousel3D) ─── */
function Marquee() {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: C.base }}>
      <div className="container mx-auto px-6 md:px-12 text-center mb-16">
        <h3 className="font-label text-[11px] uppercase tracking-[0.2em] mb-6" style={{ color: C.gold }}>
          Our Transformations
        </h3>
        <h2 className="font-editorial text-4xl leading-tight md:text-5xl lg:text-[4rem] text-[#27332C]">
          Brands we've shifted the<br />
          <span style={{ color: C.gold }} className="italic font-light">perception of.</span>
        </h2>
        <p className="mt-8 mx-auto max-w-2xl font-label text-[13px] uppercase tracking-[0.1em] leading-relaxed" style={{ color: C.sage }}>
          Scroll to rotate. Each face is a brand whose positioning we rebuilt — <br className="hidden md:block"/> the full case studies follow below.
        </p>
      </div>
      <BrandCarousel3D />
      <div className="mt-16 text-center">
        <p className="font-editorial italic text-[#C6A56B] text-lg">
          Eight marks. Twelve transformations. One belief: perception is the product.
        </p>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────── */

export default function Home() {
  const mounted = useMounted();
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const desktop = mounted && isDesktop;

  return (
    <div className="flex min-h-screen flex-col" style={{ background: C.base }}>
      <CursorGlowBlob />
      <ScrollProgress />
      <Navigation />
      <main className="flex-1">
        <Hero isDesktop={desktop} reduced={reduced} />
        
        <GradientTransition fromColor={C.base} toColor={C.surface} direction="bottom" />
        <Founder isDesktop={desktop} reduced={reduced} />
        
        <AnimatedSectionDivider />
        <Positioning isDesktop={desktop} reduced={reduced} />
        <Marquee />
        
        <StrategicInsights isDesktop={desktop} reduced={reduced} />
        <PerceptionSequence isDesktop={desktop} reduced={reduced} />
        
        <GradientTransition fromColor={C.darkSage} toColor={C.base} direction="bottom" />
        <FeaturedOutcomes isDesktop={desktop} reduced={reduced} />
        
        <GradientTransition fromColor={C.forest} toColor={C.base} direction="bottom" />
        <TheMethod isDesktop={desktop} reduced={reduced} />
        
        <GradientTransition fromColor={C.base} toColor={C.darkSage} direction="bottom" />
        <FinalCTA isDesktop={desktop} reduced={reduced} />
      </main>
      <Footer />
    </div>
  );
}
