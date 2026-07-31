import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  const expected = password ? "Basic " + Buffer.from(`admin:${password}`).toString("base64") : null;
  const auth = request.headers.get("authorization");

  if (!expected || auth !== expected) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/seo/:path*"],
};
