import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CLIENT_COOKIE, verifySessionToken } from "@/lib/clients";

// Proxy authentifié vers l'API Messages d'Anthropic. Dans le runtime des
// artéfacts Claude, `fetch("https://api.anthropic.com/v1/messages")` est
// authentifié par le sandbox ; sur le site, on rejoue la requête côté serveur
// en ajoutant la clé (ANTHROPIC_API_KEY) et l'en-tête de version. Le corps
// ({ model, max_tokens, messages }) est transmis tel quel.

export async function POST(request: Request) {
  const store = await cookies();
  const slug = await verifySessionToken(store.get(CLIENT_COOKIE)?.value);
  if (!slug) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "server_misconfigured" },
      { status: 500 },
    );
  }

  const body = await request.text();

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body,
  });

  const data = await upstream.text();
  return new NextResponse(data, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
}
