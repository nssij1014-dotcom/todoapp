import { create } from "zustand";
import { createTodoSlice, TodoSlice } from "./todoSlice";
import { createWeeklySlice, WeeklySlice } from "./weeklySlice";
import { createGoalSlice, GoalSlice } from "./goalSlice";

export type StoreState = TodoSlice & WeeklySlice & GoalSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createTodoSlice(...a),
  ...createWeeklySlice(...a),
  ...createGoalSlice(...a),
}));
