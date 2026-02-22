import React from "react";
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";

export default function NetworkErrorState({ onRetry }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <WifiOff className="w-8 h-8 text-slate-500" />
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-3">Connection Issue</h2>
      <p className="text-slate-600 mb-6 leading-relaxed">
        Unable to connect. Check your internet connection and try again.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-left">
        <p className="text-sm text-slate-700">
          Your data is safe. No changes have been made.
        </p>
      </div>

      {onRetry && (
        <Button onClick={onRetry} className="w-full bg-sky-600 hover:bg-sky-700">
          Try Again
        </Button>
      )}
    </div>
  );
}