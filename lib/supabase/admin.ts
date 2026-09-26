// lib/supabase/admin.ts

import {
  createClient,
  type SupabaseClient,
} from '@supabase/supabase-js';

// ============================================================================
// SUPABASE ADMIN CLIENT
// ============================================================================
//
// PENTING:
//
// Jangan melakukan:
//
//   throw new Error(...)
//
// langsung di level/module scope.
//
// Next.js akan meng-import file API saat proses build.
// Jika environment variable belum tersedia saat module di-load,
// build bisa langsung gagal.
//
// Karena itu client dibuat secara LAZY melalui getSupabaseAdmin().
// ============================================================================

let cachedAdminClient:
  | SupabaseClient
  | null = null;

// ============================================================================
// GET ENV
// ============================================================================

function getSupabaseUrl(): string {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    ''
  );
}

function getServiceRoleKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    ''
  );
}

// ============================================================================
// GET ADMIN CLIENT
// ============================================================================

export function getSupabaseAdmin():
  | SupabaseClient
  | null {

  // --------------------------------------------------------------------------
  // CACHE
  // --------------------------------------------------------------------------

  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  // --------------------------------------------------------------------------
  // ENV
  // --------------------------------------------------------------------------

  const supabaseUrl =
    getSupabaseUrl();

  const serviceRoleKey =
    getServiceRoleKey();

  // --------------------------------------------------------------------------
  // JANGAN THROW SAAT BUILD
  // --------------------------------------------------------------------------

  if (
    !supabaseUrl ||
    !serviceRoleKey
  ) {
    console.error(
      '[Supabase Admin] Konfigurasi Supabase belum lengkap.'
    );

    if (!supabaseUrl) {
      console.error(
        '[Supabase Admin] SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL belum tersedia.'
      );
    }

    if (!serviceRoleKey) {
      console.error(
        '[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY belum tersedia.'
      );
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // CREATE CLIENT
  // --------------------------------------------------------------------------

  cachedAdminClient =
    createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken:
            false,

          persistSession:
            false,

          detectSessionInUrl:
            false,
        },
      }
    );

  return cachedAdminClient;
}

// ============================================================================
// CHECK CONFIG
// ============================================================================

export function isSupabaseAdminConfigured():
  boolean {

  return Boolean(
    getSupabaseUrl() &&
    getServiceRoleKey()
  );
}