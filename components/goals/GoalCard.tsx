"use client";

import { useState } from "react";
import { Goal } from "@/types";
import ProgressBar from "@/components/shared/ProgressBar";

interface GoalCardProps {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
}

export default function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium">{goal.title}</h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="text-xs px-2 py-1 rounded border border-black/15 dark:border-white/15"
          >
            수정
          </button>
          {confirming ? (
            <>
              <button
                onClick={onDelete}
                className="text-xs px-2 py-1 rounded bg-red-600 text-white"
              >
                삭제 확인
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs px-2 py-1 rounded border border-black/15 dark:border-white/15"
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-xs px-2 py-1 rounded border border-black/15 dark:border-white/15"
            >
              삭제
            </button>
          )}
        </div>
      </div>
      {goal.description && (
        <p className="text-sm text-black/60 dark:text-white/60">{goal.description}</p>
      )}
      <ProgressBar percent={goal.progress} color="blue" thin />
    </div>
  );
}
