import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { serverErrorResponse, unauthorizedResponse } from "@/lib/apiUtils";
import { getSessionUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};
    const status = searchParams.get("status");
    const weeklyPlanId = searchParams.get("weeklyPlanId");
    const goalId = searchParams.get("goalId");
    if (status) filter.status = status;
    if (weeklyPlanId) filter.weeklyPlanId = weeklyPlanId;
    if (goalId) filter.goalId = goalId;
    filter.userId = user._id;

    const todos = await Todo.find(filter).sort({ order: 1 });
    return NextResponse.json(todos);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    await connectToDatabase();
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (!body.order) {
      return NextResponse.json({ error: "order is required" }, { status: 400 });
    }
    const todo = await Todo.create({
      title: body.title,
      description: body.description ?? "",
      status: body.status ?? "todo",
      priority: body.priority ?? "medium",
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      dayOfWeek: body.dayOfWeek,
      order: body.order,
      weeklyPlanId: body.weeklyPlanId || undefined,
      goalId: body.goalId || undefined,
      userId: user._id,
    });
    return NextResponse.json(todo, { status: 201 });
  } catch (err) {
    return serverErrorResponse(err);
  }
}
