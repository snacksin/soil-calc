'use client'

import { useState, useEffect } from 'react'
import { allGardenBeds, GardenBedDefinition, rectangularBeds, circularBeds } from '../data/garden-beds'
import { RectangleIcon, CircleIcon } from './Icons'
import { calculateRectangularVolume, calculateCircularVolume, Dimensions, CircularDimensions, VolumeResult, formatVolumeResult, VolumeUnit } from '../lib/calculations'

type ShapeTabType = 'rectangular' | 'circular' | 'custom';
type CustomShapeType = 'rectangular' | 'circular';

interface SelectedBedEntry {
  id: string;
  bed: GardenBedDefinition;
  volumeResult: VolumeResult;
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
    if (selectedBeds.length > 0) {
      // Calculate total cubic feet with fill factor applied for each bed
      const totalCubicFeet = selectedBeds.reduce(
        (sum, entry) => sum + applyFillFactor(entry.volumeResult, fillFactor).cubicFeet,
        0
      );
      
      // Create a new volume result with total values
      const newTotalVolume: VolumeResult = {
        cubicFeet: totalCubicFeet,
        cubicYards: totalCubicFeet / 27,
        cubicMeters: totalCubicFeet * 0.0283168,
        liters: totalCubicFeet * 28.3168,
        gallons: totalCubicFeet * 7.48052,
        displayUnit: displayUnit
      };
      
      setTotalVolumeResult(newTotalVolume);
    } else {
      setTotalVolumeResult(null);
    }
  }, [selectedBeds, displayUnit, fillFactor]);

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
  
  // Handle bed selection change
  const handleBedSelectionChange = (bedId: string) => {
    setSelectedBedId(bedId);
    
    const bed = allGardenBeds.find(b => b.id === bedId);
    if (!bed) return;
    
    let result: VolumeResult;
    if (bed.type === 'rectangular' && 'length' in bed.dimensions) {
      result = calculateRectangularVolume(bed.dimensions as Dimensions);
    } else if (bed.type === 'circular' && 'diameter' in bed.dimensions) {
      result = calculateCircularVolume(bed.dimensions as CircularDimensions);
    } else {
      return;
    }
    
    setVolumeResult(result);
  }
  
  // Add the selected bed to the list
  const addSelectedBed = () => {
    const bed = allGardenBeds.find(b => b.id === selectedBedId);
    if (!bed || !volumeResult) return;
    
    // Check if bed is already in the list
    const alreadyExists = selectedBeds.some(entry => entry.id === selectedBedId);
    if (alreadyExists) return;
    
    setSelectedBeds([...selectedBeds, {
      id: selectedBedId,
      bed,
      volumeResult
    }]);
  }
  
  // Remove a bed from the list
  const removeBed = (bedId: string) => {
    setSelectedBeds(selectedBeds.filter(entry => entry.id !== bedId));
  }
  
  // Add a custom bed to the list
  const addCustomBed = () => {
    if (!volumeResult) return;
    
    // Create a unique id for the custom bed
    const customId = `custom-${Date.now()}`;
    
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
      volumeResult
    }]);
  }
  
  // Handle custom calculations
  const calculateCustomVolume = () => {
    let result: VolumeResult;
    
    if (customShapeType === 'rectangular') {
      result = calculateRectangularVolume(customRectangular);
    } else if (customShapeType === 'circular') {
      result = calculateCircularVolume(customCircular);
    } else {
      return;
    }
    
    setVolumeResult(result);
  }
  
  return (
    <div className="glass-panel-fun p-6 sm:p-8 max-w-4xl w-full animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gradient-fun">Garden Bed Soil Calculator</h2>
      
      {/* Shape Type Tabs */}
      <div className="flex flex-wrap border-b border-[var(--glass-border)] mb-8">
        <button
          className={`py-2 px-4 flex items-center gap-2 transition-all duration-300 ${
            activeTab === 'rectangular'
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)] font-medium translate-y-[1px]'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
          onClick={() => setActiveTab('rectangular')}
        >
          <div className={activeTab === 'rectangular' ? 'animate-pulse' : ''} style={{animationDuration: '3s'}}>
            <RectangleIcon />
          </div>
          Rectangular
        </button>
        <button
          className={`py-2 px-4 flex items-center gap-2 transition-all duration-300 ${
            activeTab === 'circular'
              ? 'border-b-2 border-[var(--color-secondary)] text-[var(--color-secondary)] font-medium translate-y-[1px]'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
          onClick={() => setActiveTab('circular')}
        >
          <div className={activeTab === 'circular' ? 'animate-pulse' : ''} style={{animationDuration: '3s'}}>
            <CircleIcon />
          </div>
          Circular
        </button>
        <button
          className={`py-2 px-4 flex items-center gap-2 transition-all duration-300 ${
            activeTab === 'custom'
              ? 'border-b-2 border-[var(--color-accent)] text-[var(--color-accent)] font-medium translate-y-[1px]'
              : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]'
          }`}
          onClick={() => setActiveTab('custom')}
        >
          Custom
        </button>
      </div>
      
      {/* Bed Selection - Dropdown with Add Button */}
      {(activeTab === 'rectangular' || activeTab === 'circular') && (
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
            <div className="flex-grow">
              <label className="block text-sm mb-2 text-[var(--color-muted)]">Select a garden bed</label>
              <select
                className="input-glass w-full p-3 text-[var(--color-foreground)] border-2 border-transparent focus:border-[var(--color-primary)] transition-all duration-300"
                style={{
                  whiteSpace: "normal",
                  overflowWrap: "break-word",
                  minWidth: "280px",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                  textAlign: "left",
                  lineHeight: "1.5rem"
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
              className="btn-fun min-w-[120px] py-3"
              onClick={addSelectedBed}
            >
              Add Bed
            </button>
          </div>
          
          {/* Preview of selected bed */}
          {volumeResult && (
            <div className="glass-panel-fun p-4 mb-4 hover-card animate-fade-in">
              <div className="font-medium text-lg">
                {allGardenBeds.find(b => b.id === selectedBedId)?.name}
              </div>
              <div className="text-sm mt-1 text-[var(--color-muted)]">
                {renderBedDimensions(allGardenBeds.find(b => b.id === selectedBedId)!)}
              </div>
              <div className="text-sm mt-2 font-semibold text-[var(--color-primary)]">
                Volume: <span className="text-xl">{formatVolumeResult(applyFillFactor(volumeResult, fillFactor), 'cubic_feet')}</span>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2 font-medium">Fill Level</label>
                <select
                  value={fillFactor}
                  onChange={(e) => setFillFactor(parseFloat(e.target.value))}
                  className="input-glass w-full border-2 border-transparent focus:border-[var(--color-primary)] transition-all"
                >
                  <option value="0.25">1/4</option>
                  <option value="0.5">1/2</option>
                  <option value="0.75">3/4</option>
                  <option value="1">Full</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Custom Dimensions */}
      {activeTab === 'custom' && (
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-wrap gap-4 mb-4">
            <button
              className={`py-3 px-6 rounded-md transition-all duration-300 ${
                customShapeType === 'rectangular'
                  ? 'bg-[var(--color-primary)] text-white shadow-lg transform scale-105'
                  : 'glass-panel-fun hover:-translate-y-1 hover:shadow-md'
              }`}
              onClick={() => setCustomShapeType('rectangular')}
            >
              <span className="flex items-center gap-2">
                <RectangleIcon /> Rectangular
              </span>
            </button>
            <button
              className={`py-3 px-6 rounded-md transition-all duration-300 ${
                customShapeType === 'circular'
                  ? 'bg-[var(--color-accent)] text-white shadow-lg transform scale-105'
                  : 'glass-panel-fun hover:-translate-y-1 hover:shadow-md'
              }`}
              onClick={() => setCustomShapeType('circular')}
            >
              <span className="flex items-center gap-2">
                <CircleIcon /> Circular
              </span>
            </button>
          </div>
          
          {customShapeType === 'rectangular' && (
            <div className="glass-panel-fun p-5 animate-fade-in">
              <h3 className="text-xl font-medium mb-4 text-[var(--color-primary)]">Custom Rectangular Bed</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="hover-card p-3">
                  <label className="block text-sm mb-2 font-medium">Length</label>
                  <input
                    type="number"
                    value={customRectangular.length}
                    onChange={(e) => setCustomRectangular({...customRectangular, length: parseFloat(e.target.value)})}
                    className="input-glass w-full border-2 border-transparent focus:border-[var(--color-primary)] transition-all"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div className="hover-card p-3">
                  <label className="block text-sm mb-2 font-medium">Width</label>
                  <input
                    type="number"
                    value={customRectangular.width}
                    onChange={(e) => setCustomRectangular({...customRectangular, width: parseFloat(e.target.value)})}
                    className="input-glass w-full border-2 border-transparent focus:border-[var(--color-primary)] transition-all"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div className="hover-card p-3">
                  <label className="block text-sm mb-2 font-medium">Height</label>
                  <input
                    type="number"
                    value={customRectangular.height}
                    onChange={(e) => setCustomRectangular({...customRectangular, height: parseFloat(e.target.value)})}
                    className="input-glass w-full border-2 border-transparent focus:border-[var(--color-primary)] transition-all"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm mb-2 font-medium">Unit</label>
                <select
                  value={customRectangular.unit}
                  onChange={(e) => setCustomRectangular({
                    ...customRectangular,
                    unit: e.target.value as 'inches' | 'feet' | 'cm' | 'meters'
                  })}
                  className="input-glass w-full border-2 border-transparent focus:border-[var(--color-primary)] transition-all"
                >
                  <option value="feet">Feet</option>
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  className="btn-fun bg-[var(--color-primary)] flex-1 py-3"
                  onClick={calculateCustomVolume}
                >
                  Calculate Volume
                </button>
                {volumeResult && (
                  <button
                    className="btn-fun bg-[var(--color-success)] flex-1 py-3 animate-pulse"
                    style={{animationDuration: '2s'}}
                    onClick={addCustomBed}
                  >
                    Add Bed
                  </button>
                )}
              </div>
            </div>
          )}
          
          {customShapeType === 'circular' && (
            <div className="glass-panel-fun p-5 animate-fade-in">
              <h3 className="text-xl font-medium mb-4 text-[var(--color-accent)]">Custom Circular Bed</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="hover-card p-3">
                  <label className="block text-sm mb-2 font-medium">Diameter</label>
                  <input
                    type="number"
                    value={customCircular.diameter}
                    onChange={(e) => setCustomCircular({...customCircular, diameter: parseFloat(e.target.value)})}
                    className="input-glass w-full border-2 border-transparent focus:border-[var(--color-accent)] transition-all"
                    min="0.1"
                    step="0.1"
                  />
                </div>
                <div className="hover-card p-3">
                  <label className="block text-sm mb-2 font-medium">Height</label>
                  <input
                    type="number"
                    value={customCircular.height}
                    onChange={(e) => setCustomCircular({...customCircular, height: parseFloat(e.target.value)})}
                    className="input-glass w-full border-2 border-transparent focus:border-[var(--color-accent)] transition-all"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm mb-2 font-medium">Unit</label>
                <select
                  value={customCircular.unit}
                  onChange={(e) => setCustomCircular({
                    ...customCircular,
                    unit: e.target.value as 'inches' | 'feet' | 'cm' | 'meters'
                  })}
                  className="input-glass w-full border-2 border-transparent focus:border-[var(--color-accent)] transition-all"
                >
                  <option value="feet">Feet</option>
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  className="btn-fun bg-[var(--color-accent)] flex-1 py-3"
                  onClick={calculateCustomVolume}
                >
                  Calculate Volume
                </button>
                {volumeResult && (
                  <button
                    className="btn-fun bg-[var(--color-success)] flex-1 py-3 animate-pulse"
                    style={{animationDuration: '2s'}}
                    onClick={addCustomBed}
                  >
                    Add Bed
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Selected Beds List */}
      {selectedBeds.length > 0 && (
        <div className="glass-panel-fun p-6 mb-8 animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-gradient-fun">Selected Garden Beds</h3>
          <div className="space-y-4">
            {selectedBeds.map((entry, index) => {
              const bed = entry.bed;
              return (
                <div
                  key={entry.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between hover-card bg-[var(--glass-background)] p-4 rounded-lg transition-all duration-300 animate-slide-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="mb-3 sm:mb-0">
                    <div className="font-medium text-lg">{bed.name}</div>
                    <div className="text-sm text-[var(--color-muted)]">
                      {renderBedDimensions(bed)}
                    </div>
                    <div className="text-sm font-semibold text-[var(--color-primary)]">
                      Volume: {formatVolumeResult(applyFillFactor(entry.volumeResult, fillFactor), 'cubic_feet')}
                    </div>
                  </div>
                  <button
                    className="btn-fun bg-red-500 hover:bg-red-600 px-4 py-2 text-white rounded-md transition-all"
                    onClick={() => removeBed(entry.id)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Total Results Section */}
      {totalVolumeResult && (
        <div className="glass-panel-fun p-6 mt-6 animate-fade-in hover-card">
          <h3 className="text-2xl font-semibold mb-4 text-gradient-fun">Total Soil Needed</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6 mb-6">
            <div>
              <div className="text-sm text-[var(--color-muted)]">Total Soil Volume:</div>
              <div className="text-4xl font-bold text-[var(--color-primary)] mt-2 animate-pulse" style={{animationDuration: '4s'}}>
                {formatVolumeResult(totalVolumeResult, displayUnit)}
              </div>
              <div className="mt-3">
                <select
                  value={displayUnit}
                  onChange={(e) => setDisplayUnit(e.target.value as VolumeUnit)}
                  className="input-glass text-sm border-2 border-transparent focus:border-[var(--color-primary)] transition-all"
                >
                  <option value="cubic_feet">Cubic Feet</option>
                  <option value="cubic_yards">Cubic Yards</option>
                  <option value="cubic_meters">Cubic Meters</option>
                  <option value="liters">Liters</option>
                  <option value="gallons">Gallons</option>
                </select>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-lg">
              <div className="text-sm text-[var(--color-muted)] mb-2">Also expressed as:</div>
              <div className="grid gap-2 mt-2">
                <div className="flex justify-between items-center py-1 border-b border-[var(--glass-border)]">
                  <span>Cubic Feet:</span>
                  <span className="font-medium text-[var(--color-primary)]">{totalVolumeResult.cubicFeet.toFixed(2)} ft³</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[var(--glass-border)]">
                  <span>Cubic Yards:</span>
                  <span className="font-medium text-[var(--color-secondary)]">{totalVolumeResult.cubicYards.toFixed(2)} yd³</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[var(--glass-border)]">
                  <span>Cubic Meters:</span>
                  <span className="font-medium text-[var(--color-accent)]">{totalVolumeResult.cubicMeters.toFixed(2)} m³</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Liters:</span>
                  <span className="font-medium text-[var(--color-success)]">{totalVolumeResult.liters.toFixed(2)} L</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel-fun p-5 mt-6 border-2 border-[var(--color-success)] hover-card">
            <h4 className="font-medium mb-2 text-[var(--color-success)]">🌱 Need help with soil?</h4>
            <p className="text-sm">
              Most garden beds perform best with a mix of:
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                <div className="bg-[var(--color-primary-light)] bg-opacity-20 p-2 rounded-lg">
                  <div className="font-bold">60%</div>
                  <div className="text-xs">Topsoil</div>
                </div>
                <div className="bg-[var(--color-accent)] bg-opacity-20 p-2 rounded-lg">
                  <div className="font-bold">30%</div>
                  <div className="text-xs">Compost</div>
                </div>
                <div className="bg-[var(--color-secondary)] bg-opacity-20 p-2 rounded-lg">
                  <div className="font-bold">10%</div>
                  <div className="text-xs">Aeration Material</div>
                </div>
              </div>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
