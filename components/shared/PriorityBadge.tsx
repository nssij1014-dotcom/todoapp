import { Priority } from "@/types";

const CONFIG: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "높음",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  },
  medium: {
    label: "보통",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  low: {
    label: "낮음",
    className: "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60",
  },
};

interface PriorityBadgeProps {
  priority: Priority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const { label, className } = CONFIG[priority];
  return (
    <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${className}`}>
      {label}
    </span>
  );
}
