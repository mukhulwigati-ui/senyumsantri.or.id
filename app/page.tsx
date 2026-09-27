// app/page.tsx

import type { Metadata } from 'next';

import Hero from '@/components/Hero';
import HomeCarousel from '@/components/HomeCarousel';
import TotalAccumulationWidget from '@/components/TotalAccumulationWidget';
import Campaign from '@/components/Campaign';
import News from '@/components/News';

// ============================================================================
// SITE CONFIG
// ============================================================================

const SITE_NAME =
  'Pondok Matan Darussalam';

const SITE_DOMAIN =
  'senyumsantri.or.id';

const OFFICIAL_NAME =
  'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://senyumsantri.or.id'
).replace(/\/+$/, '');

// ============================================================================
// HOMEPAGE SEO
// ============================================================================

const PAGE_TITLE =
  'Pondok Matan Darussalam Demak | Pesantren Muhammadiyah & Pendidikan Kader';

const PAGE_DESCRIPTION =
  'Pondok Matan Darussalam adalah Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak. Pesantren kader dengan pendidikan Al-Qur\'an, Bahasa Arab, ilmu syar\'i, kitab matan, pembinaan akhlak, keterampilan, dan kemandirian santri.';

// ============================================================================
// OPEN GRAPH IMAGE
// ============================================================================
//
// File:
//
// public/images/og-banner.jpg
//
// URL:
//
// https://senyumsantri.or.id/images/og-banner.jpg
//
// ============================================================================

const OG_IMAGE =
  `${SITE_URL}/images/og-banner.jpg`;

// ============================================================================
// SEO METADATA
// ============================================================================

export const metadata: Metadata = {
  // ==========================================================================
  // BASIC
  // ==========================================================================

  title:
    PAGE_TITLE,

  description:
    PAGE_DESCRIPTION,

  // ==========================================================================
  // KEYWORDS
  // ==========================================================================

  keywords: [
    'Pondok Matan',
    'Pondok Matan Darussalam',
    'Pondok Matan Demak',

    'Pondok Pesantren Darussalam',
    'Pondok Pesantren Darussalam Muhammadiyah',
    'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak',

    'Pesantren Muhammadiyah Demak',
    'Pesantren Bintoro Demak',
    'Pondok Pesantren Demak',
    'Pesantren Demak',

    'pendidikan kader Muhammadiyah',
    'pendidikan kader ulama',
    'pesantren kader ulama',

    'pesantren tahfidz Demak',
    'tahfidz Al Quran Demak',
    'hafalan Al Quran santri',

    'Bahasa Arab pesantren',
    'ilmu syari pesantren',

    'kitab matan',
    'hafalan matan',
    'kitab kuning',

    'pendidikan Islam Demak',
    'pendidikan santri',

    'santri Muhammadiyah',

    'beasiswa santri',
    'beasiswa tahfidz',

    'donasi pesantren',
    'infaq pesantren',
    'infak pesantren',
    'sedekah pesantren',
    'wakaf pesantren',
    'zakat pesantren',

    'donasi pendidikan santri',

    'senyum santri',
    'senyum santri Demak',
    'senyumsantri.or.id',
  ],

  // ==========================================================================
  // CANONICAL
  // ==========================================================================

  alternates: {
    canonical:
      SITE_URL,
  },

  // ==========================================================================
  // OPEN GRAPH
  // ==========================================================================

  openGraph: {
    title:
      PAGE_TITLE,

    description:
      'Pondok Matan Darussalam Muhammadiyah Bintoro Demak. Mendidik kader yang alim muttaqin, berakhlak mulia, unggul, terampil, dan berkemajuan melalui pendidikan Al-Qur\'an, Bahasa Arab, ilmu syar\'i, kitab matan, dan pembinaan santri.',

    url:
      SITE_URL,

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
          `${OFFICIAL_NAME} - ${SITE_NAME} Demak`,
      },
    ],
  },

  // ==========================================================================
  // TWITTER / X
  // ==========================================================================

  twitter: {
    card:
      'summary_large_image',

    title:
      PAGE_TITLE,

    description:
      'Pondok Matan Darussalam Muhammadiyah Bintoro Demak. Pendidikan kader, Al-Qur\'an, Bahasa Arab, ilmu syar\'i, kitab matan, pembinaan akhlak, dan kemandirian santri.',

    images: [
      OG_IMAGE,
    ],
  },

  // ==========================================================================
  // ROBOTS
  // ==========================================================================

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
// CACHE
// ============================================================================
//
// Homepage direvalidasi setiap 60 detik.
//
// Hero dan metadata dapat tetap menggunakan ISR,
// sedangkan Campaign, News, counter, serta data lainnya dapat memperbarui
// data melalui API masing-masing.
//
// ============================================================================

export const revalidate =
  60;

// ============================================================================
// HOMEPAGE
// ============================================================================

export default function HomePage() {
  return (
    <main
      className="
        min-h-screen
        bg-white
      "
    >

      {/* =====================================================================
          1. HERO
          ===================================================================== */}

      <Hero />

      {/* =====================================================================
          2. SLIDESHOW DOKUMENTASI
          ===================================================================== */}

      <HomeCarousel />

      {/* =====================================================================
          3. TOTAL AKUMULASI
          ===================================================================== */}

      <TotalAccumulationWidget />

      {/* =====================================================================
          4. MAIN CONTENT
          ===================================================================== */}

      <section
        className="
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

            space-y-14

            md:space-y-16
          "
        >

          {/* =================================================================
              PROGRAM PESANTREN & GALANG DANA
              ================================================================= */}

          <section
            aria-labelledby="program-kebaikan"
            className="
              space-y-6
            "
          >

            {/* ===============================================================
                SECTION HEADER
                =============================================================== */}

            <div
              className="
                border-l-4
                border-emerald-500

                py-1
                pl-4

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

              <h2
                id="program-kebaikan"
                className="
                  text-2xl
                  font-extrabold
                  leading-tight
                  tracking-tight

                  text-[#333333]

                  md:text-3xl
                "
              >
                Program Pesantren &amp; Galang Dana
              </h2>

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
                Mari bersama mendukung pendidikan dan pembinaan
                santri{' '}

                <strong
                  className="
                    font-bold
                    text-gray-700
                  "
                >
                  {SITE_NAME}
                </strong>

                {' '}melalui infak, sedekah, zakat, wakaf,
                dan berbagai program kebaikan untuk pendidikan,
                tahfidz Al-Qur&apos;an, pengembangan fasilitas
                pesantren, serta kebutuhan para santri.
              </p>

            </div>

            {/* ===============================================================
                CAMPAIGN
                =============================================================== */}

            <Campaign />

          </section>

          {/* =================================================================
              BERITA & INFORMASI
              ================================================================= */}

          <section
            aria-label={`Berita dan informasi ${SITE_NAME}`}
          >

            <News />

          </section>

        </div>

      </section>

      {/* =====================================================================
          SEO SUPPORT TEXT
          ===================================================================== */}

      <section
        className="
          border-t
          border-gray-100

          bg-white

          px-4
          py-8

          sm:px-6
        "
      >

        <div
          className="
            mx-auto
            max-w-5xl
          "
        >

          <p
            className="
              max-w-3xl

              text-[10px]
              leading-5

              text-gray-400

              md:text-[11px]
            "
          >
            <strong
              className="
                font-bold
                text-gray-500
              "
            >
              {SITE_NAME}
            </strong>

            {' '}merupakan bagian dari{' '}

            <strong
              className="
                font-bold
                text-gray-500
              "
            >
              {OFFICIAL_NAME}
            </strong>

            . Informasi resmi pondok, kegiatan santri,
            pendidikan kader, program kebaikan, berita,
            dan layanan digital tersedia melalui{' '}

            <strong
              className="
                font-bold
                text-emerald-600
              "
            >
              {SITE_DOMAIN}
            </strong>
            .
          </p>

        </div>

      </section>

    </main>
  );
}