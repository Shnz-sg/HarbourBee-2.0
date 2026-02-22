import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinancialPerformanceReports({ ledger, vessels, vendors, hasFullAccess }) {
  const [dateRange, setDateRange] = useState(30);
  const [selectedVessel, setSelectedVessel] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");

  // Filter ledger
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - dateRange);
  let filteredLedger = ledger.filter(e => new Date(e.occurred_at) >= cutoffDate);

  if (selectedVessel) {
    filteredLedger = filteredLedger.filter(e => e.vessel_id === selectedVessel);
  }
  if (selectedVendor) {
    filteredLedger = filteredLedger.filter(e => e.vendor_id === selectedVendor);
  }

  // Calculate metrics
  const gmv = filteredLedger
    .filter(e => e.ledger_type === 'charge' && e.status === 'succeeded')
    .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;

  const refunds = filteredLedger
    .filter(e => e.ledger_type === 'refund' && e.status === 'succeeded')
    .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;

  const payouts = filteredLedger
    .filter(e => e.ledger_type === 'payout')
    .reduce((sum, e) => sum + (e.amount_minor || 0), 0) / 100;

  const stripeFees = filteredLedger
    .reduce((sum, e) => sum + (e.stripe_fee_minor || 0), 0) / 100;

  const platformFees = filteredLedger
    .reduce((sum, e) => sum + (e.platform_fee_minor || 0), 0) / 100;

  const netRevenue = gmv - refunds;
  const netPlatformEarnings = hasFullAccess ? netRevenue - payouts - stripeFees : null;
  const grossMargin = hasFullAccess && gmv > 0 ? ((netPlatformEarnings / gmv) * 100) : null;

  const handleExport = () => {
    const headers = ["Metric", "Value", "Currency"];
    const rows = [
      ["Gross GMV", gmv.toFixed(2), "SGD"],
      ["Refunds", refunds.toFixed(2), "SGD"],
      ["Net Revenue", netRevenue.toFixed(2), "SGD"],
      ["Refund Rate", `${((refunds / gmv) * 100).toFixed(2)}%`, ""],
    ];

    if (hasFullAccess) {
      rows.push(
        ["Vendor Payouts", payouts.toFixed(2), "SGD"],
        ["Stripe Fees", stripeFees.toFixed(2), "SGD"],
        ["Platform Fees", platformFees.toFixed(2), "SGD"],
        ["Net Platform Earnings", netPlatformEarnings.toFixed(2), "SGD"],
        ["Gross Margin", `${grossMargin.toFixed(2)}%`, ""]
      );
    }

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_performance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="text-sm border border-slate-200 rounded-md px-3 py-2 bg-white"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            <select
              value={selectedVessel}
              onChange={(e) => setSelectedVessel(e.target.value)}
              className="text-sm border border-slate-200 rounded-md px-3 py-2 bg-white"
            >
              <option value="">All Vessels</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>{v.name || v.vessel_id}</option>
              ))}
            </select>

            {hasFullAccess && (
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-3 py-2 bg-white"
              >
                <option value="">All Vendors</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.legal_name || v.vendor_id}</option>
                ))}
              </select>
            )}

            {(selectedVessel || selectedVendor) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedVessel("");
                  setSelectedVendor("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Gross GMV" value={`$${gmv.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
        <MetricCard label="Net Revenue" value={`$${netRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
        <MetricCard label="Refund Total" value={`$${refunds.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
        <MetricCard label="Refund Rate" value={`${((refunds / gmv) * 100 || 0).toFixed(1)}%`} />

        {hasFullAccess && (
          <>
            <MetricCard label="Vendor Payouts" value={`$${payouts.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
            <MetricCard label="Stripe Fees" value={`$${stripeFees.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
            <MetricCard label="Net Platform Earnings" value={`$${netPlatformEarnings.toLocaleString(undefined, {minimumFractionDigits: 2})}`} />
            <MetricCard label="Gross Margin" value={`${grossMargin.toFixed(1)}%`} />
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}