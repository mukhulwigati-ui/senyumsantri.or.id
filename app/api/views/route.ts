// app/api/views/route.ts

import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  getSupabaseAdmin,
} from '@/lib/supabase/admin';

// ============================================================================
// ROUTE CONFIG
// ============================================================================

export const dynamic =
  'force-dynamic';

export const revalidate =
  0;

// ============================================================================
// SITE CONFIG
// ============================================================================

const SITE_NAME =
  'senyumsantri.or.id';

// ============================================================================
// TYPES
// ============================================================================
//
// "blog" tetap diterima untuk kompatibilitas kode lama.
//
// Di database:
//
// blog -> news
//
// ============================================================================

type RequestContentType =
  | 'blog'
  | 'news'
  | 'campaign'
  | 'fundraiser';

type DatabaseContentType =
  | 'news'
  | 'campaign'
  | 'fundraiser';

type ViewRequestBody = {
  type?: unknown;
  key?: unknown;
};

// ============================================================================
// RESPONSE HEADERS
// ============================================================================

const NO_CACHE_HEADERS = {
  'Cache-Control':
    'no-store, no-cache, must-revalidate, max-age=0',

  Pragma:
    'no-cache',

  Expires:
    '0',
};

// ============================================================================
// VALIDATOR
// ============================================================================

function isValidType(
  value: unknown
): value is RequestContentType {
  return (
    value === 'blog' ||
    value === 'news' ||
    value === 'campaign' ||
    value === 'fundraiser'
  );
}

// ============================================================================
// NORMALIZE TYPE
// ============================================================================
//
// SQL Supabase memakai:
//
// news
// campaign
// fundraiser
//
// Tetapi beberapa komponen lama kemungkinan masih mengirim:
//
// blog
//
// Karena itu "blog" kita ubah menjadi "news".
//
// ============================================================================

function normalizeType(
  type: RequestContentType
): DatabaseContentType {
  if (type === 'blog') {
    return 'news';
  }

  return type;
}

// ============================================================================
// VALIDATE KEY
// ============================================================================

function isValidKey(
  value: unknown
): value is string {
  if (
    typeof value !== 'string'
  ) {
    return false;
  }

  const cleanValue =
    value.trim();

  return (
    cleanValue.length > 0 &&
    cleanValue.length <= 300
  );
}

// ============================================================================
// NORMALIZE KEY
// ============================================================================

function normalizeKey(
  value: string
): string {
  return value
    .trim()
    .slice(0, 300);
}

// ============================================================================
// NORMALIZE VIEW COUNT
// ============================================================================

function normalizeViewCount(
  value: unknown
): number {
  if (
    typeof value === 'number' &&
    Number.isFinite(value)
  ) {
    return Math.max(
      0,
      Math.trunc(value)
    );
  }

  if (
    typeof value === 'string'
  ) {
    const parsed =
      Number(value);

    if (
      Number.isFinite(parsed)
    ) {
      return Math.max(
        0,
        Math.trunc(parsed)
      );
    }
  }

  return 0;
}

// ============================================================================
// BOT DETECTOR
// ============================================================================
//
// Preview WhatsApp, Facebook, Telegram, Googlebot, dan crawler lainnya
// TIDAK menambah jumlah views.
//
// ============================================================================

function isBot(
  userAgent: string
): boolean {
  if (!userAgent) {
    return false;
  }

  return /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|facebookcatalog|whatsapp|telegrambot|discordbot|twitterbot|linkedinbot|pinterest|preview|googleother|google-inspectiontool|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|semrushbot|ahrefsbot|mj12bot|petalbot|bytespider/i.test(
    userAgent
  );
}

// ============================================================================
// GET SUPABASE OR RESPONSE
// ============================================================================
//
// Supabase dibuat lazy melalui getSupabaseAdmin().
//
// Ini penting agar Next.js tidak gagal pada tahap:
//
// Collecting page data
//
// ketika module route di-import.
//
// ============================================================================

function getSupabase() {
  return getSupabaseAdmin();
}

// ============================================================================
// GET CURRENT VIEWS
// ============================================================================

async function getCurrentViews(
  type: DatabaseContentType,
  key: string
): Promise<{
  views: number;
  error: unknown | null;
}> {
  const supabase =
    getSupabase();

  if (!supabase) {
    return {
      views: 0,

      error:
        new Error(
          'Supabase Admin belum dikonfigurasi.'
        ),
    };
  }

  const {
    data,
    error,
  } =
    await supabase
      .from('content_views')
      .select('views')
      .eq(
        'content_type',
        type
      )
      .eq(
        'content_key',
        key
      )
      .maybeSingle();

  if (error) {
    return {
      views: 0,
      error,
    };
  }

  return {
    views:
      normalizeViewCount(
        data?.views
      ),

    error:
      null,
  };
}

// ============================================================================
// GET
// ============================================================================
//
// Contoh:
//
// /api/views?type=news&key=judul-artikel
//
// atau kompatibilitas lama:
//
// /api/views?type=blog&key=judul-artikel
//
// ============================================================================

export async function GET(
  request: NextRequest
) {
  try {
    // ========================================================================
    // QUERY PARAMS
    // ========================================================================

    const {
      searchParams,
    } =
      new URL(
        request.url
      );

    const rawType =
      searchParams.get(
        'type'
      );

    const rawKey =
      searchParams.get(
        'key'
      );

    // ========================================================================
    // VALIDATION
    // ========================================================================

    if (
      !isValidType(rawType) ||
      !isValidKey(rawKey)
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            'Parameter views tidak valid.',

          views:
            0,
        },
        {
          status:
            400,

          headers:
            NO_CACHE_HEADERS,
        }
      );
    }

    // ========================================================================
    // NORMALIZE
    // ========================================================================

    const type =
      normalizeType(
        rawType
      );

    const key =
      normalizeKey(
        rawKey
      );

    // ========================================================================
    // SUPABASE
    // ========================================================================

    const supabase =
      getSupabase();

    if (!supabase) {
      console.error(
        `[${SITE_NAME}] GET views: Supabase belum dikonfigurasi.`
      );

      return NextResponse.json(
        {
          success:
            false,

          message:
            'Database views belum dikonfigurasi.',

          views:
            0,
        },
        {
          status:
            503,

          headers:
            NO_CACHE_HEADERS,
        }
      );
    }

    // ========================================================================
    // READ VIEW
    // ========================================================================

    const {
      data,
      error,
    } =
      await supabase
        .from(
          'content_views'
        )
        .select(
          'views'
        )
        .eq(
          'content_type',
          type
        )
        .eq(
          'content_key',
          key
        )
        .maybeSingle();

    if (error) {
      console.error(
        `[${SITE_NAME}] Supabase GET views error:`,
        error
      );

      return NextResponse.json(
        {
          success:
            false,

          message:
            'Gagal membaca jumlah views.',

          views:
            0,
        },
        {
          status:
            500,

          headers:
            NO_CACHE_HEADERS,
        }
      );
    }

    // ========================================================================
    // RESPONSE
    // ========================================================================

    return NextResponse.json(
      {
        success:
          true,

        type,

        key,

        views:
          normalizeViewCount(
            data?.views
          ),
      },
      {
        status:
          200,

        headers:
          NO_CACHE_HEADERS,
      }
    );
  } catch (error) {
    console.error(
      `[${SITE_NAME}] GET /api/views error:`,
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        message:
          'Terjadi kesalahan saat membaca views.',

        views:
          0,
      },
      {
        status:
          500,

        headers:
          NO_CACHE_HEADERS,
      }
    );
  }
}

// ============================================================================
// POST
// ============================================================================
//
// Digunakan untuk MENAMBAH views.
//
// Body:
//
// {
//   "type": "news",
//   "key": "slug-artikel"
// }
//
// Kompatibilitas lama:
//
// {
//   "type": "blog",
//   "key": "slug-artikel"
// }
//
// "blog" otomatis dikonversi menjadi "news".
//
// ============================================================================

export async function POST(
  request: NextRequest
) {
  try {
    // ========================================================================
    // USER AGENT
    // ========================================================================

    const userAgent =
      request.headers.get(
        'user-agent'
      ) || '';

    // ========================================================================
    // BODY
    // ========================================================================

    const body =
      (await request
        .json()
        .catch(
          () => null
        )) as ViewRequestBody | null;

    // ========================================================================
    // BODY VALIDATION
    // ========================================================================

    if (!body) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            'Body request tidak valid.',

          views:
            0,
        },
        {
          status:
            400,

          headers:
            NO_CACHE_HEADERS,
        }
      );
    }

    const rawType =
      body.type;

    const rawKey =
      body.key;

    if (
      !isValidType(rawType) ||
      !isValidKey(rawKey)
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            'Data views tidak valid.',

          views:
            0,
        },
        {
          status:
            400,

          headers:
            NO_CACHE_HEADERS,
        }
      );
    }

    // ========================================================================
    // NORMALIZE
    // ========================================================================

    const type =
      normalizeType(
        rawType
      );

    const key =
      normalizeKey(
        rawKey
      );

    // ========================================================================
    // SUPABASE CONFIG
    // ========================================================================

    const supabase =
      getSupabase();

    if (!supabase) {
      console.error(
        `[${SITE_NAME}] POST views: Supabase belum dikonfigurasi.`
      );

      return NextResponse.json(
        {
          success:
            false,

          message:
            'Database views belum dikonfigurasi.',

          views:
            0,
        },
        {
          status:
            503,

          headers:
            NO_CACHE_HEADERS,
        }
      );
    }

    // ========================================================================
    // BOT CHECK
    // ========================================================================
    //
    // Bot hanya membaca jumlah view saat ini.
    //
    // TIDAK menjalankan increment_content_view.
    //
    // ========================================================================

    if (
      isBot(
        userAgent
      )
    ) {
      const current =
        await getCurrentViews(
          type,
          key
        );

      if (current.error) {
        console.error(
          `[${SITE_NAME}] Bot view read error:`,
          current.error
        );
      }

      return NextResponse.json(
        {
          success:
            true,

          ignored:
            true,

          reason:
            'bot',

          type,

          key,

          views:
            current.views,
        },
        {
          status:
            200,

          headers:
            NO_CACHE_HEADERS,
        }
      );
    }

    // ========================================================================
    // INCREMENT VIEW VIA RPC
    // ========================================================================
    //
    // SQL:
    //
    // public.increment_content_view(
    //   p_type text,
    //   p_key text
    // )
    //
    // Function ini menggunakan INSERT ... ON CONFLICT sehingga increment
    // bersifat atomic dan aman ketika ada beberapa request bersamaan.
    //
    // ========================================================================

    const {
      data,
      error,
    } =
      await supabase.rpc(
        'increment_content_view',
        {
          p_type:
            type,

          p_key:
            key,
        }
      );

    // ========================================================================
    // RPC ERROR
    // ========================================================================

    if (error) {
      console.error(
        `[${SITE_NAME}] increment_content_view error:`,
        error
      );

      return NextResponse.json(
        {
          success:
            false,

          message:
            'Gagal menambahkan jumlah views.',

          views:
            0,
        },
        {
          status:
            500,

          headers:
            NO_CACHE_HEADERS,
        }
      );
    }

    // ========================================================================
    // RESPONSE
    // ========================================================================

    return NextResponse.json(
      {
        success:
          true,

        ignored:
          false,

        type,

        key,

        views:
          normalizeViewCount(
            data
          ),
      },
      {
        status:
          200,

        headers:
          NO_CACHE_HEADERS,
      }
    );
  } catch (error) {
    console.error(
      `[${SITE_NAME}] POST /api/views error:`,
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        message:
          'Terjadi kesalahan saat mencatat views.',

        views:
          0,
      },
      {
        status:
          500,

        headers:
          NO_CACHE_HEADERS,
      }
    );
  }
}