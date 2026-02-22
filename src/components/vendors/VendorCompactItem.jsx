import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { Building2, MapPin, Star } from "lucide-react";

export default function VendorCompactItem({ vendor, hasIssue, showIssue, metrics, userRole }) {
  const primaryCategory = vendor.categories?.length > 0 ? vendor.categories[0] : null;

  return (
    <Link
      to={createPageUrl(`Vendors?view=detail&id=${vendor.id}`)}
      className="block px-4 py-3 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Block: Name, Category, Port */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-900 truncate">{vendor.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {primaryCategory && <span>{primaryCategory}</span>}
            {primaryCategory && vendor.port && <span>·</span>}
            {vendor.port && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{vendor.port}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Block: Status, Rating, Issue */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={vendor.status || "active"} />
          
          {vendor.rating && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-slate-700">{vendor.rating.toFixed(1)}</span>
            </div>
          )}

          {showIssue && hasIssue && (
            <div className="w-2 h-2 rounded-full bg-amber-500" title="Has issues" />
          )}
        </div>
      </div>
    </Link>
  );
}