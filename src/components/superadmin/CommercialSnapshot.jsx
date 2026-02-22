import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Store, DollarSign } from "lucide-react";

export default function CommercialSnapshot({ vendors, financial }) {
  return (
    <div className="px-6 mt-8">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">Commercial & Financial</h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Vendors */}
        <Link to={createPageUrl("Vendors")} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">Vendors</h3>
          </div>
          <div className="space-y-2.5">
            <Row label="Active Vendors" value={vendors.active} />
            <Row label="With Issues" value={vendors.withIssues} warning={vendors.withIssues > 0} />
            <Row label="Awaiting Action" value={vendors.awaitingAction} />
          </div>
        </Link>

        {/* Financial */}
        <Link to={createPageUrl("Finance")} className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">Financial</h3>
          </div>
          <div className="space-y-2.5">
            <Row label="Today's GMV" value={`$${financial.todayGMV?.toLocaleString() || 0}`} />
            <Row label="Outstanding Settlements" value={`$${financial.outstanding?.toLocaleString() || 0}`} warning={financial.outstanding > 0} />
            <Row label="Refunds Pending" value={financial.refundsPending} />
          </div>
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, warning }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`font-medium ${warning ? "text-amber-600" : "text-slate-900"}`}>{value || 0}</span>
    </div>
  );
}