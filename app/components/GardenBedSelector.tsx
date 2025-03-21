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
    
    // Allow duplicate bed entries by generating a unique id for each addition
    setSelectedBeds([...selectedBeds, {
      id: selectedBedId + '-' + Date.now(),
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
    <div className="siimple-card siimple-content">
      <h2 className="siimple-h2">Garden Bed Soil Calculator</h2>
      
      {/* Shape Type Tabs */}
      <div className="siimple-tabs">
        <button
          className={`siimple-btn ${activeTab === 'rectangular' ? 'siimple-btn--primary' : 'siimple-btn--light'}`}
          onClick={() => setActiveTab('rectangular')}
        >
          <div>
            <RectangleIcon />
          </div>
          Rectangular
        </button>
        <button
          className={`siimple-btn ${activeTab === 'circular' ? 'siimple-btn--primary' : 'siimple-btn--light'}`}
          onClick={() => setActiveTab('circular')}
        >
          <div>
            <CircleIcon />
          </div>
          Circular
        </button>
        <button
          className={`siimple-btn ${activeTab === 'custom' ? 'siimple-btn--primary' : 'siimple-btn--light'}`}
          onClick={() => setActiveTab('custom')}
        >
          Custom
        </button>
      </div>
      
      {/* Bed Selection - Dropdown with Add Button */}
      {(activeTab === 'rectangular' || activeTab === 'circular') && (
        <div className="siimple-form siimple-content">
          <div className="siimple-form-row">
            <div className="siimple-form-field">
              <label className="siimple-label">Select a garden bed</label>
              <select
                className="siimple-select"
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
              className="siimple-btn siimple-btn--primary"
              onClick={addSelectedBed}
            >
              Add Bed
            </button>
          </div>
          
          {/* Preview of selected bed */}
          {volumeResult && (
            <div className="siimple-card">
              <div className="siimple-h5">
                {allGardenBeds.find(b => b.id === selectedBedId)?.name}
              </div>
              <div className="siimple-small">
                {renderBedDimensions(allGardenBeds.find(b => b.id === selectedBedId)!)}
              </div>
              <div className="siimple-paragraph">
                Volume: <span className="siimple-h4">{formatVolumeResult(applyFillFactor(volumeResult, fillFactor), 'cubic_feet')}</span>
              </div>
              <div className="siimple-form-field">
                <label className="siimple-label">Fill Level</label>
                <select
                  value={fillFactor}
                  onChange={(e) => setFillFactor(parseFloat(e.target.value))}
                  className="siimple-select"
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
        <div className="siimple-content">
          <div className="siimple-btn-group">
            <button
              className={`siimple-btn ${customShapeType === 'rectangular' ? 'siimple-btn--primary' : 'siimple-btn--light'}`}
              onClick={() => setCustomShapeType('rectangular')}
            >
              <span>
                <RectangleIcon /> Rectangular
              </span>
            </button>
            <button
              className={`siimple-btn ${customShapeType === 'circular' ? 'siimple-btn--primary' : 'siimple-btn--light'}`}
              onClick={() => setCustomShapeType('circular')}
            >
              <span>
                <CircleIcon /> Circular
              </span>
            </button>
          </div>
          
          {customShapeType === 'rectangular' && (
            <div className="siimple-card">
              <h3 className="siimple-h3">Custom Rectangular Bed</h3>
              <div className="siimple-grid">
                <div className="siimple-grid-row">
                  <div className="siimple-grid-col siimple-grid-col--4">
                    <div className="siimple-form-field">
                      <label className="siimple-label">Length</label>
                      <input
                        type="number"
                        value={customRectangular.length}
                        onChange={(e) => setCustomRectangular({...customRectangular, length: parseFloat(e.target.value)})}
                        className="siimple-input"
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="siimple-grid-col siimple-grid-col--4">
                    <div className="siimple-form-field">
                      <label className="siimple-label">Width</label>
                      <input
                        type="number"
                        value={customRectangular.width}
                        onChange={(e) => setCustomRectangular({...customRectangular, width: parseFloat(e.target.value)})}
                        className="siimple-input"
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="siimple-grid-col siimple-grid-col--4">
                    <div className="siimple-form-field">
                      <label className="siimple-label">Height</label>
                      <input
                        type="number"
                        value={customRectangular.height}
                        onChange={(e) => setCustomRectangular({...customRectangular, height: parseFloat(e.target.value)})}
                        className="siimple-input"
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="siimple-form-field">
                <label className="siimple-label">Unit</label>
                <select
                  value={customRectangular.unit}
                  onChange={(e) => setCustomRectangular({
                    ...customRectangular,
                    unit: e.target.value as 'inches' | 'feet' | 'cm' | 'meters'
                  })}
                  className="siimple-select"
                >
                  <option value="feet">Feet</option>
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
              <div className="siimple-btn-group">
                <button
                  className="siimple-btn siimple-btn--primary"
                  onClick={calculateCustomVolume}
                >
                  Calculate Volume
                </button>
                {volumeResult && (
                  <button
                    className="siimple-btn siimple-btn--success"
                    onClick={addCustomBed}
                  >
                    Add Bed
                  </button>
                )}
              </div>
            </div>
          )}
          
          {customShapeType === 'circular' && (
            <div className="siimple-card">
              <h3 className="siimple-h3">Custom Circular Bed</h3>
              <div className="siimple-grid">
                <div className="siimple-grid-row">
                  <div className="siimple-grid-col siimple-grid-col--6">
                    <div className="siimple-form-field">
                      <label className="siimple-label">Diameter</label>
                      <input
                        type="number"
                        value={customCircular.diameter}
                        onChange={(e) => setCustomCircular({...customCircular, diameter: parseFloat(e.target.value)})}
                        className="siimple-input"
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="siimple-grid-col siimple-grid-col--6">
                    <div className="siimple-form-field">
                      <label className="siimple-label">Height</label>
                      <input
                        type="number"
                        value={customCircular.height}
                        onChange={(e) => setCustomCircular({...customCircular, height: parseFloat(e.target.value)})}
                        className="siimple-input"
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="siimple-form-field">
                <label className="siimple-label">Unit</label>
                <select
                  value={customCircular.unit}
                  onChange={(e) => setCustomCircular({
                    ...customCircular,
                    unit: e.target.value as 'inches' | 'feet' | 'cm' | 'meters'
                  })}
                  className="siimple-select"
                >
                  <option value="feet">Feet</option>
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters</option>
                  <option value="meters">Meters</option>
                </select>
              </div>
              <div className="siimple-btn-group">
                <button
                  className="siimple-btn siimple-btn--primary"
                  onClick={calculateCustomVolume}
                >
                  Calculate Volume
                </button>
                {volumeResult && (
                  <button
                    className="siimple-btn siimple-btn--success"
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
        <div className="siimple-card siimple-content">
          <h3 className="siimple-h3">Selected Garden Beds</h3>
          <div className="siimple-list">
            {selectedBeds.map((entry) => {
              const bed = entry.bed;
              return (
                <div
                  key={entry.id}
                  className="siimple-list-item"
                >
                  <div className="siimple-grid">
                    <div className="siimple-grid-row">
                      <div className="siimple-grid-col siimple-grid-col--8">
                        <div className="siimple-h5">{bed.name}</div>
                        <div className="siimple-small">
                          {renderBedDimensions(bed)}
                        </div>
                        <div className="siimple-paragraph">
                          Volume: {formatVolumeResult(applyFillFactor(entry.volumeResult, fillFactor), 'cubic_feet')}
                        </div>
                      </div>
                      <div className="siimple-grid-col siimple-grid-col--4">
                        <button
                          className="siimple-btn siimple-btn--error"
                          onClick={() => removeBed(entry.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Total Results Section */}
      {totalVolumeResult && (
        <div className="siimple-card siimple-content">
          <h3 className="siimple-h3">Total Soil Needed</h3>
          
          <div className="siimple-grid">
            <div className="siimple-grid-row">
              <div className="siimple-grid-col siimple-grid-col--6">
                <div className="siimple-small">Total Soil Volume:</div>
                <div className="siimple-h1">
                  {formatVolumeResult(totalVolumeResult, displayUnit)}
                </div>
                <div className="siimple-form-field">
                  <select
                    value={displayUnit}
                    onChange={(e) => setDisplayUnit(e.target.value as VolumeUnit)}
                    className="siimple-select"
                  >
                    <option value="cubic_feet">Cubic Feet</option>
                    <option value="cubic_yards">Cubic Yards</option>
                    <option value="cubic_meters">Cubic Meters</option>
                    <option value="liters">Liters</option>
                    <option value="gallons">Gallons</option>
                  </select>
                </div>
              </div>
              
              <div className="siimple-grid-col siimple-grid-col--6">
                <div className="siimple-card">
                  <div className="siimple-small">Also expressed as:</div>
                  <div className="siimple-list">
                    <div className="siimple-list-item">
                      <span>Cubic Feet:</span>
                      <span className="siimple-tag siimple-tag--primary">{totalVolumeResult.cubicFeet.toFixed(2)} ft³</span>
                    </div>
                    <div className="siimple-list-item">
                      <span>Cubic Yards:</span>
                      <span className="siimple-tag siimple-tag--success">{totalVolumeResult.cubicYards.toFixed(2)} yd³</span>
                    </div>
                    <div className="siimple-list-item">
                      <span>Cubic Meters:</span>
                      <span className="siimple-tag siimple-tag--info">{totalVolumeResult.cubicMeters.toFixed(2)} m³</span>
                    </div>
                    <div className="siimple-list-item">
                      <span>Liters:</span>
                      <span className="siimple-tag siimple-tag--warning">{totalVolumeResult.liters.toFixed(2)} L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="siimple-alert siimple-alert--success">
            <h4 className="siimple-h5">🌱 Need help with soil?</h4>
            <p className="siimple-paragraph">
              Most garden beds perform best with a mix of:
            </p>
            <div className="siimple-grid">
              <div className="siimple-grid-row">
                <div className="siimple-grid-col siimple-grid-col--4">
                  <div className="siimple-card siimple-card--primary">
                    <div className="siimple-h4">60%</div>
                    <div className="siimple-small">Topsoil</div>
                  </div>
                </div>
                <div className="siimple-grid-col siimple-grid-col--4">
                  <div className="siimple-card siimple-card--info">
                    <div className="siimple-h4">30%</div>
                    <div className="siimple-small">Compost</div>
                  </div>
                </div>
                <div className="siimple-grid-col siimple-grid-col--4">
                  <div className="siimple-card siimple-card--warning">
                    <div className="siimple-h4">10%</div>
                    <div className="siimple-small">Aeration Material</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
