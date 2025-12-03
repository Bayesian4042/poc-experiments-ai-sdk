import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Company {
  name: string
  sector: string
  invested: string
  currentValue: string
  roi: number
  status: 'growing' | 'stable' | 'declining'
}

// This will be replaced by real data passed as props
const companies: Company[] = [
  {
    name: 'TechFlow AI',
    sector: 'Technology',
    invested: '$2.5M',
    currentValue: '$8.2M',
    roi: 228,
    status: 'growing',
  },
  {
    name: 'EcoClean Solutions',
    sector: 'Sustainability',
    invested: '$1.8M',
    currentValue: '$5.4M',
    roi: 200,
    status: 'growing',
  },
  {
    name: 'HealthTrack Pro',
    sector: 'Healthcare',
    invested: '$3.2M',
    currentValue: '$7.1M',
    roi: 122,
    status: 'growing',
  },
  {
    name: 'FoodieBox',
    sector: 'Food & Beverage',
    invested: '$1.5M',
    currentValue: '$2.8M',
    roi: 87,
    status: 'stable',
  },
  {
    name: 'StyleHub',
    sector: 'Fashion',
    invested: '$2.0M',
    currentValue: '$4.5M',
    roi: 125,
    status: 'growing',
  },
  {
    name: 'PetCare Plus',
    sector: 'Pet Services',
    invested: '$1.2M',
    currentValue: '$1.1M',
    roi: -8,
    status: 'declining',
  },
]

interface CompanyTableProps {
    investments?: any[]
}

export function CompanyTable({ investments }: CompanyTableProps) {
  // If investments prop is provided, we would transform it to match the table structure
  // For now, using mock data or we can adapt it later
  const displayData = investments ? investments.map(inv => ({
      name: inv.company,
      sector: 'Technology', // Mock sector
      invested: inv.amount,
      currentValue: inv.amount, // Mock current value
      roi: 0, // Mock ROI
      status: 'stable' as const
  })) : companies;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          Portfolio Companies
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-sm font-medium text-muted-foreground px-6 py-3">
                Company
              </th>
              <th className="text-left text-sm font-medium text-muted-foreground px-6 py-3">
                Sector
              </th>
              <th className="text-right text-sm font-medium text-muted-foreground px-6 py-3">
                Invested
              </th>
              <th className="text-right text-sm font-medium text-muted-foreground px-6 py-3">
                Current Value
              </th>
              <th className="text-right text-sm font-medium text-muted-foreground px-6 py-3">
                ROI
              </th>
              <th className="text-center text-sm font-medium text-muted-foreground px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayData.map((company, i) => (
              <tr
                key={i}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">
                    {company.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {company.sector}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-foreground">
                    {company.invested}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-foreground">
                    {company.currentValue}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`text-sm font-medium ${company.roi > 0 ? 'text-green-600' : company.roi < 0 ? 'text-red-600' : 'text-muted-foreground'}`}
                  >
                    {company.roi > 0 ? '+' : ''}
                    {company.roi}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {company.status === 'growing' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium">Growing</span>
                      </div>
                    )}
                    {company.status === 'stable' && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Minus className="w-4 h-4" />
                        <span className="text-xs font-medium">Stable</span>
                      </div>
                    )}
                    {company.status === 'declining' && (
                      <div className="flex items-center gap-1 text-red-600">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-xs font-medium">Declining</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


