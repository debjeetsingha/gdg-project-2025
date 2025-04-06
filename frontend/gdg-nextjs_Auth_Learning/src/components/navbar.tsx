'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { FiHome, FiTrendingUp, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from 'next-themes';

export function NavBar() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full bg-gray-800/80 backdrop-blur-md border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              INVESTOPIA
            </Link>
            <nav className="hidden md:flex space-x-1">
              <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <FiHome /> Home
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/learning" className="flex items-center gap-2">
                  <FiTrendingUp /> Learning
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </Button>

            {user ? (
              <Button variant="ghost" asChild>
                <Link href="/profile" className="flex items-center gap-2">

                      <FiUser />

                  <span className="hidden md:inline">Profile</span>
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}