'use client';

import React, {
  Suspense,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  Globe,
  Loader2,
  Search,
} from 'lucide-react';

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
// TYPES
// ============================================================================

type SearchResultItem = {
  id?: string;
  _id?: string;

  title?: string;

  slug?: string;

  type?: string;

  category?: string;

  excerpt?: string;

  description?: string;
};

// ============================================================================
// HELPERS
// ============================================================================

function getItemId(
  item: SearchResultItem,
  index: number
): string {
  return (
    item.id ||
    item._id ||
    `${item.type || 'item'}-${item.slug || index}`
  );
}

// ============================================================================
// TARGET URL
// ============================================================================

function getTargetUrl(
  item: SearchResultItem
): string {
  const slug =
    typeof item.slug === 'string'
      ? item.slug.trim()
      : '';

  if (!slug) {
    return '/';
  }

  // Berita / artikel
  if (
    item.type === 'news' ||
    item.type === 'blog' ||
    item.type === 'article'
  ) {
    return `/blog/${encodeURIComponent(slug)}`;
  }

  // Program / campaign
  return `/campaign/${encodeURIComponent(slug)}`;
}

// ============================================================================
// DISPLAY URL
// ============================================================================

function getDisplayUrl(
  item: SearchResultItem
): string {
  const slug =
    typeof item.slug === 'string'
      ? item.slug.trim()
      : '';

  if (
    item.type === 'news' ||
    item.type === 'blog' ||
    item.type === 'article'
  ) {
    return `${SITE_DOMAIN} › blog › ${slug}`;
  }

  return `${SITE_DOMAIN} › campaign › ${slug}`;
}

// ============================================================================
// DESCRIPTION
// ============================================================================

function getResultDescription(
  item: SearchResultItem
): string {
  // --------------------------------------------------------------------------
  // PRIORITAS 1: EXCERPT DARI API
  // --------------------------------------------------------------------------

  if (
    typeof item.excerpt === 'string' &&
    item.excerpt.trim()
  ) {
    return item.excerpt.trim();
  }

  // --------------------------------------------------------------------------
  // PRIORITAS 2: DESCRIPTION DARI API
  // --------------------------------------------------------------------------

  if (
    typeof item.description === 'string' &&
    item.description.trim()
  ) {
    return item.description.trim();
  }

  // --------------------------------------------------------------------------
  // FALLBACK BERDASARKAN JENIS KONTEN
  // --------------------------------------------------------------------------

  if (
    item.type === 'news' ||
    item.type === 'blog' ||
    item.type === 'article'
  ) {
    return (
      `Baca berita, artikel, dan informasi terbaru dari ${SITE_NAME} ` +
      `mengenai ${item.title || 'kegiatan dan perkembangan pesantren'}.`
    );
  }

  return (
    `Dukung program ${item.title || 'kebaikan'} bersama ${SITE_NAME}. ` +
    `Program ini mendukung pendidikan, pembinaan santri, kegiatan pesantren, ` +
    `dan berbagai kebutuhan kebaikan lainnya.`
  );
}

// ============================================================================
// SEARCH RESULT CONTENT
// ============================================================================

function SearchResultsContent() {
  const searchParams =
    useSearchParams();

  const queryParam =
    searchParams.get('q') || '';

  const cleanQuery =
    queryParam.trim();

  // ==========================================================================
  // STATE
  // ==========================================================================

  const [results, setResults] =
    useState<SearchResultItem[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  // ==========================================================================
  // FETCH SEARCH
  // ==========================================================================

  useEffect(() => {
    // ------------------------------------------------------------------------
    // QUERY KOSONG
    // ------------------------------------------------------------------------

    if (!cleanQuery) {
      setResults([]);
      setLoading(false);
      setError('');

      return;
    }

    // ------------------------------------------------------------------------
    // ABORT CONTROLLER
    // ------------------------------------------------------------------------

    const controller =
      new AbortController();

    async function searchContent() {
      setLoading(true);
      setError('');

      try {
        const response =
          await fetch(
            `/api/search?q=${encodeURIComponent(
              cleanQuery
            )}`,
            {
              method: 'GET',

              headers: {
                Accept:
                  'application/json',
              },

              cache:
                'no-store',

              signal:
                controller.signal,
            }
          );

        const json =
          await response
            .json()
            .catch(() => null);

        // --------------------------------------------------------------------
        // HTTP ERROR
        // --------------------------------------------------------------------

        if (!response.ok) {
          throw new Error(
            json?.message ||
              json?.error ||
              `HTTP ${response.status}`
          );
        }

        // --------------------------------------------------------------------
        // SUCCESS
        // --------------------------------------------------------------------

        if (
          json?.success === true &&
          Array.isArray(json.data)
        ) {
          setResults(
            json.data as SearchResultItem[]
          );
        } else {
          setResults([]);
        }
      } catch (err: unknown) {
        // Request dibatalkan karena user mengganti query.
        if (
          err instanceof DOMException &&
          err.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          `[${SITE_NAME}] Search error:`,
          err
        );

        setResults([]);

        setError(
          'Pencarian sedang mengalami gangguan. Silakan coba kembali beberapa saat lagi.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    searchContent();

    return () => {
      controller.abort();
    };
  }, [cleanQuery]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <main className="min-h-screen bg-white pb-20">

      {/* =====================================================================
          HERO MINI
          ===================================================================== */}

      <section className="border-b border-gray-100 bg-gray-50">

        <div className="mx-auto max-w-5xl px-4 py-8 md:px-16 md:py-10">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-50 text-emerald-600">
              <Search size={19} />
            </div>

            <div>

              <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-emerald-600">
                Pencarian
              </span>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#333333] md:text-3xl">
                Hasil Pencarian
              </h1>

              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-500 md:text-sm">
                Temukan program kebaikan, berita, artikel,
                kegiatan santri, dan berbagai informasi dari{' '}
                <strong className="font-bold text-gray-700">
                  {SITE_NAME}
                </strong>.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================================
          RESULT CONTAINER
          ===================================================================== */}

      <section className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-16">

        {/* ===================================================================
            SEARCH STATUS
            =================================================================== */}

        <div className="border-b border-gray-100 pb-3">

          {loading ? (
            <p className="flex items-center gap-1.5 text-xs font-normal text-gray-400">

              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />

              Mencari informasi dari sistem {SITE_NAME}...

            </p>
          ) : cleanQuery ? (
            <p className="text-xs font-normal text-gray-400">

              Sekitar{' '}

              <strong className="font-semibold text-gray-500">
                {results.length}
              </strong>{' '}

              hasil ditemukan untuk pencarian{' '}

              <span className="font-semibold text-gray-600">
                &quot;{cleanQuery}&quot;
              </span>

            </p>
          ) : (
            <p className="text-xs font-normal text-gray-400">
              Masukkan kata kunci pada kolom pencarian untuk
              menemukan informasi di {SITE_DOMAIN}.
            </p>
          )}

        </div>

        {/* ===================================================================
            ERROR
            =================================================================== */}

        {!loading && error && (
          <div className="max-w-3xl border border-red-100 bg-red-50 px-4 py-3">

            <p className="text-xs font-medium leading-relaxed text-red-700">
              {error}
            </p>

          </div>
        )}

        {/* ===================================================================
            SEARCH RESULTS
            =================================================================== */}

        {!loading &&
          !error &&
          results.length > 0 && (

            <div className="max-w-3xl space-y-8">

              {results.map(
                (
                  item,
                  index
                ) => {
                  const targetUrl =
                    getTargetUrl(
                      item
                    );

                  const displayUrl =
                    getDisplayUrl(
                      item
                    );

                  const description =
                    getResultDescription(
                      item
                    );

                  const itemTitle =
                    item.title?.trim() ||
                    'Informasi Pondok Matan Darussalam';

                  return (
                    <article
                      key={getItemId(
                        item,
                        index
                      )}
                      className="group flex flex-col space-y-1 text-left"
                    >

                      {/* =====================================================
                          DISPLAY URL
                          ===================================================== */}

                      <div className="flex max-w-full items-center space-x-1.5 truncate text-xs font-normal text-gray-500">

                        <span className="shrink-0 border border-gray-100 bg-gray-50 p-1 text-gray-400">

                          <Globe className="h-3 w-3" />

                        </span>

                        <span className="truncate">
                          {displayUrl}
                        </span>

                      </div>

                      {/* =====================================================
                          TITLE
                          ===================================================== */}

                      <Link
                        href={targetUrl}
                        className="block pt-0.5 text-xl font-medium leading-snug tracking-normal text-[#1a0dab] group-hover:underline"
                      >
                        {itemTitle}
                      </Link>

                      {/* =====================================================
                          TYPE / CATEGORY
                          ===================================================== */}

                      <div className="flex items-center gap-2 pt-0.5">

                        <span className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600">

                          {item.type === 'news' ||
                          item.type === 'blog' ||
                          item.type === 'article'
                            ? 'Berita & Artikel'
                            : 'Program Kebaikan'}

                        </span>

                        {item.category && (

                          <>
                            <span className="text-[9px] text-gray-300">
                              •
                            </span>

                            <span className="text-[9px] font-semibold text-gray-400">
                              {item.category}
                            </span>
                          </>

                        )}

                      </div>

                      {/* =====================================================
                          DESCRIPTION
                          ===================================================== */}

                      <p className="line-clamp-3 pt-0.5 text-sm font-normal leading-relaxed text-[#4d5156]">
                        {description}
                      </p>

                    </article>
                  );
                }
              )}

            </div>

          )}

        {/* ===================================================================
            EMPTY RESULT
            =================================================================== */}

        {!loading &&
          !error &&
          results.length === 0 &&
          cleanQuery !== '' && (

            <div className="max-w-2xl space-y-4 py-8 text-left">

              <p className="text-base leading-relaxed text-gray-800">

                Penelusuran Anda -{' '}

                <strong className="font-semibold">
                  {cleanQuery}
                </strong>{' '}

                - belum menemukan program, berita,
                atau artikel yang sesuai di{' '}

                <strong className="font-semibold">
                  {SITE_NAME}
                </strong>.

              </p>

              <div>

                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Coba beberapa cara berikut:
                </p>

                <ul className="list-disc space-y-1.5 pl-6 text-sm font-normal leading-relaxed text-gray-600">

                  <li>
                    Pastikan semua kata dieja dengan benar.
                  </li>

                  <li>
                    Gunakan kata kunci yang lebih umum seperti
                    &quot;santri&quot;, &quot;pesantren&quot;,
                    &quot;tahfidz&quot;, atau
                    &quot;program&quot;.
                  </li>

                  <li>
                    Coba gunakan nama kegiatan atau program
                    yang ingin dicari.
                  </li>

                  <li>
                    Kurangi jumlah kata dalam pencarian.
                  </li>

                </ul>

              </div>

              <div className="pt-3">

                <Link
                  href="/"
                  className="inline-flex items-center justify-center bg-emerald-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-emerald-700"
                >
                  Kembali ke Beranda
                </Link>

              </div>

            </div>

          )}

        {/* ===================================================================
            QUERY BELUM DIISI
            =================================================================== */}

        {!loading &&
          !error &&
          cleanQuery === '' && (

            <div className="max-w-2xl py-10">

              <div className="border border-gray-100 bg-gray-50 p-6">

                <div className="mb-3 flex h-10 w-10 items-center justify-center bg-white text-emerald-600 shadow-sm">
                  <Search size={18} />
                </div>

                <h2 className="text-sm font-black text-gray-800">
                  Cari Informasi Pondok Matan
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  Gunakan kolom pencarian pada bagian atas
                  website untuk menemukan berita, artikel,
                  kegiatan santri, maupun program kebaikan
                  {` ${OFFICIAL_NAME}`}.
                </p>

              </div>

            </div>

          )}

      </section>

    </main>
  );
}

// ============================================================================
// PAGE WRAPPER
// ============================================================================
//
// useSearchParams membutuhkan Suspense boundary pada App Router.
// ============================================================================

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-white">

          <div className="flex items-center gap-2 text-sm font-medium text-gray-400">

            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />

            Mempersiapkan mesin pencari...

          </div>

        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}