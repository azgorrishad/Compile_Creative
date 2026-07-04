"use client";

import { useEffect, useRef, useCallback } from "react";

/* ─── 3D Particle Types ─────────────────────────── */

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  baseSize: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
  pulse: number;
  pulseSpeed: number;
  type: "circle" | "cube" | "hex" | "diamond" | "ring";
  rotation: number;
  rotationSpeed: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface MouseState {
  x: number;
  y: number;
  active: boolean;
}

/* ─── Draw 3D Geometric Shapes ──────────────────── */

function drawCube(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  color: string
) {
  const s = size * 1.4;
  const angle = rotation;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // Front face
  const fx = [
    [-s * 0.4, -s * 0.4],
    [s * 0.4, -s * 0.4],
    [s * 0.4, s * 0.4],
    [-s * 0.4, s * 0.4],
  ].map(([px, py]) => [x + px * cos - py * sin, y + px * sin + py * cos]);

  // Back face (offset for 3D)
  const offset = s * 0.25;
  const bx = [
    [-s * 0.4 + offset, -s * 0.4 - offset],
    [s * 0.4 + offset, -s * 0.4 - offset],
    [s * 0.4 + offset, s * 0.4 - offset],
    [-s * 0.4 + offset, s * 0.4 - offset],
  ].map(([px, py]) => [x + px * cos - py * sin, y + px * sin + py * cos]);

  ctx.save();
  ctx.globalAlpha = alpha;

  // Draw back face edges (dimmer)
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(bx[0][0], bx[0][1]);
  for (let i = 1; i < 4; i++) ctx.lineTo(bx[i][0], bx[i][1]);
  ctx.closePath();
  ctx.stroke();

  // Connect front to back
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(fx[i][0], fx[i][1]);
    ctx.lineTo(bx[i][0], bx[i][1]);
    ctx.stroke();
  }

  // Front face edges
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(fx[0][0], fx[0][1]);
  for (let i = 1; i < 4; i++) ctx.lineTo(fx[i][0], fx[i][1]);
  ctx.closePath();
  ctx.stroke();

  ctx.restore();
}

function drawHex(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  color: string
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + rotation;
    const px = x + size * Math.cos(angle);
    const py = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  color: string
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.6;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const points = [
    [0, -size],
    [size * 0.6, 0],
    [0, size],
    [-size * 0.6, 0],
  ].map(([px, py]) => [x + px * cos - py * sin, y + px * sin + py * cos]);
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < 4; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number,
  alpha: number,
  color: string,
  fill: string
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  // Outer ring
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.ellipse(x, y, size, size * 0.5, rotation, 0, Math.PI * 2);
  ctx.stroke();
  // Inner dot
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ─── Hero Particle Canvas ──────────────────────── */

export function HeroParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const COLORS = [
    "rgba(198, 165, 107,", // gold
    "rgba(212, 186, 138,", // gold-light
    "rgba(75, 99, 85,", // sage
    "rgba(245, 244, 238,", // ivory
    "rgba(198, 165, 107,", // gold (more weight)
    "rgba(198, 165, 107,", // gold (even more weight)
  ];

  const SHAPE_TYPES: Particle["type"][] = [
    "circle",
    "circle",
    "circle",
    "cube",
    "hex",
    "diamond",
    "ring",
  ];

  const createParticle = useCallback(
    (width: number, height: number, init = false): Particle => {
      const depth = Math.random();
      const maxLife = 400 + Math.random() * 600;
      return {
        x: init ? Math.random() * width : Math.random() * width,
        y: init ? Math.random() * height : -20 + Math.random() * (height + 40),
        z: depth,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2 - 0.1,
        vz: (Math.random() - 0.5) * 0.002,
        size: 0,
        baseSize: 1.5 + Math.random() * 5,
        alpha: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: init ? Math.random() * maxLife : 0,
        maxLife,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.03,
        type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        trail: [],
      };
    },
    [COLORS, SHAPE_TYPES]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const count = Math.min(Math.floor((width * height) / 4500), 180);
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(width, height, true)
    );

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true,
        };
      }
    };
    const onTouchEnd = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);

    // Animation loop
    const animate = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update life
        p.life += 1;
        if (p.life > p.maxLife) {
          particles[i] = createParticle(width, height, false);
          continue;
        }

        // Pulse
        p.pulse += p.pulseSpeed;
        p.rotation += p.rotationSpeed;

        // Mouse interaction — 3D repulsion with attraction zone
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;
          if (dist < maxDist) {
            if (dist < 80) {
              // Close range — repulsion
              const force = (1 - dist / 80) * 1.2;
              p.vx += (dx / dist) * force * 0.25;
              p.vy += (dy / dist) * force * 0.25;
            } else {
              // Medium range — gentle attraction + orbit
              const force = ((dist - 80) / 100) * 0.05;
              p.vx += (-dy / dist) * force * 0.3;
              p.vy += (dx / dist) * force * 0.3;
            }
          }
        }

        // 3D drift with organic noise
        const noiseX =
          Math.sin(timeRef.current * 0.001 + p.pulse) * 0.15 +
          Math.sin(timeRef.current * 0.0007 + p.pulse * 1.3) * 0.08;
        const noiseY =
          Math.cos(timeRef.current * 0.0008 + p.pulse) * 0.1 +
          Math.cos(timeRef.current * 0.0005 + p.pulse * 0.7) * 0.06;

        p.x += p.vx + noiseX;
        p.y += p.vy + noiseY;
        p.z += p.vz;

        // Update trail
        if (p.type !== "circle" && p.alpha > 0.05) {
          p.trail.push({ x: p.x, y: p.y, alpha: p.alpha * 0.3 });
          if (p.trail.length > 6) p.trail.shift();
        } else if (p.trail.length > 0) {
          p.trail.shift();
        }

        // Damping
        p.vx *= 0.993;
        p.vy *= 0.993;

        // Wrap around
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        if (p.y > height + 30) p.y = -30;

        // Clamp z
        if (p.z < 0) p.z = 0;
        if (p.z > 1) p.z = 1;

        // Calculate display properties based on depth (z)
        const depthScale = 0.3 + p.z * 0.7;
        const pulseFactor = 1 + Math.sin(p.pulse) * 0.25;
        p.size = p.baseSize * depthScale * pulseFactor;

        // Life-based alpha fade in/out
        const lifeRatio = p.life / p.maxLife;
        let lifeAlpha = 1;
        if (lifeRatio < 0.1) lifeAlpha = lifeRatio / 0.1;
        else if (lifeRatio > 0.85) lifeAlpha = (1 - lifeRatio) / 0.15;

        p.alpha = lifeAlpha * depthScale * (0.3 + Math.sin(p.pulse) * 0.15);

        // Draw trail
        for (let t = 0; t < p.trail.length; t++) {
          const trail = p.trail[t];
          const trailAlpha = trail.alpha * (t / p.trail.length) * 0.3;
          if (trailAlpha > 0.005) {
            ctx.save();
            ctx.globalAlpha = trailAlpha;
            ctx.fillStyle = `${p.color} 1)`;
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, p.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Draw particle
        if (p.alpha > 0.01 && p.size > 0.3) {
          // Glow layer (bigger, softer)
          if (p.size > 1.5) {
            const gradient = ctx.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              p.size * 5
            );
            gradient.addColorStop(0, `${p.color} ${0.25 * p.alpha})`);
            gradient.addColorStop(0.5, `${p.color} ${0.08 * p.alpha})`);
            gradient.addColorStop(1, `${p.color} 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Draw shape based on type
          const colorSolid = `${p.color} ${Math.min(p.alpha * 2, 1)})`;
          const colorFill = `${p.color} ${Math.min(p.alpha * 0.3, 0.3)})`;

          switch (p.type) {
            case "cube":
              drawCube(ctx, p.x, p.y, p.size, p.rotation, p.alpha, colorSolid);
              // Add subtle fill
              ctx.save();
              ctx.globalAlpha = p.alpha * 0.1;
              ctx.fillStyle = colorFill;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              break;
            case "hex":
              drawHex(
                ctx,
                p.x,
                p.y,
                p.size * 1.2,
                p.rotation,
                p.alpha,
                colorSolid
              );
              break;
            case "diamond":
              drawDiamond(
                ctx,
                p.x,
                p.y,
                p.size * 1.1,
                p.rotation,
                p.alpha,
                colorSolid
              );
              break;
            case "ring":
              drawRing(
                ctx,
                p.x,
                p.y,
                p.size * 1.3,
                p.rotation,
                p.alpha,
                colorSolid,
                colorFill
              );
              break;
            default:
              // Circle particle (core)
              ctx.save();
              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = colorSolid;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              break;
          }
        }
      }

      // Draw connections between nearby particles (constellation effect)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140 && a.z > 0.35 && b.z > 0.35) {
            const lineAlpha =
              (1 - dist / 140) * 0.15 * a.alpha * b.alpha * 25;
            if (lineAlpha > 0.003) {
              ctx.save();
              ctx.globalAlpha = lineAlpha;
              ctx.strokeStyle = "rgba(198, 165, 107, 1)";
              ctx.lineWidth = 0.4 + (1 - dist / 140) * 0.4;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-auto"
      style={{ touchAction: "none" }}
    />
  );
}

/* ─── Section Particle Canvas (Lighter) ─────────── */

export function SectionParticleCanvas({ dark = false }: { dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  const COLORS = dark
    ? [
        "rgba(198, 165, 107,",
        "rgba(212, 186, 138,",
        "rgba(75, 99, 85,",
        "rgba(198, 165, 107,",
      ]
    : [
        "rgba(39, 51, 44,",
        "rgba(75, 99, 85,",
        "rgba(198, 165, 107,",
        "rgba(39, 51, 44,",
      ];

  const SHAPE_TYPES: Particle["type"][] = [
    "circle",
    "circle",
    "cube",
    "hex",
    "diamond",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    // Fewer particles for sections but more geometric shapes
    const count = Math.min(Math.floor((width * height) / 16000), 60);

    const createSectionParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      vz: 0,
      size: 0,
      baseSize: 0.8 + Math.random() * 3,
      alpha: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: Math.random() * 600,
      maxLife: 500 + Math.random() * 500,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.02,
      type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      trail: [],
    });

    particlesRef.current = Array.from({ length: count }, createSectionParticle);

    const animate = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 1;

        if (p.life > p.maxLife) {
          particles[i] = createSectionParticle();
          continue;
        }

        p.pulse += p.pulseSpeed;
        p.rotation += p.rotationSpeed;
        p.x += p.vx + Math.sin(timeRef.current * 0.0005 + p.pulse) * 0.08;
        p.y += p.vy + Math.cos(timeRef.current * 0.0003 + p.pulse) * 0.06;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const depthScale = 0.4 + p.z * 0.6;
        const pulseFactor = 1 + Math.sin(p.pulse) * 0.2;
        p.size = p.baseSize * depthScale * pulseFactor;

        const lifeRatio = p.life / p.maxLife;
        let lifeAlpha = 1;
        if (lifeRatio < 0.15) lifeAlpha = lifeRatio / 0.15;
        else if (lifeRatio > 0.8) lifeAlpha = (1 - lifeRatio) / 0.2;

        p.alpha = lifeAlpha * depthScale * 0.25;

        if (p.alpha > 0.01 && p.size > 0.2) {
          // Soft glow
          if (p.size > 1) {
            const gradient = ctx.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              p.size * 5
            );
            gradient.addColorStop(0, `${p.color} ${0.15 * p.alpha})`);
            gradient.addColorStop(1, `${p.color} 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
            ctx.fill();
          }

          const colorSolid = `${p.color} ${Math.min(p.alpha * 1.5, 0.8)})`;

          switch (p.type) {
            case "cube":
              drawCube(
                ctx,
                p.x,
                p.y,
                p.size,
                p.rotation,
                p.alpha * 0.8,
                colorSolid
              );
              break;
            case "hex":
              drawHex(
                ctx,
                p.x,
                p.y,
                p.size * 1.2,
                p.rotation,
                p.alpha * 0.8,
                colorSolid
              );
              break;
            case "diamond":
              drawDiamond(
                ctx,
                p.x,
                p.y,
                p.size,
                p.rotation,
                p.alpha * 0.8,
                colorSolid
              );
              break;
            default:
              ctx.save();
              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = colorSolid;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              break;
          }
        }
      }

      // Subtle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100 && a.z > 0.4 && b.z > 0.4) {
            const lineAlpha =
              (1 - dist / 100) * 0.08 * a.alpha * b.alpha * 20;
            if (lineAlpha > 0.003) {
              ctx.save();
              ctx.globalAlpha = lineAlpha;
              const lineColor = dark
                ? "rgba(198, 165, 107, 1)"
                : "rgba(75, 99, 85, 1)";
              ctx.strokeStyle = lineColor;
              ctx.lineWidth = 0.3;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [COLORS, dark, SHAPE_TYPES]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
    />
  );
}

/* ─── Floating Orbs (Large Blurred Shapes) ───────── */

export function FloatingOrbs() {
  return (
    <div className="absolute inset-0 z-[0] overflow-hidden pointer-events-none">
      {/* Large gold orb - top right */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.04] animate-float"
        style={{
          background:
            "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
          animationDelay: "0s",
        }}
      />
      {/* Sage orb - bottom left */}
      <div
        className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full opacity-[0.05] animate-float"
        style={{
          background:
            "radial-gradient(circle, var(--sage) 0%, transparent 70%)",
          animationDelay: "2s",
          animationDuration: "6s",
        }}
      />
      {/* Gold accent orb - center */}
      <div
        className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-[0.03] animate-float"
        style={{
          background:
            "radial-gradient(circle, var(--gold-light) 0%, transparent 70%)",
          animationDelay: "4s",
          animationDuration: "8s",
        }}
      />
      {/* New: Dark sage ambient orb */}
      <div
        className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full opacity-[0.03] animate-float"
        style={{
          background:
            "radial-gradient(circle, var(--dark-sage) 0%, transparent 60%)",
          animationDelay: "1s",
          animationDuration: "7s",
        }}
      />
    </div>
  );
}

/* ─── Magnetic Cursor Effect ─────────────────────── */

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);

  useEffect(() => {
    // Only show on desktop with pointer
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    // Grow cursor on interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        scaleRef.current = 2;
        cursor.style.borderColor = "rgba(198, 165, 107, 0.6)";
        cursor.style.backgroundColor = "rgba(198, 165, 107, 0.08)";
      }
    };

    const onMouseOut = () => {
      scaleRef.current = 1;
      cursor.style.borderColor = "rgba(198, 165, 107, 0.3)";
      cursor.style.backgroundColor = "transparent";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    let frame: number;
    const animate = () => {
      const pos = posRef.current;
      const target = targetRef.current;

      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;

      const s = scaleRef.current;
      const size = 40 * s;
      cursor.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px) scale(${s})`;
      cursor.style.width = `${40}px`;
      cursor.style.height = `${40}px`;
      dot.style.transform = `translate(${target.x - 4}px, ${target.y - 4}px)`;

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] rounded-full border border-[var(--gold)]/30 pointer-events-none hidden lg:block mix-blend-difference"
        style={{
          transition: "border-color 0.3s, background-color 0.3s, width 0.3s, height 0.3s",
          willChange: "transform",
        }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-[var(--gold)]/60 pointer-events-none hidden lg:block"
      />
    </>
  );
}

/* ─── Geometric Wireframe ───────────────────────── */

export function GeometricWireframe({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Define vertices of a rotating icosahedron-like shape
    const vertices: number[][] = [];
    const edges: [number, number][] = [];

    // Generate a dodecahedron
    const phi = (1 + Math.sqrt(5)) / 2;
    const cubeVerts = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];
    const rectVerts = [
      [0, -1 / phi, -phi],
      [0, 1 / phi, -phi],
      [0, -1 / phi, phi],
      [0, 1 / phi, phi],
      [-1 / phi, -phi, 0],
      [1 / phi, -phi, 0],
      [-1 / phi, phi, 0],
      [1 / phi, phi, 0],
      [-phi, 0, -1 / phi],
      [phi, 0, -1 / phi],
      [-phi, 0, 1 / phi],
      [phi, 0, 1 / phi],
    ];

    const allVerts = [...cubeVerts, ...rectVerts];
    for (const v of allVerts) {
      const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      vertices.push([v[0] / len, v[1] / len, v[2] / len]);
    }

    // Connect nearby vertices
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i][0] - vertices[j][0];
        const dy = vertices[i][1] - vertices[j][1];
        const dz = vertices[i][2] - vertices[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 0.65) {
          edges.push([i, j]);
        }
      }
    }

    const project3D = (
      x: number,
      y: number,
      z: number,
      cx: number,
      cy: number,
      scale: number
    ) => {
      const fov = 3;
      const depth = fov / (fov + z);
      return { x: cx + x * scale * depth, y: cy + y * scale * depth, depth };
    };

    const rotateY = (v: number[], angle: number) => [
      v[0] * Math.cos(angle) + v[2] * Math.sin(angle),
      v[1],
      -v[0] * Math.sin(angle) + v[2] * Math.cos(angle),
    ];

    const rotateX = (v: number[], angle: number) => [
      v[0],
      v[1] * Math.cos(angle) - v[2] * Math.sin(angle),
      v[1] * Math.sin(angle) + v[2] * Math.cos(angle),
    ];

    const animate = () => {
      timeRef.current += 0.004;
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.85;
      const cy = height * 0.35;
      const scale = Math.min(width, height) * 0.12;

      const rotatedVerts = vertices.map((v) => {
        let rv = rotateY(v, timeRef.current);
        rv = rotateX(rv, timeRef.current * 0.7);
        return rv;
      });

      const projected = rotatedVerts.map((v) =>
        project3D(v[0], v[1], v[2], cx, cy, scale)
      );

      // Draw edges
      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        const avgDepth = (pa.depth + pb.depth) / 2;
        const alpha = 0.06 + avgDepth * 0.04;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "rgba(198, 165, 107, 1)";
        ctx.lineWidth = 0.5 + avgDepth * 0.3;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
        ctx.restore();
      }

      // Draw vertices
      for (const p of projected) {
        const dotSize = 1 + p.depth * 1;
        ctx.save();
        ctx.globalAlpha = 0.15 + p.depth * 0.1;
        ctx.fillStyle = "rgba(198, 165, 107, 1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-[2] pointer-events-none ${className}`}
    />
  );
}

/* ─── Noise Grain Overlay ───────────────────────── */

export function NoiseGrainOverlay() {
  return (
    <div
      className="absolute inset-0 z-[3] pointer-events-none opacity-[0.025] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

/* ─── Particle Trail (Mouse Follow) ─────────────── */

export function ParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const trailRef = useRef<
    { x: number; y: number; alpha: number; size: number; color: string }[]
  >([]);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "rgba(198, 165, 107,",
      "rgba(212, 186, 138,",
      "rgba(245, 244, 238,",
    ];

    const onMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.4) return; // Throttle
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 0.6 + Math.random() * 0.3,
        size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
      if (trailRef.current.length > 25) trailRef.current.shift();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const trail = trailRef.current;

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.alpha -= 0.015;
        p.size *= 0.97;

        if (p.alpha <= 0 || p.size < 0.2) {
          trail.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 4
        );
        gradient.addColorStop(0, `${p.color} 0.4)`);
        gradient.addColorStop(1, `${p.color} 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none hidden lg:block"
    />
  );
}

/* ─── Grid Lines Background ─────────────────────── */

export function GridLines() {
  return (
    <div
      className="absolute inset-0 z-[0] pointer-events-none opacity-[0.015]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(198, 165, 107, 1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(198, 165, 107, 1) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
  );
}
