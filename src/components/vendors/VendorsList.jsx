import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Star, TrendingUp, TrendingDown } from "lucide-react";

export default function VendorsList({ vendors, userRole, isFinanceOrSuperAdmin }) {
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);

  const getStatusBadge = (status) => {
    const config = {
      active: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
      inactive: { color: "bg-slate-200 text-slate-600", icon: null },
      suspended: { color: "bg-rose-100 text-rose-700", icon: AlertTriangle },
      pending_review: { color: "bg-amber-100 text-amber-700", icon: Clock },
      draft: { color: "bg-slate-200 text-slate-600", icon: null }
    };
    const { color, icon: Icon } = config[status] || config.draft;
    return (
      <Badge className={`${color} text-xs`}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {status?.replace("_", " ")}
      </Badge>
    );
  };

  const getComplianceBadge = (status) => {
    const config = {
      compliant: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
      expiring_soon: { color: "bg-amber-100 text-amber-700", icon: Clock },
      expired: { color: "bg-rose-100 text-rose-700", icon: AlertTriangle },
      under_review: { color: "bg-blue-100 text-blue-700", icon: null }
    };
    const { color, icon: Icon } = config[status] || config.under_review;
    return (
      <Badge className={`${color} text-xs`}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {status?.replace("_", " ")}
      </Badge>
    );
  };

  const getRatingStars = (rating) => {
    if (!rating) return <span className="text-slate-400 text-xs">No rating</span>;
    const stars = Math.round(rating);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < stars ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
          />
        ))}
        <span className="text-xs text-slate-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const gridColumns = isOpsAdmin
    ? "2fr 1fr 1fr 1fr 100px 100px 80px 40px"
    : "2fr 1fr 1fr 1fr 100px 40px";

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div 
        className="hidden md:grid gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wide"
        style={{ gridTemplateColumns: gridColumns }}
      >
        <div>Vendor</div>
        <div>Port</div>
        <div>Status</div>
        <div>Rating</div>
        <div>Orders</div>
        {isOpsAdmin && (
          <>
            <div>Compliance</div>
            <div>SLA</div>
          </>
        )}
        <div></div>
      </div>

      <div className="divide-y divide-slate-100">
        {vendors.map(vendor => (
          <Link
            key={vendor.id}
            to={createPageUrl("VendorDetail") + `?id=${vendor.id}`}
            className="grid gap-3 px-4 py-3 hover:bg-slate-50 transition-colors items-center"
            style={{ gridTemplateColumns: gridColumns }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{vendor.legal_name || vendor.trading_name}</span>
                {vendor.status === "suspended" && (
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                )}
              </div>
              <span className="text-xs text-slate-500 font-mono">{vendor.vendor_id}</span>
            </div>

            <div className="text-sm text-slate-600">{vendor.primary_port || "—"}</div>

            <div>{getStatusBadge(vendor.status)}</div>

            <div>{getRatingStars(vendor.rating)}</div>

            <div className="text-sm text-slate-700">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                {vendor.total_orders_completed || 0}
              </div>
              {vendor.total_orders_cancelled > 0 && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <TrendingDown className="w-3 h-3 text-rose-500" />
                  {vendor.total_orders_cancelled}
                </div>
              )}
            </div>

            {isOpsAdmin && (
              <>
                <div>{getComplianceBadge(vendor.compliance_status)}</div>

                <div className="text-sm text-slate-700">
                  {vendor.sla_breach_count > 0 ? (
                    <span className="text-rose-600 font-medium">{vendor.sla_breach_count}</span>
                  ) : (
                    <span className="text-emerald-600">0</span>
                  )}
                </div>
              </>
            )}

            <div className="text-slate-400">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}