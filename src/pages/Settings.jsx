import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageHeader from "../components/shared/PageHeader";
import SettingsNav from "../components/settings/SettingsNav";
import SettingsSection from "../components/settings/SettingsSection";
import SettingItem from "../components/settings/SettingItem";
import ConfirmChangesDialog from "../components/settings/ConfirmChangesDialog";
import RestrictedAccess from "../components/settings/RestrictedAccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Save, X, Upload } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [userPreferences, setUserPreferences] = useState({});
  const [platformSettings, setPlatformSettings] = useState({});
  const [originalUserPrefs, setOriginalUserPrefs] = useState({});
  const [originalPlatformSettings, setOriginalPlatformSettings] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [profileData, setProfileData] = useState({ full_name: "", contact_number: "" });
  
  const queryClient = useQueryClient();

  // Fetch user data
  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setProfileData({ 
        full_name: u.full_name || "", 
        contact_number: u.contact_number || "" 
      });
      
      // Initialize user preferences
      const prefs = u.preferences || {};
      const defaultPrefs = {
        ui_density: prefs.ui_density || "comfortable",
        default_page: prefs.default_page || "Dashboard",
        timezone: prefs.timezone || "UTC",
        date_format: prefs.date_format || "DD/MM/YYYY",
        language: prefs.language || "en",
        notification_delivery: prefs.notification_delivery || "both",
        email_notifications: prefs.email_notifications !== undefined ? prefs.email_notifications : true,
        order_status_updates: prefs.order_status_updates !== undefined ? prefs.order_status_updates : true,
        exception_alerts: prefs.exception_alerts || "critical"
      };
      setUserPreferences(defaultPrefs);
      setOriginalUserPrefs(defaultPrefs);

      // Set initial section based on role
      if (u.role === "vendor") {
        setActiveSection("profile");
      }
    }).catch(() => {});
  }, []);

  // Fetch platform settings (AppSettings entity)
  const { data: appSettings = [] } = useQuery({
    queryKey: ['appSettings'],
    queryFn: () => base44.entities.AppSettings.list(),
    enabled: !!user && ['admin', 'super_admin'].includes(user.role)
  });

  // Initialize platform settings from AppSettings entity
  useEffect(() => {
    if (appSettings.length > 0) {
      const settingsMap = {};
      appSettings.forEach(setting => {
        settingsMap[setting.key] = parseSettingValue(setting.value, setting.value_type);
      });
      setPlatformSettings(settingsMap);
      setOriginalPlatformSettings(settingsMap);
    } else if (user && ['admin', 'super_admin'].includes(user.role)) {
      // Initialize with defaults if no settings exist
      const defaults = {
        // Platform
        maintenanceMode: false,
        dataRetention: "90",
        // Operations
        autoPooling: true,
        poolingThreshold: "24",
        deliveryNotifications: true,
        // Vendors
        autoVendorAssignment: false,
        vendorRatingSystem: "enabled",
        // Finance
        settlementFrequency: "weekly",
        autoRefunds: false,
        // Integrations
        stripeEnabled: true,
        emailProvider: "system",
        // Security
        enforce2FA: false,
        sessionTimeout: "30",
        passwordComplexity: "medium",
        // Reporting
        defaultReportingPeriod: "30",
        fiscalYearStart: "01"
      };
      setPlatformSettings(defaults);
      setOriginalPlatformSettings(defaults);
    }
  }, [appSettings, user]);

  const parseSettingValue = (value, type) => {
    if (type === "boolean") return value === "true";
    if (type === "number") return parseFloat(value);
    if (type === "json") return JSON.parse(value);
    return value;
  };

  const userRole = user?.role || "user";

  const getVisibleSections = () => {
    const sections = ["profile"];
    if (userRole === "vendor") return [...sections, "vendors"];
    if (userRole === "ops_admin") return [...sections, "operations", "vendors", "users"];
    if (["admin", "super_admin"].includes(userRole)) {
      return [...sections, "platform", "operations", "vendors", "users", "finance", "integrations", "security", "reporting", "system"];
    }
    return sections;
  };

  const getSubtitle = () => {
    if (["admin", "super_admin"].includes(userRole)) return "Platform configuration and personal settings";
    if (userRole === "ops_admin") return "Operational settings and preferences";
    if (userRole === "vendor") return "Vendor settings and preferences";
    return "Your personal preferences";
  };

  const handleUserPrefChange = (key, value) => {
    setUserPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handlePlatformSettingChange = (key, value) => {
    setPlatformSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key, value) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
  };

  const getUserPrefChanges = () => {
    const changes = [];
    Object.keys(userPreferences).forEach(key => {
      if (userPreferences[key] !== originalUserPrefs[key]) {
        changes.push({
          setting: formatSettingName(key),
          oldValue: String(originalUserPrefs[key]),
          newValue: String(userPreferences[key])
        });
      }
    });
    return changes;
  };

  const getPlatformSettingChanges = () => {
    const changes = [];
    Object.keys(platformSettings).forEach(key => {
      if (platformSettings[key] !== originalPlatformSettings[key]) {
        changes.push({
          setting: formatSettingName(key),
          oldValue: String(originalPlatformSettings[key]),
          newValue: String(platformSettings[key])
        });
      }
    });
    return changes;
  };

  const getProfileChanges = () => {
    const changes = [];
    if (profileData.full_name !== user?.full_name) {
      changes.push({
        setting: "Full Name",
        oldValue: user?.full_name || "",
        newValue: profileData.full_name
      });
    }
    if (profileData.contact_number !== (user?.contact_number || "")) {
      changes.push({
        setting: "Contact Number",
        oldValue: user?.contact_number || "",
        newValue: profileData.contact_number
      });
    }
    return changes;
  };

  const getAllChanges = () => {
    return [...getUserPrefChanges(), ...getPlatformSettingChanges(), ...getProfileChanges()];
  };

  const formatSettingName = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const hasChanges = getAllChanges().length > 0;

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.auth.updateMe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user']);
      toast.success("Settings saved successfully");
    }
  });

  const updateAppSettingsMutation = useMutation({
    mutationFn: async (settings) => {
      const promises = [];
      for (const [key, value] of Object.entries(settings)) {
        if (settings[key] !== originalPlatformSettings[key]) {
          // Find existing setting or create new
          const existing = appSettings.find(s => s.key === key);
          const settingData = {
            category: getCategoryForKey(key),
            key,
            value: String(value),
            value_type: typeof value === "boolean" ? "boolean" : typeof value === "number" ? "number" : "string",
            updated_by: user.email
          };
          
          if (existing) {
            promises.push(base44.entities.AppSettings.update(existing.id, settingData));
          } else {
            promises.push(base44.entities.AppSettings.create(settingData));
          }
          
          // Create audit history
          if (existing) {
            promises.push(base44.entities.AppSettingsHistory.create({
              setting_key: key,
              category: getCategoryForKey(key),
              old_value: String(existing.value),
              new_value: String(value),
              changed_by: user.email,
              changed_at: new Date().toISOString()
            }));
          }
        }
      }
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appSettings']);
      toast.success("Platform settings updated");
    }
  });

  const getCategoryForKey = (key) => {
    const categoryMap = {
      maintenanceMode: "platform",
      dataRetention: "platform",
      autoPooling: "operations",
      poolingThreshold: "operations",
      deliveryNotifications: "operations",
      autoVendorAssignment: "vendors",
      vendorRatingSystem: "vendors",
      settlementFrequency: "finance",
      autoRefunds: "finance",
      stripeEnabled: "integrations",
      emailProvider: "integrations",
      enforce2FA: "security",
      sessionTimeout: "security",
      passwordComplexity: "security",
      defaultReportingPeriod: "reporting",
      fiscalYearStart: "reporting"
    };
    return categoryMap[key] || "system";
  };

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    // Save user preferences
    if (getUserPrefChanges().length > 0 || getProfileChanges().length > 0) {
      const updateData = { 
        preferences: userPreferences,
        full_name: profileData.full_name,
        contact_number: profileData.contact_number
      };
      await updateUserMutation.mutateAsync(updateData);
      setOriginalUserPrefs(userPreferences);
      setUser(prev => ({ ...prev, ...updateData }));
    }

    // Save platform settings
    if (getPlatformSettingChanges().length > 0) {
      await updateAppSettingsMutation.mutateAsync(platformSettings);
      setOriginalPlatformSettings(platformSettings);
    }

    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setUserPreferences(originalUserPrefs);
    setPlatformSettings(originalPlatformSettings);
    setProfileData({ 
      full_name: user?.full_name || "", 
      contact_number: user?.contact_number || "" 
    });
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const visibleSections = getVisibleSections();
  const canEditPlatformSettings = ['admin', 'super_admin'].includes(userRole);
  const canEditOperations = ['ops_admin', 'admin', 'super_admin'].includes(userRole);

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <>
            <SettingsSection
              title="Identity"
              description="Your account information and profile"
              showAudit={false}
            >
              <div className="py-4 space-y-4">
                <div>
                  <Label className="text-xs text-slate-500 font-medium">Full Name</Label>
                  <Input 
                    value={profileData.full_name} 
                    onChange={(e) => handleProfileChange("full_name", e.target.value)}
                    className="mt-1.5 h-9 text-sm" 
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500 font-medium">Email</Label>
                  <Input value={user?.email || ""} disabled className="mt-1.5 h-9 text-sm bg-slate-50" />
                  <p className="text-xs text-slate-400 mt-1">Email changes require verification</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500 font-medium">Contact Number</Label>
                  <Input 
                    value={profileData.contact_number} 
                    onChange={(e) => handleProfileChange("contact_number", e.target.value)}
                    className="mt-1.5 h-9 text-sm" 
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label className="text-xs text-slate-500 font-medium">Role</Label>
                  <Input value={user?.role || "user"} disabled className="mt-1.5 h-9 text-sm bg-slate-50 capitalize" />
                  <p className="text-xs text-slate-400 mt-1">Contact admin to change your role</p>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Authentication & Security"
              description="Manage your password and security settings"
              showAudit={false}
            >
              <div className="py-4 space-y-3">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Change Password
                </Button>
                <p className="text-xs text-slate-500">Two-factor authentication coming soon</p>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Personal Preferences"
              description="Customize your experience"
              showAudit={false}
            >
              <SettingItem
                name="UI Density"
                description="Control the spacing and layout density"
                type="select"
                value={userPreferences.ui_density}
                onChange={(v) => handleUserPrefChange("ui_density", v)}
                options={[
                  { value: "compact", label: "Compact" },
                  { value: "comfortable", label: "Comfortable" }
                ]}
                isChanged={userPreferences.ui_density !== originalUserPrefs.ui_density}
              />
              <SettingItem
                name="Default Landing Page"
                description="Page to show when you log in"
                type="select"
                value={userPreferences.default_page}
                onChange={(v) => handleUserPrefChange("default_page", v)}
                options={[
                  { value: "Dashboard", label: "Dashboard" },
                  { value: "Orders", label: "Orders" },
                  { value: "Pools", label: "Pools" },
                  { value: "Deliveries", label: "Deliveries" }
                ]}
                isChanged={userPreferences.default_page !== originalUserPrefs.default_page}
              />
              <SettingItem
                name="Timezone"
                description="Your preferred timezone for dates"
                type="select"
                value={userPreferences.timezone}
                onChange={(v) => handleUserPrefChange("timezone", v)}
                options={[
                  { value: "UTC", label: "UTC" },
                  { value: "America/New_York", label: "Eastern Time" },
                  { value: "Europe/London", label: "London" },
                  { value: "Asia/Singapore", label: "Singapore" }
                ]}
                isChanged={userPreferences.timezone !== originalUserPrefs.timezone}
              />
              <SettingItem
                name="Date Format"
                description="How dates are displayed"
                type="select"
                value={userPreferences.date_format}
                onChange={(v) => handleUserPrefChange("date_format", v)}
                options={[
                  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" }
                ]}
                isChanged={userPreferences.date_format !== originalUserPrefs.date_format}
              />
              <SettingItem
                name="Notification Delivery"
                description="How you receive notifications"
                type="select"
                value={userPreferences.notification_delivery}
                onChange={(v) => handleUserPrefChange("notification_delivery", v)}
                options={[
                  { value: "email", label: "Email Only" },
                  { value: "in_app", label: "In-App Only" },
                  { value: "both", label: "Both" }
                ]}
                isChanged={userPreferences.notification_delivery !== originalUserPrefs.notification_delivery}
              />
              <SettingItem
                name="Email Notifications"
                description="Receive updates via email"
                type="toggle"
                value={userPreferences.email_notifications}
                onChange={(v) => handleUserPrefChange("email_notifications", v)}
                isChanged={userPreferences.email_notifications !== originalUserPrefs.email_notifications}
              />
              <SettingItem
                name="Order Status Updates"
                description="Notify on order status changes"
                type="toggle"
                value={userPreferences.order_status_updates}
                onChange={(v) => handleUserPrefChange("order_status_updates", v)}
                isChanged={userPreferences.order_status_updates !== originalUserPrefs.order_status_updates}
              />
              <SettingItem
                name="Exception Alerts"
                description="Priority level for exception notifications"
                type="select"
                value={userPreferences.exception_alerts}
                onChange={(v) => handleUserPrefChange("exception_alerts", v)}
                options={[
                  { value: "all", label: "All exceptions" },
                  { value: "high", label: "High & Critical only" },
                  { value: "critical", label: "Critical only" }
                ]}
                isChanged={userPreferences.exception_alerts !== originalUserPrefs.exception_alerts}
              />
            </SettingsSection>
          </>
        );

      case "platform":
        if (!["admin", "super_admin"].includes(userRole)) {
          return <RestrictedAccess message="Platform configuration is restricted to Super Admin users." />;
        }
        return (
          <SettingsSection
            title="Platform Configuration"
            description="Core platform behavior and defaults"
            lastUpdated={new Date()}
            lastUpdatedBy="System"
          >
            <SettingItem
              name="Maintenance Mode"
              description="Temporarily disable platform access for maintenance"
              type="toggle"
              value={platformSettings.maintenanceMode}
              onChange={(v) => handlePlatformSettingChange("maintenanceMode", v)}
              isChanged={platformSettings.maintenanceMode !== originalPlatformSettings.maintenanceMode}
            />
            <SettingItem
              name="Data Retention"
              description="Number of days to retain completed order data"
              type="select"
              value={platformSettings.dataRetention}
              onChange={(v) => handlePlatformSettingChange("dataRetention", v)}
              options={[
                { value: "30", label: "30 days" },
                { value: "90", label: "90 days" },
                { value: "180", label: "180 days" },
                { value: "365", label: "1 year" }
              ]}
              isChanged={platformSettings.dataRetention !== originalPlatformSettings.dataRetention}
            />
          </SettingsSection>
        );

      case "operations":
        return (
          <SettingsSection
            title="Order & Pooling"
            description="Configure automated pooling and delivery workflows"
            lastUpdated={new Date(Date.now() - 86400000 * 2)}
            lastUpdatedBy="Ops Admin"
          >
            <SettingItem
              name="Automatic Pooling"
              description="Automatically group orders by port and delivery date"
              type="toggle"
              value={platformSettings.autoPooling}
              onChange={(v) => handlePlatformSettingChange("autoPooling", v)}
              isChanged={platformSettings.autoPooling !== originalPlatformSettings.autoPooling}
              disabled={!canEditOperations}
            />
            <SettingItem
              name="Pooling Time Threshold"
              description="Maximum hours before delivery to create pool"
              type="select"
              value={platformSettings.poolingThreshold}
              onChange={(v) => handlePlatformSettingChange("poolingThreshold", v)}
              options={[
                { value: "12", label: "12 hours" },
                { value: "24", label: "24 hours" },
                { value: "48", label: "48 hours" }
              ]}
              isChanged={platformSettings.poolingThreshold !== originalPlatformSettings.poolingThreshold}
              disabled={!canEditOperations}
            />
            <SettingItem
              name="Delivery Notifications"
              description="Send notifications for delivery status updates"
              type="toggle"
              value={platformSettings.deliveryNotifications}
              onChange={(v) => handlePlatformSettingChange("deliveryNotifications", v)}
              isChanged={platformSettings.deliveryNotifications !== originalPlatformSettings.deliveryNotifications}
              disabled={!canEditOperations}
            />
          </SettingsSection>
        );

      case "vendors":
        return (
          <SettingsSection
            title="Vendor Management"
            description="Configure vendor workflows and assignments"
            lastUpdated={new Date(Date.now() - 86400000 * 5)}
            lastUpdatedBy="Super Admin"
          >
            <SettingItem
              name="Automatic Vendor Assignment"
              description="Auto-assign products to preferred vendors"
              type="toggle"
              value={platformSettings.autoVendorAssignment}
              onChange={(v) => handlePlatformSettingChange("autoVendorAssignment", v)}
              isChanged={platformSettings.autoVendorAssignment !== originalPlatformSettings.autoVendorAssignment}
              disabled={!canEditPlatformSettings}
            />
            <SettingItem
              name="Vendor Rating System"
              description="Enable performance ratings for vendors"
              type="select"
              value={platformSettings.vendorRatingSystem}
              onChange={(v) => handlePlatformSettingChange("vendorRatingSystem", v)}
              options={[
                { value: "enabled", label: "Enabled" },
                { value: "disabled", label: "Disabled" }
              ]}
              isChanged={platformSettings.vendorRatingSystem !== originalPlatformSettings.vendorRatingSystem}
              disabled={!canEditPlatformSettings}
            />
          </SettingsSection>
        );

      case "users":
        if (userRole === "vendor") {
          return <RestrictedAccess message="User management is not available for vendor accounts." />;
        }
        return (
          <SettingsSection
            title="Users & Access"
            description="User management and access control settings"
            lastUpdated={new Date(Date.now() - 86400000 * 10)}
            lastUpdatedBy="Super Admin"
          >
            <div className="py-4">
              <p className="text-sm text-slate-600">
                User management is handled through the Users & Vessels page. 
                Contact your platform administrator to modify user access levels.
              </p>
            </div>
          </SettingsSection>
        );

      case "finance":
        if (!["admin", "super_admin"].includes(userRole)) {
          return <RestrictedAccess message="Finance settings are restricted to administrators." />;
        }
        return (
          <SettingsSection
            title="Finance & Settlements"
            description="Configure payment and settlement workflows"
            lastUpdated={new Date(Date.now() - 86400000 * 7)}
            lastUpdatedBy="Finance Admin"
          >
            <SettingItem
              name="Settlement Frequency"
              description="How often to process vendor settlements"
              type="select"
              value={platformSettings.settlementFrequency}
              onChange={(v) => handlePlatformSettingChange("settlementFrequency", v)}
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "biweekly", label: "Bi-weekly" },
                { value: "monthly", label: "Monthly" }
              ]}
              isChanged={platformSettings.settlementFrequency !== originalPlatformSettings.settlementFrequency}
            />
            <SettingItem
              name="Automatic Refunds"
              description="Process refunds automatically when orders are cancelled"
              type="toggle"
              value={platformSettings.autoRefunds}
              onChange={(v) => handlePlatformSettingChange("autoRefunds", v)}
              isChanged={platformSettings.autoRefunds !== originalPlatformSettings.autoRefunds}
            />
          </SettingsSection>
        );

      case "integrations":
        if (!["admin", "super_admin"].includes(userRole)) {
          return <RestrictedAccess message="Integration settings are restricted to Super Admin users." />;
        }
        return (
          <SettingsSection
            title="External Integrations"
            description="Configure third-party services and data connections"
            lastUpdated={new Date()}
            lastUpdatedBy="Super Admin"
          >
            <SettingItem
              name="Stripe Payments"
              description="Enable Stripe payment processing"
              type="toggle"
              value={platformSettings.stripeEnabled}
              onChange={(v) => handlePlatformSettingChange("stripeEnabled", v)}
              isChanged={platformSettings.stripeEnabled !== originalPlatformSettings.stripeEnabled}
            />
            <SettingItem
              name="Email Provider"
              description="Email service for notifications"
              type="select"
              value={platformSettings.emailProvider}
              onChange={(v) => handlePlatformSettingChange("emailProvider", v)}
              options={[
                { value: "system", label: "System Default" },
                { value: "sendgrid", label: "SendGrid" },
                { value: "smtp", label: "Custom SMTP" }
              ]}
              isChanged={platformSettings.emailProvider !== originalPlatformSettings.emailProvider}
            />
            <div className="py-4">
              <p className="text-xs text-slate-500">
                API keys and credentials are managed separately in environment configuration.
              </p>
            </div>
          </SettingsSection>
        );

      case "security":
        if (!["admin", "super_admin"].includes(userRole)) {
          return <RestrictedAccess message="Security settings are restricted to Super Admin users." />;
        }
        return (
          <SettingsSection
            title="Platform Security"
            description="Control platform-level protection and enforcement"
            lastUpdated={new Date()}
            lastUpdatedBy="Super Admin"
          >
            <SettingItem
              name="Enforce 2FA for Admins"
              description="Require two-factor authentication for all admin users"
              type="toggle"
              value={platformSettings.enforce2FA}
              onChange={(v) => handlePlatformSettingChange("enforce2FA", v)}
              isChanged={platformSettings.enforce2FA !== originalPlatformSettings.enforce2FA}
            />
            <SettingItem
              name="Session Timeout"
              description="Auto-logout after inactivity (minutes)"
              type="select"
              value={platformSettings.sessionTimeout}
              onChange={(v) => handlePlatformSettingChange("sessionTimeout", v)}
              options={[
                { value: "15", label: "15 minutes" },
                { value: "30", label: "30 minutes" },
                { value: "60", label: "1 hour" },
                { value: "120", label: "2 hours" }
              ]}
              isChanged={platformSettings.sessionTimeout !== originalPlatformSettings.sessionTimeout}
            />
            <SettingItem
              name="Password Complexity"
              description="Required password strength level"
              type="select"
              value={platformSettings.passwordComplexity}
              onChange={(v) => handlePlatformSettingChange("passwordComplexity", v)}
              options={[
                { value: "low", label: "Low (8+ characters)" },
                { value: "medium", label: "Medium (8+ chars, mixed case)" },
                { value: "high", label: "High (10+ chars, mixed, numbers, symbols)" }
              ]}
              isChanged={platformSettings.passwordComplexity !== originalPlatformSettings.passwordComplexity}
            />
          </SettingsSection>
        );

      case "reporting":
        if (!["admin", "super_admin"].includes(userRole)) {
          return <RestrictedAccess message="Reporting settings are restricted to administrators." />;
        }
        return (
          <SettingsSection
            title="Reports Configuration"
            description="Control how reports behave platform-wide"
            lastUpdated={new Date()}
            lastUpdatedBy="Super Admin"
          >
            <SettingItem
              name="Default Reporting Period"
              description="Default timeframe for report generation (days)"
              type="select"
              value={platformSettings.defaultReportingPeriod}
              onChange={(v) => handlePlatformSettingChange("defaultReportingPeriod", v)}
              options={[
                { value: "7", label: "Last 7 days" },
                { value: "30", label: "Last 30 days" },
                { value: "90", label: "Last 90 days" }
              ]}
              isChanged={platformSettings.defaultReportingPeriod !== originalPlatformSettings.defaultReportingPeriod}
            />
            <SettingItem
              name="Fiscal Year Start"
              description="Month when fiscal year begins (1-12)"
              type="select"
              value={platformSettings.fiscalYearStart}
              onChange={(v) => handlePlatformSettingChange("fiscalYearStart", v)}
              options={Array.from({length: 12}, (_, i) => ({ 
                value: String(i + 1).padStart(2, '0'), 
                label: new Date(2000, i).toLocaleString('default', { month: 'long' })
              }))}
              isChanged={platformSettings.fiscalYearStart !== originalPlatformSettings.fiscalYearStart}
            />
          </SettingsSection>
        );

      case "system":
        if (!["admin", "super_admin"].includes(userRole)) {
          return <RestrictedAccess message="System settings are restricted to Super Admin users." />;
        }
        return (
          <SettingsSection
            title="System Information"
            description="Platform version and system details"
            showAudit={false}
          >
            <div className="py-4 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Platform Version</span>
                <span className="font-medium text-slate-900">2.0.1</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Environment</span>
                <span className="font-medium text-slate-900">Production</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Last System Update</span>
                <span className="font-medium text-slate-900">Feb 19, 2026</span>
              </div>
            </div>
          </SettingsSection>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle={getSubtitle()}>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
              className="h-8 text-xs"
            >
              <X className="w-3 h-3 mr-1.5" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              className="h-8 text-xs bg-sky-600 hover:bg-sky-700"
            >
              <Save className="w-3 h-3 mr-1.5" />
              Save Changes
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="flex gap-6">
        <SettingsNav 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          visibleSections={visibleSections}
        />

        <div className="flex-1 min-w-0">
          {renderSection()}

          {/* Session (Always visible at bottom) */}
          {activeSection === "profile" && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 mt-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Session</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="text-rose-600 border-rose-200 hover:bg-rose-50 h-8"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmChangesDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirmSave}
        changes={getAllChanges()}
      />
    </div>
  );
}