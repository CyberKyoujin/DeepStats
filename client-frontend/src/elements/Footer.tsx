import { BarChart3, Database } from "lucide-react";


const Footer = () => {

  return (

    <footer className="border-t border-border py-10 px-4 sm:px-6">

      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">

          <div className="flex items-center gap-2.5">

            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>

            <span className="text-foreground font-bold text-sm tracking-tight">DeepStats</span>
            <span className="text-muted-foreground text-sm">· Quantitative Trading Platform</span>

          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            {["Features", "Analytics", "Pricing", "Docs", "Status"].map(l => (
              <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>
            ))}
          </div>
          
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border">

          <div className="text-muted-foreground text-xs">© 2026 DeepStats. All rights reserved.</div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Database className="w-3 h-3" />
            Powered by United Trading Sync-Engine
          </div>

        </div>

      </div>

    </footer>

  )

}

export default Footer
