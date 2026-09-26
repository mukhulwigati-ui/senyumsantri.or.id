// app/sitemap.ts

import type { MetadataRoute } from 'next';
import { createClient } from 'next-sanity';

// ============================================================================
// SITE CONFIG
// ============================================================================

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://senyum.or.id'
).replace(/\/+$/, '');

// ============================================================================
// SANITY CONFIG
// ============================================================================

const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
  'lsnco71s';

const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
  'production';

const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-09-26',
  useCdn: false,
});

// ============================================================================
// TYPES
// ============================================================================

type SitemapContentItem = {
  slug?: string;
  updatedAt?: string;
  publishedAt?: string;
};

// ============================================================================
// REVALIDATE
// ============================================================================
//
// Sitemap diperbarui secara berkala.
//
// Tidak perlu force-dynamic setiap request karena sitemap bukan halaman
// transaksi. Satu jam sudah cukup untuk memberitahu mesin pencari tentang
// konten terbaru.
// ============================================================================

export const revalidate = 3600;

// ============================================================================
// HELPER
// ============================================================================

function safeDate(
  value?: string,
  fallback: Date = new Date()
): Date {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date;
}

// ============================================================================
// SITEMAP
// ============================================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ==========================================================================
  // 1. HALAMAN STATIS
  // ==========================================================================

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },

    {
      url: `${SITE_URL}/program`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },

    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },

    {
      url: `${SITE_URL}/tentang-kami`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    {
      url: `${SITE_URL}/kontak`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${SITE_URL}/bantuan`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    {
      url: `${SITE_URL}/kebijakan-privasi`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    {
      url: `${SITE_URL}/syarat-ketentuan`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },

    {
      url: `${SITE_URL}/peta-situs`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ];

  // ==========================================================================
  // 2. PROGRAM / CAMPAIGN
  // ==========================================================================

  let campaignRoutes: MetadataRoute.Sitemap = [];

  try {
    const programs =
      await sanityClient.fetch<SitemapContentItem[]>(
        `
          *[
            (_type == "program" || _type == "campaign") &&
            defined(slug.current)
          ]
          | order(_updatedAt desc)
          {
            "slug": slug.current,
            "updatedAt": _updatedAt
          }
        `
      );

    if (Array.isArray(programs)) {
      campaignRoutes = programs
        .filter(
          (program) =>
            typeof program?.slug === 'string' &&
            program.slug.trim().length > 0
        )
        .map((program) => ({
          // ================================================================
          // PENTING:
          // Detail program proyek ini berada di:
          //
          // app/campaign/[slug]/page.tsx
          //
          // BUKAN /program/[slug]
          // ================================================================

          url: `${SITE_URL}/campaign/${encodeURIComponent(
            program.slug!.trim()
          )}`,

          lastModified: safeDate(
            program.updatedAt,
            now
          ),

          changeFrequency: 'daily' as const,

          priority: 0.8,
        }));
    }
  } catch (error) {
    console.error(
      '[Sitemap] Gagal mengambil program dari Sanity:',
      error
    );
  }

  // ==========================================================================
  // 3. BERITA / BLOG
  // ==========================================================================

  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const articles =
      await sanityClient.fetch<SitemapContentItem[]>(
        `
          *[
            _type == "news" &&
            defined(slug.current)
          ]
          | order(
              coalesce(publishedAt, _createdAt) desc
            )
          {
            "slug": slug.current,
            "publishedAt": publishedAt,
            "updatedAt": _updatedAt
          }
        `
      );

    if (Array.isArray(articles)) {
      blogRoutes = articles
        .filter(
          (article) =>
            typeof article?.slug === 'string' &&
            article.slug.trim().length > 0
        )
        .map((article) => ({
          url: `${SITE_URL}/blog/${encodeURIComponent(
            article.slug!.trim()
          )}`,

          lastModified: safeDate(
            article.updatedAt ||
              article.publishedAt,
            now
          ),

          changeFrequency: 'weekly' as const,

          priority: 0.7,
        }));
    }
  } catch (error) {
    console.error(
      '[Sitemap] Gagal mengambil berita dari Sanity:',
      error
    );
  }

  // ==========================================================================
  // 4. HAPUS URL DUPLIKAT
  // ==========================================================================

  const combinedRoutes: MetadataRoute.Sitemap = [
    ...staticRoutes,
    ...campaignRoutes,
    ...blogRoutes,
  ];

  const uniqueRoutes =
    Array.from(
      new Map(
        combinedRoutes.map((route) => [
          route.url,
          route,
        ])
      ).values()
    );

  // ==========================================================================
  // 5. RETURN
  // ==========================================================================

  return uniqueRoutes;
}