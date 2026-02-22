import React, { useState } from "react";
import { X, Layers, Users, Clock, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductDetailModal({ product, activePool, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add to cart in localStorage
    const savedCart = localStorage.getItem("harbourbee_cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem("harbourbee_cart", JSON.stringify(cart));
    onAddToCart(product, quantity);
    onClose();
  };

  const progress = activePool ? Math.min((activePool.order_count / 3) * 100, 100) : 0;
  const ordersToFree = activePool ? Math.max(0, 3 - activePool.order_count) : 3;
  const isFree = activePool && activePool.order_count >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Product Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-8xl">📦</span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900">${product.unit_price?.toFixed(2)}</p>
                <span className="text-slate-600">per {product.unit || "unit"}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-medium text-slate-700 mb-2">Category</p>
                <p className="text-sm text-slate-900">{product.category || "General"}</p>
              </div>
            </div>
          </div>

          {activePool && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-sky-600" />
                <h4 className="text-base font-semibold text-slate-900">Pool Status</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-700">Progress to Free Delivery</span>
                    <span className="font-medium text-slate-900">{activePool.order_count} / 3 orders</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${isFree ? "bg-green-500" : "bg-sky-500"}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-slate-600 mb-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>To Free</span>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {isFree ? "Achieved!" : `${ordersToFree} more`}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-slate-600 mb-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Vessels</span>
                    </div>
                    <p className="font-semibold text-slate-900">{activePool.order_count}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-slate-600 mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Status</span>
                    </div>
                    <p className="font-semibold text-slate-900">{activePool.status}</p>
                  </div>
                </div>

                <p className="text-xs text-sky-900 leading-relaxed">
                  Adding this to your cart will include it in the pool. Delivery becomes free when 3+ vessels join.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Quantity</label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-11"
              />
            </div>
            <Button 
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="h-11 px-8 bg-sky-600 hover:bg-sky-700"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}