'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';

import {
  Eye,
  Search,
} from 'lucide-react';

// ============================================================================
// IDENTITAS WEBSITE
// ============================================================================

const SITE_NAME =
  'senyumsantri.or.id';

const PONDOK_NAME =
  'Pondok Matan Darussalam';

// ============================================================================
// TYPES
// ============================================================================

interface SanitySlug {
  current?: string;
}

interface CampaignItem {
  id?: string;
  _id?: string;

  slug?: string | SanitySlug;

  title?: string;

  category?: string;

  image?: string;

  collected?: string;
  collectedRaw?: number;

  target?: string;
  targetAmount?: number;

  views?: number;
}

interface CampaignProps {
  initialData?: CampaignItem[];
}

interface ProgramsApiResponse {
  success?: boolean;
  data?: unknown;
  message?: string;
  error?: string;
}

// ============================================================================
// CONFIG
// ============================================================================

const FALLBACK_IMAGE =
  '/images/placeholder.jpg';

// ============================================================================
// HELPERS
// ============================================================================

function safeString(
  value: unknown,
  fallback = ''
): string {
  if (
    typeof value === 'string' &&
    value.trim().length > 0
  ) {
    return value.trim();
  }

  return fallback;
}

// ============================================================================
// SLUG HELPER
// ============================================================================

function getSlug(
  value: CampaignItem['slug']
): string {
  if (
    typeof value === 'string'
  ) {
    return value.trim();
  }

  if (
    value &&
    typeof value === 'object' &&
    typeof value.current === 'string'
  ) {
    return value.current.trim();
  }

  return '';
}

// ============================================================================
// NUMBER HELPER
// ============================================================================

function toFiniteNumber(
  value: unknown
): number {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return 0;
  }

  return number;
}

// ============================================================================
// FORMAT RUPIAH
// ============================================================================

function rupiah(
  value: unknown
): string {
  const number =
    toFiniteNumber(value);

  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  ).format(number);
}

// ============================================================================
// FORMAT VIEWS
// ============================================================================

function formatViews(
  value: unknown
): string {
  const views =
    Math.max(
      0,
      Math.trunc(
        toFiniteNumber(value)
      )
    );

  return new Intl.NumberFormat(
    'id-ID'
  ).format(views);
}

// ============================================================================
// VALIDASI ITEM API
// ============================================================================

function isCampaignItem(
  value: unknown
): value is CampaignItem {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return false;
  }

  const item =
    value as Record<
      string,
      unknown
    >;

  const slug =
    item.slug;

  const hasSlug =
    typeof slug === 'string'
      ? slug.trim().length > 0
      : Boolean(
          slug &&
          typeof slug === 'object' &&
          typeof (
            slug as Record<
              string,
              unknown
            >
          ).current === 'string' &&
          String(
            (
              slug as Record<
                string,
                unknown
              >
            ).current
          ).trim().length > 0
        );

  return hasSlug;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function Campaign({
  initialData,
}: CampaignProps) {
  // ==========================================================================
  // INITIAL DATA
  // ==========================================================================

  const initialPrograms =
    Array.isArray(initialData)
      ? initialData
      : [];

  const [
    programs,
    setPrograms,
  ] =
    useState<CampaignItem[]>(
      initialPrograms
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      initialPrograms.length === 0
    );

  const [
    error,
    setError,
  ] =
    useState('');

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState('SEMUA');

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState('');

  // ==========================================================================
  // FETCH PROGRAM
  // ==========================================================================

  useEffect(() => {
    // Jika initialData dari server tersedia,
    // tidak perlu fetch ulang di browser.

    if (
      Array.isArray(initialData) &&
      initialData.length > 0
    ) {
      setPrograms(
        initialData
      );

      setLoading(false);

      return;
    }

    const controller =
      new AbortController();

    async function fetchPrograms() {
      try {
        setLoading(true);
        setError('');

        const response =
          await fetch(
            `/api/programs?v=${Date.now()}`,
            {
              method: 'GET',

              cache:
                'no-store',

              signal:
                controller.signal,

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

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const json =
          (await response.json()) as ProgramsApiResponse;

        if (
          json.success !== true
        ) {
          throw new Error(
            json.message ||
            json.error ||
            'API program mengembalikan status gagal.'
          );
        }

        if (
          !Array.isArray(
            json.data
          )
        ) {
          throw new Error(
            'Data program dari API bukan array.'
          );
        }

        const validPrograms =
          json.data.filter(
            isCampaignItem
          );

        setPrograms(
          validPrograms
        );
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          `[${SITE_NAME}] Campaign fetch error:`,
          err
        );

        setPrograms([]);

        setError(
          'Program belum berhasil dimuat. Silakan muat ulang halaman.'
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }

    fetchPrograms();

    return () => {
      controller.abort();
    };

    // initialData sengaja tidak dijadikan dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================================================
  // CATEGORY
  // ==========================================================================

  const availableCategories =
    useMemo(() => {
      const categories =
        new Set<string>();

      programs.forEach(
        (program) => {
          const category =
            safeString(
              program.category
            );

          if (category) {
            categories.add(
              category.toUpperCase()
            );
          }
        }
      );

      return [
        'SEMUA',
        ...Array.from(
          categories
        ).sort(
          (
            a,
            b
          ) =>
            a.localeCompare(
              b,
              'id'
            )
        ),
      ];
    }, [programs]);

  // ==========================================================================
  // FILTER PROGRAM
  // ==========================================================================

  const filteredPrograms =
    useMemo(() => {
      const search =
        searchQuery
          .trim()
          .toLowerCase();

      return programs.filter(
        (program) => {
          const category =
            safeString(
              program.category
            ).toUpperCase();

          const title =
            safeString(
              program.title
            ).toLowerCase();

          const matchesCategory =
            selectedCategory ===
              'SEMUA' ||
            category ===
              selectedCategory;

          const matchesSearch =
            !search ||
            title.includes(
              search
            ) ||
            category
              .toLowerCase()
              .includes(
                search
              );

          return (
            matchesCategory &&
            matchesSearch
          );
        }
      );
    }, [
      programs,
      selectedCategory,
      searchQuery,
    ]);

  // ==========================================================================
  // LOADING
  // ==========================================================================

  if (loading) {
    return (
      <div
        className="
          flex
          items-center
          justify-center

          py-16

          md:py-20
        "
      >
        <div className="space-y-3 text-center">

          <div
            className="
              mx-auto
              h-7
              w-7

              animate-spin

              rounded-full

              border-2
              border-gray-200
              border-t-emerald-600
            "
          />

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-wider

              text-gray-400
            "
          >
            Memuat Program Kebaikan...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="space-y-6">

      {/* =====================================================================
          FILTER + SEARCH
          ===================================================================== */}

      <div
        className="
          flex
          w-full
          flex-col

          gap-4

          border-b
          border-gray-100

          pb-4

          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        {/* ===================================================================
            CATEGORY FILTER
            =================================================================== */}

        <div
          className="
            flex
            flex-wrap
            items-center

            gap-2
          "
        >

          {availableCategories.map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                aria-pressed={
                  selectedCategory ===
                  category
                }
                className={`
                  border
                  px-3.5
                  py-2.5

                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.08em]

                  transition-all
                  duration-200

                  ${
                    selectedCategory ===
                    category
                      ? `
                        border-emerald-600
                        bg-emerald-600
                        text-white
                        shadow-sm
                      `
                      : `
                        border-gray-200
                        bg-white
                        text-gray-500

                        hover:border-emerald-200
                        hover:text-emerald-600
                      `
                  }
                `}
              >
                {category ===
                'SEMUA'
                  ? 'Semua'
                  : category}
              </button>
            )
          )}

        </div>

        {/* ===================================================================
            SEARCH
            =================================================================== */}

        <div
          className="
            relative
            w-full

            md:max-w-[260px]
          "
        >

          <label
            htmlFor="campaign-search"
            className="sr-only"
          >
            Cari program
          </label>

          <Search
            aria-hidden="true"
            className="
              pointer-events-none
              absolute

              left-3.5
              top-1/2

              h-3.5
              w-3.5

              -translate-y-1/2

              text-gray-400
            "
            strokeWidth={2.3}
          />

          <input
            id="campaign-search"
            type="search"
            placeholder="Cari program..."
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
            className="
              w-full

              border
              border-gray-200

              bg-white

              py-2.5
              pl-9
              pr-4

              text-xs
              font-semibold

              text-gray-700

              outline-none

              transition-all
              duration-200

              placeholder:font-medium
              placeholder:text-gray-400

              focus:border-emerald-400
              focus:ring-4
              focus:ring-emerald-500/5
            "
          />

        </div>

      </div>

      {/* =====================================================================
          RESULT INFO
          ===================================================================== */}

      {!error &&
        programs.length > 0 && (
          <div
            className="
              flex
              items-center
              justify-between

              gap-4
            "
          >

            <p
              className="
                text-[10px]
                font-semibold

                text-gray-400
              "
            >
              Menampilkan{' '}
              <strong
                className="
                  font-black
                  text-gray-600
                "
              >
                {filteredPrograms.length}
              </strong>{' '}
              program dari {PONDOK_NAME}.
            </p>

            {(
              selectedCategory !==
                'SEMUA' ||
              searchQuery.trim()
            ) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(
                    'SEMUA'
                  );

                  setSearchQuery('');
                }}
                className="
                  shrink-0

                  text-[10px]
                  font-bold

                  text-emerald-600

                  transition-colors

                  hover:text-emerald-700
                "
              >
                Reset Filter
              </button>
            )}

          </div>
        )}

      {/* =====================================================================
          ERROR
          ===================================================================== */}

      {error && (
        <div
          className="
            border
            border-red-100

            bg-red-50

            p-4
          "
        >

          <p
            className="
              text-xs
              font-bold

              text-red-600
            "
          >
            {error}
          </p>

        </div>
      )}

      {/* =====================================================================
          EMPTY
          ===================================================================== */}

      {!error &&
        filteredPrograms.length ===
          0 && (

          <div
            className="
              border
              border-gray-100

              bg-white

              py-16

              text-center
            "
          >

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider

                text-gray-400
              "
            >
              Tidak ditemukan program
              yang cocok.
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory(
                  'SEMUA'
                );

                setSearchQuery('');
              }}
              className="
                mt-4

                text-[11px]
                font-bold

                text-emerald-600

                transition-colors

                hover:text-emerald-700
              "
            >
              Tampilkan Semua Program
            </button>

          </div>

        )}

      {/* =====================================================================
          GRID CAMPAIGN
          ===================================================================== */}

      {filteredPrograms.length >
        0 && (

        <div
          className="
            grid
            grid-cols-1

            gap-5

            sm:grid-cols-2

            lg:grid-cols-3

            md:gap-6
          "
        >

          {filteredPrograms.map(
            (
              program,
              index
            ) => {
              // ==============================================================
              // PROGRAM DATA
              // ==============================================================

              const slug =
                getSlug(
                  program.slug
                );

              const title =
                safeString(
                  program.title,
                  'Program Kebaikan'
                );

              const category =
                safeString(
                  program.category,
                  'Kebaikan'
                );

              const image =
                safeString(
                  program.image,
                  FALLBACK_IMAGE
                );

              // ==============================================================
              // COLLECTED
              // ==============================================================

              const collected =
                safeString(
                  program.collected
                ) ||
                rupiah(
                  program.collectedRaw
                );

              // ==============================================================
              // TARGET
              // ==============================================================

              const target =
                safeString(
                  program.target
                ) ||
                rupiah(
                  program.targetAmount
                );

              // ==============================================================
              // PROGRESS
              // ==============================================================

              const collectedRaw =
                Math.max(
                  0,
                  toFiniteNumber(
                    program.collectedRaw
                  )
                );

              const targetRaw =
                Math.max(
                  0,
                  toFiniteNumber(
                    program.targetAmount
                  )
                );

              const progress =
                targetRaw > 0
                  ? Math.min(
                      100,
                      Math.max(
                        0,
                        Math.round(
                          (
                            collectedRaw /
                            targetRaw
                          ) *
                            100
                        )
                      )
                    )
                  : 0;

              // ==============================================================
              // VIEWS
              // ==============================================================

              const views =
                Math.max(
                  0,
                  Math.trunc(
                    toFiniteNumber(
                      program.views
                    )
                  )
                );

              // ==============================================================
              // KEY
              // ==============================================================

              const key =
                program._id ||
                program.id ||
                slug ||
                `program-${index}`;

              // ==============================================================
              // INVALID SLUG
              // ==============================================================

              if (!slug) {
                console.warn(
                  `[${SITE_NAME}] Program tanpa slug:`,
                  title
                );

                return null;
              }

              // ==============================================================
              // CARD
              // ==============================================================

              return (
                <Link
                  key={key}
                  href={`/campaign/${encodeURIComponent(
                    slug
                  )}`}
                  aria-label={`Buka program ${title}`}
                  className="
                    group
                    block
                    h-full
                  "
                >

                  <article
                    className="
                      flex
                      h-full
                      flex-col

                      overflow-hidden

                      border
                      border-gray-100

                      bg-white

                      shadow-[0_6px_24px_rgba(15,23,42,0.04)]

                      transition-all
                      duration-300

                      hover:-translate-y-1
                      hover:border-emerald-200
                      hover:shadow-[0_14px_38px_rgba(15,23,42,0.09)]
                    "
                  >

                    {/* =======================================================
                        IMAGE
                        ======================================================= */}

                    <div
                      className="
                        relative

                        aspect-[16/10]
                        w-full

                        overflow-hidden

                        bg-gray-100
                      "
                    >

                      <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="
                          h-full
                          w-full

                          object-cover

                          transition-transform
                          duration-500

                          group-hover:scale-[1.04]
                        "
                        onError={(
                          event
                        ) => {
                          const element =
                            event.currentTarget;

                          if (
                            element.src.endsWith(
                              FALLBACK_IMAGE
                            )
                          ) {
                            return;
                          }

                          element.onerror =
                            null;

                          element.src =
                            FALLBACK_IMAGE;
                        }}
                      />

                      {/* CATEGORY */}

                      <span
                        className="
                          absolute

                          left-3
                          top-3

                          bg-amber-400

                          px-2.5
                          py-1

                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.08em]

                          text-gray-900

                          shadow-sm
                        "
                      >
                        {category}
                      </span>

                      {/* VIEWS */}

                      {views > 0 && (
                        <span
                          className="
                            absolute

                            bottom-3
                            right-3

                            inline-flex
                            items-center

                            gap-1.5

                            bg-black/55

                            px-2
                            py-1

                            text-[9px]
                            font-bold

                            text-white

                            backdrop-blur-sm
                          "
                        >
                          <Eye
                            aria-hidden="true"
                            className="
                              h-3
                              w-3
                            "
                            strokeWidth={2.2}
                          />

                          {formatViews(
                            views
                          )}
                        </span>
                      )}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-0

                          bg-gradient-to-t
                          from-black/[0.08]
                          via-transparent
                          to-transparent
                        "
                      />

                    </div>

                    {/* =======================================================
                        CONTENT
                        ======================================================= */}

                    <div
                      className="
                        flex
                        flex-1
                        flex-col

                        p-4
                      "
                    >

                      {/* TITLE */}

                      <h2
                        className="
                          line-clamp-2
                          min-h-[2.7rem]

                          text-[14px]
                          font-extrabold
                          leading-[1.45]

                          tracking-[-0.015em]

                          text-gray-800

                          transition-colors

                          group-hover:text-emerald-600
                        "
                      >
                        {title}
                      </h2>

                      {/* PROGRESS */}

                      <div className="mt-4">

                        <div
                          className="
                            h-1.5
                            overflow-hidden

                            bg-gray-100
                          "
                        >
                          <div
                            className="
                              h-full

                              bg-emerald-500

                              transition-all
                              duration-500
                            "
                            style={{
                              width:
                                `${progress}%`,
                            }}
                          />
                        </div>

                        <div
                          className="
                            mt-2
                            flex
                            items-center
                            justify-between

                            gap-3
                          "
                        >

                          <span
                            className="
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-[0.08em]

                              text-gray-400
                            "
                          >
                            Progress
                          </span>

                          <span
                            className="
                              text-[10px]
                              font-black

                              text-emerald-600
                            "
                          >
                            {progress}%
                          </span>

                        </div>

                      </div>

                      {/* =====================================================
                          FUND INFO
                          ===================================================== */}

                      <div
                        className="
                          mt-4

                          grid
                          grid-cols-2

                          gap-3

                          border-t
                          border-gray-100

                          pt-3
                        "
                      >

                        {/* COLLECTED */}

                        <div>

                          <p
                            className="
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-wider

                              text-gray-400
                            "
                          >
                            Terkumpul
                          </p>

                          <p
                            className="
                              mt-1

                              text-xs
                              font-black

                              text-emerald-600
                            "
                          >
                            {collected}
                          </p>

                        </div>

                        {/* TARGET */}

                        <div className="text-right">

                          <p
                            className="
                              text-[9px]
                              font-bold
                              uppercase
                              tracking-wider

                              text-gray-400
                            "
                          >
                            Target
                          </p>

                          <p
                            className="
                              mt-1

                              text-xs
                              font-black

                              text-gray-700
                            "
                          >
                            {target}
                          </p>

                        </div>

                      </div>

                      {/* =====================================================
                          BUTTON LOOK
                          ===================================================== */}

                      <div
                        className="
                          mt-auto
                          pt-5
                        "
                      >

                        <div
                          className="
                            w-full

                            bg-emerald-600

                            py-2.5

                            text-center

                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.12em]

                            text-white

                            transition-colors

                            group-hover:bg-emerald-700
                          "
                        >
                          Infak Sekarang →
                        </div>

                      </div>

                    </div>

                  </article>

                </Link>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}
