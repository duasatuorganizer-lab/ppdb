import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Applicant } from '../types';
import { 
  googleSignIn, 
  logout, 
  getAccessToken, 
  initAuth 
} from '../services/googleAuth';
import { 
  createPPDBSpreadsheet, 
  syncToExistingSpreadsheet, 
  listUserSpreadsheets, 
  readSpreadsheetRows,
  GoogleDriveFile,
  SheetExportResult 
} from '../services/googleSheets';
import { SCHOOL_INFO } from '../data/ppdbData';
import { 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  FileSpreadsheet, 
  FolderPlus, 
  History, 
  Table, 
  Lock, 
  Sparkles,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Applicant[];
  activeSpreadsheetId?: string | null;
  onSetActiveSpreadsheet?: (id: string | null, title?: string, url?: string) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  applicants,
  activeSpreadsheetId,
  onSetActiveSpreadsheet
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tab mode in Google Sheets Manager
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'existing' | 'preview'>('create');

  // Create new sheet state
  const defaultTitle = `PPDB ${SCHOOL_INFO.shortName} TP ${SCHOOL_INFO.academicYear} - Rekap Data Calon Siswa`;
  const [sheetTitle, setSheetTitle] = useState(defaultTitle);
  const [exporting, setExporting] = useState(false);
  const [lastExportResult, setLastExportResult] = useState<SheetExportResult | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Existing sheets state
  const [recentSheets, setRecentSheets] = useState<GoogleDriveFile[]>([]);
  const [loadingSheets, setLoadingSheets] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState<string>(activeSpreadsheetId || '');
  const [customSheetIdInput, setCustomSheetIdInput] = useState('');
  const [syncMode, setSyncMode] = useState<'REPLACE' | 'APPEND'>('REPLACE');

  // Confirmation dialog state (MANDATORY per Workspace Skill)
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  // Live preview state
  const [previewData, setPreviewData] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Check auth on load
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (user, t) => {
        setCurrentUser(user);
        setToken(t);
      },
      () => {
        // Not authenticated in memory
        setCurrentUser(null);
        setToken(null);
      }
    );

    // If we have token cached already
    getAccessToken().then(t => {
      if (t) setToken(t);
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  // Load recent spreadsheets when authenticated & on existing tab
  useEffect(() => {
    if (token && activeSubTab === 'existing') {
      fetchRecentSheets();
    }
  }, [token, activeSubTab]);

  const handleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setToken(res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setAuthError(err?.message || 'Gagal login dengan Google. Pastikan pop-up diizinkan.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setToken(null);
      setRecentSheets([]);
      setPreviewData(null);
      setLastExportResult(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const fetchRecentSheets = async () => {
    if (!token) return;
    setLoadingSheets(true);
    try {
      const files = await listUserSpreadsheets(token);
      setRecentSheets(files);
      if (files.length > 0 && !selectedSheetId) {
        setSelectedSheetId(files[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching sheets:', err);
    } finally {
      setLoadingSheets(false);
    }
  };

  // 1. Create New Spreadsheet with Confirmation
  const triggerCreateSpreadsheet = () => {
    if (!token) return;
    setConfirmDialog({
      show: true,
      title: 'Konfirmasi Buat Google Spreadsheet Baru',
      message: `Aplikasi akan membuat spreadsheet baru berjudul "${sheetTitle}" di Google Drive Anda dan mengekspor ${applicants.length} data pendaftar PPDB. Lanjutkan?`,
      confirmText: 'Ya, Buat Spreadsheet',
      onConfirm: async () => {
        setConfirmDialog(null);
        setExporting(true);
        setExportError(null);
        try {
          const result = await createPPDBSpreadsheet(token, sheetTitle, applicants);
          setLastExportResult(result);
          if (onSetActiveSpreadsheet) {
            onSetActiveSpreadsheet(result.spreadsheetId, sheetTitle, result.spreadsheetUrl);
          }
        } catch (err: any) {
          setExportError(err?.message || 'Terjadi kesalahan saat mengekspor ke Google Sheets.');
        } finally {
          setExporting(false);
        }
      }
    });
  };

  // 2. Sync to Existing Spreadsheet with Confirmation
  const triggerSyncExisting = () => {
    const targetId = customSheetIdInput.trim() || selectedSheetId;
    if (!targetId || !token) {
      setExportError('Pilih spreadsheet atau masukkan Spreadsheet ID.');
      return;
    }

    const actionDesc = syncMode === 'REPLACE' 
      ? `menimpa (mengganti seluruh isi)` 
      : `menambahkan ${applicants.length} baris data baru`;

    setConfirmDialog({
      show: true,
      title: 'Konfirmasi Perubahan Google Spreadsheet',
      message: `Aplikasi akan ${actionDesc} pada spreadsheet terpilih (${targetId}). Tindakan ini akan memperbarui data di akun Google Anda. Apakah Anda yakin?`,
      confirmText: 'Ya, Perbarui Spreadsheet',
      onConfirm: async () => {
        setConfirmDialog(null);
        setExporting(true);
        setExportError(null);
        try {
          const result = await syncToExistingSpreadsheet(token, targetId, applicants, syncMode);
          setLastExportResult(result);
          if (onSetActiveSpreadsheet) {
            onSetActiveSpreadsheet(result.spreadsheetId, 'Spreadsheet Terhubung', result.spreadsheetUrl);
          }
        } catch (err: any) {
          setExportError(err?.message || 'Gagal memperbarui Spreadsheet.');
        } finally {
          setExporting(false);
        }
      }
    });
  };

  // 3. Load Preview Data
  const handleLoadPreview = async (spreadsheetIdToPreview?: string) => {
    const targetId = spreadsheetIdToPreview || lastExportResult?.spreadsheetId || activeSpreadsheetId || customSheetIdInput.trim() || selectedSheetId;
    if (!targetId || !token) return;

    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const data = await readSpreadsheetRows(token, targetId);
      setPreviewData(data);
    } catch (err: any) {
      setPreviewError(err?.message || 'Gagal memuat pratinjau data spreadsheet.');
    } finally {
      setPreviewLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-8 relative max-h-[92vh] flex flex-col text-xs">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Integrasi Google Sheets PPDB
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Workspace
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Sinkronkan & ekspor data calon siswa langsung ke akun Google Spreadsheet Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* User Auth Status Banner */}
        {!currentUser || !token ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-xs border border-slate-200">
              <Lock className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Hubungkan Akun Google Anda</h4>
              <p className="text-slate-600 text-xs mt-1 max-w-md mx-auto">
                Masuk dengan akun Google untuk mengizinkan aplikasi membuat dan memperbarui spreadsheet rekap PPDB secara otomatis di Google Drive Anda.
              </p>
            </div>

            {/* Official Google Sign-In Button per SKILL.md */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={authLoading}
                className="inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-medium px-5 py-2.5 rounded-lg border border-slate-300 shadow-xs text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span>{authLoading ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>
            </div>

            {authError && (
              <div className="text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-xs flex items-center justify-center gap-2 mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{authError}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Google User'}
                  className="w-8 h-8 rounded-full border border-emerald-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
                  {currentUser.displayName?.charAt(0) || 'G'}
                </div>
              )}
              <div>
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span>{currentUser.displayName || 'Akun Google Terhubung'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-600">{currentUser.email}</div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="text-slate-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        )}

        {/* Action Tabs for Authenticated Users */}
        {currentUser && token && (
          <div className="flex-1 flex flex-col min-h-0 space-y-4">
            {/* Sub-tab Navigation */}
            <div className="flex border-b border-slate-200 gap-1">
              <button
                onClick={() => setActiveSubTab('create')}
                className={`px-3 py-2 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeSubTab === 'create'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Buat Spreadsheet Baru</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('existing');
                  fetchRecentSheets();
                }}
                className={`px-3 py-2 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeSubTab === 'existing'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Spreadsheet di Drive</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubTab('preview');
                  handleLoadPreview();
                }}
                className={`px-3 py-2 font-bold text-xs border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeSubTab === 'preview'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Pratinjau Live Data</span>
              </button>
            </div>

            {/* Error Message if Any */}
            {exportError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{exportError}</span>
              </div>
            )}

            {/* TAB 1: CREATE NEW SPREADSHEET */}
            {activeSubTab === 'create' && (
              <div className="space-y-4 py-1">
                <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Ekspor Lengkap Seluruh Data Pendaftar</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-1">
                    Spreadsheet akan otomatis dibuat dengan <strong>30 kolom data resmi</strong> (Biodata, NIK, NISN, Orang Tua, Skema Pembiayaan, Status Bayar & Seleksi, serta Ruang Observasi) dan baris judul berwarna hijau emerald khas SIT At Taufiq.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Judul Google Spreadsheet:
                  </label>
                  <input
                    type="text"
                    value={sheetTitle}
                    onChange={(e) => setSheetTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Contoh: PPDB SIT At Taufiq 2027/2028 - Rekap Pendaftar"
                  />
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>Jumlah data yang akan diekspor: <strong>{applicants.length} Calon Siswa</strong></span>
                    <span>Lokasi: Google Drive ({currentUser.email})</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={triggerCreateSpreadsheet}
                    disabled={exporting}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {exporting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Membuat Spreadsheet...</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Buat & Ekspor ke Google Sheets</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Success Banner if exported */}
                {lastExportResult && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Berhasil Dibuat di Google Drive!</span>
                    </div>
                    <p className="text-xs text-emerald-800">
                      Sebanyak <strong>{lastExportResult.rowCount} baris calon siswa</strong> telah berhasil diekspor ke Google Spreadsheet Anda.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href={lastExportResult.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Spreadsheet di Google Sheets</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubTab('preview');
                          handleLoadPreview(lastExportResult.spreadsheetId);
                        }}
                        className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3.5 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Table className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Lihat Pratinjau</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: EXISTING SPREADSHEETS */}
            {activeSubTab === 'existing' && (
              <div className="space-y-4 py-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 text-xs">
                    Pilih Spreadsheet dari Google Drive Anda:
                  </span>
                  <button
                    onClick={fetchRecentSheets}
                    disabled={loadingSheets}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingSheets ? 'animate-spin' : ''}`} />
                    <span>Muat Ulang Drive</span>
                  </button>
                </div>

                {loadingSheets ? (
                  <div className="py-6 text-center text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Mencari spreadsheet di Google Drive...</span>
                  </div>
                ) : recentSheets.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50">
                    {recentSheets.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => {
                          setSelectedSheetId(file.id);
                          setCustomSheetIdInput('');
                        }}
                        className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                          selectedSheetId === file.id && !customSheetIdInput
                            ? 'bg-emerald-100/80 border-emerald-500 font-bold text-emerald-950 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('id-ID') : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 text-xs">
                    Belum ditemukan spreadsheet di Google Drive, atau Anda dapat memasukkan Spreadsheet ID secara manual di bawah.
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Atau Masukkan Spreadsheet ID / URL:
                  </label>
                  <input
                    type="text"
                    value={customSheetIdInput}
                    onChange={(e) => setCustomSheetIdInput(e.target.value)}
                    placeholder="Contoh: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode Sinkronisasi:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSyncMode('REPLACE')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        syncMode === 'REPLACE'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <div className="text-xs">Timpa Seluruh Data (Overwrite)</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Perbarui semua baris dengan data pendaftar terkini
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSyncMode('APPEND')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        syncMode === 'APPEND'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <div className="text-xs">Tambahkan Baris Baru (Append)</div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Tambahkan data pendaftar di baris terbawah
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={triggerSyncExisting}
                    disabled={exporting || (!selectedSheetId && !customSheetIdInput.trim())}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {exporting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menyinkronkan...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Sinkronkan ke Spreadsheet Terpilih</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: LIVE PREVIEW */}
            {activeSubTab === 'preview' && (
              <div className="space-y-3 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 text-xs">
                    Pratinjau Data Langsung dari Google Spreadsheet:
                  </span>
                  <button
                    onClick={() => handleLoadPreview()}
                    disabled={previewLoading}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${previewLoading ? 'animate-spin' : ''}`} />
                    <span>Muat Ulang Tabel</span>
                  </button>
                </div>

                {previewError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{previewError}</span>
                  </div>
                )}

                {previewLoading ? (
                  <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
                    <span>Mengambil baris dari Google Sheets API...</span>
                  </div>
                ) : previewData && previewData.headers.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs flex-1 max-h-60 overflow-x-auto overflow-y-auto bg-white text-[11px]">
                    <table className="min-w-full text-left">
                      <thead className="bg-emerald-800 text-white font-bold sticky top-0">
                        <tr>
                          {previewData.headers.map((h, i) => (
                            <th key={i} className="p-2.5 whitespace-nowrap border-r border-emerald-700">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {previewData.rows.map((row, rIndex) => (
                          <tr key={rIndex} className="hover:bg-slate-50">
                            {previewData.headers.map((_, cIndex) => (
                              <td key={cIndex} className="p-2 whitespace-nowrap border-r border-slate-100">
                                {row[cIndex] ?? '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                    Belum ada data untuk ditampilkan. Silakan buat atau sinkronkan spreadsheet terlebih dahulu.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal (MANDATORY per Workspace Skill) */}
        {confirmDialog && confirmDialog.show && (
          <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{confirmDialog.title}</h4>
                  <div className="text-[11px] text-slate-500">Konfirmasi Izin Akses Google Sheets</div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {confirmDialog.message}
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmDialog.onConfirm}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {confirmDialog.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Google Drive & Sheets API V4</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 font-bold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
