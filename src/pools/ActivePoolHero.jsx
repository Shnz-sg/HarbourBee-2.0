import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Users, Clock, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActivePoolHero({ pool, vessel }) {
  const navigate = useNavigate();
  const progress = Math.min((pool.order_count / 3) * 100, 100);
  const isFree = pool.order_count >= 3;
  
  // Mock data for now - replace with real calculation
  const estimatedFee = isFree ? 0 : (100 / pool.order_count).toFixed(2);
  const hoursRemaining = 18; // Mock - replace with real countdown

  return (
    <div className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Vessel Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-1">
          {vessel?.name || "Your Vessel"}
        </h3>
        <p className="text-sm text-slate-600">
          IMO {vessel?.imo_number || "9XXXXXX"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-slate-700">
            {isFree ? "Free delivery achieved!" : `${Math.round(progress)}% to free delivery`}
          </span>
          <span className="text-slate-600">
            {pool.order_count} / 3 participants
          </span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${isFree ? "bg-emerald-500" : "bg-sky-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/80 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-600 uppercase tracking-wide">Participants</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{pool.order_count}</p>
        </div>

        <div className="bg-white/80 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-600 uppercase tracking-wide">Cut-off in</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{hoursRemaining}h</p>
        </div>
      </div>

      {/* Current Fee Estimate */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 mb-1">Current delivery fee estimate</p>
            <p className="text-2xl font-bold text-slate-900">
              {isFree ? "Free" : `$${estimatedFee}`}
            </p>
          </div>
          {!isFree && (
            <div className="flex items-center gap-1.5 text-amber-600">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">may reduce</span>
            </div>
          )}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => navigate(createPageUrl("Products"))}
          className="flex-1 bg-sky-600 hover:bg-sky-700 h-11 text-base font-semibold"
        >
          Continue shopping
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate(createPageUrl("PoolDetail") + `?id=${pool.id}`)}
          className="h-11"
        >
          View pool details
        </Button>
      </div>
    </div>
  );
}