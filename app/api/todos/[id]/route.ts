import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/Todo";
import {
  isValidObjectId,
  invalidIdResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/lib/apiUtils";
import { getSessionUser } from "@/lib/session";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();
  try {
    await connectToDatabase();
    const todo = await Todo.findOne({ _id: id, userId: user._id });
    if (!todo) return notFoundResponse();
    return NextResponse.json(todo);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();
  try {
    await connectToDatabase();
    const body = await req.json();
    const $set: Record<string, unknown> = {};
    const $unset: Record<string, string> = {};

    if (body.title !== undefined) $set.title = body.title;
    if (body.description !== undefined) $set.description = body.description;
    if (body.priority !== undefined) $set.priority = body.priority;
    if (body.dayOfWeek !== undefined) $set.dayOfWeek = body.dayOfWeek;

    // dueDate/weeklyPlanId/goalId: explicit null clears the field, a value sets it, undefined leaves it untouched
    if (body.dueDate === null) $unset.dueDate = "";
    else if (body.dueDate) $set.dueDate = new Date(body.dueDate);

    if (body.weeklyPlanId === null) $unset.weeklyPlanId = "";
    else if (body.weeklyPlanId) $set.weeklyPlanId = body.weeklyPlanId;

    if (body.goalId === null) $unset.goalId = "";
    else if (body.goalId) $set.goalId = body.goalId;

    const update: Record<string, unknown> = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;

    const todo = await Todo.findOneAndUpdate({ _id: id, userId: user._id }, update, { new: true, runValidators: true });
    if (!todo) return notFoundResponse();
    return NextResponse.json(todo);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();
  try {
    await connectToDatabase();
    const body = await req.json();
    const update: Record<string, unknown> = {};
    if (body.status) update.status = body.status;
    if (body.order) update.order = body.order;
    const todo = await Todo.findOneAndUpdate({ _id: id, userId: user._id }, update, { new: true, runValidators: true });
    if (!todo) return notFoundResponse();
    return NextResponse.json(todo);
  } catch (err) {
    return serverErrorResponse(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) return invalidIdResponse();
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();
  try {
    await connectToDatabase();
    const todo = await Todo.findOneAndDelete({ _id: id, userId: user._id });
    if (!todo) return notFoundResponse();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return serverErrorResponse(err);
  }
}
