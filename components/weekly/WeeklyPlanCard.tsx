import Link from "next/link";
import { WeeklyPlan } from "@/types";
import { formatWeekRange, calcGoalsProgress } from "@/lib/utils";
import ProgressBar from "@/components/shared/ProgressBar";

interface WeeklyPlanCardProps {
  plan: WeeklyPlan;
}

export default function WeeklyPlanCard({ plan }: WeeklyPlanCardProps) {
  const progress = calcGoalsProgress(plan.goals);

  return (
    <Link
      href={`/weekly/${plan._id}`}
      className="block bg-surface-strong p-6 border border-transparent hover:border-primary transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold uppercase tracking-[0.2px] text-ink">{formatWeekRange(plan.weekStart)}</span>
        <span className="text-xs font-light text-muted">
          목표 {plan.goals.length}개
        </span>
      </div>
      <ProgressBar percent={progress} />
    </Link>
  );
}
