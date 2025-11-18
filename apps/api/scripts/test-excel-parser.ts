import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const EXCEL_FILE_PATH = path.join(__dirname, '..', 'ReporteTransacciones+51922076456.xlsx');

function parseExcelFile() {
  console.log('========================================');
  console.log('EXCEL FILE PARSER TEST');
  console.log('========================================\n');

  // Check if file exists
  if (!fs.existsSync(EXCEL_FILE_PATH)) {
    console.error(`Error: File not found at ${EXCEL_FILE_PATH}`);
    process.exit(1);
  }

  console.log(`Reading file: ${EXCEL_FILE_PATH}\n`);

  // Read the Excel file
  const workbook = XLSX.readFile(EXCEL_FILE_PATH);

  // Display sheet names
  console.log('Sheet Names:');
  workbook.SheetNames.forEach((name, index) => {
    console.log(`  ${index + 1}. ${name}`);
  });
  console.log('');

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  console.log(`Parsing sheet: "${sheetName}"\n`);

  // Convert to JSON with header row
  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1, // Return as array of arrays
    defval: null // Use null for empty cells
  });

  console.log(`Total rows in sheet: ${jsonData.length}\n`);

  // Display first 10 rows to see the structure
  console.log('First 10 rows (raw data):');
  console.log('========================================');
  jsonData.slice(0, 10).forEach((row, index) => {
    console.log(`Row ${index}:`, row);
  });
  console.log('');

  // Check if row 5 contains headers (index 4 in 0-based array)
  if (jsonData.length > 4) {
    console.log('Row 5 (Expected Headers - Index 4):');
    console.log(jsonData[4]);
    console.log('');
  }

  // Parse data starting from row 6 (index 5)
  if (jsonData.length > 5) {
    const headers = jsonData[4] as string[]; // Row 5 as headers
    const dataRows = jsonData.slice(5) as any[][]; // Rows from 6 onwards

    console.log('Headers (Row 5):');
    headers.forEach((header, index) => {
      console.log(`  Column ${index}: "${header}"`);
    });
    console.log('');

    console.log(`Data rows count: ${dataRows.length}\n`);

    // Display first 5 data rows as objects
    console.log('First 5 data rows (as objects):');
    console.log('========================================');
    dataRows.slice(0, 5).forEach((row, index) => {
      const rowObject: any = {};
      headers.forEach((header, colIndex) => {
        rowObject[header] = row[colIndex];
      });
      console.log(`\nRow ${index + 6}:`);
      console.log(JSON.stringify(rowObject, null, 2));
    });
    console.log('');

    // Analyze data types and values
    console.log('Data Analysis:');
    console.log('========================================');

    const columnAnalysis: any = {};
    headers.forEach((header, colIndex) => {
      const values = dataRows.map(row => row[colIndex]).filter(val => val !== null && val !== undefined);

      const types = new Set(values.map(val => typeof val));
      const sampleValues = values.slice(0, 3);

      columnAnalysis[header] = {
        position: colIndex,
        dataTypes: Array.from(types),
        nonNullCount: values.length,
        totalCount: dataRows.length,
        sampleValues: sampleValues
      };
    });

    Object.entries(columnAnalysis).forEach(([header, analysis]: [string, any]) => {
      console.log(`\n"${header}":`);
      console.log(`  Position: ${analysis.position}`);
      console.log(`  Data Types: ${analysis.dataTypes.join(', ')}`);
      console.log(`  Non-null values: ${analysis.nonNullCount}/${analysis.totalCount}`);
      console.log(`  Sample values:`, analysis.sampleValues);
    });
    console.log('');

    // Statistics
    console.log('\nData Statistics:');
    console.log('========================================');
    console.log(`Total data rows: ${dataRows.length}`);
    console.log(`Complete rows (no nulls): ${dataRows.filter(row => row.every(cell => cell !== null && cell !== undefined)).length}`);
    console.log(`Empty rows: ${dataRows.filter(row => row.every(cell => cell === null || cell === undefined)).length}`);
  }

  console.log('\n========================================');
  console.log('PARSING COMPLETE');
  console.log('========================================');
}

// Run the parser
try {
  parseExcelFile();
} catch (error) {
  console.error('Error parsing Excel file:', error);
  process.exit(1);
}
