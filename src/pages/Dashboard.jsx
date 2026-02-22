import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import OnboardingGuard from "../components/shared/OnboardingGuard";
import DashboardVesselHeader from "../components/dashboard/DashboardVesselHeader";
import DashboardStatusCards from "../components/dashboard/DashboardStatusCards";
import DashboardPoolSnapshot from "../components/dashboard/DashboardPoolSnapshot";
import DashboardRecentOrders from "../components/dashboard/DashboardRecentOrders";
import DashboardActiveDeliveries from "../components/dashboard/DashboardActiveDeliveries";
import DashboardExceptionsFeed from "../components/dashboard/DashboardExceptionsFeed";
import DashboardActivityFeed from "../components/dashboard/DashboardActivityFeed";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";
import DashboardFinancialSnapshot from "../components/dashboard/DashboardFinancialSnapshot";
import DashboardOpsPanel from "../components/dashboard/DashboardOpsPanel";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [allVessels, setAllVessels] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      
      // Fetch vessel details
      if (u.vessel_id) {
        const vessels = await base44.entities.Vessel.filter({ id: u.vessel_id });
        if (vessels.length > 0) {
          setSelectedVessel(vessels[0]);
        }
      }

      // Fetch all vessels for ops selector
      if (['ops_staff', 'ops_admin', 'super_admin'].includes(u.role)) {
        const allVesselsData = await base44.entities.Vessel.list();
        setAllVessels(allVesselsData);
        
        // Set default vessel for ops if they don't have one assigned
        if (!u.vessel_id && allVesselsData.length > 0) {
          setSelectedVessel(allVesselsData[0]);
        }
      }
    }).catch(() => navigate(createPageUrl("Landing")));
  }, [navigate]);

  // Vendor redirect
  useEffect(() => {
    if (user?.role === 'vendor') {
      navigate(createPageUrl("VendorOrders"));
    }
  }, [user, navigate]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const vesselFilter = selectedVessel?.imo_number || selectedVessel?.vessel_id;

  // Fetch pools for selected vessel
  const { data: pools = [], isLoading: poolsLoading } = useQuery({
    queryKey: ['dashboard-pools', vesselFilter, lastUpdated],
    queryFn: () => base44.entities.Pool.filter({ status: 'open' }),
    enabled: !!vesselFilter
  });

  // Fetch orders for selected vessel
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['dashboard-orders', vesselFilter, lastUpdated],
    queryFn: () => {
      if (user?.role === 'user') {
        return base44.entities.Order.filter({ 
          created_by: user.email,
          status: { $in: ['submitted', 'confirmed', 'pooled', 'in_delivery'] }
        });
      }
      return base44.entities.Order.filter({ 
        vessel_imo: vesselFilter,
        status: { $in: ['submitted', 'confirmed', 'pooled', 'in_delivery'] }
      });
    },
    enabled: !!vesselFilter && !!user
  });

  // Fetch deliveries for selected vessel
  const { data: deliveries = [], isLoading: deliveriesLoading } = useQuery({
    queryKey: ['dashboard-deliveries', vesselFilter, lastUpdated],
    queryFn: () => base44.entities.Delivery.filter({ 
      vessel_name: selectedVessel?.name,
      status: { $in: ['scheduled', 'dispatched', 'in_transit', 'at_anchorage'] }
    }),
    enabled: !!selectedVessel?.name
  });

  // Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['dashboard-notifications', user?.email, lastUpdated],
    queryFn: () => {
      if (user?.role === 'user') {
        return base44.entities.Notification.filter({ 
          is_read: false,
          vessel_imo: vesselFilter
        });
      }
      return base44.entities.Notification.filter({ is_read: false });
    },
    enabled: !!user && !!vesselFilter
  });

  // Fetch exceptions
  const { data: exceptions = [], isLoading: exceptionsLoading } = useQuery({
    queryKey: ['dashboard-exceptions', vesselFilter, user?.role, lastUpdated],
    queryFn: () => {
      if (user?.role === 'user') {
        return base44.entities.Exception.filter({ 
          status: { $in: ['open', 'acknowledged'] },
          vessel_imo: vesselFilter,
          severity: { $in: ['high', 'critical'] }
        });
      }
      return base44.entities.Exception.filter({ 
        status: { $in: ['open', 'acknowledged'] },
        severity: { $in: ['high', 'critical'] }
      });
    },
    enabled: !!user && !!vesselFilter
  });

  // Fetch financial data for super admin
  const { data: financialData } = useQuery({
    queryKey: ['dashboard-financial', lastUpdated],
    queryFn: async () => {
      const allOrders = await base44.entities.Order.list();
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthOrders = allOrders.filter(o => new Date(o.created_date) >= monthStart);
      const revenue = monthOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const pendingSettlement = allOrders
        .filter(o => o.payment_status === 'paid' && o.status !== 'delivered')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const unpaidOrders = allOrders.filter(o => o.payment_status === 'unpaid').length;

      return { revenue, pendingSettlement, unpaidOrders };
    },
    enabled: user?.role === 'super_admin'
  });

  // Find active pool for this vessel
  const activePool = pools.find(p => 
    p.port === selectedVessel?.current_port || p.order_ids?.some(oid => orders.find(o => o.id === oid))
  );

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const handleVesselChange = (vessel) => {
    setSelectedVessel(vessel);
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const canSelectVessel = ['ops_staff', 'ops_admin', 'super_admin'].includes(user.role);

  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Vessel Context Header */}
        <DashboardVesselHeader 
          vessel={selectedVessel}
          user={user}
          allVessels={allVessels}
          canSelectVessel={canSelectVessel}
          onVesselChange={handleVesselChange}
        />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          {/* Last Updated + Refresh */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-slate-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-7 px-2">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Status Cards (Max 4) */}
          <DashboardStatusCards 
            poolCount={activePool ? 1 : 0}
            orderCount={orders.length}
            deliveryCount={deliveries.filter(d => d.status === 'in_transit' || d.status === 'dispatched').length}
            notificationCount={notifications.length}
            loading={poolsLoading || ordersLoading || deliveriesLoading || notificationsLoading}
          />

          {/* Quick Actions */}
          <DashboardQuickActions user={user} />

          {/* 3-Column Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pool Snapshot */}
              <DashboardPoolSnapshot 
                pool={activePool} 
                loading={poolsLoading}
              />

              {/* Recent Orders */}
              <DashboardRecentOrders 
                orders={orders.slice(0, 5)} 
                loading={ordersLoading}
              />

              {/* Activity Feed */}
              <DashboardActivityFeed 
                orders={orders}
                deliveries={deliveries}
                user={user}
                loading={ordersLoading || deliveriesLoading}
              />
            </div>

            {/* Right Column (1 col) */}
            <div className="space-y-6">
              {/* Active Deliveries */}
              <DashboardActiveDeliveries 
                deliveries={deliveries.filter(d => ['in_transit', 'dispatched', 'at_anchorage'].includes(d.status)).slice(0, 3)}
                loading={deliveriesLoading}
              />

              {/* Exceptions Feed */}
              <DashboardExceptionsFeed 
                exceptions={exceptions.slice(0, 3)}
                user={user}
                loading={exceptionsLoading}
              />

              {/* Ops Panel (for ops staff/admin) */}
              {['ops_staff', 'ops_admin'].includes(user.role) && (
                <DashboardOpsPanel 
                  pools={pools}
                  exceptions={exceptions}
                  deliveries={deliveries}
                />
              )}

              {/* Financial Snapshot (super admin only) */}
              {user.role === 'super_admin' && financialData && (
                <DashboardFinancialSnapshot data={financialData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </OnboardingGuard>
  );
}