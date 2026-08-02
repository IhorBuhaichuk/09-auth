import { parseSetCookie } from "cookie";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!refreshToken) {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  try {
    const sessionResponse = await checkSession();

    if (!sessionResponse.data.success) {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      return NextResponse.next();
    }

    const response = isPublicRoute
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
    const setCookie = sessionResponse.headers["set-cookie"];

    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

      cookies.forEach((cookie) => {
        const parsedCookie = parseSetCookie(cookie);

        if (parsedCookie.value) {
          response.cookies.set(
            parsedCookie.name,
            parsedCookie.value,
            parsedCookie,
          );
        }
      });
    }

    return response;
  } catch {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
