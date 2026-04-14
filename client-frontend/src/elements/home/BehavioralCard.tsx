import { Brain } from "lucide-react"

const HEATMAP: number[][] = [
  [ 0.2,  0.4,  0.3,  0.5,  0.4, -0.1,  0.0],
  [ 0.7,  0.9,  0.8,  1.0,  0.8,  0.1,  0.0],
  [ 0.8,  1.0,  0.9,  0.9,  1.0,  0.2,  0.1],
  [ 0.4,  0.5,  0.4,  0.6,  0.5,  0.0, -0.2],
  [-0.1,  0.1, -0.1,  0.2,  0.0, -0.3, -0.4],
  [-0.3, -0.2, -0.2,  0.0, -0.2, -0.5, -0.5],
]
const SESSIONS = ["London Pre", "London Open", "NY Open", "NY Close", "Asian", "Late Night"]
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function heatColor(v: number): string {
  if (v >= 0.7)  return "rgba(16,185,129,0.75)"
  if (v >= 0.4)  return "rgba(16,185,129,0.45)"
  if (v >= 0.1)  return "rgba(16,185,129,0.18)"
  if (v >= -0.1) return "rgba(255,255,255,0.04)"
  if (v >= -0.3) return "rgba(239,68,68,0.25)"
  return "rgba(239,68,68,0.5)"
}

const BehavioralCard = () => {

  return (

    <div className="relative rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-purple-500/30 transition-all duration-300 overflow-hidden shadow-sm">
      
      <div className="absolute top-0 left-0 w-40 h-40 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between">

        <div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-purple-500 uppercase mb-1">Behavioral Engine</div>
          <h3 className="text-foreground font-bold text-lg">Performance Heatmap</h3>
        </div>

        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-purple-400" />
        </div>

      </div>

      <p className="text-slate-500 text-sm leading-relaxed">
        Identify when you trade best and worst. Detect FOMO, revenge trading, and overtrading patterns automatically.
      </p>

      <div className="overflow-x-auto -mx-1">

        <div className="min-w-72.5">

          <div className="grid gap-0.5 mb-1" style={{ gridTemplateColumns: "76px repeat(7, 1fr)" }}>
            <div />
            {DAYS.map(d => <div key={d} className="text-center text-[9px] text-slate-600 font-semibold">{d}</div>)}
          </div>

          {HEATMAP.map((row, si) => (
            <div key={si} className="grid gap-0.5 mb-0.5" style={{ gridTemplateColumns: "76px repeat(7, 1fr)" }}>
              <div className="text-[9px] text-slate-600 flex items-center pr-1 truncate">{SESSIONS[si]}</div>
              {row.map((v, di) => (
                <div
                  key={di}
                  className="h-5 rounded-sm transition-opacity duration-200 hover:opacity-80 cursor-default"
                  style={{
                    backgroundColor: heatColor(v),
                    animation: `fade-up 0.35s ease-out ${(si * 7 + di) * 0.012}s both`,
                  }}
                />
              ))}
            </div>
          ))}

          <div className="flex items-center gap-1.5 mt-2 justify-end">

            <span className="text-[9px] text-slate-600">Worst</span>

            {[-0.5, -0.2, 0.1, 0.4, 0.8].map(v => (
              <div key={v} className="w-4 h-2 rounded-sm" style={{ backgroundColor: heatColor(v) }} />
            ))}

            <span className="text-[9px] text-slate-600">Best</span>

          </div>

        </div>

      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/50">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />
        BEST: London Open &amp; NY Open · Weekdays
      </div>
      
    </div>
  )
}

export default BehavioralCard