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
// SITE CONFIG
// ============================================================================

const SITE_NAME =
  'Pondok Matan Darussalam';

// ============================================================================
// TYPES
// ============================================================================

type SlideItem = {
  id: string;

  image: string;

  title: string;

  subtitle: string;

  alt: string;

  buttonLabel: string;

  href: string;

  order?: number;
};

type SliderApiResponse = {
  success?: boolean;

  data?: unknown;

  message?: string;
};

// ============================================================================
// CONFIG
// ============================================================================

const AUTOPLAY_DELAY =
  4500;

// ============================================================================
// HELPERS
// ============================================================================

function isSlideItem(
  value: unknown
): value is SlideItem {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return false;
  }

  const item =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof item.id === 'string' &&
    item.id.trim().length > 0 &&
    typeof item.image === 'string' &&
    item.image.trim().length > 0
  );
}

function isInternalLink(
  href: string
): boolean {
  return (
    href.startsWith('/') ||
    href.startsWith('#')
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function HomeCarousel() {
  const [
    slides,
    setSlides,
  ] =
    useState<SlideItem[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

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
  // FETCH SLIDERS
  // ==========================================================================

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadSlider() {
      try {
        setLoading(true);

        const response =
          await fetch(
            `/api/sliders?v=${Date.now()}`,
            {
              method:
                'GET',

              cache:
                'no-store',

              signal:
                controller.signal,

              headers: {
                Accept:
                  'application/json',

                'Cache-Control':
                  'no-cache, no-store, must-revalidate',

                Pragma:
                  'no-cache',
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const json =
          (await response.json()) as SliderApiResponse;

        if (
          json.success !== true ||
          !Array.isArray(
            json.data
          )
        ) {
          throw new Error(
            json.message ||
            'Data slider tidak valid.'
          );
        }

        const validSlides =
          json.data.filter(
            isSlideItem
          );

        setSlides(
          validSlides
        );

        setActiveIndex(0);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'AbortError'
        ) {
          return;
        }

        console.error(
          `[${SITE_NAME}] HomeCarousel fetch error:`,
          error
        );

        setSlides([]);
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setLoading(false);
        }
      }
    }

    loadSlider();

    return () => {
      controller.abort();
    };
  }, []);

  // ==========================================================================
  // COUNT
  // ==========================================================================

  const slideCount =
    slides.length;

  // ==========================================================================
  // NEXT
  // ==========================================================================

  const nextSlide =
    useCallback(() => {
      if (
        slideCount <= 1
      ) {
        return;
      }

      setActiveIndex(
        (current) =>
          (
            current + 1
          ) %
          slideCount
      );
    }, [
      slideCount,
    ]);

  // ==========================================================================
  // PREVIOUS
  // ==========================================================================

  const previousSlide =
    useCallback(() => {
      if (
        slideCount <= 1
      ) {
        return;
      }

      setActiveIndex(
        (current) =>
          (
            current -
            1 +
            slideCount
          ) %
          slideCount
      );
    }, [
      slideCount,
    ]);

  // ==========================================================================
  // AUTOPLAY
  // ==========================================================================

  useEffect(() => {
    if (
      isPaused ||
      slideCount <= 1
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
    slideCount,
  ]);

  // ==========================================================================
  // ACTIVE INDEX SAFETY
  // ==========================================================================

  useEffect(() => {
    if (
      slideCount === 0
    ) {
      setActiveIndex(0);

      return;
    }

    if (
      activeIndex >=
      slideCount
    ) {
      setActiveIndex(0);
    }
  }, [
    activeIndex,
    slideCount,
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
  // LOADING
  // ==========================================================================

  if (loading) {
    return (
      <section
        aria-label="Memuat slider"
        className="
          mt-8
          w-full
          px-4

          md:mt-10
          md:px-16
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-5xl
          "
        >
          <div
            className="
              aspect-[16/9]
              w-full

              animate-pulse

              rounded-[26px]

              border
              border-white

              bg-gray-100

              shadow-[0_18px_55px_rgba(15,23,42,0.12)]

              sm:aspect-[16/7]

              md:aspect-[16/6]
            "
          />
        </div>
      </section>
    );
  }

  // ==========================================================================
  // EMPTY
  // ==========================================================================

  if (
    slideCount === 0
  ) {
    return null;
  }

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <section
      aria-label={`Dokumentasi ${SITE_NAME}`}
      className="
        mt-8
        w-full
        px-4

        md:mt-10
        md:px-16
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-5xl
        "
      >

        <div
          className="
            group
            relative

            w-full

            overflow-hidden

            rounded-[26px]

            border
            border-white

            bg-gray-100

            shadow-[0_18px_55px_rgba(15,23,42,0.16)]

            ring-1
            ring-black/5
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
                            scale-[1.02]
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
                        slide.alt ||
                        slide.title ||
                        `Dokumentasi ${SITE_NAME}`
                      }
                      loading={
                        index === 0
                          ? 'eager'
                          : 'lazy'
                      }
                      className="
                        h-full
                        w-full

                        object-cover
                      "
                    />

                    {/* OVERLAY */}

                    <div
                      className="
                        absolute
                        inset-0

                        bg-gradient-to-r

                        from-black/65
                        via-black/25
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

                          md:max-w-[62%]
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
                          {SITE_NAME}
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

                              text-white/80

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
                          isInternalLink(
                            slide.href
                          ) ? (

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
                              {
                                slide.buttonLabel ||
                                'Selengkapnya'
                              } →
                            </Link>

                          ) : (

                            <a
                              href={
                                slide.href
                              }
                              target="_blank"
                              rel="noopener noreferrer"
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
                              {
                                slide.buttonLabel ||
                                'Selengkapnya'
                              } →
                            </a>

                          )
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

          {slideCount >
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

                h-11
                w-11

                -translate-y-1/2

                items-center
                justify-center

                rounded-full

                border
                border-white/25

                bg-black/35

                text-white

                opacity-0

                backdrop-blur-md

                transition-all

                hover:bg-black/55

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

          {slideCount >
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

                h-11
                w-11

                -translate-y-1/2

                items-center
                justify-center

                rounded-full

                border
                border-white/25

                bg-black/35

                text-white

                opacity-0

                backdrop-blur-md

                transition-all

                hover:bg-black/55

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

          {slideCount >
            1 && (

            <div
              className="
                absolute

                bottom-4
                right-5

                z-20

                flex
                items-center

                gap-1.5
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

                      rounded-full

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
                            bg-white/65

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

      </div>

    </section>
  );
}
