'use client';

import { useState } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AttendanceRecord, QRCodeData } from '@/types';
import QRScanner from './QRScanner';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendanceCheckinProps {
  userId: string;
  userName: string;
}

export default function AttendanceCheckin({ userId, userName }: AttendanceCheckinProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [lastCheckin, setLastCheckin] = useState<AttendanceRecord | null>(null);

  const handleScan = async (qrData: QRCodeData) => {
    if (qrData.type !== 'attendance') {
      setStatus('error');
      setMessage('This QR code is not for attendance. Please scan an attendance QR code.');
      return;
    }

    try {
      // Check if user already checked in to this event
      const attendanceRef = collection(db, 'attendance');
      const q = query(
        attendanceRef,
        where('userId', '==', userId),
        where('eventId', '==', qrData.id),
        where('status', '==', 'checked-in')
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User already checked in, perform check-out
        const existingDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'attendance', existingDoc.id), {
          checkOutTime: new Date(),
          status: 'checked-out',
        });

        setStatus('success');
        setMessage(`Successfully checked out from ${qrData.name}`);
      } else {
        // New check-in
        const attendanceRecord: Omit<AttendanceRecord, 'id'> = {
          userId,
          userName,
          eventId: qrData.id,
          eventName: qrData.name,
          checkInTime: new Date(),
          status: 'checked-in',
        };

        const docRef = await addDoc(attendanceRef, attendanceRecord);
        setLastCheckin({ ...attendanceRecord, id: docRef.id });
        setStatus('success');
        setMessage(`Successfully checked in to ${qrData.name}`);
      }

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Check-in error:', error);
      setStatus('error');
      setMessage('Failed to process check-in. Please try again.');
    }
  };

  const handleError = (error: string) => {
    setStatus('error');
    setMessage(error);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="premium-card rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Attendance</h1>
              <p className="text-gray-400 text-sm">{userName}</p>
            </div>
            <Clock className="text-gray-400" size={32} />
          </div>

          {status === 'success' && (
            <div className="mb-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="text-cyan-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-cyan-300">Success!</p>
                <p className="text-cyan-400/80 text-sm">{message}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-red-300">Error</p>
                <p className="text-red-400/80 text-sm">{message}</p>
              </div>
            </div>
          )}
        </div>

        <QRScanner onScan={handleScan} onError={handleError} />

        {lastCheckin && (
          <div className="mt-6 premium-card rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-white mb-2">Last Check-in</h3>
            <div className="text-sm text-gray-400">
              <p className="font-medium">{lastCheckin.eventName}</p>
              <p>{new Date(lastCheckin.checkInTime).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
