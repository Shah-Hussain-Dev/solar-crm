'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, Search, Filter, Trash2, Eye, Calendar, Sparkles, MessageSquare, PhoneCall, Upload
} from 'lucide-react';
import { useCRMStore, Lead } from '@/shared/stores/mockDbStore';
import { useAuthStore } from '@/shared/stores/authStore';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

export default function LeadsListPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const leads = useCRMStore((state) => state.leads);
  const pipeline = useCRMStore((state) => state.pipeline);
  const addLead = useCRMStore((state) => state.addLead);
  const deleteLead = useCRMStore((state) => state.deleteLead);
  const users = useCRMStore((state) => state.users);

  // Tab view switcher: 'list' (default matching screenshot) vs 'kanban'
  const [activeView, setActiveView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [execFilter, setExecFilter] = useState('all');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadSource, setNewLeadSource] = useState('Walk-in');
  const [newLeadState, setNewLeadState] = useState('Maharashtra');
  const [newLeadBill, setNewLeadBill] = useState('5000');

  // Filtered leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.phone.includes(searchQuery) || 
                          l.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.stageId === statusFilter;
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    const matchesState = stateFilter === 'all' || (l.industryData?.state || 'Maharashtra') === stateFilter;
    const matchesExec = execFilter === 'all' || l.assigneeId === execFilter;
    return matchesSearch && matchesStatus && matchesSource && matchesState && matchesExec;
  });

  const getStatusBadge = (stageId: string) => {
    switch(stageId) {
      case 'stg-quote':
        return <Badge className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-0 font-medium px-3 py-1 rounded-full">Quote Sent</Badge>;
      case 'stg-survey':
        return <Badge className="bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-0 font-medium px-3 py-1 rounded-full">Survey Scheduled</Badge>;
      case 'stg-won':
        return <Badge className="bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-0 font-medium px-3 py-1 rounded-full">Won</Badge>;
      case 'stg-lost':
        return <Badge className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-0 font-medium px-3 py-1 rounded-full">Lost</Badge>;
      default:
        return <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-0 font-medium px-3 py-1 rounded-full">New</Badge>;
    }
  };

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;
    const created = addLead({
      name: newLeadName,
      company: `${newLeadName} Residence`,
      email: newLeadEmail || `${newLeadName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: newLeadPhone || '9876543210',
      stageId: 'stg-incoming',
      value: 180000,
      source: newLeadSource,
      assigneeId: user?.id || 'usr-1',
      industryData: { 
        monthlyBill: parseInt(newLeadBill) || 5000, 
        roofType: 'Concrete Flat Roof',
        state: newLeadState
      }
    });
    setCreateModalOpen(false);
    router.push(`/leads/${created.id}`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Top View Switcher & Action Bar matching leads.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
        {/* Kanban vs List View Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveView('kanban')}
            className={`text-sm font-semibold pb-3 -mb-4 transition-colors ${
              activeView === 'kanban' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Kanban View
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`text-sm font-semibold pb-3 -mb-4 transition-colors ${
              activeView === 'list' 
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            List View
          </button>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* New Lead Button */}
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 text-white font-medium gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> New Lead
          </Button>
        </div>
      </div>

      {/* Filter Row matching leads.png 1:1 */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase mr-1">
          <Filter className="h-4 w-4 text-slate-500" /> Filters
        </div>

        {/* Statuses Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-1.5 outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          {pipeline.stages.map((stg) => (
            <option key={stg.id} value={stg.id}>{stg.name}</option>
          ))}
        </select>

        {/* Sources Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-1.5 outline-none focus:border-blue-500"
        >
          <option value="all">All Sources</option>
          <option value="Walk-in">Walk-in</option>
          <option value="Google Ads">Google Ads</option>
          <option value="Website Lead">Website Lead</option>
          <option value="Referral">Referral</option>
          <option value="Facebook Lead">Facebook Lead</option>
        </select>

        {/* States Filter */}
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-1.5 outline-none focus:border-blue-500"
        >
          <option value="all">All States</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Delhi">Delhi</option>
          <option value="Other">Other</option>
        </select>

        {/* Cities Filter */}
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-1.5 outline-none focus:border-blue-500"
        >
          <option value="all">All Cities</option>
          <option value="Nagpur">Nagpur</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
          <option value="Delhi">Delhi</option>
        </select>

        {/* Executives Filter */}
        <select
          value={execFilter}
          onChange={(e) => setExecFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-1.5 outline-none focus:border-blue-500"
        >
          <option value="all">All Executives</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      {/* Main Content: Table View vs Kanban View */}
      {activeView === 'list' ? (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">CUSTOMER NAME</th>
                  <th className="p-4">FOLLOW-UP</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">BILL AMOUNT</th>
                  <th className="p-4">STATE</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white text-sm">
                      <Link href={`/leads/${lead.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">
                      {lead.industryData?.followUpDate ? (
                        <span>{lead.industryData.followUpDate}</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(lead.stageId)}
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-900 dark:text-white">
                      ₹{lead.industryData?.monthlyBill || 5000}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                      {lead.industryData?.state || 'Maharashtra'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/leads/${lead.id}`}
                          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pipeline.stages.map((stage) => {
            const stageLeads = filteredLeads.filter(l => l.stageId === stage.id);
            return (
              <div key={stage.id} className="bg-slate-100/70 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 min-h-[450px] space-y-3">
                <div className="flex items-center justify-between font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span>{stage.name}</span>
                  <Badge variant="outline" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">{stageLeads.length}</Badge>
                </div>

                {stageLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{lead.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{lead.industryData?.address || lead.company}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
                      <span className="text-blue-600 dark:text-blue-400 font-mono">₹{lead.industryData?.monthlyBill || 5000}/mo</span>
                      <span className="text-slate-400">{lead.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating New Lead */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Add New Solar Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateLeadSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Customer Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Amit Verma"
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mobile Number</label>
              <input
                type="tel"
                placeholder="9012345678"
                value={newLeadPhone}
                onChange={(e) => setNewLeadPhone(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Monthly Bill (₹)</label>
              <input
                type="number"
                placeholder="5000"
                value={newLeadBill}
                onChange={(e) => setNewLeadBill(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Save Lead</Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
}
