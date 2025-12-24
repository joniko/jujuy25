"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'oremos_install_banner_dismissed';

export default function InstallBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed
    const isDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    
    // Check if app is already installed (running as PWA)
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (window.navigator as any).standalone === true;

    // Show banner only if not dismissed and not installed
    if (!isDismissed && !isInstalled) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-40 bg-primary text-primary-foreground border-b border-primary-foreground/20">
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Smartphone className="w-4 h-4 shrink-0" />
          <Link 
            href="/instalar"
            className="text-sm font-medium hover:underline truncate"
          >
          Guardá Oremos en tu pantalla de inicio
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-7 w-7 hover:bg-primary-foreground/20 text-primary-foreground"
          onClick={handleDismiss}
          aria-label="Cerrar banner"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

