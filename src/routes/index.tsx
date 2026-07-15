import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FilePlus2,
  Droplets,
  Zap,
  Construction,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { REPORTS, ALERTS, statusColor, urgencyColor } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CommunityConnect" },
      {
        name: "description",
        content:
          "Live overview of municipal reports, alerts and community activity in Mvutshini and Port Shepstone.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Total Reports", value: "1,248", delta: "+42 this week", icon: FilePlus2, tone: "primary" },
  { label: "In Progress", value: "184", delta: "Avg 3.4 days", icon: Clock, tone: "warning" },
  { label: "Resolved (30d)", value: "612", delta: "+18% vs last month", icon: CheckCircle2, tone: "success" },
  { label: "Active Alerts", value: "7", delta: "2 high severity", icon: AlertTriangle, tone: "info" },
];

const quickReport = [
  { label: "Water", icon: Droplets, tone: "info" },
  { label: "Electricity", icon: Zap, tone: "warning" },
  { label: "Roads", icon: Construction, tone: "primary" },
  { label: "Waste", icon: Trash2, tone: "success" },
];

function toneClass(tone: string) {
  switch (tone) {
    case "primary": return "bg-primary/10 text-primary";
    case "success": return "bg-success/15 text-success";
    case "warning": return "bg-warning/20 text-[oklch(0.4_0.13_65)]";
    case "info": return "bg-info/15 text-info";
    default: return "bg-muted text-muted-foreground";
  }
}

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl px-6 py-8 text-primary-foreground sm:px-10 sm:py-12"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-[oklch(0.78_0.15_70)]/25 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <Badge className="mb-3 border-white/20 bg-white/15 text-primary-foreground hover:bg-white/20">
              <Sparkles className="mr-1 h-3 w-3" /> AI-powered civic engagement
            </Badge>
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
              Building better service delivery, together.
            </h1>
            <p className="mt-3 max-w-2xl text-sm opacity-90 sm:text-base">
              Report municipal issues in under a minute, track repairs in real time, and stay
              informed about water, electricity and safety in your ward.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[oklch(0.78_0.15_70)] text-[oklch(0.2_0.03_260)] hover:bg-[oklch(0.74_0.16_65)]">
                <Link to="/report">
                  <FilePlus2 className="mr-2 h-4 w-4" /> Report an issue
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/15 text-primary-foreground hover:bg-white/25">
                <Link to="/map">
                  <MapPin className="mr-2 h-4 w-4" /> View community map
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-none shadow-[var(--shadow-soft)]">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold sm:text-3xl">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.delta}</div>
                </div>
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClass(s.tone)}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick report */}
      <Card className="border-none shadow-[var(--shadow-soft)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-warning" /> Quick report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickReport.map((q) => (
              <Link
                key={q.label}
                to="/report"
                className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
              >
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${toneClass(q.tone)}`}>
                  <q.icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">{q.label}</div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent reports */}
        <Card className="border-none shadow-[var(--shadow-soft)] lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Recent reports</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/map">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {REPORTS.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-transparent bg-muted/40 p-3 hover:border-border hover:bg-muted/60 sm:flex sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{r.id}</span>
                    <Badge variant="secondary" className="text-[10px]">{r.category}</Badge>
                  </div>
                  <div className="mt-1 truncate text-sm font-medium">{r.title}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {r.location} · {r.ward} · {r.submittedAt}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <Badge className={`${urgencyColor(r.urgency)} text-[10px]`}>{r.urgency}</Badge>
                  <Badge className={`${statusColor(r.status)} text-[10px]`}>{r.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts + trends */}
        <div className="space-y-6">
          <Card className="border-none shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-warning" /> Active alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ALERTS.slice(0, 3).map((a) => (
                <div key={a.id} className="rounded-xl border-l-4 border-warning bg-warning/5 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-warning-foreground">{a.type}</div>
                    <span className="text-[10px] text-muted-foreground">{a.when}</span>
                  </div>
                  <div className="mt-1 text-sm font-medium leading-tight">{a.title}</div>
                </div>
              ))}
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link to="/alerts">All alerts</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-success" /> Municipal response
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Water", value: 74 },
                { label: "Electricity", value: 61 },
                { label: "Roads", value: 48 },
                { label: "Waste", value: 82 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{row.label}</span>
                    <span className="text-muted-foreground">{row.value}% resolved</span>
                  </div>
                  <Progress value={row.value} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
