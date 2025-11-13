'use client';

import { useState } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrainingProgress, QRCodeData } from '@/types';
import QRScanner from './QRScanner';
import { CheckCircle, XCircle, GraduationCap, Clock, Award } from 'lucide-react';
import Link from 'next/link';

interface TrainingScannerProps {
  userId: string;
  userName: string;
}

export default function TrainingScanner({ userId, userName }: TrainingScannerProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [currentModule, setCurrentModule] = useState<TrainingProgress | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const handleScan = async (qrData: QRCodeData) => {
    if (qrData.type !== 'training') {
      setStatus('error');
      setMessage('This QR code is not for training. Please scan a training module QR code.');
      return;
    }

    try {
      // Check if user already has progress for this module
      const progressRef = collection(db, 'training_progress');
      const q = query(
        progressRef,
        where('userId', '==', userId),
        where('moduleId', '==', qrData.id)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data() as TrainingProgress;

        if (existingData.status === 'completed') {
          setStatus('success');
          setMessage(`You've already completed ${qrData.name}. View your certificate!`);
          setCurrentModule({ ...existingData, id: existingDoc.id });
        } else {
          // Continue training
          await updateDoc(doc(db, 'training_progress', existingDoc.id), {
            status: 'in-progress',
          });

          setStatus('success');
          setMessage(`Continuing ${qrData.name}. Access your training materials.`);
          setCurrentModule({ ...existingData, id: existingDoc.id });
          setStartTime(Date.now());
        }
      } else {
        // New training module
        const trainingProgress: Omit<TrainingProgress, 'id'> = {
          userId,
          moduleId: qrData.id,
          moduleName: qrData.name,
          status: 'in-progress',
          startedAt: new Date(),
        };

        const docRef = await addDoc(progressRef, trainingProgress);
        setCurrentModule({ ...trainingProgress, id: docRef.id });
        setStatus('success');
        setMessage(`Started ${qrData.name}. Good luck!`);
        setStartTime(Date.now());
      }

      // Auto-reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      console.error('Training scan error:', error);
      setStatus('error');
      setMessage('Failed to process training module. Please try again.');
    }
  };

  const handleError = (error: string) => {
    setStatus('error');
    setMessage(error);
  };

  const handleComplete = async () => {
    if (!currentModule || !startTime) return;

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes

      await updateDoc(doc(db, 'training_progress', currentModule.id), {
        status: 'completed',
        completedAt: new Date(),
        timeSpent,
        score: 100, // Default score, can be updated with quiz results
      });

      setStatus('success');
      setMessage('Training completed! Certificate is ready.');
      setCurrentModule({
        ...currentModule,
        status: 'completed',
        completedAt: new Date(),
        timeSpent,
        score: 100,
      });
    } catch (error) {
      console.error('Complete training error:', error);
      setStatus('error');
      setMessage('Failed to mark training as complete.');
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="premium-card rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Training</h1>
              <p className="text-gray-400 text-sm">{userName}</p>
            </div>
            <GraduationCap className="text-white" size={32} />
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

          {currentModule && currentModule.status === 'in-progress' && (
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="text-gray-400" size={20} />
                <h3 className="font-semibold text-blue-300">In Progress</h3>
              </div>
              <p className="text-blue-700 text-sm mb-3">{currentModule.moduleName}</p>
              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-br from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Mark as Complete
              </button>
            </div>
          )}

          {currentModule && currentModule.status === 'completed' && (
            <div className="mb-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Award className="text-white" size={20} />
                <h3 className="font-semibold text-cyan-300">Completed!</h3>
              </div>
              <p className="text-cyan-400/80 text-sm mb-3">{currentModule.moduleName}</p>
              <Link
                href={`/certificate?userId=${userId}&moduleId=${currentModule.moduleId}`}
                className="block w-full bg-gradient-to-br from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
              >
                View Certificate
              </Link>
            </div>
          )}
        </div>

        <QRScanner onScan={handleScan} onError={handleError} />
      </div>
    </div>
  );
}
