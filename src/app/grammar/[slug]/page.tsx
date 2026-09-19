import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownContent } from "@/components/markdown-content";
import { getTopicBySlug, getLessonsForTopic, getExercisesForTopic } from "@/lib/content";


export const dynamic = "force-dynamic";

export default async function GrammarTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  const [topicLessons, topicExercises] = await Promise.all([
    getLessonsForTopic(topic.id),
    getExercisesForTopic(topic.id),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{topic.level}</Badge>
          <Badge variant="outline">{topic.category}</Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{topic.title}</h1>
        <p className="text-muted-foreground">{topic.summary}</p>
      </div>

      <MarkdownContent content={topic.content} />

      <div className="flex flex-wrap gap-2 border-t pt-4">
        {topicLessons.map((lesson) => (
          <Button
            key={lesson.id}
            render={<Link href={`/lessons/${lesson.slug}`} />}
            variant="outline"
          >
            Đọc bài học: {lesson.title}
          </Button>
        ))}
        {topicExercises.length > 0 && (
          <Button render={<Link href={`/exercises/${topic.slug}`} />}>
            Luyện tập ({topicExercises.length} bài)
          </Button>
        )}
      </div>
    </div>
  );
}
