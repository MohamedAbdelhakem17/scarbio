'use client';

import Papa, { ParseResult } from 'papaparse';
import { useState } from 'react';
import * as XLSX from 'xlsx';

type FileType = 'csv' | 'excel';

export const useRowCount = () => {
  const [rowCount, setRowCount] = useState<number>(10);

  /**
   * Count number of rows in a CSV file
   */
  const countCSVRows = (file: File): Promise<number> => {
    return new Promise(async resolve => {
      const text: string = await file.text();

      Papa.parse<string[]>(text, {
        header: false,
        skipEmptyLines: true,
        complete: (results: ParseResult<string[]>) => {
          resolve(results.data.length);
        },
      });
    });
  };

  /**
   * Count number of rows in an Excel file (XLSX)
   */
  const countExcelRows = async (file: File): Promise<number> => {
    const buffer: ArrayBuffer = await file.arrayBuffer();
    const workbook: XLSX.WorkBook = XLSX.read(buffer, { type: 'buffer' });

    const sheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: (string | number | null)[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    }) as (string | number | null)[][];

    // Count only non-empty rows
    return rows.filter(r => r.some(v => v !== '' && v != null)).length;
  };

  /**
   * Main function to calculate rows depending on file type
   */
  const calculateRows = async (file: File, type: FileType): Promise<number> => {
    if (!file) return 0;

    let totalRows = 0;

    if (type === 'csv') {
      totalRows = await countCSVRows(file);
    } else {
      totalRows = await countExcelRows(file);
    }

    // Subtract header row
    setRowCount(totalRows - 1);

    return totalRows;
  };

  return { rowCount, calculateRows };
};
