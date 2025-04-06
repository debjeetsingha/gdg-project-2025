'use client';

import { FiActivity , FiBookOpen } from 'react-icons/fi';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiUser, FiAward, FiChevronRight, FiX, FiLogOut, FiPlus } from 'react-icons/fi';
import Image from 'next/image';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import GeneralChat from '@/components/GeneralChat';
import PersonalizedTutor from '@/components/PersonalizedTutor';


// Interface definitions
interface Participant {
  id: number;
  name: string;
  points: number;
  progress: number;
  avatar: string;
}



interface UserAccount {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: string;
}



// Mock data
const mockParticipants: Participant[] = [
  { id: 1, name: 'CryptoQueen', points: 1200, progress: 100, avatar: '/images/avatars/1.jpg' },
  { id: 2, name: 'TraderPro22', points: 850, progress: 85, avatar: '/images/avatars/2.jpg' },
  { id: 3, name: 'BullMarket', points: 720, progress: 72, avatar: '/images/avatars/3.jpg' },
  { id: 4, name: 'DayTrader', points: 680, progress: 68, avatar: '/images/avatars/4.jpg' },
  { id: 5, name: 'WolfOfCrypto', points: 640, progress: 64, avatar: '/images/avatars/5.jpg' },
  { id: 6, name: 'BitcoinBandit', points: 590, progress: 59, avatar: '/images/avatars/6.jpg' },
  { id: 7, name: 'AltcoinAlly', points: 540, progress: 54, avatar: '/images/avatars/7.jpg' },
  { id: 8, name: 'SatoshiSeeker', points: 490, progress: 49, avatar: '/images/avatars/8.jpg' },
  { id: 9, name: 'FOMOFactory', points: 430, progress: 43, avatar: '/images/avatars/9.jpg' },
  { id: 10, name: 'HODLer', points: 380, progress: 38, avatar: '/images/avatars/10.jpg' },
];

// const learningModules: LearningModule[] = [
//   { 
//     id: 1, 
//     title: 'Candlestick Patterns', 
//     progress: 75, 
//     content: 'Learn to read market trends through candlestick formations. Master patterns like Doji, Hammer, and Engulfing to predict price movements.' 
//   },
//   { 
//     id: 2, 
//     title: 'Risk Management', 
//     progress: 30, 
//     content: 'Master position sizing and stop-loss strategies. Learn the 1% rule and how to protect your capital during volatile markets.' 
//   },
//   { 
//     id: 3, 
//     title: 'Technical Indicators', 
//     progress: 45, 
//     content: 'Understand RSI, MACD, and Bollinger Bands to identify overbought/oversold conditions and potential reversals.' 
//   },
// ];


export default function LearningPage() {

  const router = useRouter();
  const { user, logout, signInWithGoogle, linkWithGoogle } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const selectedModule = null;
  const [authToken, setAuthToken] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get Firebase auth token
  useEffect(() => {
    const getToken = async () => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAuthToken(token);
        } catch (error) {
          console.error('Error getting token:', error);
          setAuthToken(null);
        }
      } else {
        setAuthToken(null);
      }
    };

    getToken();
  }, [user]);


  // Fetch user accounts on mount
  useEffect(() => {
    if (user) {
      const currentAccount: UserAccount = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerId: user.providerData[0]?.providerId || 'firebase'
      };
      setUserAccounts([currentAccount]);
    }
  }, [user]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddAccount = async () => {
    try {
      if (user) {
        await linkWithGoogle();
        const updatedAccount: UserAccount = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          providerId: user.providerData[0]?.providerId || 'firebase'
        };
        setUserAccounts([updatedAccount]);
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      console.error('Error handling account:', error);
    }
    setShowAccountMenu(false);
  };



  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/trading-bg.jpg"
          alt="Trading background"
          fill
          className="object-cover opacity-10"
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800/90" />
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[80vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FiAward className="text-yellow-400" />
                Full Leaderboard
              </h2>
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="p-1 text-gray-400 hover:text-white transition"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {mockParticipants.map((participant, index) => (
                <motion.div 
                  key={participant.id}
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                  className="flex items-center p-4 hover:bg-gray-700/50 transition border-b border-gray-700/50"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-4">
                    {index < 3 ? (
                      <span className={`font-medium ${
                        index === 0 ? 'text-amber-400' :
                        index === 1 ? 'text-yellow-400' :
                        'text-purple-400'
                      }`}>{index + 1}</span>
                    ) : (
                      <span className="font-medium text-gray-300">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{participant.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-gray-700 rounded-full flex-1 overflow-hidden">
                        <div 
                          className={`h-full ${
                            index === 0 ? 'bg-amber-500' :
                            index === 1 ? 'bg-yellow-500' :
                            index === 2 ? 'bg-purple-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${participant.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400">{participant.points} pts</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

<div className="max-w-6xl mx-auto">
  {/* Header */}
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex justify-between items-center mb-8"
  >
    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
      INVESTOPIA
    </h1>
    <div className="flex items-center gap-4">
      
    <Link href="/courses" passHref>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <FiBookOpen className="text-lg" />
          <span>Go To Courses</span>
        </motion.button>
      </Link>

      <Link href="/investment-sandbox" passHref>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <FiActivity className="text-lg" />
          <span>Trading Simulation</span>
        </motion.button>
      </Link>
      
      <div className="text-sm text-gray-400">Last Update: {new Date().toLocaleDateString()}</div>
      
      {/* User Avatar Dropdown */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="flex items-center gap-2 group"
          >
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || 'User avatar'}
                width={40}
                height={40}
                className="rounded-full border-2 border-transparent group-hover:border-purple-500 transition-all"
                priority
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-transparent group-hover:border-purple-500 transition-all">
                <FiUser className="text-gray-300 text-lg" />
              </div>
            )}
          </button>

          <AnimatePresence>
            {showAccountMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-56 bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-700 z-50 overflow-hidden"
              >
                <div className="p-2">
                  {user.displayName && (
                    <div 
                      className="px-3 py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 rounded-md"
                      onClick={() => {
                        router.push('/profile');
                        setShowAccountMenu(false);
                      }}
                    >
                      <p className="font-medium text-white truncate">{user.displayName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  )}

                  <div className="py-1">
                    <p className="px-3 py-1 text-xs text-gray-400">Accounts</p>
                    {userAccounts.map(account => (
                      <div 
                        key={account.uid}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md cursor-pointer"
                        onClick={() => {
                          // Handle account switching here
                          setShowAccountMenu(false);
                        }}
                      >
                        {account.photoURL ? (
                          <Image
                            src={account.photoURL}
                            alt={account.displayName || 'Account'}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                            <FiUser className="text-xs" />
                          </div>
                        )}
                        <span className="truncate">{account.displayName || account.email}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddAccount}
                    className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-sm bg-gradient-to-r from-purple-600/50 to-blue-600/50 hover:from-purple-600/70 hover:to-blue-600/70 rounded-md text-white"
                  >
                    <FiPlus />
                    Add Account
                  </motion.button>

                  <button
                    onClick={() => {
                      logout();
                      setShowAccountMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-sm text-red-400 hover:bg-red-500/10 rounded-md"
                  >
                    <FiLogOut />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  </motion.div>

        <div className="">
          {/* Left Sidebar */}
          {/* <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Learning Modules</h2>
              <form onSubmit={handleSearch} className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-gray-700/50 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
                  <FiSearch />
                </button>
              </form>
            </div> */}

            {/* <div className="space-y-4"> */}
              {/* Today's Recommendation */}
              {/* <motion.div 
                whileHover={{ y: -2 }}
                className="bg-gradient-to-r from-purple-600/30 to-transparent p-4 rounded-xl border border-purple-500/30 cursor-pointer"
                onClick={() => handleModuleClick({
                  id: 0,
                  title: recommendedContent.title,
                  progress: 0,
                  content: recommendedContent.description
                })}
              >
                <h3 className="font-medium">{recommendedContent.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{recommendedContent.description}</p>
              </motion.div> */}

              {/* Continue Learning or Search Results */}
              {/* <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400">
                  {searchResults.length > 0 ? 'Search Results' : 'Continue Learning'}
                </h4>
                {(searchResults.length > 0 ? searchResults : learningModules).map(module => (
                  <motion.div
                    key={module.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-700/50 hover:bg-gray-700/70 transition p-3 rounded-lg cursor-pointer flex items-center justify-between"
                    onClick={() => handleModuleClick(module)}
                  >
                    <div>
                      <p className="font-medium">{module.title}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{module.content}</p>
                      {module.progress > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-full h-1.5 bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${module.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{module.progress}%</span>
                        </div>
                      )}
                    </div>
                    <FiChevronRight className="text-gray-400" />
                  </motion.div>
                ))}
                {searchResults.length > 0 && (
                  <button
                    onClick={() => setSearchResults([])}
                    className="text-sm text-blue-400 hover:text-blue-300 mt-2 flex items-center gap-1"
                  >
                    <FiX size={14} /> Clear search results
                  </button>
                )}
              </div> */}

              {/* Quick Links
              <div className="space-y-3 pt-4">
                <h4 className="text-sm font-medium text-gray-400">Quick Links</h4>
                {quickLinks.map(link => (
                  <motion.div
                    key={link.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-700/50 hover:bg-gray-700/70 transition p-3 rounded-lg cursor-pointer"
                    onClick={() => handleQuickLinkClick(link)}
                  >
                    <p className="font-medium">{link.title}</p>
                  </motion.div> */}
                {/* ))}
              </div> */}
            {/* </div>
          </motion.div> */}

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-2xl p-6 border border-blue-500/30 cursor-pointer"
                onClick={() => setActiveChat('tutor')}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <FiUser className="text-blue-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">Personalized Tutor</h3>
                </div>
                <p className="text-sm text-gray-300 mb-4">Get one-on-one guidance tailored to your trading style and experience level.</p>
                <div className="text-blue-400 text-sm font-medium flex items-center gap-1">
                  {activeChat === 'tutor' ? 'Session Active' : 'Start Session'} <FiChevronRight size={16} />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-2xl p-6 border border-purple-500/30 cursor-pointer"
                onClick={() => setActiveChat('general')}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <FiMessageSquare className="text-purple-400" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold">General Chat</h3>
                </div>
                <p className="text-sm text-gray-300 mb-4">Discuss trading concepts with our AI assistant and community.</p>
                <div className="text-purple-400 text-sm font-medium flex items-center gap-1">
                  {activeChat === 'general' ? 'Chat Active' : 'Join Chat'} <FiChevronRight size={16} />
                </div>
              </motion.div>
            </div>

            {/* Conditional Chat Interface or Leaderboard */}
            {activeChat === 'general' ? (
        <GeneralChat onClose={() => setActiveChat(null)} selectedModule={selectedModule} authToken={authToken} />
      ) :  activeChat === 'tutor' ? (
        authToken ? (
          <PersonalizedTutor 
            onClose={() => setActiveChat(null)} 
            selectedModule={selectedModule} 
            authToken={authToken} 
          />
        ) :

            (
              <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700 text-center">
                <p className="text-red-400">Authentication required. Please sign in to use the tutor.</p>
                <button
                  onClick={() => signInWithGoogle()}
                  className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
              </div>
            )
          )
        
            : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FiAward className="text-yellow-400" size={24} />
                  <h2 className="text-xl font-semibold">Top Traders This Week</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Top 3 Participants with Rank 3 Highlighted */}
                  {mockParticipants.slice(0, 3).map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      whileHover={{ y: -5 }}
                      className={`bg-gradient-to-b p-6 rounded-xl border ${
                        index === 0 
                          ? 'from-amber-600/30 to-transparent border-amber-500/30' 
                          : index === 1 
                            ? 'from-yellow-600/30 to-transparent border-yellow-500/30' 
                            : 'from-purple-600/30 to-transparent border-purple-500/30 shadow-purple-500/20 shadow-lg'
                      } ${index === 2 ? 'transform scale-[1.03] relative z-10' : ''}`}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                          index === 0 
                            ? 'bg-amber-500/20' 
                            : index === 1 
                              ? 'bg-yellow-500/20' 
                              : 'bg-purple-500/20'
                        }`}>
                          <span className={`text-2xl font-bold ${
                            index === 0 
                              ? 'text-amber-400' 
                              : index === 1 
                                ? 'text-yellow-400' 
                                : 'text-purple-400'
                          }`}>{index + 1}</span>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-lg">{participant.name}</p>
                          <p className={`text-sm ${
                            index === 0 
                              ? 'text-amber-400' 
                              : index === 1 
                                ? 'text-yellow-400' 
                                : 'text-purple-400'
                          }`}>{participant.points} pts</p>
                          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden w-full">
                            <div 
                              className={`h-full ${
                                index === 0 
                                  ? 'bg-amber-500' 
                                  : index === 1 
                                    ? 'bg-yellow-500' 
                                    : 'bg-purple-500'
                              }`} 
                              style={{ width: `${participant.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLeaderboard(true)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600/50 to-blue-600/50 hover:from-purple-600/70 hover:to-blue-600/70 transition rounded-lg text-white font-medium"
                  >
                    View Full Leaderboard
                  </motion.button>
                </div>
              </motion.div>
            )}
            
          </motion.div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}