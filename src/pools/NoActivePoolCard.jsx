import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoActivePoolCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-sky-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">No active pool yet</h3>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Place an order to start or join a delivery pool. Orders are automatically grouped with other vessels heading to your port.
        </p>

        <Button 
          onClick={() => navigate(createPageUrl("Products"))}
          className="bg-sky-600 hover:bg-sky-700"
        >
          Start shopping
        </Button>
      </div>
    </div>
  );
}