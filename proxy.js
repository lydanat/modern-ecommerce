import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export default async function middleware(request) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  if (!session && pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (session && pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/dashboard/:path*"],
};