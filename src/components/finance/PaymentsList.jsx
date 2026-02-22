import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AlertCircle, DollarSign, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function PaymentsList({ orders, userRole }) {
  const isNormalUser = userRole === 'user';
  const isOpsStaff = userRole === 'ops_staff';
  const isOpsAdmin = userRole === 'ops_admin' || userRole === 'admin';
  const isSuperAdmin = userRole === 'super_admin';

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      unpaid: "bg-amber-50 text-amber-700 border-amber-200",
      partial: "bg-sky-50 text-sky-700 border-sky-200",
      refunded: "bg-slate-100 text-slate-600 border-slate-200"
    };
    return colors[status] || "bg-slate-100 text-slate-600";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
        <div className={`grid gap-4 text-xs font-medium text-slate-600 uppercase tracking-wider
          ${isNormalUser ? 'grid-cols-4' : 
            isOpsStaff ? 'grid-cols-5' : 
            isOpsAdmin ? 'grid-cols-6' : 'grid-cols-7'}`}>
          <div>Order ID</div>
          <div>Payment Status</div>
          <div>Amount</div>
          {!isNormalUser && <div>Vessel</div>}
          {(isOpsStaff || isOpsAdmin || isSuperAdmin) && <div>Order Status</div>}
          {(isOpsAdmin || isSuperAdmin) && <div>Delivery Fee</div>}
          {isSuperAdmin && <div>Refund</div>}
          <div className="text-right">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-100">
        {orders.map((order) => {
          const showAlert = order.payment_status === 'unpaid' || order.payment_status === 'partial';
          const hasRefund = order.refund_amount && order.refund_amount > 0;

          return (
            <div
              key={order.id}
              className={`px-4 py-3 hover:bg-slate-50 transition-colors
                ${showAlert ? 'border-l-4 border-amber-400 bg-amber-50/30' : ''}`}
            >
              <div className={`grid gap-4 items-center text-sm
                ${isNormalUser ? 'grid-cols-4' : 
                  isOpsStaff ? 'grid-cols-5' : 
                  isOpsAdmin ? 'grid-cols-6' : 'grid-cols-7'}`}>
                
                {/* Order ID */}
                <div>
                  <Link
                    to={createPageUrl('OrderDetail', `?id=${order.id}`)}
                    className="font-medium text-slate-900 hover:text-sky-600 transition-colors"
                  >
                    {order.order_id}
                  </Link>
                  {showAlert && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>Payment pending</span>
                    </div>
                  )}
                </div>

                {/* Payment Status */}
                <div>
                  <Badge className={getPaymentStatusColor(order.payment_status)}>
                    {order.payment_status || 'unpaid'}
                  </Badge>
                </div>

                {/* Amount */}
                <div className="font-medium text-slate-900">
                  {formatCurrency(order.total_amount)}
                </div>

                {/* Vessel - Hidden for Normal User */}
                {!isNormalUser && (
                  <div className="text-slate-600 truncate">
                    {order.vessel_name || '—'}
                  </div>
                )}

                {/* Order Status - Ops Staff and above */}
                {(isOpsStaff || isOpsAdmin || isSuperAdmin) && (
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {order.status || 'draft'}
                    </Badge>
                  </div>
                )}

                {/* Delivery Fee - Ops Admin and Super Admin */}
                {(isOpsAdmin || isSuperAdmin) && (
                  <div className="text-slate-600">
                    {order.delivery_fee_final 
                      ? formatCurrency(order.delivery_fee_final)
                      : order.delivery_fee_provisional 
                        ? <span className="text-xs text-slate-400">
                            ~{formatCurrency(order.delivery_fee_provisional)}
                          </span>
                        : '—'}
                  </div>
                )}

                {/* Refund - Super Admin only */}
                {isSuperAdmin && (
                  <div className="text-slate-600">
                    {hasRefund ? (
                      <span className="text-rose-600 font-medium">
                        -{formatCurrency(order.refund_amount)}
                      </span>
                    ) : '—'}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Link to={createPageUrl('OrderDetail', `?id=${order.id}`)}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  
                  {/* Retry Payment - Normal User only, if payment failed */}
                  {isNormalUser && order.payment_status === 'unpaid' && (
                    <Button variant="outline" size="sm" className="text-sky-600">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}