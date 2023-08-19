import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ActivateAccountLoading() {
  return (
    <section className="px-6 pt-6 pb-8 space-y-6 md:pb-12 md:pt-10 lg:py-32">
      <Card className="mx-auto max-w-[50rem] border-none shadow-none">
        <CardHeader className="items-center">
          <Skeleton className="w-3/5 h-12" />
          <Skeleton className="w-4/5 h-5" />
        </CardHeader>
        <CardContent className="flex justify-center pt-6">
          <Skeleton className="w-2/5 h-10" />
        </CardContent>
      </Card>
    </section>
  )
}
