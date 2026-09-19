import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProgressSummary, getRecentAttempts } from "@/lib/content";


export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const [summary, recent] = await Promise.all([
    getProgressSummary(),
    getRecentAttempts(15),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tiến độ học tập</h1>
        <p className="text-muted-foreground">
          Toàn bộ lịch sử làm bài được lưu lại trong database.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng lượt làm bài
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {summary.totalAttempts}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Điểm trung bình
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {summary.avgScore.toFixed(0)}/100
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số câu đúng
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {summary.correctCount}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Tiến độ theo chủ điểm</h2>
        <div className="space-y-3">
          {summary.perTopic.map((topic) => {
            const pct =
              topic.totalExercises > 0
                ? Math.round(
                    (Math.min(topic.attempted, topic.totalExercises) /
                      topic.totalExercises) *
                      100,
                  )
                : 0;
            return (
              <div key={topic.topicId} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <Link
                    href={`/exercises/${topic.topicSlug}`}
                    className="font-medium hover:underline"
                  >
                    {topic.topicTitle}
                  </Link>
                  <span className="text-muted-foreground">
                    {Math.min(topic.attempted, topic.totalExercises)}/{topic.totalExercises}
                    {topic.attempted > 0 && ` · TB ${topic.avgScore.toFixed(0)}`}
                  </span>
                </div>
                <Progress value={pct} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-medium">Lịch sử gần đây</h2>
        <div className="space-y-2">
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Chưa có bài nào được làm. Vào mục Luyện tập để bắt đầu.
            </p>
          )}
          {recent.map(({ attempt, exercisePrompt, topicTitle }) => (
            <Card key={attempt.id}>
              <CardContent className="flex items-start justify-between gap-3 py-3 text-sm">
                <div className="space-y-0.5">
                  <p className="font-medium">{exercisePrompt}</p>
                  {topicTitle && (
                    <p className="text-muted-foreground text-xs">{topicTitle}</p>
                  )}
                </div>
                <Badge variant={attempt.isCorrect ? "default" : "secondary"}>
                  {attempt.score}/100
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
