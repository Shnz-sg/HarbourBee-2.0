import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { User, Anchor } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function UserListItem({ user, userRole }) {
  const isOpsStaff = userRole === "ops_staff";
  const isOpsAdmin = userRole === "ops_admin" || userRole === "admin";
  const isSuperAdmin = userRole === "super_admin";

  const displayRole = user.role?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "User";
  const isActive = user.role !== "inactive";
  const isInvited = user.isInvited || user.invitationStatus === "pending";

  const gridCols = isOpsStaff ? "grid-cols-5" :
    isOpsAdmin ? "grid-cols-6" :
    isSuperAdmin ? "grid-cols-6" : "grid-cols-5";

  return (
    <Link
      to={createPageUrl(`UsersVessels?view=user-detail&id=${user.id}`)}
      className={`grid ${gridCols} gap-2 px-4 py-3 hover:bg-slate-50 transition-colors items-center`}
    >
      {/* Name */}
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-slate-400" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-slate-900 truncate">
            {user.full_name || user.email}
          </span>
          {isInvited && (
            <span className="text-[10px] text-slate-400">Invited</span>
          )}
        </div>
      </div>

      {/* Role */}
      <div className="text-xs text-slate-700 font-medium">{displayRole}</div>

      {/* Status */}
      <div>
        <StatusBadge status={isActive ? "active" : "inactive"} />
      </div>

      {/* Primary Vessel */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
        {user.primaryVessel ? (
          <>
            <Anchor className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate">{user.primaryVessel}</span>
          </>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </div>

      {/* Last Activity */}
      <div className="text-xs text-slate-500">
        {user.lastActivity 
          ? formatDistanceToNow(new Date(user.lastActivity), { addSuffix: true })
          : "—"
        }
      </div>

      {/* Created (Ops Admin+) */}
      {(isOpsAdmin || isSuperAdmin) && (
        <div className="text-xs text-slate-500">
          {user.created_date 
            ? formatDistanceToNow(new Date(user.created_date), { addSuffix: true })
            : "—"
          }
        </div>
      )}
    </Link>
  );
}