'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, Camera, Sparkles, Navigation, CheckCircle2, Save, FileText, Upload
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export default function SurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.id as string;

  const surveys = useCRMStore((state) => state.surveys);
  const leads = useCRMStore((state) => state.leads);
  const updateSurvey = useCRMStore((state) => state.updateSurvey);

  const survey = surveys.find((s) => s.id === surveyId) || surveys[2];
  const lead = leads.find((l) => l.id === survey.leadId) || leads[1];

  const [roofArea, setRoofArea] = useState(survey.answers?.roofAreaSqFt || 40);
  const [shading, setShading] = useState(survey.answers?.shading || 'None');
  const [connectionType, setConnectionType] = useState(survey.answers?.connectionType || 'Single-phase');
  const [sanctionedLoad, setSanctionedLoad] = useState(survey.answers?.sanctionedLoadKw || 40);
  const [recommendedKw, setRecommendedKw] = useState(survey.answers?.estimatedCapacityKw || 19.5);
  const [status, setStatus] = useState(survey.status || 'completed');
  const [notes, setNotes] = useState(survey.summary || '');
  const [photos, setPhotos] = useState<string[]>(survey.photos || []);

  const handleSaveSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    updateSurvey(survey.id, {
      status: status as 'pending' | 'completed',
      summary: notes,
      photos: photos,
      answers: {
        ...survey.answers,
        roofAreaSqFt: roofArea,
        shading,
        connectionType,
        sanctionedLoadKw: sanctionedLoad,
        estimatedCapacityKw: recommendedKw
      }
    });
    alert('Site survey technical specs updated successfully!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const samplePhoto = 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=80';
    setPhotos([...photos, samplePhoto]);
  };

  const handleAiSummarize = () => {
    const summaryText = `Site Analysis for ${lead.name}: Roof area of ${roofArea} sq.ft with zero shading. Connection type is ${connectionType} with sanctioned load of ${sanctionedLoad}kW. Recommended optimal solar capacity is ${recommendedKw}kW. High ROI potential.`;
    setNotes(summaryText);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Back Link */}
      <div>
        <button
          onClick={() => router.push('/surveys')}
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Site Surveys
        </button>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Site Survey Details</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Survey ID: {survey.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(lead.industryData?.address || 'Mumbai')}`, '_blank')}
            variant="outline"
            className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 gap-1.5 text-xs"
          >
            <Navigation className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Navigate Maps
          </Button>
          <Button
            onClick={handleSaveSurvey}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium gap-1.5 text-xs shadow-sm"
          >
            <Save className="h-4 w-4" /> Save Survey Specs
          </Button>
        </div>
      </div>

      {/* Card 1: Customer Details */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">1. Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="uppercase font-bold text-slate-400 dark:text-slate-500 text-[10px] tracking-wider">NAME</span>
            <p className="font-bold text-blue-600 dark:text-blue-400 text-sm mt-1">{lead.name || 'Akash Patil'}</p>
          </div>
          <div>
            <span className="uppercase font-bold text-slate-400 dark:text-slate-500 text-[10px] tracking-wider">MOBILE</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">{lead.phone || '9999888874'}</p>
          </div>
          <div>
            <span className="uppercase font-bold text-slate-400 dark:text-slate-500 text-[10px] tracking-wider">ADDRESS</span>
            <p className="font-medium text-slate-800 dark:text-slate-200 text-xs mt-1">{lead.industryData?.address || 'Mumbai,'}</p>
          </div>
          <div>
            <span className="uppercase font-bold text-slate-400 dark:text-slate-500 text-[10px] tracking-wider">MONTHLY BILL</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">₹{lead.industryData?.monthlyBill || 3500}</p>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Technical Specs */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">2. Technical Specs</CardTitle>
          <Button
            onClick={handleAiSummarize}
            variant="outline"
            size="sm"
            className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-100 gap-1 text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> AI Survey Summary
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSaveSurvey} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Roof Area (SqFt)</label>
                <input
                  type="number"
                  value={roofArea}
                  onChange={(e) => setRoofArea(Number(e.target.value))}
                  className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md p-2.5 text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shading</label>
                <select
                  value={shading}
                  onChange={(e) => setShading(e.target.value)}
                  className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md p-2.5 text-sm font-medium outline-none focus:border-blue-500"
                >
                  <option value="None">None</option>
                  <option value="Partial">Partial</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Connection Type</label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md p-2.5 text-sm font-medium outline-none focus:border-blue-500"
                >
                  <option value="Single-phase">Single-phase</option>
                  <option value="Three-phase">Three-phase</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sanctioned Load (kW)</label>
                <input
                  type="number"
                  value={sanctionedLoad}
                  onChange={(e) => setSanctionedLoad(Number(e.target.value))}
                  className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md p-2.5 text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Recommended kW (Auto-calculated)</label>
              <input
                type="text"
                readOnly
                value={recommendedKw}
                className="mt-1 w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md p-2.5 text-sm font-bold outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md p-2.5 text-sm font-semibold outline-none focus:border-blue-500"
              >
                <option value="Completed">Completed</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Technician observation notes..."
                className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md p-2.5 text-xs outline-none focus:border-blue-500"
              />
            </div>

            {/* Photo Capture Grid */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Site Photos & Proofs</label>
                <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 inline-flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Upload / Capture Photo
                  <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {photos.map((img, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 h-32 group">
                      <img src={img} alt="Site Photo" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400">
                  No site photos attached yet. Use mobile camera capture.
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Save Technical Survey Specs
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
