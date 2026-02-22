import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lock } from "lucide-react";
import ReportLayerBadge from "./ReportLayerBadge";

export default function ReportListItem({ report, userRole }) {
  const isSuperAdmin = userRole === 'super_admin';
  const isFinance = userRole === 'finance' || userRole === 'admin';
  const isOpsAdmin = userRole === 'ops_admin' || userRole === 'admin';
  const isViewer = userRole === 'viewer';

  const Icon = report.icon;

  // Determine access level
  const hasFullAccess = isSuperAdmin || (isFinance && report.layer === 'financial') || (isOpsAdmin && report.layer === 'operational');
  const hasViewOnly = isViewer;

  return (
    <Link
      to={createPageUrl('ReportDetail', `?id=${report.id}`)}
      className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-slate-900">{report.name}</h3>
          <ReportLayerBadge layer={report.layer} />
          {report.requiresSnapshot && (
            <Lock className="w-3 h-3 text-slate-400" title="Snapshot-based" />
          )}
        </div>
        <p className="text-xs text-slate-500">{report.description}</p>
      </div>

      {/* Action */}
      <div className="flex items-center gap-2">
        {hasViewOnly && (
          <span className="text-xs text-slate-400">View Only</span>
        )}
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
      </div>
    </Link>
  );
}