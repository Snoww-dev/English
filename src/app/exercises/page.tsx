import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProgressSummary } from "@/lib/content";


export const dynamic = "force-dynamic";

export default async function ExercisesIndexPage() {
  const { perTopic } = await getProgressSummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Luyện tập</h1>
        <p className="text-muted-foreground">
          Chọn một chủ điểm để làm bài tập — AI sẽ chấm và giải thích chi tiết ngay sau khi nộp.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {perTopic.map((topic) => (
          <Link key={topic.topicId} href={`/exercises/${topic.topicSlug}`}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{topic.topicTitle}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Đã làm {Math.min(topic.attempted, topic.totalExercises)}/{topic.totalExercises}
                </span>
                {topic.attempted > 0 && (
                  <Badge variant="secondary">TB {topic.avgScore.toFixed(0)}</Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
