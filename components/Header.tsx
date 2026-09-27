'use client';

import React, {
  FormEvent,
  useState,
} from 'react';

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

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState('');

  // ==========================================================================
  // SEARCH
  // ==========================================================================

  const handleSearchSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const query =
      searchQuery.trim();

    if (!query) {
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(
        query
      )}`
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
      pathname.startsWith(
        `${href}/`
      )
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

        bg-white/95

        shadow-[0_1px_12px_rgba(15,23,42,0.035)]

        backdrop-blur-xl
      "
    >
      {/* =====================================================================
          CONTAINER
          Lebar disamakan dengan Hero / konten website
          ===================================================================== */}

      <div
        className="
          mx-auto

          flex
          h-16
          w-full
          max-w-[1120px]

          items-center
          justify-between

          gap-4

          px-3

          sm:px-5

          md:h-20
          md:px-8

          lg:px-10
        "
      >
        {/* ===================================================================
            LOGO
            =================================================================== */}

        <Link
          href="/"
          aria-label={`${SITE_NAME} - Beranda`}
          className="
            flex
            shrink-0
            items-center

            transition-opacity
            duration-200

            hover:opacity-80
          "
        >
          <img
            src="/images/logo-senyum.png"
            alt={`Logo ${SITE_NAME}`}
            width={1200}
            height={220}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="
              block

              h-[30px]
              w-auto

              object-contain
              object-left

              sm:h-[34px]

              md:h-[38px]
            "
          />
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
                isActive(
                  item.href
                );

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
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
          onSubmit={
            handleSearchSubmit
          }
          role="search"
          className="
            relative

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
            value={
              searchQuery
            }
            onChange={(
              event
            ) =>
              setSearchQuery(
                event.target.value
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