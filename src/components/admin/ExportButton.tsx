import React from 'react';
import { FileDown } from 'lucide-react';

interface ExportButtonProps {
  onExport: () => void;
  label: string;
  icon?: React.ReactNode;
}

export default function ExportButton({ onExport, label, icon }: ExportButtonProps) {
  return (
    <button
      onClick={onExport}
      className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-colors"
    >
      {icon || <FileDown className="h-4 w-4 mr-2" />}
      {label}
    </button>
  );
}