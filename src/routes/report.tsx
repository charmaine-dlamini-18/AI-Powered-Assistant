import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, MapPin, Sparkles, Mic, MicOff, Send, Languages, ShieldAlert, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/mock-data";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Issue — CommunityConnect" },
      {
        name: "description",
        content:
          "Submit a municipal issue in under a minute. Add photos, location and severity — AI helps categorize and translate your report.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [anonymous, setAnonymous] = useState(false);
  const [suggested, setSuggested] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [lang, setLang] = useState<"en" | "zu">("en");
  const recognitionRef = useRef<any>(null);

  const toggleVoice = () => {
    const SR: any =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
      null;
    if (!SR) {
      toast.error("Voice input not supported in this browser. Try Chrome on Android or desktop.");
      return;
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    const rec = new SR();
    rec.lang = lang === "zu" ? "zu-ZA" : "en-ZA";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onstart = () => setListening(true);
    rec.onerror = (e: any) => {
      setListening(false);
      toast.error(`Voice error: ${e.error || "unknown"}`);
    };
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setDescription((prev) => (prev ? prev + " " : "") + text.trim());
    };
    recognitionRef.current = rec;
    try {
      rec.start();
      toast.info(lang === "zu" ? "Ngilalele… khuluma manje." : "Listening… speak now.");
    } catch {
      setListening(false);
    }
  };

  const translate = async () => {
    const text = description.trim();
    if (!text) {
      toast.info("Write something first, then translate.");
      return;
    }
    const from = lang;
    const to = lang === "en" ? "zu" : "en";
    setTranslating(true);
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
      );
      const data = await res.json();
      const translated: string | undefined = data?.responseData?.translatedText;
      if (!translated) throw new Error("No translation");
      setDescription(translated);
      setLang(to);
      toast.success(to === "zu" ? "Kuhunyushelwe kusiZulu" : "Translated to English");
    } catch (err) {
      toast.error("Translation failed. Check your connection and try again.");
    } finally {
      setTranslating(false);
    }
  };


  const runAI = () => {
    if (!description.trim()) {
      toast.info("Write a short description first, then AI will suggest a category.");
      return;
    }
    const t = description.toLowerCase();
    let guess = "Other";
    if (/water|tap|pipe|leak|amanzi/.test(t)) guess = /burst|leak/.test(t) ? "Burst Pipe" : "Water Outage";
    else if (/electric|light|power|streetlight/.test(t)) guess = /streetlight|lamp/.test(t) ? "Broken Streetlight" : "Electricity Failure";
    else if (/pothole|road|tar/.test(t)) guess = /pothole/.test(t) ? "Pothole" : "Damaged Road";
    else if (/sewer|drain|toilet/.test(t)) guess = "Sewer Blockage";
    else if (/dump|rubbish|waste/.test(t)) guess = /dump/.test(t) ? "Illegal Dumping" : "Missed Waste Collection";
    else if (/flood/.test(t)) guess = "Flood Damage";
    else if (/tree/.test(t)) guess = "Fallen Tree";
    setSuggested(guess);
    setCategory(guess);
    toast.success(`AI suggests: ${guess}`);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please choose an issue category.");
      return;
    }
    toast.success("Report submitted", {
      description: "Reference CC-1049 · You'll be notified as status changes.",
    });
    setDescription("");
    setCategory("");
    setSuggested(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Report an issue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reports go directly to the correct municipal department and your ward councillor.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card className="border-none shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">1. Describe what's happening</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="desc" className="text-xs">Description</Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. No water for 3 days on Mvutshini Main Rd, tanker hasn't come…"
                  rows={4}
                  className="mt-1.5"
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={listening ? "default" : "ghost"}
                    className="text-xs"
                    onClick={toggleVoice}
                  >
                    {listening ? (
                      <>
                        <MicOff className="mr-1.5 h-3.5 w-3.5" /> Stop
                      </>
                    ) : (
                      <>
                        <Mic className="mr-1.5 h-3.5 w-3.5" /> Voice ({lang === "zu" ? "isiZulu" : "English"})
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={translate}
                    disabled={translating}
                  >
                    {translating ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Languages className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {lang === "en" ? "Translate → isiZulu" : "Translate → English"}
                  </Button>
                </div>

              </div>

              <div>
                <div className="flex items-end justify-between gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Choose category…" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" variant="secondary" onClick={runAI} className="gap-1.5">
                    <Sparkles className="h-4 w-4 text-warning" />
                    AI suggest
                  </Button>
                </div>
                {suggested && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-warning/10 p-2.5 text-xs text-warning-foreground">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                    <span>
                      <strong>AI:</strong> Based on your description, this looks like{" "}
                      <strong>{suggested}</strong>. Priority estimated{" "}
                      <strong>{urgency}</strong>. No duplicate reports found within 200 m.
                    </span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs">Urgency</Label>
                <RadioGroup value={urgency} onValueChange={setUrgency} className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["Low", "Medium", "High", "Critical"].map((u) => (
                    <label
                      key={u}
                      className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-sm transition ${
                        urgency === u ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <RadioGroupItem value={u} className="shrink-0" />
                      <span className="truncate">{u}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">2. Photo & location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                type="button"
                className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/40 py-8 transition hover:border-primary/40 hover:bg-muted/60"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Camera className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium">Take or upload a photo</div>
                <div className="text-xs text-muted-foreground">Adds credibility & speeds up repairs</div>
              </button>

              <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-success/15 text-success">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">Location detected</div>
                  <div className="truncate text-xs text-muted-foreground">
                    -30.7412, 30.4523 · Mvutshini, Port Shepstone · Ward 6
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px]">GPS ✓</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">3. Your details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-xs">Full name</Label>
                  <Input id="name" placeholder="e.g. Sipho Mkhize" disabled={anonymous} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs">Phone (for SMS updates)</Label>
                  <Input id="phone" placeholder="+27 …" disabled={anonymous} className="mt-1.5" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldAlert className="h-4 w-4 text-info" />
                  Submit anonymously
                </div>
                <Switch checked={anonymous} onCheckedChange={setAnonymous} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant panel */}
        <aside className="space-y-4">
          <Card className="border-none bg-gradient-to-br from-primary/5 to-warning/5 shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-warning" /> AI Report Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>The AI Assistant helps you by:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Suggesting the correct category</li>
                <li>Improving unclear descriptions</li>
                <li>Translating EN ⇄ isiZulu</li>
                <li>Detecting nearby duplicate reports</li>
                <li>Estimating priority for officials</li>
              </ul>
              <div className="rounded-lg bg-background/60 p-2 text-[10px] leading-relaxed">
                Responsible AI: suggestions are aids, not decisions. You always control what you submit.
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            <Send className="mr-2 h-4 w-4" /> Submit report
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            You'll receive updates as your report moves through Under Review → Assigned → In Progress → Resolved.
          </p>
        </aside>
      </form>
    </div>
  );
}
