import React from "react";
import { ShoppingCart, Layers, TrendingDown } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: ShoppingCart,
    title: "Order",
    description: "Order what you need for your vessel"
  },
  {
    number: "2",
    icon: Layers,
    title: "Pool",
    description: "Orders are grouped automatically by IMO"
  },
  {
    number: "3",
    icon: TrendingDown,
    title: "Save",
    description: "Delivery cost is shared fairly when the pool closes"
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-16 text-center">How HarbourBee works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-sky-100 rounded-2xl flex items-center justify-center">
                    <Icon className="w-10 h-10 text-sky-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}