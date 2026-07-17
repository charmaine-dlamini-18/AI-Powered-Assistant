import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUp, MessageCircle, Plus, ShieldCheck, Send, ArrowLeft, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

type Reply = { id: string; author: string; body: string; time: string };
type Topic = {
  id: string;
  author: string;
  topic: string;
  body: string;
  ward: string;
  time: string;
  upvotes: number;
  upvoted?: boolean;
  replies: Reply[];
};

const STORAGE_KEY = "cc-forum-topics-v1";
const USER_KEY = "cc-forum-user";

const WARDS = ["Ward 5", "Ward 6", "Ward 7", "Ward 8", "All"];

function seedTopics(): Topic[] {
  return FORUM.map((t) => ({
    id: String(t.id),
    author: t.author,
    topic: t.topic,
    body: "",
    ward: t.ward,
    time: t.time,
    upvotes: t.upvotes,
    replies: Array.from({ length: Math.min(t.replies, 3) }).map((_, i) => ({
      id: `${t.id}-r${i}`,
      author: ["Nomsa D.", "Sipho M.", "Thabo K.", "Anonymous"][i % 4],
      body: [
        "Same issue on my street — I've reported it too.",
        "Councillor said they'll send a team this week.",
        "Please share updates when you hear anything.",
      ][i % 3],
      time: `${i + 1}h ago`,
    })),
  }));
}

function ForumPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setTopics(raw ? (JSON.parse(raw) as Topic[]) : seedTopics());
    } catch {
      setTopics(seedTopics());
    }
    setDisplayName(localStorage.getItem(USER_KEY) || "");
  }, []);

  useEffect(() => {
    if (topics.length) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(topics)); } catch {}
    }
  }, [topics]);

  const saveName = (n: string) => {
    setDisplayName(n);
    try { localStorage.setItem(USER_KEY, n); } catch {}
  };

  const activeTopic = useMemo(() => topics.find((t) => t.id === activeId) ?? null, [topics, activeId]);

  const addTopic = (t: Omit<Topic, "id" | "time" | "upvotes" | "replies">) => {
    const newT: Topic = {
      ...t,
      id: `t-${Date.now()}`,
      time: "just now",
      upvotes: 0,
      replies: [],
    };
    setTopics((prev) => [newT, ...prev]);
    setComposerOpen(false);
    setActiveId(newT.id);
  };

  const toggleUpvote = (id: string) => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, upvoted: !t.upvoted, upvotes: t.upvotes + (t.upvoted ? -1 : 1) }
          : t,
      ),
    );
  };

  const addReply = (topicId: string, body: string) => {
    const author = displayName.trim() || "Anonymous";
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? {
              ...t,
              replies: [
                ...t.replies,
                { id: `r-${Date.now()}`, author, body, time: "just now" },
              ],
            }
          : t,
      ),
    );
  };

  if (activeTopic) {
    return (
      <TopicView
        topic={activeTopic}
        onBack={() => setActiveId(null)}
        onReply={(body) => addReply(activeTopic.id, body)}
        onUpvote={() => toggleUpvote(activeTopic.id)}
        displayName={displayName}
        onNameChange={saveName}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Community forum</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Verify reports, share updates and collaborate on solutions. All posts are moderated.
          </p>
        </div>
        <Button onClick={() => setComposerOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> New topic
        </Button>
      </header>

      <Card className="border-none bg-info/5 shadow-[var(--shadow-soft)]">
        <CardContent className="flex items-start gap-3 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-info" />
          <p className="text-xs leading-relaxed text-info">
            <strong>Community moderation:</strong> topics upvoted by 5+ neighbours are flagged as
            verified, helping officials prioritise. Please keep posts respectful.
          </p>
        </CardContent>
      </Card>

      {composerOpen && (
        <NewTopicComposer
          defaultName={displayName}
          onCancel={() => setComposerOpen(false)}
          onSubmit={(payload) => {
            saveName(payload.author);
            addTopic(payload);
          }}
        />
      )}

      <div className="space-y-2">
        {topics.map((t) => (
          <Card
            key={t.id}
            role="button"
            tabIndex={0}
            onClick={() => setActiveId(t.id)}
            onKeyDown={(e) => (e.key === "Enter" ? setActiveId(t.id) : null)}
            className="cursor-pointer border-none shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
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
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleUpvote(t.id); }}
                  className={`flex items-center gap-1 rounded-md px-1.5 py-1 transition hover:bg-muted ${t.upvoted ? "text-primary" : ""}`}
                  aria-label="Upvote"
                >
                  <ArrowUp className="h-3.5 w-3.5" /> {t.upvotes}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" /> {t.replies.length}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NewTopicComposer({
  defaultName,
  onCancel,
  onSubmit,
}: {
  defaultName: string;
  onCancel: () => void;
  onSubmit: (t: { author: string; topic: string; body: string; ward: string }) => void;
}) {
  const [author, setAuthor] = useState(defaultName);
  const [topic, setTopic] = useState("");
  const [body, setBody] = useState("");
  const [ward, setWard] = useState("Ward 6");

  return (
    <Card className="border-none shadow-[var(--shadow-soft)]">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Start a new topic</h2>
          <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="author">Display name</Label>
            <Input
              id="author"
              placeholder="Anonymous"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ward">Ward</Label>
            <Select value={ward} onValueChange={setWard}>
              <SelectTrigger id="ward"><SelectValue /></SelectTrigger>
              <SelectContent>
                {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="topic-title">Topic</Label>
          <Input
            id="topic-title"
            placeholder="e.g. Water tanker schedule this week?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="topic-body">Details</Label>
          <Textarea
            id="topic-body"
            rows={4}
            placeholder="Share context, location, and anything the community should know."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button
            disabled={!topic.trim()}
            onClick={() =>
              onSubmit({
                author: author.trim() || "Anonymous",
                topic: topic.trim(),
                body: body.trim(),
                ward,
              })
            }
          >
            Post topic
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TopicView({
  topic,
  onBack,
  onReply,
  onUpvote,
  displayName,
  onNameChange,
}: {
  topic: Topic;
  onBack: () => void;
  onReply: (body: string) => void;
  onUpvote: () => void;
  displayName: string;
  onNameChange: (n: string) => void;
}) {
  const [reply, setReply] = useState("");

  const send = () => {
    const body = reply.trim();
    if (!body) return;
    onReply(body);
    setReply("");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6 lg:p-8">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to forum
      </Button>

      <Card className="border-none shadow-[var(--shadow-soft)]">
        <CardContent className="space-y-3 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {topic.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{topic.author}</span>
                <Badge variant="outline" className="text-[10px]">{topic.ward}</Badge>
                <span className="text-[11px] text-muted-foreground">· {topic.time}</span>
              </div>
              <h1 className="mt-0.5 text-lg font-semibold sm:text-xl">{topic.topic}</h1>
            </div>
            <button
              type="button"
              onClick={onUpvote}
              className={`flex flex-col items-center rounded-md px-2 py-1 text-xs transition hover:bg-muted ${topic.upvoted ? "text-primary" : "text-muted-foreground"}`}
              aria-label="Upvote"
            >
              <ArrowUp className="h-4 w-4" />
              <span className="font-semibold">{topic.upvotes}</span>
            </button>
          </div>
          {topic.body && (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {topic.body}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">
          {topic.replies.length} {topic.replies.length === 1 ? "reply" : "replies"}
        </h2>
        {topic.replies.map((r) => (
          <Card key={r.id} className="border-none shadow-[var(--shadow-soft)]">
            <CardContent className="flex items-start gap-3 p-3 sm:p-4">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-secondary/10 text-[10px] font-semibold text-secondary-foreground">
                  {r.author.split(" ").map((x) => x[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium">{r.author}</span>
                  <span className="text-[11px] text-muted-foreground">· {r.time}</span>
                </div>
                <p className="mt-0.5 whitespace-pre-wrap text-sm">{r.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {topic.replies.length === 0 && (
          <p className="px-1 text-xs text-muted-foreground">Be the first to reply.</p>
        )}
      </div>

      <Card className="border-none shadow-[var(--shadow-soft)]">
        <CardContent className="space-y-2 p-3 sm:p-4">
          <Input
            placeholder="Your name (optional)"
            value={displayName}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-9"
          />
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Write a reply…"
              rows={2}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
              }}
            />
            <Button onClick={send} disabled={!reply.trim()} size="icon" aria-label="Send reply">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Cmd/Ctrl+Enter to send. Replies are stored locally on your device in this prototype.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
