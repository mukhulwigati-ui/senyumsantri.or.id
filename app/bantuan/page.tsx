// app/bantuan/page.tsx

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

// ============================================================================
// CONFIG
// ============================================================================

const SITE_NAME = 'Pondok Matan Darussalam';

const OFFICIAL_NAME =
  'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak';

const SITE_URL = 'https://senyum.or.id';

// Nomor Call Center resmi Pondok Matan Darussalam
const WHATSAPP_NUMBER = '6285555555124';

// Email resmi yang tercantum pada profil pondok
const SUPPORT_EMAIL = 'darussalammudemak@gmail.com';

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: `Pusat Bantuan | ${SITE_NAME}`,

  description:
    `Pusat bantuan ${SITE_NAME} untuk informasi donasi, pembayaran, ` +
    `konfirmasi transaksi, fundraiser, program pesantren, dan laporan penyaluran.`,

  alternates: {
    canonical: `${SITE_URL}/bantuan`,
  },

  openGraph: {
    title: `Pusat Bantuan | ${SITE_NAME}`,

    description:
      `Temukan panduan donasi, transaksi, pembayaran, fundraiser, ` +
      `dan informasi program ${SITE_NAME}.`,

    url: `${SITE_URL}/bantuan`,

    siteName: SITE_NAME,

    locale: 'id_ID',

    type: 'website',

    images: [
      {
        url: `${SITE_URL}/images/og-banner.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: `Pusat Bantuan ${SITE_NAME}`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: `Pusat Bantuan | ${SITE_NAME}`,

    description:
      `Informasi donasi, pembayaran, fundraiser, dan layanan ${SITE_NAME}.`,

    images: [
      `${SITE_URL}/images/og-banner.jpg`,
    ],
  },
};

// ============================================================================
// PAGE
// ============================================================================

export default function BantuanPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 md:px-16 md:py-14">

      <div className="mx-auto max-w-3xl space-y-10">

        {/* ===================================================================
            HEADER
            =================================================================== */}

        <header className="space-y-3">

          <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600 md:text-xs">
            PUSAT BANTUAN
          </span>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#333333] md:text-4xl">
            Bagaimana Kami Bisa Membantu?
          </h1>

          <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-500">
            Temukan informasi dan panduan seputar donasi, pembayaran,
            fundraiser, serta berbagai program pendidikan dan kebaikan
            yang dikelola oleh{' '}

            <strong className="font-bold text-gray-700">
              {SITE_NAME}
            </strong>.
          </p>

        </header>

        {/* ===================================================================
            PILIHAN BANTUAN
            =================================================================== */}

        <section
          aria-label="Pilihan bantuan"
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >

          {/* ===============================================================
              KONFIRMASI TRANSAKSI
              =============================================================== */}

          <div className="space-y-3 rounded-none border border-gray-200 bg-white p-6 transition-colors hover:border-emerald-500">

            <div className="flex h-9 w-9 items-center justify-center bg-emerald-50 text-lg text-emerald-700">
              ✓
            </div>

            <h2 className="font-bold text-gray-900">
              Konfirmasi Transaksi
            </h2>

            <p className="text-xs leading-relaxed text-gray-600">
              Pembayaran melalui QRIS maupun Virtual Account biasanya
              terdeteksi secara otomatis. Apabila transaksi Anda belum
              tercatat, silakan hubungi admin dan lampirkan bukti
              pembayaran.
            </p>

          </div>

          {/* ===============================================================
              METODE PEMBAYARAN
              =============================================================== */}

          <div className="space-y-3 rounded-none border border-gray-200 bg-white p-6 transition-colors hover:border-emerald-500">

            <div className="flex h-9 w-9 items-center justify-center bg-emerald-50 text-sm font-black text-emerald-700">
              Rp
            </div>

            <h2 className="font-bold text-gray-900">
              Metode Pembayaran
            </h2>

            <p className="text-xs leading-relaxed text-gray-600">
              Pembayaran dapat dilakukan menggunakan metode yang tersedia
              pada halaman program, seperti QRIS, mobile banking,
              e-wallet, maupun Virtual Account.
            </p>

          </div>

          {/* ===============================================================
              LAPORAN PENYALURAN
              =============================================================== */}

          <div className="space-y-3 rounded-none border border-gray-200 bg-white p-6 transition-colors hover:border-emerald-500">

            <div className="flex h-9 w-9 items-center justify-center bg-emerald-50 text-lg">
              📄
            </div>

            <h2 className="font-bold text-gray-900">
              Laporan Penyaluran
            </h2>

            <p className="text-xs leading-relaxed text-gray-600">
              Informasi perkembangan program dan laporan penyaluran dana
              dapat dilihat pada halaman program atau laporan yang telah
              diterbitkan oleh tim {SITE_NAME}.
            </p>

          </div>

          {/* ===============================================================
              FUNDRAISER
              =============================================================== */}

          <div className="space-y-3 rounded-none border border-gray-200 bg-white p-6 transition-colors hover:border-emerald-500">

            <div className="flex h-9 w-9 items-center justify-center bg-emerald-50 text-lg">
              📢
            </div>

            <h2 className="font-bold text-gray-900">
              Bantuan Fundraiser
            </h2>

            <p className="text-xs leading-relaxed text-gray-600">
              Sudah mendaftar menjadi fundraiser tetapi belum memperoleh
              persetujuan, mengalami kendala mendapatkan tautan
              fundraiser, atau ingin mengetahui hasil donasi?
              Tim kami siap membantu.
            </p>

          </div>

          {/* ===============================================================
              STATUS DONASI
              =============================================================== */}

          <div className="space-y-3 rounded-none border border-gray-200 bg-white p-6 transition-colors hover:border-emerald-500">

            <div className="flex h-9 w-9 items-center justify-center bg-emerald-50 text-lg text-emerald-700">
              ♡
            </div>

            <h2 className="font-bold text-gray-900">
              Status Donasi
            </h2>

            <p className="text-xs leading-relaxed text-gray-600">
              Jika pembayaran telah berhasil tetapi donasi belum muncul
              pada daftar donatur, silakan kirim nomor WhatsApp,
              nominal donasi, nama program, dan bukti transaksi
              kepada admin.
            </p>

          </div>

          {/* ===============================================================
              INFORMASI PESANTREN
              =============================================================== */}

          <div className="space-y-3 rounded-none border border-gray-200 bg-white p-6 transition-colors hover:border-emerald-500">

            <div className="flex h-9 w-9 items-center justify-center bg-emerald-50 text-lg">
              🎓
            </div>

            <h2 className="font-bold text-gray-900">
              Informasi Pesantren
            </h2>

            <p className="text-xs leading-relaxed text-gray-600">
              Untuk informasi mengenai pendidikan santri, penerimaan
              santri baru, kegiatan pesantren, program tahfidz,
              beasiswa, maupun informasi lainnya, silakan menghubungi
              tim {SITE_NAME}.
            </p>

          </div>

        </section>

        {/* ===================================================================
            INFO SEBELUM MENGHUBUNGI ADMIN
            =================================================================== */}

        <section className="rounded-none border border-gray-200 bg-gray-50 p-6">

          <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-gray-800">
            Agar Kami Bisa Membantu Lebih Cepat
          </h2>

          <p className="mb-3 text-xs leading-relaxed text-gray-500">
            Jika kendala berkaitan dengan transaksi atau donasi,
            siapkan informasi berikut saat menghubungi admin:
          </p>

          <ul className="space-y-2 text-xs text-gray-600">

            <li className="flex gap-2">
              <span className="font-black text-emerald-600">
                •
              </span>

              Nama atau nomor WhatsApp yang digunakan saat berdonasi.
            </li>

            <li className="flex gap-2">
              <span className="font-black text-emerald-600">
                •
              </span>

              Nama program yang dipilih.
            </li>

            <li className="flex gap-2">
              <span className="font-black text-emerald-600">
                •
              </span>

              Nominal dan waktu transaksi.
            </li>

            <li className="flex gap-2">
              <span className="font-black text-emerald-600">
                •
              </span>

              Bukti pembayaran apabila tersedia.
            </li>

          </ul>

        </section>

        {/* ===================================================================
            KONTAK
            =================================================================== */}

        <section className="space-y-6 rounded-none bg-emerald-900 p-7 text-white md:p-8">

          <div className="space-y-2">

            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Layanan Pondok Matan
            </span>

            <h2 className="text-xl font-black tracking-tight md:text-2xl">
              Masih Membutuhkan Bantuan?
            </h2>

            <p className="max-w-xl text-sm leading-relaxed text-emerald-100/80">
              Hubungi tim {SITE_NAME} melalui WhatsApp.
              Jelaskan pertanyaan atau kendala yang Anda alami agar
              tim kami dapat membantu dengan lebih cepat.
            </p>

          </div>

          {/* =================================================================
              CONTACT BUTTONS
              ================================================================= */}

          <div className="space-y-3">

            <Link
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Assalamu'alaikum Admin ${SITE_NAME}, saya membutuhkan informasi atau bantuan terkait layanan di ${SITE_URL}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-none bg-emerald-500 px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-emerald-400"
            >
              <span aria-hidden="true">
                💬
              </span>

              Chat Admin via WhatsApp
            </Link>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex w-full items-center justify-center rounded-none border border-emerald-700 px-5 py-3.5 text-xs font-semibold text-emerald-100 transition-colors hover:border-emerald-500 hover:bg-emerald-800/60"
            >
              Email: {SUPPORT_EMAIL}
            </a>

          </div>

          {/* =================================================================
              IDENTITY
              ================================================================= */}

          <div className="space-y-2 border-t border-emerald-800 pt-4">

            <p className="text-center text-[11px] leading-relaxed text-emerald-300/70">
              {OFFICIAL_NAME}
            </p>

            <p className="text-center text-[11px] text-emerald-300/70">
              Website resmi{' '}

              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-300 transition hover:text-white"
              >
                senyum.or.id
              </a>
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}