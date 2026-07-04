"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast, Toaster as SonnerToaster } from "sonner";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Send,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────

type ProjectStage =
  | "Position"
  | "Design"
  | "Refine"
  | "Deploy";

type Project = {
  id: string;
  client: string;
  name: string;
  stage: ProjectStage;
  dueLabel: string;
  completed?: boolean;
};

const ACTIVE_PROJECTS: Project[] = [
  { id: "p1", client: "Aria Milano", name: "Brand System", stage: "Design", dueLabel: "Due Mar 18" },
  { id: "p2", client: "Nexus OS", name: "Platform Rebrand", stage: "Position", dueLabel: "Due Apr 02" },
  { id: "p3", client: "Luxe Skin", name: "Identity", stage: "Deploy", dueLabel: "Due Mar 25" },
];

const REVIEW_PROJECTS: Project[] = [
  { id: "p4", client: "SumiCo", name: "Character System", stage: "Design", dueLabel: "Due Mar 12" },
  { id: "p5", client: "Aura Botanica", name: "Visual System", stage: "Position", dueLabel: "Due Mar 20" },
];

const COMPLETED_PROJECTS: Project[] = [
  { id: "p6", client: "Ghera", name: "Cultural Brand", stage: "Refine", dueLabel: "Done Feb 28", completed: true },
  { id: "p7", client: "MT-Hut", name: "Storefront", stage: "Refine", dueLabel: "Done Feb 15", completed: true },
];

type Brief = {
  id: string;
  project: string;
  client: string;
  date: string;
  type: "Brand Strategy" | "Visual Identity" | "Positioning" | "Design System";
};

const BRIEFS: Brief[] = [
  { id: "b1", project: "Brand System", client: "Aria Milano", date: "Mar 12, 2025", type: "Brand Strategy" },
  { id: "b2", project: "Character System", client: "SumiCo", date: "Feb 28, 2025", type: "Visual Identity" },
  { id: "b3", project: "Heritage Rebrand", client: "Naksha Bari", date: "Feb 18, 2025", type: "Positioning" },
  { id: "b4", project: "Platform Rebrand", client: "Nexus OS", date: "Feb 04, 2025", type: "Brand Strategy" },
  { id: "b5", project: "Identity", client: "Luxe Skin", date: "Jan 22, 2025", type: "Design System" },
  { id: "b6", project: "Visual System", client: "Aura Botanica", date: "Jan 10, 2025", type: "Visual Identity" },
  { id: "b7", project: "Positioning Brief", client: "Ember", date: "Dec 18, 2024", type: "Positioning" },
  { id: "b8", project: "Visual Refresh", client: "Signature Style", date: "Dec 02, 2024", type: "Design System" },
];

type QueuePost = {
  id: string;
  title: string;
  platform: "LinkedIn" | "Instagram";
  dateLabel: string;
};

const NEXT_SCHEDULED: QueuePost = {
  id: "n1",
  title: "Aria Milano — positioning case note",
  platform: "LinkedIn",
  dateLabel: "Mar 14, 10:00 AM",
};

const LAST_PUBLISHED: QueuePost = {
  id: "l1",
  title: "Founder reflection — building systems, not shortcuts",
  platform: "LinkedIn",
  dateLabel: "Mar 07, 9:30 AM",
};

const UPCOMING_QUEUE: QueuePost[] = [
  { id: "u1", title: "SumiCo — character system reveal", platform: "Instagram", dateLabel: "Mar 16, 6:00 PM" },
  { id: "u2", title: "Aura Botanica — process behind the visual system", platform: "LinkedIn", dateLabel: "Mar 19, 10:00 AM" },
  { id: "u3", title: "Naksha Bari — heritage story, part one", platform: "Instagram", dateLabel: "Mar 23, 6:00 PM" },
  { id: "u4", title: "Luxe Skin — identity teaser", platform: "Instagram", dateLabel: "Mar 27, 6:00 PM" },
];

// ─── Badges ──────────────────────────────────────────────────

const STAGE_BADGE_STYLES: Record<
  ProjectStage,
  { borderColor: string; color: string; backgroundColor: string }
> = {
  Position: {
    borderColor: "rgba(75, 99, 85, 0.35)",
    color: "#4B6355",
    backgroundColor: "transparent",
  },
  Design: {
    borderColor: "rgba(198, 165, 107, 0.45)",
    color: "#7a5f2e",
    backgroundColor: "rgba(198, 165, 107, 0.1)",
  },
  Refine: {
    borderColor: "rgba(75, 99, 85, 0.25)",
    color: "rgba(75, 99, 85, 0.8)",
    backgroundColor: "#EDECE6",
  },
  Deploy: {
    borderColor: "rgba(39, 51, 44, 0.2)",
    color: "#27332C",
    backgroundColor: "rgba(39, 51, 44, 0.05)",
  },
};

function StageBadge({ stage }: { stage: ProjectStage }) {
  const s = STAGE_BADGE_STYLES[stage];
  return (
    <span
      className="font-label rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em]"
      style={{
        borderColor: s.borderColor,
        color: s.color,
        backgroundColor: s.backgroundColor,
      }}
    >
      {stage}
    </span>
  );
}

const PLATFORM_BADGE_STYLES: Record<
  QueuePost["platform"],
  { borderColor: string; color: string; backgroundColor: string }
> = {
  LinkedIn: {
    borderColor: "rgba(39, 51, 44, 0.2)",
    color: "#27332C",
    backgroundColor: "rgba(39, 51, 44, 0.05)",
  },
  Instagram: {
    borderColor: "rgba(75, 99, 85, 0.25)",
    color: "#4B6355",
    backgroundColor: "#EDECE6",
  },
};

function PlatformBadge({
  platform,
}: {
  platform: QueuePost["platform"];
}) {
  const s = PLATFORM_BADGE_STYLES[platform];
  return (
    <span
      className="font-label rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em]"
      style={{
        borderColor: s.borderColor,
        color: s.color,
        backgroundColor: s.backgroundColor,
      }}
    >
      {platform}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────

export default function TeamWorkspacePage() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "#F5F4EE", color: "#27332C" }}
    >
      <TopBar />
      <main className="flex-1 px-5 pb-12 pt-6 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <WorkspaceHeader />
          <Tabs defaultValue="board" className="mt-6">
            <TabsList
              className="h-auto rounded-lg border p-1"
              style={{
                backgroundColor: "#EDECE6",
                borderColor: "rgba(75, 99, 85, 0.15)",
              }}
            >
              <TabsTrigger
                value="board"
                className="font-label h-9 rounded-md px-4 text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-[#27332C] data-[state=active]:text-[#F5F4EE]"
              >
                Projects Board
              </TabsTrigger>
              <TabsTrigger
                value="briefs"
                className="font-label h-9 rounded-md px-4 text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-[#27332C] data-[state=active]:text-[#F5F4EE]"
              >
                Brief Library
              </TabsTrigger>
              <TabsTrigger
                value="queue"
                className="font-label h-9 rounded-md px-4 text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-[#27332C] data-[state=active]:text-[#F5F4EE]"
              >
                Content Queue
              </TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="mt-6">
              <ProjectsBoard />
            </TabsContent>
            <TabsContent value="briefs" className="mt-6">
              <BriefLibrary />
            </TabsContent>
            <TabsContent value="queue" className="mt-6">
              <ContentQueue />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <TeamFooter />
      <SonnerToaster position="bottom-right" richColors />
    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────

function TopBar() {
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-md"
      style={{
        backgroundColor: "rgba(245, 244, 238, 0.85)",
        borderColor: "rgba(75, 99, 85, 0.15)",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/team" className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="Compile Creative logo"
            width={26}
            height={26}
          />
          <span
            className="font-label text-[11px] font-semibold uppercase tracking-[0.25em]"
            style={{ color: "#27332C" }}
          >
            Team Workspace
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-2.5 sm:flex">
            <Avatar
              className="size-8 border"
              style={{
                backgroundColor: "#27332C",
                borderColor: "rgba(198, 165, 107, 0.35)",
              }}
            >
              <AvatarFallback
                className="font-label text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "#F5F4EE", backgroundColor: "#27332C" }}
              >
                SR
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span
                className="text-[13px] font-medium"
                style={{ color: "#27332C" }}
              >
                Saleh Rishad
              </span>
              <span
                className="font-label text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "#4B6355" }}
              >
                Founder
              </span>
            </div>
          </div>

          {/* Mobile-only avatar */}
          <Avatar
            className="size-8 border sm:hidden"
            style={{
              backgroundColor: "#27332C",
              borderColor: "rgba(198, 165, 107, 0.35)",
            }}
          >
            <AvatarFallback
              className="font-label text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "#F5F4EE", backgroundColor: "#27332C" }}
            >
              SR
            </AvatarFallback>
          </Avatar>

          <Link
            href="/"
            className="font-label inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors"
            style={{
              color: "#27332C",
              borderColor: "rgba(75, 99, 85, 0.25)",
              minHeight: "40px",
            }}
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Back to site</span>
            <span className="sm:hidden">Site</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Workspace header ─────────────────────────────────────────

function WorkspaceHeader() {
  return (
    <div className="flex flex-col gap-1">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="font-label text-[11px] uppercase tracking-[0.3em]"
        style={{ color: "#C6A56B" }}
      >
        Internal
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="text-3xl sm:text-4xl"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "#27332C",
        }}
      >
        Workspace.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.16,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="text-sm"
        style={{ color: "#4B6355" }}
      >
        Active engagements, briefs, and the content queue — all in one place.
      </motion.p>
    </div>
  );
}

// ─── View 1: Projects Board ───────────────────────────────────

function ProjectsBoard() {
  const columns = [
    { id: "active", label: "Active", items: ACTIVE_PROJECTS },
    { id: "review", label: "In Review", items: REVIEW_PROJECTS },
    { id: "completed", label: "Completed", items: COMPLETED_PROJECTS },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 gap-5 md:grid-cols-3"
    >
      {columns.map((col, colIdx) => (
        <motion.div
          key={col.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1 + colIdx * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Card
            className="gap-0 rounded-xl border py-0"
            style={{
              backgroundColor: "#EDECE6",
              borderColor: "rgba(75, 99, 85, 0.15)",
              boxShadow: "0 1px 0 rgba(39, 51, 44, 0.02)",
            }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3.5"
              style={{ borderColor: "rgba(75, 99, 85, 0.12)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-label text-[11px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: "#27332C" }}
                >
                  {col.label}
                </span>
                <span
                  className="font-label flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: "rgba(75, 99, 85, 0.12)",
                    color: "#4B6355",
                  }}
                >
                  {col.items.length}
                </span>
              </div>
            </div>

            <div className="max-h-[60vh] space-y-3 overflow-y-auto p-3 sm:max-h-[70vh]">
              {col.items.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.18 + colIdx * 0.08 + idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
              {col.items.length === 0 && (
                <p
                  className="px-2 py-6 text-center text-[12px]"
                  style={{ color: "rgba(75, 99, 85, 0.55)" }}
                >
                  No projects in this column.
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className={cn(
        "card-hover-lift group rounded-lg border-l-2 bg-[#F5F4EE] p-3.5",
        "border border-[rgba(75,99,85,0.12)]"
      )}
      style={{
        borderLeftColor: project.completed
          ? "rgba(75, 99, 85, 0.45)"
          : "#C6A56B",
        borderLeftWidth: "2px",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className="font-label text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{ color: "#4B6355" }}
        >
          {project.client}
        </p>
        <StageBadge stage={project.stage} />
      </div>
      <p
        className="mt-1.5 text-lg leading-snug"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontWeight: 500,
          color: "#27332C",
        }}
      >
        {project.name}
      </p>
      <div
        className="mt-2 flex items-center gap-1.5 text-[11px]"
        style={{ color: "#4B6355" }}
      >
        <Calendar className="size-3" aria-hidden />
        <span>{project.dueLabel}</span>
      </div>
    </div>
  );
}

// ─── View 2: Brief Library ────────────────────────────────────

function BriefLibrary() {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BRIEFS;
    return BRIEFS.filter(
      (b) =>
        b.project.toLowerCase().includes(q) ||
        b.client.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q)
    );
  }, [query]);

  function handleDownload(brief: Brief) {
    toast.success("Brief download started (demo)", {
      description: `${brief.project} — ${brief.client}`,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-2xl"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
              color: "#27332C",
            }}
          >
            Brief Library
          </h2>
          <p
            className="mt-0.5 text-[13px]"
            style={{ color: "#4B6355" }}
          >
            Archived engagement briefs — searchable by project, client, or type.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            style={{ color: "rgba(75, 99, 85, 0.55)" }}
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search briefs…"
            className="h-10 pl-9"
            aria-label="Search briefs"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(75, 99, 85, 0.2)",
              color: "#27332C",
            }}
          />
        </div>
      </div>

      <Card
        className="overflow-hidden rounded-xl border p-0"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(75, 99, 85, 0.15)",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow
              style={{
                backgroundColor: "#EDECE6",
                borderColor: "rgba(75, 99, 85, 0.15)",
              }}
            >
              <TableHead
                className="font-label pl-5 text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "#4B6355" }}
              >
                Project
              </TableHead>
              <TableHead
                className="font-label text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "#4B6355" }}
              >
                Client
              </TableHead>
              <TableHead
                className="font-label text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "#4B6355" }}
              >
                Date
              </TableHead>
              <TableHead
                className="font-label text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "#4B6355" }}
              >
                Type
              </TableHead>
              <TableHead
                className="font-label pr-5 text-right text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "#4B6355" }}
              >
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((brief, idx) => (
              <motion.tr
                key={brief.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="border-b transition-colors"
                style={{ borderColor: "rgba(75, 99, 85, 0.1)" }}
              >
                <TableCell className="pl-5 py-3.5">
                  <span
                    style={{
                      fontFamily:
                        "var(--font-cormorant), Georgia, serif",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#27332C",
                    }}
                  >
                    {brief.project}
                  </span>
                </TableCell>
                <TableCell className="py-3.5">
                  <span
                    className="font-label text-[11px] uppercase tracking-[0.15em]"
                    style={{ color: "#4B6355" }}
                  >
                    {brief.client}
                  </span>
                </TableCell>
                <TableCell
                  className="py-3.5 text-[13px]"
                  style={{ color: "#27332C" }}
                >
                  {brief.date}
                </TableCell>
                <TableCell className="py-3.5">
                  <span
                    className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] font-label"
                    style={{
                      borderColor: "rgba(75, 99, 85, 0.2)",
                      color: "#4B6355",
                      backgroundColor: "rgba(75, 99, 85, 0.06)",
                    }}
                  >
                    {brief.type}
                  </span>
                </TableCell>
                <TableCell className="pr-5 py-3.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(brief)}
                    className="h-9 gap-1.5 rounded-md px-3"
                    style={{ color: "#27332C" }}
                    aria-label={`Download brief for ${brief.project}`}
                  >
                    <Download className="size-3.5" aria-hidden />
                    <span
                      className="font-label text-[10px] uppercase tracking-[0.18em]"
                    >
                      Download
                    </span>
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-[13px]"
                  style={{ color: "#4B6355" }}
                >
                  No briefs match “{query}”.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}

// ─── View 3: Content Queue ────────────────────────────────────

function ContentQueue() {
  const [publishing, setPublishing] = React.useState(false);

  function handleManualPost() {
    if (publishing) return;
    setPublishing(true);
    toast("Manual post triggered — placeholder system");
    setTimeout(() => {
      setPublishing(false);
    }, 2200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Next scheduled */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <QueueStatusCard
            label="Next Scheduled"
            post={NEXT_SCHEDULED}
            status="Scheduled"
            icon={<Clock className="size-4" aria-hidden />}
            tone="gold"
          />
        </motion.div>

        {/* Last published */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.16,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <QueueStatusCard
            label="Last Published"
            post={LAST_PUBLISHED}
            status="Published"
            icon={<CheckCircle2 className="size-4" aria-hidden />}
            tone="sage"
          />
        </motion.div>

        {/* Manual trigger */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.24,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Card
            className="flex h-full flex-col justify-between rounded-xl border p-5"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(75, 99, 85, 0.15)",
            }}
          >
            <div>
              <p
                className="font-label text-[10px] uppercase tracking-[0.25em]"
                style={{ color: "#4B6355" }}
              >
                Manual Trigger
              </p>
              <p
                className="mt-2 text-lg"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 500,
                  color: "#27332C",
                }}
              >
                {publishing ? "Publishing…" : "Push a post now."}
              </p>
              <p
                className="mt-1 text-[12px] leading-relaxed"
                style={{ color: "#4B6355" }}
              >
                Sends the next scheduled post immediately. Placeholder system — no
                real network call.
              </p>
            </div>
            <Button
              onClick={handleManualPost}
              disabled={publishing}
              className="btn-gold mt-5 h-11 w-full rounded-md text-[12px] font-medium"
              style={{
                backgroundColor: "#27332C",
                color: "#F5F4EE",
                border: "1px solid rgba(198, 165, 107, 0.35)",
              }}
            >
              <Send className="size-3.5" aria-hidden />
              {publishing ? "Publishing…" : "Trigger manual post"}
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming queue list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.32,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <Card
          className="rounded-xl border p-5"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "rgba(75, 99, 85, 0.15)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3
              className="text-xl"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 500,
                color: "#27332C",
              }}
            >
              Upcoming queue
            </h3>
            <span
              className="font-label text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "#4B6355" }}
            >
              {UPCOMING_QUEUE.length} posts
            </span>
          </div>
          <ul className="divide-y" style={{ borderColor: "rgba(75, 99, 85, 0.1)" }}>
            {UPCOMING_QUEUE.map((post, idx) => (
              <motion.li
                key={post.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: 0.4 + idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center justify-between gap-3 py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[14px] font-medium"
                    style={{ color: "#27332C" }}
                  >
                    {post.title}
                  </p>
                  <p
                    className="mt-0.5 flex items-center gap-1.5 text-[11px]"
                    style={{ color: "#4B6355" }}
                  >
                    <Calendar className="size-3" aria-hidden />
                    {post.dateLabel}
                  </p>
                </div>
                <PlatformBadge platform={post.platform} />
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>

      <p
        className="text-center text-[11px]"
        style={{ color: "rgba(75, 99, 85, 0.7)" }}
      >
        Content scheduling is a placeholder system in this demo.
      </p>
    </motion.div>
  );
}

function QueueStatusCard({
  label,
  post,
  status,
  icon,
  tone,
}: {
  label: string;
  post: QueuePost;
  status: "Scheduled" | "Published";
  icon: React.ReactNode;
  tone: "gold" | "sage";
}) {
  const accent = tone === "gold" ? "#C6A56B" : "#4B6355";
  return (
    <Card
      className="flex h-full flex-col rounded-xl border p-5"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "rgba(75, 99, 85, 0.15)",
      }}
    >
      <div className="flex items-center justify-between">
        <p
          className="font-label text-[10px] uppercase tracking-[0.25em]"
          style={{ color: "#4B6355" }}
        >
          {label}
        </p>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] font-label"
          style={{
            borderColor: `${accent}55`,
            color: tone === "gold" ? "#7a5f2e" : "#4B6355",
            backgroundColor: `${accent}14`,
          }}
        >
          {icon}
          {status}
        </span>
      </div>
      <p
        className="mt-3 text-lg leading-snug"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontWeight: 500,
          color: "#27332C",
        }}
      >
        {post.title}
      </p>
      <div
        className="mt-3 flex items-center gap-2 text-[12px]"
        style={{ color: "#4B6355" }}
      >
        <PlatformBadge platform={post.platform} />
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3" aria-hidden />
          {post.dateLabel}
        </span>
      </div>
    </Card>
  );
}

// ─── Footer ───────────────────────────────────────────────────

function TeamFooter() {
  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: "#EDECE6",
        borderColor: "rgba(75, 99, 85, 0.15)",
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Compile Creative mark"
            width={16}
            height={16}
          />
          <span
            className="font-label text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "#4B6355" }}
          >
            © {new Date().getFullYear()} Compile Creative — Team Workspace (internal)
          </span>
        </div>
        <Link
          href="/"
          className="font-label inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors"
          style={{ color: "#4B6355" }}
        >
          <ArrowLeft className="size-3" aria-hidden />
          Back to site
        </Link>
      </div>
    </footer>
  );
}
