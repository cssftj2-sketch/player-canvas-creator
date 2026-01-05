import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface DataRow {
  id: string;
  label: string;
  value: string;
  type: 'stat' | 'text' | 'number';
}

interface DataTableProps {
  onDataChange: (data: DataRow[]) => void;
  onClose: () => void;
}

export const DataTable: React.FC<DataTableProps> = ({ onDataChange, onClose }) => {
  const [rows, setRows] = useState<DataRow[]>([
    { id: '1', label: 'Goals', value: '12', type: 'number' },
    { id: '2', label: 'Assists', value: '8', type: 'number' },
    { id: '3', label: 'Appearances', value: '25', type: 'number' },
    { id: '4', label: 'Pass Accuracy', value: '85%', type: 'stat' },
    { id: '5', label: 'Rating', value: '7.8', type: 'number' },
  ]);

  const addRow = () => {
    const newRow: DataRow = {
      id: Date.now().toString(),
      label: 'New Stat',
      value: '0',
      type: 'number',
    };
    setRows([...rows, newRow]);
  };

  const updateRow = (id: string, field: keyof DataRow, value: string) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const handleSave = () => {
    onDataChange(rows);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading text-neutral-200">Data Table</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 mb-4">
          Edit values here and they will sync to the canvas. Double-click cells to edit.
        </p>

        <div className="border border-neutral-700 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-800">
                <TableHead className="text-neutral-300 text-xs">Label</TableHead>
                <TableHead className="text-neutral-300 text-xs">Value</TableHead>
                <TableHead className="text-neutral-300 text-xs">Type</TableHead>
                <TableHead className="text-neutral-300 text-xs w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className="border-neutral-700">
                  <TableCell className="p-1">
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) => updateRow(row.id, 'label', e.target.value)}
                      className="w-full px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => updateRow(row.id, 'value', e.target.value)}
                      className="w-full px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <select
                      value={row.type}
                      onChange={(e) => updateRow(row.id, 'type', e.target.value)}
                      className="w-full px-2 py-1 bg-neutral-800 border border-neutral-600 rounded text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="number">Number</option>
                      <option value="stat">Stat</option>
                      <option value="text">Text</option>
                    </select>
                  </TableCell>
                  <TableCell className="p-1">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
            Apply to Canvas
          </button>
        </div>
      </div>
    </div>
  );
};