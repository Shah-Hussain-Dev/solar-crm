'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Wrench, Search, Filter, Trash2, CheckCircle2, ArrowRight, Eye, ShieldCheck, Camera
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';

export default function ProjectsPage() {
  const router = useRouter();
  const projects = useCRMStore((state) => state.projects);
  const users = useCRMStore((state) => state.users);

  const [statusFilter, setStatusFilter] = useState('all');
  const [managerFilter, setManagerFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Header matching projects.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Installation Pipeline</h1>
        </div>
      </div>

      {/* Filter Row matching projects.png 1:1 */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium px-4 py-2 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">All Statuses</option>
          <option value="installing">In Progress</option>
          <option value="completed">Commissioned</option>
        </select>

        <select
          value={managerFilter}
          onChange={(e) => setManagerFilter(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium px-4 py-2 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">All Managers</option>
          <option value="usr-1">Girish MASH</option>
          <option value="usr-3">Asad Patel</option>
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium px-4 py-2 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="all">All Locations</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md text-xs font-medium px-4 py-2 outline-none focus:border-blue-500 shadow-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Grid of Project Cards matching projects.png 1:1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((prj) => {
          const totalMilestones = prj.milestones.length;
          const completedMilestones = prj.milestones.filter(m => m.status === 'completed').length;
          const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
          const isCommissioned = prj.status === 'completed';

          return (
            <Card key={prj.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-4">
                
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{prj.name}</h3>
                  {isCommissioned ? (
                    <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-0 font-medium px-2.5 py-0.5 rounded-full text-xs shrink-0">
                      Commissioned
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-0 font-medium px-2.5 py-0.5 rounded-full text-xs shrink-0">
                      In Progress
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Size:</span> {prj.systemSizeKw.toFixed(1)} kW
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Manager:</span> {prj.assignedTeam.includes('usr-3') ? 'Asad Patel' : 'Girish MASH'}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Location:</span> {prj.name.includes('Sneha') ? 'Pune, Maharashtra' : prj.name.includes('Maya') ? 'Dicta aut non omnis, Other' : 'Aut ut molestiae cup, Maharashtra'}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">Milestone Progress</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono">{progressPercent}% ({completedMilestones}/{totalMilestones})</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isCommissioned ? 'bg-emerald-500' : 'bg-blue-600 dark:bg-blue-500'} rounded-full transition-all duration-500`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    onClick={() => router.push(`/projects/${prj.id}`)}
                    className="w-full bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold text-xs py-2 shadow-none border border-blue-100 dark:border-blue-900"
                  >
                    Manage Milestones
                  </Button>
                  <button
                    onClick={() => alert('Delete project')}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
