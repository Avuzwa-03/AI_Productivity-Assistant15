import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Workplace" },
      {
        name: "description",
        content: "Configure workspace defaults such as default tone, output length and review reminders.",
      },
      { property: "og:title", content: "Workspace Settings" },
      { property: "og:description", content: "Configure defaults for AI-assisted workplace output." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Standard");
  const [reviewReminder, setReviewReminder] = useState(true);

  return (
    <AppShell>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Configure workspace defaults applied across all AI features."
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          toast.success("Workspace preferences saved for this session.");
        }}
        className="grid max-w-3xl gap-6"
      >
        <Card className="rounded-2xl border-border shadow-card">
          <CardContent className="space-y-5 p-6">
            <h2 className="text-base font-semibold text-foreground">Profile</h2>
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Used to personalise email sign-offs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-role">Job Title</Label>
              <Input
                id="job-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="For example: Operations Manager"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-card">
          <CardContent className="space-y-5 p-6">
            <h2 className="text-base font-semibold text-foreground">AI Output Defaults</h2>
            <div className="space-y-2">
              <Label htmlFor="default-tone">Default Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="default-tone" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Formal", "Concise", "Persuasive"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-length">Default Output Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger id="default-length" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Brief", "Standard", "Detailed"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl bg-muted p-4">
              <div>
                <Label htmlFor="review-reminder">Show review reminder</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Display the responsible AI notice on every workspace.
                </p>
              </div>
              <Switch id="review-reminder" checked={reviewReminder} onCheckedChange={setReviewReminder} />
            </div>
          </CardContent>
        </Card>

        <div>
          <Button type="submit">Save Preferences</Button>
        </div>
      </form>

      <AiDisclaimer className="mt-8 max-w-3xl" />
    </AppShell>
  );
}
