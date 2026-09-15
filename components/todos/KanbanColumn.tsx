"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Todo, TodoStatus } from "@/types";
import TodoCard from "./TodoCard";

interface KanbanColumnProps {
  status: TodoStatus;
  title: string;
  todos: Todo[];
  onCardClick: (todo: Todo) => void;
}

export default function KanbanColumn({ status, title, todos, onCardClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="flex-1 min-w-0 rounded-md bg-surface-soft p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <span className="text-xs text-muted">{todos.length}</span>
      </div>
      <div ref={setNodeRef} className="flex flex-col gap-2 min-h-24">
        <SortableContext items={todos.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {todos.map((todo) => (
            <TodoCard key={todo._id} todo={todo} onClick={() => onCardClick(todo)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
