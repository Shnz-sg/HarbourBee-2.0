import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";

export default function FinancialPulseCards({ ledger, dateRange, userRole, hasFullAccess }) {
  // Calculate previous period for comparison
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - dateRange);
  const prevCutoffDate = new Date();
  prevCutoffDate.setDate(prevCutoffDate.getDate() - (dateRange * 2));

  const currentPeriod = ledger.filter(e => new Date(e.occurred_at) >= cutoffDate);
  const previousPeriod = ledger.filter(e => 
    new Date(e.occurred_at) >= prevCutoffDate && new Date(e.occurred_at) < cutoffDate
  );

  // GMV (Gross Merchandise Value)
  const gmv = currentPeriod
    .filter(e => e.ledger_type === 'charge' && e.status === 'succeeded')
    .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;
  
  const prevGmv = previousPeriod
    .filter(e => e.ledger_type === 'charge' && e.status === 'succeeded')
    .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;

  // Refunds
  const refundTotal = currentPeriod
    .filter(e => e.ledger_type === 'refund' && e.status === 'succeeded')
    .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;
  
  const prevRefundTotal = previousPeriod
    .filter(e => e.ledger_type === 'refund' && e.status === 'succeeded')
    .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;

  const refundRate = gmv > 0 ? (refundTotal / gmv) * 100 : 0;
  const prevRefundRate = prevGmv > 0 ? (prevRefundTotal / prevGmv) * 100 : 0;

  // Net Revenue
  const netRevenue = gmv - refundTotal;
  const prevNetRevenue = prevGmv - prevRefundTotal;

  // Pending Payouts
  const pendingPayout = currentPeriod
    .filter(e => e.ledger_type === 'payout' && e.status === 'pending')
    .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;

  // Outstanding Issues (failed transactions)
  const outstandingIssues = currentPeriod
    .filter(e => e.status === 'failed').length;

  // Calculate trend
  const getTrend = (current, previous) => {
    if (previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  const cards = [
    {
      label: "Gross GMV",
      value: `$${gmv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: getTrend(gmv, prevGmv),
      icon: DollarSign,
      visible: true
    },
    {
      label: "Net Revenue",
      value: `$${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: getTrend(netRevenue, prevNetRevenue),
      icon: TrendingUp,
      visible: true
    },
    {
      label: "Refund Rate",
      value: `${refundRate.toFixed(1)}%`,
      trend: getTrend(refundRate, prevRefundRate),
      icon: RefreshCw,
      visible: true,
      invertTrend: true // Lower is better
    },
    {
      label: "Pending Payout",
      value: `$${pendingPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: null,
      icon: Clock,
      visible: hasFullAccess
    },
    {
      label: "Outstanding Issues",
      value: outstandingIssues,
      trend: null,
      icon: AlertCircle,
      visible: true
    }
  ].filter(c => c.visible);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const trendValue = card.trend;
        const showTrend = trendValue !== null;
        const isPositive = card.invertTrend ? trendValue < 0 : trendValue > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{card.value}</p>
              {showTrend && (
                <div className={`flex items-center gap-1 text-xs ${
                  isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  <span>{Math.abs(trendValue).toFixed(1)}%</span>
                  <span className="text-slate-400">vs prev</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

const Clock = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);