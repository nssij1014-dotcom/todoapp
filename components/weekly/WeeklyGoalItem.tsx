interface WeeklyGoalItemProps {
  text: string;
  done: boolean;
  onToggle: (done: boolean) => void;
}

export default function WeeklyGoalItem({ text, done, onToggle }: WeeklyGoalItemProps) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer">
      <input
        type="checkbox"
        checked={done}
        onChange={(e) => onToggle(e.target.checked)}
        className="h-4 w-4"
      />
      <span className={done ? "line-through text-black/40 dark:text-white/40" : ""}>
        {text}
      </span>
    </label>
  );
}
