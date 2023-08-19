import { FC } from "react"

import CloseModal from "@/components/close-modal"
import { Register } from "@/components/register"

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/40">
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-fit w-full rounded-lg bg-background px-2 py-20">
          <div className="absolute right-4 top-4">
            <CloseModal />
          </div>

          <Register />
        </div>
      </div>
    </div>
  )
}

export default page
