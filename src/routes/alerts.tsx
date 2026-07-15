import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Droplets,
  Zap,
  CloudRain,
  Construction,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ALERTS } from "@/lib/mock-data";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Community Alerts — CommunityConnect" },
      {
        name: "description",
        content:
          "Planned water cuts, load shedding, weather warnings and municipal notices for your ward.",
      },
    ],
  }),
  component: AlertsPage,
});

const iconFor = (t: string) => {
  if (t === "Water") return Droplets;
  if (t === "Electricity") return Zap;
  if (t === "Weather") return CloudRain;
  if (t === "Roads") return Construction;
  return AlertTriangle;
};

const severityTone = (s: string) =>
  s === "high"
    ? "border-destructive/50 bg-destructive/5"
    : s === "medium"
    ? "border-warning/60 bg-warning/5"
    : "border-info/50 bg-info/5";

function AlertsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Community alerts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Planned interruptions, emergency notices and weather warnings.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          {ALERTS.map((a) => {
            const Icon = iconFor(a.type);
            return (
              <Card
                key={a.id}
                className={`border-l-4 border-none border-l-warning shadow-[var(--shadow-soft)] ${severityTone(a.severity)}`}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{a.type}</Badge>
                      <Badge className="bg-card text-foreground">{a.severity.toUpperCase()}</Badge>
                      <span className="text-xs text-muted-foreground">{a.when}</span>
                    </div>
                    <h3 className="mt-1 text-base font-semibold leading-tight">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="h-fit border-none shadow-[var(--shadow-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" /> Notification preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: "water", label: "Water interruptions" },
              { id: "power", label: "Electricity & load shedding" },
              { id: "weather", label: "Weather & flood warnings" },
              { id: "roads", label: "Road closures" },
              { id: "muni", label: "Municipal notices" },
              { id: "sms", label: "SMS (low-data areas)" },
            ].map((row, i) => (
              <div key={row.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                <Label htmlFor={row.id} className="text-sm font-normal">{row.label}</Label>
                <Switch id={row.id} defaultChecked={i < 4} />
              </div>
            ))}
            <div className="rounded-lg bg-info/10 p-2.5 text-[11px] leading-relaxed text-info">
              Data sources: Eskom, SAWS, Ugu District Municipality, RSM notices and verified community reports.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
