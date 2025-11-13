import QRCode from 'qrcode';
import { QRCodeData } from '@/types';
import { generateToken } from './utils';

export async function generateQRCode(data: Omit<QRCodeData, 'token' | 'timestamp'>): Promise<string> {
  const qrData: QRCodeData = {
    ...data,
    timestamp: Date.now(),
    token: generateToken(),
  };

  const qrString = JSON.stringify(qrData);
  const qrCodeDataURL = await QRCode.toDataURL(qrString, {
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  return qrCodeDataURL;
}

export function validateQRCode(scannedData: string): QRCodeData | null {
  try {
    const data = JSON.parse(scannedData) as QRCodeData;

    // Validate required fields
    if (!data.type || !data.id || !data.name || !data.token) {
      return null;
    }

    // Check if QR code has expired (if validUntil is set)
    if (data.validUntil && Date.now() > data.validUntil) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Invalid QR code data:', error);
    return null;
  }
}
