import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getResend, NOTIFY_FROM, NOTIFY_TO } from "@/lib/resend";

type LeadBody = {
  prenom?: string;
  email?: string;
  pillar?: string;
  maturity?: string;
  role?: string;
  besoin?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LeadBody;
  const { prenom, email, pillar, maturity, role, besoin } = body;

  if (!prenom || !email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await sql`
    insert into leads (prenom, email, pillar, maturity, role, besoin)
    values (${prenom}, ${email}, ${pillar ?? null}, ${maturity ?? null}, ${role ?? null}, ${besoin ?? null})
  `;

  if (NOTIFY_TO) {
    await getResend().emails.send({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      subject: `Nouveau lead quiz — ${prenom}`,
      text: `${prenom} (${email})\n\npillar: ${pillar}\nmaturity: ${maturity}\nrole: ${role}\nbesoin: ${besoin}`,
    });
  }

  return NextResponse.json({ ok: true });
}
