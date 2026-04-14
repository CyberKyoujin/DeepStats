import { useState, useRef, useEffect } from "react"
import { MailCheck, RefreshCw } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import AuthLayout from "../layouts/AuthLayout"

interface OtpBoxProps {
  index: number
  value: string
  inputRef: (el: HTMLInputElement | null) => void
  onChange: (index: number, value: string) => void
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void
  filled: boolean
}

function OtpBox({ index, value, inputRef, onChange, onKeyDown, onPaste, filled }: OtpBoxProps) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={e => onChange(index, e.target.value)}
      onKeyDown={e => onKeyDown(index, e)}
      onPaste={onPaste}
      className={[
        "w-12 h-14 text-center text-2xl font-mono font-bold rounded-xl border bg-(--ds-card-inner) outline-none",
        "transition-all duration-150 caret-violet-500",
        "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/25 focus:bg-violet-500/5",
        filled ? "border-violet-500/50 text-foreground" : "border-border text-foreground",
      ].join(" ")}
      aria-label={`Digit ${index + 1}`}
    />
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const OtpVerification = () => {
  const location = useLocation()
  const email = (location.state as { email?: string })?.email ?? "your email"

  const [code, setCode] = useState<string[]>(Array(6).fill(""))
  const [resendTimer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setTimer(n => n - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...code]
    next[index] = value.slice(-1)
    setCode(next)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const next = [...code]
      next[index - 1] = ""
      setCode(next)
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const next = [...code]
    pasted.split("").forEach((char, i) => { next[i] = char })
    setCode(next)
    const focusIndex = Math.min(pasted.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleResend = () => {
    setCanResend(false)
    setTimer(60)
    setCode(Array(6).fill(""))
    inputRefs.current[0]?.focus()
    // TODO: wire up resend code API call
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = code.join("")
    if (fullCode.length < 6) return
    // TODO: wire up POST /auth/verify-otp
  }

  const isFilled = code.every(c => c !== "")

  return (
    <AuthLayout>
      
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <MailCheck className="w-6 h-6 text-violet-500" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">Check your email</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We sent a 6-digit verification code to
          <br />
          <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2.5 mb-7">
          {code.map((digit, i) => (
            <OtpBox
              key={i}
              index={i}
              value={digit}
              inputRef={el => { inputRefs.current[i] = el }}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              filled={digit !== ""}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={!isFilled}
          className="w-full h-11 bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-md shadow-violet-900/20 disabled:opacity-40"
        >
          Verify Email
        </Button>

      </form>

      <div className="flex items-center justify-center gap-2 mt-6 text-sm">

        <span className="text-muted-foreground">Didn't receive the code?</span>

        {canResend ? (

          <button
            type="button"
            onClick={handleResend}
            className="flex items-center gap-1.5 text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resend
          </button>

        ) : (

          <span className="text-muted-foreground tabular-nums">
            Resend in {resendTimer}s
          </span>

        )}

      </div>

      <div className="mt-6 pt-6 border-t border-border text-center">

        <Link
          to="/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to login
        </Link>

      </div>

    </AuthLayout>

  )
}

export default OtpVerification
