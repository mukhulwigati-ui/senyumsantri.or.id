// sanity.config.ts

import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import React from 'react';

import { schemaTypes } from './sanity/schemaTypes';

// =========================================================
// CUSTOM THEME
// =========================================================

const emeraldTheme = buildLegacyTheme({
  '--black': '#1f2937',
  '--white': '#ffffff',

  '--brand-primary': '#10b981',

  '--component-bg': '#ffffff',
  '--component-text-color': '#1f2937',

  '--focus-color': '#fbbf24',
});

// =========================================================
// SANITY CONFIG
// =========================================================

export default defineConfig([
  {
    // =====================================================
    // WORKSPACE
    // =====================================================

    name: 'senyum-or-id',

    title: 'Pondok Matan Darussalam',

    projectId:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
      'lsnco71s',

    dataset:
      process.env.NEXT_PUBLIC_SANITY_DATASET ||
      'production',

    basePath: '/studio',

    // =====================================================
    // PLUGINS
    // =====================================================

    plugins: [
      structureTool({
        structure: (S) =>
          S.list()
            .title('Konten Pondok Matan')
            .items([
              // =================================================
              // 1. PROGRAM DONASI
              // =================================================

              S.listItem()
                .title('Program Donasi')
                .child(
                  S.documentTypeList('program').title(
                    'Program Donasi'
                  )
                ),

              // =================================================
              // 2. LAPORAN PENYALURAN
              // =================================================

              S.listItem()
                .title('Laporan Penyaluran')
                .child(
                  S.documentTypeList('laporan').title(
                    'Laporan Penyaluran'
                  )
                ),

              // =================================================
              // 3. KATEGORI
              // =================================================

              S.listItem()
                .title('Kategori')
                .child(
                  S.documentTypeList('category').title(
                    'Kategori'
                  )
                ),

              // =================================================
              // 4. BERITA & ARTIKEL
              // =================================================

              S.listItem()
                .title('Berita & Artikel')
                .child(
                  S.documentTypeList('news').title(
                    'Berita & Artikel'
                  )
                ),

              // =================================================
              // 5. DONATION TRANSACTION
              // =================================================

              S.listItem()
                .title(
                  'Donation Transaction (Pending Box)'
                )
                .child(
                  S.documentTypeList(
                    'donationTransaction'
                  ).title(
                    'Donation Transaction (Pending Box)'
                  )
                ),

              // =================================================
              // PEMBATAS
              // =================================================

              S.divider(),

              // =================================================
              // 6. PENDAFTARAN FUNDRAISER
              // =================================================

              S.listItem()
                .title('Pendaftaran Fundraiser')
                .child(
                  S.documentTypeList(
                    'fundraiser'
                  ).title(
                    'Pendaftaran Fundraiser'
                  )
                ),

              // =================================================
              // 7. PENARIKAN KOMISI FUNDRAISER
              // =================================================

              S.listItem()
                .title('Penarikan Komisi')
                .child(
                  S.list()
                    .title(
                      'Penarikan Komisi Fundraiser'
                    )
                    .items([
                      // =========================================
                      // MENUNGGU
                      // =========================================

                      S.listItem()
                        .title('⏳ Menunggu')
                        .child(
                          S.documentList()
                            .title(
                              'Menunggu Persetujuan'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              '_type == "fundraiserWithdrawal" && status == "pending"'
                            )
                            .defaultOrdering([
                              {
                                field: 'requestedAt',
                                direction: 'desc',
                              },
                            ])
                        ),

                      // =========================================
                      // DISETUJUI
                      // =========================================

                      S.listItem()
                        .title('✅ Disetujui')
                        .child(
                          S.documentList()
                            .title(
                              'Penarikan Disetujui'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              '_type == "fundraiserWithdrawal" && status == "approved"'
                            )
                            .defaultOrdering([
                              {
                                field: 'requestedAt',
                                direction: 'desc',
                              },
                            ])
                        ),

                      // =========================================
                      // SUDAH DIBAYAR
                      // =========================================

                      S.listItem()
                        .title('💸 Sudah Dibayar')
                        .child(
                          S.documentList()
                            .title(
                              'Komisi Sudah Dibayar'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              '_type == "fundraiserWithdrawal" && status == "paid"'
                            )
                            .defaultOrdering([
                              {
                                field: 'paidAt',
                                direction: 'desc',
                              },
                            ])
                        ),

                      // =========================================
                      // DITOLAK
                      // =========================================

                      S.listItem()
                        .title('❌ Ditolak')
                        .child(
                          S.documentList()
                            .title(
                              'Penarikan Ditolak'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              '_type == "fundraiserWithdrawal" && status == "rejected"'
                            )
                            .defaultOrdering([
                              {
                                field: 'requestedAt',
                                direction: 'desc',
                              },
                            ])
                        ),

                      // =========================================
                      // DIBATALKAN
                      // =========================================

                      S.listItem()
                        .title('🚫 Dibatalkan')
                        .child(
                          S.documentList()
                            .title(
                              'Penarikan Dibatalkan'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              '_type == "fundraiserWithdrawal" && status == "cancelled"'
                            )
                            .defaultOrdering([
                              {
                                field: 'requestedAt',
                                direction: 'desc',
                              },
                            ])
                        ),

                      // =========================================
                      // PEMBATAS
                      // =========================================

                      S.divider(),

                      // =========================================
                      // SEMUA RIWAYAT
                      // =========================================

                      S.listItem()
                        .title('📋 Semua Penarikan')
                        .child(
                          S.documentList()
                            .title(
                              'Semua Penarikan Komisi'
                            )
                            .schemaType(
                              'fundraiserWithdrawal'
                            )
                            .filter(
                              '_type == "fundraiserWithdrawal"'
                            )
                            .defaultOrdering([
                              {
                                field: 'requestedAt',
                                direction: 'desc',
                              },
                            ])
                        ),
                    ])
                ),
            ]),
      }),
    ],

    // =====================================================
    // SCHEMA
    // =====================================================

    schema: {
      types: schemaTypes,
    },

    // =====================================================
    // THEME
    // =====================================================

    theme: emeraldTheme,

    // =====================================================
    // STUDIO CUSTOMIZATION
    // =====================================================

    studio: {
      components: {
        navbar: (props) => {
          return React.createElement(
            'div',

            {
              style: {
                display: 'flex',
                flexDirection: 'column',
              },
            },

            // ===============================================
            // CUSTOM HEADER / LOGO
            // ===============================================

            React.createElement(
              'div',

              {
                style: {
                  background:
                    'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 55%, #ffffff 100%)',

                  padding: '14px 20px',

                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',

                  borderBottom:
                    '1px solid #d1fae5',

                  boxShadow:
                    '0 1px 2px rgba(0,0,0,0.02)',
                },
              },

              React.createElement(
                'div',

                {
                  style: {
                    width: '42px',
                    height: '42px',

                    borderRadius: '12px',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    background: '#059669',
                    color: '#ffffff',

                    fontSize: '18px',
                    fontWeight: 800,

                    boxShadow:
                      '0 8px 20px rgba(5,150,105,0.18)',
                  },
                },

                'M'
              ),

              React.createElement(
                'div',

                {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                  },
                },

                React.createElement(
                  'strong',

                  {
                    style: {
                      color: '#111827',

                      fontSize: '14px',
                      lineHeight: '1.35',

                      fontWeight: 800,

                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  },

                  'Pondok Matan Darussalam'
                ),

                React.createElement(
                  'span',

                  {
                    style: {
                      marginTop: '2px',

                      color: '#059669',

                      fontSize: '11px',
                      lineHeight: '1.4',

                      fontWeight: 700,

                      letterSpacing: '0.02em',
                    },
                  },

                  'senyum.or.id'
                )
              )
            ),

            // ===============================================
            // NAVBAR DEFAULT SANITY
            // ===============================================

            props.renderDefault(props)
          );
        },
      },
    },
  },
]);