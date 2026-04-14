import { Check, Cpu } from "lucide-react";
import { useMemo } from "react";



const MonteCarloSection = () => {

  const sr = (seed: number) => { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x) }

  const paths = useMemo(() => (

    Array.from({ length: 80 }, (_, i) => {
      let y = 178; let d = `M 0 ${y}`
      for (let j = 1; j <= 50; j++) {
        const r = sr(i * 137 + j * 53)
        y = Math.max(5, Math.min(193, y + (i < 60 ? -0.9 : 0.4) + (r - 0.46) * 14))
        d += ` L ${(j / 50) * 600} ${y.toFixed(1)}`
      }
      return { d, up: y < 120 }
    })
    
  ), [])

  const upCount = paths.filter(p => p.up).length

  return (
    <section className="py-24 px-4 sm:px-6 bg-(--ds-section-alt) border-y border-border">

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">

          <div>

            <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase mb-4 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              Monte Carlo Engine
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-5">
              10,000 simulations.<br />
              <span className="bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Know your true edge.
              </span>
            </h2>

            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              Our Go-powered Monte Carlo engine stress-tests your exact trade history across thousands
              of randomized sequences to reveal your real probability of ruin and expected return distribution.
            </p>

            <div className="space-y-3">
              {[
                "Probability of ruin calculation",
                "Expected return at 95% confidence",
                "Max drawdown distribution",
                "Strategy robustness scoring",
              ].map(f => (

                <div key={f} className="flex items-center gap-3 text-sm text-muted-foreground">

                  <div className="w-5 h-5 rounded-full bg-cyan-500/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-cyan-400" />
                  </div>

                  {f}

                </div>

              ))}
            </div>

          </div>

          {/* Chart */}

          <div className="rounded-2xl border border-border/50 bg-(--ds-chart-bg) p-4 sm:p-6 overflow-hidden relative">

            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/3 to-violet-500/3 pointer-events-none" />

            <div className="relative flex flex-wrap items-center justify-between gap-3 mb-5">

              <div>
                <div className="text-foreground font-semibold text-sm">Equity Curve Projections</div>
                <div className="text-slate-600 text-xs mt-0.5">80 simulations · 6-month horizon</div>
              </div>

              <div className="flex items-center gap-4 text-xs">

                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 bg-emerald-400 rounded" />
                  <span className="text-slate-500">Profitable ({upCount})</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 bg-red-400/60 rounded" />
                  <span className="text-slate-500">Drawdown ({80 - upCount})</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-4 border-t-2 border-dashed border-cyan-400" />
                  <span className="text-slate-500">Median</span>
                </div>

              </div>
            </div>

            <svg viewBox="0 0 600 200" className="w-full" style={{ height: "clamp(160px,25vw,260px)" }} preserveAspectRatio="none">

              {[50, 100, 150].map(y => <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
              {[150, 300, 450].map(x => <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}

              {paths.map((p, i) => (
                <path key={i} d={p.d} fill="none" stroke={p.up ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.16)"} strokeWidth="1" />
              ))}

              <path
                d="M 0 178 C 60 162 120 148 180 132 C 240 116 300 100 360 84 C 420 68 480 52 600 34"
                fill="none" stroke="rgba(34,211,238,0.85)" strokeWidth="2" strokeDasharray="6 3"
              />

            </svg>

            <div className="relative grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-border/50">

              {[
                { label: "Prob. of Profit", val: `${((upCount / 80) * 100).toFixed(0)}%`, color: "text-emerald-400" },
                { label: "Prob. of Ruin",   val: "2.4%",    color: "text-red-400"  },
                { label: "Expected Return", val: "+$12.4K", color: "text-cyan-400" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`font-bold font-mono text-xl ${s.color}`}>{s.val}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
      
    </section>
  )
}

export default MonteCarloSection