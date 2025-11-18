export class ExcelFileNotFoundError extends Error {
  constructor(fileName: string) {
    super(`Excel file not found: ${fileName}`);
    this.name = 'ExcelFileNotFoundError';
  }
}

export class ExcelFileInvalidHeadersError extends Error {
  constructor(expectedHeaders: string[], actualHeaders: string[]) {
    super(
      `Invalid Excel headers. Expected: [${expectedHeaders.join(', ')}], Found: [${actualHeaders.join(', ')}]`
    );
    this.name = 'ExcelFileInvalidHeadersError';
  }
}

export class ExcelFileNoValidDataError extends Error {
  constructor() {
    super('No valid data found in Excel file');
    this.name = 'ExcelFileNoValidDataError';
  }
}

export class ExcelFileWorksheetNotFoundError extends Error {
  constructor() {
    super('No worksheet found in Excel file');
    this.name = 'ExcelFileWorksheetNotFoundError';
  }
}

export class ExcelRowValidationError extends Error {
  constructor(row: number, errors: string[]) {
    super(`Validation error at row ${row}: ${errors.join(', ')}`);
    this.name = 'ExcelRowValidationError';
  }
}

export class DuplicateTransactionError extends Error {
  constructor(count: number) {
    super(`Found ${count} duplicate transactions`);
    this.name = 'DuplicateTransactionError';
  }
}
