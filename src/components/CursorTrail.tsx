"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useTransform, animate } from "framer-motion";

/* ─── Brand Colors ─────────────────────────────── */
const GOLD = "#C6A56B";
const GOLD_LIGHT = "#D4BA8A";
const FOREST = "#27332C";

/* ═══════════════════════════════════════════════════
   1. MAGNETIC CURSOR — Premium dot + ring + glow
   ═══════════════════════════════════════════════════ */

export function MagneticCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [hoverState, setHoverState] = useState<"default" | "pointer" | "text" | "view">("default");
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useSpring(0, { stiffness: 900, damping: 30, mass: 0.2 });
  const cursorY = useSpring(0, { stiffness: 900, damping: 30, mass: 0.2 });

  const ringX = useSpring(0, { stiffness: 300, damping: 25, mass: 0.3 });
  const ringY = useSpring(0, { stiffness: 300, damping: 25, mass: 0.3 });

  const glowX = useSpring(0, { stiffness: 80, damping: 30, mass: 1 });
  const glowY = useSpring(0, { stiffness: 80, damping: 30, mass: 1 });

  // Let framer-motion handle layout transitions for the core dot/ring shape
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      glowX.set(e.clientX);
      glowY.set(e.clientY);
    };

    const down = () => setIsClicking(true);
    const up = () => setIsClicking(false);

    // Detect hoverable elements
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".view-cursor")) {
        setHoverState("view");
      } else if (target.closest("a, button, [role='button'], input, textarea, select, .hoverable")) {
        setHoverState("pointer");
      } else if (target.closest("p, h1, h2, h3, h4, h5, h6, span")) {
        setHoverState("text");
      } else {
        setHoverState("default");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseover", over);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseover", over);
    };
  }, [isDesktop, cursorX, cursorY, ringX, ringY, glowX, glowY]);

  if (!isDesktop) return null;

  // Compute target values based on state
  let dotWidth = 8, dotHeight = 8, dotRadius = 4, dotOpacity = 1;
  let ringWidth = 40, ringHeight = 40, ringRadius = 20, ringOpacity = 1, ringBorder = "rgba(198,165,107,0.45)";
  
  if (isClicking) {
    dotWidth = 6; dotHeight = 6;
    ringWidth = 64; ringHeight = 64;
  } else if (hoverState === "pointer") {
    dotWidth = 4; dotHeight = 4;
    ringWidth = 88; ringHeight = 88; ringBorder = GOLD;
  } else if (hoverState === "text") {
    dotWidth = 2; dotHeight = 24; dotRadius = 1;
    ringOpacity = 0; ringWidth = 10; ringHeight = 10;
  } else if (hoverState === "view") {
    dotWidth = 60; dotHeight = 60; dotRadius = 30; dotOpacity = 0.9;
    ringOpacity = 0; ringWidth = 10; ringHeight = 10;
  }

  return (
    <>
      {/* Glow halo */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9996] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: glowX,
          y: glowY,
          width: 120,
          height: 120,
          background: `radial-gradient(circle, rgba(198,165,107,0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        animate={{
          width: ringWidth,
          height: ringHeight,
          borderRadius: ringRadius,
          opacity: ringOpacity,
          borderColor: ringBorder,
          borderWidth: hoverState === "pointer" ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          x: ringX,
          y: ringY,
          borderStyle: "solid",
        }}
      />

      {/* Core dot / View label container */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-difference overflow-hidden"
        animate={{
          width: dotWidth,
          height: dotHeight,
          borderRadius: dotRadius,
          opacity: dotOpacity,
          backgroundColor: hoverState === "view" ? "rgba(198,165,107,0.8)" : GOLD,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: hoverState === "view" ? 1 : 0,
            scale: hoverState === "view" ? 1 : 0.5
          }}
          className="font-label text-[10px] uppercase tracking-[0.2em] text-[#1E2A23] mix-blend-normal"
        >
          View
        </motion.span>
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   2. MOTION LINES — Reactive cursor field lines
   ═══════════════════════════════════════════════════ */

export function MotionLinesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothMouse = useRef({ x: -9999, y: -9999 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      w = parent?.clientWidth || window.innerWidth;
      h = parent?.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMouse);

    const LINE_COUNT = 14;
    const SEGMENTS = 150;

    const draw = () => {
      time += 0.006;

      // Smooth mouse for fluid warping
      smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.1;
      smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.1;

      ctx.clearRect(0, 0, w, h);

      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;

      for (let i = 0; i < LINE_COUNT; i++) {
        // Spread lines across 90% of the height
        const baseY = (h * 0.05) + (i / (LINE_COUNT - 1)) * (h * 0.90);
        const phase = i * 0.55 + time;
        const baseAmplitude = 18 + Math.sin(i * 1.1) * 12;
        
        // Higher alpha = more visible. Range: 0.12 – 0.22
        const centerDist = Math.abs(i - LINE_COUNT / 2) / (LINE_COUNT / 2);
        const lineAlpha = 0.12 + (1 - centerDist) * 0.10;

        ctx.beginPath();

        for (let s = 0; s <= SEGMENTS; s++) {
          const t = s / SEGMENTS;
          const x = t * w;

          // Multi-harmonic wave
          let y = baseY;
          y += Math.sin(t * 2.8 + phase) * baseAmplitude;
          y += Math.sin(t * 5.2 + phase * 0.6) * (baseAmplitude * 0.35);
          y += Math.sin(t * 1.1 + phase * 1.4) * (baseAmplitude * 0.55);

          // Cursor warp — push line away
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const warpRadius = 250;

          if (dist < warpRadius && dist > 0) {
            const force = 1 - dist / warpRadius;
            const warpStrength = force * force * force * 120;
            y += (dy / dist) * warpStrength;
          }

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        // Use a darker gold-brown that contrasts well on cream
        ctx.strokeStyle = `rgba(180,150,90,${lineAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Accent dots near cursor
      for (let i = 0; i < LINE_COUNT; i += 2) {
        const baseY1 = (h * 0.05) + (i / (LINE_COUNT - 1)) * (h * 0.90);
        const phase1 = i * 0.55 + time;
        const amp = 18 + Math.sin(i * 1.1) * 12;

        for (let offset = -150; offset <= 150; offset += 40) {
          const cx = mx + offset;
          if (cx < 0 || cx > w) continue;
          const t = cx / w;
          let cy = baseY1;
          cy += Math.sin(t * 2.8 + phase1) * amp;
          cy += Math.sin(t * 5.2 + phase1 * 0.6) * (amp * 0.35);
          cy += Math.sin(t * 1.1 + phase1 * 1.4) * (amp * 0.55);

          const dx = cx - mx;
          const dy = cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 300 && dist > 15) {
            const dotAlpha = (1 - dist / 300) * 0.5;
            ctx.beginPath();
            ctx.fillStyle = `rgba(198,165,107,${dotAlpha})`;
            ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2]"
    />
  );
}

/* ═══════════════════════════════════════════════════
   3. 3D WIREFRAME SPHERE — Cursor-reactive background
   ═══════════════════════════════════════════════════ */

export function WireframeSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      w = parent?.clientWidth || 600;
      h = parent?.clientHeight || 600;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMouse);

    // Generate sphere vertices
    const RINGS = 14;
    const SEGMENTS = 20;
    const vertices: [number, number, number][] = [];

    for (let i = 0; i <= RINGS; i++) {
      const phi = (Math.PI * i) / RINGS;
      for (let j = 0; j <= SEGMENTS; j++) {
        const theta = (2 * Math.PI * j) / SEGMENTS;
        vertices.push([
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta),
        ]);
      }
    }

    let time = 0;

    const draw = () => {
      time += 0.003;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.35;

      // Rotation influenced by cursor
      const rotY = time + (mouseRef.current.x - 0.5) * 1.5;
      const rotX = (mouseRef.current.y - 0.5) * 0.8;

      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      // Project vertices
      const projected = vertices.map(([vx, vy, vz]) => {
        // Rotate Y
        let x = vx * cosY + vz * sinY;
        let z = -vx * sinY + vz * cosY;
        // Rotate X
        let y = vy * cosX - z * sinX;
        z = vy * sinX + z * cosX;
        // Perspective
        const scale = 2.5 / (2.5 + z * 0.6);
        return {
          x: cx + x * radius * scale,
          y: cy + y * radius * scale,
          z,
          scale,
        };
      });

      // Draw edges along rings
      ctx.lineWidth = 0.4;
      for (let i = 0; i <= RINGS; i++) {
        for (let j = 0; j < SEGMENTS; j++) {
          const idx1 = i * (SEGMENTS + 1) + j;
          const idx2 = i * (SEGMENTS + 1) + j + 1;
          const p1 = projected[idx1];
          const p2 = projected[idx2];
          if (!p1 || !p2) continue;

          const alpha = ((p1.z + p2.z) / 2 + 1) * 0.15 + 0.02;
          ctx.strokeStyle = `rgba(198,165,107,${Math.max(0.02, alpha)})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw edges along segments (meridians)
      for (let j = 0; j <= SEGMENTS; j++) {
        for (let i = 0; i < RINGS; i++) {
          const idx1 = i * (SEGMENTS + 1) + j;
          const idx2 = (i + 1) * (SEGMENTS + 1) + j;
          const p1 = projected[idx1];
          const p2 = projected[idx2];
          if (!p1 || !p2) continue;

          const alpha = ((p1.z + p2.z) / 2 + 1) * 0.12 + 0.02;
          ctx.strokeStyle = `rgba(198,165,107,${Math.max(0.02, alpha)})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw bright dots at vertices facing front
      for (const p of projected) {
        if (p.z > 0.2) {
          const dotAlpha = (p.z - 0.2) * 0.6;
          ctx.fillStyle = `rgba(198,165,107,${dotAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
    />
  );
}

/* ═══════════════════════════════════════════════════
   4. GEOMETRIC GRID — 3D rotating grid background
   ═══════════════════════════════════════════════════ */

export function GeometricGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      w = parent?.clientWidth || window.innerWidth;
      h = parent?.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMouse);

    let time = 0;

    const draw = () => {
      time += 0.002;
      ctx.clearRect(0, 0, w, h);

      const gridSize = 60;
      const cols = Math.ceil(w / gridSize) + 2;
      const rows = Math.ceil(h / gridSize) + 2;

      const perspective = 800;
      const tiltX = (mouseRef.current.y - 0.5) * 0.15;
      const tiltY = (mouseRef.current.x - 0.5) * 0.15;

      const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);
      const cosY = Math.cos(tiltY), sinY = Math.sin(tiltY);

      const project = (x: number, y: number, z: number) => {
        // Center
        x -= w / 2;
        y -= h / 2;
        // Rotate
        let rx = x * cosY + z * sinY;
        let rz = -x * sinY + z * cosY;
        let ry = y * cosX - rz * sinX;
        rz = y * sinX + rz * cosX;
        // Perspective
        const scale = perspective / (perspective + rz);
        return {
          x: w / 2 + rx * scale,
          y: h / 2 + ry * scale,
          scale,
        };
      };

      // Draw grid intersections with wave displacement
      const points: { x: number; y: number; scale: number; brightness: number }[][] = [];

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        for (let c = 0; c < cols; c++) {
          const gx = c * gridSize - gridSize;
          const gy = r * gridSize - gridSize;

          // Wave displacement on z-axis
          const wave = Math.sin(gx * 0.008 + time * 3) * Math.cos(gy * 0.008 + time * 2) * 30;

          const p = project(gx, gy, wave);
          const brightness = Math.max(0, Math.min(1, (wave + 30) / 60));
          points[r][c] = { ...p, brightness };
        }
      }

      // Draw grid lines
      ctx.lineWidth = 0.3;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const p1 = points[r][c];
          const p2 = points[r][c + 1];
          const alpha = (p1.brightness + p2.brightness) * 0.04 + 0.01;
          ctx.strokeStyle = `rgba(198,165,107,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 1; r++) {
          const p1 = points[r][c];
          const p2 = points[r + 1][c];
          const alpha = (p1.brightness + p2.brightness) * 0.04 + 0.01;
          ctx.strokeStyle = `rgba(198,165,107,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw highlighted dots at peaks
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          if (p.brightness > 0.6) {
            ctx.fillStyle = `rgba(198,165,107,${p.brightness * 0.15})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5 * p.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
    />
  );
}
