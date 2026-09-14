import React, { useState } from 'react';
import { Applicant, ApplicantStatus, EducationLevel, WaveType, AdminSettings } from '../types';
import { formatRupiah, saveStoredApplicants, INITIAL_APPLICANTS, getStoredAdminSettings, saveStoredAdminSettings } from '../data/ppdbData';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Download, 
  Filter, 
  Search, 
  Edit3, 
  Eye, 
  Calendar, 
  RotateCcw, 
  Printer, 
  CreditCard,
  Award,
  ChevronDown,
  FileSpreadsheet,
  ExternalLink,
  Sliders,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { GoogleSheetsModal } from './GoogleSheetsModal';
import { AdminCharts } from './AdminCharts';
import { AdminSettingsModal } from './AdminSettingsModal';

interface AdminPortalProps {
  applicants: Applicant[];
  onUpdateApplicants: (updated: Applicant[]) => void;
  onViewApplicantStatus: (id: string) => void;
  onOpenGoogleSheets?: () => void;
  settings?: AdminSettings;
  onSaveSettings?: (newSettings: AdminSettings) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  applicants,
  onUpdateApplicants,
  onViewApplicantStatus,
  settings: propSettings,
  onSaveSettings: propOnSaveSettings
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);

  // Settings State
  const [currentSettings, setCurrentSettings] = useState<AdminSettings>(
    propSettings || getStoredAdminSettings()
  );
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync propSettings if passed
  React.useEffect(() => {
    if (propSettings) {
      setCurrentSettings(propSettings);
    }
  }, [propSettings]);

  // PIN security gate state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    const s = propSettings || getStoredAdminSettings();
    return !s.requirePinToAccess;
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === currentSettings.adminPin) {
      setIsUnlocked(true);
      setPinError(null);
      setPinInput('');
    } else {
      setPinError('PIN salah! Silakan coba lagi atau gunakan PIN standar: 123456');
    }
  };

  const handleSaveSettingsInternal = (newSettings: AdminSettings) => {
    setCurrentSettings(newSettings);
    saveStoredAdminSettings(newSettings);
    if (propOnSaveSettings) {
      propOnSaveSettings(newSettings);
    }
    // If PIN requirement was disabled, unlock automatically
    if (!newSettings.requirePinToAccess) {
      setIsUnlocked(true);
    }
  };

  // Google Sheets state
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
  const [activeSheetTitle, setActiveSheetTitle] = useState<string | null>(null);
  const [activeSheetUrl, setActiveSheetUrl] = useState<string | null>(null);

  // Edit form state
  const [newStatus, setNewStatus] = useState<ApplicantStatus>('MENUNGGU_VERIFIKASI');
  const [newPaymentStatus, setNewPaymentStatus] = useState<'BELUM_BAYAR' | 'SUDAH_BAYAR'>('BELUM_BAYAR');
  const [newObservationDate, setNewObservationDate] = useState('');
  const [newObservationLoc, setNewObservationLoc] = useState('');
  const [newAdminNotes, setNewAdminNotes] = useState('');

  // KPIs
  const totalCount = applicants.length;
  const verifiedCount = applicants.filter(a => a.status === 'TERVERIFIKASI' || a.status === 'JADWAL_OBSERVASI' || a.status === 'LULUS').length;
  const pendingCount = applicants.filter(a => a.status === 'MENUNGGU_VERIFIKASI').length;
  const lulusCount = applicants.filter(a => a.status === 'LULUS').length;
  const totalEstimatedRevenue = applicants.reduce((acc, a) => acc + a.financial.ppdbSubtotal, 0);

  // Filtering
  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch = 
      a.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.student.nik.includes(searchTerm) ||
      a.parent.fatherPhone.includes(searchTerm) ||
      a.parent.motherPhone.includes(searchTerm);

    const matchesLevel = 
      levelFilter === 'ALL' || 
      (levelFilter === 'TKIT' && a.level.startsWith('TKIT')) ||
      a.level === levelFilter;

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const openEditModal = (app: Applicant) => {
    setEditingApplicant(app);
    setNewStatus(app.status);
    setNewPaymentStatus(app.paymentStatus);
    setNewObservationDate(app.observationDate || '');
    setNewObservationLoc(app.observationLocation || '');
    setNewAdminNotes(app.adminNotes || '');
  };

  const handleSaveEdit = () => {
    if (!editingApplicant) return;

    const updated = applicants.map((a) => {
      if (a.id === editingApplicant.id) {
        return {
          ...a,
          status: newStatus,
          paymentStatus: newPaymentStatus,
          observationDate: newObservationDate,
          observationLocation: newObservationLoc,
          adminNotes: newAdminNotes
        };
      }
      return a;
    });

    onUpdateApplicants(updated);
    saveStoredApplicants(updated);
    setEditingApplicant(null);
  };

  const handleResetData = () => {
    if (window.confirm('Reset data pendaftaran kembali ke data awal pengujian?')) {
      onUpdateApplicants(INITIAL_APPLICANTS);
      saveStoredApplicants(INITIAL_APPLICANTS);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'No Registrasi',
      'Tanggal Daftar',
      'Jenjang',
      'Gelombang',
      'Nama Siswa',
      'Jenis Kelamin',
      'NIK',
      'Asal Sekolah',
      'Nama Ayah',
      'No WA Ayah',
      'Nama Ibu',
      'No WA Ibu',
      'Biaya Pendaftaran',
      'Total PPDB',
      'Status Pembayaran Formulir',
      'Status PPDB',
      'Jadwal Observasi',
      'Catatan Panitia'
    ];

    const rows = applicants.map((a) => [
      `"${a.id}"`,
      `"${a.registeredAt}"`,
      `"${a.financial.levelName}"`,
      `"${a.financial.waveName}"`,
      `"${a.student.fullName}"`,
      `"${a.student.gender === 'L' ? 'Ikhwan' : 'Akhwat'}"`,
      `"${a.student.nik}"`,
      `"${a.student.previousSchool || '-'}"`,
      `"${a.parent.fatherName || '-'}"`,
      `"${a.parent.fatherPhone || '-'}"`,
      `"${a.parent.motherName || '-'}"`,
      `"${a.parent.motherPhone || '-'}"`,
      `"${a.financial.registrationFee}"`,
      `"${a.financial.ppdbSubtotal}"`,
      `"${a.paymentStatus}"`,
      `"${a.status}"`,
      `"${a.observationDate || '-'}"`,
      `"${(a.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PPDB_AtTaufiq_Data_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If PIN protection is enabled and not unlocked yet
  if (currentSettings.requirePinToAccess && !isUnlocked) {
    return (
      <section className="py-16 px-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
            <Lock className="w-7 h-7 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Akses Portal Panitia Terkunci
            </h2>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              Portal ini dilindungi PIN keamanan panitia PPDB SIT At Taufiq. Silakan masukkan PIN untuk melanjutkan verifikasi data pendaftar.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            {pinError && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kode PIN Panitia
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  autoFocus
                  maxLength={10}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Masukkan 6 angka PIN..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono font-bold text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Buka Akses Panitia</span>
            </button>
          </form>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-500">
            Lupa PIN? PIN awal panitia adalah: <strong className="text-slate-800 font-mono">123456</strong>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Portal Panitia PPDB SIT At Taufiq
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
              TP {currentSettings.academicYear}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data pendaftar, verifikasi pembayaran, jadwalkan observasi & seleksi calon siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Pengaturan Portal Panitia"
          >
            <Sliders className="w-4 h-4 text-emerald-700" />
            <span>Pengaturan</span>
          </button>

          {/* Google Sheets Sync & Export Button */}
          <button
            onClick={() => setIsSheetsModalOpen(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer border border-emerald-700"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>Google Sheets</span>
            {activeSheetId && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse ml-0.5"></span>
            )}
          </button>

          <button
            onClick={exportToCSV}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handleResetData}
            title="Kembalikan contoh pendaftar"
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {currentSettings.requirePinToAccess && (
            <button
              onClick={() => setIsUnlocked(false)}
              title="Kunci Portal Panitia Sekarang"
              className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 p-2 rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Connected Google Sheet Status Banner if active */}
      {activeSheetId && activeSheetUrl && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Terhubung ke Google Sheets:</span>
            <span className="font-semibold text-emerald-800 underline decoration-emerald-400">
              {activeSheetTitle || 'PPDB SIT At Taufiq Data Pendaftar'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={activeSheetUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white hover:bg-emerald-100/70 text-emerald-800 font-bold px-3 py-1 rounded-lg border border-emerald-300 flex items-center gap-1 text-[11px] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Buka di Google Sheets</span>
            </a>
            <button
              onClick={() => setIsSheetsModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] underline cursor-pointer"
            >
              Kelola Sinkronisasi
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pendaftar</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Calon Siswa Masuk</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Menunggu Verifikasi</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Perlu cek bukti bayar</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Terverifikasi / Jadwal</div>
          <div className="text-2xl font-black text-sky-600 mt-1">{verifiedCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Siap tahap observasi</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Dinyatakan Lulus</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{lulusCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Telah diterima resmi</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">Estimasi PPDB</div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-white">
            {formatRupiah(totalEstimatedRevenue)}
          </div>
          <div className="text-[10px] text-emerald-300 mt-0.5">Total komitmen pendaftar</div>
        </div>
      </div>

      {/* Visual Data Charts (Recharts) */}
      <AdminCharts applicants={applicants} />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex-1 w-full sm:w-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa, no registrasi, NIK, atau no WA orang tua..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800"
          >
            <option value="ALL">Semua Jenjang</option>
            <option value="TKIT">TKIT (A & B)</option>
            <option value="SDIT">SDIT At Taufiq</option>
            <option value="SMPIT">SMPIT At Taufiq</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800"
          >
            <option value="ALL">Semua Status</option>
            <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
            <option value="TERVERIFIKASI">Terverifikasi</option>
            <option value="JADWAL_OBSERVASI">Jadwal Observasi</option>
            <option value="LULUS">Lulus</option>
            <option value="DITOLAK">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">ID & Tgl Daftar</th>
                <th className="p-3.5">Calon Siswa</th>
                <th className="p-3.5">Jenjang & Gelombang</th>
                <th className="p-3.5">Orang Tua / Kontak</th>
                <th className="p-3.5">Formulir</th>
                <th className="p-3.5">Status Seleksi</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Tidak ada pendaftar yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* ID */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-extrabold text-emerald-900">{app.id}</div>
                      <div className="text-[10px] text-slate-500">{app.registeredAt}</div>
                    </td>

                    {/* Student */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-sm">{app.student.fullName}</div>
                      <div className="text-[11px] text-slate-500">
                        {app.student.gender === 'L' ? 'Ikhwan' : 'Akhwat'} • NIK: {app.student.nik}
                      </div>
                      {app.student.specialNotes && (
                        <div className="text-[10px] text-emerald-700 font-medium truncate max-w-xs">
                          {app.student.specialNotes}
                        </div>
                      )}
                    </td>

                    {/* Jenjang */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800 text-[11px]">
                        {app.financial.levelName}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {app.financial.waveName} (Diskon {app.financial.discountPercent}%)
                      </div>
                    </td>

                    {/* Parents */}
                    <td className="p-3.5 text-slate-700">
                      <div>Ayah: <span className="font-semibold">{app.parent.fatherName || '-'}</span></div>
                      <div className="text-[11px] text-slate-500">
                        WA: {app.parent.fatherPhone || app.parent.motherPhone || '-'}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      {app.paymentStatus === 'SUDAH_BAYAR' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Lunas
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[11px] font-bold">
                          <Clock className="w-3 h-3" />
                          Belum Bayar
                        </span>
                      )}
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {formatRupiah(app.financial.registrationFee)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 whitespace-nowrap">
                      {app.status === 'MENUNGGU_VERIFIKASI' && (
                        <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded">
                          Menunggu
                        </span>
                      )}
                      {app.status === 'TERVERIFIKASI' && (
                        <span className="bg-sky-100 text-sky-900 text-[11px] font-bold px-2 py-0.5 rounded">
                          Terverifikasi
                        </span>
                      )}
                      {app.status === 'JADWAL_OBSERVASI' && (
                        <span className="bg-purple-100 text-purple-900 text-[11px] font-bold px-2 py-0.5 rounded">
                          Jadwal Observasi
                        </span>
                      )}
                      {app.status === 'LULUS' && (
                        <span className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded">
                          Lulus Seleksi
                        </span>
                      )}
                      {app.status === 'DITOLAK' && (
                        <span className="bg-rose-100 text-rose-900 text-[11px] font-bold px-2 py-0.5 rounded">
                          Ditolak
                        </span>
                      )}
                      {app.observationDate && (
                        <div className="text-[10px] text-purple-700 font-medium mt-0.5 max-w-[150px] truncate">
                          {app.observationDate}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => openEditModal(app)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Kelola Berkas & Status"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onViewApplicantStatus(app.id)}
                        className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Lihat Tampilan Calon Siswa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editingApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Kelola Data Calon Siswa
                </h3>
                <p className="text-slate-500 text-xs">
                  {editingApplicant.id} — {editingApplicant.student.fullName} ({editingApplicant.financial.levelName})
                </p>
              </div>
              <button
                onClick={() => setEditingApplicant(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Payment Status */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status Pembayaran Biaya Formulir ({formatRupiah(editingApplicant.financial.registrationFee)})
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="BELUM_BAYAR">Belum Bayar (Menunggu Transfer)</option>
                  <option value="SUDAH_BAYAR">Sudah Bayar / Terverifikasi Lunas</option>
                </select>
              </div>

              {/* Progress Status */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Tahapan PPDB</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-900 bg-white font-semibold"
                >
                  <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi Bukti Bayar</option>
                  <option value="TERVERIFIKASI">Berkas Terverifikasi</option>
                  <option value="JADWAL_OBSERVASI">Jadwal Observasi & Wawancara Diterbitkan</option>
                  <option value="LULUS">Dinyatakan LULUS Seleksi</option>
                  <option value="DITOLAK">Tidak Lulus / Ditolak</option>
                </select>
              </div>

              {/* Observation Date */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jadwal Observasi Siswa & Wawancara Ortu
                </label>
                <input
                  type="text"
                  value={newObservationDate}
                  onChange={(e) => setNewObservationDate(e.target.value)}
                  placeholder="Contoh: Sabtu, 03 Oktober 2026 (09.00 - 11.00 WIB)"
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              {/* Observation Location */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi / Ruang Observasi</label>
                <input
                  type="text"
                  value={newObservationLoc}
                  onChange={(e) => setNewObservationLoc(e.target.value)}
                  placeholder="Contoh: Gedung SDIT Lantai 2 / Ruang Aula Utama"
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Panitia PPDB</label>
                <textarea
                  rows={3}
                  value={newAdminNotes}
                  onChange={(e) => setNewAdminNotes(e.target.value)}
                  placeholder="Catatan verifikasi berkas, hasil nilai tes hafalan Quran, atau catatan wawancara..."
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingApplicant(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2 rounded-xl shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Sheets Synchronization Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        applicants={applicants}
        activeSpreadsheetId={activeSheetId}
        onSetActiveSpreadsheet={(id, title, url) => {
          setActiveSheetId(id);
          setActiveSheetTitle(title || null);
          setActiveSheetUrl(url || null);
        }}
      />

      {/* Admin Settings Modal */}
      <AdminSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={currentSettings}
        onSaveSettings={handleSaveSettingsInternal}
        applicants={applicants}
      />
    </section>
  );
};
