import { StateCreator } from "zustand";
import { WeeklyPlan } from "@/types";

export interface WeeklySlice {
  weeklyPlans: WeeklyPlan[];
  weeklyLoading: boolean;
  weeklyError: string | null;
  fetchWeeklyPlans: () => Promise<void>;
  addWeeklyPlan: (data: {
    weekStart: string;
    goals: { text: string; done: boolean }[];
    memo?: string;
    goalId?: string;
  }) => Promise<{ ok: boolean; status: number }>;
  updateWeeklyPlan: (id: string, data: Partial<WeeklyPlan>) => Promise<void>;
  toggleWeeklyGoal: (id: string, goalIndex: number, done: boolean) => Promise<void>;
}

export const createWeeklySlice: StateCreator<WeeklySlice> = (set, get) => ({
  weeklyPlans: [],
  weeklyLoading: false,
  weeklyError: null,

  fetchWeeklyPlans: async () => {
    set({ weeklyLoading: true });
    const res = await fetch("/api/weekly");
    const weeklyPlans = await res.json();
    set({ weeklyPlans, weeklyLoading: false });
  },

  addWeeklyPlan: async (data) => {
    const res = await fetch("/api/weekly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 409) {
      set({ weeklyError: "이미 해당 주간 계획이 존재합니다." });
      return { ok: false, status: 409 };
    }
    const plan = await res.json();
    set({ weeklyPlans: [...get().weeklyPlans, plan], weeklyError: null });
    return { ok: true, status: res.status };
  },

  updateWeeklyPlan: async (id, data) => {
    const res = await fetch(`/api/weekly/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set({ weeklyPlans: get().weeklyPlans.map((w) => (w._id === id ? updated : w)) });
  },

  toggleWeeklyGoal: async (id, goalIndex, done) => {
    const plan = get().weeklyPlans.find((w) => w._id === id);
    if (plan) {
      const optimistic = plan.goals.map((g, i) => (i === goalIndex ? { ...g, done } : g));
      set({
        weeklyPlans: get().weeklyPlans.map((w) =>
          w._id === id ? { ...w, goals: optimistic } : w
        ),
      });
    }
    const res = await fetch(`/api/weekly/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalIndex, done }),
    });
    const updated = await res.json();
    set({ weeklyPlans: get().weeklyPlans.map((w) => (w._id === id ? updated : w)) });
  },
});
