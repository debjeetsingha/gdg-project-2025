'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  // Animation controls for scroll-triggered animations
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const teamMembers = [
    {
      name: "Debjeet Singha",
      role: "Backend Developer",
      image: "/images/debjeet_image.jpg",
     
    },
    {
      name: "Shaurya Pandit",
      role: "Backend Developer",
      image: "/images/shaurya.jpg",
     
    },
    {
      name: "Debojit Roy",
      role: "Fullstack Developer",
      image: "/images/debojit.png",
     
    },
    {
      name: "Anurag Jyoti",
      role: "Fullstack Developer",
      image: "/images/anurag.jpg",
     
    }
  ];


  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }

    // Auto-rotate team members
    const interval = setInterval(() => {
      setCurrentTeamIndex((prev) => (prev + 1) % teamMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [controls, isInView, teamMembers.length]);

  // Navigation links
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Stats", href: "#stats" },
    { name: "Demo", href: "#demo" },
    // { name: "Pricing", href: "#pricing" },
    { name: "Team", href: "#team" }
  ];


  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-4 py-3 relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-7">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Investopia Logo"
                  width={70}
                  height={70}
                  className="rounded-lg"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              >
                INVESTOPIA
              </motion.div>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-6"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={link.href} className="text-gray-300 hover:text-white transition font-medium">
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/login">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white hover:opacity-90 transition">
                  Sign In
                </button>
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="text-center max-w-3xl mx-auto mt-24 mb-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Master the Markets with AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-10"
          >
            Learn trading strategies, get personalized coaching, and join our community of successful traders.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white hover:opacity-90 transition font-medium">
                  Start Learning
                </button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              
            </motion.div>
          </motion.div>
        </section>

        {/* Need for the Product Section */}
        <section id="features" ref={ref} className="py-20">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Why Investopia is Essential for Traders ?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              90% of traders fail within their first year. We&apos;re here to change that.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Insights",
                  desc: "Get real-time market analysis and predictions powered by advanced AI algorithms.",
                  icon: "🤖"
                },
                {
                  title: "Personalized Coaching",
                  desc: "1-on-1 sessions with expert traders tailored to your skill level.",
                  icon: "🎯"
                },
                {
                  title: "Community Support",
                  desc: "Join thousands of traders sharing strategies and insights daily.",
                  icon: "👥"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ y: -10 }}
                  className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Financial Stats Section */}
        <section id="stats" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Financial Stats for India
            </h2>
            
            <div className="grid md:grid gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700"
              >
              <div className="financial-literacy-report bg-gray-900 text-gray-100 p-6 rounded-xl max-w-5xl mx-auto font-sans shadow-2xl">
      {/* Header Section */}
      <header className="mb-8 text-center border-b border-blue-700 pb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-2">
          India&apos;s Financial Literacy Landscape 2024
        </h1>
        <p className="text-blue-300">Bridging the Gap Between Literacy and Financial Empowerment</p>
      </header>

      {/* Literacy Gap Section */}
      <section className="mb-10 bg-gray-800 p-6 rounded-xl shadow-inner">
        <div className="flex items-center mb-4">
          <div className="bg-blue-600 w-1 h-8 mr-3 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Literacy Gap Statistics</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-yellow-400 text-2xl mr-2">•</span>
              <p>General literacy <span className="font-bold text-blue-300">77%</span> vs financial literacy <span className="font-bold text-red-300">23-35%</span> shows <span className="underline">critical education gap</span></p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-green-300 mb-2">Financial Literacy Spectrum</h3>
              <ul className="space-y-2">
                <li className="flex justify-between"><span>Advanced Skills:</span> <span className="font-bold">4.2%</span></li>
                <li className="flex justify-between"><span>Elementary Knowledge:</span> <span className="font-bold">42.8%</span></li>
                <li className="flex justify-between"><span>Moderate Literacy:</span> <span className="font-bold">20.8%</span></li>
                <li className="flex justify-between text-red-400"><span>Completely Illiterate:</span> <span className="font-bold">32.2%</span></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col justify-between">
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-4 rounded-xl">
              <p className="text-sm text-purple-200 mb-1">Financial Inclusion Index</p>
              <p className="text-4xl font-bold text-center text-white">15%</p>
              <p className="text-xs text-center text-purple-300 mt-1">(NCFE National Survey)</p>
            </div>
            
            <div className="mt-auto pt-4">
              <p className="text-sm text-gray-400">*Contrasts with 80%+ inclusion in developed economies</p>
            </div>
          </div>
        </div>
      </section>

      {/* State-wise Disparities Section */}
      <section className="mb-10 bg-gray-800 p-6 rounded-xl shadow-inner">
        <div className="flex items-center mb-4">
          <div className="bg-green-600 w-1 h-8 mr-3 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">State-wise Financial Literacy Disparities</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Top Performers */}
          <div className="bg-gray-700 p-4 rounded-xl border-t-4 border-blue-500">
            <h3 className="font-bold text-blue-300 flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 8a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              Top Performing States
            </h3>
            <ul className="space-y-2">
              <li className="flex justify-between items-center py-2 border-b border-gray-600">
                <span>Goa</span>
                <span className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm">50%</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-gray-600">
                <span>Chandigarh</span>
                <span className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm">&gt;50%</span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span>Delhi</span>
                <span className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm">&gt;50%</span>
              </li>
            </ul>
          </div>
          
          {/* Lagging States */}
          <div className="bg-gray-700 p-4 rounded-xl border-t-4 border-red-500">
            <h3 className="font-bold text-red-300 flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 8a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              Lagging States
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="bg-red-900/50 text-red-100 px-3 py-1 rounded-full text-sm text-center">Assam</span>
              <span className="bg-red-900/50 text-red-100 px-3 py-1 rounded-full text-sm text-center">Bihar</span>
              <span className="bg-red-900/50 text-red-100 px-3 py-1 rounded-full text-sm text-center">Manipur</span>
              <span className="bg-red-900/50 text-red-100 px-3 py-1 rounded-full text-sm text-center">Nagaland</span>
              <span className="bg-red-900/50 text-red-100 px-3 py-1 rounded-full text-sm text-center col-span-2">Uttar Pradesh</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-300 mb-2">The Kerala Paradox</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">General Literacy</p>
                <p className="text-2xl font-bold text-green-400">84%</p>
              </div>
              <div className="text-4xl mx-4 text-gray-500">→</div>
              <div>
                <p className="text-sm text-gray-400">Financial Literacy</p>
                <p className="text-2xl font-bold text-red-400">36%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="font-bold text-purple-300 mb-2">Regional Leader</h4>
            <p className="text-sm">North-East zone achieves <span className="font-bold text-white">20% financial inclusion</span> - highest among all regions</p>
          </div>
        </div>
      </section>

      {/* Financial Behavior Section */}
      <section className="mb-10 bg-gray-800 p-6 rounded-xl shadow-inner">
        <div className="flex items-center mb-6">
          <div className="bg-purple-600 w-1 h-8 mr-3 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Financial Behavior & Investment Patterns</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Savings Distribution */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-700 pb-2">Savings Distribution</h3>
            <div className="relative h-48 mb-4">
              {/* Pie Chart Visualization */}
              <div 
                className="absolute inset-0 rounded-full border-8 border-transparent" 
                style={{
                  background: 'conic-gradient(#f59e0b 22%, #ef4444 44%, #3b82f6 34%)'
                }}
              >
              </div>
              <div className="absolute inset-8 rounded-full bg-gray-800"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Household Savings</p>
                  <p className="text-xl font-bold">100%</p>
                </div>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                <span className="flex-1">Real Estate</span>
                <span className="font-bold">44%</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                <span className="flex-1">Gold</span>
                <span className="font-bold">22%</span>
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                <span className="flex-1">Financial Assets</span>
                <span className="font-bold">34%</span>
              </li>
            </ul>
          </div>
          
          {/* Stock Market Participation */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-green-300 border-b border-green-700 pb-2">Stock Market Participation</h3>
            
            <div className="space-y-5">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Equity Market Exposure</p>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-bold text-red-400">4.7%</span>
                  <span className="text-sm text-gray-400 pb-1">of Indian households</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Lowest among major global economies</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Compared to:</p>
                  <p className="font-bold">Europe</p>
                  <p className="text-xl text-yellow-400">3× higher</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Compared to:</p>
                  <p className="font-bold">United States</p>
                  <p className="text-xl text-red-400">4× higher</p>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Unbanked Population</p>
                <div className="flex justify-between mt-2">
                  <div className="text-center">
                    <p className="text-xs">Rural</p>
                    <p className="text-xl font-bold text-purple-400">33%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs">Urban</p>
                    <p className="text-xl font-bold text-blue-400">29%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Simulator Impact Section */}
      <section className="mb-10 bg-gray-800 p-6 rounded-xl shadow-inner">
        <div className="flex items-center mb-6">
          <div className="bg-yellow-600 w-1 h-8 mr-3 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Educational Impact of Trading Simulations</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-green-300 border-b border-green-700 pb-2">Benefits of Simulation-Based Learning</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</span>
                <p>Develops <span className="font-bold">critical thinking skills</span> through profit/loss analysis without real-world risk</p>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</span>
                <p>Increases <span className="font-bold">student interest in investing</span> regardless of simulation performance (proven in studies)</p>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</span>
                <p>Bridges the <span className="font-bold">theory-practice gap</span> in financial markets education</p>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">4</span>
                <p>Provides <span className="font-bold">realistic environments</span> for learning trading strategies with real-time data</p>
              </li>
            </ul>
          </div>
          
          {/* Learning Outcomes */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-300 border-b border-purple-700 pb-2">Learning Outcomes</h3>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-yellow-500">
                <p>&quot;Users analyze markets, make informed decisions, and observe results <span className="font-bold text-yellow-300">risk-free</span>&quot;</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-green-500">
                <p>&quot;Mistakes become <span className="font-bold text-green-300">learning opportunities</span> without financial consequences&quot;</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                <p>&quot;Strategy testing leads to <span className="font-bold text-blue-300">skill improvement</span> over time&quot;</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
                <p className="text-sm">Key Insight: <span className="font-bold">Education maintains interest</span> even for poor performers (no correlation with actual performance)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Innovation Section */}
      <section className="mb-10 bg-gradient-to-br from-blue-900 to-purple-900 p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          <h2 className="text-2xl font-bold text-white">Innovation Value of Trading Simulator</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Market Needs */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-yellow-300 border-b border-yellow-700 pb-2">Addressing Market Needs</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-bold text-white mb-1">Bridging the Literacy Gap</p>
                <p>Targets the <span className="text-yellow-300 font-bold">42-54% disparity</span> between general and financial literacy</p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-bold text-white mb-1">Overcoming Fear Barriers</p>
                <p>Simulation approach reduces <span className="text-red-300 font-bold">hesitation toward markets</span> caused by loss anxiety</p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-bold text-white mb-1">Inclusive Education</p>
                <p>Directly serves the <span className="text-blue-300 font-bold">32.2% completely illiterate</span> population segment</p>
              </div>
            </div>
          </div>
          
          {/* Economic Impact */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-green-300 border-b border-green-700 pb-2">Potential Economic Impact</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm border-l-4 border-blue-500">
                <p className="font-bold text-white mb-1">Vision 2047 Alignment</p>
                <p>Supports India&apos;s development goals by creating <span className="text-blue-300 font-bold">financially empowered citizens</span></p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm border-l-4 border-yellow-500">
                <p className="font-bold text-white mb-1">Wealth Redistribution</p>
                <p>Could shift savings from real estate/gold (<span className="text-yellow-300 font-bold">66%</span>) to <span className="text-green-300 font-bold">productive financial assets</span></p>
              </div>
              <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm border-l-4 border-purple-500">
                <p className="font-bold text-white mb-1">Dual Benefit</p>
                <p>Drives both <span className="text-purple-300 font-bold">individual prosperity</span> and <span className="text-purple-300 font-bold">national economic growth</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Features Section */}
      <section className="mb-10 bg-gray-800 p-6 rounded-xl shadow-inner">
        <h2 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
          Project Differentiation Features
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Comprehensive Learning */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-700 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Comprehensive Learning Approach
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start bg-gray-700 p-4 rounded-lg">
                <div className="bg-blue-600/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Foundational Modules</p>
                  <p className="text-sm">Covers fundamental concepts for the <span className="text-blue-300">42.8% with elementary literacy</span></p>
                </div>
              </div>
              
              <div className="flex items-start bg-gray-700 p-4 rounded-lg">
                <div className="bg-green-600/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Assessment Quizzes</p>
                  <p className="text-sm">Validates learning against <span className="text-green-300">academic research</span> on education&apos;s role</p>
                </div>
              </div>
              
              <div className="flex items-start bg-gray-700 p-4 rounded-lg">
                <div className="bg-red-600/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Risk-Free Simulation</p>
                  <p className="text-sm">Specifically targets <span className="text-red-300">equity market hesitation</span> (only 4% participation)</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Learning */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-300 border-b border-purple-700 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              Social Learning Integration
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start bg-gray-700 p-4 rounded-lg">
                <div className="bg-purple-600/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Collaborative Tools</p>
                  <p className="text-sm">Chat with research features enables <span className="text-purple-300">informed decision-making</span></p>
                </div>
              </div>
              
              <div className="flex items-start bg-gray-700 p-4 rounded-lg">
                <div className="bg-yellow-600/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Real-Time Market Data</p>
                  <p className="text-sm">Connects <span className="text-yellow-300">theory with practical context</span> using live information</p>
                </div>
              </div>
              
              <div className="flex items-start bg-gray-700 p-4 rounded-lg">
                <div className="bg-green-600/20 p-2 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Community Support</p>
                  <p className="text-sm">Overcomes <span className="text-green-300">psychological barriers</span> through peer learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="bg-black/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Strategic Conclusion</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="mb-4 text-lg">Trading simulator <span className="font-bold text-yellow-300">directly addresses India&apos;s financial literacy challenges</span> through an innovative, multi-modal approach combining:</p>
          
          <div className="grid grid-cols-4 gap-2 mb-6">
            <span className="bg-blue-900/50 text-blue-100 px-2 py-1 rounded-full text-sm">Education</span>
            <span className="bg-purple-900/50 text-purple-100 px-2 py-1 rounded-full text-sm">Assessment</span>
            <span className="bg-green-900/50 text-green-100 px-2 py-1 rounded-full text-sm">Simulation</span>
            <span className="bg-yellow-900/50 text-yellow-100 px-2 py-1 rounded-full text-sm">Community</span>
          </div>
          
          <p className="mb-4 font-medium">The statistical evidence demonstrates that such tools are <span className="underline">not merely beneficial but essential</span> for:</p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-900/50 to-blue-900/0 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="font-bold">India&apos;s Economic Transformation</p>
              <p className="text-sm">Supporting the 2047 developed nation vision</p>
            </div>
            <div className="bg-gradient-to-r from-purple-900/50 to-purple-900/0 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="font-bold">Individual Financial Empowerment</p>
              <p className="text-sm">Creating informed investors and savers</p>
            </div>
          </div>
          
          <p className="text-yellow-400 font-bold">This project represents a critical intervention at the intersection of education, technology, and economic development.</p>
        </div>
      </section>

      {/* Sources Section */}
      <footer className="mt-12 bg-gray-800 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-blue-300 border-b border-blue-700 pb-2">Research Sources</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-gray-300 mb-2">Official Reports</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.moneycontrol.com/news/business/markets/financial-literacy-will-be-key-to-india-s-vision-for-2047-amfi-s-venkat-chalasani-12888370.html" className="text-blue-400 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  MoneyControl Annual Report on Financial Inclusion
                </a>
              </li>
              <li>
                <a href="https://www.newindianexpress.com/business/2024/Apr/15/why-is-financial-literacy-falling-short" className="text-blue-400 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  New Indian Express National Financial Literacy Survey
                </a>
              </li>
              <li>
                <a href="https://www.business-standard.com/content/press-releases-ani/spreading-the-financial-literacy-wave-across-india-national-finance-olympiad-2023-123122100732_1.html" className="text-blue-400 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Business Standard Investor Education Journals
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-300 mb-2">Academic Studies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.adb.org/results/india-financial-literacy-programs-lifting-families-out-debt-fueling-new-prosperity" className="text-blue-400 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ABD Simulation Learning Research
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/pulse/why-financial-literacy-india-important-centricity-wealthtech-yayvc" className="text-blue-400 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Linkedin Global Financial Literacy Comparisons
                </a>
              </li>
              <li>
                <a href="https://zerodha.com/varsity/" className="text-blue-400 hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Zerodha World Bank Global Findex Database
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
              </motion.div>
              
              
            </div>
          </motion.div>
        </section>

        {/* Product Video Section */}
        <section id="demo" className="py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              See Investopia in Action
            </h2>
            
            <div className="aspect-w-16 aspect-h-9 bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
              {/* Replace with your actual video embed */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🎥</div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">Product Overview</h3>
                  <p className="text-gray-300">Watch how Investopia can transform your trading journey</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pricing Plans Section */}
        {/* <section id="pricing" className="py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Choose Your Plan
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Free",
                  price: "$0",
                  desc: "Start your trading journey",
                  features: [
                    "Basic market data",
                    "Community access",
                    "5 AI insights/month",
                    "Weekly webinars"
                  ],
                  buttonText: "Get Started",
                  popular: false
                },
                {
                  name: "Pro",
                  price: "$29",
                  desc: "For serious traders",
                  features: [
                    "Advanced analytics",
                    "50 AI insights/month",
                    "1 coaching session",
                    "Priority support",
                    "Daily webinars"
                  ],
                  buttonText: "Go Pro",
                  popular: true
                },
                {
                  name: "Premium",
                  price: "$99",
                  desc: "Maximum advantage",
                  features: [
                    "All Pro features",
                    "Unlimited AI insights",
                    "4 coaching sessions",
                    "24/7 VIP support",
                    "Custom strategies"
                  ],
                  buttonText: "Get Premium",
                  popular: false
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-xl overflow-hidden border ${
                    plan.popular 
                      ? "border-purple-500 shadow-lg shadow-purple-500/20" 
                      : "border-gray-700"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <div className="p-8 bg-gray-800/50 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold mb-1 text-white">{plan.name}</h3>
                    <p className="text-gray-400 mb-4">{plan.desc}</p>
                    <div className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                      {plan.price}
                      <span className="text-lg text-gray-400">/mo</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link href="/auth/signup">
                        <button className={`w-full py-3 rounded-lg font-medium ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}>
                          {plan.buttonText}
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section> */}

       {/* Team Section */}
        <section id="team" className="py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Meet Our Team
            </h2>
            
            <div className="relative h-96">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: index === currentTeamIndex ? 1 : 0,
                    scale: index === currentTeamIndex ? 1 : 0.8,
                    zIndex: index === currentTeamIndex ? 1 : 0
                  }}
                  transition={{ duration: 0.6 }}
                  className={`absolute inset-0 flex flex-col items-center justify-center ${
                    index === currentTeamIndex ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                >
                  <div className="relative w-64 h-64 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="absolute inset-0 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-lg shadow-purple-500/20"
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        transition: { duration: 20, repeat: Infinity, ease: "linear" }
                      }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/20"
                    />
                  </div>
                  
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-medium mb-2">
                      {member.role}
                    </p>
                 
                  </motion.div>
                </motion.div>
              ))}
              
              <div className="flex justify-center mt-8 space-x-2">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTeamIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === currentTeamIndex 
                        ? 'bg-purple-600 w-6' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`View team member ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </section>



        {/* Feedback Form Section */}
        {/* <section className="py-20">
        <FinancialLiteracyReport />
        </section> */}

        {/* Footer */}
        {/* <footer className="py-12 border-t border-gray-800">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/images/logo.png"
                    alt="Investopia Logo"
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    INVESTOPIA
                  </div>
                </div>
                <p className="text-gray-400">
                  Empowering traders with AI-driven insights since 2025.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Features</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">API</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Integrations</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Documentation</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Guides</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Blog</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Community</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">About</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Careers</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Privacy</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Terms</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2025 Investopia. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Discord</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </footer> */}
      </div>
    </div>
  );
}
