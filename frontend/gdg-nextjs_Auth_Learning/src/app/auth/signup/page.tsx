'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firebase: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Initialize Google Auth Provider
  const googleProvider = new GoogleAuthProvider();

  // Handle redirect in useEffect
  useEffect(() => {
    if (user || shouldRedirect) {
      router.push('/onboarding');
    }
  }, [user, shouldRedirect, router]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      firebase: ''
    };

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    // Password validation (min 6 chars)
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.firebase) {
      setErrors(prev => ({ ...prev, firebase: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, firebase: '' }));

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });

      // Trigger redirect through useEffect
      setShouldRedirect(true);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrors(prev => ({ ...prev, firebase: '' }));

    try {
      await signInWithPopup(auth, googleProvider);
      setShouldRedirect(true);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAuthError = (err: unknown) => {
    let errorMessage = 'Authentication failed. Please try again.';
    if (err instanceof Error) {
      switch (err.message) {
        case 'Firebase: Error (auth/email-already-in-use).':
          errorMessage = 'Email already in use.';
          break;
        case 'Firebase: Error (auth/invalid-email).':
          errorMessage = 'Invalid email format.';
          break;
        case 'Firebase: Error (auth/weak-password).':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'Firebase: Error (auth/operation-not-allowed).':
          errorMessage = 'Email/password accounts are not enabled.';
          break;
        case 'Firebase: Error (auth/popup-closed-by-user).':
          errorMessage = 'Popup was closed before completing sign in.';
          break;
        case 'Firebase: Error (auth/cancelled-popup-request).':
          errorMessage = 'Only one popup request is allowed at a time.';
          break;
      }
    }
    setErrors(prev => ({ ...prev, firebase: errorMessage }));
  };

  const isFormValid = 
    formData.fullName && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && 
    formData.password.length >= 6 && 
    formData.password === formData.confirmPassword;

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
          Create Account
        </h1>
        
        {errors.firebase && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-lg">
            {errors.firebase}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
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
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800/50 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-gray-600 hover:bg-gray-700/50 transition ${
              isGoogleLoading ? 'opacity-70' : ''
            }`}
          >
            {isGoogleLoading ? (
              <span className="text-gray-400">Signing in with Google...</span>
            ) : (
              <>
                <Image 
                  src="/images/google.webp" 
                  alt="Google logo" 
                  width={20} 
                  height={20} 
                />
                <span className="text-gray-300">Sign up with Google</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-purple-400 hover:underline">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}