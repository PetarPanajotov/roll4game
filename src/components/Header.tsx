'use client'

import { getTwitchToken } from '@/lib/twitchToken'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/random', label: 'Random' },
  { href: '/list', label: 'My List' },
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

const authorizedLinks = [{ href: '/logout', label: 'Logout' }]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b">
      <div className="mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          Roll4Game
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
          <div className="flex gap-3 items-center">
            {unauthorizedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  'font-bold text-[11px] px-2.5 py-1 sm:text-sm sm:px-5 sm:py-1.5 ' +
                  link.class
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
        <button
          className="text-2xl sm:hidden p-2"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </div>
      {/* Mobile Aside Menu */}
      <div
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
      </div>
    </header>
  )
}
