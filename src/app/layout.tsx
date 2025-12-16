import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import { BuyMeACoffeeButton } from '@/components/ui/buy-me-a-coffee-button/BuyMeACoffeeButton'

export const metadata: Metadata = {
  title: 'Roll4Game',
  description: 'Pick a random game and track your list',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Header></Header>
        {children}
        <BuyMeACoffeeButton />
      </body>
    </html>
  )
}
