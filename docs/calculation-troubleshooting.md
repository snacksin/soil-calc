# Soil Calculator: Calculation Troubleshooting Quick Guide

This document provides a quick reference for troubleshooting calculation issues in the Garden Soil Calculator application.

## Common Issues

1. **Incorrect Volume Results**
   - Check unit conversions - make sure all dimensions are properly converted to the standard unit (feet)
   - Verify the calculation formulas are correctly implemented (rectangular: l×w×h, circular: πr²h)
   - Ensure dimensions are positive values

2. **Unexpected Zero or NaN Results**
   - Input validation may be missing
   - Check for division by zero
   - Verify that null/undefined values are properly handled

3. **State Management Issues**
   - Verify the result is correctly stored in state
   - Check that dependencies in useEffect are correct
   - Ensure calculation happens before accessing results

## How to Use the Testing Utilities

We've created testing utilities to help verify the calculation functionality:

1. **Run the Test Script**:
   ```bash
   cd soil-calculator
   node tests/calculation-tests.mjs
   ```

2. **Expected Output**:
   - The tests check unit conversions, rectangular volume, and circular volume calculations
   - Each test will show as "✅ Passed" or "❌ Failed" with error details
   - Use failed tests to identify exactly where calculations are breaking

3. **Add Your Own Test Cases**:
   - Open `tests/calculation-tests.mjs`
   - Add new test cases to the existing functions or create new test functions
   - Make sure to add your new test functions to the `runAllTests` function

## Quick Fixes for Common Problems

### Fix Incorrect Unit Conversion

```javascript
// Precise unit conversion factors
export function standardizeDimensions(value: number, fromUnit: DimensionUnit): number {
  // Check for null/undefined
  if (value === undefined || value === null) {
    throw new CalculationError('Dimension value cannot be null');
  }
  
  // Return precise conversions
  switch (fromUnit) {
    case 'inches': return value / 12;
    case 'feet': return value;
    case 'cm': return value / 30.48;
    case 'meters': return value * 3.28084;
    default: return value;
  }
}
```

### Fix Dimension Validation

```javascript
// Add this validation before calculations
function validateDimensions(dimensions) {
  if (dimensions.length <= 0 || dimensions.width <= 0 || dimensions.height <= 0) {
    throw new Error('All dimensions must be positive values');
  }
}
```

### Fix Volume Display Formatting

```javascript
// Format volume with proper units
function formatVolumeResult(volume, unit) {
  if (!volume) return '0';
  
  switch (unit) {
    case 'cubic_feet': return `${volume.cubicFeet.toFixed(2)} ft³`;
    case 'cubic_yards': return `${volume.cubicYards.toFixed(2)} yd³`;
    case 'cubic_meters': return `${volume.cubicMeters.toFixed(2)} m³`;
    case 'liters': return `${volume.liters.toFixed(2)} L`;
    case 'gallons': return `${volume.gallons.toFixed(2)} gal`;
    default: return `${volume.cubicFeet.toFixed(2)} ft³`;
  }
}
```

## Advanced Troubleshooting

For more detailed troubleshooting information, refer to the comprehensive guide:

[Custom Volume Calculation Troubleshooting Guide](/docs/custom-volume-calculation-troubleshooting-guide.md)

This guide includes:
- Detailed debugging procedures
- Code implementation examples
- Edge case handling
- Error handling best practices
- Testing methodologies

## Need More Help?

If you continue to experience issues with the calculation functionality:

1. Check the browser console for detailed error messages
2. Verify that all input values are within expected ranges
3. Use console.log statements to trace calculation steps
4. Run the test utilities to isolate specific calculation issues