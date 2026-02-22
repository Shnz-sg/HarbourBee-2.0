import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Ship, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import OnboardingGuard from "../components/shared/OnboardingGuard";
import CartItem from "../components/cart/CartItem";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Fetch user and vessel data
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: vessel } = useQuery({
    queryKey: ['currentVessel', user?.vessel_id],
    queryFn: async () => {
      if (!user?.vessel_id) return null;
      const vessels = await base44.entities.Vessel.filter({ id: user.vessel_id });
      return vessels[0] || null;
    },
    enabled: !!user?.vessel_id,
  });

  const { data: pools = [] } = useQuery({
    queryKey: ['pools', vessel?.current_port],
    queryFn: () => base44.entities.Pool.filter({ status: 'open', port: vessel?.current_port }),
    enabled: !!vessel?.current_port,
  });

  const activePool = pools[0];

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("harbourbee_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("harbourbee_cart", JSON.stringify(newCart));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const newCart = cart.map(item =>
      (item.product?.id || item.id) === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(newCart);
  };

  const handleRemove = (productId) => {
    const newCart = cart.filter(item => (item.product?.id || item.id) !== productId);
    saveCart(newCart);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    navigate(createPageUrl("Checkout"));
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product?.unit_price || item.unit_price || 0;
    const qty = item.quantity || 0;
    return sum + (price * qty);
  }, 0);

  // Calculate pool progress
  const targetValue = 5000; // Example threshold
  const currentValue = activePool?.total_value || 0;
  const progressPercent = Math.min((currentValue / targetValue) * 100, 100);
  const remainingToThreshold = Math.max(targetValue - currentValue, 0);

  // Calculate time remaining
  const targetDate = activePool?.target_date ? new Date(activePool.target_date) : null;
  const hoursRemaining = targetDate 
    ? Math.max(0, Math.round((targetDate - new Date()) / (1000 * 60 * 60)))
    : null;

  // Provisional delivery fee
  const provisionalDeliveryFee = 16.70;

  if (cart.length === 0) {
    return (
      <OnboardingGuard>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h1>
            <p className="text-sm text-slate-600 mb-6">
              Browse products and add items to your cart to get started
            </p>
            <Button onClick={() => navigate(createPageUrl("Products"))}>
              Browse Products
            </Button>
          </div>
        </div>
      </OnboardingGuard>
    );
  }

  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-2xl font-bold text-[#150C0C] mb-8">Your Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Vessel Context Block */}
              {vessel && activePool && (
                <div className="bg-[#EACEAA] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Ship className="w-4 h-4 text-[#150C0C]" />
                    <h3 className="text-[15px] font-bold text-[#150C0C]">
                      {vessel.name} — Delivery pool active
                    </h3>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#D39858] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[13px] text-[#150C0C]/80">
                    <span>{Math.round(progressPercent)}% toward reduced delivery cost</span>
                    {hoursRemaining !== null && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{hoursRemaining}h remaining</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cart items */}
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <CartItem
                    key={item.product?.id || idx}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200 rounded-xl p-6 sticky top-6">
                <h2 className="text-base font-semibold text-[#150C0C] mb-5">Summary</h2>
                
                {/* Subtotal */}
                <div className="flex items-center justify-between text-[15px] mb-4">
                  <span className="text-[#150C0C]/70">Subtotal</span>
                  <span className="font-semibold text-[#150C0C]">${subtotal.toFixed(2)}</span>
                </div>

                {/* Delivery Fee Section */}
                <div className="border-t border-slate-100 pt-4 mb-4">
                  <div className="flex items-center justify-between text-[15px] mb-1">
                    <span className="text-[#150C0C]/70">Delivery fee (provisional)</span>
                    <span className="font-semibold text-[#150C0C]">${provisionalDeliveryFee.toFixed(2)}</span>
                  </div>
                  <p className="text-[12px] text-[#150C0C]/60 leading-relaxed">
                    Final delivery cost is confirmed when the pool closes. Any excess will be refunded automatically.
                  </p>
                </div>

                {/* Dynamic message */}
                {remainingToThreshold > 0 && remainingToThreshold < 500 && (
                  <div className="bg-[#D39858]/5 border border-[#D39858]/20 rounded-lg p-3 mb-4">
                    <p className="text-[13px] text-[#150C0C]/80">
                      Only <span className="font-semibold">${remainingToThreshold.toFixed(0)}</span> more needed to reduce delivery cost.
                    </p>
                  </div>
                )}

                {hoursRemaining !== null && hoursRemaining < 6 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4">
                    <p className="text-[13px] text-[#150C0C]/80">
                      Pool closes soon. Delivery cost will be finalised at closing.
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-slate-200 pt-4 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#150C0C]">Total</span>
                    <span className="text-2xl font-bold text-[#150C0C]">
                      ${(subtotal + provisionalDeliveryFee).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#150C0C] hover:bg-[#150C0C]/90 text-white h-12 rounded-lg font-medium"
                >
                  Proceed to checkout
                </Button>

                <p className="text-[12px] text-[#150C0C]/50 text-center mt-3">
                  Pooling is automatic. No action required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OnboardingGuard>
  );
}