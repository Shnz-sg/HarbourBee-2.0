import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No data found", icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <Icon className="w-10 h-10 mb-3 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}