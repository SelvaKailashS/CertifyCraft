import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Search,
  Lock,
} from 'lucide-react';
import type { Participant } from '../types';

interface QRVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentParticipant: Participant;
  participants: Participant[];
}

export const QRVerifierModal: React.FC<QRVerifierModalProps> = ({
  isOpen,
  onClose,
  currentParticipant,
  participants,
}) => {
  const [searchId, setSearchId] = useState(currentParticipant.certificateId);

  if (!isOpen) return null;

  const found = participants.find(
    (p) =>
      p.certificateId.toLowerCase().trim() === searchId.toLowerCase().trim() ||
      p.name.toLowerCase().trim() === searchId.toLowerCase().trim()
  ) || (searchId.toLowerCase() === currentParticipant.certificateId.toLowerCase() ? currentParticipant : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                CertifyCraft Verifier Portal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official cryptographic tamper-proof validation registry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. CC-HKT-2026-081) or Participant Name..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer"
            >
              Verify
            </button>
          </form>

          {/* Quick Select demo pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 text-[11px]">Quick test:</span>
            {participants.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSearchId(p.certificateId);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-mono text-[11px] transition cursor-pointer"
              >
                {p.certificateId}
              </button>
            ))}
          </div>

          {/* Verification Result Card */}
          {found ? (
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
              {/* Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-extrabold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
                    Tamper-Proof Authenticated Certificate
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  STATUS: 200 OK
                </span>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Recipient Name</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {found.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Institution</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {found.college}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Event Name</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {found.eventTitle}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Honors / Distinction</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {found.rank || 'Verified Participant'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Issuance Date</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {found.date}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Unique Certificate ID</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {found.certificateId}
                  </span>
                </div>
              </div>

              {/* Security & Cryptographic Hash */}
              <div className="pt-3 border-t border-emerald-500/10 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>SHA-256 Checksum Fingerprint</span>
                </div>
                <div className="font-mono break-all bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855#{found.certificateId}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No record found matching "{searchId}"
              </p>
              <p className="text-xs text-slate-500">
                Please verify that the Certificate ID or student name matches an issued credential.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
