import React, { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://cokcypwamvacelutwzfm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNva2N5cHdhbXZhY2VsdXR3emZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MTYxNzAsImV4cCI6MjA4NDQ5MjE3MH0.c6yYN4BBZhwfeHzbmFNyZLkWcwmoNL_9Jdvi17EGX-E';

const api = async (endpoint, options = {}) => {
  const { method = 'GET', body, token } = options;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + (token || SUPABASE_KEY),
    'Content-Type': 'application/json',
    'Prefer': method === 'POST' ? 'return=representation' : 'count=exact'
  };
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);
  return fetch(SUPABASE_URL + '/rest/v1/' + endpoint, config);
};

const authSignIn = async (email, password) => {
  const res = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

function Icon({ name, size = 5 }) {
  const s = 'w-' + size + ' h-' + size;
  const icons = {
    home: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    search: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35"/></svg>,
    mapPin: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    alert: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    dollar: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    calendar: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    file: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    settings: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    users: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    user: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    building: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    phone: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    mail: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    bell: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    chevron: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
    plus: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    menu: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
    x: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    logout: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    download: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
    upload: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
    message: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  };
  return icons[name] || null;
}

export default function PTRSSystem() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('dashboard');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [toast, setToast] = useState(null);
  const [modalActivo, setModalActivo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [townships, setTownships] = useState([]);
  const [stats, setStats] = useState({ clientes: 0, propiedades: 0, sinAplicar: 0, pendientes: 0 });
  const [configTab, setConfigTab] = useState('usuarios');

  useEffect(() => {
    const savedToken = localStorage.getItem('ptrs_token');
    const savedUser = localStorage.getItem('ptrs_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    try {
      const result = await authSignIn(email, password);
      if (result.error) {
        notify(result.error_description || 'Credenciales incorrectas', 'error');
      } else if (result.access_token) {
        localStorage.setItem('ptrs_token', result.access_token);
        localStorage.setItem('ptrs_user', JSON.stringify(result.user));
        setUser(result.user);
        setToken(result.access_token);
        notify('Bienvenido!');
      }
    } catch (err) {
      notify('Error de conexion', 'error');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('ptrs_token');
    localStorage.removeItem('ptrs_user');
    setUser(null);
    setToken(null);
  };

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadStats = async () => {
    try {
      const [c, p] = await Promise.all([
        api('clientes?select=id', { token }),
        api('propiedades?select=id', { token })
      ]);
      const cRange = c.headers.get('content-range');
      const pRange = p.headers.get('content-range');
      setStats({
        clientes: cRange ? parseInt(cRange.split('/')[1]) : 0,
        propiedades: pRange ? parseInt(pRange.split('/')[1]) : 0,
        sinAplicar: 0,
        pendientes: 0
      });
    } catch (e) {
      console.error(e);
    }
  };

  const loadClientes = async (search) => {
    try {
      let url = 'clientes?select=*,propiedades(*)&order=nombre.asc&limit=200';
      if (search) {
        url = url + '&or=(nombre.ilike.%25' + search + '%25,apellido.ilike.%25' + search + '%25,telefono_principal.ilike.%25' + search + '%25)';
      }
      const res = await api(url, { token });
      const data = await res.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadTownships = async () => {
    try {
      const res = await api('townships?select=*&order=nombre.asc', { token });
      const data = await res.json();
      setTownships(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) {
      loadStats();
      loadClientes('');
      loadTownships();
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const t = setTimeout(() => loadClientes(busqueda), 300);
    return () => clearTimeout(t);
  }, [busqueda, token]);

  const saveCliente = async (data) => {
    setSaving(true);
    try {
      const url = clienteSeleccionado && clienteSeleccionado.id ? 'clientes?id=eq.' + clienteSeleccionado.id : 'clientes';
      const method = clienteSeleccionado && clienteSeleccionado.id ? 'PATCH' : 'POST';
      const res = await api(url, { method, body: data, token });
      if (!res.ok) throw new Error();
      notify(clienteSeleccionado ? 'Cliente actualizado' : 'Cliente creado');
      setModalActivo(null);
      loadClientes('');
      loadStats();
    } catch (e) {
      notify('Error al guardar', 'error');
    }
    setSaving(false);
  };

  const savePropiedad = async (data) => {
    setSaving(true);
    try {
      const res = await api('propiedades', { method: 'POST', body: data, token });
      if (!res.ok) throw new Error();
      notify('Propiedad agregada');
      setModalActivo(null);
      loadClientes('');
      loadStats();
    } catch (e) {
      notify('Error al guardar', 'error');
    }
    setSaving(false);
  };

  const saveTownship = async (township) => {
    setSaving(true);
    try {
      await api('townships?id=eq.' + township.id, {
        method: 'PATCH',
        body: { estado: township.estado, fecha_limite_assessor: township.fecha_limite_assessor },
        token
      });
      notify('Township actualizado');
      loadTownships();
    } catch (e) {
      notify('Error al guardar', 'error');
    }
    setSaving(false);
  };

  const clientesFiltrados = clientes.filter(c => {
    const search = busqueda.toLowerCase();
    const nombre = (c.nombre || '').toLowerCase();
    const apellido = (c.apellido || '').toLowerCase();
    const tel = c.telefono_principal || '';
    return nombre.includes(search) || apellido.includes(search) || tel.includes(busqueda);
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="building" />
          </div>
          <h2 className="text-xl font-bold">PTRS</h2>
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return <LoginScreen onLogin={handleLogin} loading={authLoading} />;
  }

  const NavItem = ({ icon, label, vista, badge }) => (
    <button
      onClick={() => { setVistaActual(vista); setMenuAbierto(false); }}
      className={'w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-colors ' + (vistaActual === vista ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-800')}
    >
      <div className="flex items-center space-x-3">
        <Icon name={icon} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{badge}</span>}
    </button>
  );

  const Sidebar = () => (
    <div className={'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-200 ' + (menuAbierto ? 'translate-x-0' : '-translate-x-full') + ' lg:translate-x-0'}>
      <div className="flex items-center justify-between h-16 px-4 bg-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Icon name="building" />
          </div>
          <span className="text-white font-bold">PTRS</span>
        </div>
        <button onClick={() => setMenuAbierto(false)} className="lg:hidden text-gray-400">
          <Icon name="x" />
        </button>
      </div>
      <nav className="mt-4 px-2">
        <NavItem icon="home" label="Dashboard" vista="dashboard" />
        <NavItem icon="search" label="Buscar Cliente" vista="buscar" />
        <NavItem icon="mapPin" label="Por Township" vista="townships" />
        <NavItem icon="alert" label="Pendientes Aplicar" vista="pendientes" badge={stats.sinAplicar} />
        <NavItem icon="dollar" label="Facturas" vista="facturas" />
        <NavItem icon="calendar" label="Corte Semanal" vista="corte" />
        <NavItem icon="file" label="Plantillas" vista="plantillas" />
        <div className="mt-8 pt-4 border-t border-slate-700">
          <NavItem icon="settings" label="Configuracion" vista="config" />
        </div>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">{user && user.email ? user.email[0].toUpperCase() : 'U'}</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{user && user.email ? user.email.split('@')[0] : 'Usuario'}</p>
            <p className="text-gray-400 text-xs">Admin</p>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white">
            <Icon name="logout" />
          </button>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={'w-12 h-12 rounded-lg flex items-center justify-center ' + (color === 'blue' ? 'bg-blue-100 text-blue-600' : color === 'green' ? 'bg-green-100 text-green-600' : color === 'red' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600')}>
          <Icon name={icon} />
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
          <span className="text-orange-500 mr-2"><Icon name="bell" /></span>
          Alertas de Townships
        </h2>
        {townships.filter(t => t.estado === 'urgente' || t.estado === 'abierto').slice(0, 3).map((t, idx) => (
          <div key={idx} className={'p-4 rounded-lg border-l-4 ' + (t.estado === 'urgente' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500')}>
            <div className="flex items-center justify-between">
              <div>
                <span className={'font-bold ' + (t.estado === 'urgente' ? 'text-red-700' : 'text-green-700')}>{t.nombre}</span>
                <span className="text-gray-600 ml-2">- {t.estado === 'urgente' ? 'Cierra pronto' : 'Abierto'}</span>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:underline" onClick={() => setVistaActual('townships')}>Ver</button>
            </div>
          </div>
        ))}
        {townships.filter(t => t.estado === 'urgente' || t.estado === 'abierto').length === 0 && (
          <p className="text-gray-500 text-sm">No hay alertas activas</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon="users" label="Total Clientes" value={stats.clientes.toLocaleString()} color="blue" />
        <StatCard icon="home" label="Propiedades" value={stats.propiedades.toLocaleString()} color="green" />
        <StatCard icon="alert" label="Sin Aplicar 2025" value={stats.sinAplicar.toLocaleString()} color="red" />
        <StatCard icon="dollar" label="Pagos Pendientes" value={'$' + stats.pendientes.toLocaleString()} color="yellow" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Busqueda Rapida</h2>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Icon name="search" /></span>
          <input type="text" placeholder="Buscar por nombre, telefono, PIN..." className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} onFocus={() => setVistaActual('buscar')} />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Clientes Recientes</h2>
        <div className="space-y-3">
          {clientes.slice(0, 5).map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{c.nombre ? c.nombre[0] : '?'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{c.nombre} {c.apellido}</p>
                  <p className="text-xs text-gray-500">{c.propiedades ? c.propiedades.length : 0} propiedades</p>
                </div>
              </div>
              <button className="text-blue-600 text-sm" onClick={() => { setClienteSeleccionado(c); setVistaActual('expediente'); }}>Ver</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BuscarCliente = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Buscar Cliente</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Icon name="search" /></span>
          <input type="text" placeholder="Buscar por nombre, telefono, PIN, direccion..." className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <button onClick={() => { setClienteSeleccionado(null); setModalActivo('nuevoCliente'); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2">
            <Icon name="plus" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <p className="text-sm text-gray-500">{clientesFiltrados.length} clientes encontrados</p>
        </div>
        <div className="divide-y">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => { setClienteSeleccionado(cliente); setVistaActual('expediente'); }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="user" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{cliente.nombre} {cliente.apellido}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      {cliente.telefono_principal && (
                        <span className="text-sm text-gray-500 flex items-center">
                          <Icon name="phone" />
                          <span className="ml-1">{cliente.telefono_principal}</span>
                        </span>
                      )}
                      <span className="text-sm text-gray-500 flex items-center">
                        <Icon name="home" />
                        <span className="ml-1">{cliente.propiedades ? cliente.propiedades.length : 0} propiedad(es)</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={'px-2 py-1 text-xs rounded-full ' + (cliente.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>{cliente.estado}</span>
                  <Icon name="chevron" />
                </div>
              </div>
            </div>
          ))}
          {clientesFiltrados.length === 0 && (
            <div className="p-8 text-center text-gray-500">No se encontraron clientes</div>
          )}
        </div>
      </div>
    </div>
  );

  const ExpedienteCliente = () => {
    const cliente = clienteSeleccionado;
    if (!cliente) return <div className="p-8 text-center">Selecciona un cliente</div>;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setVistaActual('buscar')} className="text-gray-500 hover:text-gray-700">Volver</button>
            <h1 className="text-2xl font-bold text-gray-900">{cliente.nombre} {cliente.apellido}</h1>
            <span className={'px-3 py-1 text-sm rounded-full ' + (cliente.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>{cliente.estado}</span>
          </div>
          <button onClick={() => setModalActivo('nuevoCliente')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Editar Cliente</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Informacion de Contacto</h2>
              <div className="space-y-3">
                {cliente.telefono_principal && (
                  <div className="flex items-center space-x-3">
                    <Icon name="phone" />
                    <span className="text-gray-700">{cliente.telefono_principal}</span>
                  </div>
                )}
                {cliente.email && (
                  <div className="flex items-center space-x-3">
                    <Icon name="mail" />
                    <span className="text-gray-700">{cliente.email}</span>
                  </div>
                )}
                {cliente.direccion_correspondencia && (
                  <div className="flex items-start space-x-3">
                    <Icon name="mapPin" />
                    <span className="text-gray-700">{cliente.direccion_correspondencia}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Facturas</h2>
                <button className="text-blue-600 text-sm hover:underline">+ Nueva</button>
              </div>
              <p className="text-gray-500 text-sm">Sin facturas registradas</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Notas</h2>
                <button className="text-blue-600 text-sm hover:underline">+ Agregar</button>
              </div>
              <p className="text-gray-500 text-sm">{cliente.notas || 'Sin notas'}</p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Propiedades ({cliente.propiedades ? cliente.propiedades.length : 0})</h2>
                <button onClick={() => setModalActivo('nuevaPropiedad')} className="text-blue-600 text-sm hover:underline">+ Agregar propiedad</button>
              </div>
              {cliente.propiedades && cliente.propiedades.length > 0 ? cliente.propiedades.map((p, idx) => (
                <div key={idx} className="p-6 border-b last:border-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="font-mono text-lg font-semibold text-blue-600">{p.pin_formatted || p.pin}</span>
                      <p className="text-gray-600 mt-1">{p.direccion || 'Sin direccion'}</p>
                      <p className="text-sm text-gray-500">Township: <span className="font-medium">{p.township_codigo}</span></p>
                    </div>
                    <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2">
                      <Icon name="upload" />
                      <span>Subir documento</span>
                    </button>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Historial de Apelaciones</h3>
                    <p className="text-sm text-gray-500">Sin apelaciones registradas</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Documentos</h3>
                    <p className="text-sm text-gray-500">Sin documentos</p>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-center text-gray-500">Sin propiedades registradas</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Townships = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Clientes por Township</h1>
      <div className="grid gap-4">
        {townships.map((t, idx) => {
          const clientesTwp = clientes.filter(c => c.propiedades && c.propiedades.some(p => p.township_codigo === t.codigo));
          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className={'w-12 h-12 rounded-lg flex items-center justify-center ' + (t.estado === 'abierto' ? 'bg-green-100 text-green-600' : t.estado === 'urgente' ? 'bg-red-100 text-red-600' : t.estado === 'proximo' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600')}>
                    <Icon name="mapPin" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.nombre}</h3>
                    <p className="text-sm text-gray-500">Codigo: {t.codigo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{clientesTwp.length}</p>
                    <p className="text-xs text-gray-500">Clientes</p>
                  </div>
                  <span className={'px-3 py-1 rounded-full text-sm ' + (t.estado === 'abierto' ? 'bg-green-100 text-green-700' : t.estado === 'urgente' ? 'bg-red-100 text-red-700' : t.estado === 'proximo' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700')}>{t.estado || 'cerrado'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const Facturas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2">
          <Icon name="plus" />
          <span>Nueva Factura</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="file" />
        </div>
        <p className="text-gray-500">No hay facturas registradas</p>
      </div>
    </div>
  );

  const CorteSemanal = () => {
    const today = new Date();
    const day = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - day);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Corte Semanal</h1>
            <p className="text-gray-500">{startOfWeek.toLocaleDateString('es-MX')} - {endOfWeek.toLocaleDateString('es-MX')}</p>
          </div>
          <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2">
            <Icon name="download" />
            <span>Exportar PDF</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Clientes Nuevos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Aplicaciones</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Aprobaciones</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <p className="text-3xl font-bold text-green-600">$0</p>
            <p className="text-sm text-gray-500 mt-1">Pagos Recibidos</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <p className="text-3xl font-bold text-red-600">$0</p>
            <p className="text-sm text-gray-500 mt-1">Pendiente Cobrar</p>
          </div>
        </div>
      </div>
    );
  };

  const Plantillas = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Plantillas de Documentos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 text-red-600">
              <Icon name="file" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Hoja Azul</p>
              <p className="text-xs text-gray-500">hoja_azul.pdf</p>
            </div>
          </div>
          <button className="w-full px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center space-x-1">
            <Icon name="download" />
            <span>Descargar</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 text-red-600">
              <Icon name="file" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Auth Board 2025</p>
              <p className="text-xs text-gray-500">board_review.pdf</p>
            </div>
          </div>
          <button className="w-full px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center space-x-1">
            <Icon name="download" />
            <span>Descargar</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 text-red-600">
              <Icon name="file" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Auth Assessor 2025</p>
              <p className="text-xs text-gray-500">assessor.pdf</p>
            </div>
          </div>
          <button className="w-full px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center space-x-1">
            <Icon name="download" />
            <span>Descargar</span>
          </button>
        </div>
      </div>
    </div>
  );

  const Configuracion = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuracion</h1>
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setConfigTab('usuarios')} className={'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ' + (configTab === 'usuarios' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900')}>
          <Icon name="users" />
          <span>Usuarios</span>
        </button>
        <button onClick={() => setConfigTab('townships')} className={'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ' + (configTab === 'townships' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900')}>
          <Icon name="calendar" />
          <span>Fechas Townships</span>
        </button>
        <button onClick={() => setConfigTab('mensajes')} className={'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ' + (configTab === 'mensajes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900')}>
          <Icon name="message" />
          <span>Plantillas Mensajes</span>
        </button>
      </div>

      {configTab === 'usuarios' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Usuarios del Sistema</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2">
              <Icon name="plus" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
          <div className="py-4 flex items-center justify-between border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">angelica@ptrs.com</p>
                <p className="text-sm text-gray-500">Administrador</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Activo</span>
          </div>
          <p className="text-sm text-gray-500 mt-4">Para crear nuevos usuarios, ve a Supabase - Authentication - Users - Add User</p>
        </div>
      )}

      {configTab === 'townships' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Fechas y Estados de Townships</h2>
          <div className="space-y-4">
            {townships.slice(0, 10).map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900 w-32">{t.nombre}</span>
                  <select className="border rounded-lg px-3 py-2 text-sm" value={t.estado || 'cerrado'} onChange={(e) => saveTownship({ ...t, estado: e.target.value })}>
                    <option value="cerrado">Cerrado</option>
                    <option value="abierto">Abierto</option>
                    <option value="urgente">Urgente</option>
                    <option value="proximo">Proximo</option>
                  </select>
                </div>
                <input type="date" className="border rounded-lg px-3 py-2 text-sm" value={t.fecha_limite_assessor || ''} onChange={(e) => saveTownship({ ...t, fecha_limite_assessor: e.target.value })} />
              </div>
            ))}
          </div>
        </div>
      )}

      {configTab === 'mensajes' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Plantillas de Mensajes</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2">
              <Icon name="plus" />
              <span>Nueva Plantilla</span>
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">Recordatorio de Aplicacion</p>
                <button className="text-blue-600 text-sm hover:underline">Editar</button>
              </div>
              <p className="text-sm text-gray-600">Hola nombre, le recordamos que el periodo de apelacion esta abierto...</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">Confirmacion de Aprobacion</p>
                <button className="text-blue-600 text-sm hover:underline">Editar</button>
              </div>
              <p className="text-sm text-gray-600">Felicidades! Su apelacion fue aprobada...</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">Recordatorio de Pago</p>
                <button className="text-blue-600 text-sm hover:underline">Editar</button>
              </div>
              <p className="text-sm text-gray-600">Hola, le recordamos que tiene un balance pendiente...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ModalNuevoCliente = () => {
    const [form, setForm] = useState({
      nombre: clienteSeleccionado ? clienteSeleccionado.nombre || '' : '',
      apellido: clienteSeleccionado ? clienteSeleccionado.apellido || '' : '',
      telefono_principal: clienteSeleccionado ? clienteSeleccionado.telefono_principal || '' : '',
      email: clienteSeleccionado ? clienteSeleccionado.email || '' : '',
      direccion_correspondencia: clienteSeleccionado ? clienteSeleccionado.direccion_correspondencia || '' : '',
      estado: clienteSeleccionado ? clienteSeleccionado.estado || 'activo' : 'activo',
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      saveCliente(form);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{clienteSeleccionado ? 'Editar' : 'Nuevo'} Cliente</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600">
              <Icon name="x" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.apellido} onChange={(e) => setForm({...form, apellido: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.telefono_principal} onChange={(e) => setForm({...form, telefono_principal: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direccion</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.direccion_correspondencia} onChange={(e) => setForm({...form, direccion_correspondencia: e.target.value})} />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button type="button" onClick={() => setModalActivo(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ModalNuevaPropiedad = () => {
    const [form, setForm] = useState({
      cliente_id: clienteSeleccionado ? clienteSeleccionado.id : '',
      pin: '',
      direccion: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      savePropiedad(form);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Agregar Propiedad</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600">
              <Icon name="x" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN (14 digitos) *</label>
                <input className="w-full border rounded-lg px-3 py-2 font-mono" value={form.pin} onChange={(e) => setForm({...form, pin: e.target.value.replace(/\D/g, '')})} maxLength={14} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direccion</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.direccion} onChange={(e) => setForm({...form, direccion: e.target.value})} />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button type="button" onClick={() => setModalActivo(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (vistaActual) {
      case 'dashboard': return <Dashboard />;
      case 'buscar': return <BuscarCliente />;
      case 'expediente': return <ExpedienteCliente />;
      case 'townships': return <Townships />;
      case 'pendientes': return <BuscarCliente />;
      case 'facturas': return <Facturas />;
      case 'corte': return <CorteSemanal />;
      case 'plantillas': return <Plantillas />;
      case 'config': return <Configuracion />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center justify-between px-4">
        <button onClick={() => setMenuAbierto(true)} className="text-gray-600">
          <Icon name="menu" />
        </button>
        <span className="font-bold text-gray-900">PTRS</span>
        <div className="w-6"></div>
      </div>
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">{renderView()}</div>
      </div>
      {modalActivo === 'nuevoCliente' && <ModalNuevoCliente />}
      {modalActivo === 'nuevaPropiedad' && <ModalNuevaPropiedad />}
      {toast && (
        <div className={'fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white shadow-lg z-50 ' + (toast.type === 'error' ? 'bg-red-600' : 'bg-green-600')}>
          {toast.msg}
        </div>
      )}
      {menuAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMenuAbierto(false)}></div>
      )}
    </div>
  );
}

function LoginScreen({ onLogin, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="building" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PTRS</h1>
          <p className="text-gray-500">Property Tax Refund Services of Illinois</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-3" placeholder="usuario@ptrs.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-3" placeholder="********" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">Sistema de Gestion v2.0</p>
      </div>
    </div>
  );
}
