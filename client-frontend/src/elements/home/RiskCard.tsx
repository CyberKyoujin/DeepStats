import { Shield } from "lucide-react"
import { useEffect, useState } from "react"

function RiskCard() {

  const [exposure, setExposure] = useState(34.2)
  const circumference = 2 * Math.PI * 28

  useEffect(() => {

    const t = setInterval(() => {
      setExposure(p => Math.max(28, Math.min(40, p + (Math.random() - 0.5) * 0.4)))
    }, 2500)

    return () => clearInterval(t)
    
  }, [])

  return (

    <div className="relative rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden shadow-sm">
      
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">

        <div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-indigo-500 uppercase mb-1">Risk Engine</div>
          <h3 className="text-foreground font-bold text-lg">Risk Management</h3>
        </div>

        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-indigo-400" />
        </div>

      </div>

      <p className="text-slate-500 text-sm leading-relaxed">
        Position sizing, drawdown tracking, and portfolio exposure analysis. Daily loss limits with real-time breach alerts.
      </p>

      <div className="flex items-center gap-6">
        
        <div className="relative shrink-0">

          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="28" fill="none" strokeWidth="6" style={{ stroke: "var(--ds-gauge-track)" }} />

            <circle
              cx="40" cy="40" r="28" fill="none"
              stroke="#818cf8" strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - exposure / 100)}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              style={{ transition: "stroke-dashoffset 0.9s ease-out" }}
            />

            <text x="40" y="44" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="monospace" style={{ fill: "var(--foreground)" }}>
              {exposure.toFixed(0)}%
            </text>

          </svg>

          <div className="text-[9px] text-slate-600 text-center mt-0.5">Exposure</div>

        </div>

        <div className="flex-1 space-y-2.5">

          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Max Drawdown</span>
            <span className="text-red-400 font-mono font-bold">12.4%</span>
          </div>

          {[
            { label: "Daily Loss Limit", used: 42, color: "bg-violet-500" },
            { label: "Symbol Exposure",  used: 68, color: "bg-cyan-500"   },
            { label: "Correlation Risk", used: 23, color: "bg-indigo-400" },
          ].map(r => (
            <div key={r.label}>

              <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
                <span>{r.label}</span>
                <span>{r.used}%</span>
              </div>

              <div className="h-1 bg-(--ds-gauge-track) rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.used}%`, transition: "width 0.7s ease-out" }} />
              </div>
              
            </div>
          ))}

        </div>

      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />
        NO LIMIT BREACHES DETECTED
      </div>

    </div>
  )
}

export default RiskCard