// components/Footer.tsx

import React from 'react';
import Link from 'next/link';

// ============================================================================
// IDENTITAS WEBSITE
// ============================================================================

const SITE_NAME = 'senyumsantri.or.id';

const PONDOK_NAME = 'Pondok Matan Darussalam';

const OFFICIAL_NAME =
  'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://senyumsantri.or.id';

const OFFICIAL_ADDRESS =
  'Jl. Kyai Jebat No. 9, Bintoro, Demak, Jawa Tengah 59511';

const OFFICIAL_WA = '6285555555124';

const DISPLAY_WA = '+62 855-5555-5124';

const OFFICIAL_EMAIL =
  'darussalammudemak@gmail.com';

// ============================================================================
// NAVIGATION
// ============================================================================

const navigationLinks = [
  {
    label: 'Beranda',
    href: '/',
  },
  {
    label: 'Program Donasi',
    href: '/program',
  },
  {
    label: 'Tentang Kami',
    href: '/tentang-kami',
  },
  {
    label: 'Hubungi Kami',
    href: '/kontak',
  },
  {
    label: 'Berita & Artikel',
    href: '/blog',
  },
];

const serviceLinks = [
  {
    label: 'Kalkulator Zakat',
    href: '/kalkulator',
  },
  {
    label: 'Fundraiser',
    href: '/fundraiser/stats',
  },
  {
    label: 'Peta Situs',
    href: '/peta-situs',
  },
  {
    label: 'Bantuan',
    href: '/bantuan',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function Footer() {
  const currentYear =
    new Date().getFullYear();

  const whatsappUrl =
    `https://wa.me/${OFFICIAL_WA}`;

  const emailUrl =
    `mailto:${OFFICIAL_EMAIL}`;

  return (
    <footer
      className="
        mt-auto
        w-full
        shrink-0

        border-t
        border-gray-100

        bg-white
      "
    >

      {/* =====================================================================
          MAIN FOOTER
          ===================================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-5xl

          px-4
          pb-10
          pt-14

          sm:px-6

          md:pb-12
          md:pt-16
        "
      >

        {/* ===================================================================
            GRID
            =================================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-10

            sm:grid-cols-2

            lg:grid-cols-4
            lg:gap-8
          "
        >

          {/* =================================================================
              BRANDING
              ================================================================= */}

          <div className="sm:col-span-2 lg:col-span-1">

            {/* WORDMARK */}

            <Link
              href="/"
              aria-label={`${SITE_NAME} - Beranda`}
              className="
                group
                inline-flex
                items-baseline

                whitespace-nowrap

                tracking-[-0.055em]

                transition-opacity
                duration-300

                hover:opacity-80
              "
            >

              <span
                className="
                  text-[23px]
                  font-extrabold
                  leading-none

                  text-emerald-800
                "
              >
                senyumsantri
              </span>

              <span
                className="
                  text-[23px]
                  font-bold
                  leading-none

                  text-lime-600
                "
              >
                .or.id
              </span>

            </Link>

            {/* PONDOK */}

            <p
              className="
                mt-4

                text-[11px]
                font-black
                uppercase
                tracking-[0.12em]

                text-gray-700
              "
            >
              {PONDOK_NAME}
            </p>

            {/* DESCRIPTION */}

            <p
              className="
                mt-3
                max-w-sm

                text-xs
                font-medium
                leading-6

                text-gray-400
              "
            >
              Media informasi dan layanan digital
              {` ${OFFICIAL_NAME}`} untuk mendukung
              pendidikan santri, dakwah, infak,
              sedekah, wakaf, dan berbagai program
              kebaikan pesantren.
            </p>

            {/* DOMAIN */}

            <a
              href={SITE_URL}
              className="
                mt-4
                inline-flex

                text-[11px]
                font-bold

                text-emerald-600

                transition-colors

                hover:text-emerald-700
              "
            >
              {SITE_NAME}
            </a>

          </div>

          {/* =================================================================
              NAVIGATION
              ================================================================= */}

          <div>

            <h3
              className="
                mb-4

                text-[10px]
                font-black
                uppercase
                tracking-[0.16em]

                text-gray-800
              "
            >
              Navigasi
            </h3>

            <ul className="space-y-3">

              {navigationLinks.map(
                (item) => (
                  <li key={item.href}>

                    <Link
                      href={item.href}
                      className="
                        text-xs
                        font-semibold

                        text-gray-400

                        transition-colors

                        hover:text-emerald-600
                      "
                    >
                      {item.label}
                    </Link>

                  </li>
                )
              )}

            </ul>

          </div>

          {/* =================================================================
              LAYANAN
              ================================================================= */}

          <div>

            <h3
              className="
                mb-4

                text-[10px]
                font-black
                uppercase
                tracking-[0.16em]

                text-gray-800
              "
            >
              Layanan
            </h3>

            <ul className="space-y-3">

              {serviceLinks.map(
                (item) => (
                  <li key={item.href}>

                    <Link
                      href={item.href}
                      className="
                        text-xs
                        font-semibold

                        text-gray-400

                        transition-colors

                        hover:text-emerald-600
                      "
                    >
                      {item.label}
                    </Link>

                  </li>
                )
              )}

              <li>

                <a
                  href="https://onislam.web.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-xs
                    font-semibold

                    text-gray-400

                    transition-colors

                    hover:text-emerald-600
                  "
                >
                  Media Islam
                </a>

              </li>

            </ul>

          </div>

          {/* =================================================================
              CONTACT
              ================================================================= */}

          <div>

            <h3
              className="
                mb-4

                text-[10px]
                font-black
                uppercase
                tracking-[0.16em]

                text-gray-800
              "
            >
              Hubungi Kami
            </h3>

            <div className="space-y-4">

              {/* ADDRESS */}

              <div>

                <span
                  className="
                    block

                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.08em]

                    text-gray-700
                  "
                >
                  Alamat
                </span>

                <p
                  className="
                    mt-1

                    text-xs
                    font-medium
                    leading-5

                    text-gray-400
                  "
                >
                  {OFFICIAL_ADDRESS}
                </p>

              </div>

              {/* WHATSAPP */}

              <div>

                <span
                  className="
                    block

                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.08em]

                    text-gray-700
                  "
                >
                  WhatsApp
                </span>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-1
                    inline-block

                    text-xs
                    font-bold

                    text-emerald-600

                    transition-colors

                    hover:text-emerald-700
                  "
                >
                  {DISPLAY_WA}
                </a>

              </div>

              {/* EMAIL */}

              <div>

                <span
                  className="
                    block

                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.08em]

                    text-gray-700
                  "
                >
                  Email
                </span>

                <a
                  href={emailUrl}
                  className="
                    mt-1
                    inline-block

                    break-all

                    text-xs
                    font-semibold

                    text-gray-400

                    transition-colors

                    hover:text-emerald-600
                  "
                >
                  {OFFICIAL_EMAIL}
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================================
            IDENTITY STRIP
            =================================================================== */}

        <div
          className="
            mt-12

            border
            border-emerald-100

            bg-emerald-50/40

            px-4
            py-4

            sm:px-5
          "
        >

          <div
            className="
              flex
              flex-col
              gap-1

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.12em]

                  text-emerald-700
                "
              >
                {PONDOK_NAME}
              </p>

              <p
                className="
                  mt-1

                  text-[10px]
                  leading-relaxed

                  text-gray-500
                "
              >
                {OFFICIAL_NAME}
              </p>

            </div>

            <Link
              href="/tentang-kami"
              className="
                mt-2

                text-[10px]
                font-bold

                text-emerald-600

                transition-colors

                hover:text-emerald-700

                sm:mt-0
              "
            >
              Tentang Pondok →
            </Link>

          </div>

        </div>

        {/* ===================================================================
            BOTTOM
            =================================================================== */}

        <div
          className="
            mt-8

            flex
            flex-col

            items-center
            justify-between

            gap-5

            border-t
            border-gray-100

            pt-7

            text-center

            md:flex-row
            md:text-left
          "
        >

          {/* COPYRIGHT */}

          <p
            className="
              text-[10px]
              font-medium

              text-gray-400
            "
          >
            © {currentYear}{' '}

            <span
              className="
                font-bold

                text-gray-600
              "
            >
              {SITE_NAME}
            </span>

            . Hak cipta dilindungi.
          </p>

          {/* LEGAL */}

          <nav
            aria-label="Tautan legal"
            className="
              flex
              flex-wrap

              items-center
              justify-center

              gap-x-5
              gap-y-2
            "
          >

            <Link
              href="/syarat-ketentuan"
              className="
                text-[10px]
                font-semibold

                text-gray-400

                transition-colors

                hover:text-emerald-600
              "
            >
              Syarat &amp; Ketentuan
            </Link>

            <Link
              href="/kebijakan-privasi"
              className="
                text-[10px]
                font-semibold

                text-gray-400

                transition-colors

                hover:text-emerald-600
              "
            >
              Kebijakan Privasi
            </Link>

            <Link
              href="/bantuan"
              className="
                text-[10px]
                font-semibold

                text-gray-400

                transition-colors

                hover:text-emerald-600
              "
            >
              Bantuan
            </Link>

          </nav>

        </div>

      </div>

    </footer>
  );
}