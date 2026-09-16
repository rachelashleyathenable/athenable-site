import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { CLIENT_COOKIE, verifySessionToken } from "@/lib/clients";

// Stockage clé-valeur partagé par client, qui remplace le `window.storage` du
// runtime des artéfacts Claude. Chaque entrée est isolée par `client_slug`,
// dérivé du cookie de session (jamais fourni par le navigateur).

type StorageEntry = { key: string; value: string };

type StorageBody = {
  op?: "get" | "set" | "list" | "delete" | "export" | "import";
  key?: string;
  value?: string;
  prefix?: string;
  entries?: StorageEntry[];
};

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await sql`
    create table if not exists client_kv (
      client_slug text not null,
      skey text not null,
      svalue text not null,
      updated_at timestamptz not null default now(),
      primary key (client_slug, skey)
    )
  `;
  tableReady = true;
}

// Échappe les caractères spéciaux LIKE pour que le préfixe soit littéral.
function likePrefix(prefix: string): string {
  return prefix.replace(/([\\%_])/g, "\\$1") + "%";
}

async function currentSlug(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(CLIENT_COOKIE)?.value);
}

export async function POST(request: Request) {
  const slug = await currentSlug();
  if (!slug) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as StorageBody;
  await ensureTable();

  switch (body.op) {
    case "get": {
      if (!body.key) return NextResponse.json({ value: null });
      const rows = await sql`
        select svalue from client_kv
        where client_slug = ${slug} and skey = ${body.key}
      `;
      return NextResponse.json({ value: rows[0]?.svalue ?? null });
    }
    case "set": {
      if (!body.key || typeof body.value !== "string") {
        return NextResponse.json({ error: "bad_request" }, { status: 400 });
      }
      await sql`
        insert into client_kv (client_slug, skey, svalue, updated_at)
        values (${slug}, ${body.key}, ${body.value}, now())
        on conflict (client_slug, skey)
        do update set svalue = excluded.svalue, updated_at = now()
      `;
      return NextResponse.json({ ok: true });
    }
    case "list": {
      const pattern = likePrefix(body.prefix ?? "");
      const rows = await sql`
        select skey from client_kv
        where client_slug = ${slug} and skey like ${pattern} escape '\\'
        order by skey
      `;
      return NextResponse.json({ keys: rows.map((r) => r.skey as string) });
    }
    case "delete": {
      if (!body.key) return NextResponse.json({ ok: true });
      await sql`
        delete from client_kv
        where client_slug = ${slug} and skey = ${body.key}
      `;
      return NextResponse.json({ ok: true });
    }
    case "export": {
      const rows = await sql`
        select skey, svalue from client_kv
        where client_slug = ${slug}
        order by skey
      `;
      return NextResponse.json({
        entries: rows.map((r) => ({
          key: r.skey as string,
          value: r.svalue as string,
        })),
      });
    }
    case "import": {
      const entries = Array.isArray(body.entries) ? body.entries : [];
      let count = 0;
      for (const e of entries) {
        if (!e || typeof e.key !== "string" || typeof e.value !== "string") {
          continue;
        }
        await sql`
          insert into client_kv (client_slug, skey, svalue, updated_at)
          values (${slug}, ${e.key}, ${e.value}, now())
          on conflict (client_slug, skey)
          do update set svalue = excluded.svalue, updated_at = now()
        `;
        count++;
      }
      return NextResponse.json({ ok: true, count });
    }
    default:
      return NextResponse.json({ error: "bad_op" }, { status: 400 });
  }
}
