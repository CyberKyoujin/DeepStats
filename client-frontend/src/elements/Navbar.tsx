import { Menu, Moon, Sun, X } from "lucide-react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { useTheme } from "../context/theme"
import logo from "../assets/logo.webp"

// TODO: replace with live data feed

const TICKER_ITEMS = [
  { symbol: "BTC/USDT",  price: "94,312.40", change: "+2.34%", up: true  },
  { symbol: "ETH/USDT",  price: "3,412.18",  change: "-1.12%", up: false },
  { symbol: "XAU/USD",  price: "182.45",    change: "+5.67%", up: true  },
  { symbol: "EUR/USD",  price: "0.6234",    change: "+0.89%", up: true  },
  { symbol: "BRENT", price: "0.1823",    change: "-0.45%", up: false },
  { symbol: "AAPL",  price: "612.30",    change: "+1.23%", up: true  },
  { symbol: "TSLA",  price: "0.4512",    change: "+3.21%", up: true  },
  { symbol: "DAX", price: "38.14",     change: "-0.78%", up: false },
  { symbol: "NQ1!", price: "14.82",     change: "+2.10%", up: true  },
  { symbol: "ES1!",  price: "87.34",     change: "+0.34%", up: true  },
]

const Navbar = () => {

  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
    
      {/* Live price ticker */}

      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm overflow-hidden h-8 flex items-center">

        <div className="shrink-0 px-3 text-[10px] font-bold text-violet-500 tracking-[0.18em] uppercase border-r border-border h-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "glow-pulse 1.5s ease-in-out infinite" }} />
          LIVE
        </div>

        <div className="flex-1 overflow-hidden">

          <div className="flex gap-10 whitespace-nowrap" style={{ animation: "ticker 40s linear infinite" }}>

            {items.map((item, i) => (

              <div key={i} className="flex items-center gap-2 text-xs shrink-0">

                <span className="text-foreground font-semibold font-mono">{item.symbol}</span>
                <span className="text-muted-foreground font-mono">{item.price}</span>
                <span className={`font-mono font-semibold ${item.up ? "text-emerald-500" : "text-red-400"}`}>
                  {item.up ? "▲" : "▼"} {item.change}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Main nav — positioned below ticker */}
      <nav className="fixed top-8 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-border bg-background/90 backdrop-blur-md">
        
        <div className="flex items-center gap-2.5">

          <img src={logo} alt="DeepStats" className="w-10 h-10 object-contain" />

          <span className="text-foreground font-bold text-base tracking-tight">DeepStats</span>
          
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features"  className="hover:text-foreground transition-colors duration-150">Features</a>
          <a href="#analytics" className="hover:text-foreground transition-colors duration-150">Analytics</a>
          <a href="#pricing"   className="hover:text-foreground transition-colors duration-150">Pricing</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          
          <button
            onClick={toggle}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-(--ds-card-inner) transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark"
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>

          <Button variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground text-sm cursor-pointer">
            Sign In
          </Button>

          <Button className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 cursor-pointer shadow-md shadow-violet-900/20">
            Get Started
          </Button>
          
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-(--ds-card-inner) transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — below ticker + nav (32 + 65 = 97px) */}
      
      {mobileOpen && (

        <div className="fixed top-24.25 left-0 right-0 z-40 bg-background/96 backdrop-blur-md border-b border-border md:hidden">
          <div className="flex flex-col px-6 py-5 gap-1">
            
            {[["#features", "Features"], ["#analytics", "Analytics"], ["#pricing", "Pricing"]].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm py-2.5 px-3 rounded-lg hover:bg-(--ds-card-inner) transition-colors"
              >
                {label}
              </a>
            ))}

            <div className="border-t border-border mt-2 pt-4">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground text-sm cursor-pointer">
                Sign In
              </Button>
            </div>

          </div>
        </div>

      )}
    </>
  )
}

export default Navbar
