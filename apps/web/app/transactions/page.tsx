'use client';

import { useState, useEffect } from 'react';
import type { UploadResult } from '@repo/api';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, FileUp, Eye, EyeOff, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Statistics {
  totalTransactions: number;
  totalReceived: number;
  totalPaid: number;
  totalReceivedAmount: number;
  totalPaidAmount: number;
  balance: number;
}

interface Transaction {
  id: number;
  transactionType: string;
  origin: string;
  destination: string;
  amount: number;
  message: string | null;
  operationDate: string;
  phoneNumber: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TransactionFilters {
  transactionType?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page: number;
  limit: number;
}

export default function TransactionsPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [validationResult, setValidationResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Transaction list state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    limit: 20,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:3000/transactions/statistics');
      if (!response.ok) {
        throw new Error('Failed to load statistics');
      }
      const data = await response.json();
      setStatistics(data);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setErrorMessage('Unable to load transaction statistics. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions with filters
  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const params = new URLSearchParams();

      if (filters.transactionType) params.append('transactionType', filters.transactionType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.minAmount !== undefined) params.append('minAmount', filters.minAmount.toString());
      if (filters.maxAmount !== undefined) params.append('maxAmount', filters.maxAmount.toString());
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await fetch(`http://localhost:3000/transactions?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setErrorMessage('Unable to load transactions. Please try again.');
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to page 1 when filters change
    }));
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValidationResult(null);
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
      setValidationResult(null);
      setSuccessMessage(null);
      setErrorMessage(null);
    } else {
      setErrorMessage('Invalid file type. Please upload an Excel file (.xlsx)');
    }
  };

  // Validate file
  const handleValidate = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:3000/transactions/upload/validate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setValidationResult(result);
        setSuccessMessage(`File validated successfully! Found ${result.validRecords} valid transaction${result.validRecords !== 1 ? 's' : ''}.`);
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMsg = errorData?.message || 'The file could not be validated. Please check the file format and try again.';
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  // Confirm upload
  const handleConfirm = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:3000/transactions/upload/confirm', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(`Success! ${result.savedCount} transaction${result.savedCount !== 1 ? 's' : ''} imported and saved to the database.`);
        setSelectedFile(null);
        setValidationResult(null);
        await fetchStatistics();
        await fetchTransactions(); // Refresh transaction list
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMsg = errorData?.message || 'Failed to save transactions. Please try again.';
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center py-12 text-foreground">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-jpc-cyan-400"></div>
            <p className="mt-4 text-lg text-foreground font-medium">Loading Transactions</p>
            <p className="mt-2 text-sm text-muted-foreground/90">Please wait while we load your transaction data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-5xl font-bold text-foreground">Transactions</h1>
          <p className="text-base text-muted-foreground">
            Upload and manage your Yape transaction reports
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-jpc-emerald-500/10 border border-jpc-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
            <div className="text-2xl">✓</div>
            <div className="flex-1">
              <h3 className="text-jpc-emerald-400 font-semibold mb-1">Success</h3>
              <p className="text-foreground/90">{successMessage}</p>
            </div>
            <Button
              onClick={() => setSuccessMessage(null)}
              variant="ghost"
              size="icon"
              className="text-jpc-emerald-400 hover:text-jpc-emerald-300 hover:bg-jpc-emerald-500/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-jpc-pink-500/10 border border-jpc-pink-500/30 rounded-xl p-4 flex items-start gap-3">
            <div className="text-2xl">⚠</div>
            <div className="flex-1">
              <h3 className="text-jpc-pink-400 font-semibold mb-1">Error</h3>
              <p className="text-foreground/90">{errorMessage}</p>
            </div>
            <Button
              onClick={() => setErrorMessage(null)}
              variant="ghost"
              size="icon"
              className="text-jpc-pink-400 hover:text-jpc-pink-300 hover:bg-jpc-pink-500/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-jpc-cyan-600/5 border border-jpc-cyan-600/20 hover:shadow-lg transition-all duration-300 hover:border-jpc-cyan-600/40 group">
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-jpc-cyan-600" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Transactions</p>
                <p className="text-3xl font-bold text-jpc-cyan-600">
                  {statistics.totalTransactions.toLocaleString()}
                </p>
              </div>
            </Card>

            <Card className="bg-jpc-emerald-600/5 border border-jpc-emerald-600/20 hover:shadow-lg transition-all duration-300 hover:border-jpc-emerald-600/40 group">
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-5 h-5 text-jpc-emerald-600" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Received</p>
                <p className="text-3xl font-bold text-jpc-emerald-600">
                  S/ {statistics.totalReceivedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">{statistics.totalReceived} payments</p>
              </div>
            </Card>

            <Card className="bg-jpc-orange-500/5 border border-jpc-orange-500/20 hover:shadow-lg transition-all duration-300 hover:border-jpc-orange-500/40 group">
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowDownLeft className="w-5 h-5 text-jpc-orange-500" />
                </div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Paid</p>
                <p className="text-3xl font-bold text-jpc-orange-500">
                  S/ {statistics.totalPaidAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">{statistics.totalPaid} payments</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-jpc-emerald-600/8 to-jpc-emerald-600/4 border border-jpc-emerald-600/20 hover:shadow-md transition-shadow group col-span-full lg:col-span-3">
              <div className="p-8 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Balance</p>
                <p className={cn(
                  "text-5xl font-bold",
                  statistics.balance >= 0 ? 'text-jpc-emerald-600' : 'text-red-400'
                )}>
                  S/ {statistics.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Received - Paid = Balance</p>
              </div>
            </Card>
          </div>
        )}

        {/* File Upload */}
        <Card className="hover:shadow-md transition-all duration-300 mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Upload Excel File</h2>

            <div
              className={cn(
                "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer",
                dragActive
                  ? 'border-jpc-cyan-400 bg-jpc-cyan-500/10 scale-105'
                  : 'border-border/60 hover:border-jpc-cyan-400/50 hover:bg-jpc-cyan-500/5'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="pointer-events-none">
                <div className="inline-block text-5xl mb-4">📊</div>
                {selectedFile ? (
                  <div>
                    <p className="text-foreground text-lg font-semibold mb-2">{selectedFile.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-foreground text-lg font-semibold mb-2">
                      Drag & drop your Excel file here
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
                    <p className="text-xs text-muted-foreground">Accepts .xlsx files only</p>
                  </div>
                )}
              </div>
            </div>

            {selectedFile && !validationResult && (
              <div className="mt-6 flex gap-4">
                <Button
                  onClick={handleValidate}
                  disabled={uploading}
                  className="gap-2"
                >
                  {uploading && <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>}
                  <FileUp className="w-4 h-4" />
                  {uploading ? 'Validating File...' : 'Validate File'}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedFile(null);
                    setValidationResult(null);
                  }}
                  variant="destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Validation Results */}
        {validationResult && (
          <div className="space-y-6 mb-12">
            {/* Summary */}
            <div className="bg-card border border-jpc-cyan-500/20 rounded-xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Validation Results</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-jpc-cyan-400">{validationResult.totalRecords}</div>
                  <div className="text-sm text-muted-foreground/70">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-jpc-emerald-400">{validationResult.validRecords}</div>
                  <div className="text-sm text-muted-foreground/70">Valid</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-jpc-orange-400">{validationResult.duplicateRecords}</div>
                  <div className="text-sm text-muted-foreground/70">Duplicates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{validationResult.invalidRecords}</div>
                  <div className="text-sm text-muted-foreground/70">Errors</div>
                </div>
              </div>

              {validationResult.validRecords > 0 && validationResult.invalidRecords === 0 && validationResult.duplicateRecords === 0 && (
                <div className="bg-jpc-emerald-500/10 border border-jpc-emerald-500/30 rounded-lg p-4 mb-6">
                  <p className="text-jpc-emerald-400 font-medium">
                    ✓ All records are valid! Ready to import {validationResult.validRecords} transactions.
                  </p>
                  {validationResult.skippedEmptyRows > 0 && (
                    <div className="mt-3 pt-3 border-t border-jpc-emerald-500/20">
                      <p className="text-muted-foreground/80 text-sm font-medium mb-2">
                        ℹ️ {validationResult.skippedEmptyRows} row{validationResult.skippedEmptyRows !== 1 ? 's were' : ' was'} automatically skipped:
                      </p>
                      <div className="text-xs text-muted-foreground/70 space-y-1">
                        {validationResult.skippedRowDetails?.map((skip, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="font-mono bg-background/50 px-1.5 py-0.5 rounded">Row {skip.row}</span>
                            <span>- {skip.reason}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-muted-foreground/60 text-xs mt-2 italic">
                        Note: Rows 1-5 contain file headers and metadata - these are always skipped automatically.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={handleConfirm}
                  disabled={uploading || validationResult.validRecords === 0}
                  className="gap-2 bg-jpc-emerald-500 hover:bg-jpc-emerald-600"
                >
                  {uploading && <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>}
                  {uploading ? 'Importing Transactions...' : `Confirm & Import ${validationResult.validRecords} Records`}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedFile(null);
                    setValidationResult(null);
                  }}
                  variant="destructive"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>

            {/* Errors */}
            {validationResult.errors.length > 0 && (
              <div className="bg-card border border-jpc-pink-500/20 rounded-xl p-8 shadow-xl">
                <h3 className="text-xl font-bold text-jpc-pink-400 mb-4">
                  Validation Errors ({validationResult.errors.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {validationResult.errors.map((error, index) => (
                    <div key={index} className="bg-jpc-pink-500/10 border border-jpc-pink-500/30 rounded-lg p-4">
                      <div className="font-semibold text-jpc-pink-400 mb-1">Row {error.row}</div>
                      <div className="text-sm text-muted-foreground/80">{error.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicates */}
            {validationResult.duplicates.length > 0 && (
              <div className="bg-card border border-jpc-orange-500/20 rounded-xl p-8 shadow-xl">
                <h3 className="text-xl font-bold text-jpc-orange-400 mb-4">
                  Duplicate Records ({validationResult.duplicates.length})
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto ">
                  {validationResult.duplicates.map((dup, index) => (
                    <div key={index} className="bg-jpc-orange-500/10 border border-jpc-orange-500/30 rounded-lg p-4">
                      <div className="font-semibold text-jpc-orange-400 mb-3">
                        Row {dup.row} is a duplicate of Row {dup.originalRow}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-background/50 rounded p-3">
                          <div className="text-xs text-muted-foreground/60 mb-2">Original (Row {dup.originalRow})</div>
                          <div className="space-y-1">
                            <div><span className="text-muted-foreground/60">From:</span> {dup.originalData.Origen}</div>
                            <div><span className="text-muted-foreground/60">To:</span> {dup.originalData.Destino}</div>
                            <div><span className="text-muted-foreground/60">Amount:</span> S/ {dup.originalData.Monto}</div>
                            <div><span className="text-muted-foreground/60">Message:</span> {dup.originalData.Mensaje || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="bg-background/50 rounded p-3">
                          <div className="text-xs text-muted-foreground/60 mb-2">Duplicate (Row {dup.row})</div>
                          <div className="space-y-1">
                            <div><span className="text-muted-foreground/60">From:</span> {dup.data.Origen}</div>
                            <div><span className="text-muted-foreground/60">To:</span> {dup.data.Destino}</div>
                            <div><span className="text-muted-foreground/60">Amount:</span> S/ {dup.data.Monto}</div>
                            <div><span className="text-muted-foreground/60">Message:</span> {dup.data.Mensaje || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transaction List */}
        <div className="bg-card border border-jpc-cyan-500/20 rounded-xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="gap-2"
            >
              {showFilters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-6 p-6 bg-jpc-cyan-50 rounded-lg border border-border/60">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Search
                  </label>
                  <Input
                    type="text"
                    placeholder="Search origin, destination, or message..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                {/* Transaction Type */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Transaction Type
                  </label>
                  <select
                    value={filters.transactionType || ''}
                    onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-jpc-cyan-500/50"
                  >
                    <option value="">All Types</option>
                    <option value="TE PAGÓ">Received (TE PAGÓ)</option>
                    <option value="PAGASTE">Paid (PAGASTE)</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>

                {/* Min Amount */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Min Amount (S/)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={filters.minAmount || ''}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>

                {/* Max Amount */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Max Amount (S/)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={filters.maxAmount || ''}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loadingTransactions && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-jpc-cyan-400"></div>
              <p className="mt-4 text-foreground/70">Loading transactions...</p>
            </div>
          )}

          {/* Empty State */}
          {!loadingTransactions && transactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-foreground/80 mb-2">No transactions found</h3>
              <p className="text-muted-foreground/70">
                {Object.keys(filters).length > 2 ? 'Try adjusting your filters' : 'Upload an Excel file to get started'}
              </p>
            </div>
          )}

          {/* Transaction List */}
          {!loadingTransactions && transactions.length > 0 && (
            <>
              <div className="space-y-3 mb-6">
                {transactions.map((transaction) => {
                  const isReceived = transaction.transactionType === 'TE PAGÓ';
                  return (
                    <Card
                      key={transaction.id}
                      className={cn(
                        "transition-all duration-200 hover:shadow-md",
                        isReceived
                          ? 'border-jpc-emerald-500/20 bg-jpc-emerald-500/5 hover:bg-jpc-emerald-500/8'
                          : 'border-jpc-orange-400/20 bg-jpc-orange-400/5 hover:bg-jpc-orange-400/8'
                      )}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                isReceived ? 'bg-jpc-emerald-500/10' : 'bg-jpc-orange-400/10'
                              )}>
                                {isReceived ? (
                                  <ArrowUpRight className="w-5 h-5 text-jpc-emerald-500" />
                                ) : (
                                  <ArrowDownLeft className="w-5 h-5 text-jpc-orange-400" />
                                )}
                              </div>
                              <Badge
                                className={cn(
                                  isReceived
                                    ? 'bg-jpc-emerald-500/10 text-jpc-emerald-500 border-jpc-emerald-500/20'
                                    : 'bg-jpc-orange-400/10 text-jpc-orange-400 border-jpc-orange-400/20'
                                )}
                              >
                                {transaction.transactionType}
                              </Badge>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(transaction.operationDate)}
                              </span>
                            </div>
                            <div className="text-sm space-y-1">
                              <p className="text-muted-foreground">
                                From: <span className="font-semibold text-foreground">{transaction.origin}</span>
                              </p>
                              <p className="text-muted-foreground">
                                To: <span className="font-semibold text-foreground">{transaction.destination}</span>
                              </p>
                              {transaction.message && (
                                <p className="text-muted-foreground italic">
                                  Message: <span className="text-foreground">{transaction.message}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={cn(
                              "text-lg font-bold whitespace-nowrap",
                              isReceived ? 'text-jpc-emerald-500' : 'text-jpc-orange-400'
                            )}>
                              {isReceived ? '+' : '-'}S/ {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-6 border-t border-border/60">
                <div className="text-sm text-muted-foreground">
                  Page {filters.page} • {transactions.length} transactions shown
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={transactions.length < filters.limit}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
