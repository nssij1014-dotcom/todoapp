interface ProgressBarProps {
  percent: number;
  color?: "primary" | "ink";
  thin?: boolean;
}

const COLOR_CLASS = {
  primary: "bg-ink",
  ink: "bg-body-strong",
};

export default function ProgressBar({ percent, color = "primary", thin = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex-1 ${thin ? "h-1" : "h-1.5"} bg-hairline overflow-hidden`}
      >
        <div
          className={`h-full ${COLOR_CLASS[color]} transition-all`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs font-light text-muted w-9 text-right">
        {clamped}%
      </span>
    </div>
  );
}
