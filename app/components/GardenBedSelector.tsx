'use client'

import { useState, useEffect } from 'react'
import { allGardenBeds, GardenBedDefinition, rectangularBeds, circularBeds } from '../data/garden-beds'
import { RectangleIcon, CircleIcon } from './Icons'
import { calculateRectangularVolume, calculateCircularVolume, Dimensions, CircularDimensions, VolumeResult, formatVolumeResult, VolumeUnit } from '../lib/calculations'
import VolumeResultDisplay from './VolumeResultDisplay'

type ShapeTabType = 'rectangular' | 'circular' | 'custom';
type CustomShapeType = 'rectangular' | 'circular';

interface SelectedBedEntry {
  id: string;
  bed: GardenBedDefinition;
  volumeResult: VolumeResult;
  savedFillFactor: number; // Store the fill factor with each bed entry
}

export default function GardenBedSelector() {
  const [activeTab, setActiveTab] = useState<ShapeTabType>('rectangular')
  const [customShapeType, setCustomShapeType] = useState<CustomShapeType>('rectangular')
  const [selectedBedId, setSelectedBedId] = useState<string>(rectangularBeds[0]?.id || '')
  const [selectedBeds, setSelectedBeds] = useState<SelectedBedEntry[]>([])
  const [volumeResult, setVolumeResult] = useState<VolumeResult | null>(null)
  const [totalVolumeResult, setTotalVolumeResult] = useState<VolumeResult | null>(null)
  const [displayUnit, setDisplayUnit] = useState<VolumeUnit>('cubic_feet')
  const [fillFactor, setFillFactor] = useState<number>(1);
  
  function applyFillFactor(volume: VolumeResult, factor: number): VolumeResult {
    return {
      cubicFeet: Number((volume.cubicFeet * factor).toFixed(2)),
      cubicYards: Number((volume.cubicYards * factor).toFixed(2)),
      cubicMeters: Number((volume.cubicMeters * factor).toFixed(2)),
      liters: Number((volume.liters * factor).toFixed(2)),
      gallons: Number((volume.gallons * factor).toFixed(2)),
      displayUnit: volume.displayUnit
    };
  }
  
  // Update total volume when selected beds change
  useEffect(() => {
    try {
      setCalculationError(null);
      
      if (selectedBeds.length > 0) {
        // Calculate total cubic feet with each bed's saved fill factor
        const totalCubicFeet = selectedBeds.reduce(
          (sum, entry) => {
            if (!entry.volumeResult) return sum;
            // Use each bed's saved fill factor instead of the global one
            return sum + applyFillFactor(entry.volumeResult, entry.savedFillFactor).cubicFeet;
          },
          0
        );
        
        if (isNaN(totalCubicFeet) || totalCubicFeet <= 0) {
          console.warn('Total volume calculation resulted in invalid value:', totalCubicFeet);
        }
        
        // Create a new volume result with total values using precise conversion factors
        const newTotalVolume: VolumeResult = {
          cubicFeet: Number(totalCubicFeet.toFixed(2)),
          cubicYards: Number((totalCubicFeet / 27).toFixed(2)),
          cubicMeters: Number((totalCubicFeet * 0.0283168).toFixed(2)), // More precise conversion
          liters: Number((totalCubicFeet * 0.0283168 * 1000).toFixed(2)),
          gallons: Number((totalCubicFeet * 7.48052).toFixed(2)),
          displayUnit: displayUnit
        };
        
        setTotalVolumeResult(newTotalVolume);
        console.log('Total volume updated:', newTotalVolume);
      } else {
        setTotalVolumeResult(null);
      }
    } catch (error) {
      console.error('Error calculating total volume:', error);
      // We don't set UI error as this calculation happens in the background
    }
  }, [selectedBeds, displayUnit]); // Removed fillFactor dependency since we use each bed's savedFillFactor

  // Custom dimensions state
  const [customRectangular, setCustomRectangular] = useState<Dimensions>({
    length: 4,
    width: 4,
    height: 1,
    unit: 'feet'
  })
  
  const [customCircular, setCustomCircular] = useState<CircularDimensions>({
    diameter: 4,
    height: 1,
    unit: 'feet'
  })

  // Helper function to render bed dimensions for dropdown (with height always in inches)
  function renderBedDimensions(bed: GardenBedDefinition): string {
    const dimensions = bed.dimensions;
    const unit = dimensions.unit === 'feet' ? "ft" : "in";
    if (bed.type === 'rectangular' && 'length' in dimensions) {
      return `${dimensions.length}${unit} × ${dimensions.width}${unit} × ${dimensions.height}${unit}`;
    } else if (bed.type === 'circular' && 'diameter' in dimensions) {
      return `${dimensions.diameter}${unit} diameter × ${dimensions.height}${unit}`;
    }
    return "";
  }
  
  // Handle bed selection change with error handling
  const handleBedSelectionChange = (bedId: string) => {
    setSelectedBedId(bedId);
    setCalculationError(null); // Clear previous errors
    
    try {
      const bed = allGardenBeds.find(b => b.id === bedId);
      if (!bed) {
        throw new Error('Selected bed not found');
      }
      
      let result: VolumeResult;
      
      if (bed.type === 'rectangular' && 'length' in bed.dimensions) {
        console.log('Calculating volume for rectangular bed:', bed.dimensions);
        result = calculateRectangularVolume(bed.dimensions as Dimensions);
      } else if (bed.type === 'circular' && 'diameter' in bed.dimensions) {
        console.log('Calculating volume for circular bed:', bed.dimensions);
        result = calculateCircularVolume(bed.dimensions as CircularDimensions);
      } else {
        throw new Error('Invalid bed dimensions or type');
      }
      
      setVolumeResult(result);
      
    } catch (error) {
      // Handle calculation errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown calculation error';
      console.error('Bed selection calculation error:', errorMessage);
      setCalculationError(errorMessage);
      
      // Provide fallback behavior - empty result
      setVolumeResult(null);
    }
  }
  
  // Add the selected bed to the list with error handling
  const addSelectedBed = () => {
    try {
      setCalculationError(null);
      
      const bed = allGardenBeds.find(b => b.id === selectedBedId);
      if (!bed) {
        throw new Error('Selected bed not found');
      }
      
      if (!volumeResult) {
        throw new Error('Please calculate volume before adding bed');
      }
      
      // Allow duplicate bed entries by generating a unique id for each addition
      setSelectedBeds([...selectedBeds, {
        id: selectedBedId + '-' + Date.now(),
        bed,
        volumeResult,
        savedFillFactor: fillFactor // Store the current fill factor with this bed
      }]);
      
      console.log('Bed added successfully:', bed.name);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error adding bed';
      console.error('Error adding bed:', errorMessage);
      setCalculationError(errorMessage);
    }
  }
  
  // Remove a bed from the list
  const removeBed = (bedId: string) => {
    try {
      setSelectedBeds(selectedBeds.filter(entry => entry.id !== bedId));
      console.log('Bed removed successfully:', bedId);
    } catch (error) {
      console.error('Error removing bed:', error);
      // Don't set UI error as this is less critical
    }
  }
  
  // Add a custom bed to the list with error handling
  const addCustomBed = () => {
    try {
      setCalculationError(null);
      
      if (!volumeResult) {
        throw new Error('Please calculate volume before adding custom bed');
      }
      
      // Create a unique id for the custom bed
      const customId = `custom-${Date.now()}`;
      
      // Ensure dimensions are valid
      if (customShapeType === 'rectangular') {
        if (customRectangular.length <= 0 || customRectangular.width <= 0 || customRectangular.height <= 0) {
          throw new Error('All dimensions must be positive numbers');
        }
      } else if (customShapeType === 'circular') {
        if (customCircular.diameter <= 0 || customCircular.height <= 0) {
          throw new Error('All dimensions must be positive numbers');
        }
      }
      
      // Create a custom bed definition
      const customBed: GardenBedDefinition = {
        id: customId,
        name: customShapeType === 'rectangular'
          ? `Custom Rectangular (${customRectangular.length}${customRectangular.unit === 'feet' ? 'ft' : 'in'} × ${customRectangular.width}${customRectangular.unit === 'feet' ? 'ft' : 'in'})`
          : `Custom Circular (${customCircular.diameter}${customCircular.unit === 'feet' ? 'ft' : 'in'} diameter)`,
        type: customShapeType,
        dimensions: customShapeType === 'rectangular' ? {...customRectangular} : {...customCircular}
      };
      
      setSelectedBeds([...selectedBeds, {
        id: customId,
        bed: customBed,
        volumeResult,
        savedFillFactor: fillFactor // Store the current fill factor with this bed
      }]);
      
      console.log('Custom bed added successfully:', customBed.name);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error adding custom bed';
      console.error('Error adding custom bed:', errorMessage);
      setCalculationError(errorMessage);
    }
  }
  
  // State for calculation errors
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Handle custom calculations with error handling
  const calculateCustomVolume = () => {
    setCalculationError(null); // Clear previous errors
    
    try {
      let result: VolumeResult;
      
      if (customShapeType === 'rectangular') {
        // Log dimensions for debugging
        console.log('Calculating volume for rectangular bed:', customRectangular);
        result = calculateRectangularVolume(customRectangular);
      } else if (customShapeType === 'circular') {
        // Log dimensions for debugging
        console.log('Calculating volume for circular bed:', customCircular);
        result = calculateCircularVolume(customCircular);
      } else {
        setCalculationError('Invalid shape type selected');
        return;
      }
      
      // Set the result in state
      setVolumeResult(result);
      
    } catch (error) {
      // Handle calculation errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown calculation error';
      console.error('Calculation error:', errorMessage);
      setCalculationError(errorMessage);
      
      // Provide fallback behavior - empty result
      setVolumeResult(null);
    }
  }
  
  return (
    <div className="content-section">
      <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>Garden Bed Soil Calculator</h2>
      
      {/* Shape Type Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', justifyContent: 'center' }}>
        <button
          className={`btn ${activeTab === 'rectangular' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('rectangular')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'rectangular' ? 'var(--color-primary)' : 'rgba(102, 51, 153, 0.7)'
          }}
        >
          <div>
            <RectangleIcon />
          </div>
          Rectangular
        </button>
        <button
          className={`btn ${activeTab === 'circular' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('circular')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'circular' ? 'var(--color-primary)' : 'rgba(102, 51, 153, 0.7)'
          }}
        >
          <div>
            <CircleIcon />
          </div>
          Circular
        </button>
        <button
          className={`btn ${activeTab === 'custom' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('custom')}
          style={{
            background: activeTab === 'custom' ? 'var(--color-primary)' : 'rgba(102, 51, 153, 0.7)'
          }}
        >
          Custom
        </button>
      </div>
      
      {/* Error Message Display */}
      {calculationError && (
        <div className="glass-panel" style={{
          marginBottom: '1rem',
          padding: '15px',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          border: '1px solid rgba(220, 53, 69, 0.3)',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#dc3545'
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <span style={{ fontWeight: '500' }}>{calculationError}</span>
          </div>
        </div>
      )}
      
      {/* Bed Selection - Dropdown with Add Button */}
      {(activeTab === 'rectangular' || activeTab === 'circular') && (
        <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', marginBottom: '20px' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-secondary)' }}>
                Select a garden bed
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 122, 89, 0.5)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(5px)',
                  color: 'inherit',
                  boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                  fontWeight: '500'
                }}
                value={selectedBedId}
                onChange={(e) => handleBedSelectionChange(e.target.value)}
              >
                {(activeTab === 'rectangular' ? rectangularBeds : circularBeds).map((bed) => (
                  <option
                    key={bed.id}
                    value={bed.id}
                    title={`${bed.name} - ${renderBedDimensions(bed)}`}
                  >
                    {bed.name} - {renderBedDimensions(bed)}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn"
              onClick={addSelectedBed}
              style={{ flexShrink: 0 }}
            >
              Add Bed
            </button>
          </div>
          
          {/* Preview of selected bed with volume calculation display */}
          {volumeResult && (
            <div>
              <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '8px' }}>
                  {allGardenBeds.find(b => b.id === selectedBedId)?.name}
                </h4>
                <div style={{ fontSize: '0.9rem', marginBottom: '16px', opacity: 0.8 }}>
                  {renderBedDimensions(allGardenBeds.find(b => b.id === selectedBedId)!)}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-secondary)' }}>
                    Fill Level
                  </label>
                  <select
                    value={fillFactor}
                    onChange={(e) => setFillFactor(parseFloat(e.target.value))}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 122, 89, 0.5)',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(5px)',
                      color: 'inherit',
                      width: '100px',
                      boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                      fontWeight: '500'
                    }}
                  >
                    <option value="0.25">1/4</option>
                    <option value="0.5">1/2</option>
                    <option value="0.75">3/4</option>
                    <option value="1">Full</option>
                  </select>
                </div>
              </div>
              
              {/* Detailed volume information */}
              <VolumeResultDisplay volume={volumeResult} fillFactor={fillFactor} displayUnit={displayUnit} />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="btn" onClick={addSelectedBed} style={{ backgroundColor: '#4CAF50' }}>
                  Add Bed
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Custom Dimensions */}
      {activeTab === 'custom' && (
        <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
            <button
              className={`btn ${customShapeType === 'rectangular' ? '' : 'btn-secondary'}`}
              onClick={() => setCustomShapeType('rectangular')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: customShapeType === 'rectangular' ? 'var(--color-primary)' : 'rgba(102, 51, 153, 0.7)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RectangleIcon /> Rectangular
              </span>
            </button>
            <button
              className={`btn ${customShapeType === 'circular' ? '' : 'btn-secondary'}`}
              onClick={() => setCustomShapeType('circular')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: customShapeType === 'circular' ? 'var(--color-primary)' : 'rgba(102, 51, 153, 0.7)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CircleIcon /> Circular
              </span>
            </button>
          </div>
          
          {customShapeType === 'rectangular' && (
            <div className="glass-panel" style={{ padding: '20px', marginTop: '20px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ color: 'var(--color-secondary)', marginBottom: '20px', textAlign: 'center' }}>Custom Rectangular Bed</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-primary)' }}>Length</label>
                  <input
                    type="number"
                    value={customRectangular.length}
                    onChange={(e) => setCustomRectangular({...customRectangular, length: parseFloat(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 122, 89, 0.5)',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(5px)',
                      color: 'inherit',
                      boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                      fontWeight: '500'
                    }}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-primary)' }}>Width</label>
                  <input
                    type="number"
                    value={customRectangular.width}
                    onChange={(e) => setCustomRectangular({...customRectangular, width: parseFloat(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 122, 89, 0.5)',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(5px)',
                      color: 'inherit',
                      boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                      fontWeight: '500'
                    }}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-primary)' }}>Height</label>
                  <input
                    type="number"
                    value={customRectangular.height}
                    onChange={(e) => setCustomRectangular({...customRectangular, height: parseFloat(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 122, 89, 0.5)',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(5px)',
                      color: 'inherit',
                      boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                      fontWeight: '500'
                    }}
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-primary)' }}>Unit</label>
                <select
                  value={customRectangular.unit}
                  onChange={(e) => setCustomRectangular({
                    ...customRectangular,
                    unit: e.target.value as 'inches' | 'feet' | 'cm' | 'meters'
                  })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid rgba(255, 122, 89, 0.5)',
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(5px)',
                    color: 'inherit',
                    boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                    fontWeight: '500'
                  }}
                >
                  <option value="feet">Feet</option>
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  className="btn"
                  onClick={calculateCustomVolume}
                >
                  Calculate Volume
                </button>
                {volumeResult && (
                  <button
                    className="btn"
                    onClick={addCustomBed}
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    Add Bed
                  </button>
                )}
              </div>
              
              {/* Volume Result Section - appears after calculation */}
              {volumeResult && <VolumeResultDisplay volume={volumeResult} fillFactor={fillFactor} displayUnit={displayUnit} />}
            </div>
          )}
          
          {customShapeType === 'circular' && (
            <div className="glass-panel" style={{ padding: '20px', marginTop: '20px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ color: 'var(--color-secondary)', marginBottom: '20px', textAlign: 'center' }}>Custom Circular Bed</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-primary)' }}>Diameter</label>
                  <input
                    type="number"
                    value={customCircular.diameter}
                    onChange={(e) => setCustomCircular({...customCircular, diameter: parseFloat(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 122, 89, 0.5)',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(5px)',
                      color: 'inherit',
                      boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                      fontWeight: '500'
                    }}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-primary)' }}>Height</label>
                  <input
                    type="number"
                    value={customCircular.height}
                    onChange={(e) => setCustomCircular({...customCircular, height: parseFloat(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 122, 89, 0.5)',
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(5px)',
                      color: 'inherit',
                      boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                      fontWeight: '500'
                    }}
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-primary)' }}>Unit</label>
                <select
                  value={customCircular.unit}
                  onChange={(e) => setCustomCircular({
                    ...customCircular,
                    unit: e.target.value as 'inches' | 'feet' | 'cm' | 'meters'
                  })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid rgba(255, 122, 89, 0.5)',
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(5px)',
                    color: 'inherit',
                    boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                    fontWeight: '500'
                  }}
                >
                  <option value="feet">Feet</option>
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  className="btn"
                  onClick={calculateCustomVolume}
                >
                  Calculate Volume
                </button>
                {volumeResult && (
                  <button
                    className="btn"
                    onClick={addCustomBed}
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    Add Bed
                  </button>
                )}
              </div>
              
              {/* Volume Result Section - appears after calculation */}
              {volumeResult && <VolumeResultDisplay volume={volumeResult} fillFactor={fillFactor} displayUnit={displayUnit} />}
            </div>
          )}
        </div>
      )}
      
      {/* Selected Beds List */}
      {selectedBeds.length > 0 && (
        <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '24px' }}>
          <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem', textAlign: 'center' }}>Selected Garden Beds</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {selectedBeds.map((entry) => {
              const bed = entry.bed;
              return (
                <div
                  key={entry.id}
                  className="glass-panel"
                  style={{ padding: '16px', border: '1px solid var(--glass-border)' }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <h4 style={{ color: 'var(--color-primary)', marginBottom: '8px' }}>{bed.name}</h4>
                      <div style={{ fontSize: '0.9rem', marginBottom: '8px', opacity: 0.8 }}>
                        {renderBedDimensions(bed)}
                      </div>
                      <div>
                        <span>Volume: </span>
                        <span style={{ fontWeight: '600', color: 'var(--color-secondary)' }}>
                          {formatVolumeResult(applyFillFactor(entry.volumeResult, entry.savedFillFactor), 'cubic_feet')}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', opacity: '0.8', marginTop: '4px' }}>
                        (Fill level: {Math.round(entry.savedFillFactor * 100)}%)
                      </div>
                    </div>
                    <button
                      className="btn"
                      onClick={() => removeBed(entry.id)}
                      style={{ backgroundColor: '#f44336' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Total Results Section */}
      {totalVolumeResult && (
        <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '24px' }}>
          <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>Total Soil Needed</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
              <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'var(--color-accent)' }}>Total Soil Volume:</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px' }}>
                {formatVolumeResult(totalVolumeResult, displayUnit)}
              </div>
              <select
                value={displayUnit}
                onChange={(e) => setDisplayUnit(e.target.value as VolumeUnit)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 122, 89, 0.5)',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(5px)',
                  color: 'inherit',
                  width: '200px',
                  margin: '0 auto',
                  boxShadow: '0 0 10px rgba(255, 122, 89, 0.2)',
                  fontWeight: '500'
                }}
              >
                <option value="cubic_feet">Cubic Feet</option>
                <option value="cubic_yards">Cubic Yards</option>
                <option value="cubic_meters">Cubic Meters</option>
                <option value="liters">Liters</option>
                <option value="gallons">Gallons</option>
              </select>
            </div>
            
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--glass-border)' }}>
              <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--color-accent)', textAlign: 'center' }}>Also expressed as:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span>Cubic Feet:</span>
                  <span style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>{totalVolumeResult.cubicFeet.toFixed(2)} ft³</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span>Cubic Yards:</span>
                  <span style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>{totalVolumeResult.cubicYards.toFixed(2)} yd³</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span>Cubic Meters:</span>
                  <span style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>{totalVolumeResult.cubicMeters.toFixed(2)} m³</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px' }}>
                  <span>Liters:</span>
                  <span style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#333',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>{totalVolumeResult.liters.toFixed(2)} L</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ marginTop: '24px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem' }}>🌱</span> Need help with soil?
            </h4>
            <p style={{ marginBottom: '16px', fontSize: '1.05rem' }}>
              Most garden beds perform best with a mix of:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255, 122, 89, 0.15)' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)' }}>60%</div>
                <div style={{ opacity: 0.9 }}>Topsoil</div>
              </div>
              <div className="glass-panel" style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(102, 51, 153, 0.15)' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-secondary)' }}>30%</div>
                <div style={{ opacity: 0.9 }}>Compost</div>
              </div>
              <div className="glass-panel" style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255, 218, 185, 0.25)' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#e67e22' }}>10%</div>
                <div style={{ opacity: 0.9 }}>Aeration Material</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
