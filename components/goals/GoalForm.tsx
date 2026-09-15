"use client";

import { useState } from "react";
import { Goal } from "@/types";

interface GoalFormProps {
  initial?: Pick<Goal, "title" | "description">;
  onSubmit: (data: { title: string; description?: string }) => Promise<void> | void;
  onCancel: () => void;
}

const inputClass =
  "w-full border border-hairline px-3 py-2.5 text-sm font-light bg-surface-strong text-ink placeholder:text-muted-soft focus:outline-none focus:border-2 focus:border-primary";

export default function GoalForm({ initial, onSubmit, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="text-xs font-bold uppercase tracking-[0.5px] block mb-1.5 text-muted">제목</label>
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-[0.5px] block mb-1.5 text-muted">설명</label>
        <textarea
          className={inputClass}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
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
    </form>
  );
}
