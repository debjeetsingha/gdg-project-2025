"use client"

import { TrendingUp, TrendingDown, Wallet, PieChart, BarChart4, Briefcase } from "lucide-react"
import useMetricsStore from "./metrics-store"
import { useEffect } from "react"

const MetricsTopbar = ({ currentPrices = {} }) => {
  const {
    initialInvestment,
    totalProfit,
    totalLoss,
    moneyLeft,
    portfolioValue,
    totalInvested,
    calculateRealTimeProfitLoss,
  } = useMetricsStore()

  // Calculate real-time profit/loss whenever prices change
  useEffect(() => {
    if (Object.keys(currentPrices).length > 0) {
      calculateRealTimeProfitLoss(currentPrices)
    }
  }, [currentPrices, calculateRealTimeProfitLoss])

  const totalValue = moneyLeft + portfolioValue
  const netProfitLoss = totalValue - initialInvestment
  const percentChange = (totalValue / initialInvestment - 1) * 100

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-3 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2 p-1">
          <Wallet size={18} />
          <span className="text-gray-300 text-sm">Balance:</span>
          <span className="font-bold">${moneyLeft.toFixed(2)}</span>
        </div>

        <div className="flex items-center space-x-2 p-1">
          <PieChart size={18} />
          <span className="text-gray-300 text-sm">Portfolio:</span>
          <span className="font-bold">${portfolioValue.toFixed(2)}</span>
        </div>

        <div className="flex items-center space-x-2 p-1">
          <Briefcase size={18} className="text-blue-400" />
          <span className="text-gray-300 text-sm">Invested:</span>
          <span className="font-bold text-blue-400">${totalInvested.toFixed(2)}</span>
        </div>

        <div className="flex items-center space-x-2 p-1">
          <TrendingUp size={18} className="text-green-400" />
          <span className="text-gray-300 text-sm">Profit:</span>
          <span className="font-bold text-green-400">${totalProfit.toFixed(2)}</span>
        </div>

        <div className="flex items-center space-x-2 p-1">
          <TrendingDown size={18} className="text-red-400" />
          <span className="text-gray-300 text-sm">Loss:</span>
          <span className="font-bold text-red-400">${totalLoss.toFixed(2)}</span>
        </div>

        <div className="flex items-center space-x-2 p-1">
          <BarChart4 size={18} />
          <span className="text-gray-300 text-sm">Net P/L:</span>
          <span className={`font-bold ${netProfitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
            {netProfitLoss >= 0 ? "+" : ""}
            {netProfitLoss.toFixed(2)} ({percentChange.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  )
}

export default MetricsTopbar

