"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  BookOpenIcon,
  CheckCircle2Icon,
  type LucideIcon,
  PencilLineIcon,
  XCircleIcon,
} from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetBody,
} from "@/components/ui/sheet";
import { MarkdownContent } from "@/components/markdown-content";
import { ExercisePractice } from "@/components/exercise-practice";
import { DuolingoLaunchButton } from "@/components/duolingo-launch-button";
import { RetroClock } from "@/components/retro-clock";
import { WeeklyStudyBoard, type StudyBoardTopic } from "@/components/weekly-study-board";
import { getCategoryStyle, getLevelStyle } from "@/lib/grammar-style";
import type {
  getAllTopics,
  getAllLessons,
  getAllExercises,
  getProgressSummary,
  getRecentAttempts,
} from "@/lib/content";

type Topic = Awaited<ReturnType<typeof getAllTopics>>[number];
type LessonRow = Awaited<ReturnType<typeof getAllLessons>>[number];
type ExerciseRow = Awaited<ReturnType<typeof getAllExercises>>[number];
type ProgressSummary = Awaited<ReturnType<typeof getProgressSummary>>;
type RecentAttemptRow = Awaited<ReturnType<typeof getRecentAttempts>>[number];

type Selection = { kind: "topic"; id: number } | { kind: "lesson"; id: number };

type Accent = "pink" | "green" | "yellow" | "blue" | "purple" | "orange";

const INK = "#241b3a";

const ACCENT_BODY_BG: Record<Accent, string> = {
  pink: "bg-[#fde3ef]",
  green: "bg-[#e2f6e6]",
  yellow: "bg-[#fff3d6]",
  blue: "bg-[#e0edff]",
  purple: "bg-[#ece3fb]",
  orange: "bg-[#ffe8d1]",
};

const ACCENT_HEADER_BG: Record<Accent, string> = {
  pink: "bg-[#f9b8d6]",
  green: "bg-[#a9e0b6]",
  yellow: "bg-[#ffdf8a]",
  blue: "bg-[#a9c8f7]",
  purple: "bg-[#c6b0f3]",
  orange: "bg-[#ffc48a]",
};

const ACCENT_TEXT: Record<Accent, string> = {
  pink: "text-[#8a2a58]",
  green: "text-[#1f6b3a]",
  yellow: "text-[#7a5a05]",
  blue: "text-[#1e4d8f]",
  purple: "text-[#5a3593]",
  orange: "text-[#a0530a]",
};

const ACCENT_BAR: Record<Accent, string> = {
  pink: "bg-[#ec5f95]",
  green: "bg-[#3fae63]",
  yellow: "bg-[#f0b429]",
  blue: "bg-[#4f7fd6]",
  purple: "bg-[#8b5cf6]",
  orange: "bg-[#ec7c2b]",
};

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function WidgetPanel({
  title,
  emoji,
  accent,
  right,
  className,
  bodyClassName,
  children,
}: {
  title: string;
  emoji: string;
  accent: Accent;
  right?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border-[3px] shadow-[5px_5px_0_0_#241b3a]",
        ACCENT_BODY_BG[accent],
        className,
      )}
      style={{ borderColor: INK }}
    >
      <div
        className={cn("flex items-center gap-2 border-b-[3px] px-4 py-2.5", ACCENT_HEADER_BG[accent])}
        style={{ borderColor: INK }}
      >
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2 bg-white text-sm"
          style={{ borderColor: INK }}
        >
          {emoji}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate font-heading text-xs font-bold tracking-[0.12em] uppercase",
            ACCENT_TEXT[accent],
          )}
        >
          {title}
        </span>
        {right}
      </div>
      <div className={cn("min-w-0 flex-1 p-4", bodyClassName)}>{children}</div>
    </div>
  );
}

function GoalBar({ label, pct, accent }: { label: string; pct: number; accent: Accent }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm font-medium text-[#2d2440]">
        <span className="min-w-0 truncate">{label}</span>
        <span className="shrink-0 tabular-nums text-[#6b5f8a]">{Math.round(clamped)}%</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full border border-[#241b3a]/15 bg-white/70"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full transition-all", ACCENT_BAR[accent])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

function GridCard({
  icon: Icon,
  iconClassName,
  bgClassName,
  title,
  sub,
  meta,
  onClick,
}: {
  icon: LucideIcon;
  iconClassName: string;
  bgClassName: string;
  title: string;
  sub?: ReactNode;
  meta?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-full flex-col gap-2 rounded-xl border-2 p-3 text-left transition-transform hover:-translate-y-0.5",
        bgClassName,
      )}
      style={{ borderColor: INK }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/70", iconClassName)}>
          <Icon className="size-3.5" />
        </span>
        {meta}
      </div>
      <p className="text-sm leading-snug font-semibold text-[#2d2440]">{title}</p>
      {sub && <p className="line-clamp-2 text-xs text-[#6b5f8a]">{sub}</p>}
    </button>
  );
}

export function Dashboard({
  topics,
  lessonsRows,
  exercises,
  progress,
  recentAttempts,
  nowIso,
}: {
  topics: Topic[];
  lessonsRows: LessonRow[];
  exercises: ExerciseRow[];
  progress: ProgressSummary;
  recentAttempts: RecentAttemptRow[];
  nowIso: string;
}) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const topicById = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

  const exercisesByTopic = useMemo(() => {
    const map = new Map<number, ExerciseRow[]>();
    for (const exercise of exercises) {
      if (exercise.topicId == null) continue;
      const list = map.get(exercise.topicId) ?? [];
      list.push(exercise);
      map.set(exercise.topicId, list);
    }
    return map;
  }, [exercises]);

  const studyBoardTopics = useMemo<StudyBoardTopic[]>(() => {
    const progressByTopic = new Map(progress.perTopic.map((topic) => [topic.topicId, topic]));

    return topics.map((topic) => {
      const topicProgress = progressByTopic.get(topic.id);
      return {
        id: topic.id,
        title: topic.title,
        summary: topic.summary,
        level: topic.level,
        category: topic.category,
        totalExercises: topicProgress?.totalExercises ?? 0,
        attempted: topicProgress?.attempted ?? 0,
      };
    });
  }, [progress.perTopic, topics]);

  const streakDays = useMemo(() => {
    const activeDates = new Set(
      recentAttempts.map(({ attempt }) => new Date(attempt.createdAt).toDateString()),
    );
    const today = new Date();
    const days: { label: string; active: boolean; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push({
        label: WEEKDAY_LABELS[d.getDay()],
        active: activeDates.has(d.toDateString()),
        isToday: i === 0,
      });
    }
    return days;
  }, [recentAttempts]);

  function openTopic(id: number) {
    setSelection({ kind: "topic", id });
    setSheetOpen(true);
  }

  function openLesson(id: number) {
    setSelection({ kind: "lesson", id });
    setSheetOpen(true);
  }

  const activeTopic = selection?.kind === "topic" ? topicById.get(selection.id) ?? null : null;
  const activeExercises = activeTopic ? exercisesByTopic.get(activeTopic.id) ?? [] : [];
  const activeTopicStyle = getCategoryStyle(activeTopic?.category ?? "");

  const activeLessonRow =
    selection?.kind === "lesson"
      ? lessonsRows.find((r) => r.lesson.id === selection.id) ?? null
      : null;
  const activeLessonParent =
    activeLessonRow?.lesson.topicId != null ? topicById.get(activeLessonRow.lesson.topicId) : undefined;
  const activeLessonStyle = getCategoryStyle(activeLessonParent?.category ?? "");

  return (
    <div className="min-h-dvh bg-[#fdf6ec] px-4 py-6 sm:px-6 lg:px-10">
      <header
        className="mb-4 flex items-center justify-between gap-4 rounded-2xl border-[3px] bg-[#fde3ef] px-5 py-4 shadow-[6px_6px_0_0_#241b3a]"
        style={{ borderColor: INK }}
      >
        <span className="inline-block animate-logo-slide">
          <Image
            src="/logo-eng.png"
            alt="English Study"
            width={56}
            height={56}
            priority
          />
        </span>
        <DuolingoLaunchButton />
      </header>

      <div className="space-y-4">
        <WeeklyStudyBoard topics={studyBoardTopics} nowIso={nowIso} onOpenTopic={openTopic} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <WidgetPanel title="Luyện tập" emoji="✏️" accent="yellow">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {progress.perTopic.map((topic) => {
                const parent = topicById.get(topic.topicId);
                const style = getCategoryStyle(parent?.category ?? "");
                return (
                  <GridCard
                    key={topic.topicId}
                    icon={PencilLineIcon}
                    iconClassName={style.text}
                    bgClassName={style.soft}
                    title={topic.topicTitle}
                    meta={
                      <span className="shrink-0 text-[0.65rem] font-medium text-[#6b5f8a]">
                        {Math.min(topic.attempted, topic.totalExercises)}/{topic.totalExercises}
                        {topic.attempted > 0 ? ` · ${topic.avgScore.toFixed(0)}đ` : ""}
                      </span>
                    }
                    onClick={() => openTopic(topic.topicId)}
                  />
                );
              })}
            </div>
          </WidgetPanel>

          <WidgetPanel title="Bài học" emoji="🎓" accent="green">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {lessonsRows.map(({ lesson, topicTitle }) => {
                const parent = lesson.topicId != null ? topicById.get(lesson.topicId) : undefined;
                const style = getCategoryStyle(parent?.category ?? "");
                return (
                  <GridCard
                    key={lesson.id}
                    icon={BookOpenIcon}
                    iconClassName={style.text}
                    bgClassName={style.soft}
                    title={lesson.title}
                    sub={topicTitle ? `Chủ điểm: ${topicTitle}` : undefined}
                    meta={
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold",
                          getLevelStyle(lesson.level).badge,
                        )}
                      >
                        {lesson.level}
                      </span>
                    }
                    onClick={() => openLesson(lesson.id)}
                  />
                );
              })}
            </div>
          </WidgetPanel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <WidgetPanel title="Tiến độ theo chủ điểm" emoji="📈" accent="purple">
            <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
              {progress.perTopic.map((topic) => {
                const pct =
                  topic.totalExercises > 0
                    ? (Math.min(topic.attempted, topic.totalExercises) / topic.totalExercises) * 100
                    : 0;
                return <GoalBar key={topic.topicId} label={topic.topicTitle} pct={pct} accent="purple" />;
              })}
            </div>
          </WidgetPanel>

          <WidgetPanel title="Lịch sử gần đây" emoji="🕘" accent="blue" bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/60">
                  <tr>
                    <th className="px-4 py-2 text-xs font-semibold tracking-wide text-[#6b5f8a] uppercase">
                      Bài tập
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold tracking-wide text-[#6b5f8a] uppercase">
                      Chủ điểm
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold tracking-wide text-[#6b5f8a] uppercase">
                      Điểm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map(({ attempt, exercisePrompt, topicTitle }) => (
                    <tr key={attempt.id} className="border-t border-[#241b3a]/10 odd:bg-white/40">
                      <td className="max-w-0 px-4 py-2 text-[#2d2440]">
                        <span className="flex items-center gap-1.5">
                          {attempt.isCorrect ? (
                            <CheckCircle2Icon className="size-3.5 shrink-0 text-[#3fae63]" />
                          ) : (
                            <XCircleIcon className="size-3.5 shrink-0 text-[#ec5f95]" />
                          )}
                          <span className="truncate">{exercisePrompt}</span>
                        </span>
                      </td>
                      <td className="px-4 py-2 text-[#6b5f8a]">{topicTitle ?? "—"}</td>
                      <td className="px-4 py-2 text-right font-semibold text-[#2d2440]">{attempt.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentAttempts.length === 0 && (
                <p className="px-4 py-4 text-sm text-[#6b5f8a]">Chưa có bài nào được làm.</p>
              )}
            </div>
          </WidgetPanel>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <WidgetPanel title="Duolingo" emoji="🦉" accent="orange">
            <div className="flex h-full flex-col items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Image
                  src="/logo-eng.png"
                  alt=""
                  width={40}
                  height={40}
                  className="shrink-0 rounded-lg border-2"
                  style={{ borderColor: INK }}
                />
                <p className="rounded-xl rounded-tl-none border-2 border-[#241b3a]/15 bg-white/80 px-2.5 py-1.5 text-xs text-[#2d2440]">
                  Đi luyện Duolingo thôi! 🔥
                </p>
              </div>
              <DuolingoLaunchButton />
            </div>
          </WidgetPanel>

          <WidgetPanel title="Chuỗi ngày học" emoji="🔥" accent="yellow">
            <div className="flex h-full items-center justify-between gap-1.5">
              {streakDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border-2 text-[0.6rem] font-semibold",
                      day.active
                        ? "border-[#f0b429] bg-[#ffdf8a] text-[#7a5a05]"
                        : "border-[#241b3a]/10 bg-white/60 text-[#6b5f8a]",
                      day.isToday && "ring-2 ring-[#f0b429]/70",
                    )}
                  >
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </WidgetPanel>

          <WidgetPanel title="Đồng hồ" emoji="⏰" accent="green">
            <RetroClock />
          </WidgetPanel>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="border-l-[3px] bg-[#fdf6ec]" style={{ borderColor: INK }}>
          {activeTopic && (
            <>
              <SheetHeader className="border-[#241b3a]/10">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                        getLevelStyle(activeTopic.level).badge,
                      )}
                    >
                      {activeTopic.level}
                    </span>
                    <Badge variant="outline" className={activeTopicStyle.badge}>
                      {activeTopicStyle.label}
                    </Badge>
                  </div>
                  <SheetTitle className="mt-2 text-[#2d2440]">{activeTopic.title}</SheetTitle>
                  <SheetDescription className="mt-1 text-[#6b5f8a]">
                    {activeTopic.summary}
                  </SheetDescription>
                </div>
                <SheetClose className="text-[#6b5f8a] hover:bg-[#241b3a]/10 hover:text-[#2d2440]" />
              </SheetHeader>
              <SheetBody>
                <MarkdownContent content={activeTopic.content} accent={activeTopic.category} />

                {activeExercises.length > 0 && (
                  <div className="mt-6 border-t-2 border-[#241b3a]/10 pt-4">
                    <h2 className="mb-3 font-heading text-xs font-bold tracking-[0.12em] text-[#5a3593] uppercase">
                      Luyện tập ({activeExercises.length})
                    </h2>
                    <div className="space-y-4">
                      {activeExercises.map((exercise) => (
                        <ExercisePractice
                          key={exercise.id}
                          exercise={{
                            id: exercise.id,
                            type: exercise.type,
                            prompt: exercise.prompt,
                            difficulty: exercise.difficulty,
                            choices: exercise.choices,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </SheetBody>
            </>
          )}

          {activeLessonRow && (
            <>
              <SheetHeader className="border-[#241b3a]/10">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                        getLevelStyle(activeLessonRow.lesson.level).badge,
                      )}
                    >
                      {activeLessonRow.lesson.level}
                    </span>
                    <Badge variant="outline" className={activeLessonStyle.badge}>
                      {activeLessonStyle.label}
                    </Badge>
                  </div>
                  <SheetTitle className="mt-2 text-[#2d2440]">{activeLessonRow.lesson.title}</SheetTitle>
                  {activeLessonRow.topicTitle && (
                    <SheetDescription className="mt-1 text-[#6b5f8a]">
                      Chủ điểm: {activeLessonRow.topicTitle}
                    </SheetDescription>
                  )}
                </div>
                <SheetClose className="text-[#6b5f8a] hover:bg-[#241b3a]/10 hover:text-[#2d2440]" />
              </SheetHeader>
              <SheetBody>
                <MarkdownContent content={activeLessonRow.lesson.content} accent={activeLessonParent?.category} />
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
