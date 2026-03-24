import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, CheckCircle, Trash2, RotateCcw, Edit2, AlertCircle } from 'lucide-react';

export default function App() {
  // Estado inicial recuperado de localStorage o valores por defecto
  const [sueldoBase, setSueldoBase] = useState(() => {
    const guardado = localStorage.getItem('appAdelantos_sueldoBase');
    return guardado ? parseFloat(guardado) : 0;
  });
  
  const [adelantos, setAdelantos] = useState(() => {
    const guardado = localStorage.getItem('appAdelantos_lista');
    return guardado ? JSON.parse(guardado) : [];
  });

  const [modoEdicionSueldo, setModoEdicionSueldo] = useState(sueldoBase === 0);
  const [inputSueldo, setInputSueldo] = useState(sueldoBase || '');
  
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevoMotivo, setNuevoMotivo] = useState('');
  const [error, setError] = useState('');

  // Guardar en localStorage cada vez que cambian los datos
  useEffect(() => {
    localStorage.setItem('appAdelantos_sueldoBase', sueldoBase.toString());
  }, [sueldoBase]);

  useEffect(() => {
    localStorage.setItem('appAdelantos_lista', JSON.stringify(adelantos));
  }, [adelantos]);

  // Cálculos principales
  const totalAdelantos = adelantos.reduce((total, ad) => total + ad.monto, 0);
  const saldoDisponible = sueldoBase - totalAdelantos;
  const porcentajeGastado = sueldoBase > 0 ? (totalAdelantos / sueldoBase) * 100 : 0;

  // Formateador de moneda (Soles Peruanos)
  const formatearMoneda = (monto) => {
    return `S/ ${monto.toFixed(2)}`;
  };

  // Formateador de fecha
  const formatearFecha = (fechaString) => {
    const opciones = { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' };
    return new Date(fechaString).toLocaleDateString('es-PE', opciones);
  };

  // Manejadores de eventos
  const guardarSueldo = (e) => {
    e.preventDefault();
    const sueldoNumerico = parseFloat(inputSueldo);
    if (isNaN(sueldoNumerico) || sueldoNumerico <= 0) {
      setError('Por favor, ingresa un sueldo válido.');
      return;
    }
    setSueldoBase(sueldoNumerico);
    setModoEdicionSueldo(false);
    setError('');
  };

  const agregarAdelanto = (e) => {
    e.preventDefault();
    const montoNumerico = parseFloat(nuevoMonto);
    
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      setError('Ingresa un monto válido para el adelanto.');
      return;
    }

    if (montoNumerico > saldoDisponible) {
      setError('¡Atención! El adelanto es mayor a tu saldo disponible.');
      // No lo bloqueamos por si fue un descuento extra, pero mostramos error.
      // return; // Descomenta esta línea si quieres bloquear que saquen más de lo que tienen.
    }

    const nuevoAdelanto = {
      id: Date.now().toString(),
      monto: montoNumerico,
      motivo: nuevoMotivo.trim() || 'Adelanto sin motivo',
      fecha: new Date().toISOString()
    };

    setAdelantos([nuevoAdelanto, ...adelantos]);
    setNuevoMonto('');
    setNuevoMotivo('');
    setError('');
  };

  const eliminarAdelanto = (id) => {
    setAdelantos(adelantos.filter(ad => ad.id !== id));
  };

  const reiniciarMes = () => {
    // Podríamos usar un confirm de ventana, pero usaremos un botón directo para simplificar la UI
    setAdelantos([]);
    setError('');
  };

  // Color de la barra de progreso
  const colorBarra = porcentajeGastado > 90 ? 'bg-red-500' 
                   : porcentajeGastado > 70 ? 'bg-yellow-500' 
                   : 'bg-emerald-500';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md rounded-b-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            <h1 className="text-xl font-bold">Mis Adelantos</h1>
          </div>
          {adelantos.length > 0 && (
            <button 
              onClick={reiniciarMes}
              className="p-2 text-blue-100 hover:text-white hover:bg-blue-700 rounded-full transition-colors flex items-center gap-1 text-sm"
              title="Reiniciar mes"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Configuración de Sueldo Base */}
        {modoEdicionSueldo ? (
          <form onSubmit={guardarSueldo} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <h2 className="text-lg font-semibold mb-3">¿Cuál es tu sueldo mensual?</h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">S/</span>
                <input
                  type="number"
                  step="0.01"
                  value={inputSueldo}
                  onChange={(e) => setInputSueldo(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Ej. 1500.00"
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors"
              >
                Guardar
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{error}</p>}
          </form>
        ) : (
          /* Tarjeta Resumen Principal */
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Saldo Disponible</p>
                <h2 className={`text-4xl font-bold mt-1 ${saldoDisponible <= 0 ? 'text-red-500' : 'text-slate-800'}`}>
                  {formatearMoneda(saldoDisponible)}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Sueldo Base</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <span className="font-semibold text-slate-700">{formatearMoneda(sueldoBase)}</span>
                  <button onClick={() => setModoEdicionSueldo(true)} className="text-blue-500 hover:text-blue-700 p-1">
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Barra de progreso de gastos */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Adelantos: {formatearMoneda(totalAdelantos)}</span>
                <span>{Math.min(porcentajeGastado, 100).toFixed(0)}% retirado</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ease-out ${colorBarra}`} 
                  style={{ width: `${Math.min(porcentajeGastado, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Formulario para Nuevo Adelanto */}
        {!modoEdicionSueldo && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowDownCircle className="w-5 h-5 text-red-500" />
              Registrar Adelanto
            </h3>
            <form onSubmit={agregarAdelanto} className="space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">S/</span>
                <input
                  type="number"
                  step="0.01"
                  value={nuevoMonto}
                  onChange={(e) => {
                    setNuevoMonto(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
                  placeholder="Monto del adelanto"
                  required
                />
              </div>
              <input
                type="text"
                value={nuevoMotivo}
                onChange={(e) => setNuevoMotivo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
                placeholder="Motivo (ej. Pasajes, Almuerzo...)"
              />
              {error && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{error}</p>}
              <button 
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Guardar Adelanto
              </button>
            </form>
          </div>
        )}

        {/* Historial de Adelantos */}
        {!modoEdicionSueldo && (
          <div>
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="font-semibold text-slate-700">
                Historial ({adelantos.length})
              </h3>
            </div>
            
            {adelantos.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="text-slate-500 font-medium">¡No tienes adelantos registrados!</p>
                <p className="text-sm text-slate-400 mt-1">Tu sueldo está intacto.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {adelantos.map((adelanto) => (
                  <div 
                    key={adelanto.id} 
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 p-2 rounded-lg">
                        <ArrowDownCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{adelanto.motivo}</p>
                        <p className="text-xs text-slate-400">{formatearFecha(adelanto.fecha)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-red-500">
                        -{formatearMoneda(adelanto.monto)}
                      </span>
                      <button 
                        onClick={() => eliminarAdelanto(adelanto.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

