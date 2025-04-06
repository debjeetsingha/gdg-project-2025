"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

export default function SandboxComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // BSE/NSE stock options
  const stockOptions = [
    { symbol: "RELIANCE", name: "Reliance Industries Ltd." },
    { symbol: "TCS", name: "Tata Consultancy Services Ltd." },
    { symbol: "HDFCBANK", name: "HDFC Bank Ltd." },
    { symbol: "INFY", name: "Infosys Ltd." },
    { symbol: "ICICIBANK", name: "ICICI Bank Ltd." },
    { symbol: "SBIN", name: "State Bank of India" },
    { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd." },
    { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd." },
    { symbol: "ITC", name: "ITC Ltd." },
    { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd." },
  ];
  

  // Filter stocks based on search query
  const filteredStocks = stockOptions.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectStock = (stock) => {
    router.push(`?stock=${stock}`)
  }

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-purple-200 transition-all duration-300 hover:border-purple-400 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200">
          <div className="pl-4">
            <Search className="text-purple-500" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for BSE/NSE stocks..."
            className="w-full p-4 focus:outline-none text-gray-700"
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-xl max-h-60 overflow-auto border border-purple-100">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <motion.div
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock.symbol)}
                  className="p-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  whileHover={{ x: 5 }}
                >
                  <div className="font-medium text-gray-800">{stock.symbol}</div>
                  <div className="text-sm text-gray-500">{stock.name}</div>
                </motion.div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No stocks found</div>
            )}
          </div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Select a BSE/NSE stock to begin
        </h2>
        <p className="text-gray-600 mb-8">
          Search for a stock symbol or company name to view real-time data and start trading in our simulation
          environment
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stockOptions.map((stock) => (
            <motion.button
              key={stock.symbol}
              onClick={() => handleSelectStock(stock.symbol)}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 flex flex-col items-center"
              whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="font-bold text-gray-800 mb-1">{stock.symbol}</div>
              <div className="text-xs text-gray-500 truncate max-w-full">{stock.name}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

