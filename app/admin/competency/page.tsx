'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Competency } from '@/types';
import { generateQRCode } from '@/lib/qrService';
import { Award, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminCompetencyPage() {
  const [competencyName, setCompetencyName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [competencyId, setCompetencyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!competencyName || !category) {
      alert('Please fill in competency name and category');
      return;
    }

    setLoading(true);

    try {
      const competency: Omit<Competency, 'id' | 'qrCode'> = {
        name: competencyName,
        description,
        category,
        isActive: true,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'competencies'), competency);
      const newCompetencyId = docRef.id;

      const qrCode = await generateQRCode({
        type: 'competency',
        id: newCompetencyId,
        name: competencyName,
      });

      setQrCodeUrl(qrCode);
      setCompetencyId(newCompetencyId);
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
    link.download = `${competencyName.replace(/\s+/g, '-')}-competency-qr.png`;
    link.click();
  };

  const handleReset = () => {
    setCompetencyName('');
    setDescription('');
    setCategory('');
    setQrCodeUrl(null);
    setCompetencyId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6">
          <ArrowLeft size={20} />
          Back to Admin
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-teal-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">Generate Competency QR Code</h1>
          </div>

          {!qrCodeUrl ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Competency Name *
                </label>
                <input
                  type="text"
                  value={competencyName}
                  onChange={(e) => setCompetencyName(e.target.value)}
                  placeholder="e.g., Basic Life Support"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Clinical Skills"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this competency involves..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <img
                  src={qrCodeUrl}
                  alt="Competency QR Code"
                  className="mx-auto mb-4 border-4 border-white shadow-lg rounded-lg"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{competencyName}</h3>
                <p className="text-gray-600 text-sm mb-1">📂 {category}</p>
                {description && <p className="text-gray-600 text-sm mb-2">{description}</p>}
                <p className="text-gray-500 text-xs mt-3">Competency ID: {competencyId}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                  2. Assessors scan to record competency assessments
                  <br />
                  3. View assessment records in reports
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
