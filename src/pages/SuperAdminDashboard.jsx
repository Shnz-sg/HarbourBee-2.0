import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import GlobalStatusHeader from "../components/superadmin/GlobalStatusHeader";
import CriticalAlertsZone from "../components/superadmin/CriticalAlertsZone";
import TodaysPulse from "../components/superadmin/TodaysPulse";
import LiveOperations from "../components/superadmin/LiveOperations";
import CommercialSnapshot from "../components/superadmin/CommercialSnapshot";
import SystemHealthCard from "../components/superadmin/SystemHealthCard";
import FooterUtilities from "../components/superadmin/FooterUtilities";
import SkeletonRows from "../components/shared/SkeletonRows";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuperAdminDashboard() {
  const [user, setUser] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: orders = [], isLoading: lo, refetch: ro } = useQuery({
    queryKey: ["sa-orders"],
    queryFn: () => base44.entities.Order.list("-created_date", 200),
  });

  const { data: pools = [], isLoading: lp, refetch: rp } = useQuery({
    queryKey: ["sa-pools"],
    queryFn: () => base44.entities.Pool.list("-created_date", 100),
  });

  const { data: deliveries = [], isLoading: ld, refetch: rd } = useQuery({
    queryKey: ["sa-deliveries"],
    queryFn: () => base44.entities.Delivery.list("-created_date", 100),
  });

  const { data: exceptions = [], isLoading: le, refetch: re } = useQuery({
    queryKey: ["sa-exceptions"],
    queryFn: () => base44.entities.Exception.list("-created_date", 50),
  });

  const { data: vendors = [], isLoading: lv, refetch: rv } = useQuery({
    queryKey: ["sa-vendors"],
    queryFn: () => base44.entities.Vendor.list("name", 100),
  });

  const { data: notifications = [], isLoading: ln, refetch: rn } = useQuery({
    queryKey: ["sa-notifications"],
    queryFn: () => base44.entities.Notification.list("-created_date", 50),
  });

  const isLoading = lo || lp || ld || le || lv || ln;

  const handleRefresh = () => {
    ro(); rp(); rd(); re(); rv(); rn();
    setLastRefreshed(new Date());
  };

  // Calculate metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const criticalAlerts = exceptions.filter(e => e.severity === "critical" && e.status === "open");
  const notificationCount = notifications.filter(n => !n.is_read).length;

  const ordersToday = orders.filter(o => {
    const created = new Date(o.created_date);
    return created >= today;
  }).length;

  const activePools = pools.filter(p => p.status === "open").length;

  const deliveriesDue = deliveries.filter(d => {
    if (!d.scheduled_date) return false;
    const scheduled = new Date(d.scheduled_date);
    scheduled.setHours(0, 0, 0, 0);
    return scheduled <= today && !["delivered", "cancelled"].includes(d.status);
  }).length;

  const exceptionsToday = exceptions.filter(e => {
    const created = new Date(e.created_date);
    return created >= today;
  }).length;

  const activeVendors = vendors.filter(v => v.status === "active").length;

  const ordersInProgress = orders.filter(o => ["confirmed", "pooled", "in_delivery"].includes(o.status)).length;
  const ordersDelayed = 0; // Would need ETA logic
  const ordersCompleted = orders.filter(o => {
    if (o.status !== "delivered") return false;
    const updated = new Date(o.updated_date);
    return updated >= today;
  }).length;

  const poolsNearCutoff = pools.filter(p => {
    if (p.status !== "open" || !p.target_date) return false;
    const target = new Date(p.target_date);
    const diff = (target - new Date()) / (1000 * 60 * 60 * 24);
    return diff <= 1 && diff >= 0;
  }).length;

  const poolsFailed = 0;
  const poolsCompleted = pools.filter(p => {
    if (p.status !== "delivered") return false;
    const updated = new Date(p.updated_date);
    return updated >= today;
  }).length;

  const deliveriesScheduled = deliveries.filter(d => d.status === "scheduled").length;
  const deliveriesDelayed = deliveries.filter(d => d.status === "at_anchorage").length;
  const deliveriesCompleted = deliveries.filter(d => {
    if (d.status !== "delivered") return false;
    const delivered = new Date(d.delivered_at || d.updated_date);
    return delivered >= today;
  }).length;

  const vendorsWithIssues = 0; // Would need vendor exception logic
  const vendorsAwaitingAction = vendors.filter(v => v.status === "inactive").length;

  const todayGMV = orders.filter(o => {
    const created = new Date(o.created_date);
    return created >= today;
  }).reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const outstanding = orders.filter(o => o.payment_status === "unpaid").reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const refundsPending = orders.filter(o => o.refund_amount > 0).length;

  const platformStatus = criticalAlerts.length > 0 ? "critical" : exceptionsToday > 5 ? "degraded" : "normal";
  const systemHealth = {
    overall: criticalAlerts.length === 0 && exceptionsToday < 5 ? "healthy" : "review",
    warnings: exceptions.filter(e => e.severity === "high" && e.status === "open").length
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <GlobalStatusHeader
        platformStatus={platformStatus}
        criticalCount={criticalAlerts.length}
        notificationCount={notificationCount}
        user={user}
      />

      {isLoading ? (
        <div className="p-6"><SkeletonRows rows={6} cols={4} /></div>
      ) : (
        <>
          <CriticalAlertsZone alerts={criticalAlerts} />

          <TodaysPulse
            metrics={{
              ordersToday,
              activePools,
              deliveriesDue,
              exceptionsToday,
              activeVendors,
              ordersTrend: "up",
              deliveriesTrend: "neutral",
              exceptionsTrend: "down"
            }}
          />

          <LiveOperations
            operations={{
              ordersInProgress,
              ordersDelayed,
              ordersCompleted,
              poolsNearCutoff,
              poolsFailed,
              poolsCompleted,
              deliveriesScheduled,
              deliveriesDelayed,
              deliveriesCompleted
            }}
          />

          <CommercialSnapshot
            vendors={{
              active: activeVendors,
              withIssues: vendorsWithIssues,
              awaitingAction: vendorsAwaitingAction
            }}
            financial={{
              todayGMV,
              outstanding,
              refundsPending
            }}
          />

          <SystemHealthCard health={systemHealth} />

          <FooterUtilities lastRefreshed={lastRefreshed} />
        </>
      )}

      {/* Floating Refresh Button */}
      <Button
        onClick={handleRefresh}
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg bg-slate-900 hover:bg-slate-800"
      >
        <RefreshCw className="w-5 h-5" />
      </Button>
    </div>
  );
}