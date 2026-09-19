import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownContent } from "@/components/markdown-content";
import { getLessonBySlug } from "@/lib/content";


export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = await getLessonBySlug(slug);
  if (!row) notFound();

  const { lesson, topicTitle, topicSlug } = row;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge>{lesson.level}</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
        {topicTitle && topicSlug && (
          <p className="text-sm text-muted-foreground">
            Thuộc chủ điểm:{" "}
            <Link href={`/grammar/${topicSlug}`} className="text-primary hover:underline">
              {topicTitle}
            </Link>
          </p>
        )}
      </div>

      <MarkdownContent content={lesson.content} />

      {topicSlug && (
        <div className="border-t pt-4">
          <Button render={<Link href={`/exercises/${topicSlug}`} />}>
            Luyện tập chủ điểm này
          </Button>
        </div>
      )}
    </div>
  );
}
