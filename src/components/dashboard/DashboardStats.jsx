import React from "react";
import StatsCard from "../shared/StatsCard";
import { Package, Truck, AlertTriangle, Layers } from "lucide-react";

export default function DashboardStats({ orders, deliveries, exceptions, pools }) {
  const activeOrders = orders.filter(o => !["delivered", "cancelled"].includes(o.status)).length;
  const inTransit = deliveries.filter(d => ["dispatched", "in_transit", "at_anchorage"].includes(d.status)).length;
  const openExceptions = exceptions.filter(e => ["open", "investigating"].includes(e.status)).length;
  const openPools = pools.filter(p => p.status === "open").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatsCard label="Active Orders" value={activeOrders} icon={Package} sub={`${orders.length} total`} />
      <StatsCard label="In Transit" value={inTransit} icon={Truck} sub={`${deliveries.length} total deliveries`} />
      <StatsCard label="Open Pools" value={openPools} icon={Layers} sub="Awaiting lock" />
      <StatsCard label="Exceptions" value={openExceptions} icon={AlertTriangle} sub={openExceptions > 0 ? "Needs attention" : "All clear"} />
    </div>
  );
}