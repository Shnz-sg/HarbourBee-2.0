import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Layers, Package, Truck, Bell } from "lucide-react";

export default function PrimaryStatusStrip({ poolCount, orderCount, deliveryCount, notificationCount }) {
  const cards = [
    {
      label: "Active Pool",
      value: poolCount > 0 ? `${poolCount} Pool${poolCount !== 1 ? 's' : ''}` : "No active pool",
      icon: Layers,
      color: poolCount > 0 ? "sky" : "slate",
      link: "Pools"
    },
    {
      label: "Active Orders",
      value: orderCount > 0 ? `${orderCount} Order${orderCount !== 1 ? 's' : ''}` : "No orders",
      icon: Package,
      color: orderCount > 0 ? "green" : "slate",
      link: "Orders"
    },
    {
      label: "Upcoming Deliveries",
      value: deliveryCount > 0 ? `${deliveryCount} Pending` : "None scheduled",
      icon: Truck,
      color: deliveryCount > 0 ? "amber" : "slate",
      link: "Deliveries"
    },
    {
      label: "Notifications",
      value: notificationCount > 0 ? `${notificationCount} Unread` : "All clear",
      icon: Bell,
      color: notificationCount > 0 ? "red" : "slate",
      link: "Notifications"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const isActive = card.color !== "slate";
        
        return (
          <Link
            key={i}
            to={createPageUrl(card.link)}
            className={`bg-white border-2 rounded-xl p-4 transition-all hover:shadow-md ${
              isActive ? `border-${card.color}-200` : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                isActive ? `bg-${card.color}-100` : "bg-slate-100"
              }`}>
                <Icon className={`w-4.5 h-4.5 ${
                  isActive ? `text-${card.color}-600` : "text-slate-400"
                }`} />
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-1">{card.label}</p>
            <p className={`text-base font-semibold ${
              isActive ? "text-slate-900" : "text-slate-500"
            }`}>
              {card.value}
            </p>
          </Link>
        );
      })}
    </div>
  );
}