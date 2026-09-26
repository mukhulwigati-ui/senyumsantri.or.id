// app/tentang-kami/page.tsx

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

// =========================================================
// IDENTITAS RESMI
// =========================================================

const SITE_NAME = 'Pondok Matan Darussalam';

const PONDOK_NAME =
  'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak';

const SITE_DOMAIN = 'senyum.or.id';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://senyum.or.id';

const OFFICIAL_WA = '6285555555124';

const DISPLAY_WA = '+62 855-5555-5124';

const OFFICIAL_EMAIL = 'darussalammudemak@gmail.com';

const OFFICIAL_ADDRESS =
  'Jl. Kyai Jebat No. 9, Bintoro, Demak, Jawa Tengah 59511';

const OG_IMAGE =
  `${SITE_URL}/images/og-banner.jpg`;

// =========================================================
// SEO METADATA
// =========================================================

export const metadata: Metadata = {
  title: `Tentang Kami | ${SITE_NAME}`,

  description:
    `Mengenal lebih dekat ${SITE_NAME}, ${PONDOK_NAME}. ` +
    `Pesantren kader Muhammadiyah di Bintoro, Demak yang berfokus pada Al-Qur'an, ` +
    `Bahasa Arab, ilmu syar'i, kitab matan, pembinaan akhlak, dan keterampilan santri.`,

  keywords: [
    'Pondok Matan Darussalam',
    'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak',
    'pesantren Muhammadiyah Demak',
    'pesantren Bintoro Demak',
    'Pondok Matan Demak',
    'pendidikan kader Muhammadiyah',
    'pesantren tahfidz Demak',
    'kitab matan pesantren',
    'Bahasa Arab pesantren',
    'pendidikan santri',
    'senyum.or.id',
  ],

  alternates: {
    canonical: `${SITE_URL}/tentang-kami`,
  },

  openGraph: {
    title: `Tentang Kami | ${SITE_NAME}`,

    description:
      `Mengenal ${SITE_NAME}, pesantren kader Muhammadiyah di Bintoro, Demak ` +
      `dengan pendidikan Al-Qur'an, Bahasa Arab, ilmu syar'i, kitab matan, dan pembinaan santri.`,

    url: `${SITE_URL}/tentang-kami`,
    siteName: SITE_NAME,
    locale: 'id_ID',
    type: 'website',

    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: `Tentang ${SITE_NAME}`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `Tentang Kami | ${SITE_NAME}`,
    description:
      `Profil resmi ${PONDOK_NAME} melalui ${SITE_DOMAIN}.`,
    images: [OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

// =========================================================
// PAGE
// =========================================================

export default function TentangKamiPage() {
  const defaultText = encodeURIComponent(
    `Assalamu'alaikum Admin ${SITE_NAME}, saya ingin bertanya mengenai ${PONDOK_NAME}.`
  );

  const waChatUrl = `https://wa.me/${OFFICIAL_WA}?text=${defaultText}`;

  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
          1. HERO SECTION
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden

          bg-gradient-to-br
          from-[#062d21]
          via-[#073b2a]
          to-[#041d16]

          px-4
          py-14
          sm:py-16
          md:py-20

          text-white
        "
      >
        {/* Pattern */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0

            opacity-[0.05]

            bg-[radial-gradient(#ffffff_1px,transparent_1px)]
            [background-size:18px_18px]
          "
        />

        {/* Ambient Glow Kiri */}
        <div
          className="
            pointer-events-none
            absolute

            -left-24
            top-1/2

            h-80
            w-80

            -translate-y-1/2

            rounded-full

            bg-emerald-400/10

            blur-[110px]
          "
        />

        {/* Ambient Glow Kanan */}
        <div
          className="
            pointer-events-none
            absolute

            -right-24
            top-0

            h-72
            w-72

            rounded-full

            bg-teal-300/10

            blur-[100px]
          "
        />

        {/* Content */}
        <div
          className="
            relative
            z-10

            mx-auto
            max-w-3xl

            text-center
          "
        >
          {/* Badge */}
          <div
            className="
              mb-5

              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-emerald-300/20

              bg-white/[0.07]

              px-4
              py-2

              backdrop-blur-xl
            "
          >
            <span
              className="
                h-1.5
                w-1.5

                rounded-full

                bg-emerald-400

                shadow-[0_0_10px_rgba(52,211,153,0.8)]
              "
            />

            <span
              className="
                text-[10px]

                font-bold

                uppercase

                tracking-[0.16em]

                text-emerald-200
              "
            >
              Tentang Kami
            </span>
          </div>

          {/* Heading */}
          <h1
            className="
              text-3xl
              sm:text-4xl
              md:text-[46px]

              font-bold

              leading-[1.12]

              tracking-[-0.04em]

              text-white
            "
          >
            Membina Kader Persyarikatan,
            <span
              className="
                mt-1
                block

                text-emerald-300
              "
            >
              Berilmu, Berakhlak &amp; Berkemajuan
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mx-auto
              mt-5

              max-w-2xl

              text-sm
              md:text-[15px]

              leading-7

              text-white/70
            "
          >
            {SITE_NAME} merupakan identitas digital {PONDOK_NAME},
            pesantren kader Muhammadiyah di Bintoro, Demak. Website ini
            menghadirkan informasi pendidikan, kegiatan santri, dakwah,
            penerimaan santri, serta berbagai program kebaikan pesantren.
          </p>
        </div>
      </section>

      {/* =====================================================
          2. PROFIL UTAMA
      ===================================================== */}

      <section
        className="
          mx-auto

          grid
          w-full
          max-w-5xl

          grid-cols-1

          gap-8
          lg:grid-cols-3
          lg:gap-10

          px-4
          py-12
          sm:px-6
          md:py-16
        "
      >
        {/* ===================================================
            KOLOM KIRI
        =================================================== */}

        <div className="lg:col-span-2">
          {/* Heading */}
          <div className="mb-7">
            <span
              className="
                text-[10px]

                font-bold

                uppercase

                tracking-[0.15em]

                text-emerald-600
              "
            >
              Profil Pesantren
            </span>

            <h2
              className="
                mt-1

                text-2xl
                md:text-[28px]

                font-bold

                tracking-[-0.03em]

                text-gray-900
              "
            >
              Siapa Kami?
            </h2>

            <div
              className="
                mt-3

                h-1
                w-12

                rounded-full

                bg-emerald-500
              "
            />
          </div>

          {/* Narrative */}
          <div
            className="
              space-y-5

              text-sm
              md:text-[15px]

              leading-7

              text-gray-600
            "
          >
            <p>
              <strong className="font-semibold text-gray-900">
                {PONDOK_NAME}
              </strong>{' '}
              merupakan bagian dari Amal Usaha Pimpinan Daerah
              Muhammadiyah Demak yang secara khusus menyiapkan kader
              persyarikatan melalui pendidikan pesantren yang terpadu,
              terarah, dan berkesinambungan.
            </p>

            <p>
              Melalui{' '}
              <strong className="font-semibold text-emerald-600">
                {SITE_NAME}
              </strong>
              , kami menghadirkan layanan digital untuk memudahkan
              masyarakat memperoleh informasi mengenai pendidikan,
              penerimaan santri, kegiatan pesantren, dakwah, berita,
              serta berbagai kesempatan untuk berpartisipasi dalam
              program kebaikan.
            </p>

            <p>
              Salah satu kekhasan Pondok Matan adalah penguatan literatur
              klasik melalui hafalan matan dan nadzam, disertai pembelajaran
              Al-Qur&apos;an, Bahasa Arab, ilmu syar&apos;i, pendidikan umum,
              pembinaan akhlak, kedisiplinan, kemandirian, serta keterampilan
              hidup dan organisasi.
            </p>
          </div>

          {/* =================================================
              VISI MISI
          ================================================= */}

          <div
            className="
              mt-9

              grid
              grid-cols-1

              gap-5

              md:grid-cols-2
            "
          >
            {/* VISI */}
            <div
              className="
                rounded-2xl

                border
                border-gray-100

                bg-gray-50/70

                p-5
                md:p-6

                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
              "
            >
              <div
                className="
                  mb-4

                  flex
                  h-10
                  w-10

                  items-center
                  justify-center

                  rounded-xl

                  bg-emerald-100

                  text-lg
                "
              >
                🌱
              </div>

              <h3
                className="
                  text-sm

                  font-bold

                  text-gray-900
                "
              >
                Visi Kami
              </h3>

              <p
                className="
                  mt-2

                  text-xs
                  md:text-[13px]

                  leading-6

                  text-gray-500
                "
              >
                Terwujudnya Kader Persyarikatan yang &apos;Alim Muttaqin,
                Berakhlak Mulia, Unggul, Terampil dan Berkemajuan.
              </p>
            </div>

            {/* MISI */}
            <div
              className="
                rounded-2xl

                border
                border-gray-100

                bg-gray-50/70

                p-5
                md:p-6

                shadow-[0_8px_30px_rgba(15,23,42,0.04)]
              "
            >
              <div
                className="
                  mb-4

                  flex
                  h-10
                  w-10

                  items-center
                  justify-center

                  rounded-xl

                  bg-emerald-100

                  text-lg
                "
              >
                📖
              </div>

              <h3
                className="
                  text-sm

                  font-bold

                  text-gray-900
                "
              >
                Misi Kami
              </h3>

              <ul
                className="
                  mt-2

                  space-y-2

                  text-xs
                  md:text-[13px]

                  leading-6

                  text-gray-500
                "
              >
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-500">✓</span>

                  <span>
                    Membekali santri dengan kemampuan Bahasa Arab,
                    Ulumus Syar&apos;i, dan pemahaman literatur keislaman.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-500">✓</span>

                  <span>
                    Membimbing santri dalam hafalan Al-Qur&apos;an,
                    pembentukan aqidah, akhlak, ibadah, dan kedisiplinan.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-500">✓</span>

                  <span>
                    Mengembangkan komunikasi Bahasa Arab, kemandirian,
                    keterampilan hidup, kepemimpinan, dan organisasi santri.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* =================================================
              KOMITMEN
          ================================================= */}

          <div className="mt-10">
            <span
              className="
                text-[10px]

                font-bold

                uppercase

                tracking-[0.15em]

                text-emerald-600
              "
            >
              Komitmen
            </span>

            <h2
              className="
                mt-1

                text-xl
                md:text-2xl

                font-bold

                tracking-[-0.03em]

                text-gray-900
              "
            >
              Pendidikan Kader yang Terarah dan Berkelanjutan
            </h2>

            <p
              className="
                mt-4

                text-sm
                md:text-[15px]

                leading-7

                text-gray-600
              "
            >
              Kami terus berupaya menghadirkan pendidikan yang mengintegrasikan
              Al-Qur&apos;an, ilmu syar&apos;i, Bahasa Arab, pelajaran umum,
              pembentukan karakter, kedisiplinan, kemandirian, dan keterampilan
              agar santri tumbuh menjadi kader persyarikatan yang berkemajuan.
            </p>
          </div>
        </div>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside
          className="
            w-full

            space-y-5

            lg:sticky
            lg:top-24
          "
        >
          {/* =================================================
              NILAI UTAMA
          ================================================= */}

          <div
            className="
              rounded-2xl

              border
              border-emerald-100

              bg-emerald-50/60

              p-5
            "
          >
            <div
              className="
                mb-5

                flex
                items-center
                gap-3

                border-b
                border-emerald-100

                pb-4
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9

                  items-center
                  justify-center

                  rounded-xl

                  bg-emerald-100
                "
              >
                🛡️
              </div>

              <div>
                <span
                  className="
                    text-[9px]

                    font-bold

                    uppercase

                    tracking-[0.13em]

                    text-emerald-600
                  "
                >
                  Prinsip Kami
                </span>

                <h3
                  className="
                    mt-0.5

                    text-sm

                    font-bold

                    text-emerald-950
                  "
                >
                  Nilai Dasar
                </h3>
              </div>
            </div>

            <div className="space-y-5">
              {/* 1 */}
              <div className="flex gap-3">
                <span
                  className="
                    flex
                    h-7
                    w-7

                    shrink-0

                    items-center
                    justify-center

                    rounded-lg

                    bg-white

                    text-[11px]

                    font-bold

                    text-emerald-600
                  "
                >
                  01
                </span>

                <div>
                  <h4
                    className="
                      text-xs

                      font-bold

                      text-emerald-950
                    "
                  >
                    Kader Persyarikatan
                  </h4>

                  <p
                    className="
                      mt-1

                      text-[11px]

                      leading-5

                      text-emerald-800/70
                    "
                  >
                    Menyiapkan santri yang berilmu, berakhlak,
                    bertanggung jawab, dan siap berkhidmat di Persyarikatan.
                  </p>
                </div>
              </div>

              {/* 2 */}
              <div className="flex gap-3">
                <span
                  className="
                    flex
                    h-7
                    w-7

                    shrink-0

                    items-center
                    justify-center

                    rounded-lg

                    bg-white

                    text-[11px]

                    font-bold

                    text-emerald-600
                  "
                >
                  02
                </span>

                <div>
                  <h4
                    className="
                      text-xs

                      font-bold

                      text-emerald-950
                    "
                  >
                    Ilmu &amp; Al-Qur&apos;an
                  </h4>

                  <p
                    className="
                      mt-1

                      text-[11px]

                      leading-5

                      text-emerald-800/70
                    "
                  >
                    Menguatkan hafalan Al-Qur&apos;an, Bahasa Arab,
                    ilmu syar&apos;i, kitab matan, dan pendidikan umum.
                  </p>
                </div>
              </div>

              {/* 3 */}
              <div className="flex gap-3">
                <span
                  className="
                    flex
                    h-7
                    w-7

                    shrink-0

                    items-center
                    justify-center

                    rounded-lg

                    bg-white

                    text-[11px]

                    font-bold

                    text-emerald-600
                  "
                >
                  03
                </span>

                <div>
                  <h4
                    className="
                      text-xs

                      font-bold

                      text-emerald-950
                    "
                  >
                    Mandiri &amp; Terampil
                  </h4>

                  <p
                    className="
                      mt-1

                      text-[11px]

                      leading-5

                      text-emerald-800/70
                    "
                  >
                    Membiasakan kedisiplinan, kemandirian, kecakapan hidup,
                    komunikasi, kepemimpinan, dan organisasi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              INFORMASI KONTAK
          ================================================= */}

          <div
            className="
              rounded-2xl

              border
              border-gray-100

              bg-white

              p-5

              shadow-[0_8px_30px_rgba(15,23,42,0.04)]
            "
          >
            <span
              className="
                text-[9px]

                font-bold

                uppercase

                tracking-[0.13em]

                text-gray-400
              "
            >
              Informasi
            </span>

            <h3
              className="
                mt-1

                text-sm

                font-bold

                text-gray-900
              "
            >
              Sekretariat Pesantren
            </h3>

            <div
              className="
                mt-4

                space-y-4
              "
            >
              {/* Alamat */}
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-sm">
                  📍
                </span>

                <p
                  className="
                    text-[11px]

                    leading-5

                    text-gray-500
                  "
                >
                  {OFFICIAL_ADDRESS}
                </p>
              </div>

              {/* WA */}
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  💬
                </span>

                <a
                  href={waChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-[11px]

                    font-semibold

                    text-emerald-600

                    transition

                    hover:text-emerald-700
                  "
                >
                  {DISPLAY_WA}
                </a>
              </div>

              {/* Website */}
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  🌐
                </span>

                <a
                  href={SITE_URL}
                  className="
                    text-[11px]

                    font-semibold

                    text-emerald-600

                    transition

                    hover:text-emerald-700
                  "
                >
                  {SITE_DOMAIN}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  ✉️
                </span>

                <a
                  href={`mailto:${OFFICIAL_EMAIL}`}
                  className="
                    break-all

                    text-[11px]

                    font-semibold

                    text-emerald-600

                    transition

                    hover:text-emerald-700
                  "
                >
                  {OFFICIAL_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* =================================================
              LEGALITAS
          ================================================= */}

          <div
            className="
              rounded-2xl

              border
              border-gray-100

              bg-gray-50/70

              p-5
            "
          >
            <h3
              className="
                text-xs

                font-bold

                text-gray-800
              "
            >
              Informasi Kelembagaan
            </h3>

            <p
              className="
                mt-2

                text-[11px]

                leading-5

                text-gray-500
              "
            >
              Untuk memperoleh informasi mengenai profil kelembagaan,
              administrasi, maupun dokumen pendukung pesantren, silakan
              menghubungi admin melalui saluran resmi yang tersedia.
            </p>

            <a
              href={waChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-4

                inline-flex

                text-[11px]

                font-bold

                text-emerald-600

                transition

                hover:text-emerald-700
              "
            >
              Hubungi Admin →
            </a>
          </div>
        </aside>
      </section>

      {/* =====================================================
          3. CTA
      ===================================================== */}

      <section
        className="
          border-t
          border-gray-100

          bg-gray-50/70

          px-4
          py-14
        "
      >
        <div
          className="
            mx-auto
            max-w-2xl

            text-center
          "
        >
          <div
            className="
              mx-auto

              flex
              h-12
              w-12

              items-center
              justify-center

              rounded-2xl

              bg-emerald-100

              text-xl
            "
          >
            🌱
          </div>

          <h2
            className="
              mt-5

              text-xl
              md:text-2xl

              font-bold

              tracking-[-0.03em]

              text-gray-900
            "
          >
            Mari Mendukung Pendidikan Para Santri
          </h2>

          <p
            className="
              mx-auto
              mt-3

              max-w-xl

              text-xs
              md:text-[13px]

              leading-6

              text-gray-500
            "
          >
            Dukungan Anda dapat menjadi bagian dari perjalanan pendidikan
            para santri, penguatan tahfidz Al-Qur&apos;an, pembinaan kader,
            pengembangan fasilitas, dan berbagai program kebaikan pesantren.
          </p>

          <div
            className="
              mt-6

              flex
              flex-col
              sm:flex-row

              items-center
              justify-center

              gap-3
            "
          >
            <Link
              href="/program"
              className="
                inline-flex

                min-h-[48px]

                items-center
                justify-center

                rounded-xl

                bg-emerald-600

                px-7

                text-xs

                font-bold

                text-white

                shadow-[0_12px_30px_rgba(5,150,105,0.18)]

                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:bg-emerald-700
              "
            >
              Lihat Program Donasi
            </Link>

            <a
              href={waChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex

                min-h-[48px]

                items-center
                justify-center

                rounded-xl

                border
                border-gray-200

                bg-white

                px-7

                text-xs

                font-bold

                text-gray-700

                transition-all
                duration-300

                hover:border-emerald-200
                hover:text-emerald-700
              "
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}