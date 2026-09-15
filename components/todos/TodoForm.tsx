"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { Todo, Priority } from "@/types";
import { toDateInputValue } from "@/lib/utils";

interface TodoFormProps {
  initial?: Todo;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: string | null;
    weeklyPlanId?: string | null;
    goalId?: string | null;
  }) => Promise<void> | void;
  onCancel: () => void;
  onDelete?: () => void;
}

const inputClass =
  "w-full border border-hairline px-3 py-2.5 text-sm font-light bg-surface-strong text-ink placeholder:text-muted-soft focus:outline-none focus:border-2 focus:border-primary";
const labelClass = "text-xs font-bold uppercase tracking-[0.5px] block mb-1.5 text-muted";

export default function TodoForm({ initial, onSubmit, onCancel, onDelete }: TodoFormProps) {
  const { weeklyPlans, goals } = useStore();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [dueDate, setDueDate] = useState(
    initial?.dueDate ? toDateInputValue(new Date(initial.dueDate)) : ""
  );
  const [weeklyPlanId, setWeeklyPlanId] = useState(initial?.weeklyPlanId ?? "");
  const [goalId, setGoalId] = useState(initial?.goalId ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        weeklyPlanId: weeklyPlanId || null,
        goalId: goalId || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className={labelClass}>제목</label>
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <label className={labelClass}>설명</label>
        <textarea
          className={inputClass}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>우선순위</label>
          <select
            className={inputClass}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>마감일</label>
          <input
            type="date"
            className={inputClass}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {weeklyPlans.length > 0 && (
        <div>
          <label className={labelClass}>주간 계획 연결</label>
          <select
            className={inputClass}
            value={weeklyPlanId}
            onChange={(e) => setWeeklyPlanId(e.target.value)}
          >
            <option value="">선택 안함</option>
            {weeklyPlans.map((w) => (
              <option key={w._id} value={w._id}>
                {new Date(w.weekStart).toLocaleDateString("ko-KR")}
              </option>
            ))}
          </select>
        </div>
      )}

      {goals.length > 0 && (
        <div>
          <label className={labelClass}>1년 목표 연결</label>
          <select
            className={inputClass}
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
          >
            <option value="">선택 안함</option>
            {goals.map((g) => (
              <option key={g._id} value={g._id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-between items-center mt-2">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 h-11 text-xs font-bold uppercase tracking-[1.5px] border border-hairline text-muted hover:border-error hover:text-error transition-colors"
          >
            삭제
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 h-11 text-xs font-bold uppercase tracking-[1.5px] border border-hairline text-body hover:border-primary hover:text-ink transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 h-11 text-xs font-bold uppercase tracking-[1.5px] border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            저장
          </button>
        </div>
      </div>
    </form>
  );
}
