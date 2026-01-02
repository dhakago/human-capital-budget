import { BudgetCategory } from './budget-utils'

export const BUDGET_CATEGORIES_2026: BudgetCategory[] = [
  {
    id: 'biaya-kantor',
    name: 'BIAYA KANTOR',
    monthlyBudget: 499968000,
    subItems: [
      { id: 'peralatan-atk', name: 'Peralatan & Alat kantor ( ATK )', monthlyBudget: 48000000 },
      { id: 'photo-copy', name: 'Photo copy/Lightdruk/Blue print', monthlyBudget: 7200000 },
      { id: 'pos-telpon', name: 'Pos/Telpon/Telex/Fax', monthlyBudget: 25608000 },
      { id: 'pln-blok', name: 'PLN BLOK N', monthlyBudget: 288000000 },
      { id: 'pam', name: 'PAM', monthlyBudget: 18000000 },
      { id: 'konsumsi-tamu', name: 'Konsumsi - Tamu (Permen,Kopi,snack)', monthlyBudget: 6000000 },
      { id: 'alat-rumah-tangga', name: 'Alat rumah tangga ( RTK )', monthlyBudget: 24000000 },
      { id: 'ikkr', name: 'IKKR (Iuran Kebersihan & Keamanan)', monthlyBudget: 9000000 },
      { id: 'pengiriman-dokumen', name: 'Pengiriman Dokumen', monthlyBudget: 0 },
      { id: 'calmic', name: 'Calmic (Pengharum, Handsoap dll)', monthlyBudget: 14400000 },
      { id: 'rentokil', name: 'Rentokil', monthlyBudget: 5760000 },
      { id: 'air-mineral', name: 'Air Mineral', monthlyBudget: 12000000 },
      { id: 'seragam-batik', name: 'Seragam Batik (2tahun 1kali)', monthlyBudget: 0 },
      { id: 'seragam-ob', name: 'Seragam OB,Team Maintenance  & Security (1tahun 1kali)/Sepatu', monthlyBudget: 30000000 },
      { id: 'biaya-lain', name: 'Biaya lain - lain', monthlyBudget: 12000000 },
    ]
  },
  {
    id: 'biaya-transport',
    name: 'BIAYA TRANSPORT',
    monthlyBudget: 1022000000,
    subItems: [
      { id: 'sewa-kendaraan', name: 'Sewa Kendaraan', monthlyBudget: 840000000 },
      { id: 'bbm-oli-parkir', name: 'BBM/Oli/Parkir', monthlyBudget: 120000000 },
      { id: 'izin-depnaker', name: 'Izin Depnaker/Pemerintahan', monthlyBudget: 0 },
      { id: 'pajak-stnk', name: 'PAJAK STNK (8 2024 PB,B 2839 jF,B 1986 HKO,B 2297 STR,B 1902 HUX,B 2297 SA)', monthlyBudget: 92000000 },
      { id: 'transport-lain', name: 'Transport lain - lain', monthlyBudget: 0 },
    ]
  },
  {
    id: 'biaya-pemeliharaan',
    name: 'BIAYA PEMELIHARAAN',
    monthlyBudget: 130800000,
    subItems: [
      { id: 'perawatan-gedung', name: 'Perawatan Gedung dan lain-lain', monthlyBudget: 30000000 },
      { id: 'perawatan-peralatan', name: 'Perawatan Peralatan Kantor (Furniture,Elektronik Dll)', monthlyBudget: 18000000 },
      { id: 'perawatan-kendaraan', name: 'Perawatan Kendaraan B 2024 PB,B 2839 jF,B 1986 HKO,B 2297 STR,B 1902 HUX', monthlyBudget: 50000000 },
      { id: 'asuransi-kendaraan', name: 'Asuransi Kendaraan', monthlyBudget: 0 },
      { id: 'perawatan-genset', name: 'Perawatan Genset', monthlyBudget: 12500000 },
      { id: 'perawatan-apar', name: 'Perawatan APAR/Refill', monthlyBudget: 3500000 },
      { id: 'perawatan-lift', name: 'Perawatan Lift', monthlyBudget: 700000 },
      { id: 'perlengkapan-pemeliharaan', name: 'Perlengkapan pemeliharaan AC', monthlyBudget: 8400000 },
    ]
  },
  {
    id: 'biaya-umum',
    name: 'BIAYA UMUM',
    monthlyBudget: 21000000,
    subItems: [
      { id: 'uji-udara', name: 'Uji udara lingkungan kerja dan Pencahayaan', monthlyBudget: 10000000 },
      { id: 'thr-linmas', name: 'THR Linmas/Keamanan Lingkungan', monthlyBudget: 6000000 },
      { id: 'safary-tolls', name: 'Safary tolls', monthlyBudget: 5000000 },
    ]
  },
  {
    id: 'bansos',
    name: 'BANSOS',
    monthlyBudget: 0,
    subItems: [
      { id: 'panti-jompo', name: 'Panti Jompo & Panti Yatim', monthlyBudget: 0 },
      { id: 'bencana-alam', name: 'Bencana Alam', monthlyBudget: 0 },
    ]
  },
  {
    id: 'certified-hcga',
    name: 'CERTIFIED HUMAN CAPITAL & GENERAL AFFAIR',
    monthlyBudget: 156400000,
    subItems: [
      { id: 'bnsp-manager', name: 'BNSP SDM Level Manager', monthlyBudget: 25500000 },
      { id: 'bnsp-spv', name: 'BNSP SDM Level Supervisor', monthlyBudget: 14700000 },
      { id: 'bnsp-staff', name: 'BNSP SDM Level Office/Staff', monthlyBudget: 1400000 },
    ]
  },
  {
    id: 'certified-technical',
    name: 'CERTIFIED TECHNICAL TRAINING PROGRAM',
    monthlyBudget: 143250000,
    subItems: [
      { id: 'assessment-leader', name: 'Assessment Untuk Leader', monthlyBudget: 30000000 },
    ]
  },
  {
    id: 'training-soft-competencies',
    name: 'TRAINING SOFT COMPETENCIES',
    monthlyBudget: 11300000,
    subItems: [
      { id: 'negotiation-skill', name: 'Negotiation Skill', monthlyBudget: 5000000 },
      { id: 'coaching-counseling', name: 'Coaching & Counseling', monthlyBudget: 2500000 },
    ]
  },
]
