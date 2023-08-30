"use client"

import * as React from "react"
import { User } from "@prisma/client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ApplicantAccountDetailsFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "email" | "firstName" | "lastName">
}

export function ApplicantAccountDetailsForm({
  user,
  className,
  ...props
}: ApplicantAccountDetailsFormProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Account details can be seen here. These details will be shown on your
          resume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex flex-wrap gap-8">
            <div className="w-full max-w-[400px] space-y-2">
              <Label>First Name</Label>
              <Input disabled defaultValue={user.firstName} size={32} />
            </div>

            <div className="w-full max-w-[400px] space-y-2">
              <Label>Last Name</Label>
              <Input disabled defaultValue={user.lastName} size={32} />
            </div>
          </div>

          <div className="w-full max-w-[400px] space-y-2">
            <Label>Email Address</Label>
            <Input disabled defaultValue={user.email!} size={32} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-6 border-t">
        <p className="text-xs text-muted-foreground">
          Account details cannot be changed.
        </p>
      </CardFooter>
    </Card>
  )
}
