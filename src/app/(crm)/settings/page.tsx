'use client';

import React, { useState } from 'react';
import { 
  Settings, Building, Palette, Bell, FileText, Upload, Save, Check, Sparkles
} from 'lucide-react';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export default function SettingsPage() {
  const branding = useCRMStore((state) => state.branding);
  const updateBranding = useCRMStore((state) => state.updateBranding);

  const [companyName, setCompanyName] = useState(branding.companyName || 'SolarFlow CRM');
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor || '#1d4ed8');
  const [gstNumber, setGstNumber] = useState('27ABCDE1234F1Z5');
  const [whatsAppNotif, setWhatsAppNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [amcLeadTime, setAmcLeadTime] = useState('30');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding({
      companyName,
      primaryColor
    });
    alert('Company branding & notification preferences saved!');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Header matching settings.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings & Customization</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure company branding, GST details, and notification rules</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
        
        {/* Company Profile & Branding */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Company Profile & White-Label Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md p-2.5 text-sm outline-none focus:border-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">GST Registration Number</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md p-2.5 text-sm font-mono outline-none focus:border-blue-500 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Primary Brand Accent Color</label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-16 p-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                />
                <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{primaryColor}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & AMC Settings */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" /> Notifications & AMC Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Automated WhatsApp Follow-ups</h4>
                <p className="text-slate-500 dark:text-slate-400">Send instant quotation PDF links via WhatsApp when generated.</p>
              </div>
              <input
                type="checkbox"
                checked={whatsAppNotif}
                onChange={(e) => setWhatsAppNotif(e.target.checked)}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Email Reminders for Installment Due Dates</h4>
                <p className="text-slate-500 dark:text-slate-400">Notify sales rep when customer milestone payment is due.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">AMC Expiry Alert Advance Days</label>
              <select
                value={amcLeadTime}
                onChange={(e) => setAmcLeadTime(e.target.value)}
                className="mt-1 w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md p-2.5 text-sm outline-none focus:border-blue-500 font-medium"
              >
                <option value="15">15 Days Before</option>
                <option value="30">30 Days Before</option>
                <option value="60">60 Days Before</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 shadow-sm">
            Save Settings & Preferences
          </Button>
        </div>

      </form>

    </div>
  );
}
