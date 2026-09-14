import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Goal from "@/models/Goal";
import { serverErrorResponse } from "@/lib/apiUtils";
import { attachGoalProgress } from "@/lib/goalProgress";

export async function GET() {
  try {
    await connectToDatabase();
    const goals = await Goal.find().sort({ createdAt: -1 }).lean();
    const withProgress = await attachGoalProgress(goals);
    return NextResponse.json(withProgress);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    const goal = await Goal.create({
      title: body.title,
      description: body.description ?? "",
    });
    return NextResponse.json(goal, { status: 201 });
  } catch (err) {
    return serverErrorResponse(err);
  }
}
