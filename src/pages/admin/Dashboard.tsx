import React, { useState, useEffect } from 'react';
import { BarChart3, Package, Users, DollarSign, FileDown } from 'lucide-react';
import DateRangePicker from '../../components/admin/DateRangePicker';
import ReportScheduler from '../../components/admin/ReportScheduler';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { startOfMonth, endOfMonth } from 'date-fns';

export default function AdminDashboard() {
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [reportData, setReportData] = useState(null);

  const handleDateRangeChange = async (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    await fetchReportData(start, end);
  };

  const fetchReportData = async (start: Date, end: Date) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/reports/sales?startDate=${start.toISOString()}&endDate=${end.toISOString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch report data');
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const handleScheduleReport = async (frequency: string, email: string) => {
    try {
      await fetch('http://localhost:5000/api/admin/reports/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          reportType: 'SALES',
          frequency,
          email
        })
      });
    } catch (error) {
      console.error('Error scheduling report:', error);
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (!reportData) return;

    const data = {
      headers: ['Date', 'Ventes (€)', 'Nombre de commandes'],
      data: reportData.map((item: any) => [
        `${item._id.day}/${item._id.month}/${item._id.year}`,
        item.sales.toFixed(2),
        item.orders
      ]),
      dateRange: {
        start: startDate,
        end: endDate
      }
    };

    switch (format) {
      case 'csv':
        exportToCSV(data, 'rapport-ventes');
        break;
      case 'excel':
        exportToExcel(data, 'rapport-ventes');
        break;
      case 'pdf':
        exportToPDF(data, 'rapport-ventes', 'Rapport des Ventes');
        break;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Tableau de Bord</h1>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
          />
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-50"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-50"
            >
              Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-50"
            >
              PDF
            </button>
          </div>

          <ReportScheduler onSchedule={handleScheduleReport} />
        </div>
      </div>

      {/* Rest of the dashboard content */}
    </div>
  );
}