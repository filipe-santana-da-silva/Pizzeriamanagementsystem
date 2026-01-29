import { useState } from 'react';
import { Toaster } from 'sonner';
import { Sidebar } from '@/app/components/Sidebar';
import { Dashboard } from '@/app/components/Dashboard';
import { Pedidos } from '@/app/components/Pedidos';
import { Cardapio } from '@/app/components/Cardapio';
import { Estoque } from '@/app/components/Estoque';
import { Clientes } from '@/app/components/Clientes';
import { Relatorios } from '@/app/components/Relatorios';
import { ControleFinanceiro } from '@/app/components/ControleFinanceiro';
import { NotaFiscal } from '@/app/components/NotaFiscal';
import { Entregas } from '@/app/components/Entregas';
import { Cozinha } from '@/app/components/Cozinha';
import { Permissoes } from '@/app/components/Permissoes';

type Page = 'dashboard' | 'pedidos' | 'cardapio' | 'estoque' | 'clientes' | 'relatorios' | 'financeiro' | 'notafiscal' | 'entregas' | 'cozinha' | 'permissoes';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'pedidos':
        return <Pedidos />;
      case 'cozinha':
        return <Cozinha />;
      case 'cardapio':
        return <Cardapio />;
      case 'estoque':
        return <Estoque />;
      case 'clientes':
        return <Clientes />;
      case 'relatorios':
        return <Relatorios />;
      case 'financeiro':
        return <ControleFinanceiro />;
      case 'notafiscal':
        return <NotaFiscal />;
      case 'entregas':
        return <Entregas />;
      case 'permissoes':
        return <Permissoes />;
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
