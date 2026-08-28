'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, BookOpen, Users, ClipboardList, FileText, Wrench, ShieldCheck, CreditCard, Headphones, Settings, ArrowRight, Code
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export default function UserGuidePage() {
  const guideSections = [
    {
      icon: Users,
      title: '1. Lead Management & Kanban Pipelines',
      desc: 'Dual Kanban Board and List views with automated duplicate detection, multi-state filtering, and AI WhatsApp outreach message generation.',
      path: '/leads'
    },
    {
      icon: ClipboardList,
      title: '2. Offline Mobile Site Surveys',
      desc: 'Field technician tool that works 100% offline. Measure roof area, connection load, capture GPS coordinates, and upload site photos.',
      path: '/surveys'
    },
    {
      icon: FileText,
      title: '3. GST Proposals & PDF Builder',
      desc: 'Generate customized solar quotations with line items, 18% GST calculation, Central/State MNRE subsidy deductions, and one-tap PDF printing.',
      path: '/quotations'
    },
    {
      icon: Wrench,
      title: '4. Installation Project Milestones',
      desc: 'Track procurement, delivery, panel mounting, wiring, and net-metering with mandatory technician photo proof uploads.',
      path: '/projects'
    },
    {
      icon: ShieldCheck,
      title: '5. MNRE Government Subsidy Tracker',
      desc: 'Track government subsidy portal applications, document checklists (NOC, ID proofs), approval history, and disbursement dates.',
      path: '/subsidy'
    },
    {
      icon: CreditCard,
      title: '6. Invoicing & Payments Ledger',
      desc: 'Schedule installment due dates, log bank/UPI transfers, view total outstanding receivables, and issue official GST Tax Invoices.',
      path: '/payments'
    },
    {
      icon: Headphones,
      title: '7. Service Tickets & AMC Renewals',
      desc: 'Manage support tickets (inverter alarms, net meter issues), technician visits, and annual AMC maintenance contract renewals.',
      path: '/tickets'
    },
    {
      icon: Settings,
      title: '8. White-Label Settings & Branding',
      desc: 'Customize company logo, GST details, brand primary accent colors, and automated WhatsApp/email notification triggers.',
      path: '/settings'
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Header matching features.png */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">User & Developer Guide</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Complete system walkthrough and API integration reference</p>
        </div>
        <div>
          <Link href="/USER_DEVELOPER_GUIDE.md" target="_blank">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs gap-2">
              <Code className="h-4 w-4" /> Open Full Guide File
            </Button>
          </Link>
        </div>
      </div>

      {/* Guide Cards Grid matching features.png 1:1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {guideSections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <Card key={idx} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">{sec.title}</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-1">
                  {sec.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={sec.path}>
                  <Button variant="outline" className="w-full text-xs font-semibold text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 justify-between">
                    <span>Open Module</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}
