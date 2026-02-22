import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronRight, Store, MapPin, Phone, Mail, FileText, 
  TrendingUp, Star, AlertTriangle, CheckCircle, Calendar,
  CreditCard, Shield, Clock
} from "lucide-react";

export default function VendorDetail() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vendorId = params.get("id");

  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: () => base44.entities.Vendor.filter({ id: vendorId }),
    enabled: !!vendorId && !!user,
    select: (data) => data[0]
  });

  const userRole = user?.role || "user";
  const isOpsAdmin = ["ops_admin", "super_admin"].includes(userRole);
  const isFinanceOrSuperAdmin = ["finance", "super_admin"].includes(userRole);

  if (!user || userRole === "user") {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Access restricted to operations and admin users.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-16">
        <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Vendor not found</h3>
        <Link to={createPageUrl("Vendors")} className="text-sky-600 hover:underline">
          Back to Vendors
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const config = {
      active: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
      inactive: { color: "bg-slate-200 text-slate-600", icon: null },
      suspended: { color: "bg-rose-100 text-rose-700", icon: AlertTriangle },
      pending_review: { color: "bg-amber-100 text-amber-700", icon: Clock },
      draft: { color: "bg-slate-200 text-slate-600", icon: null }
    };
    const { color, icon: Icon } = config[status] || config.draft;
    return (
      <Badge className={`${color}`}>
        {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
        {status?.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
        <Link to={createPageUrl("Vendors")} className="hover:text-slate-900">
          Vendors
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-medium">{vendor.legal_name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{vendor.legal_name}</h1>
            {getStatusBadge(vendor.status)}
          </div>
          <p className="text-sm text-slate-500 font-mono">{vendor.vendor_id}</p>
          {vendor.trading_name && vendor.trading_name !== vendor.legal_name && (
            <p className="text-sm text-slate-600">Trading as: {vendor.trading_name}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="w-4 h-4" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Primary Port</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {vendor.primary_port || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Port Coverage</p>
                  <p className="text-sm">{vendor.port_coverage?.join(", ") || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Categories</p>
                  <p className="text-sm">{vendor.categories?.join(", ") || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Default Lead Time</p>
                  <p className="text-sm">{vendor.default_lead_time_days ? `${vendor.default_lead_time_days} days` : "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Primary Contact</p>
                <p className="text-sm font-medium">{vendor.primary_contact_name || "—"}</p>
                <div className="flex items-center gap-4 mt-1">
                  {vendor.primary_contact_email && (
                    <a href={`mailto:${vendor.primary_contact_email}`} className="text-sm text-sky-600 hover:underline flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {vendor.primary_contact_email}
                    </a>
                  )}
                  {vendor.primary_contact_phone && (
                    <span className="text-sm text-slate-600">{vendor.primary_contact_phone}</span>
                  )}
                </div>
              </div>
              {vendor.physical_address && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Address</p>
                  <p className="text-sm">{vendor.physical_address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          {isOpsAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{vendor.total_orders_completed || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">Orders Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {vendor.on_time_delivery_rate ? `${vendor.on_time_delivery_rate}%` : "—"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">On-Time Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-rose-600">{vendor.sla_breach_count || 0}</p>
                    <p className="text-xs text-slate-500 mt-1">SLA Breaches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contract & Terms (Ops Admin only) */}
          {isOpsAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Contract & Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {vendor.contract_start_date && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Contract Start</p>
                      <p className="text-sm">{new Date(vendor.contract_start_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {vendor.contract_end_date && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Contract End</p>
                      <p className="text-sm">{new Date(vendor.contract_end_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {vendor.payment_terms && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Payment Terms</p>
                      <p className="text-sm">{vendor.payment_terms.replace("_", " ")}</p>
                    </div>
                  )}
                  {vendor.agreed_sla_hours && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Agreed SLA</p>
                      <p className="text-sm">{vendor.agreed_sla_hours} hours</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Details (Finance/Super Admin only) */}
          {isFinanceOrSuperAdmin && (
            <Card className="border-amber-200 bg-amber-50/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Financial Details
                  <Badge variant="outline" className="ml-2 text-xs">Restricted</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {vendor.bank_name && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Bank Name</p>
                      <p className="text-sm">{vendor.bank_name}</p>
                    </div>
                  )}
                  {vendor.bank_account_name && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Account Name</p>
                      <p className="text-sm">{vendor.bank_account_name}</p>
                    </div>
                  )}
                  {vendor.bank_account_number && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Account Number</p>
                      <p className="text-sm font-mono">••••{vendor.bank_account_number.slice(-4)}</p>
                    </div>
                  )}
                  {vendor.settlement_currency && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Settlement Currency</p>
                      <p className="text-sm">{vendor.settlement_currency}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(vendor.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                    />
                  ))}
                </div>
                <p className="text-2xl font-bold text-slate-900">{vendor.rating ? vendor.rating.toFixed(1) : "—"}</p>
                <p className="text-xs text-slate-500 mt-1">Overall Rating</p>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          {isOpsAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge className={
                    vendor.compliance_status === "compliant" ? "bg-emerald-100 text-emerald-700" :
                    vendor.compliance_status === "expiring_soon" ? "bg-amber-100 text-amber-700" :
                    vendor.compliance_status === "expired" ? "bg-rose-100 text-rose-700" :
                    "bg-blue-100 text-blue-700"
                  }>
                    {vendor.compliance_status?.replace("_", " ") || "Unknown"}
                  </Badge>
                  {vendor.last_compliance_review_date && (
                    <p className="text-xs text-slate-500 mt-2">
                      Last reviewed: {new Date(vendor.last_compliance_review_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {vendor.onboarding_date && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Onboarded</span>
                  <span className="font-medium">{new Date(vendor.onboarding_date).toLocaleDateString()}</span>
                </div>
              )}
              {vendor.operating_hours && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Operating Hours</span>
                  <span className="font-medium">{vendor.operating_hours}</span>
                </div>
              )}
              {vendor.default_currency && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Currency</span>
                  <span className="font-medium">{vendor.default_currency}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes (Ops only) */}
          {isOpsAdmin && vendor.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Internal Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{vendor.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}