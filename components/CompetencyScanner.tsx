'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CompetencyRecord, QRCodeData } from '@/types';
import QRScanner from './QRScanner';
import { CheckCircle, XCircle, Award, User } from 'lucide-react';

interface CompetencyScannerProps {
  userId: string;
  userName: string;
  role: 'student' | 'assessor';
}

export default function CompetencyScanner({ userId, userName, role }: CompetencyScannerProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'assess'>('idle');
  const [message, setMessage] = useState<string>('');
  const [currentCompetency, setCurrentCompetency] = useState<QRCodeData | null>(null);
  const [assessmentData, setAssessmentData] = useState({
    studentName: '',
    assessmentStatus: 'achieved' as 'achieved' | 'in-progress' | 'needs-improvement',
    notes: '',
  });

  const handleScan = async (qrData: QRCodeData) => {
    if (qrData.type !== 'competency') {
      setStatus('error');
      setMessage('This QR code is not for competency. Please scan a competency QR code.');
      return;
    }

    if (role === 'assessor') {
      // Assessor needs to fill in assessment form
      setCurrentCompetency(qrData);
      setStatus('assess');
    } else {
      setStatus('error');
      setMessage('Only assessors can scan competency QR codes. Please contact your supervisor.');
    }
  };

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentCompetency || !assessmentData.studentName) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const competencyRecord: Omit<CompetencyRecord, 'id'> = {
        userId: 'student_' + Math.random().toString(36).substring(7), // In production, get actual student ID
        userName: assessmentData.studentName,
        competencyId: currentCompetency.id,
        competencyName: currentCompetency.name,
        assessorId: userId,
        assessorName: userName,
        status: assessmentData.assessmentStatus,
        assessmentDate: new Date(),
        notes: assessmentData.notes || undefined,
      };

      await addDoc(collection(db, 'competency_records'), competencyRecord);

      setStatus('success');
      setMessage(
        `Competency assessment recorded for ${assessmentData.studentName} - ${currentCompetency.name}`
      );

      // Reset form
      setAssessmentData({
        studentName: '',
        assessmentStatus: 'achieved',
        notes: '',
      });
      setCurrentCompetency(null);

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Competency assessment error:', error);
      setStatus('error');
      setMessage('Failed to record assessment. Please try again.');
    }
  };

  const handleError = (error: string) => {
    setStatus('error');
    setMessage(error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="premium-card rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Competency Assessment</h1>
              <p className="text-gray-400 text-sm">
                {userName} ({role})
              </p>
            </div>
            <Award className="text-teal-600" size={32} />
          </div>

          {status === 'success' && (
            <div className="mb-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-white flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-cyan-300">Success!</p>
                <p className="text-cyan-400/80 text-sm">{message}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-300">Error</p>
                <p className="text-red-400/80 text-sm">{message}</p>
              </div>
            </div>
          )}

          {status === 'assess' && currentCompetency && (
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h3 className="font-semibold text-blue-300 mb-3">Assess Competency</h3>
              <p className="text-blue-700 text-sm mb-4">{currentCompetency.name}</p>

              <form onSubmit={handleSubmitAssessment} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Student Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={assessmentData.studentName}
                      onChange={(e) =>
                        setAssessmentData({ ...assessmentData, studentName: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="Enter student name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status *</label>
                  <select
                    value={assessmentData.assessmentStatus}
                    onChange={(e) =>
                      setAssessmentData({
                        ...assessmentData,
                        assessmentStatus: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="achieved">Achieved</option>
                    <option value="in-progress">In Progress</option>
                    <option value="needs-improvement">Needs Improvement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={assessmentData.notes}
                    onChange={(e) =>
                      setAssessmentData({ ...assessmentData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                    placeholder="Add any observations or feedback..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Submit Assessment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setCurrentCompetency(null);
                    }}
                    className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-black/40"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {status !== 'assess' && <QRScanner onScan={handleScan} onError={handleError} />}

        {role === 'student' && (
          <div className="mt-6 premium-card rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-400">
              <strong>Note:</strong> Only assessors can scan competency QR codes to record
              assessments. If you need a competency assessed, please contact your supervisor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
