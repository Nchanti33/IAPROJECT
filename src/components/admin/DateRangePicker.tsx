import React from 'react';
import DatePicker from 'react-datepicker';
import { fr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => date && onChange(date, endDate)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          locale={fr}
          dateFormat="dd/MM/yyyy"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => date && onChange(startDate, date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          locale={fr}
          dateFormat="dd/MM/yyyy"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>
  );
}