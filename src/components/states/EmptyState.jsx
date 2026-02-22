import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function EmptyState({ 
  icon: Icon, 
  title, 
  message, 
  actionLabel, 
  actionLink,
  variant = "default" 
}) {
  return (
    <div className={`text-center py-12 ${
      variant === "compact" ? "py-8" : "py-12"
    }`}>
      {Icon && (
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7 text-slate-400" />
        </div>
      )}
      <h3 className={`font-semibold text-slate-900 mb-2 ${
        variant === "compact" ? "text-base" : "text-lg"
      }`}>
        {title}
      </h3>
      <p className={`text-slate-600 mb-6 max-w-md mx-auto leading-relaxed ${
        variant === "compact" ? "text-sm" : "text-sm"
      }`}>
        {message}
      </p>
      {actionLabel && actionLink && (
        <Link to={createPageUrl(actionLink)}>
          <Button variant="outline" size={variant === "compact" ? "sm" : "default"}>
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}