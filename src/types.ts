export type EducationLevel = 'TKIT_A' | 'TKIT_B' | 'SDIT' | 'SMPIT';

export type WaveType = 'OPEN_HOUSE' | 'GELOMBANG_1' | 'GELOMBANG_2' | 'REGULER';

export type ApplicantStatus = 
  | 'MENUNGGU_VERIFIKASI' 
  | 'TERVERIFIKASI' 
  | 'JADWAL_OBSERVASI' 
  | 'LULUS' 
  | 'DITOLAK';

export interface FeeItem {
  uangPangkal: number;
  boks: number;
  spp: number;
  seragam: number;
  total: number;
}

export interface WaveInfo {
  id: WaveType;
  title: string;
  period: string;
  discountPercent: number; // e.g. 60, 50, 40, 30, 20, 0
  badgeColor: string;
}

export interface LevelFeeStructure {
  id: EducationLevel;
  name: string;
  fullTitle: string;
  category: 'TKIT' | 'SDIT' | 'SMPIT';
  classType?: string; // e.g. "Kelas A" or "Kelas B"
  registrationFee: number;
  normal: FeeItem;
  waves: Record<WaveType, FeeItem & { discountPercent: number; discountSavings: number }>;
  notes?: string;
}

export interface StudentData {
  fullName: string;
  gender: 'L' | 'P';
  nik: string;
  nisn?: string;
  birthPlace: string;
  birthDate: string;
  religion: string;
  childOrder: number;
  totalSiblings: number;
  previousSchool: string;
  address: string;
  specialNotes?: string;
}

export interface ParentData {
  fatherName: string;
  fatherJob: string;
  fatherPhone: string;
  motherName: string;
  motherJob: string;
  motherPhone: string;
  email: string;
  monthlyIncome: string;
}

export interface AddonServices {
  catering: boolean;
  transport: boolean;
  bookPackage: boolean;
}

export interface FinancialBreakdown {
  levelName: string;
  waveName: string;
  registrationFee: number;
  uangPangkalOriginal: number;
  discountPercent: number;
  discountSavings: number;
  uangPangkalFinal: number;
  boks: number;
  spp: number;
  seragam: number;
  ppdbSubtotal: number;
  addonsTotal: number;
  grandTotal: number;
}

export interface Applicant {
  id: string; // e.g. "PPDB-2027-TK-001"
  registrationCode: string; // 6 digit verification PIN
  registeredAt: string;
  level: EducationLevel;
  wave: WaveType;
  student: StudentData;
  parent: ParentData;
  addons: AddonServices;
  financial: FinancialBreakdown;
  status: ApplicantStatus;
  paymentStatus: 'BELUM_BAYAR' | 'SUDAH_BAYAR';
  observationDate?: string;
  observationLocation?: string;
  adminNotes?: string;
}
