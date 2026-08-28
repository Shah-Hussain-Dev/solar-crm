'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FolderCheck, CreditCard, Wrench, Calendar, 
  Sparkles, CheckCircle2, AlertCircle, Send, 
  LogOut, ShieldAlert, ArrowLeft, ArrowRight, UserCheck
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { useAlertStore } from '@/shared/stores/alertStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency } from '@/shared/utils/cn';

export default function CustomerPortal() {
  const customers = useCRMStore((state) => state.customers);
  const projects = useCRMStore((state) => state.projects);
  const payments = useCRMStore((state) => state.payments);
  const amc = useCRMStore((state) => state.amc);
  const tickets = useCRMStore((state) => state.tickets);
  const branding = useCRMStore((state) => state.branding);

  // Actions
  const addTicket = useCRMStore((state) => state.addTicket);

  // Portal Authentication Simulation
  const [selectedCustId, setSelectedCustId] = useState<string | null>(customers[0]?.id || null);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);

  const activeCustomer = customers.find(c => c.id === selectedCustId);
  const activeProjects = activeCustomer ? projects.filter(p => activeCustomer.activeProjects.includes(p.id)) : [];
  const activePayments = activeCustomer ? payments.filter(p => p.customerId === activeCustomer.id) : [];
  const activeAmc = activeCustomer ? amc.filter(a => a.customerId === activeCustomer.id) : [];
  const activeTickets = activeCustomer ? tickets.filter(t => t.customerId === activeCustomer.id) : [];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustId || !ticketTitle.trim() || !ticketDesc.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const activeProjId = activeProjects[0]?.id || 'proj-1';
      const defaultDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      addTicket({
        customerId: selectedCustId,
        projectId: activeProjId,
        title: ticketTitle.trim(),
        description: ticketDesc.trim(),
        priority: ticketPriority,
        status: 'open',
        assigneeId: 'usr-2', // Default assignee
        dueDate: defaultDueDate,
      });
      setTicketTitle('');
      setTicketDesc('');
      setLoading(false);
      useAlertStore.getState().showAlert('Support ticket created successfully. Our team will review it shortly.', 'success');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* Top Brand Banner */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">{branding.companyName} <span className="font-light text-slate-400">Client Portal</span></span>
        </div>

        {/* Portal Authentication Simulator Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg p-1 px-2.5 text-xs font-semibold text-slate-700">
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            <span className="hidden sm:inline">Simulated client:</span>
            <select
              value={selectedCustId || ''}
              onChange={(e) => setSelectedCustId(e.target.value || null)}
              className="bg-transparent outline-none border-none font-bold text-slate-800 cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>
          <Link href="/">
            <Button size="sm" variant="outline" className="text-xs h-8 flex items-center gap-1.5">
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exit Portal</span>
            </Button>
          </Link>
        </div>
      </header>

      {activeCustomer ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8 text-left animate-in fade-in duration-300">
          
          {/* Welcome Profile Summary */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl -z-10" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <Badge variant="outline" className="border-primary/40 text-primary-foreground/90 bg-primary/15 text-xs font-semibold">
                  Client Dashboard
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">{activeCustomer.name}</h1>
                <p className="text-slate-400 text-sm mt-1">{activeCustomer.company} · {activeCustomer.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-l border-slate-800 pl-6 shrink-0 text-sm">
                <div>
                  <span className="text-slate-400 text-xs">Total Payments Paid:</span>
                  <div className="text-lg font-bold text-green-400 mt-0.5 tabular-nums">
                    {formatCurrency(activeCustomer.totalPaid || 0)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Outstanding Balance:</span>
                  <div className="text-lg font-bold text-red-400 mt-0.5 tabular-nums">
                    {formatCurrency(activeCustomer.totalOutstanding || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Projects Tracker */}
          <Card className="border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <FolderCheck className="h-5 w-5 text-primary" />
                <span>Solar System Installation Progress</span>
              </CardTitle>
              <CardDescription>Real-time status updates of active project stages and requirements.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {activeProjects.map((p) => {
                const totalM = p.milestones.length;
                const completedM = p.milestones.filter(m => m.status === 'completed').length;
                const percentage = Math.round((completedM / totalM) * 100);
                
                return (
                  <div key={p.id} className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-slate-800">{p.name}</h3>
                        <p className="text-xs text-slate-500">{p.systemSizeKw}kW capacity · Status: <span className="capitalize font-semibold text-primary">{p.status}</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600">{completedM}/{totalM} Milestones ({percentage}%)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>

                    {/* Milestones Stepper */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                      {p.milestones.map((m, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-xl border text-center space-y-1 ${
                            m.status === 'completed' 
                              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' 
                              : 'bg-card border-slate-200 text-slate-500'
                          }`}
                        >
                          <div className="mx-auto h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white border">
                            {m.status === 'completed' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : index + 1}
                          </div>
                          <div className="text-[10px] font-bold truncate">{m.name}</div>
                          <div className="text-[9px] opacity-75">{m.status === 'completed' ? 'Completed' : 'Pending'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {activeProjects.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-sm">No active installation projects linked to this profile.</div>
              )}
            </CardContent>
          </Card>

          {/* Ledger & Payments Grid */}
          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            
            {/* Payment Ledger */}
            <Card className="md:col-span-2 flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <span>Invoices & Milestone Payments</span>
                </CardTitle>
                <CardDescription>Complete billing ledger schedule for this installation account.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1 divide-y divide-border">
                {activePayments.map((pmt) => (
                  <div key={pmt.id} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{pmt.title}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">Due: {pmt.dueDate} {pmt.paidDate && `· Paid: ${pmt.paidDate}`}</div>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      <div>
                        <div className="font-bold text-sm tabular-nums text-slate-900">{formatCurrency(pmt.amount)}</div>
                        <Badge variant={pmt.status === 'paid' ? 'success' : 'outline'} className="text-[9px] px-1 py-0 mt-0.5 capitalize">
                          {pmt.status}
                        </Badge>
                      </div>
                      {pmt.status !== 'paid' && (
                        <Button 
                          size="sm" 
                          onClick={() => useAlertStore.getState().showAlert(`Simulated payment window: Pay ₹${pmt.amount.toLocaleString()} via UPI gateway.`, 'info')}
                          className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow"
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {activePayments.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-sm">No billing records found.</div>
                )}
              </CardContent>
            </Card>

            {/* AMC Schedule */}
            <Card className="h-fit">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Annual Maintenance (AMC)</span>
                </CardTitle>
                <CardDescription>SLA maintenance package details.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {activeAmc.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">SLA Active Guard</span>
                      <Badge variant="success" className="text-[9px]">Active</Badge>
                    </div>
                    <div className="flex justify-between"><span className="text-slate-500">Valid to:</span> <span className="font-semibold">{item.endDate}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Contract Value:</span> <span className="font-semibold text-primary">{formatCurrency(item.value)}</span></div>
                    <div className="text-[10px] text-slate-400 leading-relaxed pt-1 border-t border-slate-200">
                      Covers quarterly inverter checkups, cleanings, and emergency callouts.
                    </div>
                  </div>
                ))}
                {activeAmc.length === 0 && (
                  <div className="text-center py-10 text-slate-500 text-xs">No active AMC agreements.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Support Tickets System */}
          <div className="grid gap-6 md:grid-cols-12 items-stretch">
            
            {/* Active Tickets List */}
            <Card className="md:col-span-7 flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-orange-500" />
                  <span>Your Support History</span>
                </CardTitle>
                <CardDescription>Track resolution progress of technical tickets.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1 divide-y divide-border">
                {activeTickets.map((tkt) => (
                  <div key={tkt.id} className="p-4 text-xs space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-800 text-sm truncate max-w-[250px]">{tkt.title}</span>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="text-[8px] uppercase">{tkt.priority} priority</Badge>
                        <Badge variant={tkt.status === 'resolved' ? 'success' : 'outline'} className="text-[9px] px-1 py-0 capitalize">
                          {tkt.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[11px]">{tkt.description}</p>
                    {tkt.resolutionNotes && (
                      <div className="mt-2 p-2 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-600">
                        <span className="font-bold text-primary">Resolution Notes: </span> {tkt.resolutionNotes}
                      </div>
                    )}
                  </div>
                ))}
                {activeTickets.length === 0 && (
                  <div className="text-center py-12 text-slate-500 text-sm">No ticket logs filed under this account.</div>
                )}
              </CardContent>
            </Card>

            {/* Create New Ticket Form */}
            <Card className="md:col-span-5 h-fit">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span>Report Maintenance Issue</span>
                </CardTitle>
                <CardDescription>File a ticket to assign a technician to your site.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600">Issue Title *</label>
                    <input
                      type="text"
                      required
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      placeholder="e.g. Inverter displaying Error 40"
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600">Description *</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      placeholder="Describe the issue. Include panel issues, solar yields, or mechanical concerns..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-600">Priority Level</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 outline-none cursor-pointer"
                    >
                      <option value="low">Low - Routine checkup</option>
                      <option value="medium">Medium - Yield dropped slightly</option>
                      <option value="high">High - Complete power outage</option>
                    </select>
                  </div>

                  <Button type="submit" loading={loading} className="w-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-1.5 h-9 font-semibold">
                    <span>Submit Service Request</span>
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      ) : (
        <div className="text-center py-20 text-slate-500 text-sm">Please register at least one customer account to view the portal.</div>
      )}
    </div>
  );
}
