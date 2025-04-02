import React, { useState } from 'react';

interface BagCalculatorProps {
  volumeTotal: number;
}

const BagCalculator: React.FC<BagCalculatorProps> = ({ volumeTotal }) => {
  const [bagSize, setBagSize] = useState<number>(1);

  const handleBagSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue) && newValue > 0) {
      setBagSize(newValue);
    }
  };

  const numberOfBags = Math.ceil(volumeTotal / bagSize);

  return (
    <div className="bag-calculator">
      <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem', textAlign: 'center' }}>Bag Calculator</h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ flex: '1 1 300px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-secondary)' }}>
            Bag Size (cubic feet):
          </label>
          <input
            id="bagSizeInput"
            type="number"
            value={bagSize}
            step="0.01"
            min="0.01"
            onChange={handleBagSizeChange}
            className="form-input-glass" // Apply the new class
          />
        </div>
      </div>
      
      <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--glass-border)' }}>
        <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-accent)', textAlign: 'center' }}>Bags Required:</div>
        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px', textAlign: 'center' }}>
          {numberOfBags} bag(s)
        </div>
        <div style={{ textAlign: 'center', opacity: '0.8', fontSize: '0.9rem' }}>
          Based on {volumeTotal.toFixed(2)} cubic feet of soil and a bag size of {bagSize} cubic feet
        </div>
      </div>
    </div>
  );
};

export default BagCalculator;