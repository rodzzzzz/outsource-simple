import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register")

    const isActivateAccountPage =
      req.nextUrl.pathname.startsWith("/activate-account")

    const isSetupPage = req.nextUrl.pathname.startsWith("/setup")

    const isApplicantPage =
      req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/resume")

    const isEmployerPage =
      req.nextUrl.pathname.startsWith("/employer") ||
      req.nextUrl.pathname.startsWith("/editor")

    console.log(token)

    if (isAuthPage) {
      if (isAuth) {
        if (!token.emailVerified) {
          return NextResponse.redirect(new URL("/activate-account", req.url))
        } else {
          if (!token.setup) {
            return NextResponse.redirect(new URL("/setup", req.url))
          }

          if (token.userType === "EMPLOYER") {
            return NextResponse.redirect(new URL("/employer", req.url))
          }

          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }

      return null
    }

    if (isActivateAccountPage) {
      if (isAuth) {
        if (token.emailVerified) {
          if (!token.setup) {
            return NextResponse.redirect(new URL("/setup", req.url))
          }
          if (token.userType === "EMPLOYER") {
            return NextResponse.redirect(new URL("/employer", req.url))
          }
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }

      return null
    }

    if (isSetupPage) {
      if (isAuth) {
        if (!token.emailVerified) {
          return NextResponse.redirect(new URL("/activate-account", req.url))
        } else {
          if (token.setup) {
            if (token.userType === "EMPLOYER") {
              return NextResponse.redirect(new URL("/employer", req.url))
            }
            return NextResponse.redirect(new URL("/dashboard", req.url))
          }
        }

        return null
      }

      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (isApplicantPage) {
      if (isAuth) {
        if (!token.emailVerified) {
          return NextResponse.redirect(new URL("/activate-account", req.url))
        } else {
          if (!token.setup) {
            return NextResponse.redirect(new URL("/setup", req.url))
          }

          if (token.userType === "EMPLOYER") {
            return NextResponse.redirect(new URL("/employer", req.url))
          }

          return null
        }
      }

      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (isEmployerPage) {
      if (isAuth) {
        if (!token.emailVerified) {
          return NextResponse.redirect(new URL("/activate-account", req.url))
        } else {
          if (!token.setup) {
            return NextResponse.redirect(new URL("/setup", req.url))
          }

          if (token.userType === "APPLICANT") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
          }

          return null
        }
      }

      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/employer/:path*",
    "/setup/:path*",
    "/activate-account/:path*",
    "/editor/:path*",
    "/resume/:path*",
    "/login",
    "/register",
  ],
}
