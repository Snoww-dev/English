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
  lesson?: { slug: string; title: string; content: string };
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
    content: `## Thì hiện tại đơn (Present Simple)

**Cách chia động từ**
- \`to be\`: I + am · He/She/It/N số ít + is · You/We/They/N số nhiều + are
- Động từ thường: I/You/We/They/N số nhiều + V · He/She/It/N số ít + V-s/es

**Thể phủ định – nghi vấn**
- Phủ định (to be): is not/isn't, are not/aren't, I am not/I'm not
- Phủ định (động từ thường): do not/don't + V (I/you/we/they), does not/doesn't + V (he/she/it)
- Nghi vấn: Do/Does + S + V? · To be + S? · WH + do/does + S + V? · WH + to be + S?

**Cách dùng – nhận biết**
- Hành động thường xuyên xảy ra, có tính lặp lại, thói quen ở hiện tại.
- Cảm giác, nghề nghiệp, tình trạng hiện tại, tính chất, sự sở hữu.
- Một chân lý, một sự thật luôn đúng.
- Tiêu đề bài báo.
- Lịch trình của tàu, xe, máy bay, giờ đóng/mở.

**Trạng từ chỉ tần suất** (đứng sau \`to be\`, trước động từ thường):

| Tần suất | Trạng từ | Nghĩa |
| --- | --- | --- |
| 100% | \`always\` | luôn luôn |
| 80% | \`usually\` | thường thường |
| 60% | \`often\` | thường |
| 50% | \`sometimes\` | thỉnh thoảng |
| 30% | \`occasionally\` | đôi khi |
| 20% | \`seldom\` | ít khi |
| 10% | \`rarely\`, \`hardly ever\` | hầu như không |
| 0% | \`never\` | không bao giờ |

Thêm: \`generally\` (nói chung), \`normally\`/\`regularly\`/\`frequently\`/\`repeatedly\` (thường xuyên/lặp đi lặp lại), \`every + N\` (mỗi — *every month/week*), số lần + thời gian (*once a week* = 1 tuần 1 lần, *twice a year* = 1 năm 2 lần, *three times a day* = 3 lần 1 ngày).

## Thì hiện tại tiếp diễn (Present Continuous)

**Cách chia động từ**: \`be + V-ing\` — I → am · He/She/It/N số ít → is · You/We/They/N số nhiều → are

**Quy tắc thêm -ing**
1. Tận cùng \`e\` → bỏ \`e\`, thêm \`-ing\`: *use → using, improve → improving*
2. Tận cùng \`ee\` → thêm \`-ing\` bình thường: *see → seeing*
3. Động từ 1 âm tiết, nguyên âm + phụ âm → gấp đôi phụ âm + \`-ing\`: *run → running, dig → digging*
4. Động từ 2 âm tiết, trọng âm rơi vào âm thứ 2 → gấp đôi phụ âm cuối + \`-ing\`: *begin → beginning, admit → admitting*
5. Tận cùng \`ie\` → đổi thành \`y\` + \`-ing\`: *lie → lying, tie → tying*
6. Tận cùng \`c\` → thêm \`k\` + \`-ing\`: *picnic → picnicking, mimic → mimicking*

**Thể phủ định – nghi vấn**
- Phủ định: I am not + V-ing · He/She/It + is not + V-ing · You/We/They + are not + V-ing
- Nghi vấn: Am/Is/Are + S + V-ing? · WH + am/is/are + S + V-ing?

**Cách dùng – nhận biết**
- Hành động đang diễn ra ngay tại thời điểm nói.
- Với \`always\`: chỉ một thói quen gây khó chịu — \`be + always + V-ing\`. *You're always watching TV.*
- Một kế hoạch đã định sẵn sẽ xảy ra trong tương lai gần. *I'm flying to NY tomorrow.*

Trạng từ đặc trưng: \`now\`/\`right now\`, \`at the moment\`, \`currently\`, \`at present\`, \`today\`, \`this week/month/year\` — hoặc chỉ tương lai gần: \`tomorrow\`, \`next week\`, \`tonight\`, \`this afternoon\`, \`at 2 PM\`.

## So sánh nhanh
Động từ chỉ trạng thái (*know, like, believe, own, want*) hầu như không chia ở thể tiếp diễn: nói *I know the answer*, không nói *I am knowing the answer*.`,
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
    content: `## Quá khứ đơn (Past Simple)

Diễn tả hành động xảy ra ở quá khứ, đã kết thúc trong quá khứ, không còn tiếp diễn tới hiện tại.

**Dấu hiệu thời gian**: \`yesterday\` (hôm qua), \`last + N\` (*last week, last month*), \`N thời gian + ago\` (*a week ago*)

**\`to be\`**: I/He/She/It → \`was\` · You/We/They → \`were\`

**Động từ thường**
- Động từ có quy tắc: thêm \`-d\`/\`-ed\` — *scream → screamed*; tận cùng phụ âm + \`y\` → \`ied\` — *study → studied*
- Động từ bất quy tắc: học theo bảng — *go → went, see → saw*
- Không cần phân biệt chủ ngữ số ít hay số nhiều.

**Thể phủ định – nghi vấn**
- Phủ định: S + did not + V · \`to be\`: was not / were not
- Nghi vấn: Did + S + V? · WH + did + S + V? · (với \`to be\`, đảo \`to be\` lên trước chủ ngữ: *to be + S?*)

**Bảng động từ bất quy tắc thường gặp**

| Nguyên mẫu | Quá khứ đơn | Quá khứ phân từ | Nghĩa |
| --- | --- | --- | --- |
| arise | arose | arisen | nảy sinh |
| awake | awoke | awoken | thức tỉnh |
| be | was, were | been | là, thì |
| bear | bore | born/borne | chịu |
| beat | beat | beaten/beat | đánh đập |
| become | became | become | trở thành |
| begin | began | begun | bắt đầu |
| bend | bent | bent | bẻ cong |
| bet | bet | bet | cá cược |
| bid | bid | bid | đấu thầu/giá |
| bind | bound | bound | trói buộc |
| bite | bit | bitten | cắn |
| bleed | bled | bled | chảy máu |
| blow | blew | blown | thổi |
| break | broke | broken | phá vỡ |
| breed | bred | bred | sinh ra |
| bring | brought | brought | mang tới |
| broadcast | broadcast(ed) | broadcast(ed) | truyền phát |
| build | built | built | xây dựng |
| burn | burned/burnt | burned/burnt | đốt cháy |
| burst | burst | burst | nổ |
| buy | bought | bought | mua |

## Hiện tại hoàn thành (Present Perfect)

**Công thức**
- ✅ Khẳng định: S + have/has + V3 (past participle) — *I have visited Japan twice.* (Tôi đã từng đến Nhật hai lần.)
- ✅ Phủ định: S + have/has + not + V3 — *He has not (hasn't) seen that movie before.* (Anh ấy chưa từng xem bộ phim đó.)
- ✅ Câu hỏi: Have/Has + S + V3? — *Have you ever been to Paris?* (Bạn đã từng đến Paris chưa?)

**Cách dùng**
- ✅ Diễn tả hành động xảy ra trong quá khứ nhưng không rõ thời gian, và kết quả còn liên quan đến hiện tại. *I have lost my keys.* (Tôi đã mất chìa khóa rồi.) → Kết quả: tôi không thể mở cửa.
- ✅ Diễn tả một kinh nghiệm/trải nghiệm trong quá khứ (thường dùng với \`ever\` và \`never\`). *Have you ever eaten sushi?*
- ✅ Diễn tả hành động bắt đầu trong quá khứ và tiếp tục đến hiện tại (thường đi với \`for\` hoặc \`since\`). *I have lived in this city for 10 years.*
- ✅ Diễn tả một hành động đã xảy ra nhiều lần trong quá khứ. *He has visited London three times.*
- ✅ Diễn tả hành động vừa mới xảy ra (thường đi với \`just\`, \`recently\`, \`lately\`). *She has just finished her lunch.*

**Dấu hiệu nhận biết**
- 👉 \`for\` + khoảng thời gian (*for 2 years, for a long time...*)
- 👉 \`since\` + mốc thời gian (*since 2010, since last week...*)
- 👉 \`ever\`, \`never\` (dùng trong trải nghiệm)
- 👉 \`just\`, \`recently\`, \`lately\` (hành động vừa mới xảy ra)
- 👉 \`yet\`, \`already\` (dùng trong câu phủ định hoặc nghi vấn)

**So sánh Hiện tại hoàn thành vs Quá khứ đơn**

| Hiện Tại Hoàn Thành (Present Perfect) | Quá Khứ Đơn (Past Simple) |
| --- | --- |
| Hành động xảy ra trong quá khứ nhưng không rõ thời gian hoặc có ảnh hưởng đến hiện tại. | Hành động xảy ra trong quá khứ và đã kết thúc hẳn, có thời gian xác định. |
| *I have seen that movie.* (Tôi đã từng xem phim đó.) | *I saw that movie last night.* (Tôi đã xem phim đó tối qua.) |
| *She has visited Paris.* (Cô ấy đã từng đến Paris.) | *She visited Paris in 2019.* (Cô ấy đã đến Paris vào năm 2019.) |
| *I have lost my keys.* (Tôi đã mất chìa khóa — hiện tại vẫn chưa tìm thấy.) | *I lost my keys yesterday.* (Tôi đã mất chìa khóa hôm qua — chuyện đã qua rồi.) |

**Khi nào KHÔNG dùng thì hiện tại hoàn thành?**
- 🚫 Không dùng khi có mốc thời gian cụ thể trong quá khứ. ❌ *I have visited Japan in 2018.* → ✅ *I visited Japan in 2018.*
- 🚫 Không dùng với động từ trạng thái (State Verbs) ở thể tiếp diễn. ❌ *I have been knowing him for 5 years.* → ✅ *I have known him for 5 years.*

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
- Đứng trước danh từ đếm được số ít.
- \`a\` + phụ âm, \`an\` + nguyên âm.
- Cũng dùng trong cụm: tỉ lệ, số lượng, thành ngữ thời gian/số đếm.

**Sử dụng khi người nói không chỉ rõ về đối tượng đang nói tới**
- *I met a friend.* (Tôi đã gặp một người bạn.)
- *I work in a factory in New York.* (Tôi làm việc tại một nhà máy ở New York.)
- *I borrowed a pencil from a passenger sitting next to me.* (Tôi đã mượn một cây bút chì từ một vị hành khách ngồi kế tôi.)

\`a\` dùng trước danh từ bắt đầu bằng **âm** phụ âm — *a dog, a pilot, a teacher, a university* ((*) chú ý: "university" được phát âm như một phụ âm /ju/).
\`an\` dùng trước danh từ bắt đầu bằng **âm** nguyên âm — *an engineer, an elephant, an athlete, an hour* (h câm).

## the
- Danh từ đã biết rõ, hoặc đề cập trước đó: *I saw a dog. The dog ran away.*
- Vật duy nhất: *the sun, the world*
- Chỉ cả nhóm: *the poor* (người nghèo), *the tiger is a dangerous animal*
- Tên riêng, tên tập thể: *the Smiths* → gia đình Smith

**Dùng khi người nói đang nói về đối tượng cụ thể mà cả người nói và người nghe đều biết**
- *The car over there is fast.* (Chiếc xe kia thì quá nhanh.)
- *The president of the United States is giving a speech tonight.*

Lần đầu tiên nhắc tới, dùng \`a/an\`; lần tiếp theo khi lặp lại đối tượng đó, dùng \`the\`:
- *I live in a house. The house is quite old and has four bedrooms.*
- *I ate in a Chinese restaurant. The restaurant was very good.*

## Mạo từ với danh từ đếm được và không đếm được

- \`a/an\`: dùng với danh từ **đếm được**. *I'd like a piece of cake. I lent him a book. I drank a cup of tea.*
- \`the\`: dùng với danh từ **không đếm được**, hoặc trong các trường hợp mạo từ có thể lược bỏ như trên: *"The two countries reached the peace..."* (một hiệp ước hòa bình cụ thể) so với *"...reached peace..."* (hòa bình nói chung); *"He drank the water."* hoặc *"He drank water."*

## Trường hợp không dùng mạo từ

- Không dùng trước tên quốc gia, tiểu bang, hồ, núi, đường: *He lives in Washington near Mount Rainier.* / *They live in Northern British Columbia.* / *They climbed Mount Everest.*
  - (*) Ngoại lệ: dùng \`the\` khi đó là một quốc gia được tạo thành từ các tiểu bang, như Hoa Kỳ — *the United States*.
- Không dùng với danh từ không đếm được mang ý chung chung: *I like music.*
- Không dùng với danh từ số nhiều không xác định, nói về đối tượng một cách tổng quát: *Dogs are loyal.* / *He writes books.* / *She likes sweets.* / *Do you like jazz music?* / *She ate bread with butter in the morning.*
- Không dùng trước tính từ sở hữu, sở hữu cách: *my friend, John's car*
- Không dùng trước tên bữa ăn (nếu không có gì đặc biệt): *I had lunch.*`,
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
    content: `## Cụm cố định với giới từ (Collocations)

- Danh từ + Giới từ: *She felt anger at his change of holiday plan.*
- Tính từ + Giới từ: *She is busy with her make-up.*
- Động từ + Giới từ: *She believes in ghosts & angels.*

## Chỉ địa điểm — Prepositions of Place

- **at** — ở tại: nơi ở, học tập, làm việc, địa điểm trong thành phố/thị trấn; tên tòa nhà, địa chỉ cụ thể (*at 35 BVD street*); địa chỉ email.
- **in** — ở bên trong: một không gian (*in the box*); thành phố, đất nước (*in Vietnam*); phương hướng (*in the north*); ô tô, taxi (*in the car*).
- **on** — ở trên: bề mặt, vật thể (*on the sofa*); phố, tầng trong tòa nhà (*on the tenth floor*); phương hướng trái/phải (*on the left*); phương tiện giao thông công cộng (*on the bus*).
- **under** — ở dưới
- **behind** — sau
- **in front of** — trước
- **opposite** — đối diện
- **between** — giữa (... và ...)
- **near** — gần
- **next to** / **by** / **beside** — bên cạnh

## Chỉ thời gian — Prepositions of Time

- **in** — khung thời gian lớn: tháng (*in December*), mùa (*in Winter*), năm (*in 1999*), thế kỷ/thập kỷ (*in the 21st century*); khoảng thời gian (*in three days*); buổi trong ngày — sáng/chiều/tối (*in the morning*); cụm cố định: *in time* (vừa kịp lúc).
- **on** — ngày cụ thể: *on Monday, on Sunday, on December 14th, on Saturday*; cụm cố định: *on special occasions*, *on time* (đúng giờ).
- **at** — thời gian cụ thể: giờ (*at 5 o'clock*), ngày lễ (*at Christmas*), cuối tuần (*at the weekend*); buổi trong ngày cụ thể: *at noon, at night, at lunch*; cụm cố định: *at the same time* (cùng lúc).
- **throughout** — xuyên suốt: *throughout the night*
- **between ... and ...** — giữa ... và ...
- **during** — trong khoảng thời gian nào đó: *during the night*
- **from ... to/till/until** — từ ... đến`,
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
    content: `## So sánh bằng (Equality)

S + V + as + adj/adv + as — hoặc — S + V + as + N + as

Áp dụng cho so sánh mức độ ngang nhau, hoặc so sánh bằng danh từ.
- *She is as tall as her brother.*
- *He has as many books as I do.*

## So sánh hơn (Comparative)

- Tính/trạng từ **ngắn** (1 âm tiết, hoặc kết thúc bằng \`-y\`, \`-le\`, \`-ow\`): S + V + adj/adv + **-er** + than — *John is taller than me.*
- Tính/trạng từ **dài** (2 âm tiết trở lên): S + V + **more** + adj/adv + than — *This book is more interesting than that one.*

## So sánh nhất (Superlative)

- Tính/trạng từ **ngắn**: S + V + **the** + adj/adv + **-est** (+ N) — *He is the fastest runner.*
- Tính/trạng từ **dài**: S + V + **the most** + adj/adv (+ N) — *She is the most beautiful girl.*

## Tính từ ngắn — lưu ý chính tả

- 1 âm tiết: thêm **-er/-est** — *small → smaller → the smallest*, *big → bigger → the biggest* (gấp đôi phụ âm cuối)
- 2 âm tiết trở lên: **more/most** + adj/adv — *beautiful → more beautiful → the most beautiful*, *less beautiful → the least beautiful*
- Ngoại lệ (2 âm tiết vẫn dùng -er/-est): tận cùng bằng \`-y\`, \`-er\`, \`-ow\`, \`-le\`, \`-et\` — *happy → happier → the happiest*

## Bảng so sánh bất quy tắc

| Gốc | Hơn | Nhất |
| --- | --- | --- |
| good | better | (the) best |
| bad | worse | (the) worst |
| far | farther/further | (the) farthest/furthest |
| little | less | (the) least |
| many/much | more | (the) most |
| old | older/elder | (the) oldest/eldest |
| late | later | (the) latest |
| well (trạng từ) | better | (the) best |
| badly (trạng từ) | worse | (the) worst |`,
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

\`will\` diễn đạt sự kiện sẽ xảy ra trong tương lai, đặc biệt là những chuyện người nói biết chắc hoặc đã lên kế hoạch. \`will\` thường được dùng trong các thì tương lai như một trợ động từ:

- Thì tương lai đơn: S + will ('ll) + V-bare
- Thì tương lai tiếp diễn: S + will ('ll) + be + V-ing
- Thì tương lai hoàn thành: S + will ('ll) + have + V3/-ed
- Thì tương lai hoàn thành tiếp diễn: S + will ('ll) + have been + V-ing
- Câu hỏi: Will + S + V(nt)? hoặc WH + will + S + V(nt)?

**Cách dùng**
- Đưa ra quyết định (nhanh chóng ngay tại thời điểm nói) hoặc tính toán từ trước.
- Đưa ra lời mời, yêu cầu, đề nghị giúp đỡ, lời hứa hoặc lời cảnh báo.
- Câu điều kiện loại 1, diễn tả một giả định có thể xảy ra ở hiện tại và tương lai.
- Dự đoán không có căn cứ chính xác.

Dấu hiệu: \`next day/week/month\`, \`tomorrow\`; \`think/suppose/believe/guess/perhaps/hope/expect\` (nghĩ/tin/cho là...), \`perhaps\`/\`probably\` (có lẽ), \`promise\` (hứa).

- *Jennifer will turn 6 this Saturday.* (Jennifer sẽ lên 6 vào thứ 7 tuần này.)
- *I will come to your party tomorrow.* (Tôi sẽ đến bữa tiệc của bạn vào ngày mai.)
- *Will you be my Valentine?* (Anh sẽ là Valentine của em chứ?)

## going to

\`be going to\` diễn tả những sự việc, hành động có kế hoạch, mục đích, dự định cụ thể trong tương lai.

| Câu | Cấu trúc (động từ thường) |
| --- | --- |
| Khẳng định | S + am/is/are + going to + V-inf |
| Phủ định | S + am/is/are not + going to + V-inf |
| Nghi vấn Yes/No | Am/Is/Are + S + going to + V-inf? |
| Nghi vấn thông tin | Từ hỏi + am/is/are + S + going to + V-inf? |

**Cách dùng**
- Khi đã quyết định hoặc dự định làm điều gì đó trong tương lai (chắc chắn xảy ra).
- Khi có bằng chứng cho thấy điều gì đó sắp xảy ra.
- Đưa ra lời hứa hoặc yêu cầu.
- Dự đoán có khả năng xảy ra cao.

Dấu hiệu: \`tomorrow\`, \`next day/week/month\`, \`in + time\`

- *She is going to be a successful tennis player one day.* (Cô ấy sẽ trở thành một vận động viên tennis thành công một ngày nào đó.)
- *He is going to help me with my homework tomorrow.* (Anh ấy sẽ giúp tôi làm bài tập về nhà ngày mai.)

**Chú ý**: trong thì tương lai gần, cụm \`be going to\` không đi với \`go\` và \`come\` — thay vào đó dùng thì hiện tại tiếp diễn:
- *They are going to the party.* (Họ sẽ đi dự tiệc.)
- *My mother is coming to the hospital tomorrow.* (Mẹ tôi sẽ đến viện vào ngày mai.)

Khi \`be going to\` được dùng ở thì quá khứ (\`was/were going to\`), nó diễn tả một điều sắp xảy ra nhưng cuối cùng lại không xảy ra: *I thought you were going to fall but you have avoided the hole.* (Tôi tưởng bạn sẽ ngã nhưng bạn đã tránh được cái hố.)

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
    title: "Động từ khiếm khuyết (Modal Verbs): Tổng hợp",
    level: "B1",
    category: "modal",
    summary: "Cấu trúc chung, toàn bộ modal verbs thường gặp, so sánh các cặp dễ nhầm và thể bị động.",
    content: `## 1. Cấu trúc chung
S + Modal Verb + V (nguyên mẫu)

📌 Không chia động từ theo sau, dù chủ ngữ là ngôi thứ mấy.
- *He can swim.* ✅ (không nói *can swims*)
- *They must go now.* ✅

## 2. Danh sách các động từ khiếm khuyết thường gặp

| Modal Verb | Nghĩa / Cách dùng | Ví dụ |
| --- | --- | --- |
| \`can\` | Khả năng, hoặc sự cho phép/xin phép/yêu cầu | *I can speak English.* — *Can I go out now?* |
| \`could\` | Quá khứ của \`can\`, hoặc khả năng/xin phép/đề nghị lịch sự hơn | *When I was young, I could run fast.* — *Could you help me, please?* |
| \`may\` | Khả năng có thể xảy ra, hoặc xin phép lịch sự | *It may rain tonight.* — *May I sit here?* |
| \`might\` | Quá khứ của \`may\`, khả năng ít chắc chắn hơn | *He might come later.* (có thể sẽ đến, nhưng không chắc) |
| \`must\` | Sự bắt buộc, cần thiết hoặc chắc chắn | *You must wear a helmet.* — *He must be tired.* (chắc hẳn anh ấy mệt) |
| \`have to\` | Cũng diễn tả bắt buộc, thường theo quy định/thực tế | *I have to go to work at 7 a.m.* |
| \`will\` | Tương lai, hoặc quyết định ngay lúc nói | *I will call you later.* |
| \`would\` | Quá khứ của \`will\`, hoặc câu điều kiện, lời mời lịch sự | *I would help you if I had time.* — *Would you like some coffee?* |
| \`shall\` | Ý kiến, lời hứa, đề nghị, gợi ý (thường với I/We) | *Shall we go out tonight?* |
| \`should\` | Khuyên bảo, gợi ý; bắt buộc nhẹ hơn \`must\` | *You should see a doctor.* |
| \`ought to\` | Tương tự \`should\` nhưng trang trọng/mạnh hơn; nghĩa vụ hoặc lời khuyên đạo đức | *You ought to apologize to her.* |
| \`may/might have\` + P2 | Dự đoán điều có thể đã xảy ra | *He may have missed the train.* |
| \`must have\` + P2 | Dự đoán chắc chắn điều đã xảy ra trong quá khứ | *She must have gone home early.* |
| \`should have\` + P2 | Lẽ ra nên làm (nhưng không làm) | *You should have called me.* |
| \`could have\` + P2 | Có thể đã làm, nhưng không làm | *I could have won the race.* |

## 3. So sánh nhanh một số cặp dễ nhầm

| Cặp | Phân biệt |
| --- | --- |
| \`must\` vs \`have to\` | \`must\`: bắt buộc do người nói (chủ quan) — \`have to\`: bắt buộc do hoàn cảnh, quy định |
| \`should\` vs \`ought to\` | Nghĩa gần giống nhau, nhưng \`ought to\` trang trọng hơn |
| \`may\` vs \`might\` | \`may\`: khả năng cao hơn — \`might\`: khả năng thấp hơn |
| \`will\` vs \`would\` | \`will\`: hiện tại/tương lai — \`would\`: quá khứ hoặc cách nói lịch sự |

## 4. Công thức bị động với động từ khiếm khuyết
S + Modal Verb + be + P2 (+ by O)
- *The report must be finished today.*
- *The package can be delivered tomorrow.*

## 5. Tổng hợp cách dùng theo nghĩa

| Nghĩa biểu thị | Modal verbs thường dùng |
| --- | --- |
| Khả năng | can, could, may, might |
| Bắt buộc | must, have to |
| Lời khuyên | should, ought to |
| Tương lai / Quyết định | will, shall |
| Lịch sự / Giả định | could, would |

## 6. Mẹo ghi nhớ
- 🔑 Nếu câu nói về khả năng → dùng \`can/could/may/might\`
- 🔑 Nếu nói về bắt buộc/luật lệ → dùng \`must/have to\`
- 🔑 Nếu là lời khuyên/đề xuất → dùng \`should/ought to\`
- 🔑 Nếu là tương lai hoặc quyết định tức thời → dùng \`will/shall\`

## Ứng dụng: cấm đoán vs không bắt buộc
- **mustn't**: bị cấm — *You mustn't smoke here.*
- **don't have to**: không cần, nhưng vẫn được phép — *You don't have to come if you're busy.*`,
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
    title: "Câu bị động (Passive Voice)",
    level: "B2",
    category: "voice",
    summary: "Cấu trúc, công thức theo từng thì, và các trường hợp đặc biệt của câu bị động.",
    content: `## 1. Cấu trúc chung
- Chủ động: S + V + O
- Bị động: S + be (+ being/been) + P2 (+ by + O)

👉 \`by + O\` dùng khi muốn nhấn mạnh người thực hiện hành động. Thường bỏ \`by + O\` nếu không cần nhấn mạnh.

## 2. Cách đổi từ chủ động → bị động

| Bước | Cách làm |
| --- | --- |
| 1 | Xác định tân ngữ (O) trong câu chủ động |
| 2 | Đưa tân ngữ đó lên làm chủ ngữ mới |
| 3 | Động từ chính đổi sang dạng \`be + P2\` |
| 4 | Nếu cần, thêm \`by + O\` (người thực hiện) |

## 3. Công thức bị động theo từng thì

| Thì | Chủ động | Bị động |
| --- | --- | --- |
| Hiện tại đơn | S + V(s/es) + O | S + am/is/are + P2 (+ by O) |
| Hiện tại tiếp diễn | S + am/is/are + V-ing + O | S + am/is/are + being + P2 (+ by O) |
| Hiện tại hoàn thành | S + has/have + P2 + O | S + has/have + been + P2 (+ by O) |
| Quá khứ đơn | S + V2/ed + O | S + was/were + P2 (+ by O) |
| Quá khứ tiếp diễn | S + was/were + V-ing + O | S + was/were + being + P2 (+ by O) |
| Quá khứ hoàn thành | S + had + P2 + O | S + had + been + P2 (+ by O) |
| Tương lai đơn | S + will + V + O | S + will + be + P2 (+ by O) |
| Tương lai hoàn thành | S + will have + P2 + O | S + will have + been + P2 (+ by O) |
| Be going to | S + am/is/are going to + V + O | S + am/is/are going to + be + P2 (+ by O) |
| Động từ khuyết thiếu | S + modal + V + O | S + modal + be + P2 (+ by O) |

## 4. Quy tắc động từ

| Ký hiệu | Nghĩa | Ví dụ |
| --- | --- | --- |
| V1 | Động từ nguyên mẫu | go |
| V2 | Quá khứ đơn | went |
| V3 = P2 | Quá khứ phân từ | gone |

## 5. Ví dụ minh họa

| Chủ động | Bị động |
| --- | --- |
| They build this house every year. | This house is built every year. |
| He is repairing the car. | The car is being repaired. |
| She has written a letter. | A letter has been written. |
| They cleaned the room yesterday. | The room was cleaned yesterday. |
| The workers were painting the wall. | The wall was being painted. |
| He had finished his homework. | His homework had been finished. |
| They will open the new shop next week. | The new shop will be opened next week. |
| She will have completed the report. | The report will have been completed. |
| They are going to hold a meeting. | A meeting is going to be held. |
| He can solve the problem. | The problem can be solved. |

## 6. Một số lưu ý quan trọng

- ✅ Không dùng bị động với **nội động từ** (intransitive verbs) — tức là không có tân ngữ.
  ❌ *He arrived yesterday* → không thể nói *"Yesterday was arrived."*
- ✅ Khi có 2 tân ngữ (double object) → có 2 cách bị động:
  *They gave me a gift.*
  - → *I was given a gift.*
  - → *A gift was given to me.*
- ✅ Khi động từ theo sau là một động từ khác:
  *People say that he is rich.*
  - → *It is said that he is rich.*
  - Hoặc: *He is said to be rich.*

**Mẹo nhớ nhanh**: "be + P2" là linh hồn của bị động. Cứ thấy "ai làm gì" → chuyển sang "cái đó được làm bởi ai".`,
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
    title: "Danh động từ & Động từ nguyên thể (Gerunds & Infinitives)",
    level: "B1",
    category: "verb-pattern",
    summary: "Verb + V-ing hay verb + to V? Danh sách động từ theo sau, cặp khác nghĩa, và mẫu V + O + to V.",
    content: `## Danh động từ (Gerund — V-ing)

Được thêm đuôi \`-ing\` và đóng vai trò như một danh từ trong câu.

- Làm chủ ngữ → diễn tả sự việc chung, có thật.
- Làm tân ngữ sau ngoại động từ.
- Làm tân ngữ sau giới từ.
- Chỉ sự chuyển động, hành động. *He admitted stealing the money.*

**Một số động từ theo sau là V-ing**

| Verb | Meaning | Verb | Meaning |
| --- | --- | --- | --- |
| admit | thừa nhận | mention | đề cập đến |
| advise | khuyên nhủ | mind | để ý, phiền |
| anticipate | đoán trước | miss | nhớ nhung |
| appreciate | đánh giá cao | postpone | hoãn |
| avoid | tránh xa | practice | luyện tập |
| can't bear | không thể chịu được | prefer | thích (cái gì) hơn |
| begin | bắt đầu | understand | hiểu |
| complete | hoàn thành | quit | từ bỏ |
| consider | xem xét | recall | nhớ |
| continue | tiếp tục | recollect | nhớ lại |
| delay | trì hoãn | recommend | giới thiệu |
| deny | phủ nhận | try | thử |
| discuss | bàn luận | tolerate | tha thứ, chịu đựng |
| dislike | không thích | regret | hối tiếc |
| enjoy | thích | remember | nhớ |
| finish | kết thúc | resent | oán giận |
| forget | quên | resist | kháng cự |
| like | thích | risk | mạo hiểm, liều |
| love | yêu thích | can't stand | không chịu đựng |
| keep | cứ (làm gì) | start | bắt đầu |
| can't help | không thể ngừng | stop | dừng lại |
| hate | ghét | suggest | gợi ý |

## Động từ nguyên thể (Infinitive — to V)

- Làm chủ ngữ → hành động giả tưởng/trừu tượng hoặc hành động trong tương lai.
- Làm tân ngữ sau động từ.
- (*) Không dùng sau giới từ.

**Một số động từ theo sau là nguyên thể (to V)**: \`hope to V\` (hy vọng làm gì), \`decide to V\` (quyết định làm gì), \`agree to V\` (đồng ý làm gì), \`want to V\` (muốn làm gì), \`promise to V\` (hứa làm gì), \`refuse to V\` (từ chối làm gì)...

| Verb | Meaning | Verb | Meaning |
| --- | --- | --- | --- |
| afford | đủ khả năng | learn | học |
| agree | đồng ý | like | thích |
| appear | có vẻ | love | yêu |
| arrange | sắp xếp | manage | điều hành |
| ask | xin phép | mean | có ý |
| can't bear | không chịu được | meet | gặp |
| beg | cầu xin | offer | đề nghị |
| begin | bắt đầu | plan | có kế hoạch |
| care | quan tâm | prefer | thích (cái gì) hơn |
| claim | đòi hỏi | prepare | chuẩn bị |
| consent | đồng ý | pretend | giả vờ |
| continue | tiếp tục | promise | hứa |
| decide | quyết định | refuse | từ chối |
| demand | yêu cầu | regret | hối tiếc |
| deserve | xứng đáng | remember | nhớ |
| expect | mong đợi | seem | có vẻ |
| fail | thất bại | stir | khuấy |
| forget | quên | struggle | gặp khó khăn |
| hate | ghét | swear | thề |
| hesitate | do dự | tend | hay |
| threaten | đe dọa | wait | chờ |
| try | cố gắng | want | muốn |
| volunteer | tình nguyện | wish | mong, ước |

## V + Gerund & V + Infinitive (cả hai đều được)

\`begin, continue, like, start, love, hate\` → V-ing + to V, nghĩa gần như nhau. *He is beginning to work.*

**Ngược lại — cặp khác nghĩa**
- **stop to V**: dừng lại để làm gì — *He stops to drink coffee.* / **stop V-ing**: dừng việc đang làm lại — *He stops drinking coffee.*
- **remember to V**: nhớ phải làm gì (việc chưa xảy ra) / **remember V-ing**: nhớ đã làm gì (việc đã xảy ra)
- **forget to V**: quên phải làm gì (chưa xảy ra) / **forget V-ing**: quên đã làm gì (đã xảy ra)
- **regret to V**: tiếc phải làm gì (chưa xảy ra) / **regret V-ing**: tiếc đã làm gì (đã xảy ra)
- **try to V**: cố gắng làm gì (nỗ lực) / **try V-ing**: thử làm gì (xem có hiệu quả không)
- **finish V-ing**: hoàn thành việc gì

## Theo sau đại từ/danh từ + động từ nguyên thể (V + O + to V)

| Verb | Meaning | Verb | Meaning |
| --- | --- | --- | --- |
| advise | khuyên | instruct | hướng dẫn |
| allow | cho phép | invite | mời |
| ask | hỏi | need | cần |
| beg | cầu xin | order | yêu cầu |
| cause | gây | permit | cho phép |
| challenge | thách thức | persuade | thuyết phục |
| communicate | giao tiếp | remind | nhắc nhở |
| dare | dám | require | yêu cầu |
| encourage | khuyến khích | teach | dạy |
| expect | mong đợi | tell | nói |
| forbid | cấm | urge | thúc giục |
| force | buộc | want | muốn |
| hire | thuê | warn | cảnh báo |`,
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
  {
    slug: "nouns-full-reference",
    title: "Danh từ (Nouns): Tổng hợp toàn diện",
    level: "A2",
    category: "noun",
    summary:
      "Đuôi nhận diện, vị trí trong câu, 4 loại danh từ, đếm được/không đếm được, số nhiều bất quy tắc, phát âm s/es, sở hữu cách và hạn định từ.",
    content: `## Đuôi danh từ thường gặp

Khi một từ có các đuôi (hậu tố) dưới đây, nhiều khả năng đó là **danh từ**:

| Đuôi | Ví dụ |
| --- | --- |
| \`-tion\` / \`-ation\` / \`-ition\` / \`-sion\`, \`-ment\` | information, action, competition, decision, development |
| \`-ance\` / \`-ence\` | performance, difference |
| \`-age\` | marriage, storage |
| \`-ery\` | bakery, delivery |
| \`-er\` / \`-or\` / \`-ar\` / \`-ant\` / \`-ent\` / \`-ee\` (\`-an\`/\`-ist\`/\`-ian\`: chỉ người) | teacher, actor, assistant, employee, musician, scientist |
| \`-y\` | discovery, delivery |
| \`-hood\` | childhood, neighborhood |
| \`-ness\` | happiness, kindness |
| \`-ship\` | friendship, relationship |

## Vị trí của danh từ trong câu

Danh từ thường đứng ngay sau các từ loại/cấu trúc sau:

- **A/AN/THE + danh từ** — *It's a **cat**.*
- **THIS/THAT/THESE/THOSE + danh từ** — *These **girls** are naughty.*
- **Danh từ + V + O** (danh từ làm chủ ngữ) — ***Puppies** are adorable.*
- **MY/YOUR/HER/HIS... (tính từ sở hữu) + danh từ** — *My **friend** is really kind.*
- **MANY/SOME/ANY, MUCH, SEVERAL, A LOT OF, A NUMBER OF... + danh từ** — *Many **people** follow this rule.*
- **Tính từ + danh từ** — *Kind **boys** are hard to find.*
- **Danh từ + danh từ** (danh từ ghép) — *She had plastic **surgery** last year.*
- **Giới từ (AT, IN, WITH, OF...) + danh từ** — *with many **business** ideas*

## Danh từ ghép (Noun + Noun)

Hai danh từ đứng cạnh nhau tạo thành một cụm danh từ ghép; danh từ đứng trước bổ nghĩa cho danh từ đứng sau:

| Cụm từ | Nghĩa |
| --- | --- |
| customer satisfaction | sự hài lòng của khách hàng (= client satisfaction) |
| advertising company | công ty quảng cáo |
| application form | đơn xin việc |
| performance evaluation | bản đánh giá hiệu suất làm việc |
| assembly line | dây chuyền lắp ráp |
| company policy | chính sách công ty |
| information desk | bàn thông tin, bàn tiếp tân |
| membership fee | phí hội viên |
| sales force | bộ phận bán hàng |
| sales target | mục tiêu bán hàng |

## 4 loại danh từ chính

1. **Common nouns — danh từ chung**: chỉ người, con vật, nơi chốn nói chung. *a tree, a singer, a cat.*
2. **Proper nouns — danh từ riêng**: tên riêng, thứ trong tuần, tháng trong năm, ngôn ngữ, tên địa danh (quốc gia, núi, biển, sông, hồ), một số ngày lễ/sự kiện. Luôn viết hoa chữ cái đầu (không áp dụng cho phương hướng, mùa, buổi trong ngày).
3. **Abstract nouns — danh từ trừu tượng**: không thể cầm nắm được — cảm xúc (*feelings*), khái niệm (*concepts*), phẩm chất (*qualities*), ý tưởng (*ideals*).
4. **Collective nouns — danh từ tập hợp**: chỉ một nhóm/tập thể — *family, band, crew.*

## Đếm được và không đếm được

**Countable — đếm được**
- Số ít: *a boss, a tree, a colleague*
- Số nhiều: *bosses, trees, colleagues*
- Thường đi sau: \`many\`, \`a few\`, \`few\`, \`some\`, \`a lot of\`, \`any\`

**Uncountable — không đếm được**
- *happiness, money, water*
- Không dùng \`a/an\`; dùng \`some\`, \`much\`, \`a lot of\`, \`any\`

Một số nhóm danh từ không đếm được thường gặp:

1. **Danh từ tập hợp** (gồm nhiều thứ giống nhau gộp lại): baggage, clothing, equipment, food, fruit, furniture, garbage, hardware, jewelry, junk, luggage, machinery, mail, makeup, money/cash, postage, scenery, stuff, traffic...
2. **Danh từ vật chất**: chất lỏng (water, coffee, tea, milk, oil, soup, gasoline, blood...), chất rắn (ice, bread, butter, cheese, meat, gold, iron, silver, glass, paper, wood, cotton, wool...), chất khí (steam, air, oxygen, nitrogen, smoke, smog, pollution...), dạng hạt/phần tử (rice, chalk, corn, dirt, dust, flour, grass, hair, pepper, salt, sand, sugar, wheat...).
3. **Danh từ trừu tượng**: beauty, confidence, courage, education, enjoyment, fun, happiness, health, honesty, importance, intelligence, justice, knowledge, luck, music, patience, peace, pride, sleep, truth, wealth, advice, imagination, news, evidence, time, space, energy, homework, work, grammar, vocabulary...
4. **Hiện tượng thiên nhiên**: weather, fog, hail, humidity, lightning, rain, sleet, snow, thunder, wind, darkness, light, sunshine, electricity, fire, gravity...

## Quy tắc thêm S/ES khi chia số nhiều

Mẹo nhớ khi nào thêm \`-es\` thay vì chỉ \`-s\`: từ tận cùng bằng **o, s, x, ch, sh** ("Ông sáu sung sướng chạy xe sh zởm") thì thêm \`-es\`. Ngoại lệ: \`piano → pianos\`, \`photo → photos\`, \`radio → radios\` (chỉ thêm \`-s\`).

- **Phụ âm + y → ies**: *baby → babies*
- **Nguyên âm + y → s**: *key → keys, boy → boys*
- **f / fe → ves**: *knife → knives, leaf → leaves*
- Một số từ tận cùng bằng **f** chỉ thêm \`-s\` (không đổi thành *-ves*): *chef → chefs, roof → roofs, cliff → cliffs, belief → beliefs*

## Danh từ số nhiều đặc biệt

**Luôn ở dạng số nhiều** (không có dạng số ít tương ứng):
\`glasses\` (mắt kính), \`binoculars\` (ống nhòm), \`scissors\` (cái kéo), \`pliers\` (cái kìm), \`shears\` (kéo cắt cây), \`arms\` (vũ khí), \`goods/wares\` (của cải), \`damages\` (tiền bồi thường), \`earnings\` (tiền kiếm được), \`savings\` (tiền tiết kiệm), \`riches\` (sự giàu có), \`spirits\` (rượu mạnh), \`stairs\` (cầu thang), \`surroundings\` (vùng phụ cận), \`greens\` (rau quả), \`grounds\` (đất đai, khuôn viên), \`valuables\` (đồ quý giá), \`pants\` (quần dài), \`shorts\` (quần short), \`shoes\` (giày), \`clothes\` (quần áo), \`outskirts\` (vùng ngoại ô), \`cattle\` (gia súc), \`spectacles\` (mắt kính).

**Số ít = số nhiều** (không đổi dạng):
\`sheep\` (cừu), \`fish\` (cá), \`deer\` (hươu), \`species\` (loài), \`bison\` (bò rừng), \`swine\` (lợn), \`salmon\` (cá hồi), \`trout\` (cá hồi), \`cod\` (cá tuyết), \`pike\` (cá chó), \`moose\` (nai sừng tấm), \`shrimp\` (tôm), \`series\` (loạt/phim), \`means\` (phương tiện), \`offspring\` (con cái).

**Đổi hẳn sang từ khác khi thành số nhiều**:

| Số ít | Số nhiều | Nghĩa |
| --- | --- | --- |
| fungus | fungi | nấm |
| cactus | cacti | xương rồng |
| nucleus | nuclei | hạt nhân |
| syllabus | syllabi | kế hoạch học tập |
| focus | foci | tiêu điểm |
| thesis | theses | luận văn |
| crisis | crises | khủng hoảng |
| phenomenon | phenomena | hiện tượng |
| index | indices | chỉ số |
| appendix | appendices | phụ lục |
| criterion | criteria | tiêu chuẩn |
| curriculum | curricula | chương trình giảng dạy |
| datum | data | dữ liệu |
| medium | media | phương tiện |
| hypothesis | hypotheses | giả thuyết |
| stimulus | stimuli | tác nhân kích thích |
| analysis | analyses | phân tích |
| ox | oxen | con bò |
| brother | brethren | anh em (tôn giáo) |
| louse | lice | con rận/chấy |
| die | dice | xúc xắc |
| bacterium | bacteria | vi khuẩn |
| man | men | đàn ông |
| woman | women | đàn bà |
| child | children | trẻ em |
| person | people | con người |
| foot | feet | bàn chân |
| tooth | teeth | răng |
| mouse | mice | chuột |
| goose | geese | ngỗng |

## Ngoại lệ với đuôi -O

Phần lớn danh từ tận cùng bằng phụ âm + **o** thêm \`-es\` (*potato → potatoes*), nhưng một số từ chỉ thêm \`-s\`:

\`auto → autos\`, \`ghetto → ghettos\`, \`kangaroo → kangaroos\`, \`kilo → kilos\`, \`memo → memos\`, \`photo → photos\`, \`piano → pianos\`, \`radio → radios\`, \`solo → solos\`, \`soprano → sopranos\`, \`studio → studios\`, \`tattoo → tattoos\`, \`video → videos\`, \`zoo → zoos\`.

## Cách phát âm đuôi S/ES

| Âm | Xuất hiện sau | Ví dụ |
| --- | --- | --- |
| \`/s/\` | âm vô thanh: th, p, k, f, t | cats, maps, books, photographs, months |
| \`/iz/\` | o, s, x, ch, sh (và ge/dge) | boxes, buses, watches, dishes, pages |
| \`/z/\` | các trường hợp còn lại (âm hữu thanh) | dogs, boys, cars |

## Sở hữu cách (Possessive Case)

**N1's N2** — N1 là chủ sở hữu, N2 là vật/người được sở hữu. Nếu N1 là danh từ số nhiều tận cùng bằng *-s*, chỉ thêm dấu nháy: **N1s' N2** (*cats' fur*). **N2 luôn là danh từ chính** — dùng N2 để chia động từ.

Sở hữu cách thường dùng cho:
- Danh từ chỉ **người**: *Anna's book*
- Danh từ chỉ **con vật**: *the dog's tail*
- Danh từ chỉ **tổ chức**: *the government's action*
- Danh từ chỉ **thời gian & nơi chốn**: *today's newspaper, the world's population*
- Nơi làm việc của một số **nghề nghiệp**: *Will you drop by the butcher's on the way home?*

Danh từ chỉ **đồ vật, sự vật** thường không dùng 's, mà dùng cấu trúc **N1 of N2** (N1 là vật được sở hữu, N2 là chủ sở hữu):
*The book's cover is very beautiful.* → *The cover of the book is very beautiful.*

Có thể lược bỏ N2 nếu không muốn lặp lại danh từ đã nhắc ở trên: *This is my notebook. That is Trang's.*

## Hạn định từ (Determiners)

### Demonstratives — từ chỉ định

\`this/that\` + danh từ số ít đứng trước danh từ để xác định danh từ đang nói tới:
- **this** + N số ít: chỉ vật ở gần — *I'll take this.*
- **that** + N số ít: chỉ vật ở xa — *I'll take that.*

Dạng số nhiều: \`this → these\`, \`that → those\`
- *This pen → These pens* — *I like these.*
- *That pen → Those pens* — *I like those.*

### Quantifiers — lượng từ

| Lượng từ | Dùng với | Ví dụ |
| --- | --- | --- |
| \`some\` | đếm được & không đếm được; câu khẳng định (hoặc lời mời/đề nghị trong câu hỏi) | *Would you like some tea?* |
| \`any\` | đếm được & không đếm được; câu phủ định/nghi vấn | *Do you have any questions?* |
| \`a few\` | đếm được | *a few apples* |
| \`a little\` | không đếm được | *I only need a little sugar for my coffee.* |
| \`many\` | đếm được, số nhiều | *many people* |
| \`much\` | không đếm được | *much money* |
| \`a lot of\` / \`lots of\` | cả hai | *a lot of good movies / lots of water* |

- **A few / A little**: *ít nhưng đủ* — nên dùng cho trường hợp cụ thể.
- **Few / Little**: *ít, không đủ, cần thêm nữa* — *There is little sugar left. We should buy some more.*`,
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'She had plastic ___ (surgery) last year.' Choose the correct compound: sale/plastic surgery.",
        referenceAnswer: "plastic surgery",
        difficulty: "A2",
      },
      {
        type: "fill_blank",
        prompt: "Give the plural form of 'child', 'mouse', and 'sheep'.",
        referenceAnswer: "children; mice; sheep (unchanged)",
        difficulty: "A2",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'The book's cover is very beautiful.' Rewrite using 'of' instead of 's, since 'book' is a thing.",
        referenceAnswer: "The cover of the book is very beautiful.",
        difficulty: "A2",
      },
      {
        type: "fill_blank",
        prompt: "Complete with some/any: 'Would you like ___ tea?' / 'I don't have ___ questions.'",
        referenceAnswer: "some; any",
        difficulty: "A2",
      },
    ],
  },
  {
    slug: "perfect-continuous-and-past-perfect-tenses",
    title: "Thì nâng cao: Hoàn thành tiếp diễn, Quá khứ tiếp diễn & hoàn thành",
    level: "B1",
    category: "tense",
    summary:
      "Present Perfect Continuous, Past Continuous, Past Perfect và Past Perfect Continuous — cấu trúc, cách dùng, dấu hiệu nhận biết và so sánh.",
    content: `## Hiện tại hoàn thành tiếp diễn (Present Perfect Continuous)

**Cấu trúc**
- (+) S + has/have been + V-ing
- (-) S + has/have not been + V-ing
- (?) Has/Have + S + been + V-ing?

**Cách dùng**
- Hành động bắt đầu ở quá khứ và kéo dài đến hiện tại.
- Hành động vừa kết thúc, để lại dấu vết/kết quả ở hiện tại.

**Dấu hiệu nhận biết**: \`for\` + khoảng thời gian (*for 3 hours*), \`since\` + mốc thời gian (*since 2010*), \`all day\`, \`recently\`, \`lately\`, \`so far\`, \`up to now\`

**Lưu ý**: không dùng với động từ chỉ trạng thái (*like, know, believe, understand*):
- ❌ *I have been knowing her.*
- ✅ *I have known her for 5 years.*

**Ví dụ**: *I have been studying for 3 hours.* / *She has been working here since 2010.*

## Quá khứ tiếp diễn (Past Continuous)

**Cấu trúc**
- (+) S + was/were + V-ing
- (-) S + was/were not + V-ing
- (?) Was/Were + S + V-ing?

**Cách dùng**
- Hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ.
- Hành động đang xảy ra thì một hành động khác (ở quá khứ đơn) xen vào.

**Dấu hiệu nhận biết**: *at 5pm yesterday*, \`while\`, \`when\`, *at that moment*, *all day yesterday*

**Ví dụ**: *I was playing volleyball when it started to rain.* / *Were you talking about the dog?*

## Quá khứ hoàn thành (Past Perfect)

**Cấu trúc**
- (+) S + had + V3/-ed
- (-) S + had not + V3/-ed
- (?) Had + S + V3/-ed?

**Cách dùng**: diễn tả hành động xảy ra **trước** một hành động khác trong quá khứ.

**Dấu hiệu nhận biết**: \`before\`, \`after\`, \`when\`, \`by the time\`, \`as soon as\`, \`already\`

**Ví dụ**: *I had done my homework before my mom arrived.*

### So sánh Quá khứ tiếp diễn và Quá khứ hoàn thành

| | Quá khứ tiếp diễn | Quá khứ hoàn thành |
| --- | --- | --- |
| Nhấn mạnh | Hành động đang xảy ra | Hành động xảy ra trước |
| Dùng kèm | \`when\`, \`while\` | \`before\`, \`after\`, \`by the time\` |
| Kết hợp | Past Continuous + Past Simple | Past Perfect + Past Simple |

## Quá khứ hoàn thành tiếp diễn (Past Perfect Continuous)

**Cấu trúc**
- (+) S + had been + V-ing
- (-) S + had not been + V-ing
- (?) Had + S + been + V-ing?

**Đặc điểm**
- Diễn tả một hành động đang xảy ra trong quá khứ, kéo dài **trước khi** một hành động khác xảy ra.
- Nhấn mạnh thời gian và tính liên tục của hành động.

**Dấu hiệu nhận biết**: \`for\` + khoảng thời gian, \`before\`/\`when\`, \`prior to\` + mốc thời gian

**Ví dụ**: *Jenny had been working for 3 hours.* / *Had he been playing soccer...?*`,
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'I ___ (study) for 3 hours.' Use the present perfect continuous.",
        referenceAnswer: "have been studying",
        difficulty: "B1",
      },
      {
        type: "fill_blank",
        prompt: "Complete: 'I ___ (play) volleyball when it started to rain.' Use the past continuous.",
        referenceAnswer: "was playing",
        difficulty: "B1",
      },
      {
        type: "fill_blank",
        prompt: "Complete: 'I ___ (do) my homework before my mom arrived.' Use the past perfect.",
        referenceAnswer: "had done",
        difficulty: "B1",
      },
      {
        type: "free_response",
        prompt:
          "Explain the difference between 'She had been working for 3 hours' and 'She had worked for 3 hours', then write one original example with 'had been' + V-ing.",
        referenceAnswer:
          "Past Perfect Continuous (had been working) emphasizes the ongoing duration of the action up to another past point; Past Perfect (had worked) just states it was completed before that point. Example: 'They had been waiting for an hour when the bus finally arrived.'",
        difficulty: "B2",
      },
    ],
  },
  {
    slug: "types-of-verbs",
    title: "Các loại động từ (Type of Verb)",
    level: "A2",
    category: "verb-type",
    summary: "Action verb (ngoại động từ/nội động từ), stative verb và linking verb.",
    content: `## Action Verb — Động từ hoạt động

- **Transitive verb — Ngoại động từ**: cần có tân ngữ (O) đi cùng để làm rõ nghĩa. *Ví dụ: look, enter, throw...*
- **Intransitive verb — Nội động từ**: đứng một mình đã đủ nghĩa, không có tân ngữ. *Ví dụ: drive, write*

*Lưu ý*: một động từ có thể vừa là nội động từ, vừa là ngoại động từ (tùy câu).

## Stative Verb — Động từ trạng thái

Những động từ liên quan đến giác quan, suy nghĩ, cảm xúc, nhận thức... — hầu như không chia ở thể tiếp diễn.

- **Feelings** (cảm xúc): *like, love*
- **Thoughts/Opinions** (suy nghĩ, quan điểm): *agree*
- **Senses** (giác quan): *smell, tasty*
- **Possession** (sở hữu): *have, own, belong*
- **Other** (khác): *cost, weight*

## Linking Verb — Động từ liên kết, nối

Những động từ dẫn dắt, kết nối chủ ngữ với thông tin tiếp theo trong câu — đứng sau có thể là một tính từ bổ nghĩa.

- *Ví dụ: is, becomes, seems*
- *He is intelligent.*`,
    exercises: [
      {
        type: "fill_blank",
        prompt:
          "Xác định loại động từ trong câu 'She smells the flowers.' và 'The soup smells delicious.'",
        referenceAnswer:
          "'smells' đầu (ngoại động từ — action verb, có tân ngữ 'the flowers'); 'smells' sau (stative verb — giác quan, theo sau là tính từ 'delicious').",
        difficulty: "B1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'I am liking this song a lot.' (stative verb should not be continuous)",
        referenceAnswer: "I like this song a lot.",
        difficulty: "A2",
      },
      {
        type: "free_response",
        prompt: "Give one example each of a transitive verb and an intransitive verb, used in full sentences.",
        referenceAnswer:
          "Example: 'She threw the ball.' (transitive — 'the ball' is the object) / 'He arrived early.' (intransitive — no object).",
        difficulty: "A2",
      },
    ],
  },
  {
    slug: "perfect-participle",
    title: "Phân từ hoàn thành (Having + P2)",
    level: "C1",
    category: "advanced-structure",
    summary: "Cấu trúc having (been) + P2 để rút gọn mệnh đề và nhấn mạnh trình tự trước-sau.",
    content: `## Having + P2 (V3)

- Ở dạng chủ động: \`having\` + quá khứ phân từ (V-ed/V3)
- Ở dạng bị động: \`having been\` + quá khứ phân từ (V-ed/V3)

**Dùng để**
- ✅ Nhấn mạnh hành động xảy ra **trước một hành động khác**.
- ✅ Thường dùng để mở đầu một câu hoặc cụm phân từ, không làm động từ chính.

**Vị trí trong câu**
- Trước mệnh đề chính
- Ngay sau chủ ngữ của mệnh đề chính
- Sau mệnh đề chính

## Chức năng trong câu

- Dùng để miêu tả **lý do** dẫn đến hành động được thực hiện ở mệnh đề chính.
- Dùng để **rút gọn mệnh đề** khi cả hai mệnh đề trong câu có cùng một chủ ngữ.
- Dùng thay cho **hiện tại phân từ** (present participles) khi muốn nhấn mạnh hành động này xảy ra *trước* hành động ở mệnh đề chính (chứ không phải đồng thời).

## Lưu ý: bắt buộc phải có mệnh đề chính

Cụm \`having + P2\` không thể đứng một mình — câu phải có một mệnh đề chính đi kèm.

- ❌ Sai: *Mr. Ludwig's analyses of emerging economies in Asia having generated considerable debate among local economists.*
- ✅ Đúng: *Having generated considerable debate, Mr. Ludwig's analyses are widely discussed among local economists.*`,
    exercises: [
      {
        type: "sentence_correction",
        prompt:
          "Combine into one sentence using 'Having + P2': 'She finished her homework. She went out to play.'",
        referenceAnswer: "Having finished her homework, she went out to play.",
        difficulty: "C1",
      },
      {
        type: "fill_blank",
        prompt:
          "Complete with the passive perfect participle: '___ (already/warn) about the storm, the villagers evacuated early.'",
        referenceAnswer: "Having already been warned",
        difficulty: "C1",
      },
      {
        type: "free_response",
        prompt:
          "Explain why 'Mr. Ludwig's analyses having generated considerable debate' is an incomplete sentence, then fix it.",
        referenceAnswer:
          "The 'having + P2' clause has no main clause attached, so it never completes a full sentence. Fix: 'Having generated considerable debate, Mr. Ludwig's analyses are widely discussed among local economists.'",
        difficulty: "C1",
      },
    ],
  },
  {
    slug: "pronouns",
    title: "Đại từ (Pronouns)",
    level: "A1",
    category: "pronoun",
    summary: "Đại từ nhân xưng (chủ ngữ/tân ngữ), tính từ sở hữu, đại từ sở hữu và đại từ phản thân.",
    content: `## Bảng đại từ theo ngôi

| Ngôi | Số | Chủ ngữ | Tân ngữ | Tính từ sở hữu | Đại từ sở hữu | Đại từ phản thân |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | số ít | I | me | my | mine | myself |
| 1 | số nhiều | we | us | our | ours | ourselves |
| 2 | số ít & nhiều | you | you | your | yours | yourself / yourselves |
| 3 | số ít | he | him | his | his | himself |
| 3 | số ít | she | her | her | hers | herself |
| 3 | số ít | it | it | its | its | itself |
| 3 | số nhiều | they | them | their | theirs | themselves |

## Chủ ngữ (Đại từ nhân xưng)

- Danh từ số ít chỉ nam giới → \`he\`
- Danh từ số ít chỉ nữ giới → \`she\`
- Danh từ số ít chỉ vật, sự vật, con vật → \`it\`
- Danh từ số nhiều → \`they\`

## Tân ngữ (Object Pronouns)

- Đứng sau động từ (V): *I saw her.*
- Đứng sau giới từ: *This gift is for him.*

## Tính từ sở hữu (Possessive Adjectives)

- Chỉ sự sở hữu, luôn đứng **trước danh từ** → phải có danh từ đi theo. *This is my book.*
- Nếu không có danh từ đi kèm ở cuối câu, dùng **đại từ sở hữu** thay thế (*my* → *mine*).

## Đại từ sở hữu (Possessive Pronouns)

Đại từ sở hữu = Tính từ sở hữu + Danh từ (về mặt ý nghĩa) — không cần lặp lại danh từ.

- Làm chủ ngữ: S + to be — *Mine is on the table.*
- Làm tân ngữ sau động từ: *I found yours.*
- Làm tân ngữ sau giới từ: *This present is for hers.*
- Có thể đứng một mình: *This book is mine.*

## Đại từ phản thân (Reflexive Pronouns)

**Cấu trúc**
- S + V + ĐTPT: *I sing it myself.*
- S + ĐTPT + V (nhấn mạnh): *I myself cooked dinner.*
- S + V + giới từ + ĐTPT: *I go there by myself.*

**Dùng để**
- Làm tân ngữ cho động từ (chủ ngữ và tân ngữ là cùng một người/vật).
- Làm tân ngữ cho giới từ:
  - \`by\` + đại từ phản thân → tự làm một việc gì đó một mình.
  - \`to\` + đại từ phản thân → chỉ mình ai đó sử dụng.
- Đứng sau chủ thể để nhấn mạnh.`,
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'This is not my pen. ___ (mine/my) is red.'",
        referenceAnswer: "Mine",
        difficulty: "A1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'Me and him went to the store.' (use correct subject pronouns)",
        referenceAnswer: "He and I went to the store.",
        difficulty: "A2",
      },
      {
        type: "fill_blank",
        prompt: "Complete with a reflexive pronoun: 'She cooked dinner all by ___.'",
        referenceAnswer: "herself",
        difficulty: "A2",
      },
      {
        type: "free_response",
        prompt:
          "Write one sentence using a possessive pronoun (mine, yours, his, hers, ours, theirs) standing alone as the subject.",
        referenceAnswer: "Example: 'Theirs is the blue car parked outside.'",
        difficulty: "A2",
      },
    ],
  },
  {
    slug: "adjectives-overview",
    title: "Tính từ (Adjectives)",
    level: "A1",
    category: "adjective",
    summary: "Vị trí trong câu, đuôi nhận diện, 2 loại tính từ, và các tính từ chỉ đứng trước/sau.",
    content: `## Định nghĩa

Tính từ là từ mô tả đặc điểm, trạng thái, tính chất của người, vật, hay sự việc nào đó.

- *Ví dụ: modern, fun, healthy, fashionable*
- Tính từ ghép: *good-looking, hard-working, hard-to-put-down*

## Vị trí tính từ trong câu

Tính từ có thể đứng **trước danh từ** hoặc đứng **sau động từ**.

- \`to be\` + Tính — *That flower is beautiful.*
- A/an/the + Tính + Danh — *It is an interesting book.*
- \`look/smell/taste/sound/feel\` (động từ tri giác) + Tính — *She looks beautiful.*
- \`seem/become/get/appear/turn/stay/remain\` (động từ liên kết) + Tính — *I remain calm.*
- \`find/make/keep/have\` + Tân ngữ + Tính — *I find the view breathtaking.*

**Lưu ý khác**
- Đại từ bất định (*someone, something, nobody...*) → tính từ đứng **sau** để bổ nghĩa cho nó.
- Mô tả một điều người khác vừa nói: *sound interesting, sound good, sound awesome...*

## Đuôi tính từ thường gặp

| Đuôi | Ví dụ |
| --- | --- |
| \`-ful\` | beautiful, careful, useful, peaceful |
| \`-ive\` | active, attractive, impressive |
| \`-able\`/\`-ible\` | comfortable, miserable |
| \`-ous\` | dangerous, serious, humorous, continuous, famous |
| \`-ish\` | selfish, childish |
| \`-ed\` | bored, interested, excited |
| \`-y\` (danh từ + y) | daily, funny, friendly, healthy |
| \`-al\` | national, cultural |
| \`-ese\` | Vietnamese, Japanese, Chinese |
| \`-ic\` | artistic, scientific, economic |
| \`-less\` | homeless, useless |

## 2 loại tính từ

- **Attributive adjectives** (tính từ thuộc ngữ): đứng trực tiếp trước danh từ, hoặc sau đại từ/danh từ để bổ nghĩa cho nó.
  - Pre-positive (đứng trực tiếp **trước** danh từ): *She is a beautiful girl.*
  - Post-positive (đứng **sau** danh từ/đại từ): *We need someone casual for this job.*
- **Predicative adjectives** (tính từ vị ngữ): đứng sau danh từ/đại từ, phải có \`to be\`, động từ tri giác hoặc động từ liên kết để nối 2 thành phần. *He looks healthy.*

## Những tính từ chỉ đứng TRƯỚC danh từ

\`elder/eldest\` (người lớn tuổi trong gia đình), \`same/exact\` (cùng một, chính xác), \`main/principal/chief\` (chính), \`sheer/utter\` (chỉ là, đích thị), \`future\` (tương lai), \`former/latter\` (phía trước/sau), \`urban/rural\` (thành thị/nông thôn), \`northern/southern/eastern/western\` (bốn hướng).

## Những tính từ chỉ đứng SAU động từ (thường bắt đầu bằng "a-")

\`afire\` (bừng bừng, rực cháy), \`afloat\` (lênh đênh, lơ lửng), \`afraid\` (sợ), \`alert\` (cảnh giác, tỉnh táo), \`alive\` (đang sống), \`alone\` (một mình), \`ashamed\` (xấu hổ), \`aware\` (nhận thức được), \`asleep\` (đang ngủ), \`awake\` (tỉnh, thức).`,
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'She looks ___ (happy) today.' Choose the position: before or after the verb?",
        referenceAnswer: "happy (after the perception verb 'look')",
        difficulty: "A1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'I need something interesting to read' — is the adjective in the right position? Explain why.",
        referenceAnswer:
          "Yes — 'something' is an indefinite pronoun, so the adjective 'interesting' correctly comes after it (post-positive), not before.",
        difficulty: "A2",
      },
      {
        type: "fill_blank",
        prompt: "Complete with the correct suffix: 'Vietnam has a rich cultur___ heritage.' (culture → adjective)",
        referenceAnswer: "cultural",
        difficulty: "A2",
      },
    ],
  },
  {
    slug: "adverbs-overview",
    title: "Trạng từ (Adverbs)",
    level: "A2",
    category: "adjective",
    summary: "Cách tạo trạng từ từ tính từ, vị trí trong câu (front/mid/end), và các cặp adj/adv dễ nhầm.",
    content: `## Định nghĩa

Trạng từ bổ sung thông tin cho: động từ, tính từ, cụm từ, mệnh đề, hoặc một trạng từ khác.

- *Ví dụ: He drives carefully.*

## Cách tạo trạng từ

Công thức chung: **ADV = ADJ + LY**

| ADJ | ADV | Nghĩa |
| --- | --- | --- |
| careful | carefully | cẩn thận |
| nice | nicely | tốt đẹp |
| comfortable | comfortably | thoải mái |
| deep | deeply | sâu |
| usual | usually | thường xuyên |

**Lưu ý chính tả**
- Tận cùng \`y\` → đổi thành \`i\` + \`ly\`: *easy → easily, angry → angrily*
- Tận cùng \`l\` → thêm \`ly\`: *careful → carefully, beautiful → beautifully*

**Những từ có đuôi \`-ly\` nhưng lại là TÍNH TỪ (không phải trạng từ)**: \`friendly, likely, ugly, lovely, silly, lonely\`

**Trạng từ giống hệt tính từ (không đổi dạng)**: \`good → well\`, \`fast → fast\`, \`early → early\`, \`late → late\`, \`daily → daily\`, \`hard → hard\`

## Vị trí của trạng từ trong câu

- **Front** (đầu câu) + dấu phẩy + mệnh đề — trạng từ chỉ thời gian, nơi chốn, cách thức, tần suất. *Luckily, I got the job.*
- **Mid** (giữa câu):
  - V + ADV cách thức, hoặc ADV cách thức + V → **trạng từ không đứng giữa động từ và tân ngữ**. *She drives carefully her car.* → đúng ra nên viết *She carefully drives her car* hoặc *She drives her car carefully.*
  - ADV mức độ + ADJ/ADV — *She is extremely beautiful.*
  - ADV tần suất + V, hoặc trợ động từ + ADV tần suất + V.
- **End** (cuối câu) — trạng từ cách thức, thời gian, nơi chốn, tần suất, thời lượng.

1. Trạng từ đơn thường được đặt trước cụm trạng từ: *I always eat here at lunchtime.*
2. Khi có nhiều trạng từ cùng lúc, sắp xếp theo trật tự: **Mức độ → Cách thức → Nơi chốn → Thời lượng → Tần suất → Thời gian**.

## Những cặp adj/adv dễ nhầm ("cú lừa")

| Từ | Nghĩa |
| --- | --- |
| \`hard\` (adv) | một cách vất vả |
| \`hardly\` (adv) | hầu như không |
| \`late\` (adv) | muộn |
| \`lately\` (adv) | gần đây |
| \`near\` (adv) | ở gần |
| \`nearly\` (adv) | gần như, suýt thì |
| \`high\` (adv) | cao |
| \`highly\` (adv) | rất (= very) |
| \`deep\` (adv) | sâu |
| \`deeply\` (adv) | rất nhiều |

*Ví dụ: Ann works hard, while her brother hardly works.* (Ann làm việc chăm chỉ, còn em trai cô ấy thì hầu như không làm gì.)

## Cụm trạng từ

Nhiều từ kết hợp lại tạo thành một cụm có chức năng như trạng từ:
- \`in the morning\`: vào buổi sáng
- \`on time\`: đúng giờ
- \`three times a week\`: 3 lần mỗi tuần

**Lưu ý**: trạng từ không bổ nghĩa cho danh từ.`,
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'She works very hard, but her sister ___ (hardly) works at all.' Explain the meaning difference.",
        referenceAnswer:
          "'hardly' — means her sister almost never works, the opposite meaning of 'hard' (working with effort).",
        difficulty: "B1",
      },
      {
        type: "sentence_correction",
        prompt: "Correct the word order: 'She drives carefully her car.'",
        referenceAnswer: "She drives her car carefully. (adverb does not sit between verb and object)",
        difficulty: "A2",
      },
      {
        type: "fill_blank",
        prompt: "Turn 'careful' and 'good' into adverbs.",
        referenceAnswer: "carefully; well",
        difficulty: "A1",
      },
    ],
  },
  {
    slug: "quantifiers",
    title: "Từ định lượng (Quantifiers)",
    level: "A2",
    category: "quantifier",
    summary: "Few/a few, little/a little, many/much, every/each, either/neither, a lot of, both...",
    content: `## Tổng quan

- \`there are\`, \`few\`, \`a few\`, \`a number of\`, \`the number of\`, \`many\`, \`several of\`, \`a variety of\` + Tính + N (số nhiều, đếm được)
- \`much\`, \`little\`, \`a little\`, \`a great deal of\`, \`a large amount of\` + Tính + N (không đếm được)
- \`some\`, \`some of\`, \`a lot of\`, \`lots of\`, \`all\` + Tính + N (không đếm được, hoặc đếm được số nhiều)
- \`after\`, \`before\`, \`even though\`, \`because\`, \`even so\`, \`unless\`, \`although\`, \`as\`, \`while\` + S + V + O

**Liên từ đầu câu**: \`because of\` = \`due to\` (vì); \`according to\` (căn cứ vào); \`despite\`/\`in spite of\` (mặc dù) + V-ing + ...

## Few vs A few (với danh từ đếm được)

- **few** + N số nhiều → mang nghĩa **phủ định** (rất ít, gần như không có): *There are few eggs left. / She has few friends. / I have few errands to run.*
- **a few** + N số nhiều → **một vài, đủ dùng**: *There are a few books here. / I have a few shirts I can give you. / I have a few eggs in the fridge.*

## Little vs A little (với danh từ không đếm được)

- **little** + N không đếm được → **phủ định** (rất ít, gần như không có): *There is little milk left. / There is little water in the bottle.*
- **a little** + N không đếm được → **một chút, đủ dùng**: *There's a little milk left. / I have a little food to share.*

## All / Most / Some / Any / No

All/Most/Some/Any/No + danh từ đếm được số nhiều hoặc không đếm được.

- *All rabbits love carrots.*
- *Most knowledge can be stored.*
- *I bought some books.*
- *She didn't have any books.*
- *We have no desks here.*

⚠️ \`some\` dùng trong câu khẳng định (và câu hỏi mang tính mời/đề nghị). \`any\` dùng trong câu phủ định và câu hỏi thông thường.

## Many vs Much

- **many** + danh từ đếm được số nhiều: *There aren't many people living here. / I have many things to do.*
- **much** + danh từ không đếm được: *There is too much information here. / We don't have much milk left.*

## Every vs Each

- **every** + danh từ đếm được số ít: *Every room has a number. / Every girl is special.*
- **each** + danh từ đếm được số ít / **each of** + từ hạn định + danh từ số nhiều / **each of** + đại từ tân ngữ / **each** có thể đứng một mình: *Each day seems to pass slowly. / Each of the students has a personal computer. / Each of us has our own desk. / Each has an English book.*

## Either vs Neither

- **either** + of + từ hạn định + danh từ số nhiều / **either** + of + đại từ tân ngữ: *You can read either of these books. / Either of us are keen on this book.*
- **neither** + of + từ hạn định + danh từ số nhiều / **neither** + of + đại từ tân ngữ: *Neither of the children wants to go to bed. / Neither of them is French.*

## A large number of vs A great deal of

- **a large number of** + danh từ đếm được số nhiều: *He has a large number of books. / There are a large number of butterflies.*
- **a great deal of** + danh từ không đếm được: *A fridge uses a great deal of electricity. / She has a great deal of knowledge.*

## A lot of / Lots of

**a lot of** / **lots of** + danh từ không đếm được hoặc đếm được số nhiều: *She doesn't have a lot of/lots of friends. / He doesn't have a lot of/lots of time.*

## Both

**both** + danh từ số nhiều (2 vật) / **both** + of + từ hạn định + danh từ số nhiều / **both** + of + đại từ tân ngữ: *Both books are written by me. / Both of the doctors are from Hanoi. / Both of us love Pho.*`,
    exercises: [
      {
        type: "fill_blank",
        prompt: "Complete: 'She has ___ (few/a few) close friends, but they are all very loyal.' Choose the positive-sounding option.",
        referenceAnswer: "a few",
        difficulty: "A2",
      },
      {
        type: "fill_blank",
        prompt: "Complete with many/much: 'There isn't ___ time left, and there aren't ___ seats available.'",
        referenceAnswer: "much; many",
        difficulty: "A2",
      },
      {
        type: "sentence_correction",
        prompt: "Correct: 'Neither of the children wants to go to bed' — is 'wants' correct here? Explain.",
        referenceAnswer:
          "Yes, correct — 'neither' takes a singular verb even though it refers to two people.",
        difficulty: "B1",
      },
      {
        type: "fill_blank",
        prompt: "Complete: 'You can read ___ (either/each) of these books — I recommend both.'",
        referenceAnswer: "either",
        difficulty: "A2",
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

    let insertedLessonId: number | null = null;
    if (topic.lesson) {
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
      insertedLessonId = insertedLesson.id;
    }

    await db.delete(exercises).where(eq(exercises.topicId, insertedTopic.id));

    for (const [exIndex, ex] of topic.exercises.entries()) {
      await db.insert(exercises).values({
        topicId: insertedTopic.id,
        lessonId: insertedLessonId,
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
