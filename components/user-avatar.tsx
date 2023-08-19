import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image">
  name: String | null
}

export function UserAvatar({ user, name, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage alt="Picture" src={user.image!} />
      <AvatarFallback>
        <span className="sr-only">{name}</span>
        <Icons.user className="w-4 h-4" />
      </AvatarFallback>
    </Avatar>
  )
}
