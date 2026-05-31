/* ══════════════════════════════════════════
   Mekteb Platform Sabitleri
   Tüm fiyatlar ve kurallar tek noktadan
══════════════════════════════════════════ */

export const AIDAT = {
  aday:  499,
  uzman: 999,
  ustat: 1499,
} as const

// Minimum seans ücreti = aidat miktarı
// "1 seans en az aidatını karşılamalı" kuralı
export const MIN_SESSION_FEE = AIDAT

export const TIER_LABEL = {
  aday:  'I — Aday',
  uzman: 'II — Uzman',
  ustat: 'III — Üstat',
} as const

export const TIER_COLOR = {
  aday:  '#a0b5a5',
  uzman: '#9e7d4c',
  ustat: '#c9a96e',
} as const

export const ADMIN_EMAIL = 'ozkaya.mrt@gmail.com'
