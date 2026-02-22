import React from "react";
import { Button } from "@/components/ui/button";

export default function OrdersQuickTabs({ activeTab, onTabChange, userRole }) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" }
  ];

  // Crew sees "My Orders" instead of "All"
  if (userRole === "user") {
    tabs[0].label = "My Orders";
  }

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