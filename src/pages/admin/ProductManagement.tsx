import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileDown } from 'lucide-react';
import { Product } from '../../types';
import ExportButton from '../../components/admin/ExportButton';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

// ... (previous imports and component setup remain the same)

export default function ProductManagement() {
  // ... (previous state and functions remain the same)

  const handleExportProducts = () => {
    const data = {
      headers: ['Nom', 'Prix', 'Stock', 'Catégorie', 'Description'],
      data: products.map(product => [
        product.name,
        `${product.price}€`,
        product.stock,
        product.category,
        product.description
      ])
    };

    exportToCSV(data, 'inventaire-produits');
  };

  const handleExportProductsPDF = () => {
    const data = {
      headers: ['Nom', 'Prix', 'Stock', 'Catégorie'],
      data: products.map(product => [
        product.name,
        `${product.price}€`,
        product.stock,
        product.category
      ])
    };

    exportToPDF(data, 'inventaire-produits', 'Inventaire des Produits');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <div className="flex space-x-4">
          <ExportButton
            onExport={handleExportProducts}
            label="Exporter (CSV)"
          />
          <ExportButton
            onExport={handleExportProductsPDF}
            label="Exporter (PDF)"
          />
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Produit
          </button>
        </div>
      </div>

      {/* ... (rest of the component remains the same) */}
    </div>
  );
}