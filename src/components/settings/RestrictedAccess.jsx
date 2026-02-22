import React from "react";
import { Lock } from "lucide-react";

export default function RestrictedAccess({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-base font-medium text-slate-900 mb-2">Limited Access</h3>
      <p className="text-sm text-slate-500 text-center max-w-md">
        {message || "You do not have permission to access these settings."}
      </p>
    </div>
  );
}