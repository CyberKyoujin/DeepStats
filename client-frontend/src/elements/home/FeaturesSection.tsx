import BehavioralCard from "./BehavioralCard";
import QuantMetricsCard from "./QuantMetricsCard";
import RiskCard from "./RiskCard";
import SimulationCard from "./SimulationCard";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-violet-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">Platform Features</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
            Every edge. Quantified.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Replace intuition with data. Every feature is designed to give you a measurable, actionable edge over your past self.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <QuantMetricsCard />
          <SimulationCard />
          <BehavioralCard />
          <RiskCard />
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection