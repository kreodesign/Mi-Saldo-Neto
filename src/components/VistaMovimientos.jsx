import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, Trash2, ListTodo } from 'lucide-react';

export default function VistaMovimientos({ transacciones, setTransacciones }) {
  const formatearMoneda = (monto) => `S/ ${monto.toFixed(2)}`;
  const formatearFecha = (fechaString) => {
    return new Date(fechaString).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' });
  };
  
  const eliminarTransaccion = (id) => {
    setTransacciones(transacciones.filter(t => t.id !== id));
  };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h2 className="font-bold text-slate-800 dark:text-white text-lg">Historial Completo</h2>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg font-bold text-sm">{transacciones.length}</span>
      </div>

      {transacciones.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors">
          <ListTodo className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Aún no hay movimientos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transacciones.map((t) => (
            <div key={t.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${t.tipo === 'egreso' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400'}`}>
                  {t.tipo === 'egreso' ? <ArrowDownCircle className="w-6 h-6" /> : <ArrowUpCircle className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{t.motivo}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-1">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-600 dark:text-slate-400">{t.categoria}</span>
                    <span>{formatearFecha(t.fecha)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`font-black ${t.tipo === 'egreso' ? 'text-slate-800 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {t.tipo === 'egreso' ? '-' : '+'}{formatearMoneda(t.monto)}
                </span>
                <button onClick={() => eliminarTransaccion(t.id)} className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 p-1.5 rounded-md">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

