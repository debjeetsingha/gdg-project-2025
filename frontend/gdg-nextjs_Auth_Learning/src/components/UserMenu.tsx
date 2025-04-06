'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiPlus, FiUser, FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function UserMenu() {
  const { user, logout, signInWithGoogle, linkWithGoogle } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddAccount = async () => {
    try {
      if (user) {
        await linkWithGoogle();
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      console.error('Error handling account:', error);
    } finally {
      setIsOpen(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {user ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 group"
          aria-label="User menu"
          aria-expanded={isOpen}
        >
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'User avatar'}
              width={36}
              height={36}
              className="rounded-full border-2 border-transparent group-hover:border-purple-500 transition-all"
              priority
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center border-2 border-transparent group-hover:border-purple-500 transition-all">
              <FiUser className="text-gray-300 text-lg" />
            </div>
          )}
          <FiChevronDown 
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={signInWithGoogle}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium flex items-center gap-2"
        >
          <FiUser />
          Sign In
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute right-0 mt-2 w-56 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-700 z-50 overflow-hidden"
          >
            <div className="p-1">
              {user?.displayName && (
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="font-medium text-white truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              )}

              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-300 hover:bg-gray-700/50 rounded-md transition"
              >
                <FiUser className="flex-shrink-0" />
                <span>Profile</span>
              </button>

              <button
                onClick={handleAddAccount}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-300 hover:bg-gray-700/50 rounded-md transition"
              >
                <FiPlus className="flex-shrink-0" />
                <span>{user ? 'Add Account' : 'Sign In'}</span>
              </button>

              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 rounded-md transition"
                >
                  <FiLogOut className="flex-shrink-0" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}