import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { Anchor, Users } from "lucide-react";

export default function VesselListItem({ vessel, userRole }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = userRole === "ops_admin" || userRole === "admin";
  const isSuperAdmin = userRole === "super_admin";

  const vesselType = vessel.vessel_type?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "—";

  const gridCols = isOpsStaff ? "grid-cols-7" :
    isOpsAdmin ? "grid-cols-8" :
    isSuperAdmin ? "grid-cols-9" : "grid-cols-7";

  return (
    <Link
      to={createPageUrl(`UsersVessels?view=vessel-detail&id=${vessel.id}`)}
      className={`grid ${gridCols} gap-2 px-4 py-3 hover:bg-slate-50 transition-colors items-center`}
    >
      {/* Vessel Name */}
      <div className="flex items-center gap-2">
        <Anchor className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-900 truncate">{vessel.name}</span>
      </div>

      {/* IMO */}
      <div className="text-xs text-slate-600 font-mono">
        {vessel.imo_number || "—"}
      </div>

      {/* Type */}
      <div className="text-xs text-slate-600">{vesselType}</div>

      {/* Status */}
      <div>
        <StatusBadge status={vessel.status || "active"} />
      </div>

      {/* Current Port */}
      <div className="text-xs text-slate-600 truncate">
        {vessel.current_port || "—"}
      </div>

      {/* Active Orders */}
      <div className="text-sm font-medium text-slate-700">
        {vessel.activeOrders || 0}
      </div>

      {/* Crew */}
      <div className="flex items-center gap-1 text-xs text-slate-600">
        <Users className="w-3 h-3" />
        <span>{vessel.crewCount || 0}</span>
      </div>

      {/* Lifetime Orders (Ops Admin+) */}
      {(isOpsAdmin || isSuperAdmin) && (
        <div className="text-sm text-slate-600">
          {vessel.lifetimeOrders || 0}
        </div>
      )}

      {/* Revenue (Super Admin) */}
      {isSuperAdmin && (
        <div className="text-sm font-medium text-slate-700">
          {vessel.lifetimeSpend ? `$${vessel.lifetimeSpend.toLocaleString()}` : "—"}
        </div>
      )}
    </Link>
  );
}