import { useState, useRef, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Bot, Send, X, Sparkles, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Msg = { role: "user" | "assistant"; text: string };

const CANNED: { match: RegExp; reply: string }[] = [
  {
    match: /water|tap|pipe|amanzi/i,
    reply:
      "For water issues, submit a report under Water Outage / Burst Pipe with a photo and location. Ugu District Water Services can be reached on 039 688 5700. I can prefill the form for you — tap Report Issue.",
  },
  {
    match: /electric|power|eskom|light|streetlight/i,
    reply:
      "Electricity and streetlight faults go to Eskom (08600 37566) or the municipal Electrical Dept. Log a report so your ward councillor sees it too. Load shedding schedules appear under Alerts.",
  },
  {
    match: /pothole|road|street/i,
    reply:
      "Potholes and damaged roads are handled by Roads & Infrastructure. Add a clear photo — the AI will estimate severity and priority automatically.",
  },
  {
    match: /councillor|ward/i,
    reply:
      "You can find your ward councillor in the Directory tab. Mvutshini falls under Ward 6, Ray Nkonyeni Local Municipality.",
  },
  {
    match: /zulu|isizulu|sawubona/i,
    reply:
      "Sawubona! Ngingakusiza ngesiZulu. Ungabika inkinga (amanzi, ugesi, imigwaqo) ngokuchofoza u-Report Issue. I-AI izokusiza ihumushele isiNgisi ukuze umasipala akwazi ukusabela.",
  },
];

function botReply(input: string): string {
  const hit = CANNED.find((c) => c.match.test(input));
  if (hit) return hit.reply;
  return "Thanks for your message. I can help you submit a report, find your ward councillor, check outage alerts, or explain municipal processes. What would you like to do?";
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text:
        "Sawubona! I'm the CommunityConnect AI Assistant. I can help you report issues, find your councillor, or check alerts in English or isiZulu.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);


  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }, { role: "assistant", text: botReply(t) }]);
    setInput("");
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
          className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ background: "var(--gradient-hero)" }}
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {open && (
        <Card className="fixed bottom-5 right-5 z-50 flex h-[560px] w-[min(92vw,400px)] flex-col overflow-hidden rounded-2xl border-2 p-0 shadow-[var(--shadow-elevated)]">
          <div
            className="flex items-center justify-between px-4 py-3 text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">AI Community Assistant</div>
                <div className="text-[11px] opacity-80">EN · isiZulu</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 transition hover:bg-white/30 active:bg-white/40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/30 p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t bg-card p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {["Report water outage", "Find my councillor", "Load shedding"].map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="cursor-pointer text-[11px] font-normal hover:bg-secondary/70"
                  onClick={() => {
                    setInput(s);
                  }}
                >
                  {s}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask in English or isiZulu…"
                className="text-sm"
              />
              <Button onClick={send} size="icon" aria-label="Send">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-start gap-1.5 text-[10px] leading-tight text-muted-foreground">
              <Languages className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                Responsible AI: responses are AI-generated and may be inaccurate. Verify critical
                info with your municipality.
              </span>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
