import { UserType } from "@prisma/client"
import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

type UserId = string
type FirstName = string
type LastName = string
type EmailVerified = Date
type Setup = boolean

// common interface for JWT and Session
interface IUser extends DefaultUser {
  id: UserId
  firstName: FirstName
  lastName: LastName
  emailVerified?: EmailVerified
  setup?: Setup
  userType?: UserType
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}

declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user: User
  }
}
