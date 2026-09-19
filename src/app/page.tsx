import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DuolingoLaunchButton } from "@/components/duolingo-launch-button";
import { getAllTopics, getProgressSummary } from "@/lib/content";


export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [topics, progress] = await Promise.all([
    getAllTopics(),
    getProgressSummary(),
  ]);

  const completionPct =
    progress.totalExercises > 0
      ? Math.round(
          (progress.perTopic.reduce((sum, t) => sum + Math.min(t.attempted, t.totalExercises), 0) /
            progress.totalExercises) *
            100,
        )
      : 0;

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Học tiếng Anh toàn diện
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Ngữ pháp, bài học và bài tập được chấm chi tiết bởi AI — cộng thêm lối
          tắt sang Duolingo để luyện thêm mỗi ngày.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button render={<Link href="/grammar" />}>Xem ngữ pháp</Button>
          <Button render={<Link href="/exercises" />} variant="outline">
            Bắt đầu luyện tập
          </Button>
          <DuolingoLaunchButton />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Chủ điểm ngữ pháp
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {topics.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Bài tập đã làm
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {progress.totalAttempts} / {progress.totalExercises}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Điểm trung bình
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {progress.avgScore.toFixed(0)}/100
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Tiến độ tổng thể</h2>
          <span className="text-sm text-muted-foreground">{completionPct}%</span>
        </div>
        <Progress value={completionPct} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Chủ điểm ngữ pháp</h2>
          <Link href="/grammar" className="text-sm text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {topics.slice(0, 6).map((topic) => (
            <Link key={topic.id} href={`/grammar/${topic.slug}`}>
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                    <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs font-medium">
                      {topic.level}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {topic.summary}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
