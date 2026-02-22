import React from "react";
import { 
  Package, Layers, Truck, FileText, Store, Users, Bell, AlertCircle, 
  CheckCircle, Clock, Server, Database, Lock, HardDrive, Cpu, 
  DollarSign, Mail, Cloud, ListChecks, RefreshCw, Activity, FileBarChart
} from "lucide-react";

export default function ComponentStatusGrid({ components, showDescription = false, showQueue = false }) {
  const iconMap = {
    // Core Infrastructure
    api: Server,
    database: Database,
    auth: Lock,
    storage: HardDrive,
    worker: Cpu,
    // Operational Modules
    orders: Package,
    pools: Layers,
    deliveries: Truck,
    vendor_orders: FileText,
    notifications: Bell,
    // External Integrations
    stripe: DollarSign,
    email: Mail,
    hosting: Cloud,
    // Background Jobs
    pool_finalization: ListChecks,
    refund_automation: RefreshCw,
    exception_triggers: Activity,
    reports: FileBarChart
  };

  const statusConfig = {
    operational: { color: "text-green-600", bg: "bg-green-50", label: "Operational" },
    degraded: { color: "text-amber-600", bg: "bg-amber-50", label: "Degraded" },
    down: { color: "text-red-600", bg: "bg-red-50", label: "Down" }
  };

  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {components.map((component) => {
        const Icon = iconMap[component.id] || CheckCircle;
        const config = statusConfig[component.status] || statusConfig.operational;

        return (
          <div
            key={component.id}
            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${config.color}`} />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                {config.label}
              </span>
            </div>
            
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              {component.name}
            </h3>
            
            {showDescription && component.description && (
              <p className="text-xs text-slate-500 mb-2 leading-relaxed">
                {component.description}
              </p>
            )}

            {showQueue && component.queueHealth && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs text-slate-500">Queue:</span>
                <span className={`text-xs font-medium ${component.backlog > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {component.queueHealth}
                </span>
                {component.backlog > 0 && (
                  <span className="text-xs text-slate-400">({component.backlog} pending)</span>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Checked {timeSince(component.lastChecked)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}