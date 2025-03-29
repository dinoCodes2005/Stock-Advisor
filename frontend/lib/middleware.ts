// app/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/invest", "/stocks"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // ✅ Check token from cookies
  const { pathname } = request.nextUrl;

  // 🔒 Check if the route is protected
  if (protectedRoutes.includes(pathname)) {
    // ❌ If no token, redirect to /login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ✅ Allow access to other routes
  return NextResponse.next();
}

// 🚀 Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
