import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { UserType } from "@prisma/client"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import { Resend } from "resend"
import { v4 as uuidv4 } from "uuid"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { db } from "@/lib/db"
import AccountActivationEmail from "@/app/emails/account-activation"
import SigninLinkEmail from "@/app/emails/signin-link"

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessTokenUrl: "https://accounts.google.com/o/oauth2/token",
      requestTokenUrl: "https://accounts.google.com/o/oauth2/auth",
      profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        return {
          id: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        const resend = new Resend(process.env.RESEND_API_KEY)

        const user = await db.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        })

        const subject = user?.emailVerified
          ? "Sign in link for Outsource Simple"
          : "Activate your account"

        const react = user?.emailVerified
          ? SigninLinkEmail({ siteName: siteConfig.name, url })
          : AccountActivationEmail({ siteName: siteConfig.name, url })

        const result = await resend.sendEmail({
          from: "Outsource Simple <admin@outsourcesimple.com>",
          to: identifier,
          subject,
          react,
          headers: {
            "X-Entity-Ref-ID": uuidv4(),
          },
        })

        if (!result.id) {
          throw new Error("Email cannot be sent")
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session, trigger }) {
      if (token) {
        session.user.id = token.id
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.email = token.email
        session.user.image = token.picture
        session.user.setup = token.setup
        session.user.userType = token.userType
        session.user.emailVerified = token.emailVerified
      }

      if (trigger === "update" && session) {
        if (typeof session.user.firstName === "string") {
          token.firstName = session.user.firstName
        }
        if (typeof session.user.lastName === "string") {
          token.lastName = session.user.lastName
        }
        if (typeof session.user.email === "string") {
          token.email = session.user.email
        }
        if (typeof session.user.image === "string") {
          token.image = session.user.image
        }
        if (session.user.emailVerified instanceof Date) {
          token.emailVerified = session.user.emailVerified
        }
        if (typeof session.user.setup === "boolean") {
          token.setup = session.user.setup
        }
        if (typeof session.user.userType === typeof UserType) {
          token.userType = session.user.userType
        }
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        picture: dbUser.image,
        emailVerified: dbUser.emailVerified as Date | undefined,
        setup: dbUser.setup,
        userType: dbUser.userType as UserType,
      }
    },
  },
}
