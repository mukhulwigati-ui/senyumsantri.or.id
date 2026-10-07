import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { randomUUID } from 'node:crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SITE_NAME = 'Pondok Matan Darussalam';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://senyumsantri.or.id';
const PROJECT = process.env.PAKASIR_PROJECT_SLUG?.trim() || '';
const API_KEY = process.env.PAKASIR_API_KEY?.trim() || '';
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN?.trim() || '';
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || 'lsnco71s',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production',
  useCdn: false,
  apiVersion: '2026-09-30',
  token: WRITE_TOKEN || undefined,
});

const METHODS = ['payment_link', 'qris', 'bri_va', 'bni_va', 'cimb_niaga_va',
  'permata_va', 'maybank_va', 'bnc_va', 'artha_graha_va', 'sampoerna_va'] as const;
type PaymentMethod = (typeof METHODS)[number];
type JsonObject = Record<string, unknown>;

function object(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}
function firstText(...values: unknown[]): string {
  return values.map(text).find(Boolean) || '';
}
function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, {
    status, headers: { 'Cache-Control': 'no-store' },
  });
}

// Terima integer, angka polos, atau format ribuan Indonesia (24.000).
// Jangan menghapus semua karakter: -24000/24000.50/1e6 harus ditolak.
function parseAmount(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  if (typeof value !== 'string') return null;
  const input = value.trim().replace(/^Rp\s*/i, '');
  if (!/^\d+$/.test(input) && !/^\d{1,3}(?:\.\d{3})+$/.test(input)) return null;
  const amount = Number(input.replace(/\./g, ''));
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}
function money(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
function sheetText(value: string): string {
  return /^[=+\-@\t\r\n]/.test(value) ? `'${value}` : value;
}

export async function POST(request: Request) {
  let documentId = '';
  let orderId = '';
  let gatewayConfirmed = false;
  let gatewayRequested = false;
  try {
    if (!WRITE_TOKEN || !PROJECT || !API_KEY) {
      console.error(`[${SITE_NAME}] Konfigurasi server belum lengkap.`);
      return fail('Konfigurasi pembayaran server belum lengkap.', 500);
    }
    const site = new URL(SITE_URL);
    if (!['https:', 'http:'].includes(site.protocol)) return fail('URL situs tidak valid.', 500);

    const body: unknown = await request.json().catch(() => null);
    if (!object(body)) return fail('Format data transaksi tidak valid.');
    const slug = text(body.slug);
    const donorName = firstText(body.donorName, body.name) || 'Hamba Allah';
    const donorPhone = firstText(body.donorPhone, body.phone, body.whatsapp);
    const fundraiserPhone = firstText(body.fundraiserPhone, body.referral);
    if (!slug || slug.length > 200 || donorName.length > 150 ||
        donorPhone.length > 40 || fundraiserPhone.length > 40) {
      return fail('Data program atau donatur tidak valid.');
    }
    const methodInput = body.paymentMethod === undefined
      ? 'qris' : text(body.paymentMethod).toLowerCase();
    if (!METHODS.includes(methodInput as PaymentMethod)) return fail('Metode pembayaran tidak tersedia.');
    const method = methodInput as PaymentMethod;
    const amount = parseAmount(body.amount ?? body.nominal);
    if (amount === null) return fail('Nominal harus berupa bilangan bulat rupiah yang valid.');
    const minimum = method === 'qris' || method === 'payment_link' ? 500 : 10000;
    const maximum = method === 'qris' ? 10000000 : 50000000;
    const format = (n: number) => new Intl.NumberFormat('id-ID').format(n);
    if (amount < minimum || amount > maximum) {
      return fail(`Nominal ${method.toUpperCase()} harus antara Rp ${format(minimum)} dan Rp ${format(maximum)}.`);
    }
    if (body.qrisOnly !== undefined && typeof body.qrisOnly !== 'boolean') {
      return fail('qrisOnly harus bernilai true atau false.');
    }
    if (method === 'payment_link' && body.qrisOnly === true && amount > 10000000) {
      return fail('Maksimal pembayaran QRIS adalah Rp 10.000.000.');
    }

    const upperSlug = slug.toUpperCase();
    const prefix = ['ASRAMA', 'SANTRI', 'TAHFIDZ', 'WAKAF', 'ZAKAT']
      .find((value) => upperSlug.includes(value)) || 'MATAN';
    orderId = `INV-${prefix}-${Date.now()}-${randomUUID().replace(/-/g, '').slice(0, 12)}`;
    documentId = `donationTransaction.${orderId}`;
    const createdAt = new Date().toISOString();
    const createdAtWib = new Date(createdAt).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'medium',
    });

    // Catat dahulu agar transaksi gateway selalu mempunyai pasangan lokal.
    // Status pembayaran tetap pending; creationStatus membedakan proses checkout.
    await client.create({
      _id: documentId, _type: 'donationTransaction', orderId,
      pakasirProject: PROJECT, donorName, donorPhone, fundraiserPhone, slug,
      amount, paymentMethod: method, status: 'pending', gatewayStatus: 'pending',
      creationStatus: 'creating', createdAt, createdAtWib,
      siteName: SITE_NAME, siteUrl: site.origin,
    });
    const endpoint = `https://app.pakasir.com/api/v2/create-transaction/${encodeURIComponent(PROJECT)}/${encodeURIComponent(orderId)}`;
    gatewayRequested = true;
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Api-Key': API_KEY },
      body: JSON.stringify({ method, amount }), cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      console.error(`[${SITE_NAME}] Pakasir HTTP ${response.status}; order ${orderId}`);
      await client.patch(documentId).set({
        creationStatus: response.status >= 500 ? 'unknown' : 'rejected',
        gatewayHttpStatus: response.status,
      }).commit();
      return fail(response.status === 429
        ? 'Pakasir sedang membatasi permintaan. Silakan coba beberapa saat lagi.'
        : 'Pakasir belum berhasil membuat pembayaran. Silakan coba beberapa saat lagi.',
      response.status === 429 ? 429 : 502);
    }
    const data: unknown = await response.json();
    if (!object(data) || !text(data.txn_id)) throw new Error('Respons Pakasir tidak memiliki txn_id.');
    const txnId = text(data.txn_id);
    // Simpan ID gateway segera, bahkan jika validasi respons selanjutnya gagal.
    await client.patch(documentId).set({ txnId, creationStatus: 'verifying' }).commit();
    if ((data.project !== undefined && data.project !== PROJECT) ||
        (data.order_id !== undefined && data.order_id !== orderId) ||
        (data.amount !== undefined && data.amount !== amount) ||
        (data.payment_method !== undefined && data.payment_method !== method)) {
      throw new Error('Identitas transaksi Pakasir tidak cocok.');
    }
    if (data.is_sandbox !== undefined && typeof data.is_sandbox !== 'boolean') {
      throw new Error('is_sandbox tidak valid.');
    }
    const qrString = text(data.qr_string);
    const vaNumber = text(data.va_number);
    let fee: number | null = null;
    let totalAmount: number | null = null;
    let expiredAt: string | null = null;
    let isSandbox: boolean | null = null;
    if (method !== 'payment_link') {
      if (!money(data.fee) || !money(data.total_payment) ||
          data.amount !== amount || data.total_payment !== amount + data.fee ||
          data.project !== PROJECT || data.order_id !== orderId ||
          data.payment_method !== method || typeof data.is_sandbox !== 'boolean') {
        throw new Error('Detail pembayaran Pakasir tidak valid.');
      }
      if ((method === 'qris' && !qrString) || (method.endsWith('_va') && !vaNumber)) {
        throw new Error('QRIS atau nomor virtual account tidak tersedia.');
      }
      expiredAt = text(data.expired_at);
      if (!expiredAt || !Number.isFinite(Date.parse(expiredAt))) throw new Error('Waktu kedaluwarsa tidak valid.');
      fee = data.fee;
      totalAmount = data.total_payment;
      isSandbox = data.is_sandbox;
    }

    const returnUrl = new URL('/thank-you', site);
    returnUrl.searchParams.set('order_id', orderId);
    // payment_link menggunakan URL resmi dari respons.
    // QRIS/VA mengembalikan data langsung dan URL pay-v2 seperti pola checkout lama.
    const payment = method === 'payment_link'
      ? new URL(text(data.payment_link))
      : new URL(`https://app.pakasir.com/pay-v2/${encodeURIComponent(txnId)}`);
    if (payment.protocol !== 'https:' || payment.hostname !== 'app.pakasir.com' ||
        payment.port || payment.username || payment.password ||
        payment.pathname !== `/pay-v2/${encodeURIComponent(txnId)}`) {
      throw new Error('URL pembayaran Pakasir tidak valid.');
    }
    payment.searchParams.set('redirect', returnUrl.toString());
    if (method === 'qris' || (method === 'payment_link' && body.qrisOnly === true)) {
      payment.searchParams.set('qris_only', '1');
    }
    const paymentUrl = payment.toString();
    // Jangan set status di sini: webhook mungkin telah lebih dulu mencatat lunas.
    await client.patch(documentId).set({
      txnId, fee, totalAmount, paymentUrl, qrString, vaNumber, expiredAt, isSandbox,
      creationStatus: 'created',
    }).commit();
    gatewayConfirmed = true;

    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL?.trim();
    if (sheetUrl) {
      try {
        const sheet = await fetch(sheetUrl, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            txnId, orderId, donorName: sheetText(donorName),
            donorPhone: donorPhone ? `'${donorPhone}` : '',
            amount, fee, totalAmount, programSlug: sheetText(slug), paymentMethod: method,
            fundraiserPhone: fundraiserPhone ? `'${fundraiserPhone}` : '-',
            status: 'pending', expiredAt, createdAt: createdAtWib,
            site: SITE_NAME, siteUrl: site.origin,
          }), cache: 'no-store', signal: AbortSignal.timeout(8000),
        });
        if (!sheet.ok) throw new Error(`Google Sheet HTTP ${sheet.status}`);
      } catch {
        // Gangguan Sheet tidak menggagalkan checkout yang sudah tersimpan.
        console.error(`[${SITE_NAME}] Sinkron Google Sheet gagal; order ${orderId}`);
      }
    }
    return NextResponse.json({
      success: true, txnId, orderId, amount, fee, totalAmount,
      paymentMethod: method, paymentUrl, qrString, vaNumber, expiredAt, isSandbox,
      paymentNumber: vaNumber,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: unknown) {
    console.error(`[${SITE_NAME}] Checkout gagal; order ${orderId || '-'};`,
      error instanceof Error ? error.name : 'UnknownError');
    if (documentId && !gatewayConfirmed) {
      await client.patch(documentId).set({
        creationStatus: gatewayRequested ? 'unknown' : 'failed',
      }).commit().catch(() => undefined);
    }
    // Timeout tidak membuktikan transaksi gagal di gateway. Jangan hapus data lokal.
    return NextResponse.json({
      success: false,
      error: 'Transaksi belum dapat disiapkan. Jika pembayaran sudah dilakukan, jangan membayar ulang; hubungi admin.',
      ...(orderId ? { orderId } : {}),
    }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
