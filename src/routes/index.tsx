import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate workplace writing, meeting summaries, task planning and research with the AI Workplace Productivity Assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "An all-in-one AI assistant for professional email, meeting summaries, task planning, research and workplace chat.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Emails Generated", value: "128", accent: "text-primary", ring: "bg-primary/10", icon: Mail },
  { label: "Meetings Summarized", value: "42", accent: "text-secondary", ring: "bg-secondary/10", icon: FileText },
  { label: "Tasks Planned", value: "316", accent: "text-accent-foreground", ring: "bg-accent/20", icon: ListChecks },
  { label: "Research Sessions", value: "57", accent: "text-info", ring: "bg-info/10", icon: BookOpen },
];

const quickActions = [
  {
    title: "Generate an Email",
    description: "Create professional emails in seconds.",
    to: "/email",
    icon: Mail,
  },
  {
    title: "Summarize a Meeting",
    description: "Turn meeting notes into clear summaries and action items.",
    to: "/meetings",
    icon: FileText,
  },
  {
    title: "Plan My Tasks",
    description: "Organize priorities and create an actionable plan.",
    to: "/tasks",
    icon: ListChecks,
  },
  {
    title: "Research a Topic",
    description: "Generate structured research assistance.",
    to: "/research",
    icon: BookOpen,
  },
  {
    title: "Ask AI",
    description: "Get workplace assistance through conversational AI.",
    to: "/chat",
    icon: MessageSquare,
  },
] as const;

function Dashboard() {
  const score = 82;

  return (
    <AppShell>
      <section className="gradient-primary mb-8 rounded-3xl p-6 shadow-elevated md:p-8">
        <p className="text-sm font-medium text-primary-foreground/80">Welcome back</p>
        <h1 className="mt-1 text-3xl font-semibold text-primary-foreground md:text-4xl">Good morning</h1>
        <p className="mt-2 max-w-xl text-sm text-primary-foreground/85 md:text-base">
          Your AI-powered workplace productivity assistant.
        </p>
      </section>

      <section aria-label="Usage statistics" className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-border shadow-card transition-shadow hover:shadow-elevated">
            <CardContent className="flex items-center gap-4 p-5">
              <span className={`flex size-11 items-center justify-center rounded-xl ${stat.ring}`}>
                <stat.icon className={`size-5 ${stat.accent}`} aria-hidden="true" />
              </span>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section aria-label="Productivity overview" className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border shadow-card lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">AI Productivity Score</h2>
              <span className="rounded-full bg-success/12 px-3 py-1 text-xs font-medium text-success">
                On track
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on assisted tasks completed over the last 30 days.
            </p>
            <div className="mt-6 flex items-end gap-3">
              <span className="text-4xl font-semibold text-gradient">{score}</span>
              <span className="pb-1 text-sm text-muted-foreground">out of 100</span>
            </div>
            <Progress value={score} className="mt-4 h-2.5" aria-label={`AI productivity score: ${score} out of 100`} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
                <Clock className="size-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">18.5 hours saved</p>
                  <p className="text-xs text-muted-foreground">Estimated this month</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted p-4">
                <TrendingUp className="size-5 text-success" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">+12% output</p>
                  <p className="text-xs text-muted-foreground">Compared with last month</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Demonstration values are shown for presentation purposes.
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-surface rounded-2xl border-border shadow-card">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold text-foreground">One connected workspace</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Five AI tools share a single structured prompt framework, so drafting, summarizing,
              planning and research follow the same professional standard.
            </p>
            <Link
              to="/responsible-ai"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Review responsible AI practices
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </section>

      <section aria-label="Quick actions" className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="gradient-accent flex size-11 items-center justify-center rounded-xl">
                <action.icon className="size-5 text-primary-foreground" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{action.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AiDisclaimer />
    </AppShell>
  );
}
