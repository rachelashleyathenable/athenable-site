import { NextResponse } from "next/server";
import { CLIENT_COOKIE } from "@/lib/clients";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLIENT_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
