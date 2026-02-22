import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, DollarSign, Store, Ship } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "../components/shared/PageHeader";
import LoadingSkeleton from "../components/states/LoadingSkeleton";
import ErrorState from "../components/states/ErrorState";
import FinancialPerformanceReports from "../components/reports/FinancialPerformanceReports";
import VendorAnalyticsReports from "../components/reports/VendorAnalyticsReports";
import VesselAnalyticsReports from "../components/reports/VesselAnalyticsReports";

export default function Reports() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("financial");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Fetch financial ledger data
  const { data: ledger = [], isLoading: ledgerLoading } = useQuery({
    queryKey: ['finance-ledger-reports'],
    queryFn: () => base44.entities.FinanceLedger.list('-occurred_at', 1000),
    enabled: !!user && (user.role === 'finance' || user.role === 'super_admin' || user.role === 'ops_admin')
  });

  // Fetch vessels
  const { data: vessels = [], isLoading: vesselsLoading } = useQuery({
    queryKey: ['vessels-reports'],
    queryFn: () => base44.entities.Vessel.list(),
    enabled: !!user
  });

  // Fetch vendors
  const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ['vendors-reports'],
    queryFn: () => base44.entities.Vendor.list(),
    enabled: !!user
  });

  if (!user) return <LoadingSkeleton type="card" count={3} />;

  const hasFinanceAccess = user.role === 'finance' || user.role === 'super_admin';
  const hasOpsAccess = user.role === 'ops_admin' || user.role === 'super_admin';

  // Access control
  if (!hasFinanceAccess && !hasOpsAccess) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports" subtitle="Access restricted" icon={BarChart3} />
        <ErrorState message="You do not have permission to view reports" />
      </div>
    );
  }

  const isLoading = ledgerLoading || vesselsLoading || vendorsLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Strategic analytics and performance intelligence"
        icon={BarChart3}
      />

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="financial" className="gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Financial Performance</span>
              <span className="sm:hidden">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="vendor" className="gap-2">
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Vendor Analytics</span>
              <span className="sm:hidden">Vendors</span>
            </TabsTrigger>
            <TabsTrigger value="vessel" className="gap-2">
              <Ship className="w-4 h-4" />
              <span className="hidden sm:inline">Vessel Analytics</span>
              <span className="sm:hidden">Vessels</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-6">
            <FinancialPerformanceReports 
              ledger={ledger}
              vessels={vessels}
              vendors={vendors}
              hasFullAccess={hasFinanceAccess}
            />
          </TabsContent>

          <TabsContent value="vendor" className="space-y-6">
            <VendorAnalyticsReports
              ledger={ledger}
              vendors={vendors}
              hasFullAccess={hasFinanceAccess}
            />
          </TabsContent>

          <TabsContent value="vessel" className="space-y-6">
            <VesselAnalyticsReports
              ledger={ledger}
              vessels={vessels}
              hasFullAccess={hasFinanceAccess}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}