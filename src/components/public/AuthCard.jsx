import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Anchor } from "lucide-react";

export default function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to={createPageUrl("Landing")} className="inline-flex items-center gap-2 mb-6">
            <Anchor className="w-8 h-8 text-sky-600" />
            <span className="text-2xl font-semibold text-slate-900">HarbourBee</span>
          </Link>
          {title && <h1 className="text-2xl font-semibold text-slate-900 mb-2">{title}</h1>}
          {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}