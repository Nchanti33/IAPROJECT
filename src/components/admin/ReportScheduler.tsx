import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface ScheduleOption {
  id: string;
  label: string;
  value: string;
}

const scheduleOptions: ScheduleOption[] = [
  { id: 'daily', label: 'Quotidien', value: 'DAILY' },
  { id: 'weekly', label: 'Hebdomadaire', value: 'WEEKLY' },
  { id: 'monthly', label: 'Mensuel', value: 'MONTHLY' }
];

interface ReportSchedulerProps {
  onSchedule: (frequency: string, email: string) => void;
}

export default function ReportScheduler({ onSchedule }: ReportSchedulerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [frequency, setFrequency] = useState('DAILY');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(frequency, email);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-colors"
      >
        <Clock className="h-4 w-4 mr-2" />
        Planifier les rapports
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-10">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fréquence
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {scheduleOptions.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Planifier
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}