import React, { useState, useEffect } from 'react';
import { AuthProvider, ROLES } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import InvoiceModal from './components/InvoiceModal';
import DashboardPage from './pages/DashboardPage';
import HuespedesPage from './pages/HuespedesPage';
import HabitacionesPage from './pages/HabitacionesPage';
import HospedajesPage from './pages/HospedajesPage';
import FacturasPage from './pages/FacturasPage';
import ReportesPage from './pages/ReportesPage';
import LoginPage from './pages/LoginPage';
import { db } from './lib/supabase';

export function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [huespedes, setHuespedes] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [hospedajes, setHospedajes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFactura, setSelectedFactura] = useState(null);

  // Carga inicial de datos desde Supabase / Local Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [huesp, habs, hosps, facts] = await Promise.all([
        db.getHuespedes(),
        db.getHabitaciones(),
        db.getHospedajes(),
        db.getFacturas()
      ]);
      setHuespedes(huesp || []);
      setHabitaciones(habs || []);
      setHospedajes(hosps || []);
      setFacturas(facts || []);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers para mutaciones
  const handleAddHuesped = async (huespedData) => {
    const created = await db.createHuesped(huespedData);
    await loadData();
    return created;
  };

  const handleAddHospedaje = async (hospedajeData) => {
    const created = await db.createHospedaje(hospedajeData);
    await loadData();
    return created;
  };

  const handleCreateFactura = async (payload) => {
    const created = await db.createFactura(payload);
    await loadData();
    return created;
  };

  const handleAnularFactura = async (id_factura, motivo) => {
    const anulada = await db.anularFactura(id_factura, motivo);
    await loadData();
    return anulada;
  };

  const stats = {
    disponibles: habitaciones.filter(h => h.estado === 'Disponible').length,
    ocupadas: habitaciones.filter(h => h.estado === 'Ocupada').length
  };

  const renderCurrentPage = () => {
    if (loading) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Cargando datos del hotel...</p>
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            huespedes={huespedes}
            habitaciones={habitaciones}
            hospedajes={hospedajes}
            facturas={facturas}
            onNavigate={setActivePage}
            onOpenInvoice={setSelectedFactura}
          />
        );

      case 'huespedes':
        return (
          <HuespedesPage
            huespedes={huespedes}
            onAddHuesped={handleAddHuesped}
          />
        );

      case 'habitaciones':
        return (
          <HabitacionesPage
            habitaciones={habitaciones}
            onUpdateEstado={async (id, st) => {
              await db.updateHabitacionEstado(id, st);
              await loadData();
            }}
            onNavigate={setActivePage}
          />
        );

      case 'estadias':
        return (
          <HospedajesPage
            huespedes={huespedes}
            habitaciones={habitaciones}
            hospedajes={hospedajes}
            onAddHospedaje={handleAddHospedaje}
            onCreateFactura={handleCreateFactura}
            onOpenInvoice={setSelectedFactura}
            onNavigate={setActivePage}
          />
        );

      case 'facturas':
        return (
          <FacturasPage
            facturas={facturas}
            onAnularFactura={handleAnularFactura}
            onOpenInvoice={setSelectedFactura}
          />
        );

      case 'reportes':
      case 'historial_fiscal':
        return (
          <ProtectedRoute requiredRole={ROLES.GERENCIA} onNavigate={setActivePage}>
            <ReportesPage
              facturas={facturas}
              hospedajes={hospedajes}
              habitaciones={habitaciones}
            />
          </ProtectedRoute>
        );

      case 'login':
        return <LoginPage onNavigate={setActivePage} />;

      default:
        return (
          <DashboardPage
            huespedes={huespedes}
            habitaciones={habitaciones}
            hospedajes={hospedajes}
            facturas={facturas}
            onNavigate={setActivePage}
            onOpenInvoice={setSelectedFactura}
          />
        );
    }
  };

  return (
    <Layout
      activePage={activePage}
      setActivePage={setActivePage}
      onOpenQuickCheckin={() => setActivePage('estadias')}
      stats={stats}
    >
      {renderCurrentPage()}

      {/* Invoice View and Print Modal */}
      {selectedFactura && (
        <InvoiceModal
          factura={selectedFactura}
          onClose={() => setSelectedFactura(null)}
          onAnular={async (id) => {
            const motivo = prompt('Ingrese el motivo de la anulación fiscal:');
            if (motivo) {
              await handleAnularFactura(id, motivo);
              setSelectedFactura(null);
            }
          }}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
