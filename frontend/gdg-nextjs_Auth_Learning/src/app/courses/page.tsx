"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiPlay, FiBookOpen, FiCheckCircle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

interface Lecture {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article';
  completed: boolean;
  videoThumbnail?: string ;
  videoUrl?: string;
  articleContent?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lectures: Lecture[];
  expanded: boolean;
}

const CoursePage = () => {
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'm1',
      title: 'Module 1: Financial Fundamentals for Beginners',
      description: 'Introduces key financial literacy concepts in India, highlighting its role in personal and national economic growth.',
      expanded: false,
      lectures: [
        {
          id: 'l1',
          title: 'What is Economic Machinery?',
          duration: '31:00',
          type: 'video',
          completed: false,
          videoThumbnail: 'images/fallback_thumbnail.jpg',
          videoUrl: 'https://www.youtu.be/watch?v=PHe0bXAIuk0'
        },
        {
          id: 'l2',
          title: 'What is Investing and Trading?',
          duration: '10:29',
          type: 'video',
          completed: false,
          videoThumbnail: 'data:image/jpeg;base64,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',
          videoUrl: 'https://www.youtu.be/watch?v=dmqoqVwFopE'
        },
        {
          id: 'l3',
          title: 'Financial Literacy',
          duration: '5 min read',
          type: 'article',
          completed: false,
          articleContent: 'Money Basics and Digital Transactions : Building on the NISM curriculum, this unit covers the fundamentals of money, income sources, and transaction types. Given India rapid digital transformation, special emphasis is placed on digital payment systems like UPI, IMPS, and mobile banking applications that are revolutionizing how Indians manage money. Banking and Financial Services in India : This unit introduces the Indian banking system, different types of bank accounts, and how to choose the right banking services based on individual needs. Following Khan Academys approach, students will learn to evaluate banking options and develop smart money management strategies specific to the Indian financial ecosystem.'
        }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2: Saving and Planning for the Future',
      description: 'Explains emergency savings, setting targets suited to India, and safe, accessible storage options.',
      expanded: false,
      lectures: [
        {
          id: 'l4',
          title: 'Candlestick Patterns',
          duration: '55:18',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://w0.peakpx.com/wallpaper/334/488/HD-wallpaper-chart-cryptocurrency-black-violet-blue-candlestick-bitcoin-thumbnail.jpg',
          videoUrl: 'https://www.youtu.be/watch?v=ul34Jfh-LOk'
        },
        {
          id: 'l5',
          title: 'Support and Resistance',
          duration: '10 min read',
          type: 'article',
          completed: false,
          articleContent: 'Money Basics and Digital Transactions : Building on the NISM curriculum, this unit covers the fundamentals of money, income sources, and transaction types. Given India rapid digital transformation, special emphasis is placed on digital payment systems like UPI, IMPS, and mobile banking applications that are revolutionizing how Indians manage money. Banking and Financial Services in India : This unit introduces the Indian banking system, different types of bank accounts, and how to choose the right banking services based on individual needs. Following Khan Academys approach, students will learn to evaluate banking options and develop smart money management strategies specific to the Indian financial ecosystem.'
        },
        {
          id: 'l6',
          title: 'Building an Emergency Fund',
          duration: '5 min read',
          type: 'article',
          completed: false,
          articleContent: 'Goal-based Financial Planning Learners will discover how to set SMART financial goals for different life stages and develop effective plans to achieve them. This includes planning for education, marriage, home purchase, and other significant life events typical in the Indian context.Understanding Inflation and Time Value of Money This section explores how inflation affects purchasing power in the Indian economy and introduces the concept of the time value of money, demonstrating why early saving and investing are crucial for building wealth.Retirement Planning for Indians Following Khan Academys retirement planning approach, this unit covers the unique aspects of retirement planning in India, including government schemes like NPS, PPF, and strategies for ensuring financial security in later years.'
        }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3: Introduction to Investments',
      description: 'Covers basic investments, risk-return trade-off, and compounding, with Indian market examples.',
      expanded: false,
      lectures: [
        {
          id: 'l7',
          title: 'Position Sizing',
          duration: '16:52',
          type: 'video',
          completed: false,
          videoThumbnail: 'data:image/jpeg;base64,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',
          videoUrl: 'https://youtu.be/watch?v=gM65dEuNsMw'
        },
        {
          id: 'l8',
          title: 'Risk-Reward Ratio',
          duration: '7 min read',
          type: 'article',
          completed: false,
          articleContent: 'Money Basics and Digital Transactions : Building on the NISM curriculum, this unit covers the fundamentals of money, income sources, and transaction types. Given India rapid digital transformation, special emphasis is placed on digital payment systems like UPI, IMPS, and mobile banking applications that are revolutionizing how Indians manage money. Banking and Financial Services in India : This unit introduces the Indian banking system, different types of bank accounts, and how to choose the right banking services based on individual needs. Following Khan Academys approach, students will learn to evaluate banking options and develop smart money management strategies specific to the Indian financial ecosystem.'
        },
        {
          id: 'l9',
          title: 'Investment Fundamentals',
          duration: '5 min read',
          type: 'article',
          completed: false,
          articleContent: 'Traditional Investment Options in India Covering popular traditional investment avenues in India such as fixed deposits, recurring deposits, post office schemes, Public Provident Fund (PPF), and National Savings Certificates (NSC), this section helps students understand low-risk investment options.Modern Investment Alternatives This unit introduces mutual funds, SIPs, bonds, and other modern investment options gaining popularity in India, with guidance on how beginners can start investing with small amounts.Understanding Gold as an Investment Given gold cultural and financial significance in India, this special unit explains different ways to invest in gold beyond traditional jewelry, including gold ETFs, Sovereign Gold Bonds, and digital gold.'
        }
      ]
    },
    {
      id: 'm4',
      title: 'Module 4: Introduction to Stock Markets',
      description: 'Explains stocks, Indian stock market basics, and key indices like Sensex and Nifty.',
      expanded: false,
      lectures: [
        {
          id: 'l10',
          title: 'How the Stock Market Works: A Beginner’s Crash Course?',
          duration: '8:49',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKjCwCrhr8mgKr7rK5VS_vWpDuoScUAJwVPw&s',
          videoUrl: 'https://youtu.be/watch?v=A7fZp9dwELo'
        },
        {
          id: 'l11',
          title: 'Investing 101: A Beginners Guide to Growing Your Wealth',
          duration: '10 min read',
          type: 'article',
          completed: false,
          articleContent: 'Money Basics and Digital Transactions : Building on the NISM curriculum, this unit covers the fundamentals of money, income sources, and transaction types. Given India rapid digital transformation, special emphasis is placed on digital payment systems like UPI, IMPS, and mobile banking applications that are revolutionizing how Indians manage money. Banking and Financial Services in India : This unit introduces the Indian banking system, different types of bank accounts, and how to choose the right banking services based on individual needs. Following Khan Academys approach, students will learn to evaluate banking options and develop smart money management strategies specific to the Indian financial ecosystem.'
        },
        {
          id: 'l12',
          title: 'Understanding the Indian Stock Market',
          duration: '5 min read',
          type: 'article',
          completed: false,
          articleContent: 'Understanding the Indian Stock Market Following the approach of beginner stock market courses, this unit explains what stocks are, how the Indian stock market works, and introduces key market indices like Sensex and Nifty.Stock Market Participants and Infrastructure This section covers the roles of various market participants including SEBI, stock exchanges (NSE and BSE), brokers, depositories (NSDL and CDSL), and clearing corporations in the Indian context.Basics of Stock Investing Students will learn how to open a demat account, place different types of orders, read basic stock information, and understand stock market terminology with an Indian perspective.Fundamental Analysis Basics This unit introduces the concept of analyzing companies through financial statements, ratios, and business models to make informed investment decisions in the Indian market.'
        }
      ]
    },
    {
      id: 'm5',
      title: 'Module 5: Advanced Investment Knowledge',
      description: 'Introduces chart patterns, trends, and technical indicators for analyzing stock prices in India.',
      expanded: false,
      lectures: [
        {
          id: 'l13',
          title: 'Mastering the Market: Advanced Strategies for Smart Investing',
          duration: '33:29',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://www.motilaloswal.com/learning-centre/2023/10/media_1bd958fc6ea5aef7a1caea67b19e9db90d5b4e9b4.jpeg?width=1200&format=pjpg&optimize=medium',
          videoUrl: 'https://youtu.be/watch?v=8zWQ9aXmeaY'
        },
        {
          id: 'l14',
          title: 'Stock Market Basics: Understanding How Markets Work and Why They Matter',
          duration: '10 min read',
          type: 'article',
          completed: false,
          articleContent: 'Money Basics and Digital Transactions : Building on the NISM curriculum, this unit covers the fundamentals of money, income sources, and transaction types. Given India rapid digital transformation, special emphasis is placed on digital payment systems like UPI, IMPS, and mobile banking applications that are revolutionizing how Indians manage money. Banking and Financial Services in India : This unit introduces the Indian banking system, different types of bank accounts, and how to choose the right banking services based on individual needs. Following Khan Academys approach, students will learn to evaluate banking options and develop smart money management strategies specific to the Indian financial ecosystem.'
        },
        {
          id: 'l15',
          title: 'Technical Analysis Introduction',
          duration: '5 min read',
          type: 'article',
          completed: false,
          articleContent: 'Mutual Funds Deep Dive This comprehensive unit covers different types of mutual funds available in India, understanding fund factsheets, expense ratios, NAV, and strategies for selecting funds aligned with financial goals. Portfolio Construction and Asset Allocation Students will learn how to build a diversified portfolio across asset classes tailored to their risk profile and financial goals in the Indian market environment. Tax-Efficient Investing This important section covers tax implications of different investments in India, tax-saving investment options under Section 80C, and strategies for optimizing investment returns after taxes.'
        }
      ]
    },
    {
      id: 'm6',
      title: 'Module 6: Managing Credit and Debt',
      description: 'Explains India credit system, CIBIL scores, credit reports, and maintaining good credit history.',
      expanded: false,
      lectures: [
        {
          id: 'l16',
          title: 'Credit & Debt Demystified: Tips to Stay Financially Strong',
          duration: '2:04',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://t3.ftcdn.net/jpg/02/74/91/02/360_F_274910292_Xm3dgmmfMJVFrcjUR1eqJmIC7giRrsTF.jpg',
          videoUrl: 'https://youtu.be/watch?v=ho0V6Mhtvjo'
        },
        {
          id: 'l17',
          title: 'Beyond the Basics: Strategies and Tools for Advanced Investing',
          duration: '10 min read',
          type: 'article',
          completed: false,
          articleContent: 'Money Basics and Digital Transactions : Building on the NISM curriculum, this unit covers the fundamentals of money, income sources, and transaction types. Given India rapid digital transformation, special emphasis is placed on digital payment systems like UPI, IMPS, and mobile banking applications that are revolutionizing how Indians manage money. Banking and Financial Services in India : This unit introduces the Indian banking system, different types of bank accounts, and how to choose the right banking services based on individual needs. Following Khan Academys approach, students will learn to evaluate banking options and develop smart money management strategies specific to the Indian financial ecosystem.'
        },
        {
          id: 'l18',
          title: 'Credit Fundamentals',
          duration: '5 min read',
          type: 'article',
          completed: false,
          articleContent: 'Responsible Borrowing Students will learn about different types of loans available in India, comparing interest rates, understanding loan terms, and assessing the true cost of borrowing. Credit Cards and Digital Credit This section covers the responsible use of credit cards and newer digital credit options in India, including how to avoid debt traps and manage repayments effectively.Debt Management Strategies This practical unit provides strategies for managing and reducing debt, dealing with financial emergencies, and understanding debt restructuring options available in India.'
        }
      ]
    },

    {
      id: 'm7',
      title: 'Module 7: Risk Management and Insurance',
      description: 'Building on NISMs risk and reward curriculum, this unit helps students identify and evaluate different types of financial risks in the Indian context.',
      expanded: false,
      lectures: [
        {
          id: 'l19',
          title: 'Why Insurance Matters: Protecting Yourself from Financial Risk',
          duration: '8:01',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://media.istockphoto.com/id/1584774403/photo/uptrend-line-candlestick-graph-financial-diagrams.jpg?s=612x612&w=0&k=20&c=gLckUiRgsYy551JbGcdnloKYCDMrh6pgLrK1-xk-qTs=',
          videoUrl: 'https://youtu.be/watch?v=3ctoSEQsY54'
        },
        {
          id: 'l20',
          title: 'Protecting What Matters: Risk Management and the Role of Insurance',
          duration: '10 min read',
          type: 'article',
          completed: false,
          articleContent: 'Money Basics and Digital Transactions : Building on the NISM curriculum, this unit covers the fundamentals of money, income sources, and transaction types. Given India rapid digital transformation, special emphasis is placed on digital payment systems like UPI, IMPS, and mobile banking applications that are revolutionizing how Indians manage money. Banking and Financial Services in India : This unit introduces the Indian banking system, different types of bank accounts, and how to choose the right banking services based on individual needs. Following Khan Academys approach, students will learn to evaluate banking options and develop smart money management strategies specific to the Indian financial ecosystem.'
        },
        {
          id: 'l21',
          title: 'Understanding Financial Risk',
          duration: '5 min read',
          type: 'article',
          completed: false,
          articleContent: 'Life Insurance Basics This section explains the importance of life insurance, different policy types available in India, and how to calculate appropriate coverage based on individual circumstances. Health and Medical Insurance Given the rising healthcare costs in India, this unit covers health insurance fundamentals, claim processes, and how to select appropriate coverage for different life stages.Property and Asset Insurance Students will learn about protecting physical assets through insurance, including home insurance, vehicle insurance, and other protection products relevant to the Indian market.'
        }
      ]
    },
    {
      id: 'm8',
      title: 'Module 8: Consumer Protection and Fraud Prevention',
      description: 'Covers common financial scams in India and how to identify and avoid them.',
      expanded: false,
      lectures: [
        {
          id: 'l22',
          title: 'Spot the Scam: How to Protect Yourself from Fraud & Theft',
          duration: '2:58',
          type: 'video',
          completed: false,
          videoThumbnail: 'https://media.licdn.com/dms/image/v2/D4D12AQGFnsPmjTwwqw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1677665938297?e=2147483647&v=beta&t=D9s_GgXNuSG5R1jvq95JZ6Mn80GLJ9E6ULf-JUa6TI4',
          videoUrl: 'https://youtu.be/watch?v=6cbL90ph3lE'
        },
        {
          id: 'l23',
          title: 'Stay Safe, Stay Smart: Navigating Consumer Rights and Avoiding Fraud',
          duration: '10 min read',
          type: 'article',
          completed: false,
          articleContent: 'Money Basics and Digital Transactions : Building on the NISM curriculum, this unit covers the fundamentals of money, income sources, and transaction types. Given India rapid digital transformation, special emphasis is placed on digital payment systems like UPI, IMPS, and mobile banking applications that are revolutionizing how Indians manage money. Banking and Financial Services in India : This unit introduces the Indian banking system, different types of bank accounts, and how to choose the right banking services based on individual needs. Following Khan Academys approach, students will learn to evaluate banking options and develop smart money management strategies specific to the Indian financial ecosystem.'
        },
        {
          id: 'l24',
          title: 'Common Financial Scams in India',
          duration: '5 min read',
          type: 'article',
          completed: false,
          articleContent: 'Rights and Protections for Financial Consumers This section explains the legal framework protecting financial consumers in India, including the role of regulators like RBI, SEBI, and IRDAI. Digital Financial Security Students will learn essential cybersecurity practices for protecting financial information, secure banking habits, and what to do if they become victims of financial fraud. Grievance Redressal Mechanisms This practical unit covers the process for filing complaints with various financial institutions and regulators in India when facing issues with financial products or services.'
        }
      ]
    }
  ]);

  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState<number | null>(null);

  // Calculate progress whenever modules change
  useEffect(() => {
    const totalLectures = modules.reduce((acc, module) => acc + module.lectures.length, 0);
    const completedLectures = modules.reduce(
      (acc, module) => acc + module.lectures.filter(lecture => lecture.completed).length,
      0
    );
    setProgress(Math.round((completedLectures / totalLectures) * 100));
  }, [modules]);

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, expanded: !module.expanded } 
        : module
    ));
  };

  const toggleLectureCompletion = (lectureId: string) => {
    setModules(modules.map(module => ({
      ...module,
      lectures: module.lectures.map(lecture => 
        lecture.id === lectureId 
          ? { ...lecture, completed: !lecture.completed } 
          : lecture
      )
    })));
  };

  const selectLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setCurrentVideoTime(null); // Reset video time when selecting new lecture
    if (!lecture.completed) {
      toggleLectureCompletion(lecture.id);
    }
  };

  const navigateLecture = (direction: 'next' | 'prev') => {
    if (!selectedLecture) return;

    // Find current module and lecture index
    let currentModuleIndex = -1;
    let currentLectureIndex = -1;
    
    modules.forEach((module, mIdx) => {
      module.lectures.forEach((lecture, lIdx) => {
        if (lecture.id === selectedLecture.id) {
          currentModuleIndex = mIdx;
          currentLectureIndex = lIdx;
        }
      });
    });

    if (currentModuleIndex === -1) return;

    const currentModule = modules[currentModuleIndex];
    
    if (direction === 'next') {
      // Try next lecture in current module
      if (currentLectureIndex < currentModule.lectures.length - 1) {
        selectLecture(currentModule.lectures[currentLectureIndex + 1]);
        return;
      }
      // Try first lecture in next module
      if (currentModuleIndex < modules.length - 1) {
        const nextModule = modules[currentModuleIndex + 1];
        if (nextModule.lectures.length > 0) {
          selectLecture(nextModule.lectures[0]);
          // Expand the next module
          setModules(modules.map((mod, idx) => 
            idx === currentModuleIndex + 1 ? { ...mod, expanded: true } : mod
          ))
        }
      }
    } else { // prev
      // Try previous lecture in current module
      if (currentLectureIndex > 0) {
        selectLecture(currentModule.lectures[currentLectureIndex - 1]);
        return;
      }
      // Try last lecture in previous module
      if (currentModuleIndex > 0) {
        const prevModule = modules[currentModuleIndex - 1];
        if (prevModule.lectures.length > 0) {
          selectLecture(prevModule.lectures[prevModule.lectures.length - 1]);
          // Expand the previous module
          setModules(modules.map((mod, idx) => 
            idx === currentModuleIndex - 1 ? { ...mod, expanded: true } : mod
          ))
        }
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    // This would work better with a proper YouTube API integration
    // For demo purposes, we'll just simulate time tracking
    if (currentVideoTime === null) {
      setCurrentVideoTime(10); // Simulate starting at 10 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-4 md:p-8">
        <Link href="/learning" passHref>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 mb-7 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <FiArrowLeft className="text-lg" />
          <span>Back</span>
        </motion.button>
      </Link>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar - Course modules */}
          <div className="w-full md:w-1/3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-gradient-to-br from-pink-600 to-blue-800 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-gray-700"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-2xl font-bold text-white mb-2">Trading Masterclass</h1>
                <p className="text-purple-200 mb-4">Master the art of trading with our comprehensive course</p>
                
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Your Progress</span>
                    <span className="text-sm font-bold text-purple-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full shadow-purple-glow" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
              
              <div className="space-y-3">
                {modules.map((module, moduleIndex) => (
                  <motion.div 
                    key={module.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * moduleIndex, duration: 0.4 }}
                    className="border border-gray-700 rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm"
                  >
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 transition-all duration-300"
                    >
                      <div className="text-left">
                        <h3 className="font-semibold text-white">{module.title}</h3>
                        <p className="text-sm text-purple-200">{module.description}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: module.expanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-purple-400"
                      >
                        {module.expanded ? <FiChevronUp /> : <FiChevronDown />}
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {module.expanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="bg-gray-900/30"
                        >
                          <ul className="divide-y divide-gray-700">
                            {module.lectures.map((lecture, lectureIndex) => (
                              <motion.li 
                                key={lecture.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * lectureIndex, duration: 0.2 }}
                                className={`p-3 hover:bg-gray-800/50 cursor-pointer transition-all duration-200 ${selectedLecture?.id === lecture.id ? 'bg-gray-800/70' : ''}`}
                                onClick={() => selectLecture(lecture)}
                              >
                                <div className="flex items-center space-x-3">
                                  <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${lecture.completed ? 'bg-green-900/70 text-green-400' : 'bg-purple-900/70 text-purple-400'}`}
                                  >
                                    {lecture.completed ? <FiCheckCircle /> : lecture.type === 'video' ? <FiPlay /> : <FiBookOpen />}
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${lecture.completed ? 'text-gray-400 line-through' : 'text-white'} truncate`}>
                                      {lecture.title}
                                    </p>
                                    <p className={`text-xs ${lecture.completed ? 'text-gray-500' : 'text-gray-400'}`}>{lecture.duration}</p>
                                  </div>
                                  {lecture.type === 'video' && (
                                    <motion.div 
                                      whileHover={{ scale: 1.05 }}
                                      className="w-12 h-8 rounded overflow-hidden border border-gray-600"
                                    >
                                      <Image src={lecture.videoThumbnail || '/images/fallback_thumbnail.jpg'} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </motion.div>
                                  )}
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Right content area - Selected lecture */}
          <div className="w-full md:w-2/3">
            <motion.div 
              key={selectedLecture ? selectedLecture.id : 'empty'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 h-full border border-gray-700 backdrop-blur-sm"
            >
              {selectedLecture ? (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedLecture.title}</h2>
                    <div className="flex items-center space-x-2 text-sm text-purple-200">
                      <span>{selectedLecture.type === 'video' ? 'Video Lesson' : 'Reading Material'}</span>
                      <span>•</span>
                      <span>{selectedLecture.duration}</span>
                      <span>•</span>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleLectureCompletion(selectedLecture.id)}
                        className={`flex items-center space-x-1 ${selectedLecture.completed ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                      >
                        <FiCheckCircle size={14} />
                        <span>{selectedLecture.completed ? 'Completed' : 'Mark as completed'}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  {selectedLecture.type === 'video' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative rounded-xl overflow-hidden bg-black shadow-lg"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedLecture.videoUrl?.split('v=')[1]}${currentVideoTime ? `?start=${currentVideoTime}` : ''}`}
                        className="w-full h-96"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={handleVideoTimeUpdate}
                      />
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="prose max-w-none text-gray-300"
                    >
                      <p className="text-lg">{selectedLecture.articleContent}</p>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg border border-purple-900/50"
                      >
                        <h3 className="text-purple-300 font-medium mb-2">Key Takeaways</h3>
                        <ul className="text-purple-200 space-y-2">
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-start"
                          >
                            <span className="text-purple-400 mr-2">•</span>
                            <span>Understand the basic concepts of trading</span>
                          </motion.li>
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-start"
                          >
                            <span className="text-purple-400 mr-2">•</span>
                            <span>Learn how to analyze market trends</span>
                          </motion.li>
                          <motion.li 
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-start"
                          >
                            <span className="text-purple-400 mr-2">•</span>
                            <span>Develop a solid trading strategy</span>
                          </motion.li>
                        </ul>
                      </motion.div>
                    </motion.div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-between pt-4 border-t border-gray-700"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigateLecture('prev')}
                      className="px-4 py-2 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg text-white transition-all flex items-center space-x-2 border border-gray-700"
                    >
                      <FiArrowLeft />
                      <span>Previous</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(124, 58, 237, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigateLecture('next')}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-white transition-all flex items-center space-x-2 shadow-lg shadow-purple-900/30"
                    >
                      <span>Next</span>
                      <FiArrowRight />
                    </motion.button>
                  </motion.div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(124, 58, 237, 0)',
                        '0 0 0 10px rgba(124, 58, 237, 0.1)',
                        '0 0 0 20px rgba(124, 58, 237, 0)'
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-full flex items-center justify-center mb-4 border border-purple-700"
                  >
                    <FiPlay className="text-purple-300 text-3xl" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-white mb-2">Select a lecture to begin</h3>
                  <p className="text-gray-400 max-w-md">
                    Choose any lecture from the sidebar to start learning about trading strategies, market analysis, and risk management.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CoursePage;
