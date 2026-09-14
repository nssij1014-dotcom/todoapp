"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/store";
import { formatWeekRange, calcGoalsProgress } from "@/lib/utils";
import ProgressBar from "@/components/shared/ProgressBar";
import WeeklyGoalItem from "@/components/weekly/WeeklyGoalItem";
import WeekGrid from "@/components/weekly/WeekGrid";

export default function WeeklyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { weeklyPlans, fetchWeeklyPlans, toggleWeeklyGoal, updateWeeklyPlan, todos, fetchTodos } =
    useStore();
  const [retrospective, setRetrospective] = useState("");
  const [retroSaved, setRetroSaved] = useState(false);
  const [syncedPlanId, setSyncedPlanId] = useState<string | null>(null);

  useEffect(() => {
    fetchWeeklyPlans();
    fetchTodos();
  }, [fetchWeeklyPlans, fetchTodos]);

  const plan = weeklyPlans.find((p) => p._id === id);

  if (plan && plan._id !== syncedPlanId) {
    setSyncedPlanId(plan._id);
    setRetrospective(plan.retrospective ?? "");
  }

  if (!plan) {
    return <p className="text-sm text-black/50">불러오는 중...</p>;
  }

  const planTodos = todos.filter((t) => t.weeklyPlanId === plan._id);
  const progress = calcGoalsProgress(plan.goals);

  const saveRetrospective = async () => {
    await updateWeeklyPlan(plan._id, { retrospective });
    setRetroSaved(true);
    setTimeout(() => setRetroSaved(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">{formatWeekRange(plan.weekStart)}</h1>
        <div className="mt-2 max-w-sm">
          <ProgressBar percent={progress} />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-2">이번 주 목표</h2>
        <div className="rounded-lg border border-black/10 dark:border-white/10 p-3">
          {plan.goals.length === 0 && (
            <p className="text-sm text-black/50">등록된 목표가 없습니다.</p>
          )}
          {plan.goals.map((g, i) => (
            <WeeklyGoalItem
              key={i}
              text={g.text}
              done={g.done}
              onToggle={(done) => toggleWeeklyGoal(plan._id, i, done)}
            />
          ))}
        </div>
      </div>

      {plan.memo && (
        <div>
          <h2 className="text-sm font-medium mb-2">메모</h2>
          <p className="text-sm whitespace-pre-wrap text-black/70 dark:text-white/70">
            {plan.memo}
          </p>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium mb-2">요일별 할 일</h2>
        <WeekGrid weeklyPlanId={plan._id} todos={planTodos} />
      </div>

      <div>
        <h2 className="text-sm font-medium mb-2">주간 회고</h2>
        <textarea
          className="w-full rounded-md border border-black/15 dark:border-white/15 px-3 py-2 text-sm bg-transparent"
          rows={4}
          value={retrospective}
          onChange={(e) => setRetrospective(e.target.value)}
          placeholder="이번 주는 어땠나요?"
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={saveRetrospective}
            className="px-3 py-1.5 text-sm rounded-md bg-black text-white dark:bg-white dark:text-black"
          >
            저장
          </button>
          {retroSaved && <span className="text-xs text-green-600">저장됨</span>}
        </div>
      </div>
    </div>
  );
}
