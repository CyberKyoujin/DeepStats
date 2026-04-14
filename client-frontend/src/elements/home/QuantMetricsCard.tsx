import { BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"

const QuantMetricsCard = () => {

  const [vals, setVals] = useState({ sharpe: 2.34, sortino: 3.12, win: 68.4, pf: 1.87, dd: 12.4, ev: 142.3 })

  const [flash, setFlash] = useState<string | null>(null)

  useEffect(() => {

    const keys = ["sharpe", "sortino", "win", "pf", "dd", "ev"] as const

    const t = setInterval(() => {
      const key = keys[Math.floor(Math.random() * keys.length)]
      setFlash(key)
      setVals(p => ({ ...p, [key]: parseFloat((p[key] + (Math.random() - 0.5) * 0.04).toFixed(2)) }))
      setTimeout(() => setFlash(null), 300)
    }, 1800)

    return () => clearInterval(t)

  }, [])

  const rows = [
    { key: "sharpe",  label: "Sharpe Ratio",   value: vals.sharpe.toFixed(2),    pos: true  },
    { key: "sortino", label: "Sortino Ratio",   value: vals.sortino.toFixed(2),   pos: true  },
    { key: "win",     label: "Win Rate",        value: `${vals.win.toFixed(1)}%`, pos: true  },
    { key: "pf",      label: "Profit Factor",   value: vals.pf.toFixed(2),        pos: true  },
    { key: "dd",      label: "Max Drawdown",    value: `${vals.dd.toFixed(1)}%`,  pos: false },
    { key: "ev",      label: "Expected Value",  value: `$${vals.ev.toFixed(0)}`,  pos: true  },
  ]

  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-violet-500/30 transition-all duration-300 overflow-hidden shadow-sm">

      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/6 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">

        <div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-violet-500 uppercase mb-1">Quant Engine</div>
          <h3 className="text-foreground font-bold text-lg">Live Metrics</h3>
        </div>

        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-violet-400" />
        </div>

      </div>

      <p className="text-slate-500 text-sm leading-relaxed">
        Sharpe, Sortino, Profit Factor and 20+ institutional-grade statistics. Recalculated live as trades sync.
      </p>

      <div className="grid grid-cols-2 gap-2">

        {rows.map(r => (
          <div
            key={r.key}
            className={`flex items-center justify-between bg-[var(--ds-card-inner)] rounded-lg px-3 py-2 border border-transparent transition-all duration-200 ${flash === r.key ? "border-violet-500/40 bg-violet-500/8" : ""}`}
          >
            <span className="text-muted-foreground text-xs">{r.label}</span>
            <span className={`font-mono font-bold text-sm transition-colors duration-200 ${flash === r.key ? "text-violet-500" : r.pos ? "text-foreground" : "text-red-400"}`}>
              {r.value}
            </span>
          </div>
        ))}

      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />
        RECALCULATING · REAL-TIME
      </div>
      
    </div>
  )
}

export default QuantMetricsCard