// app/api/sliders/route.ts

import {
  NextResponse,
} from 'next/server';

import {
  createClient,
} from '@sanity/client';

import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

// ============================================================================
// ROUTE CONFIG
// ============================================================================

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

// ============================================================================
// SANITY CONFIG
// ============================================================================

const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
  'lsnco71s';

const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
  'production';

const SANITY_API_VERSION =
  '2026-09-27';

const SANITY_READ_TOKEN =
  process.env.SANITY_API_READ_TOKEN?.trim() ||
  '';

// ============================================================================
// SANITY CLIENT
// ============================================================================
//
// Query dilakukan dari SERVER.
//
// Keuntungan:
//
// - tidak terkena CORS browser
// - token read (jika dibutuhkan) tetap aman
// - browser hanya mengakses /api/sliders milik website sendiri
//
// ============================================================================

const sanityClient =
  createClient({
    projectId:
      SANITY_PROJECT_ID,

    dataset:
      SANITY_DATASET,

    apiVersion:
      SANITY_API_VERSION,

    useCdn:
      false,

    ...(SANITY_READ_TOKEN
      ? {
          token:
            SANITY_READ_TOKEN,
        }
      : {}),
  });

// ============================================================================
// IMAGE BUILDER
// ============================================================================

const imageBuilder =
  createImageUrlBuilder({
    projectId:
      SANITY_PROJECT_ID,

    dataset:
      SANITY_DATASET,
  });

// ============================================================================
// TYPES
// ============================================================================

type SanitySliderDocument = {
  _id?: string;

  title?: string;

  subtitle?: string;

  alt?: string;

  buttonLabel?: string;

  href?: string;

  order?: number;

  active?: boolean;

  image?: SanityImageSource;
};

type SliderResponseItem = {
  id: string;

  image: string;

  title: string;

  subtitle: string;

  alt: string;

  buttonLabel: string;

  href: string;

  order: number;
};

// ============================================================================
// QUERY
// ============================================================================

const SLIDER_QUERY = `
  *[
    _type == "slider" &&
    active != false &&
    defined(image.asset)
  ]
  | order(
      coalesce(order, 999) asc,
      _createdAt desc
    )
  {
    _id,
    title,
    subtitle,
    alt,
    buttonLabel,
    href,
    order,
    active,
    image
  }
`;

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

function safeNumber(
  value: unknown,
  fallback = 999
): number {
  const parsed =
    Number(value);

  if (
    Number.isFinite(parsed)
  ) {
    return parsed;
  }

  return fallback;
}

function getImageUrl(
  source:
    | SanityImageSource
    | undefined
): string {
  if (!source) {
    return '';
  }

  try {
    return imageBuilder
      .image(source)
      .width(1600)
      .height(700)
      .fit('crop')
      .auto('format')
      .quality(85)
      .url();
  } catch {
    return '';
  }
}

// ============================================================================
// GET
// ============================================================================

export async function GET() {
  try {
    const data =
      await sanityClient.fetch<
        SanitySliderDocument[]
      >(
        SLIDER_QUERY
      );

    const sliders:
      SliderResponseItem[] =
      Array.isArray(data)
        ? data
            .map(
              (
                item
              ): SliderResponseItem | null => {
                const image =
                  getImageUrl(
                    item.image
                  );

                if (!image) {
                  return null;
                }

                const title =
                  safeString(
                    item.title
                  );

                return {
                  id:
                    safeString(
                      item._id,
                      `slider-${safeNumber(
                        item.order
                      )}`
                    ),

                  image,

                  title,

                  subtitle:
                    safeString(
                      item.subtitle
                    ),

                  alt:
                    safeString(
                      item.alt,
                      title ||
                        'Dokumentasi Pondok Matan Darussalam'
                    ),

                  buttonLabel:
                    safeString(
                      item.buttonLabel,
                      'Selengkapnya'
                    ),

                  href:
                    safeString(
                      item.href
                    ),

                  order:
                    safeNumber(
                      item.order
                    ),
                };
              }
            )
            .filter(
              (
                item
              ): item is SliderResponseItem =>
                item !== null
            )
        : [];

    return NextResponse.json(
      {
        success:
          true,

        data:
          sliders,
      },
      {
        status:
          200,

        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error(
      '[senyumsantri.or.id] GET /api/sliders error:',
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        data:
          [],

        message:
          'Gagal mengambil slider dari Sanity.',
      },
      {
        status:
          500,

        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  }
}
