import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function LiveOperations({ operations }) {
  const columns = [
    {
      title: "Orders",
      link: "Orders",
      rows: [
        { label: "In Progress", value: operations.ordersInProgress, status: "blue" },
        { label: "Delayed", value: operations.ordersDelayed, status: "amber" },
        { label: "Completed Today", value: operations.ordersCompleted, status: "green" },
      ]
    },
    {
      title: "Pools",
      link: "Pools",
      rows: [
        { label: "Nearing Cutoff", value: operations.poolsNearCutoff, status: "amber" },
        { label: "Failed Today", value: operations.poolsFailed, status: "rose" },
        { label: "Completed Today", value: operations.poolsCompleted, status: "green" },
      ]
    },
    {
      title: "Deliveries",
      link: "Deliveries",
      rows: [
        { label: "Scheduled", value: operations.deliveriesScheduled, status: "blue" },
        { label: "Delayed", value: operations.deliveriesDelayed, status: "amber" },
        { label: "Completed", value: operations.deliveriesCompleted, status: "green" },
      ]
    }
  ];

  const statusColors = {
    blue: "text-sky-600 bg-sky-50",
    amber: "text-amber-600 bg-amber-50",
    rose: "text-rose-600 bg-rose-50",
    green: "text-emerald-600 bg-emerald-50"
  };

  return (
    <div className="px-6 mt-8">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">Live Operations Overview</h2>
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col.title} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <Link
              to={createPageUrl(col.link)}
              className="block px-4 py-3 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <h3 className="text-sm font-semibold text-slate-900">{col.title}</h3>
            </Link>
            <div className="divide-y divide-slate-100">
              {col.rows.map(row => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-slate-600">{row.label}</span>
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded ${statusColors[row.status]}`}>
                    {row.value || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}