'use client'

import { useTheme } from '../context/ThemeContext'
import { MoonIcon, SunIcon } from './Icons'
import Link from 'next/link'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <header className="glass-panel-fun w-full py-4 px-6 sticky top-0 z-10 animate-fade-in">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center no-underline group">
          <div className="font-bold text-xl sm:text-2xl text-gradient-fun transition-all duration-300 group-hover:scale-105">
            Garden Soil Calculator
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-[var(--glass-background)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <div className={theme === 'light' ? '' : 'animate-spin'} style={{ animationDuration: '4s' }}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
