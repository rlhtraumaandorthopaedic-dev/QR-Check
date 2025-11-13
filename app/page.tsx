'use client';

import Link from 'next/link';
import { QrCode, ClipboardCheck, GraduationCap, Trophy, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative z-10">
      {/* Premium Header */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20">
        <div className="text-center mb-10 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-4 sm:mb-6 lg:mb-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-300 shadow-2xl shadow-white/20 animate-scale-in animate-float">
            <QrCode size={28} className="text-black sm:hidden" strokeWidth={1.5} />
            <QrCode size={32} className="text-black hidden sm:block lg:hidden" strokeWidth={1.5} />
            <QrCode size={40} className="text-black hidden lg:block" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-medium mb-3 sm:mb-4 lg:mb-5 tracking-tight shimmer-text animate-fade-in">
            QR-Check
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed px-4 animate-fade-in-up" style={{animationDelay: '0.2s', opacity: 0}}>
            Advanced surgical training and competency tracking system
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <Link href="/attendance" className="group">
            <div className="premium-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 premium-shadow-hover animate-fade-in-up" style={{animationDelay: '0.3s', opacity: 0}}>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="icon-container p-2.5 sm:p-3 lg:p-3.5 bg-gradient-to-br from-white to-gray-300 rounded-xl sm:rounded-2xl shadow-lg shadow-white/10">
                  <ClipboardCheck className="text-black" size={22} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-white">Attendance</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed font-light">
                Seamless check-in and check-out from surgical sessions
              </p>
              <div className="flex items-center text-sm sm:text-base text-white font-normal group-hover:gap-3 gap-2 transition-all">
                Open Scanner
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/admin" className="group">
            <div className="premium-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 premium-shadow-hover animate-fade-in-up" style={{animationDelay: '0.4s', opacity: 0}}>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="icon-container p-2.5 sm:p-3 lg:p-3.5 bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl sm:rounded-2xl shadow-lg shadow-gray-400/10">
                  <QrCode className="text-black" size={22} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-white">Admin</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed font-light">
                Practice facilitator control panel
              </p>
              <div className="flex items-center text-sm sm:text-base text-white font-normal group-hover:gap-3 gap-2 transition-all">
                Admin Panel
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/training" className="group">
            <div className="premium-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 premium-shadow-hover animate-fade-in-up" style={{animationDelay: '0.5s', opacity: 0}}>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="icon-container p-2.5 sm:p-3 lg:p-3.5 bg-gradient-to-br from-white to-gray-200 rounded-xl sm:rounded-2xl shadow-lg shadow-white/10">
                  <GraduationCap className="text-black" size={22} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-white">Training</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed font-light">
                Surgical training modules and certificates
              </p>
              <div className="flex items-center text-sm sm:text-base text-white font-normal group-hover:gap-3 gap-2 transition-all">
                Start Learning
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/participation" className="group">
            <div className="premium-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 premium-shadow-hover animate-fade-in-up" style={{animationDelay: '0.6s', opacity: 0}}>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="icon-container p-2.5 sm:p-3 lg:p-3.5 bg-gradient-to-br from-gray-100 to-gray-300 rounded-xl sm:rounded-2xl shadow-lg shadow-gray-300/10">
                  <Trophy className="text-black" size={22} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-white">Participation</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed font-light">
                Track surgical exposure and procedures
              </p>
              <div className="flex items-center text-sm sm:text-base text-white font-normal group-hover:gap-3 gap-2 transition-all">
                View Activity
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/competency" className="group">
            <div className="premium-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 premium-shadow-hover animate-fade-in-up" style={{animationDelay: '0.7s', opacity: 0}}>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="icon-container p-2.5 sm:p-3 lg:p-3.5 bg-gradient-to-br from-white via-gray-200 to-gray-300 rounded-xl sm:rounded-2xl shadow-lg shadow-white/10">
                  <Award className="text-black" size={22} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-white">Competency</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed font-light">
                Surgical skills assessment and validation
              </p>
              <div className="flex items-center text-sm sm:text-base text-white font-normal group-hover:gap-3 gap-2 transition-all">
                Get Assessed
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link href="/configurator" className="group">
            <div className="premium-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 premium-shadow-hover animate-fade-in-up" style={{animationDelay: '0.8s', opacity: 0}}>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="icon-container p-2.5 sm:p-3 lg:p-3.5 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl sm:rounded-2xl shadow-lg shadow-gray-400/10">
                  <QrCode className="text-black" size={22} strokeWidth={1.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-white">Certificate Designer</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed font-light">
                Customize training certificates
              </p>
              <div className="flex items-center text-sm sm:text-base text-white font-normal group-hover:gap-3 gap-2 transition-all">
                Design Certificates
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto premium-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 premium-shadow animate-fade-in-up" style={{animationDelay: '0.9s', opacity: 0}}>
          <h3 className="text-2xl sm:text-3xl font-medium text-white mb-6 sm:mb-8 lg:mb-10 text-center tracking-tight">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="text-center animate-scale-in" style={{animationDelay: '1.1s', opacity: 0}}>
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-300 shadow-lg shadow-white/20 mx-auto mb-3 sm:mb-4 lg:mb-5">
                <span className="text-xl sm:text-2xl font-medium text-black">1</span>
              </div>
              <h4 className="font-medium text-white mb-2 sm:mb-3 text-base sm:text-lg">Generate QR Code</h4>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
                Facilitator creates training sessions and generates unique QR codes
              </p>
            </div>
            <div className="text-center animate-scale-in" style={{animationDelay: '1.2s', opacity: 0}}>
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-300 shadow-lg shadow-white/20 mx-auto mb-3 sm:mb-4 lg:mb-5">
                <span className="text-xl sm:text-2xl font-medium text-black">2</span>
              </div>
              <h4 className="font-medium text-white mb-2 sm:mb-3 text-base sm:text-lg">Scan Code</h4>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
                Trainees scan the QR code with their mobile device
              </p>
            </div>
            <div className="text-center animate-scale-in" style={{animationDelay: '1.3s', opacity: 0}}>
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-300 shadow-lg shadow-white/20 mx-auto mb-3 sm:mb-4 lg:mb-5">
                <span className="text-xl sm:text-2xl font-medium text-black">3</span>
              </div>
              <h4 className="font-medium text-white mb-2 sm:mb-3 text-base sm:text-lg">Track Progress</h4>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
                System automatically records and generates comprehensive reports
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12 lg:mt-16 text-gray-400 text-xs sm:text-sm font-light">
          <p>Professional surgical training platform</p>
        </div>
      </div>
    </div>
  );
}
