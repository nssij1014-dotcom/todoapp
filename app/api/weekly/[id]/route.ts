import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import WeeklyPlan from "@/models/WeeklyPlan";
import { isValidObjectId, invalidIdResponse, notFoundResponse, serverErrorResponse } from "@/lib/apiUtils";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  try {
    await connectToDatabase();
    const plan = await WeeklyPlan.findById(id);
    if (!plan) return notFoundResponse();
    return NextResponse.json(plan);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  try {
    await connectToDatabase();
    const body = await req.json();
    const plan = await WeeklyPlan.findByIdAndUpdate(
      id,
      {
        goals: body.goals,
        memo: body.memo,
        retrospective: body.retrospective,
        goalId: body.goalId || undefined,
      },
      { new: true, runValidators: true }
    );
    if (!plan) return notFoundResponse();
    return NextResponse.json(plan);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  try {
    await connectToDatabase();
    const body = await req.json();
    const plan = await WeeklyPlan.findById(id);
    if (!plan) return notFoundResponse();

    if (typeof body.goalIndex === "number") {
      if (!plan.goals[body.goalIndex]) {
        return NextResponse.json({ error: "Invalid goalIndex" }, { status: 400 });
      }
      plan.goals[body.goalIndex].done = !!body.done;
    }
    if (typeof body.retrospective === "string") {
      plan.retrospective = body.retrospective;
    }
    await plan.save();
    return NextResponse.json(plan);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  try {
    await connectToDatabase();
    const plan = await WeeklyPlan.findByIdAndDelete(id);
    if (!plan) return notFoundResponse();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverErrorResponse(err);
  }
}
