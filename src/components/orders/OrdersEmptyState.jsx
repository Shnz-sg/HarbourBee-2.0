import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, Filter, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdersEmptyState({ userRole, hasFilters, quickTab }) {
  if (hasFilters) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No orders match your filters</h3>
        <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  if (userRole === "user") {
    if (quickTab === "all") {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700 mb-1">You haven't placed any orders yet</h3>
          <p className="text-sm text-slate-500 mb-4">Start by browsing our products catalog</p>
          <Button asChild>
            <Link to={createPageUrl("Products")}>Browse Products</Link>
          </Button>
        </div>
      );
    } else if (quickTab === "active") {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700 mb-1">No active orders</h3>
          <p className="text-sm text-slate-500">All your orders have been delivered or cancelled</p>
        </div>
      );
    } else if (quickTab === "delivered") {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700 mb-1">No delivered orders</h3>
          <p className="text-sm text-slate-500">Orders will appear here once delivered</p>
        </div>
      );
    } else if (quickTab === "cancelled") {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700 mb-1">No cancelled orders</h3>
          <p className="text-sm text-slate-500">You haven't cancelled any orders</p>
        </div>
      );
    }
  }

  return (
    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
      <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-700 mb-1">No orders require attention</h3>
      <p className="text-sm text-slate-500">All orders are being handled smoothly</p>
    </div>
  );
}