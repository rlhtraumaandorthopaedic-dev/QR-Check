'use client';

import AdminQRGenerator from '@/components/AdminQRGenerator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminAttendancePage() {
  return (
    <>
      <Link href="/admin" className="fixed top-4 left-4 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 bg-white px-4 py-2 rounded-lg shadow-md z-50">
        <ArrowLeft size={20} />
        Back to Admin
      </Link>
      <AdminQRGenerator />
    </>
  );
}
