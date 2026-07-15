import { createFileRoute } from "@tanstack/react-router";
import { Vote, Share2, CheckCircle2, Plus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PETITIONS } from "@/lib/mock-data";

export const Route = createFileRoute("/petitions")({
  head: () => ({
    meta: [
      { title: "Community Petitions — CommunityConnect" },
      {
        name: "description",
        content:
          "Create and sign digital petitions to raise urgent community concerns directly with municipal officials.",
      },
    ],
  }),
  component: PetitionsPage,
});

function PetitionsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Community petitions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rally your neighbours and formally raise concerns with the municipality.
          </p>
        </div>
        <Button>
          <Plus className="mr-1.5 h-4 w-4" /> Start petition
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {PETITIONS.map((p) => {
          const pct = Math.min(100, Math.round((p.signatures / p.target) * 100));
          const reached = p.signatures >= p.target;
          return (
            <Card key={p.id} className="border-none shadow-[var(--shadow-soft)]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{p.ward}</Badge>
                  <Badge className={reached ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                    {reached ? <><CheckCircle2 className="mr-1 h-3 w-3" /> Goal reached</> : "Open"}
                  </Badge>
                </div>
                <CardTitle className="mt-2 text-base leading-snug">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="h-3.5 w-3.5" />
                      {p.signatures.toLocaleString()} / {p.target.toLocaleString()} signatures
                    </span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} />
                </div>
                <div className="text-xs text-muted-foreground">
                  Status: <span className="font-medium text-foreground">{p.status}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Vote className="mr-1.5 h-3.5 w-3.5" /> Sign petition
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
