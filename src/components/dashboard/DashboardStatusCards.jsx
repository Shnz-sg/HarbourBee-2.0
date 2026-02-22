import React from "react";
import { Card } from "@/components/ui/card";
import { Layers, Package, Truck, Bell } from "lucide-react";

export default function DashboardStatusCards({ poolCount, orderCount, deliveryCount, notificationCount, loading }) {
  const cards = [
    { label: "Active Pool Status", value: poolCount > 0 ? "Active" : "None", icon: Layers, color: poolCount > 0 ? "text-emerald-600" : "text-slate-400" },
    { label: "My Active Orders", value: orderCount, icon: Package, color: "text-sky-600" },
    { label: "Upcoming Deliveries", value: deliveryCount, icon: Truck, color: "text-amber-600" },
    { label: "Notifications", value: notificationCount, icon: Bell, color: notificationCount > 0 ? "text-rose-600" : "text-slate-400" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={i} className="p-4">
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                <div className="h-6 w-12 bg-slate-100 rounded animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${card.color}`} />
                <div>
                  <p className="text-xs text-slate-500">{card.label}</p>
                  <p className="text-lg font-semibold text-slate-900">{card.value}</p>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}