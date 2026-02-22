import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  FileText,
  Box,
  Store,
  Users,
  DollarSign,
  BarChart3,
  Bell,
  AlertTriangle,
  Activity,
  Settings,
  Menu,
  X,
  Anchor
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { hasPageAccess } from "../utils/accessControl";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" },
  { type: "divider", label: "Operations" },
  { name: "Orders", icon: Package, page: "Orders" },
  { name: "Pools", icon: Layers, page: "Pools" },
  { name: "Deliveries", icon: Truck, page: "Deliveries" },
  { name: "Vendor Orders", icon: FileText, page: "VendorOrders" },
  { type: "divider", label: "Catalogue" },
  { name: "Products", icon: Box, page: "Products" },
  { name: "Categories", icon: Layers, page: "AdminCategories" },
  { name: "Vendors", icon: Store, page: "Vendors" },
  { type: "divider", label: "Admin" },
  { name: "Users & Vessels", icon: Users, page: "UsersVessels" },
  { name: "Finance", icon: DollarSign, page: "Finance" },
  { name: "Reports", icon: BarChart3, page: "Reports" },
  { type: "divider", label: "System" },
  { name: "Notifications", icon: Bell, page: "Notifications" },
  { name: "Exceptions", icon: AlertTriangle, page: "Exceptions" },
  { name: "System Health", icon: Activity, page: "SystemHealth" },
  { name: "Settings", icon: Settings, page: "Settings" },
];

export default function AdminLayout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user data with useQuery
  const { data: user, isLoading: loadingUser, isError: userError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const currentUser = await base44.auth.me();
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      return currentUser;
    },
    retry: false,
  });

  // Handle redirects based on user loading, error, or role
  useEffect(() => {
    if (!loadingUser) {
      if (userError || !user) {
        base44.auth.redirectToLogin();
      } else if (!hasPageAccess(user.role, currentPageName)) {
        navigate(createPageUrl('AccessDenied') + '?reason=role_mismatch');
      }
    }
  }, [loadingUser, user, userError, navigate, currentPageName]);

  // Fetch unread notification count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadNotificationCount", user?.id],
    queryFn: async () => {
      const filter = { is_read: false, archived_at: null };
      
      // Vessel-aware security for crew
      if (user?.role === 'crew') {
        const assignments = await base44.entities.UserVesselAssignment.filter({
          user_id: user.id,
          unassigned_at: null
        });
        if (assignments.length > 0) {
          filter.vessel_imo = assignments[0].vessel_imo;
        }
      }
      
      // Vendor-specific filtering
      if (user?.role === 'vendor' && user?.vendor_id) {
        filter.vendor_id = user.vendor_id;
      }
      
      const notifications = await base44.entities.Notification.filter(filter);
      return notifications.length;
    },
    enabled: !!user && hasPageAccess(user.role, 'Notifications'),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (loadingUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar — desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-slate-200 
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:flex-shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center px-4 border-b border-slate-100">
            <Link to="/admin/dashboard" className="flex items-center">
              <Anchor className="w-5 h-5 text-sky-600 mr-2" />
              <span className="font-semibold text-slate-900 text-sm tracking-tight">HarbourBee</span>
              <span className="text-[10px] text-slate-400 ml-1.5 font-medium">2.0</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-2 px-2">
            {NAV_ITEMS.map((item, i) => {
              if (item.type === "divider") {
                return (
                  <p key={i} className="text-[10px] uppercase tracking-wider text-slate-400 font-medium px-2 pt-4 pb-1">
                    {item.label}
                  </p>
                );
              }

              // Check if user has access to this page
              if (!hasPageAccess(user?.role, item.page)) {
                return null;
              }

              const isActive = currentPageName === item.page || 
                (currentPageName?.startsWith(item.page?.replace("s", "")) && !NAV_ITEMS.find(n => n.page === currentPageName));
              const Icon = item.icon;
              return (
                <Link
                  key={item.page}
                  to={`/admin/${item.page.toLowerCase()}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm mb-0.5 transition-colors
                    ${isActive
                      ? "bg-sky-50 text-sky-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User */}
          {user && (
            <div className="p-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                  {user.full_name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-700 truncate">{user.full_name || "User"}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.role || "user"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar — mobile/desktop */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 mr-3 lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/admin/dashboard" className="flex items-center lg:hidden">
            <Anchor className="w-4 h-4 text-sky-600 mr-1.5" />
            <span className="font-semibold text-slate-900 text-sm">HarbourBee</span>
          </Link>
          
          {/* Notification Bell */}
          <Link
            to="/admin/notifications"
            className="ml-auto relative p-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}