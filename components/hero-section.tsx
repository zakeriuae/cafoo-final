"use client"

// ── Counter Component ───────────────────────────────────────────────────────
function Counter({ end, duration = 2000, suffix = "+" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setHasStarted(true) },
      { threshold: 0.1 }
    )
    if (elementRef.current) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      // Ease-out function (Power 4)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [hasStarted, end, duration])

  return (
    <span ref={elementRef}>
      {new Intl.NumberFormat().format(count)}{suffix}
    </span>
  )
}


import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, MapPin, ChevronDown, BedDouble, Ruler, Calendar, SlidersHorizontal, Home, Briefcase, DollarSign, Euro, IndianRupee, Coins } from "lucide-react"
import { AedSymbol } from "@/components/ui/aed-symbol"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useI18n, useContent } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useCurrency } from "@/hooks/use-currency"

type Intent   = "buy" | "rent"
type BuyStage = "all" | "ready" | "off-plan"
type Category = "residential" | "commercial"

/* ─── Simple select filter ─────────────────────────────────────── */
function FilterDropdown({
  label, icon: Icon, value, onChange, options, className,
}: {
  label?: string; icon?: React.ElementType; value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  className?: string
}) {
  return (
    <div className={cn("relative group", className)}>
      {Icon && <Icon className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />}
      <select value={value} onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full h-10 rounded-2xl border border-slate-200 bg-white/90 text-[13px] font-semibold text-slate-700",
          "appearance-none cursor-pointer outline-none transition-all",
          "hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/15",
          Icon ? "ps-9 pe-7" : "ps-4 pe-7"
        )}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute end-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
    </div>
  )
}

/* ─── Range Dropdown (Min / Max panel) ─────────────────────────── */
function RangeDropdown({
  label, icon: Icon, min, max, onMinChange, onMaxChange,
  onReset, onDone, className, fa, unit,
}: {
  label: string; icon?: React.ElementType
  min: string; max: string
  onMinChange: (v: string) => void
  onMaxChange: (v: string) => void
  onReset: () => void; onDone: () => void
  className?: string; fa?: boolean; unit?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  /* close on outside click — use pointerdown so it fires before click */
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", handler)
    return () => document.removeEventListener("pointerdown", handler)
  }, [])

  const displayLabel = (min || max)
    ? `${min || "0"} – ${max || (fa ? "هر مقدار" : "Any")}`
    : label

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-2 h-10 px-3.5 rounded-2xl border bg-white/90 text-[13px] font-semibold text-slate-700 w-full",
          "transition-all outline-none hover:border-primary/50",
          open ? "border-primary ring-2 ring-primary/15" : "border-slate-200"
        )}
      >
        {Icon && <Icon className="h-4 w-4 text-slate-400 shrink-0" />}
        <span className="flex-1 text-start truncate">{displayLabel}</span>
        <ChevronDown className={cn("h-3 w-3 text-slate-400 transition-transform shrink-0", open && "rotate-180")} />
      </button>

      {/* Panel — stop propagation so pointerdown inside panel doesn't close it */}
      {open && (
        <div
          onPointerDown={e => e.stopPropagation()}
          className="absolute top-[calc(100%+8px)] start-0 z-[9999] w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4"
        >
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            {unit ? `${label} (${unit})` : label}
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                {fa ? "حداقل" : "Minimum"}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={min}
                onChange={e => onMinChange(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                {fa ? "حداکثر" : "Maximum"}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={max}
                onChange={e => onMaxChange(e.target.value)}
                placeholder={fa ? "هر مقدار" : "Any"}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { onReset(); setOpen(false); }}
              className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              {fa ? "پاک کردن" : "Reset"}
            </button>
            <button
              onClick={() => { onDone(); setOpen(false) }}
              className="flex-1 h-10 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/25"
            >
              {fa ? "تایید" : "Done"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Separator ────────────────────────────────────────────────── */
function Sep() { return <div className="hidden lg:block w-px h-5 bg-slate-200 shrink-0" /> }

/* ══════════════════════════ MAIN ════════════════════════════════ */
export function HeroSection() {
  const [visible, setVisible] = useState(false)
  const { locale } = useI18n()
  const content = useContent()
  const { currency } = useCurrency()
  const fa = locale === "fa"

  const router = useRouter()

  const [intent, setIntent]     = useState<Intent>("buy")
  const [buyStage, setBuyStage] = useState<BuyStage>("all")
  const [category, setCategory] = useState<Category>("residential")
  const [location, setLocation] = useState("")
  const [freq, setFreq]         = useState("yearly")
  const [propType, setPropType] = useState("any")
  const [beds, setBeds]         = useState("any")
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [areaMin, setAreaMin]   = useState("")
  const [areaMax, setAreaMax]   = useState("")
  const [handover, setHandover] = useState("any")
  const [payment, setPayment]   = useState(50)

  useEffect(() => { setVisible(true) }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()

    // listing type
    if (intent === "buy") params.set("listing", buyStage === "off-plan" ? "off_plan" : "sale")
    else params.set("listing", "rent")

    // property type
    if (propType && propType !== "any") params.set("type", propType)

    // bedrooms
    if (beds && beds !== "any") params.set("bedrooms", beds)

    // location text (area name search)
    if (location.trim()) params.set("area", location.trim())

    // price range
    if (priceMin) params.set("priceMin", priceMin)
    if (priceMax) params.set("priceMax", priceMax)

    // area sqft
    if (areaMin) params.set("areaMin", areaMin)
    if (areaMax) params.set("areaMax", areaMax)

    // rental frequency
    if (intent === "rent" && freq !== "yearly") params.set("freq", freq)

    // off-plan handover
    if (buyStage === "off-plan" && handover !== "any") params.set("handover", handover)

    router.push(`/${locale}/properties?${params.toString()}`)
  }

  /* options */
  const resTypes = [
    { value:"any",       label: fa?"همه انواع":"All Types"   },
    { value:"apartment", label: fa?"آپارتمان":"Apartment"    },
    { value:"villa",     label: fa?"ویلا":"Villa"            },
    { value:"townhouse", label: fa?"تاون‌هاوس":"Townhouse"  },
    { value:"penthouse", label: fa?"پنت‌هاوس":"Penthouse"   },
    { value:"studio",    label: fa?"استودیو":"Studio"        },
  ]
  const comTypes = [
    { value:"any",       label: fa?"همه انواع":"All Types"   },
    { value:"office",    label: fa?"دفتر کار":"Office"       },
    { value:"shop",      label: fa?"مغازه":"Shop"           },
    { value:"warehouse", label: fa?"انبار":"Warehouse"       },
    { value:"factory",   label: fa?"کارخانه":"Factory"       },
    { value:"land",      label: fa?"زمین تجاری":"Comm. Land" },
  ]
  const bedsOpts = [
    { value:"any",    label: fa?"هر تعداد":"Any Beds" },
    { value:"studio", label: fa?"استودیو":"Studio"    },
    { value:"1",      label: fa?"۱ خوابه":"1 Bed"    },
    { value:"2",      label: fa?"۲ خوابه":"2 Beds"   },
    { value:"3",      label: fa?"۳ خوابه":"3 Beds"   },
    { value:"4",      label: fa?"۴+ خوابه":"4+ Beds" },
  ]
  const handoverOpts = [
    { value:"any",  label: fa?"هر زمانی":"Any Year" },
    { value:"2025", label:"2025" },
    { value:"2026", label:"2026" },
    { value:"2027", label:"2027" },
    { value:"2028", label:"2028+" },
  ]
  const freqOpts = [
    { value:"yearly",  label: fa?"سالانه":"Yearly"  },
    { value:"monthly", label: fa?"ماهانه":"Monthly" },
    { value:"weekly",  label: fa?"هفتگی":"Weekly"   },
    { value:"daily",   label: fa?"روزانه":"Daily"   },
  ]

  const isOffPlan    = intent === "buy" && buyStage === "off-plan"
  const isCommercial = category === "commercial"
  const showBeds     = !isCommercial && !isOffPlan
  const showArea     = isCommercial
  const showPrice    = !isOffPlan
  const showHandover = isOffPlan

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-slate-950 pt-16">

      {/* BG */}
      <div className="absolute inset-0">
        <Image src="/images/herophoto.jpg" alt="Dubai" fill className="object-cover" priority unoptimized />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[960px] mx-auto px-4 py-20">

        {/* Heading */}
        <div className={cn("text-center mb-10 transition-all duration-700 delay-100", visible?"opacity-100 translate-y-0":"opacity-0 translate-y-6")}>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.03] tracking-tight mb-4" style={{textShadow:"0 4px 32px rgba(0,0,0,0.5)"}}>
            {fa ? <>خانه رویایی<br /><span className="text-primary">شما در دبی</span></>
                : <>Find Your<br /><span className="text-primary">Dream Home</span></>}
          </h1>
          <p className="text-lg text-white/65 font-medium max-w-2xl mx-auto leading-relaxed">
            {fa ? "جستجوی هوشمند در هزاران ملک آماده و پیش‌فروش"
                : "Smart search across thousands of ready & off-plan properties"}
          </p>
        </div>

        {/* ══ SEARCH BOX ══ */}
        <div className={cn("relative z-[100] transition-all duration-700 delay-200", visible?"opacity-100 translate-y-0":"opacity-0 translate-y-10")}>
          <div className="bg-white rounded-[1.75rem] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-visible ring-1 ring-white/50">

            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row rounded-t-[1.75rem] overflow-hidden">

              {/* Intent tabs */}
              <div className="flex border-b sm:border-b-0 sm:border-e border-slate-100">
                {(["buy","rent"] as const).map(t => (
                  <button key={t} onClick={() => setIntent(t)}
                    className={cn(
                      "flex-1 sm:flex-none flex items-center justify-center px-7 py-5 transition-all duration-200 border-b-[3px]",
                      intent === t ? "text-primary border-primary bg-primary/[0.04]" : "text-slate-500 border-transparent hover:bg-slate-50/80"
                    )}>
                    <span className="text-sm font-black tracking-wide">
                      {t === "buy" ? (fa?"خرید":"Buy") : (fa?"اجاره":"Rent")}
                    </span>
                  </button>
                ))}
              </div>

              {/* Location */}
              <div className="flex-1 flex items-center gap-3 px-5 border-b sm:border-b-0 sm:border-e border-slate-100 min-h-[64px]">
                <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-primary/10 shrink-0">
                  <MapPin className="h-5 w-5 text-primary" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{fa?"مکان":"Location"}</p>
                  <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder={fa?"منطقه، برج یا پروژه...": "Area, tower or project..."}
                  className="w-full text-[14px] font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400 placeholder:font-normal" />
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center px-3 py-3">
                <Button
                  onClick={handleSearch}
                  className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white text-sm font-black rounded-2xl shadow-lg shadow-primary/30 gap-2.5 transition-all active:scale-95">
                  <Search className="h-4 w-4" strokeWidth={3} />
                  {fa?"جستجو":"Search"}
                </Button>
              </div>
            </div>

            {/* Row 2: Filters */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 px-4 py-3 bg-slate-50/70 border-t border-slate-100 rounded-b-[1.75rem]">

              {/* Buy stages */}
              {intent === "buy" && (
                <>
                  <div className="flex bg-white rounded-2xl px-1 py-1 border border-slate-200 shadow-sm shrink-0">
                    {(["all","ready","off-plan"] as const).map(s => (
                      <button key={s} onClick={() => setBuyStage(s)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                          buyStage === s ? "bg-primary text-white shadow-sm shadow-primary/40" : "text-slate-500 hover:text-slate-700"
                        )}>
                        {s==="all"?(fa?"همه":"All"):s==="ready"?(fa?"آماده":"Ready"):(fa?"پیش‌فروش":"Off-Plan")}
                      </button>
                    ))}
                  </div>
                  <Sep />
                </>
              )}

              {/* Rent freq */}
              {intent === "rent" && (
                <>
                  <FilterDropdown value={freq} onChange={setFreq} options={freqOpts} className="w-[120px]" />
                  <Sep />
                </>
              )}

              {/* Category toggle */}
              <div className="flex bg-white rounded-2xl px-1 py-1 border border-slate-200 shadow-sm shrink-0">
                {([
                  { v:"residential", label:fa?"مسکونی":"Residential", Icon:Home      },
                  { v:"commercial",  label:fa?"تجاری":"Commercial",   Icon:Briefcase },
                ] as const).map(c => (
                  <button key={c.v} onClick={() => { setCategory(c.v); setPropType("any") }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                      category===c.v ? "bg-primary text-white shadow-sm shadow-primary/40" : "text-slate-500 hover:text-slate-700"
                    )}>
                    <c.Icon className="h-3 w-3" />
                    {c.label}
                  </button>
                ))}
              </div>

              <Sep />

              {/* Property type */}
              <FilterDropdown value={propType} onChange={setPropType}
                options={isCommercial ? comTypes : resTypes} className="w-[145px]" />

              {/* Beds */}
              {showBeds && (
                <>
                  <Sep />
                  <FilterDropdown icon={BedDouble} value={beds} onChange={setBeds} options={bedsOpts} className="w-[140px]" />
                </>
              )}

              {/* Area range (Commercial) */}
              {showArea && (
                <>
                  <Sep />
                  <RangeDropdown
                    label={fa?"متراژ":"Area"} icon={Ruler}
                    unit="sqft" fa={fa}
                    min={areaMin} max={areaMax}
                    onMinChange={setAreaMin} onMaxChange={setAreaMax}
                    onReset={() => { setAreaMin(""); setAreaMax("") }}
                    onDone={() => {}}
                    className="w-[150px]"
                  />
                </>
              )}

              {/* Price range */}
              {showPrice && (
                <>
                  <Sep />
                  <RangeDropdown
                    label={fa ? `قیمت (${currency})` : `Price (${currency})`} 
                    icon={currency === 'AED' ? AedSymbol : (currency === 'USD' ? DollarSign : (currency === 'EUR' ? Euro : (currency === 'INR' ? IndianRupee : Coins)))}
                    unit={currency} fa={fa}
                    min={priceMin} max={priceMax}
                    onMinChange={setPriceMin} onMaxChange={setPriceMax}
                    onReset={() => { setPriceMin(""); setPriceMax("") }}
                    onDone={() => {}}
                    className="w-[155px]"
                  />
                </>
              )}

              {/* Off-Plan filters */}
              {showHandover && (
                <>
                  <Sep />
                  <FilterDropdown icon={Calendar} value={handover} onChange={setHandover} options={handoverOpts} className="w-[150px]" />
                  <Sep />
                  <div className="flex items-center gap-3 w-[195px] shrink-0 bg-white rounded-2xl border border-slate-200 px-3.5 h-10 shadow-sm">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{fa?"پیش‌پرداخت":"Pre-handover"}</span>
                        <span className="text-[8px] font-black text-primary">{payment}%</span>
                      </div>
                      <input type="range" min={0} max={100} step={5} value={payment} onChange={e => setPayment(+e.target.value)}
                        className="w-full h-1 rounded-full accent-primary cursor-pointer" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section with Counters */}
        <div className={cn(
          "flex flex-wrap items-center justify-center gap-x-12 gap-y-8 mt-16 transition-all duration-700 delay-300", 
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="text-center group cursor-default">
            <p className="text-[2.75rem] font-black text-white tracking-tight leading-none mb-2 drop-shadow-lg group-hover:text-primary transition-colors duration-300" dir="ltr">
              <Counter end={560} />
            </p>
            <div className="h-[2px] w-8 bg-primary mx-auto mb-2 rounded-full opacity-70 group-hover:w-12 group-hover:opacity-100 transition-all duration-300" />
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-[0.22em]">
              {content.hero.stats.properties}
            </p>
          </div>

          <div className="text-center group cursor-default">
            <p className="text-[2.75rem] font-black text-white tracking-tight leading-none mb-2 drop-shadow-lg group-hover:text-primary transition-colors duration-300" dir="ltr">
              <Counter end={1280} />
            </p>
            <div className="h-[2px] w-8 bg-primary mx-auto mb-2 rounded-full opacity-70 group-hover:w-12 group-hover:opacity-100 transition-all duration-300" />
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-[0.22em]">
              {content.hero.stats.clients}
            </p>
          </div>

          <div className="text-center group cursor-default">
            <p className="text-[2.75rem] font-black text-white tracking-tight leading-none mb-2 drop-shadow-lg group-hover:text-primary transition-colors duration-300" dir="ltr">
              <Counter end={12} />
            </p>
            <div className="h-[2px] w-8 bg-primary mx-auto mb-2 rounded-full opacity-70 group-hover:w-12 group-hover:opacity-100 transition-all duration-300" />
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-[0.22em]">
              {content.hero.stats.years}
            </p>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-10 hidden md:flex flex-col items-center gap-2 z-10">
        <div className="h-10 w-px bg-gradient-to-b from-primary/70 to-transparent" />
        <span className="text-[9px] text-white/40 uppercase font-bold tracking-[0.4em]">Scroll</span>
      </div>
    </section>
  )
}
