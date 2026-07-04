"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeamLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Demo flow — no real auth. Brief delay for UX feedback.
    setTimeout(() => {
      router.push("/team");
    }, 350);
  }

  function handleDemoAccess() {
    router.push("/team");
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "#1E2A23", color: "#F5F4EE" }}
    >
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-8 flex flex-col items-center text-center"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Compile Creative logo"
                width={36}
                height={36}
                priority
              />
              <span
                className="font-label text-sm font-semibold uppercase tracking-[0.25em]"
                style={{ color: "#F5F4EE" }}
              >
                Compile Creative
              </span>
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-xl border p-7 sm:p-8"
            style={{
              backgroundColor: "rgba(245, 244, 238, 0.03)",
              borderColor: "rgba(198, 165, 107, 0.18)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p
              className="font-label text-[11px] font-medium uppercase tracking-[0.3em]"
              style={{ color: "#C6A56B" }}
            >
              Team Workspace
            </p>
            <h1
              className="mt-3 text-3xl sm:text-4xl"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              Internal access.
            </h1>
            <p
              className="mt-2 text-sm"
              style={{ color: "rgba(245, 244, 238, 0.65)" }}
            >
              Compile Creative team sign-in.
            </p>

            <form onSubmit={handleSignIn} className="mt-7 space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-label text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245, 244, 238, 0.75)" }}
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
                    style={{ color: "rgba(245, 244, 238, 0.4)" }}
                    aria-hidden
                  />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@compilecreative.com"
                    className="h-11 pl-9"
                    style={{
                      backgroundColor: "rgba(245, 244, 238, 0.04)",
                      borderColor: "rgba(198, 165, 107, 0.22)",
                      color: "#F5F4EE",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-label text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245, 244, 238, 0.75)" }}
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
                    style={{ color: "rgba(245, 244, 238, 0.4)" }}
                    aria-hidden
                  />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pl-9"
                    style={{
                      backgroundColor: "rgba(245, 244, 238, 0.04)",
                      borderColor: "rgba(198, 165, 107, 0.22)",
                      color: "#F5F4EE",
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="btn-gold h-11 w-full rounded-md text-sm font-medium"
                style={{
                  backgroundColor: "#27332C",
                  color: "#F5F4EE",
                  border: "1px solid rgba(198, 165, 107, 0.35)",
                }}
              >
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <div className="mt-5 flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={handleDemoAccess}
                className="font-label text-[11px] uppercase tracking-[0.2em] underline-offset-4 transition-colors hover:underline"
                style={{ color: "#C6A56B" }}
              >
                Use demo access
              </button>
              <p
                className="text-[11px]"
                style={{ color: "rgba(245, 244, 238, 0.45)" }}
              >
                Demo access — internal use only.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-center"
          >
            <a
              href="/"
              className="font-label inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors"
              style={{ color: "rgba(245, 244, 238, 0.6)" }}
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              Back to site
            </a>
          </motion.div>
        </motion.div>
      </main>

      <footer
        className="mt-auto border-t px-5 py-5"
        style={{ borderColor: "rgba(198, 165, 107, 0.12)" }}
      >
        <div className="mx-auto flex max-w-md items-center justify-center gap-2 text-center">
          <Image
            src="/logo.svg"
            alt="Compile Creative mark"
            width={16}
            height={16}
          />
          <span
            className="text-[11px]"
            style={{ color: "rgba(245, 244, 238, 0.45)" }}
          >
            © {new Date().getFullYear()} Compile Creative
          </span>
        </div>
      </footer>
    </div>
  );
}
