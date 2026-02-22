import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import UserFilters from "../components/usersvessels/UserFilters";
import UserListItem from "../components/usersvessels/UserListItem";
import UsersEmptyState from "../components/usersvessels/UsersEmptyState";
import VesselFilters from "../components/usersvessels/VesselFilters";
import VesselListItem from "../components/usersvessels/VesselListItem";
import VesselsEmptyState from "../components/usersvessels/VesselsEmptyState";

export default function UsersVessels() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [userFilters, setUserFilters] = useState({
    search: "",
    role: "all",
    status: "active",
    vessel: "all"
  });
  const [vesselFilters, setVesselFilters] = useState({
    search: "",
    type: "all",
    status: "active",
    port: "all"
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: users = [], isLoading: loadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date', 500),
    enabled: !!user
  });

  const { data: vessels = [], isLoading: loadingVessels, refetch: refetchVessels } = useQuery({
    queryKey: ['vessels'],
    queryFn: () => base44.entities.Vessel.list('-created_date', 500),
    enabled: !!user
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['userVesselAssignments'],
    queryFn: () => base44.entities.UserVesselAssignment.list('-assigned_at', 1000),
    enabled: !!user
  });

  const userRole = user?.role || "user";
  const isOpsOrAdmin = ["ops_admin", "super_admin"].includes(userRole);

  // Access control: Only ops+ can access this page
  if (!user || !isOpsOrAdmin) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Access restricted to operations and admin users.</p>
      </div>
    );
  }

  // Enrich users with vessel assignments
  const usersWithVessels = users.map(u => {
    const userAssignments = assignments.filter(a => a.user_id === u.id && !a.unassigned_at);
    const primaryAssignment = userAssignments.find(a => a.is_primary);
    return {
      ...u,
      assignments: userAssignments,
      primaryVessel: primaryAssignment?.vessel_name || null,
      primaryVesselId: primaryAssignment?.vessel_id || null
    };
  });

  // Enrich vessels with crew count
  const vesselsWithCrew = vessels.map(v => {
    const crewAssignments = assignments.filter(a => a.vessel_id === v.id && !a.unassigned_at);
    return {
      ...v,
      assignedCrewCount: crewAssignments.length,
      activeOrdersCount: 0 // TODO: compute from orders
    };
  });

  // Filter users
  const filteredUsers = usersWithVessels.filter(u => {
    const matchesSearch = !userFilters.search || 
      u.full_name?.toLowerCase().includes(userFilters.search.toLowerCase()) ||
      u.email?.toLowerCase().includes(userFilters.search.toLowerCase());
    const matchesRole = userFilters.role === "all" || u.role === userFilters.role;
    const matchesStatus = userFilters.status === "all" || u.status === userFilters.status;
    const matchesVessel = userFilters.vessel === "all" || u.primaryVesselId === userFilters.vessel;
    return matchesSearch && matchesRole && matchesStatus && matchesVessel;
  });

  // Filter vessels
  const filteredVessels = vesselsWithCrew.filter(v => {
    const matchesSearch = !vesselFilters.search || 
      v.name?.toLowerCase().includes(vesselFilters.search.toLowerCase()) ||
      v.imo_number?.toLowerCase().includes(vesselFilters.search.toLowerCase());
    const matchesType = vesselFilters.type === "all" || v.vessel_type === vesselFilters.type;
    const matchesStatus = vesselFilters.status === "all" || v.status === vesselFilters.status;
    const matchesPort = vesselFilters.port === "all" || v.current_port === vesselFilters.port;
    return matchesSearch && matchesType && matchesStatus && matchesPort;
  });

  const hasUserFilters = userFilters.search || userFilters.role !== "all" || 
    userFilters.status !== "active" || userFilters.vessel !== "all";
  const hasVesselFilters = vesselFilters.search || vesselFilters.type !== "all" || 
    vesselFilters.status !== "active" || vesselFilters.port !== "all";

  const handleExportUsers = () => {
    const csv = [
      ["Name", "Email", "Role", "Status", "Primary Vessel", "Last Login"],
      ...filteredUsers.map(u => [
        u.full_name || "",
        u.email || "",
        u.role || "",
        u.status || "",
        u.primaryVessel || "—",
        u.last_login ? new Date(u.last_login).toLocaleDateString() : "Never"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportVessels = () => {
    const csv = [
      ["Name", "IMO", "Type", "Status", "Port", "Crew Count", "Active Orders"],
      ...filteredVessels.map(v => [
        v.name || "",
        v.imo_number || "",
        v.vessel_type || "",
        v.status || "",
        v.current_port || "",
        v.assignedCrewCount || 0,
        v.activeOrdersCount || 0
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vessels-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader 
        title="Users & Vessels" 
        subtitle="User management and vessel registry"
        onRefresh={activeTab === "users" ? refetchUsers : refetchVessels}
      >
        <div className="flex items-center gap-2">
          {userRole === "super_admin" && (
            <Button size="sm" className="h-8">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              {activeTab === "users" ? "Invite User" : "Add Vessel"}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8" 
            onClick={activeTab === "users" ? handleExportUsers : handleExportVessels}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export
          </Button>
        </div>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users">Users ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="vessels">Vessels ({filteredVessels.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <UserFilters
            filters={userFilters}
            onFilterChange={setUserFilters}
            vessels={vessels}
          />

          <div className="mt-4">
            {loadingUsers ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <UsersEmptyState hasFilters={hasUserFilters} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wide">
                  <div>User</div>
                  <div>Role</div>
                  <div>Primary Vessel</div>
                  <div>Status</div>
                  <div>Last Login</div>
                  <div></div>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredUsers.map(user => (
                    <UserListItem key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="vessels" className="mt-4">
          <VesselFilters
            filters={vesselFilters}
            onFilterChange={setVesselFilters}
            vessels={vessels}
          />

          <div className="mt-4">
            {loadingVessels ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredVessels.length === 0 ? (
              <VesselsEmptyState hasFilters={hasVesselFilters} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_80px_80px_40px] gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wide">
                  <div>Vessel</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Current Port</div>
                  <div>Flag</div>
                  <div>Crew</div>
                  <div>Orders</div>
                  <div></div>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredVessels.map(vessel => (
                    <VesselListItem key={vessel.id} vessel={vessel} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}