'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, Smartphone, Wifi, Shield, Zap,
  Check, ChevronRight, ArrowRight, Bot, Calendar, Clock,
  ArrowLeft, Building, Users, CheckCircle, TrendingUp,
  Coins, SmartphoneIcon, FileText, ChevronDown, CheckCircle2,
  Wrench, Play, Plus, CreditCard, Award, Sun, Layers, Navigation,
  Camera, FileCheck, IndianRupee, MessageSquare, Headset, ShieldCheck,
  CheckSquare, Globe, Star, ArrowUpRight, BarChart3
} from 'lucide-react';
import { useAuthStore } from '@/shared/stores/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { formatCurrency } from '@/shared/utils/cn';

export default function LandingPage() {
  const { user } = useAuthStore();

  // 1. Theme Color Sandbox State
  const [themeColor, setThemeColor] = useState<'amber' | 'blue' | 'emerald' | 'violet'>('blue');

  // Theme Color Class Map
  const themeClassMap = {
    amber: {
      text: 'text-amber-600',
      bg: 'bg-amber-600 hover:bg-amber-700',
      bgLight: 'bg-amber-50 text-amber-800 border-amber-200',
      glow: 'shadow-amber-500/20',
      accent: '#f59e0b'
    },
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-600 hover:bg-blue-700',
      bgLight: 'bg-blue-50 text-blue-800 border-blue-200',
      glow: 'shadow-blue-500/20',
      accent: '#2563eb'
    },
    emerald: {
      text: 'text-emerald-600',
      bg: 'bg-emerald-600 hover:bg-emerald-700',
      bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      glow: 'shadow-emerald-500/20',
      accent: '#059669'
    },
    violet: {
      text: 'text-violet-600',
      bg: 'bg-violet-600 hover:bg-violet-700',
      bgLight: 'bg-violet-50 text-violet-800 border-violet-200',
      glow: 'shadow-violet-500/20',
      accent: '#7c3aed'
    }
  };

  const activeTheme = themeClassMap[themeColor];

  // 2. Interactive App Mockup Tab State
  const [activeMockupTab, setActiveMockupTab] = useState<'dashboard' | 'survey' | 'quote' | 'projects'>('dashboard');

  // 3. ROI Calculator States
  const [monthlyLeads, setMonthlyLeads] = useState(150);
  const [closeRate, setCloseRate] = useState(20); // percent
  const [avgDealValue, setAvgDealValue] = useState(350000); // INR
  const [teamSize, setTeamSize] = useState(8);

  // ROI Math
  const currentDeals = Math.round(monthlyLeads * (closeRate / 100));
  const currentRevenue = currentDeals * avgDealValue;
  const newCloseRate = Math.min(Math.round(closeRate * 1.30), 100);
  const newDeals = Math.round(monthlyLeads * (newCloseRate / 100));
  const newRevenue = newDeals * avgDealValue;
  const monthlyRevenueGain = newRevenue - currentRevenue;
  const annualRevenueGain = monthlyRevenueGain * 12;
  const hoursSavedPerWeek = teamSize * 5;

  // 4. Pricing States
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const discountFactor = billingCycle === 'annual' ? 0.8 : 1.0;
  const starterPrice = Math.round(1499 * discountFactor);
  const growthPrice = Math.round(2999 * discountFactor);

  // 5. Booking Scheduler States
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingCompany, setBookingCompany] = useState('');
  const [bookingRole, setBookingRole] = useState('Solar Installer');

  const getNextWorkingDays = () => {
    const days = [];
    const date = new Date();
    let count = 0;
    while (count < 5) {
      date.setDate(date.getDate() + 1);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = date.getDate();
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const fullDate = `${dayName}, ${monthName} ${dayNum}`;
      days.push({ label: `${dayName} ${dayNum}`, value: fullDate });
      count++;
    }
    return days;
  };
  const availableDates = getNextWorkingDays();
  const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  const handleBookDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !bookingName.trim() || !bookingEmail.trim() || !bookingCompany.trim()) return;
    setBookingStep(3);
  };

  const resetBookingForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setBookingName('');
    setBookingEmail('');
    setBookingCompany('');
    setBookingStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">

      {/* ==================== 1. PREMIUM FLOATING HEADER ==================== */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-900/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sun className="h-6 w-6 text-white fill-amber-300 animate-spin-slow" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                SolarCRM <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">V1.0</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">Solar Business Operating System</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-blue-400 transition-colors">Key Features</a>
            <a href="#solutions" className="hover:text-blue-400 transition-colors">Solutions</a>
            <a href="#roi" className="hover:text-blue-400 transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
            <Link href="/user-guide" className="text-amber-400 hover:text-amber-300 flex items-center gap-1">
              <span>User & Dev Guide</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 gap-1.5">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2">
                  Sign In
                </Link>
                <a href="#booking">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25">
                    Book Demo
                  </Button>
                </a>
              </>
            )}
          </div>

        </div>
      </header>

      {/* ==================== 2. HERO SECTION ==================== */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-slate-900">

        {/* Background Gradients & Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 max-w-4xl mx-auto">

            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold shadow-xl backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-blue-400 font-bold">#1 Operating System</span>
              <span className="text-slate-500">•</span>
              <span>For Solar Installers & Field Service Enterprises</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Supercharge Solar Operations. <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400 bg-clip-text text-transparent">
                Close Deals 3x Faster.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The complete field-to-finance CRM. Manage leads, run offline site surveys, generate GST quotations with government subsidy calculations, track installation milestones, and collect payments seamlessly.
            </p>

            {/* Live White-Label Brand Switcher Sandbox */}
            <div className="pt-2 pb-4">
              <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/80 text-xs shadow-inner">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider px-2">White-Label Brand Preview:</span>
                <button
                  onClick={() => setThemeColor('amber')}
                  className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-2 transition-all ${themeColor === 'amber' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 scale-105 shadow-lg' : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                >
                  <span className="h-3 w-3 rounded-full bg-amber-400" /> Solar Amber
                </button>
                <button
                  onClick={() => setThemeColor('blue')}
                  className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-2 transition-all ${themeColor === 'blue' ? 'bg-blue-600 text-white font-bold border-blue-400 scale-105 shadow-lg' : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                >
                  <span className="h-3 w-3 rounded-full bg-blue-500" /> Deep Blue
                </button>
                <button
                  onClick={() => setThemeColor('emerald')}
                  className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-2 transition-all ${themeColor === 'emerald' ? 'bg-emerald-600 text-white font-bold border-emerald-400 scale-105 shadow-lg' : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                >
                  <span className="h-3 w-3 rounded-full bg-emerald-500" /> Eco Emerald
                </button>
                <button
                  onClick={() => setThemeColor('violet')}
                  className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-2 transition-all ${themeColor === 'violet' ? 'bg-violet-600 text-white font-bold border-violet-400 scale-105 shadow-lg' : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                >
                  <span className="h-3 w-3 rounded-full bg-violet-500" /> Royal Violet
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className={`h-12 px-8 ${activeTheme.bg} text-white font-bold text-sm shadow-xl ${activeTheme.glow} gap-2 rounded-xl w-full sm:w-auto`}>
                  <span>Explore Live App Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#booking" className="w-full sm:w-auto">
                <Button variant="outline" className="h-12 px-8 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 font-semibold text-sm rounded-xl w-full sm:w-auto">
                  Schedule Technical Walkthrough
                </Button>
              </a>
            </div>

            {/* Feature Checkmarks Bar */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> No App Store Installation Needed
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Works 100% Offline for Technicians
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant WhatsApp Proposal Sharing
              </span>
            </div>

          </div>

          {/* Interactive Product Feature Showcase Mockup Frame */}
          <div className="mt-16 max-w-5xl mx-auto bg-slate-800/90 rounded-3xl p-4 sm:p-6 border border-slate-700 shadow-2xl backdrop-blur-xl">

            {/* Mockup Top Tab Control Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-700/80 pb-4 mb-6 gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs font-mono text-slate-400">crm.clientdomain.com</span>
              </div>

              {/* Mockup Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveMockupTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMockupTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveMockupTab('survey')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMockupTab === 'survey' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Site Survey (GPS & Camera)
                </button>
                <button
                  onClick={() => setActiveMockupTab('quote')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMockupTab === 'quote' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  GST Quotation & Subsidy
                </button>
                <button
                  onClick={() => setActiveMockupTab('projects')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMockupTab === 'projects' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Installation Milestones
                </button>
              </div>
            </div>

            {/* Mockup View Content */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left min-h-[360px] flex flex-col justify-between">

              {activeMockupTab === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-white">Executive Command Center</h4>
                      <p className="text-xs text-slate-400">Real-time KPI metrics, active collections, and overdue follow-ups</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Live Syncing</Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400">MY LEADS</span>
                      <h5 className="text-2xl font-extrabold text-white mt-1">6</h5>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400">ACTIVE PROJECTS</span>
                      <h5 className="text-2xl font-extrabold text-amber-400 mt-1">3</h5>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400">COLLECTIONS</span>
                      <h5 className="text-2xl font-extrabold text-emerald-400 mt-1">₹65,520</h5>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-slate-400">OPEN TICKETS</span>
                      <h5 className="text-2xl font-extrabold text-red-400 mt-1">1</h5>
                    </div>
                  </div>
                </div>
              )}

              {activeMockupTab === 'survey' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-white">Technician Mobile Survey Form</h4>
                      <p className="text-xs text-slate-400">Customer: Akash Patil | Address: Mumbai, Maharashtra</p>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Offline Capable</Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Roof Area</span>
                      <span className="font-bold text-white text-sm">400 SqFt</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Shading</span>
                      <span className="font-bold text-emerald-400 text-sm">None</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Sanctioned Load</span>
                      <span className="font-bold text-amber-400 text-sm">40 kW</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Recommended Solar Capacity (Auto-calculated):</span>
                    <span className="text-blue-400 font-bold font-mono text-sm">19.5 kW System</span>
                  </div>
                </div>
              )}

              {activeMockupTab === 'quote' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-white">Quotation QT-202605051038</h4>
                      <p className="text-xs text-slate-400">Prepared For: Sneha Kulkarni (28 kW Solar System)</p>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Accepted</Badge>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2 font-mono">
                    <div className="flex justify-between text-slate-400"><span>Subtotal:</span><span>Rs 1,50,000</span></div>
                    <div className="flex justify-between text-slate-400"><span>GST (18%):</span><span>Rs 18,000</span></div>
                    <div className="flex justify-between text-emerald-400"><span>Central Subsidy (-):</span><span>Rs 78,000</span></div>
                    <div className="flex justify-between text-emerald-400"><span>State Subsidy (-):</span><span>Rs 30,000</span></div>
                    <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800"><span>Net Cost to Customer:</span><span className="text-blue-400">Rs 60,000</span></div>
                  </div>
                </div>
              )}

              {activeMockupTab === 'projects' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold text-white">Robert Pierce - 3kW Installation</h4>
                      <p className="text-xs text-slate-400">Manager: Girish MASH | Status: In Progress</p>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">10% Milestone Completed</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex justify-between items-center">
                      <span className="text-emerald-300 font-semibold">✓ Material procurement confirmed</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">Proof Uploaded</Badge>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center text-slate-400">
                      <span>Material delivered to site</span>
                      <span className="text-[10px] text-slate-500">Pending</span>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center text-slate-400">
                      <span>Structure & panel installation complete</span>
                      <span className="text-[10px] text-slate-500">Pending</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Want to test this live with real data?</span>
                <Link href="/login" className="text-blue-400 font-bold hover:underline flex items-center gap-1">
                  Launch Interactive Sandbox <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==================== 3. KEY SOLUTIONS & FEATURES SHOWCASE ==================== */}
      <section id="features" className="py-24 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1">
              End-to-End Solar CRM Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Everything Your Solar Business Needs to Scale
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Designed specifically for commercial and residential solar installers. Eliminate paperwork, streamline technician visits, and collect payments on time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Feature 1 */}
            <Card className="bg-slate-900 border-slate-800 text-left hover:border-blue-500/50 transition-all group">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Central Dashboard</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed mt-2">
                  Real-time pipeline metrics, active projects count, monthly collections total, and overdue follow-up alerts in one command center.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-slate-900 border-slate-800 text-left hover:border-blue-500/50 transition-all group">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Lead Management</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed mt-2">
                  Dual Kanban & List views with state/city filters, lead duplicate warning alerts, and automated AI WhatsApp follow-up generation.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-slate-900 border-slate-800 text-left hover:border-blue-500/50 transition-all group">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Site Survey Mobile Tool</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed mt-2">
                  Field technician tool with roof area measurement, connection load check, GPS location capture, and camera photo proof uploads.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-slate-900 border-slate-800 text-left hover:border-blue-500/50 transition-all group">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Quotation & GST Builder</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed mt-2">
                  Generate branded solar proposals with line items, 18% GST calculation, Central/State subsidy deductions, and one-tap PDF printing.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-slate-900 border-slate-800 text-left hover:border-blue-500/50 transition-all group">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Wrench className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Project Milestones</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed mt-2">
                  Track procurement, structure delivery, panel installation, inverter wiring, and net metering with mandatory photo proof validation.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-slate-900 border-slate-800 text-left hover:border-blue-500/50 transition-all group">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Subsidy Tracker</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed mt-2">
                  Track MNRE government subsidy portal applications, document checklists (NOC, ID proofs), approval history, and disbursement dates.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 7 */}
            <Card className="bg-slate-900 border-slate-800 text-left hover:border-blue-500/50 transition-all group">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <CreditCard className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">Payments & Invoicing</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed mt-2">
                  Record advance booking payments, installment receipts, view total outstanding receivables, and issue official GST Tax Invoices.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 8 */}
            <Card className="bg-slate-900 border-slate-800 text-left hover:border-blue-500/50 transition-all group">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Headset className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-white">After-Sales & AMC</CardTitle>
                <CardDescription className="text-slate-400 text-xs leading-relaxed mt-2">
                  Manage customer service support tickets (inverter alarms, net meter issues), technician visits, and annual AMC maintenance renewals.
                </CardDescription>
              </CardHeader>
            </Card>

          </div>
        </div>
      </section>

      {/* ==================== 4. ROI SAVINGS CALCULATOR ==================== */}
      <section id="roi" className="py-24 bg-slate-900 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-3 py-1">
              Business Revenue Surge
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Calculate Your Revenue Growth & ROI
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              See how much additional revenue your solar installation business can generate by automating lead follow-ups and site surveys.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch max-w-6xl mx-auto">

            {/* Left Controls */}
            <div className="lg:col-span-6 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-6 text-left flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-white mb-6">Adjust Your Monthly Metrics</h3>

                <div className="space-y-6">
                  {/* Leads Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">New Monthly Leads</span>
                      <span className="font-bold text-blue-400">{monthlyLeads} Leads</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="1000"
                      step="10"
                      value={monthlyLeads}
                      onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Close Rate Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">Current Close Rate</span>
                      <span className="font-bold text-blue-400">{closeRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="1"
                      value={closeRate}
                      onChange={(e) => setCloseRate(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Avg Deal Value Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">Average Project Value</span>
                      <span className="font-bold text-blue-400">₹{avgDealValue.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="25000"
                      value={avgDealValue}
                      onChange={(e) => setAvgDealValue(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Team Size */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">Technicians & Sales Crew</span>
                      <span className="font-bold text-blue-400">{teamSize} Members</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 border-t border-slate-700/80 pt-4 leading-relaxed">
                * Based on verified solar industry benchmark showing 30% increase in lead conversion from instant quotation PDFs and mobile survey checklists.
              </p>
            </div>

            {/* Right Results Box */}
            <div className="lg:col-span-6 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden shadow-2xl">
              <div className="space-y-6">
                <div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-semibold px-3 py-1">
                    Calculated Additional Monthly Revenue
                  </Badge>
                  <div className="text-4xl sm:text-5xl font-black text-white mt-3 font-mono">
                    +₹{monthlyRevenueGain.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Projected monthly gain from boosting closing rate from {closeRate}% to {newCloseRate}%
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                  <div>
                    <span className="text-slate-400 text-xs flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-400" /> Annual Growth Surge
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 font-mono">
                      ₹{annualRevenueGain.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-xs flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-amber-400" /> Crew Hours Saved
                    </span>
                    <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 font-mono">
                      {hoursSavedPerWeek} Hrs / Wk
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-800 pt-6 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                    <span>Eliminates paper delay — technicians upload rooftop specs on site</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                    <span>One-tap WhatsApp proposal sending increases customer response</span>
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <a href="#booking">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-600/30 gap-2">
                    <span>Get SolarCRM for Your Team</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== 5. PRICING PLANS ==================== */}
      <section id="pricing" className="py-24 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-3 py-1">
              Transparent Pricing
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Simple, Per-User Pricing
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              No hidden platform fees. Full access to offline site survey mobile tools, quotation PDF builders, and project milestone trackers.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly Billing</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-12 h-6 rounded-full bg-slate-800 p-0.5 transition-colors relative flex items-center border border-slate-700"
              >
                <span className={`h-5 w-5 rounded-full bg-blue-500 transition-transform ${billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-xs font-semibold ${billingCycle === 'annual' ? 'text-white' : 'text-slate-500'} flex items-center gap-1.5`}>
                <span>Annual Billing</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-500/30">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">

            {/* Starter Plan */}
            <Card className="bg-slate-900 border-slate-800 text-left flex flex-col justify-between">
              <CardHeader>
                <span className="text-xs font-bold text-slate-400 uppercase">Starter</span>
                <CardTitle className="text-2xl font-bold text-white mt-1">Solar SME</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-1">For small installation crews starting out.</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-extrabold text-white font-mono">₹{starterPrice}</span>
                  <span className="text-xs text-slate-400"> / User / Month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Executive Dashboard & KPI Metrics</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Lead Pipeline & Follow-up Tracker</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Basic Site Survey Checklist</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> GST Quotation PDF Builder</li>
                </ul>
                <a href="#booking" className="w-full pt-4">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800">Select Starter Plan</Button>
                </a>
              </CardContent>
            </Card>

            {/* Growth Plan (Popular) */}
            <Card className="bg-slate-900 border-2 border-blue-500 text-left flex flex-col justify-between relative shadow-2xl shadow-blue-500/20">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <CardHeader>
                <span className="text-xs font-bold text-blue-400 uppercase">Growth</span>
                <CardTitle className="text-2xl font-bold text-white mt-1">Commercial Growth</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-1">For established installers needing full automation.</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-extrabold text-white font-mono">₹{growthPrice}</span>
                  <span className="text-xs text-slate-400"> / User / Month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Everything in Starter Plan</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Offline Mobile Survey with Camera & GPS</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Installation Milestones with Proof Upload</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> MNRE Government Subsidy Tracker</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> After-Sales Tickets & AMC Renewals</li>
                </ul>
                <a href="#booking" className="w-full pt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30">Select Growth Plan</Button>
                </a>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-slate-900 border-slate-800 text-left flex flex-col justify-between">
              <CardHeader>
                <span className="text-xs font-bold text-slate-400 uppercase">Enterprise</span>
                <CardTitle className="text-2xl font-bold text-white mt-1">White-Label Custom</CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-1">For solar franchises and multi-branch agencies.</CardDescription>
                <div className="pt-4">
                  <span className="text-3xl font-extrabold text-white">Custom SLA</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Custom Domain (crm.yourcompany.com)</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Complete White-Label Branding & Logo</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Dedicated Account Manager & Onboarding</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Multi-Vertical Templates (HVAC, EV, Real Estate)</li>
                </ul>
                <a href="#booking" className="w-full pt-4">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800">Contact Enterprise Sales</Button>
                </a>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* ==================== 6. BOOK DEMO SCHEDULER ==================== */}
      <section id="booking" className="py-24 bg-slate-900 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">

            {/* Steps Tracker Header */}
            <div className="flex justify-between items-center pb-6 border-b border-slate-700 mb-6 text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Schedule Live Demo Walkthrough</span>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${bookingStep >= 1 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                <span className={`h-2 w-2 rounded-full ${bookingStep >= 2 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                <span className={`h-2 w-2 rounded-full ${bookingStep >= 3 ? 'bg-blue-400' : 'bg-slate-700'}`} />
              </div>
            </div>

            {/* Step 1: Pick Date & Time */}
            {bookingStep === 1 && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="text-lg font-bold text-white">1. Select Date</h3>
                  <p className="text-xs text-slate-400 mt-1">Choose a convenient date for a 1-on-1 walkthrough with our team.</p>

                  <div className="flex gap-2.5 overflow-x-auto py-4">
                    {availableDates.map((d, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(d.value)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all ${selectedDate === d.value
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300'
                          }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">2. Select Time Slot</h3>
                  <p className="text-xs text-slate-400 mt-1">Available time slots in Asia/Kolkata (IST):</p>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 rounded-lg border text-xs font-bold transition-all ${selectedTime === slot
                          ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300'
                          }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-end">
                  <Button
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setBookingStep(2)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5"
                  >
                    <span>Next: Business Details</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Form */}
            {bookingStep === 2 && (
              <form onSubmit={handleBookDemo} className="space-y-4 text-left">
                <div>
                  <h3 className="text-lg font-bold text-white">3. Your Information</h3>
                  <p className="text-xs text-slate-400 mt-1">Confirming slot: <span className="text-blue-400 font-bold">{selectedDate} at {selectedTime}</span></p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="mt-1 w-full text-xs p-3 rounded-lg border border-slate-700 bg-slate-900 text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Work Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="rajesh@solarcompany.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="mt-1 w-full text-xs p-3 rounded-lg border border-slate-700 bg-slate-900 text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Solar Solutions Ltd"
                        value={bookingCompany}
                        onChange={(e) => setBookingCompany(e.target.value)}
                        className="mt-1 w-full text-xs p-3 rounded-lg border border-slate-700 bg-slate-900 text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Industry Vertical</label>
                      <select
                        value={bookingRole}
                        onChange={(e) => setBookingRole(e.target.value)}
                        className="mt-1 w-full text-xs p-3 rounded-lg border border-slate-700 bg-slate-900 text-white outline-none focus:border-blue-500"
                      >
                        <option>Solar Installer</option>
                        <option>HVAC Contractor</option>
                        <option>EV Charging Installer</option>
                        <option>Interior Design Firm</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBookingStep(1)}
                    className="border-slate-700 text-slate-300 bg-slate-600 hover:bg-slate-800"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5"
                  >
                    <span>Confirm Booking</span>
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: Success */}
            {bookingStep === 3 && (
              <div className="space-y-6 py-6 text-center animate-in zoom-in-95 duration-300">
                <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Demo Walkthrough Confirmed!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-white">{bookingName}</span>. Calendar invitation sent to <span className="font-semibold text-white">{bookingEmail}</span>.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-sm mx-auto text-xs space-y-2 text-left text-slate-300 font-mono">
                  <div className="flex justify-between"><span className="text-slate-500">Date:</span> <span className="font-bold text-white">{selectedDate}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Time:</span> <span className="font-bold text-white">{selectedTime} (IST)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Company:</span> <span className="font-bold text-white">{bookingCompany}</span></div>
                </div>

                <div className="pt-2">
                  <Button onClick={resetBookingForm} variant="outline" className="text-xs border-slate-700 text-slate-300 bg-slate-800 cursor-pointer hover:bg-slate-800">
                    Schedule Another Demo
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ==================== 7. PREMIUM PRODUCT FOOTER ==================== */}
      <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-left text-xs">

            {/* Column 1: Brand Info */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2 text-white">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-amber-400 flex items-center justify-center">
                  <Sun className="h-5 w-5 text-white fill-amber-300" />
                </div>
                <span className="font-extrabold text-base tracking-tight">SolarCRM</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The all-in-one Solar Operating System for field service, engineering teams, and enterprise installers.
              </p>
              <div className="flex items-center gap-2 pt-1 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px]">System Status: 100% Operational</span>
              </div>
            </div>

            {/* Column 2: Product & Modules */}
            <div className="space-y-3">
              <h5 className="font-extrabold uppercase text-white tracking-wider text-[11px]">Product Modules</h5>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/leads" className="hover:text-blue-400 transition-colors">Lead Pipeline & Kanban</Link></li>
                <li><Link href="/surveys" className="hover:text-blue-400 transition-colors">Offline Mobile Site Survey</Link></li>
                <li><Link href="/quotations" className="hover:text-blue-400 transition-colors">GST Proposal Builder</Link></li>
                <li><Link href="/projects" className="hover:text-blue-400 transition-colors">Installation Milestones</Link></li>
                <li><Link href="/payments" className="hover:text-blue-400 transition-colors">Payments & Outstanding Ledger</Link></li>
                <li><Link href="/tickets" className="hover:text-blue-400 transition-colors">After-Sales & AMC Center</Link></li>
              </ul>
            </div>

            {/* Column 3: Multi-Vertical Adaptations */}
            <div className="space-y-3">
              <h5 className="font-extrabold uppercase text-white tracking-wider text-[11px]">Industry Templates</h5>
              <ul className="space-y-2 text-slate-400">
                <li><span className="text-white font-semibold">Solar Rooftop Energy</span> (Active)</li>
                <li><span>HVAC & Cooling Systems</span></li>
                <li><span>EV Charging Infrastructure</span></li>
                <li><span>Interior Design & Architecture</span></li>
                <li><span>Real Estate Agencies</span></li>
                <li><span>General Contracting & MEP</span></li>
              </ul>
            </div>

            {/* Column 4: Quick Links & Resources */}
            <div className="space-y-3">
              <h5 className="font-extrabold uppercase text-white tracking-wider text-[11px]">Resources & Access</h5>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/user-guide" className="hover:text-blue-400 transition-colors text-amber-400 font-semibold">User & Developer Guide</Link></li>
                <li><Link href="/login" className="hover:text-blue-400 transition-colors">Interactive Demo Portal</Link></li>
                <li><Link href="/settings" className="hover:text-blue-400 transition-colors">White-Label Branding Settings</Link></li>
                <li><a href="#booking" className="hover:text-blue-400 transition-colors">Schedule Live Walkthrough</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <p>&copy; {new Date().getFullYear()} SolarCRM Operating System. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Security & Compliance</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
