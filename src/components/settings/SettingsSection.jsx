import React from "react";

export default function SettingsSection({ 
  title, 
  description, 
  children,
  lastUpdated,
  lastUpdatedBy,
  showAudit = true 
}) {
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg mb-4">
      <div className="px-6 py-5 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{description}</p>
        )}
        {showAudit && (lastUpdated || lastUpdatedBy) && (
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            {lastUpdated && (
              <span>Last updated {formatDate(lastUpdated)}</span>
            )}
            {lastUpdatedBy && (
              <span>by {lastUpdatedBy}</span>
            )}
          </div>
        )}
      </div>
      <div className="px-6">
        {children}
      </div>
    </div>
  );
}