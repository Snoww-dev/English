import OpenAI from "openai";
import { z } from "zod";

const gradingResultSchema = z.object({
  score: z.number().min(0).max(100),
  isCorrect: z.boolean(),
  feedback: z.string(),
  corrected: z.string().nullable(),
});

export type GradingResult = z.infer<typeof gradingResultSchema>;

let client: OpenAI | null = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set. Copy .env.example to .env.local and add your key.",
    );
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export async function gradeExerciseAnswer(params: {
  exercisePrompt: string;
  referenceAnswer: string;
  userAnswer: string;
  exerciseType: string;
}): Promise<GradingResult> {
  const { exercisePrompt, referenceAnswer, userAnswer, exerciseType } = params;

  const response = await getClient().chat.completions.create({
    model: process.env.OPENAI_GRADING_MODEL || "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a strict but encouraging English grammar tutor grading a student's exercise answer.
Grade fairly: accept valid alternative phrasings, minor spelling variants, and correct answers that differ from the reference answer if they are grammatically valid.
Always respond with a single JSON object matching this exact shape:
{
  "score": number (0-100, 100 = fully correct),
  "isCorrect": boolean (true if score >= 80),
  "feedback": string (2-4 sentences in Vietnamese explaining what was right/wrong and why, referencing the grammar rule),
  "corrected": string | null (the corrected/ideal version of the student's answer, or null if already fully correct)
}`,
      },
      {
        role: "user",
        content: `Exercise type: ${exerciseType}
Exercise prompt: ${exercisePrompt}
Reference/expected answer: ${referenceAnswer}
Student's answer: ${userAnswer}

Grade the student's answer.`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from grading model.");
  }

  const parsed = gradingResultSchema.parse(JSON.parse(raw));
  return parsed;
}
