import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ModalConfirmacion({ mostrar, onClose, onConfirm }) {
  if (!mostrar) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in border border-slate-100 dark:border-slate-800">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black mb-2 text-slate-800 dark:text-white">¿Reiniciar todo?</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Esta acción borrará todas las transacciones y no podrás recuperarlas.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-none transition-colors">Sí, Borrar</button>
        </div>
      </div>
    </div>
  );
}
