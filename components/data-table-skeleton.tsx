import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function DataTableSkeleton() {
  return (
    <div className="p-1 overflow-x-auto">
      <div className="space-y-4">
        <div className="flex flex-col flex-1 gap-2 lg:flex-row">
          <Skeleton className="h-8 w-[200px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(3)].map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="w-3/5 min-w-[150px] h-5" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(3)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="w-2/5 min-w-[100px] h-4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-8 w-[120px]" />
          <Skeleton className="h-8 w-[120px]" />
        </div>
      </div>
    </div>
  )
}
