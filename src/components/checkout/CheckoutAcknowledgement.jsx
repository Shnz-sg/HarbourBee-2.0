import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";

export default function CheckoutAcknowledgement({ checked, onChange }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <Checkbox 
          id="acknowledgement" 
          checked={checked}
          onCheckedChange={onChange}
          className="mt-0.5"
        />
        <label 
          htmlFor="acknowledgement" 
          className="flex-1 text-sm text-slate-700 leading-relaxed cursor-pointer"
        >
          I understand that the delivery fee shown is provisional and may be adjusted after the pool closes. If the free delivery threshold is reached, the delivery fee will be refunded automatically.
        </label>
        <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
      </div>
    </div>
  );
}