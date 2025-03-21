/**
 * Soil Calculator - Volume Calculation Test Utility
 * 
 * This script provides simple tests for the soil volume calculations.
 * Run with: node tests/calculation-tests.mjs
 */

// Mock the calculation functions since we're testing in Node.js but the code uses TypeScript
// In a real environment, we would use proper transpilation or testing tools like Jest

// Mock the CalculationError
class CalculationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CalculationError';
  }
}

// Mock functions based on our implementation
function standardizeDimensions(value, fromUnit) {
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

function calculateRectangularVolume(dimensions) {
  // Validate dimensions
  if (dimensions.length <= 0 || dimensions.width <= 0 || dimensions.height <= 0) {
    throw new CalculationError('All dimensions must be positive values');
  }
  
  // Convert all dimensions to feet
  const lengthFt = standardizeDimensions(dimensions.length, dimensions.unit);
  const widthFt = standardizeDimensions(dimensions.width, dimensions.unit);
  const heightFt = standardizeDimensions(dimensions.height, dimensions.unit);
  
  // Calculate volume in cubic feet
  const cubicFeet = lengthFt * widthFt * heightFt;
  
  // Convert to other units
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet * 0.0283168;
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

function calculateCircularVolume(dimensions) {
  // Validate dimensions
  if (dimensions.diameter <= 0 || dimensions.height <= 0) {
    throw new CalculationError('All dimensions must be positive values');
  }
  
  // Convert dimensions to feet
  const diameterFt = standardizeDimensions(dimensions.diameter, dimensions.unit);
  const heightFt = standardizeDimensions(dimensions.height, dimensions.unit);
  
  // Calculate radius in feet
  const radiusFt = diameterFt / 2;
  
  // Calculate volume in cubic feet (πr²h)
  const cubicFeet = Math.PI * Math.pow(radiusFt, 2) * heightFt;
  
  // Convert to other units
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicFeet * 0.0283168;
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

// Mock the modules for browser testing
if (typeof window === 'undefined') {
  global.console.group = global.console.group || console.log;
  global.console.groupEnd = global.console.groupEnd || (() => {});
}

/**
 * Test case runner
 */
function runTest(name, testFn) {
  console.group(`Test: ${name}`);
  try {
    testFn();
    console.log('✅ Passed');
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
  console.groupEnd();
}

/**
 * Assert function for tests
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Test standardize dimensions function
 */
function testStandardizeDimensions() {
  // Test inches to feet conversion
  let result = standardizeDimensions(12, 'inches');
  assert(Math.abs(result - 1) < 0.001, `Expected 12 inches to be 1 foot, got ${result}`);
  
  // Test feet to feet (no conversion)
  result = standardizeDimensions(3, 'feet');
  assert(Math.abs(result - 3) < 0.001, `Expected 3 feet to be 3 feet, got ${result}`);
  
  // Test cm to feet conversion
  result = standardizeDimensions(30.48, 'cm');
  assert(Math.abs(result - 1) < 0.001, `Expected 30.48 cm to be 1 foot, got ${result}`);
  
  // Test meters to feet conversion
  result = standardizeDimensions(1, 'meters');
  assert(Math.abs(result - 3.28084) < 0.001, `Expected 1 meter to be 3.28084 feet, got ${result}`);
  
  // Test error cases
  try {
    standardizeDimensions(null, 'feet');
    assert(false, 'Should throw error for null input');
  } catch (e) {
    assert(e.name === 'CalculationError', `Expected CalculationError, got ${e.name}`);
  }
}

/**
 * Test rectangular volume calculation
 */
function testRectangularVolume() {
  // Simple test case: 4ft × 3ft × 1ft = 12 cubic feet
  const dimensions = {
    length: 4,
    width: 3,
    height: 1,
    unit: 'feet'
  };
  
  const result = calculateRectangularVolume(dimensions);
  
  // Test cubic feet
  assert(Math.abs(result.cubicFeet - 12) < 0.01, 
    `Expected 12 cubic feet, got ${result.cubicFeet}`);
  
  // Test cubic yards (12 cubic feet ÷ 27 = 0.44 cubic yards)
  assert(Math.abs(result.cubicYards - 0.44) < 0.01, 
    `Expected 0.44 cubic yards, got ${result.cubicYards}`);
  
  // Test in inches
  const inchDimensions = {
    length: 48,
    width: 36, 
    height: 12,
    unit: 'inches'
  };
  
  const inchResult = calculateRectangularVolume(inchDimensions);
  assert(Math.abs(inchResult.cubicFeet - 12) < 0.01, 
    `Expected 12 cubic feet from inch measurements, got ${inchResult.cubicFeet}`);
  
  // Test error cases
  try {
    calculateRectangularVolume({
      length: -1,
      width: 3,
      height: 1,
      unit: 'feet'
    });
    assert(false, 'Should throw error for negative dimensions');
  } catch (e) {
    assert(e.name === 'CalculationError', `Expected CalculationError, got ${e.name}`);
  }
}

/**
 * Test circular volume calculation
 */
function testCircularVolume() {
  // Test case: 4ft diameter × 1ft height = π × 2² × 1 = 12.57 cubic feet
  const dimensions = {
    diameter: 4,
    height: 1,
    unit: 'feet'
  };
  
  const result = calculateCircularVolume(dimensions);
  const expected = Math.PI * Math.pow(2, 2) * 1;
  
  // Test cubic feet
  assert(Math.abs(result.cubicFeet - expected) < 0.01, 
    `Expected ${expected.toFixed(2)} cubic feet, got ${result.cubicFeet}`);
  
  // Test in inches
  const inchDimensions = {
    diameter: 48,
    height: 12,
    unit: 'inches'
  };
  
  const inchResult = calculateCircularVolume(inchDimensions);
  assert(Math.abs(inchResult.cubicFeet - expected) < 0.01, 
    `Expected ${expected.toFixed(2)} cubic feet from inch measurements, got ${inchResult.cubicFeet}`);
  
  // Test error cases
  try {
    calculateCircularVolume({
      diameter: 0,
      height: 1,
      unit: 'feet'
    });
    assert(false, 'Should throw error for zero diameter');
  } catch (e) {
    assert(e.name === 'CalculationError', `Expected CalculationError, got ${e.name}`);
  }
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('Starting Soil Calculator Tests...\n');
  
  runTest('Unit Conversion', testStandardizeDimensions);
  runTest('Rectangular Volume', testRectangularVolume);
  runTest('Circular Volume', testCircularVolume);
  
  console.log('\nTest Summary:');
  console.log('------------');
  console.log('All tests completed.');
}

// Run tests automatically
runAllTests();

// For browser testing if needed
export {
  runAllTests,
  testStandardizeDimensions,
  testRectangularVolume,
  testCircularVolume
};