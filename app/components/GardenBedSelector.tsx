'use client'

import { useState, useEffect } from 'react'
import { allGardenBeds, GardenBedDefinition, rectangularBeds, circularBeds } from '../data/garden-beds'
import { RectangleIcon, CircleIcon } from './Icons'
import { calculateRectangularVolume, calculateCircularVolume, Dimensions, CircularDimensions, VolumeResult, formatVolumeResult, VolumeUnit, DimensionUnit } from '../lib/calculations' // Moved DimensionUnit import here
import VolumeResultDisplay from './VolumeResultDisplay'
import BagCalculator from './BagCalculator'

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
  // Removed convertToFeet helper function as standardization is now handled within calculation functions

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
            // Note: applyFillFactor uses the volumeResult which should be correct based on initial calculation
            return sum + applyFillFactor(entry.volumeResult, entry.savedFillFactor).cubicFeet;
          },
          0
        );

        if (isNaN(totalCubicFeet) || totalCubicFeet < 0) { // Allow zero volume
          console.warn('Total volume calculation resulted in invalid value:', totalCubicFeet);
          // Don't throw error, just maybe show 0
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

  // Custom dimensions state - Ensure units match DimensionUnit type
  const [customRectangular, setCustomRectangular] = useState({
    length: 4,
    lengthUnit: 'feet' as DimensionUnit,
    width: 4,
    widthUnit: 'feet' as DimensionUnit,
    height: 12, // Default height to 12 inches
    heightUnit: 'inches' as DimensionUnit
  })

  const [customCircular, setCustomCircular] = useState({
    diameter: 4,
    height: 12, // Default height to 12 inches
    diameterUnit: 'feet' as DimensionUnit,
    heightUnit: 'inches' as DimensionUnit
  })

  // Helper function to render bed dimensions for dropdown
  function renderBedDimensions(bed: GardenBedDefinition): string {
    const dimensions = bed.dimensions;
    const getUnitSymbol = (unit: DimensionUnit | string): string => { // Accept string for safety
      switch(unit) {
        case 'feet': return 'ft';
        case 'inches': return 'in';
        case 'cm': return 'cm';
        case 'meters': return 'm';
        default: return '';
      }
    };

    if (bed.type === 'rectangular' && 'lengthWidthUnit' in dimensions) {
      const lwUnit = getUnitSymbol(dimensions.lengthWidthUnit);
      const hUnit = getUnitSymbol(dimensions.heightUnit);
      // Ensure values are numbers before calling toFixed if needed, or just display them
      const lengthStr = typeof dimensions.length === 'number' ? dimensions.length : '';
      const widthStr = typeof dimensions.width === 'number' ? dimensions.width : '';
      const heightStr = typeof dimensions.height === 'number' ? dimensions.height : '';
      return `${lengthStr}${lwUnit} × ${widthStr}${lwUnit} × ${heightStr}${hUnit}`;
    } else if (bed.type === 'circular' && 'diameterUnit' in dimensions) {
      const dUnit = getUnitSymbol(dimensions.diameterUnit);
      const hUnit = getUnitSymbol(dimensions.heightUnit);
      const diameterStr = typeof dimensions.diameter === 'number' ? dimensions.diameter : '';
      const heightStr = typeof dimensions.height === 'number' ? dimensions.height : '';
      return `${diameterStr}${dUnit} diameter × ${heightStr}${hUnit}`;
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

      // Use the updated calculation functions which now handle the new dimension structure
      if (bed.type === 'rectangular' && 'lengthWidthUnit' in bed.dimensions) {
        console.log('Calculating volume for rectangular bed:', bed.dimensions);
        result = calculateRectangularVolume(bed.dimensions as Dimensions);
      } else if (bed.type === 'circular' && 'diameterUnit' in bed.dimensions) {
        console.log('Calculating volume for circular bed:', bed.dimensions);
        result = calculateCircularVolume(bed.dimensions as CircularDimensions);
      } else {
        // This case should ideally not happen if data is correct
        console.error("Inconsistent dimensions object for bed:", bed);
        throw new Error('Invalid bed dimensions structure');
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
        // Recalculate if volumeResult is null for some reason, or throw error
         handleBedSelectionChange(selectedBedId); // Try recalculating
         if (!volumeResult) { // Check again after recalculation attempt
            throw new Error('Please calculate volume before adding bed');
         }
      }

      // Allow duplicate bed entries by generating a unique id for each addition
      // The 'bed' object already has the correct new dimension structure from garden-beds.ts
      setSelectedBeds([...selectedBeds, {
        id: selectedBedId + '-' + Date.now(),
        bed, // This 'bed' object uses the new structure
        volumeResult, // Use the calculated volume
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
         // Recalculate if volumeResult is null
         calculateCustomVolume();
         if (!volumeResult) { // Check again
            throw new Error('Please calculate volume before adding custom bed');
         }
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

      // Create a custom bed definition preserving original units from state
      const customBed: GardenBedDefinition = {
        id: customId,
        name: customShapeType === 'rectangular'
          ? `Custom Rectangular (L: ${customRectangular.length} ${customRectangular.lengthUnit}, W: ${customRectangular.width} ${customRectangular.widthUnit}, H: ${customRectangular.height} ${customRectangular.heightUnit})`
          : `Custom Circular (${customCircular.diameter} ${customCircular.diameterUnit} diameter × ${customCircular.height} ${customCircular.heightUnit} height)`,
        type: customShapeType,
        dimensions: customShapeType === 'rectangular'
          ? {
              length: customRectangular.length,
              width: customRectangular.width,
              height: customRectangular.height,
              lengthWidthUnit: customRectangular.lengthUnit, // Use unit from state
              heightUnit: customRectangular.heightUnit      // Use unit from state
            }
          : {
              diameter: customCircular.diameter,
              height: customCircular.height,
              diameterUnit: customCircular.diameterUnit,   // Use unit from state
              heightUnit: customCircular.heightUnit        // Use unit from state
            }
      };

      setSelectedBeds([...selectedBeds, {
        id: customId,
        bed: customBed, // Store the bed definition with original units
        volumeResult, // Use the calculated volume
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
      let dims: Dimensions | CircularDimensions;

      if (customShapeType === 'rectangular') {
         // Prepare dimensions object directly from state
         dims = {
           length: customRectangular.length,
           width: customRectangular.width,
           height: customRectangular.height,
           lengthWidthUnit: customRectangular.lengthUnit,
           heightUnit: customRectangular.heightUnit
         };
         console.log('Calculating volume for rectangular bed:', dims);
         result = calculateRectangularVolume(dims);
      } else if (customShapeType === 'circular') {
         // Prepare dimensions object directly from state
         dims = {
            diameter: customCircular.diameter,
            height: customCircular.height,
            diameterUnit: customCircular.diameterUnit,
            heightUnit: customCircular.heightUnit
         };
         console.log('Calculating volume for circular bed:', dims);
         result = calculateCircularVolume(dims);
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

  // Automatically recalculate volume when custom dimensions or shape type change
  useEffect(() => {
    if (activeTab === 'custom') {
      calculateCustomVolume();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customRectangular, customCircular, customShapeType, activeTab]);

  // Recalculate volume for the selected predefined bed when the component mounts or tab changes
  useEffect(() => {
    if (activeTab === 'rectangular' || activeTab === 'circular') {
      // Ensure a valid bed ID is selected, default if necessary
      const currentBedList = activeTab === 'rectangular' ? rectangularBeds : circularBeds;
      const isValidSelection = currentBedList.some(b => b.id === selectedBedId);
      const bedIdToCalculate = isValidSelection ? selectedBedId : (currentBedList[0]?.id || '');
      if (bedIdToCalculate) {
         setSelectedBedId(bedIdToCalculate); // Update state if defaulted
         handleBedSelectionChange(bedIdToCalculate);
      } else {
         setVolumeResult(null); // No valid beds in the list
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); // Add selectedBedId dependency? No, handleBedSelectionChange covers it.


  // --- JSX Rendering ---
  return (
    <div className="content-section">
      <h2 style={{ color: 'var(--color-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>Garden Bed Soil Calculator</h2>

      {/* Shape Type Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', justifyContent: 'center' }}>
        <button
          className={`btn btn-icon-layout ${activeTab === 'rectangular' ? 'btn-active' : 'btn-secondary'}`} // Added btn-icon-layout
          onClick={() => setActiveTab('rectangular')}
          // style prop removed
        >
          <RectangleIcon /> {/* Simplified structure */}
          Rectangular
        </button>
        <button
          className={`btn btn-icon-layout ${activeTab === 'circular' ? 'btn-active' : 'btn-secondary'}`} // Added btn-icon-layout
          onClick={() => setActiveTab('circular')}
          // style prop removed
        >
          <CircleIcon /> {/* Simplified structure */}
          Circular
        </button>
        <button
          className={`btn ${activeTab === 'custom' ? 'btn-active' : 'btn-secondary'}`}
          onClick={() => setActiveTab('custom')}
          // style prop removed
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
                value={selectedBedId}
                onChange={(e) => handleBedSelectionChange(e.target.value)}
                className="form-input-glass" // Apply the new class
              >
                {(activeTab === 'rectangular' ? rectangularBeds : circularBeds).map((bed) => (
                  <option
                    key={bed.id}
                    value={bed.id}
                    // Use updated renderBedDimensions
                    title={`${bed.name} - ${renderBedDimensions(bed)}`}
                  >
                    {bed.name} - {renderBedDimensions(bed)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview of selected bed with volume calculation display */}
          {volumeResult && allGardenBeds.find(b => b.id === selectedBedId) && ( // Ensure bed exists
            <div>
              <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '8px' }}>
                  {allGardenBeds.find(b => b.id === selectedBedId)?.name}
                </h4>
                <div style={{ fontSize: '0.9rem', marginBottom: '16px', opacity: 0.8 }}>
                  {/* Use updated renderBedDimensions */}
                  {renderBedDimensions(allGardenBeds.find(b => b.id === selectedBedId)!)}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-secondary)' }}>
                    Fill Level
                  </label>
                  <select
                    value={fillFactor}
                    onChange={(e) => setFillFactor(parseFloat(e.target.value))}
                    className="form-input-glass" // Apply the new class
                    style={{ width: '100px' }} // Keep specific width inline for now
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
          {/* Shape selection for custom */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
             <button
               className={`btn btn-icon-layout ${customShapeType === 'rectangular' ? 'btn-active' : 'btn-secondary'}`} // Already had btn-icon-layout
               onClick={() => setCustomShapeType('rectangular')}
               // style prop removed
             >
               <RectangleIcon /> {/* Simplified structure */}
               Rectangular
             </button>
             <button
               className={`btn btn-icon-layout ${customShapeType === 'circular' ? 'btn-active' : 'btn-secondary'}`} // Already had btn-icon-layout
               onClick={() => setCustomShapeType('circular')}
               // style prop removed
             >
               <CircleIcon /> {/* Simplified structure */}
               Circular
             </button>
          </div>

          {/* Input fields */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            {customShapeType === 'rectangular' && (
              <>
                {/* Length Input */}
                <div style={{ flex: '1 1 150px' }}>
                  <label htmlFor="customLength" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-secondary)' }}>Length</label>
                  <div style={{ display: 'flex' }}>
                    <input
                      id="customLength" type="number" min="0" step="0.01"
                      value={customRectangular.length}
                      onChange={(e) => setCustomRectangular(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
                      className="form-input-glass form-input-glass-left" // Apply new classes
                      style={{ width: '70%' }} // Keep width inline for split layout
                    />
                    <select
                      value={customRectangular.lengthUnit}
                      onChange={(e) => setCustomRectangular(prev => ({ ...prev, lengthUnit: e.target.value as DimensionUnit }))}
                      className="form-input-glass form-input-glass-right" // Apply new classes
                      style={{ width: '30%' }} // Keep width inline for split layout
                    >
                      <option value="feet">ft</option>
                      <option value="inches">in</option>
                      <option value="meters">m</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>
                {/* Width Input */}
                 <div style={{ flex: '1 1 150px' }}>
                   <label htmlFor="customWidth" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-secondary)' }}>Width</label>
                   <div style={{ display: 'flex' }}>
                     <input
                       id="customWidth" type="number" min="0" step="0.01"
                       value={customRectangular.width}
                       onChange={(e) => setCustomRectangular(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                       className="form-input-glass form-input-glass-left" // Apply new classes
                       style={{ width: '70%' }} // Keep width inline for split layout
                     />
                     <select
                       value={customRectangular.widthUnit}
                       onChange={(e) => setCustomRectangular(prev => ({ ...prev, widthUnit: e.target.value as DimensionUnit }))}
                       className="form-input-glass form-input-glass-right" // Apply new classes
                       style={{ width: '30%' }} // Keep width inline for split layout
                     >
                       <option value="feet">ft</option>
                       <option value="inches">in</option>
                       <option value="meters">m</option>
                       <option value="cm">cm</option>
                     </select>
                   </div>
                 </div>
              </>
            )}

            {customShapeType === 'circular' && (
              // Diameter Input
              <div style={{ flex: '1 1 150px' }}>
                <label htmlFor="customDiameter" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-secondary)' }}>Diameter</label>
                <div style={{ display: 'flex' }}>
                  <input
                    id="customDiameter" type="number" min="0" step="0.01"
                    value={customCircular.diameter}
                    onChange={(e) => setCustomCircular(prev => ({ ...prev, diameter: parseFloat(e.target.value) || 0 }))}
                    className="form-input-glass form-input-glass-left" // Apply new classes
                    style={{ width: '70%' }} // Keep width inline for split layout
                  />
                  <select
                    value={customCircular.diameterUnit}
                    onChange={(e) => setCustomCircular(prev => ({ ...prev, diameterUnit: e.target.value as DimensionUnit }))}
                    className="form-input-glass form-input-glass-right" // Apply new classes
                    style={{ width: '30%' }} // Keep width inline for split layout
                  >
                    <option value="feet">ft</option>
                    <option value="inches">in</option>
                    <option value="meters">m</option>
                    <option value="cm">cm</option>
                  </select>
                </div>
              </div>
            )}

            {/* Height Input (Common) */}
            <div style={{ flex: '1 1 150px' }}>
              <label htmlFor="customHeight" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-secondary)' }}>Height</label>
              <div style={{ display: 'flex' }}>
                <input
                  id="customHeight" type="number" min="0" step="0.01"
                  value={customShapeType === 'rectangular' ? customRectangular.height : customCircular.height}
                  onChange={(e) => {
                    const newHeight = parseFloat(e.target.value) || 0;
                    if (customShapeType === 'rectangular') {
                      setCustomRectangular(prev => ({ ...prev, height: newHeight }));
                    } else {
                      setCustomCircular(prev => ({ ...prev, height: newHeight }));
                    }
                  }}
                  className="form-input-glass form-input-glass-left" // Apply new classes
                  style={{ width: '70%' }} // Keep width inline for split layout
                />
                <select
                  value={customShapeType === 'rectangular' ? customRectangular.heightUnit : customCircular.heightUnit}
                  onChange={(e) => {
                     const newUnit = e.target.value as DimensionUnit;
                     if (customShapeType === 'rectangular') {
                       setCustomRectangular(prev => ({ ...prev, heightUnit: newUnit }));
                     } else {
                       setCustomCircular(prev => ({ ...prev, heightUnit: newUnit }));
                     }
                  }}
                  className="form-input-glass form-input-glass-right" // Apply new classes
                  style={{ width: '30%' }} // Keep width inline for split layout
                >
                  <option value="inches">in</option>
                  <option value="feet">ft</option>
                  <option value="cm">cm</option>
                  <option value="meters">m</option>
                </select>
              </div>
            </div>
          </div>

          {/* Volume Preview and Add Button */}
          {volumeResult && (
            <div>
               <div className="glass-panel" style={{ marginTop: '20px', padding: '20px', border: '1px solid var(--glass-border)' }}>
                  <h4 style={{ color: 'var(--color-primary)', marginBottom: '8px' }}>Custom {customShapeType === 'rectangular' ? 'Rectangular' : 'Circular'}</h4>
                  {/* Display dimensions using renderBedDimensions logic or similar */}
                  <div style={{ fontSize: '0.9rem', marginBottom: '16px', opacity: 0.8 }}>
                     {/* Simplified display for custom */}
                     {customShapeType === 'rectangular' ?
                        `${customRectangular.length}${customRectangular.lengthUnit} × ${customRectangular.width}${customRectangular.widthUnit} × ${customRectangular.height}${customRectangular.heightUnit}` :
                        `${customCircular.diameter}${customCircular.diameterUnit} diameter × ${customCircular.height}${customCircular.heightUnit}`
                     }
                  </div>
                  <div>
                     <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--color-secondary)' }}>
                       Fill Level
                     </label>
                     <select
                       value={fillFactor}
                       onChange={(e) => setFillFactor(parseFloat(e.target.value))}
                       className="form-input-glass" // Apply new class
                       style={{ width: '100px' }} // Keep specific width inline for now
                     >
                       <option value="0.25">1/4</option>
                       <option value="0.5">1/2</option>
                       <option value="0.75">3/4</option>
                       <option value="1">Full</option>
                     </select>
                  </div>
               </div>
               <VolumeResultDisplay volume={volumeResult} fillFactor={fillFactor} displayUnit={displayUnit} />
               <div style={{ textAlign: 'center', marginTop: '20px' }}>
                 <button className="btn" onClick={addCustomBed} style={{ backgroundColor: '#4CAF50' }}>
                   Add Custom Bed
                 </button>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Selected Beds List */}
      {selectedBeds.length > 0 && (
        <div className="glass-panel" style={{ marginTop: '1.5rem', padding: '24px' }}>
          <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem', textAlign: 'center' }}>Selected Beds</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {selectedBeds.map((entry) => (
              <li key={entry.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--glass-border)',
                gap: '10px'
              }}>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: '500', color: 'var(--color-primary)' }}>{entry.bed.name}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                     {/* Use updated renderBedDimensions */}
                     {renderBedDimensions(entry.bed)}
                     {entry.savedFillFactor !== 1 && ` (Filled ${entry.savedFillFactor * 100}%)`}
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
                  {/* Display volume adjusted by saved fill factor */}
                  {formatVolumeResult(applyFillFactor(entry.volumeResult, entry.savedFillFactor), displayUnit)}
                </div>
                <button
                  onClick={() => removeBed(entry.id)}
                  className="btn btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.8rem', background: 'rgba(220, 53, 69, 0.7)', color: 'white' }}
                  aria-label={`Remove ${entry.bed.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Total Volume Display */}
          {totalVolumeResult && (
             <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid var(--color-primary)' }}>
                <h3 style={{ color: 'var(--color-secondary)', marginBottom: '1rem', textAlign: 'center' }}>Total Soil Needed</h3>
                <VolumeResultDisplay volume={totalVolumeResult} fillFactor={1} displayUnit={displayUnit} />

                {/* Unit Selector for Total */}
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                   <label style={{ marginRight: '10px', fontWeight: '500', color: 'var(--color-secondary)' }}>Display Total In:</label>
                   <select
                      value={displayUnit}
                      onChange={(e) => setDisplayUnit(e.target.value as VolumeUnit)}
                      className="form-input-glass" // Apply new class
                      style={{ minWidth: '180px' }} // Add some min-width
                   >
                      <option value="cubic_feet">Cubic Feet (ft³)</option>
                      <option value="cubic_yards">Cubic Yards (yd³)</option>
                      <option value="cubic_meters">Cubic Meters (m³)</option>
                      <option value="liters">Liters (L)</option>
                      <option value="gallons">Gallons (gal)</option>
                   </select>
                </div>

                {/* Bag Calculator Integration */}
                <div style={{ marginTop: '2rem' }}>
                   <BagCalculator volumeTotal={totalVolumeResult.cubicFeet} />
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper type from calculations needed here if not imported globally
// export type DimensionUnit = 'inches' | 'feet' | 'cm' | 'meters';
