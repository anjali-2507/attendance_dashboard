import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { decodeToken } from "./lib/decode-token";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login";

  const decoded = await decodeToken(request);

  if (!isPublicPath && decoded === false) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isPublicPath && decoded) {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home", "/dashboard", "/employees", "/attendance", "/login"],
};
