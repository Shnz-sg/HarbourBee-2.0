import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const product = item.product || item;
  const productId = product.id;
  const name = product.name || item.name;
  const unitPrice = product.unit_price || item.unit_price || 0;
  const unit = product.unit || item.unit || "unit";
  const imageUrl = product.image_url || item.image_url;
  const quantity = item.quantity || 1;

  return (
    <div className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
      <div className="w-20 h-20 bg-slate-50 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">📦</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold text-[#150C0C] mb-1">{name}</h3>
        <p className="text-[13px] text-[#150C0C]/60 mb-3">
          ${unitPrice.toFixed(2)} per {unit}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-200 hover:bg-slate-50"
            onClick={() => onUpdateQuantity(productId, Math.max(1, quantity - 1))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-[14px] font-medium text-[#150C0C] w-8 text-center">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-200 hover:bg-slate-50"
            onClick={() => onUpdateQuantity(productId, quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="text-right flex flex-col items-end gap-2">
        <p className="text-[17px] font-bold text-[#150C0C]">
          ${(unitPrice * quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(productId)}
          className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-7 px-2"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}