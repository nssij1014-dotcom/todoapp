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
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">대시보드</h1>

      <div>
        <h2 className="text-sm font-medium mb-2">이번 주 계획</h2>
        {!currentPlan ? (
          <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 text-sm text-black/60 dark:text-white/60">
            아직 이번 주 계획이 없습니다.{" "}
            <Link href="/weekly" className="text-blue-600 underline">
              주간 계획 만들기
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Link href={`/weekly/${currentPlan._id}`} className="font-medium hover:underline">
                {formatWeekRange(currentPlan.weekStart)}
              </Link>
            </div>
            <div className="max-w-sm">
              <ProgressBar percent={calcGoalsProgress(currentPlan.goals)} />
            </div>
            <div>
              {currentPlan.goals.length === 0 && (
                <p className="text-sm text-black/50">등록된 목표가 없습니다.</p>
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
        <h2 className="text-sm font-medium mb-2">할 일 현황</h2>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {statusCounts.map(({ label, count }) => (
            <div
              key={label}
              className="rounded-lg border border-black/10 dark:border-white/10 p-4 text-center"
            >
              <p className="text-2xl font-semibold">{count}</p>
              <p className="text-xs text-black/50 dark:text-white/50 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {goals.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-2">목표별 이번 주 할 일</h2>
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
                  className="flex items-center justify-between rounded-md border border-black/10 dark:border-white/10 px-3 py-2 text-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                >
                  <span className="truncate">{goal.title}</span>
                  <span className="text-black/50 dark:text-white/50 shrink-0 ml-2">
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
