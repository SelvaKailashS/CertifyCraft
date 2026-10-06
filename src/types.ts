export interface Participant {
  id: string;
  name: string;
  college: string;
  email: string;
  certificateId: string;
  eventTitle: string;
  date: string;
  rank: string;
  description?: string;
  customFields?: Record<string, string>;
}

export interface CanvasElement {
  id: string;
  label: string;
  type: 'text' | 'qr' | 'signature';
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  dataSource: 'name' | 'college' | 'certificateId' | 'eventTitle' | 'date' | 'rank' | 'description' | 'header' | 'subtitle' | 'custom' | 'qr';
  fontFamily: string;
  fontWeight: string;
  fontSize: number; // px on 1920x1080 canvas
  textAlign: 'left' | 'center' | 'right';
  textCase: 'uppercase' | 'capitalize' | 'none';
  color: string;
  visible: boolean;
  staticValue?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  qrUrl?: string;
}

export interface Template {
  id: string;
  name: string;
  category: 'HACKATHON' | 'SPORTS' | 'WORKSHOP' | 'ACADEMIC' | 'CUSTOM';
  description: string;
  themeColor: string;
  accentColor: string;
  bgType: 'svg-preset' | 'custom-image';
  bgImageUrl?: string;
  elements: CanvasElement[];
}

export interface ColumnMapping {
  name: string;
  college: string;
  eventTitle: string;
  date: string;
  rank: string;
  certificateId: string;
  email: string;
}
