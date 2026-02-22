import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, Layers, Truck, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">No recent activity</p>
        </div>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case "order": return Package;
      case "pool": return Layers;
      case "delivery": return Truck;
      default: return Package;
    }
  };

  const getLink = (activity) => {
    switch (activity.object_type) {
      case "order": return createPageUrl("OrderDetail") + `?id=${activity.object_id}`;
      case "pool": return createPageUrl("PoolDetail") + `?id=${activity.object_id}`;
      case "delivery": return createPageUrl("DeliveryDetail") + `?id=${activity.object_id}`;
      default: return "#";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.slice(0, 5).map((activity, i) => {
          const Icon = getIcon(activity.object_type);
          
          return (
            <Link
              key={i}
              to={getLink(activity)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 truncate">{activity.description}</p>
                <p className="text-xs text-slate-500">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}