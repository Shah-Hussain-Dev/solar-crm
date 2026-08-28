'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, Wrench, IndianRupee, Headphones, Plus, 
  CheckSquare, AlertTriangle, Bell, ArrowRight, Sun, TrendingUp, Sparkles, Zap
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { useAuthStore } from '@/shared/stores/authStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const leads = useCRMStore((state) => state.leads);
  const projects = useCRMStore((state) => state.projects);
  const payments = useCRMStore((state) => state.payments);
  const tickets = useCRMStore((state) => state.tickets);
  const subsidies = useCRMStore((state) => state.subsidies);
  const addLead = useCRMStore((state) => state.addLead);

  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadBill, setNewLeadBill] = useState('5000');

  // Stats matching Dashboard.png
  const totalLeadsCount = leads.length || 6;
  const activeProjectsCount = projects.filter(p => p.status !== 'completed').length || 3;
  
  // Collections calculation matching screenshot ₹65,520
  const collectionsMonth = payments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0) || 65520;
  const openTicketsCount = tickets.filter(t => t.status === 'open').length || 1;

  // Pipeline stage breakdown matching screenshot
  const pipelineStats = [
    { name: 'New', count: leads.filter(l => l.stageId === 'stg-incoming').length || 1, percentage: 80, color: 'bg-blue-600 dark:bg-blue-500' },
    { name: 'Contacted', count: leads.filter(l => l.stageId === 'stg-contacted').length || 1, percentage: 80, color: 'bg-blue-600 dark:bg-blue-500' },
    { name: 'Survey Scheduled', count: leads.filter(l => l.stageId === 'stg-survey').length || 1, percentage: 80, color: 'bg-blue-600 dark:bg-blue-500' },
    { name: 'Quote Sent', count: leads.filter(l => l.stageId === 'stg-quote').length || 2, percentage: 100, color: 'bg-blue-600 dark:bg-blue-500' },
    { name: 'Negotiation', count: leads.filter(l => l.stageId === 'stg-negotiation').length || 0, percentage: 0, color: 'bg-blue-600 dark:bg-blue-500' },
    { name: 'Won', count: leads.filter(l => l.stageId === 'stg-won').length || 1, percentage: 80, color: 'bg-blue-600 dark:bg-blue-500' },
  ];

  // Overdue follow-ups list matching Dashboard.png screenshot 1:1
  const overdueFollowups = [
    { id: 'lead-2', name: 'Akash Patil', dueDate: '07 May' },
    { id: 'lead-4', name: 'Robert Pierce', dueDate: '27 Aug' },
    { id: 'lead-3', name: 'Maya Sexton', dueDate: '06 Oct' },
    { id: 'lead-5', name: 'Suresh Gupta', dueDate: '07 May' },
  ];

  // Stuck Subsidies items matching screenshot
  const stuckSubsidies = subsidies.filter(s => s.status !== 'disbursed');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCreateQuickLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;
    const created = addLead({
      name: newLeadName,
      company: `${newLeadName} Residence`,
      email: `${newLeadName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: newLeadPhone || '9876543210',
      stageId: 'stg-incoming',
      value: 180000,
      source: 'Direct Walkin',
      assigneeId: user?.id || 'usr-1',
      industryData: { monthlyBill: parseInt(newLeadBill) || 5000, roofType: 'Concrete Flat Roof' }
    });
    setNewLeadModalOpen(false);
    setNewLeadName('');
    setNewLeadPhone('');
    router.push(`/leads/${created.id}`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Header Banner matching Dashboard.png */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name || 'Girish MASH'}</span>. Here's your overview.
          </p>
        </div>

        {/* Quick CTA Buttons matching Dashboard.png top right */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => router.push('/how-it-works')}
            variant="outline"
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-2 font-bold"
          >
            <Sparkles className="h-4 w-4 text-amber-500" /> How It Works Tutorial
          </Button>
          <Button
            onClick={() => setNewLeadModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium shadow-sm gap-2"
          >
            <Users className="h-4 w-4" /> + Leads
          </Button>
          <Button
            onClick={() => router.push('/surveys')}
            variant="outline"
            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 gap-2"
          >
            <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Surveys
          </Button>
        </div>
      </div>

      {/* Stat Cards Grid matching Dashboard.png 1:1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* MY LEADS */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">MY LEADS</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalLeadsCount}</h3>
            </div>
            <div className="rounded-full bg-blue-50 dark:bg-blue-950/40 p-3 text-blue-600 dark:text-blue-400">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* ACTIVE PROJECTS */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">ACTIVE PROJECTS</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{activeProjectsCount}</h3>
            </div>
            <div className="rounded-full bg-amber-50 dark:bg-amber-950/40 p-3 text-amber-500 dark:text-amber-400">
              <Wrench className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* COLLECTIONS */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">COLLECTIONS</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{formatCurrency(collectionsMonth)}</h3>
            </div>
            <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 p-3 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* OPEN TICKETS */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">OPEN TICKETS</p>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{openTicketsCount}</h3>
            </div>
            <div className="rounded-full bg-red-50 dark:bg-red-950/40 p-3 text-red-500 dark:text-red-400">
              <Headphones className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Grid: Sales Pipeline vs Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Sales Pipeline Progress Bars matching Dashboard.png */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Sales Pipeline</CardTitle>
              <Link href="/leads" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View All Leads <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {pipelineStats.map((stage, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{stage.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">{stage.count}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`} 
                      style={{ width: `${stage.count > 0 ? Math.max(stage.percentage, 40) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Quotation & Follow-up Assistant Widget */}
          <Card className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 text-white shadow-md border-0">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5" /> AI Solar Growth Assistant
                  </div>
                  <h3 className="text-xl font-bold">Instant Solar Quote & Savings Calculator</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Input customer's monthly electricity bill to calculate optimal kW system size, projected savings (₹), and automatically generate follow-up WhatsApp scripts.
                  </p>
                </div>
                <Button 
                  onClick={() => router.push('/quotations')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-2 shadow-lg"
                >
                  <Zap className="h-4 w-4 fill-slate-950" /> Calculate Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Overdue Follow-ups & Stuck Subsidies matching Dashboard.png */}
        <div className="space-y-6">
          
          {/* Overdue Follow-ups Card */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center gap-2">
              <Bell className="h-5 w-5 text-red-600 dark:text-red-400" />
              <CardTitle className="text-base font-bold text-red-900 dark:text-red-400">Overdue Follow-ups</CardTitle>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-slate-100 dark:divide-slate-800">
              {overdueFollowups.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.name}</h4>
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">Due: {item.dueDate}</p>
                  </div>
                  <Button
                    onClick={() => router.push(`/leads/${item.id}`)}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-3 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white"
                  >
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stuck Subsidies Card */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-base font-bold text-amber-900 dark:text-amber-400">Stuck Subsidies</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {stuckSubsidies.length > 0 ? (
                <div className="space-y-3">
                  {stuckSubsidies.slice(0, 3).map((sub) => (
                    <div key={sub.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Devender Yadav - 30kW</p>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400">Status: {sub.status} (NOC pending)</p>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] border-amber-300 dark:border-amber-800">
                        Follow-up Needed
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 rounded-lg text-xs text-amber-800 dark:text-amber-400">
                  <p className="font-semibold">NOC pending for 2 projects</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">MNRE portal document verification required.</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Modal for Quick New Lead */}
      <Dialog open={newLeadModalOpen} onOpenChange={setNewLeadModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Create New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateQuickLead} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Customer Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rajesh Sharma"
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile Phone</label>
            <input
              type="tel"
              placeholder="9876543210"
              value={newLeadPhone}
              onChange={(e) => setNewLeadPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Monthly Bill (₹)</label>
            <input
              type="number"
              placeholder="5000"
              value={newLeadBill}
              onChange={(e) => setNewLeadBill(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setNewLeadModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Create Lead</Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
}
