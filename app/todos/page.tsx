"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useStore } from "@/store";
import { Todo, Priority } from "@/types";
import TodoForm from "@/components/todos/TodoForm";
import Modal from "@/components/shared/Modal";

const KanbanBoard = dynamic(() => import("@/components/todos/KanbanBoard"), {
  ssr: false,
});

export default function TodosPage() {
  const { fetchTodos, fetchWeeklyPlans, fetchGoals, addTodo, updateTodo, deleteTodo } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos();
    fetchWeeklyPlans();
    fetchGoals();
  }, [fetchTodos, fetchWeeklyPlans, fetchGoals]);

  const openCreate = () => {
    setEditingTodo(null);
    setModalOpen(true);
  };

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  const handleSubmit = async (data: {
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: string | null;
    weeklyPlanId?: string | null;
    goalId?: string | null;
  }) => {
    if (editingTodo) {
      await updateTodo(editingTodo._id, data);
    } else {
      await addTodo(data);
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (editingTodo) {
      await deleteTodo(editingTodo._id);
      setModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">할 일</h1>
        <button
          onClick={openCreate}
          className="px-3 py-1.5 text-sm rounded-md bg-black text-white dark:bg-white dark:text-black"
        >
          + 새 할일
        </button>
      </div>

      <KanbanBoard onCardClick={openEdit} />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTodo ? "할 일 수정" : "새 할 일"}
      >
        <TodoForm
          initial={editingTodo ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          onDelete={editingTodo ? handleDelete : undefined}
        />
      </Modal>
    </div>
  );
}
