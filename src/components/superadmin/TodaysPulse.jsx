import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, Layers, Truck, AlertTriangle, Store, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function TodaysPulse({ metrics }) {
  const cards = [
    { label: "Orders Today", value: metrics.ordersToday, icon: Package, trend: metrics.ordersTrend, link: "Orders" },
    { label: "Active Pools", value: metrics.activePools, icon: Layers, trend: null, link: "Pools" },
    { label: "Deliveries Due", value: metrics.deliveriesDue, icon: Truck, trend: metrics.deliveriesTrend, link: "Deliveries" },
    { label: "Exceptions", value: metrics.exceptionsToday, icon: AlertTriangle, trend: metrics.exceptionsTrend, link: "Exceptions" },
    { label: "Active Vendors", value: metrics.activeVendors, icon: Store, trend: null, link: "Vendors" },
  ];

  return (
    <div className="px-6 mt-8">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">Today's Pulse</h2>
        <p className="text-xs text-slate-500">Operational snapshot</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {cards.map(card => (
          <Link
            key={card.label}
            to={createPageUrl(card.link)}
            className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:border-sky-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <card.icon className="w-5 h-5 text-slate-400" />
              {card.trend && (
                <TrendIndicator trend={card.trend} />
              )}
            </div>
            <div className="text-3xl font-bold text-slate-900">{card.value || 0}</div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TrendIndicator({ trend }) {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-rose-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-300" />;
}