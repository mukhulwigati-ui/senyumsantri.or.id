import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ============================================================================
// CONFIG
// ============================================================================

const SITE_NAME = 'Pondok Matan Darussalam';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://senyumsantri.or.id';

const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
  'lsnco71s';

const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
  'production';

const SANITY_WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN?.trim() ||
  '';

const PAKASIR_API_KEY =
  process.env.PAKASIR_API_KEY?.trim() ||
  '';

const PAKASIR_PROJECT_SLUG =
  process.env.PAKASIR_PROJECT_SLUG?.trim() ||
  '';

// ============================================================================
// SANITY CLIENT
// ============================================================================

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  apiVersion: '2026-09-30',
  token: SANITY_WRITE_TOKEN || undefined,
});

// ============================================================================
// PAYMENT METHODS - PAKASIR V2
// ============================================================================

const ALLOWED_PAYMENT_METHODS = [
  'payment_link',
  'qris',
  'bri_va',
  'bni_va',
  'cimb_niaga_va',
  'permata_va',
  'maybank_va',
  'bnc_va',
  'artha_graha_va',
  'sampoerna_va',
] as const;

type PaymentMethod =
  (typeof ALLOWED_PAYMENT_METHODS)[number];

// ============================================================================
// PAKASIR RESPONSE
// ============================================================================

interface PakasirCreateResponse {
  txn_id?: string;

  project?: string;
  order_id?: string;

  amount?: number;
  fee?: number;
  total_payment?: number;

  payment_method?: string;

  qr_string?: string;
  va_number?: string;

  expired_at?: string;

  payment_link?: string;

  is_sandbox?: boolean;

  message?: string;
  error?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function isValidPaymentMethod(
  value: string
): value is PaymentMethod {
  return ALLOWED_PAYMENT_METHODS.includes(
    value as PaymentMethod
  );
}

function getMinimumAmount(
  method: PaymentMethod
): number {
  if (
    method === 'payment_link' ||
    method === 'qris'
  ) {
    return 500;
  }

  return 10000;
}

function getMaximumAmount(
  method: PaymentMethod
): number {
  if (method === 'qris') {
    return 10000000;
  }

  return 50000000;
}

function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi gangguan pada server.';
}

function formatRupiah(
  value: number
): string {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(value);
}

// ============================================================================
// POST CHECKOUT
// ============================================================================

export async function POST(
  request: Request
) {
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
            'Konfigurasi Sanity server belum lengkap.',
        },
        {
          status: 500,
        }
      );
    }

    if (!PAKASIR_API_KEY) {
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

    if (!PAKASIR_PROJECT_SLUG) {
      console.error(
        `[${SITE_NAME}] PAKASIR_PROJECT_SLUG belum dikonfigurasi.`
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Project Pakasir belum dikonfigurasi.',
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
      await request
        .json()
        .catch(() => null);

    if (
      !body ||
      typeof body !== 'object'
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Format data transaksi tidak valid.',
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
    // 4. FUNDRAISER
    // =========================================================================

    const fundraiserPhone =
      typeof body.fundraiserPhone ===
        'string'
        ? body.fundraiserPhone.trim()
        : typeof body.referral ===
            'string'
          ? body.referral.trim()
          : '';

    // =========================================================================
    // 5. PAYMENT METHOD
    // =========================================================================

    const rawPaymentMethod =
      typeof body.paymentMethod ===
        'string'
        ? body.paymentMethod
        : 'qris';

    const cleanMethod =
      rawPaymentMethod
        .toLowerCase()
        .trim();

    if (
      !isValidPaymentMethod(
        cleanMethod
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Metode pembayaran "${cleanMethod}" tidak tersedia.`,
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
        String(rawAmount)
          .replace(/\D/g, '')
      );

    if (
      !slug ||
      !Number.isFinite(
        cleanAmountNumber
      ) ||
      cleanAmountNumber <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Data transaksi tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================================
    // 7. VALIDASI MINIMAL & MAKSIMAL
    // =========================================================================

    const minimumAmount =
      getMinimumAmount(
        cleanMethod
      );

    const maximumAmount =
      getMaximumAmount(
        cleanMethod
      );

    if (
      cleanAmountNumber <
      minimumAmount
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Minimal pembayaran untuk ${cleanMethod.toUpperCase()} adalah Rp ${formatRupiah(minimumAmount)}.`,
        },
        {
          status: 400,
        }
      );
    }

    if (
      cleanAmountNumber >
      maximumAmount
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `Maksimal pembayaran untuk ${cleanMethod.toUpperCase()} adalah Rp ${formatRupiah(maximumAmount)}.`,
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================================
    // 8. GENERATE ORDER ID
    // =========================================================================

    const cleanSlug =
      slug.toUpperCase();

    let prefix =
      'MATAN';

    if (
      cleanSlug.includes(
        'ASRAMA'
      )
    ) {
      prefix =
        'ASRAMA';
    } else if (
      cleanSlug.includes(
        'SANTRI'
      )
    ) {
      prefix =
        'SANTRI';
    } else if (
      cleanSlug.includes(
        'TAHFIDZ'
      )
    ) {
      prefix =
        'TAHFIDZ';
    } else if (
      cleanSlug.includes(
        'WAKAF'
      )
    ) {
      prefix =
        'WAKAF';
    } else if (
      cleanSlug.includes(
        'ZAKAT'
      )
    ) {
      prefix =
        'ZAKAT';
    }

    const generatedOrderId =
      `INV-${prefix}-${Date.now()}`;

    // =========================================================================
    // 9. PAKASIR V2 ENDPOINT
    // =========================================================================

    const targetPakasirUrl =
      `https://app.pakasir.com/api/v2/create-transaction/` +
      `${encodeURIComponent(PAKASIR_PROJECT_SLUG)}/` +
      `${encodeURIComponent(generatedOrderId)}`;

    console.log(
      `[${SITE_NAME}] Membuat transaksi Pakasir v2:`,
      generatedOrderId
    );

    // =========================================================================
    // 10. CREATE TRANSACTION
    // =========================================================================

    const pakasirResponse =
      await fetch(
        targetPakasirUrl,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            'X-Api-Key':
              PAKASIR_API_KEY,
          },

          body:
            JSON.stringify({
              method:
                cleanMethod,

              amount:
                cleanAmountNumber,
            }),

          cache:
            'no-store',
        }
      );

    // =========================================================================
    // 11. PARSE RESPONSE
    // =========================================================================

    const pakasirData:
      PakasirCreateResponse | null =
      await pakasirResponse
        .json()
        .catch(() => null);

    if (
      !pakasirResponse.ok ||
      !pakasirData
    ) {
      throw new Error(
        pakasirData?.message ||
          pakasirData?.error ||
          `Gagal membuat transaksi Pakasir. HTTP ${pakasirResponse.status}`
      );
    }

    // =========================================================================
    // 12. TXN ID
    // =========================================================================

    const txnId =
      String(
        pakasirData.txn_id ||
        ''
      ).trim();

    if (!txnId) {
      throw new Error(
        'Pakasir tidak mengembalikan txn_id.'
      );
    }

    // =========================================================================
    // 13. VALIDASI RESPONSE
    // =========================================================================

    if (
      pakasirData.order_id &&
      pakasirData.order_id !==
        generatedOrderId
    ) {
      throw new Error(
        'Order ID Pakasir tidak cocok.'
      );
    }

    if (
      pakasirData.amount !==
        undefined &&
      Number(
        pakasirData.amount
      ) !== cleanAmountNumber
    ) {
      throw new Error(
        'Nominal transaksi Pakasir tidak cocok.'
      );
    }

    if (
      pakasirData.project &&
      pakasirData.project !==
        PAKASIR_PROJECT_SLUG
    ) {
      throw new Error(
        'Project Pakasir tidak cocok.'
      );
    }

    // =========================================================================
    // 14. PAYMENT DATA
    // =========================================================================

    const fee =
      Number(
        pakasirData.fee || 0
      );

    const totalPayment =
      Number(
        pakasirData.total_payment ||
        cleanAmountNumber
      );

    const paymentMethod =
      String(
        pakasirData.payment_method ||
        cleanMethod
      );

    const qrString =
      String(
        pakasirData.qr_string ||
        ''
      );

    const vaNumber =
      String(
        pakasirData.va_number ||
        ''
      );

    const expiredAt =
      pakasirData.expired_at
        ? String(
            pakasirData.expired_at
          )
        : null;

    const isSandbox =
      Boolean(
        pakasirData.is_sandbox
      );

    // =========================================================================
    // 15. PAYMENT URL
    // =========================================================================

    const thankYouUrl =
      `${SITE_URL}/thank-you?order_id=${encodeURIComponent(generatedOrderId)}`;

    let paymentUrl =
      '';

    // =========================================================================
    // PAYMENT LINK MODE
    // =========================================================================

    if (
      cleanMethod ===
      'payment_link'
    ) {
      const rawPaymentLink =
        String(
          pakasirData.payment_link ||
          ''
        ).trim();

      if (!rawPaymentLink) {
        throw new Error(
          'Pakasir tidak mengembalikan payment_link.'
        );
      }

      const separator =
        rawPaymentLink.includes('?')
          ? '&'
          : '?';

      paymentUrl =
        `${rawPaymentLink}` +
        `${separator}` +
        `redirect=${encodeURIComponent(thankYouUrl)}`;
    }

    // =========================================================================
    // QRIS & VIRTUAL ACCOUNT
    // =========================================================================

    else {
      const params =
        new URLSearchParams();

      if (
        cleanMethod ===
        'qris'
      ) {
        params.set(
          'qris_only',
          '1'
        );
      }

      params.set(
        'redirect',
        thankYouUrl
      );

      paymentUrl =
        `https://app.pakasir.com/pay-v2/` +
        `${encodeURIComponent(txnId)}` +
        `?${params.toString()}`;
    }

    // =========================================================================
    // 16. WAKTU
    // =========================================================================

    const createdAtIso =
      new Date().toISOString();

    const currentWibTimestamp =
      new Date().toLocaleString(
        'id-ID',
        {
          timeZone:
            'Asia/Jakarta',

          dateStyle:
            'medium',

          timeStyle:
            'medium',
        }
      );

    // =========================================================================
    // 17. SIMPAN SANITY
    // =========================================================================

    const createdTransaction =
      await client.create({
        _type:
          'donationTransaction',

        // ---------------------------------------------------------------------
        // ID TRANSAKSI
        // ---------------------------------------------------------------------

        txnId:
          txnId,

        orderId:
          generatedOrderId,

        pakasirProject:
          PAKASIR_PROJECT_SLUG,

        // ---------------------------------------------------------------------
        // DONATUR
        // ---------------------------------------------------------------------

        donorName:
          donorName,

        donorPhone:
          donorPhone,

        // ---------------------------------------------------------------------
        // PROGRAM
        // ---------------------------------------------------------------------

        slug:
          slug,

        // ---------------------------------------------------------------------
        // NOMINAL
        // ---------------------------------------------------------------------

        amount:
          cleanAmountNumber,

        fee:
          fee,

        totalAmount:
          totalPayment,

        // ---------------------------------------------------------------------
        // PAYMENT
        // ---------------------------------------------------------------------

        paymentMethod:
          paymentMethod,

        paymentUrl:
          paymentUrl,

        qrString:
          qrString,

        vaNumber:
          vaNumber,

        expiredAt:
          expiredAt,

        isSandbox:
          isSandbox,

        // ---------------------------------------------------------------------
        // STATUS
        // ---------------------------------------------------------------------

        status:
          'pending',

        gatewayStatus:
          'pending',

        // ---------------------------------------------------------------------
        // FUNDRAISER
        // ---------------------------------------------------------------------

        fundraiserPhone:
          fundraiserPhone,

        // ---------------------------------------------------------------------
        // TIME
        // ---------------------------------------------------------------------

        createdAt:
          createdAtIso,

        createdAtWib:
          currentWibTimestamp,

        // ---------------------------------------------------------------------
        // WEBSITE
        // ---------------------------------------------------------------------

        siteName:
          SITE_NAME,

        siteUrl:
          SITE_URL,
      });

    console.log(
      `[${SITE_NAME}] Transaksi Sanity berhasil dicatat:`,
      {
        id:
          createdTransaction._id,

        orderId:
          generatedOrderId,

        txnId:
          txnId,
      }
    );

    // =========================================================================
    // 18. GOOGLE SHEET
    // =========================================================================

    const googleSheetScriptUrl =
      process.env
        .GOOGLE_SHEET_WEBHOOK_URL
        ?.trim() ||
      '';

    if (
      googleSheetScriptUrl
    ) {
      try {
        const sheetResponse =
          await fetch(
            googleSheetScriptUrl,
            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  txnId:
                    txnId,

                  orderId:
                    generatedOrderId,

                  donorName:
                    donorName,

                  donorPhone:
                    donorPhone
                      ? `'${donorPhone}`
                      : '',

                  amount:
                    cleanAmountNumber,

                  fee:
                    fee,

                  totalAmount:
                    totalPayment,

                  programSlug:
                    slug,

                  paymentMethod:
                    paymentMethod,

                  fundraiserPhone:
                    fundraiserPhone
                      ? `'${fundraiserPhone}`
                      : '-',

                  status:
                    'pending',

                  expiredAt:
                    expiredAt,

                  createdAt:
                    currentWibTimestamp,

                  site:
                    SITE_NAME,

                  siteUrl:
                    SITE_URL,
                }),
            }
          );

        if (
          !sheetResponse.ok
        ) {
          const sheetErrorText =
            await sheetResponse
              .text()
              .catch(
                () => ''
              );

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
            `[${SITE_NAME}] Google Sheet berhasil:`,
            generatedOrderId
          );
        }
      } catch (
        sheetError
      ) {
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
    // 19. RESPONSE KE FRONTEND
    // =========================================================================

    return NextResponse.json({
      success:
        true,

      txnId:
        txnId,

      orderId:
        generatedOrderId,

      amount:
        cleanAmountNumber,

      fee:
        fee,

      totalAmount:
        totalPayment,

      paymentMethod:
        paymentMethod,

      paymentUrl:
        paymentUrl,

      qrString:
        qrString,

      vaNumber:
        vaNumber,

      expiredAt:
        expiredAt,

      isSandbox:
        isSandbox,

      // -----------------------------------------------------------------------
      // KOMPATIBILITAS FRONTEND LAMA
      // -----------------------------------------------------------------------

      paymentNumber:
        vaNumber,
    });
  } catch (
    error: unknown
  ) {
    // =========================================================================
    // GLOBAL ERROR
    // =========================================================================

    console.error(
      `[${SITE_NAME}] BACKEND CHECKOUT ERROR PAKASIR V2:`,
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          getErrorMessage(
            error
          ),
      },
      {
        status:
          500,
      }
    );
  }
}