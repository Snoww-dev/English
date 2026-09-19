import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllLessons } from "@/lib/content";


export const dynamic = "force-dynamic";

export default async function LessonsIndexPage() {
  const rows = await getAllLessons();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bài học</h1>
        <p className="text-muted-foreground">
          {rows.length} bài học, mỗi bài gắn với một chủ điểm ngữ pháp.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(({ lesson, topicTitle }) => (
          <Link key={lesson.id} href={`/lessons/${lesson.slug}`}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{lesson.title}</CardTitle>
                  <Badge variant="outline">{lesson.level}</Badge>
                </div>
              </CardHeader>
              {topicTitle && (
                <CardContent className="text-sm text-muted-foreground">
                  Chủ điểm: {topicTitle}
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
