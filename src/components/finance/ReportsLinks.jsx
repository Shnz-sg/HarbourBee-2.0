import React from "react";
import { FileText, Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsLinks({ userRole }) {
  const isVendor = userRole?.includes("vendor");
  const isFinanceOrAdmin = ["admin", "super_admin", "finance"].includes(userRole);

  const reports = isVendor ? [
    { label: "Download Statement", icon: Download, href: "#" },
    { label: "Earnings Report", icon: FileText, href: "#" },
  ] : [
    { label: "Financial Reports", icon: BarChart3, href: "#" },
    { label: "Settlement History", icon: FileText, href: "#" },
    { label: "Export Data", icon: Download, href: "#" },
    { label: "Audit Trail", icon: FileText, href: "#" },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-3">Reports & Documentation</h2>
      <div className="flex flex-wrap gap-2">
        {reports.map((report, index) => {
          const Icon = report.icon;
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-white"
              onClick={() => window.alert(`Navigate to: ${report.label}`)}
            >
              <Icon className="w-3 h-3 mr-1.5" />
              {report.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}