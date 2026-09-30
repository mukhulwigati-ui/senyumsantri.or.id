// app/api/webhook/fundraiser/route.ts

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ============================================================================
// CONFIG
// ============================================================================

const SITE_NAME =
  'Pondok Matan Darussalam';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://senyumsantri.or.id';

const FUNDRAISER_STATS_URL =
  `${SITE_URL}/fundraiser/stats`;

// ============================================================================
// TYPES
// ============================================================================

interface FundraiserWebhookPayload {
  name?: unknown;
  phone?: unknown;
  status?: unknown;
  programTitle?: unknown;
}

// ============================================================================
// HELPERS
// ============================================================================

function normalizePhone(
  value: unknown
): string {
  let phone =
    String(value || '')
      .replace(/\D/g, '');

  if (!phone) {
    return '';
  }

  // 0812xxxx -> 62812xxxx
  if (phone.startsWith('0')) {
    phone =
      `62${phone.slice(1)}`;
  }

  // 812xxxx -> 62812xxxx
  else if (phone.startsWith('8')) {
    phone =
      `62${phone}`;
  }

  return phone;
}

function isValidPhone(
  phone: string
): boolean {
  return /^62[0-9]{8,13}$/.test(
    phone
  );
}

function getDisplayPhone(
  phone: string
): string {
  if (phone.startsWith('62')) {
    return `0${phone.slice(2)}`;
  }

  return phone;
}

function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi gangguan internal saat memproses webhook fundraiser.';
}

// ============================================================================
// POST WEBHOOK
// ============================================================================

export async function POST(
  request: Request
) {
  try {
    // =========================================================================
    // 1. PARSE PAYLOAD
    // =========================================================================

    const body =
      await request
        .json()
        .catch(() => null) as
        FundraiserWebhookPayload | null;

    if (
      !body ||
      typeof body !== 'object'
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Payload webhook tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================================
    // 2. AMBIL DATA
    // =========================================================================

    const name =
      typeof body.name === 'string'
        ? body.name.trim()
        : '';

    const rawPhone =
      typeof body.phone === 'string'
        ? body.phone.trim()
        : '';

    const status =
      typeof body.status === 'string'
        ? body.status
            .trim()
            .toLowerCase()
        : '';

    const programTitle =
      typeof body.programTitle === 'string' &&
      body.programTitle.trim()
        ? body.programTitle.trim()
        : 'Program Kebaikan';

    // =========================================================================
    // 3. STATUS
    // =========================================================================

    if (
      status !== 'approved'
    ) {
      return NextResponse.json(
        {
          success: true,
          skipped: true,
          message:
            `Webhook diterima. Status "${status || '-'}" tidak memerlukan notifikasi.`,
        },
        {
          status: 200,
        }
      );
    }

    // =========================================================================
    // 4. VALIDASI NAMA
    // =========================================================================

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Nama fundraiser tidak ditemukan.',
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================================
    // 5. VALIDASI WHATSAPP
    // =========================================================================

    if (!rawPhone) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Nomor WhatsApp fundraiser tidak ditemukan.',
        },
        {
          status: 400,
        }
      );
    }

    const phone =
      normalizePhone(
        rawPhone
      );

    if (
      !isValidPhone(
        phone
      )
    ) {
      console.error(
        `[${SITE_NAME}] Nomor fundraiser tidak valid:`,
        rawPhone
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Nomor WhatsApp fundraiser tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    const displayPhone =
      getDisplayPhone(
        phone
      );

    // =========================================================================
    // 6. CEK FONNTE TOKEN
    // =========================================================================

    const fonnteToken =
      process.env
        .FONNTE_TOKEN
        ?.trim() ||
      '';

    if (!fonnteToken) {
      console.error(
        `[${SITE_NAME}] FONNTE_TOKEN belum dikonfigurasi.`
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Layanan WhatsApp belum dikonfigurasi.',
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================================
    // 7. PESAN WHATSAPP
    // =========================================================================

    const messageText =
      `*Pendaftaran Fundraiser ${SITE_NAME} Disetujui!* 🎉\n\n` +

      `Assalamu'alaikum *${name}*,\n\n` +

      `Alhamdulillah, pendaftaran Anda sebagai fundraiser untuk program:\n\n` +

      `*${programTitle}*\n\n` +

      `telah resmi *DISETUJUI & DIAKTIFKAN* oleh admin ${SITE_NAME}.\n\n` +

      `Anda sekarang dapat mengambil tautan fundraiser pribadi dan memantau perolehan donasi melalui halaman berikut:\n\n` +

      `👉 ${FUNDRAISER_STATS_URL}\n\n` +

      `Masukkan nomor WhatsApp yang digunakan saat mendaftar:\n` +

      `*${displayPhone}*\n\n` +

      `Di halaman tersebut Anda dapat melihat tautan fundraiser pribadi, jumlah dana yang berhasil dihimpun, serta perkembangan donasi melalui tautan Anda.\n\n` +

      `Silakan bagikan tautan fundraiser kepada keluarga, sahabat, dan masyarakat agar semakin banyak yang ikut mendukung program kebaikan ini.\n\n` +

      `Jazakumullahu khairan katsiran atas kontribusi dan partisipasi Anda. 🤲\n\n` +

      `*${SITE_NAME}*\n` +
      `${SITE_URL}`;

    // =========================================================================
    // 8. KIRIM FONNTE
    // =========================================================================

    const resFonnte =
      await fetch(
        'https://api.fonnte.com/send',
        {
          method: 'POST',

          headers: {
            Authorization:
              fonnteToken,

            'Content-Type':
              'application/x-www-form-urlencoded',
          },

          body:
            new URLSearchParams({
              target:
                phone,

              message:
                messageText,
            }),

          cache:
            'no-store',
        }
      );

    // =========================================================================
    // 9. BACA RESPONSE
    // =========================================================================

    const responseText =
      await resFonnte
        .text()
        .catch(() => '');

    let fonnteResult:
      unknown =
      responseText;

    if (responseText) {
      try {
        fonnteResult =
          JSON.parse(
            responseText
          );
      } catch {
        // Response Fonnte bukan JSON.
        fonnteResult =
          responseText;
      }
    }

    // =========================================================================
    // 10. CEK RESPONSE HTTP
    // =========================================================================

    if (
      !resFonnte.ok
    ) {
      console.error(
        `[${SITE_NAME}] Gagal mengirim notifikasi fundraiser:`,
        {
          name,
          phone,
          status:
            resFonnte.status,
          response:
            fonnteResult,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Webhook berhasil diterima, tetapi notifikasi WhatsApp gagal dikirim.',
        },
        {
          status: 502,
        }
      );
    }

    // =========================================================================
    // 11. VALIDASI RESPONSE FONNTE
    // =========================================================================
    //
    // Sebagian response Fonnte tetap HTTP 200 walaupun mempunyai informasi
    // kegagalan di JSON. Karena format dapat berubah, kita hanya melakukan
    // pengecekan sederhana tanpa membuat integrasi terlalu bergantung pada
    // struktur response tertentu.
    // =========================================================================

    if (
      fonnteResult &&
      typeof fonnteResult === 'object' &&
      'status' in fonnteResult
    ) {
      const resultStatus =
        (
          fonnteResult as {
            status?: unknown;
          }
        ).status;

      if (
        resultStatus === false
      ) {
        console.error(
          `[${SITE_NAME}] Fonnte menolak pengiriman:`,
          fonnteResult
        );

        return NextResponse.json(
          {
            success: false,
            message:
              'Notifikasi WhatsApp belum berhasil dikirim.',
          },
          {
            status: 502,
          }
        );
      }
    }

    // =========================================================================
    // 12. LOG
    // =========================================================================

    console.log(
      `[${SITE_NAME}] Notifikasi fundraiser berhasil dikirim:`,
      {
        name,
        phone,
        programTitle,
      }
    );

    // =========================================================================
    // 13. SUCCESS
    // =========================================================================

    return NextResponse.json(
      {
        success: true,

        message:
          'Webhook fundraiser berhasil diproses dan notifikasi WhatsApp telah dikirim.',

        data: {
          name,
          phone:
            displayPhone,

          programTitle,

          statsUrl:
            FUNDRAISER_STATS_URL,

          site:
            SITE_NAME,

          siteUrl:
            SITE_URL,
        },
      },
      {
        status: 200,
      }
    );
  } catch (
    error: unknown
  ) {
    // =========================================================================
    // GLOBAL ERROR
    // =========================================================================

    console.error(
      `[${SITE_NAME}] Webhook Fundraiser Error:`,
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          getErrorMessage(
            error
          ),
      },
      {
        status: 500,
      }
    );
  }
}