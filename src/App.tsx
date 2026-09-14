import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeeTableSection } from './components/FeeTableSection';
import { FeeCalculator } from './components/FeeCalculator';
import { RegistrationForm } from './components/RegistrationForm';
import { StatusChecker } from './components/StatusChecker';
import { AdminPortal } from './components/AdminPortal';
import { SchoolHighlights } from './components/SchoolHighlights';
import { EducationLevel, WaveType, Applicant, AddonServices } from './types';
import { getStoredApplicants, SCHOOL_INFO } from './data/ppdbData';
import { Phone, Mail, MapPin, GraduationCap, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'biaya' | 'kalkulator' | 'daftar' | 'status' | 'admin'>('biaya');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  
  // Prefill configuration for registration form
  const [selectedPlan, setSelectedPlan] = useState<{
    level: EducationLevel;
    wave: WaveType;
    addons: AddonServices;
  }>({
    level: 'SDIT',
    wave: 'OPEN_HOUSE',
    addons: { catering: false, transport: false, bookPackage: true }
  });

  const [statusSearchQuery, setStatusSearchQuery] = useState<string>('');

  useEffect(() => {
    setApplicants(getStoredApplicants());
  }, []);

  const handleSelectPlanFromTable = (level: EducationLevel, wave: WaveType) => {
    setSelectedPlan({
      level,
      wave,
      addons: { catering: false, transport: false, bookPackage: true }
    });
    setActiveTab('daftar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromCalculator = (
    level: EducationLevel,
    wave: WaveType,
    addons: AddonServices
  ) => {
    setSelectedPlan({ level, wave, addons });
    setActiveTab('daftar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (newApplicant: Applicant) => {
    setApplicants((prev) => [newApplicant, ...prev]);
  };

  const handleViewApplicantStatus = (id: string) => {
    setStatusSearchQuery(id);
    setActiveTab('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        applicantCount={applicants.length}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* If tab is 'biaya', show Hero + Fee Table + Highlights */}
        {activeTab === 'biaya' && (
          <div>
            <HeroSection
              onStartRegistration={() => {
                setActiveTab('daftar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenCalculator={() => {
                setActiveTab('kalkulator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewFees={() => {
                const el = document.getElementById('fee-tables');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <div id="fee-tables">
              <FeeTableSection onSelectPlan={handleSelectPlanFromTable} />
            </div>

            <SchoolHighlights />
          </div>
        )}

        {/* Tab 'kalkulator' */}
        {activeTab === 'kalkulator' && (
          <div className="pt-4">
            <FeeCalculator onProceedToRegister={handleProceedFromCalculator} />
            <SchoolHighlights />
          </div>
        )}

        {/* Tab 'daftar' */}
        {activeTab === 'daftar' && (
          <div className="pt-4">
            <RegistrationForm
              initialLevel={selectedPlan.level}
              initialWave={selectedPlan.wave}
              initialAddons={selectedPlan.addons}
              onSuccess={handleRegistrationSuccess}
              onViewStatus={handleViewApplicantStatus}
            />
          </div>
        )}

        {/* Tab 'status' */}
        {activeTab === 'status' && (
          <div className="pt-4">
            <StatusChecker initialSearchQuery={statusSearchQuery} />
          </div>
        )}

        {/* Tab 'admin' */}
        {activeTab === 'admin' && (
          <div className="pt-4">
            <AdminPortal
              applicants={applicants}
              onUpdateApplicants={setApplicants}
              onViewApplicantStatus={handleViewApplicantStatus}
            />
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* School Profile */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">
                    {SCHOOL_INFO.name}
                  </h4>
                  <p className="text-[11px] text-emerald-400">
                    {SCHOOL_INFO.tagline} • Tahun Ajaran {SCHOOL_INFO.academicYear}
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                Menyelenggarakan pendidikan Islam terpadu bermutu tinggi pada jenjang TKIT, SDIT, dan SMPIT di Kota Bogor yang mengintegrasikan adab, tahfidz Al-Qur'an, dan kecakapan akademik modern.
              </p>
              <div className="text-[11px] text-slate-500">
                {SCHOOL_INFO.foundation}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Layanan PPDB
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={() => { setActiveTab('biaya'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Brosur & Rincian Biaya
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('kalkulator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Simulasi Potongan Gelombang
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('daftar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Formulir Pendaftaran Siswa
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('status'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Cek Status Berkas & Observasi
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Portal Administrasi Panitia
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Sekretariat PPDB
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{SCHOOL_INFO.address}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{SCHOOL_INFO.whatsapp} / {SCHOOL_INFO.phone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{SCHOOL_INFO.email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 {SCHOOL_INFO.name}. Hak Cipta Dilindungi Undang-Undang.
            </div>
            <div className="flex items-center gap-1">
              <span>Sistem PPDB Online Terpadu</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
