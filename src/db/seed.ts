import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { db } from "./index";
import { grammarTopics, lessons, exercises } from "./schema";

type TopicSeed = {
  slug: string;
  title: string;
  level: string;
  category: string;
  summary: string;
  content: string;
  lesson: { slug: string; title: string; content: string };
  exercises: Array<{
    type: string;
    prompt: string;
    referenceAnswer: string;
    choices?: string[];
    difficulty: string;
  }>;
};

const topics: TopicSeed[] = [
  {
    slug: "present-simple-vs-continuous",
    title: "Present Simple vs Present Continuous",
    level: "A1",
    category: "tense",
    summary: "Habits and facts vs actions happening right now.",
    content: `## Present Simple
Use for habits, routines, facts, and permanent situations.
- Form: I/You/We/They + verb | He/She/It + verb-s
- Example: *She works in a bank.* / *Water boils at 100°C.*

## Present Continuous
Use for actions happening now, or temporary situations around now.
- Form: am/is/are + verb-ing
- Example: *She is working late this week.* / *Look, it is raining!*

## Key contrast
Stative verbs (know, like, believe, own, want) are rarely used in the continuous form: say *I know the answer*, not *I am knowing*.`,
    lesson: {
      slug: "present-simple-vs-continuous-lesson",
      title: "Choosing between Present Simple and Present Continuous",
      content: `Read the two example paragraphs, then notice which tense is used for repeated actions and which for actions in progress.

**Routine (Present Simple):** *I get up at 7, have breakfast, and take the bus to work.*

**Right now (Present Continuous):** *I am sitting on the bus, and it is raining heavily.*

Time expressions that hint at Present Simple: always, usually, every day, on Mondays.
Time expressions that hint at Present Continuous: now, right now, at the moment, these days, currently.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'Listen! Someone ___ (knock) on the door.'",
        referenceAnswer: "is knocking",
        difficulty: "A1",
      },
      {
        type: "fill_blank",
        prompt: "Complete: 'My sister ___ (not/like) coffee, she prefers tea.'",
        referenceAnswer: "does not like / doesn't like",
        difficulty: "A1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct the sentence: 'She is knowing the answer already.'",
        referenceAnswer: "She knows the answer already.",
        difficulty: "A2",
      },
      {
        type: "free_response",
        prompt:
          "Write two sentences about yourself: one using Present Simple for a routine, one using Present Continuous for something happening today.",
        referenceAnswer:
          "Example: 'I usually study in the evening.' (Present Simple - routine) + 'Today I am studying grammar.' (Present Continuous - happening now).",
        difficulty: "A2",
      },
    ],
  },
  {
    slug: "past-simple-vs-present-perfect",
    title: "Past Simple vs Present Perfect",
    level: "A2",
    category: "tense",
    summary: "Finished past events with a time vs past events connected to now.",
    content: `## Past Simple
Use for actions completed at a specific, finished time in the past.
- Form: verb-ed (regular) / irregular form
- Example: *I visited Paris in 2019.*

## Present Perfect
Use for past actions connected to the present: no specific time, recent news, life experience, or an action continuing up to now.
- Form: have/has + past participle
- Example: *I have visited Paris three times.* (life experience, no specific date)

## Key contrast
Present Perfect never combines with a finished time expression like *yesterday*, *in 2019*, *last week*. Use Past Simple for those.`,
    lesson: {
      slug: "past-simple-vs-present-perfect-lesson",
      title: "Finished time vs connection to now",
      content: `Ask: does the sentence give a specific finished time (yesterday, last year, in 2020, when I was young)? Use **Past Simple**.
Does the sentence talk about experience, change, or a result that matters now, with no specific time? Use **Present Perfect**.

Compare: *I lost my keys yesterday.* (Past Simple, specific time) vs *I have lost my keys.* (Present Perfect, result matters now — I can't get in!)`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'I ___ (never/be) to Japan.'",
        referenceAnswer: "have never been",
        difficulty: "A2",
      },
      {
        type: "fill_blank",
        prompt: "Complete: 'We ___ (watch) that movie last night.'",
        referenceAnswer: "watched",
        difficulty: "A2",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'She has finished her homework yesterday.'",
        referenceAnswer: "She finished her homework yesterday.",
        difficulty: "B1",
      },
      {
        type: "translation",
        prompt:
          "Translate to English, choosing the correct tense: 'Tôi đã sống ở Hà Nội được 5 năm rồi (và vẫn đang sống ở đó).'",
        referenceAnswer: "I have lived in Hanoi for 5 years.",
        difficulty: "B1",
      },
    ],
  },
  {
    slug: "articles-a-an-the",
    title: "Articles: a / an / the",
    level: "A1",
    category: "article",
    summary: "When to use a, an, the, or no article at all.",
    content: `## a / an
Use for a non-specific, singular, countable noun, mentioned for the first time.
- *a* before a consonant sound: *a book*, *a university* (sounds like "yoo")
- *an* before a vowel sound: *an apple*, *an hour* (silent h)

## the
Use for something specific, already known to both speaker and listener, or unique.
- *The sun is bright today.* (unique)
- *I bought a book. The book was expensive.* (already mentioned)

## No article
Use with plural/uncountable nouns in a general sense, and most proper nouns.
- *Dogs are loyal.* / *I love music.* / *She lives in France.*`,
    lesson: {
      slug: "articles-lesson",
      title: "First mention vs specific reference",
      content: `The first time you mention a countable singular noun, use *a/an*. Every time after that, once it's identified, use *the*.

*I saw a cat in the garden. The cat was black.*

For unique things (the sun, the internet, the moon) or things specified by context (the door of this room), always use *the*.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'She is ___ honest person.' (a/an/the)",
        referenceAnswer: "an",
        difficulty: "A1",
      },
      {
        type: "fill_blank",
        prompt:
          "Complete: 'I bought ___ umbrella. ___ umbrella was red.' (a/an/the)",
        referenceAnswer: "a; The",
        difficulty: "A1",
      },
      {
        type: "multiple_choice",
        prompt: "Choose the correct option: '___ Everest is the highest mountain.'",
        referenceAnswer: "Mount",
        choices: ["A", "An", "The", "Mount"],
        difficulty: "A2",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'I love the music and the dogs in general.'",
        referenceAnswer: "I love music and dogs in general.",
        difficulty: "A2",
      },
    ],
  },
  {
    slug: "prepositions-time-place",
    title: "Prepositions of Time & Place",
    level: "A1",
    category: "preposition",
    summary: "in, on, at for time and place.",
    content: `## Time
- **at**: precise time — *at 5 o'clock*, *at night*, *at the weekend* (UK)
- **on**: days and dates — *on Monday*, *on 1st May*
- **in**: longer periods — *in July*, *in 2024*, *in the morning*

## Place
- **at**: a point — *at the bus stop*, *at the door*
- **on**: a surface — *on the table*, *on the wall*
- **in**: an enclosed space — *in the box*, *in London*`,
    lesson: {
      slug: "prepositions-time-place-lesson",
      title: "Choosing at / on / in",
      content: `Think of time like a zoom lens: **at** for a point (5 o'clock), **on** for a day (Monday), **in** for a longer period (July, 2024, the morning).

For place, **at** is a point, **on** is a surface, **in** is inside a space or area.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'The meeting is ___ 9 a.m. ___ Friday.'",
        referenceAnswer: "at; on",
        difficulty: "A1",
      },
      {
        type: "fill_blank",
        prompt: "Complete: 'The keys are ___ the table, ___ the kitchen.'",
        referenceAnswer: "on; in",
        difficulty: "A1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'I was born at 1998, in 14 March.'",
        referenceAnswer: "I was born in 1998, on 14 March.",
        difficulty: "A2",
      },
      {
        type: "free_response",
        prompt:
          "Write one sentence describing where you live using 'in', and one describing a meeting time using 'at'.",
        referenceAnswer:
          "Example: 'I live in Ho Chi Minh City.' + 'The class starts at 8 a.m.'",
        difficulty: "A2",
      },
    ],
  },
  {
    slug: "comparatives-superlatives",
    title: "Comparatives and Superlatives",
    level: "A2",
    category: "adjective",
    summary: "Comparing two or more things.",
    content: `## Comparative (two things)
- Short adjectives: add **-er** — *taller*, *bigger* (double consonant)
- Long adjectives: **more** + adjective — *more expensive*
- Irregular: good → better, bad → worse, far → farther/further

## Superlative (three or more things)
- Short adjectives: **the** + adjective + **-est** — *the tallest*
- Long adjectives: **the most** + adjective — *the most expensive*
- Irregular: good → the best, bad → the worst`,
    lesson: {
      slug: "comparatives-superlatives-lesson",
      title: "-er/-est vs more/most",
      content: `Count the syllables: one syllable (or two ending in -y) usually takes **-er/-est** (*happy → happier → happiest*). Three or more syllables take **more/most** (*more beautiful, most beautiful*). Always double the final consonant after a short vowel: *big → bigger*.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'This book is ___ (interesting) than that one.'",
        referenceAnswer: "more interesting",
        difficulty: "A2",
      },
      {
        type: "fill_blank",
        prompt: "Complete: 'Today is ___ (hot) day of the year so far.'",
        referenceAnswer: "the hottest",
        difficulty: "A2",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'She is the most tall student in the class.'",
        referenceAnswer: "She is the tallest student in the class.",
        difficulty: "A2",
      },
      {
        type: "translation",
        prompt: "Translate: 'Đây là bộ phim hay nhất tôi từng xem.'",
        referenceAnswer: "This is the best movie I have ever seen.",
        difficulty: "B1",
      },
    ],
  },
  {
    slug: "future-forms",
    title: "Future Forms: will / going to / present continuous",
    level: "B1",
    category: "tense",
    summary: "Predictions, plans, and arrangements.",
    content: `## will
Spontaneous decisions, predictions without evidence, promises/offers.
- *I think it will rain.* / *I'll help you carry that.*

## going to
Plans and intentions already decided, or predictions with present evidence.
- *I'm going to study medicine.* / *Look at those clouds — it's going to rain.*

## Present Continuous
Fixed arrangements with a specific time/place, usually involving other people.
- *I'm meeting Anna at 6pm tomorrow.*`,
    lesson: {
      slug: "future-forms-lesson",
      title: "Decision, plan, or arrangement?",
      content: `Ask: is this decided right now (**will**), already planned in my mind (**going to**), or arranged with someone else at a fixed time (**Present Continuous**)? The three often overlap in real speech, but exams test this distinction directly.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt:
          "Complete: 'A: The phone is ringing. B: Don't worry, I ___ (answer) it.'",
        referenceAnswer: "will answer / 'll answer",
        difficulty: "B1",
      },
      {
        type: "fill_blank",
        prompt:
          "Complete: 'We ___ (already/decide) to move to Da Nang next year.' Use 'going to'.",
        referenceAnswer: "are going to move",
        difficulty: "B1",
      },
      {
        type: "sentence_correction",
        prompt:
          "Correct: 'I meeting my dentist tomorrow at 3pm.' (fixed arrangement)",
        referenceAnswer: "I am meeting my dentist tomorrow at 3pm.",
        difficulty: "B1",
      },
      {
        type: "free_response",
        prompt:
          "Write a sentence with 'going to' about a plan you already made for next week.",
        referenceAnswer:
          "Example: 'I'm going to visit my parents next week.' (plan already decided)",
        difficulty: "B1",
      },
    ],
  },
  {
    slug: "modals-obligation-advice",
    title: "Modal Verbs of Obligation & Advice",
    level: "B1",
    category: "modal",
    summary: "must, have to, should, ought to, don't have to, mustn't.",
    content: `## Strong obligation
- **must**: obligation from the speaker's own judgement — *I must call her back.*
- **have to**: obligation from an external rule — *I have to wear a uniform at work.*

## Prohibition vs no obligation
- **mustn't**: prohibited — *You mustn't smoke here.*
- **don't have to**: not necessary, but allowed — *You don't have to come if you're busy.*

## Advice
- **should / ought to**: recommendation — *You should see a doctor.*`,
    lesson: {
      slug: "modals-obligation-advice-lesson",
      title: "Obligation, prohibition, or advice?",
      content: `The most common trap: **mustn't** (forbidden) vs **don't have to** (optional). *You mustn't park here* means it's forbidden. *You don't have to park here* means you can, but it's not required.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'You ___ smoke inside the building.' (prohibited)",
        referenceAnswer: "mustn't",
        difficulty: "B1",
      },
      {
        type: "fill_blank",
        prompt:
          "Complete: 'You ___ bring your laptop, but you can if you want.' (not necessary)",
        referenceAnswer: "don't have to",
        difficulty: "B1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'You should to see a doctor about that cough.'",
        referenceAnswer: "You should see a doctor about that cough.",
        difficulty: "B1",
      },
      {
        type: "free_response",
        prompt:
          "Give advice to a friend who is stressed before an exam, using 'should'.",
        referenceAnswer:
          "Example: 'You should get more sleep and take short breaks while studying.'",
        difficulty: "B1",
      },
    ],
  },
  {
    slug: "first-second-conditionals",
    title: "First & Second Conditionals",
    level: "B1",
    category: "conditional",
    summary: "Real future possibility vs unreal/hypothetical present.",
    content: `## First Conditional (real, possible)
If + present simple, will + verb.
- *If it rains, I will stay home.*

## Second Conditional (unreal/hypothetical)
If + past simple, would + verb.
- *If I won the lottery, I would travel the world.* (unlikely / imaginary)

Note: 'were' is preferred over 'was' for all persons in formal second conditional: *If I were you...*`,
    lesson: {
      slug: "first-second-conditionals-lesson",
      title: "Real possibility vs imagination",
      content: `First conditional describes something that could realistically happen. Second conditional describes something imaginary, unlikely, or contrary to current fact. Compare: *If I have time, I'll call you* (realistic) vs *If I had more time, I would learn the piano* (hypothetical, I probably won't).`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'If I ___ (have) time tomorrow, I will visit you.'",
        referenceAnswer: "have",
        difficulty: "B1",
      },
      {
        type: "fill_blank",
        prompt: "Complete: 'If I ___ (be) you, I would apologize.'",
        referenceAnswer: "were",
        difficulty: "B1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'If I will see him, I will tell him.'",
        referenceAnswer: "If I see him, I will tell him.",
        difficulty: "B1",
      },
      {
        type: "translation",
        prompt: "Translate: 'Nếu tôi có nhiều tiền hơn, tôi sẽ mua một căn nhà.'",
        referenceAnswer: "If I had more money, I would buy a house.",
        difficulty: "B2",
      },
    ],
  },
  {
    slug: "passive-voice",
    title: "Passive Voice",
    level: "B2",
    category: "voice",
    summary: "Shifting focus from the doer to the action/receiver.",
    content: `## Form
be (in the correct tense) + past participle
- Active: *Chefs prepare the meal.* → Passive: *The meal is prepared (by chefs).*
- Active: *They built this house in 1990.* → Passive: *This house was built in 1990.*

## When to use it
- The doer is unknown, unimportant, or obvious.
- Formal/scientific writing focuses on the process, not who did it.
- To emphasize the receiver of the action.`,
    lesson: {
      slug: "passive-voice-lesson",
      title: "Moving the object to subject position",
      content: `To build the passive: take the object of the active sentence, make it the subject, use the correct form of **be**, then the past participle. Keep the same tense as the original active sentence. Add **by + agent** only if it's important information.`,
    },
    exercises: [
      {
        type: "sentence_correction",
        prompt:
          "Rewrite in the passive: 'Someone stole my bike last night.'",
        referenceAnswer: "My bike was stolen last night.",
        difficulty: "B2",
      },
      {
        type: "fill_blank",
        prompt:
          "Complete the passive: 'This report ___ (write) by the finance team every month.'",
        referenceAnswer: "is written",
        difficulty: "B2",
      },
      {
        type: "sentence_correction",
        prompt: "Rewrite in the passive: 'They are building a new bridge.'",
        referenceAnswer: "A new bridge is being built.",
        difficulty: "B2",
      },
      {
        type: "free_response",
        prompt:
          "Rewrite this sentence in the passive voice: 'The company will launch the product next month.'",
        referenceAnswer: "The product will be launched next month.",
        difficulty: "B2",
      },
    ],
  },
  {
    slug: "reported-speech",
    title: "Reported Speech",
    level: "B2",
    category: "speech",
    summary: "Reporting what someone said, with tense/pronoun shifts.",
    content: `## Backshift rule
When the reporting verb is in the past (said, told), tenses usually shift back one step:
- Present Simple → Past Simple: *"I work here."* → *She said she worked there.*
- Present Perfect → Past Perfect: *"I have finished."* → *He said he had finished.*
- will → would, can → could, must → had to

## Pronouns & time words also change
*"I'll see you tomorrow"* → *She said she would see me the next day.*`,
    lesson: {
      slug: "reported-speech-lesson",
      title: "Backshifting tenses and adjusting references",
      content: `Three things change when you report speech: the **tense** (shift back one step), the **pronouns** (match the new speaker's perspective), and **time/place words** (tomorrow → the next day, here → there, this → that).`,
    },
    exercises: [
      {
        type: "sentence_correction",
        prompt:
          "Report this speech: She said, \"I am tired.\" → She said that ___",
        referenceAnswer: "she was tired.",
        difficulty: "B2",
      },
      {
        type: "sentence_correction",
        prompt:
          "Report this speech: He said, \"I will call you tomorrow.\" → He said ___",
        referenceAnswer: "he would call me the next day.",
        difficulty: "B2",
      },
      {
        type: "fill_blank",
        prompt:
          "Complete: 'They told us they ___ (finish) the project already.' (originally: \"We have finished the project.\")",
        referenceAnswer: "had finished",
        difficulty: "C1",
      },
      {
        type: "free_response",
        prompt:
          "Report this sentence in reported speech: Maria said, \"I can't come to the party tonight.\"",
        referenceAnswer:
          "Maria said (that) she couldn't come to the party that night.",
        difficulty: "B2",
      },
    ],
  },
  {
    slug: "relative-clauses",
    title: "Relative Clauses",
    level: "B2",
    category: "clause",
    summary: "Defining and non-defining clauses with who/which/that/whose.",
    content: `## Defining relative clauses
Give essential information; no commas.
- *The man who called you is my brother.*
- *that* can replace *who/which* here.

## Non-defining relative clauses
Give extra, non-essential information; always with commas, never with *that*.
- *My brother, who lives in Canada, called yesterday.*

## whose / where / when
- *whose* (possession): *The woman whose car was stolen called the police.*
- *where* (place): *The café where we met is closed now.*`,
    lesson: {
      slug: "relative-clauses-lesson",
      title: "Defining vs non-defining",
      content: `Ask: can you delete this clause without losing essential meaning? If yes, it's non-defining — use commas, never *that*. If no, it's defining — no commas, *that* is allowed.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'The book ___ I borrowed from you was excellent.'",
        referenceAnswer: "that / which",
        difficulty: "B2",
      },
      {
        type: "sentence_correction",
        prompt:
          "Correct: 'My mother, that is a doctor, works at the hospital.'",
        referenceAnswer: "My mother, who is a doctor, works at the hospital.",
        difficulty: "B2",
      },
      {
        type: "fill_blank",
        prompt:
          "Complete: 'This is the restaurant ___ we had our first date.'",
        referenceAnswer: "where",
        difficulty: "B2",
      },
      {
        type: "free_response",
        prompt:
          "Combine into one sentence using a relative clause: 'I have a colleague. Her son studies medicine.'",
        referenceAnswer: "I have a colleague whose son studies medicine.",
        difficulty: "C1",
      },
    ],
  },
  {
    slug: "third-mixed-conditionals",
    title: "Third & Mixed Conditionals",
    level: "C1",
    category: "conditional",
    summary: "Unreal past regrets and mixed-time hypotheticals.",
    content: `## Third Conditional (unreal past)
If + past perfect, would have + past participle.
- *If I had studied harder, I would have passed the exam.* (I didn't study, I didn't pass)

## Mixed Conditional
Combines a past condition with a present result, or a present condition with a past result.
- *If I had taken that job, I would be rich now.* (past condition → present result)
- *If she weren't so shy, she would have spoken up yesterday.* (present condition → past result)`,
    lesson: {
      slug: "third-mixed-conditionals-lesson",
      title: "Unreal past and mixed time frames",
      content: `Third conditional talks entirely about an unreal past — both the condition and result are finished and different from reality. Mixed conditionals combine two different time frames: a past cause with a present effect, or a permanent present trait with a past effect.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt:
          "Complete: 'If she ___ (leave) earlier, she wouldn't have missed the train.'",
        referenceAnswer: "had left",
        difficulty: "C1",
      },
      {
        type: "sentence_correction",
        prompt:
          "Correct: 'If I would have known, I would have told you.'",
        referenceAnswer: "If I had known, I would have told you.",
        difficulty: "C1",
      },
      {
        type: "free_response",
        prompt:
          "Write a mixed conditional sentence: a past condition with a present result, about a career choice.",
        referenceAnswer:
          "Example: 'If I had studied law, I would be a lawyer now.'",
        difficulty: "C1",
      },
      {
        type: "translation",
        prompt:
          "Translate: 'Nếu tôi không bỏ lỡ chuyến bay đó, giờ tôi đã ở Paris rồi.'",
        referenceAnswer: "If I hadn't missed that flight, I would be in Paris now.",
        difficulty: "C1",
      },
    ],
  },
  {
    slug: "gerunds-vs-infinitives",
    title: "Gerunds vs Infinitives",
    level: "B1",
    category: "verb-pattern",
    summary: "Verbs followed by -ing vs verbs followed by to + verb.",
    content: `## Gerund (-ing) only
enjoy, avoid, finish, suggest, mind, consider, practice
- *I enjoy reading before bed.*

## Infinitive (to + verb) only
want, decide, plan, promise, agree, hope, refuse
- *She decided to leave early.*

## Both, different meaning
- **stop doing** (stop the activity) vs **stop to do** (pause in order to do something else)
- **remember doing** (memory of a past action) vs **remember to do** (not forget a future task)`,
    lesson: {
      slug: "gerunds-vs-infinitives-lesson",
      title: "Which verbs take which pattern",
      content: `There's no single logical rule — these patterns must largely be memorized per verb. Focus on the high-frequency verb lists first (enjoy/avoid/finish + -ing; want/decide/promise + to), then learn the double-meaning pairs (stop, remember, try) as special cases.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'I suggest ___ (leave) before the traffic starts.'",
        referenceAnswer: "leaving",
        difficulty: "B1",
      },
      {
        type: "fill_blank",
        prompt: "Complete: 'He promised ___ (call) me back.'",
        referenceAnswer: "to call",
        difficulty: "B1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'She avoids to eat sugar.'",
        referenceAnswer: "She avoids eating sugar.",
        difficulty: "B1",
      },
      {
        type: "free_response",
        prompt:
          "Explain the difference in meaning between 'I stopped smoking' and 'I stopped to smoke'.",
        referenceAnswer:
          "'I stopped smoking' = I quit the habit (gerund = the activity stopped). 'I stopped to smoke' = I paused another activity in order to smoke (infinitive = purpose).",
        difficulty: "B2",
      },
    ],
  },
  {
    slug: "phrasal-verbs-basics",
    title: "Phrasal Verbs Basics",
    level: "B1",
    category: "vocabulary",
    summary: "Common verb + particle combinations and separability.",
    content: `## What they are
A verb + one or two particles (prepositions/adverbs) that together create a new meaning.
- *give up* = quit — *He gave up smoking.*
- *look after* = take care of — *She looks after her grandmother.*
- *run into* = meet by chance — *I ran into an old friend.*

## Separable vs inseparable
- Separable: object can go between or after — *turn off the light / turn the light off* (but with pronouns: *turn it off*, never *turn off it*).
- Inseparable: object always after — *look after the baby*, not *look the baby after*.`,
    lesson: {
      slug: "phrasal-verbs-basics-lesson",
      title: "Meaning and word order",
      content: `Learn phrasal verbs as whole chunks with their meaning, not word-by-word. Pay special attention to separable ones with pronoun objects — the pronoun must go in the middle: *I picked it up*, not *I picked up it*.`,
    },
    exercises: [
      {
        type: "fill_blank",
        prompt:
          "Complete with the correct phrasal verb meaning 'quit': 'He finally ___ smoking last year.'",
        referenceAnswer: "gave up",
        difficulty: "B1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct the word order: 'Please turn off it before you leave.'",
        referenceAnswer: "Please turn it off before you leave.",
        difficulty: "B1",
      },
      {
        type: "fill_blank",
        prompt:
          "Complete: 'I ___ my old classmate at the airport yesterday.' (meet by chance)",
        referenceAnswer: "ran into",
        difficulty: "B1",
      },
      {
        type: "free_response",
        prompt:
          "Use the phrasal verb 'look after' correctly in a sentence about a pet.",
        referenceAnswer:
          "Example: 'My neighbor looks after my cat when I travel.'",
        difficulty: "B1",
      },
    ],
  },
  {
    slug: "inversion-emphasis",
    title: "Advanced Cohesion: Inversion & Emphasis",
    level: "C1",
    category: "advanced-structure",
    summary: "Inverted word order after negative adverbials, and cleft sentences for emphasis.",
    content: `## Inversion after negative/limiting adverbials
Formal/literary style: auxiliary moves before the subject.
- *Never have I seen such a beautiful sunset.*
- *Not only did she finish first, but she also broke the record.*
- *Rarely do we get such an opportunity.*

## Cleft sentences (emphasis)
- **It-cleft**: *It was Sarah who solved the problem.* (emphasizes Sarah)
- **What-cleft**: *What I need is more time.* (emphasizes "more time")`,
    lesson: {
      slug: "inversion-emphasis-lesson",
      title: "Fronting negative adverbials and using cleft sentences",
      content: `Inversion is mostly used in formal writing/speech for dramatic effect. After moving a negative/limiting adverbial (never, rarely, not only, under no circumstances) to the front, invert subject and auxiliary as in a question. Cleft sentences restructure a simple sentence to spotlight one piece of information.`,
    },
    exercises: [
      {
        type: "sentence_correction",
        prompt:
          "Rewrite with inversion: 'I have never seen such a mess.' → 'Never ___'",
        referenceAnswer: "have I seen such a mess.",
        difficulty: "C1",
      },
      {
        type: "sentence_correction",
        prompt:
          "Rewrite as an it-cleft to emphasize 'John': 'John broke the window.'",
        referenceAnswer: "It was John who broke the window.",
        difficulty: "C1",
      },
      {
        type: "fill_blank",
        prompt:
          "Complete: 'Not only ___ (she/win) the race, but she also set a new record.'",
        referenceAnswer: "did she win",
        difficulty: "C1",
      },
      {
        type: "free_response",
        prompt:
          "Rewrite this sentence as a what-cleft to emphasize what is needed: 'We need more funding.'",
        referenceAnswer: "What we need is more funding.",
        difficulty: "C1",
      },
    ],
  },
];

async function seed() {
  console.log(`Seeding ${topics.length} grammar topics...`);

  for (const [index, topic] of topics.entries()) {
    const [insertedTopic] = await db
      .insert(grammarTopics)
      .values({
        slug: topic.slug,
        title: topic.title,
        level: topic.level,
        category: topic.category,
        summary: topic.summary,
        content: topic.content,
        orderIndex: index,
      })
      .onConflictDoUpdate({
        target: grammarTopics.slug,
        set: {
          title: topic.title,
          level: topic.level,
          category: topic.category,
          summary: topic.summary,
          content: topic.content,
          orderIndex: index,
        },
      })
      .returning();

    const [insertedLesson] = await db
      .insert(lessons)
      .values({
        slug: topic.lesson.slug,
        topicId: insertedTopic.id,
        title: topic.lesson.title,
        level: topic.level,
        content: topic.lesson.content,
        orderIndex: index,
      })
      .onConflictDoUpdate({
        target: lessons.slug,
        set: {
          topicId: insertedTopic.id,
          title: topic.lesson.title,
          level: topic.level,
          content: topic.lesson.content,
          orderIndex: index,
        },
      })
      .returning();

    await db.delete(exercises).where(eq(exercises.topicId, insertedTopic.id));

    for (const [exIndex, ex] of topic.exercises.entries()) {
      await db.insert(exercises).values({
        topicId: insertedTopic.id,
        lessonId: insertedLesson.id,
        type: ex.type,
        prompt: ex.prompt,
        referenceAnswer: ex.referenceAnswer,
        choices: ex.choices ?? null,
        difficulty: ex.difficulty,
        orderIndex: exIndex,
      });
    }

    console.log(`  seeded: ${topic.title} (${topic.exercises.length} exercises)`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
