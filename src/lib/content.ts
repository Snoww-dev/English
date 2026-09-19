import { asc, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  grammarTopics,
  lessons,
  exercises,
  exerciseAttempts,
} from "@/db/schema";

export async function getAllTopics() {
  return db
    .select()
    .from(grammarTopics)
    .orderBy(asc(grammarTopics.orderIndex));
}

export async function getTopicBySlug(slug: string) {
  const [topic] = await db
    .select()
    .from(grammarTopics)
    .where(eq(grammarTopics.slug, slug))
    .limit(1);
  return topic ?? null;
}

export async function getLessonsForTopic(topicId: number) {
  return db
    .select()
    .from(lessons)
    .where(eq(lessons.topicId, topicId))
    .orderBy(asc(lessons.orderIndex));
}

export async function getAllLessons() {
  return db
    .select({
      lesson: lessons,
      topicTitle: grammarTopics.title,
      topicSlug: grammarTopics.slug,
    })
    .from(lessons)
    .leftJoin(grammarTopics, eq(lessons.topicId, grammarTopics.id))
    .orderBy(asc(lessons.orderIndex));
}

export async function getLessonBySlug(slug: string) {
  const [row] = await db
    .select({
      lesson: lessons,
      topicTitle: grammarTopics.title,
      topicSlug: grammarTopics.slug,
    })
    .from(lessons)
    .leftJoin(grammarTopics, eq(lessons.topicId, grammarTopics.id))
    .where(eq(lessons.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getExercisesForTopic(topicId: number) {
  return db
    .select()
    .from(exercises)
    .where(eq(exercises.topicId, topicId))
    .orderBy(asc(exercises.orderIndex));
}

export async function getExerciseById(id: number) {
  const [exercise] = await db
    .select()
    .from(exercises)
    .where(eq(exercises.id, id))
    .limit(1);
  return exercise ?? null;
}

export async function getRecentAttempts(limit = 20) {
  return db
    .select({
      attempt: exerciseAttempts,
      exercisePrompt: exercises.prompt,
      topicTitle: grammarTopics.title,
      topicSlug: grammarTopics.slug,
    })
    .from(exerciseAttempts)
    .leftJoin(exercises, eq(exerciseAttempts.exerciseId, exercises.id))
    .leftJoin(grammarTopics, eq(exercises.topicId, grammarTopics.id))
    .orderBy(desc(exerciseAttempts.createdAt))
    .limit(limit);
}

export async function getProgressSummary() {
  const [totals] = await db
    .select({
      totalAttempts: count(exerciseAttempts.id),
      avgScore: sql<number>`coalesce(avg(${exerciseAttempts.score}), 0)`,
      correctCount: sql<number>`coalesce(sum(case when ${exerciseAttempts.isCorrect} then 1 else 0 end), 0)`,
    })
    .from(exerciseAttempts);

  const [exerciseTotals] = await db
    .select({ totalExercises: count(exercises.id) })
    .from(exercises);

  const perTopic = await db
    .select({
      topicId: grammarTopics.id,
      topicTitle: grammarTopics.title,
      topicSlug: grammarTopics.slug,
      totalExercises: count(exercises.id),
      attempted: sql<number>`count(distinct ${exerciseAttempts.exerciseId})`,
      avgScore: sql<number>`coalesce(avg(${exerciseAttempts.score}), 0)`,
    })
    .from(grammarTopics)
    .leftJoin(exercises, eq(exercises.topicId, grammarTopics.id))
    .leftJoin(
      exerciseAttempts,
      eq(exerciseAttempts.exerciseId, exercises.id),
    )
    .groupBy(grammarTopics.id, grammarTopics.title, grammarTopics.slug)
    .orderBy(asc(grammarTopics.orderIndex));

  return {
    totalAttempts: Number(totals?.totalAttempts ?? 0),
    avgScore: Number(totals?.avgScore ?? 0),
    correctCount: Number(totals?.correctCount ?? 0),
    totalExercises: Number(exerciseTotals?.totalExercises ?? 0),
    perTopic: perTopic.map((row) => ({
      ...row,
      totalExercises: Number(row.totalExercises),
      attempted: Number(row.attempted),
      avgScore: Number(row.avgScore),
    })),
  };
}
