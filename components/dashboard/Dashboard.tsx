"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/store";
import { getWeekStart, toDateInputValue, formatWeekRange, calcGoalsProgress } from "@/lib/utils";
import ProgressBar from "@/components/shared/ProgressBar";
import WeeklyGoalItem from "@/components/weekly/WeeklyGoalItem";
import { TodoStatus } from "@/types";

const STATUS_LABELS: { status: TodoStatus; label: string }[] = [
  { status: "todo", label: "할 일" },
  { status: "doing", label: "진행 중" },
  { status: "done", label: "완료" },
];

export default function Dashboard() {
  const { weeklyPlans, todos, goals, fetchWeeklyPlans, fetchTodos, fetchGoals, toggleWeeklyGoal } =
    useStore();

  useEffect(() => {
    fetchWeeklyPlans();
    fetchTodos();
    fetchGoals();
  }, [fetchWeeklyPlans, fetchTodos, fetchGoals]);

  const todayKey = toDateInputValue(getWeekStart(new Date()));
  const currentPlan = weeklyPlans.find((p) => toDateInputValue(new Date(p.weekStart)) === todayKey);

  const statusCounts = STATUS_LABELS.map(({ status, label }) => ({
    label,
    count: todos.filter((t) => t.status === status).length,
  }));

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold uppercase tracking-[-0.5px] text-ink">대시보드</h1>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-[1.5px] text-muted mb-3">이번 주 계획</h2>
        {!currentPlan ? (
          <div className="border border-hairline p-4 text-sm font-light text-body">
            아직 이번 주 계획이 없습니다.{" "}
            <Link href="/weekly" className="text-primary font-bold uppercase tracking-[0.5px] text-xs hover:underline">
              주간 계획 만들기
            </Link>
          </div>
        ) : (
          <div className="border border-hairline p-4 flex flex-col gap-3 hover:border-primary transition-colors">
            <div className="flex items-center justify-between">
              <Link href={`/weekly/${currentPlan._id}`} className="font-bold uppercase tracking-[0.3px] text-ink hover:underline">
                {formatWeekRange(currentPlan.weekStart)}
              </Link>
            </div>
            <div className="max-w-sm">
              <ProgressBar percent={calcGoalsProgress(currentPlan.goals)} />
            </div>
            <div>
              {currentPlan.goals.length === 0 && (
                <p className="text-sm font-light text-muted">등록된 목표가 없습니다.</p>
              )}
              {currentPlan.goals.map((g, i) => (
                <WeeklyGoalItem
                  key={i}
                  text={g.text}
                  done={g.done}
                  onToggle={(done) => toggleWeeklyGoal(currentPlan._id, i, done)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-[1.5px] text-muted mb-3">할 일 현황</h2>
        <div className="grid grid-cols-3 gap-px bg-hairline max-w-md">
          {statusCounts.map(({ label, count }) => (
            <div
              key={label}
              className="bg-surface-soft p-4 text-center"
            >
              <p className="text-2xl font-bold text-ink">{count}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {goals.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[1.5px] text-muted mb-3">목표별 이번 주 할 일</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl">
            {goals.map((goal) => {
              const count = currentPlan
                ? todos.filter((t) => t.goalId === goal._id && t.weeklyPlanId === currentPlan._id)
                    .length
                : 0;
              return (
                <Link
                  key={goal._id}
                  href="/goals"
                  className="flex items-center justify-between border border-hairline px-3 py-2 text-sm font-light text-body hover:border-primary hover:text-ink transition-colors"
                >
                  <span className="truncate">{goal.title}</span>
                  <span className="text-muted shrink-0 ml-2">
                    {count}개
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
