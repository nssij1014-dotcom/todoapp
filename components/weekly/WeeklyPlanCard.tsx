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
      className="block rounded-lg border border-black/10 dark:border-white/10 p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{formatWeekRange(plan.weekStart)}</span>
        <span className="text-xs text-black/50 dark:text-white/50">
          목표 {plan.goals.length}개
        </span>
      </div>
      <ProgressBar percent={progress} />
    </Link>
  );
}
