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
    <div className="rounded-md border border-hairline bg-canvas p-6 flex flex-col gap-2 hover:shadow-airbnb transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-ink">{goal.title}</h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="text-xs h-8 px-3 rounded-sm border border-hairline text-ink hover:bg-surface-soft transition-colors"
          >
            수정
          </button>
          {confirming ? (
            <>
              <button
                onClick={onDelete}
                className="text-xs h-8 px-3 rounded-sm bg-error text-on-primary hover:bg-error-hover transition-colors"
              >
                삭제 확인
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs h-8 px-3 rounded-sm border border-hairline text-ink hover:bg-surface-soft transition-colors"
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-xs h-8 px-3 rounded-sm border border-hairline text-error hover:bg-surface-soft transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>
      {goal.description && (
        <p className="text-sm text-body">{goal.description}</p>
      )}
      <ProgressBar percent={goal.progress} color="ink" thin />
    </div>
  );
}
