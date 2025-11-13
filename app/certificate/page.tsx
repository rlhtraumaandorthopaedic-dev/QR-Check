'use client';

import { useSearchParams } from 'next/navigation';
import CertificateGenerator from '@/components/CertificateGenerator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CertificatePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const moduleId = searchParams.get('moduleId');

  if (!userId || !moduleId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Certificate Link</h2>
          <p className="text-gray-600 mb-4">Please ensure you have the correct link to view your certificate.</p>
          <Link href="/" className="text-purple-600 hover:text-purple-700 font-semibold">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link href="/training" className="fixed top-4 left-4 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 bg-white px-4 py-2 rounded-lg shadow-md z-50">
        <ArrowLeft size={20} />
        Back to Training
      </Link>
      <CertificateGenerator userId={userId} moduleId={moduleId} />
    </>
  );
}
