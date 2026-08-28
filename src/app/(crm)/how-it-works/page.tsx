'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Users, ClipboardList, FileText, Wrench, ShieldCheck, CreditCard, Headphones, 
  Settings, ArrowRight, Play, CheckCircle2, Zap, HelpCircle, Layers, Smartphone, Navigation,
  FileCheck, IndianRupee, ChevronRight, CheckSquare, UserCheck, Shield, ChevronDown
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export default function HowItWorksPage() {
  const router = useRouter();

  // Active step in interactive tutorial stepper
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeRoleTab, setActiveRoleTab] = useState<'sales' | 'tech' | 'pm' | 'admin'>('sales');

  // Simulation Sandbox State
  const [simLeadName, setSimLeadName] = useState('Rahul Sharma');
  const [simBill, setSimBill] = useState(6500);
  const [simKw, setSimKw] = useState(6.5);
  const [simStepStatus, setSimStepStatus] = useState<string[]>([
    'Lead Created', 'Survey Completed (6.5 kW)', 'Proposal Sent (₹1,95,000)', 'Project Commissioned'
  ]);

  const stepsList = [
    {
      stepNumber: 1,
      id: 'step-1',
      title: '1. Lead Capture & Kanban Pipelines',
      shortTitle: 'Lead Intake',
      icon: Users,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      path: '/leads',
      pathText: 'Go to Lead Pipeline',
      description: 'Capture inbound inquiries from walk-ins, website forms, or Google/FB ads into structured Kanban boards.',
      highlights: [
        'Dual Kanban (Desktop) & Swipeable List (Mobile) views.',
        'Automated duplicate phone/email detection alerts on intake.',
        'AI WhatsApp Follow-up Message Generator with single-tap sending.',
        'Filter leads by state (Maharashtra, Delhi), city, or sales representative.'
      ]
    },
    {
      stepNumber: 2,
      id: 'step-2',
      title: '2. Offline Mobile Field Site Survey',
      shortTitle: 'Site Survey',
      icon: ClipboardList,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      path: '/surveys',
      pathText: 'Go to Site Surveys',
      description: 'Dispatch field technicians to rooftop locations with a mobile app form that works 100% offline without internet.',
      highlights: [
        'Record rooftop dimensions (SqFt), shading factors, and sanctioned electricity load.',
        'GPS location auto-capture for exact coordinates.',
        'Camera photo upload proof for rooftop structure and meter box.',
        'Auto-computes recommended solar kW system capacity.'
      ]
    },
    {
      stepNumber: 3,
      id: 'step-3',
      title: '3. Instant GST Proposal & Subsidy Builder',
      shortTitle: 'Quotation PDF',
      icon: FileText,
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      path: '/quotations',
      pathText: 'Go to Quotations',
      description: 'Generate customer-facing branded proposals with line item pricing, 18% GST calculation, and Government Subsidy deductions.',
      highlights: [
        'Calculates Central PM Surya Ghar subsidy (up to ₹78,000) & State subsidies.',
        'Computes Net Cost to Customer automatically.',
        'Printable GST PDF document preview with custom terms and company logo.',
        'One-click WhatsApp quote link sharing with clients.'
      ]
    },
    {
      stepNumber: 4,
      id: 'step-4',
      title: '4. Installation Project Milestones',
      shortTitle: 'Installation',
      icon: Wrench,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      path: '/projects',
      pathText: 'Go to Projects',
      description: 'Track the complete installation lifecycle from material procurement to net metering commissioning.',
      highlights: [
        'Milestone checklists (Procurement, Delivery, Panel Mounting, Inverter Wiring, Net Meter).',
        'Mandatory photo proof verification for each completed stage.',
        'Track milestone progress percentages (e.g. 75% 3/4 completed).',
        'Assign lead project managers and field execution teams.'
      ]
    },
    {
      stepNumber: 5,
      id: 'step-5',
      title: '5. Invoicing & Payments Ledger',
      shortTitle: 'Payments & GST',
      icon: CreditCard,
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      path: '/payments',
      pathText: 'Go to Payments',
      description: 'Record customer advance booking fees, schedule milestone payment due dates, and monitor total outstanding receivables.',
      highlights: [
        'Log payments across UPI, GPay, Bank NEFT/RTGS, Cheque, and Cash.',
        'Generate official GST Tax Invoices and payment receipts.',
        'Real-time executive metrics for Monthly Collections and Overdue Balances.',
        'Automated payment due reminder notifications.'
      ]
    },
    {
      stepNumber: 6,
      id: 'step-6',
      title: '6. Service Tickets & AMC Renewals',
      shortTitle: 'After-Sales Service',
      icon: Headphones,
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      path: '/tickets',
      pathText: 'Go to Tickets & AMC',
      description: 'Provide post-installation maintenance, handle inverter alarms or net meter issues, and manage Annual AMC contracts.',
      highlights: [
        'Log customer support tickets with high/medium/low priority tags.',
        'Assign technicians for site maintenance visits.',
        'Track AMC contract validity dates with 30-day advance expiry alerts.',
        'Maintain complete service history trails per customer installation.'
      ]
    }
  ];

  const activeStepData = stepsList.find(s => s.stepNumber === activeStep) || stepsList[0];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-6 sm:p-8 rounded-3xl text-white shadow-2xl border border-blue-500/20 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" /> Interactive User Tutorial & Guide
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How SolarCRM Works
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Understand the complete 6-step solar business workflow from first lead inquiry to site survey, quotation generation, installation milestone tracking, payment collection, and AMC service.
          </p>
        </div>
        
        <div className="mt-6 flex flex-wrap items-center gap-3 relative z-10 pt-2">
          <Button
            onClick={() => setActiveStep(1)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-2 shadow-lg shadow-blue-600/30"
          >
            <Play className="h-3.5 w-3.5 fill-white" /> Start Guided Tour
          </Button>
          <Link href="/user-guide">
            <Button variant="outline" className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700 text-xs font-semibold gap-1.5">
              <span>View Full REST API Spec</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ==================== 1. INTERACTIVE WORKFLOW STEPPER ==================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" /> End-to-End Solar Business Lifecycle
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click any step below to explore detailed instructions and features</p>
          </div>
        </div>

        {/* Stepper Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {stepsList.map((step) => {
            const Icon = step.icon;
            const isCurrent = activeStep === step.stepNumber;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.stepNumber)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105 font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    Step {step.stepNumber}
                  </span>
                  <Icon className={`h-4 w-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <span className="text-xs font-bold mt-3 block truncate">{step.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Content Card */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <Badge className={`${activeStepData.badgeColor} text-xs font-bold px-3 py-1`}>
                  STAGE {activeStepData.stepNumber} OF 6
                </Badge>
                <CardTitle className="text-2xl font-extrabold text-slate-900 dark:text-white pt-1">
                  {activeStepData.title}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                  {activeStepData.description}
                </CardDescription>
              </div>

              {/* Action Button */}
              <div>
                <Button
                  onClick={() => router.push(activeStepData.path)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl gap-2 shadow-md"
                >
                  <span>{activeStepData.pathText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Key Capabilities & Best Practices in Stage {activeStepData.stepNumber}:
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeStepData.highlights.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            {/* Step Navigation Controls */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button
                disabled={activeStep === 1}
                onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
                variant="outline"
                className="text-xs font-semibold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                ← Previous Step
              </Button>
              <span className="text-xs font-bold text-slate-400">Step {activeStep} of 6</span>
              <Button
                disabled={activeStep === 6}
                onClick={() => setActiveStep(prev => Math.min(prev + 1, 6))}
                className="bg-blue-600 text-white text-xs font-semibold"
              >
                Next Step →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ==================== 2. ROLE-BASED USAGE INSTRUCTIONS ==================== */}
      <div className="space-y-6 pt-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Role-Based Usage Guide
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Learn how each team member uses SolarCRM for maximum efficiency</p>
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveRoleTab('sales')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeRoleTab === 'sales'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Sales Executives & Reps
          </button>
          <button
            onClick={() => setActiveRoleTab('tech')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeRoleTab === 'tech'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Field Technicians
          </button>
          <button
            onClick={() => setActiveRoleTab('pm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeRoleTab === 'pm'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Project Managers
          </button>
          <button
            onClick={() => setActiveRoleTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeRoleTab === 'admin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Business Owners & Franchise Admins
          </button>
        </div>

        {/* Role Tab Content */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
          
          {activeRoleTab === 'sales' && (
            <div className="space-y-4 text-xs animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Workflow for Sales Executives:</h3>
              <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <li><strong className="text-blue-600 dark:text-blue-400">Review Overdue Follow-ups:</strong> Check the Dashboard Overdue Follow-ups card daily to contact leads scheduled for outreach.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Schedule Mobile Site Surveys:</strong> Open the customer lead profile and assign a technician for an offline site survey.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Generate GST Proposal:</strong> Once survey data is loaded, click "Create Quotation" to automatically compute system kW size and Central/State subsidies.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Send WhatsApp Links:</strong> Use the AI WhatsApp generator button to share the proposal PDF directly with the customer.</li>
              </ol>
            </div>
          )}

          {activeRoleTab === 'tech' && (
            <div className="space-y-4 text-xs animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Workflow for Field Technicians:</h3>
              <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <li><strong className="text-blue-600 dark:text-blue-400">Open Site Surveys List:</strong> Filter by "Assigned Tech: Me" to view today's scheduled rooftop visits.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Use Offline PWA Mode:</strong> Turn on offline mode if working in remote rooftop areas with weak cellular signal.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Record Technical Specs:</strong> Enter roof area (SqFt), shading assessment, sanctioned electricity load, and click "Navigate Maps" for GPS directions.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Capture Site Photos:</strong> Tap "Upload / Capture Photo" to take live roof images that automatically sync to the server.</li>
              </ol>
            </div>
          )}

          {activeRoleTab === 'pm' && (
            <div className="space-y-4 text-xs animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Workflow for Project Managers:</h3>
              <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <li><strong className="text-blue-600 dark:text-blue-400">Monitor Installation Pipeline:</strong> View progress percentage indicators for all active rooftop projects.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Verify Photo Proofs:</strong> Review uploaded photo proofs for material procurement, structure mounting, and inverter wiring.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Track Subsidy Applications:</strong> Click "View Subsidy Tracking" to monitor MNRE portal application stages and document approvals.</li>
              </ol>
            </div>
          )}

          {activeRoleTab === 'admin' && (
            <div className="space-y-4 text-xs animate-in fade-in duration-200">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Workflow for Business Owners & Admins:</h3>
              <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <li><strong className="text-blue-600 dark:text-blue-400">Executive Command Center:</strong> Monitor overall monthly collections, total outstanding receivables, and open service tickets.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">White-Label Branding Settings:</strong> Update company name, GST registration number, logo, and brand primary accent colors under Settings.</li>
                <li><strong className="text-blue-600 dark:text-blue-400">Role Permissions & User Switching:</strong> Use the top navbar role selector to test views across Sales, Manager, and Field Tech permission levels.</li>
              </ol>
            </div>
          )}

        </div>
      </div>

      {/* ==================== 3. LIVE SIMULATION SANDBOX ==================== */}
      <div className="space-y-4 pt-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-500" /> Interactive Deal Simulation Sandbox
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Test how data flows automatically from lead intake to quotation, project execution, and payment</p>
        </div>

        <Card className="bg-slate-900 border-slate-800 text-white p-6 rounded-3xl shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">Customer Name</label>
              <input
                type="text"
                value={simLeadName}
                onChange={(e) => setSimLeadName(e.target.value)}
                className="mt-1 w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Monthly Electricity Bill (₹)</label>
              <input
                type="number"
                value={simBill}
                onChange={(e) => {
                  const bill = Number(e.target.value);
                  setSimBill(bill);
                  setSimKw(Math.round((bill / 1000) * 10) / 10);
                }}
                className="mt-1 w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Auto-Calculated Solar System</label>
              <input
                type="text"
                readOnly
                value={`${simKw} kW System`}
                className="mt-1 w-full bg-slate-800/60 border border-slate-700 text-amber-400 font-bold rounded-lg p-2.5 text-xs outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Live Workflow Pipeline Output:</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-blue-500/30">
                <span className="text-blue-400 text-[10px] block font-bold">1. LEAD INTAKE</span>
                <span className="text-white font-bold block mt-1">{simLeadName}</span>
                <span className="text-slate-400 text-[10px]">Bill: ₹{simBill}/mo</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/30">
                <span className="text-amber-400 text-[10px] block font-bold">2. SITE SURVEY</span>
                <span className="text-white font-bold block mt-1">{simKw} kW Capacity</span>
                <span className="text-slate-400 text-[10px]">GPS & Photo Verified</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-purple-500/30">
                <span className="text-purple-400 text-[10px] block font-bold">3. GST PROPOSAL</span>
                <span className="text-white font-bold block mt-1">₹{(simKw * 30000).toLocaleString('en-IN')}</span>
                <span className="text-emerald-400 text-[10px]">Subsidy: -₹78,000</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 text-[10px] block font-bold">4. INSTALLATION</span>
                <span className="text-white font-bold block mt-1">100% Commissioned</span>
                <span className="text-slate-400 text-[10px]">Net Meter Active</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={() => router.push('/leads')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-2"
            >
              <span>Try Real Workflow in Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

    </div>
  );
}
