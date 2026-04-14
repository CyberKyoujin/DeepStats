import { useState, useEffect } from "react"
import { Activity, ArrowRight, Check } from "lucide-react"
import { Button } from "../../components/ui/button"

// ─── Static data ──────────────────────────────────────────────────────────────

const LIVE_TRADES = [
  { pair: "BTC/USDT",  dir: "LONG"  as const, pnl: "+$1,247.32", time: "2m ago",  pos: true  },
  { pair: "XAU/USD",  dir: "SHORT" as const, pnl: "-$89.45",    time: "15m ago", pos: false },
  { pair: "EUR/USD",  dir: "LONG"  as const, pnl: "+$432.18",   time: "1h ago",  pos: true  },
  { pair: "NQ1!", dir: "SHORT" as const, pnl: "+$78.22",    time: "2h ago",  pos: true  },
  { pair: "DAX",  dir: "LONG"  as const, pnl: "+$156.00",   time: "3h ago",  pos: true  },
]

// Pre-computed equity curve (SVG viewBox 0 0 600 200)
const EQUITY_PATH =
  "M 0 178 C 25 172 45 175 70 163 C 95 151 115 158 145 143 " +
  "C 170 128 188 135 218 120 C 245 105 262 112 292 97 " +
  "C 318 82 335 88 365 72 C 392 56 408 63 438 48 " +
  "C 462 33 480 40 510 26 C 535 12 555 18 580 10 L 600 8"

const EQUITY_AREA = EQUITY_PATH + " L 600 200 L 0 200 Z"

// ─── Dashboard preview ────────────────────────────────────────────────────────

function DashboardPreview() {
  const [trades, setTrades]   = useState(LIVE_TRADES.slice(0, 3))
  const [flashIdx, setFlashIdx] = useState<number | null>(null)

  // Rotate newest trade to top every 3.5s
  useEffect(() => {
    const t = setInterval(() => {
      setTrades(prev => {
        const next = LIVE_TRADES[(LIVE_TRADES.indexOf(prev[0]) + 1) % LIVE_TRADES.length]
        return [next, prev[0], prev[1]]
      })
    }, 3500)
    return () => clearInterval(t)
  }, [])

  // Flash a random metric every 2s to simulate live recalculation
  useEffect(() => {
    const t = setInterval(() => {
      setFlashIdx(Math.floor(Math.random() * 4))
      setTimeout(() => setFlashIdx(null), 320)
    }, 2200)
    return () => clearInterval(t)
  }, [])

  const metrics = [
    { label: "Sharpe",   value: "2.34"  },
    { label: "Sortino",  value: "3.12"  },
    { label: "Win%",     value: "68.4%" },
    { label: "P.Factor", value: "1.87"  },
  ]

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0b0c15] overflow-hidden shadow-2xl shadow-violet-950/60">

      {/* macOS-style title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.07] bg-white/2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-[11px] text-slate-600 font-mono ml-2">deepstats.io — Portfolio Dashboard</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />
          SYNCING
        </div>
      </div>

      {/* Portfolio header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <div className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Bybit Portfolio · Total Equity</div>
          <div className="text-white font-bold text-2xl font-mono mt-0.5">$48,234.12</div>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 font-bold text-lg font-mono">▲ +18.4%</div>
          <div className="text-[10px] text-slate-600 font-mono">30-day return</div>
        </div>
      </div>

      {/* Animated equity curve */}
      <div className="px-3 pb-1">
        <svg viewBox="0 0 600 200" className="w-full h-32" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="heroLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {[50, 100, 150].map(y => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
          <path d={EQUITY_AREA} fill="url(#heroAreaGrad)" />
          <path
            d={EQUITY_PATH}
            fill="none"
            stroke="url(#heroLineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animation: "draw-path 2.8s ease-out 0.3s forwards" }}
          />
          {/* Endpoint glow dot */}
          <circle cx="600" cy="8" r="4"  fill="#22d3ee" opacity="0.9" />
          <circle cx="600" cy="8" r="9"  fill="#22d3ee" opacity="0.18" />
          <circle cx="600" cy="8" r="14" fill="#22d3ee" opacity="0.06" />
        </svg>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 border-t border-b border-white/6 mx-4 mb-3">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={[
              "text-center py-2.5 transition-colors duration-200",
              i < 3 ? "border-r border-white/6" : "",
              flashIdx === i ? "bg-violet-500/10" : "",
            ].join(" ")}
          >
            <div className={`font-mono font-bold text-sm transition-colors duration-200 ${flashIdx === i ? "text-violet-300" : "text-white"}`}>
              {m.value}
            </div>
            <div className="text-[10px] text-slate-600 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Live trade feed */}
      <div className="px-4 pb-4 space-y-1.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Recent Trades</span>
          <span className="text-[10px] text-violet-400 font-semibold cursor-pointer hover:text-violet-300">VIEW ALL →</span>
        </div>
        {trades.map((t, i) => (
          <div
            key={`${t.pair}-${i}`}
            className={`flex items-center justify-between text-xs py-2 px-3 rounded-lg transition-all duration-500 ${i === 0 ? "bg-white/4 border border-white/[0.07]" : "opacity-55"}`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-0.5 h-5 rounded-full shrink-0 ${t.pos ? "bg-emerald-500" : "bg-red-500"}`} />
              <span className="text-white font-mono font-medium">{t.pair}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${t.dir === "LONG" ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
                {t.dir}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono font-bold ${t.pos ? "text-emerald-400" : "text-red-400"}`}>{t.pnl}</span>
              <span className="text-slate-600 font-mono text-[10px]">{t.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

const Hero = () => {
  return (
    // pt-32 = 8px ticker + 65px nav + comfortable breathing room
    <section className="relative pt-36 pb-20 px-4 sm:px-6 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-20 left-1/4 w-150 h-150 rounded-full bg-violet-700/8 blur-[130px] pointer-events-none" />
      <div className="absolute top-40 right-0   w-100 h-100 rounded-full bg-cyan-500/6  blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0  w-75 h-75 rounded-full bg-indigo-600/5 blur-[80px]  pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-20 items-center">

          {/* Left — headline + CTAs */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/8 text-violet-300 text-xs font-semibold tracking-wide mb-8">
              <Activity className="w-3 h-3" />
              Quantitative Trading Journal · v2.0
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.06] mb-6">
              <span className="text-foreground">Trading is Math.</span>
              <br />
              <span className="bg-linear-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                Stop Gambling.
              </span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
              Import all your trades from Bybit and MetaTrader 5. Get Sharpe Ratios,
              Monte Carlo simulations, behavioral analysis, and 20+ institutional-grade
              quant metrics — built for serious retail traders.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-500 text-white h-12 px-8 text-sm gap-2 cursor-pointer shadow-lg shadow-violet-900/40">
                Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-(--ds-card-inner) h-12 px-8 text-sm cursor-pointer">
                View Live Demo
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              {["2,400+ active traders", "1.2M+ trades analyzed", "+18% avg win rate lift"].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Right — animated terminal preview */}
          <div className="relative">
            <div className="absolute -inset-6 bg-violet-600/8 rounded-3xl blur-3xl pointer-events-none" />
            <div className="relative" style={{ animation: "fade-up 0.9s ease-out 0.1s both" }}>
              <DashboardPreview />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
