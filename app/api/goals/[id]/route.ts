import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Goal from "@/models/Goal";
import { isValidObjectId, invalidIdResponse, notFoundResponse, serverErrorResponse } from "@/lib/apiUtils";
import { attachGoalProgress } from "@/lib/goalProgress";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  try {
    await connectToDatabase();
    const goal = await Goal.findById(id).lean();
    if (!goal) return notFoundResponse();
    const [withProgress] = await attachGoalProgress([goal]);
    return NextResponse.json(withProgress);
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
    const goal = await Goal.findByIdAndUpdate(
      id,
      { title: body.title, description: body.description },
      { new: true, runValidators: true }
    );
    if (!goal) return notFoundResponse();
    return NextResponse.json(goal);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  try {
    await connectToDatabase();
    const goal = await Goal.findByIdAndDelete(id);
    if (!goal) return notFoundResponse();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverErrorResponse(err);
  }
}
