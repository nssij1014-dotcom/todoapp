"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { Goal } from "@/types";
import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";
import Modal from "@/components/shared/Modal";

export default function GoalsPage() {
  const { goals, goalsLoading, fetchGoals, addGoal, updateGoal, deleteGoal } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const openCreate = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleSubmit = async (data: { title: string; description?: string }) => {
    if (editingGoal) {
      await updateGoal(editingGoal._id, data);
    } else {
      await addGoal(data);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">1년 목표</h1>
        <button
          onClick={openCreate}
          className="px-3 py-1.5 text-sm rounded-md bg-black text-white dark:bg-white dark:text-black"
        >
          + 새 목표
        </button>
      </div>

      {goalsLoading && <p className="text-sm text-black/50">불러오는 중...</p>}

      {!goalsLoading && goals.length === 0 && (
        <p className="text-sm text-black/50 dark:text-white/50">
          아직 목표가 없습니다. 새 목표를 추가해보세요.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <GoalCard
            key={goal._id}
            goal={goal}
            onEdit={() => openEdit(goal)}
            onDelete={() => deleteGoal(goal._id)}
          />
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingGoal ? "목표 수정" : "새 목표"}
      >
        <GoalForm
          initial={editingGoal ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
