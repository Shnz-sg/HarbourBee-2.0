import React from "react";

export default function LoadingSkeleton({ type = "card", count = 3 }) {
  if (type === "card") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="hb-skeleton w-10 h-10 rounded-lg" />
              <div className="flex-1">
                <div className="hb-skeleton h-4 w-24 mb-2" />
                <div className="hb-skeleton h-3 w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="hb-skeleton h-3 w-full" />
              <div className="hb-skeleton h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="hb-skeleton w-8 h-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="hb-skeleton h-3 w-48" />
                <div className="hb-skeleton h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="hb-skeleton h-3 w-20" />
            ))}
          </div>
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border-b border-slate-100 p-4 last:border-0">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="hb-skeleton h-3" style={{ width: `${60 + Math.random() * 40}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}