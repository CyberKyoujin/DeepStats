import { ArrowLeft } from "lucide-react"
import logo from "@/assets/logo.webp"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-4">

      {/* Ambient glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-violet-700/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-cyan-500/6 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/4 blur-[100px] pointer-events-none" />

      {/* Back to home */}
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to home
      </a>

      {/* Card */}
      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img src={logo} alt="DeepStats" className="w-11 h-11 object-contain" />
          <span className="text-foreground font-bold text-xl tracking-tight">DeepStats</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          {children}
        </div>

      </div>
    </div>
  )
}

export default AuthLayout
