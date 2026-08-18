import { Info } from "lucide-react";

export const AI_DISCLAIMER =
  "AI-generated content may contain errors, omissions or outdated information. Review and verify important information before relying on or sharing AI-generated content. Do not enter confidential, sensitive or personal information unless appropriate safeguards are in place.";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      className={`flex gap-3 rounded-xl border border-info/30 bg-info/8 p-4 text-sm leading-relaxed text-foreground/85 ${className}`}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
      <p>{AI_DISCLAIMER}</p>
    </div>
  );
}
