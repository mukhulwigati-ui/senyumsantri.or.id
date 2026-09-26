// app/program/page.tsx

import React, {
  type ComponentProps,
} from 'react';

import type { Metadata } from 'next';

import Campaign from '@/components/Campaign';

// ============================================================================
// IDENTITAS WEBSITE
// ============================================================================

const SITE_NAME =
  'Pondok Matan Darussalam';

const OFFICIAL_NAME =
  'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://senyumsantri.or.id'
).replace(/\/+$/, '');

const OG_IMAGE =
  `${SITE_URL}/images/og-banner.jpg`;

// ============================================================================
// SEO METADATA
// ============================================================================

export const metadata: Metadata = {
  title:
    `Program Kebaikan | ${SITE_NAME}`,

  description:
    `Jelajahi berbagai program kebaikan ${SITE_NAME}. ` +
    `Dukung pendidikan santri, tahfidz Al-Qur'an, fasilitas pesantren, ` +
    `infak, sedekah, wakaf, dan berbagai kebutuhan pendidikan di ` +
    `${OFFICIAL_NAME}.`,

  keywords: [
    'program Pondok Matan Darussalam',
    'program kebaikan pesantren',
    'donasi Pondok Matan Darussalam',
    'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak',
    'Pesantren Muhammadiyah Demak',
    'Pondok Matan Demak',
    'donasi pesantren Demak',
    'infak pesantren',
    'sedekah pesantren',
    'wakaf pesantren',
    'donasi pendidikan santri',
    'tahfidz Al Quran',
    'beasiswa santri',
    'senyumsantri.or.id',
  ],

  alternates: {
    canonical:
      `${SITE_URL}/program`,
  },

  openGraph: {
    title:
      `Program Kebaikan | ${SITE_NAME}`,

    description:
      `Dukung pendidikan santri, tahfidz Al-Qur'an, fasilitas pesantren, ` +
      `dan berbagai program kebaikan bersama ${SITE_NAME}.`,

    url:
      `${SITE_URL}/program`,

    siteName:
      SITE_NAME,

    locale:
      'id_ID',

    type:
      'website',

    images: [
      {
        url:
          OG_IMAGE,

        width:
          1200,

        height:
          630,

        type:
          'image/jpeg',

        alt:
          `Program Kebaikan ${SITE_NAME}`,
      },
    ],
  },

  twitter: {
    card:
      'summary_large_image',

    title:
      `Program Kebaikan | ${SITE_NAME}`,

    description:
      `Berbagai program pendidikan santri, tahfidz, infak, sedekah, ` +
      `wakaf, dan kebaikan ${SITE_NAME}.`,

    images: [
      OG_IMAGE,
    ],
  },

  robots: {
    index:
      true,

    follow:
      true,

    googleBot: {
      index:
        true,

      follow:
        true,

      'max-image-preview':
        'large',

      'max-snippet':
        -1,

      'max-video-preview':
        -1,
    },
  },
};

// ============================================================================
// DYNAMIC DATA
// ============================================================================
//
// Halaman dibuat dinamis agar daftar program terbaru langsung tampil.
// ============================================================================

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

// ============================================================================
// TYPE
// ============================================================================
//
// PENTING:
//
// Kita TIDAK membuat interface ProgramItem sendiri.
//
// Tipe initialData diambil langsung dari props komponen Campaign.
// Dengan cara ini tipe halaman Program akan selalu sama dengan Campaign.tsx.
//
// Ini menghindari error seperti:
//
// ProgramItem[] is not assignable to CampaignItem[]
//
// ============================================================================

type CampaignInitialData =
  NonNullable<
    ComponentProps<
      typeof Campaign
    >['initialData']
  >;

// ============================================================================
// API RESPONSE
// ============================================================================

type ProgramsApiResponse = {
  success?: boolean;

  data?: unknown;

  message?: string;

  error?: string;
};

// ============================================================================
// HELPER
// ============================================================================

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'https://senyumsantri.or.id'
  ).replace(/\/+$/, '');
}

// ============================================================================
// GET PROGRAM DATA
// ============================================================================

async function getProgramsData(): Promise<CampaignInitialData> {
  try {
    const baseUrl =
      getBaseUrl();

    // Timestamp dipertahankan agar URL request selalu baru.
    const requestUrl =
      `${baseUrl}/api/programs?v=${Date.now()}`;

    const response =
      await fetch(
        requestUrl,
        {
          method:
            'GET',

          cache:
            'no-store',

          headers: {
            Accept:
              'application/json',

            'Cache-Control':
              'no-cache, no-store, must-revalidate',

            Pragma:
              'no-cache',
          },
        }
      );

    // ========================================================================
    // HTTP ERROR
    // ========================================================================

    if (!response.ok) {
      console.error(
        `[${SITE_NAME}] Gagal mengambil data program. HTTP ${response.status}`
      );

      return [];
    }

    // ========================================================================
    // PARSE JSON
    // ========================================================================

    const json =
      (await response
        .json()
        .catch(() => null)) as ProgramsApiResponse | null;

    if (!json) {
      console.error(
        `[${SITE_NAME}] Response /api/programs tidak valid.`
      );

      return [];
    }

    // ========================================================================
    // VALIDASI RESPONSE
    // ========================================================================

    if (
      json.success !== true ||
      !Array.isArray(json.data)
    ) {
      console.warn(
        `[${SITE_NAME}] API /api/programs tidak mengembalikan daftar program.`,
        json
      );

      return [];
    }

    // ========================================================================
    // RETURN
    // ========================================================================
    //
    // Karena bentuk initialData diambil langsung dari Campaign.tsx,
    // data ini otomatis kompatibel dengan props <Campaign />.
    // ========================================================================

    return json.data as CampaignInitialData;
  } catch (error: unknown) {
    console.error(
      `[${SITE_NAME}] Server Fetch Error di halaman Program:`,
      error
    );

    return [];
  }
}

// ============================================================================
// PAGE
// ============================================================================

export default async function ProgramPage() {
  // ==========================================================================
  // DATA
  // ==========================================================================

  const initialPrograms =
    await getProgramsData();

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <main
      className="
        min-h-screen
        bg-gray-50

        px-4
        py-10

        md:px-16
        md:py-14
      "
    >

      <div
        className="
          mx-auto
          max-w-5xl

          space-y-10
        "
      >

        {/* ===================================================================
            HEADER
            =================================================================== */}

        <header
          className="
            border-l-4
            border-emerald-500

            py-1.5
            pl-5

            md:pl-6
          "
        >

          <span
            className="
              mb-1
              block

              text-[10px]
              font-black
              uppercase
              tracking-[0.16em]

              text-emerald-600

              md:text-[11px]
            "
          >
            Program Kebaikan
          </span>

          <h1
            className="
              text-2xl
              font-extrabold
              leading-tight
              tracking-tight

              text-[#333333]

              md:text-3xl
            "
          >
            Semua Program Kebaikan
          </h1>

          <p
            className="
              mt-2
              max-w-2xl

              text-xs
              font-medium
              leading-relaxed

              text-gray-500

              md:text-sm
            "
          >
            Mari bersama mendukung pendidikan dan pembinaan santri
            Pondok Matan Darussalam melalui infak, sedekah, wakaf,
            serta berbagai program pendidikan dan kebaikan pesantren.
          </p>

        </header>

        {/* ===================================================================
            INFORMATION
            =================================================================== */}

        <section
          aria-label="Informasi program"
          className="
            border
            border-emerald-100

            bg-emerald-50/50

            px-5
            py-4
          "
        >

          <p
            className="
              text-xs
              leading-relaxed

              text-gray-600

              md:text-sm
            "
          >

            Program yang ditampilkan merupakan bagian dari ikhtiar{' '}

            <strong
              className="
                font-bold
                text-gray-800
              "
            >
              {SITE_NAME}
            </strong>{' '}

            dalam mendukung pendidikan santri, pembinaan Al-Qur&apos;an,
            kegiatan pesantren, pengembangan fasilitas, serta berbagai
            kebutuhan kebaikan lainnya.

          </p>

        </section>

        {/* ===================================================================
            PROGRAM HEADER
            =================================================================== */}

        <div
          className="
            flex
            items-center
            justify-between

            gap-4

            border-b
            border-gray-200

            pb-3
          "
        >

          <div>

            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.13em]

                text-gray-400
              "
            >
              Daftar Program
            </span>

            <p
              className="
                mt-0.5

                text-xs
                font-semibold

                text-gray-600
              "
            >
              Program yang tersedia saat ini
            </p>

          </div>

          <div
            className="
              inline-flex
              shrink-0
              items-center

              gap-2

              bg-white

              px-3
              py-2

              text-xs
              font-bold

              text-emerald-700

              shadow-sm

              ring-1
              ring-gray-100
            "
          >

            <span
              className="
                h-2
                w-2

                rounded-full

                bg-emerald-500
              "
              aria-hidden="true"
            />

            {initialPrograms.length.toLocaleString(
              'id-ID'
            )}{' '}
            Program

          </div>

        </div>

        {/* ===================================================================
            CAMPAIGN
            =================================================================== */}

        <section
          aria-label={`Daftar program ${SITE_NAME}`}
          className="bg-transparent"
        >

          <Campaign
            initialData={initialPrograms}
          />

        </section>

      </div>

    </main>
  );
}