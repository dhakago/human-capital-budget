import { BudgetCategory } from './budget-utils'

export const BUDGET_CATEGORIES_2026: BudgetCategory[] = [
  {
    id: 'biaya-kantor',
    name: 'BIAYA KANTOR',
    monthlyBudget: 499968000,
    subItems: [
      { id: 'peralatan-atk', name: 'Peralatan & Alat kantor ( ATK )', monthlyBudget: 48000000 },
      { id: 'photo-copy', name: 'Photo copy/Lightbulb/Blue print', monthlyBudget: 7200000 },
      { id: 'pos-telpon', name: 'Pos/Telpon/Telex/Fax', monthlyBudget: 25608000 },
      { id: 'pcn-blok', name: 'PCN BLOK N', monthlyBudget: 288000000 },
      { id: 'pam', name: 'PAM', monthlyBudget: 18000000 },
      { id: 'konsumsi-tamu', name: 'Konsumsi - Tamu (Permen,Kopi,snack)', monthlyBudget: 6000000 },
      { id: 'alat-rumah-tangga', name: 'Alat rumah tangga ( RTK )', monthlyBudget: 24000000 },
      { id: 'kmr-turun-kapal', name: 'KMR (turun Kebersihan & Keamanan)', monthlyBudget: 9000000 },
      { id: 'pengiriman-dokumen', name: 'Pengiriman Dokumen', monthlyBudget: 0 },
      { id: 'galeri-penghargaan', name: 'Galeri (Penghargaan/Handap dll)', monthlyBudget: 14400000 },
      { id: 'iembeli', name: 'Iembeli', monthlyBudget: 5760000 },
      { id: 'air-mineral', name: 'Air Mineral', monthlyBudget: 12000000 },
      { id: 'seragam-batik', name: 'Seragam Batik (2th 1kali)', monthlyBudget: 0 },
      { id: 'seragam-ob', name: 'Seragam OB,Team Maintenance  & Security (1th 1kali)/Sepatu', monthlyBudget: 30000000 },
      { id: 'biaya-lain', name: 'Biaya lain - lain', monthlyBudget: 12000000 },
    ]
  },
  {
    id: 'biaya-transport',
    name: 'BIAYA TRANSPORT',
    monthlyBudget: 1022000000,
    subItems: [
      { id: 'biaya-kendaraan', name: 'Biaya Kendaraan', monthlyBudget: 840000000 },
      { id: 'bbm-oli-parkir', name: 'BBM/Oli/Parkir', monthlyBudget: 120000000 },
      { id: 'ijin-depasar', name: 'IJin Depasar/Permerintahan', monthlyBudget: 0 },
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
      { id: 'perawatan-apa', name: 'Perawatan APA/Refil', monthlyBudget: 3500000 },
      { id: 'perawatan-lift', name: 'Perawatan Lift', monthlyBudget: 700000 },
      { id: 'perlengkapan-pemeliharaan', name: 'Perlengkapan pemeliharaan AC', monthlyBudget: 8400000 },
    ]
  },
  {
    id: 'biaya-umum',
    name: 'BIAYA UMUM',
    monthlyBudget: 21000000,
    subItems: [
      { id: 'uji-sidra', name: 'Uji sidra lingkungan kerja dan Pencahayaan', monthlyBudget: 10000000 },
      { id: 'thr-lumnas', name: 'THR Lumnas/Keamanan Lingkungan', monthlyBudget: 6000000 },
      { id: 'safary-tolls', name: 'Safary tolls', monthlyBudget: 5000000 },
    ]
  },
  {
    id: 'honorarium',
    name: 'HONORARIUM',
    monthlyBudget: 0,
    subItems: [
      { id: 'pianti-jompo', name: 'Pianti Jompo & Panti Yatim', monthlyBudget: 0 },
      { id: 'malam-tahun', name: 'Malam Tahun', monthlyBudget: 0 },
    ]
  },
]
