import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic';

// ============================================================================
// CONFIG
// ============================================================================

const SITE_NAME = 'Pondok Matan Darussalam';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://senyum.or.id';

const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
  'lsnco71s';

const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
  'production';

const SANITY_WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN?.trim() ||
  '';

// ============================================================================
// SANITY CLIENT
// ============================================================================
//
// JANGAN PERNAH memasukkan token Sanity langsung ke source code.
//
// Vercel:
// SANITY_API_WRITE_TOKEN=xxxxxxxx
//
// ============================================================================

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  apiVersion: '2026-09-25',
  token: SANITY_WRITE_TOKEN || undefined,
});

// ============================================================================
// PAYMENT METHOD
// ============================================================================
//
// Batasi payment method agar nilai dari frontend tidak dapat sembarangan
// digunakan sebagai bagian URL Pakasir.
//
// Tambahkan metode lain di sini jika memang tersedia di akun Pakasir Anda.
//
// ============================================================================

const ALLOWED_PAYMENT_METHODS = [
  'qris',
  'bri_va',
  'bni_va',
  'mandiri_va',
  'permata_va',
] as const;

type PaymentMethod =
  (typeof ALLOWED_PAYMENT_METHODS)[number];

function isValidPaymentMethod(
  value: string
): value is PaymentMethod {
  return ALLOWED_PAYMENT_METHODS.includes(
    value as PaymentMethod
  );
}

// ============================================================================
// HELPER
// ============================================================================

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi gangguan pada server.';
}

// ============================================================================
// POST CHECKOUT
// ============================================================================

export async function POST(request: Request) {
  try {
    // =========================================================================
    // 1. VALIDASI KONFIGURASI SERVER
    // =========================================================================

    if (!SANITY_WRITE_TOKEN) {
      console.error(
        `[${SITE_NAME}] SANITY_API_WRITE_TOKEN belum dikonfigurasi.`
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Konfigurasi server belum lengkap. Silakan hubungi administrator.',
        },
        {
          status: 500,
        }
      );
    }

    const pakasirApiKey =
      process.env.PAKASIR_API_KEY?.trim() ||
      '';

    const pakasirProjectSlug =
      process.env.PAKASIR_PROJECT_SLUG?.trim() ||
      '';

    if (!pakasirApiKey) {
      console.error(
        `[${SITE_NAME}] PAKASIR_API_KEY belum dikonfigurasi.`
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Konfigurasi payment gateway belum lengkap.',
        },
        {
          status: 500,
        }
      );
    }

    if (!pakasirProjectSlug) {
      console.error(
        `[${SITE_NAME}] PAKASIR_PROJECT_SLUG belum dikonfigurasi.`
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Project payment gateway belum dikonfigurasi.',
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================================
    // 2. PARSE BODY
    // =========================================================================

    const body =
      await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          success: false,
          error: 'Format data transaksi tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================================
    // 3. DATA DONATUR
    // =========================================================================

    const slug =
      typeof body.slug === 'string'
        ? body.slug.trim()
        : '';

    const donorName =
      typeof body.donorName === 'string' &&
      body.donorName.trim()
        ? body.donorName.trim()
        : typeof body.name === 'string' &&
            body.name.trim()
          ? body.name.trim()
          : 'Hamba Allah';

    const donorPhone =
      typeof body.donorPhone === 'string'
        ? body.donorPhone.trim()
        : typeof body.phone === 'string'
          ? body.phone.trim()
          : typeof body.whatsapp === 'string'
            ? body.whatsapp.trim()
            : '';

    // =========================================================================
    // 4. DATA FUNDRAISER / REFERRAL
    // =========================================================================

    const fundraiserPhone =
      typeof body.fundraiserPhone === 'string'
        ? body.fundraiserPhone.trim()
        : typeof body.referral === 'string'
          ? body.referral.trim()
          : '';

    // =========================================================================
    // 5. PAYMENT METHOD
    // =========================================================================

    const rawPaymentMethod =
      typeof body.paymentMethod === 'string'
        ? body.paymentMethod
        : 'qris';

    const cleanMethod =
      rawPaymentMethod
        .toLowerCase()
        .trim();

    if (!isValidPaymentMethod(cleanMethod)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Metode pembayaran tidak tersedia.',
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================================
    // 6. NOMINAL
    // =========================================================================

    const rawAmount =
      body.amount ??
      body.nominal ??
      0;

    const cleanAmountNumber =
      Number(
        String(rawAmount).replace(/\D/g, '')
      );

    // Minimal Rp1.000
    if (
      !slug ||
      !Number.isFinite(cleanAmountNumber) ||
      cleanAmountNumber < 1000
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Data tidak valid. Minimal donasi adalah Rp 1.000.',
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================================
    // 7. GENERATE ORDER ID
    // =========================================================================

    const cleanSlug =
      slug.toUpperCase();

    let prefix = 'MATAN';

    if (cleanSlug.includes('ASRAMA')) {
      prefix = 'ASRAMA';
    } else if (
      cleanSlug.includes('SANTRI')
    ) {
      prefix = 'SANTRI';
    } else if (
      cleanSlug.includes('TAHFIDZ')
    ) {
      prefix = 'TAHFIDZ';
    } else if (
      cleanSlug.includes('WAKAF')
    ) {
      prefix = 'WAKAF';
    } else if (
      cleanSlug.includes('ZAKAT')
    ) {
      prefix = 'ZAKAT';
    }

    const generatedOrderId =
      `INV-${prefix}-${Date.now()}`;

    // =========================================================================
    // 8. CREATE TRANSACTION KE PAKASIR
    // =========================================================================

    const targetPakasirUrl =
      `https://app.pakasir.com/api/transactioncreate/${cleanMethod}`;

    const pakasirResponse =
      await fetch(
        targetPakasirUrl,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            project:
              pakasirProjectSlug,

            order_id:
              generatedOrderId,

            amount:
              cleanAmountNumber,

            api_key:
              pakasirApiKey,
          }),

          cache: 'no-store',
        }
      );

    // =========================================================================
    // 9. PARSE RESPONSE PAKASIR
    // =========================================================================

    const pakasirData =
      await pakasirResponse
        .json()
        .catch(() => null);

    if (
      !pakasirResponse.ok ||
      !pakasirData ||
      !pakasirData.payment
    ) {
      const gatewayMessage =
        pakasirData &&
        typeof pakasirData.message === 'string'
          ? pakasirData.message
          : `Gagal membuat transaksi ${cleanMethod} melalui Pakasir.`;

      throw new Error(
        gatewayMessage
      );
    }

    // =========================================================================
    // 10. PAYMENT INFO
    // =========================================================================

    const paymentNumber =
      typeof pakasirData.payment.payment_number ===
      'string'
        ? pakasirData.payment.payment_number
        : '';

    const gatewayPaymentUrl =
      typeof pakasirData.payment.payment_url ===
      'string'
        ? pakasirData.payment.payment_url
        : '';

    const totalPaymentValue =
      Number(
        pakasirData.payment.total_payment
      );

    const totalPayment =
      Number.isFinite(totalPaymentValue) &&
      totalPaymentValue > 0
        ? totalPaymentValue
        : cleanAmountNumber;

    // =========================================================================
    // 11. FALLBACK PAYMENT URL
    // =========================================================================

    const isQrisOnly =
      cleanMethod === 'qris'
        ? '&qris_only=1'
        : '';

    const thankYouUrl =
      `${SITE_URL}/thank-you?order_id=${encodeURIComponent(
        generatedOrderId
      )}`;

    const fallbackUrlWeb =
      `https://app.pakasir.com/pay/` +
      `${encodeURIComponent(
        pakasirProjectSlug
      )}/` +
      `${cleanAmountNumber}` +
      `?order_id=${encodeURIComponent(
        generatedOrderId
      )}` +
      `${isQrisOnly}` +
      `&redirect=${encodeURIComponent(
        thankYouUrl
      )}`;

    const paymentUrl =
      gatewayPaymentUrl ||
      fallbackUrlWeb;

    // =========================================================================
    // 12. WAKTU WIB
    // =========================================================================

    const createdAtIso =
      new Date().toISOString();

    const currentWibTimestamp =
      new Date().toLocaleString(
        'id-ID',
        {
          timeZone: 'Asia/Jakarta',
          dateStyle: 'medium',
          timeStyle: 'medium',
        }
      );

    // =========================================================================
    // 13. SIMPAN TRANSAKSI KE SANITY
    // =========================================================================

    await client.create({
      _type:
        'donationTransaction',

      orderId:
        generatedOrderId,

      donorName:
        donorName,

      donorPhone:
        donorPhone,

      amount:
        cleanAmountNumber,

      totalAmount:
        totalPayment,

      status:
        'pending',

      slug:
        slug,

      paymentMethod:
        cleanMethod,

      paymentUrl:
        paymentUrl,

      paymentNumber:
        paymentNumber,

      fundraiserPhone:
        fundraiserPhone,

      // Format ISO bagus untuk query/sorting
      createdAt:
        createdAtIso,

      // Format manusia untuk tampilan/admin
      createdAtWib:
        currentWibTimestamp,
    });

    console.log(
      `[${SITE_NAME}] Transaksi berhasil dicatat:`,
      generatedOrderId,
      currentWibTimestamp
    );

    // =========================================================================
    // 14. SYNC GOOGLE SHEET
    // =========================================================================

    const googleSheetScriptUrl =
      process.env
        .GOOGLE_SHEET_WEBHOOK_URL
        ?.trim() ||
      '';

    if (googleSheetScriptUrl) {
      try {
        const sheetResponse =
          await fetch(
            googleSheetScriptUrl,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                orderId:
                  generatedOrderId,

                donorName:
                  donorName,

                // Petik tunggal agar nomor 08
                // tidak diubah Google Sheets.
                donorPhone:
                  donorPhone
                    ? `'${donorPhone}`
                    : '',

                amount:
                  cleanAmountNumber,

                totalAmount:
                  totalPayment,

                programSlug:
                  slug,

                paymentMethod:
                  cleanMethod,

                fundraiserPhone:
                  fundraiserPhone
                    ? `'${fundraiserPhone}`
                    : '-',

                status:
                  'pending',

                createdAt:
                  currentWibTimestamp,

                site:
                  SITE_NAME,
              }),
            }
          );

        if (!sheetResponse.ok) {
          const sheetErrorText =
            await sheetResponse
              .text()
              .catch(() => '');

          console.error(
            `[${SITE_NAME}] Google Sheet merespons error:`,
            {
              status:
                sheetResponse.status,

              response:
                sheetErrorText,
            }
          );
        } else {
          console.log(
            `[${SITE_NAME}] Data berhasil sinkron ke Google Sheet:`,
            generatedOrderId
          );
        }
      } catch (sheetError) {
        console.error(
          `[${SITE_NAME}] Gagal sinkron ke Google Sheet:`,
          sheetError
        );
      }
    } else {
      console.warn(
        `[${SITE_NAME}] GOOGLE_SHEET_WEBHOOK_URL belum dikonfigurasi.`
      );
    }

    // =========================================================================
    // 15. SUCCESS RESPONSE
    // =========================================================================

    return NextResponse.json({
      success: true,

      orderId:
        generatedOrderId,

      amount:
        cleanAmountNumber,

      totalAmount:
        totalPayment,

      paymentMethod:
        cleanMethod,

      paymentUrl:
        paymentUrl,

      paymentNumber:
        paymentNumber,
    });
  } catch (error: unknown) {
    // =========================================================================
    // GLOBAL ERROR
    // =========================================================================

    console.error(
      `[${SITE_NAME}] BACKEND CHECKOUT ERROR VIA PAKASIR:`,
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          getErrorMessage(error),
      },
      {
        status: 500,
      }
    );
  }
}