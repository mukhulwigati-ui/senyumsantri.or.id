'use client';

import React, { useEffect, useState } from 'react';

// ============================================================
// TYPES
// ============================================================

interface Statistics {
  totalCollected: number;
  totalDonors: number;
  totalPrograms: number;
}

interface Program {
  collectedRaw?: number | string;
  collected?: number | string;
  totalCollected?: number | string;

  donors?: unknown[];

  donorsCount?: number | string;
  donorCount?: number | string;

  status?: string;
}

// ============================================================
// INITIAL STATE
// ============================================================

const INITIAL_STATS: Statistics = {
  totalCollected: 0,
  totalDonors: 0,
  totalPrograms: 0,
};

// ============================================================
// HELPERS
// ============================================================

function safeNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = Number(cleaned);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}

// ============================================================
// COMPONENT
// ============================================================

export default function TotalAccumulationWidget() {
  const [stats, setStats] = useState<Statistics>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ==========================================================
  // FETCH DATA
  // ==========================================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStatistics() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(
          `/api/programs?v=${Date.now()}`,
          {
            method: 'GET',
            cache: 'no-store',

            headers: {
              'Cache-Control':
                'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
            },

            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data program. HTTP ${response.status}`
          );
        }

        const json = await response.json();

        if (
          !json?.success ||
          !Array.isArray(json?.data)
        ) {
          throw new Error(
            json?.error ||
              json?.message ||
              'Format data program tidak sesuai.'
          );
        }

        const programs: Program[] = json.data;

        // ======================================================
        // HITUNG TOTAL
        // ======================================================

        const calculated = programs.reduce<{
          totalCollected: number;
          totalDonors: number;
        }>(
          (acc, program) => {
            // -----------------------------------------------
            // TOTAL DANA
            // -----------------------------------------------

            const collected =
              safeNumber(program.collectedRaw) ||
              safeNumber(program.collected) ||
              safeNumber(program.totalCollected);

            // -----------------------------------------------
            // TOTAL DONATUR
            // -----------------------------------------------

            let donorCount = 0;

            if (
              program.donorsCount !== undefined &&
              program.donorsCount !== null
            ) {
              donorCount = safeNumber(
                program.donorsCount
              );
            } else if (
              program.donorCount !== undefined &&
              program.donorCount !== null
            ) {
              donorCount = safeNumber(
                program.donorCount
              );
            } else if (
              Array.isArray(program.donors)
            ) {
              donorCount = program.donors.length;
            }

            return {
              totalCollected:
                acc.totalCollected + collected,

              totalDonors:
                acc.totalDonors + donorCount,
            };
          },
          {
            totalCollected: 0,
            totalDonors: 0,
          }
        );

        // ======================================================
        // SET STATISTICS
        // ======================================================

        setStats({
          totalCollected:
            calculated.totalCollected,

          totalDonors:
            calculated.totalDonors,

          totalPrograms:
            programs.length,
        });
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          err.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          'Fetch accumulation statistics error:',
          err
        );

        setError(true);
        setStats(INITIAL_STATS);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchStatistics();

    return () => {
      controller.abort();
    };
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="text-center text-xs text-gray-400 font-bold tracking-widest uppercase animate-pulse">
          Mengakumulasikan data kampanye amanah...
        </div>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">

      <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-100 bg-white rounded-none divide-y md:divide-y-0 md:divide-x divide-gray-100">

        {/* ====================================================
            TOTAL DANA TERKUMPUL
        ==================================================== */}

        <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-2 transition-colors hover:bg-gray-50/50">

          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span>💰</span>
            TOTAL DANA TERKUMPUL
          </span>

          {stats.totalCollected > 0 ? (
            <span className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tight">
              Rp {formatNumber(stats.totalCollected)}
            </span>
          ) : (
            <span className="text-sm md:text-base font-black text-emerald-600 uppercase tracking-wider block py-1">
              🌱 SIAP MENERIMA KEBAIKAN
            </span>
          )}

          <span className="text-[10px] text-gray-400 font-bold tracking-wide">
            Akumulasi seluruh program donasi
          </span>

        </div>

        {/* ====================================================
            JUMLAH DONATUR
        ==================================================== */}

        <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-2 transition-colors hover:bg-gray-50/50">

          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span>🤝</span>
            JUMLAH DONATUR
          </span>

          {stats.totalDonors > 0 ? (
            <span className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">

              {formatNumber(stats.totalDonors)}{' '}

              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Donatur
              </span>

            </span>
          ) : (
            <span className="text-sm md:text-base font-black text-emerald-600 uppercase tracking-wider block py-1">
              🤝 MARI MULAI KEBAIKAN
            </span>
          )}

          <span className="text-[10px] text-gray-400 font-bold tracking-wide">
            {stats.totalDonors > 0
              ? 'Terima kasih atas setiap amanah kebaikan'
              : 'Jadilah donatur pertama'}
          </span>

        </div>

        {/* ====================================================
            PROGRAM AKTIF
        ==================================================== */}

        <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-2 transition-colors hover:bg-gray-50/50">

          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <span>📦</span>
            PROGRAM KEBAIKAN AKTIF
          </span>

          <span className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">

            {formatNumber(stats.totalPrograms)}{' '}

            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Program
            </span>

          </span>

          <span className="text-[10px] text-gray-400 font-bold tracking-wide">
            Pendidikan, Dakwah & Sosial
          </span>

        </div>

      </div>

      {/* ======================================================
          ERROR INFO
      ====================================================== */}

      {error && (
        <div className="mt-2 text-center text-[10px] text-gray-400">
          Statistik sementara belum dapat diperbarui.
        </div>
      )}

    </div>
  );
}