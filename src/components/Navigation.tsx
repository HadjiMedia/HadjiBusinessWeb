import React from 'react';
import { TabId } from '../types';
import { 
  Terminal, Zap, FileCode2, ClipboardList, FileText, 
  CircuitBoard, Cable, LayoutGrid, BookOpen, Keyboard, Lock, Unlock, Database, Search, Wifi, WifiOff
} from 'lucide-react';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenCmdk: () => void;
  onOpenVault: () => void;
  onOpenBackup: () => void;
  isVaultUnlocked: boolean;
  isOnline: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onOpenCmdk,
  onOpenVault,
  onOpenBackup,
  isVaultUnlocked,
  isOnline
}) => {
  const tabs = [
    // Phase 1 Tabs
    { id: 'errors' as TabId, label: 'Windows Error Matrix', icon: Terminal, phase: 'Phase 1' },
    { id: 'psu' as TabId, label: 'PSU & Rail Calculator', icon: Zap, phase: 'Phase 1' },
    { id: 'scripts' as TabId, label: 'Script Builder', icon: FileCode2, phase: 'Phase 1' },
    
    // Phase 2 Tabs
    { id: 'tickets' as TabId, label: 'Job Ticketing & Intake', icon: ClipboardList, phase: 'Phase 2' },
    { id: 'invoice' as TabId, label: 'Invoices & Work Orders', icon: FileText, phase: 'Phase 2' },
    
    // Phase 3 & Core Tabs
    { id: 'pinouts' as TabId, label: 'Header Pinouts', icon: CircuitBoard, phase: 'Phase 3' },
    { id: 'serial' as TabId, label: 'Web Serial POST', icon: Cable, phase: 'Phase 3' },
    { id: 'motherboard' as TabId, label: 'Motherboard Blueprint', icon: LayoutGrid, phase: 'Core' },
    { id: 'kb' as TabId, label: 'Software Repair Guides', icon: BookOpen, phase: 'Core' },
    { id: 'shortcuts' as TabId, label: 'Shortcut Suite', icon: Keyboard, phase: 'Core' }
  ];

  return (
    <header className="no-print space-y-4">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 font-['Space_Grotesk'] text-lg">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
                Workbench
              </h1>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold">
                DIAGNOSTICS &amp; REPAIR SUITE
              </span>
            </div>
            <p className="text-xs text-slate-400">Technical Console · Hardware &amp; OS Diagnostics</p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Offline / Online indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-mono text-xs border ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold'
            }`}
            title={isOnline ? 'Online - Service Worker Active' : 'Offline Field Mode - Fully Functional Offline'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
          </div>

          <button
            onClick={onOpenCmdk}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono bg-[#181d29] hover:bg-[#202738] border border-white/10 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Jump</span>
            <kbd className="text-[10px]">Ctrl K</kbd>
          </button>

          <button
            onClick={onOpenVault}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
              isVaultUnlocked
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25'
                : 'bg-[#181d29] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {isVaultUnlocked ? <Unlock className="w-3.5 h-3.5 text-purple-400" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isVaultUnlocked ? 'Vault Open' : 'Vault Locked'}</span>
          </button>

          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-[#181d29] hover:bg-[#202738] border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Import / Export Full System JSON Backup"
          >
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Backup / Sync</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <nav className="flex gap-1.5 overflow-x-auto pb-2 p-1.5 bg-[#12161f]/90 backdrop-blur-md border border-white/10 rounded-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
