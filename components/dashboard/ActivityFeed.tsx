import React from 'react'
import { DollarSign, Building2, TrendingUp } from 'lucide-react'

interface Investment {
  company: string
  industry: string
  season: string
  amount: string
  equity: string
  dealValuation: string
}

interface ActivityFeedProps {
  investments: Investment[]
}

const iconMap = {
  'Food and Beverage': '🍔',
  'Beauty/Fashion': '💄',
  'Technology': '💻',
  'Manufacturing': '🏭',
  'Children/Education': '📚',
  'Vehicles/Electrical Vehicles': '🚗',
  'Medical/Health': '⚕️',
  'Agriculture': '🌾',
}

export function ActivityFeed({ investments }: ActivityFeedProps) {
  // Show only the first 5 investments as recent activity
  const recentInvestments = investments.slice(0, 5);
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Recent Investments
      </h3>
      <div className="space-y-4">
        {recentInvestments.map((investment, index) => {
          const icon = iconMap[investment.industry as keyof typeof iconMap] || '🏢'
          return (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 text-2xl">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {investment.company}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {investment.industry} • Season {investment.season}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap block">
                      {investment.amount}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      for {investment.equity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-muted-foreground">
                    Valuation: {investment.dealValuation}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {investments.length > 5 && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Showing 5 of {investments.length} total investments
        </p>
      )}
    </div>
  )
}

