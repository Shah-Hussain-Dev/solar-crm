'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/shared/stores/authStore';
import { useCRMStore } from '@/shared/stores/mockDbStore';
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card';
import { Sparkles, ArrowRight, ShieldAlert, Sun } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuthStore();
  const branding = useCRMStore((state) => state.branding);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already logged in? Redirect
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your work email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectDemoRole = (demoEmail: string) => {
    setEmail(demoEmail);
    setError('');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Background Glows matching Landing Page */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-blue-600/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main card wrapper */}
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Sun className="h-7 w-7 text-white fill-amber-300 animate-spin-slow" />
            </div>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">{branding.companyName || 'SolarCRM'}</h1>
            <p className="text-xs text-slate-400 mt-1">Enterprise Solar Operating System</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-900/90 border-slate-800 backdrop-blur-xl shadow-2xl text-left">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center font-bold text-white">Sign In to Dashboard</CardTitle>
            <CardDescription className="text-center text-xs text-slate-400">
              Enter your work email or click a seed profile below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Work Email Address</label>
                <input
                  type="text"
                  placeholder="e.g. amit@solarflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">SSO Password</label>
                <input
                  type="password"
                  value={password}
                  disabled
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>

              <Button 
                type="submit" 
                loading={loading} 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 shadow-lg shadow-blue-600/25 mt-2 gap-2 rounded-xl"
              >
                <span>Sign In to Platform</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Instant Demo Role Selector
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Quick Demo Profiles */}
            <div className="grid grid-cols-2 gap-2.5 text-left">
              <button
                type="button"
                onClick={() => selectDemoRole('amit@solarflow.com')}
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-950/80 hover:bg-slate-800 p-2.5 text-xs transition-all group"
              >
                <div className="h-7 w-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105">AS</div>
                <div className="truncate">
                  <div className="font-bold text-white text-xs truncate">Amit Sen</div>
                  <div className="text-[10px] text-slate-400 truncate">Admin Profile</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoRole('vikram@solarflow.com')}
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-950/80 hover:bg-slate-800 p-2.5 text-xs transition-all group"
              >
                <div className="h-7 w-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105">VS</div>
                <div className="truncate">
                  <div className="font-bold text-white text-xs truncate">Vikram Singh</div>
                  <div className="text-[10px] text-slate-400 truncate">Operations Lead</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoRole('rajesh@solarflow.com')}
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-950/80 hover:bg-slate-800 p-2.5 text-xs transition-all group"
              >
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105">RK</div>
                <div className="truncate">
                  <div className="font-bold text-white text-xs truncate">Rajesh Kumar</div>
                  <div className="text-[10px] text-slate-400 truncate">Sales Executive</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => selectDemoRole('sanjay@solarflow.com')}
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 hover:border-blue-500/50 bg-slate-950/80 hover:bg-slate-800 p-2.5 text-xs transition-all group"
              >
                <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105">SD</div>
                <div className="truncate">
                  <div className="font-bold text-white text-xs truncate">Sanjay Dutt</div>
                  <div className="text-[10px] text-slate-400 truncate">Field Tech</div>
                </div>
              </button>
            </div>

            <div className="pt-2 text-center">
              <Link href="/" className="text-xs text-blue-400 hover:underline">
                ← Back to Homepage & Features Showcase
              </Link>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
