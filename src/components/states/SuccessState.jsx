import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SuccessState({ 
  title, 
  message, 
  nextSteps,
  actionLabel,
  actionLink,
  onDismiss
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-3">{title}</h2>
      <p className="text-slate-600 mb-4 leading-relaxed">{message}</p>
      
      {nextSteps && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-slate-700">{nextSteps}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {actionLink && actionLabel && (
          <Link to={createPageUrl(actionLink)}>
            <Button className="w-full bg-sky-600 hover:bg-sky-700">
              {actionLabel}
            </Button>
          </Link>
        )}
        {onDismiss && (
          <Button variant="outline" onClick={onDismiss} className="w-full">
            Close
          </Button>
        )}
      </div>
    </div>
  );
}