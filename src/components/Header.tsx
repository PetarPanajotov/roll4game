'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Gochi_Hand } from 'next/font/google'

const links = [
  { href: '/', label: 'Home' },
  { href: '/random-game', label: 'Random Game' },
]

const unauthorizedLinks = [
  {
    href: '/login',
    label: 'Sign In',
    class:
      'text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700',
  },
  {
    href: '/register',
    label: 'Sign Up',
    class:
      'focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 rounded-lg dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900',
  },
]

const gochiHand = Gochi_Hand({
  weight: '400',
  subsets: ['latin'],
})

const authorizedLinks = [{ href: '/logout', label: 'Logout' }]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-black">
      <div className="mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold flex items-center gap-2">
          {/* TODO: Create component Roll4Next branding and move Image + text inside it */}
          <Image
            className="h-auto"
            width={65}
            height={65}
            src={'/dice-transperant_v1.png'}
            alt="roll4next"
            priority={true}
          />
          <span
            className={`${gochiHand.className} hidden md:inline text-2xl md:text-3xl pt-1 font-bold bg-gradient-to-r from-[#8b2cf5] via-[#6067eb] to-[#059dcf] bg-clip-text text-transparent`}
          >
            Roll4Next
          </span>
        </Link>
        <nav className="flex gap-4 sm:gap-14">
          <div className="flex gap-4 sm:gap-8 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] sm:text-sm font-bold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      {/* <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#171717] shadow-lg transform transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button className="p-4" onClick={() => setOpen(false)}>
          ✕
        </button>
        <nav className="flex flex-col gap-4 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div> */}
    </header>
  )
}
