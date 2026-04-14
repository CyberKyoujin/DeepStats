
const InsanitySection = () => {
    
  return (
    <section className="relative min-h-200 flex flex-col items-center justify-center gap-9 px-6 overflow-hidden bg-(--ds-section-alt) border-y border-border">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_68%)]" />

      <svg
        viewBox="0 0 200 148"
        className="w-80 h-auto"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="DeepStats logo — infinity pierced by an upward arrow"
      >
        <defs>

          {/* Red glow for infinity loops */}
          <filter id="glow-red" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Purple glow for arrow */}
          <filter id="glow-purple" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

        </defs>

        <path
          d="M 100,84 C 114,48 168,48 168,84 C 168,120 114,120 100,84 C 86,48 32,48 32,84 C 32,120 86,120 100,84"
          fill="none"
          stroke="#ff4d6d"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-red)"
          pathLength="100"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: "draw-infinity 2s ease-in-out forwards",
          }}
        />

        {/* Arrow rendered on top of infinity, piercing through center */}
        <g filter="url(#glow-purple)" style={{ animation: "arrow-pulse-glow 2.5s ease-in-out 3s infinite" }}>

          {/* Shaft upward from center */}
          <path
            d="M 100,84 L 100,14"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2.8"
            strokeLinecap="round"
            pathLength="70"
            style={{
              strokeDasharray: 70,
              strokeDashoffset: 70,
              animation: "arrow-shaft-up 0.8s ease-out 2s forwards",
            }}
          />

          {/* Tail downward from center */}
          <path
            d="M 100,84 L 100,140"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2.8"
            strokeLinecap="round"
            pathLength="34"
            style={{
              strokeDasharray: 34,
              strokeDashoffset: 34,
              animation: "arrow-tail-down 0.4s ease-out 2s forwards",
            }}
          />

          {/* Arrowhead */}
          <path
            d="M 91,32 L 100,14 L 109,32"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: 0,
              animation: "arrowhead-in 0.3s ease-out 2.75s forwards",
            }}
          />

        </g>
      </svg>

      <div className="text-center max-w-150">

        <blockquote className="font-serif text-[clamp(18px,2.8vw,26px)] text-foreground italic leading-relaxed mb-4">
          "Insanity is doing the same thing over and over again
          and expecting different results."
        </blockquote>

        <p className="text-sm text-muted-foreground">
          Often attributed to{" "}
          <strong className="text-foreground">Albert Einstein</strong>
        </p>

      </div>

      <p className="text-center max-w-150 leading-relaxed text-base text-muted-foreground">
        Trading without a journal is the definition of insanity. If you
        don't track your data, you are destined to repeat the same
        mistakes.{" "}
        <span className="text-violet-500">Break the cycle today.</span>
      </p>

      <button className="bg-violet-600 mb-5 rounded-[25px] px-8 py-3 text-base font-bold text-white cursor-pointer border-none shadow-[0_0_8px_rgba(155,89,182,0.2)] hover:scale-105 hover:shadow-[0_0_24px_rgba(155,89,182,0.75),0_0_48px_rgba(155,89,182,0.3)] transition-all duration-200">
        Go to Dashboard →
      </button>

    </section>
  )
}

export default InsanitySection