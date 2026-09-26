// app/thank-you/page.tsx

'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// ============================================================================
// IDENTITAS WEBSITE
// ============================================================================

const SITE_NAME =
  'Pondok Matan Darussalam';

const OFFICIAL_NAME =
  'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak';

const SITE_DOMAIN =
  'senyum.or.id';

const SITE_URL =
  'https://senyum.or.id';

// ============================================================================
// HELPERS
// ============================================================================

function sanitizeText(
  value: string | null,
  fallback: string
): string {
  if (!value) {
    return fallback;
  }

  const cleaned =
    value
      .replace(/[<>]/g, '')
      .trim()
      .slice(0, 100);

  return cleaned || fallback;
}

function formatPaymentMethod(
  value: string
): string {
  const normalized =
    value
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  if (!normalized) {
    return 'Pembayaran Online';
  }

  return normalized
    .split(' ')
    .map((word) =>
      word.length <= 4
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
    )
    .join(' ');
}

// ============================================================================
// THANK YOU CONTENT
// ============================================================================

function ThankYouContent() {
  const searchParams =
    useSearchParams();

  // ==========================================================================
  // ORDER ID
  // ==========================================================================
  //
  // Pakasir / payment gateway dapat mengembalikan parameter:
  //
  // - order_id
  // - id
  //
  // Fallback hanya digunakan jika parameter tidak ditemukan.
  // ==========================================================================

  const rawOrderId =
    searchParams.get('order_id') ||
    searchParams.get('id');

  const orderId =
    sanitizeText(
      rawOrderId,
      'INV-MATAN-XXXXXX'
    );

  // ==========================================================================
  // PAYMENT METHOD
  // ==========================================================================
  //
  // Beberapa gateway dapat mengirim nama metode pembayaran melalui:
  //
  // - payment_method
  // - method
  // - payment
  //
  // Jika tidak ada, jangan memaksa menampilkan "QRIS".
  // ==========================================================================

  const rawPaymentMethod =
    searchParams.get('payment_method') ||
    searchParams.get('method') ||
    searchParams.get('payment');

  const paymentMethod =
    formatPaymentMethod(
      rawPaymentMethod ||
        'Pembayaran Online'
    );

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="group flex w-full max-w-md flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md md:p-8">

      <div>

        {/* ===================================================================
            SUCCESS ICON
            =================================================================== */}

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>

        </div>

        {/* ===================================================================
            TITLE
            =================================================================== */}

        <h1 className="text-2xl font-extrabold tracking-tight text-[#333333] md:text-3xl">
          Alhamdulillah!
        </h1>

        <p className="mt-1 text-xs font-black uppercase tracking-widest text-emerald-600">
          Transaksi Berhasil
        </p>

        {/* ===================================================================
            THANK YOU MESSAGE
            =================================================================== */}

        <p className="mb-6 mt-4 text-xs font-medium leading-relaxed text-gray-500 md:text-sm">

          Transaksi Anda telah diterima oleh sistem{' '}

          <strong className="font-bold text-gray-700">
            {SITE_DOMAIN}
          </strong>.

          {' '}Terima kasih atas kepercayaan Anda dalam
          mendukung berbagai program kebaikan bersama{' '}

          <strong className="font-bold text-gray-700">
            {SITE_NAME}
          </strong>.

          {' '}Semoga setiap kebaikan yang diberikan
          menjadi amal yang bermanfaat dan mendapatkan
          keberkahan dari Allah SWT. Aamiin.

        </p>

        {/* ===================================================================
            TRANSACTION INFORMATION
            =================================================================== */}

        <div className="mb-6 space-y-2.5 rounded-2xl border border-gray-100/80 bg-gray-50 p-4 text-left">

          {/* -----------------------------------------------------------------
              INVOICE
              ----------------------------------------------------------------- */}

          <div className="flex items-center justify-between gap-4 text-[11px] font-semibold">

            <span className="shrink-0 uppercase tracking-wider text-gray-400">
              No. Invoice
            </span>

            <span className="break-all text-right font-mono text-xs font-bold text-gray-700">
              {orderId}
            </span>

          </div>

          {/* -----------------------------------------------------------------
              STATUS
              ----------------------------------------------------------------- */}

          <div className="flex items-center justify-between gap-4 border-t border-gray-200/50 pt-2.5 text-[11px] font-semibold">

            <span className="uppercase tracking-wider text-gray-400">
              Status
            </span>

            <span className="rounded-md border border-emerald-200/40 bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
              Success
            </span>

          </div>

          {/* -----------------------------------------------------------------
              PAYMENT METHOD
              ----------------------------------------------------------------- */}

          <div className="flex items-center justify-between gap-4 border-t border-gray-200/50 pt-2.5 text-[11px] font-semibold">

            <span className="uppercase tracking-wider text-gray-400">
              Metode Pembayaran
            </span>

            <span className="text-right text-[10px] font-bold uppercase tracking-wider text-gray-600">
              {paymentMethod}
            </span>

          </div>

        </div>

        {/* ===================================================================
            INFORMATION
            =================================================================== */}

        <div className="mb-6 border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-left">

          <p className="text-[11px] leading-relaxed text-emerald-800">

            <strong className="font-bold">
              Catatan:
            </strong>

            {' '}Status dan pencatatan transaksi akhir mengikuti
            data pembayaran yang diterima sistem dari penyedia
            layanan pembayaran.

          </p>

        </div>

        {/* ===================================================================
            INSTITUTION
            =================================================================== */}

        <div className="mb-2">

          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Dikelola oleh
          </p>

          <p className="mt-1 text-xs font-bold text-gray-700">
            {SITE_NAME}
          </p>

          <p className="mt-1 text-[10px] leading-relaxed text-gray-400">
            {OFFICIAL_NAME}
          </p>

        </div>

      </div>

      {/* =====================================================================
          ACTION BUTTONS
          ===================================================================== */}

      <div className="mt-6 space-y-2.5 border-t border-gray-100 pt-5">

        <Link
          href="/"
          className="block w-full rounded-xl bg-emerald-600 py-3.5 text-center text-xs font-bold uppercase tracking-widest text-white shadow-sm shadow-emerald-100 transition hover:bg-emerald-700"
        >
          Kembali ke Beranda
        </Link>

        <Link
          href="/program"
          className="block w-full rounded-xl border border-gray-200 bg-white py-3.5 text-center text-xs font-bold uppercase tracking-widest text-gray-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Lihat Program Lainnya
        </Link>

        <a
          href={SITE_URL}
          className="block pt-2 text-[10px] font-semibold text-gray-400 transition hover:text-emerald-600"
        >
          {SITE_DOMAIN}
        </a>

      </div>

    </div>
  );
}

// ============================================================================
// PAGE
// ============================================================================

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 md:p-6">

      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">

            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-600" />

            Memuat Halaman...

          </div>
        }
      >

        <ThankYouContent />

      </Suspense>

    </main>
  );
}