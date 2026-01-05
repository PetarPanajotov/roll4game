import { Suspense } from 'react'
import { RandomGamePageClient } from './_components/RandomGamePageClient'
import { WhyDifferentCard } from './_components/WhyDifferentCard'
import Loading from './loading'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Random Game Generator | Find Your Next Favorite Title',
  description:
    'Stuck with a massive backlog? Use our IGDB-powered random game generator to discover hidden gems and top-rated titles across all platforms.',
  keywords: [
    'random game generator',
    'IGDB game finder',
    'what game should I play',
    'video game discovery',
    'random video games',
    'backlog helper',
  ],

  category: 'Gaming',
}

export const viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
}

export default function RandomPage() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <RandomGamePageClient />

        <WhyDifferentCard />
      </Suspense>
    </>
  )
}
