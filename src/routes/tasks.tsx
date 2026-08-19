import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Plus, Pencil, Trash2, Clock, CalendarDays, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { generateContent } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace" },
      {
        name: "description",
        content: "Convert objectives into a prioritised, time-boxed task plan with clear reasoning.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Organize priorities and create an actionable daily plan.",
      },
    ],
  }),
  component: TasksPage,
});

type Priority = "High" | "Medium" | "Low";

type Task = {
  id: string;
  name: string;
  priority: Priority;
  estimatedTime: string;
  suggestedDeadline: string;
  reason: string;
  completed: boolean;
};

const priorityStyles: Record<Priority, string> = {
  High: "border-destructive/40 bg-destructive/10 text-destructive",
  Medium: "border-warning/50 bg-warning/15 text-warning-foreground",
  Low: "border-success/40 bg-success/12 text-success",
};

function parseTasks(text: string): Task[] {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]) as {
      tasks?: Array<Partial<Task> & { priority?: string }>;
    };
    return (parsed.tasks ?? []).map((task, index) => ({
      id: `${Date.now()}-${index}`,
      name: task.name ?? "Untitled task",
      priority: (["High", "Medium", "Low"].includes(String(task.priority))
        ? task.priority
        : "Medium") as Priority,
      estimatedTime: task.estimatedTime ?? "Not specified",
      suggestedDeadline: task.suggestedDeadline ?? "Not specified",
      reason: task.reason ?? "",
      completed: false,
    }));
  } catch {
    return [];
  }
}

function TasksPage() {
  const generate = useServerFn(generateContent);

  const [objective, setObjective] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [availableTime, setAvailableTime] = useState("");
  const [taskCount, setTaskCount] = useState("5");
  const [validationError, setValidationError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const runPlan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generate({
        data: {
          feature: "task",
          input: { objective: objective.trim(), deadline, priority, availableTime, taskCount },
        },
      });
      const parsed = parseTasks(result.text);
      if (parsed.length === 0) {
        setError("Unable to generate the response. Please try again.");
      } else {
        setTasks(parsed);
        setHasGenerated(true);
      }
    } catch {
      setError("Unable to generate the response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (objective.trim().length < 10) {
      setValidationError("Describe what you need to accomplish using at least 10 characters.");
      return;
    }
    setValidationError(null);
    void runPlan();
  };

  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));

  const removeTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
    toast.success("Task removed from the plan.");
  };

  const addTask = () => {
    if (!newTaskName.trim()) {
      toast.error("Enter a task name before adding it to the plan.");
      return;
    }
    setTasks((current) => [
      ...current,
      {
        id: `manual-${Date.now()}`,
        name: newTaskName.trim(),
        priority: "Medium",
        estimatedTime: "Not specified",
        suggestedDeadline: "Not specified",
        reason: "Added manually by the user.",
        completed: false,
      },
    ]);
    setNewTaskName("");
    setHasGenerated(true);
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <AppShell>
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Organize priorities and create an actionable, time-boxed plan."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="h-fit rounded-2xl border-border shadow-card">
          <CardContent className="p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="objective">What do you need to accomplish?</Label>
                <Textarea
                  id="objective"
                  value={objective}
                  onChange={(event) => setObjective(event.target.value)}
                  placeholder="Describe the objectives, deliverables and constraints for this planning period."
                  className="min-h-40"
                  aria-invalid={Boolean(validationError)}
                  aria-describedby={validationError ? "objective-error" : undefined}
                  required
                />
                {validationError ? (
                  <p id="objective-error" role="alert" className="text-sm font-medium text-destructive">
                    {validationError}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["High", "Medium", "Low"].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="available-time">Available Time</Label>
                <Input
                  id="available-time"
                  value={availableTime}
                  onChange={(event) => setAvailableTime(event.target.value)}
                  placeholder="For example: 6 hours today"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-count">Number of Tasks</Label>
                <Select value={taskCount} onValueChange={setTaskCount}>
                  <SelectTrigger id="task-count" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["3", "5", "7", "10"].map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Generating response..." : "Create Task Plan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <section
            aria-label="AI-Generated Output"
            className="rounded-2xl border border-border bg-card shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border gradient-surface px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">
                Today&apos;s Priorities
                <span className="ml-2 font-normal text-muted-foreground">AI-Generated Output</span>
              </h2>
              {tasks.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  {completedCount} of {tasks.length} completed
                </p>
              ) : null}
            </div>

            <div className="space-y-3 p-4 md:p-6" aria-live="polite" aria-busy={isLoading}>
              {isLoading ? (
                <>
                  <p className="text-sm font-medium text-primary">Generating response...</p>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-4">
                  <div className="flex items-start gap-3">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{error}</p>
                      <Button className="mt-3" size="sm" variant="outline" onClick={() => void runPlan()}>
                        Retry
                      </Button>
                    </div>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  {hasGenerated
                    ? "All tasks have been removed. Add a task or create a new plan."
                    : "Describe what you need to accomplish, set your deadline, available time and number of tasks, then select Create Task Plan."}
                </p>
              ) : (
                tasks.map((task) => (
                  <article
                    key={task.id}
                    className={`rounded-xl border border-border p-4 transition-colors ${
                      task.completed ? "bg-muted/70" : "bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={(checked) => updateTask(task.id, { completed: checked === true })}
                        aria-label={`Mark ${task.name} as complete`}
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`text-sm font-medium text-foreground ${
                              task.completed ? "line-through opacity-70" : ""
                            }`}
                          >
                            {task.name}
                          </label>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}
                          >
                            {task.priority} priority
                          </span>
                          {task.completed ? (
                            <span className="rounded-full border border-success/40 bg-success/12 px-2 py-0.5 text-xs font-medium text-success">
                              Completed
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3.5" aria-hidden="true" />
                            {task.estimatedTime}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-3.5" aria-hidden="true" />
                            {task.suggestedDeadline}
                          </span>
                        </div>

                        {task.reason ? (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{task.reason}</p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${task.name}`}
                          onClick={() => {
                            const next = window.prompt("Edit task name", task.name);
                            if (next && next.trim()) updateTask(task.id, { name: next.trim() });
                          }}
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${task.name}`}
                          onClick={() => removeTask(task.id)}
                        >
                          <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))
              )}

              <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
                <Label htmlFor="new-task" className="sr-only">
                  New task name
                </Label>
                <Input
                  id="new-task"
                  value={newTaskName}
                  onChange={(event) => setNewTaskName(event.target.value)}
                  placeholder="Add a task to the plan"
                />
                <Button type="button" variant="outline" onClick={addTask}>
                  <Plus className="size-4" aria-hidden="true" />
                  Add Task
                </Button>
              </div>
            </div>
          </section>

          <AiDisclaimer />
        </div>
      </div>
    </AppShell>
  );
}
