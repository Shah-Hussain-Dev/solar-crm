'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Edit, Plus, Trash2, Calendar, FileText, Send, PhoneCall, Sparkles, MessageSquare, Check, UserCheck
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { useAuthStore } from '@/shared/stores/authStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const leadId = params.id as string;

  const leads = useCRMStore((state) => state.leads);
  const users = useCRMStore((state) => state.users);
  const pipeline = useCRMStore((state) => state.pipeline);
  const updateLead = useCRMStore((state) => state.updateLead);
  const deleteLead = useCRMStore((state) => state.deleteLead);
  const addLeadNote = useCRMStore((state) => state.addLeadNote);
  const addSurvey = useCRMStore((state) => state.addSurvey);
  const addQuote = useCRMStore((state) => state.addQuote);

  const lead = leads.find((l) => l.id === leadId) || leads[0];

  const [currentStageId, setCurrentStageId] = useState(lead.stageId || 'stg-quote');
  const [followUpDate, setFollowUpDate] = useState(lead.industryData?.followUpDate || '');
  const [noteContent, setNoteContent] = useState('');
  const [surveyDate, setSurveyDate] = useState('');
  const [selectedTech, setSelectedTech] = useState('');

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  const handleSaveStatus = () => {
    updateLead(lead.id, {
      stageId: currentStageId,
      industryData: {
        ...lead.industryData,
        followUpDate: followUpDate
      }
    });
    alert('Lead status & follow-up updated!');
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent) return;
    addLeadNote(lead.id, noteContent, user?.id || 'usr-1');
    setNoteContent('');
  };

  const handleScheduleSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyDate || !selectedTech) {
      alert('Please select survey date and technician');
      return;
    }
    addSurvey({
      leadId: lead.id,
      technicianId: selectedTech,
      status: 'pending',
      scheduledDate: surveyDate,
      address: lead.industryData?.address || 'Flat 302, Shanti Residency, MG Road, Dharampeth, Nagpur, Maharashtra',
      answers: {
        shading: 'None',
        connectionType: 'Single-phase',
        roofType: 'Concrete Flat Roof',
        monthlyBill: lead.industryData?.monthlyBill || 5000,
        structureRequired: 'Standard Mount',
        estimatedCapacityKw: 5
      },
      photos: []
    });
    alert('Site Survey scheduled successfully!');
    router.push('/surveys');
  };

  const handleCreateQuotation = () => {
    const bill = lead.industryData?.monthlyBill || 5000;
    const systemSizeKw = Math.ceil(bill / 1000) || 5;
    const subtotal = systemSizeKw * 30000;
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;
    const netCost = grandTotal - 78000;

    const createdQuote = addQuote({
      leadId: lead.id,
      title: `${lead.name} - ${systemSizeKw}kW Solar Proposal`,
      version: 1,
      status: 'sent',
      items: [
        { productId: 'prod-1', name: 'Mono Solar Panels 500W', qty: systemSizeKw * 2, price: 10000, total: subtotal * 0.6 },
        { productId: 'prod-2', name: `Grid-Tie Inverter ${systemSizeKw}kW`, qty: 1, price: subtotal * 0.4, total: subtotal * 0.4 }
      ],
      subtotal: subtotal,
      discount: 0,
      subsidy: 78000,
      gst: gst,
      grandTotal: grandTotal,
      sentAt: new Date().toISOString()
    });

    router.push('/quotations');
  };

  const handleGenerateAiFollowup = () => {
    const text = `Hi ${lead.name}, this is ${user?.name || 'Girish'} from Solar CRM. Following up on your ${lead.industryData?.monthlyBill || 5000}/mo electricity bill inquiry. We have prepared a customized rooftop proposal with up to ₹78,000 govt subsidy. Let us know a convenient time to discuss!`;
    setAiMessage(text);
    setAiDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Back Link */}
      <div>
        <button
          onClick={() => router.push('/leads')}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Leads
        </button>
      </div>

      {/* Lead Title & Actions Header matching leads-details.png */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{lead.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            📍 {lead.industryData?.address || 'Flat 302, Shanti Residency, MG Road, Dharampeth, Nagpur, Maharashtra'} | ⚡ Rs. {lead.industryData?.monthlyBill || 5000} /mo
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => alert('Edit lead form')}
            variant="outline"
            size="sm"
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border-0 gap-1.5 font-medium"
          >
            <Edit className="h-4 w-4 text-slate-500" /> Edit
          </Button>

          <Button
            onClick={handleCreateQuotation}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium gap-1.5 shadow-sm"
          >
            <FileText className="h-4 w-4" /> Create Quotation
          </Button>

          <button
            onClick={() => {
              if (confirm('Delete lead?')) {
                deleteLead(lead.id);
                router.push('/leads');
              }
            }}
            className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            title="Delete Lead"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Details vs Right Activity & Notes Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Lead Status & Follow-up Date Box */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">LEAD STATUS</label>
                  <select
                    value={currentStageId}
                    onChange={(e) => setCurrentStageId(e.target.value)}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                  >
                    {pipeline.stages.map((stg) => (
                      <option key={stg.id} value={stg.id}>{stg.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">FOLLOW-UP DATE</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <Button
                    onClick={handleSaveStatus}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-medium"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Contact Information Card */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-6 text-xs">
              <div>
                <span className="uppercase font-bold text-slate-400 dark:text-slate-500 text-[10px] tracking-wider">MOBILE NUMBER</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">{lead.phone || '9012345678'}</p>
              </div>
              <div>
                <span className="uppercase font-bold text-slate-400 dark:text-slate-500 text-[10px] tracking-wider">EMAIL ADDRESS</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">{lead.email || 'vermarahul@gmail.com'}</p>
              </div>
              <div>
                <span className="uppercase font-bold text-slate-400 dark:text-slate-500 text-[10px] tracking-wider">LEAD SOURCE</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-1">{lead.source || 'Walk-in'}</p>
              </div>
              <div>
                <span className="uppercase font-bold text-slate-400 dark:text-slate-500 text-[10px] tracking-wider">ROOF OWNERSHIP</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-1">{lead.industryData?.roofType || 'Owned'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Site Surveys Schedule Box */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Site Surveys</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleScheduleSurvey} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">SURVEY DATE</label>
                  <input
                    type="datetime-local"
                    value={surveyDate}
                    onChange={(e) => setSurveyDate(e.target.value)}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">ASSIGN TECHNICIAN</label>
                  <select
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                    className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                  >
                    <option value="">Select Technician</option>
                    {users.filter(u => u.role === 'technician' || u.role === 'admin').map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                  >
                    Schedule
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* AI WhatsApp Follow-up Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/40 dark:to-blue-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-600 text-white p-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">AI WhatsApp Follow-up Generator</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Auto-compose smart follow-up message for {lead.name}</p>
              </div>
            </div>
            <Button
              onClick={handleGenerateAiFollowup}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
            >
              <MessageSquare className="h-4 w-4" /> Generate Script
            </Button>
          </div>

        </div>

        {/* Right Column: Activity & Notes */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Activity & Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
              
              <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                <textarea
                  rows={4}
                  placeholder="Add a quick note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
                />
                <Button
                  type="submit"
                  className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs py-2 border border-slate-300 dark:border-slate-700"
                >
                  Add Note
                </Button>
              </form>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 flex-1 overflow-y-auto max-h-80">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-150 dark:border-slate-700 space-y-1 text-xs">
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{note.content}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 dark:text-slate-500 text-xs italic py-8">No notes added yet.</p>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

      {/* AI WhatsApp Modal */}
      {aiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" /> WhatsApp Follow-up Draft
            </h3>
            <textarea
              rows={5}
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md text-xs outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAiDrawerOpen(false)}>Close</Button>
              <Button 
                onClick={() => {
                  window.open(`https://wa.me/${lead.phone}?text=${encodeURIComponent(aiMessage)}`, '_blank');
                  setAiDrawerOpen(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                Send via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
