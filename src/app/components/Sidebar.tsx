import { Home, ShoppingCart, Pizza, Package, Users, BarChart3 } from 'lucide-react';

type Page = 'dashboard' | 'pedidos' | 'cardapio' | 'estoque' | 'clientes' | 'relatorios';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
  { id: 'pedidos' as Page, label: 'Pedidos', icon: ShoppingCart },
  { id: 'cardapio' as Page, label: 'Cardápio', icon: Pizza },
  { id: 'estoque' as Page, label: 'Estoque', icon: Package },
  { id: 'clientes' as Page, label: 'Clientes', icon: Users },
  { id: 'relatorios' as Page, label: 'Relatórios', icon: BarChart3 },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Pizza className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">PizzaSystem</h1>
            <p className="text-xs text-gray-500">Gestão Completa</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-red-50 text-red-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2026 PizzaSystem
        </div>
      </div>
    </div>
  );
}
