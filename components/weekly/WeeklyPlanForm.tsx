"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { getWeekStart, toDateInputValue } from "@/lib/utils";

interface WeeklyPlanFormProps {
  onSubmit: (data: {
    weekStart: string;
    goals: { text: string; done: boolean }[];
    memo: string;
    goalId?: string;
  }) => Promise<{ ok: boolean; status: number }>;
  onCancel: () => void;
}

const MAX_GOALS = 5;

export default function WeeklyPlanForm({ onSubmit, onCancel }: WeeklyPlanFormProps) {
  const { goals } = useStore();
  const [weekStart, setWeekStart] = useState(toDateInputValue(getWeekStart(new Date())));
  const [goalTexts, setGoalTexts] = useState<string[]>([""]);
  const [memo, setMemo] = useState("");
  const [goalId, setGoalId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateGoalText = (i: number, value: string) => {
    setGoalTexts((prev) => prev.map((t, idx) => (idx === i ? value : t)));
  };

  const addGoalField = () => {
    if (goalTexts.length < MAX_GOALS) setGoalTexts((prev) => [...prev, ""]);
  };

  const removeGoalField = (i: number) => {
    setGoalTexts((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const goalsPayload = goalTexts
      .map((t) => t.trim())
      .filter(Boolean)
      .map((text) => ({ text, done: false }));
    const result = await onSubmit({
      weekStart,
      goals: goalsPayload,
      memo: memo.trim(),
      goalId: goalId || undefined,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.status === 409 ? "이미 해당 주간 계획이 존재합니다." : "생성에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="text-sm font-medium block mb-1">주 시작일</label>
        <input
          type="date"
          className="w-full rounded-md border border-black/15 dark:border-white/15 px-3 py-2 text-sm bg-transparent"
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">
          이번 주 목표 (최대 {MAX_GOALS}개)
        </label>
        <div className="flex flex-col gap-2">
          {goalTexts.map((text, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 rounded-md border border-black/15 dark:border-white/15 px-3 py-2 text-sm bg-transparent"
                value={text}
                onChange={(e) => updateGoalText(i, e.target.value)}
                placeholder={`목표 ${i + 1}`}
              />
              {goalTexts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGoalField(i)}
                  className="px-2 text-black/50 dark:text-white/50"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {goalTexts.length < MAX_GOALS && (
          <button
            type="button"
            onClick={addGoalField}
            className="text-xs mt-2 text-blue-600"
          >
            + 목표 추가
          </button>
        )}
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">메모</label>
        <textarea
          className="w-full rounded-md border border-black/15 dark:border-white/15 px-3 py-2 text-sm bg-transparent"
          rows={3}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      {goals.length > 0 && (
        <div>
          <label className="text-sm font-medium block mb-1">1년 목표 연결</label>
          <select
            className="w-full rounded-md border border-black/15 dark:border-white/15 px-3 py-2 text-sm bg-transparent"
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm rounded-md border border-black/15 dark:border-white/15"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-3 py-1.5 text-sm rounded-md bg-black text-white dark:bg-white dark:text-black disabled:opacity-50"
        >
          저장
        </button>
      </div>
    </form>
  );
}
