"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface Stock {
  symbol: string;
  name: string;
}

interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockDataResponse {
  symbol: string;
  historicalData: StockDataPoint[];
}

export default function Sandbox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // BSE/NSE stock options
  const stockOptions: Stock[] = [
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
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchStockData = async (stockSymbol: string): Promise<StockDataResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://fin-api-three.vercel.app/fakestockdata?stock=${stockSymbol}&days=365&interval=1d`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      return await response.json();
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to load stock data. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStock = async (stock: string | Stock) => {
    try {
      const stockSymbol = typeof stock === 'string' ? stock : stock.symbol;
      await fetchStockData(stockSymbol); // We don't need to store the data here
      router.push(`/investment-sandbox/simulation?stock=${stockSymbol}`);
    } catch (err) {
      console.error('Error selecting stock:', err);
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-6 p-4">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border-2 border-gray-700">
          <div className="pl-4">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for BSE/NSE stocks..."
            className="w-full p-4 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="font-medium dark:text-white">
                    {stock.symbol}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stock.name}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 dark:text-gray-400">
                No stocks found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="p-4 text-center text-blue-500 animate-pulse">Loading stock data...</div>
      )}
      {error && (
        <div className="p-4 text-center text-red-500">{error}</div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center m-3"
      >
        <h2 className="text-xl font-medium mb-2 dark:text-white">
          Select a BSE/NSE stock to begin
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Search for a stock symbol or company name to view real-time data and
          start trading
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {stockOptions.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSelectStock(stock.symbol)}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              <div className="font-medium dark:text-white">{stock.symbol}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {stock.name}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
}