import { Priority } from "@/types";

const CONFIG: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "높음",
    className: "bg-primary-disabled text-primary-active",
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
    <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${className}`}>
      {label}
    </span>
  );
}
