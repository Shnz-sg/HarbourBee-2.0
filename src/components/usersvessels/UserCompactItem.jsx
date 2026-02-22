import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatusBadge from "../shared/StatusBadge";
import { User, Anchor } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function UserCompactItem({ user }) {
  const displayRole = user.role?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "User";
  const isActive = user.role !== "inactive";
  const isInvited = user.isInvited || user.invitationStatus === "pending";

  return (
    <Link
      to={createPageUrl(`UsersVessels?view=user-detail&id=${user.id}`)}
      className="block px-4 py-3 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-900">{user.full_name || user.email}</span>
            <span className="text-xs text-slate-500">• {displayRole}</span>
            {isInvited && (
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">Invited</span>
            )}
            <StatusBadge status={isActive ? "active" : "inactive"} className="ml-auto" />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {user.primaryVessel && (
              <>
                <Anchor className="w-3 h-3" />
                <span>{user.primaryVessel}</span>
                <span>•</span>
              </>
            )}
            <span>
              {user.lastActivity 
                ? formatDistanceToNow(new Date(user.lastActivity), { addSuffix: true })
                : "No activity"
              }
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}