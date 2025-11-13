'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GeneratedCertificate } from '@/types/certificate';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import CertificatePreview from './CertificatePreview';
import { Download, Share2, Award } from 'lucide-react';
import { generateToken } from '@/lib/utils';

interface CertificateGeneratorProps {
  userId: string;
  moduleId: string;
}

export default function CertificateGenerator({ userId, moduleId }: CertificateGeneratorProps) {
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<any>(null);
  const [trainingData, setTrainingData] = useState<any>(null);
  const [certificate, setCertificate] = useState<GeneratedCertificate | null>(null);

  useEffect(() => {
    loadData();
  }, [userId, moduleId]);

  const loadData = async () => {
    try {
      // Load training progress
      const progressQuery = query(
        collection(db, 'training_progress'),
        where('userId', '==', userId),
        where('moduleId', '==', moduleId)
      );
      const progressSnapshot = await getDocs(progressQuery);

      if (!progressSnapshot.empty) {
        const progressData = progressSnapshot.docs[0].data();
        setTrainingData(progressData);
      }

      // Load default template
      const templateQuery = query(
        collection(db, 'certificate_templates'),
        where('isDefault', '==', true)
      );
      const templateSnapshot = await getDocs(templateQuery);

      if (!templateSnapshot.empty) {
        setTemplate({ id: templateSnapshot.docs[0].id, ...templateSnapshot.docs[0].data() });
      } else {
        // Use fallback template
        setTemplate(getFallbackTemplate());
      }

      // Check if certificate already exists
      const certQuery = query(
        collection(db, 'certificates'),
        where('userId', '==', userId),
        where('moduleId', '==', moduleId)
      );
      const certSnapshot = await getDocs(certQuery);

      if (!certSnapshot.empty) {
        setCertificate({ id: certSnapshot.docs[0].id, ...certSnapshot.docs[0].data() } as any);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading certificate data:', error);
      setLoading(false);
    }
  };

  const getFallbackTemplate = () => ({
    name: 'Default Template',
    backgroundColor: '#ffffff',
    borderColor: '#2563eb',
    primaryColor: '#1e40af',
    secondaryColor: '#64748b',
    fontFamily: 'serif',
    layout: 'classic',
    isDefault: true,
    fields: [
      {
        id: 'title',
        type: 'text',
        value: 'Certificate of Completion',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1e40af',
        alignment: 'center',
        position: { x: 50, y: 15 },
        enabled: true,
      },
      {
        id: 'subtitle',
        type: 'text',
        value: 'This certifies that',
        fontSize: 18,
        fontWeight: 'normal',
        color: '#64748b',
        alignment: 'center',
        position: { x: 50, y: 30 },
        enabled: true,
      },
      {
        id: 'name',
        type: 'name',
        value: '[Student Name]',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000000',
        alignment: 'center',
        position: { x: 50, y: 42 },
        enabled: true,
      },
      {
        id: 'course',
        type: 'course',
        value: '[Course Name]',
        fontSize: 20,
        fontWeight: 'normal',
        color: '#374151',
        alignment: 'center',
        position: { x: 50, y: 55 },
        enabled: true,
      },
      {
        id: 'date',
        type: 'date',
        value: '[Date]',
        fontSize: 16,
        fontWeight: 'normal',
        color: '#6b7280',
        alignment: 'center',
        position: { x: 50, y: 70 },
        enabled: true,
      },
    ],
  });

  const handleDownloadPDF = async () => {
    const element = document.getElementById('certificate-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate-${trainingData?.moduleName || 'training'}.pdf`);

      // Save certificate record if not exists
      if (!certificate) {
        const certData: Omit<GeneratedCertificate, 'id'> = {
          userId,
          userName: trainingData?.userName || 'Unknown',
          moduleId,
          moduleName: trainingData?.moduleName || 'Unknown',
          completedAt: trainingData?.completedAt?.toDate() || new Date(),
          templateId: template?.id || 'default',
          verificationCode: generateToken(),
        };

        const docRef = await addDoc(collection(db, 'certificates'), certData);
        setCertificate({ ...certData, id: docRef.id });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!template || !trainingData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center premium-card rounded-xl shadow-lg p-8 max-w-md">
          <Award className="text-gray-400 mx-auto mb-4" size={64} />
          <h2 className="text-xl font-bold text-white mb-2">Certificate Not Available</h2>
          <p className="text-gray-400">
            Please complete the training module first to generate your certificate.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="premium-card rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Your Certificate</h1>
              <p className="text-gray-400 text-sm">{trainingData.moduleName}</p>
            </div>
            <Award className="text-white" size={32} />
          </div>

          <CertificatePreview
            template={template}
            userName={trainingData.userName || 'Student'}
            courseName={trainingData.moduleName}
            completionDate={trainingData.completedAt?.toDate()}
          />

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex-1 bg-gradient-to-br from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download PDF
            </button>
            <button
              onClick={() => navigator.share?.({ title: 'My Certificate', text: 'Check out my certificate!' })}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Share2 size={20} />
              Share
            </button>
          </div>

          {certificate && (
            <div className="mt-4 bg-black/40 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">
                <strong>Verification Code:</strong>
              </p>
              <code className="text-xs premium-card px-3 py-2 rounded border border-gray-700 block">
                {certificate.verificationCode}
              </code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
