import { create } from "zustand"

// Zustand store for financial metrics with persistence
const useMetricsStore = create(
    (set, get) => ({
      initialInvestment: 10000,
      totalProfit: 0,
      totalLoss: 0,
      moneyLeft: 10000,
      portfolioValue: 0,
      totalInvested: 0, // Track total amount invested
      buyPrices: {}, // Track buy prices for FIFO calculation

      // Calculate real-time profit/loss based on current prices
      calculateRealTimeProfitLoss: (currentPrices) => {
        const buyPrices = get().buyPrices
        let unrealizedProfit = 0
        let unrealizedLoss = 0

        // Calculate unrealized profit/loss for each stock
        Object.keys(buyPrices).forEach((symbol) => {
          if (currentPrices[symbol]) {
            const currentPrice = currentPrices[symbol]

            buyPrices[symbol].forEach((share) => {
              if (!share.sold) {
                const priceDiff = currentPrice - share.price
                if (priceDiff > 0) {
                  unrealizedProfit += priceDiff
                } else if (priceDiff < 0) {
                  unrealizedLoss += Math.abs(priceDiff)
                }
              }
            })
          }
        })

        set({
          totalProfit: unrealizedProfit,
          totalLoss: unrealizedLoss,
        })
      },

      // Update buy prices when buying shares
      updateBuyPrices: (symbol, newShares) => {
        set((state) => {
          const updatedBuyPrices = { ...state.buyPrices }

          if (!updatedBuyPrices[symbol]) {
            updatedBuyPrices[symbol] = []
          }

          updatedBuyPrices[symbol] = [...updatedBuyPrices[symbol], ...newShares]

          // Calculate total invested amount
          let totalInvested = 0
          Object.values(updatedBuyPrices)
            .flat()
            .forEach((share) => {
              if (!share.sold) {
                totalInvested += share.price
              }
            })

          return {
            buyPrices: updatedBuyPrices,
            totalInvested,
          }
        })
      },

      // Mark shares as sold
      markSharesAsSold: (symbol, count) => {
        set((state) => {
          const updatedBuyPrices = { ...state.buyPrices }
          let remainingToSell = count

          if (updatedBuyPrices[symbol]) {
            updatedBuyPrices[symbol] = updatedBuyPrices[symbol].map((share) => {
              if (remainingToSell > 0 && !share.sold) {
                remainingToSell--
                return { ...share, sold: true }
              }
              return share
            })
          }

          // Recalculate total invested amount
          let totalInvested = 0
          Object.values(updatedBuyPrices)
            .flat()
            .forEach((share) => {
              if (!share.sold) {
                totalInvested += share.price
              }
            })

          return {
            buyPrices: updatedBuyPrices,
            totalInvested,
          }
        })
      },

      updateMetrics: (metrics) => {
        if (typeof metrics === "function") {
          set((state) => {
            const updatedValues = metrics(state)
            return { ...state, ...updatedValues }
          })
        } else {
          set((state) => ({ ...state, ...metrics }))
        }
      },

      resetMetrics: () =>
        set({
          initialInvestment: 10000,
          totalProfit: 0,
          totalLoss: 0,
          moneyLeft: 10000,
          portfolioValue: 0,
          totalInvested: 0,
          buyPrices: {},
        }),
    }),
  
)

export default useMetricsStore