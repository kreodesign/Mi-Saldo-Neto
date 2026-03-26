import React, { useState, useEffect } from 'react';
import VistaInicio from './components/VistaInicio';
import VistaMovimientos from './components/VistaMovimientos';
import VistaAjustes from './components/VistaAjustes';
import Navegacion from './components/Navegacion';
import ModalConfirmacion from './components/ModalConfirmacion';

export default function App() {
  // --- ESTADOS GLOBALES ---
  const [isDark, setIsDark] = useState(() => {
    const guardado = localStorage.getItem('appAdelantos_theme');
    if (guardado) return guardado === 'dark';
    // Si no hay guardado, usa la preferencia del sistema del teléfono
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [sueldoBase, setSueldoBase] = useState(() => {
    const guardado = localStorage.getItem('appAdelantos_sueldoBase');
    return guardado ? parseFloat(guardado) : 0;
  });
  
  const [horasDiarias, setHorasDiarias] = useState(() => {
    const guardado = localStorage.getItem('appAdelantos_horas');
    return guardado ? parseFloat(guardado) : 12;
  });

  const [transacciones, setTransacciones] = useState(() => {
    const guardado = localStorage.getItem('appAdelantos_transacciones');
    return guardado ? JSON.parse(guardado) : [];
  });

  const [tabActual, setTabActual] = useState('inicio');
  const [mostrarModal, setMostrarModal] = useState(false);

  // --- EFECTOS (Persistencia y Modo Oscuro) ---
  useEffect(() => {
    localStorage.setItem('appAdelantos_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('appAdelantos_sueldoBase', sueldoBase.toString());
    localStorage.setItem('appAdelantos_horas', horasDiarias.toString());
  }, [sueldoBase, horasDiarias]);

  useEffect(() => {
    localStorage.setItem('appAdelantos_transacciones', JSON.stringify(transacciones));
  }, [transacciones]);

  // Forzar a ir a ajustes si no hay sueldo configurado
  useEffect(() => {
    if (sueldoBase === 0) setTabActual('ajustes');
  }, [sueldoBase]);

  // --- MÉTODOS GLOBALES ---
  const reiniciarMes = () => {
    setTransacciones([]);
    setMostrarModal(false);
  };

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-24 transition-colors duration-300">
      
      <ModalConfirmacion 
        mostrar={mostrarModal} 
        onClose={() => setMostrarModal(false)} 
        onConfirm={reiniciarMes} 
      />

      <main className="max-w-md mx-auto p-4 pt-6">
        {tabActual === 'inicio' && (
          <VistaInicio 
            sueldoBase={sueldoBase} 
            horasDiarias={horasDiarias} 
            transacciones={transacciones} 
            setTransacciones={setTransacciones} 
          />
        )}
        {tabActual === 'movimientos' && (
          <VistaMovimientos 
            transacciones={transacciones} 
            setTransacciones={setTransacciones} 
          />
        )}
        {tabActual === 'ajustes' && (
          <VistaAjustes 
            sueldoBase={sueldoBase} 
            setSueldoBase={setSueldoBase}
            horasDiarias={horasDiarias} 
            setHorasDiarias={setHorasDiarias}
            isDark={isDark}
            setIsDark={setIsDark}
            setTabActual={setTabActual}
            abrirModal={() => setMostrarModal(true)}
          />
        )}
      </main>

      <Navegacion tabActual={tabActual} setTabActual={setTabActual} />
    </div>
  );
}
