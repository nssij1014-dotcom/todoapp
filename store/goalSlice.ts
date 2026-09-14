import { StateCreator } from "zustand";
import { Goal } from "@/types";

export interface GoalSlice {
  goals: Goal[];
  goalsLoading: boolean;
  fetchGoals: () => Promise<void>;
  addGoal: (data: { title: string; description?: string }) => Promise<void>;
  updateGoal: (id: string, data: Partial<Pick<Goal, "title" | "description">>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const createGoalSlice: StateCreator<GoalSlice> = (set, get) => ({
  goals: [],
  goalsLoading: false,

  fetchGoals: async () => {
    set({ goalsLoading: true });
    const res = await fetch("/api/goals");
    const goals = await res.json();
    set({ goals, goalsLoading: false });
  },

  addGoal: async (data) => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const goal = await res.json();
    set({ goals: [...get().goals, goal] });
  },

  updateGoal: async (id, data) => {
    const res = await fetch(`/api/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set({ goals: get().goals.map((g) => (g._id === id ? updated : g)) });
  },

  deleteGoal: async (id) => {
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    set({ goals: get().goals.filter((g) => g._id !== id) });
  },
});
