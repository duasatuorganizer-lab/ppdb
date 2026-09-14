import React from 'react';
import { BookOpen, ShieldCheck, HeartHandshake, Award, Users, MapPin, Sparkles, CheckCircle } from 'lucide-react';
import { SCHOOL_INFO } from '../data/ppdbData';

export const SchoolHighlights: React.FC = () => {
  return (
    <section className="py-14 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mencetak Generasi Islami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mengapa Memilih {SCHOOL_INFO.shortName}?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Komitmen kami adalah menghadirkan lingkungan belajar yang menumbuhkan kecintaan pada Al-Qur'an, adab islami yang kokoh, dan kecakapan akademik abad 21.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Tahfidz & Tahsin Mutqin</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Program bimbingan Al-Quran terstruktur setiap hari dengan metode yang menyenangkan, target hafalan juz terukur, dan pembinaan tajwid bersanad.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>TKIT: Hafalan Juz 30 surat-surat pendek & doa harian</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>SDIT: Target 2-3 Juz Mutqin & Hadits Arbain</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>SMPIT: Target 3-5 Juz & Kelas Khusus Takhassus</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Kurikulum Terpadu & Sains</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Integrasi Kurikulum Merdeka Nasional dengan Kurikulum Khas Sekolah Islam Terpadu (JSIT) untuk mengasah logika sains, matematika, dan literasi kritis.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pembelajaran berbasis proyek (PBL) & STEM</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bilingual environment (Bahasa Arab & Inggris)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Prestasi olimpiade sains dan robotic</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Pembiasaan Adab & Akhlaqul Karimah</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Pendidikan bukan sekadar transfer ilmu, melainkan keteladanan ibadah praktis, shalat berjamaah, adab berbicara, empati sosial, dan bakti kepada orang tua.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Shalat Dhuha & Shalat Berjamaah terjadwal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Budaya 5S (Senyum, Salam, Sapa, Sopan, Santun)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kemitraan parenting aktif sekolah & orang tua</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Location & Foundation Details */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              {SCHOOL_INFO.foundation}
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {SCHOOL_INFO.name}
            </h3>
            <div className="flex items-start gap-2 text-xs text-slate-600 max-w-xl">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{SCHOOL_INFO.address}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <a
              href={`https://wa.me/62${SCHOOL_INFO.whatsapp.replace(/\D/g, '').replace(/^0/, '')}?text=Halo%20Panitia%20PPDB%20SIT%20At%20Taufiq`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors shadow-xs"
            >
              <span>Konsultasi PPDB WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
