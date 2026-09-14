import React from 'react';
import { GraduationCap, PhoneCall, ShieldCheck, Calculator, UserCheck, FileText, LayoutDashboard } from 'lucide-react';
import { SCHOOL_INFO } from '../data/ppdbData';

interface NavbarProps {
  activeTab: 'biaya' | 'kalkulator' | 'daftar' | 'status' | 'admin';
  setActiveTab: (tab: 'biaya' | 'kalkulator' | 'daftar' | 'status' | 'admin') => void;
  applicantCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, applicantCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-700/80 px-2 py-0.5 rounded font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              PPDB AKTIF
            </span>
            <span className="text-emerald-100 hidden sm:inline">
              Tahun Ajaran {SCHOOL_INFO.academicYear} | Dapatkan Diskon Uang Pangkal s/d 60%
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={`https://wa.me/62${SCHOOL_INFO.whatsapp.replace(/\D/g, '').replace(/^0/, '')}?text=Halo%20Panitia%20PPDB%20SIT%20At%20Taufiq,%20saya%20ingin%20bertanya%20tentang%20pendaftaran`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-emerald-300" />
              <span>Hotline WA: {SCHOOL_INFO.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('biaya')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                  SIT AT TAUFIQ
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                  TP {SCHOOL_INFO.academicYear}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                TKIT • SDIT • SMPIT <span className="text-emerald-700 font-semibold">— Mencetak Generasi Islami</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveTab('biaya')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'biaya'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Rincian Biaya
            </button>

            <button
              onClick={() => setActiveTab('kalkulator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'kalkulator'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Simulasi Biaya
            </button>

            <button
              onClick={() => setActiveTab('daftar')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'daftar'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Daftar Sekarang
            </button>

            <button
              onClick={() => setActiveTab('status')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'status'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Cek Status
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Panitia PPDB
              {applicantCount > 0 && (
                <span className="ml-1 bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {applicantCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick CTA on Mobile / Desktop */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('daftar')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>Daftar Online</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-100 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTab('biaya')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'biaya' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Biaya
          </button>
          <button
            onClick={() => setActiveTab('kalkulator')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'kalkulator' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Simulasi
          </button>
          <button
            onClick={() => setActiveTab('daftar')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'daftar' ? 'bg-emerald-700 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            Formulir
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'status' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600'
            }`}
          >
            Cek Status
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'admin' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600'
            }`}
          >
            Panitia ({applicantCount})
          </button>
        </div>
      </div>
    </header>
  );
};
