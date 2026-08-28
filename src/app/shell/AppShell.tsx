'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, FolderCheck, CreditCard, Wrench, 
  Settings, LogOut, Plus, WifiOff, Search, Menu, X, 
  Sun, Moon, Bot, ClipboardList, Award, Sparkles, Check, ChevronDown,
  Headphones, FileText, BookOpen, BookOpenCheck, Bell
} from 'lucide-react';
import { useAuthStore } from '@/shared/stores/authStore';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { useOfflineStore } from '@/shared/stores/offlineStore';
import { cn } from '@/shared/utils/cn';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, switchUser } = useAuthStore();
  const users = useCRMStore((state) => state.users);
  const leads = useCRMStore((state) => state.leads);
  const projects = useCRMStore((state) => state.projects);
  const branding = useCRMStore((state) => state.branding);
  const permissions = useCRMStore((state) => state.permissions);
  
  const { isOffline, setOffline } = useOfflineStore();
  
  // Theme state defaulting to Dark Mode (true) unless explicitly set to 'light'
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('solar_crm_theme');
      return saved === 'light' ? false : true;
    }
    return true;
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Notifications
  const paymentsList = useCRMStore((state) => state.payments) || [];
  const ticketsList = useCRMStore((state) => state.tickets) || [];
  const projectsList = useCRMStore((state) => state.projects) || [];

  const overduePayments = paymentsList.filter(p => p.status === 'overdue');
  const openTickets = ticketsList.filter(t => t.status === 'open');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Keyboard shortcuts (Cmd+K / Ctrl+K for command menu)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync dark mode style and persist in localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      try { localStorage.setItem('solar_crm_theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      try { localStorage.setItem('solar_crm_theme', 'light'); } catch (e) {}
    }
  }, [isDarkMode]);

  // Force redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const rolePerms = permissions[user.role] || { leads: [], quotes: [], surveys: [], subsidy: [], payments: [], tickets: [], settings: [] };
  const isHi = branding.language === 'hi';
  const template = branding.activeTemplate || 'solar';

  const surveyLabel = 
    template === 'hvac' 
      ? (isHi ? 'लोड ऑडिट' : 'HVAC Load Audits')
      : template === 'construction'
      ? (isHi ? 'साइट मूल्यांकन' : 'Site Assessments')
      : (isHi ? 'साइट सर्वे' : 'Site Surveys');

  const subsidyLabel = 
    template === 'hvac' 
      ? (isHi ? 'परमिट ट्रैकर' : 'Permit Tracker')
      : template === 'construction'
      ? (isHi ? 'ज़ोनिंग मंजूरी' : 'Zoning Approvals')
      : (isHi ? 'सब्सिडी ट्रैकर' : 'Subsidy Tracker');

  const coreNavItems = [
    { path: '/dashboard', label: isHi ? 'डैशबोर्ड' : 'Dashboard', icon: LayoutDashboard, allowed: true },
    { path: '/leads', label: isHi ? 'लीड्स' : 'Leads', icon: Users, allowed: rolePerms.leads?.includes('read') },
    { path: '/projects', label: isHi ? 'प्रोजेक्ट्स' : 'Projects', icon: FolderCheck, allowed: rolePerms.leads?.includes('read') || rolePerms.surveys?.includes('read') },
    { path: '/surveys', label: surveyLabel, icon: ClipboardList, allowed: rolePerms.surveys?.includes('read') },
    { path: '/subsidy', label: subsidyLabel, icon: Award, allowed: rolePerms.subsidy?.includes('read') },
    { path: '/payments', label: isHi ? 'भुगतान' : 'Payments', icon: CreditCard, allowed: rolePerms.payments?.includes('read') },
    { path: '/tickets', label: isHi ? 'टिकट एवं एएमसी' : 'Tickets & AMC', icon: Wrench, allowed: rolePerms.tickets?.includes('read') },
    { path: '/customers', label: isHi ? 'ग्राहक' : 'Customers', icon: Users, allowed: rolePerms.leads?.includes('read') },
    { path: '/settings', label: isHi ? 'सेटिंग्स' : 'Settings', icon: Settings, allowed: rolePerms.settings?.includes('read') },
    { path: '/how-it-works', label: isHi ? 'यह कैसे काम करता है' : 'How It Works', icon: BookOpenCheck, allowed: true },
  ];

  const remindersList = [
    ...overduePayments.map(p => ({
      id: p.id,
      title: isHi ? 'अतिदेय भुगतान अनुसूची' : 'Overdue Installment Alert',
      body: isHi 
        ? `${projectsList.find(pr => pr.id === p.projectId)?.name || 'प्रोजेक्ट'} के लिए ${formatCurrency(p.amount)} का भुगतान अतिदेय है।`
        : `Payment of ${formatCurrency(p.amount)} is overdue for project ${projectsList.find(pr => pr.id === p.projectId)?.name || 'Project'}.`,
      type: 'payment' as const
    })),
    ...openTickets.slice(0, 2).map(t => ({
      id: t.id,
      title: isHi ? 'नया सेवा टिकट लंबित' : 'Pending Support Request',
      body: isHi 
        ? `टिकट "${t.title}" अभी अनसुलझा है।` 
        : `Ticket "${t.title}" is currently unresolved. Needs crew assignment.`,
      type: 'ticket' as const
    })),
    {
      id: 'rem-1',
      title: isHi ? 'एआई फॉलो-अप संदेश तैयार' : 'AI Follow-up Alert',
      body: isHi
        ? 'अमित सेन: योग्य चरण आउटरीच के लिए मसौदा संदेश समीक्षा के लिए उपलब्ध है।'
        : 'Amit Sen: Outreach follow-up draft is ready for review on the timeline.',
      type: 'followup' as const
    }
  ];

  const allowedNavItems = coreNavItems.filter(item => item.allowed);

  const filteredSearchLeads = searchQuery ? leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.company.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4) : [];

  const filteredSearchProjects = searchQuery ? projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 4) : [];

  const handleSearchSelect = (url: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    router.push(url);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-blue-600 selection:text-white">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-600 text-white text-xs font-semibold py-1.5 px-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <WifiOff className="h-3.5 w-3.5 animate-pulse" />
            <span>Working Offline. Changes will sync when connectivity returns.</span>
          </div>
          <button 
            onClick={() => setOffline(false)} 
            className="underline hover:text-amber-100 text-[10px] uppercase font-bold"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card/85 backdrop-blur-md px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Logo Mock */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg overflow-hidden border border-border flex items-center justify-center bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:block">
              {branding.companyName}
            </span>
          </Link>
          
          {/* Command Search Indicator */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/60 hover:bg-muted/50 transition-colors ml-4 max-sm:w-10 max-sm:h-10 max-sm:p-0 max-sm:justify-center"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Simulate Offline toggle */}
          <button
            onClick={() => setOffline(!isOffline)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all",
              isOffline 
                ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400"
                : "bg-green-50 text-green-800 border-green-300 hover:bg-green-100 dark:bg-green-950/20 dark:text-green-400"
            )}
          >
            <span className={cn("h-2 w-2 rounded-full animate-ping", isOffline ? "bg-amber-500" : "bg-green-500")} />
            <span className="hidden md:inline">{isOffline ? 'Offline Mode' : 'Online Mode'}</span>
          </button>

          {/* Theme Toggler Pill */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Toggle Theme (Light / Dark Mode)"
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 text-amber-400 fill-amber-400/20" />
                <span className="hidden sm:inline text-amber-300 font-bold">Dark Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-slate-700" />
                <span className="hidden sm:inline text-slate-700 font-bold">Light Mode</span>
              </>
            )}
          </button>

          {/* In-app Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(prev => !prev)}
              className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors border border-border relative bg-card"
            >
              <Bell className="h-4 w-4" />
              {remindersList.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-md border border-border bg-card p-2 shadow-lg z-50 animate-in fade-in duration-150 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 border-b border-border text-xs text-foreground/50 font-bold uppercase flex justify-between items-center">
                  <span>{isHi ? 'अनुस्मारक एवं अलर्ट' : 'System Reminders'}</span>
                  <Badge variant="outline" className="text-[9px] bg-red-50 text-red-700 border-red-200">
                    {remindersList.length} {isHi ? 'सक्रिय' : 'Active'}
                  </Badge>
                </div>
                <div className="divide-y divide-border mt-1">
                  {remindersList.map((rem) => (
                    <button
                      key={rem.id}
                      onClick={() => setNotifOpen(false)}
                      className="w-full p-3 hover:bg-muted/40 transition-colors text-left flex flex-col gap-0.5"
                    >
                      <span className="font-bold text-xs text-foreground">{rem.title}</span>
                      <p className="text-[10px] text-muted-foreground leading-normal">{rem.body}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Switch User / Role selector */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(prev => !prev)}
              className="flex items-center gap-2 text-sm font-medium hover:bg-muted p-1.5 rounded-lg border border-border bg-card"
            >
              <div className="h-7 w-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold">
                {user.avatar}
              </div>
              <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card p-1 shadow-md z-50 animate-in fade-in duration-100">
                <div className="px-3 py-2 border-b border-border text-xs text-foreground/50 font-bold uppercase">
                  Switch Role Profile
                </div>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id, users);
                      setUserMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-muted text-left",
                      user.id === u.id && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <div>
                      <div>{u.name}</div>
                      <div className="text-xs opacity-60 capitalize">{u.role}</div>
                    </div>
                    {user.id === u.id && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={() => logout()}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main shell body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation - Fixed Viewport Desktop */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4 shrink-0 h-[calc(100vh-4rem)] justify-between overflow-hidden">
          {/* Scrollable Navigation Items */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1">
            <div className="mb-3 px-3 text-xs font-bold text-foreground/45 uppercase tracking-wider">
              Navigation
            </div>
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive 
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm scale-[1.02]' 
                      : 'text-foreground/75 hover:bg-primary/10 hover:text-primary'
                  )}
                >
                  <Icon className={cn('h-4.5 w-4.5', isActive ? 'text-primary-foreground' : 'text-foreground/60')} />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-4">
              <Link
                href="/user-guide"
                className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-bold"
              >
                <BookOpen className="h-4 w-4" />
                <span>User & Developer Guide</span>
              </Link>
            </div>
          </div>

          {/* Sticky Bottom Sidebar Footer - Fixed Viewport */}
          <div className="pt-3 border-t border-border mt-2 space-y-2 shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/60 text-xs">
              <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate text-xs">{user.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize truncate">{user.role}</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 bg-background">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border flex justify-around items-center h-16 px-2 safe-padding-bottom">
        {allowedNavItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full py-1 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary font-bold' : 'text-foreground/60 hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Command Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card text-foreground rounded-xl border border-border w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center px-4 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <input
                type="text"
                autoFocus
                placeholder="Search leads, projects, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto text-xs">
              {searchQuery ? (
                <>
                  {filteredSearchLeads.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Leads</div>
                      {filteredSearchLeads.map(l => (
                        <button
                          key={l.id}
                          onClick={() => handleSearchSelect(`/leads/${l.id}`)}
                          className="w-full p-2 hover:bg-muted rounded-lg text-left font-medium flex justify-between items-center"
                        >
                          <span>{l.name} ({l.company})</span>
                          <Badge variant="outline" className="text-[10px]">Lead</Badge>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredSearchProjects.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Projects</div>
                      {filteredSearchProjects.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleSearchSelect(`/projects/${p.id}`)}
                          className="w-full p-2 hover:bg-muted rounded-lg text-left font-medium flex justify-between items-center"
                        >
                          <span>{p.name}</span>
                          <Badge variant="outline" className="text-[10px]">Project</Badge>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredSearchLeads.length === 0 && filteredSearchProjects.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No matching leads or projects found.</p>
                  )}
                </>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  Type to search leads by customer name or company...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
