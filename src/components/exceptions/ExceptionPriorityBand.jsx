import React, { useState } from "react";
import { ChevronRight, ChevronDown, AlertCircle } from "lucide-react";
import ExceptionItem from "./ExceptionItem";

export default function ExceptionPriorityBand({ priority, exceptions, defaultExpanded = true, onExceptionClick, viewMode = "list" }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (exceptions.length === 0) return null;

  const priorityConfig = {
    critical: { 
      bg: "bg-red-50", 
      border: "border-red-300", 
      text: "text-red-700",
      label: "Critical",
      icon: "text-red-600"
    },
    high: { 
      bg: "bg-orange-50", 
      border: "border-orange-300", 
      text: "text-orange-700",
      label: "High",
      icon: "text-orange-600"
    },
    medium: { 
      bg: "bg-amber-50", 
      border: "border-amber-200", 
      text: "text-amber-700",
      label: "Medium",
      icon: "text-amber-600"
    },
    low: { 
      bg: "bg-slate-50", 
      border: "border-slate-200", 
      text: "text-slate-600",
      label: "Low",
      icon: "text-slate-500"
    }
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <div className={`border-2 ${config.border} rounded-lg overflow-hidden mb-4`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-5 py-3.5 flex items-center justify-between hover:opacity-90 transition-opacity ${config.bg}`}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
          <AlertCircle className={`w-4 h-4 ${config.icon}`} />
          <span className={`text-sm font-semibold uppercase tracking-wide ${config.text}`}>
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2.5 py-1 bg-white rounded-full ${config.text}`}>
            {exceptions.length} {exceptions.length === 1 ? "issue" : "issues"}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className={`bg-white ${viewMode === "list" ? "divide-y divide-slate-100" : "grid grid-cols-1 md:grid-cols-2 gap-3 p-3"}`}>
          {exceptions.map((exception) => (
            <ExceptionItem
              key={exception.id}
              exception={exception}
              onClick={() => onExceptionClick(exception)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}