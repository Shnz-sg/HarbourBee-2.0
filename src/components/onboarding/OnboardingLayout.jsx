import React from "react";
import { Anchor } from "lucide-react";

export default function OnboardingLayout({ children, step, totalSteps }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="w-6 h-6 text-sky-600" />
            <span className="text-xl font-semibold text-slate-900">HarbourBee</span>
          </div>
          {step && (
            <span className="text-sm text-slate-500">
              Step {step} of {totalSteps}
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}