'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-white
      "
    >
      {/* =====================================================
          FULL BACKGROUND IMAGE
      ===================================================== */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/images/hero-bg.png"
          alt="Pondok Matan Darussalam"
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-[60%_center]
            sm:object-center
            lg:object-[center_45%]
          "
        />
      </div>

      {/* =====================================================
          BASE DARK / SOFT TINT
      ===================================================== */}
      <div
        className="
          absolute
          inset-0
          -z-20
          bg-[rgba(8,18,16,0.18)]
        "
      />

      {/* =====================================================
          LEFT MAIN GRADIENT
          Supaya teks tetap terbaca
      ===================================================== */}
      <div
        className="
          absolute
          inset-0
          -z-20
          bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.90)_16%,rgba(255,255,255,0.82)_30%,rgba(255,255,255,0.62)_45%,rgba(255,255,255,0.24)_60%,rgba(255,255,255,0.04)_76%,rgba(255,255,255,0.00)_100%)]
        "
      />

      {/* =====================================================
          TOP EDGE GRADIENT
      ===================================================== */}
      <div
        className="
          absolute
          left-0
          top-0
          -z-10
          h-32
          w-full
          bg-gradient-to-b
          from-white/72
          via-white/24
          to-transparent
        "
      />

      {/* =====================================================
          BOTTOM EDGE GRADIENT
      ===================================================== */}
      <div
        className="
          absolute
          bottom-0
          left-0
          -z-10
          h-36
          w-full
          bg-gradient-to-t
          from-white/80
          via-white/28
          to-transparent
        "
      />

      {/* =====================================================
          LEFT EDGE GLOW
      ===================================================== */}
      <div
        className="
          absolute
          left-0
          top-0
          -z-10
          h-full
          w-24
          bg-gradient-to-r
          from-white/70
          to-transparent
        "
      />

      {/* =====================================================
          RIGHT EDGE GLOW
      ===================================================== */}
      <div
        className="
          absolute
          right-0
          top-0
          -z-10
          h-full
          w-24
          bg-gradient-to-l
          from-white/40
          to-transparent
        "
      />

      {/* =====================================================
          SOFT EMERALD HIGHLIGHT
      ===================================================== */}
      <div
        className="
          pointer-events-none
          absolute
          -left-20
          top-24
          -z-10
          h-[360px]
          w-[360px]
          rounded-full
          bg-emerald-400/15
          blur-[110px]
        "
      />

      {/* =====================================================
          HERO CONTENT WRAPPER
      ===================================================== */}
      <div
        className="
          relative
          z-10
          min-h-[620px]
          sm:min-h-[640px]
          md:min-h-[660px]
          lg:min-h-[680px]
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[620px]
            w-full
            max-w-[1120px]
            items-center

            px-3
            py-16

            sm:min-h-[640px]
            sm:px-5
            sm:py-20

            md:min-h-[660px]
            md:px-8
            md:py-24

            lg:min-h-[680px]
            lg:px-10
          "
        >
          <div className="w-full">
            <div className="max-w-[570px]">
              {/* =================================================
                  BRAND BADGE
              ================================================= */}
              <div
                className="
                  mb-6
                  inline-flex
                  max-w-full
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-white/90
                  bg-white/76
                  px-3
                  py-2
                  shadow-[0_12px_30px_rgba(15,23,42,0.08)]
                  backdrop-blur-xl
                "
              >
                <div
                  className="
                    relative
                    h-8
                    w-8
                    shrink-0
                    overflow-hidden
                    rounded-full
                    bg-white
                    ring-1
                    ring-black/5
                  "
                >
                  <Image
                    src="/images/logo-matan.png"
                    alt="Logo Pondok Matan Darussalam"
                    fill
                    sizes="32px"
                    className="object-contain p-1"
                  />
                </div>

                <span
                  className="
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-emerald-500
                    shadow-[0_0_8px_rgba(16,185,129,0.65)]
                  "
                />

                <span
                  className="
                    truncate
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.11em]
                    text-emerald-700
                    sm:text-[10px]
                    md:text-[11px]
                  "
                >
                  Pondok Matan Darussalam
                </span>
              </div>

              {/* =================================================
                  HEADLINE
              ================================================= */}
              <h1
                className="
                  text-[36px]
                  font-bold
                  leading-[1.04]
                  tracking-[-0.04em]
                  text-[#163126]
                  sm:text-[42px]
                  md:text-[48px]
                  lg:text-[52px]
                "
              >
                Bersama Membina

                <span className="mt-1 block">
                  Generasi{' '}
                  <span
                    className="
                      bg-gradient-to-r
                      from-emerald-600
                      via-emerald-500
                      to-teal-500
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Qur&apos;ani
                  </span>
                </span>
              </h1>

              {/* =================================================
                  SUB HEADLINE
              ================================================= */}
              <p
                className="
                  mt-5
                  max-w-[500px]
                  text-[22px]
                  font-normal
                  leading-[1.22]
                  tracking-[-0.025em]
                  text-[#365548]
                  sm:text-[25px]
                  md:text-[28px]
                  lg:text-[30px]
                "
              >
                untuk masa depan yang penuh keberkahan.
              </p>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}
              <p
                className="
                  mt-6
                  max-w-[540px]
                  text-[13px]
                  leading-7
                  text-[#4e695f]
                  sm:text-[14px]
                  md:text-[15px]
                "
              >
                Salurkan infak, sedekah, wakaf, dan dukungan
                pendidikan terbaik Anda untuk membantu tumbuhnya
                para santri dan penghafal Al-Qur&apos;an. InsyaAllah
                setiap kebaikan menjadi bagian dari amal yang
                terus mengalir.
              </p>

              {/* =================================================
                  CTA
              ================================================= */}
              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <Link
                  href="/program"
                  className="
                    group
                    relative
                    inline-flex
                    min-h-[50px]
                    items-center
                    justify-center
                    gap-2.5
                    overflow-hidden
                    rounded-xl
                    bg-emerald-500
                    px-6
                    text-sm
                    font-bold
                    text-white
                    shadow-[0_14px_32px_rgba(16,185,129,0.18)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-emerald-600
                  "
                >
                  <span
                    className="
                      absolute
                      inset-0
                      -translate-x-[140%]
                      bg-gradient-to-r
                      from-transparent
                      via-white/20
                      to-transparent
                      transition-transform
                      duration-1000
                      group-hover:translate-x-[140%]
                    "
                  />

                  <HeartHandshake className="relative z-10 h-[18px] w-[18px]" />

                  <span className="relative z-10">
                    Donasi Sekarang
                  </span>

                  <ArrowRight
                    className="
                      relative
                      z-10
                      h-4
                      w-4
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>

                <Link
                  href="/program"
                  className="
                    group
                    inline-flex
                    min-h-[50px]
                    items-center
                    justify-center
                    gap-2.5
                    rounded-xl
                    border
                    border-white/90
                    bg-white/72
                    px-6
                    text-sm
                    font-semibold
                    text-[#26483b]
                    shadow-[0_10px_24px_rgba(15,23,42,0.05)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:bg-white
                  "
                >
                  Lihat Program

                  <ArrowRight
                    className="
                      h-4
                      w-4
                      text-[#4c6c60]
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </div>

              {/* =================================================
                  TRUST INFO
              ================================================= */}
              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-x-5
                  gap-y-3
                  text-[11px]
                  text-[#5a7469]
                  sm:text-xs
                "
              >
                <div className="flex items-center gap-2">
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/90
                      bg-white/75
                      shadow-sm
                    "
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  </span>

                  <span>Aman & terpercaya</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-white/90
                      bg-white/75
                      shadow-sm
                    "
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  </span>

                  <span>Transparan & amanah</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
