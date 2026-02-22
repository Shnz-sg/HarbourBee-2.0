import React from "react";
import { ShieldAlert } from "lucide-react";

export default function PermissionGate({ 
  hasPermission, 
  children, 
  fallback,
  message = "You don't have permission to view this content"
}) {
  if (!hasPermission) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">{message}</p>
      </div>
    );
  }

  return <>{children}</>;
}