import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const guest = req.cookies.get("guestMode")?.value; // ✅ Add this line

  // Allow access to the login page always
  if (req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

    // Allow APIs to proceed even without cookies
  if (req.nextUrl.pathname.startsWith("/api")) return NextResponse.next();

  // ✅ Allow both logged-in users and guests
  if (token || guest === "true") {
    return NextResponse.next();
  }

  // ❌ Otherwise redirect to login
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
