'use client';

import { useState, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiArrowLeft, FiCheck, FiDollarSign, FiBriefcase, FiAward, FiPieChart, FiTrendingUp, FiBarChart2, FiCalendar, FiHome, FiDatabase, FiUser } from 'react-icons/fi';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

type QuestionType = 'slider' | 'single-select' | 'multi-select';
type AnswerValue = string | number | string[];

interface BaseQuestion {
  id: string;
  question: string;
  type: QuestionType;
  icon: JSX.Element;
  optional?: boolean;
}

interface SliderQuestion extends BaseQuestion {
  type: 'slider';
  min: number;
  max: number;
}

interface SelectQuestion extends BaseQuestion {
  type: 'single-select' | 'multi-select';
  options: string[];
}

type Question = SliderQuestion | SelectQuestion;

interface InvestmentOption {
  id: string;
  name: string;
  logo: string;
  symbol?: string;
}

const investmentOptions: InvestmentOption[] = [
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

const OnboardingPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');

  const questions: Question[] = [
    {
      id: 'name',
      question: 'What is your name?',
      type: 'single-select',
      options: [],
      icon: <FiUser className="text-blue-500" size={24} />
    },
    {
      id: 'age',
      question: 'How old are you?',
      type: 'slider',
      min: 18,
      max: 100,
      icon: <FiAward className="text-blue-500" size={24} />
    },
    {
      id: 'profession',
      question: 'What is your profession?',
      type: 'single-select',
      options: ['Employed', 'Self-employed', 'Unemployed'],
      icon: <FiBriefcase className="text-blue-500" size={24} />
    },
    {
      id: 'monthlyincome',
      question: 'What is your monthly income range?',
      type: 'single-select',
      options: ['Less than ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000 and above'],
      icon: <FiDollarSign className="text-green-500" size={24} />
    },
    {
      id: 'monthlysaving',
      question: 'How much do you save per month?',
      type: 'single-select',
      options: ['Less than ₹5,000', '₹5,000 - ₹15,000', '₹15,000 - ₹50,000', '₹50,000+'],
      icon: <FiTrendingUp className="text-yellow-500" size={24} />
    },
    {
      id: 'primaryreasonforinvesting',
      question: 'What is your primary reason for investing?',
      type: 'single-select',
      options: [
        'I want to grow my wealth',
        'I want a safe and stable investment',
        'I want to save for a major purchase',
        'I want to build retirement savings',
        'I want to generate passive income'
      ],
      optional: true,
      icon: <FiPieChart className="text-indigo-500" size={24} />
    },
    {
      id: 'financialrisk',
      question: 'How do you feel about financial risk?',
      type: 'single-select',
      options: [
        'I avoid risk completely',
        'I can take a little risk for better returns',
        'I can handle moderate risk',
        'I am willing to take high risks for high returns'
      ],
      icon: <FiBarChart2 className="text-red-500" size={24} />
    },
    {
      id: 'expaboutinvesting',
      question: 'How much do you know about investing?',
      type: 'single-select',
      options: [
        'I am a complete beginner',
        'I know some basics',
        'I have experience with investing',
        'I am an expert investor'
      ],
      icon: <FiDatabase className="text-teal-500" size={24} />
    },
    {
      id: 'estimateinvestingduration',
      question: 'How long do you plan to keep your investments?',
      type: 'single-select',
      options: ['Less than 1 year', '1-3 years', '3-7 years', '7+ years'],
      icon: <FiCalendar className="text-orange-500" size={24} />
    },
    {
      id: 'typesofinvestment',
      question: 'Which type of investments interest you the most? (Select Multiple)',
      type: 'multi-select',
      options: ['Stocks', 'Bonds', 'Real Estate', 'Cryptocurrency', 'Mutual Funds', 'Gold'],
      icon: <FiHome className="text-pink-500" size={24} />
    },
    {
      id: 'portfolio',
      question: 'Select your favorite stocks and cryptocurrencies (Select Multiple)',
      type: 'multi-select',
      options: investmentOptions.map(opt => opt.id),
      icon: <FiBriefcase className="text-purple-500" size={24} />
    }
  ];

  const isSliderQuestion = (question: Question): question is SliderQuestion => {
    return question.type === 'slider';
  };

  const isSelectQuestion = (question: Question): question is SelectQuestion => {
    return question.type === 'single-select' || question.type === 'multi-select';
  };

  const currentQuestion = questions[currentStep];
  const isOptional = currentQuestion.optional;
  
  const hasAnswer = () => {
    if (isSliderQuestion(currentQuestion)) {
      return answers[currentQuestion.id] !== undefined;
    }
    if (isSelectQuestion(currentQuestion)) {
      if (currentQuestion.type === 'multi-select') {
        return (selectedOptions[currentQuestion.id]?.length || 0) > 0;
      }
      return answers[currentQuestion.id] !== undefined;
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer = (value: AnswerValue) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleOptionSelect = (option: string) => {
    if (isSelectQuestion(currentQuestion) && currentQuestion.type === 'multi-select') {
      const currentSelected = selectedOptions[currentQuestion.id] || [];
      const newSelected = currentSelected.includes(option)
        ? currentSelected.filter(item => item !== option)
        : [...currentSelected, option];
      
      setSelectedOptions(prev => ({
        ...prev,
        [currentQuestion.id]: newSelected
      }));
      handleAnswer(newSelected);
    } else if (isSelectQuestion(currentQuestion)) {
      handleAnswer(option);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSliderQuestion(currentQuestion)) {
      handleAnswer(parseInt(e.target.value));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setAnswers(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const selectedPortfolioItems = selectedOptions['portfolio']?.map(id => {
        const item = investmentOptions.find(opt => opt.id === id);
        return item ? { symbol: item.symbol || item.id, name: item.name } : null;
      }).filter(Boolean) || [];

      const profileData = {
        name: answers.name || 'Anonymous',
        age: answers.age || 25,
        profession: answers.profession || 'Employed',
        monthlyincome: answers.monthlyincome || '₹25,000 - ₹50,000',
        monthlysaving: answers.monthlysaving || '₹5,000 - ₹15,000',
        primaryreasonforinvesting: answers.primaryreasonforinvesting || 'Retirement savings',
        financialrisk: answers.financialrisk || 'I can handle moderate risk',
        expaboutinvesting: answers.expaboutinvesting || 'I know some basics',
        estimateinvestingduration: answers.estimateinvestingduration || '3-7 years',
        typesofinvestment: answers.typesofinvestment || ['Stocks', 'Bonds'],
        portfolio: selectedPortfolioItems,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.uid,
        onboardingCompleted: true
      };

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, profileData, { merge: true });

      router.push('/profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('There was an error saving your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 text-center"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-300">
          Tell Us About Yourself!
        </h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-sm font-bold text-yellow-300"
        >
          Help us personalize your investment journey
        </motion.p>
      </motion.div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
        <div className="h-2 bg-gray-200">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {currentQuestion.icon}
                </motion.div>
                <h2 className="text-xl font-bold text-gray-800">
                  {currentQuestion.question}
                  {isOptional && <span className="text-gray-400 text-sm ml-2">(Optional)</span>}
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {currentQuestion.id === 'name' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Enter your name"
                      className="w-full p-4 rounded-xl border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none transition text-black placeholder:text-black/70"
                    />
                  </motion.div>
                ) : isSliderQuestion(currentQuestion) ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <input
                      type="range"
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      value={answers[currentQuestion.id] || currentQuestion.min}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <motion.div 
                      className="flex justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-sm text-gray-500">{currentQuestion.min}</span>
                      <span className="text-lg font-semibold text-blue-600">
                        {answers[currentQuestion.id] || currentQuestion.min} years
                      </span>
                      <span className="text-sm text-gray-500">{currentQuestion.max}</span>
                    </motion.div>
                  </motion.div>
                ) : isSelectQuestion(currentQuestion) ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    {currentQuestion.id === 'portfolio' ? (
                      <div className="grid grid-cols-2 gap-3">
                        {investmentOptions.map((option) => {
                          const isSelected = selectedOptions[currentQuestion.id]?.includes(option.id);
                          return (
                            <motion.button
                              key={option.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOptionSelect(option.id)}
                              className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'
                                  : 'bg-white border-gray-200 hover:border-blue-200'
                              }`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <div className="w-8 h-8 relative">
                                <Image
                                  src={option.logo}
                                  alt={option.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-800">{option.name}</span>
                              {isSelected && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: [0, 1.2, 1] }}
                                  transition={{ duration: 0.3 }}
                                  className="ml-auto bg-blue-500 text-white p-1 rounded-full"
                                >
                                  <FiCheck size={14} />
                                </motion.span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    ) : (
                      currentQuestion.options.map((option, index) => {
                        const isSelected = currentQuestion.type === 'multi-select'
                          ? selectedOptions[currentQuestion.id]?.includes(option)
                          : answers[currentQuestion.id] === option;

                        return (
                          <motion.button
                            key={option}
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full text-left p-4 rounded-xl transition-all ${isSelected
                              ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300'
                              : 'bg-gray-50 border border-gray-200 hover:border-blue-200'
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{option}</span>
                              {isSelected && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: [0, 1.2, 1] }}
                                  transition={{ duration: 0.3 }}
                                  className="bg-blue-500 text-white p-1 rounded-full"
                                >
                                  <FiCheck size={16} />
                                </motion.span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })
                    )}
                  </motion.div>
                ) : null}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <motion.button
              onClick={handlePrev}
              disabled={currentStep === 0}
              whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
              whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <FiArrowLeft />
              Previous
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={(!isOptional && !hasAnswer()) || isSubmitting}
              whileHover={{ scale: (!isOptional && !hasAnswer()) ? 1 : 1.05 }}
              whileTap={{ scale: (!isOptional && !hasAnswer()) ? 1 : 0.95 }}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg ${(!isOptional && !hasAnswer()) || isSubmitting
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isSubmitting ? (
                'Saving...'
              ) : currentStep === questions.length - 1 ? (
                'Submit'
              ) : (
                <>
                  Next
                  <FiArrowRight />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 text-sm font-bold text-green-300"
      >
        Complete Your Profile {currentStep + 1} of {questions.length}
      </motion.div>
    </div>
  );
};

export default OnboardingPage;