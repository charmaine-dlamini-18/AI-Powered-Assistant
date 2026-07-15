import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare, ArrowUp, MessageCircle, Plus, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FORUM } from "@/lib/mock-data";

export const Route = createFileRoute("/forum")({
  head: () => ({
    meta: [
      { title: "Community Forum — CommunityConnect" },
      {
        name: "description",
        content:
          "Discuss and verify local service delivery issues with your neighbours and ward councillor.",
      },
    ],
  }),
  component: ForumPage,
});

function ForumPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Community forum</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Verify reports, share updates and collaborate on solutions. All posts are moderated.
          </p>
        </div>
        <Button>
          <Plus className="mr-1.5 h-4 w-4" /> New topic
        </Button>
      </header>

      <Card className="border-none bg-info/5 shadow-[var(--shadow-soft)]">
        <CardContent className="flex items-start gap-3 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-info" />
          <p className="text-xs leading-relaxed text-info">
            <strong>Community moderation:</strong> reports voted up by 5+ neighbours are flagged as
            verified, helping officials prioritise. Please keep posts respectful.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {FORUM.map((t) => (
          <Card key={t.id} className="border-none shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-3 p-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {t.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{t.author}</span>
                  <Badge variant="outline" className="text-[10px]">{t.ward}</Badge>
                  <span className="text-[11px] text-muted-foreground">· {t.time}</span>
                </div>
                <div className="mt-0.5 truncate text-sm font-semibold">{t.topic}</div>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3.5 w-3.5" /> {t.upvotes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" /> {t.replies}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
