import React, { useState, useEffect } from 'react';
import { EducationLevel, WaveType, Applicant, AddonServices } from '../types';
import { LEVEL_FEES, WAVE_DETAILS, calculateSummary, formatRupiah, SCHOOL_INFO, saveStoredApplicants, getStoredApplicants } from '../data/ppdbData';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Users, 
  CreditCard, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Building, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface RegistrationFormProps {
  initialLevel?: EducationLevel;
  initialWave?: WaveType;
  initialAddons?: AddonServices;
  onSuccess: (newApplicant: Applicant) => void;
  onViewStatus: (applicantId: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  initialLevel = 'SDIT',
  initialWave = 'OPEN_HOUSE',
  initialAddons = { catering: false, transport: false, bookPackage: true },
  onSuccess,
  onViewStatus
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [level, setLevel] = useState<EducationLevel>(initialLevel);
  const [wave, setWave] = useState<WaveType>(initialWave);
  const [addons, setAddons] = useState<AddonServices>(initialAddons);

  // Student details
  const [student, setStudent] = useState({
    fullName: '',
    gender: 'L' as 'L' | 'P',
    nik: '',
    nisn: '',
    birthPlace: 'Bogor',
    birthDate: '2020-05-10',
    religion: 'Islam',
    childOrder: 1,
    totalSiblings: 2,
    previousSchool: '',
    address: '',
    specialNotes: ''
  });

  // Parents details
  const [parent, setParent] = useState({
    fatherName: '',
    fatherJob: '',
    fatherPhone: '',
    motherName: '',
    motherJob: '',
    motherPhone: '',
    email: '',
    monthlyIncome: 'Rp 10.000.000 - Rp 15.000.000'
  });

  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedRegId, setCopiedRegId] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Keep synced if props change
  useEffect(() => {
    if (initialLevel) setLevel(initialLevel);
    if (initialWave) setWave(initialWave);
    if (initialAddons) setAddons(initialAddons);
  }, [initialLevel, initialWave, initialAddons]);

  const summary = calculateSummary(level, wave, addons);

  const validateStep2 = () => {
    const errors: string[] = [];
    if (!student.fullName.trim()) errors.push('Nama lengkap calon siswa wajib diisi.');
    if (!student.nik.trim() || student.nik.length < 10) errors.push('NIK calon siswa wajib diisi minimal 10-16 digit.');
    if (!student.birthPlace.trim()) errors.push('Tempat lahir calon siswa wajib diisi.');
    if (!student.birthDate) errors.push('Tanggal lahir calon siswa wajib diisi.');
    if (!student.address.trim()) errors.push('Alamat tempat tinggal lengkap wajib diisi.');
    setFormErrors(errors);
    return errors.length === 0;
  };

  const validateStep3 = () => {
    const errors: string[] = [];
    if (!parent.fatherName.trim() && !parent.motherName.trim()) {
      errors.push('Nama Ayah atau Nama Ibu wajib diisi salah satu.');
    }
    if (!parent.fatherPhone.trim() && !parent.motherPhone.trim()) {
      errors.push('Nomor WhatsApp aktif Orang Tua wajib diisi untuk koordinasi PPDB.');
    }
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = getStoredApplicants();

    // Generate unique prefix based on category
    const catCode = level.startsWith('TK') ? 'TK' : level === 'SDIT' ? 'SD' : 'SMP';
    const num = (existing.length + 1).toString().padStart(3, '0');
    const newId = `PPDB-2027-${catCode}-${num}`;
    const pin = 'ATF' + Math.floor(100 + Math.random() * 900);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newApplicant: Applicant = {
      id: newId,
      registrationCode: pin,
      registeredAt: formattedDate,
      level,
      wave,
      student,
      parent,
      addons,
      financial: summary,
      status: 'MENUNGGU_VERIFIKASI',
      paymentStatus: 'BELUM_BAYAR',
      adminNotes: 'Pendaftaran mandiri melalui website PPDB Online.'
    };

    const updated = [newApplicant, ...existing];
    saveStoredApplicants(updated);
    setSubmittedApplicant(newApplicant);
    setStep(5);
    onSuccess(newApplicant);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore in iframe fallback
    }
  };

  const copyToClipboard = (text: string, type: 'bank' | 'id') => {
    navigator.clipboard.writeText(text);
    if (type === 'bank') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    } else {
      setCopiedRegId(true);
      setTimeout(() => setCopiedRegId(false), 2000);
    }
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Formulir Pendaftaran Siswa Baru
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          PPDB {SCHOOL_INFO.name} Tahun Ajaran {SCHOOL_INFO.academicYear}
        </p>
      </div>

      {/* Steps Indicator */}
      {step < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 -z-10"></div>
            {[
              { num: 1, label: 'Jenjang & Gelombang' },
              { num: 2, label: 'Data Calon Siswa' },
              { num: 3, label: 'Data Orang Tua' },
              { num: 4, label: 'Konfirmasi' }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step >= s.num
                      ? 'bg-emerald-700 text-white shadow-md ring-4 ring-emerald-100'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {s.num}
                </div>
                <span className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                  step >= s.num ? 'text-emerald-900 font-bold' : 'text-slate-400'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error alert if any */}
      {formErrors.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 text-rose-800 text-xs">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-950">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Mohon lengkapi data berikut:
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {formErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step 1: Jenjang & Gelombang */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-700" />
              Langkah 1: Tentukan Jenjang & Periode Gelombang
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilihan ini menentukan skema potongan uang pangkal dan biaya pendaftaran.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Pilih Jenjang Sekolah</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(LEVEL_FEES) as EducationLevel[]).map((lvlKey) => {
                const item = LEVEL_FEES[lvlKey];
                const isSelected = level === lvlKey;
                return (
                  <button
                    key={lvlKey}
                    type="button"
                    onClick={() => setLevel(lvlKey)}
                    className={`p-4 rounded-xl text-left border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-extrabold text-sm text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500 mt-1">Biaya Formulir:</div>
                    <div className="text-xs font-bold text-emerald-700">{formatRupiah(item.registrationFee)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Pilih Periode / Gelombang</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['OPEN_HOUSE', 'GELOMBANG_1', 'GELOMBANG_2'] as WaveType[]).map((wKey) => {
                const wInfo = WAVE_DETAILS[wKey];
                const wavePricing = LEVEL_FEES[level].waves[wKey];
                const isSelected = wave === wKey;
                return (
                  <button
                    key={wKey}
                    type="button"
                    onClick={() => setWave(wKey)}
                    className={`p-4 rounded-xl text-left border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900">{wInfo.title}</span>
                      <span className="text-[10px] font-extrabold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                        Diskon {wavePricing.discountPercent}%
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{wInfo.period}</div>
                    <div className="text-xs font-bold text-emerald-700 mt-2">
                      Hemat {formatRupiah(wavePricing.discountSavings)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setFormErrors([]);
                setStep(2);
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-2 text-sm"
            >
              <span>Lanjut: Data Calon Siswa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Data Calon Siswa */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-700" />
              Langkah 2: Data Identitas Calon Siswa
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mohon masukkan data yang sesuai dengan Kartu Keluarga (KK) dan Akta Kelahiran.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Nama Lengkap Calon Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={student.fullName}
                onChange={(e) => setStudent({ ...student, fullName: e.target.value })}
                placeholder="Contoh: Muhammad Fatih Al-Farabi"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={student.gender === 'L'}
                    onChange={() => setStudent({ ...student, gender: 'L' })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-800 text-xs font-semibold">Laki-laki (Ikhwan)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={student.gender === 'P'}
                    onChange={() => setStudent({ ...student, gender: 'P' })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-800 text-xs font-semibold">Perempuan (Akhwat)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={student.nik}
                onChange={(e) => setStudent({ ...student, nik: e.target.value })}
                placeholder="16 digit NIK di Kartu Keluarga"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tempat Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={student.birthPlace}
                onChange={(e) => setStudent({ ...student, birthPlace: e.target.value })}
                placeholder="Kota Kelahiran (misal: Bogor)"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tanggal Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={student.birthDate}
                onChange={(e) => setStudent({ ...student, birthDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                NISN (Opsional untuk SD/SMP)
              </label>
              <input
                type="text"
                value={student.nisn || ''}
                onChange={(e) => setStudent({ ...student, nisn: e.target.value })}
                placeholder="Nomor Induk Siswa Nasional jika ada"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Asal Sekolah Sebelumnya
              </label>
              <input
                type="text"
                value={student.previousSchool}
                onChange={(e) => setStudent({ ...student, previousSchool: e.target.value })}
                placeholder="Nama PAUD/TK/SD asal"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Alamat Lengkap Domisili <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={student.address}
                onChange={(e) => setStudent({ ...student, address: e.target.value })}
                placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Prestasi / Hafalan Quran / Catatan Khusus
              </label>
              <input
                type="text"
                value={student.specialNotes || ''}
                onChange={(e) => setStudent({ ...student, specialNotes: e.target.value })}
                placeholder="Contoh: Hafalan Juz 30, Juara mewarnai, atau riwayat alergi tertentu"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep2()) {
                  setStep(3);
                }
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-2 text-sm"
            >
              <span>Lanjut: Data Orang Tua</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Data Orang Tua */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              Langkah 3: Data Orang Tua / Wali
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Nomor WhatsApp akan digunakan panitia untuk mengirim informasi wawancara & observasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Ayah */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1.5">Data Ayah</h4>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Ayah</label>
                <input
                  type="text"
                  value={parent.fatherName}
                  onChange={(e) => setParent({ ...parent, fatherName: e.target.value })}
                  placeholder="Nama Ayah beserta gelar jika ada"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pekerjaan Ayah</label>
                <input
                  type="text"
                  value={parent.fatherJob}
                  onChange={(e) => setParent({ ...parent, fatherJob: e.target.value })}
                  placeholder="Karyawan Swasta / PNS / Wiraswasta"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Ayah</label>
                <input
                  type="tel"
                  value={parent.fatherPhone}
                  onChange={(e) => setParent({ ...parent, fatherPhone: e.target.value })}
                  placeholder="0812xxxxxxxx"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
            </div>

            {/* Ibu */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-1.5">Data Ibu</h4>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Ibu</label>
                <input
                  type="text"
                  value={parent.motherName}
                  onChange={(e) => setParent({ ...parent, motherName: e.target.value })}
                  placeholder="Nama Ibu beserta gelar jika ada"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pekerjaan Ibu</label>
                <input
                  type="text"
                  value={parent.motherJob}
                  onChange={(e) => setParent({ ...parent, motherJob: e.target.value })}
                  placeholder="Ibu Rumah Tangga / Tenaga Medis / Guru"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Ibu</label>
                <input
                  type="tel"
                  value={parent.motherPhone}
                  onChange={(e) => setParent({ ...parent, motherPhone: e.target.value })}
                  placeholder="0813xxxxxxxx"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Aktif</label>
                <input
                  type="email"
                  value={parent.email}
                  onChange={(e) => setParent({ ...parent, email: e.target.value })}
                  placeholder="orangtua@email.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rentang Penghasilan Gabungan</label>
                <select
                  value={parent.monthlyIncome}
                  onChange={(e) => setParent({ ...parent, monthlyIncome: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
                >
                  <option value="< Rp 5.000.000">&lt; Rp 5.000.000</option>
                  <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                  <option value="Rp 10.000.000 - Rp 15.000.000">Rp 10.000.000 - Rp 15.000.000</option>
                  <option value="Rp 15.000.000 - Rp 20.000.000">Rp 15.000.000 - Rp 20.000.000</option>
                  <option value="> Rp 20.000.000">&gt; Rp 20.000.000</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateStep3()) {
                  setStep(4);
                }
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-2 text-sm"
            >
              <span>Lanjut: Konfirmasi & Review Biaya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Konfirmasi & Review Final */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-700" />
              Langkah 4: Konfirmasi Pendaftaran & Ringkasan Biaya
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Periksa kembali data Anda sebelum mengirimkan formulir pendaftaran.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left: Summary Data */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">Identitas Calon Siswa</h4>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-500">Nama Lengkap:</span>
                  <span className="col-span-2 font-bold text-slate-900">{student.fullName}</span>
                  <span className="text-slate-500">Jenis Kelamin:</span>
                  <span className="col-span-2 text-slate-800">
                    {student.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}
                  </span>
                  <span className="text-slate-500">NIK:</span>
                  <span className="col-span-2 text-slate-800">{student.nik}</span>
                  <span className="text-slate-500">TTL:</span>
                  <span className="col-span-2 text-slate-800">{student.birthPlace}, {student.birthDate}</span>
                  <span className="text-slate-500">Alamat:</span>
                  <span className="col-span-2 text-slate-800">{student.address}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">Kontak Orang Tua / Wali</h4>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-500">Ayah / No WA:</span>
                  <span className="col-span-2 font-semibold text-slate-900">
                    {parent.fatherName || '-'} ({parent.fatherPhone || '-'})
                  </span>
                  <span className="text-slate-500">Ibu / No WA:</span>
                  <span className="col-span-2 font-semibold text-slate-900">
                    {parent.motherName || '-'} ({parent.motherPhone || '-'})
                  </span>
                  <span className="text-slate-500">Email:</span>
                  <span className="col-span-2 text-slate-800">{parent.email || '-'}</span>
                </div>
              </div>
            </div>

            {/* Right: Financial Overview */}
            <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-emerald-200/60 pb-2">
                <div>
                  <div className="font-extrabold text-emerald-950 text-sm">{summary.levelName}</div>
                  <div className="text-[11px] text-emerald-700">{summary.waveName}</div>
                </div>
                {summary.discountSavings > 0 && (
                  <span className="text-[11px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full">
                    Hemat {formatRupiah(summary.discountSavings)}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Biaya Formulir Pendaftaran:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(summary.registrationFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uang Pangkal (Setelah Diskon {summary.discountPercent}%):</span>
                  <span className="font-bold text-emerald-800">{formatRupiah(summary.uangPangkalFinal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>BOKS (Kegiatan Sekolah 1 Thn):</span>
                  <span>{formatRupiah(summary.boks)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SPP Pertama (Juli 2027):</span>
                  <span>{formatRupiah(summary.spp)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seragam Lengkap:</span>
                  <span>{formatRupiah(summary.seragam)}</span>
                </div>
                {summary.addonsTotal > 0 && (
                  <div className="flex justify-between pt-1 text-slate-600 border-t border-emerald-200/50">
                    <span>Layanan Tambahan Opsional:</span>
                    <span>+{formatRupiah(summary.addonsTotal)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-emerald-300 flex justify-between items-center font-extrabold text-sm text-emerald-950">
                  <span>Total Biaya Masuk Awal:</span>
                  <span className="text-base text-emerald-900">{formatRupiah(summary.grandTotal)}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Tahap Pertama Pembayaran:</div>
                <p>
                  Setelah menekan tombol daftar, silakan mentransfer <strong>Biaya Formulir Pendaftaran sebesar {formatRupiah(summary.registrationFee)}</strong> ke rekening BSI sekolah. Pelunasan Biaya PPDB dapat dilakukan setelah siswa dinyatakan lulus seleksi/observasi.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-800/20 flex items-center gap-2 text-sm transition-transform active:scale-98 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Kirim & Cetak Bukti Pendaftaran</span>
            </button>
          </div>
        </form>
      )}

      {/* Step 5: Success & Registration Card */}
      {step === 5 && submittedApplicant && (
        <div className="space-y-6">
          <div className="bg-emerald-800 text-white rounded-2xl p-6 sm:p-8 text-center shadow-xl relative overflow-hidden">
            <div className="inline-flex p-3 rounded-full bg-emerald-700/80 mb-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-300" />
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">Alhamdulillah, Pendaftaran Berhasil!</h3>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
              Data calon siswa telah tersimpan di sistem PPDB {SCHOOL_INFO.shortName}. Simpan Nomor Pendaftaran Anda untuk pengecekan status dan jadwal seleksi.
            </p>

            <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-emerald-900/90 border border-emerald-600/50 p-4 rounded-xl">
              <div className="text-left">
                <div className="text-[11px] text-emerald-300 font-semibold">Nomor Registrasi PPDB:</div>
                <div className="text-2xl font-black text-amber-300 tracking-wider">
                  {submittedApplicant.id}
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(submittedApplicant.id, 'id')}
                className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copiedRegId ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRegId ? 'Tersalin' : 'Salin Nomor'}</span>
              </button>
            </div>
          </div>

          {/* Payment Instructions Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Instruksi Pembayaran Biaya Pendaftaran Formulir
                </h4>
                <p className="text-xs text-slate-500">
                  Transfer tepat sesuai nominal biaya pendaftaran jenjang {submittedApplicant.financial.levelName}.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500">Bank Tujuan:</span>
                <div className="font-extrabold text-slate-900 text-sm mt-0.5">{SCHOOL_INFO.bankAccount.bank}</div>
                <span className="text-slate-500 mt-2 block">Atas Nama Rekening:</span>
                <div className="font-bold text-slate-800">{SCHOOL_INFO.bankAccount.accountName}</div>
              </div>

              <div>
                <span className="text-slate-500">Nomor Rekening:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-black text-emerald-900 tracking-wide">
                    {SCHOOL_INFO.bankAccount.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(SCHOOL_INFO.bankAccount.accountNumber, 'bank')}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-md hover:bg-slate-200 transition-colors"
                    title="Salin No. Rekening"
                  >
                    {copiedBank ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-slate-500 mt-2 block">Nominal Transfer Formulir:</span>
                <div className="font-extrabold text-base text-rose-700">
                  {formatRupiah(submittedApplicant.financial.registrationFee)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={`https://wa.me/62${SCHOOL_INFO.whatsapp.replace(/\D/g, '').replace(/^0/, '')}?text=Halo%20Panitia%20PPDB%20SIT%20At%20Taufiq,%20saya%20sudah%20mendaftar%20dengan%20Nomor:%20${submittedApplicant.id}%20atas%20nama%20${encodeURIComponent(submittedApplicant.student.fullName)}.%20Berikut%20bukti%20transfernya.`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <span>Konfirmasi Bukti Transfer via WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Bukti Pendaftaran</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewStatus(submittedApplicant.id)}
                  className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2"
                >
                  <span>Lihat Status Berkas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
