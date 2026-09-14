import { EducationLevel, LevelFeeStructure, WaveType, WaveInfo, Applicant, FinancialBreakdown, AdminSettings } from '../types';

export const SCHOOL_INFO = {
  name: 'Sekolah Islam Terpadu At Taufiq',
  shortName: 'SIT At Taufiq Bogor',
  foundation: 'Yayasan Al Irsyad Al Islamiyyah Kota Bogor / Badan Pengelola Islamic Centre At Taufiq',
  tagline: 'Mencetak Generasi Islami',
  academicYear: '2027/2028',
  address: 'Jl. Cimanggu Permai I No. 1, Kedung Jaya, Tanah Sareal, Kota Bogor, Jawa Barat 16164',
  phone: '(0251) 8332145',
  whatsapp: '0812-8888-2728',
  email: 'info@sit-attaufiq-bogor.sch.id',
  bankAccount: {
    bank: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7192837461',
    accountName: 'PPDB SIT AT TAUFIQ BOGOR',
  }
};

export const WAVE_DETAILS: Record<WaveType, WaveInfo> = {
  OPEN_HOUSE: {
    id: 'OPEN_HOUSE',
    title: 'Open House',
    period: '19 September 2026',
    discountPercent: 60, // up to 60% (TKIT 60%, SD/SMP 40%)
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  GELOMBANG_1: {
    id: 'GELOMBANG_1',
    title: 'Gelombang 1',
    period: '28 September - 10 Oktober 2026',
    discountPercent: 50, // TK 50%, SD/SMP 30%
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  GELOMBANG_2: {
    id: 'GELOMBANG_2',
    title: 'Gelombang 2',
    period: '11 - 31 Oktober 2026',
    discountPercent: 40, // TK 40%, SD/SMP 20%
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  REGULER: {
    id: 'REGULER',
    title: 'Biaya PPDB Normal (Reguler)',
    period: 'Setelah 31 Oktober 2026',
    discountPercent: 0,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200'
  }
};

export const LEVEL_FEES: Record<EducationLevel, LevelFeeStructure> = {
  TKIT_A: {
    id: 'TKIT_A',
    name: 'TKIT (Kelas A)',
    fullTitle: 'Taman Kanak-Kanak Islam Terpadu - Kelas A',
    category: 'TKIT',
    classType: 'Kelas A',
    registrationFee: 590000,
    normal: {
      uangPangkal: 8000000,
      boks: 3000000,
      spp: 750000,
      seragam: 1200000,
      total: 12950000
    },
    waves: {
      OPEN_HOUSE: {
        discountPercent: 60,
        discountSavings: 4800000,
        uangPangkal: 3200000,
        boks: 3000000,
        spp: 750000,
        seragam: 1200000,
        total: 8150000
      },
      GELOMBANG_1: {
        discountPercent: 50,
        discountSavings: 4000000,
        uangPangkal: 4000000,
        boks: 3000000,
        spp: 750000,
        seragam: 1200000,
        total: 8950000
      },
      GELOMBANG_2: {
        discountPercent: 40,
        discountSavings: 3200000,
        uangPangkal: 4800000,
        boks: 3000000,
        spp: 750000,
        seragam: 1200000,
        total: 9750000
      },
      REGULER: {
        discountPercent: 0,
        discountSavings: 0,
        uangPangkal: 8000000,
        boks: 3000000,
        spp: 750000,
        seragam: 1200000,
        total: 12950000
      }
    },
    notes: 'BOKS TKIT Kelas A: Rp 3.000.000/tahun. SPP termasuk bulan Juli 2027.'
  },
  TKIT_B: {
    id: 'TKIT_B',
    name: 'TKIT (Kelas B)',
    fullTitle: 'Taman Kanak-Kanak Islam Terpadu - Kelas B',
    category: 'TKIT',
    classType: 'Kelas B',
    registrationFee: 590000,
    normal: {
      uangPangkal: 8000000,
      boks: 3500000,
      spp: 750000,
      seragam: 1200000,
      total: 13450000
    },
    waves: {
      OPEN_HOUSE: {
        discountPercent: 60,
        discountSavings: 4800000,
        uangPangkal: 3200000,
        boks: 3500000,
        spp: 750000,
        seragam: 1200000,
        total: 8650000
      },
      GELOMBANG_1: {
        discountPercent: 50,
        discountSavings: 4000000,
        uangPangkal: 4000000,
        boks: 3500000,
        spp: 750000,
        seragam: 1200000,
        total: 9450000
      },
      GELOMBANG_2: {
        discountPercent: 40,
        discountSavings: 3200000,
        uangPangkal: 4800000,
        boks: 3500000,
        spp: 750000,
        seragam: 1200000,
        total: 10250000
      },
      REGULER: {
        discountPercent: 0,
        discountSavings: 0,
        uangPangkal: 8000000,
        boks: 3500000,
        spp: 750000,
        seragam: 1200000,
        total: 13450000
      }
    },
    notes: 'Catatan Khusus Sesuai Brosur: BOKS TKIT (kelas B) adalah Rp 3.500.000/tahun.'
  },
  SDIT: {
    id: 'SDIT',
    name: 'SDIT At Taufiq',
    fullTitle: 'Sekolah Dasar Islam Terpadu',
    category: 'SDIT',
    registrationFee: 650000,
    normal: {
      uangPangkal: 15900000,
      boks: 3800000,
      spp: 1150000,
      seragam: 1400000,
      total: 22250000
    },
    waves: {
      OPEN_HOUSE: {
        discountPercent: 40,
        discountSavings: 6360000,
        uangPangkal: 9540000,
        boks: 3800000,
        spp: 1150000,
        seragam: 1400000,
        total: 15890000
      },
      GELOMBANG_1: {
        discountPercent: 30,
        discountSavings: 4770000,
        uangPangkal: 11130000,
        boks: 3800000,
        spp: 1150000,
        seragam: 1400000,
        total: 17480000
      },
      GELOMBANG_2: {
        discountPercent: 20,
        discountSavings: 3180000,
        uangPangkal: 12720000,
        boks: 3800000,
        spp: 1150000,
        seragam: 1400000,
        total: 19070000
      },
      REGULER: {
        discountPercent: 0,
        discountSavings: 0,
        uangPangkal: 15900000,
        boks: 3800000,
        spp: 1150000,
        seragam: 1400000,
        total: 22250000
      }
    },
    notes: 'BOKS SDIT: Rp 3.800.000/tahun. SPP Juli 2027: Rp 1.150.000.'
  },
  SMPIT: {
    id: 'SMPIT',
    name: 'SMPIT At Taufiq',
    fullTitle: 'Sekolah Menengah Pertama Islam Terpadu',
    category: 'SMPIT',
    registrationFee: 650000,
    normal: {
      uangPangkal: 15900000,
      boks: 3950000,
      spp: 1200000,
      seragam: 1500000,
      total: 22550000
    },
    waves: {
      OPEN_HOUSE: {
        discountPercent: 40,
        discountSavings: 6360000,
        uangPangkal: 9540000,
        boks: 3950000,
        spp: 1200000,
        seragam: 1500000,
        total: 16190000
      },
      GELOMBANG_1: {
        discountPercent: 30,
        discountSavings: 4770000,
        uangPangkal: 11130000,
        boks: 3950000,
        spp: 1200000,
        seragam: 1500000,
        total: 17780000
      },
      GELOMBANG_2: {
        discountPercent: 20,
        discountSavings: 3180000,
        uangPangkal: 12720000,
        boks: 3950000,
        spp: 1200000,
        seragam: 1500000,
        total: 19370000
      },
      REGULER: {
        discountPercent: 0,
        discountSavings: 0,
        uangPangkal: 15900000,
        boks: 3950000,
        spp: 1200000,
        seragam: 1500000,
        total: 22550000
      }
    },
    notes: 'BOKS SMPIT: Rp 3.950.000/tahun. SPP Juli 2027: Rp 1.200.000.'
  }
};

export const ESTIMATED_ADDONS = {
  cateringMonthly: 450000,
  transportMonthly: 550000,
  bookPackage: {
    TKIT: 600000,
    SDIT: 1250000,
    SMPIT: 1450000
  }
};

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateSummary(
  level: EducationLevel,
  wave: WaveType,
  addons: { catering: boolean; transport: boolean; bookPackage: boolean }
): FinancialBreakdown {
  const levelData = LEVEL_FEES[level];
  const waveData = levelData.waves[wave];
  const originalUP = levelData.normal.uangPangkal;
  const discountSavings = originalUP - waveData.uangPangkal;

  let addonsTotal = 0;
  if (addons.catering) addonsTotal += ESTIMATED_ADDONS.cateringMonthly;
  if (addons.transport) addonsTotal += ESTIMATED_ADDONS.transportMonthly;
  if (addons.bookPackage) {
    addonsTotal += ESTIMATED_ADDONS.bookPackage[levelData.category];
  }

  const ppdbSubtotal = waveData.total;
  const grandTotal = ppdbSubtotal + levelData.registrationFee + addonsTotal;

  return {
    levelName: levelData.name,
    waveName: WAVE_DETAILS[wave].title,
    registrationFee: levelData.registrationFee,
    uangPangkalOriginal: originalUP,
    discountPercent: waveData.discountPercent,
    discountSavings: discountSavings,
    uangPangkalFinal: waveData.uangPangkal,
    boks: waveData.boks,
    spp: waveData.spp,
    seragam: waveData.seragam,
    ppdbSubtotal: ppdbSubtotal,
    addonsTotal: addonsTotal,
    grandTotal: grandTotal
  };
}

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'PPDB-2027-TK-001',
    registrationCode: 'ATF101',
    registeredAt: '2026-09-19 09:15',
    level: 'TKIT_A',
    wave: 'OPEN_HOUSE',
    student: {
      fullName: 'Muhammad Fatih Al-Farabi',
      gender: 'L',
      nik: '3271011504220001',
      birthPlace: 'Bogor',
      birthDate: '2022-04-15',
      religion: 'Islam',
      childOrder: 1,
      totalSiblings: 2,
      previousSchool: 'PAUD Melati Indah Bogor',
      address: 'Jl. Cimanggu Barata No. 24, Tanah Sareal, Kota Bogor',
      specialNotes: 'Sudah hafal surat-surat pendek juz 30 (An-Nas s.d Al-Ikhlas)'
    },
    parent: {
      fatherName: 'Ahmad Fauzi, S.T.',
      fatherJob: 'Karyawan Swasta (BUMN)',
      fatherPhone: '081234567890',
      motherName: 'Nadia Rahma, S.Pd.',
      motherJob: 'Guru / Tenaga Pendidik',
      motherPhone: '081398765432',
      email: 'fauzi.nadia@gmail.com',
      monthlyIncome: 'Rp 10.000.000 - Rp 15.000.000'
    },
    addons: {
      catering: true,
      transport: false,
      bookPackage: true
    },
    financial: calculateSummary('TKIT_A', 'OPEN_HOUSE', { catering: true, transport: false, bookPackage: true }),
    status: 'TERVERIFIKASI',
    paymentStatus: 'SUDAH_BAYAR',
    observationDate: 'Sabtu, 26 September 2026 (08.30 WIB)',
    observationLocation: 'Gedung TKIT At Taufiq Lantai 1',
    adminNotes: 'Bukti transfer pendaftaran valid via BSI. Berkas KK dan Akte lengkap.'
  },
  {
    id: 'PPDB-2027-SD-012',
    registrationCode: 'ATF112',
    registeredAt: '2026-09-28 14:30',
    level: 'SDIT',
    wave: 'GELOMBANG_1',
    student: {
      fullName: 'Aisyah Putri Azzahra',
      gender: 'P',
      nik: '3271025508190003',
      nisn: '3198765432',
      birthPlace: 'Jakarta',
      birthDate: '2020-08-15',
      religion: 'Islam',
      childOrder: 2,
      totalSiblings: 3,
      previousSchool: 'TKIT At Taufiq Bogor',
      address: 'Cluster Taman Yasmin Sektor 6 No. 12, Bogor Barat',
      specialNotes: 'Alumni TKIT At Taufiq, hobi menggambar dan tahsin quran'
    },
    parent: {
      fatherName: 'dr. Hendra Setiawan, Sp.A',
      fatherJob: 'Dokter Spesialis',
      fatherPhone: '08119876543',
      motherName: 'drg. Maya Anggraini',
      motherJob: 'Dokter Gigi',
      motherPhone: '081287654321',
      email: 'hendra.setiawan@yahoo.com',
      monthlyIncome: '> Rp 20.000.000'
    },
    addons: {
      catering: true,
      transport: true,
      bookPackage: true
    },
    financial: calculateSummary('SDIT', 'GELOMBANG_1', { catering: true, transport: true, bookPackage: true }),
    status: 'JADWAL_OBSERVASI',
    paymentStatus: 'SUDAH_BAYAR',
    observationDate: 'Sabtu, 03 Oktober 2026 (09.00 WIB)',
    observationLocation: 'Ruang Aula SDIT Lantai 2',
    adminNotes: 'Siswa pindahan TKIT At Taufiq. Jadwal observasi kesiapan belajar SD.'
  },
  {
    id: 'PPDB-2027-SMP-005',
    registrationCode: 'ATF205',
    registeredAt: '2026-10-02 10:20',
    level: 'SMPIT',
    wave: 'GELOMBANG_1',
    student: {
      fullName: 'Rayhan Dzaki Pratama',
      gender: 'L',
      nik: '3271031201140002',
      nisn: '3141592653',
      birthPlace: 'Bogor',
      birthDate: '2014-01-12',
      religion: 'Islam',
      childOrder: 1,
      totalSiblings: 1,
      previousSchool: 'SDIT Insan Mandiri Bogor',
      address: 'Perumahan Bukit Cimanggu City Blok H3 No. 5, Bogor',
      specialNotes: 'Hafalan Al-Quran 3 Juz (Juz 30, 29, 28). Juara 2 Lomba Sains Nasional.'
    },
    parent: {
      fatherName: 'Bambang Irawan, M.Si.',
      fatherJob: 'Dosen / Peneliti',
      fatherPhone: '08151234567',
      motherName: 'Dewi Lestari, S.Farm.',
      motherJob: 'Apoteker',
      motherPhone: '08169876543',
      email: 'bambang.irawan@ipb.ac.id',
      monthlyIncome: 'Rp 15.000.000 - Rp 20.000.000'
    },
    addons: {
      catering: true,
      transport: false,
      bookPackage: true
    },
    financial: calculateSummary('SMPIT', 'GELOMBANG_1', { catering: true, transport: false, bookPackage: true }),
    status: 'LULUS',
    paymentStatus: 'SUDAH_BAYAR',
    observationDate: 'Selesai Observasi (Nilai A+)',
    observationLocation: 'Gedung SMPIT At Taufiq',
    adminNotes: 'Lulus seleksi jalur Tahfidz dan Akademik. Nilai wawancara orang tua sangat baik.'
  },
  {
    id: 'PPDB-2027-TK-008',
    registrationCode: 'ATF108',
    registeredAt: '2026-10-12 16:45',
    level: 'TKIT_B',
    wave: 'GELOMBANG_2',
    student: {
      fullName: 'Khansa Maryam Shalihah',
      gender: 'P',
      nik: '3271016209210004',
      birthPlace: 'Depok',
      birthDate: '2021-09-22',
      religion: 'Islam',
      childOrder: 2,
      totalSiblings: 2,
      previousSchool: 'KB Aisyiyah Depok',
      address: 'Jl. Pemuda No. 45, Kedung Badak, Tanah Sareal, Kota Bogor',
      specialNotes: 'Masuk langsung TKIT Kelas B. Anak aktif dan mandiri.'
    },
    parent: {
      fatherName: 'Rizky Kurniawan, S.E.',
      fatherJob: 'Wiraswasta / Entrepreneur',
      fatherPhone: '082122334455',
      motherName: 'Siti Nurhaliza, S.E.',
      motherJob: 'Ibu Rumah Tangga',
      motherPhone: '082155667788',
      email: 'rizky.kurniawan@gmail.com',
      monthlyIncome: 'Rp 10.000.000 - Rp 15.000.000'
    },
    addons: {
      catering: false,
      transport: false,
      bookPackage: true
    },
    financial: calculateSummary('TKIT_B', 'GELOMBANG_2', { catering: false, transport: false, bookPackage: true }),
    status: 'MENUNGGU_VERIFIKASI',
    paymentStatus: 'BELUM_BAYAR',
    adminNotes: 'Menunggu konfirmasi bukti bayar pendaftaran Rp 590.000.'
  }
];

const STORAGE_KEY = 'ppdb_sit_attaufiq_applicants_v1';

export function getStoredApplicants(): Applicant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICANTS));
      return INITIAL_APPLICANTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_APPLICANTS;
  }
}

export function saveStoredApplicants(applicants: Applicant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applicants));
  } catch (err) {
    console.error('Failed to save applicants', err);
  }
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  academicYear: SCHOOL_INFO.academicYear,
  whatsapp: SCHOOL_INFO.whatsapp,
  email: SCHOOL_INFO.email,
  phone: SCHOOL_INFO.phone,
  address: SCHOOL_INFO.address,
  bankName: SCHOOL_INFO.bankAccount.bank,
  bankAccountNumber: SCHOOL_INFO.bankAccount.accountNumber,
  bankAccountName: SCHOOL_INFO.bankAccount.accountName,
  activeWave: 'OPEN_HOUSE',
  isOpen: true,
  quotas: {
    TKIT_A: 40,
    TKIT_B: 40,
    SDIT: 120,
    SMPIT: 96
  },
  adminPin: '123456',
  requirePinToAccess: false,
  announcementText: 'Pendaftaran PPDB SIT At Taufiq Tahun Ajaran 2027/2028 Resmi Dibuka! Dapatkan diskon uang pangkal s/d 60% pada periode Open House.'
};

const SETTINGS_STORAGE_KEY = 'ppdb_sit_attaufiq_settings_v1';

export function getStoredAdminSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_SETTINGS));
      return DEFAULT_ADMIN_SETTINGS;
    }
    return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export function saveStoredAdminSettings(settings: AdminSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save admin settings', err);
  }
}

