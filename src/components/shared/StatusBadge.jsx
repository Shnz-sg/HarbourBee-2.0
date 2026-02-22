import React from "react";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  // Orders
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-sky-50 text-sky-700",
  confirmed: "bg-blue-50 text-blue-700",
  pooled: "bg-indigo-50 text-indigo-700",
  in_delivery: "bg-amber-50 text-amber-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500",
  disputed: "bg-rose-50 text-rose-700",
  // Pools
  open: "bg-sky-50 text-sky-700",
  locked: "bg-indigo-50 text-indigo-700",
  // Deliveries
  scheduled: "bg-slate-100 text-slate-600",
  dispatched: "bg-blue-50 text-blue-700",
  in_transit: "bg-amber-50 text-amber-700",
  at_anchorage: "bg-orange-50 text-orange-700",
  failed: "bg-rose-50 text-rose-700",
  // Vendor Orders
  pending: "bg-slate-100 text-slate-600",
  acknowledged: "bg-sky-50 text-sky-700",
  preparing: "bg-blue-50 text-blue-700",
  ready: "bg-indigo-50 text-indigo-700",
  shipped: "bg-amber-50 text-amber-700",
  // Exceptions
  investigating: "bg-amber-50 text-amber-700",
  resolved: "bg-emerald-50 text-emerald-700",
  dismissed: "bg-slate-100 text-slate-500",
  // Generic
  active: "bg-emerald-50 text-emerald-700",
  inactive: "bg-slate-100 text-slate-500",
  suspended: "bg-rose-50 text-rose-700",
  // Payment
  unpaid: "bg-slate-100 text-slate-600",
  partial: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  refunded: "bg-sky-50 text-sky-700",
  // Severity
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  critical: "bg-rose-50 text-rose-700",
  // Priority
  normal: "bg-slate-100 text-slate-600",
  urgent: "bg-amber-50 text-amber-700",
  // Notification types
  info: "bg-sky-50 text-sky-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-rose-50 text-rose-700",
  success: "bg-emerald-50 text-emerald-700",
};

export default function StatusBadge({ status, className }) {
  if (!status) return null;
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
  const label = status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap",
      style,
      className
    )}>
      {label}
    </span>
  );
}