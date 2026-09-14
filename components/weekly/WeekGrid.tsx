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
    <div className="grid grid-cols-7 gap-2">
      {DAY_LABELS.map((label, day) => {
        const dayTodos = todos.filter((t) => t.dayOfWeek === day);
        return (
          <div
            key={day}
            className="rounded-md border border-black/10 dark:border-white/10 p-2 min-h-32 flex flex-col gap-1"
          >
            <div className="text-xs font-medium text-black/60 dark:text-white/60 mb-1">
              {label}
            </div>
            {dayTodos.map((t) => (
              <div
                key={t._id}
                className="text-xs rounded bg-black/5 dark:bg-white/10 px-2 py-1 truncate"
                title={t.title}
              >
                {t.title}
              </div>
            ))}
            {openDay === day ? (
              <input
                autoFocus
                className="text-xs rounded border border-black/15 dark:border-white/15 px-1.5 py-1 bg-transparent"
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
                className="text-xs text-black/40 dark:text-white/40 text-left hover:text-black dark:hover:text-white"
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
