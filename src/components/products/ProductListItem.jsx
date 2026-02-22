import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle2, XCircle, Layers } from "lucide-react";

export default function ProductListItem({ product, showAdvanced }) {
  const isAvailable = product.in_stock !== false;

  return (
    <Link
      to={createPageUrl(`Products?view=detail&id=${product.id}`)}
      className={`grid grid-cols-12 gap-2 px-4 py-3 hover:bg-slate-50 transition-colors items-center ${
        !isAvailable ? "opacity-60" : ""
      }`}
    >
      <div className="col-span-3 text-sm font-medium text-slate-900">
        {product.name}
      </div>
      
      <div className="col-span-2 text-xs text-slate-500 capitalize">
        {product.category?.replace(/_/g, " ") || "—"}
      </div>

      <div className="col-span-2">
        <div className="flex items-center gap-1.5">
          {isAvailable ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-700 font-medium">Available</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500">Out of Stock</span>
            </>
          )}
        </div>
      </div>

      <div className="col-span-2 text-sm font-semibold text-slate-700">
        {product.unit_price ? (
          <>
            ${product.unit_price.toFixed(2)}
            {product.unit && <span className="text-xs text-slate-400 font-normal ml-0.5">/{product.unit}</span>}
          </>
        ) : (
          <span className="text-slate-400 font-normal">—</span>
        )}
      </div>

      {showAdvanced && (
        <div className="col-span-2 text-xs text-slate-500 truncate">
          {product.vendor_name || "—"}
        </div>
      )}

      <div className="col-span-1 flex justify-center">
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
      </div>
    </Link>
  );
}