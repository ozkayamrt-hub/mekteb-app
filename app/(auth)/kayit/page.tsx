import type { Metadata } from 'next'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Psikolog Kaydı — Mekteb',
}

export default function KayitPage() {
  return <RegisterForm />
}
