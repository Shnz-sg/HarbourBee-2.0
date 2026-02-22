import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorState({ 
  title = "Unable to complete request",
  message = "We encountered an issue processing your request. Your data is safe.",
  onRetry,
  fallbackLink = "Dashboard",
  fallbackLabel = "Return to Dashboard"
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-amber-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-3">{title}</h2>
      <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>

      <div className="flex flex-col gap-2">
        {onRetry && (
          <Button onClick={onRetry} className="w-full bg-sky-600 hover:bg-sky-700">
            Try Again
          </Button>
        )}
        <Link to={createPageUrl(fallbackLink)}>
          <Button variant="outline" className="w-full">
            {fallbackLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}