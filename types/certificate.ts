export interface CertificateTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  borderColor: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: 'serif' | 'sans-serif' | 'cursive';
  logoUrl?: string;
  fields: CertificateField[];
  layout: 'classic' | 'modern' | 'minimalist';
  createdAt: Date;
  isDefault: boolean;
}

export interface CertificateField {
  id: string;
  type: 'text' | 'name' | 'date' | 'course' | 'duration' | 'score' | 'signature';
  label: string;
  value?: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  color: string;
  alignment: 'left' | 'center' | 'right';
  position: { x: number; y: number };
  enabled: boolean;
}

export interface GeneratedCertificate {
  id: string;
  userId: string;
  userName: string;
  moduleId: string;
  moduleName: string;
  completedAt: Date;
  templateId: string;
  certificateUrl?: string;
  verificationCode: string;
}
