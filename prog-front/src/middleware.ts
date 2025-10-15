import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  // Rutas públicas
  const publicPaths = ["/", "/login", "/register", "/calendar"];
  const isPublicPath = publicPaths.some((path) => pathname === path);

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Rutas protegidas - requieren autenticación
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
