'use client';

import CompetencyScanner from '@/components/CompetencyScanner';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CompetencyPage() {
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [role, setRole] = useState<'student' | 'assessor'>('student');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole') as 'student' | 'assessor';

    if (storedUserId && storedUserName) {
      setUserId(storedUserId);
      setUserName(storedUserName);
      setRole(storedRole || 'student');
      setIsReady(true);
    }
  }, []);

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const userRole = formData.get('role') as 'student' | 'assessor';

    if (name) {
      const id = 'user_' + Math.random().toString(36).substring(7);
      localStorage.setItem('userId', id);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', userRole);
      setUserId(id);
      setUserName(name);
      setRole(userRole);
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
        <div className="max-w-md mx-auto pt-16">
          <Link href="/" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-6">
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <div className="premium-card rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome!</h1>
            <p className="text-gray-400 mb-6">Please enter your details to get started</p>

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
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Your Role
                </label>
                <select
                  name="role"
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="assessor">Assessor/Supervisor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
      <Link href="/" className="fixed top-4 left-4 inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 premium-card px-4 py-2 rounded-lg shadow-md z-50">
        <ArrowLeft size={20} />
        Home
      </Link>
      <CompetencyScanner userId={userId} userName={userName} role={role} />
    </>
  );
}
