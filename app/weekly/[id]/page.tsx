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
    return <p className="text-sm font-light text-muted">불러오는 중...</p>;
  }

  const planTodos = todos.filter((t) => t.weeklyPlanId === plan._id);
  const progress = calcGoalsProgress(plan.goals);

  const saveRetrospective = async () => {
    await updateWeeklyPlan(plan._id, { retrospective });
    setRetroSaved(true);
    setTimeout(() => setRetroSaved(false), 1500);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-[-0.5px] text-ink">{formatWeekRange(plan.weekStart)}</h1>
        <div className="mt-3 max-w-sm">
          <ProgressBar percent={progress} />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-[1.5px] text-muted mb-3">이번 주 목표</h2>
        <div className="border border-hairline p-3">
          {plan.goals.length === 0 && (
            <p className="text-sm font-light text-muted">등록된 목표가 없습니다.</p>
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
          <h2 className="text-xs font-bold uppercase tracking-[1.5px] text-muted mb-3">메모</h2>
          <p className="text-sm font-light whitespace-pre-wrap text-body">
            {plan.memo}
          </p>
        </div>
      )}

      <div>
        <h2 className="text-xs font-bold uppercase tracking-[1.5px] text-muted mb-3">요일별 할 일</h2>
        <WeekGrid weeklyPlanId={plan._id} todos={planTodos} />
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-[1.5px] text-muted mb-3">주간 회고</h2>
        <textarea
          className="w-full border border-hairline px-3 py-2.5 text-sm font-light bg-surface-strong text-ink placeholder:text-muted-soft focus:outline-none focus:border-2 focus:border-primary"
          rows={4}
          value={retrospective}
          onChange={(e) => setRetrospective(e.target.value)}
          placeholder="이번 주는 어땠나요?"
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={saveRetrospective}
            className="px-6 h-11 text-xs font-bold uppercase tracking-[1.5px] border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors"
          >
            저장
          </button>
          {retroSaved && <span className="text-xs font-bold uppercase tracking-[0.5px] text-primary">저장됨</span>}
        </div>
      </div>
    </div>
  );
}
