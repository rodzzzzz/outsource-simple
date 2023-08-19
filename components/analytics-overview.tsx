"use client"

import {
  Bar,
  BarChart,
  Legend,
  LegendProps,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts"
import { Payload as LegendPayload } from "recharts/types/component/DefaultLegendContent"
import {
  NameType,
  Payload as TooltipPayload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

import { kFormatter } from "@/lib/utils"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

export type DailyObject = {
  date: string
  applications: number
  visits: number
}

interface AnalyticsOverviewProps {
  data: DailyObject[]
  isEmptyData: boolean
}

type DisplayConfig = {
  label: string
  color: string
}

const displayItems: {
  applications: DisplayConfig
  visits: DisplayConfig
  applicationRate: DisplayConfig
} = {
  applications: {
    label: "Applications",
    color: "#adfa1d",
  },
  visits: {
    label: "Visits",
    color: "#dcfc9f",
  },
  applicationRate: {
    label: "Application rate",
    color: "#39B5E0",
  },
}

function FormatYAxisK(tickItem: number) {
  return kFormatter(tickItem) as string
}

function FormatYAxisPercentage(tickItem: number) {
  return `${tickItem}%` as string
}

const CustomTooltip = (
  props: TooltipProps<ValueType, NameType>
): JSX.Element | null => {
  const { active, payload, label } = props
  if (active && payload && payload.length) {
    return (
      <div className="px-6 py-4 border rounded shadow-lg bg-popover">
        <h1 className="mb-3 text-lg font-bold text-primary">{label}</h1>
        <table>
          <tbody className="text-sm">
            {payload.map(
              (entry: TooltipPayload<ValueType, NameType>, index: number) => {
                const item = displayItems[entry.name!] as DisplayConfig
                return (
                  <tr key={`item-${index}`}>
                    <td className="text-muted-foreground">{item.label}</td>
                    <td className="py-1 pl-6 font-bold">{`${entry.value}`}</td>
                  </tr>
                )
              }
            )}
          </tbody>
        </table>
      </div>
    )
  }

  return null
}

const CustomLegend = (props: LegendProps) => {
  const { payload } = props

  return (
    <ul className="flex justify-center w-full gap-6">
      {payload?.map((entry: LegendPayload, index: number) => {
        const item = displayItems[entry.value] as DisplayConfig

        return (
          <li
            key={`item-${index}`}
            className="flex items-center gap-1 text-sm text-gray-600"
          >
            <span
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: item.color }}
            />

            {item.label}
          </li>
        )
      })}
    </ul>
  )
}

export function AnalyticsOverview({
  data,
  isEmptyData,
}: AnalyticsOverviewProps) {
  return (
    <>
      {!isEmptyData ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="number"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={0}
              allowDecimals={false}
              tickFormatter={FormatYAxisK}
            />
            <YAxis
              type="number"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={FormatYAxisPercentage}
            />

            <Tooltip
              position={{ y: 10 }}
              cursor={{ opacity: 0.2 }}
              wrapperStyle={{ outline: "none" }}
              content={<CustomTooltip />}
            />

            <Bar
              stackId="a"
              dataKey="applications"
              fill={displayItems.applications.color}
              animationDuration={500}
              animationEasing="ease-in-out"
            />
            <Bar
              stackId="a"
              dataKey="visits"
              fill={displayItems.visits.color}
              radius={[4, 4, 0, 0]}
              animationBegin={510}
              animationDuration={500}
              animationEasing="ease-in-out"
            />
            <Legend content={CustomLegend} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[350px] pl-4">
          <EmptyPlaceholder className="min-h-full">
            <EmptyPlaceholder.Icon name="barchart" />
            <EmptyPlaceholder.Title className="text-lg">
              No data to display
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any data recieved from the past 7 days.
            </EmptyPlaceholder.Description>
          </EmptyPlaceholder>
        </div>
      )}
    </>
  )
}
