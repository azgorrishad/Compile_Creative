"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Brief, premium-feeling pause before entering the workspace.
    window.setTimeout(() => router.push("/portal"), 350);
  };

  const goToPortal = () => router.push("/portal");

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, #27332C 0%, #1E2A23 55%, #151F19 100%)",
      }}
    >
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, #C6A56B 0%, transparent 70%)" }}
      />

      <main className="relative flex flex-1 items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div
            className="rounded-2xl p-8 sm:p-10"
            style={{
              background: "rgba(245, 244, 238, 0.035)",
              border: "1px solid rgba(198, 165, 107, 0.18)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow:
                "0 30px 60px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,244,238,0.04)",
            }}
          >
            {/* Brand mark + wordmark */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              >
                <Image
                  src="/logo.svg"
                  width={44}
                  height={44}
                  alt="Compile Creative logo"
                  priority
                />
              </motion.div>
              <div
                className="font-label mt-3 text-[11px] uppercase"
                style={{ letterSpacing: "0.32em", color: "rgba(245,244,238,0.7)" }}
              >
                Compile Creative
              </div>

              <div
                className="font-label mt-9 text-[10px] uppercase"
                style={{ letterSpacing: "0.34em", color: "#C6A56B" }}
              >
                Client Portal
              </div>
              <h1
                className="font-display mt-3 text-[2.5rem] leading-[1.1]"
                style={{ color: "#F5F4EE", fontWeight: 400 }}
              >
                Welcome back.
              </h1>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "rgba(245,244,238,0.58)" }}
              >
                Sign in to access your project workspace.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-label text-[10px] uppercase"
                  style={{ letterSpacing: "0.22em", color: "rgba(245,244,238,0.65)" }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aria@ariamilano.com"
                  className="h-12 rounded-lg bg-white/[0.04] px-4 text-sm text-[#F5F4EE] placeholder:text-[rgba(245,244,238,0.32)]"
                  style={{
                    borderColor: "rgba(245,244,238,0.12)",
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-label text-[10px] uppercase"
                  style={{ letterSpacing: "0.22em", color: "rgba(245,244,238,0.65)" }}
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-lg bg-white/[0.04] px-4 text-sm text-[#F5F4EE] placeholder:text-[rgba(245,244,238,0.32)]"
                  style={{
                    borderColor: "rgba(245,244,238,0.12)",
                  }}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="btn-gold mt-2 h-[52px] w-full rounded-lg font-label text-[11px] uppercase tracking-[0.28em] disabled:opacity-80"
                style={{
                  background: "#C6A56B",
                  color: "#1E2A23",
                  border: "none",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Demo access */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={goToPortal}
                className="font-label gold-underline text-[10px] uppercase tracking-[0.26em] transition-colors hover:text-[#D4BA8A]"
                style={{ color: "#D4BA8A" }}
              >
                Use demo access
              </button>
              <p
                className="mt-2 text-[11px]"
                style={{ color: "rgba(245,244,238,0.4)" }}
              >
                Demo access — no real credentials required.
              </p>
            </div>

            {/* Back to site */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 text-xs transition-colors hover:text-[#F5F4EE]"
                style={{ color: "rgba(245,244,238,0.55)" }}
              >
                <ArrowLeft className="size-3" />
                Back to compilecreative.com
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Slim footer */}
      <footer
        className="mt-auto flex items-center justify-center gap-2 px-5 py-6"
        style={{ color: "rgba(245,244,238,0.4)" }}
      >
        <Image
          src="/logo.svg"
          width={14}
          height={14}
          alt="Compile Creative logo mark"
        />
        <span className="text-[11px] tracking-wide">© Compile Creative</span>
      </footer>
    </div>
  );
}
