import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { google } from 'googleapis';

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

const PAKASIR_WEBHOOK_SECRET =
  process.env.PAKASIR_WEBHOOK_SECRET?.trim() ||
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
// TYPES
// ============================================================================

interface DonationTransaction {
  _id: string;
  _rev: string;

  txnId?: string;
  orderId?: string;

  donorName?: string;
  donorPhone?: string;

  amount?: number;

  status?: string;

  slug?: string;

  paymentMethod?: string;

  fundraiserPhone?: string;
}

interface ProgramDocument {
  _id: string;
  title?: string;
}

interface FundraiserDocument {
  _id: string;
  name?: string;
  phone?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function safeNumber(value: unknown): number {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}

function normalizePhone(value: unknown): string {
  const raw =
    String(value || '')
      .replace(/[^0-9]/g, '');

  if (!raw) {
    return '';
  }

  if (raw.startsWith('0')) {
    return `62${raw.slice(1)}`;
  }

  if (raw.startsWith('62')) {
    return raw;
  }

  if (raw.startsWith('8')) {
    return `62${raw}`;
  }

  return raw;
}

function localPhone(value: unknown): string {
  const raw =
    String(value || '')
      .replace(/[^0-9]/g, '');

  if (!raw) {
    return '';
  }

  if (raw.startsWith('62')) {
    return `0${raw.slice(2)}`;
  }

  return raw;
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat(
    'id-ID'
  ).format(value);
}

function getErrorMessage(
  error: unknown
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Terjadi kesalahan pada server.';
}

// ============================================================================
// GOOGLE SHEETS
// ============================================================================

async function appendToGoogleSheets(data: {
  orderId: string;
  txnId: string;
  name: string;
  phone: string;
  amount: number;
  program: string;
  date: string;
}) {
  try {
    const serviceAccountEmail =
      process.env
        .GOOGLE_SERVICE_ACCOUNT_EMAIL
        ?.trim();

    const privateKey =
      process.env
        .GOOGLE_PRIVATE_KEY
        ?.replace(/\\n/g, '\n');

    const spreadsheetId =
      process.env
        .GOOGLE_SHEET_ID
        ?.trim();

    if (
      !serviceAccountEmail ||
      !privateKey ||
      !spreadsheetId
    ) {
      console.warn(
        `[${SITE_NAME}] Google Sheets dilewati karena ENV belum lengkap.`
      );

      return;
    }

    const auth =
      new google.auth.GoogleAuth({
        credentials: {
          client_email:
            serviceAccountEmail,

          private_key:
            privateKey,
        },

        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      });

    const sheets =
      google.sheets({
        version: 'v4',
        auth,
      });

    const cleanPhone =
      normalizePhone(
        data.phone
      );

    const whatsappFormula =
      cleanPhone
        ? `=HYPERLINK("https://wa.me/${cleanPhone}"; "${data.phone}")`
        : '-';

    await sheets.spreadsheets.values.append({
      spreadsheetId,

      range:
        'Sheet1!A:G',

      valueInputOption:
        'USER_ENTERED',

      requestBody: {
        values: [
          [
            data.date,
            data.orderId,
            data.txnId,
            data.name,
            whatsappFormula,
            data.amount,
            data.program,
          ],
        ],
      },
    });

    console.log(
      `📊 [${SITE_NAME}] Google Sheets sukses: ${data.orderId}`
    );
  } catch (error) {
    console.error(
      `🔥 [${SITE_NAME}] GOOGLE SHEETS ERROR:`,
      error
    );
  }
}

// ============================================================================
// WHATSAPP FONNTE
// ============================================================================

async function sendWhatsappReceipt(data: {
  phone: string;
  donorName: string;
  orderId: string;
  programName: string;
  amount: number;
  paymentMethod: string;
  date: string;
  time: string;
}) {
  try {
    const fonnteToken =
      process.env.FONNTE_TOKEN?.trim();

    if (!fonnteToken) {
      console.warn(
        `[${SITE_NAME}] FONNTE_TOKEN belum dikonfigurasi.`
      );

      return;
    }

    const phone =
      normalizePhone(
        data.phone
      );

    if (!phone) {
      return;
    }

    const messageText = `*DONASI BERHASIL DITERIMA* 🎉

Jazakumullah khairan, Kak *${data.donorName}*. Donasi Anda telah berhasil kami verifikasi.

📝 *No. Invoice:* ${data.orderId}
📌 *Program:* ${data.programName}
💰 *Nominal:* Rp ${formatRupiah(data.amount)}
💳 *Metode:* ${data.paymentMethod}
⏰ *Tanggal:* ${data.date} - ${data.time} WIB

Semoga Allah menerima sedekah ini sebagai amal kebaikan, melapangkan rezeki, serta memberikan keberkahan untuk Anda dan keluarga. Aamiin.

----------------------------
*Pondok Matan Darussalam*
🌐 senyumsantri.or.id

_Amanah dalam menyalurkan kebaikan_`;

    const response =
      await fetch(
        'https://api.fonnte.com/send',
        {
          method: 'POST',

          headers: {
            Authorization:
              fonnteToken,
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

    if (!response.ok) {
      const responseText =
        await response
          .text()
          .catch(() => '');

      console.error(
        `🔥 [${SITE_NAME}] FONNTE ERROR:`,
        {
          status:
            response.status,

          response:
            responseText,
        }
      );

      return;
    }

    console.log(
      `📲 [${SITE_NAME}] WhatsApp terkirim: ${data.orderId}`
    );
  } catch (error) {
    console.error(
      `🔥 [${SITE_NAME}] FONNTE ERROR:`,
      error
    );
  }
}

// ============================================================================
// WEBHOOK PAKASIR V2
// ============================================================================

export async function POST(
  request: Request
) {
  try {
    // ========================================================================
    // 1. VALIDASI SERVER ENV
    // ========================================================================

    if (!SANITY_WRITE_TOKEN) {
      console.error(
        `[${SITE_NAME}] SANITY_API_WRITE_TOKEN belum dikonfigurasi.`
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Konfigurasi Sanity belum lengkap.',
        },
        {
          status: 500,
        }
      );
    }

    if (!PAKASIR_WEBHOOK_SECRET) {
      console.error(
        `[${SITE_NAME}] PAKASIR_WEBHOOK_SECRET belum dikonfigurasi.`
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Konfigurasi webhook belum lengkap.',
        },
        {
          status: 500,
        }
      );
    }

    // ========================================================================
    // 2. VALIDASI X-SECRET
    // ========================================================================

    const incomingSecret =
      request.headers
        .get('x-secret')
        ?.trim() ||
      '';

    if (
      !incomingSecret ||
      incomingSecret !==
        PAKASIR_WEBHOOK_SECRET
    ) {
      console.error(
        `❌ [${SITE_NAME}] Webhook ditolak: X-Secret tidak cocok.`
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Unauthorized webhook.',
        },
        {
          status: 401,
        }
      );
    }

    // ========================================================================
    // 3. PARSE PAYLOAD
    // ========================================================================

    const payload =
      await request
        .json()
        .catch(() => null);

    if (
      !payload ||
      typeof payload !==
        'object'
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

    const txnId =
      String(
        payload.txn_id ||
        ''
      ).trim();

    const orderId =
      String(
        payload.order_id ||
        ''
      ).trim();

    const amount =
      safeNumber(
        payload.amount
      );

    const status =
      String(
        payload.status ||
        ''
      )
        .toLowerCase()
        .trim();

    const completedAt =
      String(
        payload.completed_at ||
        ''
      ).trim();

    const isSandbox =
      Boolean(
        payload.is_sandbox
      );

    console.log(
      `📥 [${SITE_NAME}] PAKASIR V2 WEBHOOK:`,
      {
        txnId,
        orderId,
        amount,
        status,
        isSandbox,
      }
    );

    // ========================================================================
    // 4. VALIDASI PAYLOAD WAJIB
    // ========================================================================

    if (!txnId) {
      return NextResponse.json(
        {
          success: false,
          message:
            'txn_id tidak ditemukan.',
        },
        {
          status: 400,
        }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message:
            'order_id tidak ditemukan.',
        },
        {
          status: 400,
        }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Nominal transaksi tidak valid.',
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================================
    // 5. PAKASIR V2 HANYA PROSES COMPLETED
    // ========================================================================

    if (
      status !==
      'completed'
    ) {
      console.warn(
        `[${SITE_NAME}] Status webhook diabaikan: ${status}`
      );

      return NextResponse.json(
        {
          success: true,
          message:
            `Status ${status || '-'} diabaikan.`,
        },
        {
          status: 200,
        }
      );
    }

    // ========================================================================
    // 6. CARI TRANSAKSI DI SANITY
    // ========================================================================

    const transaction =
      await client.fetch<
        DonationTransaction | null
      >(
        `
        *[
          _type == "donationTransaction"
          &&
          (
            txnId == $txnId
            ||
            orderId == $orderId
          )
        ][0]{
          _id,
          _rev,
          txnId,
          orderId,
          donorName,
          donorPhone,
          amount,
          status,
          slug,
          paymentMethod,
          fundraiserPhone
        }
        `,
        {
          txnId,
          orderId,
        }
      );

    if (!transaction) {
      console.error(
        `❌ [${SITE_NAME}] Transaksi tidak ditemukan: ${orderId}`
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Transaksi tidak ditemukan.',
        },
        {
          status: 404,
        }
      );
    }

    // ========================================================================
    // 7. VALIDASI TXN ID
    // ========================================================================

    if (
      transaction.txnId &&
      transaction.txnId !==
        txnId
    ) {
      console.error(
        `❌ [${SITE_NAME}] txn_id tidak cocok.`,
        {
          webhook:
            txnId,

          sanity:
            transaction.txnId,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Txn ID tidak cocok.',
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================================
    // 8. VALIDASI ORDER ID
    // ========================================================================

    if (
      transaction.orderId !==
      orderId
    ) {
      console.error(
        `❌ [${SITE_NAME}] order_id tidak cocok.`,
        {
          webhook:
            orderId,

          sanity:
            transaction.orderId,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Order ID tidak cocok.',
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================================
    // 9. VALIDASI NOMINAL
    // ========================================================================

    const localAmount =
      safeNumber(
        transaction.amount
      );

    if (
      localAmount !==
      amount
    ) {
      console.error(
        `❌ [${SITE_NAME}] Nominal tidak cocok.`,
        {
          webhook:
            amount,

          sanity:
            localAmount,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message:
            'Nominal transaksi tidak cocok.',
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================================
    // 10. IDEMPOTENCY
    // ========================================================================

    const localStatus =
      String(
        transaction.status ||
        ''
      )
        .toLowerCase()
        .trim();

    if (
      localStatus ===
        'success' ||
      localStatus ===
        'completed'
    ) {
      console.log(
        `ℹ️ [${SITE_NAME}] Transaksi sudah diproses: ${orderId}`
      );

      return NextResponse.json(
        {
          success: true,
          message:
            'Transaksi sudah diproses sebelumnya.',
        },
        {
          status: 200,
        }
      );
    }

    // ========================================================================
    // 11. DATA TRANSAKSI
    // ========================================================================

    const donorName =
      String(
        transaction.donorName ||
        'Hamba Allah'
      ).trim();

    const donorPhone =
      String(
        transaction.donorPhone ||
        ''
      ).trim();

    const programSlug =
      String(
        transaction.slug ||
        ''
      )
        .toLowerCase()
        .trim();

    const paymentMethod =
      String(
        transaction.paymentMethod ||
        'qris'
      )
        .toUpperCase()
        .trim();

    if (!programSlug) {
      throw new Error(
        'Slug program tidak ditemukan pada transaksi.'
      );
    }

    // ========================================================================
    // 12. CARI PROGRAM
    // ========================================================================

    const program =
      await client.fetch<
        ProgramDocument | null
      >(
        `
        *[
          _type == "program"
          &&
          slug.current == $slug
        ][0]{
          _id,
          title
        }
        `,
        {
          slug:
            programSlug,
        }
      );

    if (!program) {
      console.error(
        `❌ [${SITE_NAME}] Program tidak ditemukan: ${programSlug}`
      );

      return NextResponse.json(
        {
          success: false,
          message:
            `Program ${programSlug} tidak ditemukan.`,
        },
        {
          status: 404,
        }
      );
    }

    // ========================================================================
    // 13. WAKTU WIB
    // ========================================================================

    let completedDate =
      new Date();

    if (completedAt) {
      const parsedDate =
        new Date(
          completedAt
        );

      if (
        !Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        completedDate =
          parsedDate;
      }
    }

    const currentDate =
      completedDate.toLocaleDateString(
        'id-ID',
        {
          timeZone:
            'Asia/Jakarta',

          day:
            'numeric',

          month:
            'long',

          year:
            'numeric',
        }
      );

    const currentTime =
      completedDate.toLocaleTimeString(
        'id-ID',
        {
          timeZone:
            'Asia/Jakarta',

          hour:
            '2-digit',

          minute:
            '2-digit',

          hour12:
            false,
        }
      );

    const completedAtIso =
      completedAt ||
      new Date().toISOString();

    // ========================================================================
    // 14. FUNDRAISER
    // ========================================================================

    let fundraiser:
      FundraiserDocument | null =
      null;

    const fundraiserPhone =
      String(
        transaction.fundraiserPhone ||
        ''
      ).trim();

    if (
      fundraiserPhone
    ) {
      const internationalPhone =
        normalizePhone(
          fundraiserPhone
        );

      const localNumber =
        localPhone(
          fundraiserPhone
        );

      fundraiser =
        await client.fetch<
          FundraiserDocument | null
        >(
          `
          *[
            _type == "fundraiser"
            &&
            (
              phone == $raw
              ||
              phone == $international
              ||
              phone == $local
            )
          ][0]{
            _id,
            name,
            phone
          }
          `,
          {
            raw:
              fundraiserPhone,

            international:
              internationalPhone,

            local:
              localNumber,
          }
        );
    }

    // ========================================================================
    // 15. ATOMIC SANITY TRANSACTION
    // ========================================================================

    const donorKey =
      `donor-${orderId}`
        .replace(
          /[^a-zA-Z0-9_-]/g,
          '-'
        )
        .slice(
          0,
          100
        );

    let sanityTransaction =
      client.transaction();

    // ------------------------------------------------------------------------
    // UPDATE DONATION TRANSACTION
    // ------------------------------------------------------------------------

    sanityTransaction =
      sanityTransaction.patch(
        transaction._id,
        (patch) =>
          patch
            .ifRevisionId(
              transaction._rev
            )
            .set({
              txnId:
                txnId,

              status:
                'success',

              gatewayStatus:
                'completed',

              completedAt:
                completedAtIso,

              paidAt:
                completedAtIso,

              isSandbox:
                isSandbox,
            })
      );

    // ------------------------------------------------------------------------
    // UPDATE PROGRAM
    // ------------------------------------------------------------------------

    sanityTransaction =
      sanityTransaction.patch(
        program._id,
        (patch) =>
          patch
            .setIfMissing({
              collectedRaw:
                0,

              donors:
                [],
            })
            .inc({
              collectedRaw:
                amount,
            })
            .append(
              'donors',
              [
                {
                  _key:
                    donorKey,

                  _type:
                    'donor',

                  txnId:
                    txnId,

                  orderId:
                    orderId,

                  name:
                    donorName,

                  amount:
                    amount,

                  date:
                    currentDate,

                  paymentMethod:
                    paymentMethod,
                },
              ]
            )
      );

    // ------------------------------------------------------------------------
    // UPDATE FUNDRAISER
    // ------------------------------------------------------------------------

    if (
      fundraiser
    ) {
      const ujrah =
        Math.round(
          amount * 0.1
        );

      sanityTransaction =
        sanityTransaction.patch(
          fundraiser._id,
          (patch) =>
            patch
              .setIfMissing({
                totalDanaDihimpun:
                  0,

                sisaSaldoFee:
                  0,

                totalTransaksiSukses:
                  0,
              })
              .inc({
                totalDanaDihimpun:
                  amount,

                sisaSaldoFee:
                  ujrah,

                totalTransaksiSukses:
                  1,
              })
        );

      console.log(
        `💸 [${SITE_NAME}] Ujrah Rp ${formatRupiah(ujrah)} → ${fundraiser.name || fundraiser.phone || 'Fundraiser'}`
      );
    }

    // ========================================================================
    // 16. COMMIT
    // ========================================================================

    try {
      await sanityTransaction.commit({
        visibility:
          'sync',
      });
    } catch (
      commitError
    ) {
      console.error(
        `🔥 [${SITE_NAME}] SANITY TRANSACTION ERROR:`,
        commitError
      );

      // ======================================================================
      // CEK KEMUNGKINAN WEBHOOK DUPLIKAT
      // ======================================================================

      const refreshedTransaction =
        await client.fetch<{
          status?: string;
        } | null>(
          `
          *[
            _type == "donationTransaction"
            &&
            _id == $id
          ][0]{
            status
          }
          `,
          {
            id:
              transaction._id,
          }
        );

      if (
        refreshedTransaction?.status ===
          'success'
      ) {
        return NextResponse.json(
          {
            success: true,
            message:
              'Transaksi sudah diproses oleh webhook lain.',
          },
          {
            status: 200,
          }
        );
      }

      throw commitError;
    }

    console.log(
      `✅ [${SITE_NAME}] Donasi berhasil diproses:`,
      {
        orderId,
        txnId,
        amount,
        program:
          program.title ||
          programSlug,
      }
    );

    // ========================================================================
    // 17. GOOGLE SHEETS
    // ========================================================================

    await appendToGoogleSheets({
      date:
        `${currentDate} ${currentTime}`,

      orderId:
        orderId,

      txnId:
        txnId,

      name:
        donorName,

      phone:
        donorPhone,

      amount:
        amount,

      program:
        program.title ||
        programSlug,
    });

    // ========================================================================
    // 18. WHATSAPP
    // ========================================================================

    if (
      donorPhone
    ) {
      await sendWhatsappReceipt({
        phone:
          donorPhone,

        donorName:
          donorName,

        orderId:
          orderId,

        programName:
          program.title ||
          programSlug,

        amount:
          amount,

        paymentMethod:
          paymentMethod,

        date:
          currentDate,

        time:
          currentTime,
      });
    }

    // ========================================================================
    // 19. RESPONSE 200
    // ========================================================================

    return NextResponse.json(
      {
        success:
          true,

        message:
          'Webhook Pakasir berhasil diproses.',

        data: {
          txnId:
            txnId,

          orderId:
            orderId,

          amount:
            amount,

          status:
            'completed',

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
    console.error(
      `🔥 [${SITE_NAME}] CRITICAL WEBHOOK ERROR:`,
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
        status: 500,
      }
    );
  }
}