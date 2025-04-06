'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (user || shouldRedirect) {
      router.push('/learning');
    }
  }, [user, shouldRedirect, router]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsValidPassword(value.length >= 6);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail || !isValidPassword) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShouldRedirect(true);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      // const timeoutPromise = new Promise((_, reject) => {
      //   setTimeout(() => reject(new Error('Authentication timeout')), 30000);
      // });
  
      // Race between auth and timeout
      // const result = await Promise.race([
      //   signInWithPopup(auth, googleProvider),
      //   timeoutPromise
      // ]);
      setShouldRedirect(true);
    } catch (err) {
      if (err instanceof Error ) {
        setError('Sign-in took too long. Please try again.');
      } else {
        handleAuthError(err);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAuthError = (err: unknown) => {
    let errorMessage = 'Authentication failed. Please try again.';
    
    if (err instanceof Error) {
      const errorCode = err.message.match(/\(auth\/(.*?)\)/)?.[1];
      switch (errorCode) {
        // Email/password errors
        case 'Firebase: Error (auth/user-not-found).':
          errorMessage = 'No user found with this email.';
          break;
        case 'Firebase: Error (auth/wrong-password).':
          errorMessage = 'Incorrect password.';
          break;
        case 'Firebase: Error (auth/invalid-email).':
          errorMessage = 'Invalid email format.';
          break;
        case 'Firebase: Error (auth/too-many-requests).':
          errorMessage = 'Too many attempts. Try again later.';
          break;
        // Google errors
        case 'Firebase: Error (auth/popup-closed-by-user).':
          errorMessage = 'Sign-in popup was closed. Please try again.';
          break;
        case 'Firebase: Error (auth/cancelled-popup-request).':
          errorMessage = 'Multiple popup attempts detected. Please try again.';
          break;
        case 'Firebase: Error (auth/account-exists-with-different-credential).':
          errorMessage = 'Account exists with different credentials.';
          break;
      }
    }
    
    setError(errorMessage);
  };

  const isFormValid = isValidEmail && isValidPassword;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/chat-bg.jpg"
          alt="Chat background"
          fill
          className="object-cover"
          quality={80}
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700"
      >
        <h1 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Welcome Back
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
              required
            />
            {!isValidEmail && email && (
              <p className="mt-1 text-xs text-red-400">Please enter a valid email address</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {!isValidPassword && password && (
              <p className="mt-1 text-xs text-red-400">Password must be at least 6 characters</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3 rounded-lg font-medium transition ${
              isFormValid 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            } ${
              isSubmitting ? 'opacity-70' : ''
            }`}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Google Sign-In Section */}
        <div className="mt-6">
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800/50 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-600 hover:bg-gray-700/30 transition ${
              isGoogleLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isGoogleLoading ? (
              <span className="loading-spinner h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <div className="google-logo w-5 h-5 relative">
                  <Image
                    src="/images/google.webp"
                    alt="Google logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-gray-300">Sign in with Google</span>
              </>
            )}
          </motion.button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link 
            href="/auth/signup" 
            className="text-purple-400 hover:underline hover:text-purple-300 transition"
          >
            Sign up
          </Link>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </motion.div>
    </div>
  );
}