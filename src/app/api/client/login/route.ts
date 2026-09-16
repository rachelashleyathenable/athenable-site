import { NextResponse } from "next/server";
import { CLIENT_COOKIE, createSessionToken, findClientByCode } from "@/lib/clients";

type LoginBody = {
  code?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LoginBody;
  const code = (body.code ?? "").trim();

  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const client = findClientByCode(code);
  if (!client) {
    return NextResponse.json({ error: "invalid_code" }, { status: 401 });
  }

  const token = await createSessionToken(client.slug);
  const response = NextResponse.json({
    ok: true,
    redirect: `/client/${client.slug}`,
  });
  response.cookies.set(CLIENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 h
  });
  return response;
}
