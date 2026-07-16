import { Suspense, lazy, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Filter, Layers, Droplets, Zap, Construction, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REPORTS, statusColor } from "@/lib/mock-data";

const CommunityMap = lazy(() => import("@/components/community-map"));

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Community Map — CommunityConnect" },
      {
        name: "description",
        content: "Interactive map of active and resolved service delivery reports across KZN wards.",
      },
    ],
  }),
  component: MapPage,
});

const iconFor = (cat: string) => {
  if (cat.includes("Water") || cat.includes("Pipe")) return Droplets;
  if (cat.includes("Electric") || cat.includes("Streetlight")) return Zap;
  if (cat.includes("Road") || cat.includes("Pothole")) return Construction;
  if (cat.includes("Waste") || cat.includes("Dump")) return Trash2;
  return MapPin;
};

function MapPage() {
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filtered = REPORTS.filter(
    (r) =>
      (category === "all" || r.category.toLowerCase().includes(category)) &&
      (status === "all" || r.status === status),
  );


  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Community map</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Active issues, outages and completed repairs across your ward.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40">
              <Filter className="mr-1 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="electric">Electricity</SelectItem>
              <SelectItem value="road">Roads</SelectItem>
              <SelectItem value="waste">Waste</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <Layers className="mr-1 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Map surface */}
        <Card className="relative overflow-hidden border-none shadow-[var(--shadow-soft)]">
          {mounted ? (
            <Suspense
              fallback={
                <div className="grid h-[520px] w-full place-items-center bg-muted/40 text-sm text-muted-foreground">
                  Loading map…
                </div>
              }
            >
              <CommunityMap reports={filtered} />
            </Suspense>
          ) : (
            <div className="grid h-[520px] w-full place-items-center bg-muted/40 text-sm text-muted-foreground">
              Loading map…
            </div>
          )}

          {/* Legend */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-[400] flex flex-wrap gap-2 rounded-xl bg-card/95 p-2 text-[11px] shadow-lg backdrop-blur">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Reported</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-warning" /> In Progress</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-success" /> Resolved</span>
          </div>
          <div className="pointer-events-none absolute right-4 top-4 z-[400] rounded-xl bg-card/95 px-3 py-1.5 text-[11px] font-medium shadow-lg backdrop-blur">
            Mvutshini · Port Shepstone
          </div>
        </Card>


        {/* List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 text-sm">
            <span className="font-medium">{filtered.length} reports</span>
            <Button variant="ghost" size="sm" className="text-xs">Sort: Recent</Button>
          </div>
          <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {filtered.map((r) => {
              const Icon = iconFor(r.category);
              return (
                <Card key={r.id} className="border-none shadow-[var(--shadow-soft)]">
                  <CardContent className="flex items-start gap-3 p-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground">{r.id}</span>
                        <Badge className={`${statusColor(r.status)} text-[10px]`}>{r.status}</Badge>
                      </div>
                      <div className="mt-1 truncate text-sm font-medium">{r.title}</div>
                      <div className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {r.location} · {r.ward}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
