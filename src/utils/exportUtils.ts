import * as XLSX from 'xlsx';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Participant } from '../types';

export const downloadSampleExcel = () => {
  const data = [
    {
      'Student Name': 'Aarav Sharma',
      'College / University': 'Indian Institute of Technology, Bombay',
      'Event Name': 'National 36-Hour AI Hackathon',
      'Date': 'October 15, 2026',
      'Rank / Award': 'Winner - 1st Place',
      'Certificate ID': 'CC-HKT-2026-081',
      'Student Email': 'aarav.sharma@iitb.ac.in',
    },
    {
      'Student Name': 'Sneha Patel',
      'College / University': 'National Institute of Technology, Karnataka',
      'Event Name': 'National 36-Hour AI Hackathon',
      'Date': 'October 15, 2026',
      'Rank / Award': 'Runner Up - 2nd Place',
      'Certificate ID': 'CC-HKT-2026-082',
      'Student Email': 'sneha.patel@nitk.edu.in',
    },
    {
      'Student Name': 'Rohan Deshmukh',
      'College / University': 'College of Engineering, Pune',
      'Event Name': 'National 36-Hour AI Hackathon',
      'Date': 'October 15, 2026',
      'Rank / Award': '2nd Runner Up - 3rd Place',
      'Certificate ID': 'CC-HKT-2026-083',
      'Student Email': 'deshmukh.r@coep.ac.in',
    },
    {
      'Student Name': 'Ananya Iyer',
      'College / University': 'BITS Pilani',
      'Event Name': 'National 36-Hour AI Hackathon',
      'Date': 'October 15, 2026',
      'Rank / Award': 'Best Innovation Award',
      'Certificate ID': 'CC-HKT-2026-084',
      'Student Email': 'ananya.iyer@pilani.bits-pilani.ac.in',
    },
    {
      'Student Name': 'Vikram Malhotra',
      'College / University': 'Delhi Technological University',
      'Event Name': 'National 36-Hour AI Hackathon',
      'Date': 'October 15, 2026',
      'Rank / Award': 'Finalist - Top 10',
      'Certificate ID': 'CC-HKT-2026-085',
      'Student Email': 'vikram.m@dtu.ac.in',
    },
    {
      'Student Name': 'Pooja Reddy',
      'College / University': 'IIIT Hyderabad',
      'Event Name': 'National 36-Hour AI Hackathon',
      'Date': 'October 15, 2026',
      'Rank / Award': 'Best Technical Design',
      'Certificate ID': 'CC-HKT-2026-086',
      'Student Email': 'pooja.reddy@iiit.ac.in',
    },
    {
      'Student Name': 'Kabir Mehta',
      'College / University': 'Jadavpur University',
      'Event Name': 'National 36-Hour AI Hackathon',
      'Date': 'October 15, 2026',
      'Rank / Award': 'Special Mention',
      'Certificate ID': 'CC-HKT-2026-087',
      'Student Email': 'kabir.m@ju.edu.in',
    },
    {
      'Student Name': 'Meera Nambiar',
      'College / University': 'PSG College of Technology',
      'Event Name': 'National 36-Hour AI Hackathon',
      'Date': 'October 15, 2026',
      'Rank / Award': 'Participant',
      'Certificate ID': 'CC-HKT-2026-088',
      'Student Email': 'meera.n@psgtech.ac.in',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Roster');
  XLSX.writeFile(wb, 'CertifyCraft_Sample_Roster.xlsx');
};

export const generateQrDataUrl = async (certId: string, _name?: string): Promise<string> => {
  const verifyUrl = `https://certifycraft.app/verify?id=${encodeURIComponent(certId)}&auth=valid&ts=2026-10-15`;
  try {
    return await QRCode.toDataURL(verifyUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#ffffff',
        light: '#00000000', // transparent
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
};

export const svgToCanvas = async (svgElement: SVGSVGElement): Promise<HTMLCanvasElement> => {
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URL = window.URL || window.webkitURL || window;
  const blobURL = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(blobURL);
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, 1920, 1080);
      URL.revokeObjectURL(blobURL);
      resolve(canvas);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(blobURL);
      reject(e);
    };
    img.src = blobURL;
  });
};

export const exportToPng = async (svgElement: SVGSVGElement, filename: string = 'certificate.png') => {
  const canvas = await svgToCanvas(svgElement);
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, filename);
    }
  }, 'image/png');
};

export const exportToPdf = async (svgElement: SVGSVGElement, filename: string = 'certificate.pdf') => {
  const canvas = await svgToCanvas(svgElement);
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1920, 1080],
  });
  pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080);
  pdf.save(filename);
};

export const exportBulkZip = async (
  participants: Participant[],
  renderSingleSvg: (participant: Participant) => Promise<SVGSVGElement>,
  format: 'png' | 'pdf' = 'png',
  onProgress?: (current: number, total: number) => void
) => {
  const zip = new JSZip();
  const folder = zip.folder('Certificates') || zip;
  const total = participants.length;

  for (let i = 0; i < total; i++) {
    const p = participants[i];
    if (onProgress) onProgress(i + 1, total);

    const svg = await renderSingleSvg(p);
    const canvas = await svgToCanvas(svg);

    const sanitizedName = p.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeCertId = p.certificateId.replace(/[^a-zA-Z0-9_-]/g, '_');

    if (format === 'png') {
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      folder.file(`${safeCertId}_${sanitizedName}.png`, base64Data, { base64: true });
    } else {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080],
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080);
      const pdfBlob = pdf.output('blob');
      folder.file(`${safeCertId}_${sanitizedName}.pdf`, pdfBlob);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `CertifyCraft_Bulk_${participants.length}_Certificates.zip`);
};
