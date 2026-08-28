'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Eye, Trash2, CheckSquare, Plus, Filter, MapPin, Camera, Sparkles, Navigation
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { useAuthStore } from '@/shared/stores/authStore';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

export default function SiteSurveysPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const surveys = useCRMStore((state) => state.surveys);
  const leads = useCRMStore((state) => state.leads);
  const users = useCRMStore((state) => state.users);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');
  const [adminViewAll, setAdminViewAll] = useState(true);

  // Filtered list
  const filteredSurveys = surveys.filter((srv) => {
    const lead = leads.find((l) => l.id === srv.leadId);
    const customerName = lead?.name || 'Customer';
    const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || srv.status === statusFilter;
    const matchesTech = techFilter === 'all' || srv.technicianId === techFilter;
    return matchesSearch && matchesStatus && matchesTech;
  });

  const getTechName = (techId: string) => {
    const found = users.find((u) => u.id === techId);
    if (found) return found.name;
    if (techId === 'usr-1') return 'Sunil Tech';
    if (techId === 'usr-2') return 'Girish MASH';
    if (techId === 'usr-3') return 'Asad Patel';
    return 'Sunil Tech';
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Header matching site-surveys.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Site Surveys</h1>
        </div>

        {/* View All Surveys (Admin) Checkbox */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-900 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={adminViewAll}
              onChange={(e) => setAdminViewAll(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span>View All Surveys (Admin)</span>
          </label>
        </div>
      </div>

      {/* Filter Row matching site-surveys.png 1:1 */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Scheduled</option>
        </select>

        {/* Technician Filter */}
        <select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 px-3 py-2 outline-none focus:border-blue-500"
        >
          <option value="all">All Technicians</option>
          <option value="usr-1">Sunil Tech</option>
          <option value="usr-2">Girish MASH</option>
          <option value="usr-3">Asad Patel</option>
        </select>
      </div>

      {/* Table matching site-surveys.png 1:1 */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">CUSTOMER NAME</th>
                <th className="p-4">SURVEY DATE/TIME</th>
                <th className="p-4">ASSIGNED TECH</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredSurveys.map((srv) => {
                const lead = leads.find((l) => l.id === srv.leadId);
                const isCompleted = srv.status === 'completed';
                return (
                  <tr key={srv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      <Link href={`/surveys/${srv.id}`}>
                        {lead?.name || 'Customer'}
                      </Link>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                      {srv.scheduledDate}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                      👤 {getTechName(srv.technicianId)}
                    </td>
                    <td className="p-4">
                      {isCompleted ? (
                        <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-0 font-medium px-3 py-1 rounded-full">Completed</Badge>
                      ) : (
                        <Badge className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-0 font-medium px-3 py-1 rounded-full">Scheduled</Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => router.push(`/surveys/${srv.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-md gap-1.5 shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5" /> {isCompleted ? 'View Survey' : 'Start Survey'}
                        </Button>
                        <button
                          onClick={() => alert('Survey deleted')}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
