import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Package, Layers, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function ProductsList({ products, userRole }) {
  const isCrew = userRole === "user";
  const isOpsOrAdmin = ["ops_staff", "ops_admin", "super_admin"].includes(userRole);

  const getAvailabilityIcon = (product) => {
    if (product.hasStock) {
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    } else if (product.availabilityStatus === "temp_unavailable") {
      return <Clock className="w-4 h-4 text-amber-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const gridColumns = isOpsOrAdmin 
    ? "60px 2fr 1fr 1fr 1fr 1fr 80px 40px"
    : "60px 2fr 1fr 1fr 1fr 40px";

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div 
        className="hidden md:grid gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-600 uppercase tracking-wide"
        style={{ gridTemplateColumns: gridColumns }}
      >
        <div></div>
        <div>Product</div>
        <div>Category</div>
        <div>Price</div>
        <div>Availability</div>
        {isOpsOrAdmin && (
          <>
            <div>Status</div>
            <div>Offers</div>
          </>
        )}
        <div></div>
      </div>

      <div className="divide-y divide-slate-100">
        {products.map(product => (
          <Link
            key={product.id}
            to={createPageUrl("ProductDetail") + `?id=${product.id}`}
            className="grid gap-3 px-4 py-3 hover:bg-slate-50 transition-colors items-center"
            style={{ gridTemplateColumns: gridColumns }}
          >
            <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center overflow-hidden">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-6 h-6 text-slate-300" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{product.name}</span>
                {product.pool_eligible && (
                  <Layers className="w-3.5 h-3.5 text-sky-500" title="Pool Eligible" />
                )}
              </div>
              <span className="text-xs text-slate-500 font-mono">{product.product_id}</span>
            </div>

            <div className="text-sm text-slate-600">{product.category_name || "—"}</div>

            <div>
              {product.priceFrom ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-slate-500">From</span>
                  <span className="font-semibold text-slate-900">${product.priceFrom.toFixed(2)}</span>
                  <span className="text-xs text-slate-500">/{product.unit}</span>
                </div>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {getAvailabilityIcon(product)}
              <span className="text-sm text-slate-600">
                {product.hasStock ? "In Stock" : 
                 product.availabilityStatus === "temp_unavailable" ? "Temp" : "Out"}
              </span>
            </div>

            {isOpsOrAdmin && (
              <>
                <div>
                  <Badge 
                    variant="outline" 
                    className={
                      product.status === "active" ? "bg-emerald-50 text-emerald-700" :
                      product.status === "draft" ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>

                <div className="text-sm text-slate-600 text-center">
                  {product.offers?.length || 0}
                </div>
              </>
            )}

            <div className="text-slate-400">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
}