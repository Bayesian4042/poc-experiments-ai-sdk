"use client";

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  {
    month: 'Jan',
    value: 12.5,
  },
  {
    month: 'Feb',
    value: 14.2,
  },
  {
    month: 'Mar',
    value: 13.8,
  },
  {
    month: 'Apr',
    value: 16.5,
  },
  {
    month: 'May',
    value: 18.9,
  },
  {
    month: 'Jun',
    value: 22.3,
  },
  {
    month: 'Jul',
    value: 24.1,
  },
  {
    month: 'Aug',
    value: 26.8,
  },
  {
    month: 'Sep',
    value: 28.5,
  },
  {
    month: 'Oct',
    value: 31.2,
  },
  {
    month: 'Nov',
    value: 33.8,
  },
  {
    month: 'Dec',
    value: 35.4,
  },
]

export function PortfolioChart() {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Portfolio Performance
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            style={{
              fontSize: '12px',
            }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{
              fontSize: '12px',
            }}
            tickFormatter={(value) => `$${value}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
            formatter={(value: number) => [`$${value}M`, 'Portfolio Value']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(222.2 47.4% 11.2%)"
            strokeWidth={2}
            dot={{
              fill: 'hsl(222.2 47.4% 11.2%)',
              r: 4,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


