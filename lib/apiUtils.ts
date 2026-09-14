import { Types } from "mongoose";
import { NextResponse } from "next/server";

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

export function invalidIdResponse() {
  return NextResponse.json({ error: "Invalid id" }, { status: 400 });
}

export function notFoundResponse() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
}

export function serverErrorResponse(err: unknown) {
  const message = err instanceof Error ? err.message : "Internal server error";
  return NextResponse.json({ error: message }, { status: 500 });
}
