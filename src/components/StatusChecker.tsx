import React, { useState, useEffect } from 'react';
import { Applicant } from '../types';
import { getStoredApplicants, formatRupiah, SCHOOL_INFO } from '../data/ppdbData';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Award,
  AlertCircle,
  Lock
} from 'lucide-react';
import { BpicatLogo } from './BpicatLogo';

interface StatusCheckerProps {
  initialSearchQuery?: string;
}

export const StatusChecker: React.FC<StatusCheckerProps> = ({ initialSearchQuery = '' }) => {
  const [query, setQuery] = useState(initialSearchQuery);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialSearchQuery) {
      handleSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const handleSearch = (searchVal: string) => {
    const q = searchVal.trim().toLowerCase();
    if (!q) return;

    const all = getStoredApplicants();
    // Strict privacy protection: only allow lookup by exact Registration ID, NIK, or Parent WhatsApp
    const found = all.find(
      (a) =>
        a.id.toLowerCase() === q ||
        a.student.nik === q ||
        a.parent.fatherPhone.replace(/\D/g, '') === q.replace(/\D/g, '') ||
        a.parent.motherPhone.replace(/\D/g, '') === q.replace(/\D/g, '')
    );

    setApplicant(found || null);
    setSearched(true);
  };

  const getStatusBadge = (status: Applicant['status']) => {
    switch (status) {
      case 'MENUNGGU_VERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Verifikasi Bukti Bayar
          </span>
        );
      case 'TERVERIFIKASI':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 border border-sky-300 px-2.5 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Berkas Terverifikasi
          </span>
        );
      case 'JADWAL_OBSERVASI':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-1 rounded-full text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            Jadwal Observasi & Wawancara Diterbitkan
          </span>
        );
      case 'LULUS':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            Alhamdulillah, Dinyatakan LULUS
          </span>
        );
      case 'DITOLAK':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-full text-xs font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            Belum Memenuhi Kriteria
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tracking Status Pendaftaran</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cek Status Pendaftaran PPDB
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Masukkan Nomor Pendaftaran (misal: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-bold">PPDB-2027-TK-001</code>), NIK Calon Siswa, atau No. WhatsApp Orang Tua.
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        className="max-w-xl mx-auto mb-8 flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik Nomor Registrasi / NIK / No. WA..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-sm shadow-xs outline-none bg-white"
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-xs text-sm transition-colors cursor-pointer"
        >
          Cari
        </button>
      </form>

      {/* Results View */}
      {searched && !applicant && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Data Pendaftaran Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Pastikan Nomor Registrasi atau NIK yang Anda masukkan sudah tepat. Demi perlindungan privasi, pencarian status dibatasi hanya menggunakan ID Registrasi pendaftar, NIK anak, atau No. WhatsApp orang tua.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
            Butuh bantuan? Silakan hubungi Hotline Panitia PPDB SIT At Taufiq melalui WhatsApp.
          </div>
        </div>
      )}

      {applicant && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden print:border-none print:shadow-none">
          {/* Card Header with Islamic School Theme & Logo */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <BpicatLogo className="w-12 h-12 border border-white/20 shadow-md p-0.5 bg-white shrink-0" />
              <div>
                <div className="text-[11px] text-emerald-300 font-semibold tracking-wider uppercase">
                  {SCHOOL_INFO.shortName} • PPDB TP {SCHOOL_INFO.academicYear}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {applicant.student.fullName}
                </h3>
                <p className="text-xs text-emerald-100">
                  Jenjang: <strong className="text-amber-300">{applicant.financial.levelName}</strong> ({applicant.financial.waveName})
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-emerald-200">No. Registrasi:</div>
              <div className="text-xl font-black tracking-wider text-amber-300 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-600/40 font-mono">
                {applicant.id}
              </div>
            </div>
          </div>

          {/* Status Tracker */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Status Terkini Berkas:</span>
                {getStatusBadge(applicant.status)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak Bukti Pendaftaran</span>
                </button>
              </div>
            </div>

            {/* Observation Alert if Scheduled */}
            {applicant.observationDate && (
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-3.5 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-xs text-purple-950">Jadwal Observasi Siswa & Wawancara Orang Tua:</div>
                  <div className="text-xs font-semibold text-purple-900 mt-0.5">{applicant.observationDate}</div>
                  {applicant.observationLocation && (
                    <div className="text-[11px] text-purple-700 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{applicant.observationLocation}</span>
                    </div>
                  )}
                  <p className="text-[11px] text-purple-600 mt-1">
                    *Harap hadir 15 menit sebelum jadwal dengan membawa cetak bukti pendaftaran dan fotokopi KK & Akta Kelahiran.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Applicant Details Details Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Student Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                Biodata Calon Siswa
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Nama Lengkap:</span>
                <span className="col-span-2 font-bold text-slate-900">{applicant.student.fullName}</span>

                <span className="text-slate-500">NIK:</span>
                <span className="col-span-2 text-slate-800">{applicant.student.nik}</span>

                {applicant.student.nisn && (
                  <>
                    <span className="text-slate-500">NISN:</span>
                    <span className="col-span-2 text-slate-800">{applicant.student.nisn}</span>
                  </>
                )}

                <span className="text-slate-500">Jenis Kelamin:</span>
                <span className="col-span-2 text-slate-800">
                  {applicant.student.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}
                </span>

                <span className="text-slate-500">Tempat, Tgl Lahir:</span>
                <span className="col-span-2 text-slate-800">
                  {applicant.student.birthPlace}, {applicant.student.birthDate}
                </span>

                <span className="text-slate-500">Asal Sekolah:</span>
                <span className="col-span-2 text-slate-800">{applicant.student.previousSchool || '-'}</span>

                <span className="text-slate-500">Alamat:</span>
                <span className="col-span-2 text-slate-800">{applicant.student.address}</span>

                {applicant.student.specialNotes && (
                  <>
                    <span className="text-slate-500">Catatan/Hafalan:</span>
                    <span className="col-span-2 text-emerald-800 font-semibold">{applicant.student.specialNotes}</span>
                  </>
                )}
              </div>
            </div>

            {/* Parent & Financial Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1.5">
                  Orang Tua / Wali
                </h4>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-500">Nama Ayah:</span>
                  <span className="col-span-2 text-slate-900 font-semibold">{applicant.parent.fatherName || '-'}</span>

                  <span className="text-slate-500">No. WA Ayah:</span>
                  <span className="col-span-2 text-slate-800">{applicant.parent.fatherPhone || '-'}</span>

                  <span className="text-slate-500">Nama Ibu:</span>
                  <span className="col-span-2 text-slate-900 font-semibold">{applicant.parent.motherName || '-'}</span>

                  <span className="text-slate-500">No. WA Ibu:</span>
                  <span className="col-span-2 text-slate-800">{applicant.parent.motherPhone || '-'}</span>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <h5 className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>Skema Pembiayaan Terdaftar</span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Diskon {applicant.financial.discountPercent}% UP
                  </span>
                </h5>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Formulir:</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(applicant.financial.registrationFee)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Uang Pangkal ({applicant.financial.waveName}):</span>
                  <span className="font-semibold text-emerald-800">{formatRupiah(applicant.financial.uangPangkalFinal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>BOKS + SPP + Seragam:</span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(applicant.financial.boks + applicant.financial.spp + applicant.financial.seragam)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Total Biaya PPDB:</span>
                  <span className="text-emerald-800">{formatRupiah(applicant.financial.ppdbSubtotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Note if Available */}
          {applicant.adminNotes && (
            <div className="bg-emerald-50/70 border-t border-emerald-100 p-4 text-xs text-emerald-950 flex items-start gap-2">
              <span className="font-bold shrink-0">Catatan Panitia:</span>
              <p className="text-slate-700">{applicant.adminNotes}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
