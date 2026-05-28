import { NextResponse } from 'next/server'

export function proxy(request) {
 const token = request.cookies.get("token")?.value || request.headers.get("token");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
     return NextResponse.redirect(new URL("/login", request.url));

   }

 return NextResponse.next(); 
}
export const config = {
  matcher: '/dashboard/:path*'
};