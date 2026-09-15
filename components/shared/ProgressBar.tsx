interface ProgressBarProps {
  percent: number;
  color?: "primary" | "ink";
  thin?: boolean;
}

const COLOR_CLASS = {
  primary: "bg-primary",
  ink: "bg-ink",
};

export default function ProgressBar({ percent, color = "primary", thin = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-1 ${thin ? "h-1.5" : "h-2"} rounded-full bg-hairline-soft overflow-hidden`}
      >
        <div
          className={`h-full ${COLOR_CLASS[color]} rounded-full transition-all`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs text-muted w-9 text-right">
        {clamped}%
      </span>
    </div>
  );
}
