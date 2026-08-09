import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/seo")) {
    const authResponse = checkAdminAuth(request);
    return authResponse ?? NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/admin/:path*", "/api/seo/:path*", "/((?!api|studio|_next|.*\\..*).*)"],
};
