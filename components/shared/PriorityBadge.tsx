import { Priority } from "@/types";

const CONFIG: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "높음",
    className: "bg-error/15 text-error",
  },
  medium: {
    label: "보통",
    className: "bg-surface-strong text-body",
  },
  low: {
    label: "낮음",
    className: "bg-surface-soft text-muted",
  },
};

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, className } = CONFIG[priority];
  return (
    <span className={`text-[10px] px-1.5 py-0.5 font-bold uppercase tracking-[0.5px] ${className}`}>
      {label}
    </span>
  );
}
