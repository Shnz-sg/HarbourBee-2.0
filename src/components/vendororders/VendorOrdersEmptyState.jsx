import React from "react";
import { FileText, Filter } from "lucide-react";

export default function VendorOrdersEmptyState({ hasFilters, quickTab, userRole }) {
  const isVendor = userRole === "vendor";

  if (hasFilters) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No vendor orders match your filters</h3>
        <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  if (isVendor) {
    if (quickTab === "new") {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700 mb-1">No new orders</h3>
          <p className="text-sm text-slate-500">New orders will appear here when created</p>
        </div>
      );
    } else if (quickTab === "in_progress") {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700 mb-1">No orders in progress</h3>
          <p className="text-sm text-slate-500">Acknowledged orders will appear here</p>
        </div>
      );
    } else {
      return (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-700 mb-1">No completed orders</h3>
          <p className="text-sm text-slate-500">Completed orders will appear here</p>
        </div>
      );
    }
  }

  if (quickTab === "awaiting_ack") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No orders awaiting acknowledgement</h3>
        <p className="text-sm text-slate-500">All vendors have acknowledged their orders</p>
      </div>
    );
  } else if (quickTab === "preparing") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No orders in preparation</h3>
        <p className="text-sm text-slate-500">Orders will appear here once acknowledged</p>
      </div>
    );
  } else if (quickTab === "ready") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No orders ready for pickup</h3>
        <p className="text-sm text-slate-500">Orders will appear here when vendors mark them ready</p>
      </div>
    );
  } else if (quickTab === "completed") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No completed orders</h3>
        <p className="text-sm text-slate-500">Completed orders will appear here</p>
      </div>
    );
  } else if (quickTab === "issues") {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-slate-700 mb-1">No vendor order issues</h3>
        <p className="text-sm text-slate-500">All vendor orders are running smoothly</p>
      </div>
    );
  }

  return (
    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-slate-700 mb-1">No vendor orders</h3>
      <p className="text-sm text-slate-500">Vendor orders will appear here once created</p>
    </div>
  );
}