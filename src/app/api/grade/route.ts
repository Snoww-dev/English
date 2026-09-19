import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { exercises, exerciseAttempts } from "@/db/schema";
import { gradeExerciseAnswer } from "@/lib/grading";

const requestSchema = z.object({
  exerciseId: z.number().int().positive(),
  answer: z.string().min(1, "Answer must not be empty"),
});

export async function POST(req: NextRequest) {
  const body = requestSchema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json(
      { error: body.error.flatten() },
      { status: 400 },
    );
  }

  const { exerciseId, answer } = body.data;

  const [exercise] = await db
    .select()
    .from(exercises)
    .where(eq(exercises.id, exerciseId))
    .limit(1);

  if (!exercise) {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  }

  try {
    const result = await gradeExerciseAnswer({
      exercisePrompt: exercise.prompt,
      referenceAnswer: exercise.referenceAnswer,
      userAnswer: answer,
      exerciseType: exercise.type,
    });

    const [attempt] = await db
      .insert(exerciseAttempts)
      .values({
        exerciseId: exercise.id,
        userAnswer: answer,
        score: result.score,
        isCorrect: result.isCorrect,
        feedback: result.feedback,
        corrected: result.corrected,
      })
      .returning();

    return NextResponse.json({ attempt, result });
  } catch (error) {
    console.error("Grading failed", error);
    const message = error instanceof Error ? error.message : "Grading failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
