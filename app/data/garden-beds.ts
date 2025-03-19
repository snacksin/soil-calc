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
      unit: 'feet'
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
      unit: 'feet'
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
      unit: 'feet'
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
      unit: 'feet'
    },
    volumeCubicFeet: 16
  },
  {
    id: 'birdies-large',
    name: 'Birdies Large',
    type: 'rectangular',
    description: 'Birdies brand 83" x 43" x 15" raised garden bed',
    dimensions: {
      length: 83,
      width: 43,
      height: 15,
      unit: 'inches'
    },
    volumeCubicFeet: 30.98
  },
  {
    id: 'birdies-mid-rectangular',
    name: 'Birdies Mid Rectangular',
    type: 'rectangular',
    description: 'Birdies brand 73" x 51" x 15" raised garden bed',
    dimensions: {
      length: 73,
      width: 51,
      height: 15,
      unit: 'inches'
    },
    volumeCubicFeet: 32
  },
  {
    id: 'birdies-square',
    name: 'Birdies Square',
    type: 'rectangular',
    description: 'Birdies brand 51" x 51" x 15" raised garden bed',
    dimensions: {
      length: 51,
      width: 51,
      height: 15,
      unit: 'inches'
    },
    volumeCubicFeet: 22.40
  },
  {
    id: 'shallow-square',
    name: 'Shallow Square',
    type: 'rectangular',
    description: 'Shallow 4\' x 4\' x 6" raised bed for shallow-rooted plants',
    dimensions: {
      length: 4,
      width: 4,
      height: 0.5,
      unit: 'feet'
    },
    volumeCubicFeet: 8
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
      unit: 'feet'
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
      unit: 'feet'
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
      height: 2,
      unit: 'feet'
    },
    volumeCubicFeet: 32
  },
  {
    id: 'birdies-medium-tall',
    name: 'Birdies Medium Tall',
    type: 'rectangular',
    description: 'Birdies brand 5\' x 3\' x 29" raised garden bed',
    dimensions: {
      length: 5,
      width: 3,
      height: 29,
      unit: 'inches'
    },
    volumeCubicFeet: 36.25
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
      unit: 'feet'
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
      unit: 'feet'
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
      unit: 'feet'
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
      unit: 'feet'
    },
    volumeCubicFeet: 12
  },
  {
    id: 'birdies-narrow-xl',
    name: 'Birdies Narrow XL',
    type: 'rectangular',
    description: 'Birdies brand 102" x 24" x 15" raised garden bed',
    dimensions: {
      length: 102,
      width: 24,
      height: 15,
      unit: 'inches'
    },
    volumeCubicFeet: 21.25
  },
  {
    id: 'birdies-narrow-medium',
    name: 'Birdies Narrow Medium',
    type: 'rectangular',
    description: 'Birdies brand 65" x 24" x 15" raised garden bed',
    dimensions: {
      length: 65,
      width: 24,
      height: 15,
      unit: 'inches'
    },
    volumeCubicFeet: 13.50
  },
  {
    id: 'birdies-large-tall',
    name: 'Birdies Large Tall',
    type: 'rectangular',
    description: 'Large Birdies brand 6\' x 6\' x 30" raised garden bed',
    dimensions: {
      length: 6,
      width: 6,
      height: 30,
      unit: 'inches'
    },
    volumeCubicFeet: 90
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
      unit: 'feet'
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
      diameter: 36,
      height: 12,
      unit: 'inches'
    },
    volumeCubicFeet: 7.07
  },
  {
    id: 'birdies-round-small',
    name: 'Birdies Round Small',
    type: 'circular',
    description: 'Birdies brand 38" diameter x 15" tall raised bed',
    dimensions: {
      diameter: 38,
      height: 15,
      unit: 'inches'
    },
    volumeCubicFeet: 9.85
  },
  {
    id: 'round-medium',
    name: 'Round Medium',
    type: 'circular',
    description: 'Medium 48" diameter circular raised bed',
    dimensions: {
      diameter: 48,
      height: 12,
      unit: 'inches'
    },
    volumeCubicFeet: 12.57
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
