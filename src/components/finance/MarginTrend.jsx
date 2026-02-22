import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function MarginTrend({ ledger, dateRange }) {
  // Group by day and calculate daily margin
  const dailyData = {};
  
  ledger.forEach(entry => {
    const date = new Date(entry.occurred_at).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = { revenue: 0, costs: 0, fees: 0 };
    }
    
    if (entry.ledger_type === 'charge' && entry.status === 'succeeded') {
      dailyData[date].revenue += entry.amount_minor || 0;
    }
    if (entry.ledger_type === 'refund' && entry.status === 'succeeded') {
      dailyData[date].revenue -= entry.amount_minor || 0;
    }
    if (entry.ledger_type === 'payout' && entry.status === 'succeeded') {
      dailyData[date].costs += entry.amount_minor || 0;
    }
    dailyData[date].fees += (entry.stripe_fee_minor || 0) + (entry.platform_fee_minor || 0);
  });

  const dates = Object.keys(dailyData).sort();
  const margins = dates.map(date => {
    const { revenue, costs, fees } = dailyData[date];
    const margin = revenue - costs - fees;
    return { date, margin: margin / 100 };
  });

  // Calculate overall margin
  const totalRevenue = Object.values(dailyData).reduce((sum, d) => sum + d.revenue, 0);
  const totalCosts = Object.values(dailyData).reduce((sum, d) => sum + d.costs, 0);
  const totalFees = Object.values(dailyData).reduce((sum, d) => sum + d.fees, 0);
  const overallMargin = ((totalRevenue - totalCosts - totalFees) / totalRevenue) * 100;

  // Simple sparkline (text-based for now)
  const maxMargin = Math.max(...margins.map(m => m.margin));
  const minMargin = Math.min(...margins.map(m => m.margin));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="w-5 h-5" />
          Platform Margin Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-3xl font-bold text-slate-900">
            {overallMargin.toFixed(1)}%
          </p>
          <p className="text-sm text-slate-500">Overall margin (last {dateRange} days)</p>
        </div>
        <div className="h-32 flex items-end gap-0.5">
          {margins.slice(-30).map((m, i) => {
            const height = ((m.margin - minMargin) / (maxMargin - minMargin)) * 100;
            return (
              <div
                key={i}
                className="flex-1 bg-sky-500 rounded-t"
                style={{ height: `${height || 1}%` }}
                title={`${m.date}: $${m.margin.toFixed(2)}`}
              />
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-slate-500">Revenue</p>
            <p className="text-sm font-semibold text-slate-900">
              ${(totalRevenue / 100).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Costs</p>
            <p className="text-sm font-semibold text-slate-900">
              ${(totalCosts / 100).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Fees</p>
            <p className="text-sm font-semibold text-slate-900">
              ${(totalFees / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}