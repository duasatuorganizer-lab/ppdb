import React, { useState } from 'react';
import { AdminSettings, EducationLevel, WaveType, Applicant } from '../types';
import { 
  X, 
  Save, 
  RotateCcw, 
  Sliders, 
  Building2, 
  CreditCard, 
  Layers, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Unlock,
  Users
} from 'lucide-react';
import { DEFAULT_ADMIN_SETTINGS } from '../data/ppdbData';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdminSettings;
  onSaveSettings: (newSettings: AdminSettings) => void;
  applicants: Applicant[];
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  applicants
}) => {
  const [activeTab, setActiveTab] = useState<'kontak' | 'rekening' | 'kuota' | 'keamanan'>('kontak');
  const [formData, setFormData] = useState<AdminSettings>({ ...settings });
  const [showSavedNotification, setShowSavedNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync formData if settings change when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({ ...settings });
      setShowSavedNotification(false);
      setErrorMessage(null);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.requirePinToAccess && (!formData.adminPin || formData.adminPin.trim().length < 4)) {
      setErrorMessage('PIN Admin minimal harus terdiri dari 4 karakter.');
      return;
    }

    setErrorMessage(null);
    onSaveSettings(formData);
    setShowSavedNotification(true);
    setTimeout(() => {
      setShowSavedNotification(false);
    }, 3000);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan seluruh pengaturan portal panitia ke pengaturan standar awal?')) {
      setFormData({ ...DEFAULT_ADMIN_SETTINGS });
      setErrorMessage(null);
    }
  };

  // Quota fulfillment calculation
  const getLevelCount = (lvl: EducationLevel) => applicants.filter(a => a.level === lvl).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-settings-title"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sliders className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 id="admin-settings-title" className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Pengaturan Portal Panitia PPDB
              </h3>
              <p className="text-emerald-200 text-xs">
                Konfigurasi kontak, rekening bank, kuota pendaftaran, & keamanan akses
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal pengaturan"
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('kontak')}
            className={`px-3.5 py-2.5 rounded-t-lg border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'kontak'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Kontak & Sekolah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rekening')}
            className={`px-3.5 py-2.5 rounded-t-lg border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'rekening'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Rekening Bank</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kuota')}
            className={`px-3.5 py-2.5 rounded-t-lg border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'kuota'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gelombang & Kuota</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('keamanan')}
            className={`px-3.5 py-2.5 rounded-t-lg border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'keamanan'
                ? 'bg-white border-emerald-600 text-emerald-800 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>PIN & Keamanan</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Saved Notification Banner */}
          {showSavedNotification && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pengaturan portal panitia berhasil disimpan dan diperbarui!</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: KONTAK & IDENTITAS SEKOLAH */}
          {activeTab === 'kontak' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tahun Ajaran PPDB
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      placeholder="Contoh: 2027/2028"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Ditampilkan pada navbar, formulir, dan kuitansi.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    No. WhatsApp Panitia (Hotline)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="Contoh: 0812-8888-2728"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Tujuan pesan bantuan klik-ke-WA bagi orang tua pendaftar.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Telepon Kantor Sekretariat
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Contoh: (0251) 8332145"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Resmi Panitia PPDB
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Contoh: info@sit-attaufiq-bogor.sch.id"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alamat Lengkap Kampus / Sekretariat
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teks Pengumuman Banner Berjalan (Ticker Bar)
                </label>
                <input
                  type="text"
                  value={formData.announcementText || ''}
                  onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                  placeholder="Pesan pengumuman penting di bagian paling atas aplikasi..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 2: REKENING PEMBAYARAN */}
          {activeTab === 'rekening' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                <p className="font-bold">Info Rekening Tujuan Transfer Pembayaran Formulir & PPDB:</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Informasi ini akan langsung dimuat pada bukti pendaftaran, modul pembayaran, dan panduan transfer untuk calon wali murid.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Bank Tujuan
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    placeholder="Contoh: 7192837461"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-sm tracking-wide"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Atas Nama Rekening
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccountName}
                    onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                    placeholder="Contoh: PPDB SIT AT TAUFIQ BOGOR"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium uppercase"
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-1.5 shadow-xs">
                <div className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                  Pratinjau Tampilan Rekening di Kartu Pendaftar:
                </div>
                <div className="text-sm font-bold">{formData.bankName || 'Bank Syariah Indonesia (BSI)'}</div>
                <div className="font-mono text-base font-black text-amber-400">
                  {formData.bankAccountNumber || '7192837461'}
                </div>
                <div className="text-xs text-slate-300">
                  a.n. <span className="font-semibold text-white">{formData.bankAccountName || 'PPDB SIT AT TAUFIQ BOGOR'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GELOMBANG & KUOTA */}
          {activeTab === 'kuota' && (
            <div className="space-y-4">
              {/* Registration Status Toggle */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    Status Portal Pendaftaran PPDB
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {formData.isOpen 
                      ? 'Pendaftaran sedang DIBUKA untuk umum' 
                      : 'Pendaftaran sedang DITUTUP sementara'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isOpen: !formData.isOpen })}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition-colors ${
                    formData.isOpen 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {formData.isOpen ? 'DIBUKA' : 'DITUTUP'}
                </button>
              </div>

              {/* Active Wave Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Gelombang Pendaftaran Aktif (Default Form)
                </label>
                <select
                  value={formData.activeWave}
                  onChange={(e) => setFormData({ ...formData, activeWave: e.target.value as WaveType })}
                  className="w-full p-2 rounded-lg border border-slate-300 text-slate-900 font-bold bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="OPEN_HOUSE">Open House (Diskon Uang Pangkal s/d 60%)</option>
                  <option value="GELOMBANG_1">Gelombang 1 (Diskon Uang Pangkal s/d 50%)</option>
                  <option value="GELOMBANG_2">Gelombang 2 (Diskon Uang Pangkal s/d 40%)</option>
                  <option value="REGULER">Reguler (Biaya PPDB Normal)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Menentukan periode gelombang bawaan saat orang tua pertama kali membuka kalkulator atau formulir pendaftaran.
                </p>
              </div>

              {/* Quotas Table */}
              <div>
                <div className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Target Kuota Daya Tampung Siswa:</span>
                  <span className="text-[11px] font-normal text-slate-500">Bandingkan daya tampung vs pendaftar masuk</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'TKIT_A' as EducationLevel, label: 'TKIT (Kelas A)', color: 'border-emerald-200' },
                    { id: 'TKIT_B' as EducationLevel, label: 'TKIT (Kelas B)', color: 'border-emerald-200' },
                    { id: 'SDIT' as EducationLevel, label: 'SDIT At Taufiq', color: 'border-sky-200' },
                    { id: 'SMPIT' as EducationLevel, label: 'SMPIT At Taufiq', color: 'border-indigo-200' }
                  ].map((unit) => {
                    const currentFilled = getLevelCount(unit.id);
                    const quota = formData.quotas[unit.id] || 40;
                    const percent = Math.min(100, Math.round((currentFilled / quota) * 100));

                    return (
                      <div key={unit.id} className={`bg-slate-50 p-3 rounded-xl border ${unit.color}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-slate-900">{unit.label}</span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            {currentFilled} / {quota} siswa ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                          <div 
                            className={`h-full ${percent >= 100 ? 'bg-rose-500' : 'bg-emerald-500'} transition-all`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-slate-600 font-medium">Ubah Kuota:</label>
                          <input
                            type="number"
                            min={1}
                            value={quota}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setFormData({
                                ...formData,
                                quotas: {
                                  ...formData.quotas,
                                  [unit.id]: val
                                }
                              });
                            }}
                            className="w-20 px-2 py-1 rounded border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                          />
                          <span className="text-[11px] text-slate-500">kursi</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KEAMANAN & PIN ADMIN */}
          {activeTab === 'keamanan' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <div className="font-bold text-amber-950">Proteksi Kunci Akses Portal Panitia</div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    Aktifkan gembok keamanan jika Anda ingin panitia wajib memasukkan PIN keamanan sebelum dapat melihat data pendaftar dan mengedit verifikasi siswa.
                  </div>
                </div>
              </div>

              {/* Toggle Protection */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    Wajibkan PIN untuk Akses Admin Portal
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {formData.requirePinToAccess
                      ? 'Gembok AKTIF: Diperlukan PIN untuk membuka menu panitia'
                      : 'Gembok NONAKTIF: Siapapun dapat langsung membuka portal panitia'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, requirePinToAccess: !formData.requirePinToAccess })}
                  className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs cursor-pointer transition-colors flex items-center gap-1.5 ${
                    formData.requirePinToAccess
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {formData.requirePinToAccess ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>AKTIF</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>NONAKTIF</span>
                    </>
                  )}
                </button>
              </div>

              {/* PIN Field */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kode PIN Akses Panitia
                </label>
                <div className="relative max-w-xs">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={10}
                    value={formData.adminPin}
                    onChange={(e) => setFormData({ ...formData, adminPin: e.target.value })}
                    placeholder="Contoh: 123456"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-mono font-bold tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Minimal 4 karakter (PIN bawaan awal: <strong>123456</strong>).
                </p>
              </div>
            </div>
          )}

          {/* Modal Actions Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan Default</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer text-xs"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded-xl font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
