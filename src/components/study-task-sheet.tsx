"use client";

import Image from "next/image";
import {
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
} from "react";
import { CalendarClockIcon, ClipboardPasteIcon, ImagePlusIcon, Trash2Icon, XIcon } from "lucide-react";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { StudyBoardTopic } from "@/components/weekly-study-board";
import {
  isStudyTaskColorId,
  STUDY_TASK_COLOR_OPTIONS,
  type StudyTaskInput,
  type StudyTaskRecord,
} from "@/lib/study-tasks";

const FIELD_CLASS =
  "min-h-11 w-full rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-paper)] px-3 py-2 text-sm text-[var(--study-ink)] outline-none transition-shadow focus:ring-3 focus:ring-[var(--study-focus)]";
const LABEL_CLASS = "space-y-1.5 text-sm font-bold text-[var(--study-ink)]";
const MAX_SOURCE_IMAGE_BYTES = 12 * 1024 * 1024;
const MAX_STORED_IMAGE_BYTES = 700 * 1024;
const MAX_IMAGE_WIDTH = 800;
const MAX_IMAGE_HEIGHT = 600;

function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Không thể đọc ảnh."));
    reader.onerror = () => reject(new Error("Không thể đọc ảnh."));
    reader.readAsDataURL(blob);
  });
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Ảnh không hợp lệ hoặc đã bị hỏng."));
    image.src = dataUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

async function compressTaskImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Tệp đã chọn không phải là hình ảnh.");
  if (file.size > MAX_SOURCE_IMAGE_BYTES) throw new Error("Ảnh gốc cần nhỏ hơn 12 MB.");

  const sourceDataUrl = await readBlobAsDataUrl(file);
  const sourceImage = await loadImage(sourceDataUrl);
  const scale = Math.min(
    1,
    MAX_IMAGE_WIDTH / sourceImage.naturalWidth,
    MAX_IMAGE_HEIGHT / sourceImage.naturalHeight,
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sourceImage.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceImage.naturalHeight * scale));
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Trình duyệt không thể xử lý ảnh này.");
  context.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);

  let compressed = await canvasToBlob(canvas, "image/webp", 0.78);
  if (!compressed) compressed = await canvasToBlob(canvas, "image/jpeg", 0.78);
  if (compressed && compressed.size > MAX_STORED_IMAGE_BYTES) {
    compressed = await canvasToBlob(canvas, compressed.type || "image/webp", 0.55);
  }
  if (!compressed || compressed.size > MAX_STORED_IMAGE_BYTES) {
    throw new Error("Ảnh sau khi nén vẫn quá lớn. Hãy chọn ảnh đơn giản hoặc kích thước nhỏ hơn.");
  }

  return readBlobAsDataUrl(compressed);
}

type StudyTaskSheetProps = {
  mode: "create" | "edit";
  topics: StudyBoardTopic[];
  weekStart: string;
  weekEnd: string;
  suggestedStartAt: string;
  initialTask?: StudyTaskRecord;
  onClose: () => void;
  onSubmit: (task: StudyTaskInput) => void;
  onDelete?: () => void;
};

export function StudyTaskSheet({
  mode,
  topics,
  weekStart,
  weekEnd,
  suggestedStartAt,
  initialTask,
  onClose,
  onSubmit,
  onDelete,
}: StudyTaskSheetProps) {
  const [error, setError] = useState("");
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(initialTask?.imageDataUrl ?? null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const defaultTopic = topics.find((topic) => topic.id === initialTask?.topicId) ?? topics[0];
  const defaultColorId =
    initialTask?.colorId ??
    STUDY_TASK_COLOR_OPTIONS[(defaultTopic?.id ?? 0) % STUDY_TASK_COLOR_OPTIONS.length].id;
  const defaultStartAt = initialTask?.startAt ?? suggestedStartAt;
  const defaultEndAt =
    initialTask?.endAt ??
    `${defaultStartAt.slice(0, 11)}${(Number(defaultStartAt.slice(11, 13)) + 1).toString().padStart(2, "0")}:${defaultStartAt.slice(14)}`;
  const defaultDeadlineAt = initialTask?.deadlineAt ?? defaultEndAt;

  async function handleImageFile(file: File) {
    setError("");
    setIsProcessingImage(true);

    try {
      setImageDataUrl(await compressTaskImage(file));
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "Không thể thêm ảnh này.");
    } finally {
      setIsProcessingImage(false);
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (file) void handleImageFile(file);
  }

  function handlePaste(event: ClipboardEvent<HTMLElement>) {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith("image/"));
    const imageFile = imageItem?.getAsFile();
    if (!imageFile) return;

    event.preventDefault();
    void handleImageFile(imageFile);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const topicId = Number(values.get("topicId"));
    const title = String(values.get("title") ?? "").trim();
    const details = String(values.get("details") ?? "").trim();
    const date = String(values.get("date") ?? "");
    const startTime = String(values.get("startTime") ?? "");
    const endTime = String(values.get("endTime") ?? "");
    const deadlineAt = String(values.get("deadlineAt") ?? "");
    const colorId = values.get("colorId");
    const startAt = `${date}T${startTime}`;
    const endAt = `${date}T${endTime}`;

    if (!topics.some((topic) => topic.id === topicId)) {
      setError("Hãy chọn một chủ điểm hợp lệ.");
      return;
    }

    if (!title || !details) {
      setError("Tên task và nội dung task không được để trống.");
      return;
    }

    if (!isStudyTaskColorId(colorId)) {
      setError("Hãy chọn một màu task hợp lệ.");
      return;
    }

    if (date < weekStart || date > weekEnd) {
      setError("Ngày thực hiện phải nằm trong tuần đang hiển thị.");
      return;
    }

    if (endAt <= startAt) {
      setError("Giờ kết thúc phải sau giờ bắt đầu.");
      return;
    }

    if (deadlineAt < endAt) {
      setError("Deadline phải bằng hoặc sau giờ kết thúc task.");
      return;
    }

    onSubmit({ topicId, title, details, startAt, endAt, deadlineAt, colorId, imageDataUrl });
  }

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        onPaste={handlePaste}
        className="study-focus-board border-l-[3px] border-[var(--study-ink)] bg-[var(--study-planner-surface)] sm:max-w-xl"
      >
        <SheetHeader className="border-b-[3px] border-[var(--study-ink)] bg-[var(--study-mint)]">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[var(--study-mint-ink)]">
              <CalendarClockIcon className="size-5" aria-hidden="true" />
              <span className="font-heading text-xs font-bold tracking-[0.08em] uppercase">
                {mode === "create" ? "Thêm task" : "Sửa task"}
              </span>
            </div>
            <SheetTitle className="mt-2 text-[var(--study-ink)]">
              {mode === "create" ? "Lên lịch học mới" : initialTask?.title}
            </SheetTitle>
            <SheetDescription className="mt-1 text-[var(--study-ink-muted)]">
              Ghi rõ thời gian thực hiện, deadline và nội dung cần hoàn thành.
            </SheetDescription>
          </div>
          <SheetClose className="text-[var(--study-ink-muted)] hover:bg-black/10 hover:text-[var(--study-ink)]" />
        </SheetHeader>

        <SheetBody>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className={LABEL_CLASS}>
              <span>Chủ điểm</span>
              <select name="topicId" defaultValue={defaultTopic?.id} className={FIELD_CLASS} required>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="space-y-2">
              <legend className="text-sm font-bold text-[var(--study-ink)]">Màu task</legend>
              <div className="flex flex-wrap gap-3" aria-label="Chọn màu task">
                {STUDY_TASK_COLOR_OPTIONS.map((option) => (
                  <label key={option.id} className="cursor-pointer" title={option.label}>
                    <input
                      type="radio"
                      name="colorId"
                      value={option.id}
                      defaultChecked={option.id === defaultColorId}
                      className="peer sr-only"
                    />
                    <span
                      className={`block size-10 rounded-md border-2 border-[var(--study-ink)] shadow-[2px_2px_0_var(--study-ink)] transition-transform hover:-translate-y-0.5 peer-checked:outline-3 peer-checked:outline-offset-3 peer-checked:outline-[var(--study-focus)] ${option.className}`}
                    />
                    <span className="sr-only">{option.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-2">
              <span className="text-sm font-bold text-[var(--study-ink)]">Hình task</span>
              <div className="rounded-md border-2 border-dashed border-[var(--study-ink)] bg-[var(--study-paper)] p-3">
                {imageDataUrl ? (
                  <div className="relative overflow-hidden rounded-md border-2 border-[var(--study-ink)] bg-white">
                    <div className="relative aspect-video">
                      <Image
                        src={imageDataUrl}
                        alt="Ảnh minh hoạ của task"
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 540px"
                        className="object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageDataUrl(null)}
                      className="absolute top-2 right-2 inline-flex size-10 items-center justify-center rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-paper)] text-[var(--study-ink)] shadow-[2px_2px_0_var(--study-ink)]"
                      aria-label="Bỏ hình task"
                    >
                      <XIcon className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div className="flex min-h-28 flex-col items-center justify-center gap-2 text-center text-[var(--study-ink-muted)]">
                    <ClipboardPasteIcon className="size-8" aria-hidden="true" />
                    <p className="text-sm font-semibold">Nhấn Ctrl+V (hoặc ⌘V trên Mac) để dán hình</p>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-blue-soft)] px-4 py-2 text-sm font-bold text-[var(--study-ink)] shadow-[2px_2px_0_var(--study-ink)]">
                    <ImagePlusIcon className="size-4" aria-hidden="true" />
                    {isProcessingImage ? "Đang xử lý..." : imageDataUrl ? "Đổi hình" : "Chọn hình"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      disabled={isProcessingImage}
                      onChange={handleImageChange}
                    />
                  </label>
                  <span className="text-xs text-[var(--study-ink-muted)]">PNG, JPG hoặc WebP · tối đa 12 MB</span>
                </div>
              </div>
            </div>

            <label className={LABEL_CLASS}>
              <span>Tên task</span>
              <input
                name="title"
                type="text"
                defaultValue={initialTask?.title ?? defaultTopic?.title ?? ""}
                className={FIELD_CLASS}
                maxLength={120}
                required
              />
            </label>

            <label className={LABEL_CLASS}>
              <span>Nội dung cụ thể</span>
              <textarea
                name="details"
                defaultValue={initialTask?.details ?? defaultTopic?.summary ?? ""}
                className={`${FIELD_CLASS} min-h-28 resize-y`}
                maxLength={500}
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={LABEL_CLASS}>
                <span>Ngày thực hiện</span>
                <input
                  name="date"
                  type="date"
                  defaultValue={defaultStartAt.slice(0, 10)}
                  min={weekStart}
                  max={weekEnd}
                  className={FIELD_CLASS}
                  required
                />
              </label>

              <label className={LABEL_CLASS}>
                <span>Deadline cụ thể</span>
                <input
                  name="deadlineAt"
                  type="datetime-local"
                  defaultValue={defaultDeadlineAt}
                  min={`${weekStart}T08:00`}
                  className={FIELD_CLASS}
                  required
                />
              </label>

              <label className={LABEL_CLASS}>
                <span>Giờ bắt đầu</span>
                <input
                  name="startTime"
                  type="time"
                  defaultValue={defaultStartAt.slice(11)}
                  min="08:00"
                  max="21:45"
                  step={900}
                  className={FIELD_CLASS}
                  required
                />
              </label>

              <label className={LABEL_CLASS}>
                <span>Giờ kết thúc</span>
                <input
                  name="endTime"
                  type="time"
                  defaultValue={defaultEndAt.slice(11)}
                  min="08:15"
                  max="22:00"
                  step={900}
                  className={FIELD_CLASS}
                  required
                />
              </label>
            </div>

            {error ? (
              <p role="alert" className="rounded-md border-2 border-[#9d3158] bg-[#fde3ef] px-3 py-2 text-sm font-semibold text-[#7f2148]">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-[var(--study-ink)]/15 pt-4">
              <div>
                {mode === "edit" && onDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (deleteArmed) onDelete();
                      else setDeleteArmed(true);
                    }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-[#7f2148] bg-[#fde3ef] px-4 py-2 text-sm font-bold text-[#7f2148] shadow-[3px_3px_0_#7f2148] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--study-focus)] active:translate-y-0.5"
                  >
                    <Trash2Icon className="size-4" aria-hidden="true" />
                    {deleteArmed ? "Xác nhận xoá" : "Xoá task"}
                  </button>
                ) : null}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-11 rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-paper)] px-4 py-2 text-sm font-bold text-[var(--study-ink)]"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="min-h-11 rounded-md border-2 border-[var(--study-ink)] bg-[var(--study-mint-strong)] px-4 py-2 text-sm font-bold text-[var(--study-ink)] shadow-[3px_3px_0_var(--study-ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--study-focus)] active:translate-y-0.5"
                >
                  {mode === "create" ? "Thêm task" : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </form>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
