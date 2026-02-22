import React from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

export default function SettingItem({ 
  name, 
  description, 
  type = "toggle", 
  value, 
  onChange, 
  options = [],
  isChanged = false,
  disabled = false 
}) {
  const renderControl = () => {
    switch (type) {
      case "toggle":
        return (
          <Switch 
            checked={value} 
            onCheckedChange={onChange}
            disabled={disabled}
          />
        );
      
      case "select":
        return (
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-48 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case "input":
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-64 h-9 text-sm"
            disabled={disabled}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start justify-between py-4 border-b border-slate-100 last:border-0">
      <div className="flex-1 pr-6">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-slate-900">{name}</h4>
          {isChanged && (
            <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <span>Unsaved</span>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="flex-shrink-0">
        {renderControl()}
      </div>
    </div>
  );
}