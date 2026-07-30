import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getResend, NOTIFY_FROM, NOTIFY_TO } from "@/lib/resend";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ContactBody;
  const { name, email, message } = body;

  if (!name || !email || !email.includes("@") || !message) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await sql`
    insert into contact_messages (name, email, message)
    values (${name}, ${email}, ${message})
  `;

  if (NOTIFY_TO) {
    await getResend().emails.send({
      from: NOTIFY_FROM,
      to: NOTIFY_TO,
      subject: `Nouveau message de contact — ${name}`,
      text: `${name} (${email})\n\n${message}`,
    });
  }

  return NextResponse.json({ ok: true });
}
