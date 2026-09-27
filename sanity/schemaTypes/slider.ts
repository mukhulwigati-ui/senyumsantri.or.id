// sanity/schemaTypes/slider.ts

import {
  defineField,
  defineType,
} from 'sanity';

// ============================================================================
// SLIDER HOMEPAGE
// ============================================================================
//
// Digunakan untuk carousel / slideshow di bawah Hero.
//
// Gambar, judul, deskripsi, tombol, urutan, dan status aktif
// semuanya dikelola dari Sanity Studio.
//
// ============================================================================

export default defineType({
  name: 'slider',

  title: 'Slider Homepage',

  type: 'document',

  fields: [
    // ==========================================================================
    // STATUS
    // ==========================================================================

    defineField({
      name: 'active',

      title: 'Aktif',

      type: 'boolean',

      description:
        'Aktifkan agar slide tampil di halaman utama.',

      initialValue:
        true,
    }),

    // ==========================================================================
    // ORDER
    // ==========================================================================

    defineField({
      name: 'order',

      title: 'Urutan',

      type: 'number',

      description:
        'Semakin kecil angkanya, semakin awal slide ditampilkan.',

      initialValue:
        1,

      validation: (Rule) =>
        Rule
          .required()
          .integer()
          .min(1)
          .max(999),
    }),

    // ==========================================================================
    // IMAGE
    // ==========================================================================

    defineField({
      name: 'image',

      title: 'Gambar Slider',

      type: 'image',

      description:
        'Gunakan gambar horizontal. Rekomendasi minimal 1600 × 700 px.',

      options: {
        hotspot:
          true,
      },

      validation: (Rule) =>
        Rule.required(),
    }),

    // ==========================================================================
    // ALT IMAGE
    // ==========================================================================

    defineField({
      name: 'alt',

      title: 'Alt Gambar',

      type: 'string',

      description:
        'Teks alternatif untuk SEO dan aksesibilitas.',

      validation: (Rule) =>
        Rule
          .max(160),
    }),

    // ==========================================================================
    // TITLE
    // ==========================================================================

    defineField({
      name: 'title',

      title: 'Judul',

      type: 'string',

      description:
        'Judul utama yang tampil di atas gambar.',

      validation: (Rule) =>
        Rule
          .max(100),
    }),

    // ==========================================================================
    // SUBTITLE
    // ==========================================================================

    defineField({
      name: 'subtitle',

      title: 'Deskripsi Singkat',

      type: 'text',

      rows:
        3,

      description:
        'Deskripsi pendek di bawah judul.',

      validation: (Rule) =>
        Rule
          .max(220),
    }),

    // ==========================================================================
    // BUTTON LABEL
    // ==========================================================================

    defineField({
      name: 'buttonLabel',

      title: 'Tulisan Tombol',

      type: 'string',

      description:
        'Contoh: Selengkapnya, Lihat Program, Tentang Kami.',

      initialValue:
        'Selengkapnya',

      validation: (Rule) =>
        Rule
          .max(40),
    }),

    // ==========================================================================
    // BUTTON LINK
    // ==========================================================================

    defineField({
      name: 'href',

      title: 'Link Tombol',

      type: 'string',

      description:
        'Bisa berupa link internal seperti /program atau URL lengkap https://...',

      validation: (Rule) =>
        Rule.custom(
          (
            value:
              | string
              | undefined
          ) => {
            if (!value) {
              return true;
            }

            const cleanValue =
              value.trim();

            if (!cleanValue) {
              return true;
            }

            const isInternal =
              cleanValue.startsWith('/');

            const isHttpUrl =
              /^https?:\/\/.+/i.test(
                cleanValue
              );

            if (
              !isInternal &&
              !isHttpUrl
            ) {
              return 'Gunakan link internal seperti /program atau URL lengkap https://...';
            }

            return true;
          }
        ),
    }),
  ],

  // ==========================================================================
  // PREVIEW
  // ==========================================================================

  preview: {
    select: {
      title:
        'title',

      subtitle:
        'subtitle',

      media:
        'image',

      active:
        'active',

      order:
        'order',
    },

    prepare({
      title,
      subtitle,
      media,
      active,
      order,
    }) {
      const status =
        active === false
          ? 'NONAKTIF'
          : 'AKTIF';

      const orderLabel =
        typeof order === 'number'
          ? `Urutan ${order}`
          : 'Belum diurutkan';

      return {
        title:
          title ||
          'Slider tanpa judul',

        subtitle:
          `${status} • ${orderLabel}${
            subtitle
              ? ` • ${subtitle}`
              : ''
          }`,

        media,
      };
    },
  },

  // ==========================================================================
  // ORDERING DI SANITY STUDIO
  // ==========================================================================

  orderings: [
    {
      title:
        'Urutan Slider',

      name:
        'sliderOrder',

      by: [
        {
          field:
            'order',

          direction:
            'asc',
        },
      ],
    },

    {
      title:
        'Terbaru',

      name:
        'sliderNewest',

      by: [
        {
          field:
            '_createdAt',

          direction:
            'desc',
        },
      ],
    },
  ],
});
