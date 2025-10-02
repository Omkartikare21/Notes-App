import { NextResponse } from "next/server";

export function middleware(req) {
  const hasClearance = req.cookies.get("cfv")?.value === "1";
  const { pathname } = req.nextUrl;

  const isGate = pathname.startsWith("/gate");
  const isApi = pathname.startsWith("/api");
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/public");

  if (!hasClearance && !isGate && !isApi && !isStatic) {
    const url = new URL("/gate", req.url);
    const res = NextResponse.redirect(url);
    // helps avoid cache issues with cookies in some setups
    res.headers.set("x-middleware-cache", "no-cache");
    return res;
  }

  if (hasClearance && isGate) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.headers.set("x-middleware-cache", "no-cache");
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("x-middleware-cache", "no-cache");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
