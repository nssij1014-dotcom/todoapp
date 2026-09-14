"use client";

import { useState } from "react";
import { Goal } from "@/types";

interface GoalFormProps {
  initial?: Pick<Goal, "title" | "description">;
  onSubmit: (data: { title: string; description?: string }) => Promise<void> | void;
  onCancel: () => void;
}

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
        <label className="text-sm font-medium block mb-1">제목</label>
        <input
          className="w-full rounded-md border border-black/15 dark:border-white/15 px-3 py-2 text-sm bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">설명</label>
        <textarea
          className="w-full rounded-md border border-black/15 dark:border-white/15 px-3 py-2 text-sm bg-transparent"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
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
