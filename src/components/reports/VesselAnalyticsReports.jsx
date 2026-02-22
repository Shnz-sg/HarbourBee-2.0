import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Ship } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function VesselAnalyticsReports({ ledger, vessels, hasFullAccess }) {
  // Calculate vessel metrics
  const vesselMetrics = {};
  
  ledger.forEach(entry => {
    if (entry.vessel_id) {
      if (!vesselMetrics[entry.vessel_id]) {
        vesselMetrics[entry.vessel_id] = {
          revenue: 0,
          refunds: 0,
          orders: new Set()
        };
      }
      
      if (entry.ledger_type === 'charge' && entry.status === 'succeeded') {
        vesselMetrics[entry.vessel_id].revenue += entry.amount_minor || 0;
      }
      if (entry.ledger_type === 'refund' && entry.status === 'succeeded') {
        vesselMetrics[entry.vessel_id].refunds += entry.amount_minor || 0;
      }
      if (entry.order_id) {
        vesselMetrics[entry.vessel_id].orders.add(entry.order_id);
      }
    }
  });

  const vesselList = Object.entries(vesselMetrics)
    .map(([id, data]) => ({
      id,
      revenue: data.revenue / 100,
      refunds: data.refunds / 100,
      orderCount: data.orders.size,
      avgOrderValue: data.orders.size > 0 ? (data.revenue / 100) / data.orders.size : 0,
      refundRate: data.revenue > 0 ? (data.refunds / data.revenue) * 100 : 0,
      vessel: vessels.find(v => v.id === id)
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="w-5 h-5" />
          Vessel Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vesselList.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No vessel data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-2 font-medium text-slate-700">Vessel</th>
                  <th className="py-2 font-medium text-slate-700 text-right">Orders</th>
                  <th className="py-2 font-medium text-slate-700 text-right">Revenue</th>
                  <th className="py-2 font-medium text-slate-700 text-right">Avg Order</th>
                  <th className="py-2 font-medium text-slate-700 text-right">Refund %</th>
                  {hasFullAccess && (
                    <th className="py-2 font-medium text-slate-700 text-right">Margin</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {vesselList.map((vessel) => (
                  <tr key={vessel.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3">
                      <Link
                        to={createPageUrl(`VesselDetail?id=${vessel.id}`)}
                        className="text-sky-600 hover:text-sky-700 font-medium"
                      >
                        {vessel.vessel?.name || vessel.id}
                      </Link>
                      {vessel.vessel?.imo_number && (
                        <p className="text-xs text-slate-500">{vessel.vessel.imo_number}</p>
                      )}
                    </td>
                    <td className="py-3 text-right text-slate-900">{vessel.orderCount}</td>
                    <td className="py-3 text-right font-medium text-slate-900">
                      ${vessel.revenue.toFixed(2)}
                    </td>
                    <td className="py-3 text-right text-slate-900">
                      ${vessel.avgOrderValue.toFixed(2)}
                    </td>
                    <td className="py-3 text-right text-slate-900">
                      {vessel.refundRate.toFixed(1)}%
                    </td>
                    {hasFullAccess && (
                      <td className="py-3 text-right text-slate-900">
                        ${((vessel.revenue - vessel.refunds) * 0.15).toFixed(2)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}