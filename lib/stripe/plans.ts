import type { Tier } from '@/types/database'
import { AIDAT, MIN_SESSION_FEE } from '@/lib/constants'

export const PLANS: Record<Tier, { label: string; price: number; minSessionFee: number; priceId: string; features: string[] }> = {
  aday: {
    label: 'Aday Üyelik',
    price: AIDAT.aday,
    minSessionFee: MIN_SESSION_FEE.aday,
    priceId: process.env.STRIPE_PRICE_ADAY ?? '',
    features: [
      'Mentor eşleştirmesi',
      '3–5 danışan kabulü',
      'Süpervizyon grupları',
      'Platform profili',
      `Min. seans ücreti: ${MIN_SESSION_FEE.aday.toLocaleString('tr-TR')}₺`,
    ],
  },
  uzman: {
    label: 'Uzman Üyelik',
    price: AIDAT.uzman,
    minSessionFee: MIN_SESSION_FEE.uzman,
    priceId: process.env.STRIPE_PRICE_UZMAN ?? '',
    features: [
      'Sınırsız danışan kabulü',
      'Öncelikli eşleştirme',
      'Öne çıkan profil',
      'Topluluk etkinlikleri',
      'İsteğe bağlı mentörlük',
      `Min. seans ücreti: ${MIN_SESSION_FEE.uzman.toLocaleString('tr-TR')}₺`,
    ],
  },
  ustat: {
    label: 'Üstat Üyelik',
    price: AIDAT.ustat,
    minSessionFee: MIN_SESSION_FEE.ustat,
    priceId: process.env.STRIPE_PRICE_USTAT ?? '',
    features: [
      'Tüm Uzman özellikleri',
      'Resmi mentörlük yetkisi',
      'Ortak seans hakkı',
      'Üstat rozeti & öne çıkarma',
      'Komite üyeliği',
      'Yönlendirme bonusu',
      `Min. seans ücreti: ${MIN_SESSION_FEE.ustat.toLocaleString('tr-TR')}₺`,
    ],
  },
}
