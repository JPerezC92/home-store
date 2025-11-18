const XLSX = require('xlsx');

const workbook = XLSX.readFile('ReporteTransacciones+51922076456.xlsx');
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

console.log('Total rows in file:', rawData.length);
console.log('Data rows (starting from row 6):', rawData.length - 5);

// Check rows starting from index 5 (row 6 in Excel)
const dataRows = rawData.slice(5);
let emptyCount = 0;
const emptyRows = [];

dataRows.forEach((row, index) => {
  const rowNumber = index + 6;
  if (!row || row.every((cell) => cell === null || cell === '')) {
    emptyCount++;
    emptyRows.push(rowNumber);
  }
});

console.log('\nEmpty rows found:', emptyCount);
console.log('Empty row numbers:', emptyRows);
console.log('\nNon-empty rows:', dataRows.length - emptyCount);
console.log('\nExpected valid records: 3339');
console.log('Actual calculation: total', dataRows.length, '- empty', emptyCount, '=', dataRows.length - emptyCount);
