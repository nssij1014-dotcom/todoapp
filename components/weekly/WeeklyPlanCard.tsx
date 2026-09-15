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
      className="block rounded-md border border-hairline bg-canvas p-6 hover:shadow-airbnb transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-ink">{formatWeekRange(plan.weekStart)}</span>
        <span className="text-xs text-muted">
          목표 {plan.goals.length}개
        </span>
      </div>
      <ProgressBar percent={progress} />
    </Link>
  );
}
