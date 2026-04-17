import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    const isAuth = !!token;
    const isAdmin = token?.role === "admin";

    // Standard protected paths (handled by authorized callback mostly, 
    // but we can add custom logic here for redirects)
    
    // 1. Redirect logged-in users away from Auth pages
    if (isAuth && (path === "/login" || path === "/register")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. Protect Admin Routes specifically
    if (path.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        const isProtected = path === "/checkout" || path === "/profile" || path.startsWith("/admin");
        
        // If not a protected path, allow access
        if (!isProtected) return true;
        
        // If protected, require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/login",
    "/register",
    "/checkout",
    "/profile",
    "/admin/:path*",
  ],
};
