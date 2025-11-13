'use client';

import AttendanceCheckin from '@/components/AttendanceCheckin';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AttendancePage() {
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // For demo purposes, generate a simple user ID
    // In production, this would come from authentication
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');

    if (storedUserId && storedUserName) {
      setUserId(storedUserId);
      setUserName(storedUserName);
      setIsReady(true);
    }
  }, []);

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;

    if (name) {
      const id = 'user_' + Math.random().toString(36).substring(7);
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', name);
      setUserId(id);
      setUserName(name);
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-md mx-auto pt-16">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <div className="premium-card rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome!</h1>
            <p className="text-gray-400 mb-6">Please enter your name to get started</p>

            <form onSubmit={handleSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-br from-white to-gray-300 hover:from-gray-100 hover:to-gray-400 text-black font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Continue
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Your information is stored locally on your device
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link href="/" className="fixed top-4 left-4 inline-flex items-center gap-2 text-gray-400 hover:text-white bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-800 z-50 transition-colors">
        <ArrowLeft size={20} />
        Home
      </Link>
      <AttendanceCheckin userId={userId} userName={userName} />
    </>
  );
}
