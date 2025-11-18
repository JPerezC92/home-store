import XLSX from 'xlsx';
import * as path from 'path';

const originalFile = path.join(__dirname, '..', 'ReporteTransacciones+51922076456.xlsx');
const testFile = path.join(__dirname, '..', 'TestFileWithErrors.xlsx');

// Read original file
const workbook = XLSX.readFile(originalFile);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to array
const data = XLSX.utils.sheet_to_json(worksheet, {
  header: 1,
  defval: null,
}) as any[][];

// Create new test data with errors
const testData = [
  data[0], // Title row
  data[1], // Empty row
  data[2], // Empty row
  data[3], // Empty row
  data[4], // Headers row (row 5)

  // Valid row 1 (row 6)
  ['Te pagó', '+51999999999', '+51922076456', 50.00, 'Pago prueba 1', '01/01/2025 10:00:00'],

  // Valid row 2 (row 7)
  ['Te pagó', '+51888888888', '+51922076456', 100.50, 'Pago prueba 2', '02/01/2025 15:30:00'],

  // ERROR: Missing amount (row 8)
  ['Te pagó', '+51777777777', '+51922076456', null, 'Error: sin monto', '03/01/2025 12:00:00'],

  // Valid row 3 (row 9)
  ['Pagaste', '+51922076456', '+51666666666', 25.75, 'Pago prueba 3', '04/01/2025 09:15:00'],

  // ERROR: Negative amount (row 10)
  ['Te pagó', '+51555555555', '+51922076456', -50.00, 'Error: monto negativo', '05/01/2025 14:20:00'],

  // DUPLICATE of row 6 (row 11)
  ['Te pagó', '+51999999999', '+51922076456', 50.00, 'Pago duplicado', '01/01/2025 10:00:00'],

  // Valid row 4 (row 12)
  ['Te pagó', '+51444444444', '+51922076456', 75.25, 'Pago prueba 4', '06/01/2025 16:45:00'],

  // ERROR: Missing origin (row 13)
  ['Te pagó', null, '+51922076456', 30.00, 'Error: sin origen', '07/01/2025 11:30:00'],

  // DUPLICATE of row 7 (row 14)
  ['Te pagó', '+51888888888', '+51922076456', 100.50, 'Otro duplicado', '02/01/2025 15:30:00'],

  // Valid row 5 (row 15)
  ['Pagaste', '+51922076456', '+51333333333', 15.00, 'Pago prueba 5', '08/01/2025 13:00:00'],

  // ERROR: Invalid date format (row 16)
  ['Te pagó', '+51222222222', '+51922076456', 45.00, 'Error: fecha inválida', 'fecha-invalida'],

  // Valid row 6 (row 17)
  ['Te pagó', '+51111111111', '+51922076456', 80.00, 'Pago prueba 6', '09/01/2025 17:20:00'],
];

// Create new workbook
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.aoa_to_sheet(testData);

// Add to workbook
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

// Write file
XLSX.writeFile(newWorkbook, testFile);

console.log(`\nTest file created: ${testFile}`);
console.log('\nExpected results:');
console.log('- Total records: 12 (rows 6-17)');
console.log('- Valid records: 6 (rows 6, 7, 9, 12, 15, 17)');
console.log('- Duplicate records: 2 (rows 11, 14)');
console.log('- Invalid records: 4 (rows 8, 10, 13, 16)');
console.log('\nErrors:');
console.log('  Row 8:  Missing amount');
console.log('  Row 10: Negative amount');
console.log('  Row 13: Missing origin');
console.log('  Row 16: Invalid date format');
console.log('\nDuplicates:');
console.log('  Row 11: Duplicate of row 6');
console.log('  Row 14: Duplicate of row 7');
