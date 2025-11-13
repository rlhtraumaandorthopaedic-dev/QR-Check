'use client';

import TrainingScanner from '@/components/TrainingScanner';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TrainingPage() {
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-md mx-auto pt-16">
          <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h1>
            <p className="text-gray-600 mb-6">Please enter your name to get started</p>

            <form onSubmit={handleSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
      <Link href="/" className="fixed top-4 left-4 inline-flex items-center gap-2 text-green-600 hover:text-green-700 bg-white px-4 py-2 rounded-lg shadow-md z-50">
        <ArrowLeft size={20} />
        Home
      </Link>
      <TrainingScanner userId={userId} userName={userName} />
    </>
  );
}
