// sanity/schemaTypes/index.ts

// =========================================================
// SCHEMA PROGRAM & KONTEN
// =========================================================

import program from './program';
import laporan from './laporan';
import category from './category';
import news from './news';
import donationTransaction from './donationTransaction';
import slider from './slider';

// =========================================================
// SCHEMA FUNDRAISER
// =========================================================

// Profil / pendaftaran fundraiser
import fundraiser from './fundraiser';

// Pengajuan, pencairan, dan riwayat komisi fundraiser
import fundraiserWithdrawal from './fundraiserWithdrawal';

// =========================================================
// DAFTAR SELURUH SCHEMA
// =========================================================

export const schemaTypes = [
  // =======================================================
  // PROGRAM & KONTEN
  // =======================================================

  program,

  laporan,

  category,

  news,

  donationTransaction,

  slider,

  // =======================================================
  // FUNDRAISER
  // =======================================================

  fundraiser,

  fundraiserWithdrawal,
];