/**
 * Garden Soil Calculator - Calculation Library
 * Contains functions for calculating soil volumes for various garden bed shapes.
 */

export type DimensionUnit = 'inches' | 'feet' | 'cm' | 'meters';
export type VolumeUnit = 'cubic_feet' | 'cubic_yards' | 'cubic_meters' | 'liters' | 'gallons';

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: DimensionUnit;
}

export interface CircularDimensions {
  diameter: number;
  height: number;
  unit: DimensionUnit;
}

export interface VolumeResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  liters: number;
  gallons: number;
  displayUnit: VolumeUnit;
}

/**
 * Convert dimensions to a standard unit (feet) for calculations
 */
export function standardizeDimensions(value: number, fromUnit: DimensionUnit): number {
  switch (fromUnit) {
    case 'inches':
      return value / 12;
    case 'feet':
      return value;
    case 'cm':
      return value / 30.48;
    case 'meters':
      return value * 3.28084;
    default:
      return value;
  }
}

/**
 * Calculate volume for a rectangular garden bed
 */
export function calculateRectangularVolume(dimensions: Dimensions): VolumeResult {
  // Convert all dimensions to feet for calculation
  const lengthFt = standardizeDimensions(dimensions.length, dimensions.unit);
  const widthFt = standardizeDimensions(dimensions.width, dimensions.unit);
  const heightFt = standardizeDimensions(dimensions.height, dimensions.unit);
  
  // Calculate volume in cubic feet
  const cubicFeet = lengthFt * widthFt * heightFt;
  
  // Convert to other units
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet / 35.3147;
  const liters = cubicMeters * 1000;
  const gallons = cubicFeet * 7.48052;
  
  return {
    cubicFeet: Number(cubicFeet.toFixed(2)),
    cubicYards: Number(cubicYards.toFixed(2)),
    cubicMeters: Number(cubicMeters.toFixed(2)),
    liters: Number(liters.toFixed(2)),
    gallons: Number(gallons.toFixed(2)),
    displayUnit: 'cubic_feet'
  };
}

/**
 * Calculate volume for a circular garden bed
 */
export function calculateCircularVolume(dimensions: CircularDimensions): VolumeResult {
  // Convert all dimensions to feet for calculation
  const diameterFt = standardizeDimensions(dimensions.diameter, dimensions.unit);
  const heightFt = standardizeDimensions(dimensions.height, dimensions.unit);
  
  // Calculate radius in feet
  const radiusFt = diameterFt / 2;
  
  // Calculate volume in cubic feet (πr²h)
  const cubicFeet = Math.PI * Math.pow(radiusFt, 2) * heightFt;
  
  // Convert to other units
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet / 35.3147;
  const liters = cubicMeters * 1000;
  const gallons = cubicFeet * 7.48052;
  
  return {
    cubicFeet: Number(cubicFeet.toFixed(2)),
    cubicYards: Number(cubicYards.toFixed(2)),
    cubicMeters: Number(cubicMeters.toFixed(2)),
    liters: Number(liters.toFixed(2)),
    gallons: Number(gallons.toFixed(2)),
    displayUnit: 'cubic_feet'
  };
}

/**
 * Calculate soil cost based on volume and price per unit
 */
export function calculateSoilCost(volume: VolumeResult, pricePerUnit: number, unit: VolumeUnit): number {
  switch (unit) {
    case 'cubic_feet':
      return Number((volume.cubicFeet * pricePerUnit).toFixed(2));
    case 'cubic_yards':
      return Number((volume.cubicYards * pricePerUnit).toFixed(2));
    case 'cubic_meters':
      return Number((volume.cubicMeters * pricePerUnit).toFixed(2));
    case 'liters':
      return Number((volume.liters * pricePerUnit).toFixed(2));
    case 'gallons':
      return Number((volume.gallons * pricePerUnit).toFixed(2));
    default:
      return 0;
  }
}

/**
 * Format volume result for display
 */
export function formatVolumeResult(volume: VolumeResult, unit: VolumeUnit): string {
  switch (unit) {
    case 'cubic_feet':
      return `${volume.cubicFeet} ft³`;
    case 'cubic_yards':
      return `${volume.cubicYards} yd³`;
    case 'cubic_meters':
      return `${volume.cubicMeters} m³`;
    case 'liters':
      return `${volume.liters} L`;
    case 'gallons':
      return `${volume.gallons} gal`;
    default:
      return `${volume.cubicFeet} ft³`;
  }
}
