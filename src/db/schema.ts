import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof cefrLevels)[number];

export const exerciseTypes = [
  "fill_blank",
  "sentence_correction",
  "translation",
  "free_response",
  "multiple_choice",
] as const;
export type ExerciseType = (typeof exerciseTypes)[number];

export const grammarTopics = pgTable("grammar_topics", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: text("title").notNull(),
  level: varchar("level", { length: 2 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  topicId: integer("topic_id").references(() => grammarTopics.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  level: varchar("level", { length: 2 }).notNull(),
  content: text("content").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").references(() => grammarTopics.id, {
    onDelete: "cascade",
  }),
  lessonId: integer("lesson_id").references(() => lessons.id, {
    onDelete: "set null",
  }),
  type: varchar("type", { length: 40 }).notNull(),
  prompt: text("prompt").notNull(),
  referenceAnswer: text("reference_answer").notNull(),
  choices: jsonb("choices").$type<string[] | null>(),
  difficulty: varchar("difficulty", { length: 2 }).notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const exerciseAttempts = pgTable("exercise_attempts", {
  id: serial("id").primaryKey(),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  userAnswer: text("user_answer").notNull(),
  score: integer("score").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  feedback: text("feedback").notNull(),
  corrected: text("corrected"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
