import Footer from './components/Footer';
import GardenBedSelector from './components/GardenBedSelector';
import { CalculatorIcon, RulerIcon, SaveIcon } from './components/Icons';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
        {/* Hero Section - Glassmorphism header */}
        <div className="glass-panel bento-span-12" style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '1200px', width: '90%' }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Garden Soil Calculator</h1>
          <p style={{ maxWidth: '42rem', margin: '0 auto', fontSize: '1.1rem' }}>
            Quickly calculate the exact amount of soil you need for your garden beds with our easy-to-use calculator.
          </p>
        </div>

        {/* Bento Box Layout */}
        <div className="bento-grid">
          {/* Calculator - Main component spanning 8 columns */}
          <div className="glass-panel bento-span-8 bento-tall">
            <GardenBedSelector />
          </div>

          {/* Feature Cards - Side column with 3 stacked features */}
          <div className="bento-span-4 bento-tall" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Feature 1 */}
            <div className="glass-panel" style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                <CalculatorIcon />
              </div>
              <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Precise Calculations</h3>
              <p>Get accurate soil volume calculations in multiple units for any garden bed shape.</p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel" style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                <RulerIcon />
              </div>
              <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Standard Sizes</h3>
              <p>Choose from 20+ predefined garden bed dimensions or enter your custom measurements.</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel" style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                <SaveIcon />
              </div>
              <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Gardening Tips</h3>
              <p>Learn about soil types and optimal mixtures for healthy plant growth.</p>
            </div>
          </div>

          {/* Tips & Facts Panel - Full width panel at bottom */}
          <div className="glass-panel bento-span-12" style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }}>Gardening Tips</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
              <div style={{ flex: '1 1 300px', padding: '1rem', backgroundColor: 'rgba(255, 122, 89, 0.15)', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                <h3 style={{ color: 'var(--color-primary)' }}>Soil Mix</h3>
                <p>Use a mix of 60% topsoil, 30% compost, and 10% aeration material for optimal plant health.</p>
              </div>
              <div style={{ flex: '1 1 300px', padding: '1rem', backgroundColor: 'rgba(102, 51, 153, 0.15)', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                <h3 style={{ color: 'var(--color-secondary)' }}>Watering</h3>
                <p>Most garden beds need about 1-1.5 inches of water per week, including rainfall.</p>
              </div>
              <div style={{ flex: '1 1 300px', padding: '1rem', backgroundColor: 'rgba(255, 218, 185, 0.25)', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                <h3 style={{ color: '#e67e22' }}>Mulching</h3>
                <p>Apply 2-3 inches of mulch to retain moisture and suppress weeds.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
