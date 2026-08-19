import React, { useState, useEffect, useCallback } from 'react';
import { TabId, JobTicket } from './types';
import { Navigation } from './components/Navigation';
import { ErrorMatrix } from './components/ErrorMatrix';
import { PsuCalculator } from './components/PsuCalculator';
import { ScriptGenerator } from './components/ScriptGenerator';
import { TicketingSystem } from './components/TicketingSystem';
import { InvoiceGenerator } from './components/InvoiceGenerator';
import { PinoutVisualizer } from './components/PinoutVisualizer';
import { SerialMonitor } from './components/SerialMonitor';
import { MotherboardCanvas } from './components/MotherboardCanvas';
import { KnowledgeBase } from './components/KnowledgeBase';
import { ShortcutHub } from './components/ShortcutHub';
import { CommandPalette } from './components/CommandPalette';
import { VaultModal } from './components/VaultModal';
import { BackupModal } from './components/BackupModal';

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    try {
      const saved = localStorage.getItem('wb_active_tab');
      return (saved as TabId) || 'errors';
    } catch {
      return 'errors';
    }
  });

  const [activeInvoiceTicket, setActiveInvoiceTicket] = useState<JobTicket | null>(null);
  const [isCmdkOpen, setIsCmdkOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Sync tab change
  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    localStorage.setItem('wb_active_tab', tab);
  }, []);

  // Open ticket directly in Invoice Generator
  const handleOpenTicketInvoice = (ticket: JobTicket) => {
    setActiveInvoiceTicket(ticket);
    handleTabChange('invoice');
  };

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdkOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Online / Offline monitor
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#090c12] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top Banner & Navigation Container */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        <Navigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenCmdk={() => setIsCmdkOpen(true)}
          onOpenVault={() => setIsVaultModalOpen(true)}
          onOpenBackup={() => setIsBackupModalOpen(true)}
          isVaultUnlocked={isVaultUnlocked}
          isOnline={isOnline}
        />

        {/* Tab Viewport Routing */}
        <main className="transition-all duration-150">
          {activeTab === 'errors' && <ErrorMatrix />}
          {activeTab === 'psu' && <PsuCalculator />}
          {activeTab === 'scripts' && <ScriptGenerator />}
          {activeTab === 'tickets' && <TicketingSystem onOpenInvoice={handleOpenTicketInvoice} />}
          {activeTab === 'invoice' && (
            <InvoiceGenerator
              initialTicket={activeInvoiceTicket}
              onBackToTickets={() => handleTabChange('tickets')}
            />
          )}
          {activeTab === 'pinouts' && <PinoutVisualizer />}
          {activeTab === 'serial' && <SerialMonitor />}
          {activeTab === 'motherboard' && <MotherboardCanvas />}
          {activeTab === 'kb' && (
            <KnowledgeBase
              isVaultUnlocked={isVaultUnlocked}
              onOpenVaultModal={() => setIsVaultModalOpen(true)}
            />
          )}
          {activeTab === 'shortcuts' && <ShortcutHub />}
        </main>
      </div>

      {/* App Footer */}
      <footer className="no-print border-t border-white/5 py-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Workbench Diagnostics &amp; Software Repair Console · v3.0.0</span>
          <span>Offline-Ready PWA · Web Serial · Hardware Schematics · Local Storage</span>
        </div>
      </footer>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCmdkOpen}
        onClose={() => setIsCmdkOpen(false)}
        onNavigate={handleTabChange}
      />

      <VaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        isUnlocked={isVaultUnlocked}
        onUnlockSuccess={() => setIsVaultUnlocked(true)}
        onLock={() => setIsVaultUnlocked(false)}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onRestoreComplete={() => {
          setIsBackupModalOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}

export default App;
