import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import OnboardingGuard from "../components/shared/OnboardingGuard";
import CheckoutContextBar from "../components/checkout/CheckoutContextBar";
import OrderSummarySection from "../components/checkout/OrderSummarySection";
import ProvisionalFeePanel from "../components/checkout/ProvisionalFeePanel";
import PaymentMethodSection from "../components/checkout/PaymentMethodSection";
import CheckoutAcknowledgement from "../components/checkout/CheckoutAcknowledgement";
import { toast } from "sonner";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [vessel, setVessel] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart
    const savedCart = localStorage.getItem("harbourbee_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load vessel
    base44.auth.me().then(async (u) => {
      if (u.vessel_id) {
        const vessels = await base44.entities.Vessel.filter({ id: u.vessel_id });
        if (vessels.length > 0) setVessel(vessels[0]);
      }
    });
  }, []);

  const { data: pools = [] } = useQuery({
    queryKey: ['pools-active'],
    queryFn: () => base44.entities.Pool.filter({ status: 'open' }),
    enabled: !!vessel
  });

  const activePool = pools[0];
  const participantCount = activePool?.order_count || 1;
  const baseFee = 100;
  const provisionalFee = baseFee / participantCount;
  const subtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const total = subtotal + provisionalFee;

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate(createPageUrl("Products"));
    }
  }, [cart, navigate]);

  const handlePlaceOrder = async () => {
    if (!acknowledged) {
      toast.error("Please acknowledge the provisional delivery fee terms");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order
      const orderData = {
        order_id: `ORD-${Date.now()}`,
        status: "confirmed",
        vessel_name: vessel?.name,
        vessel_id: vessel?.id,
        port: activePool?.port || "Singapore",
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.unit_price * item.quantity
        })),
        pool_id: activePool?.id,
        subtotal: subtotal,
        delivery_fee_provisional: provisionalFee,
        total_amount: total,
        payment_status: "paid",
        requested_by: vessel?.name
      };

      const order = await base44.entities.Order.create(orderData);

      // Clear cart
      localStorage.removeItem("harbourbee_cart");

      // Navigate to confirmation
      navigate(createPageUrl("OrderConfirmation") + `?orderId=${order.id}`);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-slate-50">
        <CheckoutContextBar vessel={vessel} pool={activePool} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

          <div className="space-y-6">
            <OrderSummarySection items={cart} />

            <ProvisionalFeePanel 
              pool={activePool}
              participantCount={participantCount}
              provisionalFee={provisionalFee}
            />

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Subtotal</span>
                  <span className="text-sm font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Provisional delivery fee</span>
                  <span className="text-sm font-medium text-slate-900">${provisionalFee.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-slate-900">Total Payable Now</span>
                    <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <PaymentMethodSection />

            <CheckoutAcknowledgement 
              checked={acknowledged}
              onChange={setAcknowledged}
            />

            <Button
              onClick={handlePlaceOrder}
              disabled={!acknowledged || isProcessing}
              className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-base font-semibold"
            >
              {isProcessing ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
            </Button>

            <p className="text-xs text-center text-slate-500">
              By placing this order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </OnboardingGuard>
  );
}