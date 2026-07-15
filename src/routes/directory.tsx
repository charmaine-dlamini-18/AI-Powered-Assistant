import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Phone, Mail, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DIRECTORY } from "@/lib/mock-data";

export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      { title: "Directory — CommunityConnect" },
      {
        name: "description",
        content:
          "Ward councillors, municipal departments, emergency services, clinics and NGOs serving your area.",
      },
    ],
  }),
  component: DirectoryPage,
});

function DirectoryPage() {
  const [q, setQ] = useState("");
  const filtered = DIRECTORY.filter(
    (d) =>
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.category.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Directory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ward councillors, departments and emergency contacts.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: water, councillor, SAPS, clinic…"
          className="pl-9"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((d) => (
          <Card key={d.name} className="border-none shadow-[var(--shadow-soft)]">
            <CardContent className="space-y-3 p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{d.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">{d.category}</Badge>
                    <Badge variant="outline" className="text-[10px]">{d.ward}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> {d.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> {d.email}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" /> {d.hours}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" /> Ray Nkonyeni LM, KZN
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" className="flex-1">
                  <Phone className="mr-1.5 h-3.5 w-3.5" /> Call
                </Button>
                <Button size="sm" variant="secondary" className="flex-1">
                  <Mail className="mr-1.5 h-3.5 w-3.5" /> Email
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
