'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Link from 'next/link';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

type SlideItem = {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
  href?: string;
};

// ============================================================================
// SLIDES
// ============================================================================
//
// Simpan gambar di:
//
// public/images/slides/slide-1.jpg
// public/images/slides/slide-2.jpg
// public/images/slides/slide-3.jpg
// public/images/slides/slide-4.jpg
//
// Ukuran ideal:
// 1600 x 650 px
//
// ============================================================================

const slides: SlideItem[] = [
  {
    id: 1,
    image: '/images/slides/slide-1.jpg',
    title: 'Pendidikan Santri',
    subtitle:
      'Membentuk generasi berilmu, berakhlak, dan berkemajuan.',
    href: '/tentang-kami',
  },

  {
    id: 2,
    image: '/images/slides/slide-2.jpg',
    title: 'Belajar Al-Qur’an',
    subtitle:
      'Menumbuhkan kecintaan kepada Al-Qur’an sejak dini.',
    href: '/blog',
  },

  {
    id: 3,
    image: '/images/slides/slide-3.jpg',
    title: 'Kehidupan Pesantren',
    subtitle:
      'Belajar mandiri, disiplin, dan tumbuh bersama dalam kebaikan.',
    href: '/blog',
  },

  {
    id: 4,
    image: '/images/slides/slide-4.jpg',
    title: 'Kebaikan yang Terus Mengalir',
    subtitle:
      'Mari bersama mendukung pendidikan dan kebutuhan para santri.',
    href: '/program',
  },
];

// ============================================================================
// CONFIG
// ============================================================================

const AUTOPLAY_DELAY =
  4500;

// ============================================================================
// COMPONENT
// ============================================================================

export default function HomeCarousel() {
  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);

  const [
    isPaused,
    setIsPaused,
  ] =
    useState(false);

  const touchStartX =
    useRef<number | null>(
      null
    );

  const touchEndX =
    useRef<number | null>(
      null
    );

  // ==========================================================================
  // NEXT
  // ==========================================================================

  const nextSlide =
    useCallback(() => {
      setActiveIndex(
        (current) =>
          (
            current + 1
          ) %
          slides.length
      );
    }, []);

  // ==========================================================================
  // PREVIOUS
  // ==========================================================================

  const previousSlide =
    useCallback(() => {
      setActiveIndex(
        (current) =>
          (
            current -
            1 +
            slides.length
          ) %
          slides.length
      );
    }, []);

  // ==========================================================================
  // AUTOPLAY
  // ==========================================================================

  useEffect(() => {
    if (
      isPaused ||
      slides.length <= 1
    ) {
      return;
    }

    const interval =
      window.setInterval(
        nextSlide,
        AUTOPLAY_DELAY
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    isPaused,
    nextSlide,
  ]);

  // ==========================================================================
  // TOUCH
  // ==========================================================================

  function handleTouchStart(
    event:
      React.TouchEvent
  ) {
    touchStartX.current =
      event.touches[0]
        ?.clientX ??
      null;

    touchEndX.current =
      null;
  }

  function handleTouchMove(
    event:
      React.TouchEvent
  ) {
    touchEndX.current =
      event.touches[0]
        ?.clientX ??
      null;
  }

  function handleTouchEnd() {
    if (
      touchStartX.current ===
        null ||
      touchEndX.current ===
        null
    ) {
      return;
    }

    const distance =
      touchStartX.current -
      touchEndX.current;

    const minimumSwipe =
      45;

    if (
      distance >
      minimumSwipe
    ) {
      nextSlide();
    }

    if (
      distance <
      -minimumSwipe
    ) {
      previousSlide();
    }

    touchStartX.current =
      null;

    touchEndX.current =
      null;
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <section
      aria-label="Dokumentasi Pondok Matan Darussalam"
      className="
        mx-auto
        mt-8
        w-full
        max-w-5xl

        px-4

        sm:px-6

        md:mt-10
      "
    >

      <div
        className="
          group
          relative

          w-full

          overflow-hidden

          bg-gray-100

          shadow-[0_12px_35px_rgba(15,23,42,0.08)]
        "
        onMouseEnter={() =>
          setIsPaused(
            true
          )
        }
        onMouseLeave={() =>
          setIsPaused(
            false
          )
        }
        onTouchStart={
          handleTouchStart
        }
        onTouchMove={
          handleTouchMove
        }
        onTouchEnd={
          handleTouchEnd
        }
      >

        {/* ===============================================================
            SLIDES
            =============================================================== */}

        <div
          className="
            relative

            aspect-[16/9]

            sm:aspect-[16/7]

            md:aspect-[16/6]
          "
        >

          {slides.map(
            (
              slide,
              index
            ) => {
              const active =
                index ===
                activeIndex;

              return (
                <div
                  key={
                    slide.id
                  }
                  aria-hidden={
                    !active
                  }
                  className={`
                    absolute
                    inset-0

                    transition-all
                    duration-700
                    ease-out

                    ${
                      active
                        ? `
                          visible
                          scale-100
                          opacity-100
                        `
                        : `
                          invisible
                          scale-[1.025]
                          opacity-0
                        `
                    }
                  `}
                >

                  {/* IMAGE */}

                  <img
                    src={
                      slide.image
                    }
                    alt={
                      slide.title ||
                      'Dokumentasi Pondok Matan Darussalam'
                    }
                    className="
                      h-full
                      w-full

                      object-cover
                    "
                    loading={
                      index === 0
                        ? 'eager'
                        : 'lazy'
                    }
                  />

                  {/* OVERLAY */}

                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-r

                      from-black/60
                      via-black/20
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-t

                      from-black/35
                      via-transparent
                      to-transparent
                    "
                  />

                  {/* TEXT */}

                  {(
                    slide.title ||
                    slide.subtitle
                  ) && (

                    <div
                      className="
                        absolute

                        bottom-0
                        left-0

                        w-full

                        p-5

                        sm:p-7

                        md:max-w-[60%]
                        md:p-9
                      "
                    >

                      <p
                        className="
                          mb-2

                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.18em]

                          text-emerald-300

                          md:text-[10px]
                        "
                      >
                        Pondok Matan
                        Darussalam
                      </p>

                      {slide.title && (
                        <h2
                          className="
                            text-xl
                            font-extrabold
                            leading-tight
                            tracking-tight

                            text-white

                            sm:text-2xl

                            md:text-3xl
                          "
                        >
                          {
                            slide.title
                          }
                        </h2>
                      )}

                      {slide.subtitle && (

                        <p
                          className="
                            mt-2

                            max-w-lg

                            text-[11px]
                            font-medium
                            leading-5

                            text-white/75

                            sm:text-xs

                            md:text-sm
                            md:leading-6
                          "
                        >
                          {
                            slide.subtitle
                          }
                        </p>

                      )}

                      {slide.href && (

                        <Link
                          href={
                            slide.href
                          }
                          className="
                            mt-4

                            inline-flex
                            items-center

                            border-b
                            border-white/50

                            pb-1

                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.1em]

                            text-white

                            transition-colors

                            hover:border-emerald-300
                            hover:text-emerald-300

                            md:text-[11px]
                          "
                        >
                          Selengkapnya →
                        </Link>

                      )}

                    </div>

                  )}

                </div>
              );
            }
          )}

        </div>

        {/* ===============================================================
            PREVIOUS
            =============================================================== */}

        {slides.length >
          1 && (

          <button
            type="button"
            aria-label="Slide sebelumnya"
            onClick={
              previousSlide
            }
            className="
              absolute

              left-4
              top-1/2

              hidden

              h-10
              w-10

              -translate-y-1/2

              items-center
              justify-center

              border
              border-white/20

              bg-black/30

              text-white

              opacity-0

              backdrop-blur-md

              transition-all

              hover:bg-black/50

              group-hover:opacity-100

              md:flex
            "
          >
            <ChevronLeft
              className="
                h-5
                w-5
              "
            />
          </button>

        )}

        {/* ===============================================================
            NEXT
            =============================================================== */}

        {slides.length >
          1 && (

          <button
            type="button"
            aria-label="Slide berikutnya"
            onClick={
              nextSlide
            }
            className="
              absolute

              right-4
              top-1/2

              hidden

              h-10
              w-10

              -translate-y-1/2

              items-center
              justify-center

              border
              border-white/20

              bg-black/30

              text-white

              opacity-0

              backdrop-blur-md

              transition-all

              hover:bg-black/50

              group-hover:opacity-100

              md:flex
            "
          >
            <ChevronRight
              className="
                h-5
                w-5
              "
            />
          </button>

        )}

        {/* ===============================================================
            DOTS
            =============================================================== */}

        {slides.length >
          1 && (

          <div
            className="
              absolute

              bottom-3
              right-4

              z-20

              flex
              items-center

              gap-1.5

              md:bottom-5
              md:right-5
            "
          >

            {slides.map(
              (
                slide,
                index
              ) => (

                <button
                  key={
                    slide.id
                  }
                  type="button"
                  aria-label={`Tampilkan slide ${
                    index + 1
                  }`}
                  onClick={() =>
                    setActiveIndex(
                      index
                    )
                  }
                  className={`
                    h-1.5

                    transition-all
                    duration-300

                    ${
                      activeIndex ===
                      index
                        ? `
                          w-7
                          bg-emerald-400
                        `
                        : `
                          w-1.5
                          bg-white/60

                          hover:bg-white
                        `
                    }
                  `}
                />

              )
            )}

          </div>

        )}

      </div>

    </section>
  );
}