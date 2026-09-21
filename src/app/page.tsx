import { Dashboard } from "@/components/dashboard";
import {
  getAllTopics,
  getAllLessons,
  getAllExercises,
  getProgressSummary,
  getRecentAttempts,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [topics, lessonsRows, exercises, progress, recentAttempts] = await Promise.all([
    getAllTopics(),
    getAllLessons(),
    getAllExercises(),
    getProgressSummary(),
    getRecentAttempts(12),
  ]);

  return (
    <Dashboard
      topics={topics}
      lessonsRows={lessonsRows}
      exercises={exercises}
      progress={progress}
      recentAttempts={recentAttempts}
      nowIso={new Date().toISOString()}
    />
  );
}
