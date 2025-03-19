import Header from './components/Header';
import Footer from './components/Footer';
import GardenBedSelector from './components/GardenBedSelector';
import { CalculatorIcon, RulerIcon, SaveIcon } from './components/Icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="container flex flex-col items-center py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 px-4 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gradient-fun">
              Garden Soil Calculator
            </h1>
            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto animate-slide-up">
              Quickly calculate the exact amount of soil you need for your garden beds
              with our easy-to-use calculator.
            </p>
          </div>
          
          {/* Calculator */}
          <div className="w-full">
            <GardenBedSelector />
          </div>
          
          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl px-4">
            <div className="glass-panel-fun hover-card p-6 flex flex-col items-center text-center" style={{animationDelay: "0.1s"}}>
              <div className="text-[var(--color-primary)] mb-3 animate-pulse">
                <CalculatorIcon />
              </div>
              <h3 className="text-xl font-semibold mb-2">Precise Calculations</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Get accurate soil volume calculations in multiple units for any garden bed shape.
              </p>
            </div>
            
            <div className="glass-panel-fun hover-card p-6 flex flex-col items-center text-center" style={{animationDelay: "0.2s"}}>
              <div className="text-[var(--color-secondary)] mb-3 animate-pulse">
                <RulerIcon />
              </div>
              <h3 className="text-xl font-semibold mb-2">Standard Sizes</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Choose from 20+ predefined garden bed dimensions or enter your custom measurements.
              </p>
            </div>
            
            <div className="glass-panel-fun hover-card p-6 flex flex-col items-center text-center" style={{animationDelay: "0.3s"}}>
              <div className="text-[var(--color-accent)] mb-3 animate-pulse">
                <SaveIcon />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gardening Tips</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Learn about soil types and optimal mixtures for healthy plant growth.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
