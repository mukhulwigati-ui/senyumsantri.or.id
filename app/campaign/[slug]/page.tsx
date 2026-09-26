// app/campaign/[slug]/page.tsx

import type { Metadata } from 'next';
import { createClient } from '@sanity/client';

import CampaignDetailClient from '@/components/CampaignDetailClient';

// ============================================================================
// TYPES
// ============================================================================

interface Props {
  params: Promise<{
    slug: string;
  }>;

  searchParams: Promise<{
    ref?: string | string[];
  }>;
}

interface CampaignMetadataData {
  title?: string;

  description?: unknown;

  mainImageUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
}

// ============================================================================
// SITE CONFIG
// ============================================================================

const SITE_NAME =
  'Pondok Matan Darussalam';

const OFFICIAL_NAME =
  'Pondok Pesantren Darussalam Muhammadiyah Bintoro Demak';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://senyum.or.id';

const DEFAULT_IMAGE =
  `${SITE_URL}/images/og-banner.jpg`;

const DEFAULT_TITLE =
  `Program Kebaikan ${SITE_NAME}`;

const DEFAULT_DESCRIPTION =
  `Dukung pendidikan, pembinaan santri, dakwah, tahfidz Al-Qur'an, ` +
  `fasilitas pesantren, serta berbagai program kebaikan bersama ${SITE_NAME}.`;

// ============================================================================
// SANITY CONFIG
// ============================================================================

const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
  'lsnco71s';

const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
  'production';

const SANITY_READ_TOKEN =
  process.env.SANITY_API_READ_TOKEN?.trim() ||
  '';

// ============================================================================
// SANITY SERVER CLIENT
// ============================================================================
//
// PENTING:
//
// Metadata hanya membutuhkan akses READ.
//
// JANGAN menggunakan Editor / Write Token pada file ini.
// JANGAN menulis token langsung di source code.
//
// Jika dataset public, SANITY_API_READ_TOKEN bahkan tidak wajib.
//
// ============================================================================

const serverMetadataClient =
  createClient({
    projectId:
      SANITY_PROJECT_ID,

    dataset:
      SANITY_DATASET,

    useCdn:
      false,

    apiVersion:
      '2026-09-26',

    ...(SANITY_READ_TOKEN
      ? {
          token:
            SANITY_READ_TOKEN,
        }
      : {}),
  });

// ============================================================================
// CACHE
// ============================================================================

/**
 * Metadata dapat diperbarui maksimal setiap 60 detik.
 *
 * Tidak perlu memakai:
 *
 * export const dynamic = 'force-dynamic';
 *
 * Query Sanity menggunakan useCdn: false sehingga sumber datanya tetap
 * berasal dari Sanity API, sedangkan revalidate mencegah request berlebihan.
 */
export const revalidate = 60;

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Mengubah Portable Text dari Sanity menjadi plain text.
 */
function portableTextToPlainText(
  content: unknown
): string {
  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .filter(
      (block: any) =>
        block &&
        block._type === 'block' &&
        Array.isArray(block.children)
    )
    .map((block: any) =>
      block.children
        .map((child: any) =>
          typeof child?.text === 'string'
            ? child.text
            : ''
        )
        .join('')
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Membuat description SEO maksimal sekitar 160 karakter,
 * dengan pemotongan pada spasi supaya tidak memotong kata.
 */
function createExcerpt(
  text: string,
  maxLength = 160
): string {
  const cleanText =
    text
      .replace(/\s+/g, ' ')
      .trim();

  if (!cleanText) {
    return '';
  }

  if (
    cleanText.length <=
    maxLength
  ) {
    return cleanText;
  }

  const sliced =
    cleanText.slice(
      0,
      maxLength
    );

  const lastSpace =
    sliced.lastIndexOf(' ');

  const cutPosition =
    lastSpace > 100
      ? lastSpace
      : maxLength;

  return `${sliced
    .slice(0, cutPosition)
    .trim()}...`;
}

/**
 * Normalisasi URL gambar Sanity.
 *
 * Gambar dibuat 1200x630 agar cocok untuk:
 *
 * - WhatsApp
 * - Facebook
 * - Telegram
 * - Twitter / X
 */
function optimizeSanityImage(
  image: unknown
): string {
  if (
    typeof image !== 'string' ||
    !image.trim()
  ) {
    return DEFAULT_IMAGE;
  }

  const value =
    image.trim();

  // Jika gambar berasal dari Sanity CDN
  if (
    value.includes(
      'cdn.sanity.io/images/'
    )
  ) {
    const separator =
      value.includes('?')
        ? '&'
        : '?';

    return (
      `${value}${separator}` +
      `fm=jpg&w=1200&h=630&fit=crop&auto=format`
    );
  }

  // URL absolute lainnya
  if (
    /^https?:\/\//i.test(value)
  ) {
    return value;
  }

  // Relative URL
  return `${SITE_URL}${
    value.startsWith('/')
      ? ''
      : '/'
  }${value}`;
}

// ============================================================================
// DYNAMIC METADATA
// ============================================================================

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } =
    await params;

  // --------------------------------------------------------------------------
  // DEFAULT VALUES
  // --------------------------------------------------------------------------

  let campaignTitle =
    DEFAULT_TITLE;

  let campaignDescription =
    DEFAULT_DESCRIPTION;

  let imageUrl =
    DEFAULT_IMAGE;

  try {
    // =========================================================================
    // QUERY CAMPAIGN
    // =========================================================================

    const query = `
      *[
        (_type == "program" || _type == "campaign") &&
        slug.current == $slug
      ][0] {
        title,

        description,

        "mainImageUrl":
          mainImage.asset->url,

        "imageUrl":
          image.asset->url,

        "thumbnailUrl":
          thumbnail.asset->url,

        "bannerUrl":
          banner.asset->url
      }
    `;

    const found =
      await serverMetadataClient.fetch<
        CampaignMetadataData | null
      >(
        query,
        {
          slug,
        },
        {
          next: {
            revalidate: 60,
          },
        }
      );

    // =========================================================================
    // CAMPAIGN FOUND
    // =========================================================================

    if (found) {
      // -----------------------------------------------------------------------
      // TITLE
      // -----------------------------------------------------------------------

      if (
        typeof found.title ===
          'string' &&
        found.title.trim()
      ) {
        campaignTitle =
          found.title.trim();
      }

      // -----------------------------------------------------------------------
      // DESCRIPTION
      // -----------------------------------------------------------------------

      let plainDescription = '';

      if (
        typeof found.description ===
          'string'
      ) {
        plainDescription =
          found.description;
      } else if (
        Array.isArray(
          found.description
        )
      ) {
        plainDescription =
          portableTextToPlainText(
            found.description
          );
      }

      const excerpt =
        createExcerpt(
          plainDescription
        );

      if (excerpt) {
        campaignDescription =
          excerpt;
      } else {
        campaignDescription =
          `Dukung program "${campaignTitle}" bersama ${SITE_NAME}. ` +
          `Mari berpartisipasi dalam pendidikan, pembinaan santri, ` +
          `dan berbagai program kebaikan Pondok Matan Darussalam.`;
      }

      // -----------------------------------------------------------------------
      // IMAGE
      // -----------------------------------------------------------------------

      const rawImage =
        found.mainImageUrl ||
        found.imageUrl ||
        found.thumbnailUrl ||
        found.bannerUrl;

      imageUrl =
        optimizeSanityImage(
          rawImage
        );
    }
  } catch (error) {
    console.error(
      `[${SITE_NAME}] Gagal mengambil metadata campaign:`,
      error
    );

    campaignTitle =
      DEFAULT_TITLE;

    campaignDescription =
      DEFAULT_DESCRIPTION;

    imageUrl =
      DEFAULT_IMAGE;
  }

  // ==========================================================================
  // CANONICAL
  // ==========================================================================

  const campaignUrl =
    `${SITE_URL}/campaign/${encodeURIComponent(
      slug
    )}`;

  // ==========================================================================
  // RETURN METADATA
  // ==========================================================================

  return {
    // ------------------------------------------------------------------------
    // BASIC
    // ------------------------------------------------------------------------

    title:
      campaignTitle,

    description:
      campaignDescription,

    // ------------------------------------------------------------------------
    // AUTHOR / PUBLISHER
    // ------------------------------------------------------------------------

    authors: [
      {
        name:
          OFFICIAL_NAME,

        url:
          SITE_URL,
      },
    ],

    creator:
      OFFICIAL_NAME,

    publisher:
      OFFICIAL_NAME,

    // ------------------------------------------------------------------------
    // CANONICAL
    // ------------------------------------------------------------------------

    alternates: {
      canonical:
        campaignUrl,
    },

    // =========================================================================
    // OPEN GRAPH
    // =========================================================================

    openGraph: {
      title:
        campaignTitle,

      description:
        campaignDescription,

      url:
        campaignUrl,

      siteName:
        SITE_NAME,

      locale:
        'id_ID',

      /**
       * Campaign lebih cocok menggunakan "article"
       * daripada "website" untuk halaman detail individual.
       */
      type:
        'article',

      images: [
        {
          url:
            imageUrl,

          width:
            1200,

          height:
            630,

          type:
            'image/jpeg',

          alt:
            campaignTitle,
        },
      ],
    },

    // =========================================================================
    // TWITTER / X
    // =========================================================================

    twitter: {
      card:
        'summary_large_image',

      title:
        campaignTitle,

      description:
        campaignDescription,

      images: [
        imageUrl,
      ],
    },

    // =========================================================================
    // ROBOTS
    // =========================================================================

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
}

// ============================================================================
// SERVER COMPONENT ENTRY
// ============================================================================

export default async function CampaignPage({
  params,
  searchParams,
}: Props) {
  const { slug } =
    await params;

  const resolvedSearchParams =
    await searchParams;

  // ==========================================================================
  // REFERRAL
  // ==========================================================================

  const rawReferral =
    resolvedSearchParams.ref;

  const referral =
    Array.isArray(rawReferral)
      ? rawReferral[0] || null
      : rawReferral || null;

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <CampaignDetailClient
      slug={slug}
      referral={referral}
    />
  );
}