import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ConfirmChangesDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  changes = [] 
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Settings Changes</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>You are about to apply the following changes:</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
              {changes.map((change, index) => (
                <div key={index} className="text-xs">
                  <span className="font-medium text-slate-900">{change.setting}</span>
                  <div className="text-slate-600 mt-0.5">
                    From: <span className="font-mono">{String(change.oldValue)}</span>
                    {" → "}
                    To: <span className="font-mono">{String(change.newValue)}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-slate-500">These changes will take effect immediately.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Apply Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}