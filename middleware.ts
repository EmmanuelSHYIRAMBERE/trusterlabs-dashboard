import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;

    if (pathname.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      pathname.startsWith("/dashboard") &&
      token?.role?.toLocaleLowerCase() !== "user"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes that don't require authentication
        if (
          pathname.startsWith("/") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon.ico")
        ) {
          return true;
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/",
      error: "/",
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
