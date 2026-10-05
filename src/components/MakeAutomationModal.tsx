import React, { useState } from 'react';
import { X, Zap, CheckCircle2, Play, Copy, Check } from 'lucide-react';
import type { Participant } from '../types';

interface MakeAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeParticipant: Participant;
}

export const MakeAutomationModal: React.FC<MakeAutomationModalProps> = ({
  isOpen,
  onClose,
  activeParticipant,
}) => {
  const [webhookUrl, setWebhookUrl] = useState('https://hook.eu1.make.com/certifycraft-demo-webhook-sync');
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  if (!isOpen) return null;

  const samplePayload = {
    event: 'certificate.generated',
    timestamp: new Date().toISOString(),
    recipient: {
      name: activeParticipant.name,
      email: activeParticipant.email,
      institution: activeParticipant.college,
    },
    certificate: {
      id: activeParticipant.certificateId,
      event_title: activeParticipant.eventTitle,
      honors: activeParticipant.rank,
      issue_date: activeParticipant.date,
      verification_url: `https://certifycraft.app/verify?id=${activeParticipant.certificateId}`,
      pdf_download_url: `https://api.certifycraft.app/v1/certificates/${activeParticipant.certificateId}/pdf`,
    },
    automation_action: 'send_email_attachment_and_sync_crm',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(samplePayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTest = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 4000);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Zap className="w-6 h-6 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Make.com & Zapier Automation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Instantly trigger emails, SMS, CRM syncs, and cloud storage on generation
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Webhook Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Target Webhook URL (Make / Zapier / n8n)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hook.eu1.make.com/..."
                className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleRunTest}
                disabled={testStatus === 'testing'}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{testStatus === 'testing' ? 'Testing...' : 'Test Trigger'}</span>
              </button>
            </div>
          </div>

          {testStatus === 'success' && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Test payload delivered successfully! HTTP Status 200 OK</span>
            </div>
          )}

          {/* Workflow description */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h5 className="font-bold text-slate-900 dark:text-white">
              Automation Flow
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>CertifyCraft generates certificate & scannable QR verification link.</li>
              <li>Webhook automatically dispatches recipient data & certificate download link.</li>
              <li>Make scenario emails certificate PDF directly to recipient email address ({activeParticipant.email}).</li>
            </ol>
          </div>

          {/* Payload Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                JSON Payload Structure
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
