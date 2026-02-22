import React from "react";
import { Layers, Ship, Clock, DollarSign } from "lucide-react";

const values = [
  { icon: Layers, label: "Automatic pooling by vessel" },
  { icon: Ship, label: "Launch-boat delivery" },
  { icon: Clock, label: "Clear cut-off times" },
  { icon: DollarSign, label: "Fair delivery fee sharing" },
];

export default function ValueStrip() {
  return (
    <section className="border-y border-slate-200 bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-sky-600" />
                </div>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}