import { Cpu } from "lucide-react";
import { useMemo } from "react";


const SimulationCard = () => {

  const sr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x) }

  const paths = useMemo(() => (

    Array.from({ length: 30 }, (_, i) => {

      let y = 120; let d = `M 0 ${y}`

      for (let j = 1; j <= 30; j++) {
        const r = sr(i * 97 + j * 43)
        y = Math.max(4, Math.min(136, y + (i < 22 ? -0.7 : 0.5) + (r - 0.45) * 12))
        d += ` L ${(j / 30) * 260} ${y.toFixed(1)}`
      }

      return { d, up: y < 90 }

    })

  ), [])

  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden shadow-sm">

      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">

        <div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase mb-1">Monte Carlo</div>
          <h3 className="text-foreground font-bold text-lg">Strategy Simulation</h3>
        </div>

        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-cyan-400" />
        </div>

      </div>

      <p className="text-slate-500 text-sm leading-relaxed">
        10,000 randomized equity curve simulations. Probability of ruin, expected return distributions, and confidence intervals.
      </p>

      <div className="rounded-xl bg-[var(--ds-chart-bg)] border border-border/50 p-3 overflow-hidden">

        <svg viewBox="0 0 260 140" className="w-full h-24" preserveAspectRatio="none">
          {[35, 70, 105].map(y => <line key={y} x1="0" y1={y} x2="260" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}

          {paths.map((p, i) => <path key={i} d={p.d} fill="none" stroke={p.up ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.2)"} strokeWidth="1" />)}

          <path d="M 0 120 C 40 112 80 100 120 85 C 160 70 200 58 260 42" fill="none" stroke="rgba(34,211,238,0.85)" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>

      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { val: "74%",   label: "Prob. Profit", color: "text-emerald-400" },
          { val: "2.4%",  label: "Prob. Ruin",   color: "text-red-400"    },
          { val: "+$12K", label: "Exp. Return",  color: "text-cyan-500"   },
        ].map(s => (
          <div key={s.label} className="bg-[var(--ds-card-inner)] rounded-lg py-2">
            <div className={`font-mono font-bold text-sm ${s.color}`}>{s.val}</div>
            <div className="text-[10px] text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />
        10,000 SIMULATIONS · GO MICROSERVICE
      </div>
      
    </div>
  )
}

export default SimulationCard