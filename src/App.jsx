import React, { useState, useEffect, useCallback } from 'react';

var SUPABASE_URL = 'https://cokcypwamvacelutwzfm.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNva2N5cHdhbXZhY2VsdXR3emZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MTYxNzAsImV4cCI6MjA4NDQ5MjE3MH0.c6yYN4BBZhwfeHzbmFNyZLkWcwmoNL_9Jdvi17EGX-E';

// API helper - Safari compatible
var api = async function(endpoint, options) {
  options = options || {};
  var method = options.method || 'GET';
  var body = options.body;
  var token = options.token;
  var headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + (token || SUPABASE_KEY),
    'Content-Type': 'application/json',
    'Prefer': method === 'POST' ? 'return=representation' : 'count=exact'
  };
  var config = { method: method, headers: headers };
  if (body) config.body = JSON.stringify(body);
  var res = await fetch(SUPABASE_URL + '/rest/v1/' + endpoint, config);
  return res;
};

var authSignIn = async function(email, password) {
  var res = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { 'apikey': SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password })
  });
  return res.json();
};

// Icons
function Icon({ name, size = 5 }) {
  const s = `w-${size} h-${size}`;
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
    merge: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
    trash: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    edit: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    check: <svg className={s} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
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
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [townships, setTownships] = useState([]);
  const [plantillas, setPlantillas] = useState([
    { id: 1, nombre: 'Recordatorio de Aplicación', contenido: 'Hola {nombre}, le recordamos que el periodo de apelación para el township {township} está abierto hasta {fecha}.' },
    { id: 2, nombre: 'Confirmación de Aprobación', contenido: 'Felicidades {nombre}! Su apelación para la propiedad {pin} fue aprobada con una reducción de ${ahorro}.' },
    { id: 3, nombre: 'Recordatorio de Pago', contenido: 'Hola {nombre}, le recordamos que tiene un balance pendiente de ${balance}.' },
  ]);
  const [stats, setStats] = useState({ clientes: 0, propiedades: 0, sinAplicar: 0, pendientes: 0 });
  const [configTab, setConfigTab] = useState('usuarios');
  const [clienteParaMerge, setClienteParaMerge] = useState(null);
  const [plantillaEditando, setPlantillaEditando] = useState(null);
  const [expedienteTab, setExpedienteTab] = useState('info');
  const [notas, setNotas] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [apelaciones, setApelaciones] = useState([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const ITEMS_POR_PAGINA = 50;

  // Auth effects - Safari compatible
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('ptrs_token');
      const savedUser = localStorage.getItem('ptrs_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.log('localStorage not available');
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
        try {
          localStorage.setItem('ptrs_token', result.access_token);
          localStorage.setItem('ptrs_user', JSON.stringify(result.user));
        } catch (e) {
          console.log('Could not save to localStorage');
        }
        setUser(result.user);
        setToken(result.access_token);
        notify('¡Bienvenido!');
      }
    } catch (err) {
      notify('Error de conexión', 'error');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ptrs_token');
      localStorage.removeItem('ptrs_user');
    } catch (e) {
      console.log('Could not clear localStorage');
    }
    setUser(null);
    setToken(null);
  };

  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Data loading functions
  const loadStats = useCallback(async () => {
    try {
      const [c, p] = await Promise.all([
        api('clientes?select=id', { token }),
        api('propiedades?select=id', { token })
      ]);
      const cRange = c.headers.get('content-range');
      const pRange = p.headers.get('content-range');
      
      // Count clients without properties (pending to apply)
      const sinAplicarRes = await api('clientes?select=id,propiedades(id)&propiedades.is.null', { token });
      
      setStats({
        clientes: cRange ? parseInt(cRange.split('/')[1]) : 0,
        propiedades: pRange ? parseInt(pRange.split('/')[1]) : 0,
        sinAplicar: 0,
        pendientes: 0
      });
    } catch (e) {
      console.error('Error loading stats:', e);
    }
  }, [token]);

  const [totalClientes, setTotalClientes] = useState(0);
  
  const loadClientes = useCallback(async (search, pagina = 0) => {
    setLoading(true);
    try {
      var offset = pagina * ITEMS_POR_PAGINA;
      var data = [];
      
      if (search && search.trim()) {
        // Use RPC function for advanced search (includes PIN search)
        var res = await api('rpc/buscar_clientes', {
          method: 'POST',
          body: { termino: search.trim() },
          token: token
        });
        var searchResults = await res.json();
        
        // Now get full client data with properties for each result
        if (searchResults && searchResults.length > 0) {
          var ids = searchResults.map(c => c.id);
          var idsParam = 'in.(' + ids.join(',') + ')';
          var fullRes = await api('clientes?select=*,propiedades(*)&id=' + idsParam + '&order=nombre.asc', { token: token });
          data = await fullRes.json();
          setTotalClientes(data.length);
        } else {
          data = [];
          setTotalClientes(0);
        }
      } else {
        // No search - paginated list
        var url = 'clientes?select=*,propiedades(*)&order=nombre.asc&limit=' + ITEMS_POR_PAGINA + '&offset=' + offset;
        var res = await api(url, { token: token });
        
        // Get total count from header
        var range = res.headers.get('content-range');
        if (range) {
          var total = parseInt(range.split('/')[1]);
          setTotalClientes(total || 0);
        }
        
        data = await res.json();
      }
      
      setClientes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error loading clientes:', e);
      setClientes([]);
    }
    setLoading(false);
  }, [token]);

  const loadTownships = useCallback(async () => {
    try {
      const res = await api('townships?select=*&order=nombre.asc', { token });
      const data = await res.json();
      
      // Calculate status based on dates
      const today = new Date();
      const processedTownships = (Array.isArray(data) ? data : []).map(t => {
        let estado = t.estado || 'cerrado';
        
        if (t.fecha_limite_assessor) {
          const fechaLimite = new Date(t.fecha_limite_assessor);
          const diasRestantes = Math.ceil((fechaLimite - today) / (1000 * 60 * 60 * 24));
          
          if (diasRestantes > 0 && diasRestantes <= 7) {
            estado = 'urgente';
          } else if (diasRestantes > 7 && diasRestantes <= 30) {
            estado = 'proximo';
          } else if (diasRestantes > 30) {
            estado = 'abierto';
          } else if (diasRestantes <= 0) {
            estado = 'cerrado';
          }
        }
        
        return { ...t, estado_calculado: estado };
      });
      
      setTownships(processedTownships);
    } catch (e) {
      console.error('Error loading townships:', e);
    }
  }, [token]);

  // Load data when token changes
  useEffect(() => {
    if (token) {
      loadStats();
      loadClientes('', 0);
      loadTownships();
    }
  }, [token, loadStats, loadClientes, loadTownships]);

  // Search with debounce - reset to page 0 when searching
  useEffect(() => {
    if (!token) return;
    const t = setTimeout(() => {
      setPaginaActual(0);
      loadClientes(busqueda, 0);
    }, 500);
    return () => clearTimeout(t);
  }, [busqueda, token, loadClientes]);

  // Load client details when selected
  useEffect(() => {
    if (clienteSeleccionado?.id && token) {
      const loadClienteDetalle = async () => {
        try {
          const [notasRes, docsRes, facturasRes, apelRes] = await Promise.all([
            api(`notas?cliente_id=eq.${clienteSeleccionado.id}&order=created_at.desc`, { token }),
            api(`documentos?cliente_id=eq.${clienteSeleccionado.id}&order=created_at.desc`, { token }),
            api(`facturas?cliente_id=eq.${clienteSeleccionado.id}&order=created_at.desc`, { token }),
            api(`apelaciones?cliente_id=eq.${clienteSeleccionado.id}&order=created_at.desc`, { token })
          ]);
          setNotas(await notasRes.json() || []);
          setDocumentos(await docsRes.json() || []);
          setFacturas(await facturasRes.json() || []);
          setApelaciones(await apelRes.json() || []);
        } catch (e) {
          console.error('Error loading client details:', e);
          setNotas([]);
          setDocumentos([]);
          setFacturas([]);
          setApelaciones([]);
        }
      };
      loadClienteDetalle();
    }
  }, [clienteSeleccionado, token]);

  // CRUD Operations
  const saveCliente = async (data) => {
    setSaving(true);
    try {
      const isEdit = clienteSeleccionado && clienteSeleccionado.id;
      const url = isEdit ? `clientes?id=eq.${clienteSeleccionado.id}` : 'clientes';
      const method = isEdit ? 'PATCH' : 'POST';
      
      const res = await api(url, { method, body: data, token });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al guardar');
      }
      
      notify(isEdit ? 'Cliente actualizado' : 'Cliente creado');
      setModalActivo(null);
      setClienteSeleccionado(null);
      loadClientes(busqueda, paginaActual);
      loadStats();
    } catch (e) {
      notify(e.message || 'Error al guardar', 'error');
    }
    setSaving(false);
  };

  const savePropiedad = async (data) => {
    setSaving(true);
    try {
      const res = await api('propiedades', { method: 'POST', body: data, token });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al guardar');
      }
      notify('Propiedad agregada');
      setModalActivo(null);
      
      // Reload cliente data
      if (clienteSeleccionado) {
        const clienteRes = await api(`clientes?id=eq.${clienteSeleccionado.id}&select=*,propiedades(*)`, { token });
        const clienteData = await clienteRes.json();
        if (clienteData && clienteData[0]) {
          setClienteSeleccionado(clienteData[0]);
        }
      }
      loadStats();
    } catch (e) {
      notify(e.message || 'Error al guardar', 'error');
    }
    setSaving(false);
  };

  // Save Nota
  const saveNota = async (data) => {
    setSaving(true);
    try {
      const res = await api('notas', { method: 'POST', body: data, token });
      if (!res.ok) throw new Error('Error al guardar');
      notify('Nota agregada');
      setModalActivo(null);
    } catch (e) {
      notify('Error al guardar nota', 'error');
    }
    setSaving(false);
  };

  // Save Documento
  const saveDocumento = async (data) => {
    setSaving(true);
    try {
      const res = await api('documentos', { method: 'POST', body: data, token });
      if (!res.ok) throw new Error('Error al guardar');
      notify('Documento registrado');
      setModalActivo(null);
    } catch (e) {
      notify('Error al guardar documento', 'error');
    }
    setSaving(false);
  };

  // Save Factura
  const saveFactura = async (data) => {
    setSaving(true);
    try {
      const res = await api('facturas', { method: 'POST', body: data, token });
      if (!res.ok) throw new Error('Error al guardar');
      notify('Factura creada');
      setModalActivo(null);
    } catch (e) {
      notify('Error al guardar factura', 'error');
    }
    setSaving(false);
  };

  // Save Apelacion
  const saveApelacion = async (data) => {
    setSaving(true);
    try {
      const res = await api('apelaciones', { method: 'POST', body: data, token });
      if (!res.ok) throw new Error('Error al guardar');
      notify('Apelación registrada');
      setModalActivo(null);
    } catch (e) {
      notify('Error al guardar apelación', 'error');
    }
    setSaving(false);
  };

  const saveTownship = async (township) => {
    setSaving(true);
    try {
      await api(`townships?id=eq.${township.id}`, {
        method: 'PATCH',
        body: { 
          estado: township.estado, 
          fecha_limite_assessor: township.fecha_limite_assessor,
          fecha_limite_bor: township.fecha_limite_bor
        },
        token
      });
      notify('Township actualizado');
      loadTownships();
    } catch (e) {
      notify('Error al guardar', 'error');
    }
    setSaving(false);
  };

  // Update property township
  const updatePropiedadTownship = async (propiedadId, townshipId) => {
    try {
      await api(`propiedades?id=eq.${propiedadId}`, {
        method: 'PATCH',
        body: { township_id: townshipId || null },
        token
      });
      // Reload client to refresh properties
      if (clienteSeleccionado) {
        const res = await api(`clientes?id=eq.${clienteSeleccionado.id}&select=*,propiedades(*)`, { token });
        const data = await res.json();
        if (data && data[0]) {
          setClienteSeleccionado(data[0]);
        }
      }
      notify('Township actualizado');
    } catch (e) {
      notify('Error al actualizar township', 'error');
    }
  };

  const mergeClientes = async (clienteOrigen, clienteDestino) => {
    setSaving(true);
    try {
      // Move all properties from origen to destino
      if (clienteOrigen.propiedades && clienteOrigen.propiedades.length > 0) {
        for (const prop of clienteOrigen.propiedades) {
          await api(`propiedades?id=eq.${prop.id}`, {
            method: 'PATCH',
            body: { cliente_id: clienteDestino.id },
            token
          });
        }
      }
      
      // Move notas
      await api(`notas?cliente_id=eq.${clienteOrigen.id}`, {
        method: 'PATCH',
        body: { cliente_id: clienteDestino.id },
        token
      });
      
      // Move documentos
      await api(`documentos?cliente_id=eq.${clienteOrigen.id}`, {
        method: 'PATCH',
        body: { cliente_id: clienteDestino.id },
        token
      });
      
      // Move facturas
      await api(`facturas?cliente_id=eq.${clienteOrigen.id}`, {
        method: 'PATCH',
        body: { cliente_id: clienteDestino.id },
        token
      });
      
      // Move apelaciones
      await api(`apelaciones?cliente_id=eq.${clienteOrigen.id}`, {
        method: 'PATCH',
        body: { cliente_id: clienteDestino.id },
        token
      });
      
      // Create automatic note with merged client's data
      var notaContenido = `📋 CLIENTE FUSIONADO:\n`;
      notaContenido += `Nombre: ${clienteOrigen.nombre || ''} ${clienteOrigen.apellido || ''}\n`;
      if (clienteOrigen.customer_number) notaContenido += `Customer #: ${clienteOrigen.customer_number}\n`;
      if (clienteOrigen.work_order_number) notaContenido += `Work Order #: ${clienteOrigen.work_order_number}\n`;
      if (clienteOrigen.telefono_principal) notaContenido += `Teléfono: ${clienteOrigen.telefono_principal}\n`;
      if (clienteOrigen.email) notaContenido += `Email: ${clienteOrigen.email}\n`;
      if (clienteOrigen.direccion_correspondencia) notaContenido += `Dirección: ${clienteOrigen.direccion_correspondencia}\n`;
      if (clienteOrigen.legacy_id) notaContenido += `Legacy ID: ${clienteOrigen.legacy_id}\n`;
      notaContenido += `Propiedades transferidas: ${clienteOrigen.propiedades?.length || 0}`;
      
      await api('notas', {
        method: 'POST',
        body: {
          cliente_id: clienteDestino.id,
          contenido: notaContenido,
          tipo: 'nota'
        },
        token
      });
      
      // Create automatic factura to preserve customer/work order numbers
      if (clienteOrigen.customer_number || clienteOrigen.work_order_number) {
        await api('facturas', {
          method: 'POST',
          body: {
            cliente_id: clienteDestino.id,
            customer_number: clienteOrigen.customer_number || '',
            work_order_number: clienteOrigen.work_order_number || '',
            numero: 'FUSION-' + new Date().getTime().toString().slice(-6),
            monto: 0,
            concepto: `Registro de fusión: ${clienteOrigen.nombre || ''} ${clienteOrigen.apellido || ''}`,
            fecha_emision: new Date().toISOString().split('T')[0],
            estado: 'pendiente'
          },
          token
        });
      }
      
      // Delete the origen client
      await api(`clientes?id=eq.${clienteOrigen.id}`, { method: 'DELETE', token });
      
      notify('Clientes fusionados correctamente');
      setModalActivo(null);
      setClienteParaMerge(null);
      loadClientes(busqueda, paginaActual);
      loadStats();
    } catch (e) {
      notify('Error al fusionar clientes', 'error');
    }
    setSaving(false);
  };

  const deleteCliente = async (cliente) => {
    if (!window.confirm(`¿Seguro que deseas eliminar a ${cliente.nombre} ${cliente.apellido || ''}?`)) return;
    
    try {
      await api(`clientes?id=eq.${cliente.id}`, { method: 'DELETE', token });
      notify('Cliente eliminado');
      setClienteSeleccionado(null);
      setVistaActual('buscar');
      loadClientes(busqueda, paginaActual);
      loadStats();
    } catch (e) {
      notify('Error al eliminar', 'error');
    }
  };

  // Count clients per township
  const getClientesPorTownship = (townshipId) => {
    return clientes.filter(c => 
      c.propiedades && c.propiedades.some(p => p.township_id === townshipId)
    ).length;
  };
  
  const getPropiedadesPorTownship = (townshipId) => {
    let count = 0;
    clientes.forEach(c => {
      if (c.propiedades) {
        count += c.propiedades.filter(p => p.township_id === townshipId).length;
      }
    });
    return count;
  };

  // Get townships with alerts (open or urgent)
  const townshipsConAlertas = townships.filter(t => 
    t.estado === 'urgente' || t.estado === 'abierto' || t.estado_calculado === 'urgente' || t.estado_calculado === 'abierto'
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
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

  // Components
  const NavItem = ({ icon, label, vista, badge }) => (
    <button
      onClick={() => { setVistaActual(vista); setMenuAbierto(false); }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-colors ${vistaActual === vista ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-800'}`}
    >
      <div className="flex items-center space-x-3">
        <Icon name={icon} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{badge}</span>}
    </button>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-200 ${menuAbierto ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
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
          <NavItem icon="settings" label="Configuración" vista="config" />
        </div>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{user?.email?.split('@')[0] || 'Usuario'}</p>
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
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color === 'blue' ? 'bg-blue-100 text-blue-600' : color === 'green' ? 'bg-green-100 text-green-600' : color === 'red' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
          <Icon name={icon} />
        </div>
      </div>
    </div>
  );

  // Dashboard View
  const Dashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Township Alerts */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
          <span className="text-orange-500 mr-2"><Icon name="bell" /></span>
          Alertas de Townships
        </h2>
        {townshipsConAlertas.length > 0 ? townshipsConAlertas.slice(0, 5).map((t, idx) => {
          const estado = t.estado_calculado || t.estado;
          return (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${estado === 'urgente' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`font-bold ${estado === 'urgente' ? 'text-red-700' : 'text-green-700'}`}>{t.nombre}</span>
                  <span className="text-gray-600 ml-2">
                    {estado === 'urgente' ? '- ¡Cierra pronto!' : '- Abierto'}
                    {t.fecha_limite_assessor && ` (hasta ${new Date(t.fecha_limite_assessor).toLocaleDateString('es-MX')})`}
                  </span>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline" onClick={() => setVistaActual('townships')}>Ver</button>
              </div>
            </div>
          );
        }) : (
          <p className="text-gray-500 text-sm p-4 bg-gray-50 rounded-lg">No hay townships abiertos actualmente. Configura las fechas en Configuración → Fechas Townships.</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon="users" label="Total Clientes" value={stats.clientes.toLocaleString()} color="blue" />
        <StatCard icon="home" label="Propiedades" value={stats.propiedades.toLocaleString()} color="green" />
        <StatCard icon="alert" label="Townships Abiertos" value={townshipsConAlertas.length} color="red" />
        <StatCard icon="dollar" label="Pagos Pendientes" value={`$${stats.pendientes.toLocaleString()}`} color="yellow" />
      </div>

      {/* Quick Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Búsqueda Rápida</h2>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Icon name="search" /></span>
          <input 
            type="text" 
            placeholder="Buscar por nombre, teléfono, PIN..." 
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            onFocus={() => setVistaActual('buscar')} 
          />
        </div>
      </div>

      {/* Recent Clients */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Clientes Recientes</h2>
        <div className="space-y-3">
          {clientes.slice(0, 5).map((c, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{c.nombre?.[0] || '?'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{c.nombre} {c.apellido}</p>
                  <p className="text-xs text-gray-500">{c.propiedades?.length || 0} propiedades</p>
                </div>
              </div>
              <button className="text-blue-600 text-sm hover:underline" onClick={() => { setClienteSeleccionado(c); setVistaActual('expediente'); }}>Ver</button>
            </div>
          ))}
          {clientes.length === 0 && <p className="text-gray-500 text-center py-4">No hay clientes</p>}
        </div>
      </div>
    </div>
  );

  // Search View
  const totalPaginas = Math.ceil(totalClientes / ITEMS_POR_PAGINA);
  
  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    loadClientes(busqueda, nuevaPagina);
  };
  
  const BuscarCliente = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Buscar Cliente</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Icon name="search" /></span>
          <input 
            type="text" 
            placeholder="Buscar por nombre, teléfono, customer #, work order #..." 
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            autoFocus
          />
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <button 
            onClick={() => { setClienteSeleccionado(null); setModalActivo('nuevoCliente'); }} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2"
          >
            <Icon name="plus" />
            <span>Nuevo Cliente</span>
          </button>
          <button 
            onClick={() => setModalActivo('mergeClientes')} 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-2"
          >
            <Icon name="merge" />
            <span>Fusionar Clientes</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {loading ? 'Buscando...' : `Mostrando ${clientes.length} de ${totalClientes.toLocaleString()} clientes`}
          </p>
          {totalPaginas > 1 && (
            <p className="text-sm text-gray-500">
              Página {paginaActual + 1} de {totalPaginas}
            </p>
          )}
        </div>
        <div className="divide-y max-h-[500px] overflow-y-auto">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => { setClienteSeleccionado(cliente); setExpedienteTab('info'); setVistaActual('expediente'); }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{cliente.nombre?.[0]?.toUpperCase() || '?'}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{cliente.nombre} {cliente.apellido}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                      {cliente.customer_number && <span>#{cliente.customer_number}</span>}
                      {cliente.work_order_number && <span>Orden: {cliente.work_order_number}</span>}
                      {cliente.telefono_principal && <span>📞 {cliente.telefono_principal}</span>}
                      <span>🏠 {cliente.propiedades?.length || 0} prop.</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${cliente.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {cliente.estado || 'activo'}
                  </span>
                  <Icon name="chevron" />
                </div>
              </div>
            </div>
          ))}
          {!loading && clientes.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {busqueda ? 'No se encontraron clientes con esa búsqueda' : 'No hay clientes registrados'}
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {totalPaginas > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <button 
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 0 || loading}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-1"
            >
              <span>← Anterior</span>
            </button>
            
            <div className="flex items-center space-x-2">
              {paginaActual > 2 && (
                <>
                  <button onClick={() => cambiarPagina(0)} className="px-3 py-1 border rounded hover:bg-gray-50">1</button>
                  {paginaActual > 3 && <span className="text-gray-400">...</span>}
                </>
              )}
              
              {[...Array(5)].map((_, i) => {
                const pageNum = paginaActual - 2 + i;
                if (pageNum < 0 || pageNum >= totalPaginas) return null;
                return (
                  <button 
                    key={pageNum}
                    onClick={() => cambiarPagina(pageNum)}
                    className={`px-3 py-1 border rounded ${pageNum === paginaActual ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              
              {paginaActual < totalPaginas - 3 && (
                <>
                  {paginaActual < totalPaginas - 4 && <span className="text-gray-400">...</span>}
                  <button onClick={() => cambiarPagina(totalPaginas - 1)} className="px-3 py-1 border rounded hover:bg-gray-50">{totalPaginas}</button>
                </>
              )}
            </div>
            
            <button 
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual >= totalPaginas - 1 || loading}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center space-x-1"
            >
              <span>Siguiente →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Client Detail View
  const ExpedienteCliente = () => {
    const cliente = clienteSeleccionado;
    if (!cliente) return <div className="p-8 text-center">Selecciona un cliente</div>;
    
    const tabs = [
      { id: 'info', label: 'Información' },
      { id: 'propiedades', label: `Propiedades (${cliente.propiedades?.length || 0})` },
      { id: 'documentos', label: `Documentos (${documentos.length})` },
      { id: 'notas', label: `Notas (${notas.length})` },
      { id: 'facturas', label: `Facturas (${facturas.length})` },
      { id: 'apelaciones', label: `Apelaciones (${apelaciones.length})` },
    ];
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => { setVistaActual('buscar'); setClienteSeleccionado(null); }} className="text-gray-400 hover:text-gray-600">←</button>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">{cliente.nombre?.[0] || '?'}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{cliente.nombre} {cliente.apellido}</h1>
                <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                  {cliente.customer_number && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Cliente #{cliente.customer_number}</span>}
                  {cliente.work_order_number && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Orden #{cliente.work_order_number}</span>}
                  <span className={`px-2 py-0.5 rounded ${cliente.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{cliente.estado || 'activo'}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setModalActivo('mergeClientes')} className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-1">
                <Icon name="merge" />
                <span>Fusionar</span>
              </button>
              <button onClick={() => setModalActivo('nuevoCliente')} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-1">
                <Icon name="edit" />
                <span>Editar</span>
              </button>
              <button onClick={() => deleteCliente(cliente)} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                <Icon name="trash" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setExpedienteTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${expedienteTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {/* Info Tab */}
            {expedienteTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Contacto</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3"><Icon name="phone" /><span>{cliente.telefono_principal || 'Sin teléfono'}</span></div>
                    <div className="flex items-center space-x-3"><Icon name="mail" /><span>{cliente.email || 'Sin email'}</span></div>
                    <div className="flex items-start space-x-3"><Icon name="mapPin" /><span>{cliente.direccion_correspondencia || 'Sin dirección'}</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Sistema</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Customer #:</span> <span className="font-medium">{cliente.customer_number || 'N/A'}</span></p>
                    <p><span className="text-gray-500">Work Order #:</span> <span className="font-medium">{cliente.work_order_number || 'N/A'}</span></p>
                    {cliente.legacy_id && <p><span className="text-gray-500">Legacy ID:</span> <span className="font-medium">{cliente.legacy_id}</span></p>}
                  </div>
                </div>
              </div>
            )}
            
            {/* Properties Tab */}
            {expedienteTab === 'propiedades' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Propiedades</h3>
                  <button onClick={() => setModalActivo('nuevaPropiedad')} className="text-blue-600 text-sm hover:underline">+ Agregar</button>
                </div>
                {cliente.propiedades?.length > 0 ? cliente.propiedades.map((p, idx) => {
                  const twp = townships.find(t => t.id === p.township_id);
                  return (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-lg font-semibold text-blue-600">{p.pin}</p>
                          <p className="text-gray-600">{p.direccion || 'Sin dirección'}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center space-x-2">
                        <label className="text-sm text-gray-500">Township:</label>
                        <select 
                          className="border rounded px-2 py-1 text-sm"
                          value={p.township_id || ''}
                          onChange={(e) => updatePropiedadTownship(p.id, e.target.value || null)}
                        >
                          <option value="">-- Seleccionar --</option>
                          {townships.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre} ({t.codigo})</option>
                          ))}
                        </select>
                        {twp && (
                          <span className={`px-2 py-0.5 rounded text-xs ${twp.estado_calculado === 'abierto' ? 'bg-green-100 text-green-700' : twp.estado_calculado === 'urgente' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {twp.estado_calculado || 'cerrado'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }) : <p className="text-gray-500 text-center py-8">Sin propiedades</p>}
              </div>
            )}
            
            {/* Documents Tab */}
            {expedienteTab === 'documentos' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Documentos</h3>
                  <button onClick={() => setModalActivo('nuevoDocumento')} className="text-blue-600 text-sm hover:underline">+ Agregar</button>
                </div>
                {documentos.length > 0 ? documentos.map((d, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg mb-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{d.nombre}</p>
                      <p className="text-sm text-gray-500">{d.tipo} - {d.created_at ? new Date(d.created_at).toLocaleDateString() : ''}</p>
                      {d.notas && <p className="text-sm text-gray-600 mt-1">{d.notas}</p>}
                    </div>
                    {d.archivo_url && <a href={d.archivo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver</a>}
                  </div>
                )) : <p className="text-gray-500 text-center py-8">Sin documentos</p>}
              </div>
            )}
            
            {/* Notes Tab */}
            {expedienteTab === 'notas' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Notas e Historial</h3>
                  <button onClick={() => setModalActivo('nuevaNota')} className="text-blue-600 text-sm hover:underline">+ Agregar</button>
                </div>
                {notas.length > 0 ? notas.map((n, i) => (
                  <div key={i} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
                    <div className="flex justify-between mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${n.tipo === 'llamada' ? 'bg-blue-100 text-blue-700' : n.tipo === 'email' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>{n.tipo || 'nota'}</span>
                      <span className="text-xs text-gray-400">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</span>
                    </div>
                    <p className="text-gray-700">{n.contenido}</p>
                  </div>
                )) : <p className="text-gray-500 text-center py-8">Sin notas</p>}
              </div>
            )}
            
            {/* Invoices Tab */}
            {expedienteTab === 'facturas' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Facturas</h3>
                  <button onClick={() => setModalActivo('nuevaFactura')} className="text-blue-600 text-sm hover:underline">+ Agregar</button>
                </div>
                {facturas.length > 0 ? facturas.map((f, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Factura #{f.numero || f.id?.substring(0, 8)}</p>
                        <div className="flex space-x-3 text-xs text-gray-500 mt-1">
                          {f.customer_number && <span>Customer: {f.customer_number}</span>}
                          {f.work_order_number && <span>Work Order: {f.work_order_number}</span>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{f.concepto}</p>
                        <p className="text-xs text-gray-400 mt-1">{f.fecha_emision}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${f.monto || 0}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${f.estado === 'pagada' ? 'bg-green-100 text-green-700' : f.estado === 'cancelada' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{f.estado}</span>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-gray-500 text-center py-8">Sin facturas</p>}
              </div>
            )}
            
            {/* Appeals Tab */}
            {expedienteTab === 'apelaciones' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Apelaciones</h3>
                  <button onClick={() => setModalActivo('nuevaApelacion')} className="text-blue-600 text-sm hover:underline">+ Agregar</button>
                </div>
                {apelaciones.length > 0 ? apelaciones.map((a, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg mb-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Año {a.anio} - {a.tipo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${a.estado === 'aprobada' ? 'bg-green-100 text-green-700' : a.estado === 'rechazada' ? 'bg-red-100 text-red-700' : a.estado === 'enviada' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.estado}</span>
                    </div>
                    {a.ahorro && <p className="text-green-600 font-medium">Ahorro: ${a.ahorro}</p>}
                    {a.notas && <p className="text-sm text-gray-600 mt-1">{a.notas}</p>}
                  </div>
                )) : <p className="text-gray-500 text-center py-8">Sin apelaciones</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Townships View
  const Townships = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Clientes por Township</h1>
      <div className="grid gap-4">
        {townships.map((t, idx) => {
          const clientesTwp = getClientesPorTownship(t.id);
          const propiedadesTwp = getPropiedadesPorTownship(t.id);
          const estado = t.estado_calculado || t.estado || 'cerrado';
          
          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    estado === 'abierto' ? 'bg-green-100 text-green-600' : 
                    estado === 'urgente' ? 'bg-red-100 text-red-600' : 
                    estado === 'proximo' ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon name="mapPin" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.nombre}</h3>
                    <p className="text-sm text-gray-500">Código: {t.codigo}</p>
                    {t.fecha_limite_assessor && (
                      <p className="text-xs text-gray-400">Límite: {new Date(t.fecha_limite_assessor).toLocaleDateString('es-MX')}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{propiedadesTwp}</p>
                    <p className="text-xs text-gray-500">Propiedades</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{clientesTwp}</p>
                    <p className="text-xs text-gray-500">Clientes</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    estado === 'abierto' ? 'bg-green-100 text-green-700' : 
                    estado === 'urgente' ? 'bg-red-100 text-red-700' : 
                    estado === 'proximo' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {estado}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Pending Clients View
  const Pendientes = () => {
    const clientesSinPropiedades = clientes.filter(c => !c.propiedades || c.propiedades.length === 0);
    
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes Pendientes por Aplicar</h1>
        <p className="text-gray-500">Clientes que no tienen propiedades registradas o pendientes de aplicación.</p>
        
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <p className="text-sm text-gray-500">{clientesSinPropiedades.length} clientes pendientes</p>
          </div>
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {clientesSinPropiedades.map((cliente) => (
              <div key={cliente.id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => { setClienteSeleccionado(cliente); setVistaActual('expediente'); }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Icon name="alert" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cliente.nombre} {cliente.apellido}</p>
                      <p className="text-sm text-gray-500">{cliente.telefono_principal || 'Sin teléfono'}</p>
                    </div>
                  </div>
                  <Icon name="chevron" />
                </div>
              </div>
            ))}
            {clientesSinPropiedades.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                ¡Todos los clientes tienen propiedades registradas!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Facturas View (placeholder)
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
        <p className="text-gray-500">Módulo de facturas en desarrollo</p>
      </div>
    </div>
  );

  // Weekly Report View
  const CorteSemanal = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
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

  // Templates View
  const Plantillas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Plantillas de Mensajes</h1>
        <button 
          onClick={() => { setPlantillaEditando({ id: null, nombre: '', contenido: '' }); setModalActivo('editarPlantilla'); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2"
        >
          <Icon name="plus" />
          <span>Nueva Plantilla</span>
        </button>
      </div>
      
      <div className="grid gap-4">
        {plantillas.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{p.nombre}</h3>
              <button 
                onClick={() => { setPlantillaEditando(p); setModalActivo('editarPlantilla'); }}
                className="text-blue-600 text-sm hover:underline flex items-center space-x-1"
              >
                <Icon name="edit" />
                <span>Editar</span>
              </button>
            </div>
            <p className="text-gray-600 text-sm">{p.contenido}</p>
            <div className="mt-3 flex space-x-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{'{nombre}'}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{'{township}'}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{'{fecha}'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Configuration View
  const Configuracion = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
      
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setConfigTab('usuarios')} className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${configTab === 'usuarios' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
          <Icon name="users" />
          <span>Usuarios</span>
        </button>
        <button onClick={() => setConfigTab('townships')} className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${configTab === 'townships' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
          <Icon name="calendar" />
          <span>Fechas Townships</span>
        </button>
      </div>

      {configTab === 'usuarios' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Usuarios del Sistema</h2>
            <button 
              onClick={() => setModalActivo('nuevoUsuario')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2"
            >
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
        </div>
      )}

      {configTab === 'townships' && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Fechas y Estados de Townships</h2>
          <p className="text-sm text-gray-500 mb-4">Configura las fechas límite para que el sistema detecte automáticamente qué townships están abiertos.</p>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {townships.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900 w-32">{t.nombre}</span>
                  <span className="text-sm text-gray-500">({t.codigo})</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="text-xs text-gray-500">Fecha límite Assessor</label>
                    <input 
                      type="date" 
                      className="border rounded-lg px-3 py-2 text-sm block" 
                      value={t.fecha_limite_assessor || ''} 
                      onChange={(e) => saveTownship({ ...t, fecha_limite_assessor: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Estado manual</label>
                    <select 
                      className="border rounded-lg px-3 py-2 text-sm block" 
                      value={t.estado || 'cerrado'} 
                      onChange={(e) => saveTownship({ ...t, estado: e.target.value })}
                    >
                      <option value="cerrado">Cerrado</option>
                      <option value="abierto">Abierto</option>
                      <option value="urgente">Urgente</option>
                      <option value="proximo">Próximo</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // MODALS

  // New/Edit Client Modal
  const ModalNuevoCliente = () => {
    const [form, setForm] = useState({
      nombre: clienteSeleccionado?.nombre || '',
      apellido: clienteSeleccionado?.apellido || '',
      telefono_principal: clienteSeleccionado?.telefono_principal || '',
      email: clienteSeleccionado?.email || '',
      direccion_correspondencia: clienteSeleccionado?.direccion_correspondencia || '',
      estado: clienteSeleccionado?.estado || 'activo',
      customer_number: clienteSeleccionado?.customer_number || '',
      work_order_number: clienteSeleccionado?.work_order_number || '',
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{clienteSeleccionado ? 'Editar' : 'Nuevo'} Cliente</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600">
              <Icon name="x" />
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveCliente(form); }}>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer #</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.customer_number} onChange={(e) => setForm({...form, customer_number: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Order #</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.work_order_number} onChange={(e) => setForm({...form, work_order_number: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.telefono_principal} onChange={(e) => setForm({...form, telefono_principal: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.direccion_correspondencia} onChange={(e) => setForm({...form, direccion_correspondencia: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="w-full border rounded-lg px-3 py-2" value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value})}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="prospecto">Prospecto</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button type="button" onClick={() => setModalActivo(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // New Property Modal
  const ModalNuevaPropiedad = () => {
    const [form, setForm] = useState({
      cliente_id: clienteSeleccionado?.id || '',
      pin: '',
      direccion: '',
      ciudad: 'Chicago',
      zip: ''
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Agregar Propiedad</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600">
              <Icon name="x" />
            </button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); savePropiedad(form); }}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN (14 dígitos) *</label>
                <input 
                  className="w-full border rounded-lg px-3 py-2 font-mono" 
                  value={form.pin} 
                  onChange={(e) => setForm({...form, pin: e.target.value.replace(/\D/g, '')})} 
                  maxLength={14} 
                  placeholder="Ej: 16251150150000"
                  required 
                />
                {form.pin && form.pin.length >= 2 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Township: {townships.find(t => t.codigo === form.pin.substring(0, 2))?.nombre || form.pin.substring(0, 2)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.direccion} onChange={(e) => setForm({...form, direccion: e.target.value})} placeholder="Ej: 1234 S Main St" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.ciudad} onChange={(e) => setForm({...form, ciudad: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.zip} onChange={(e) => setForm({...form, zip: e.target.value})} maxLength={5} />
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button type="button" onClick={() => setModalActivo(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Nueva Nota Modal
  const ModalNuevaNota = () => {
    const [form, setForm] = useState({
      cliente_id: clienteSeleccionado?.id || '',
      contenido: '',
      tipo: 'nota'
    });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Nueva Nota</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600"><Icon name="x" /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveNota(form); }}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select className="w-full border rounded-lg px-3 py-2" value={form.tipo} onChange={(e) => setForm({...form, tipo: e.target.value})}>
                  <option value="nota">Nota</option>
                  <option value="llamada">Llamada</option>
                  <option value="email">Email</option>
                  <option value="visita">Visita</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                <textarea className="w-full border rounded-lg px-3 py-2 h-32" value={form.contenido} onChange={(e) => setForm({...form, contenido: e.target.value})} required />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button type="button" onClick={() => setModalActivo(null)} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Nuevo Documento Modal
  const ModalNuevoDocumento = () => {
    const [form, setForm] = useState({
      cliente_id: clienteSeleccionado?.id || '',
      nombre: '',
      tipo: 'otro',
      notas: '',
      archivo_url: ''
    });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Nuevo Documento</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600"><Icon name="x" /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveDocumento(form); }}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del documento *</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select className="w-full border rounded-lg px-3 py-2" value={form.tipo} onChange={(e) => setForm({...form, tipo: e.target.value})}>
                  <option value="identificacion">Identificación</option>
                  <option value="titulo">Título de propiedad</option>
                  <option value="factura_impuestos">Factura de impuestos</option>
                  <option value="autorizacion">Autorización</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL del archivo (opcional)</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.archivo_url} onChange={(e) => setForm({...form, archivo_url: e.target.value})} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea className="w-full border rounded-lg px-3 py-2" value={form.notas} onChange={(e) => setForm({...form, notas: e.target.value})} />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button type="button" onClick={() => setModalActivo(null)} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Nueva Factura Modal
  const ModalNuevaFactura = () => {
    const [form, setForm] = useState({
      cliente_id: clienteSeleccionado?.id || '',
      customer_number: clienteSeleccionado?.customer_number || '',
      work_order_number: clienteSeleccionado?.work_order_number || '',
      numero: '',
      monto: '',
      concepto: '',
      fecha_emision: new Date().toISOString().split('T')[0],
      estado: 'pendiente'
    });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Nueva Factura</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600"><Icon name="x" /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveFactura({...form, monto: parseFloat(form.monto) || 0}); }}>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer #</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.customer_number} onChange={(e) => setForm({...form, customer_number: e.target.value})} placeholder="Ej: 001234" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Order #</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.work_order_number} onChange={(e) => setForm({...form, work_order_number: e.target.value})} placeholder="Ej: 002345" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número Factura</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.numero} onChange={(e) => setForm({...form, numero: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
                  <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" value={form.monto} onChange={(e) => setForm({...form, monto: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
                <input className="w-full border rounded-lg px-3 py-2" value={form.concepto} onChange={(e) => setForm({...form, concepto: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.fecha_emision} onChange={(e) => setForm({...form, fecha_emision: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value})}>
                    <option value="pendiente">Pendiente</option>
                    <option value="pagada">Pagada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button type="button" onClick={() => setModalActivo(null)} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Nueva Apelacion Modal
  const ModalNuevaApelacion = () => {
    const [form, setForm] = useState({
      cliente_id: clienteSeleccionado?.id || '',
      propiedad_id: clienteSeleccionado?.propiedades?.[0]?.id || '',
      anio: new Date().getFullYear(),
      tipo: 'assessor',
      estado: 'pendiente',
      notas: '',
      ahorro: ''
    });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Nueva Apelación</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600"><Icon name="x" /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveApelacion({...form, ahorro: parseFloat(form.ahorro) || null}); }}>
            <div className="p-6 space-y-4">
              {clienteSeleccionado?.propiedades?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Propiedad</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={form.propiedad_id} onChange={(e) => setForm({...form, propiedad_id: e.target.value})}>
                    {clienteSeleccionado.propiedades.map(p => (
                      <option key={p.id} value={p.id}>{p.pin} - {p.direccion || 'Sin dirección'}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
                  <input type="number" className="w-full border rounded-lg px-3 py-2" value={form.anio} onChange={(e) => setForm({...form, anio: parseInt(e.target.value)})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={form.tipo} onChange={(e) => setForm({...form, tipo: e.target.value})}>
                    <option value="assessor">Assessor</option>
                    <option value="bor">Board of Review</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value})}>
                    <option value="pendiente">Pendiente</option>
                    <option value="enviada">Enviada</option>
                    <option value="aprobada">Aprobada</option>
                    <option value="rechazada">Rechazada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ahorro $</label>
                  <input type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" value={form.ahorro} onChange={(e) => setForm({...form, ahorro: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea className="w-full border rounded-lg px-3 py-2" value={form.notas} onChange={(e) => setForm({...form, notas: e.target.value})} />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button type="button" onClick={() => setModalActivo(null)} className="px-4 py-2 border rounded-lg text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Merge Clients Modal
  const ModalMergeClientes = () => {
    const [clienteOrigen, setClienteOrigen] = useState(null);
    const [clienteDestino, setClienteDestino] = useState(null);
    const [searchOrigen, setSearchOrigen] = useState('');
    const [searchDestino, setSearchDestino] = useState('');

    const clientesFiltradosOrigen = clientes.filter(c => 
      c.nombre?.toLowerCase().includes(searchOrigen.toLowerCase()) ||
      c.apellido?.toLowerCase().includes(searchOrigen.toLowerCase()) ||
      c.telefono_principal?.includes(searchOrigen)
    ).slice(0, 5);

    const clientesFiltradosDestino = clientes.filter(c => 
      c.id !== clienteOrigen?.id && (
        c.nombre?.toLowerCase().includes(searchDestino.toLowerCase()) ||
        c.apellido?.toLowerCase().includes(searchDestino.toLowerCase()) ||
        c.telefono_principal?.includes(searchDestino)
      )
    ).slice(0, 5);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Fusionar Clientes Duplicados</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600">
              <Icon name="x" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-4">Las propiedades del cliente origen se moverán al cliente destino, y el cliente origen será eliminado.</p>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Cliente Origen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente a eliminar (origen)</label>
                <input 
                  className="w-full border rounded-lg px-3 py-2 mb-2" 
                  placeholder="Buscar cliente..." 
                  value={searchOrigen}
                  onChange={(e) => setSearchOrigen(e.target.value)}
                />
                {searchOrigen && !clienteOrigen && (
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {clientesFiltradosOrigen.map(c => (
                      <div 
                        key={c.id} 
                        className="p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => { setClienteOrigen(c); setSearchOrigen(''); }}
                      >
                        <p className="font-medium">{c.nombre} {c.apellido}</p>
                        <p className="text-xs text-gray-500">{c.propiedades?.length || 0} propiedades</p>
                      </div>
                    ))}
                  </div>
                )}
                {clienteOrigen && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-red-800">{clienteOrigen.nombre} {clienteOrigen.apellido}</p>
                        <p className="text-xs text-red-600">{clienteOrigen.propiedades?.length || 0} propiedades</p>
                      </div>
                      <button onClick={() => setClienteOrigen(null)} className="text-red-400 hover:text-red-600">
                        <Icon name="x" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cliente Destino */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente a mantener (destino)</label>
                <input 
                  className="w-full border rounded-lg px-3 py-2 mb-2" 
                  placeholder="Buscar cliente..." 
                  value={searchDestino}
                  onChange={(e) => setSearchDestino(e.target.value)}
                />
                {searchDestino && !clienteDestino && (
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {clientesFiltradosDestino.map(c => (
                      <div 
                        key={c.id} 
                        className="p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => { setClienteDestino(c); setSearchDestino(''); }}
                      >
                        <p className="font-medium">{c.nombre} {c.apellido}</p>
                        <p className="text-xs text-gray-500">{c.propiedades?.length || 0} propiedades</p>
                      </div>
                    ))}
                  </div>
                )}
                {clienteDestino && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-green-800">{clienteDestino.nombre} {clienteDestino.apellido}</p>
                        <p className="text-xs text-green-600">{clienteDestino.propiedades?.length || 0} propiedades</p>
                      </div>
                      <button onClick={() => setClienteDestino(null)} className="text-green-400 hover:text-green-600">
                        <Icon name="x" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {clienteOrigen && clienteDestino && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Resultado:</strong> Las {clienteOrigen.propiedades?.length || 0} propiedades de "{clienteOrigen.nombre}" 
                  se moverán a "{clienteDestino.nombre}" (total: {(clienteOrigen.propiedades?.length || 0) + (clienteDestino.propiedades?.length || 0)} propiedades)
                </p>
              </div>
            )}
          </div>
          <div className="p-6 border-t flex justify-end space-x-2">
            <button onClick={() => setModalActivo(null)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
            <button 
              onClick={() => mergeClientes(clienteOrigen, clienteDestino)}
              disabled={!clienteOrigen || !clienteDestino || saving}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? 'Fusionando...' : 'Fusionar y Eliminar'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // New User Modal
  const ModalNuevoUsuario = () => {
    const [form, setForm] = useState({ email: '', password: '', nombre: '' });

    const handleSubmit = async (e) => {
      e.preventDefault();
      notify('Para crear usuarios, ve a Supabase Dashboard → Authentication → Users → Add User', 'info');
      setModalActivo(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Nuevo Usuario</h3>
            <button onClick={() => setModalActivo(null)} className="text-gray-400 hover:text-gray-600">
              <Icon name="x" />
            </button>
          </div>
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Para crear nuevos usuarios con acceso al sistema, debes ir a:
              </p>
              <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
                <li>Abre <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">Supabase Dashboard</a></li>
                <li>Selecciona tu proyecto "Property Tax Refund Service"</li>
                <li>Ve a Authentication → Users</li>
                <li>Click en "Add User"</li>
                <li>Ingresa email y contraseña</li>
              </ol>
            </div>
          </div>
          <div className="p-6 border-t flex justify-end">
            <button onClick={() => setModalActivo(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Entendido
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Template Modal
  const ModalEditarPlantilla = () => {
    const [form, setForm] = useState({
      nombre: plantillaEditando?.nombre || '',
      contenido: plantillaEditando?.contenido || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (plantillaEditando?.id) {
        setPlantillas(plantillas.map(p => p.id === plantillaEditando.id ? { ...p, ...form } : p));
      } else {
        setPlantillas([...plantillas, { id: Date.now(), ...form }]);
      }
      notify('Plantilla guardada');
      setModalActivo(null);
      setPlantillaEditando(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{plantillaEditando?.id ? 'Editar' : 'Nueva'} Plantilla</h3>
            <button onClick={() => { setModalActivo(null); setPlantillaEditando(null); }} className="text-gray-400 hover:text-gray-600">
              <Icon name="x" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la plantilla *</label>
                <input 
                  className="w-full border rounded-lg px-3 py-2" 
                  value={form.nombre} 
                  onChange={(e) => setForm({...form, nombre: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido del mensaje *</label>
                <textarea 
                  className="w-full border rounded-lg px-3 py-2 h-32" 
                  value={form.contenido} 
                  onChange={(e) => setForm({...form, contenido: e.target.value})} 
                  required 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables disponibles: {'{nombre}'}, {'{apellido}'}, {'{township}'}, {'{fecha}'}, {'{pin}'}, {'{ahorro}'}, {'{balance}'}
                </p>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-2">
              <button type="button" onClick={() => { setModalActivo(null); setPlantillaEditando(null); }} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render current view
  const renderView = () => {
    switch (vistaActual) {
      case 'dashboard': return <Dashboard />;
      case 'buscar': return <BuscarCliente />;
      case 'expediente': return <ExpedienteCliente />;
      case 'townships': return <Townships />;
      case 'pendientes': return <Pendientes />;
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
      
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-40 flex items-center justify-between px-4">
        <button onClick={() => setMenuAbierto(true)} className="text-gray-600">
          <Icon name="menu" />
        </button>
        <span className="font-bold text-gray-900">PTRS</span>
        <div className="w-6"></div>
      </div>
      
      {/* Main content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">{renderView()}</div>
      </div>
      
      {/* Modals */}
      {modalActivo === 'nuevoCliente' && <ModalNuevoCliente />}
      {modalActivo === 'nuevaPropiedad' && <ModalNuevaPropiedad />}
      {modalActivo === 'nuevaNota' && <ModalNuevaNota />}
      {modalActivo === 'nuevoDocumento' && <ModalNuevoDocumento />}
      {modalActivo === 'nuevaFactura' && <ModalNuevaFactura />}
      {modalActivo === 'nuevaApelacion' && <ModalNuevaApelacion />}
      {modalActivo === 'mergeClientes' && <ModalMergeClientes />}
      {modalActivo === 'nuevoUsuario' && <ModalNuevoUsuario />}
      {modalActivo === 'editarPlantilla' && <ModalEditarPlantilla />}
      
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg text-white shadow-lg z-50 ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-blue-600' : 'bg-green-600'}`}>
          {toast.msg}
        </div>
      )}
      
      {/* Mobile overlay */}
      {menuAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMenuAbierto(false)}></div>
      )}
    </div>
  );
}

// Login Screen Component
function LoginScreen({ onLogin, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-4 py-3" placeholder="usuario@ptrs.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-4 py-3" placeholder="********" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">Sistema de Gestión v2.0</p>
      </div>
    </div>
  );
}
