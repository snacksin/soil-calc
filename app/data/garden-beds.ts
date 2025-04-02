/**
 * Garden Soil Calculator - Predefined Garden Beds
 * Contains standard dimensions for common garden bed sizes
 */

import { Dimensions, CircularDimensions } from "../lib/calculations";

export type GardenBedType = 'rectangular' | 'circular';

export interface GardenBedDefinition {
  id: string;
  name: string;
  type: GardenBedType;
  description?: string;
  dimensions: Dimensions | CircularDimensions;
  volumeCubicFeet?: number; // Pre-calculated volume for quick reference
}

/**
 * Predefined rectangular garden bed options
 */
export const rectangularBeds: GardenBedDefinition[] = [
  {
    id: 'classic-large',
    name: 'Classic Large',
    type: 'rectangular',
    description: 'Standard 4\' x 8\' raised bed commonly used in home gardens',
    dimensions: {
      length: 8,
      width: 4,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 32
  },
  {
    id: 'medium-rectangle',
    name: 'Medium Rectangle',
    type: 'rectangular',
    description: 'Medium 4\' x 6\' raised bed good for limited spaces',
    dimensions: {
      length: 6,
      width: 4,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 24
  },
  {
    id: 'small-square',
    name: 'Small Square',
    type: 'rectangular',
    description: 'Compact 4\' x 4\' raised bed ideal for small gardens',
    dimensions: {
      length: 4,
      width: 4,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 16
  },
  {
    id: 'long-narrow',
    name: 'Long Narrow',
    type: 'rectangular',
    description: 'Narrow 2\' x 8\' raised bed perfect for along fences or pathways',
    dimensions: {
      length: 8,
      width: 2,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 16
  },
  {
    id: 'birdies-large',
    name: 'Birdies Large',
    type: 'rectangular',
    description: 'Birdies brand 83" x 43" x 15" raised garden bed',
    dimensions: {
      length: 6.92, // 83 inches
      width: 3.58,  // 43 inches
      height: 15,
      lengthWidthUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 30.98 // Recalculated: (83/12) * (43/12) * (15/12) = 30.98
  },
  {
    id: 'birdies-mid-rectangular',
    name: 'Birdies Mid Rectangular',
    type: 'rectangular',
    description: 'Birdies brand 73" x 51" x 15" raised garden bed',
    dimensions: {
      length: 6.08, // 73 inches
      width: 4.25,  // 51 inches
      height: 15,
      lengthWidthUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 32.32 // Recalculated: (73/12) * (51/12) * (15/12) = 32.32
  },
  {
    id: 'birdies-square',
    name: 'Birdies Square',
    type: 'rectangular',
    description: 'Birdies brand 51" x 51" x 15" raised garden bed',
    dimensions: {
      length: 4.25, // 51 inches
      width: 4.25,  // 51 inches
      height: 15,
      lengthWidthUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 22.58 // Recalculated: (51/12) * (51/12) * (15/12) = 22.58
  },
  {
    id: 'shallow-square',
    name: 'Shallow Square',
    type: 'rectangular',
    description: 'Shallow 4\' x 4\' x 6" raised bed for shallow-rooted plants',
    dimensions: {
      length: 4,
      width: 4,
      height: 6, // 0.5 feet
      lengthWidthUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 8.00 // Recalculated: 4 * 4 * (6/12) = 8.00
  },
  {
    id: 'compact-square',
    name: 'Compact Square',
    type: 'rectangular',
    description: 'Small 3\' x 3\' raised bed for limited spaces',
    dimensions: {
      length: 3,
      width: 3,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 9
  },
  {
    id: 'large-square',
    name: 'Large Square',
    type: 'rectangular',
    description: 'Spacious 5\' x 5\' raised bed for larger gardens',
    dimensions: {
      length: 5,
      width: 5,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 25
  },
  {
    id: 'accessible-square',
    name: 'Accessible Square',
    type: 'rectangular',
    description: 'Tall 4\' x 4\' x 24" raised bed for accessible gardening',
    dimensions: {
      length: 4,
      width: 4,
      height: 24, // 2 feet
      lengthWidthUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 32.00 // Recalculated: 4 * 4 * (24/12) = 32.00
  },
  {
    id: 'birdies-medium-tall',
    name: 'Birdies Medium Tall',
    type: 'rectangular',
    description: 'Birdies brand 5\' x 3\' x 29" raised garden bed',
    dimensions: {
      length: 5, // Already in feet
      width: 3,  // Already in feet
      height: 29,
      lengthWidthUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 36.25 // Recalculated: 5 * 3 * (29/12) = 36.25
  },
  {
    id: 'long-thin',
    name: 'Long Thin',
    type: 'rectangular',
    description: 'Narrow 6\' x 2\' raised bed for borders',
    dimensions: {
      length: 6,
      width: 2,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 12
  },
  {
    id: 'standard-rectangle',
    name: 'Standard Rectangle',
    type: 'rectangular',
    description: 'Common 3\' x 6\' raised bed size',
    dimensions: {
      length: 6,
      width: 3,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 18
  },
  {
    id: 'extra-long-rectangle',
    name: 'Extra-Long Rectangle',
    type: 'rectangular',
    description: 'Extended 4\' x 10\' raised bed for larger gardens',
    dimensions: {
      length: 10,
      width: 4,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 40
  },
  {
    id: 'small-balcony-bed',
    name: 'Small Balcony Bed',
    type: 'rectangular',
    description: 'Compact 2\' x 6\' raised bed for balconies or small spaces',
    dimensions: {
      length: 6,
      width: 2,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 12
  },
  {
    id: 'birdies-narrow-xl',
    name: 'Birdies Narrow XL',
    type: 'rectangular',
    description: 'Birdies brand 102" x 24" x 15" raised garden bed',
    dimensions: {
      length: 8.5, // 102 inches
      width: 2,   // 24 inches
      height: 15,
      lengthWidthUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 21.25 // Recalculated: 8.5 * 2 * (15/12) = 21.25
  },
  {
    id: 'birdies-narrow-medium',
    name: 'Birdies Narrow Medium',
    type: 'rectangular',
    description: 'Birdies brand 65" x 24" x 15" raised garden bed',
    dimensions: {
      length: 5.42, // 65 inches
      width: 2,   // 24 inches
      height: 15,
      lengthWidthUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 13.54 // Recalculated: (65/12) * 2 * (15/12) = 13.54
  },
  {
    id: 'birdies-large-tall',
    name: 'Birdies Large Tall',
    type: 'rectangular',
    description: 'Large Birdies brand 6\' x 6\' x 30" raised garden bed',
    dimensions: {
      length: 6, // Already in feet
      width: 6,  // Already in feet
      height: 30,
      lengthWidthUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 90.00 // Recalculated: 6 * 6 * (30/12) = 90.00
  },
  {
    id: 'patio-narrow',
    name: 'Patio Narrow',
    type: 'rectangular',
    description: 'Long narrow 8\' x 2\' raised bed for patios',
    dimensions: {
      length: 8,
      width: 2,
      height: 1,
      lengthWidthUnit: 'feet',
      heightUnit: 'feet'
    },
    volumeCubicFeet: 16
  }
];

/**
 * Predefined circular garden bed options
 */
export const circularBeds: GardenBedDefinition[] = [
  {
    id: 'round-small',
    name: 'Round Small',
    type: 'circular',
    description: 'Small 36" diameter circular raised bed',
    dimensions: {
      diameter: 3, // 36 inches
      height: 12,
      diameterUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 7.07 // Recalculated: PI * (3/2)^2 * (12/12) = 7.07
  },
  {
    id: 'birdies-round-small',
    name: 'Birdies Round Small',
    type: 'circular',
    description: 'Birdies brand 38" diameter x 15" tall raised bed',
    dimensions: {
      diameter: 3.17, // 38 inches
      height: 15,
      diameterUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 9.85 // Recalculated: PI * ((38/12)/2)^2 * (15/12) = 9.85
  },
  {
    id: 'round-medium',
    name: 'Round Medium',
    type: 'circular',
    description: 'Medium 48" diameter circular raised bed',
    dimensions: {
      diameter: 4, // 48 inches
      height: 12,
      diameterUnit: 'feet',
      heightUnit: 'inches'
    },
    volumeCubicFeet: 12.57 // Recalculated: PI * (4/2)^2 * (12/12) = 12.57
  }
];

/**
 * All predefined garden beds combined
 */
export const allGardenBeds: GardenBedDefinition[] = [
  ...rectangularBeds,
  ...circularBeds
];

/**
 * Get a garden bed definition by ID
 */
export function getGardenBedById(id: string): GardenBedDefinition | undefined {
  return allGardenBeds.find(bed => bed.id === id);
}

/**
 * Group garden beds by type for display
 */
export function getGardenBedsByType(): Record<GardenBedType, GardenBedDefinition[]> {
  return {
    rectangular: rectangularBeds,
    circular: circularBeds
  };
}
