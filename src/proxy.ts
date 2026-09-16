import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { CLIENT_COOKIE, verifySessionToken } from "./lib/clients";

const intlMiddleware = createIntlMiddleware(routing);

function checkAdminAuth(request: NextRequest) {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  const expected = password ? "Basic " + Buffer.from(`admin:${password}`).toString("base64") : null;
  const auth = request.headers.get("authorization");

  if (!expected || auth !== expected) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  return null;
}

// Espace client protégé (/client/<slug>) : l'artéfact n'est servi qu'avec un
// cookie de session valide dont le slug correspond à l'URL. Sinon on renvoie
// vers la page de connexion /entreprise.
async function checkClientAuth(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestedSlug = pathname.split("/")[2] ?? "";
  const token = request.cookies.get(CLIENT_COOKIE)?.value;
  const slug = await verifySessionToken(token);

  if (!slug || slug !== requestedSlug) {
    return NextResponse.redirect(new URL("/entreprise", request.url));
  }
  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/client")) {
    return checkClientAuth(request);
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/seo")) {
    const authResponse = checkAdminAuth(request);
    return authResponse ?? NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/seo/:path*",
    "/client/:path*",
    "/((?!api|studio|_next|.*\\..*).*)",
  ],
};
