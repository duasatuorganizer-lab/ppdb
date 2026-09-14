import React, { useState } from 'react';
import { EducationLevel, WaveType } from '../types';
import { LEVEL_FEES, WAVE_DETAILS, ESTIMATED_ADDONS, calculateSummary, formatRupiah } from '../data/ppdbData';
import { Calculator, Sparkles, Check, Bus, Utensils, BookOpen, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface FeeCalculatorProps {
  onProceedToRegister: (level: EducationLevel, wave: WaveType, addons: { catering: boolean; transport: boolean; bookPackage: boolean }) => void;
}

export const FeeCalculator: React.FC<FeeCalculatorProps> = ({ onProceedToRegister }) => {
  const [level, setLevel] = useState<EducationLevel>('SDIT');
  const [wave, setWave] = useState<WaveType>('OPEN_HOUSE');
  const [addons, setAddons] = useState({
    bookPackage: true,
    catering: false,
    transport: false,
  });

  const levelData = LEVEL_FEES[level];
  const waveData = WAVE_DETAILS[wave];
  const summary = calculateSummary(level, wave, addons);

  const toggleAddon = (key: keyof typeof addons) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          <span>Kalkulator & Simulasi Biaya PPDB 2027/2028</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hitung Estimasi Biaya & Potongan Promo
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Simulasikan biaya masuk sesuai jenjang pilihan Anda, manfaatkan promo potongan gelombang, dan sesuaikan kebutuhan layanan sekolah.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Pilih Jenjang */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              1. Pilih Jenjang Sekolah
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(LEVEL_FEES) as EducationLevel[]).map((lvlKey) => {
                const item = LEVEL_FEES[lvlKey];
                const active = level === lvlKey;
                return (
                  <button
                    key={lvlKey}
                    type="button"
                    onClick={() => setLevel(lvlKey)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      active
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`text-xs font-extrabold ${active ? 'text-emerald-900' : 'text-slate-800'}`}>
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Formulir: {formatRupiah(item.registrationFee)}
                    </div>
                  </button>
                );
              })}
            </div>
            {levelData.notes && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg mt-3 border border-amber-200/60">
                ℹ️ {levelData.notes}
              </p>
            )}
          </div>

          {/* Step 2: Pilih Gelombang Pendaftaran */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              2. Pilih Periode / Gelombang Pendaftaran
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['OPEN_HOUSE', 'GELOMBANG_1', 'GELOMBANG_2', 'REGULER'] as WaveType[]).map((wKey) => {
                const wInfo = WAVE_DETAILS[wKey];
                const active = wave === wKey;
                const wavePricing = levelData.waves[wKey];
                return (
                  <button
                    key={wKey}
                    type="button"
                    onClick={() => setWave(wKey)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer relative ${
                      active
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-extrabold ${active ? 'text-emerald-900' : 'text-slate-900'}`}>
                        {wInfo.title}
                      </span>
                      {wavePricing.discountPercent > 0 ? (
                        <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                          Diskon {wavePricing.discountPercent}% UP
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Tarif Normal
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{wInfo.period}</div>
                    {wavePricing.discountSavings > 0 && (
                      <div className="text-[11px] font-bold text-emerald-700 mt-1">
                        Hemat {formatRupiah(wavePricing.discountSavings)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Layanan Tambahan (Opsional) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Layanan Tambahan Opsional
              </label>
              <span className="text-[11px] text-slate-400">Dapat disesuaikan kemudian</span>
            </div>

            <div className="space-y-3">
              {/* Buku Paket */}
              <div 
                onClick={() => toggleAddon('bookPackage')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  addons.bookPackage ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    addons.bookPackage ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Buku Paket Pelajaran & Modul (1 Tahun)</div>
                    <div className="text-[11px] text-slate-500">
                      Buku tematik/kurikulum resmi SIT At Taufiq
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    +{formatRupiah(ESTIMATED_ADDONS.bookPackage[levelData.category])}
                  </div>
                  <div className="text-[10px] text-slate-500">Estimasi</div>
                </div>
              </div>

              {/* Antar Jemput */}
              <div 
                onClick={() => toggleAddon('transport')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  addons.transport ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    addons.transport ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Layanan Antar Jemput Sekolah (Armada Ber-AC)</div>
                    <div className="text-[11px] text-slate-500">Khusus rute Kota & Kabupaten Bogor</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    +{formatRupiah(ESTIMATED_ADDONS.transportMonthly)}
                  </div>
                  <div className="text-[10px] text-slate-500">Per Bulan</div>
                </div>
              </div>

              {/* Catering */}
              <div 
                onClick={() => toggleAddon('catering')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  addons.catering ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    addons.catering ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Katering Makan Siang Halal, Sehat & Bergizi</div>
                    <div className="text-[11px] text-slate-500">Menu harian diawasi ahli gizi sekolah</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    +{formatRupiah(ESTIMATED_ADDONS.cateringMonthly)}
                  </div>
                  <div className="text-[10px] text-slate-500">Per Bulan</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Price Summary Card */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-2xl border-2 border-emerald-600/30 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-emerald-800 text-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                  Ringkasan Estimasi Biaya
                </span>
                <span className="text-xs font-bold bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full">
                  {summary.waveName}
                </span>
              </div>
              <h3 className="text-xl font-extrabold mt-1 text-white">{summary.levelName}</h3>
              <p className="text-xs text-emerald-100/90 mt-0.5">Tahun Ajaran 2027/2028</p>
            </div>

            {/* Savings Callout */}
            {summary.discountSavings > 0 && (
              <div className="bg-rose-50 border-b border-rose-100 p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-rose-950">
                    HEMAT SEBESAR {formatRupiah(summary.discountSavings)}!
                  </div>
                  <div className="text-[11px] text-rose-700">
                    Potongan {summary.discountPercent}% Uang Pangkal periode {summary.waveName}
                  </div>
                </div>
              </div>
            )}

            {/* Line Items Breakdown */}
            <div className="p-5 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-600">Biaya Formulir Pendaftaran:</span>
                <span className="font-bold text-slate-900">{formatRupiah(summary.registrationFee)}</span>
              </div>

              {/* Uang Pangkal */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-700 font-semibold">Uang Pangkal</span>
                  {summary.discountPercent > 0 && (
                    <div className="text-[10px] text-slate-400 line-through">
                      Normal: {formatRupiah(summary.uangPangkalOriginal)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-800">{formatRupiah(summary.uangPangkalFinal)}</span>
                  {summary.discountPercent > 0 && (
                    <div className="text-[10px] text-rose-600 font-bold">
                      Diskon {summary.discountPercent}%
                    </div>
                  )}
                </div>
              </div>

              {/* BOKS */}
              <div className="flex justify-between items-center">
                <span className="text-slate-700">BOKS (Operasional Sekolah 1 Thn):</span>
                <span className="font-semibold text-slate-900">{formatRupiah(summary.boks)}</span>
              </div>

              {/* SPP Juli 2027 */}
              <div className="flex justify-between items-center">
                <span className="text-slate-700">SPP Bulan Pertama (Juli 2027):</span>
                <span className="font-semibold text-slate-900">{formatRupiah(summary.spp)}</span>
              </div>

              {/* Seragam */}
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Seragam & Atribut Lengkap:</span>
                <span className="font-semibold text-slate-900">{formatRupiah(summary.seragam)}</span>
              </div>

              {/* Subtotal PPDB Pokok */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-slate-800">
                <span>Subtotal Biaya PPDB Pokok:</span>
                <span>{formatRupiah(summary.ppdbSubtotal)}</span>
              </div>

              {/* Opsional Services */}
              {summary.addonsTotal > 0 && (
                <div className="pt-2 border-t border-dashed border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Layanan Tambahan Pilihan:</div>
                  {addons.bookPackage && (
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>• Buku Paket Modul</span>
                      <span>+{formatRupiah(ESTIMATED_ADDONS.bookPackage[levelData.category])}</span>
                    </div>
                  )}
                  {addons.transport && (
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>• Antar Jemput (Bulan Ke-1)</span>
                      <span>+{formatRupiah(ESTIMATED_ADDONS.transportMonthly)}</span>
                    </div>
                  )}
                  {addons.catering && (
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>• Catering Sehat (Bulan Ke-1)</span>
                      <span>+{formatRupiah(ESTIMATED_ADDONS.cateringMonthly)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-800 font-semibold pt-1">
                    <span>Total Layanan Tambahan:</span>
                    <span>{formatRupiah(summary.addonsTotal)}</span>
                  </div>
                </div>
              )}

              {/* Grand Total */}
              <div className="pt-3 border-t-2 border-slate-900 mt-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Estimasi Masuk Awal
                    </span>
                    <div className="text-[10px] text-slate-400">(Termasuk formulir & PPDB)</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-emerald-900">
                      {formatRupiah(summary.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Button Proceed */}
              <button
                type="button"
                onClick={() => onProceedToRegister(level, wave, addons)}
                className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-emerald-800/20 flex items-center justify-center gap-2 text-sm transition-transform active:scale-98 cursor-pointer"
              >
                <span>Daftar Sekarang dengan Paket Ini</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-400 mt-2">
                Biaya dapat dicicil sesuai ketentuan panitia PPDB SIT At Taufiq.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
