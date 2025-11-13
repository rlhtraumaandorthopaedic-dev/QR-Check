'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrainingModule } from '@/types';
import { generateQRCode } from '@/lib/qrService';
import { GraduationCap, Download } from 'lucide-react';

export default function AdminTrainingGenerator() {
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [contentUrl, setContentUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!moduleName || !description) {
      alert('Please fill in module name and description');
      return;
    }

    setLoading(true);

    try {
      // Create training module in database
      const module: Omit<TrainingModule, 'id' | 'qrCode'> = {
        name: moduleName,
        description,
        duration: parseInt(duration),
        contentUrl: contentUrl || undefined,
        isActive: true,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'training_modules'), module);
      const newModuleId = docRef.id;

      // Generate QR code
      const qrCode = await generateQRCode({
        type: 'training',
        id: newModuleId,
        name: moduleName,
      });

      setQrCodeUrl(qrCode);
      setModuleId(newModuleId);
      setLoading(false);
    } catch (error) {
      console.error('Error generating training QR code:', error);
      alert('Failed to generate QR code');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${moduleName.replace(/\s+/g, '-')}-training-qr.png`;
    link.click();
  };

  const handleReset = () => {
    setModuleName('');
    setDescription('');
    setDuration('30');
    setContentUrl('');
    setQrCodeUrl(null);
    setModuleId(null);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="premium-card rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="text-white" size={32} />
            <h1 className="text-2xl font-bold text-white">Generate Training Module QR</h1>
          </div>

          {!qrCodeUrl ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Module Name *
                </label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  placeholder="e.g., Fire Safety Training"
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this training covers..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="5"
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content URL (Optional)
                </label>
                <input
                  type="url"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder="https://example.com/training-materials"
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-br from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 disabled:from-gray-600 disabled:to-gray-700 text-black disabled:text-gray-400 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-black/40 rounded-lg p-6 text-center">
                <img
                  src={qrCodeUrl}
                  alt="Training QR Code"
                  className="mx-auto mb-4 border-4 border-gray-700 shadow-lg rounded-lg"
                />
                <h3 className="text-lg font-semibold text-white mb-2">{moduleName}</h3>
                <p className="text-gray-400 text-sm mb-2">{description}</p>
                <p className="text-gray-500 text-sm">⏱️ {duration} minutes</p>
                <p className="text-gray-500 text-xs mt-3">Module ID: {moduleId}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-br from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  <strong>Next steps:</strong>
                  <br />
                  1. Download and display this QR code
                  <br />
                  2. Students scan to start training
                  <br />
                  3. Certificate generated on completion
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
