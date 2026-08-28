'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Detect if already in standalone mode
    if (typeof window === 'undefined') return;
    
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const detectIOS = /ipad|iphone|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(detectIOS);

    // 3. Setup Session Count for resurfacing rules
    const sessionKey = 'pwa_session_incremented';
    let currentSessionCount = parseInt(localStorage.getItem('pwa_session_count') || '0', 10);
    
    if (!sessionStorage.getItem(sessionKey)) {
      currentSessionCount += 1;
      localStorage.setItem('pwa_session_count', currentSessionCount.toString());
      sessionStorage.setItem(sessionKey, 'true');
    }

    const dismissedSession = parseInt(localStorage.getItem('pwa_dismissed_session') || '0', 10);
    const hasBeenDismissedRecently = dismissedSession > 0 && (currentSessionCount - dismissedSession < 3);

    // 4. Listen for beforeinstallprompt event (Android / Chrome / Desktop Edge/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Only show if not recently dismissed
      if (!hasBeenDismissedRecently) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. For iOS, if safari is detected and we are not standalone, and not recently dismissed, show iOS guide
    const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    if (detectIOS && isSafari && !hasBeenDismissedRecently) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    // Trigger standard install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // Clear prompt event and hide UI
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    const currentSessionCount = parseInt(localStorage.getItem('pwa_session_count') || '1', 10);
    localStorage.setItem('pwa_dismissed_session', currentSessionCount.toString());
    setShowPrompt(false);
    setShowIosGuide(false);
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Install Banner */}
      {!showIosGuide ? (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-card/90 backdrop-blur-md border border-border/85 shadow-2xl rounded-2xl p-4 md:p-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3 items-center">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-card-foreground">Install SolarFlow CRM</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Access leads, surveys, and schedules instantly from your home screen with full offline capability.
                </p>
              </div>
            </div>
            <button 
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted/80 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2.5 justify-end mt-4">
            <Button variant="outline" size="sm" onClick={handleDismiss} className="text-xs font-medium">
              Maybe Later
            </Button>
            <Button size="sm" onClick={handleInstallClick} className="text-xs font-medium bg-primary hover:bg-primary/95 text-primary-foreground shadow-md gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Install App
            </Button>
          </div>
        </div>
      ) : (
        /* iOS Instruction Bottom Sheet Overlay */
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-t-3xl border-t border-border shadow-2xl p-6 pb-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Add to Home Screen</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Follow these simple steps to install the app on iOS Safari.</p>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted/80 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div className="text-sm text-card-foreground">
                  Tap the <span className="font-semibold inline-flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-xs text-muted-foreground"><Share className="w-3.5 h-3.5 inline" /> Share</span> button at the bottom of Safari.
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div className="text-sm text-card-foreground">
                  Scroll down the share menu and select <span className="font-semibold inline-flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-xs text-muted-foreground"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</span>.
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div className="text-sm text-card-foreground">
                  Confirm by tapping <span className="font-semibold text-primary">Add</span> in the top right corner.
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={handleDismiss} className="w-full bg-primary hover:bg-primary/95 text-primary-foreground">
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
