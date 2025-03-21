import Footer from './components/Footer';
import GardenBedSelector from './components/GardenBedSelector';
import { CalculatorIcon, RulerIcon, SaveIcon } from './components/Icons';

export default function Home() {
  return (
    <div className="siimple-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="siimple-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
          {/* Hero Section */}
          <div className="siimple-content" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 className="siimple-h1">Garden Soil Calculator</h1>
            <p className="siimple-paragraph" style={{ maxWidth: '42rem', margin: '0 auto' }}>
              Quickly calculate the exact amount of soil you need for your garden beds with our easy-to-use calculator.
            </p>
          </div>
          {/* Calculator */}
          <div style={{ width: '100%' }}>
            <GardenBedSelector />
          </div>
          {/* Features Section */}
          <div className="siimple-content" style={{ marginTop: '4rem' }}>
            <div className="siimple-grid">
              <div className="siimple-grid-row">
                <div className="siimple-grid-col siimple-grid-col--4">
                  <div className="siimple-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div className="siimple-card-header">
                      <CalculatorIcon />
                    </div>
                    <div className="siimple-card-body">
                      <h3 className="siimple-h5">Precise Calculations</h3>
                      <p className="siimple-paragraph">Get accurate soil volume calculations in multiple units for any garden bed shape.</p>
                    </div>
                  </div>
                </div>
                <div className="siimple-grid-col siimple-grid-col--4">
                  <div className="siimple-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div className="siimple-card-header">
                      <RulerIcon />
                    </div>
                    <div className="siimple-card-body">
                      <h3 className="siimple-h5">Standard Sizes</h3>
                      <p className="siimple-paragraph">Choose from 20+ predefined garden bed dimensions or enter your custom measurements.</p>
                    </div>
                  </div>
                </div>
                <div className="siimple-grid-col siimple-grid-col--4">
                  <div className="siimple-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div className="siimple-card-header">
                      <SaveIcon />
                    </div>
                    <div className="siimple-card-body">
                      <h3 className="siimple-h5">Gardening Tips</h3>
                      <p className="siimple-paragraph">Learn about soil types and optimal mixtures for healthy plant growth.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
