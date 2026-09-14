import Todo from "@/models/Todo";
import { Types } from "mongoose";

export async function attachGoalProgress<T extends { _id: Types.ObjectId | string; progress: number }>(
  goals: T[]
): Promise<T[]> {
  if (goals.length === 0) return goals;
  const goalIds = goals.map((g) => g._id);

  const counts = await Todo.aggregate([
    { $match: { goalId: { $in: goalIds.map((id) => new Types.ObjectId(String(id))) } } },
    {
      $group: {
        _id: "$goalId",
        total: { $sum: 1 },
        done: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
      },
    },
  ]);

  const progressMap = new Map<string, number>();
  for (const c of counts) {
    progressMap.set(String(c._id), c.total > 0 ? Math.round((c.done / c.total) * 100) : 0);
  }

  return goals.map((g) => ({
    ...g,
    progress: progressMap.get(String(g._id)) ?? 0,
  }));
}
