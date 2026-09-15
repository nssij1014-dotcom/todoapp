"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo } from "@/types";
import PriorityBadge from "@/components/shared/PriorityBadge";

interface TodoCardProps {
  todo: Todo;
  onClick?: () => void;
  overlay?: boolean;
}

function isOverdue(todo: Todo): boolean {
  if (!todo.dueDate || todo.status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(todo.dueDate) < today;
}

export default function TodoCard({ todo, onClick, overlay }: TodoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo._id,
    disabled: overlay,
  });

  const style = overlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      };

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      onClick={onClick}
      className="border border-hairline bg-surface-strong p-4 cursor-grab active:cursor-grabbing hover:border-primary transition-colors"
    >
      <p className="text-sm font-normal text-ink">{todo.title}</p>
      <div className="flex items-center gap-2 mt-2">
        <PriorityBadge priority={todo.priority} />
        {todo.dueDate && (
          <span
            className={
              isOverdue(todo)
                ? "text-[11px] font-bold text-error"
                : "text-[11px] font-light text-muted"
            }
          >
            {new Date(todo.dueDate).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}
          </span>
        )}
      </div>
    </div>
  );
}
