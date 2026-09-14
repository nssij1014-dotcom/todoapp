import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import WeeklyPlan from "@/models/WeeklyPlan";
import { serverErrorResponse } from "@/lib/apiUtils";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit")) || 0;
    let query = WeeklyPlan.find().sort({ weekStart: -1 });
    if (limit > 0) query = query.limit(limit);
    const plans = await query;
    return NextResponse.json(plans);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    if (!body.weekStart) {
      return NextResponse.json({ error: "weekStart is required" }, { status: 400 });
    }
    const plan = await WeeklyPlan.create({
      weekStart: new Date(body.weekStart),
      goals: body.goals ?? [],
      memo: body.memo ?? "",
      goalId: body.goalId || undefined,
    });
    return NextResponse.json(plan, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return NextResponse.json({ error: "이미 해당 주간 계획이 존재합니다." }, { status: 409 });
    }
    return serverErrorResponse(err);
  }
}
