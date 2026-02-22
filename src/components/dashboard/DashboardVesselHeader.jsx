import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Anchor, AlertCircle } from "lucide-react";

export default function DashboardVesselHeader({ vessel, user, allVessels, canSelectVessel, onVesselChange }) {
  if (!vessel || !user) return null;

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Anchor className="w-5 h-5 text-sky-600" />
            
            {canSelectVessel && allVessels.length > 0 ? (
              <Select 
                value={vessel.id} 
                onValueChange={(id) => {
                  const selected = allVessels.find(v => v.id === id);
                  if (selected) onVesselChange(selected);
                }}
              >
                <SelectTrigger className="w-64 h-8 text-sm">
                  <SelectValue placeholder="Select vessel" />
                </SelectTrigger>
                <SelectContent>
                  {allVessels.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} {v.imo_number ? `(${v.imo_number})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div>
                <p className="text-sm font-medium text-slate-900">{vessel.name}</p>
                {vessel.imo_number && (
                  <p className="text-xs text-slate-500">IMO: {vessel.imo_number}</p>
                )}
              </div>
            )}

            <Badge variant="outline" className="text-xs">
              {user.role.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}