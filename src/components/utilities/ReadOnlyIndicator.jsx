import React from "react";
import { Eye } from "lucide-react";

export default function ReadOnlyIndicator({ message = "Read-only view" }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2">
      <Eye className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-xs text-slate-600">{message}</span>
    </div>
  );
}