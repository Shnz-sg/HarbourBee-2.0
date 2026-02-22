import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Ship, Store, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RevenueBreakdowns({ ledger, hasFullAccess }) {
  const [showAllVessels, setShowAllVessels] = useState(false);
  const [showAllVendors, setShowAllVendors] = useState(false);

  // Revenue by Vessel
  const vesselRevenue = {};
  ledger.forEach(entry => {
    if (entry.ledger_type === 'charge' && entry.status === 'succeeded' && entry.vessel_id) {
      if (!vesselRevenue[entry.vessel_id]) {
        vesselRevenue[entry.vessel_id] = { revenue: 0, orders: 0, vessel_imo: entry.vessel_imo };
      }
      vesselRevenue[entry.vessel_id].revenue += entry.amount_minor || 0;
      vesselRevenue[entry.vessel_id].orders += 1;
    }
  });

  const vesselList = Object.entries(vesselRevenue)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.revenue - a.revenue);

  const topVessels = showAllVessels ? vesselList : vesselList.slice(0, 5);

  // Revenue by Vendor
  const vendorRevenue = {};
  ledger.forEach(entry => {
    if (entry.ledger_type === 'payout' && entry.vendor_id) {
      if (!vendorRevenue[entry.vendor_id]) {
        vendorRevenue[entry.vendor_id] = { payout: 0, orders: 0 };
      }
      vendorRevenue[entry.vendor_id].payout += entry.amount_minor || 0;
      vendorRevenue[entry.vendor_id].orders += 1;
    }
  });

  const vendorList = Object.entries(vendorRevenue)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.payout - a.payout);

  const topVendors = showAllVendors ? vendorList : vendorList.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue by Vessel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Ship className="w-5 h-5" />
            Revenue by Vessel (Top {topVessels.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topVessels.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No vessel data available</p>
          ) : (
            <div className="space-y-2">
              {topVessels.map((vessel) => (
                <Link
                  key={vessel.id}
                  to={createPageUrl(`VesselDetail?id=${vessel.id}`)}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{vessel.id}</p>
                    <p className="text-xs text-slate-500">{vessel.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      ${(vessel.revenue / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500">revenue</p>
                  </div>
                </Link>
              ))}
              {vesselList.length > 5 && !showAllVessels && (
                <button
                  onClick={() => setShowAllVessels(true)}
                  className="w-full text-center py-2 text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  View All ({vesselList.length} vessels) →
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Vendor - Finance/Super Admin only */}
      {hasFullAccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="w-5 h-5" />
              Vendor Payouts (Top {topVendors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topVendors.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No vendor data available</p>
            ) : (
              <div className="space-y-2">
                {topVendors.map((vendor) => (
                  <Link
                    key={vendor.id}
                    to={createPageUrl(`VendorDetail?id=${vendor.id}`)}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{vendor.id}</p>
                      <p className="text-xs text-slate-500">{vendor.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        ${(vendor.payout / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">payout</p>
                    </div>
                  </Link>
                ))}
                {vendorList.length > 5 && !showAllVendors && (
                  <button
                    onClick={() => setShowAllVendors(true)}
                    className="w-full text-center py-2 text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    View All ({vendorList.length} vendors) →
                  </button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}