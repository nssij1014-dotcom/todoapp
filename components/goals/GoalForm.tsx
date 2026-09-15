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
        <label className="text-sm font-medium block mb-1 text-ink">제목</label>
        <input
          className="w-full rounded-sm border border-hairline px-3 py-2.5 text-sm bg-canvas text-ink placeholder:text-muted-soft focus:outline-none focus:border-2 focus:border-ink"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1 text-ink">설명</label>
        <textarea
          className="w-full rounded-sm border border-hairline px-3 py-2.5 text-sm bg-canvas text-ink placeholder:text-muted-soft focus:outline-none focus:border-2 focus:border-ink"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 h-11 text-sm font-medium rounded-sm border border-ink text-ink hover:bg-surface-soft transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 h-11 text-sm font-medium rounded-sm bg-primary text-on-primary hover:bg-primary-active transition-colors disabled:bg-primary-disabled disabled:cursor-not-allowed"
        >
          저장
        </button>
      </div>
    </form>
  );
}
