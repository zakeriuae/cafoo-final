"use client"

import * as React from "react"
import { 
  DollarSign, 
  Euro, 
  IndianRupee, 
  Coins,
  ChevronDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useCurrency, CurrencyCode } from "@/hooks/use-currency"
import { AedSymbol } from "@/components/ui/aed-symbol"
import { cn } from "@/lib/utils"

const currencies: { code: CurrencyCode; label: string; icon: any }[] = [
  { code: 'AED', label: 'UAE Dirham', icon: (props: any) => <AedSymbol {...props} /> },
  { code: 'USD', label: 'US Dollar', icon: DollarSign },
  { code: 'EUR', label: 'Euro', icon: Euro },
  { code: 'CNY', label: 'Chinese Yuan', icon: (props: any) => (
    <span {...props} className={cn("font-bold flex items-center justify-center", props.className)}>¥</span>
  )},
  { code: 'INR', label: 'Indian Rupee', icon: IndianRupee },
  { code: 'IRR', label: 'Iranian Rial', icon: (props: any) => (
    <span {...props} className={cn("font-bold flex items-center justify-center text-[10px]", props.className)}>IRR</span>
  )},
]

interface CurrencySwitcherProps {
  isLight?: boolean
}

export function CurrencySwitcher({ isLight }: CurrencySwitcherProps) {
  const { currency, setCurrency, fetchRates } = useCurrency()
  const activeCurrency = currencies.find(c => c.code === currency) || currencies[0]

  React.useEffect(() => {
    fetchRates()
  }, [fetchRates])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-10 px-2 gap-1.5 rounded-xl transition-all hover:bg-slate-100",
            !isLight && "text-white/80 hover:text-white hover:bg-white/10"
          )}
        >
          <activeCurrency.icon className="w-4 h-4" />
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-2xl p-1 shadow-2xl border-slate-100">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
              currency === curr.code ? "bg-primary/5 text-primary font-bold" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <curr.icon className={cn("w-4 h-4", currency === curr.code ? "text-primary" : "text-slate-400")} />
            <span className="text-xs font-bold">{curr.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
