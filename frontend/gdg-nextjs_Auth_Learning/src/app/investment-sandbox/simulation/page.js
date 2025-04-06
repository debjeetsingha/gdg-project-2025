"use client"

import {Suspense} from "react"
import Link from "next/link"
import SandboxComponent from "./sandbox"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Play, Pause, DollarSign, TrendingUp, BarChart2, Clock, Info, Newspaper, RefreshCcw } from "lucide-react"
import useMetricsStore from "./metrics-store"
import MetricsTopbar from "./metrics-topbar"

// Fetch data from the real API endpoint
const fetchStockData = async (stock) => {
  try {
    const response = await fetch(`https://fin-api-three.vercel.app/fakestockdata?stock=${stock}&days=365&interval=1d`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw error
  }
}

// Helper function to format date as "MMM DD"
const formatDateString = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Helper function to get month key from date
const getMonthKey = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${date.getMonth() + 1}`
}

const Simulation = () => {
  const searchParams = useSearchParams()
  const stockSymbol = searchParams.get("stock") || "INFY"

  const [stockData, setStockData] = useState([])
  const [monthlyGroups, setMonthlyGroups] = useState({})
  const [visibleDataIndex, setVisibleDataIndex] = useState(1) // Start with first day visible
  const [playing, setPlaying] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(500) // ms per step
  const [balance, setBalance] = useState(10000) // Start with $10,000
  const [portfolio, setPortfolio] = useState({})
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newsArticles, setNewsArticles] = useState([])
  const [currentArticle, setCurrentArticle] = useState(0)
  const [filteredNews, setFilteredNews] = useState([])
  const [shareAmount, setShareAmount] = useState(1) // Number of shares to buy/sell
  const [currentPrices, setCurrentPrices] = useState({}) // Track current prices for all stocks

  const timerRef = useRef(null)
  const newsIntervalRef = useRef(null)

  // Get metrics store actions
  const { updateMetrics, resetMetrics, moneyLeft, updateBuyPrices, markSharesAsSold } = useMetricsStore()

  // Initialize state from persisted store
  useEffect(() => {
    setBalance(moneyLeft || 10000)
  }, [moneyLeft])

  // Fetch data on mount or when stock symbol changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Don't reset metrics when changing stocks
        // resetMetrics()

        const response = await fetchStockData(stockSymbol)
        const data = response.data || []
        const news = response.news || []

        // Process and sort data by timestamp
        const processedData = data
          .map((item) => ({
            ...item,
            formattedDate: formatDateString(item.timestamp),
            monthKey: getMonthKey(item.timestamp),
            current_price: item.current_price || 0,
            change: item.change || 0,
            change_percent: item.change_percent || 0,
            volume: item.volume || 0,
            high: item.high || 0,
            low: item.low || 0,
            open: item.open || 0,
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))


        setStockData(processedData)
        setNewsArticles(news)

        // Group data by month for visualization
        const groups = {}
        processedData.forEach((item) => {
          if (!groups[item.monthKey]) {
            groups[item.monthKey] = {
              month: new Date(item.timestamp).toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              }),
              days: [],
            }
          }
          groups[item.monthKey].days.push(item)
        })

        setMonthlyGroups(groups)

        // Set visible index to first day
        setVisibleDataIndex((prev) => Math.min(prev, processedData.length - 1))

        // Don't reset portfolio and transactions when changing stocks
        // setPortfolio({})
        // setTransactions([])
        // setBalance(10000)
      } catch (error) {
        setError("Failed to load stock data. Please try again later.")
        console.error("Error fetching stock data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (newsIntervalRef.current) clearInterval(newsIntervalRef.current)
    }
  }, [stockSymbol, updateMetrics])

  // Handle simulation playback
  useEffect(() => {
    if (playing && stockData.length > 0) {
      timerRef.current = setInterval(() => {
        setVisibleDataIndex((prev) => {
          const next = prev + 1
          if (next >= stockData.length) {
            setPlaying(false)
            return prev
          }
          return next
        })
      }, simulationSpeed)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [playing, stockData, simulationSpeed, visibleDataIndex])

  // Filter news articles based on current simulation date
  useEffect(() => {
    if (newsArticles.length > 0 && stockData.length > 0 && visibleDataIndex < stockData.length) {
      const currentDate = new Date(stockData[visibleDataIndex].timestamp)

      // Filter news articles that are on or before the current simulation date
      const relevantNews = newsArticles.filter((article) => {
        if (!article.date) return false

        // Convert the article date format (e.g., "January 10th") to a Date object
        const articleDateStr = article.date.replace(/(\d+)(st|nd|rd|th)/, "$1")
        const articleDate = new Date(articleDateStr + ", 2023")

        return articleDate <= currentDate
      })

      setFilteredNews(relevantNews)

      // Reset current article index if needed
      if (currentArticle >= relevantNews.length) {
        setCurrentArticle(relevantNews.length > 0 ? 0 : 0)
      }
    }
  }, [visibleDataIndex, newsArticles, stockData, currentArticle])

  // Auto-rotate news articles when playing
  useEffect(() => {
    if (playing && filteredNews.length > 0) {
      newsIntervalRef.current = setInterval(() => {
        setCurrentArticle((prev) => (prev + 1) % filteredNews.length)
      }, 10000) // Change news every 10 seconds
    } else if (newsIntervalRef.current) {
      clearInterval(newsIntervalRef.current)
    }

    return () => {
      if (newsIntervalRef.current) clearInterval(newsIntervalRef.current)
    }
  }, [playing, filteredNews])

  // Calculate visible data
  const visibleData = stockData.slice(0, visibleDataIndex + 1)

  // Get current price - use the last visible day's data
  const currentDayData = visibleData.length > 0 ? visibleData[visibleData.length - 1] : null
  const currentPrice = currentDayData ? currentDayData.current_price : 0

  // Update current prices for real-time profit/loss calculation
  useEffect(() => {
    if (currentDayData) {
      setCurrentPrices((prev) => ({
        ...prev,
        [stockSymbol]: currentPrice,
      }))
    }
  }, [currentPrice, stockSymbol, currentDayData])

  // Calculate portfolio value
  const portfolioShares = portfolio[stockSymbol] || 0
  const portfolioValue = portfolioShares * currentPrice
  const totalValue = balance + portfolioValue

  // Update metrics when portfolio value or balance changes
  useEffect(() => {
    updateMetrics({
      moneyLeft: balance,
      portfolioValue: portfolioValue,
    })
  }, [balance, portfolioValue, updateMetrics])

  // Reset simulation
  const resetSimulation = () => {
    resetMetrics()
    setBalance(10000)
    setPortfolio({})
    setTransactions([])
    setVisibleDataIndex(Math.min(1, stockData.length - 1))
    setPlaying(false)
  }

  // Buy stocks
  const buyStock = () => {
    const totalCost = currentPrice * shareAmount
    if (balance >= totalCost) {
      // Buy shares
      const newBalance = balance - totalCost
      const newPortfolio = { ...portfolio }
      newPortfolio[stockSymbol] = (newPortfolio[stockSymbol] || 0) + shareAmount

      // Create new shares for FIFO calculation
      const newShares = Array(shareAmount)
        .fill()
        .map(() => ({
          price: currentPrice,
          date: currentDayData.timestamp,
          sold: false,
        }))

      // Update buy prices in the store
      updateBuyPrices(stockSymbol, newShares)

      setBalance(newBalance)
      setPortfolio(newPortfolio)

      // Record transaction
      setTransactions([
        ...transactions,
        {
          type: "BUY",
          symbol: stockSymbol,
          price: currentPrice,
          shares: shareAmount,
          timestamp: new Date().toISOString(),
          dayIndex: visibleDataIndex,
          date: currentDayData.formattedDate,
          totalAmount: totalCost,
        },
      ])
    }
  }

  // Sell stocks
  const sellStock = () => {
    if ((portfolio[stockSymbol] || 0) >= shareAmount) {
      // Sell shares
      const totalAmount = currentPrice * shareAmount
      const newBalance = balance + totalAmount
      const newPortfolio = { ...portfolio }
      newPortfolio[stockSymbol] = newPortfolio[stockSymbol] - shareAmount

      // Mark shares as sold in the store
      markSharesAsSold(stockSymbol, shareAmount)

      setBalance(newBalance)
      setPortfolio(newPortfolio)

      // Record transaction
      setTransactions([
        ...transactions,
        {
          type: "SELL",
          symbol: stockSymbol,
          price: currentPrice,
          shares: shareAmount,
          timestamp: new Date().toISOString(),
          dayIndex: visibleDataIndex,
          date: currentDayData.formattedDate,
          totalAmount: totalAmount,
        },
      ])
    }
  }

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800">{data.formattedDate}</p>
          <p className="text-gray-600">Price: ${data.current_price.toFixed(2)}</p>
          <p className={`${data.change >= 0 ? "text-green-600" : "text-red-600"}`}>
            Change: {data.change >= 0 ? "+" : ""}
            {data.change.toFixed(2)} ({data.change_percent.toFixed(2)}%)
          </p>
          <p className="text-gray-600">Volume: {data.volume.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }


  // Get all transactions up to the current day
  const allTransactionsToDate = transactions.filter((t) => t.dayIndex <= visibleDataIndex)


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock data for {stockSymbol}...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // No data state
  if (stockData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="text-yellow-500 text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-4">
            No stock data available for {stockSymbol}. Please try a different stock symbol.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <TrendingUp className="mr-2" />
            Investment Simulator
          </h1>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <Link href="/learning"><div className="bg-green-600 bg-opacity-50 rounded-lg px-4 py-2">
              <span className="font-medium">Learning Corner</span>
            </div></Link>
            <div className="bg-indigo-900 bg-opacity-50 rounded-lg px-4 py-2">
              <span className="font-medium">Stock: </span>
              <span className="font-bold">{stockSymbol}</span>
            </div>
            <div className="bg-indigo-900 bg-opacity-50 rounded-lg px-4 py-2">
              <span className="font-medium">Day: </span>
              <span className="font-bold">
                {visibleDataIndex + 1}/{stockData.length}
              </span>
            </div>
            {currentDayData && (
              <div className="bg-indigo-900 bg-opacity-50 rounded-lg px-4 py-2">
                <span className="font-medium">Date: </span>
                <span className="font-bold">{currentDayData.formattedDate}</span>
              </div>
            )}
            <button
              onClick={resetSimulation}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 flex items-center transition-colors"
            >
              <RefreshCcw size={16} className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Metrics Topbar - Pass current prices for real-time calculation */}
      <MetricsTopbar currentPrices={currentPrices} />

      <main className="container mx-auto flex-grow p-4">
        {/* Chart card */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <BarChart2 className="mr-2" size={20} />
              {stockSymbol} Daily Price Chart
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSimulationSpeed((prev) => Math.max(100, prev - 100))}
                className="bg-gray-200 hover:bg-gray-300 rounded-md p-2 text-gray-700 transition-colors"
                disabled={simulationSpeed <= 100}
              >
                Faster
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className={`${
                  playing ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } rounded-full p-2 text-white transition-colors`}
              >
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={() => setSimulationSpeed((prev) => Math.min(1000, prev + 100))}
                className="bg-gray-200 hover:bg-gray-300 rounded-md p-2 text-gray-700 transition-colors"
                disabled={simulationSpeed >= 1000}
              >
                Slower
              </button>
            </div>
          </div>

          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visibleData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                isAnimationActive={true}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} interval="preserveStartEnd" minTickGap={30} />
                <YAxis
                  domain={["dataMin - 5", "dataMax + 5"]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Month separators - visual indicators for month changes */}
                {Object.values(monthlyGroups).map((monthGroup, idx) => {
                  // Get the first day of each month
                  const firstDay = monthGroup.days[0]
                  if (!firstDay || idx === 0) return null // Skip first month to avoid edge

                  return (
                    <ReferenceLine
                      key={`month-${idx}`}
                      x={firstDay.formattedDate}
                      stroke="#6B7280"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      label={{
                        value: monthGroup.month,
                        position: "top",
                        fill: "#6B7280",
                        fontSize: 10,
                      }}
                    />
                  )
                })}

                {/* Highlight buy/sell transactions */}
                {allTransactionsToDate.map((transaction, idx) => {
                  const dayData = stockData[transaction.dayIndex]
                  if (!dayData) return null

                  return (
                    <ReferenceLine
                      key={`transaction-${idx}`}
                      x={dayData.formattedDate}
                      stroke={transaction.type === "BUY" ? "#10B981" : "#EF4444"}
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  )
                })}

                <Line
                  type="monotone"
                  dataKey="current_price"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: "#6D28D9" }}
                  isAnimationActive={true}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* News section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-lg p-4 border border-indigo-100 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Newspaper className="mr-2" size={20} />
            Market News
          </h2>

          <div className="relative overflow-hidden" style={{ minHeight: "200px" }}>
            <AnimatePresence mode="wait">
              {filteredNews.length > 0 ? (
                <motion.div
                  key={currentArticle}
                  className="p-4 bg-white rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-indigo-800">{filteredNews[currentArticle].headline}</h3>
                    <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {filteredNews[currentArticle].date}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{filteredNews[currentArticle].article}</p>
                </motion.div>
              ) : (
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 italic">No news articles available for this date</p>
                </div>
              )}
            </AnimatePresence>

            {/* News navigation dots */}
            {filteredNews.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {filteredNews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentArticle(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === currentArticle ? "bg-indigo-500" : "bg-gray-300"
                    }`}
                    aria-label={`News article ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Portfolio and actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Left column - Portfolio summary */}
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <DollarSign className="mr-2" size={20} />
              Portfolio Summary
            </h2>
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Cash Balance:</span>
                <span className="font-semibold text-gray-800">${balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Shares Owned:</span>
                <span className="font-semibold text-gray-800">{portfolioShares}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Stock Value:</span>
                <span className="font-semibold text-gray-800">${portfolioValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 text-lg">
                <span className="font-bold text-gray-700">Total Value:</span>
                <span className="font-bold text-gray-800">${totalValue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Middle column - Current stock details */}
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Info className="mr-2" size={20} />
                Stock Details
              </h2>
              <AnimatePresence mode="wait">
                {currentDayData && (
                  <motion.div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      currentDayData.change >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    key={visibleDataIndex}
                  >
                    {currentDayData.change >= 0 ? "+" : ""}
                    {currentDayData.change.toFixed(2)} ({currentDayData.change_percent.toFixed(2)}%)
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {currentDayData && (
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-800">{currentDayData.formattedDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="font-semibold text-gray-800">${currentDayData.current_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Open:</span>
                  <span className="font-semibold text-gray-800">${currentDayData.open.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">High:</span>
                  <span className="font-semibold text-gray-800">${currentDayData.high.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Low:</span>
                  <span className="font-semibold text-gray-800">${currentDayData.low.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Volume:</span>
                  <span className="font-semibold text-gray-800">{currentDayData.volume.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Actions */}
          <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Trading Actions
            </h2>

            <div className="space-y-4">
              {/* Share amount selector */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Shares to trade:</label>
                <div className="flex items-center">
                  <button
                    onClick={() => setShareAmount((prev) => Math.max(1, prev - 1))}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l-md text-slate-800"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    min="1"
                    value={shareAmount}
                    onChange={(e) => setShareAmount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-t border-b border-gray-300 py-1 text-slate-900"
                  />
                  <button
                    onClick={() => setShareAmount((prev) => prev + 1)}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r-md text-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={buyStock}
                  className={`py-3 px-4 ${
                    balance >= currentPrice * shareAmount
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white font-bold rounded-lg shadow transition-colors`}
                  whileTap={balance >= currentPrice * shareAmount ? { scale: 0.95 } : {}}
                  disabled={!currentDayData || balance < currentPrice * shareAmount}
                >
                  BUY {shareAmount}
                </motion.button>
                <motion.button
                  onClick={sellStock}
                  className={`py-3 px-4 ${
                    portfolioShares >= shareAmount ? "bg-red-500 hover:bg-red-600" : "bg-gray-300 cursor-not-allowed"
                  } text-white font-bold rounded-lg shadow transition-colors`}
                  whileTap={portfolioShares >= shareAmount ? { scale: 0.95 } : {}}
                  disabled={!currentDayData || portfolioShares < shareAmount}
                >
                  SELL {shareAmount}
                </motion.button>
              </div>


              {/* Transaction history */}
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Transaction History:</h3>
                {allTransactionsToDate.length > 0 ? (
                  <div className="space-y-2 max-h-36 overflow-y-auto text-black">
                    {allTransactionsToDate.map((transaction, idx) => (
                      <motion.div
                        key={idx}
                        className={`p-2 rounded-md text-sm ${
                          transaction.type === "BUY"
                            ? "bg-green-50 border-green-200 border"
                            : "bg-red-50 border-red-200 border"
                        }`}
                      >
                        <div className="font-semibold">
                          {transaction.type} {transaction.shares} shares - {transaction.symbol}
                        </div>
                        <div className="text-xs flex justify-between">
                          <span>Date: {transaction.date}</span>
                          <span>${transaction.price.toFixed(2)}</span>
                        </div>
                        {transaction.type === "SELL" && transaction.profitLoss !== undefined && (
                          <div
                            className={`text-xs mt-1 ${transaction.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.profitLoss >= 0 ? "Profit: +" : "Loss: "}$
                            {Math.abs(transaction.profitLoss).toFixed(2)}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No transactions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stock selection section */}
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Explore More Stocks
        </h2>
        <SandboxComponent />
      </div>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 mt-6">
        <div className="container mx-auto text-center">
          <p className="mb-2">Investment Simulator - For educational purposes only. Not financial advice.</p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Investment Simulator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>)
}

export default function InvestmentSimulator() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Simulation />
    </Suspense>
  )
}

