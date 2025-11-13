'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QRCodeData } from '@/types';
import { validateQRCode } from '@/lib/qrService';

interface QRScannerProps {
  onScan: (data: QRCodeData) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch((err) => console.error('Error stopping scanner:', err));
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          const validatedData = validateQRCode(decodedText);
          if (validatedData) {
            onScan(validatedData);
            stopScanning();
          } else {
            const errorMsg = 'Invalid QR code';
            setError(errorMsg);
            onError?.(errorMsg);
          }
        },
        (errorMessage) => {
          // Ignore scanning errors (they occur continuously while scanning)
          console.debug('Scanning...', errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err) {
      const errorMsg = 'Failed to access camera. Please grant camera permissions.';
      setError(errorMsg);
      onError?.(errorMsg);
      console.error('Scanner error:', err);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Scan QR Code
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div
          id="qr-reader"
          className="w-full rounded-lg overflow-hidden mb-4"
          style={{ minHeight: isScanning ? '300px' : '0' }}
        />

        <div className="flex gap-3">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Scanning
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Stop Scanning
            </button>
          )}
        </div>

        <p className="text-sm text-gray-600 text-center mt-4">
          Position the QR code within the frame to scan
        </p>
      </div>
    </div>
  );
}
