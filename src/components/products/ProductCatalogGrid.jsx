import React, { useState } from "react";
import { Package } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductDetailModal from "./ProductDetailModal";

export default function ProductCatalogGrid({ products, onAddToCart, activePool }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-2">No Products Found</h3>
        <p className="text-sm text-slate-600">
          Adjust your filters or search to see available products
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            activePool={activePool}
            onClick={() => setSelectedProduct(product)}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          activePool={activePool}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
}