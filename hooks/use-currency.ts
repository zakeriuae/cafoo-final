import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CurrencyCode = 'AED' | 'USD' | 'EUR' | 'CNY' | 'INR' | 'IRR'

interface CurrencyState {
  currency: CurrencyCode
  rates: Record<string, number>
  lastUpdated: number | null
  setCurrency: (currency: CurrencyCode) => void
  fetchRates: () => Promise<void>
  convert: (amount: number, from?: CurrencyCode) => number
}

// Exchange fees (e.g., 2% for conversion convenience)
const CONVERSION_FEE = 0.02

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'AED',
      rates: {
        AED: 1,
        USD: 0.272,
        EUR: 0.254,
        CNY: 1.97,
        INR: 22.65,
        IRR: 115000, // This is a mock market rate, real IRR varies wildly
      },
      lastUpdated: null,

      setCurrency: (currency) => set({ currency }),

      fetchRates: async () => {
        try {
          // Using Frankfurter API (Free, no key needed for basic usage)
          // Note: Frankfurter doesn't support IRR or AED directly as base always, 
          // so we might need a more comprehensive one or hardcode some for now.
          // For this task, I'll use a reliable free API structure.
          const response = await fetch('https://api.exchangerate-api.com/v4/latest/AED')
          const data = await response.json()
          
          if (data && data.rates) {
            set({ 
              rates: {
                ...data.rates,
                // Manual override or fallback for IRR if not in API
                IRR: data.rates.IRR || 115000 
              }, 
              lastUpdated: Date.now() 
            })
          }
        } catch (error) {
          console.error('Failed to fetch exchange rates:', error)
        }
      },

      convert: (amount, from = 'AED') => {
        const { rates, currency } = get()
        if (from === currency) return amount
        
        // Convert to base (AED) first if needed
        const amountInBase = from === 'AED' ? amount : amount / rates[from]
        
        // Convert to target currency
        const rawConverted = amountInBase * rates[currency]
        
        // Apply conversion fee (if not the same currency)
        return rawConverted * (1 + CONVERSION_FEE)
      }
    }),
    {
      name: 'cafoo-currency-storage',
    }
  )
)
