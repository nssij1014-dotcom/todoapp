"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useStore } from "@/store";
import { Todo, TodoStatus } from "@/types";
import KanbanColumn from "./KanbanColumn";
import TodoCard from "./TodoCard";

const COLUMNS: { status: TodoStatus; title: string }[] = [
  { status: "todo", title: "할 일" },
  { status: "doing", title: "진행 중" },
  { status: "done", title: "완료" },
];

const STATUS_IDS = COLUMNS.map((c) => c.status);

const PRIORITY_RANK: Record<Todo["priority"], number> = { high: 0, medium: 1, low: 2 };

interface KanbanBoardProps {
  onCardClick: (todo: Todo) => void;
}

export default function KanbanBoard({ onCardClick }: KanbanBoardProps) {
  const { todos, moveTodo } = useStore();
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const columnTodos = (status: TodoStatus) =>
    todos
      .filter((t) => t.status === status)
      .sort((a, b) => {
        const rankDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        if (rankDiff !== 0) return rankDiff;
        return a.order < b.order ? -1 : 1;
      });

  const handleDragStart = (event: DragStartEvent) => {
    const todo = todos.find((t) => t._id === event.active.id);
    setActiveTodo(todo ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTodo(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeTodoItem = todos.find((t) => t._id === activeId);
    if (!activeTodoItem) return;

    const destStatus: TodoStatus = STATUS_IDS.includes(overId as TodoStatus)
      ? (overId as TodoStatus)
      : todos.find((t) => t._id === overId)?.status ?? activeTodoItem.status;

    const destList = columnTodos(destStatus).filter((t) => t._id !== activeId);

    let beforeId: string | null;
    let afterId: string | null;

    if (STATUS_IDS.includes(overId as TodoStatus)) {
      beforeId = destList.length ? destList[destList.length - 1]._id : null;
      afterId = null;
    } else {
      const overIndex = destList.findIndex((t) => t._id === overId);
      afterId = overIndex >= 0 ? destList[overIndex]._id : null;
      beforeId = overIndex > 0 ? destList[overIndex - 1]._id : null;
    }

    if (
      destStatus === activeTodoItem.status &&
      beforeId === null &&
      afterId === null &&
      destList.length === 0
    ) {
      return;
    }

    moveTodo(activeId, destStatus, beforeId, afterId);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            todos={columnTodos(col.status)}
            onCardClick={onCardClick}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTodo ? <TodoCard todo={activeTodo} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
