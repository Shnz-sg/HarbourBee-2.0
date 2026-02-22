import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function FinancialExceptions({ exceptions, userRole }) {
  if (exceptions.length === 0) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700';
      case 'monitoring': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Card className="border-rose-200 bg-rose-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          Financial Exceptions
          <Badge variant="secondary" className="ml-auto">{exceptions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {exceptions.slice(0, 5).map((ex) => (
            <Link
              key={ex.id}
              to={createPageUrl(`ExceptionDetail?id=${ex.id}`)}
              className="block p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getSeverityColor(ex.severity)}>
                      {ex.severity}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(ex.status)}>
                      {ex.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{ex.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{ex.message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {ex.amount_minor && (
                    <p className="text-sm font-semibold text-slate-900">
                      ${(ex.amount_minor / 100).toFixed(2)}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">
                    {new Date(ex.detected_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {exceptions.length > 5 && (
            <Link
              to={createPageUrl('Exceptions')}
              className="block text-center py-2 text-sm text-sky-600 hover:text-sky-700 font-medium"
            >
              View all {exceptions.length} exceptions →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}