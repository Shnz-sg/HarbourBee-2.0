import React from "react";
import { Button } from "@/components/ui/button";

export default function VendorOrderQuickTabs({ activeTab, onTabChange, userRole }) {
  const isVendor = userRole === "vendor";

  const vendorTabs = [
    { id: "new", label: "New Orders" },
    { id: "in_progress", label: "In Progress" },
    { id: "completed", label: "Completed" }
  ];

  const opsTabs = [
    { id: "awaiting_ack", label: "Awaiting Ack" },
    { id: "preparing", label: "Preparing" },
    { id: "ready", label: "Ready for Pickup" },
    { id: "completed", label: "Completed" },
    { id: "issues", label: "Issues" }
  ];

  const tabs = isVendor ? vendorTabs : opsTabs;

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 mb-4">
      {tabs.map(tab => (
        <Button
          key={tab.id}
          variant="ghost"
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className={`
            h-9 rounded-none border-b-2 transition-colors
            ${activeTab === tab.id 
              ? "border-sky-600 text-sky-700 font-medium" 
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"}
          `}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}