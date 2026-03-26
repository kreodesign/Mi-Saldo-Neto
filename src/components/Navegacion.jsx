import React from 'react';
import { Home, ListTodo, Settings } from 'lucide-react';

export default function Navegacion({ tabActual, setTabActual }) {
  const tabs = [
    { id: 'inicio', icon: Home, label: 'Inicio' },
    { id: 'movimientos', icon: ListTodo, label: 'Historial' },
    { id: 'ajustes', icon: Settings, label: 'Ajustes' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 transition-colors">
      <div className="max-w-md mx-auto flex justify-between items-center pb-2">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setTabActual(tab.id)} 
            className={`flex flex-col items-center p-2 w-20 transition-colors ${tabActual === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            <tab.icon className={`w-6 h-6 mb-1 ${tabActual === tab.id ? 'fill-blue-50 dark:fill-blue-900/30' : ''}`} />
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
