import { jsPDF } from 'jspdf';
import { svgToCanvas } from './exportUtils';
import type { Participant } from '../types';

export interface AutomationLog {
  id: string;
  studentName: string;
  studentEmail: string;
  status: 'pending' | 'generating' | 'sending' | 'success' | 'failed';
  message?: string;
  timestamp: string;
}

export interface AutomationConfig {
  webhookUrl: string;
  emailSubject: string;
  emailBodyTemplate: string;
  delayMs: number; // throttle between requests to avoid rate limits
  concurrency: number;
}

export const DEFAULT_CONFIG: AutomationConfig = {
  webhookUrl: 'http://localhost:5678/webhook/certifycraft-email',
  emailSubject: 'Your Official Certificate of Participation - {eventTitle}',
  emailBodyTemplate:
    'Hi {name},\n\nCongratulations on participating in {eventTitle} representing {college}!\n\nPlease find your official verified certificate (Certificate ID: {certificateId}) attached as a PDF.\n\nBest regards,\nOrganizing Committee',
  delayMs: 200,
  concurrency: 2,
};

/**
 * Generates an offscreen SVG and renders it to a PDF base64 string
 */
export const generatePdfBase64 = async (
  svgElement: SVGSVGElement
): Promise<string> => {
  const canvas = await svgToCanvas(svgElement);
  const imgData = canvas.toDataURL('image/png', 1.0);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1920, 1080],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080);
  const dataUri = pdf.output('datauristring');
  // Extract pure base64
  return dataUri.split(',')[1] || '';
};

/**
 * Dispatches student payload to n8n webhook
 */
export const dispatchToWebhook = async (
  webhookUrl: string,
  participant: Participant,
  pdfBase64: string,
  config: AutomationConfig
): Promise<{ success: boolean; statusText?: string }> => {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    throw new Error('Please enter a valid n8n Webhook URL');
  }

  const subject = config.emailSubject
    .replace(/{name}/g, participant.name)
    .replace(/{eventTitle}/g, participant.eventTitle)
    .replace(/{college}/g, participant.college)
    .replace(/{certificateId}/g, participant.certificateId);

  const body = config.emailBodyTemplate
    .replace(/{name}/g, participant.name)
    .replace(/{eventTitle}/g, participant.eventTitle)
    .replace(/{college}/g, participant.college)
    .replace(/{certificateId}/g, participant.certificateId);

  const safeFilename = `Certificate_${participant.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

  const payload = {
    recipient_email: participant.email,
    recipient_name: participant.name,
    recipient_college: participant.college,
    certificate_id: participant.certificateId,
    event_title: participant.eventTitle,
    issue_date: participant.date,
    rank: participant.rank || 'Participant',
    subject: subject,
    message: body,
    pdf_filename: safeFilename,
    pdf_base64: pdfBase64,
    pdf_data_uri: `data:application/pdf;base64,${pdfBase64}`,
    verification_url: `https://certifycraft.app/verify?id=${encodeURIComponent(participant.certificateId)}`,
    generated_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let msg = `HTTP ${response.status} ${response.statusText}`;
      try {
        const parsed = JSON.parse(text);
        if (parsed.message) msg = `${parsed.message} ${parsed.hint || ''}`;
      } catch {}
      return { success: false, statusText: msg.trim() };
    }
    return { success: true, statusText: 'Delivered (HTTP 200)' };
  } catch (err: any) {
    return { 
      success: false, 
      statusText: err.message || 'Network error: could not connect to webhook URL' 
    };
  }
};

export const dispatchToMakeWebhook = dispatchToWebhook;
