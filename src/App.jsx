import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Trash2, RotateCcw, Edit2, AlertCircle, Clock, Calendar, AlertTriangle } from 'lucide-react';

export default function App() {
  // --- ESTADOS INICIALES (Recuperando de localStorage) ---
  const [sueldoBase, setSueldoBase] = useState(() => {
    const guardado = localStorage.getItem('appAdelantos_sueldoBase');
    return guardado ? parseFloat(guardado) : 0;
  });
  
  const [horasDiarias, setHorasDiarias] = useState(() => {
    const guardado = localStorage.getItem('appAdelantos_horas');
    return guardado ? parseFloat(guardado) : 12; // 12 horas por defecto
  });

  const [transacciones, setTransacciones] = useState(() => {
    const guardado = localStorage.getItem('appAdelantos_transacciones');
    return guardado ? JSON.parse(guardado) : [];
  });

  // --- ESTADOS DE LA INTERFAZ ---
  const [modoEdicionSueldo, setModoEdicionSueldo] = useState(sueldoBase === 0);
  const [inputSueldo, setInputSueldo] = useState(sueldoBase || '');
  const [inputHoras, setInputHoras] = useState(horasDiarias || '');
  
  const [tipoTransaccion, setTipoTransaccion] = useState('egreso');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Comida');
  const [nuevoMotivo, setNuevoMotivo] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');
  
  const [mostrarModal, setMostrarModal] = useState(false);

  // --- EFECTOS (Guardar en localStorage cada vez que cambian los datos) ---
  useEffect(() => {
    localStorage.setItem('appAdelantos_sueldoBase', sueldoBase.toString());
    localStorage.setItem('appAdelantos_horas', horasDiarias.toString());
  }, [sueldoBase, horasDiarias]);

  useEffect(() => {
    localStorage.setItem('appAdelantos_transacciones', JSON.stringify(transacciones));
  }, [transacciones]);

  // --- CÁLCULOS FINANCIEROS ---
  const totalEgresos = transacciones.filter(t => t.tipo === 'egreso').reduce((total, t) => total + t.monto, 0);
  const totalIngresosExtra = transacciones.filter(t => t.tipo === 'ingreso').reduce((total, t) => total + t.monto, 0);
  
  const ingresosTotales = sueldoBase + totalIngresosExtra;
  const saldoDisponible = ingresosTotales - totalEgresos;
  const porcentajeGastado = ingresosTotales > 0 ? (totalEgresos / ingresosTotales) * 100 : 0;

  // Desglose de sueldo (Calculado sobre un mes estándar de 30 días)
  const sueldoQuincenal = sueldoBase / 2;
  const sueldoSemanal = sueldoBase / 4;
  const sueldoDiario = sueldoBase / 30;
  const sueldoPorHora = horasDiarias > 0 ? sueldoDiario / horasDiarias : 0;
  const sueldoPorMinuto = sueldoPorHora / 60;

  // --- FORMATEADORES ---
  const formatearMoneda = (monto) => `S/ ${monto.toFixed(2)}`;
  const formatearMonedaMini = (monto) => `S/ ${monto.toFixed(3)}`; // 3 decimales para los minutos
  const formatearFecha = (fechaString) => {
    return new Date(fechaString).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' });
  };

  const categoriasEgreso = ['Comida', 'Pasajes', 'Emergencia', 'Negocio', 'Otro'];
  const categoriasIngreso = ['Propinas de reparto', 'Venta extra', 'Otro'];

  // --- MANEJADORES DE EVENTOS ---
  const guardarConfiguracion = (e) => {
    e.preventDefault();
    const sueldoNumerico = parseFloat(inputSueldo);
    const horasNumericas = parseFloat(inputHoras);
    
    if (isNaN(sueldoNumerico) || sueldoNumerico <= 0 || isNaN(horasNumericas) || horasNumericas <= 0) {
      setErrorFormulario('Ingresa valores válidos mayores a cero.');
      return;
    }
    
    setSueldoBase(sueldoNumerico);
    setHorasDiarias(horasNumericas);
    setModoEdicionSueldo(false);
    setErrorFormulario('');
  };

  const agregarTransaccion = (e) => {
    e.preventDefault();
    const montoNumerico = parseFloat(nuevoMonto);
    
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      setErrorFormulario('Ingresa un monto válido.');
      return;
    }

    const nuevaTrans = {
      id: Date.now().toString(),
      tipo: tipoTransaccion,
      monto: montoNumerico,
      categoria: nuevaCategoria,
      motivo: nuevoMotivo.trim() || nuevaCategoria,
      fecha: new Date().toISOString()
    };

    setTransacciones([nuevaTrans, ...transacciones]);
    setNuevoMonto('');
    setNuevoMotivo('');
    setErrorFormulario('');
  };

  const eliminarTransaccion = (id) => {
    setTransacciones(transacciones.filter(t => t.id !== id));
  };

  const confirmarReinicio = () => {
    setTransacciones([]); // Vaciamos el historial
    setMostrarModal(false);
  };

  // Cambio de pestaña entre Ingreso/Egreso
  const cambiarTipoTransaccion = (tipo) => {
    setTipoTransaccion(tipo);
    setNuevaCategoria(tipo === 'egreso' ? 'Comida' : 'Propinas de reparto');
    setErrorFormulario('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      
      {/* --- MODAL DE CONFIRMACIÓN --- */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">¿Reiniciar el mes?</h3>
            </div>
            <p className="text-slate-600 mb-6">Esta acción borrará todo el historial de adelantos e ingresos extra guardados en este dispositivo. No se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setMostrarModal(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">Cancelar</button>
              <button onClick={confirmarReinicio} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">Sí, reiniciar</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="bg-slate-900 text-white p-4 shadow-md rounded-b-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold">Mis Finanzas</h1>
          </div>
          {transacciones.length > 0 && (
            <button onClick={() => setMostrarModal(true)} className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full flex items-center gap-1 text-sm transition-colors">
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* --- PANTALLA DE CONFIGURACIÓN --- */}
        {modoEdicionSueldo ? (
          <form onSubmit={guardarConfiguracion} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-slate-800">Configuración Base</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Sueldo mensual neto</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">S/</span>
                  <input type="number" step="0.01" value={inputSueldo} onChange={(e) => setInputSueldo(e.target.value)} className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Ej. 1300.00" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Horas de trabajo al día</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" value={inputHoras} onChange={(e) => setInputHoras(e.target.value)} className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Ej. 12" />
                </div>
              </div>
              {errorFormulario && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{errorFormulario}</p>}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-colors">Guardar y Continuar</button>
            </div>
          </form>
        ) : (
          <>
            {/* --- TARJETA PRINCIPAL (DASHBOARD) --- */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
              {/* Fondo decorativo */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Wallet className="w-32 h-32" />
              </div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wide">Saldo Real Disponible</p>
                  <h2 className={`text-4xl font-black mt-1 ${saldoDisponible <= 0 ? 'text-red-500' : 'text-slate-800'}`}>
                    {formatearMoneda(saldoDisponible)}
                  </h2>
                </div>
                <button onClick={() => setModoEdicionSueldo(true)} className="bg-slate-100 p-2 rounded-lg text-slate-500 hover:text-slate-800 transition-colors" title="Editar sueldo y horas">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Grid de Desglose de Ganancias */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 relative z-10">
                <div className="text-center p-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Quincena</p>
                  <p className="text-sm font-semibold text-slate-700">{formatearMoneda(sueldoQuincenal)}</p>
                </div>
                <div className="text-center p-2 border-l border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Diario</p>
                  <p className="text-sm font-semibold text-slate-700">{formatearMoneda(sueldoDiario)}</p>
                </div>
                <div className="text-center p-2 border-l border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Por Hora</p>
                  <p className="text-sm font-semibold text-slate-700">{formatearMoneda(sueldoPorHora)}</p>
                </div>
                <div className="text-center p-2 border-l border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">x Minuto</p>
                  <p className="text-sm font-semibold text-emerald-600">{formatearMonedaMini(sueldoPorMinuto)}</p>
                </div>
              </div>

              {/* Barra de progreso de gastos */}
              <div className="relative z-10">
                <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
                  <span>Gastos: {formatearMoneda(totalEgresos)}</span>
                  <span>{Math.min(porcentajeGastado, 100).toFixed(0)}% del total</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${porcentajeGastado > 85 ? 'bg-red-500' : porcentajeGastado > 60 ? 'bg-amber-400' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(porcentajeGastado, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* --- FORMULARIO DE REGISTRO (INGRESOS/EGRESOS) --- */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              {/* Pestañas (Tabs) */}
              <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => cambiarTipoTransaccion('egreso')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tipoTransaccion === 'egreso' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Retirar / Gasto
                </button>
                <button 
                  onClick={() => cambiarTipoTransaccion('ingreso')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tipoTransaccion === 'ingreso' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Ingreso Extra
                </button>
              </div>

              <form onSubmit={agregarTransaccion} className="space-y-3">
                <div className="flex gap-3">
                  <div className="relative flex-[2]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">S/</span>
                    <input type="number" step="0.01" value={nuevoMonto} onChange={(e) => {setNuevoMonto(e.target.value); setErrorFormulario('');}} className="w-full pl-8 pr-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 outline-none bg-slate-50 transition-all" placeholder="Monto" required />
                  </div>
                  <select value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} className="flex-[3] px-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 outline-none bg-slate-50 text-sm transition-all">
                    {(tipoTransaccion === 'egreso' ? categoriasEgreso : categoriasIngreso).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <input type="text" value={nuevoMotivo} onChange={(e) => setNuevoMotivo(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-800 outline-none bg-slate-50 text-sm transition-all" placeholder="Nota opcional (ej. Almuerzo pollería...)" />
                
                {errorFormulario && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4"/>{errorFormulario}</p>}
                
                <button type="submit" className={`w-full text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${tipoTransaccion === 'egreso' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  {tipoTransaccion === 'egreso' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                  Registrar {tipoTransaccion === 'egreso' ? 'Gasto' : 'Ingreso'}
                </button>
              </form>
            </div>

            {/* --- HISTORIAL DE MOVIMIENTOS --- */}
            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-bold text-slate-700">Movimientos del mes</h3>
                <span className="text-xs font-semibold bg-slate-200 text-slate-600 py-1 px-2 rounded-lg">{transacciones.length}</span>
              </div>
              
              {transacciones.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 font-medium">Aún no hay registros</p>
                  <p className="text-xs text-slate-400 mt-1">Tus ingresos y gastos aparecerán aquí.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {transacciones.map((t) => (
                    <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group transition-all hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${t.tipo === 'egreso' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {t.tipo === 'egreso' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{t.motivo}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">{t.categoria}</span>
                            <span>{formatearFecha(t.fecha)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${t.tipo === 'egreso' ? 'text-slate-800' : 'text-emerald-600'}`}>
                          {t.tipo === 'egreso' ? '-' : '+'}{formatearMoneda(t.monto)}
                        </span>
                        <button onClick={() => eliminarTransaccion(t.id)} className="text-slate-300 hover:text-red-500 p-1 transition-colors" title="Eliminar registro">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}


