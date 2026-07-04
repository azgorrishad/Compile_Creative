"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Download,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { C } from "@/components/design/Tokens";
import { NoiseGrainOverlay } from "@/components/ParticleCanvas";
import { CursorGlowBlob } from "@/components/MotionGraphics";
import { GeometricGrid } from "@/components/CursorTrail";

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

type StageStatus = "complete" | "current" | "upcoming";

const STAGES: { number: string; name: string; status: StageStatus }[] = [
  { number: "01", name: "Observe", status: "complete" },
  { number: "02", name: "Position", status: "complete" },
  { number: "03", name: "Design", status: "current" },
  { number: "04", name: "Deploy", status: "upcoming" },
  { number: "05", name: "Refine", status: "upcoming" },
];

const CURRENT_STAGE_INDEX = STAGES.findIndex((s) => s.status === "current");
const PROGRESS_VALUE = 60;

type DeliverableStatus = "Approved" | "In Review" | "Pending";

const DELIVERABLES: {
  name: string;
  type: string;
  status: DeliverableStatus;
  date: string;
}[] = [
  {
    name: "Brand Strategy Document",
    type: "PDF",
    status: "Approved",
    date: "Feb 24, 2025",
  },
  {
    name: "Logo System v2",
    type: "AI",
    status: "In Review",
    date: "Mar 04, 2025",
  },
  {
    name: "Visual Identity Guidelines",
    type: "PDF",
    status: "Pending",
    date: "—",
  },
  {
    name: "Packaging Mockups",
    type: "PNG",
    status: "In Review",
    date: "Mar 09, 2025",
  },
  {
    name: "Communication Framework",
    type: "PDF",
    status: "Approved",
    date: "Feb 18, 2025",
  },
];

type Message = {
  id: string;
  from: "team" | "client";
  name: string;
  initials: string;
  time: string;
  text: string;
};

const SEED_MESSAGES: Message[] = [
  {
    id: "m1",
    from: "team",
    name: "Rishad — Compile Creative",
    initials: "SR",
    time: "Mar 11, 9:42 AM",
    text: "Welcome to your workspace, Aria. We've just uploaded the refined brand strategy document — the positioning work sits particularly well for the eau de parfum tier.",
  },
  {
    id: "m2",
    from: "client",
    name: "Aria Milano",
    initials: "AM",
    time: "Mar 11, 11:08 AM",
    text: "Thank you, Rishad. I'll review it this afternoon. The restraint in the narrative feels right for the house.",
  },
  {
    id: "m3",
    from: "team",
    name: "Rishad — Compile Creative",
    initials: "SR",
    time: "Mar 12, 10:15 AM",
    text: "Glad to hear it. Once you've signed off, we'll move into the visual identity phase and share three mood directions by Thursday.",
  },
  {
    id: "m4",
    from: "client",
    name: "Aria Milano",
    initials: "AM",
    time: "Mar 12, 2:31 PM",
    text: "Looking forward to it. Could we also schedule a brief call to walk through the packaging direction before the handoff?",
  },
  {
    id: "m5",
    from: "team",
    name: "Rishad — Compile Creative",
    initials: "SR",
    time: "Mar 13, 8:50 AM",
    text: "Of course. I'll send two time options for later this week. The design system handoff is on track for March 18.",
  },
];

const PROJECTS = [
  { id: "aria", name: "Aria Milano — Brand System", active: true },
  { id: "maison", name: "Maison Lior — Packaging Refresh", active: false },
  { id: "atelier", name: "Atelier Noé — Identity Sprint", active: false },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const;

function statusBadgeClass(status: DeliverableStatus) {
  switch (status) {
    case "Approved":
      return "border-transparent bg-[rgba(39,51,44,0.08)] text-[#27332C]";
    case "In Review":
      return "border-transparent bg-[rgba(198,165,107,0.18)] text-[#8a6f3c]";
    case "Pending":
      return "border-transparent bg-[rgba(75,99,85,0.10)] text-[rgba(39,51,44,0.5)]";
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortalPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [draft, setDraft] = useState("");
  const [activeProject, setActiveProject] = useState(PROJECTS[0].name);

  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = threadRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const next: Message = {
      id: `m${Date.now()}`,
      from: "client",
      name: "Aria Milano",
      initials: "AM",
      time: "Just now",
      text,
    };
    setMessages((prev) => [...prev, next]);
    setDraft("");
  };

  const handleDownload = (name: string) => {
    toast.success("Download started (demo)", {
      description: name,
    });
  };

  return (
    <div
      className="flex min-h-screen flex-col relative overflow-hidden"
      style={{ background: C.base, color: C.forest }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <GeometricGrid />
      </div>
      <div className="pointer-events-none absolute inset-0 z-50">
        <NoiseGrainOverlay />
      </div>
      <CursorGlowBlob />
      
      <SonnerToaster position="bottom-right" richColors={false} />

      {/* ─── Top bar ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 w-full"
        style={{
          background: "rgba(245, 244, 238, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(75, 99, 85, 0.14)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 md:px-8">
          {/* Left: logo + label */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              width={30}
              height={30}
              alt="Compile Creative logo"
            />
            <div className="hidden sm:block">
              <div
                className="font-label text-[10px] uppercase"
                style={{ letterSpacing: "0.28em", color: "#C6A56B" }}
              >
                Client Portal
              </div>
              <div
                className="font-label text-[9px] uppercase"
                style={{ letterSpacing: "0.2em", color: "rgba(39,51,44,0.45)" }}
              >
                Compile Creative
              </div>
            </div>
          </div>

          {/* Right: switcher + user + back */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Project switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-10 items-center gap-2 rounded-lg px-3 text-left transition-colors hover:bg-[rgba(39,51,44,0.04)]"
                  style={{
                    border: "1px solid rgba(75,99,85,0.18)",
                  }}
                  aria-label="Switch project"
                >
                  <span
                    className="hidden h-2 w-2 shrink-0 rounded-full sm:block"
                    style={{ background: "#C6A56B" }}
                  />
                  <span className="flex min-w-0 flex-col">
                    <span
                      className="font-label text-[8px] uppercase leading-none tracking-[0.2em]"
                      style={{ color: "rgba(39,51,44,0.45)" }}
                    >
                      Active Project
                    </span>
                    <span className="mt-0.5 truncate text-[13px] font-medium leading-none text-[#27332C] max-w-[140px] sm:max-w-[220px]">
                      {activeProject}
                    </span>
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-[rgba(39,51,44,0.4)]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[280px] rounded-lg border-[rgba(75,99,85,0.18)] bg-[#F5F4EE] text-[#27332C] shadow-lg"
              >
                <DropdownMenuLabel className="font-label text-[9px] uppercase tracking-[0.22em] text-[rgba(39,51,44,0.5)]">
                  Your Projects
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[rgba(75,99,85,0.14)]" />
                {PROJECTS.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onSelect={() => setActiveProject(p.name)}
                    className="gap-2 rounded-md py-2 text-[13px] focus:bg-[rgba(198,165,107,0.12)] focus:text-[#27332C]"
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        p.active ? "bg-[#C6A56B]" : "bg-[rgba(75,99,85,0.3)]"
                      )}
                    />
                    <span className="truncate">{p.name}</span>
                    {p.active && (
                      <Check className="ml-auto size-3.5 text-[#C6A56B]" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <div className="text-[13px] font-medium leading-none text-[#27332C]">
                  Aria Milano
                </div>
                <div
                  className="font-label mt-1 text-[9px] uppercase leading-none tracking-[0.22em]"
                  style={{ color: "rgba(39,51,44,0.45)" }}
                >
                  Client
                </div>
              </div>
              <Avatar className="size-9 border border-[rgba(75,99,85,0.2)]">
                <AvatarFallback
                  className="font-label rounded-full text-[11px] tracking-wide"
                  style={{ background: "#27332C", color: "#F5F4EE" }}
                >
                  AM
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Back to site */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="hidden h-10 items-center gap-2 rounded-lg px-3 text-xs transition-colors hover:bg-[rgba(39,51,44,0.04)] md:flex"
              style={{ color: "rgba(39,51,44,0.6)" }}
            >
              <ArrowLeft className="size-3.5" />
              Back to site
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main ────────────────────────────────────────────────── */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 md:space-y-8 md:px-8 md:py-12">
          {/* ── Panel 1: Active Project ─────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="rounded-2xl p-6 md:p-8 relative z-10 border shadow-2xl"
            style={{
              background: C.surface,
              borderColor: "rgba(75,99,85,0.08)",
            }}
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div
                  className="font-label text-[10px] uppercase"
                  style={{ letterSpacing: "0.3em", color: C.gold }}
                >
                  Active Project
                </div>
                <h1
                  className="font-display mt-2 text-3xl leading-tight md:text-[2.5rem]"
                  style={{ color: "#27332C", fontWeight: 400 }}
                >
                  Aria Milano — Brand System
                </h1>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "rgba(39,51,44,0.6)" }}
                >
                  A complete brand system for a Milan-based fragrance house —
                  positioning, visual identity, packaging art direction, and a
                  communication framework for the launch collection.
                </p>
              </div>

              {/* Next milestone card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
                className="w-full shrink-0 rounded-xl p-4 md:w-[280px]"
                style={{
                  background: "rgba(198,165,107,0.08)",
                  border: "1px solid rgba(198,165,107,0.25)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-[#C6A56B]" />
                  <span
                    className="font-label text-[9px] uppercase tracking-[0.24em]"
                    style={{ color: "#8a6f3c" }}
                  >
                    Next Milestone
                  </span>
                </div>
                <div
                  className="font-display mt-2 text-xl"
                  style={{ color: "#27332C", fontWeight: 500 }}
                >
                  Design system handoff
                </div>
                <div
                  className="mt-1 text-[13px] font-medium"
                  style={{ color: "#8a6f3c" }}
                >
                  Mar 18, 2025
                </div>
                <p
                  className="mt-2 text-xs leading-relaxed"
                  style={{ color: "rgba(39,51,44,0.55)" }}
                >
                  Full token set, type scale, and component library delivered
                  to your product team.
                </p>
              </motion.div>
            </div>

            {/* Stage stepper */}
            <div className="mt-8">
              {/* Desktop horizontal */}
              <div className="relative hidden md:block">
                <div
                  className="absolute left-0 right-0 top-[18px] h-px"
                  style={{ background: "rgba(75,99,85,0.18)" }}
                />
                <div
                  className="absolute left-0 top-[18px] h-px"
                  style={{
                    width: `${(CURRENT_STAGE_INDEX / (STAGES.length - 1)) * 100}%`,
                    background: "#C6A56B",
                  }}
                />
                <div className="relative flex justify-between">
                  {STAGES.map((stage, i) => (
                    <motion.div
                      key={stage.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: EASE,
                        delay: 0.2 + i * 0.08,
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full font-label text-[11px]",
                          stage.status === "complete" &&
                            "text-[#1E2A23]",
                          stage.status === "current" &&
                            "bg-white text-[#C6A56B] animate-pulse-glow",
                          stage.status === "upcoming" &&
                            "bg-white text-[rgba(39,51,44,0.4)]"
                        )}
                        style={{
                          background:
                            stage.status === "complete" ? "#C6A56B" : "#FFFFFF",
                          border:
                            stage.status === "current"
                              ? "2px solid #C6A56B"
                              : stage.status === "upcoming"
                              ? "1px solid rgba(75,99,85,0.22)"
                              : "1px solid #C6A56B",
                        }}
                      >
                        {stage.status === "complete" ? (
                          <Check className="size-4" />
                        ) : (
                          stage.number
                        )}
                      </div>
                      <span
                        className="font-label text-[10px] uppercase tracking-[0.18em]"
                        style={{
                          color:
                            stage.status === "upcoming"
                              ? "rgba(39,51,44,0.45)"
                              : "#27332C",
                        }}
                      >
                        {stage.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile vertical */}
              <ol className="relative space-y-4 pl-1 md:hidden">
                <div
                  className="absolute bottom-3 left-[18px] top-3 w-px"
                  style={{ background: "rgba(75,99,85,0.18)" }}
                />
                <div
                  className="absolute left-[18px] top-3 w-px"
                  style={{
                    height: `${(CURRENT_STAGE_INDEX / (STAGES.length - 1)) * 100}%`,
                    background: "#C6A56B",
                  }}
                />
                {STAGES.map((stage) => (
                  <li
                    key={stage.name}
                    className="relative flex items-center gap-3"
                  >
                    <div
                      className={cn(
                        "z-10 flex size-9 shrink-0 items-center justify-center rounded-full font-label text-[11px]",
                        stage.status === "complete" && "text-[#1E2A23]",
                        stage.status === "current" &&
                          "bg-white text-[#C6A56B]",
                        stage.status === "upcoming" &&
                          "bg-white text-[rgba(39,51,44,0.4)]"
                      )}
                      style={{
                        background:
                          stage.status === "complete" ? "#C6A56B" : "#FFFFFF",
                        border:
                          stage.status === "current"
                            ? "2px solid #C6A56B"
                            : stage.status === "upcoming"
                            ? "1px solid rgba(75,99,85,0.22)"
                            : "1px solid #C6A56B",
                      }}
                    >
                      {stage.status === "complete" ? (
                        <Check className="size-4" />
                      ) : (
                        stage.number
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="font-label text-[11px] uppercase tracking-[0.18em]"
                        style={{
                          color:
                            stage.status === "upcoming"
                              ? "rgba(39,51,44,0.45)"
                              : "#27332C",
                        }}
                      >
                        {stage.name}
                      </span>
                      <span
                        className="text-[11px]"
                        style={{
                          color:
                            stage.status === "current"
                              ? "#8a6f3c"
                              : "rgba(39,51,44,0.4)",
                        }}
                      >
                        {stage.status === "complete"
                          ? "Completed"
                          : stage.status === "current"
                          ? "In progress"
                          : "Upcoming"}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Progress */}
              <div className="mt-8 flex items-center gap-4">
                <Progress
                  value={PROGRESS_VALUE}
                  className="h-1.5 bg-[rgba(75,99,85,0.14)]"
                />
                <span
                  className="font-label shrink-0 text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: "#27332C" }}
                >
                  {PROGRESS_VALUE}% complete
                </span>
              </div>
            </div>
          </motion.section>

          {/* ── Panels 2 + 3 grid ───────────────────────────────── */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">
            {/* ── Panel 2: Deliverables ──────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="md:col-span-3 rounded-2xl p-6 md:p-8 relative z-10 border shadow-2xl"
              style={{
                background: C.surface,
                borderColor: "rgba(75,99,85,0.08)",
              }}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div
                    className="font-label text-[10px] uppercase"
                    style={{ letterSpacing: "0.3em", color: C.gold }}
                  >
                    Deliverables
                  </div>
                  <h2
                    className="font-display mt-1 text-2xl"
                    style={{ color: "#27332C", fontWeight: 400 }}
                  >
                    Project Files
                  </h2>
                </div>
                <Badge
                  className="border-transparent bg-[rgba(39,51,44,0.06)] text-[rgba(39,51,44,0.6)]"
                >
                  {DELIVERABLES.length} files
                </Badge>
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow
                      className="border-[rgba(75,99,85,0.14)]"
                      style={{ background: "transparent" }}
                    >
                      <TableHead
                        className="font-label text-[9px] uppercase tracking-[0.2em] text-[rgba(39,51,44,0.5)]"
                      >
                        File name
                      </TableHead>
                      <TableHead className="font-label text-[9px] uppercase tracking-[0.2em] text-[rgba(39,51,44,0.5)]">
                        Type
                      </TableHead>
                      <TableHead className="font-label text-[9px] uppercase tracking-[0.2em] text-[rgba(39,51,44,0.5)]">
                        Status
                      </TableHead>
                      <TableHead className="font-label text-right text-[9px] uppercase tracking-[0.2em] text-[rgba(39,51,44,0.5)]">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DELIVERABLES.map((d, i) => (
                      <motion.tr
                        key={d.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: EASE,
                          delay: 0.25 + i * 0.06,
                        }}
                        className="border-[rgba(75,99,85,0.1)] transition-colors hover:bg-[rgba(198,165,107,0.04)]"
                      >
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-3">
                            <span
                              className="flex size-8 items-center justify-center rounded-md text-[10px] font-medium"
                              style={{
                                background: "rgba(198,165,107,0.1)",
                                color: "#8a6f3c",
                              }}
                            >
                              {d.type}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-[13.5px] font-medium text-[#27332C]">
                                {d.name}
                              </span>
                              <span
                                className="text-[11px]"
                                style={{ color: "rgba(39,51,44,0.45)" }}
                              >
                                {d.date}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-[12px]"
                          style={{ color: "rgba(39,51,44,0.6)" }}
                        >
                          {d.type}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "text-[10px] font-medium uppercase tracking-[0.1em]",
                              statusBadgeClass(d.status)
                            )}
                          >
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {d.status === "Pending" ? (
                            <span
                              className="font-label text-[10px] uppercase tracking-[0.18em]"
                              style={{ color: "rgba(39,51,44,0.3)" }}
                            >
                              —
                            </span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(d.name)}
                              className="h-9 gap-1.5 rounded-md px-3 font-label text-[10px] uppercase tracking-[0.16em] text-[#27332C] hover:bg-[rgba(198,165,107,0.12)] hover:text-[#27332C]"
                            >
                              <Download className="size-3.5" />
                              Download
                            </Button>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: stacked cards */}
              <div className="space-y-3 md:hidden">
                {DELIVERABLES.map((d, i) => (
                  <motion.div
                    key={d.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: EASE,
                      delay: 0.25 + i * 0.06,
                    }}
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(245,244,238,0.6)",
                      border: "1px solid rgba(75,99,85,0.1)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="flex size-9 shrink-0 items-center justify-center rounded-md text-[10px] font-medium"
                          style={{
                            background: "rgba(198,165,107,0.1)",
                            color: "#8a6f3c",
                          }}
                        >
                          {d.type}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-[14px] font-medium text-[#27332C]">
                            {d.name}
                          </div>
                          <div
                            className="mt-0.5 text-[11px]"
                            style={{ color: "rgba(39,51,44,0.45)" }}
                          >
                            {d.type} · {d.date}
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "shrink-0 text-[9px] font-medium uppercase tracking-[0.1em]",
                          statusBadgeClass(d.status)
                        )}
                      >
                        {d.status}
                      </Badge>
                    </div>
                    {d.status !== "Pending" && (
                      <button
                        type="button"
                        onClick={() => handleDownload(d.name)}
                        className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg font-label text-[10px] uppercase tracking-[0.18em] transition-colors"
                        style={{
                          background: "rgba(198,165,107,0.12)",
                          color: "#27332C",
                        }}
                      >
                        <Download className="size-3.5" />
                        Download
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── Panel 3: Messages ─────────────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
              className="flex flex-col rounded-2xl p-6 md:col-span-2 md:p-8 relative z-10 border shadow-2xl"
              style={{
                background: C.surface,
                borderColor: "rgba(75,99,85,0.08)",
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div
                    className="font-label text-[10px] uppercase"
                    style={{ letterSpacing: "0.3em", color: C.gold }}
                  >
                    Messages
                  </div>
                  <h2
                    className="font-display mt-1 text-2xl"
                    style={{ color: "#27332C", fontWeight: 400 }}
                  >
                    Conversation
                  </h2>
                </div>
                <span
                  className="flex items-center gap-1.5 text-[11px]"
                  style={{ color: "rgba(39,51,44,0.5)" }}
                >
                  <Sparkles className="size-3 text-[#C6A56B]" />
                  Rishad
                </span>
              </div>

              {/* Thread */}
              <div
                ref={threadRef}
                className="flex-1 space-y-4 overflow-y-auto pr-1"
                style={{ maxHeight: "24rem" }}
              >
                {messages.map((m, i) => {
                  const isClient = m.from === "client";
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: EASE,
                        delay: 0.25 + i * 0.04,
                      }}
                      className={cn(
                        "flex w-full gap-2.5",
                        isClient ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <Avatar className="size-8 shrink-0 border border-[rgba(75,99,85,0.15)]">
                        <AvatarFallback
                          className="font-label rounded-full text-[10px] tracking-wide"
                          style={
                            isClient
                              ? { background: "#27332C", color: "#F5F4EE" }
                              : { background: "#C6A56B", color: "#1E2A23" }
                          }
                        >
                          {m.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "flex max-w-[80%] flex-col",
                          isClient ? "items-end" : "items-start"
                        )}
                      >
                        <div
                          className="mb-1 flex items-baseline gap-2"
                          style={{
                            flexDirection: isClient ? "row-reverse" : "row",
                          }}
                        >
                          <span
                            className="text-[11.5px] font-medium"
                            style={{ color: "#27332C" }}
                          >
                            {isClient ? "You" : m.name}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: "rgba(39,51,44,0.4)" }}
                          >
                            {m.time}
                          </span>
                        </div>
                        <div
                          className="rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed"
                          style={
                            isClient
                              ? {
                                  background: "#27332C",
                                  color: "#F5F4EE",
                                  borderBottomRightRadius: "6px",
                                }
                              : {
                                  background: "rgba(245,244,238,0.9)",
                                  color: "#27332C",
                                  border: "1px solid rgba(75,99,85,0.12)",
                                  borderBottomLeftRadius: "6px",
                                }
                          }
                        >
                          {m.text}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="mt-4 flex items-center gap-2"
              >
                <Label htmlFor="message" className="sr-only">
                  Write a message
                </Label>
                <Input
                  id="message"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a message…"
                  className="h-11 min-h-[44px] rounded-lg border-[rgba(75,99,85,0.18)] bg-[rgba(245,244,238,0.5)] px-3.5 text-[13px] text-[#27332C] placeholder:text-[rgba(39,51,44,0.4)] focus-visible:border-[#C6A56B] focus-visible:ring-[#C6A56B]/25"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!draft.trim()}
                  className="btn-gold size-11 shrink-0 rounded-lg"
                  style={{
                    background: "#C6A56B",
                    color: "#1E2A23",
                    border: "none",
                  }}
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </motion.section>
          </div>
        </div>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer
        className="mt-auto"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid rgba(75,99,85,0.14)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 sm:flex-row md:px-8">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              width={16}
              height={16}
              alt="Compile Creative logo mark"
            />
            <span
              className="text-[11px] tracking-wide"
              style={{ color: "rgba(39,51,44,0.5)" }}
            >
              © Compile Creative — Client Portal
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-[11px] transition-colors hover:text-[#27332C]"
            style={{ color: "rgba(39,51,44,0.5)" }}
          >
            <ArrowLeft className="size-3" />
            Back to compilecreative.com
          </button>
        </div>
      </footer>
    </div>
  );
}
