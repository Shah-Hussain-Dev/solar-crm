'use client';

import React, { useState } from 'react';
import { 
  Wrench, Headphones, Plus, Search, Filter, Trash2, Eye, ShieldCheck, CheckCircle2, Calendar, FileText
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { useAuthStore } from '@/shared/stores/authStore';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

export default function ServiceTicketsPage() {
  const { user } = useAuthStore();
  const tickets = useCRMStore((state) => state.tickets);
  const projects = useCRMStore((state) => state.projects);
  const users = useCRMStore((state) => state.users);
  const addTicket = useCRMStore((state) => state.addTicket);

  const [activeTab, setActiveTab] = useState<'tickets' | 'amc'>('tickets');
  const [statusFilter, setStatusFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTech, setAssignedTech] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    addTicket({
      projectId: projectId || projects[0]?.id || 'prj-1',
      customerId: 'cust-1',
      title: title,
      description: 'Customer raised issue via mobile support ticket.',
      priority: 'high',
      status: 'open',
      assigneeId: assignedTech || 'usr-1',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setModalOpen(false);
    setTitle('');
    alert('Service Support Ticket created!');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Top Header & Tabs matching after-sales.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`text-sm font-bold pb-3 -mb-4 transition-colors ${
              activeTab === 'tickets'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Service Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('amc')}
            className={`text-sm font-bold pb-3 -mb-4 transition-colors ${
              activeTab === 'amc'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            AMC Contracts
          </button>
        </div>

        {/* Create Ticket Button */}
        <div>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create Ticket
          </Button>
        </div>
      </div>

      {activeTab === 'tickets' ? (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">TICKET ID</th>
                  <th className="p-4">ISSUE / TITLE</th>
                  <th className="p-4">PROJECT</th>
                  <th className="p-4">ASSIGNED TECH</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {tickets.map((t) => {
                  const proj = projects.find((p) => p.id === t.projectId);
                  const tech = users.find((u) => u.id === t.assigneeId);
                  const isOpen = t.status === 'open';
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono font-semibold text-slate-900 dark:text-white">
                        {t.id}
                      </td>
                      <td className="p-4 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        {t.title}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {proj?.name || 'Solar Installation'}
                      </td>
                      <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                        👤 {tech?.name || 'Sunil Tech'}
                      </td>
                      <td className="p-4">
                        {isOpen ? (
                          <Badge className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-0 font-medium px-3 py-1 rounded-full">Open</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-0 font-medium px-3 py-1 rounded-full">Resolved</Badge>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          onClick={() => alert('View ticket details')}
                          variant="outline"
                          size="sm"
                          className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900 hover:bg-blue-100 text-xs font-medium"
                        >
                          View Ticket
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* AMC Contracts Tab */
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Annual Maintenance Contracts (AMC)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {projects.map((p) => (
              <div key={p.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</span>
                  <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-0">Active AMC</Badge>
                </div>
                <p className="text-slate-500 dark:text-slate-400">AMC Period: 01 Jan 2026 - 31 Dec 2026</p>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Scheduled Visits: 4 / Year</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">Next: 15 Jun 2026</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Create Service Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateTicket} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Ticket Title / Issue Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Inverter Error Code E04"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-blue-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assign Technician</label>
            <select
              value={assignedTech}
              onChange={(e) => setAssignedTech(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2 text-sm outline-none focus:border-blue-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Create Ticket</Button>
          </div>
        </form>
      </Dialog>

    </div>
  );
}
