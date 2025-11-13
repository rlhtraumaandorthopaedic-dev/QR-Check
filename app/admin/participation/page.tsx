'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Activity } from '@/types';
import { generateQRCode } from '@/lib/qrService';
import { Trophy, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminParticipationPage() {
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [points, setPoints] = useState('10');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [activityId, setActivityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!activityName || !location) {
      alert('Please fill in activity name and location');
      return;
    }

    setLoading(true);

    try {
      const activity: Omit<Activity, 'id' | 'qrCode'> = {
        name: activityName,
        description,
        location,
        points: parseInt(points),
        isActive: true,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'activities'), activity);
      const newActivityId = docRef.id;

      const qrCode = await generateQRCode({
        type: 'participation',
        id: newActivityId,
        name: activityName,
      });

      setQrCodeUrl(qrCode);
      setActivityId(newActivityId);
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
    link.download = `${activityName.replace(/\s+/g, '-')}-activity-qr.png`;
    link.click();
  };

  const handleReset = () => {
    setActivityName('');
    setDescription('');
    setLocation('');
    setPoints('10');
    setQrCodeUrl(null);
    setActivityId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft size={20} />
          Back to Admin
        </Link>

        <div className="premium-card rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="text-orange-600" size={32} />
            <h1 className="text-2xl font-bold text-white">Generate Activity QR Code</h1>
          </div>

          {!qrCodeUrl ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Activity Name *
                </label>
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="e.g., Workshop Station 1"
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Room 201"
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the activity..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Points Reward
                </label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-black disabled:text-gray-400 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-black/40 rounded-lg p-6 text-center">
                <img
                  src={qrCodeUrl}
                  alt="Activity QR Code"
                  className="mx-auto mb-4 border-4 border-gray-700 shadow-lg rounded-lg"
                />
                <h3 className="text-lg font-semibold text-white mb-2">{activityName}</h3>
                <p className="text-gray-400 text-sm mb-1">📍 {location}</p>
                {description && <p className="text-gray-400 text-sm mb-2">{description}</p>}
                <p className="text-orange-600 font-semibold">⭐ {points} points</p>
                <p className="text-gray-500 text-xs mt-3">Activity ID: {activityId}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
