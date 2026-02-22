import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Users, Clock, ArrowRight } from "lucide-react";

export default function LivePoolTeaser() {
  const featuredPool = {
    vessel: "Hawks Liberty",
    imo: "9XXXXXX",
    progress: 72,
    participants: 6,
    cutoffHours: 18
  };

  const otherPools = [
    {
      vessel: "Ocean Pioneer",
      progress: 45,
      participants: 3,
      cutoffHours: 32
    },
    {
      vessel: "Pacific Star",
      progress: 38,
      participants: 2,
      cutoffHours: 26
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-10">Active delivery pools</h2>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* HERO POOL - LARGE */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-sky-900 to-slate-900 rounded-2xl p-8 shadow-2xl">
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full mb-3">
                  <span className="text-xs font-semibold text-green-300">Your vessel's pool</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{featuredPool.vessel}</h3>
                <p className="text-sm text-slate-400">IMO {featuredPool.imo}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-slate-300">{featuredPool.progress}% to free delivery</span>
                  <span className="text-emerald-400 font-semibold">Delivery fee dropping</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${featuredPool.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-lg font-semibold text-white">{featuredPool.participants}</span>
                  <span className="text-sm">participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg font-semibold text-white">{featuredPool.cutoffHours}h</span>
                  <span className="text-sm">left</span>
                </div>
              </div>

              <Link to={createPageUrl("Login")}>
                <button className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                  View pool
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* OTHER POOLS - SMALL STACK */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-600 mb-3">Other active pools</p>
            {otherPools.map((pool, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-slate-200"
              >
                <h4 className="font-semibold text-slate-900 mb-3">{pool.vessel}</h4>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${pool.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{pool.progress}% filled</span>
                  <span>⏳ {pool.cutoffHours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}