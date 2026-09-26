'use client';

import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import {
  Search,
} from 'lucide-react';

// ============================================================================
// IDENTITAS WEBSITE
// ============================================================================

const SITE_NAME =
  'senyumsantri.or.id';

// ============================================================================
// NAVIGATION
// ============================================================================

const navigation = [
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
];

// ============================================================================
// COMPONENT
// ============================================================================

export default function Header() {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const [searchQuery, setSearchQuery] =
    useState('');

  // ==========================================================================
  // SEARCH
  // ==========================================================================

  const handleSearchSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const query =
      searchQuery.trim();

    if (!query) {
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(query)}`
    );

    setSearchQuery('');
  };

  // ==========================================================================
  // ACTIVE NAVIGATION
  // ==========================================================================

  const isActive = (
    href: string
  ) => {
    if (href === '/') {
      return pathname === '/';
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <header
      className="
        sticky
        top-0
        z-50

        w-full

        border-b
        border-gray-100/80

        bg-white/85

        shadow-[0_1px_12px_rgba(15,23,42,0.035)]

        backdrop-blur-xl
      "
    >

      {/* =====================================================================
          MAIN CONTAINER
          ===================================================================== */}

      <div
        className="
          mx-auto

          flex
          h-16
          w-full
          max-w-5xl

          items-center
          justify-between

          gap-3

          px-4

          sm:px-6

          md:h-20
        "
      >

        {/* ===================================================================
            WORDMARK / LOGO
            =================================================================== */}

        <Link
          href="/"
          aria-label={`${SITE_NAME} - Beranda`}
          className="
            group
            flex
            min-w-0
            shrink-0
            items-center
          "
        >

          <div
            className="
              flex
              items-baseline

              whitespace-nowrap

              tracking-[-0.055em]

              transition-opacity
              duration-300

              group-hover:opacity-80
            "
          >

            {/* senyumsantri */}

            <span
              className="
                text-[20px]
                font-extrabold
                leading-none

                text-emerald-800

                sm:text-[22px]

                md:text-[25px]
              "
            >
              senyumsantri
            </span>

            {/* .or.id */}

            <span
              className="
                text-[20px]
                font-bold
                leading-none

                text-lime-600

                sm:text-[22px]

                md:text-[25px]
              "
            >
              .or.id
            </span>

          </div>

        </Link>

        {/* ===================================================================
            DESKTOP NAVIGATION
            =================================================================== */}

        <nav
          aria-label="Navigasi utama"
          className="
            hidden

            items-center

            rounded-full

            border
            border-gray-100

            bg-gray-50/70

            p-1

            md:flex
          "
        >

          {navigation.map(
            (item) => {
              const active =
                isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    whitespace-nowrap

                    rounded-full

                    px-3.5
                    py-2

                    text-[11px]

                    font-bold

                    transition-all
                    duration-200

                    ${
                      active
                        ? `
                          bg-white
                          text-emerald-700
                          shadow-sm
                          ring-1
                          ring-gray-100
                        `
                        : `
                          text-gray-500
                          hover:bg-white/70
                          hover:text-emerald-700
                        `
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            }
          )}

        </nav>

        {/* ===================================================================
            SEARCH
            =================================================================== */}

        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className="
            relative

            ml-auto

            w-full
            max-w-[125px]

            sm:max-w-[155px]

            md:max-w-[175px]
          "
        >

          <label
            htmlFor="header-search"
            className="sr-only"
          >
            Cari informasi
          </label>

          <input
            id="header-search"
            type="search"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            placeholder="Cari..."
            autoComplete="off"
            className="
              h-10
              w-full

              rounded-xl

              border
              border-gray-200

              bg-gray-50/80

              pl-3.5
              pr-9

              text-xs
              font-medium

              text-gray-700

              outline-none

              transition-all
              duration-200

              placeholder:text-gray-400

              hover:border-gray-300

              focus:border-emerald-300
              focus:bg-white
              focus:ring-4
              focus:ring-emerald-500/5
            "
          />

          <button
            type="submit"
            aria-label="Cari"
            className="
              absolute

              right-2.5
              top-1/2

              flex
              h-7
              w-7

              -translate-y-1/2

              items-center
              justify-center

              rounded-lg

              text-gray-400

              transition-all
              duration-200

              hover:bg-emerald-50
              hover:text-emerald-600
            "
          >

            <Search
              className="
                h-3.5
                w-3.5
              "
              strokeWidth={2.4}
            />

          </button>

        </form>

      </div>

    </header>
  );
}