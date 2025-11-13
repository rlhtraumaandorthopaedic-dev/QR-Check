'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AttendanceEvent } from '@/types';
import { generateQRCode } from '@/lib/qrService';
import { QrCode, Download } from 'lucide-react';

export default function AdminQRGenerator() {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!eventName || !location) {
      alert('Please fill in event name and location');
      return;
    }

    setLoading(true);

    try {
      // Create event in database
      const event: Omit<AttendanceEvent, 'id' | 'qrCode'> = {
        name: eventName,
        description,
        location,
        startTime: new Date(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours later
        createdBy: 'admin', // Replace with actual user ID
        isActive: true,
      };

      const docRef = await addDoc(collection(db, 'events'), event);
      const newEventId = docRef.id;

      // Generate QR code
      const qrCode = await generateQRCode({
        type: 'attendance',
        id: newEventId,
        name: eventName,
      });

      // Update event with QR code
      // Note: In production, store QR code or regenerate on demand
      setQrCodeUrl(qrCode);
      setEventId(newEventId);

      setLoading(false);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${eventName.replace(/\s+/g, '-')}-qr-code.png`;
    link.click();
  };

  const handleReset = () => {
    setEventName('');
    setLocation('');
    setDescription('');
    setQrCodeUrl(null);
    setEventId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <QrCode className="text-purple-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">Generate Attendance QR Code</h1>
          </div>

          {!qrCodeUrl ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g., Morning Lecture - Biology 101"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Room 301, Building A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional details about the event..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="mx-auto mb-4 border-4 border-white shadow-lg rounded-lg"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{eventName}</h3>
                <p className="text-gray-600 text-sm mb-1">📍 {location}</p>
                {description && <p className="text-gray-600 text-sm">{description}</p>}
                <p className="text-gray-500 text-xs mt-3">Event ID: {eventId}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download QR Code
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Create Another
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Next steps:</strong>
                  <br />
                  1. Download and print this QR code
                  <br />
                  2. Display it at the event location
                  <br />
                  3. Students scan to check-in/out
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
