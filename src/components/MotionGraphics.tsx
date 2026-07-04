"use client";

import { motion, Variants, useReducedMotion, useScroll, useTransform, useSpring, useInView, useMotionValue, animate } from "framer-motion";
import React, { ReactNode, useRef, useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";

// Hydration safety hook
export const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,   // client
    () => false   // server
  );

// Mobile graceful degradation
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

/* ─── Shared Motion Utilities ───────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = typeof window !== "undefined" 
    ? [window.matchMedia("(min-width: 768px)").matches, () => {}] 
    : [false, () => {}];
  return isDesktop;
}

/* ─── 1. Editorial Text Reveal ──────────────────── */

export function EditorialText({
  text,
  delay = 0,
  className = "",
  style = {},
  isDesktop = true,
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  isDesktop?: boolean;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return (
      <p className={className} style={style}>
        {text}
      </p>
    );
  }

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay,
      },
    },
  };

  const child: Variants = {
    hidden: { 
      y: "110%", 
      filter: isDesktop ? "blur(4px)" : "none",
      opacity: isDesktop ? 0 : 1
    },
    visible: { 
      y: "0%", 
      filter: "blur(0px)",
      opacity: 1,
      transition: { 
        duration: isDesktop ? 0.8 : 0.6, 
        ease: EASE 
      } 
    },
  };

  return (
    <motion.p
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] mr-[0.25em]">
          <motion.span className="inline-block" variants={child}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}

/* ─── 2. Line Drawing Divider ───────────────────── */

export function AnimatedRule({
  delay = 0,
  className = "",
  color = "#C6A56B",
  direction = "horizontal",
}: {
  delay?: number;
  className?: string;
  color?: string;
  direction?: "horizontal" | "vertical";
}) {
  const reduced = useReducedMotion();

  if (direction === "vertical") {
    return (
      <motion.div
        className={`origin-top ${className}`}
        style={{ background: `linear-gradient(180deg, ${color}, transparent)` }}
        initial={{ scaleY: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
        whileInView={{ scaleY: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: EASE, delay }}
      />
    );
  }

  return (
    <motion.div
      className={`h-px origin-left ${className}`}
      style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      initial={{ scaleX: reduced ? 1 : 0, opacity: reduced ? 1 : 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: EASE, delay }}
    />
  );
}

/* ─── 3. Magnetic Hover Wrapper ─────────────────── */

export function MagneticWrapper({
  children,
  className = "",
  strength = 15,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * (strength / 100), y: middleY * (strength / 100) });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─── 4. Gradient Section Transition ────────────── */

export function GradientTransition({
  fromColor,
  toColor,
  direction = "bottom",
}: {
  fromColor: string;
  toColor: string;
  direction?: "bottom" | "top";
}) {
  return (
    <div
      className="pointer-events-none w-full h-24 md:h-32"
      style={{
        background: `linear-gradient(to ${direction}, ${fromColor}, ${toColor})`,
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORY A: CANVAS-2D / MATH-DRIVEN 3D WIREFRAMES
   ═══════════════════════════════════════════════════ */

// 1. TorusKnotWireframe
export function TorusKnotWireframe({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mounted || reduced || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const setSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    setSize();
    window.addEventListener("resize", setSize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / w - 0.5;
      const y = (e.clientY - rect.top) / h - 0.5;
      mouseRef.current = { x, y };
    };
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Generate points
    const points: {x:number, y:number, z:number}[] = [];
    const p = 2;
    const q = 3;
    const numPoints = 150;
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      const x = (2 + Math.cos(q * t)) * Math.cos(p * t);
      const y = (2 + Math.cos(q * t)) * Math.sin(p * t);
      const z = Math.sin(q * t);
      points.push({ x, y, z });
    }

    let animationId: number;
    let baseRotation = 0;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(containerRef.current);

    const draw = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, w, h);
        baseRotation += 0.005;

        // Mouse parallax
        const targetRotX = mouseRef.current.y * 0.5;
        const targetRotY = mouseRef.current.x * 0.5;
        
        // Simple matrix mult for rotation (X and Y)
        const rotX = baseRotation + targetRotX;
        const rotY = baseRotation * 0.7 + targetRotY;

        const cx = Math.cos(rotX), sx = Math.sin(rotX);
        const cy = Math.cos(rotY), sy = Math.sin(rotY);

        const projected = points.map(pt => {
          // Rotate Y
          const x1 = pt.x * cy - pt.z * sy;
          const z1 = pt.z * cy + pt.x * sy;
          // Rotate X
          const y2 = pt.y * cx - z1 * sx;
          const z2 = z1 * cx + pt.y * sx;
          
          return { x: x1, y: y2, z: z2 };
        });

        // Edges (connect sequential points)
        const edges = [];
        for (let i = 0; i < numPoints; i++) {
          const p1 = projected[i];
          const p2 = projected[(i + 1) % numPoints];
          edges.push({ p1, p2, avgZ: (p1.z + p2.z) / 2 });
        }

        // Depth sort
        edges.sort((a, b) => a.avgZ - b.avgZ);

        const fov = 15;
        const scale = 50; // visual scale multiplier
        
        edges.forEach(edge => {
          // Perspective projection
          const s1 = fov / (fov - edge.p1.z);
          const px1 = edge.p1.x * s1 * scale + w / 2;
          const py1 = edge.p1.y * s1 * scale + h / 2;

          const s2 = fov / (fov - edge.p2.z);
          const px2 = edge.p2.x * s2 * scale + w / 2;
          const py2 = edge.p2.y * s2 * scale + h / 2;

          // Depth fade
          // z range is approx -3 to +3
          const opacity = Math.max(0.1, Math.min(1, (edge.avgZ + 3) / 6));

          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.strokeStyle = `rgba(198, 165, 107, ${opacity * 0.8})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", setSize);
      if (!isMobile) window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
      if (containerRef.current) observer.unobserve(containerRef.current);
      observer.disconnect();
    };
  }, [mounted, reduced, isMobile]);

  if (!mounted || reduced) return <div className={`${className} bg-[#C6A56B]/10 rounded-full`} />;
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />
    </div>
  );
}

// 2. GeometricConstellation
export function GeometricConstellation({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mounted || reduced || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const setSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    setSize();
    window.addEventListener("resize", setSize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / w - 0.5;
      const y = (e.clientY - rect.top) / h - 0.5;
      mouseRef.current = { x, y };
    };
    if (!isMobile) window.addEventListener("mousemove", handleMouseMove);

    // Node definitions
    const numNodes = 80;
    const nodes = Array.from({ length: numNodes }, () => ({
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 4,
      tx: 0, ty: 0, tz: 0, // targets
    }));

    // Formations
    const getTetrahedron = () => {
      const pts = [
        { x: 1, y: 1, z: 1 }, { x: -1, y: -1, z: 1 }, { x: -1, y: 1, z: -1 }, { x: 1, y: -1, z: -1 }
      ];
      return nodes.map((_, i) => ({ ...pts[i % 4] }));
    };
    const getOctahedron = () => {
      const pts = [
        { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
      ];
      return nodes.map((_, i) => ({ ...pts[i % 6] }));
    };
    const getCube = () => {
      const pts = [];
      for(let x of [-1,1]) for(let y of [-1,1]) for(let z of [-1,1]) pts.push({x,y,z});
      return nodes.map((_, i) => ({ ...pts[i % 8] }));
    };
    
    const formations = [getTetrahedron, getOctahedron, getCube];
    let formationIdx = 0;

    // Cycle every 6 seconds
    const interval = setInterval(() => {
      const targets = formations[formationIdx]();
      nodes.forEach((n, i) => {
        // add some jitter to targets
        n.tx = targets[i].x * 1.5 + (Math.random()-0.5)*0.2;
        n.ty = targets[i].y * 1.5 + (Math.random()-0.5)*0.2;
        n.tz = targets[i].z * 1.5 + (Math.random()-0.5)*0.2;
      });
      formationIdx = (formationIdx + 1) % formations.length;
    }, 6000);

    let animationId: number;
    let time = 0;
    
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.01;

      // Update node positions towards targets
      nodes.forEach(n => {
        n.x += (n.tx - n.x) * 0.05;
        n.y += (n.ty - n.y) * 0.05;
        n.z += (n.tz - n.z) * 0.05;
      });

      // Mouse parallax + base rotation
      const rotX = time * 0.5 + mouseRef.current.y * 1.0;
      const rotY = time * 0.3 + mouseRef.current.x * 1.0;

      const cx = Math.cos(rotX), sx = Math.sin(rotX);
      const cy = Math.cos(rotY), sy = Math.sin(rotY);

      const projected = nodes.map(pt => {
        const x1 = pt.x * cy - pt.z * sy;
        const z1 = pt.z * cy + pt.x * sy;
        const y2 = pt.y * cx - z1 * sx;
        const z2 = z1 * cx + pt.y * sx;
        return { x: x1, y: y2, z: z2 };
      });

      const fov = 10;
      const scale = 80;

      // Draw edges
      for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dz = projected[i].z - projected[j].z;
          const distSq = dx*dx + dy*dy + dz*dz;
          
          if (distSq < 2.5) { // distance threshold
            const p1 = projected[i];
            const p2 = projected[j];
            const s1 = fov / (fov - p1.z);
            const px1 = p1.x * s1 * scale + w / 2;
            const py1 = p1.y * s1 * scale + h / 2;
            const s2 = fov / (fov - p2.z);
            const px2 = p2.x * s2 * scale + w / 2;
            const py2 = p2.y * s2 * scale + h / 2;

            const avgZ = (p1.z + p2.z)/2;
            const depthAlpha = Math.max(0, Math.min(1, (avgZ + 3) / 6));
            const distAlpha = 1 - Math.sqrt(distSq)/1.58; // approx sqrt(2.5)
            
            // Mouse proximity glow
            const mx = (mouseRef.current.x + 0.5) * w;
            const my = (mouseRef.current.y + 0.5) * h;
            const midX = (px1 + px2) / 2;
            const midY = (py1 + py2) / 2;
            const mDistSq = (mx - midX) * (mx - midX) + (my - midY) * (my - midY);
            // Glow radius of ~200px
            const mouseGlow = Math.max(0, 1 - Math.sqrt(mDistSq) / 200);

            // Base alpha + glow alpha
            const alpha = (depthAlpha * distAlpha * 1.2) + (mouseGlow * 2.0);

            if (alpha > 0.05) {
              ctx.beginPath();
              ctx.moveTo(px1, py1);
              ctx.lineTo(px2, py2);
              ctx.strokeStyle = `rgba(198, 165, 107, ${Math.min(1, alpha)})`;
              ctx.lineWidth = 1.0 + mouseGlow * 2.5;
              ctx.stroke();
            }
          }
        }
      }

      // Draw nodes
      projected.forEach(p => {
        const s = fov / (fov - p.z);
        const px = p.x * s * scale + w / 2;
        const py = p.y * s * scale + h / 2;
        const depthAlpha = Math.max(0.1, Math.min(1, (p.z + 3) / 6));
        
        // Node mouse glow
        const mx = (mouseRef.current.x + 0.5) * w;
        const my = (mouseRef.current.y + 0.5) * h;
        const mDistSq = (mx - px) * (mx - px) + (my - py) * (my - py);
        const mouseGlow = Math.max(0, 1 - Math.sqrt(mDistSq) / 200);
        
        const alpha = Math.min(1, depthAlpha + mouseGlow * 2.0);
        const radius = s * 2 + mouseGlow * 2;

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198, 165, 107, ${alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", setSize);
      if (!isMobile) window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mounted, reduced, isMobile]);

  if (!mounted || reduced) return null;
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORY B: CSS-3D TRANSFORMS
   ═══════════════════════════════════════════════════ */

// 3. ScrollCubeGallery
export function ScrollCubeGallery({ items, className = "" }: { items: ReactNode[], className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scrollRot = useTransform(scrollYProgress, [0, 1], [-360, 360]);
  const rotateY = useSpring(scrollRot, { stiffness: 60, damping: 20 });

  if (!mounted || reduced) return null;

  // Render 6 faces (items length should be 6 or duplicated to 6)
  const faces = Array.from({ length: 6 }).map((_, i) => items[i % items.length]);

  return (
    <div ref={ref} className={`relative w-full h-[600px] flex items-center justify-center ${className}`} style={{ perspective: 1000 }}>
      {isMobile ? (
        <div className="relative w-[240px] h-[240px]" style={{ transformStyle: "preserve-3d", animation: "auto-rotate-cube 20s infinite linear" }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes auto-rotate-cube { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
          `}} />
          {faces.map((f, i) => (
            <div key={i} className="absolute inset-0 bg-white border border-[#C6A56B]/20 flex items-center justify-center shadow-lg"
                 style={{ transform: `rotateY(${i * 60}deg) translateZ(200px)`, backfaceVisibility: "hidden" }}>
              {f}
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="relative w-[300px] h-[300px]"
          style={{ transformStyle: "preserve-3d", rotateY }}
        >
          {faces.map((f, i) => (
            <div key={i} className="absolute inset-0 bg-white border border-[#C6A56B]/20 flex items-center justify-center shadow-2xl"
                 style={{ transform: `rotateY(${i * 60}deg) translateZ(260px)`, backfaceVisibility: "hidden" }}>
              {f}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// 4. TiltCard3D
export function TiltCard3D({ children, className = "" }: { children: ReactNode, className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 20 });
  
  const bgX = useTransform(x, [-0.5, 0.5], ["-50%", "50%"]);
  const bgY = useTransform(y, [-0.5, 0.5], ["-50%", "50%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width - 0.5;
    const my = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mx);
    y.set(my);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!mounted || reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX,
        rotateY,
      }}
    >
      <div style={{ transform: "translateZ(30px)" }} className="w-full h-full pointer-events-none">
        {children}
      </div>
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-inherit"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 60%)",
          mixBlendMode: "overlay",
          x: bgX,
          y: bgY,
        }}
      />
    </motion.div>
  );
}

// 5. FoldOutPanel
export function FoldOutPanel({ triggerNode, contentNode, className = "" }: { triggerNode: ReactNode, contentNode: ReactNode, className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 40%"]
  });

  const rotateX = useSpring(useTransform(scrollYProgress, [0, 1], [-90, 0]), { stiffness: 100, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  if (!mounted || reduced) {
    return (
      <div className={className}>
        {triggerNode}
        <div className="mt-4">{contentNode}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`} style={{ perspective: 1500 }}>
      <div className="relative z-10 bg-white shadow-md rounded-t-lg p-6">
        {triggerNode}
      </div>
      <motion.div
        className="origin-top bg-[#F5F4EE] shadow-inner rounded-b-lg p-6 overflow-hidden"
        style={{ rotateX, opacity }}
      >
        <div style={{ transform: "translateZ(1px)" }}>
          {contentNode}
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORY C: SVG FILTERS & ORGANIC MOTION
   ═══════════════════════════════════════════════════ */

// 6. GooBlobBackground
export function GooBlobBackground({ className = "", light = false }: { className?: string; light?: boolean }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();

  if (!mounted || reduced) return <div className={className} />;

  const color = light ? "#F5F4EE" : "#C6A56B";

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="absolute inset-0" style={{ filter: "url(#goo)" }}>
        <motion.div
          className="absolute rounded-full opacity-50 mix-blend-multiply blur-[2px]"
          style={{ backgroundColor: color, width: "30%", height: "30%", left: "35%", top: "35%" }}
          animate={{
            x: ["0%", "50%", "-50%", "0%"],
            y: ["0%", "-50%", "50%", "0%"],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute rounded-full opacity-50 mix-blend-multiply blur-[2px]"
          style={{ backgroundColor: color, width: "25%", height: "25%", left: "40%", top: "40%" }}
          animate={{
            x: ["0%", "-60%", "40%", "0%"],
            y: ["0%", "40%", "-60%", "0%"],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute rounded-full opacity-50 mix-blend-multiply blur-[2px]"
          style={{ backgroundColor: color, width: "35%", height: "35%", left: "30%", top: "30%" }}
          animate={{
            x: ["0%", "30%", "-30%", "0%"],
            y: ["0%", "30%", "-30%", "0%"],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

// 7. SvgMorphingShape
export function SvgMorphingShape({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();

  // Circle
  const path1 = "M 50 10 C 72 10 90 28 90 50 C 90 72 72 90 50 90 C 28 90 10 72 10 50 C 10 28 28 10 50 10";
  // Triangle
  const path2 = "M 50 10 C 63 36 76 63 90 90 C 63 90 36 90 10 90 C 23 63 36 36 50 10 C 50 10 50 10 50 10";
  // Square
  const path3 = "M 10 10 C 50 10 50 10 90 10 C 90 50 90 50 90 90 C 50 90 50 90 10 90 C 10 50 10 50 10 10";

  if (!mounted || reduced) {
    return (
      <svg viewBox="0 0 100 100" className={className}>
        <path d={path1} fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <motion.path
        fill="currentColor"
        animate={{ d: [path1, path2, path3, path1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", times: [0, 0.33, 0.66, 1] }}
      />
    </svg>
  );
}

// 8. SineWaveDivider
export function SineWaveDivider({ className = "", color = "#C6A56B" }: { className?: string; color?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();

  if (!mounted || reduced) return <div className={`h-px w-full bg-[${color}] opacity-20 ${className}`} />;

  return (
    <div className={`relative w-full overflow-hidden h-16 ${className}`}>
      <motion.svg
        className="absolute top-0 w-[200%] h-full opacity-30"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <path d="M 0 50 Q 12.5 20 25 50 T 50 50 T 75 50 T 100 50" fill="none" stroke={color} strokeWidth="1" />
      </motion.svg>
      <motion.svg
        className="absolute top-2 w-[200%] h-full opacity-10"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <path d="M 0 50 Q 12.5 80 25 50 T 50 50 T 75 50 T 100 50" fill="none" stroke={color} strokeWidth="1" />
      </motion.svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORY D: CURSOR & MICRO-INTERACTIONS
   ═══════════════════════════════════════════════════ */

// 9. TextScramble
export function TextScramble({ text, className = "" }: { text: string; className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!mounted || reduced || !inView) return;

    const chars = "!<>-_\\/[]{}—=+*^?#________";
    const steps = 20;
    let step = 0;

    const interval = setInterval(() => {
      let output = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === " ") {
          output += " ";
          continue;
        }

        // Partial lock logic: outer chars lock first, inner chars last
        const distFromEdge = Math.min(i, text.length - 1 - i);
        const lockThreshold = (distFromEdge / (text.length / 2)) * steps * 0.7; // 0 to ~14
        
        if (step > lockThreshold + Math.random() * 5) {
          output += char;
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplay(output);
      step++;
      
      if (step > steps + 10) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [mounted, reduced, inView, text]);

  if (!mounted || reduced) return <span className={className}>{text}</span>;

  return <span ref={ref} className={className}>{display}</span>;
}

// 10. SpotlightCard
export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const bgTransform = useTransform(
    [springX, springY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(198,165,107,0.15), transparent 40%)`
  );

  if (!mounted || reduced) {
    return (
      <div className={`relative overflow-hidden border border-[#C6A56B]/20 ${className}`}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(198,165,107,0.05) 0%, transparent 60%)" }} />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden border border-[#C6A56B]/20 transition-colors duration-500 hover:border-[#C6A56B]/40 ${className}`}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: bgTransform,
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// 11. CursorGlowBlob
export function CursorGlowBlob() {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 30, damping: 20 });
  const springY = useSpring(y, { stiffness: 30, damping: 20 });

  const bgX = useTransform(springX, (val) => val - 300);
  const bgY = useTransform(springY, (val) => val - 300);

  useEffect(() => {
    if (!mounted || reduced || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    // initialize center
    x.set(window.innerWidth / 2);
    y.set(window.innerHeight / 2);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted, reduced, isMobile, x, y]);

  if (!mounted || reduced || isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-[-1]"
      style={{
        x: bgX,
        y: bgY,
        background: "radial-gradient(circle, rgba(198,165,107,0.06) 0%, transparent 60%)",
        mixBlendMode: "screen",
      }}
    />
  );
}


/* ═══════════════════════════════════════════════════
   CATEGORY E: SCROLL CHOREOGRAPHY
   ═══════════════════════════════════════════════════ */

// 12. ParticleBurstCounter
export function ParticleBurstCounter({ target, suffix = "", prefix = "", className = "" }: { target: number; suffix?: string; prefix?: string; className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [value, setValue] = useState(0);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (!mounted || reduced || !inView) return;
    const v = { val: 0 };
    const controls = animate(v.val, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1], // EASE
      onUpdate: (latest) => {
        setValue(Math.round(latest));
      },
      onComplete: () => {
        setBurst(true);
      }
    });
    return () => controls.stop();
  }, [mounted, reduced, inView, target]);

  if (!mounted || reduced) return <span className={className}>{prefix}{target}{suffix}</span>;

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span>{prefix}{value}{suffix}</span>
      {burst && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const dist = 60 + Math.random() * 60; // 60-120px
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            return (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-[#C6A56B] rounded-full"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            );
          })}
        </div>
      )}
    </span>
  );
}

// 13. ScrollParallaxImage
export function ScrollParallaxImage({ src, alt, className = "", imgClassName = "" }: { src: string; alt: string; className?: string; imgClassName?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const y = useSpring(yTransform, { stiffness: 60, damping: 20 });

  const safeClassName = className.replace('relative', '').replace('absolute', '').replace('inset-0', '');

  if (!mounted || reduced) {
    return (
      <div className={`absolute inset-0 overflow-hidden w-full h-full ${safeClassName}`}>
        <Image src={src} alt={alt} fill className={`object-cover ${imgClassName}`} />
      </div>
    );
  }

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden w-full h-full ${safeClassName}`}>
      <motion.div
        className="absolute -inset-y-[40px] inset-x-0 w-full h-[calc(100%+80px)]"
        style={{ y }}
      >
        <Image src={src} alt={alt} fill className={`object-cover ${imgClassName}`} />
      </motion.div>
    </div>
  );
}

// 14. StickyStackDeck
export function StickyStackDeck({ cards, className = "" }: { cards: ReactNode[]; className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  if (!mounted || reduced) {
    return (
      <div className={`flex flex-col gap-8 ${className}`}>
        {cards.map((c, i) => <div key={i}>{c}</div>)}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} style={{ height: `${cards.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {cards.map((card, i) => {
          // Calculate when this card is active vs pushed back
          const start = i / cards.length;
          const end = (i + 1) / cards.length;
          // When next card hits 80% coverage (0.8 * end)
          const fadeStart = end - (1 / cards.length) * 0.2;
          
          return (
            <StickyCard
              key={i}
              card={card}
              index={i}
              total={cards.length}
              progress={scrollYProgress}
            />
          );
        })}
      </div>
    </div>
  );
}

function StickyCard({ card, index, total, progress }: { card: ReactNode, index: number, total: number, progress: any }) {
  // If we are at index i, our prime time is around (i)/total
  const fadeStart = index / total;
  const pushBackStart = (index + 0.8) / total;
  const pushBackEnd = (index + 1) / total;

  const y = useTransform(progress, [0, fadeStart, pushBackStart, pushBackEnd], ["100vh", "0vh", "0vh", "-10vh"]);
  const scale = useTransform(progress, [pushBackStart, pushBackEnd], [1, 0.9]);
  const opacity = useTransform(progress, [pushBackStart, pushBackEnd], [1, 0.5]);

  return (
    <motion.div
      className="absolute w-full max-w-4xl px-4"
      style={{ y, scale, opacity, zIndex: total - index }}
    >
      {card}
    </motion.div>
  );
}

// 15. AnimatedSectionDivider
export function AnimatedSectionDivider({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  if (!mounted || reduced) {
    return (
      <div className={`w-full flex items-center justify-center py-12 ${className}`}>
        <div className="w-full h-px bg-[#C6A56B]/30" />
      </div>
    );
  }

  const draw = {
    hidden: { strokeDashoffset: 1000 },
    visible: {
      strokeDashoffset: 0,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  const diamond = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: 1, duration: 0.6, ease: "backOut" }
    }
  };

  return (
    <div ref={ref} className={`w-full flex items-center justify-center py-12 relative ${className}`}>
      <svg className="absolute w-full h-px" preserveAspectRatio="none" viewBox="0 0 1000 1">
        <motion.line
          x1="0" y1="0.5" x2="1000" y2="0.5"
          stroke="#C6A56B" strokeWidth="1" strokeOpacity="0.3"
          strokeDasharray="1000"
          variants={draw}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        />
      </svg>
      <motion.div
        className="relative z-10 w-3 h-3 bg-white border border-[#C6A56B] rotate-45"
        variants={diamond}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      />
    </div>
  );
}
