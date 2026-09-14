import React from 'react';
import { Sparkles, Calendar, ArrowRight, Calculator, CheckCircle2, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { SCHOOL_INFO, WAVE_DETAILS } from '../data/ppdbData';
import { BpicatLogo } from './BpicatLogo';

interface HeroSectionProps {
  onStartRegistration: () => void;
  onOpenCalculator: () => void;
  onViewFees: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartRegistration,
  onOpenCalculator,
  onViewFees
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle Islamic geometric pattern background glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:20px_20px]"></div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="flex items-center gap-3.5">
              <BpicatLogo className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-emerald-400/40 shadow-xl p-0.5 bg-white shrink-0 hover:scale-105 transition-transform" />
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/80 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Penerimaan Peserta Didik Baru (PPDB) TP {SCHOOL_INFO.academicYear}</span>
                </div>
                <div className="text-xs text-emerald-200/90 font-medium mt-1">
                  Badan Pengelola Islamic Centre At Taufiq (BPICAT)
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Sekolah Islam Terpadu <br className="hidden sm:inline" />
              <span className="text-emerald-300 underline decoration-amber-400/80 decoration-wavy decoration-2">At Taufiq Bogor</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl leading-relaxed font-normal">
              Mendidik generasi Qur'ani, berakhlaq mulia, berwawasan global, dan berprestasi unggul 
              melalui integrasi kurikulum nasional, keagamaan, dan penanaman adab Islam sejak dini.
            </p>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-emerald-100">
              <div className="flex items-center gap-2 bg-emerald-800/60 backdrop-blur-xs p-2 rounded-lg border border-emerald-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>TKIT (Kelas A & B)</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/60 backdrop-blur-xs p-2 rounded-lg border border-emerald-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>SDIT At Taufiq</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/60 backdrop-blur-xs p-2 rounded-lg border border-emerald-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>SMPIT At Taufiq</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onStartRegistration}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 text-sm transition-all transform active:scale-95"
              >
                <span>Daftar Online Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="bg-emerald-700/70 hover:bg-emerald-700 text-white font-semibold px-4 py-3 rounded-xl border border-emerald-500/50 flex items-center gap-2 text-sm transition-colors"
              >
                <Calculator className="w-4 h-4 text-emerald-200" />
                <span>Simulasi & Hitung Biaya</span>
              </button>

              <button
                onClick={onViewFees}
                className="text-emerald-200 hover:text-white text-xs font-semibold underline underline-offset-4 px-2 py-2"
              >
                Lihat Brosur Biaya Resmi
              </button>
            </div>
          </div>

          {/* Right Card: Gelombang & Highlight Promo Brosur */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-2xl border border-emerald-100 relative">
              <div className="absolute -top-3 right-4 bg-rose-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                <span>Diskon s/d 60%</span>
              </div>

              <div className="border-b border-slate-100 pb-3 mb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  Jadwal & Gelombang PPDB 2027/2028
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Segera daftarkan putra-putri Anda untuk mendapatkan potongan uang pangkal terbesar.
                </p>
              </div>

              {/* Wave Cards */}
              <div className="space-y-2.5 text-xs">
                {/* Open House */}
                <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-rose-900 text-sm">{WAVE_DETAILS.OPEN_HOUSE.title}</span>
                      <span className="bg-rose-200 text-rose-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded">
                        PROMO TERBESAR
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5 text-[11px]">
                      Tanggal: <span className="font-semibold text-slate-800">{WAVE_DETAILS.OPEN_HOUSE.period}</span>
                    </p>
                    <p className="text-rose-700 font-semibold text-[11px] mt-0.5">
                      • TKIT: Diskon UP 60% (Hemat Rp 4.800.000)
                      <br />• SDIT & SMPIT: Diskon UP 40% (Hemat Rp 6.360.000)
                    </p>
                  </div>
                </div>

                {/* Gelombang 1 */}
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-900 text-sm">{WAVE_DETAILS.GELOMBANG_1.title}</span>
                      <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        DISCOUNT
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5 text-[11px]">
                      Periode: <span className="font-semibold text-slate-800">{WAVE_DETAILS.GELOMBANG_1.period}</span>
                    </p>
                    <p className="text-emerald-800 font-medium text-[11px] mt-0.5">
                      • TKIT Diskon 50% | SDIT & SMPIT Diskon 30%
                    </p>
                  </div>
                </div>

                {/* Gelombang 2 */}
                <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sky-900 text-sm">{WAVE_DETAILS.GELOMBANG_2.title}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5 text-[11px]">
                      Periode: <span className="font-semibold text-slate-800">{WAVE_DETAILS.GELOMBANG_2.period}</span>
                    </p>
                    <p className="text-sky-800 font-medium text-[11px] mt-0.5">
                      • TKIT Diskon 40% | SDIT & SMPIT Diskon 20%
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Fee footnote */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Biaya Formulir:</span>
                <span className="font-semibold text-slate-800">TKIT: Rp 590rb | SD/SMP: Rp 650rb</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Steps Registration Flow Bar */}
        <div className="mt-12 pt-8 border-t border-emerald-700/50">
          <div className="text-center mb-6">
            <h2 className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
              Alur Penerimaan Peserta Didik Baru (PPDB)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-800/40 border border-emerald-700/60 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                1
              </div>
              <h3 className="font-bold text-white text-sm">Pendaftaran Online</h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Isi formulir biodata calon siswa & orang tua, pilih jenjang, dan peroleh nomor pendaftaran resmi.
              </p>
            </div>

            <div className="bg-emerald-800/40 border border-emerald-700/60 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                2
              </div>
              <h3 className="font-bold text-white text-sm">Observasi & Pemetaan</h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Calon siswa mengikuti observasi kesiapan belajar/psikotes serta tes kemampuan dasar membaca Quran.
              </p>
            </div>

            <div className="bg-emerald-800/40 border border-emerald-700/60 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                3
              </div>
              <h3 className="font-bold text-white text-sm">Wawancara Orang Tua</h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Penyelarasan visi pendidikan sekolah dan keluarga serta komitmen pembinaan akhlaq siswa.
              </p>
            </div>

            <div className="bg-emerald-800/40 border border-emerald-700/60 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                4
              </div>
              <h3 className="font-bold text-white text-sm">Pengumuman & Daftar Ulang</h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Cek hasil kelulusan secara online, pelunasan biaya PPDB sesuai gelombang, dan pengukuran seragam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
