'use client';

import { ArrowLeft, QrCode, GraduationCap, Palette, Trophy, Award } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Generate QR codes and configure the system</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/admin/attendance" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <QrCode className="text-blue-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Attendance QR</h2>
              </div>
              <p className="text-gray-600 mb-4">Generate QR codes for attendance events</p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Create Event QR
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/training" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <GraduationCap className="text-green-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Training Modules</h2>
              </div>
              <p className="text-gray-600 mb-4">Create training modules with QR codes</p>
              <div className="flex items-center text-green-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Create Module
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/configurator" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Palette className="text-purple-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Certificate Designer</h2>
              </div>
              <p className="text-gray-600 mb-4">Configure certificate templates</p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Design Templates
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/participation" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Trophy className="text-orange-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Activities</h2>
              </div>
              <p className="text-gray-600 mb-4">Create activity station QR codes</p>
              <div className="flex items-center text-orange-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Create Activity
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/competency" className="group">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-teal-100 rounded-xl">
                  <Award className="text-teal-600" size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Competencies</h2>
              </div>
              <p className="text-gray-600 mb-4">Create competency assessment QR codes</p>
              <div className="flex items-center text-teal-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                Create Competency
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
