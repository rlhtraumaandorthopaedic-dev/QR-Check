'use client';

import AdminTrainingGenerator from '@/components/AdminTrainingGenerator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminTrainingPage() {
  return (
    <>
      <Link href="/admin" className="fixed top-4 left-4 inline-flex items-center gap-2 text-white hover:text-green-700 premium-card px-4 py-2 rounded-lg shadow-md z-50">
        <ArrowLeft size={20} />
        Back to Admin
      </Link>
      <AdminTrainingGenerator />
    </>
  );
}
