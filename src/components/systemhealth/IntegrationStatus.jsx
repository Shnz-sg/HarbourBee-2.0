import React from "react";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export default function IntegrationStatus({ integrations }) {
  const statusConfig = {
    operational: { icon: CheckCircle, color: "text-green-600", label: "Operational" },
    delayed: { icon: AlertCircle, color: "text-amber-600", label: "Delayed" },
    unavailable: { icon: XCircle, color: "text-red-600", label: "Unavailable" }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg mb-6">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Integration & Dependency Status</h2>
        <p className="text-xs text-slate-500 mt-1">External services and dependencies</p>
      </div>
      <div className="divide-y divide-slate-100">
        {integrations.map((integration) => {
          const config = statusConfig[integration.status] || statusConfig.operational;
          const Icon = config.icon;

          return (
            <div key={integration.id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${config.color}`} />
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{integration.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{integration.description}</p>
                </div>
              </div>
              <span className={`text-xs font-medium ${config.color}`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}