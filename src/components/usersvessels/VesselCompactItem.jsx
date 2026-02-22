import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { Anchor, Users } from "lucide-react";

export default function VesselCompactItem({ vessel }) {
  const vesselType = vessel.vessel_type?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  
  return (
    <Link
      to={createPageUrl(`UsersVessels?view=vessel-detail&id=${vessel.id}`)}
      className="block px-4 py-3 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Anchor className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-900">{vessel.name}</span>
            {vesselType && (
              <span className="text-xs text-slate-500">• {vesselType}</span>
            )}
            <StatusBadge status={vessel.status || "active"} className="ml-auto" />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {vessel.imo_number && (
              <span className="font-mono">{vessel.imo_number}</span>
            )}
            {vessel.current_port && (
              <>
                <span>•</span>
                <span>{vessel.current_port}</span>
              </>
            )}
            {vessel.activeOrders > 0 && (
              <>
                <span>•</span>
                <span className="font-medium text-slate-700">{vessel.activeOrders} active</span>
              </>
            )}
            {vessel.crewCount > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{vessel.crewCount}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}