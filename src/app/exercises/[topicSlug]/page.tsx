import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ExercisePractice } from "@/components/exercise-practice";
import { getTopicBySlug, getExercisesForTopic } from "@/lib/content";


export const dynamic = "force-dynamic";

export default async function TopicExercisesPage({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;
  const topic = await getTopicBySlug(topicSlug);
  if (!topic) notFound();

  const topicExercises = await getExercisesForTopic(topic.id);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge>{topic.level}</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">
          Luyện tập: {topic.title}
        </h1>
        <p className="text-muted-foreground">
          Trả lời từng câu rồi nhấn &quot;Nộp bài&quot; — AI sẽ chấm điểm và giải thích ngay.
        </p>
      </div>

      <div className="space-y-4">
        {topicExercises.map((exercise) => (
          <ExercisePractice
            key={exercise.id}
            exercise={{
              id: exercise.id,
              type: exercise.type,
              prompt: exercise.prompt,
              difficulty: exercise.difficulty,
              choices: exercise.choices,
            }}
          />
        ))}
      </div>
    </div>
  );
}
