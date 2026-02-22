import React from "react";
import { Badge } from "@/components/ui/badge";

export default function ReportLayerBadge({ layer }) {
  const config = {
    operational: {
      label: "Operational",
      className: "bg-sky-50 text-sky-700 border-sky-200"
    },
    financial: {
      label: "Financial",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    strategic: {
      label: "Strategic",
      className: "bg-purple-50 text-purple-700 border-purple-200"
    }
  };

  const { label, className } = config[layer] || config.operational;

  return (
    <Badge className={`text-[10px] px-1.5 py-0 ${className}`}>
      {label}
    </Badge>
  );
}