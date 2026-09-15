"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store";
import WeeklyPlanCard from "@/components/weekly/WeeklyPlanCard";
import WeeklyPlanForm from "@/components/weekly/WeeklyPlanForm";
import Modal from "@/components/shared/Modal";

export default function WeeklyListPage() {
  const { weeklyPlans, weeklyLoading, fetchWeeklyPlans, addWeeklyPlan, fetchGoals } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchWeeklyPlans();
    fetchGoals();
  }, [fetchWeeklyPlans, fetchGoals]);

  const recentPlans = weeklyPlans.slice(0, 4);

  const handleSubmit = async (data: Parameters<typeof addWeeklyPlan>[0]) => {
    const result = await addWeeklyPlan(data);
    if (result.ok) setModalOpen(false);
    return result;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-[-0.5px] text-ink">주간 계획</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-6 h-11 text-xs font-bold uppercase tracking-[1.5px] border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors"
        >
          + 새 주간 계획
        </button>
      </div>

      {weeklyLoading && <p className="text-sm font-light text-muted">불러오는 중...</p>}

      {!weeklyLoading && recentPlans.length === 0 && (
        <p className="text-sm font-light text-muted">
          아직 주간 계획이 없습니다.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {recentPlans.map((plan) => (
          <WeeklyPlanCard key={plan._id} plan={plan} />
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="새 주간 계획">
        <WeeklyPlanForm onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
