import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import AuthLayout from "../layouts/AuthLayout"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden>
      <path
        fill="#229ED9"
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      />
    </svg>
  )
}

function getStrength(password: string): number {
  let score = 0
  if (password.length >= 8)          score++
  if (/[A-Z]/.test(password))        score++
  if (/[0-9]/.test(password))        score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"]

const STRENGTH_COLORS = [
  "",
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-emerald-500",
]
const STRENGTH_TEXT = [
  "",
  "text-red-500",
  "text-orange-400",
  "text-yellow-500",
  "text-emerald-500",
]

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const strength = getStrength(password)
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? STRENGTH_COLORS[strength] : "bg-(--ds-gauge-track)"}`}
          />
        ))}
      </div>
      <span className={`text-[11px] font-medium w-10 ${STRENGTH_TEXT[strength]}`}>
        {STRENGTH_LABELS[strength]}
      </span>
    </div>
  )
}

const Signup = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire up POST /auth/signup → redirect to /verify with email
  }

  return (
    <AuthLayout>

      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1.5">Create account</h1>
        <p className="text-sm text-muted-foreground">Join 2,400+ traders tracking their edge</p>
      </div>

      <div className="flex flex-col gap-3 mb-6">

        <Button
          type="button"
          variant="outline"
          className="h-11 gap-3 text-sm font-medium"
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 gap-3 text-sm font-medium"
          // TODO: implement Telegram OAuth
        >
          <TelegramIcon />
          Continue with Telegram
        </Button>

      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="flex flex-col gap-1.5">

          <label htmlFor="username" className="text-sm font-medium text-foreground">
            Username
          </label>

          <Input
            id="username"
            type="text"
            placeholder="trader_pro"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

        </div>

        <div className="flex flex-col gap-1.5">

          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

        </div>

        <div className="flex flex-col gap-1.5">

          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              className="pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

          </div>

          <PasswordStrength password={password} />

        </div>

        <Button type="submit" className="h-11 mt-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-md shadow-violet-900/20">
          Create Account
        </Button>

      </form>

      <p className="text-[11px] text-center text-muted-foreground mt-5 leading-relaxed">
        By signing up you agree to our{" "}
        <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">Terms of Service</a>
        {" "}and{" "}
        <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</a>.
      </p>

      <p className="text-sm text-center text-muted-foreground mt-4">
        Already have an account?{" "}

        <Link
          to="/login"
          className="text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors"
        >
          Sign in
        </Link>

      </p>
    </AuthLayout>
  )
}

export default Signup
