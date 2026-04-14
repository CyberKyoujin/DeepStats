import { Lock } from "lucide-react"


const EXCHANGES = [
  { name: "Bybit",   letter: "BY", color: "#F7A600", desc: "API sync · Full history",  active: true  },
  { name: "MT5",     letter: "M5", color: "#3B82F6", desc: "HTML report upload",         active: true  },
  { name: "Binance", letter: "BI", color: "#F0B90B", desc: "Coming soon",               active: false },
  { name: "OKX",     letter: "OK", color: "#ffffff", desc: "Coming soon",               active: false },
]

const IntegrationsSection = () => {

  return (

    <section id="analytics" className="py-24 px-4 sm:px-6">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14">

          <div className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">Integrations</div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            All your trades. One place.
          </h2>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Connect Bybit via encrypted API keys or upload MetaTrader 5 HTML reports.
            Your full trade history, unified in seconds.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {EXCHANGES.map(ex => (

            <div
              key={ex.name}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-4 hover:border-border/80 hover:bg-accent/50 transition-all duration-300 shadow-sm"
            >
              <div
                className="w-14 h-14 rounded-2xl border border-border bg-(--ds-card-inner) flex items-center justify-center font-bold text-base"
                style={{ color: ex.color }}
              >
                {ex.letter}
              </div>

              <div className="text-center">
                <div className="text-foreground font-semibold mb-1">{ex.name}</div>
                <div className="text-slate-500 text-xs">{ex.desc}</div>
              </div>

              {ex.active ? (

                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active
                </div>

              ) : (

                <div className="text-[10px] text-muted-foreground border border-border rounded-full px-2.5 py-0.5">Coming Soon</div>

              )}

            </div>

          ))}
        </div>

        <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
          <Lock className="w-4 h-4 text-slate-600 shrink-0" />
          API keys encrypted with Fernet AES-128 at rest. Read-only permissions required.
        </div>

      </div>

    </section>
  )
}

export default IntegrationsSection