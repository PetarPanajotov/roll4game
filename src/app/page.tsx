'use client'
import { Button } from '@/components/ui/button/Button'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@/components/ui/card/Card'
import { CurveSeparator } from '@/components/ui/curve-seperator/CurveSeperator'
import { Dice3, Star, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

export default function Home() {
  const categorySectionRef = useRef<HTMLDivElement>(null)
  /** TODO: Metadata are missing, as the component is 'use client'. They will be added in incoming days */
  const features = [
    { icon: Zap, text: 'Instant recommendations' },
    { icon: Star, text: 'Curated from top sources' },
    { icon: Dice3, text: 'Endless possibilities' },
  ]

  const scrollToCategories = () => {
    categorySectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="min-h-screen container mx-auto overflow-hidden">
      <section className="relative pt-15 pb-15 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 inline-block">
            <div className="relative mb-8 inline-block">
              <div className="relative">
                {/* The Dice Image */}
                <Image
                  src={'/dice-transperant_v2.png'}
                  width={250}
                  height={250}
                  className="relative z-10"
                  alt="dice-brand"
                />

                {/* High-Visibility Shadow */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-8 z-0">
                  {/* Inner White Core (Gives the white dice a base) */}
                  <div className="absolute inset-0 bg-white/10 blur-xl rounded-[100%]" />
                  {/* Outer Blue Glow (Adds the brand color) */}
                  <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-[100%] scale-150" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-7xl md:text-8xl font-bold mb-6 leading-tight tracking-tight">
            Can't Decide?
            <br />
            <span className="text-blue-400">Just Roll</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Let fate choose your next obsession. Random games, TV shows, movies,
            and more — because sometimes the best discoveries are unexpected.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={scrollToCategories}
              className="group px-8 py-4 bg-white text-black rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              Start Rolling
            </button>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/5 transition-all duration-200">
              Learn More
            </button>
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-gray-300"
              >
                <feature.icon className="w-4 h-4 text-blue-400" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div ref={categorySectionRef} className="py-5">
          <CurveSeparator />

          <h2 className="text-[3rem] text-center font-bold">
            What Should You Roll?
          </h2>

          {/*TODO: Refactor - extract card component to reduce duplication
           *REFACTOR: Create reusable CategoryCard component
           *FIXME: Too much repetition, needs component extraction
           */}
          <div className="grid grid-cols-12 gap-8 pt-10">
            <Link href="/random" className="col-span-12 lg:col-span-3">
              <Card className="col-span-3 border-indigo-400 border-t-indigo-400/90 border-t-10 p-10 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40">
                <CardHeader className="flex items-center">
                  <span className="text-6xl">🎮</span>
                  <h3 className="text-3xl pt-5 font-bold">Games</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-400 text-center">
                    Discover your next gaming obsession from thousands of titles
                    powered by IGDB
                  </p>
                </CardBody>
                <CardFooter className="flex items-center justify-center">
                  {/* TODO: Create Button Component */}
                  <Button variant="secondaryLight" size="lg">
                    Visit Page
                  </Button>
                </CardFooter>
              </Card>
            </Link>
            <Card className="col-span-12 lg:col-span-3 border-indigo-400 opacity-50 p-10 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40 pointer-events-none">
              <CardHeader className="flex items-center">
                <span className="text-6xl">🎬</span>
                <h3 className="text-3xl pt-5 font-bold">Movies</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-400 text-center">
                  Roll the dice on your next movie night pick
                </p>
              </CardBody>
              <CardFooter className="flex items-center justify-center">
                {/* TODO: Create Button Component */}
                <button className="border border-amber-400 rounded-full px-5 py-2 bg-amber-600/40 text-indigo-200 font-bold">
                  🎲 Rolling soon
                </button>
              </CardFooter>
            </Card>
            <Card className="col-span-12 lg:col-span-3 border-indigo-400 opacity-50 p-10 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40 pointer-events-none">
              <CardHeader className="flex items-center">
                <span className="text-6xl">📺</span>
                <h3 className="text-3xl pt-5 font-bold">TV Show</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-400 text-center">
                  Find the perfect series to binge-watch this weekend
                </p>
              </CardBody>
              <CardFooter className="flex items-center justify-center">
                <button className="border border-amber-400 rounded-full px-5 py-2 bg-amber-600/40 text-indigo-200 font-bold">
                  🎲 Rolling soon
                </button>
              </CardFooter>
            </Card>
            <Card className="col-span-12 lg:col-span-3 border-indigo-400 opacity-50 p-10 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40 pointer-events-none">
              <CardHeader className="flex items-center">
                <span className="text-6xl">🎲</span>
                <h3 className="text-3xl pt-5 font-bold">Board Game</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-400 text-center">
                  Discover exciting tabletop adventures for your next game night
                </p>
              </CardBody>
              <CardFooter className="flex items-center justify-center">
                {/* TODO: Create Button Component */}
                <button className="border border-amber-400 rounded-full px-5 py-2 bg-amber-600/40 text-indigo-200 font-bold">
                  🎲 Rolling soon
                </button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
