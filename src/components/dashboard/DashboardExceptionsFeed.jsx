import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DashboardExceptionsFeed({ exceptions, user, loading }) {
  if (loading) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Exceptions
        </h3>
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-slate-50 rounded animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (exceptions.length === 0) {
    return (
      <Card className="p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Exceptions
        </h3>
        <p className="text-xs text-emerald-600">All systems normal.</p>
      </Card>
    );
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: "bg-rose-100 text-rose-700",
      high: "bg-orange-100 text-orange-700",
      medium: "bg-amber-100 text-amber-700",
      low: "bg-blue-100 text-blue-700"
    };
    return colors[severity] || "bg-slate-100 text-slate-700";
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Exceptions
        </h3>
        {exceptions.length > 3 && (
          <Link to={createPageUrl("Exceptions")} className="text-xs text-sky-600 hover:underline">
            View all
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {exceptions.map(exception => (
          <Link
            key={exception.id}
            to={createPageUrl("ExceptionDetail") + `?id=${exception.id}`}
            className="block p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-medium text-slate-900 line-clamp-1 flex-1">{exception.title}</p>
              <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 ml-2" />
            </div>
            <div className="flex items-center gap-2 text-xs mb-1">
              <Badge className={getSeverityColor(exception.severity)} variant="secondary">
                {exception.severity}
              </Badge>
              <span className="text-slate-500 capitalize">{exception.status}</span>
            </div>
            {exception.detected_at && (
              <p className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(exception.detected_at), { addSuffix: true })}
              </p>
            )}
          </Link>
        ))}
      </div>
    </Card>
  );
}