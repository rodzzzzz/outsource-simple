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

interface EmployerAccountDetailsFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "email" | "firstName" | "lastName">
}

export function EmployerAccountDetailsForm({
  user,
  className,
  ...props
}: EmployerAccountDetailsFormProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Account details can be seen here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex flex-wrap gap-8">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                disabled
                defaultValue={user.firstName}
                className="w-[400px]"
                size={32}
              />
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                disabled
                defaultValue={user.lastName}
                className="w-[400px]"
                size={32}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              disabled
              defaultValue={user.email!}
              className="w-[400px]"
              size={32}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <p className="text-xs text-muted-foreground">
          Account details cannot be changed.
        </p>
      </CardFooter>
    </Card>
  )
}
