import type { Tier } from '@/types/database'

export const PLANS: Record<Tier, { label: string; price: number; priceId: string; features: string[] }> = {
  aday: {
    label: 'Aday Üyelik',
    price: 299,
    priceId: process.env.STRIPE_PRICE_ADAY ?? '',
    features: [
      'Mentor eşleştirmesi',
      '3–5 danışan kabulü',
      'Süpervizyon grupları',
      'Platform profili',
    ],
  },
  uzman: {
    label: 'Uzman Üyelik',
    price: 599,
    priceId: process.env.STRIPE_PRICE_UZMAN ?? '',
    features: [
      'Sınırsız danışan kabulü',
      'Öncelikli eşleştirme',
      'Öne çıkan profil',
      'Topluluk etkinlikleri',
      'İsteğe bağlı mentörlük',
    ],
  },
  ustat: {
    label: 'Üstat Üyelik',
    price: 999,
    priceId: process.env.STRIPE_PRICE_USTAT ?? '',
    features: [
      'Tüm Uzman özellikleri',
      'Resmi mentörlük yetkisi',
      'Ortak seans hakkı',
      'Üstat rozeti & öne çıkarma',
      'Komite üyeliği',
      'Yönlendirme bonusu',
    ],
  },
}
