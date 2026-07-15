import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Sparkles, AlertTriangle, Clock, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Municipality Analytics — CommunityConnect" },
      {
        name: "description",
        content:
          "AI-powered insights for municipal officials: trends, high-risk locations, response times and predictive maintenance.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const trend = [
  { label: "Water", value: 74, delta: "+12%" },
  { label: "Electricity", value: 61, delta: "+8%" },
  { label: "Roads", value: 48, delta: "-3%" },
  { label: "Waste", value: 82, delta: "+5%" },
  { label: "Sewer", value: 55, delta: "+22%" },
];

const bars = [40, 55, 48, 72, 60, 88, 74, 92, 80, 66, 78, 95];

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Municipality analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-generated insights for Ray Nkonyeni Local Municipality officials.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3 text-warning" /> AI insights · updated hourly
        </Badge>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: Users, label: "Active residents", value: "8,412" },
          { icon: TrendingUp, label: "Reports (30d)", value: "1,248" },
          { icon: Clock, label: "Avg resolution", value: "3.4 d" },
          { icon: AlertTriangle, label: "Recurring hotspots", value: "6" },
        ].map((k) => (
          <Card key={k.label} className="border-none shadow-[var(--shadow-soft)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <k.icon className="h-4 w-4" /> {k.label}
              </div>
              <div className="mt-1 font-display text-2xl font-bold">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="border-none shadow-[var(--shadow-soft)] lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Reports over the last 12 weeks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-52 items-end gap-2">
              {bars.map((b, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md transition hover:opacity-80"
                    style={{
                      height: `${b}%`,
                      background:
                        "linear-gradient(180deg, oklch(0.42 0.11 260), oklch(0.58 0.13 235))",
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">W{i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[var(--shadow-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-success" /> Category resolution rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trend.map((t) => (
              <div key={t.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{t.label}</span>
                  <span className="text-muted-foreground">{t.value}% · {t.delta}</span>
                </div>
                <Progress value={t.value} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI insights */}
      <Card className="border-none bg-gradient-to-br from-primary/5 via-transparent to-warning/5 shadow-[var(--shadow-soft)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-warning" /> AI recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {[
            {
              title: "Predictive: sewer risk in Lower Mvutshini",
              body: "3 reports in 72h + heavy rainfall forecast. Recommend proactive inspection before Friday.",
              tag: "High",
              tone: "bg-destructive/10 text-destructive",
            },
            {
              title: "Reallocate: Roads crew Ward 6",
              body: "Ward 6 potholes rising 18% while Ward 8 workload dropped. Rebalance 2 crew members.",
              tag: "Medium",
              tone: "bg-warning/15 text-warning-foreground",
            },
            {
              title: "Satisfaction: waste collection ↑",
              body: "82% resolved on-time. Citizen satisfaction now 4.1/5 (+0.4). Keep current schedule.",
              tag: "Positive",
              tone: "bg-success/15 text-success",
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl bg-card p-4 shadow-sm">
              <Badge className={`${c.tone} mb-2 text-[10px]`}>{c.tag}</Badge>
              <div className="text-sm font-semibold leading-tight">{c.title}</div>
              <p className="mt-1 text-xs text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hotspots */}
      <Card className="border-none shadow-[var(--shadow-soft)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-primary" /> Recurring hotspots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { name: "Mvutshini Main Rd", ward: "Ward 6", issue: "Potholes · 14 reports", pct: 88 },
              { name: "Lower Mvutshini", ward: "Ward 6", issue: "Sewer · 9 reports", pct: 74 },
              { name: "Beach Rd corridor", ward: "Ward 5", issue: "Streetlights · 7 reports", pct: 61 },
              { name: "River Bridge", ward: "Ward 8", issue: "Flood damage · 6 reports", pct: 55 },
            ].map((h) => (
              <div key={h.name} className="rounded-xl border bg-muted/30 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{h.name}</div>
                    <div className="text-xs text-muted-foreground">{h.ward} · {h.issue}</div>
                  </div>
                  <Badge className="bg-destructive/10 text-destructive">{h.pct}</Badge>
                </div>
                <Progress value={h.pct} className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-[11px] text-muted-foreground">
        AI recommendations are decision-support only. Municipal officials retain full authority over
        resource allocation and repair prioritisation.
      </p>
    </div>
  );
}
