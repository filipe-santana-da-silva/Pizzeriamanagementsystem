import { useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from '@/app/components/Sidebar';
import { Dashboard } from '@/app/components/Dashboard';
import { Pedidos } from '@/app/components/Pedidos';
import { Cardapio } from '@/app/components/Cardapio';
import { Estoque } from '@/app/components/Estoque';
import { Clientes } from '@/app/components/Clientes';
import { Relatorios } from '@/app/components/Relatorios';

type Page = 'dashboard' | 'pedidos' | 'cardapio' | 'estoque' | 'clientes' | 'relatorios';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'pedidos':
        return <Pedidos />;
      case 'cardapio':
        return <Cardapio />;
      case 'estoque':
        return <Estoque />;
      case 'clientes':
        return <Clientes />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
