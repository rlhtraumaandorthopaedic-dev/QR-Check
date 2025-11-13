'use client';

import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ParticipationRecord, QRCodeData } from '@/types';
import QRScanner from './QRScanner';
import { CheckCircle, XCircle, Trophy, Star } from 'lucide-react';

interface ParticipationScannerProps {
  userId: string;
  userName: string;
}

export default function ParticipationScanner({ userId, userName }: ParticipationScannerProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<ParticipationRecord | null>(null);

  const handleScan = async (qrData: QRCodeData) => {
    if (qrData.type !== 'participation') {
      setStatus('error');
      setMessage('This QR code is not for participation. Please scan an activity QR code.');
      return;
    }

    try {
      // Check if already participated in this activity today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const participationRef = collection(db, 'participation');
      const q = query(
        participationRef,
        where('userId', '==', userId),
        where('activityId', '==', qrData.id)
      );

      const querySnapshot = await getDocs(q);
      const alreadyParticipated = querySnapshot.docs.some((doc) => {
        const data = doc.data();
        const recordDate = data.timestamp.toDate();
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === today.getTime();
      });

      if (alreadyParticipated) {
        setStatus('error');
        setMessage('You have already participated in this activity today!');
        return;
      }

      // Get activity points (default 10)
      const activityQuery = query(collection(db, 'activities'), where('__name__', '==', qrData.id));
      const activitySnapshot = await getDocs(activityQuery);
      const points = activitySnapshot.empty ? 10 : activitySnapshot.docs[0].data().points || 10;

      // Record participation
      const participationRecord: Omit<ParticipationRecord, 'id'> = {
        userId,
        userName,
        activityId: qrData.id,
        activityName: qrData.name,
        timestamp: new Date(),
        points,
      };

      const docRef = await addDoc(participationRef, participationRecord);
      setLastActivity({ ...participationRecord, id: docRef.id });

      // Update total points
      const newTotal = totalPoints + points;
      setTotalPoints(newTotal);

      setStatus('success');
      setMessage(`+${points} points! You participated in ${qrData.name}`);

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Participation scan error:', error);
      setStatus('error');
      setMessage('Failed to record participation. Please try again.');
    }
  };

  const handleError = (error: string) => {
    setStatus('error');
    setMessage(error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Participation</h1>
              <p className="text-gray-600 text-sm">{userName}</p>
            </div>
            <Trophy className="text-orange-600" size={32} />
          </div>

          {/* Points Display */}
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-800 font-medium">Total Points</p>
                <p className="text-3xl font-bold text-orange-600">{totalPoints}</p>
              </div>
              <Star className="text-amber-500" size={48} fill="currentColor" />
            </div>
          </div>

          {status === 'success' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-green-800">Success!</p>
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700 text-sm">{message}</p>
              </div>
            </div>
          )}
        </div>

        <QRScanner onScan={handleScan} onError={handleError} />

        {lastActivity && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Last Activity</h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{lastActivity.activityName}</p>
              <p className="flex items-center gap-1">
                <Star className="text-amber-500" size={16} fill="currentColor" />
                {lastActivity.points} points
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
