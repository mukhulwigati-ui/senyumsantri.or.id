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
        w-full
        bg-white

        px-3
        sm:px-5
        md:px-8
        lg:px-10

        pt-5
        md:pt-6

        pb-8
        md:pb-10
      "
    >
      {/* =====================================================
          HERO CONTAINER
          Mengikuti lebar konten website
      ===================================================== */}
      <div
        className="
          relative
          isolate

          mx-auto
          w-full
          max-w-[1120px]

          min-h-[620px]
          sm:min-h-[640px]
          md:min-h-[650px]
          lg:min-h-[660px]

          overflow-hidden

          rounded-[20px]
          md:rounded-[26px]

          bg-[#f7faf8]

          shadow-[0_18px_50px_rgba(15,23,42,0.08)]
          ring-1
          ring-black/5
        "
      >
        {/* =====================================================
            BACKGROUND IMAGE
        ===================================================== */}
        <div className="absolute inset-0 -z-30">
          <Image
            src="/images/hero-bg.png"
            alt="Pondok Matan Darussalam"
            fill
            priority
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 95vw,
              1120px
            "
            className="
              object-cover

              object-[58%_center]
              sm:object-center
              lg:object-[center_48%]
            "
          />
        </div>

        {/* =====================================================
            OVERLAY UTAMA
            Full gradasi putih / transparan
            Kecuali sebagian kanan dibuat jauh lebih terbuka
        ===================================================== */}
        <div
          className="
            absolute
            inset-0
            -z-20

            bg-[linear-gradient(90deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.94)_20%,rgba(255,255,255,0.88)_38%,rgba(255,255,255,0.72)_52%,rgba(255,255,255,0.42)_68%,rgba(255,255,255,0.10)_82%,rgba(255,255,255,0.00)_100%)]
          "
        />

        {/* =====================================================
            OVERLAY VERTICAL
            Putih lembut dari atas & bawah
        ===================================================== */}
        <div
          className="
            absolute
            inset-0
            -z-20

            bg-[linear-gradient(180deg,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.06)_28%,rgba(255,255,255,0.00)_48%,rgba(255,255,255,0.14)_78%,rgba(255,255,255,0.34)_100%)]
          "
        />

        {/* =====================================================
            HIGHLIGHT SOFT
        ===================================================== */}
        <div
          className="
            absolute
            -left-24
            top-20
            -z-10

            h-[380px]
            w-[380px]

            rounded-full

            bg-emerald-400/[0.10]

            blur-[110px]

            pointer-events-none
          "
        />

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div
          className="
            relative
            z-10

            flex
            min-h-[620px]
            w-full
            items-center

            sm:min-h-[640px]
            md:min-h-[650px]
            lg:min-h-[660px]
          "
        >
          <div
            className="
              w-full

              px-5
              pt-16
              pb-16

              sm:px-7
              sm:pt-20
              sm:pb-20

              md:px-9

              lg:px-12
            "
          >
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
                  border-white/95

                  bg-white/78

                  px-3
                  py-2

                  backdrop-blur-xl

                  shadow-[0_12px_30px_rgba(15,23,42,0.08)]
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
                      text-transparent
                      bg-clip-text

                      bg-gradient-to-r

                      from-emerald-600
                      via-emerald-500
                      to-teal-500
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
                {/* PRIMARY */}
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

                  <HeartHandshake
                    className="
                      relative
                      z-10

                      h-[18px]
                      w-[18px]
                    "
                  />

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

                {/* SECONDARY */}
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
                    border-white/95

                    bg-white/72

                    px-6

                    text-sm
                    font-semibold
                    text-[#26483b]

                    backdrop-blur-xl

                    shadow-[0_10px_24px_rgba(15,23,42,0.05)]

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
                    <ShieldCheck
                      className="
                        h-3.5
                        w-3.5

                        text-emerald-600
                      "
                    />
                  </span>

                  <span>
                    Aman & terpercaya
                  </span>
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
                    <Sparkles
                      className="
                        h-3.5
                        w-3.5

                        text-emerald-600
                      "
                    />
                  </span>

                  <span>
                    Transparan & amanah
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FLOATING CARD
            Hanya desktop besar
        ===================================================== */}
        <div
          className="
            absolute
            right-6
            bottom-6
            z-20

            hidden
            w-[255px]

            rounded-[20px]

            border
            border-white/95

            bg-white/72

            p-4

            shadow-[0_20px_45px_rgba(15,23,42,0.12)]

            backdrop-blur-xl

            xl:block
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-xl

                border
                border-emerald-100

                bg-emerald-50
              "
            >
              <HeartHandshake
                className="
                  h-5
                  w-5

                  text-emerald-600
                "
              />
            </div>

            <div>
              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.12em]

                  text-gray-400
                "
              >
                Kebaikan Bersama
              </p>

              <p
                className="
                  mt-0.5

                  text-[13px]
                  font-semibold

                  text-[#233b31]
                "
              >
                Amal yang terus mengalir
              </p>
            </div>
          </div>

          <div
            className="
              my-3.5

              h-px

              bg-gray-200
            "
          />

          <p
            className="
              text-[11px]
              leading-5

              text-[#5a7469]
            "
          >
            Setiap dukungan Anda ikut membantu pendidikan,
            kebutuhan santri, serta pengembangan dakwah
            Al-Qur&apos;an.
          </p>
        </div>

        {/* =====================================================
            SOFT BOTTOM SHADE
            Putih transparan halus
        ===================================================== */}
        <div
          className="
            pointer-events-none

            absolute
            bottom-0
            left-0
            z-10

            h-20
            w-full

            bg-gradient-to-t
            from-white/45
            to-transparent
          "
        />
      </div>
    </section>
  );
}