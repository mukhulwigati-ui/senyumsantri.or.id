'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

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

type NewsItem = {
  id?: string;
  _id?: string;

  title: string;
  slug: string;

  image?: string | null;

  timeAgo?: string | null;

  publishedAt?: string | null;

  category?: string | null;
};

type NewsApiResponse = {
  success?: boolean;
  data?: unknown;
};

// ============================================================================
// HELPER
// ============================================================================

function isValidNewsItem(
  item: unknown
): item is NewsItem {
  if (
    !item ||
    typeof item !== 'object'
  ) {
    return false;
  }

  const value =
    item as Record<string, unknown>;

  return (
    typeof value.title === 'string' &&
    value.title.trim().length > 0 &&
    typeof value.slug === 'string' &&
    value.slug.trim().length > 0
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function News() {
  const [
    newsList,
    setNewsList,
  ] =
    useState<NewsItem[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    hasError,
    setHasError,
  ] =
    useState(false);

  // ==========================================================================
  // FETCH NEWS
  // ==========================================================================

  useEffect(() => {
    const controller =
      new AbortController();

    async function fetchNews() {
      try {
        setLoading(true);
        setHasError(false);

        const response =
          await fetch(
            `/api/news?v=${Date.now()}`,
            {
              method:
                'GET',

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
          (await response.json()) as NewsApiResponse;

        if (
          json.success === true &&
          Array.isArray(json.data)
        ) {
          const validNews =
            json.data.filter(
              isValidNewsItem
            );

          setNewsList(
            validNews
          );

          return;
        }

        setNewsList([]);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          `[${SITE_NAME}] News fetch error:`,
          error
        );

        setHasError(true);
        setNewsList([]);
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }

    fetchNews();

    return () => {
      controller.abort();
    };
  }, []);

  // ==========================================================================
  // LOADING
  // ==========================================================================

  if (loading) {
    return (
      <section
        aria-label="Memuat kabar terbaru"
        className="mt-16"
      >
        <div
          className="
            flex
            items-center
            justify-center

            gap-2

            py-10

            text-xs
            font-semibold

            text-gray-400
          "
        >
          <span
            className="
              h-4
              w-4

              animate-spin

              rounded-full

              border-2
              border-gray-200
              border-t-emerald-600
            "
            aria-hidden="true"
          />

          Memuat kabar terbaru...
        </div>
      </section>
    );
  }

  // ==========================================================================
  // ERROR
  // ==========================================================================

  if (
    hasError ||
    newsList.length === 0
  ) {
    return null;
  }

  // ==========================================================================
  // MAX 4 BERITA DI HOMEPAGE
  // ==========================================================================

  const displayNews =
    newsList.slice(
      0,
      4
    );

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <section
      aria-labelledby="news-heading"
      className="
        mt-16
        space-y-7

        md:mt-20
      "
    >

      {/* =====================================================================
          SECTION HEADER
          ===================================================================== */}

      <div
        className="
          flex
          flex-col

          gap-4

          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >

        <div
          className="
            border-l-4
            border-emerald-500

            py-1
            pl-4
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
            "
          >
            Kabar Pesantren
          </span>

          <h2
            id="news-heading"
            className="
              text-xl
              font-extrabold
              tracking-tight

              text-[#333333]

              md:text-2xl
            "
          >
            Kabar &amp; Informasi
          </h2>

          <p
            className="
              mt-1

              max-w-xl

              text-xs
              font-medium
              leading-relaxed

              text-gray-400
            "
          >
            Ikuti kegiatan santri,
            pendidikan, dakwah, serta
            informasi terbaru dari{' '}
            <span
              className="
                font-semibold
                text-gray-500
              "
            >
              {PONDOK_NAME}
            </span>
            .
          </p>

        </div>

        {/* ===================================================================
            LIHAT SEMUA
            =================================================================== */}

        <Link
          href="/blog"
          className="
            hidden

            shrink-0

            text-[11px]
            font-bold

            text-emerald-600

            transition-colors

            hover:text-emerald-700

            sm:inline-flex
          "
        >
          Lihat Semua Berita →
        </Link>

      </div>

      {/* =====================================================================
          NEWS GRID
          ===================================================================== */}

      <div
        className="
          grid
          grid-cols-1

          gap-x-5
          gap-y-8

          sm:grid-cols-2

          lg:grid-cols-4
        "
      >

        {displayNews.map(
          (
            news,
            index
          ) => {
            const key =
              news.id ||
              news._id ||
              news.slug;

            const image =
              news.image ||
              '/images/placeholder.jpg';

            return (
              <Link
                key={key}
                href={`/blog/${encodeURIComponent(
                  news.slug
                )}`}
                className="
                  group
                  flex
                  min-w-0
                  flex-col

                  gap-3
                "
              >

                {/* ===========================================================
                    IMAGE
                    =========================================================== */}

                <div
                  className="
                    relative

                    aspect-[16/10]
                    w-full

                    overflow-hidden

                    bg-gray-100

                    ring-1
                    ring-gray-100
                  "
                >

                  <img
                    src={image}
                    alt={news.title}
                    loading={
                      index < 2
                        ? 'eager'
                        : 'lazy'
                    }
                    className="
                      h-full
                      w-full

                      object-cover

                      transition-transform
                      duration-500

                      group-hover:scale-[1.04]
                    "
                  />

                  {/* Overlay lembut */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0

                      bg-gradient-to-t
                      from-black/10
                      via-transparent
                      to-transparent
                    "
                  />

                  {/* Category */}

                  {news.category && (
                    <span
                      className="
                        absolute

                        bottom-2
                        left-2

                        bg-white/95

                        px-2
                        py-1

                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.08em]

                        text-emerald-700

                        backdrop-blur-sm
                      "
                    >
                      {news.category}
                    </span>
                  )}

                </div>

                {/* ===========================================================
                    CONTENT
                    =========================================================== */}

                <div
                  className="
                    min-w-0
                    space-y-1.5

                    px-0.5
                  "
                >

                  <h3
                    className="
                      line-clamp-2

                      text-sm
                      font-bold
                      leading-snug

                      text-gray-800

                      transition-colors
                      duration-200

                      group-hover:text-emerald-600
                    "
                  >
                    {news.title}
                  </h3>

                  <div
                    className="
                      flex
                      items-center

                      gap-2
                    "
                  >

                    <span
                      className="
                        h-1
                        w-1

                        shrink-0

                        rounded-full

                        bg-emerald-500
                      "
                      aria-hidden="true"
                    />

                    <p
                      className="
                        text-[10px]
                        font-medium

                        text-gray-400
                      "
                    >
                      {news.timeAgo ||
                        'Kabar terbaru'}
                    </p>

                  </div>

                </div>

              </Link>
            );
          }
        )}

      </div>

      {/* =====================================================================
          MOBILE CTA
          ===================================================================== */}

      <div className="pt-1 sm:hidden">

        <Link
          href="/blog"
          className="
            flex
            w-full

            items-center
            justify-center

            border
            border-gray-200

            bg-white

            py-3

            text-[11px]
            font-bold

            text-gray-600

            transition-colors

            hover:border-emerald-200
            hover:text-emerald-600
          "
        >
          Lihat Semua Berita
        </Link>

      </div>

    </section>
  );
}