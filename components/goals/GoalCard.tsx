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
    <div className="bg-surface-strong p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold uppercase tracking-[0.2px] text-ink">{goal.title}</h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="text-[11px] h-7 px-2.5 border border-hairline text-body font-bold uppercase tracking-[0.5px] hover:border-primary hover:text-ink transition-colors"
          >
            수정
          </button>
          {confirming ? (
            <>
              <button
                onClick={onDelete}
                className="text-[11px] h-7 px-2.5 border border-error text-error font-bold uppercase tracking-[0.5px] hover:bg-error hover:text-on-primary transition-colors"
              >
                삭제 확인
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-[11px] h-7 px-2.5 border border-hairline text-body font-bold uppercase tracking-[0.5px] hover:border-primary hover:text-ink transition-colors"
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-[11px] h-7 px-2.5 border border-hairline text-muted font-bold uppercase tracking-[0.5px] hover:border-error hover:text-error transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>
      {goal.description && (
        <p className="text-sm font-light text-body">{goal.description}</p>
      )}
      <ProgressBar percent={goal.progress} color="ink" thin />
    </div>
  );
}
