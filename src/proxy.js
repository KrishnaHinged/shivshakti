import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getPermissionsByRole } from "./permissions/roles";

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

  // Admin Auth & RBAC Protection
  const token = request.cookies.get("admin-token")?.value;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.role) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "session_expired");
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete("admin-token");
        return res;
      }

      const userPermissions = getPermissionsByRole(decoded.role);

      // Verify specific route authorizations
      if (pathname === "/admin" || pathname === "/admin/") {
        if (!userPermissions.includes("VIEW_CRM") && !userPermissions.includes("VIEW_ANALYTICS")) {
          if (userPermissions.includes("MANAGE_BLOGS")) {
            return NextResponse.redirect(new URL("/admin/blogs", request.url));
          }
          return new NextResponse("Access Denied: Insufficient permissions for overview dashboard.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/inquiries")) {
        if (!userPermissions.includes("VIEW_CRM")) {
          return new NextResponse("Access Denied: You do not have CRM permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/users")) {
        if (!userPermissions.includes("MANAGE_USERS")) {
          return new NextResponse("Access Denied: You do not have User Management permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/products")) {
        if (!userPermissions.includes("MANAGE_PRODUCTS")) {
          return new NextResponse("Access Denied: You do not have Product Catalog permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/media")) {
        if (!userPermissions.includes("MANAGE_PRODUCTS") && !userPermissions.includes("MANAGE_BLOGS")) {
          return new NextResponse("Access Denied: You do not have Media Library permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/blogs")) {
        if (!userPermissions.includes("MANAGE_BLOGS")) {
          return new NextResponse("Access Denied: You do not have Blog Management permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/seo")) {
        if (!userPermissions.includes("MANAGE_BLOGS")) {
          return new NextResponse("Access Denied: You do not have SEO Management permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/testimonials")) {
        if (!userPermissions.includes("MANAGE_PRODUCTS")) {
          return new NextResponse("Access Denied: You do not have Testimonials permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/newsletter")) {
        if (!userPermissions.includes("MANAGE_EMAIL_TEMPLATES")) {
          return new NextResponse("Access Denied: You do not have Newsletter permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/settings")) {
        if (!userPermissions.includes("VIEW_SETTINGS")) {
          return new NextResponse("Access Denied: You do not have Website Settings permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/email-templates")) {
        if (!userPermissions.includes("MANAGE_EMAIL_TEMPLATES")) {
          return new NextResponse("Access Denied: You do not have Email Template permissions.", { status: 403 });
        }
      }

      if (pathname.startsWith("/admin/logs")) {
        if (decoded.role !== "SUPER_ADMIN") {
          return new NextResponse("Access Denied: Only Super Admin can view activity logs.", { status: 403 });
        }
      }

    } catch (err) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "invalid_token");
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("admin-token");
      return res;
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
