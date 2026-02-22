import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Anchor } from "lucide-react";

export default function PublicLayout({ children, showFooter = true }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("Landing")} className="flex items-center gap-2">
            <Anchor className="w-6 h-6 text-sky-600" />
            <span className="text-xl font-semibold text-slate-900">HarbourBee</span>
          </Link>
          <Link 
            to={createPageUrl("Login")} 
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-white border-t border-slate-200 mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Anchor className="w-5 h-5 text-sky-600" />
                  <span className="font-semibold text-slate-900">HarbourBee</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Maritime supply delivery made simple through pooled logistics.
                </p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Company</h4>
                <div className="space-y-2">
                  <Link to={createPageUrl("Help")} className="block text-sm text-slate-600 hover:text-slate-900">
                    Help & FAQ
                  </Link>
                  <Link to={createPageUrl("Contact")} className="block text-sm text-slate-600 hover:text-slate-900">
                    Contact
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Legal</h4>
                <div className="space-y-2">
                  <Link to={createPageUrl("Terms")} className="block text-sm text-slate-600 hover:text-slate-900">
                    Terms & Conditions
                  </Link>
                  <Link to={createPageUrl("Privacy")} className="block text-sm text-slate-600 hover:text-slate-900">
                    Privacy Policy
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Support</h4>
                <p className="text-sm text-slate-600">support@harbourbee.com</p>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} HarbourBee. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}