import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardSkeleton } from "@/components/card-skeleton"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Resume"
        text="Make yourself more pleasing to employers."
      ></DashboardHeader>
      <Tabs defaultValue="details" className="">
        <div className="flex flex-col gap-1 lg:flex-row">
          <Skeleton className="h-[40px] w-[250px]" />
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger disabled value="work">
              Work History
            </TabsTrigger>
            <TabsTrigger disabled value="education">
              Education
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="details">
          <CardSkeleton />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
