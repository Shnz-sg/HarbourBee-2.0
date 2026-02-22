import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertCircle, Clock, User, FileText, Link as LinkIcon, Save } from "lucide-react";
import StatusBadge from "../components/shared/StatusBadge";
import ObjectLink from "../components/shared/ObjectLink";

export default function ExceptionDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const exceptionId = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: exception, isLoading } = useQuery({
    queryKey: ['exception-detail', exceptionId],
    queryFn: () => base44.entities.Exception.filter({ exception_id: exceptionId }).then(r => r[0]),
    enabled: !!exceptionId
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Exception.update(exception.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['exception-detail']);
      queryClient.invalidateQueries(['exceptions']);
      setEditingStatus(false);
      setEditingAssignment(false);
    }
  });

  useEffect(() => {
    if (exception) {
      setStatusValue(exception.status);
      setAssignedTo(exception.assigned_to || "");
    }
  }, [exception]);

  if (isLoading || !exception || !user) {
    return <div className="p-6">Loading...</div>;
  }

  const isOpsStaff = user.role === 'ops_staff';
  const isOpsAdmin = ['ops_admin', 'admin', 'super_admin'].includes(user.role);
  const isFinance = user.role === 'finance' || user.role === 'admin';
  const isSuperAdmin = user.role === 'super_admin';

  const canAcknowledge = isOpsStaff && exception.status === 'open';
  const canChangeStatus = isOpsAdmin || isSuperAdmin;
  const canAssign = isOpsAdmin || isSuperAdmin;
  const canResolve = (isOpsAdmin || isSuperAdmin || isFinance) && exception.status !== 'closed';
  const canLock = isSuperAdmin && exception.status === 'resolved';

  const severityConfig = {
    critical: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: 'text-red-600' },
    high: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', icon: 'text-orange-600' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' },
    low: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', icon: 'text-slate-500' }
  };

  const config = severityConfig[exception.severity] || severityConfig.low;

  const handleAcknowledge = () => {
    updateMutation.mutate({ 
      status: 'acknowledged',
      acknowledged_at: new Date().toISOString()
    });
  };

  const handleStatusChange = () => {
    updateMutation.mutate({ status: statusValue });
  };

  const handleAssignmentChange = () => {
    updateMutation.mutate({ assigned_to: assignedTo || null });
  };

  const handleResolve = () => {
    updateMutation.mutate({ 
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: user.email
    });
  };

  const handleLock = () => {
    updateMutation.mutate({ status: 'closed' });
  };

  const ageInHours = Math.floor((new Date() - new Date(exception.detected_at || exception.created_date)) / (1000 * 60 * 60));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(createPageUrl('Exceptions'))}
          className="text-slate-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Exceptions
        </Button>
      </div>

      {/* Exception Card */}
      <div className={`border-2 ${config.border} rounded-lg overflow-hidden`}>
        <div className={`${config.bg} px-6 py-4 border-b-2 ${config.border}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-6 h-6 ${config.icon} flex-shrink-0 mt-0.5`} />
              <div>
                <h1 className="text-xl font-semibold text-slate-900 mb-1">{exception.title}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${config.text} bg-white`}>
                    {exception.severity}
                  </span>
                  <StatusBadge status={exception.status} />
                  {exception.exception_type && (
                    <span className="text-xs text-slate-600">Type: {exception.exception_type}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div className="flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" />
                <span>Open {ageInHours}h</span>
              </div>
              <div className="mt-1">Detected {new Date(exception.detected_at || exception.created_date).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 space-y-6">
          {/* Description */}
          {exception.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{exception.description}</p>
            </div>
          )}

          {/* Linked Object */}
          {exception.object_type && exception.object_id && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4" />
                Related Object
              </h3>
              <ObjectLink objectType={exception.object_type} objectId={exception.object_id} />
            </div>
          )}

          {/* Status Management */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Status & Assignment</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Status</label>
                {editingStatus && canChangeStatus ? (
                  <div className="flex items-center gap-2">
                    <Select value={statusValue} onValueChange={setStatusValue}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="acknowledged">Acknowledged</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="awaiting_external">Awaiting External</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        {isSuperAdmin && <SelectItem value="closed">Closed</SelectItem>}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={handleStatusChange} disabled={updateMutation.isPending}>
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingStatus(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <StatusBadge status={exception.status} />
                    {canChangeStatus && (
                      <Button size="sm" variant="ghost" onClick={() => setEditingStatus(true)} className="text-xs h-6">
                        Change
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Assignment */}
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Assigned To</label>
                {editingAssignment && canAssign ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="user@email.com"
                      className="flex-1 h-8 px-2 text-xs border border-slate-200 rounded-md"
                    />
                    <Button size="sm" onClick={handleAssignmentChange} disabled={updateMutation.isPending}>
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingAssignment(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-900">
                      {exception.assigned_to || <span className="text-slate-400">Unassigned</span>}
                    </span>
                    {canAssign && (
                      <Button size="sm" variant="ghost" onClick={() => setEditingAssignment(true)} className="text-xs h-6">
                        {exception.assigned_to ? 'Change' : 'Assign'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-slate-200 pt-6 flex items-center gap-3 flex-wrap">
            {canAcknowledge && (
              <Button size="sm" onClick={handleAcknowledge} disabled={updateMutation.isPending}>
                Acknowledge
              </Button>
            )}
            {canResolve && exception.status !== 'resolved' && (
              <Button size="sm" variant="outline" onClick={handleResolve} disabled={updateMutation.isPending}>
                Mark Resolved
              </Button>
            )}
            {canLock && (
              <Button size="sm" variant="outline" onClick={handleLock} disabled={updateMutation.isPending}>
                Lock & Close
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Exception Metadata</h3>
        <dl className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <dt className="text-slate-500 mb-1">Exception ID</dt>
            <dd className="text-slate-900 font-mono">{exception.exception_id}</dd>
          </div>
          <div>
            <dt className="text-slate-500 mb-1">Source System</dt>
            <dd className="text-slate-900">{exception.source_system || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-slate-500 mb-1">Auto-Generated</dt>
            <dd className="text-slate-900">{exception.auto_generated ? 'Yes' : 'No'}</dd>
          </div>
          <div>
            <dt className="text-slate-500 mb-1">Escalation Count</dt>
            <dd className="text-slate-900">{exception.escalation_count || 0}</dd>
          </div>
          {exception.resolved_at && (
            <>
              <div>
                <dt className="text-slate-500 mb-1">Resolved At</dt>
                <dd className="text-slate-900">{new Date(exception.resolved_at).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-slate-500 mb-1">Resolved By</dt>
                <dd className="text-slate-900">{exception.resolved_by}</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}