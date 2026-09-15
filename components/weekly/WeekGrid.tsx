"use client";

import { useRef, useState } from "react";
import { useStore } from "@/store";
import { Todo } from "@/types";
import { DAY_LABELS } from "@/lib/utils";

interface WeekGridProps {
  weeklyPlanId: string;
  todos: Todo[];
}

export default function WeekGrid({ weeklyPlanId, todos }: WeekGridProps) {
  const { addTodo } = useStore();
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const submittingRef = useRef(false);

  const handleAdd = async (dayOfWeek: number) => {
    const title = draft.trim();
    setDraft("");
    setOpenDay(null);
    if (!title || submittingRef.current) return;
    submittingRef.current = true;
    try {
      await addTodo({ title, weeklyPlanId, dayOfWeek });
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <div className="grid grid-cols-7 gap-px bg-hairline">
      {DAY_LABELS.map((label, day) => {
        const dayTodos = todos.filter((t) => t.dayOfWeek === day);
        return (
          <div
            key={day}
            className="bg-surface-soft p-2 min-h-32 flex flex-col gap-1"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-muted mb-1">
              {label}
            </div>
            {dayTodos.map((t) => (
              <div
                key={t._id}
                className="text-xs font-light bg-surface-strong text-ink px-2 py-1 truncate"
                title={t.title}
              >
                {t.title}
              </div>
            ))}
            {openDay === day ? (
              <input
                autoFocus
                className="text-xs border border-hairline px-1.5 py-1 bg-surface-strong text-ink focus:outline-none focus:border-2 focus:border-primary"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd(day);
                  if (e.key === "Escape") {
                    setDraft("");
                    setOpenDay(null);
                  }
                }}
                onBlur={() => handleAdd(day)}
              />
            ) : (
              <button
                onClick={() => setOpenDay(day)}
                className="text-xs font-light text-muted-soft text-left hover:text-ink transition-colors"
              >
                + 추가
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
