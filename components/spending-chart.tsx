"use client"

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const COLORS = [
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#3b82f6",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#6366f1",
  "#84cc16",
  "#a855f7",
  "#64748b",
]

interface CategoryData {
  name: string
  amount: number
  percentage: number
}

interface MonthlyData {
  month: string
  amount: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface DonutTooltipProps {
  active?: boolean
  payload?: { name: string; value: number; payload: CategoryData }[]
}

function DonutTooltip({ active, payload }: DonutTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-zinc-100">{item.name}</p>
      <p className="text-zinc-400">
        {formatCurrency(item.value)} &middot; {item.payload.percentage.toFixed(1)}%
      </p>
    </div>
  )
}

interface BarTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

function BarTooltip({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-zinc-100">{label}</p>
      <p className="text-emerald-400">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

interface LegendPayloadItem {
  value: string
  color: string
  payload?: CategoryData
}

function DonutLegend({ payload }: { payload?: LegendPayloadItem[] }) {
  if (!payload) return null
  return (
    <ul className="flex flex-col gap-1.5 text-sm min-w-0">
      {payload.map((entry, i) => (
        <li key={i} className="flex items-center gap-2 min-w-0">
          <span
            className="inline-block size-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="truncate text-zinc-300">{entry.value}</span>
          <span className="ml-auto shrink-0 tabular-nums text-zinc-400 text-xs">
            {entry.payload ? formatCurrency(entry.payload.amount) : ""}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function SpendingDonut({ data }: { data: CategoryData[] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 text-sm">
        No spending data
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="35%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="amount"
          nameKey="name"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={<DonutTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconSize={0}
          content={<DonutLegend />}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function SpendingBarChart({ data }: { data: MonthlyData[] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500 text-sm">
        No trend data
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#71717a", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
          tick={{ fill: "#71717a", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<BarTooltip />} cursor={{ fill: "#27272a" }} />
        <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
