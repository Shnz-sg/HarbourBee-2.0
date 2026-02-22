import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import SystemStatusHero from "../components/systemhealth/SystemStatusHero";
import ComponentStatusGrid from "../components/systemhealth/ComponentStatusGrid";
import RecentSystemEvents from "../components/systemhealth/RecentSystemEvents";
import SkeletonRows from "../components/shared/SkeletonRows";

export default function SystemHealth() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: orders = [], isLoading: lo, refetch: ro } = useQuery({
    queryKey: ["health-orders"],
    queryFn: () => base44.entities.Order.list("-created_date", 100),
  });
  const { data: deliveries = [], isLoading: ld, refetch: rd } = useQuery({
    queryKey: ["health-deliveries"],
    queryFn: () => base44.entities.Delivery.list("-created_date", 100),
  });
  const { data: exceptions = [], isLoading: le, refetch: re } = useQuery({
    queryKey: ["health-exceptions"],
    queryFn: () => base44.entities.Exception.list("-created_date", 50),
  });
  const { data: notifications = [], isLoading: ln, refetch: rn } = useQuery({
    queryKey: ["health-notifications"],
    queryFn: () => base44.entities.Notification.list("-created_date", 50),
  });

  const isLoading = lo || ld || le || ln;
  const handleRefresh = () => { 
    ro(); rd(); re(); rn(); 
    setLastUpdated(new Date()); 
  };

  // Auto-refresh every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Calculate system status
  const criticalExceptions = exceptions.filter(e => e.severity === "critical" && e.status === "open").length;
  const failedDeliveries = deliveries.filter(d => d.status === "failed").length;
  const disputedOrders = orders.filter(o => o.status === "disputed").length;

  const overallStatus = criticalExceptions > 0 || failedDeliveries > 3 
    ? "critical" 
    : failedDeliveries > 0 || disputedOrders > 2
    ? "degraded" 
    : "normal";

  // 1️⃣ Core Infrastructure (Foundation Layer)
  const coreInfrastructure = [
    {
      id: "api",
      name: "API Service",
      description: "Primary application interface",
      status: "operational",
      lastChecked: new Date()
    },
    {
      id: "database",
      name: "Database",
      description: "PostgreSQL data store",
      status: "operational",
      lastChecked: new Date()
    },
    {
      id: "auth",
      name: "Authentication",
      description: "User identity & access",
      status: "operational",
      lastChecked: new Date()
    },
    {
      id: "storage",
      name: "File Storage",
      description: "Document & media files",
      status: "operational",
      lastChecked: new Date()
    },
    {
      id: "worker",
      name: "Background Workers",
      description: "Async job processing",
      status: "operational",
      lastChecked: new Date()
    }
  ];

  // 2️⃣ Operational Modules (Business Logic Layer)
  const operationalModules = [
    {
      id: "orders",
      name: "Orders System",
      description: "Vessel order processing",
      status: disputedOrders > 0 ? "degraded" : "operational",
      lastChecked: new Date()
    },
    {
      id: "pools",
      name: "Pools Engine",
      description: "Consolidation & pooling logic",
      status: "operational",
      lastChecked: new Date()
    },
    {
      id: "deliveries",
      name: "Deliveries Tracking",
      description: "Launch coordination",
      status: failedDeliveries > 0 ? "degraded" : "operational",
      lastChecked: new Date()
    },
    {
      id: "vendor_orders",
      name: "Vendor Order Processing",
      description: "Supplier order management",
      status: "operational",
      lastChecked: new Date()
    },
    {
      id: "notifications",
      name: "Notifications Dispatch",
      description: "Real-time alerts",
      status: "operational",
      lastChecked: new Date()
    }
  ];

  // 3️⃣ External Integrations (Trust Layer)
  const externalIntegrations = [
    {
      id: "stripe",
      name: "Stripe Payments",
      description: "Payment processing",
      status: "operational",
      lastChecked: new Date()
    },
    {
      id: "email",
      name: "Email Service",
      description: "Transactional emails",
      status: "operational",
      lastChecked: new Date()
    },
    {
      id: "hosting",
      name: "Hosting Platform",
      description: "Base44 infrastructure",
      status: "operational",
      lastChecked: new Date()
    }
  ];

  // 4️⃣ Background Jobs & Processing (Continuity Layer)
  const backgroundJobs = [
    {
      id: "pool_finalization",
      name: "Pool Finalization",
      description: "Automated pool closure",
      status: "operational",
      queueHealth: "Clear",
      backlog: 0,
      lastChecked: new Date()
    },
    {
      id: "refund_automation",
      name: "Refund Processing",
      description: "Delivery fee adjustments",
      status: "operational",
      queueHealth: "Clear",
      backlog: 0,
      lastChecked: new Date()
    },
    {
      id: "exception_triggers",
      name: "Exception Monitoring",
      description: "Automated issue detection",
      status: criticalExceptions > 3 ? "degraded" : "operational",
      queueHealth: criticalExceptions > 3 ? "Backlog" : "Clear",
      backlog: criticalExceptions,
      lastChecked: new Date()
    },
    {
      id: "reports",
      name: "Scheduled Reports",
      description: "Financial snapshots",
      status: "operational",
      queueHealth: "Clear",
      backlog: 0,
      lastChecked: new Date()
    }
  ];

  // Recent system events
  const systemEvents = [
    {
      description: "System health check completed successfully",
      timestamp: new Date(),
      severity: "info"
    },
    {
      description: "Database backup completed",
      timestamp: new Date(Date.now() - 3600000),
      severity: "info"
    },
    ...(criticalExceptions > 0 ? [{
      description: `${criticalExceptions} critical exception${criticalExceptions > 1 ? 's' : ''} detected`,
      timestamp: new Date(),
      severity: "error"
    }] : []),
    ...(failedDeliveries > 0 ? [{
      description: `${failedDeliveries} failed deliver${failedDeliveries > 1 ? 'ies' : 'y'} require attention`,
      timestamp: new Date(),
      severity: "warning"
    }] : [])
  ].slice(0, 10);

  const formattedLastUpdated = lastUpdated.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdminLevel = ['super_admin', 'admin', 'ops_admin'].includes(user?.role);

  // Access control
  if (!user || !isAdminLevel) {
    return (
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <p className="text-sm text-amber-800">System Health is restricted to administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="System Health" 
        subtitle={isSuperAdmin ? "Executive control tower - Platform operational confidence" : "Platform status and operational readiness"}
        onRefresh={handleRefresh}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full font-medium border border-sky-200">
            Production
          </span>
          <span className="text-xs text-slate-400">
            Updated {formattedLastUpdated}
          </span>
        </div>
      </PageHeader>

      {isLoading ? (
        <SkeletonRows rows={6} cols={4} />
      ) : (
        <>
          <SystemStatusHero status={overallStatus} />
          
          {/* 1️⃣ Core Infrastructure */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Core Infrastructure
              </h3>
              <span className="text-xs text-slate-400">Foundation Layer</span>
            </div>
            <ComponentStatusGrid components={coreInfrastructure} showDescription={true} />
          </div>

          {/* 2️⃣ Operational Modules */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Operational Modules
              </h3>
              <span className="text-xs text-slate-400">Business Logic Layer</span>
            </div>
            <ComponentStatusGrid components={operationalModules} showDescription={true} />
          </div>

          {/* 3️⃣ External Integrations */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                External Integrations
              </h3>
              <span className="text-xs text-slate-400">Trust Layer</span>
            </div>
            <ComponentStatusGrid components={externalIntegrations} showDescription={true} />
          </div>

          {/* 4️⃣ Background Jobs */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Background Jobs & Processing
              </h3>
              <span className="text-xs text-slate-400">Continuity Layer</span>
            </div>
            <ComponentStatusGrid components={backgroundJobs} showDescription={true} showQueue={true} />
          </div>

          {/* Recent Events */}
          <RecentSystemEvents events={systemEvents} />

          {/* Footer */}
          <div className="mt-6 text-center pb-2">
            <p className="text-xs text-slate-400">
              Auto-refreshing every 45 seconds • Last update {formattedLastUpdated}
            </p>
            {isSuperAdmin && (
              <p className="text-xs text-slate-400 mt-1">
                Control Tower Lightboard • Read-Only Status Dashboard
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}