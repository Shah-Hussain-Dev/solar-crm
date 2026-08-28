'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckSquare, Camera, Eye, Trash2, ShieldCheck, Check, Sparkles, Upload
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { useAuthStore } from '@/shared/stores/authStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const projectId = params.id as string;

  const projects = useCRMStore((state) => state.projects);
  const updateProjectMilestone = useCRMStore((state) => state.updateProjectMilestone);
  const updateProjectStatus = useCRMStore((state) => state.updateProjectStatus);

  const project = projects.find((p) => p.id === projectId) || projects[0];

  const [projectManager, setProjectManager] = useState('Girish MASH');
  const [projectStatus, setProjectStatus] = useState(project.status === 'completed' ? 'Commissioned' : 'In Progress');

  const handleToggleMilestone = (milestoneName: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    updateProjectMilestone(project.id, milestoneName, nextStatus, user?.name || 'Girish MASH');
  };

  const handleUploadProof = (milestoneName: string) => {
    const sampleProof = 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop&q=80';
    updateProjectMilestone(project.id, milestoneName, 'completed', user?.name || 'Girish MASH', sampleProof);
    alert(`Proof photo uploaded for ${milestoneName}!`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Back Link */}
      <div>
        <button
          onClick={() => router.push('/projects')}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </button>
      </div>

      {/* Header Banner matching project-details.png */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{project.name}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            📍 Aut ut molestiae cup, Maharashtra | {project.systemSizeKw.toFixed(1)} kW System
          </p>
          <div className="mt-3">
            <Button
              onClick={() => router.push('/subsidy')}
              variant="outline"
              size="sm"
              className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900 hover:bg-blue-100 font-semibold text-xs gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" /> View Subsidy Tracking
            </Button>
          </div>
        </div>

        {/* Project Manager & Status Dropdowns Top Right */}
        <div className="flex items-center gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Project Manager</label>
            <select
              value={projectManager}
              onChange={(e) => setProjectManager(e.target.value)}
              className="mt-1 block bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
            >
              <option value="Girish MASH">Girish MASH</option>
              <option value="Asad Patel">Asad Patel</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Project Status</label>
            <select
              value={projectStatus}
              onChange={(e) => {
                setProjectStatus(e.target.value);
                updateProjectStatus(project.id, e.target.value === 'Commissioned' ? 'completed' : 'installing');
              }}
              className="mt-1 block bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500"
            >
              <option value="In Progress">In Progress</option>
              <option value="Commissioned">Commissioned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Card: Installation Milestones matching project-details.png 1:1 */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Installation Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {project.milestones.map((ms, idx) => {
            const isCompleted = ms.status === 'completed';
            return (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors ${
                  isCompleted 
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60' 
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Checkbox & Name */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleToggleMilestone(ms.name, ms.status)}
                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`text-sm font-semibold ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                    {ms.name}
                  </span>
                  {isCompleted ? (
                    <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-0 font-medium text-xs px-2.5 py-0.5 rounded-full">
                      Done
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0 font-medium text-xs px-2.5 py-0.5 rounded-full">
                      Pending
                    </Badge>
                  )}
                </div>

                {/* Proof Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isCompleted ? (
                    <Button
                      onClick={() => alert('Viewing proof photo')}
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 text-xs font-semibold gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> View Proof
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUploadProof(ms.name)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-sm"
                    >
                      <Camera className="h-3.5 w-3.5" /> Upload Proof
                    </Button>
                  )}
                  <button
                    onClick={() => alert('Delete milestone')}
                    className="text-red-400 hover:text-red-600 p-1.5 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}
