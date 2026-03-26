
import React, { useState } from 'react';
import { 
  Wallet, CalendarDays, Coins, Clock, 
  TrendingUp, ArrowDownCircle, ArrowUpCircle 
} from 'lucide-react';

export default function VistaInicio({ sueldoBase, horasDiarias, transacciones, setTransacciones }) {
  const [tipoTransaccion, setTipoTransaccion] = useState('egreso');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Comida');
  const [nuevoMotivo, setNuevoMotivo] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');

  // Cálculos financieros
  const totalEgresos = transacciones.filter(t => t.tipo === 'egreso').reduce((total, t) => total + t.monto, 0);
  const totalPropinas = transacciones.filter(t => t.tipo === 'ingreso').reduce((total, t) => total + t.monto, 0);
  
  const saldoSueldoDisponible = sueldoBase - totalEgresos;
  const porcentajeSueldoGastado = sueldoBase > 0 ? (totalEgresos / sueldoBase) * 100 : 0;
  const sueldoQuincenal = sueldoBase / 2;
  
  let saldoEstaQuincena = 0;
  if (sueldoBase > 0) {
    if (totalEgresos < sueldoQuincenal) {
      saldoEstaQuincena = sueldoQuincenal - totalEgresos;
    } else if (totalEgresos < sueldoBase) {
      saldoEstaQuincena = sueldoBase - totalEgresos;
    }
  }

  const sueldoDiario = sueldoBase / 30;
  const sueldoPorHora = horasDiarias > 0 ? sueldoDiario / horasDiarias : 0;
  const sueldoPorMinuto = sueldoPorHora / 60;

  const diasParaQuincena = (() => {
    const hoy = new Date();
    const dia = hoy.getDate();
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    if (dia <= 15) return 15 - dia;
    return ultimoDiaMes - dia;
  })();

  const formatearMoneda = (monto) => `S/ ${monto.toFixed(2)}`;
  const formatearMonedaMini = (monto) => `S/ ${monto.toFixed(3)}`;

  const categoriasEgreso = ['Comida', 'Pasajes', 'Emergencia', 'Negocio', 'Otro'];
  const categoriasIngreso = ['Propinas', 'Venta extra', 'Bono', 'Otro'];

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

  const cambiarTipoTransaccion = (tipo) => {
    setTipoTransaccion(tipo);
    setNuevaCategoria(tipo === 'egreso' ? 'Comida' : 'Propinas');
    setErrorFormulario('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tarjeta Principal de Sueldo */}
      <div className="bg-slate-900 dark:bg-slate-900 p-5 rounded-3xl shadow-lg relative overflow-hidden text-white border border-slate-800">
        <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
          <Wallet className="w-40 h-40" />
        </div>
        <div className="relative z-10">
          <p className="text-slate-300 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Sueldo Disponible</p>
          <h2 className={`text-4xl font-black ${saldoSueldoDisponible <= 0 ? 'text-red-400' : 'text-white'}`}>
            {formatearMoneda(saldoSueldoDisponible)}
          </h2>
          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-300 dark:text-slate-400 mb-2">
              <span>Sueldo Base: {formatearMoneda(sueldoBase)}</span>
              <span>{Math.min(porcentajeSueldoGastado, 100).toFixed(0)}% gastado</span>
            </div>
            <div className="w-full bg-slate-800 dark:bg-slate-800/50 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ease-out ${porcentajeSueldoGastado > 85 ? 'bg-red-500' : porcentajeSueldoGastado > 60 ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                style={{ width: `${Math.min(porcentajeSueldoGastado, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Quincena y Propinas separadas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
            <CalendarDays className="w-5 h-5" />
            <h3 className="font-bold text-sm">Quincena</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{formatearMoneda(saldoEstaQuincena)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Restante actual</p>
          <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase py-1 px-2 rounded-lg inline-block text-center border border-indigo-100 dark:border-indigo-800/50">
            Faltan {diasParaQuincena} días
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-sm text-white flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5" />
            <h3 className="font-bold text-sm text-emerald-50">Propinas</h3>
          </div>
          <p className="text-2xl font-bold mb-1">{formatearMoneda(totalPropinas)}</p>
          <p className="text-xs text-emerald-100 font-medium">Bolsillo extra</p>
          <div className="mt-3 bg-white/20 text-white text-[10px] font-bold uppercase py-1 px-2 rounded-lg inline-block text-center backdrop-blur-sm">
            Solo suma, no resta
          </div>
        </div>
      </div>

      {/* Contadores Desglosados (Día, Hora, Minuto) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" /> Valor de tu tiempo
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Por Día</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatearMoneda(sueldoDiario)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Por Hora</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatearMoneda(sueldoPorHora)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">x Minuto</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatearMonedaMini(sueldoPorMinuto)}</p>
          </div>
        </div>
      </div>

      {/* Formulario Rápido */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" /> Nuevo Registro
        </h3>
        <div className="flex gap-2 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => cambiarTipoTransaccion('egreso')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tipoTransaccion === 'egreso' ? 'bg-white dark:bg-slate-900 shadow-sm text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Adelanto/Gasto
          </button>
          <button 
            onClick={() => cambiarTipoTransaccion('ingreso')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tipoTransaccion === 'ingreso' ? 'bg-white dark:bg-slate-900 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Propina/Extra
          </button>
        </div>

        <form onSubmit={agregarTransaccion} className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-[2]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">S/</span>
              <input type="number" step="0.01" value={nuevoMonto} onChange={(e) => {setNuevoMonto(e.target.value); setErrorFormulario('');}} className="w-full pl-8 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white" placeholder="Monto" required />
            </div>
            <select value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} className="flex-[3] px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm">
              {(tipoTransaccion === 'egreso' ? categoriasEgreso : categoriasIngreso).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <input type="text" value={nuevoMotivo} onChange={(e) => setNuevoMotivo(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm" placeholder="Nota opcional..." />
          
          {errorFormulario && <p className="text-red-500 dark:text-red-400 text-sm">{errorFormulario}</p>}
          
          <button type="submit" className={`w-full text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${tipoTransaccion === 'egreso' ? 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600/90'}`}>
            {tipoTransaccion === 'egreso' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
            {tipoTransaccion === 'egreso' ? 'Descontar del Sueldo' : 'Guardar Propina'}
          </button>
        </form>
      </div>
    </div>
  );
}