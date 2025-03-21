'use client'

import { VolumeResult, formatVolumeResult, VolumeUnit } from '../lib/calculations'

interface VolumeResultDisplayProps {
  volume: VolumeResult;
  fillFactor: number;
  displayUnit: VolumeUnit;
}

/**
 * A component to display calculation results consistently across the application
 */
export default function VolumeResultDisplay({ volume, fillFactor, displayUnit }: VolumeResultDisplayProps) {
  // Apply fill factor to the volume result
  const adjustedVolume = {
    cubicFeet: Number((volume.cubicFeet * fillFactor).toFixed(2)),
    cubicYards: Number((volume.cubicYards * fillFactor).toFixed(2)),
    cubicMeters: Number((volume.cubicMeters * fillFactor).toFixed(2)),
    liters: Number((volume.liters * fillFactor).toFixed(2)),
    gallons: Number((volume.gallons * fillFactor).toFixed(2)),
    displayUnit: volume.displayUnit
  };

  return (
    <div className="glass-panel" style={{
      marginTop: '20px',
      padding: '20px',
      border: '2px solid rgba(255, 122, 89, 0.4)',
      backgroundColor: 'rgba(255, 122, 89, 0.08)',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(255, 122, 89, 0.15)'
    }}>
      <h4 style={{ 
        color: 'var(--color-primary)', 
        marginBottom: '10px', 
        fontSize: '1.2rem'
      }}>
        Calculated Volume
      </h4>
      <div style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        color: 'var(--color-secondary)',
        marginBottom: '10px' 
      }}>
        {formatVolumeResult(adjustedVolume, displayUnit)}
      </div>
      <div className="glass-panel" style={{
        display: 'inline-block',
        padding: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: '8px',
        margin: '0 auto',
        border: '2px solid rgba(255, 122, 89, 0.5)',
        boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)'
      }}>
        <div style={{ marginBottom: '10px', fontWeight: '500' }}>Also expressed as:</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', textAlign: 'left' }}>
          <div>Cubic Feet:</div>
          <div style={{ fontWeight: '500' }}>{adjustedVolume.cubicFeet.toFixed(2)} ft³</div>
          <div>Cubic Yards:</div>
          <div style={{ fontWeight: '500' }}>{adjustedVolume.cubicYards.toFixed(2)} yd³</div>
          <div>Cubic Meters:</div>
          <div style={{ fontWeight: '500' }}>{adjustedVolume.cubicMeters.toFixed(2)} m³</div>
          <div>Liters:</div>
          <div style={{ fontWeight: '500' }}>{adjustedVolume.liters.toFixed(2)} L</div>
        </div>
      </div>
    </div>
  );
}