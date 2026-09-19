"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Exercise = {
  id: number;
  type: string;
  prompt: string;
  difficulty: string;
  choices: string[] | null;
};

type GradeResponse = {
  result: {
    score: number;
    isCorrect: boolean;
    feedback: string;
    corrected: string | null;
  };
};

const typeLabel: Record<string, string> = {
  fill_blank: "Điền từ",
  sentence_correction: "Sửa câu",
  translation: "Dịch câu",
  free_response: "Tự luận",
  multiple_choice: "Trắc nghiệm",
};

export function ExercisePractice({ exercise }: { exercise: Exercise }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grade, setGrade] = useState<GradeResponse["result"] | null>(null);

  async function handleSubmit() {
    if (!answer.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId: exercise.id, answer }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message ?? data.error ?? "Chấm bài thất bại");
      }
      setGrade((data as GradeResponse).result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <CardTitle className="text-base font-medium leading-snug">
          {exercise.prompt}
        </CardTitle>
        <div className="flex shrink-0 gap-1">
          <Badge variant="outline">{typeLabel[exercise.type] ?? exercise.type}</Badge>
          <Badge variant="secondary">{exercise.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {exercise.choices ? (
          <div className="flex flex-wrap gap-2">
            {exercise.choices.map((choice) => (
              <Button
                key={choice}
                type="button"
                size="sm"
                variant={answer === choice ? "default" : "outline"}
                onClick={() => setAnswer(choice)}
              >
                {choice}
              </Button>
            ))}
          </div>
        ) : (
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Nhập câu trả lời của bạn..."
            rows={2}
          />
        )}

        <Button onClick={handleSubmit} disabled={loading || !answer.trim()}>
          {loading ? "Đang chấm..." : "Nộp bài"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {grade && (
          <div
            className={cn(
              "rounded-md border p-3 text-sm space-y-1",
              grade.isCorrect
                ? "border-green-500/40 bg-green-500/10"
                : "border-amber-500/40 bg-amber-500/10",
            )}
          >
            <p className="font-medium">
              {grade.isCorrect ? "✅ Đúng" : "⚠️ Chưa chính xác"} — {grade.score}/100
            </p>
            <p>{grade.feedback}</p>
            {grade.corrected && (
              <p className="text-muted-foreground">
                Gợi ý câu đúng: <span className="italic">{grade.corrected}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
