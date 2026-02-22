import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, Truck, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoleAdaptivePanel({ role, data }) {
  if (role === "vendor") {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-semibold text-slate-900">Orders to Fulfill</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            {data?.vendorOrders?.pending || 0}
          </p>
          <p className="text-sm text-slate-600 mb-4">Awaiting fulfillment</p>
          <Link to={createPageUrl("VendorOrders")}>
            <Button variant="outline" size="sm" className="w-full">
              View All
            </Button>
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-green-600" />
            <h3 className="text-base font-semibold text-slate-900">Ready for Dispatch</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            {data?.vendorOrders?.ready || 0}
          </p>
          <p className="text-sm text-slate-600 mb-4">Prepared and ready</p>
          <Link to={createPageUrl("VendorOrders")}>
            <Button variant="outline" size="sm" className="w-full">
              View All
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (role === "ops_admin" || role === "admin") {
    return (
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900">Pools Closing Soon</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {data?.poolsClosingSoon || 0}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-semibold text-slate-900">Open Exceptions</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {data?.exceptionsCount || 0}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-5 h-5 text-sky-600" />
            <h3 className="text-sm font-semibold text-slate-900">Active Deliveries</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {data?.activeDeliveries || 0}
          </p>
        </div>
      </div>
    );
  }

  // Default for crew/vessel users
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-sky-600" />
          <h3 className="text-base font-semibold text-slate-900">Your Orders</h3>
        </div>
        <p className="text-3xl font-bold text-slate-900 mb-2">
          {data?.ordersSummary?.total || 0}
        </p>
        <div className="flex gap-4 text-sm text-slate-600">
          <span>{data?.ordersSummary?.pending || 0} pending</span>
          <span>{data?.ordersSummary?.delivered || 0} delivered</span>
        </div>
        <Link to={createPageUrl("Orders")} className="mt-4 block">
          <Button variant="outline" size="sm" className="w-full">
            View All Orders
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-5 h-5 text-green-600" />
          <h3 className="text-base font-semibold text-slate-900">Your Deliveries</h3>
        </div>
        <p className="text-3xl font-bold text-slate-900 mb-2">
          {data?.deliveriesSummary?.upcoming || 0}
        </p>
        <div className="flex gap-4 text-sm text-slate-600">
          <span>{data?.deliveriesSummary?.inTransit || 0} in transit</span>
          <span>{data?.deliveriesSummary?.completed || 0} completed</span>
        </div>
        <Link to={createPageUrl("Deliveries")} className="mt-4 block">
          <Button variant="outline" size="sm" className="w-full">
            View All Deliveries
          </Button>
        </Link>
      </div>
    </div>
  );
}