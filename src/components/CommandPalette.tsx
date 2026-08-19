import React, { useState, useEffect, useRef } from 'react';
import { TabId } from '../types';
import { WINDOWS_ERROR_CODES } from '../data/errorCodes';
import { PINOUT_DEFINITIONS } from '../data/pinoutsData';
import { INITIAL_KB_ARTICLES, SHORTCUTS_DATA } from '../data/kbData';
import { MOTHERBOARD_PARTS } from '../data/motherboardData';
import { Search, Terminal, Zap, FileText, CircuitBoard, BookOpen, Layers, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabId) => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tab: TabId;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable index
  const items: SearchItem[] = [
    // Primary Tab Shortcuts
    { id: 'tab_errors', title: 'Windows Error Code & BSOD Matrix', subtitle: 'Lookup hex errors (0x80070002, 0x800F081F)', category: 'Navigation', tab: 'errors' },
    { id: 'tab_psu', title: 'Power Supply & Voltage Rail Calculator', subtitle: 'Estimate +12V/+5V/+3.3V loads & DMM limits', category: 'Navigation', tab: 'psu' },
    { id: 'tab_scripts', title: 'Technician Batch & PowerShell Script Generator', subtitle: 'Compile automated .bat/.ps1 repair scripts', category: 'Navigation', tab: 'scripts' },
    { id: 'tab_tickets', title: 'Job Ticketing & Customer Intake System', subtitle: 'Manage repair jobs, checklists, notes', category: 'Navigation', tab: 'tickets' },
    { id: 'tab_invoice', title: 'Printable Invoice & Work Order Generator', subtitle: 'Itemized hardware parts, labor rates & PDF receipt', category: 'Navigation', tab: 'invoice' },
    { id: 'tab_pinouts', title: 'Interactive Motherboard Pinout Visualizer', subtitle: 'ATX 24-pin, EPS 8-pin, Front Panel, USB 3.0', category: 'Navigation', tab: 'pinouts' },
    { id: 'tab_serial', title: 'Web Serial POST & Hardware Sensor Monitor', subtitle: 'Live ASCII terminal stream via navigator.serial', category: 'Navigation', tab: 'serial' },
    { id: 'tab_mb', title: 'Motherboard Blueprint & Jumper Guide', subtitle: 'Interactive PCB hotspots & CLR_CMOS instructions', category: 'Navigation', tab: 'motherboard' },
    { id: 'tab_kb', title: 'Software Repair Knowledge Base', subtitle: 'Step-by-step troubleshooting articles', category: 'Navigation', tab: 'kb' },
    { id: 'tab_sc', title: 'Software & Keyboard Shortcut Suite', subtitle: 'Windows, PowerPoint, Photoshop, VS Code hotkeys', category: 'Navigation', tab: 'shortcuts' },

    // Windows Error Codes
    ...WINDOWS_ERROR_CODES.map(err => ({
      id: `err_${err.hex}`,
      title: `${err.hex} - ${err.name}`,
      subtitle: err.description,
      category: 'Error Code',
      tab: 'errors' as TabId
    })),

    // Pinouts
    ...PINOUT_DEFINITIONS.map(p => ({
      id: `pin_${p.id}`,
      title: `${p.title} Pinout`,
      subtitle: p.description,
      category: 'PCB Pinout',
      tab: 'pinouts' as TabId
    })),

    // Motherboard Hotspots
    ...MOTHERBOARD_PARTS.map(m => ({
      id: `mb_${m.id}`,
      title: `${m.label}`,
      subtitle: m.brief,
      category: 'Hardware Jumper',
      tab: 'motherboard' as TabId
    })),

    // Knowledge Base Guides
    ...INITIAL_KB_ARTICLES.map(kb => ({
      id: `kb_${kb.id}`,
      title: kb.title,
      subtitle: kb.category,
      category: 'Repair Guide',
      tab: 'kb' as TabId
    })),

    // Shortcuts
    ...SHORTCUTS_DATA.map(sc => ({
      id: `sc_${sc.id}`,
      title: `${sc.action} (${sc.keys.join('+')})`,
      subtitle: `${sc.app.toUpperCase()} · ${sc.desc}`,
      category: 'Shortcut',
      tab: 'shortcuts' as TabId
    }))
  ];

  const q = query.toLowerCase().trim();
  const filtered = items.filter(i =>
    !q ||
    i.title.toLowerCase().includes(q) ||
    i.subtitle.toLowerCase().includes(q) ||
    i.category.toLowerCase().includes(q)
  ).slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(idx => Math.min(filtered.length - 1, idx + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(idx => Math.max(0, idx - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onNavigate(filtered[selectedIndex].tab);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-24 p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-[#12161f] border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-0"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Quick Jump: Search hex codes, PSU tools, pinouts, tickets, shortcuts..."
            className="w-full bg-transparent border-0 text-white placeholder-slate-500 font-mono text-sm focus:outline-none"
          />
          <kbd className="text-[10px] text-slate-400 font-mono">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No matching diagnostic tools or articles found.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  onNavigate(item.tab);
                  onClose();
                }}
                className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  idx === selectedIndex
                    ? 'bg-amber-500/20 text-white border border-amber-500/40 shadow-sm'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-amber-400 font-bold">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold font-mono text-white truncate">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
