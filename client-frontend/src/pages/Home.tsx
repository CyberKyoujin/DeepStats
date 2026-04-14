import Navbar from "../elements/Navbar"
import Hero from "../elements/home/Hero"
import FeaturesSection from "../elements/home/FeaturesSection"
import MonteCarloSection from "../elements/home/MonteCarloSection"
import IntegrationsSection from "../elements/home/IntegrationsSection"
import InsanitySection from "../elements/home/InsanitySection"
import Footer from "../elements/Footer"


const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <MonteCarloSection />
      <IntegrationsSection />
      <InsanitySection />
      <Footer />
    </div>
  )
}

export default Home