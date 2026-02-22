import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SkeletonRows from "../components/shared/SkeletonRows";
import OrderHeader from "../components/orderdetail/OrderHeader";
import OrderItemsList from "../components/orderdetail/OrderItemsList";
import PoolingInfoPanel from "../components/orderdetail/PoolingInfoPanel";
import DeliveryFeeTimeline from "../components/orderdetail/DeliveryFeeTimeline";
import PaymentSummary from "../components/orderdetail/PaymentSummary";
import DeliveryInformation from "../components/orderdetail/DeliveryInformation";
import OrderActivityTimeline from "../components/orderdetail/OrderActivityTimeline";
import { ChevronRight, ArrowLeft } from "lucide-react";

export default function OrderDetail() {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: orders = [], isLoading: loadingOrder } = useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: () => base44.entities.Order.filter({ id: orderId }),
    enabled: !!orderId,
  });

  const order = orders[0];

  // Fetch pool if order is pooled
  const { data: pools = [] } = useQuery({
    queryKey: ["pool-detail", order?.pool_id],
    queryFn: () => base44.entities.Pool.filter({ id: order.pool_id }),
    enabled: !!order?.pool_id,
  });

  const pool = pools[0];

  // Fetch delivery if order has delivery
  const { data: deliveries = [] } = useQuery({
    queryKey: ["delivery-detail", order?.delivery_id],
    queryFn: () => base44.entities.Delivery.filter({ id: order.delivery_id }),
    enabled: !!order?.delivery_id,
  });

  const delivery = deliveries[0];

  const userRole = user?.role || "user";
  const isOpsOrAdmin = ["ops_staff", "ops_admin", "admin", "super_admin"].includes(userRole);

  if (loadingOrder) {
    return (
      <div className="p-6">
        <SkeletonRows rows={8} cols={3} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <p className="text-slate-500">Order not found.</p>
        </div>
      </div>
    );
  }

  const isPooled = !!order.pool_id;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Link to={createPageUrl("Orders")} className="hover:text-sky-600 flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Orders
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-medium">{order.order_id}</span>
      </div>

      {/* Order Header */}
      <OrderHeader order={order} />

      {/* Main Content - Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left Column - Primary Information */}
        <div className="lg:col-span-2 space-y-4">
          <OrderItemsList items={order.items} showVendor={isOpsOrAdmin} />
          
          {isPooled && <PoolingInfoPanel order={order} pool={pool} />}
          
          <DeliveryFeeTimeline order={order} pool={pool} isPooled={isPooled} />
          
          <DeliveryInformation order={order} delivery={delivery} />
          
          <OrderActivityTimeline order={order} pool={pool} delivery={delivery} />
        </div>

        {/* Right Column - Summary & Notes */}
        <div className="space-y-4">
          <PaymentSummary order={order} />

          {order.notes && (
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Notes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{order.notes}</p>
            </div>
          )}

          {order.requested_by && (
            <div className="bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Requested By</h3>
              <p className="text-sm text-slate-700">{order.requested_by}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}