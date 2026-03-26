import React, { useState } from 'react';
import { Settings, Clock, Sun, Moon, RotateCcw } from 'lucide-react';

export default function VistaAjustes({ sueldoBase, setSueldoBase, horasDiarias, setHorasDiarias, isDark, setIsDark, setTabActual, abrirModal }) {
  const [inputSueldo, setInputSueldo] = useState(sueldoBase || '');
  const [inputHoras, setInputHoras] = useState(horasDiarias || '');
  const [errorConfig, setErrorConfig] = useState('');

  const guardarConfiguracion = (e) => {
    e.preventDefault();
    const sueldoNumerico = parseFloat(inputSueldo);
    const horasNumericas = parseFloat(inputHoras);
    
    if (isNaN(sueldoNumerico) || sueldoNumerico <= 0 || isNaN(horasNumericas) || horasNumericas <= 0) {
      setErrorConfig('Ingresa valores válidos mayores a cero.');
      return;
    }
    setSueldoBase(sueldoNumerico);
    setHorasDiarias(horasNumericas);
    setErrorConfig('');
    setTabActual('inicio');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <form onSubmit={guardarConfiguracion} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h2 className="text-xl font-bold mb-5 text-slate-800 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-500" /> Configuración Principal
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Sueldo Mensual Neto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">S/</span>
              <input type="number" step="0.01" value={inputSueldo} onChange={(e) => setInputSueldo(e.target.value)} className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-950 font-semibold text-slate-800 dark:text-white" placeholder="1300.00" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">Horas de trabajo al día</label>
            <div className="relative">
              <Clock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="number" value={inputHoras} onChange={(e) => setInputHoras(e.target.value)} className="w-full pl-11 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-950 font-semibold text-slate-800 dark:text-white" placeholder="12" />
            </div>
          </div>
          {errorConfig && <p className="text-red-500 text-sm font-medium">{errorConfig}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-md shadow-blue-200 dark:shadow-none transition-colors">
            Guardar Cambios
          </button>
        </div>
      </form>

      {/* Selector de Tema */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Apariencia</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Modo {isDark ? 'Oscuro' : 'Claro'}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isDark ? 'bg-indigo-500' : 'bg-slate-300'}`}
        >
          <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-3xl border border-red-100 dark:border-red-900/30">
        <h3 className="text-red-800 dark:text-red-400 font-bold mb-2">Zona de Peligro</h3>
        <p className="text-red-600 dark:text-red-500/80 text-sm mb-4">Borra todo el historial de gastos y propinas para empezar en cero.</p>
        <button onClick={abrirModal} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-colors">
          <RotateCcw className="w-5 h-5" /> Reiniciar Mes Completo
        </button>
      </div>
    </div>
  );
}
