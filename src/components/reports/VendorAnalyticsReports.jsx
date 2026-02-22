import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function VendorAnalyticsReports({ ledger, vendors, hasFullAccess }) {
  // Calculate vendor metrics
  const vendorMetrics = {};
  
  ledger.forEach(entry => {
    if (entry.vendor_id) {
      if (!vendorMetrics[entry.vendor_id]) {
        vendorMetrics[entry.vendor_id] = {
          revenue: 0,
          payout: 0,
          refunds: 0,
          orders: new Set()
        };
      }
      
      if (entry.ledger_type === 'charge' && entry.status === 'succeeded') {
        vendorMetrics[entry.vendor_id].revenue += entry.amount_minor || 0;
      }
      if (entry.ledger_type === 'payout') {
        vendorMetrics[entry.vendor_id].payout += entry.amount_minor || 0;
      }
      if (entry.ledger_type === 'refund' && entry.status === 'succeeded') {
        vendorMetrics[entry.vendor_id].refunds += entry.amount_minor || 0;
      }
      if (entry.order_id) {
        vendorMetrics[entry.vendor_id].orders.add(entry.order_id);
      }
    }
  });

  const vendorList = Object.entries(vendorMetrics)
    .map(([id, data]) => ({
      id,
      revenue: data.revenue / 100,
      payout: data.payout / 100,
      refunds: data.refunds / 100,
      orderCount: data.orders.size,
      margin: hasFullAccess ? ((data.revenue - data.payout) / 100) : null,
      refundRate: data.revenue > 0 ? (data.refunds / data.revenue) * 100 : 0,
      vendor: vendors.find(v => v.id === id)
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          Vendor Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vendorList.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No vendor data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-2 font-medium text-slate-700">Vendor</th>
                  <th className="py-2 font-medium text-slate-700 text-right">Orders</th>
                  <th className="py-2 font-medium text-slate-700 text-right">Revenue</th>
                  {hasFullAccess && (
                    <>
                      <th className="py-2 font-medium text-slate-700 text-right">Payout</th>
                      <th className="py-2 font-medium text-slate-700 text-right">Margin</th>
                    </>
                  )}
                  <th className="py-2 font-medium text-slate-700 text-right">Refund %</th>
                </tr>
              </thead>
              <tbody>
                {vendorList.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3">
                      <Link
                        to={createPageUrl(`VendorDetail?id=${vendor.id}`)}
                        className="text-sky-600 hover:text-sky-700 font-medium"
                      >
                        {vendor.vendor?.legal_name || vendor.id}
                      </Link>
                    </td>
                    <td className="py-3 text-right text-slate-900">{vendor.orderCount}</td>
                    <td className="py-3 text-right font-medium text-slate-900">
                      ${vendor.revenue.toFixed(2)}
                    </td>
                    {hasFullAccess && (
                      <>
                        <td className="py-3 text-right text-slate-900">
                          ${vendor.payout.toFixed(2)}
                        </td>
                        <td className="py-3 text-right text-slate-900">
                          ${vendor.margin.toFixed(2)}
                        </td>
                      </>
                    )}
                    <td className="py-3 text-right text-slate-900">
                      {vendor.refundRate.toFixed(1)}%
                    </td>
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