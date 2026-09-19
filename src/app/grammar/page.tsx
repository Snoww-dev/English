import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllTopics } from "@/lib/content";


export const dynamic = "force-dynamic";

export default async function GrammarIndexPage() {
  const topics = await getAllTopics();
  const levels = Array.from(new Set(topics.map((t) => t.level)));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ngữ pháp</h1>
        <p className="text-muted-foreground">
          {topics.length} chủ điểm, sắp xếp theo cấp độ CEFR (A1 → C2).
        </p>
      </div>

      {levels.map((level) => (
        <section key={level} className="space-y-3">
          <h2 className="text-lg font-medium">Cấp độ {level}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {topics
              .filter((t) => t.level === level)
              .map((topic) => (
                <Link key={topic.id} href={`/grammar/${topic.slug}`}>
                  <Card className="h-full transition-colors hover:border-primary">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">{topic.title}</CardTitle>
                        <Badge variant="outline">{topic.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {topic.summary}
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
