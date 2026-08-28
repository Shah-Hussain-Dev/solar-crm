'use client';

import React, { useState } from 'react';
import { 
  Award, FileText, CheckCircle2, AlertCircle, Calendar, 
  Upload, Sparkles, Check, ChevronRight, BellRing
} from 'lucide-react';
import { useCRMStore, SubsidyTracker } from '@/shared/stores/mockDbStore';
import { useAuthStore } from '@/shared/stores/authStore';
import { useAlertStore } from '@/shared/stores/alertStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { formatCurrency } from '@/shared/utils/cn';

export default function SubsidyTrackerPage() {
  const { user } = useAuthStore();
  const subsidies = useCRMStore((state) => state.subsidies);
  const projects = useCRMStore((state) => state.projects);
  
  const updateSurvey = useCRMStore((state) => state.updateSurvey);

  // States
  const [selectedSubId, setSelectedSubId] = useState<string | null>(subsidies[0]?.id || null);
  const [reminderDateInput, setReminderDateInput] = useState('');
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

  const selectedSubsidy = subsidies.find(s => s.id === selectedSubId);
  const selectedProject = selectedSubsidy ? projects.find(p => p.id === selectedSubsidy.projectId) : null;

  // Toggle document upload checkmark
  const handleToggleDocument = (subId: string, docName: string) => {
    useCRMStore.setState(state => {
      const subsidies = state.subsidies.map(s => {
        if (s.id === subId) {
          const documentChecklist = s.documentChecklist.map(doc => {
            if (doc.name === docName) {
              return { ...doc, uploaded: !doc.uploaded, fileUrl: !doc.uploaded ? 'proof.pdf' : undefined };
            }
            return doc;
          });

          // If all documents uploaded, advance status to documents-uploaded
          const allDone = documentChecklist.every(d => d.uploaded);
          const newStatus = allDone ? ('documents-uploaded' as const) : s.status;

          return { ...s, documentChecklist, status: newStatus };
        }
        return s;
      });
      return { subsidies };
    });
    useAlertStore.getState().showAlert(`Document checklist updated for "${docName}"`, 'success');
  };

  // Status transition click
  const handleAdvanceStatus = (subId: string, nextStatus: SubsidyTracker['status']) => {
    useCRMStore.setState(state => {
      const subsidies = state.subsidies.map(s => {
        if (s.id === subId) {
          const statusHistory = [
            ...s.statusHistory,
            { status: nextStatus, updatedAt: new Date().toISOString(), updatedBy: user?.name || 'Admin' }
          ];
          return { ...s, status: nextStatus, statusHistory };
        }
        return s;
      });
      return { subsidies };
    });
    useAlertStore.getState().showAlert(`Subsidy approval status advanced to: ${nextStatus.replace('-', ' ')}`, 'success');
  };

  // Save reminder alert date
  const handleSaveReminder = () => {
    if (!selectedSubId || !reminderDateInput) return;
    useCRMStore.setState(state => {
      const subsidies = state.subsidies.map(s => {
        if (s.id === selectedSubId) {
          return { ...s, reminderDate: reminderDateInput };
        }
        return s;
      });
      return { subsidies };
    });
    setReminderDialogOpen(false);
    useAlertStore.getState().showAlert(`Alert: Subsidy status reminder logged for ${reminderDateInput}`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subsidy Approval Hub</h1>
          <p className="text-sm text-foreground/60">
            Audit PM Surya Ghar documents checklists, submit electricity board NOC certificates, and track incentive disbursed statuses.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Directory */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Active Submissions</CardTitle>
              <CardDescription>Grid-meter incentive tracking listings</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {subsidies.map((sub) => {
                  const prj = projects.find(p => p.id === sub.projectId);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`w-full p-4 hover:bg-muted/40 transition-colors text-left flex justify-between items-start ${
                        selectedSubId === sub.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                      }`}
                    >
                      <div className="space-y-1 max-w-[80%]">
                        <div className="font-semibold text-sm truncate">{prj?.name || 'Project installation'}</div>
                        <div className="text-xs text-foreground/60">Subsidy amount: {formatCurrency(sub.approvedAmount)}</div>
                        <div className="text-[10px] text-foreground/45">Approved limit: ₹1,48,000</div>
                      </div>
                      <Badge variant={sub.status === 'approved' ? 'success' : 'info'} className="capitalize text-[10px]">
                        {sub.status.replace('-', ' ')}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Audit Checklist details */}
        <div className="lg:col-span-2">
          {selectedSubsidy ? (
            <div className="space-y-6">
              <Card className="border-primary/20 bg-card">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-border/50 pb-4">
                  <div>
                    <CardTitle className="text-lg">Incentive Documents Audit</CardTitle>
                    <CardDescription>Solar Installation: {selectedProject?.name}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setReminderDialogOpen(true)}>
                      <BellRing className="h-4 w-4 mr-1.5" />
                      Set Alert
                    </Button>
                    <Badge className="capitalize text-xs bg-primary text-primary-foreground">
                      Status: {selectedSubsidy.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Documents checklist */}
                  <div>
                    <h3 className="text-xs font-bold uppercase text-foreground/50 mb-3">Checklist Upload Verification</h3>
                    <div className="space-y-3 text-sm">
                      {selectedSubsidy.documentChecklist.map((doc, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-center gap-2.5">
                            {doc.uploaded ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-amber-500" />
                            )}
                            <span className={`font-semibold ${doc.uploaded ? 'text-foreground' : 'text-foreground/60'}`}>
                              {doc.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {doc.fileUrl && (
                              <span className="text-xs text-primary font-medium hover:underline cursor-pointer flex items-center">
                                <FileText className="h-3.5 w-3.5 mr-1" />
                                {doc.fileUrl}
                              </span>
                            )}
                            <Button 
                              type="button" 
                              variant={doc.uploaded ? 'outline' : 'default'}
                              size="sm"
                              onClick={() => handleToggleDocument(selectedSubsidy.id, doc.name)}
                            >
                              {doc.uploaded ? 'Reset' : 'Upload Proof'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status workflow triggers */}
                  <div className="border-t border-border pt-4">
                    <h3 className="text-xs font-bold uppercase text-foreground/50 mb-3">Status Action Steppers</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={selectedSubsidy.status !== 'applied'}
                        onClick={() => handleAdvanceStatus(selectedSubsidy.id, 'documents-uploaded')}
                      >
                        Advance upload completed
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={selectedSubsidy.status !== 'documents-uploaded'}
                        onClick={() => handleAdvanceStatus(selectedSubsidy.id, 'approved')}
                      >
                        Approve subsidy claim
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={selectedSubsidy.status !== 'approved'}
                        onClick={() => handleAdvanceStatus(selectedSubsidy.id, 'disbursed')}
                      >
                        Mark cash disbursed
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status history log */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Incentive Status Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {selectedSubsidy.statusHistory.map((hist, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-border/50 pb-2">
                      <div>
                        <span className="font-semibold capitalize text-primary">{hist.status.replace('-', ' ')}</span>
                        <div className="text-[10px] text-foreground/45 mt-0.5">Approved by: {hist.updatedBy}</div>
                      </div>
                      <span className="text-foreground/60">{hist.updatedAt.split('T')[0]}</span>
                    </div>
                  ))}
                  {selectedSubsidy.reminderDate && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200/50 p-2.5 text-amber-800 text-[11px] flex items-center justify-between dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900 mt-2">
                      <span>Status reminder set: Follow-up claim before {selectedSubsidy.reminderDate}</span>
                      <BellRing className="h-4 w-4 shrink-0 animate-bounce" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center p-12 text-center border-dashed">
              <div className="max-w-xs space-y-3">
                <Award className="h-12 w-12 text-primary/45 mx-auto" />
                <h3 className="font-bold text-base text-foreground">Select Subsidy claim</h3>
                <p className="text-sm text-foreground/60">
                  Select a subsidy claim record to verify the documents checks and advance the approval phases.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Set Alert Reminder Dialog */}
      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogHeader>
          <DialogTitle>Set Subsidy Follow-up Reminder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-3 text-sm">
          <div className="space-y-1">
            <label className="text-xs font-semibold">Reminder Date *</label>
            <input
              type="date"
              required
              value={reminderDateInput}
              onChange={(e) => setReminderDateInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold">Purpose notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Call government subsidy nodal desk to verify NOC files status..."
              className="w-full rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setReminderDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveReminder} disabled={!reminderDateInput}>
            Set Alert
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
