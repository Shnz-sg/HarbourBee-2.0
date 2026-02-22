import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.availability_status === "out_of_stock") {
      toast.error("This product is out of stock");
      return;
    }

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("harbourBeeCart") || "[]");
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        unit_price: product.unit_price,
        unit: product.unit,
        image: product.images?.[0],
        quantity: 1
      });
    }

    localStorage.setItem("harbourBeeCart", JSON.stringify(cart));
    
    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast.success("Added to cart");
  };

  const getStockBadge = () => {
    switch (product.availability_status) {
      case "in_stock":
        return <Badge className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-2 py-0.5">In Stock</Badge>;
      case "low_stock":
        return <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] px-2 py-0.5">Low Stock</Badge>;
      case "out_of_stock":
        return <Badge className="bg-red-600 hover:bg-red-700 text-white text-[10px] px-2 py-0.5">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  const isOutOfStock = product.availability_status === "out_of_stock";

  return (
    <Link
      to={createPageUrl("Products")}
      className="group block bg-white rounded-lg overflow-hidden border border-[#150C0C]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-[#F5EBDD]/30 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#150C0C]/30 text-sm">
            No image
          </div>
        )}
        {/* Stock Badge Overlay */}
        <div className="absolute top-2 right-2">
          {getStockBadge()}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-[11px] text-[#150C0C]/50 uppercase tracking-wider mb-1.5">
          {product.category_name || "Uncategorized"}
        </p>

        {/* Product Name */}
        <h3 className="text-[15px] font-semibold text-[#150C0C] mb-1.5 line-clamp-2 leading-snug group-hover:text-[#D39858] transition-colors">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-[13px] text-[#150C0C]/60 mb-3 line-clamp-2 leading-relaxed">
          {product.description_short || product.description || "High-quality vessel supply"}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-[20px] font-bold text-[#150C0C]">
            ${product.unit_price?.toFixed(2) || "0.00"}
          </span>
          {product.unit && (
            <span className="text-[12px] text-[#150C0C]/50">/ {product.unit}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 bg-[#150C0C] text-[#F5EBDD] hover:bg-[#D39858] hover:text-[#150C0C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[13px] h-9"
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
          <Button
            variant="outline"
            className="text-[#150C0C] border-[#150C0C]/30 hover:bg-[#150C0C] hover:text-[#F5EBDD] transition-colors text-[13px] h-9 px-3"
          >
            Details
          </Button>
        </div>
      </div>
    </Link>
  );
}