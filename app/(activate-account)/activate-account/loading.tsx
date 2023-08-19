import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ActivateAccountLoading() {
  return (
    <section className="space-y-6 px-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <Card className="mx-auto max-w-[50rem] border-none shadow-none">
        <CardHeader className="items-center">
          <Skeleton className="h-12 w-3/5" />
          <Skeleton className="h-5 w-4/5" />
        </CardHeader>
        <CardContent className="flex justify-center pt-6">
          <Skeleton className="h-10 w-2/5" />
        </CardContent>
      </Card>
    </section>
  )
}
