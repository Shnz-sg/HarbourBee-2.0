import React from "react";
import { CreditCard, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PaymentMethodSection() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Payment Method</h2>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Lock className="w-3 h-3" />
          <span>Secure payment</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 border-2 border-sky-200 bg-sky-50 rounded-lg">
          <CreditCard className="w-5 h-5 text-sky-600" />
          <span className="text-sm font-medium text-slate-900">Credit / Debit Card</span>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" className="mt-1" />
            </div>
          </div>

          <div>
            <Label htmlFor="cardName">Name on Card</Label>
            <Input id="cardName" placeholder="Full name" className="mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
}