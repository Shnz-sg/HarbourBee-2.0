import React from "react";

export default function ReportCategory({ title, description, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-slate-600" />}
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}