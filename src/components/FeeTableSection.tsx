import React, { useState } from 'react';
import { EducationLevel, WaveType } from '../types';
import { LEVEL_FEES, formatRupiah, SCHOOL_INFO } from '../data/ppdbData';
import { CheckCircle, Info, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface FeeTableSectionProps {
  onSelectPlan: (level: EducationLevel, wave: WaveType) => void;
}

export const FeeTableSection: React.FC<FeeTableSectionProps> = ({ onSelectPlan }) => {
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('SDIT');

  const currentFee = LEVEL_FEES[selectedLevel];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tabel Resmi Biaya PPDB 2027/2028</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Biaya Pendidikan {SCHOOL_INFO.shortName}
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Rincian biaya pendidikan normal dan potongan uang pangkal khusus Open House, Gelombang 1, dan Gelombang 2.
        </p>
      </div>

      {/* Level Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {(Object.keys(LEVEL_FEES) as EducationLevel[]).map((lvlKey) => {
          const lvl = LEVEL_FEES[lvlKey];
          const isSelected = selectedLevel === lvlKey;
          return (
            <button
              key={lvlKey}
              onClick={() => setSelectedLevel(lvlKey)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/20 scale-102'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{lvl.name}</span>
              {lvl.category === 'TKIT' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-600'
                }`}>
                  {lvl.classType}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Level Fee Banner */}
      <div className="bg-amber-300 text-amber-950 font-bold px-4 py-2.5 rounded-t-2xl flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <Tag className="w-4 h-4 text-amber-900" />
          <span>Biaya Pendaftaran {currentFee.name}: {formatRupiah(currentFee.registrationFee)}</span>
        </div>
        <span className="text-xs font-semibold bg-amber-400/80 px-2.5 py-1 rounded-lg">
          Dibayarkan saat pengambilan/pengisian formulir
        </span>
      </div>

      {/* Main Responsive Fee Table */}
      <div className="bg-white rounded-b-2xl border-x border-b border-slate-200 shadow-xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-700">
                <th className="p-3.5 sm:p-4 bg-slate-100 font-bold w-1/4 min-w-[140px]">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Komponen Biaya</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">{currentFee.name}</div>
                </th>
                <th className="p-3.5 sm:p-4 bg-slate-50 font-bold text-center border-l border-slate-200 min-w-[140px]">
                  <div className="text-slate-900 font-extrabold">Biaya PPDB</div>
                  <div className="text-xs font-semibold text-slate-500">(Normal)</div>
                </th>
                <th className="p-3.5 sm:p-4 bg-purple-50 font-bold text-center border-l border-purple-100 min-w-[160px]">
                  <div className="text-purple-900 font-extrabold uppercase">Open House</div>
                  <div className="text-[11px] text-purple-700 font-medium">19 September 2026</div>
                  <div className="inline-block mt-1 bg-purple-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                    Diskon {currentFee.waves.OPEN_HOUSE.discountPercent}% UP
                  </div>
                </th>
                <th className="p-3.5 sm:p-4 bg-emerald-50 font-bold text-center border-l border-emerald-100 min-w-[160px]">
                  <div className="text-emerald-900 font-extrabold uppercase">Gelombang 1</div>
                  <div className="text-[11px] text-emerald-700 font-medium">28 Sept - 10 Okt 2026</div>
                  <div className="inline-block mt-1 bg-emerald-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                    Diskon {currentFee.waves.GELOMBANG_1.discountPercent}% UP
                  </div>
                </th>
                <th className="p-3.5 sm:p-4 bg-sky-50 font-bold text-center border-l border-sky-100 min-w-[160px]">
                  <div className="text-sky-900 font-extrabold uppercase">Gelombang 2</div>
                  <div className="text-[11px] text-sky-700 font-medium">11 - 31 Okt 2026</div>
                  <div className="inline-block mt-1 bg-sky-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                    Diskon {currentFee.waves.GELOMBANG_2.discountPercent}% UP
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* UANG PANGKAL */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="p-3 sm:p-4 font-bold text-slate-900 bg-slate-50/50">
                  UANG PANGKAL
                  <div className="text-[11px] font-normal text-slate-500">Gedung, sarana & prasarana</div>
                </td>
                <td className="p-3 sm:p-4 text-center font-bold text-slate-700 border-l border-slate-200">
                  {formatRupiah(currentFee.normal.uangPangkal)}
                </td>
                <td className="p-3 sm:p-4 text-center font-extrabold text-purple-900 bg-purple-50/30 border-l border-purple-100">
                  <div>{formatRupiah(currentFee.waves.OPEN_HOUSE.uangPangkal)}</div>
                  <div className="text-[10px] text-purple-600 font-medium">
                    (Hemat {formatRupiah(currentFee.waves.OPEN_HOUSE.discountSavings)})
                  </div>
                </td>
                <td className="p-3 sm:p-4 text-center font-extrabold text-emerald-900 bg-emerald-50/30 border-l border-emerald-100">
                  <div>{formatRupiah(currentFee.waves.GELOMBANG_1.uangPangkal)}</div>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    (Hemat {formatRupiah(currentFee.waves.GELOMBANG_1.discountSavings)})
                  </div>
                </td>
                <td className="p-3 sm:p-4 text-center font-extrabold text-sky-900 bg-sky-50/30 border-l border-sky-100">
                  <div>{formatRupiah(currentFee.waves.GELOMBANG_2.uangPangkal)}</div>
                  <div className="text-[10px] text-sky-600 font-medium">
                    (Hemat {formatRupiah(currentFee.waves.GELOMBANG_2.discountSavings)})
                  </div>
                </td>
              </tr>

              {/* BOKS */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="p-3 sm:p-4 font-bold text-slate-900 bg-slate-50/50">
                  BOKS
                  <div className="text-[11px] font-normal text-slate-500">Biaya Operasional Kegiatan Sekolah</div>
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 border-l border-slate-200">
                  {formatRupiah(currentFee.normal.boks)}
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 bg-purple-50/30 border-l border-purple-100">
                  {formatRupiah(currentFee.waves.OPEN_HOUSE.boks)}
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 bg-emerald-50/30 border-l border-emerald-100">
                  {formatRupiah(currentFee.waves.GELOMBANG_1.boks)}
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 bg-sky-50/30 border-l border-sky-100">
                  {formatRupiah(currentFee.waves.GELOMBANG_2.boks)}
                </td>
              </tr>

              {/* SPP (Juli 2027) */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="p-3 sm:p-4 font-bold text-slate-900 bg-slate-50/50">
                  SPP (Juli 2027)
                  <div className="text-[11px] font-normal text-slate-500">Iuran bulan pertama masuk</div>
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 border-l border-slate-200">
                  {formatRupiah(currentFee.normal.spp)}
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 bg-purple-50/30 border-l border-purple-100">
                  {formatRupiah(currentFee.waves.OPEN_HOUSE.spp)}
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 bg-emerald-50/30 border-l border-emerald-100">
                  {formatRupiah(currentFee.waves.GELOMBANG_1.spp)}
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 bg-sky-50/30 border-l border-sky-100">
                  {formatRupiah(currentFee.waves.GELOMBANG_2.spp)}
                </td>
              </tr>

              {/* SERAGAM */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="p-3 sm:p-4 font-bold text-slate-900 bg-slate-50/50">
                  SERAGAM
                  <div className="text-[11px] font-normal text-slate-500">Seragam lengkap + atribut sekolah</div>
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 border-l border-slate-200">
                  {formatRupiah(currentFee.normal.seragam)}
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 bg-purple-50/30 border-l border-purple-100">
                  {formatRupiah(currentFee.waves.OPEN_HOUSE.seragam)}
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 bg-emerald-50/30 border-l border-emerald-100">
                  {formatRupiah(currentFee.waves.GELOMBANG_1.seragam)}
                </td>
                <td className="p-3 sm:p-4 text-center font-semibold text-slate-700 bg-sky-50/30 border-l border-sky-100">
                  {formatRupiah(currentFee.waves.GELOMBANG_2.seragam)}
                </td>
              </tr>

              {/* TOTAL ROW (Exact Highlight from Flyer) */}
              <tr className="bg-slate-900 text-white font-extrabold">
                <td className="p-3.5 sm:p-4 text-sm sm:text-base tracking-wide uppercase">
                  TOTAL BIAYA PPDB
                </td>
                <td className="p-3.5 sm:p-4 text-center text-sm sm:text-base border-l border-slate-800 text-slate-300">
                  {formatRupiah(currentFee.normal.total)}
                </td>
                <td className="p-3.5 sm:p-4 text-center text-sm sm:text-base border-l border-purple-900/50 bg-purple-900/60 text-purple-200">
                  {formatRupiah(currentFee.waves.OPEN_HOUSE.total)}
                </td>
                <td className="p-3.5 sm:p-4 text-center text-sm sm:text-base border-l border-emerald-900/50 bg-emerald-900/60 text-emerald-200">
                  {formatRupiah(currentFee.waves.GELOMBANG_1.total)}
                </td>
                <td className="p-3.5 sm:p-4 text-center text-sm sm:text-base border-l border-sky-900/50 bg-sky-900/60 text-sky-200">
                  {formatRupiah(currentFee.waves.GELOMBANG_2.total)}
                </td>
              </tr>

              {/* Quick Action Row */}
              <tr className="bg-slate-50">
                <td className="p-3 sm:p-4 text-slate-500 font-semibold text-xs">
                  Pilih Gelombang:
                </td>
                <td className="p-2 sm:p-3 text-center border-l border-slate-200">
                  <button
                    onClick={() => onSelectPlan(selectedLevel, 'REGULER')}
                    className="w-full py-1.5 px-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
                  >
                    Daftar Reguler
                  </button>
                </td>
                <td className="p-2 sm:p-3 text-center border-l border-purple-100 bg-purple-50/20">
                  <button
                    onClick={() => onSelectPlan(selectedLevel, 'OPEN_HOUSE')}
                    className="w-full py-1.5 px-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Pilih Open House</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
                <td className="p-2 sm:p-3 text-center border-l border-emerald-100 bg-emerald-50/20">
                  <button
                    onClick={() => onSelectPlan(selectedLevel, 'GELOMBANG_1')}
                    className="w-full py-1.5 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Pilih Gel. 1</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
                <td className="p-2 sm:p-3 text-center border-l border-sky-100 bg-sky-50/20">
                  <button
                    onClick={() => onSelectPlan(selectedLevel, 'GELOMBANG_2')}
                    className="w-full py-1.5 px-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Pilih Gel. 2</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Footnotes from the Flyer */}
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Catatan Penting Sesuai Brosur Resmi:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-1 text-amber-900/90">
          <li>
            <strong>Biaya di atas belum termasuk buku paket, jemputan & catering</strong> (layanan bersifat opsional/pilihan orang tua).
          </li>
          <li>
            <strong>BOKS (Biaya Operasional Kegiatan Sekolah)</strong> dibayarkan per tahun ajaran.
          </li>
          {selectedLevel.startsWith('TKIT') && (
            <li className="font-semibold text-emerald-900">
              Khusus TKIT: BOKS untuk <strong>TKIT (kelas B) adalah Rp 3.500.000</strong> (berbeda Rp 500.000 dibanding Kelas A).
            </li>
          )}
          <li>
            SPP yang tercantum mencakup pembayaran untuk <strong>bulan Juli 2027</strong> (bulan pertama kegiatan belajar aktif).
          </li>
        </ul>
      </div>
    </section>
  );
};
