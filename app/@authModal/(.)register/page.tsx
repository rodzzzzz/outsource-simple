import { FC } from "react"

import CloseModal from "@/components/close-modal"
import { Register } from "@/components/register"

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/40">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative w-full px-2 py-20 rounded-lg bg-background h-fit">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>

          <Register />
        </div>
      </div>
    </div>
  )
}

export default page
