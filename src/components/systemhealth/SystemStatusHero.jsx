import React from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function SystemStatusHero({ status = "normal" }) {
  const statusConfig = {
    normal: {
      icon: CheckCircle,
      iconColor: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      label: "All Systems Operational",
      message: "HarbourBee is stable and safe for live maritime operations. All modules, integrations, and background processes are functioning normally."
    },
    degraded: {
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      label: "Partial Service Degradation",
      message: "Some non-critical components are experiencing reduced performance. Core vessel operations remain functional but monitoring is advised."
    },
    critical: {
      icon: XCircle,
      iconColor: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      label: "Critical System Issues",
      message: "Platform stability is compromised. Maritime operations may be impacted. Immediate attention required."
    }
  };

  const config = statusConfig[status] || statusConfig.normal;
  const Icon = config.icon;

  return (
    <div className={`border-2 ${config.border} ${config.bg} rounded-xl p-6 mb-6`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Icon className={`w-10 h-10 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-slate-900 mb-1.5">{config.label}</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">{config.message}</p>
        </div>
      </div>
    </div>
  );
}