import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnboardingGuard from "../components/shared/OnboardingGuard";
import LoadingSkeleton from "../components/states/LoadingSkeleton";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const orders = await base44.entities.Order.filter({ id: orderId });
      return orders[0];
    },
    enabled: !!orderId
  });

  if (isLoading) {
    return (
      <OnboardingGuard>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <LoadingSkeleton type="card" count={1} />
        </div>
      </OnboardingGuard>
    );
  }

  if (!order) {
    return (
      <OnboardingGuard>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600">Order not found</p>
          </div>
        </div>
      </OnboardingGuard>
    );
  }

  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed</h1>
            <p className="text-sm text-slate-600 mb-6">
              Your order has been placed successfully
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600">Order ID</span>
                <span className="text-sm font-semibold text-slate-900">{order.order_id}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600">Vessel</span>
                <span className="text-sm font-semibold text-slate-900">{order.vessel_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Paid</span>
                <span className="text-lg font-bold text-slate-900">
                  ${order.total_amount?.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-sky-900 mb-2">What Happens Next</h3>
              <ul className="text-sm text-sky-900 space-y-2 leading-relaxed">
                <li>• Your order is now part of your vessel's pool</li>
                <li>• Pool remains open until cut-off</li>
                <li>• Delivery fee will be finalized automatically</li>
                {order.pool_id && (
                  <li>• Any refund will be processed without action from you</li>
                )}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={createPageUrl("OrderDetail") + `?id=${order.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Package className="w-4 h-4 mr-2" />
                  View Order Details
                </Button>
              </Link>
              <Link to={createPageUrl("Products")} className="flex-1">
                <Button className="w-full bg-sky-600 hover:bg-sky-700">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </OnboardingGuard>
  );
}