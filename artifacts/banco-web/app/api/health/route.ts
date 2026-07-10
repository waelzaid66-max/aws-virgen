import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    surface: "banco-web",
    wave: "W1",
    ts: new Date().toISOString(),
  });
}
