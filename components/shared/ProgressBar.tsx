interface ProgressBarProps {
  percent: number;
  color?: "green" | "blue";
  thin?: boolean;
}

const COLOR_CLASS = {
  green: "bg-green-600",
  blue: "bg-blue-600",
};

export default function ProgressBar({ percent, color = "green", thin = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-1 ${thin ? "h-1.5" : "h-2"} rounded-full bg-black/10 dark:bg-white/10 overflow-hidden`}
      >
        <div
          className={`h-full ${COLOR_CLASS[color]} rounded-full transition-all`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs text-black/50 dark:text-white/50 w-9 text-right">
        {clamped}%
      </span>
    </div>
  );
}
