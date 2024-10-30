import { unparse } from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExportData {
  headers: string[];
  data: any[][];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const exportToCSV = (data: ExportData, filename: string) => {
  const csv = unparse({
    fields: data.headers,
    data: data.data
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `${filename}.csv`);
};

export const exportToExcel = (data: ExportData, filename: string) => {
  const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');

  // Add date range if provided
  if (data.dateRange) {
    const dateRange = [
      ['Période du rapport:'],
      [`Du: ${format(data.dateRange.start, 'dd MMMM yyyy', { locale: fr })}`],
      [`Au: ${format(data.dateRange.end, 'dd MMMM yyyy', { locale: fr })}`],
      [],
      []
    ];
    XLSX.utils.sheet_add_aoa(ws, dateRange, { origin: 'A1' });
    ws['!ref'] = XLSX.utils.encode_range({
      s: { c: 0, r: 0 },
      e: {
        c: Math.max(data.headers.length - 1, 0),
        r: data.data.length + dateRange.length
      }
    });
  }

  // Style headers
  const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1';
    if (!ws[address]) continue;
    ws[address].s = {
      fill: { fgColor: { rgb: '16A34A' } }, // Green background
      font: { bold: true, color: { rgb: 'FFFFFF' } }, // White, bold text
      alignment: { horizontal: 'center' }
    };
  }

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadFile(blob, `${filename}.xlsx`);
};

export const exportToPDF = (data: ExportData, filename: string, title: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add date range if provided
  let startY = 30;
  if (data.dateRange) {
    doc.setFontSize(10);
    doc.text('Période du rapport:', 14, 25);
    doc.text(`Du: ${format(data.dateRange.start, 'dd MMMM yyyy', { locale: fr })}`, 14, 30);
    doc.text(`Au: ${format(data.dateRange.end, 'dd MMMM yyyy', { locale: fr })}`, 14, 35);
    startY = 45;
  }

  // Add table
  autoTable(doc, {
    head: [data.headers],
    body: data.data,
    startY,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
    },
  });

  doc.save(`${filename}.pdf`);
};

const downloadFile = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};