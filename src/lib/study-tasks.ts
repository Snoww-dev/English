export const STUDY_TASK_COLOR_OPTIONS = [
  { id: "pink", label: "Hồng", className: "bg-[var(--study-pink-soft)]" },
  { id: "blue", label: "Xanh dương", className: "bg-[var(--study-blue-soft)]" },
  { id: "purple", label: "Tím", className: "bg-[var(--study-purple-soft)]" },
  { id: "cyan", label: "Xanh ngọc", className: "bg-[var(--study-cyan-soft)]" },
  { id: "green", label: "Xanh lá", className: "bg-[var(--study-green-soft)]" },
  { id: "yellow", label: "Vàng", className: "bg-[var(--study-yellow-soft)]" },
  { id: "orange", label: "Cam", className: "bg-[var(--study-orange-soft)]" },
] as const;

export type StudyTaskColorId = (typeof STUDY_TASK_COLOR_OPTIONS)[number]["id"];

export type StudyTaskInput = {
  topicId: number;
  title: string;
  details: string;
  startAt: string;
  endAt: string;
  deadlineAt: string;
  colorId: StudyTaskColorId;
  imageDataUrl: string | null;
};

export type StudyTaskRecord = StudyTaskInput & {
  id: string;
};

const WALL_CLOCK_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export function formatWallDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatWallTimeValue(date: Date) {
  const hour = date.getUTCHours().toString().padStart(2, "0");
  const minute = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

export function formatWallDateTime(date: Date) {
  return `${formatWallDate(date)}T${formatWallTimeValue(date)}`;
}

export function parseWallDateTime(value: string) {
  return new Date(`${value}:00.000Z`);
}

function isValidWallDateTime(value: unknown): value is string {
  return (
    typeof value === "string" &&
    WALL_CLOCK_PATTERN.test(value) &&
    !Number.isNaN(parseWallDateTime(value).getTime())
  );
}

export function isStudyTaskColorId(value: unknown): value is StudyTaskColorId {
  return STUDY_TASK_COLOR_OPTIONS.some((option) => option.id === value);
}

function normalizeStudyTaskRecord(value: unknown): StudyTaskRecord | null {
  if (!value || typeof value !== "object") return null;

  const task = value as Partial<StudyTaskRecord>;
  const { id, topicId, title, details, startAt, endAt, deadlineAt } = task;
  if (
    typeof id !== "string" ||
    id.length === 0 ||
    typeof topicId !== "number" ||
    !Number.isInteger(topicId) ||
    typeof title !== "string" ||
    title.trim().length === 0 ||
    typeof details !== "string" ||
    !isValidWallDateTime(startAt) ||
    !isValidWallDateTime(endAt) ||
    !isValidWallDateTime(deadlineAt)
  ) {
    return null;
  }

  const fallbackColor =
    STUDY_TASK_COLOR_OPTIONS[Math.abs(topicId) % STUDY_TASK_COLOR_OPTIONS.length].id;
  const imageDataUrl =
    typeof task.imageDataUrl === "string" && /^data:image\/(?:png|jpeg|webp);base64,/i.test(task.imageDataUrl)
      ? task.imageDataUrl
      : null;

  return {
    id,
    topicId,
    title,
    details,
    startAt,
    endAt,
    deadlineAt,
    colorId: isStudyTaskColorId(task.colorId) ? task.colorId : fallbackColor,
    imageDataUrl,
  };
}

export function readStudyTasks(raw: string | null) {
  if (raw === null) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const normalized = parsed.map(normalizeStudyTaskRecord);
    if (normalized.some((task) => task === null)) return null;
    return normalized as StudyTaskRecord[];
  } catch {
    return null;
  }
}

export function getStudyTaskStorageKey(weekStart: Date) {
  return `english-study:weekly-tasks:v1:${formatWallDate(weekStart)}`;
}
