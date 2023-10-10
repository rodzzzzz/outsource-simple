"use client"

import * as React from "react"
import { User } from "@prisma/client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { UserAvatarEditor } from "./user-avatar-editor"

interface EmployerAccountDetailsFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "email" | "firstName" | "lastName" | "image">
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
          <div className="w-full max-w-[400px] flex flex-col gap-y-2">
            <Label>Profile Picture</Label>
            <UserAvatarEditor
              image={user.image}
              firstName={user.firstName}
              lastName={user.lastName}
            />
          </div>

          <Separator />

          <div className="flex flex-wrap gap-8">
            <div className="w-full max-w-[400px] space-y-2">
              <Label>First Name</Label>
              <Input
                defaultValue={user.firstName}
                className="w-full"
                size={32}
              />
            </div>

            <div className="w-full max-w-[400px] space-y-2">
              <Label>Last Name</Label>
              <Input
                defaultValue={user.lastName}
                className="w-full"
                size={32}
              />
            </div>
          </div>

          <div className="w-full max-w-[400px] space-y-2">
            <Label>Email Address</Label>
            <Input
              disabled
              defaultValue={user.email!}
              className="w-full"
              size={32}
            />
            <p className="text-xs text-muted-foreground">
              Email address cannot be changed.
            </p>
          </div>

          <Button>Update account</Button>
        </div>
      </CardContent>
    </Card>
  )
}
