'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FiEdit, FiSave, FiX, FiUser, FiDollarSign,  FiAward, FiPieChart,FiHome, FiChevronDown, FiBookOpen } from 'react-icons/fi';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type ProfileData = {
  name: string;
  age: number;
  monthlyincome: number;
  monthlysaving: number;
  profession: string;
  primaryreasonforinvesting: string;
  financialrisk: string;
  expaboutinvesting: string;
  estimateinvestingduration: number;
  typesofinvestment: string[];
  portfolio: { symbol: string; name: string }[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

type ExperiencePoints = {
  score: number;
};

const professionOptions = ['Employed', 'Self-employed', 'Unemployed'];
const incomeOptions = ['Less than ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 and above'];
const savingOptions = ['Less than ₹5,000', '₹5,000 - ₹15,000', '₹15,000 - ₹50,000', '₹50,000+'];
const reasonOptions = [
  'I want to grow my wealth',
  'I want a safe and stable investment',
  'I want to save for a major purchase',
  'I want to build retirement savings',
  'I want to generate passive income'
];
const riskOptions = [
  'I avoid risk completely',
  'I can take a little risk for better returns',
  'I can handle moderate risk',
  'I am willing to take high risks for high returns'
];
const experienceOptions = [
  'I am a complete beginner',
  'I know some basics',
  'I have experience with investing',
  'I am an expert investor'
];
const durationOptions = ['Less than 1 year', '1-3 years', '3-7 years', '7+ years'];
const investmentTypeOptions = ['Stocks', 'Bonds', 'Real Estate', 'Cryptocurrency', 'Mutual Funds', 'Gold'];
const portfolioOptions = [
  { id: 'stock-aapl', name: 'Apple (AAPL)', logo: '/images/aapl.png', symbol: 'AAPL' },
  { id: 'stock-msft', name: 'Microsoft (MSFT)', logo: '/images/msft.webp', symbol: 'MSFT' },
  { id: 'stock-googl', name: 'Alphabet (GOOGL)', logo: '/images/google.webp', symbol: 'GOOGL' },
  { id: 'stock-amzn', name: 'Amazon (AMZN)', logo: '/images/amzn.png', symbol: 'AMZN' },
  { id: 'stock-tsla', name: 'Tesla (TSLA)', logo: '/images/tsla.png', symbol: 'TSLA' },
  { id: 'stock-nflx', name: 'Netflix (NFLX)', logo: '/images/nflx.png', symbol: 'NFLX' },
  { id: 'crypto-btc', name: 'Bitcoin (BTC)', logo: '/images/btc.png', symbol: 'BTC' },
  { id: 'crypto-eth', name: 'Ethereum (ETH)', logo: '/images/eth.png', symbol: 'ETH' },
  { id: 'crypto-sol', name: 'Solana (SOL)', logo: '/images/sol.png', symbol: 'SOL' },
  { id: 'crypto-bnb', name: 'BNB (BNB)', logo: '/images/bnb.png', symbol: 'BNB' },
  { id: 'crypto-xrp', name: 'XRP (XRP)', logo: '/images/xrp.png', symbol: 'XRP' },
  { id: 'crypto-doge', name: 'Dogecoin (DOGE)', logo: '/images/doge.png', symbol: 'DOGE' },
];

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editableProfile, setEditableProfile] = useState<Partial<ProfileData>>({});
  const [selectedInvestmentTypes, setSelectedInvestmentTypes] = useState<string[]>([]);
  const [selectedPortfolioItems, setSelectedPortfolioItems] = useState<{ symbol: string; name: string }[]>([]);
  const [isPortfolioDropdownOpen, setIsPortfolioDropdownOpen] = useState(false);
  const [experiencePoints, setExperiencePoints] = useState<number>(0);

  // Parallax scroll effects
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Fetch profile data and experience points
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch profile data
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          setProfile(data);
          setEditableProfile(data);
          setSelectedInvestmentTypes(data.typesofinvestment || []);
          setSelectedPortfolioItems(data.portfolio || []);
        } else {
          toast.error('Profile not found');
        }

        // Fetch experience points
        const expRef = doc(db, 'experiencePoints', user.uid);
        const expSnap = await getDoc(expRef);
        
        if (expSnap.exists()) {
          const expData = expSnap.data() as ExperiencePoints;
          setExperiencePoints(expData.score || 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Handle input changes
  const handleInputChange = <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K]
  ) => {
    setEditableProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle investment type selection
  const toggleInvestmentType = (type: string) => {
    const newTypes = selectedInvestmentTypes.includes(type) 
      ? selectedInvestmentTypes.filter(t => t !== type) 
      : [...selectedInvestmentTypes, type];
    
    setSelectedInvestmentTypes(newTypes);
    handleInputChange('typesofinvestment', newTypes);
  };

  // Toggle portfolio item selection
  const togglePortfolioItem = (item: { symbol: string; name: string }) => {
    const newItems = selectedPortfolioItems.some(i => i.symbol === item.symbol)
      ? selectedPortfolioItems.filter(i => i.symbol !== item.symbol)
      : [...selectedPortfolioItems, item];
    
    setSelectedPortfolioItems(newItems);
    handleInputChange('portfolio', newItems);
  };

  // Format income for display
  const formatIncome = (income: number): string => {
    if (income < 20000) return 'Less than ₹10,000';
    if (income < 37500) return '₹10,000 - ₹25,000';
    if (income < 75000) return '₹25,000 - ₹50,000';
    if (income < 150000) return '₹50,000 - ₹1,00,000';
    return '₹1,00,000 and above';
  };

  // Format saving for display
  const formatSaving = (saving: number): string => {
    if (saving < 10000) return 'Less than ₹5,000';
    if (saving < 32500) return '₹5,000 - ₹15,000';
    if (saving < 60000) return '₹15,000 - ₹50,000';
    return '₹50,000+';
  };

  // Save profile changes
  const handleSave = async () => {
    if (!user || !profile) return;
    
    setIsLoading(true);
    try {
      const updatedData = {
        ...editableProfile,
        typesofinvestment: selectedInvestmentTypes,
        portfolio: selectedPortfolioItems,
        updatedAt: new Date().toISOString()
      };

      // Update Firebase
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updatedData);

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (profile) {
      setEditableProfile(profile);
      setSelectedInvestmentTypes(profile.typesofinvestment || []);
      setSelectedPortfolioItems(profile.portfolio || []);
    }
    setIsEditing(false);
  };

  // Navigate to learning page
  const goToLearning = () => {
    router.push('/learning');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center"
        >
          <motion.div 
            className="w-16 h-16 rounded-full bg-indigo-900"
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Profile Not Found</h2>
          <p className="text-white/80 mb-6">Complete your onboarding to create a profile</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium shadow-lg"
          >
            Start Onboarding
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
      {/* Floating background elements */}
      <motion.div 
        style={{ y: y1 }}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div 
        style={{ y: y2 }}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl" />
      </motion.div>

      {/* Toast notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e1b4b',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#22d3ee',
              secondary: '#1e1b4b',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#1e1b4b',
            },
          },
        }}
      />

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        {/* Header with glass morphism effect */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-6 mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-2"
              >
                Your Investment Profile
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/80"
              >
                View and manage your investment preferences
              </motion.p>
            </div>
            
            <AnimatePresence>
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-5 py-3 bg-white/10 text-white rounded-xl border border-white/20"
                  >
                    <FiX /> Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg disabled:opacity-50"
                  >
                    <FiSave /> {isLoading ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg"
                >
                  <FiEdit /> Edit Profile
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Experience Points Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden mb-6"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="p-3 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-xl"
              >
                <FiAward className="text-white" size={24} />
              </motion.div>
              <h2 className="text-2xl font-semibold text-white">Your Learning Progress</h2>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <svg className="w-20 h-20" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b0764"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3"
                      strokeDasharray={`${Math.min(experiencePoints / 100, 100)}, 100`}
                    />
                    <text x="18" y="20.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="medium">
                      {Math.min(experiencePoints, 1000000)} XP
                    </text>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Experience Points</h3>
                  <p className="text-white/80">You&apos;ve earned {experiencePoints} points so far!</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToLearning}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-xl shadow-lg"
              >
                <FiBookOpen /> Go To Learning
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl"
                >
                  <FiUser className="text-white" size={24} />
                </motion.div>
                <h2 className="text-2xl font-semibold text-white">Personal Information</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                  {isEditing ? (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <input
                        type="text"
                        value={editableProfile.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-white/50"
                      />
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                      {profile.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Age</label>
                  {isEditing ? (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <input
                        type="number"
                        value={editableProfile.age || 0}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                        min="18"
                        max="100"
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white"
                      />
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                      {profile.age}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Profession</label>
                  {isEditing ? (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <select
                        value={editableProfile.profession || ''}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-gray-800 text-white/50">Select profession</option>
                        {professionOptions.map(option => (
                          <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                      {profile.profession}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Financial Information */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl"
                >
                  <FiDollarSign className="text-white" size={24} />
                </motion.div>
                <h2 className="text-2xl font-semibold text-white">Financial Information</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Monthly Income</label>
                  {isEditing ? (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <select
                        value={formatIncome(editableProfile.monthlyincome || 0)}
                        onChange={(e) => handleInputChange('monthlyincome', 
                          e.target.value.includes('₹10,000 - ₹25,000') ? 20000 :
                          e.target.value.includes('₹25,000 - ₹50,000') ? 37500 :
                          e.target.value.includes('₹50,000 - ₹1,00,000') ? 75000 :
                          e.target.value.includes('₹1,00,000') ? 150000 : 5000
                        )}
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-gray-800 text-white/50">Select income range</option>
                        {incomeOptions.map(option => (
                          <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                      {formatIncome(profile.monthlyincome)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Monthly Saving</label>
                  {isEditing ? (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <select
                        value={formatSaving(editableProfile.monthlysaving || 0)}
                        onChange={(e) => handleInputChange('monthlysaving', 
                          e.target.value.includes('₹5,000 - ₹15,000') ? 10000 :
                          e.target.value.includes('₹15,000 - ₹50,000') ? 32500 :
                          e.target.value.includes('₹50,000+') ? 60000 : 5000
                        )}
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-gray-800 text-white/50">Select saving range</option>
                        {savingOptions.map(option => (
                          <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                      {formatSaving(profile.monthlysaving)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Investment Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="p-3 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-xl"
                >
                  <FiPieChart className="text-white" size={24} />
                </motion.div>
                <h2 className="text-2xl font-semibold text-white">Investment Preferences</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Primary Reason for Investing</label>
                  {isEditing ? (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <select
                        value={editableProfile.primaryreasonforinvesting || ''}
                        onChange={(e) => handleInputChange('primaryreasonforinvesting', e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-gray-800 text-white/50">Select reason</option>
                        {reasonOptions.map(option => (
                          <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                      {profile.primaryreasonforinvesting}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Risk Tolerance</label>
                  {isEditing ? (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <select
                        value={editableProfile.financialrisk || ''}
                        onChange={(e) => handleInputChange('financialrisk', e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-gray-800 text-white/50">Select risk tolerance</option>
                        {riskOptions.map(option => (
                          <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                      {profile.financialrisk}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Investment Experience</label>
                  {isEditing ? (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <select
                        value={editableProfile.expaboutinvesting || ''}
                        onChange={(e) => handleInputChange('expaboutinvesting', e.target.value)}
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-gray-800 text-white/50">Select experience level</option>
                        {experienceOptions.map(option => (
                          <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                      {profile.expaboutinvesting}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Investment Duration</label>
                  {isEditing ? (
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <select
                        value={editableProfile.estimateinvestingduration 
                          ? durationOptions.find(opt => 
                              opt.includes('1-3') && editableProfile.estimateinvestingduration === 2 ||
                              opt.includes('3-7') && editableProfile.estimateinvestingduration === 5 ||
                              opt.includes('7+') && editableProfile.estimateinvestingduration === 10 ||
                              opt.includes('Less than') && editableProfile.estimateinvestingduration === 1
                            ) || ''
                          : ''
                        }
                        onChange={(e) => handleInputChange('estimateinvestingduration', 
                          e.target.value.includes('1-3') ? 2 :
                          e.target.value.includes('3-7') ? 5 :
                          e.target.value.includes('7+') ? 10 : 1
                        )}
                        className="w-full p-4 bg-white/5 border border-white/20 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 text-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-gray-800 text-white/50">Select duration</option>
                        {durationOptions.map(option => (
                          <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                      {durationOptions.find(opt => 
                        opt.includes('1-3') && profile.estimateinvestingduration === 2 ||
                        opt.includes('3-7') && profile.estimateinvestingduration === 5 ||
                        opt.includes('7+') && profile.estimateinvestingduration === 10 ||
                        opt.includes('Less than') && profile.estimateinvestingduration === 1
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Investment Types & Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl"
                >
                  <FiHome className="text-white" size={24} />
                </motion.div>
                <h2 className="text-2xl font-semibold text-white">Investment Portfolio</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Preferred Investment Types</label>
                  {isEditing ? (
                    <motion.div className="grid grid-cols-2 gap-3">
                      {investmentTypeOptions.map(type => (
                        <motion.div
                          key={type}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleInvestmentType(type)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedInvestmentTypes.includes(type)
                              ? 'bg-cyan-500/10 border-cyan-400/50'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 ${
                              selectedInvestmentTypes.includes(type)
                                ? 'bg-cyan-400 border-cyan-400'
                                : 'bg-white/5 border-white/20'
                            }`}>
                              {selectedInvestmentTypes.includes(type) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-white rounded-sm"
                                />
                              )}
                            </div>
                            <span className="text-white">{type}</span>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      {profile.typesofinvestment?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.typesofinvestment.map((type, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="px-3 py-1 bg-cyan-400/10 text-cyan-400 rounded-full text-sm"
                            >
                              {type}
                            </motion.span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/50">No investment types selected</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Current Portfolio</label>
                  {isEditing ? (
                    <div className="relative">
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsPortfolioDropdownOpen(!isPortfolioDropdownOpen)}
                        className="w-full p-4 bg-white/5 rounded-xl border border-white/20 text-left text-white flex justify-between items-center"
                      >
                        <span>Select portfolio items ({selectedPortfolioItems.length})</span>
                        <motion.div
                          animate={{ rotate: isPortfolioDropdownOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiChevronDown />
                        </motion.div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {isPortfolioDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 mt-2 w-full bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-y-auto max-h-64"
                          >
                            {portfolioOptions.map(item => (
                              <motion.div
                                key={item.symbol}
                                whileHover={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                                className={`p-3 flex items-center cursor-pointer ${selectedPortfolioItems.some(i => i.symbol === item.symbol) ? 'bg-cyan-500/10' : ''}`}
                                onClick={() => {
                                  togglePortfolioItem(item);
                                }}
                              >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center mr-3 ${
                                  selectedPortfolioItems.some(i => i.symbol === item.symbol)
                                    ? 'bg-cyan-400 border-cyan-400'
                                    : 'bg-white/5 border-white/20'
                                }`}>
                                  {selectedPortfolioItems.some(i => i.symbol === item.symbol) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-2 h-2 bg-white rounded-sm"
                                    />
                                  )}
                                </div>
                                <div>
                                  <p className="text-white">{item.name}</p>
                                  <p className="text-white/60 text-xs">{item.symbol}</p>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      {profile.portfolio && profile.portfolio.length > 0 ? (
                        <div className="space-y-3">
                          {profile.portfolio.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mr-3">
                                {item.symbol.charAt(0)}
                              </div>
                              <div>
                                <h3 className="text-white font-medium">{item.name}</h3>
                                <p className="text-white/60 text-sm">{item.symbol}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/50">No portfolio items selected</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;