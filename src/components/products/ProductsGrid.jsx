import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Layers, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function ProductsGrid({ products, userRole }) {
  const isCrew = userRole === "user";

  const getAvailabilityBadge = (product) => {
    if (product.hasStock) {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          In Stock
        </Badge>
      );
    } else if (product.availabilityStatus === "temp_unavailable") {
      return (
        <Badge className="bg-amber-100 text-amber-700 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          Temp Unavailable
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-slate-200 text-slate-600 text-xs">
          <AlertCircle className="w-3 h-3 mr-1" />
          Out of Stock
        </Badge>
      );
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <Link key={product.id} to={createPageUrl("ProductDetail") + `?id=${product.id}`}>
          <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-square bg-slate-100 flex items-center justify-center">
              {product.images?.[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-12 h-12 text-slate-300" />
              )}
            </div>
            
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-sm text-slate-900 line-clamp-2">
                  {product.name}
                </h3>
                {product.pool_eligible && (
                  <Layers className="w-4 h-4 text-sky-500 flex-shrink-0" title="Pool Eligible" />
                )}
              </div>

              {product.category_name && (
                <p className="text-xs text-slate-500 mb-2">{product.category_name}</p>
              )}

              <div className="mb-2">
                {getAvailabilityBadge(product)}
              </div>

              {product.priceFrom && (
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-slate-500">From</span>
                  <span className="text-lg font-semibold text-slate-900">
                    ${product.priceFrom.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">/{product.unit}</span>
                </div>
              )}

              {!isCrew && product.offers && (
                <p className="text-xs text-slate-500 mt-1">
                  {product.offers.length} offer{product.offers.length !== 1 ? 's' : ''}
                </p>
              )}

              {!isCrew && product.status !== "active" && (
                <Badge variant="outline" className="mt-2 text-xs">
                  {product.status}
                </Badge>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}