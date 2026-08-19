import React, { useState } from 'react';
import { Lock, Unlock, KeyRound } from 'lucide-react';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
  onUnlockSuccess: () => void;
  onLock: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  isUnlocked,
  onUnlockSuccess,
  onLock
}) => {
  const savedPinHash = localStorage.getItem('wb_vault_pin_hash');
  const [pinInput, setPinInput] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const simpleHash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    return 'v_' + h.toString(36);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!savedPinHash) {
      // First-time setup
      if (pinInput.length < 4) {
        setErrorMsg('PIN must be at least 4 digits.');
        return;
      }
      if (pinInput !== pinConfirm) {
        setErrorMsg('PINs do not match.');
        return;
      }
      const hash = simpleHash(pinInput);
      localStorage.setItem('wb_vault_pin_hash', hash);
      onUnlockSuccess();
      onClose();
    } else {
      // Unlock
      if (simpleHash(pinInput) === savedPinHash) {
        onUnlockSuccess();
        onClose();
      } else {
        setErrorMsg('Incorrect PIN. Access denied.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#12161f] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center text-xl">
          <KeyRound className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
            {savedPinHash ? (isUnlocked ? 'Vault Status' : 'Unlock Restricted Docs') : 'Set Master Vault PIN'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {savedPinHash
              ? (isUnlocked ? 'The documentation vault is currently unlocked.' : 'Enter your technician security PIN to access restricted repair guides.')
              : 'Create a security PIN (4+ digits) to protect sensitive technician manuals.'}
          </p>
        </div>

        {isUnlocked && savedPinHash ? (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                onLock();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all"
            >
              Lock Vault Now
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-mono text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="Enter PIN"
              className="w-full bg-[#181d29] border border-white/10 rounded-xl px-3 py-2 text-center text-lg font-mono text-white tracking-widest focus:border-purple-400"
            />

            {!savedPinHash && (
              <input
                type="password"
                value={pinConfirm}
                onChange={e => setPinConfirm(e.target.value)}
                placeholder="Confirm PIN"
                className="w-full bg-[#181d29] border border-white/10 rounded-xl px-3 py-2 text-center text-lg font-mono text-white tracking-widest focus:border-purple-400"
              />
            )}

            {errorMsg && (
              <p className="text-xs text-rose-400 font-mono">{errorMsg}</p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl text-xs font-mono bg-white/5 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl text-xs font-mono font-bold bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20"
              >
                {savedPinHash ? 'Unlock' : 'Save PIN'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
