import { NextResponse } from "next/server";

// Keep in-memory rate limits (IP mapped to request timestamps array)
const rateLimitMap = new Map();

export function proxy(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
             request.headers.get("x-real-ip") ||
             "127.0.0.1";

  const { pathname } = request.nextUrl;
  const isPost = request.method === "POST";

  if (isPost) {
    // 1. Admin Login Protection
    if (pathname === "/admin/login") {
      const now = Date.now();
      const key = `${ip}:login`;
      const timestamps = rateLimitMap.get(key) || [];
      const validTimestamps = timestamps.filter((t) => now - t < 10 * 60 * 1000); // 10 minutes window

      if (validTimestamps.length >= 5) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: "Too many login attempts. Please try again after 10 minutes.",
          }),
          {
            status: 429,
            headers: { "content-type": "application/json" },
          }
        );
      }

      validTimestamps.push(now);
      rateLimitMap.set(key, validTimestamps);
    }

    // 2. Public Server Actions protection (Inquiry & Newsletter)
    const hasNextAction = request.headers.has("next-action");
    const isAdminRoute = pathname.startsWith("/admin");

    if (hasNextAction && !isAdminRoute) {
      const now = Date.now();
      const key = `${ip}:public-action`;
      const timestamps = rateLimitMap.get(key) || [];
      const validTimestamps = timestamps.filter((t) => now - t < 60 * 1000); // 1 minute window

      if (validTimestamps.length >= 5) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: "Too many requests. Please wait a minute and try again.",
          }),
          {
            status: 429,
            headers: { "content-type": "application/json" },
          }
        );
      }

      validTimestamps.push(now);
      rateLimitMap.set(key, validTimestamps);
    }
  }

  // Admin Auth Redirect Protection
  const token = request.cookies.get("admin-token")?.value;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/",
    "/products/:path*",
    "/about",
    "/gallery",
    "/blog/:path*",
  ],
};
