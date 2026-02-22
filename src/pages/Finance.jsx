import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Download } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import LoadingSkeleton from "../components/states/LoadingSkeleton";
import ErrorState from "../components/states/ErrorState";
import FinancialPulseCards from "../components/finance/FinancialPulseCards";
import FinancialExceptions from "../components/finance/FinancialExceptions";
import RevenueBreakdowns from "../components/finance/RevenueBreakdowns";
import MarginTrend from "../components/finance/MarginTrend";
import { Button } from "@/components/ui/button";

export default function Finance() {
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState(30); // Last 30 days
  const [exportType, setExportType] = useState("summary"); // "summary" or "detail"

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Fetch financial ledger for real-time data
  const { data: ledger = [], isLoading: ledgerLoading, error: ledgerError } = useQuery({
    queryKey: ['finance-ledger', dateRange],
    queryFn: () => base44.entities.FinanceLedger.list('-occurred_at', 1000),
    enabled: !!user && (user.role === 'finance' || user.role === 'super_admin')
  });

  // Fetch financial exceptions (critical/warning only, open/monitoring)
  const { data: allExceptions = [], isLoading: exceptionsLoading } = useQuery({
    queryKey: ['financial-exceptions'],
    queryFn: () => base44.entities.FinancialException.list('-detected_at'),
    enabled: !!user && (user.role === 'finance' || user.role === 'super_admin' || user.role === 'ops_admin')
  });

  // Filter to critical/warning + open/monitoring
  const exceptions = allExceptions.filter(e => 
    (e.severity === 'critical' || e.severity === 'warning') &&
    (e.status === 'open' || e.status === 'monitoring')
  );

  if (!user) return <LoadingSkeleton type="card" count={3} />;
  if (ledgerError) return <ErrorState message="Failed to load financial data" />;

  const isFinance = user.role === 'finance' || user.role === 'super_admin';
  const hasFullAccess = isFinance;

  // Access control
  if (!isFinance && user.role !== 'ops_admin') {
    return (
      <div className="space-y-6">
        <PageHeader title="Finance" subtitle="Access restricted" icon={DollarSign} />
        <ErrorState message="You do not have permission to view financial data" />
      </div>
    );
  }

  // Filter ledger by date range
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - dateRange);
  const filteredLedger = ledger.filter(entry => 
    new Date(entry.occurred_at) >= cutoffDate
  );

  // Export handler
  const handleExport = () => {
    const headers = exportType === "detail" 
      ? ["Date", "Type", "Direction", "Amount", "Currency", "Status", "Order ID", "Vendor ID", "Vessel ID"]
      : ["Metric", "Value", "Currency"];

    let rows = [];
    if (exportType === "detail") {
      rows = filteredLedger.map(e => [
        new Date(e.occurred_at).toLocaleDateString(),
        e.ledger_type,
        e.direction,
        (e.amount_minor / 100).toFixed(2),
        e.currency,
        e.status,
        e.order_id || "",
        e.vendor_id || "",
        e.vessel_id || ""
      ]);
    } else {
      // Summary export - aggregated metrics
      const gmv = filteredLedger.filter(e => e.ledger_type === 'charge' && e.status === 'succeeded')
        .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;
      const refunds = filteredLedger.filter(e => e.ledger_type === 'refund' && e.status === 'succeeded')
        .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;
      const payouts = filteredLedger.filter(e => e.ledger_type === 'payout')
        .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;
      
      rows = [
        ["Gross GMV", gmv.toFixed(2), "SGD"],
        ["Refunds", refunds.toFixed(2), "SGD"],
        ["Vendor Payouts", payouts.toFixed(2), "SGD"],
        ["Net Revenue", (gmv - refunds).toFixed(2), "SGD"]
      ];
    }

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance_${exportType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLoading = ledgerLoading || exceptionsLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance Overview"
        subtitle={hasFullAccess ? "Real-time financial command center" : "Financial operations awareness"}
        icon={DollarSign}
      >
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          {hasFullAccess && (
            <>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-1.5 bg-white"
              >
                <option value="summary">Summary</option>
                <option value="detail">Detail</option>
              </select>
              <Button size="sm" variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <>
          {/* Financial Pulse Cards */}
          <FinancialPulseCards
            ledger={filteredLedger}
            dateRange={dateRange}
            userRole={user.role}
            hasFullAccess={hasFullAccess}
          />

          {/* Financial Exceptions */}
          {exceptions.length > 0 && (
            <FinancialExceptions exceptions={exceptions} userRole={user.role} />
          )}

          {/* Margin Trend - Finance/Super Admin only */}
          {hasFullAccess && (
            <MarginTrend ledger={filteredLedger} dateRange={dateRange} />
          )}

          {/* Revenue Breakdowns */}
          <RevenueBreakdowns ledger={filteredLedger} hasFullAccess={hasFullAccess} />
        </>
      )}
    </div>
  );
}