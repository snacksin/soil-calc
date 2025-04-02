/**
 * Garden Soil Calculator - Calculation Library
 * Contains functions for calculating soil volumes for various garden bed shapes.
 * Includes validations, precise conversions, and error handling.
 */

export type DimensionUnit = 'inches' | 'feet' | 'cm' | 'meters';
export type VolumeUnit = 'cubic_feet' | 'cubic_yards' | 'cubic_meters' | 'liters' | 'gallons';

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  lengthWidthUnit: DimensionUnit;
  heightUnit: DimensionUnit;
}

export interface CircularDimensions {
  diameter: number;
  height: number;
  diameterUnit: DimensionUnit;
  heightUnit: DimensionUnit;
}

export interface VolumeResult {
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  liters: number;
  gallons: number;
  displayUnit: VolumeUnit;
}

// Error class for calculation errors
export class CalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CalculationError';
  }
}

/**
 * Validate dimensions before calculations
 */
export function validateDimensions(dimensions: Dimensions | CircularDimensions): void {
  // Check for negative or zero values
  if ('length' in dimensions) {
    if (dimensions.length <= 0) {
      throw new CalculationError('Length must be a positive number');
    }
    if (dimensions.width <= 0) {
      throw new CalculationError('Width must be a positive number');
    }
  } else if ('diameter' in dimensions) {
    if (dimensions.diameter <= 0) {
      throw new CalculationError('Diameter must be a positive number');
    }
  }
  
  if (dimensions.height <= 0) {
    throw new CalculationError('Height must be a positive number');
  }
  
  // Check for extremely large values that might cause calculation issues
  const MAX_DIMENSION = 1000; // feet
  
  if ('length' in dimensions) {
    const lengthFt = standardizeDimensions(dimensions.length, dimensions.lengthWidthUnit);
    const widthFt = standardizeDimensions(dimensions.width, dimensions.lengthWidthUnit);
    if (lengthFt > MAX_DIMENSION) {
      throw new CalculationError(`Length exceeds maximum allowed value (${MAX_DIMENSION} feet when converted)`);
    }
    if (widthFt > MAX_DIMENSION) {
      throw new CalculationError(`Width exceeds maximum allowed value (${MAX_DIMENSION} feet when converted)`);
    }
  } else if ('diameter' in dimensions) {
    const diameterFt = standardizeDimensions(dimensions.diameter, dimensions.diameterUnit);
    if (diameterFt > MAX_DIMENSION) {
      throw new CalculationError(`Diameter exceeds maximum allowed value (${MAX_DIMENSION} feet when converted)`);
    }
  }
  
  const heightFt = standardizeDimensions(dimensions.height, dimensions.heightUnit);
  if (heightFt > MAX_DIMENSION) {
    throw new CalculationError(`Height exceeds maximum allowed value (${MAX_DIMENSION} feet when converted)`);
  }
}

/**
 * Convert dimensions to a standard unit (feet) for calculations
 * Uses precise conversion factors and validates input
 */
export function standardizeDimensions(value: number, fromUnit: DimensionUnit): number {
  if (value === undefined || value === null) {
    throw new CalculationError('Dimension value cannot be null or undefined');
  }
  
  // Use precise conversion factors
  switch (fromUnit) {
    case 'inches':
      return value / 12;
    case 'feet':
      return value;
    case 'cm':
      return value / 30.48; // Exact conversion factor
    case 'meters':
      return value * 3.28084; // Exact conversion factor
    default:
      console.warn(`Unknown unit: ${fromUnit}, defaulting to feet`);
      return value;
  }
}

/**
 * Calculate volume for a rectangular garden bed
 * Includes input validation and precise calculations
 */
export function calculateRectangularVolume(dimensions: Dimensions): VolumeResult {
  try {
    // Validate inputs
    validateDimensions(dimensions);
    
    // Convert all dimensions to feet for calculation (with higher precision)
    const lengthFt = standardizeDimensions(dimensions.length, dimensions.lengthWidthUnit);
    const widthFt = standardizeDimensions(dimensions.width, dimensions.lengthWidthUnit);
    const heightFt = standardizeDimensions(dimensions.height, dimensions.heightUnit);
    
    // Calculate volume in cubic feet - keep full precision during calculation
    const cubicFeet = lengthFt * widthFt * heightFt;
    
    // Use more precise conversion factors
    const cubicYards = cubicFeet / 27;
    const cubicMeters = cubicFeet * 0.0283168; // More precise conversion
    const liters = cubicMeters * 1000;
    const gallons = cubicFeet * 7.48052;
    
    // Only round at the final display step
    return {
      cubicFeet: Number(cubicFeet.toFixed(2)),
      cubicYards: Number(cubicYards.toFixed(2)),
      cubicMeters: Number(cubicMeters.toFixed(2)),
      liters: Number(liters.toFixed(2)),
      gallons: Number(gallons.toFixed(2)),
      displayUnit: 'cubic_feet'
    };
  } catch (error) {
    if (error instanceof CalculationError) {
      throw error;
    } else {
      throw new CalculationError(`Error calculating rectangular volume: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Calculate volume for a circular garden bed
 * Includes input validation and precise calculations
 */
export function calculateCircularVolume(dimensions: CircularDimensions): VolumeResult {
  try {
    // Validate inputs
    validateDimensions(dimensions);
    
    // Convert all dimensions to feet for calculation
    const diameterFt = standardizeDimensions(dimensions.diameter, dimensions.diameterUnit);
    const heightFt = standardizeDimensions(dimensions.height, dimensions.heightUnit);
    
    // Calculate radius in feet
    const radiusFt = diameterFt / 2;
    
    // Calculate volume in cubic feet (πr²h) - keep full precision during calculation
    const cubicFeet = Math.PI * Math.pow(radiusFt, 2) * heightFt;
    
    // Use more precise conversion factors
    const cubicYards = cubicFeet / 27;
    const cubicMeters = cubicFeet * 0.0283168; // More precise conversion
    const liters = cubicMeters * 1000;
    const gallons = cubicFeet * 7.48052;
    
    // Only round at the final display step
    return {
      cubicFeet: Number(cubicFeet.toFixed(2)),
      cubicYards: Number(cubicYards.toFixed(2)),
      cubicMeters: Number(cubicMeters.toFixed(2)),
      liters: Number(liters.toFixed(2)),
      gallons: Number(gallons.toFixed(2)),
      displayUnit: 'cubic_feet'
    };
  } catch (error) {
    if (error instanceof CalculationError) {
      throw error;
    } else {
      throw new CalculationError(`Error calculating circular volume: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Calculate soil cost based on volume and price per unit
 * Adds validation and error handling
 */
export function calculateSoilCost(volume: VolumeResult, pricePerUnit: number, unit: VolumeUnit): number {
  if (!volume) {
    throw new CalculationError('Volume result cannot be null or undefined');
  }
  
  if (pricePerUnit < 0) {
    throw new CalculationError('Price per unit cannot be negative');
  }
  
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
      console.warn(`Unknown volume unit: ${unit}, defaulting to cubic feet`);
      return Number((volume.cubicFeet * pricePerUnit).toFixed(2));
  }
}

/**
 * Format volume result for display
 * Adds null checking and default handling
 */
export function formatVolumeResult(volume: VolumeResult, unit: VolumeUnit): string {
  if (!volume) {
    return '0 ft³';
  }
  
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

/**
 * Safe wrapper for volume calculations that handles errors gracefully
 * Returns null instead of throwing exceptions
 */
export function safeCalculateVolume(
  dimensions: Dimensions | CircularDimensions,
  shapeType: 'rectangular' | 'circular'
): VolumeResult | null {
  try {
    // Perform calculation based on shape type
    if (shapeType === 'rectangular' && 'length' in dimensions) {
      return calculateRectangularVolume(dimensions);
    } else if (shapeType === 'circular' && 'diameter' in dimensions) {
      return calculateCircularVolume(dimensions);
    } else {
      console.error(`Mismatch between shape type (${shapeType}) and dimensions`);
      return null;
    }
  } catch (error) {
    console.error('Calculation error:', error);
    return null;
  }
}
