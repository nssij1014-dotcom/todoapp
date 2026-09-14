import { StateCreator } from "zustand";
import { Todo, TodoStatus } from "@/types";
import { generateOrderKey } from "@/lib/fractionalIndex";

export interface TodoSlice {
  todos: Todo[];
  todosLoading: boolean;
  fetchTodos: () => Promise<void>;
  addTodo: (data: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string | null;
    weeklyPlanId?: string | null;
    goalId?: string | null;
    dayOfWeek?: number;
  }) => Promise<void>;
  updateTodo: (
    id: string,
    data: Partial<Omit<Todo, "dueDate" | "weeklyPlanId" | "goalId">> & {
      dueDate?: string | null;
      weeklyPlanId?: string | null;
      goalId?: string | null;
    }
  ) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  moveTodo: (id: string, newStatus: TodoStatus, beforeId: string | null, afterId: string | null) => Promise<void>;
}

export const createTodoSlice: StateCreator<TodoSlice> = (set, get) => ({
  todos: [],
  todosLoading: false,

  fetchTodos: async () => {
    set({ todosLoading: true });
    const res = await fetch("/api/todos");
    if (!res.ok) {
      set({ todos: [], todosLoading: false });
      return;
    }
    const todos = await res.json();
    set({ todos, todosLoading: false });
  },

  addTodo: async (data) => {
    const statusTodos = get()
      .todos.filter((t) => t.status === "todo")
      .sort((a, b) => (a.order < b.order ? -1 : 1));
    const lastOrder = statusTodos.length > 0 ? statusTodos[statusTodos.length - 1].order : null;
    const order = generateOrderKey(lastOrder, null);

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, status: "todo", order }),
    });
    if (!res.ok) return;
    const todo = await res.json();
    set({ todos: [...get().todos, todo] });
  },

  updateTodo: async (id, data) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set({ todos: get().todos.map((t) => (t._id === id ? updated : t)) });
  },

  deleteTodo: async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    set({ todos: get().todos.filter((t) => t._id !== id) });
  },

  moveTodo: async (id, newStatus, beforeId, afterId) => {
    const previousTodos = get().todos;
    const beforeOrder = beforeId ? previousTodos.find((t) => t._id === beforeId)?.order ?? null : null;
    const afterOrder = afterId ? previousTodos.find((t) => t._id === afterId)?.order ?? null : null;
    const newOrder = generateOrderKey(beforeOrder, afterOrder);

    set({
      todos: previousTodos.map((t) =>
        t._id === id ? { ...t, status: newStatus, order: newOrder } : t
      ),
    });

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, order: newOrder }),
      });
      if (!res.ok) throw new Error("move failed");
      const updated = await res.json();
      set({ todos: get().todos.map((t) => (t._id === id ? updated : t)) });
    } catch {
      set({ todos: previousTodos });
    }
  },
});
