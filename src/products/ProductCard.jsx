import React from "react";

export default function ProductCard({ product, onClick, activePool, onAddToCart }) {
  // Determine pooling state message
  const getPoolingMessage = () => {
    if (!activePool) return "Delivery pooled automatically";
    
    // Calculate pool progress (you can adjust this logic based on your pool thresholds)
    const orderCount = activePool.order_count || 0;
    const threshold = 10; // Example threshold
    const progress = (orderCount / threshold) * 100;
    
    if (progress > 70 && progress < 100) {
      return "Close to reduced delivery cost";
    } else if (activePool.closing_soon) {
      return "Pool closing soon";
    }
    return "Delivery pooled automatically";
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product, 1);
    }
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer group bg-white rounded-[14px] transition-all duration-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
    >
      {/* Product Image */}
      <div className="aspect-[4/5] bg-[#EACEAA]/6 rounded-t-[14px] overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-20">📦</span>
          </div>
        )}
      </div>

      {/* Product Info Block */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-[17px] font-medium text-[#150C0C] leading-[1.3] line-clamp-2 mb-1.5">
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-[16px] font-semibold text-[#85431E] mt-1.5">
          ${product.unit_price?.toFixed(2)}
        </p>

        {/* Pooling Integration (Subtle) */}
        <p className="text-[12px] text-[#85431E]/75 mt-1.5">
          {getPoolingMessage()}
        </p>

        {/* Add to Cart Button - Hidden on desktop, slides up on hover */}
        <div className="relative mt-3.5 overflow-hidden">
          {/* Desktop: Hidden by default, slides up on hover */}
          <button
            onClick={handleAddToCart}
            className="hidden lg:block w-full h-10 bg-[#D39858] hover:bg-[#C48748] text-[#150C0C] rounded-lg font-medium text-sm transition-all duration-200 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Add to cart
          </button>
          
          {/* Mobile: Always visible */}
          <button
            onClick={handleAddToCart}
            className="lg:hidden w-full h-10 bg-[#D39858] hover:bg-[#C48748] text-[#150C0C] rounded-lg font-medium text-sm transition-colors"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}