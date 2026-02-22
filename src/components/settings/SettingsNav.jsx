import React from "react";
import { Settings, Truck, Store, Users, Bell, DollarSign, Server, Plug, Shield, BarChart3, User } from "lucide-react";

export default function SettingsNav({ activeSection, onSectionChange, visibleSections }) {
  const allSections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "platform", label: "Platform", icon: Settings },
    { id: "operations", label: "Operations", icon: Truck },
    { id: "vendors", label: "Vendors", icon: Store },
    { id: "users", label: "Users & Access", icon: Users },
    { id: "finance", label: "Finance", icon: DollarSign },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "security", label: "Security", icon: Shield },
    { id: "reporting", label: "Reporting", icon: BarChart3 },
    { id: "system", label: "System", icon: Server }
  ];

  const sections = allSections.filter(s => visibleSections.includes(s.id));

  return (
    <nav className="w-48 flex-shrink-0">
      <div className="space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}