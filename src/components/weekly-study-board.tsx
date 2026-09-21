"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  BookOpenCheckIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  Clock3Icon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { StudyTaskSheet } from "@/components/study-task-sheet";
import { getCategoryStyle } from "@/lib/grammar-style";
import {
  formatWallDate,
  formatWallDateTime,
  getStudyTaskStorageKey,
  parseWallDateTime,
  readStudyTasks,
  STUDY_TASK_COLOR_OPTIONS,
  type StudyTaskInput,
  type StudyTaskRecord,
} from "@/lib/study-tasks";

export type StudyBoardTopic = {
  id: number;
  title: string;
  summary: string;
  level: string;
  category: string;
  totalExercises: number;
  attempted: number;
};

type PlannedTask = {
  id: string;
  topic: StudyBoardTopic;
  title: string;
  details: string;
  dayIndex: number;
  startAt: Date;
  endAt: Date;
  deadlineAt: Date;
  colorClassName: string;
  imageDataUrl: string | null;
};

type TaskEditorState =
  | { mode: "create"; suggestedStartAt: string }
  | { mode: "edit"; taskId: string };

type TopicColor = {
  disk: string;
  diskText: string;
  event: string;
};

const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const STUDY_SLOTS = [
  { hour: 19, minute: 0 },
  { hour: 20, minute: 0 },
  { hour: 18, minute: 30 },
  { hour: 19, minute: 30 },
  { hour: 18, minute: 0 },
  { hour: 9, minute: 0 },
  { hour: 16, minute: 0 },
];

const TOPIC_COLORS: TopicColor[] = [
  {
    disk: "bg-[var(--study-pink)]",
    diskText: "text-[var(--study-pink-ink)]",
    event: "bg-[var(--study-pink-soft)]",
  },
  {
    disk: "bg-[var(--study-blue)]",
    diskText: "text-[var(--study-blue-ink)]",
    event: "bg-[var(--study-blue-soft)]",
  },
  {
    disk: "bg-[var(--study-purple)]",
    diskText: "text-[var(--study-purple-ink)]",
    event: "bg-[var(--study-purple-soft)]",
  },
  {
    disk: "bg-[var(--study-cyan)]",
    diskText: "text-[var(--study-cyan-ink)]",
    event: "bg-[var(--study-cyan-soft)]",
  },
  {
    disk: "bg-[var(--study-green)]",
    diskText: "text-[var(--study-green-ink)]",
    event: "bg-[var(--study-green-soft)]",
  },
  {
    disk: "bg-[var(--study-yellow)]",
    diskText: "text-[var(--study-yellow-ink)]",
    event: "bg-[var(--study-yellow-soft)]",
  },
  {
    disk: "bg-[var(--study-orange)]",
    diskText: "text-[var(--study-orange-ink)]",
    event: "bg-[var(--study-orange-soft)]",
  },
];

function toVietnamWallClock(iso: string) {
  return new Date(new Date(iso).getTime() + VIETNAM_OFFSET_MS);
}

function getMonday(date: Date) {
  const monday = new Date(date);
  const day = monday.getUTCDay();
  const distance = day === 0 ? -6 : 1 - day;
  monday.setUTCDate(monday.getUTCDate() + distance);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

function getStudyWeekStart(now: Date) {
  const currentMonday = getMonday(now);
  const sundaySlot = new Date(currentMonday.getTime() + 6 * DAY_MS);
  sundaySlot.setUTCHours(STUDY_SLOTS[6].hour, STUDY_SLOTS[6].minute, 0, 0);

  if (now.getTime() > sundaySlot.getTime()) {
    return new Date(currentMonday.getTime() + 7 * DAY_MS);
  }

  return currentMonday;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("vi-VN", { ...options, timeZone: "UTC" }).format(date);
}

function formatDeadline(date: Date) {
  return `${formatDate(date, { weekday: "short", day: "2-digit", month: "2-digit" })}, ${formatTime(date)}`;
}

function capitalize(text: string) {
  return text.charAt(0).toLocaleUpperCase("vi-VN") + text.slice(1);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function createDefaultTaskRecords(topics: StudyBoardTopic[], weekStart: Date): StudyTaskRecord[] {
  const incompleteTopics = topics.filter((topic) => topic.attempted < topic.totalExercises);
  const taskPool = incompleteTopics.length > 0 ? incompleteTopics : topics;

  if (taskPool.length === 0) return [];

  return WEEKDAYS.map((_, dayIndex) => {
    const topic = taskPool[dayIndex % taskPool.length];
    const slot = STUDY_SLOTS[dayIndex];
    const startAt = new Date(weekStart.getTime() + dayIndex * DAY_MS);
    startAt.setUTCHours(slot.hour, slot.minute, 0, 0);
    const endAt = new Date(startAt.getTime() + 90 * 60 * 1000);
    const remainingExercises = Math.max(topic.totalExercises - topic.attempted, 0);
    const details =
      remainingExercises === 0
        ? `Ôn lại ${topic.title} để ghi nhớ kiến thức.`
        : `${remainingExercises} bài luyện còn lại. ${topic.summary}`;

    return {
      id: `default-${formatWallDate(startAt)}-${topic.id}`,
      topicId: topic.id,
      title: topic.title,
      details,
      startAt: formatWallDateTime(startAt),
      endAt: formatWallDateTime(endAt),
      deadlineAt: formatWallDateTime(endAt),
      colorId: STUDY_TASK_COLOR_OPTIONS[topic.id % STUDY_TASK_COLOR_OPTIONS.length].id,
      imageDataUrl: null,
    };
  });
}

function materializeTasks(records: StudyTaskRecord[], topics: StudyBoardTopic[], weekStart: Date): PlannedTask[] {
  const topicsById = new Map(topics.map((topic) => [topic.id, topic]));

  return records
    .map<PlannedTask | null>((record) => {
      const topic = topicsById.get(record.topicId);
      if (!topic) return null;

      const startAt = parseWallDateTime(record.startAt);
      const dayIndex = Math.floor((startAt.getTime() - weekStart.getTime()) / DAY_MS);
      if (dayIndex < 0 || dayIndex > 6) return null;

      return {
        id: record.id,
        topic,
        title: record.title,
        details: record.details,
        dayIndex,
        startAt,
        endAt: parseWallDateTime(record.endAt),
        deadlineAt: parseWallDateTime(record.deadlineAt),
        colorClassName:
          STUDY_TASK_COLOR_OPTIONS.find((option) => option.id === record.colorId)?.className ??
          STUDY_TASK_COLOR_OPTIONS[topic.id % STUDY_TASK_COLOR_OPTIONS.length].className,
        imageDataUrl: record.imageDataUrl,
      } satisfies PlannedTask;
    })
    .filter((task): task is PlannedTask => task !== null)
    .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
}

function StudyPanel({
  title,
  meta,
  icon: Icon,
  tone,
  className,
  children,
}: {
  title: string;
  meta?: string;
  icon: LucideIcon;
  tone: "library" | "planner";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "study-panel-shadow flex min-w-0 flex-col overflow-hidden rounded-2xl border-[3px] border-[var(--study-ink)]",
        tone === "library" ? "bg-[var(--study-screen)]" : "bg-[var(--study-planner-surface)]",
        className,
      )}
      aria-label={title}
    >
      <header
        className={cn(
          "flex min-h-14 items-center gap-3 border-b-[3px] border-[var(--study-ink)] px-4 py-3",
          tone === "library" ? "bg-[var(--study-cyan)]" : "bg-[var(--study-mint)]",
        )}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border-2 border-[var(--study-ink)] bg-[var(--study-paper)] text-[var(--study-ink)]">
          <Icon className="size-5" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <h2 className="min-w-0 flex-1 font-heading text-sm font-bold tracking-[0.08em] text-[var(--study-ink)] uppercase">
          {title}
        </h2>
        {meta ? (
          <span className="shrink-0 font-terminal text-base text-[var(--study-ink-muted)]">{meta}</span>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function TopicDisk({
  topic,
  index,
  onOpen,
}: {
  topic: StudyBoardTopic;
  index: number;
  onOpen: () => void;
}) {
  const color = TOPIC_COLORS[index % TOPIC_COLORS.length];
  const completedExercises = Math.min(topic.attempted, topic.totalExercises);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-36 min-w-0 cursor-pointer flex-col items-center justify-start gap-2 rounded-xl px-2 py-2 text-center transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--study-focus)] active:translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
      aria-label={`${topic.title}, trình độ ${topic.level}, đã hoàn thành ${completedExercises} trên ${topic.totalExercises} bài`}
      title={topic.title}
    >
      <span
        className={cn(
          "study-control-shadow relative block aspect-square w-full max-w-24 overflow-hidden rounded-md border-[3px] border-[var(--study-ink)]",
          color.disk,
        )}
      >
        <span className="absolute top-0 left-1/2 flex h-6 w-12 -translate-x-1/2 items-center justify-end border-x-[3px] border-b-[3px] border-[var(--study-ink)] bg-[var(--study-paper)] px-1">
          <span className="h-3 w-2 border-2 border-[var(--study-ink)] bg-[var(--study-metal)]" />
        </span>
        <SaveIcon
          className={cn("absolute top-7 left-1/2 size-8 -translate-x-1/2 opacity-80", color.diskText)}
          strokeWidth={2.25}
          aria-hidden="true"
        />
        <span className="absolute right-2 bottom-2 left-2 flex items-center justify-between gap-1 border-2 border-[var(--study-ink)] bg-[var(--study-paper)] px-1.5 py-1 font-terminal text-sm text-[var(--study-ink)]">
          <span>{topic.level}</span>
          <span className="tabular-nums">
            {completedExercises}/{topic.totalExercises}
          </span>
        </span>
      </span>
      <span className="line-clamp-2 text-xs leading-4 font-bold text-[var(--study-paper)] group-hover:text-[var(--study-yellow)]">
        {topic.title}
      </span>
    </button>
  );
}

function UpcomingTaskCard({
  task,
  onOpenTopic,
  onEdit,
  onDelete,
}: {
  task: PlannedTask;
  onOpenTopic: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const TopicIcon = getCategoryStyle(task.topic.category).icon;

  return (
    <article className="study-control-shadow overflow-hidden rounded-lg border-[3px] border-[var(--study-ink)] bg-[var(--study-paper)]">
      <div className="flex items-center justify-between gap-3 border-b-[3px] border-[var(--study-ink)] bg-[var(--study-mint-strong)] px-3 py-2 font-terminal text-lg text-[var(--study-ink)]">
        <span>
          {capitalize(
            formatDate(task.startAt, {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
            }),
          )}
        </span>
        <span>Study plan</span>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[7rem_1fr]">
        <div
          className={cn(
            "relative flex min-h-28 items-center justify-center overflow-hidden rounded-md border-[3px] border-[var(--study-ink)]",
            task.colorClassName,
          )}
        >
          {task.imageDataUrl ? (
            <Image
              src={task.imageDataUrl}
              alt={`Ảnh minh hoạ cho ${task.title}`}
              fill
              unoptimized
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <TopicIcon className="size-12 text-[var(--study-ink)]" strokeWidth={1.75} aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-heading text-xs font-bold tracking-[0.08em] text-[var(--study-mint-ink)] uppercase">
            Task sắp tới
          </p>
          <h3 className="mt-1 text-base leading-5 font-bold text-[var(--study-ink)]">{task.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-[var(--study-ink-muted)]">
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Clock3Icon className="size-4" aria-hidden="true" />
              {formatTime(task.startAt)} - {formatTime(task.endAt)}
            </span>
            <span className="inline-flex items-center gap-1.5 tabular-nums text-[#8a2a58]">
              <CalendarClockIcon className="size-4" aria-hidden="true" />
              Deadline: {formatDeadline(task.deadlineAt)}
            </span>
          </div>
          <p className="mt-2 line-clamp-3 text-sm leading-5 text-[var(--study-ink-muted)]">{task.details}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenTopic}
              className="min-h-11 cursor-pointer rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-paper)] px-4 py-2 text-sm font-bold text-[var(--study-ink)] shadow-[3px_3px_0_var(--study-ink)] transition-transform duration-150 ease-out hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--study-focus)] active:translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
            >
              Mở chủ điểm
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-blue-soft)] px-3 py-2 text-sm font-bold text-[var(--study-ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--study-focus)] active:translate-y-0.5"
            >
              <PencilIcon className="size-4" aria-hidden="true" />
              Sửa
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md border-2 border-[#7f2148] bg-[#fde3ef] px-3 py-2 text-sm font-bold text-[#7f2148] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--study-focus)] active:translate-y-0.5"
            >
              <Trash2Icon className="size-4" aria-hidden="true" />
              Xoá
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function TimelineTask({
  task,
  onEdit,
  onDelete,
  isUpcoming,
}: {
  task: PlannedTask;
  onEdit: () => void;
  onDelete: () => void;
  isUpcoming: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative min-h-28 overflow-hidden rounded-md border-2 border-[var(--study-ink)] text-left text-[var(--study-ink)] transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-within:outline-3 focus-within:outline-offset-1 focus-within:outline-[var(--study-focus)] motion-reduce:transform-none motion-reduce:transition-none",
        task.colorClassName,
        isUpcoming && "ring-3 ring-[var(--study-focus)] ring-offset-2 ring-offset-[var(--study-paper)]",
      )}
      aria-label={`${WEEKDAYS[task.dayIndex]}, ${formatTime(task.startAt)} đến ${formatTime(task.endAt)}, ${task.title}, deadline ${formatDeadline(task.deadlineAt)}`}
    >
      <button
        type="button"
        onClick={onEdit}
        className="block h-full min-h-28 w-full cursor-pointer p-2 text-left focus-visible:outline-none"
        title={`Sửa ${task.title}`}
      >
        {task.imageDataUrl ? (
          <span className="relative mb-2 block aspect-[4/3] w-full overflow-hidden rounded border border-[var(--study-ink)] bg-white">
            <Image
              src={task.imageDataUrl}
              alt=""
              fill
              unoptimized
              sizes="160px"
              className="object-cover"
            />
          </span>
        ) : null}
        <span className="block font-terminal text-xs leading-none tabular-nums">
          {formatTime(task.startAt)}-{formatTime(task.endAt)}
        </span>
        <span className="mt-1 line-clamp-2 block text-[0.68rem] leading-3 font-bold">{task.title}</span>
        <span className="mt-1 block truncate text-[0.6rem] font-semibold text-[#8a2a58]">
          {`DL ${formatDate(task.deadlineAt, { day: "2-digit", month: "2-digit" })} · ${formatTime(task.deadlineAt)}`}
        </span>
      </button>
      <div className="absolute top-1 right-1 flex gap-1 rounded bg-[var(--study-paper)]/90 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          className="flex size-5 cursor-pointer items-center justify-center rounded border border-[var(--study-ink)] bg-[var(--study-paper)] hover:bg-[var(--study-blue-soft)]"
          aria-label={`Sửa task ${task.title}`}
          title="Sửa task"
        >
          <PencilIcon className="size-3" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex size-5 cursor-pointer items-center justify-center rounded border border-[#7f2148] bg-[#fde3ef] text-[#7f2148] hover:bg-[#f9b8d6]"
          aria-label={`Xoá task ${task.title}`}
          title="Xoá task"
        >
          <Trash2Icon className="size-3" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function WeeklyTimeline({
  tasks,
  weekStart,
  now,
  upcomingTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  tasks: PlannedTask[];
  weekStart: Date;
  now: Date;
  upcomingTask?: PlannedTask;
  onAddTask: () => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}) {
  const days = WEEKDAYS.map((label, dayIndex) => {
    const date = new Date(weekStart.getTime() + dayIndex * DAY_MS);
    const dayTasks = tasks
      .filter((task) => task.dayIndex === dayIndex)
      .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
    return { label, dayIndex, date, tasks: dayTasks };
  });
  const weekEnd = days[6].date;
  const weekLabel = `${formatDate(weekStart, { day: "2-digit", month: "2-digit" })} - ${formatDate(weekEnd, {
    day: "2-digit",
    month: "2-digit",
  })}`;

  return (
    <div className="mt-4 overflow-hidden rounded-lg border-[3px] border-[var(--study-ink)] bg-[var(--study-paper)]">
      <div className="flex items-center justify-between gap-3 border-b-[3px] border-[var(--study-ink)] bg-[var(--study-mint-strong)] px-3 py-2">
        <h3 className="font-heading text-xs font-bold tracking-[0.08em] text-[var(--study-ink)] uppercase">
          Lịch biểu trong tuần
        </h3>
        <div className="flex items-center gap-2">
          <span className="hidden font-terminal text-base text-[var(--study-ink-muted)] sm:inline">{weekLabel}</span>
          <button
            type="button"
            onClick={onAddTask}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-yellow)] px-3 py-1.5 text-xs font-bold text-[var(--study-ink)] shadow-[2px_2px_0_var(--study-ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--study-focus)] active:translate-y-0.5"
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            Thêm task
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-7 border-b-2 border-[var(--study-ink)] bg-[var(--study-yellow-soft)]">
          {days.map((day) => (
            <div
              key={day.dayIndex}
              className={cn(
                "border-l-2 border-[var(--study-ink)] px-1 py-2 text-center first:border-l-0",
                isSameDay(day.date, now) && "bg-[var(--study-yellow)]",
              )}
            >
              <span className="block text-xs font-bold text-[var(--study-ink)]">{day.label}</span>
              <span className="block font-terminal text-sm text-[var(--study-ink-muted)]">
                {day.date.getUTCDate().toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 items-stretch">
          {days.map((day) => (
            <div
              key={day.dayIndex}
              className="min-h-72 border-l-2 border-[var(--study-ink)] bg-[var(--study-paper)] p-2 first:border-l-0"
            >
              <div className="flex flex-col gap-2">
                {day.tasks.map((task) => (
                  <TimelineTask
                    key={task.id}
                    task={task}
                    onEdit={() => onEditTask(task.id)}
                    onDelete={() => onDeleteTask(task.id)}
                    isUpcoming={task.id === upcomingTask?.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 p-3 md:hidden">
        {tasks.map((task) => (
          <article
            key={task.id}
            className={cn(
              "flex min-h-20 w-full items-center gap-3 rounded-lg border-2 border-[var(--study-ink)] p-3 text-left",
              task.colorClassName,
              task.id === upcomingTask?.id &&
                "ring-3 ring-[var(--study-focus)] ring-offset-2 ring-offset-[var(--study-paper)]",
            )}
          >
            <span className="flex w-12 shrink-0 flex-col items-center font-terminal text-[var(--study-ink)]">
              <span className="text-lg">{WEEKDAYS[task.dayIndex]}</span>
              <span className="text-base tabular-nums">{task.startAt.getUTCDate().toString().padStart(2, "0")}</span>
            </span>
            {task.imageDataUrl ? (
              <span className="relative size-16 shrink-0 overflow-hidden rounded-md border-2 border-[var(--study-ink)] bg-white">
                <Image
                  src={task.imageDataUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-cover"
                />
              </span>
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-[var(--study-ink)]">{task.title}</span>
              <span className="mt-1 block text-xs text-[var(--study-ink-muted)]">
                {formatTime(task.startAt)} - {formatTime(task.endAt)}
              </span>
              <span className="mt-1 block text-xs font-semibold text-[#8a2a58]">
                Deadline: {formatDeadline(task.deadlineAt)}
              </span>
            </span>
            <span className="flex shrink-0 flex-col gap-2">
              <button
                type="button"
                onClick={() => onEditTask(task.id)}
                className="flex size-10 cursor-pointer items-center justify-center rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-paper)]"
                aria-label={`Sửa task ${task.title}`}
              >
                <PencilIcon className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                className="flex size-10 cursor-pointer items-center justify-center rounded-md border-2 border-[#7f2148] bg-[#fde3ef] text-[#7f2148]"
                aria-label={`Xoá task ${task.title}`}
              >
                <Trash2Icon className="size-4" aria-hidden="true" />
              </button>
            </span>
          </article>
        ))}
        {tasks.length === 0 ? (
          <p className="rounded-lg border-2 border-dashed border-[var(--study-ink)] p-4 text-center text-sm font-semibold text-[var(--study-ink-muted)]">
            Tuần này chưa có task. Chọn “Thêm task” để bắt đầu.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function WeeklyStudyBoard({
  topics,
  nowIso,
  onOpenTopic,
}: {
  topics: StudyBoardTopic[];
  nowIso: string;
  onOpenTopic: (topicId: number) => void;
}) {
  const now = useMemo(() => toVietnamWallClock(nowIso), [nowIso]);
  const weekStart = useMemo(() => getStudyWeekStart(now), [now]);
  const weekEnd = useMemo(() => new Date(weekStart.getTime() + 6 * DAY_MS), [weekStart]);
  const storageKey = useMemo(() => getStudyTaskStorageKey(weekStart), [weekStart]);
  const defaultTaskRecords = useMemo(() => createDefaultTaskRecords(topics, weekStart), [topics, weekStart]);
  const [taskRecords, setTaskRecords] = useState<StudyTaskRecord[]>(defaultTaskRecords);
  const [editor, setEditor] = useState<TaskEditorState | null>(null);
  const loadedStorageKey = useRef<string | null>(null);

  useEffect(() => {
    loadedStorageKey.current = null;
    const initialLoad = window.setTimeout(() => {
      const storedTasks = readStudyTasks(window.localStorage.getItem(storageKey));
      setTaskRecords(storedTasks ?? defaultTaskRecords);
      loadedStorageKey.current = storageKey;
    }, 0);

    return () => window.clearTimeout(initialLoad);
  }, [defaultTaskRecords, storageKey]);

  useEffect(() => {
    if (loadedStorageKey.current !== storageKey) return;
    window.localStorage.setItem(storageKey, JSON.stringify(taskRecords));
  }, [storageKey, taskRecords]);

  const tasks = useMemo(() => materializeTasks(taskRecords, topics, weekStart), [taskRecords, topics, weekStart]);
  const upcomingTask = tasks.find((task) => task.startAt.getTime() >= now.getTime());

  const suggestedStartAt = useMemo(() => {
    const suggestion = new Date(Math.max(now.getTime(), weekStart.getTime()));
    suggestion.setUTCHours(19, 0, 0, 0);

    if (suggestion.getTime() < now.getTime()) suggestion.setUTCDate(suggestion.getUTCDate() + 1);
    if (suggestion.getTime() > weekEnd.getTime() + DAY_MS - 1) {
      suggestion.setTime(weekEnd.getTime());
      suggestion.setUTCHours(19, 0, 0, 0);
    }

    return formatWallDateTime(suggestion);
  }, [now, weekEnd, weekStart]);

  const openCreateTask = useCallback(() => {
    if (topics.length === 0) return;
    setEditor({ mode: "create", suggestedStartAt });
  }, [suggestedStartAt, topics.length]);

  const openEditTask = useCallback((taskId: string) => {
    setEditor({ mode: "edit", taskId });
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setTaskRecords((current) => current.filter((task) => task.id !== taskId));
    setEditor(null);
  }, []);

  const requestDeleteTask = useCallback(
    (taskId: string) => {
      const task = taskRecords.find((item) => item.id === taskId);
      if (!task || !window.confirm(`Xoá task “${task.title}”?`)) return;
      removeTask(taskId);
    },
    [removeTask, taskRecords],
  );

  const saveTask = useCallback(
    (input: StudyTaskInput) => {
      if (!editor) return;

      if (editor.mode === "create") {
        const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `task-${Date.now()}`;
        setTaskRecords((current) => [...current, { id, ...input }]);
      } else {
        setTaskRecords((current) =>
          current.map((task) => (task.id === editor.taskId ? { id: task.id, ...input } : task)),
        );
      }

      setEditor(null);
    },
    [editor],
  );

  const editingTask = editor?.mode === "edit" ? taskRecords.find((task) => task.id === editor.taskId) : undefined;

  return (
    <>
      <div className="study-focus-board grid items-start gap-4 xl:grid-cols-2">
        <StudyPanel
          title="Chủ điểm ngữ pháp"
          meta={`${topics.length} chủ điểm`}
          icon={SaveIcon}
          tone="library"
          className="order-2 xl:order-1"
        >
          <div className="grid grid-cols-2 gap-x-2 gap-y-4 p-4 sm:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
            {topics.map((topic, index) => (
              <TopicDisk key={topic.id} topic={topic} index={index} onOpen={() => onOpenTopic(topic.id)} />
            ))}
          </div>
        </StudyPanel>

        <StudyPanel
          title="Lịch học tuần"
          icon={CalendarDaysIcon}
          tone="planner"
          className="order-1 xl:order-2"
        >
          <div className="p-4">
            {upcomingTask ? (
              <UpcomingTaskCard
                task={upcomingTask}
                onOpenTopic={() => onOpenTopic(upcomingTask.topic.id)}
                onEdit={() => openEditTask(upcomingTask.id)}
                onDelete={() => requestDeleteTask(upcomingTask.id)}
              />
            ) : (
              <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border-[3px] border-dashed border-[var(--study-ink)] bg-[var(--study-paper)] p-6 text-center">
                <BookOpenCheckIcon className="size-10 text-[var(--study-ink-muted)]" aria-hidden="true" />
                <p className="mt-3 font-bold text-[var(--study-ink)]">Chưa có task sắp tới.</p>
                <button
                  type="button"
                  onClick={openCreateTask}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-yellow)] px-4 py-2 text-sm font-bold text-[var(--study-ink)] shadow-[3px_3px_0_var(--study-ink)]"
                >
                  <PlusIcon className="size-4" aria-hidden="true" />
                  Thêm task đầu tiên
                </button>
              </div>
            )}

            <WeeklyTimeline
              tasks={tasks}
              weekStart={weekStart}
              now={now}
              upcomingTask={upcomingTask}
              onAddTask={openCreateTask}
              onEditTask={openEditTask}
              onDeleteTask={requestDeleteTask}
            />
          </div>
        </StudyPanel>
      </div>

      {editor && (editor.mode === "create" || editingTask) ? (
        <StudyTaskSheet
          key={editor.mode === "edit" ? editor.taskId : editor.suggestedStartAt}
          mode={editor.mode}
          topics={topics}
          weekStart={formatWallDate(weekStart)}
          weekEnd={formatWallDate(weekEnd)}
          suggestedStartAt={editor.mode === "create" ? editor.suggestedStartAt : editingTask?.startAt ?? suggestedStartAt}
          initialTask={editingTask}
          onClose={() => setEditor(null)}
          onSubmit={saveTask}
          onDelete={
            editor.mode === "edit" && editingTask ? () => removeTask(editingTask.id) : undefined
          }
        />
      ) : null}
    </>
  );
}
