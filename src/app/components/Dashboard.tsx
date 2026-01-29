import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingCart, Package, DollarSign, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

interface DashboardStats {
  pedidosHoje: number;
  vendasHoje: number;
  estoqueBaixo: number;
  ticketMedio: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pedidosHoje: 0,
    vendasHoje: 0,
    estoqueBaixo: 0,
    ticketMedio: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pedidosRecentes, setPedidosRecentes] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockStats: DashboardStats = {
        pedidosHoje: 24,
        vendasHoje: 1250.50,
        estoqueBaixo: 3,
        ticketMedio: 52.10,
      };

      const mockPedidos = [
        {
          id: '1',
          clienteNome: 'João Silva',
          tipoPedido: 'Delivery',
          criadoEm: new Date(Date.now() - 5 * 60000).toISOString(),
          valorTotal: 89.90,
          status: 'entregue',
        },
        {
          id: '2',
          clienteNome: 'Maria Santos',
          tipoPedido: 'Balcão',
          criadoEm: new Date(Date.now() - 15 * 60000).toISOString(),
          valorTotal: 45.50,
          status: 'pronto',
        },
        {
          id: '3',
          clienteNome: 'Pedro Oliveira',
          tipoPedido: 'Delivery',
          criadoEm: new Date(Date.now() - 25 * 60000).toISOString(),
          valorTotal: 125.80,
          status: 'preparo',
        },
        {
          id: '4',
          clienteNome: 'Ana Costa',
          tipoPedido: 'Balcão',
          criadoEm: new Date(Date.now() - 35 * 60000).toISOString(),
          valorTotal: 67.30,
          status: 'pendente',
        },
        {
          id: '5',
          clienteNome: 'Carlos Mendes',
          tipoPedido: 'Delivery',
          criadoEm: new Date(Date.now() - 45 * 60000).toISOString(),
          valorTotal: 98.50,
          status: 'entregue',
        },
      ];

      setStats(mockStats);
      setPedidosRecentes(mockPedidos);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800',
      preparo: 'bg-blue-100 text-blue-800',
      pronto: 'bg-green-100 text-green-800',
      entregue: 'bg-gray-100 text-gray-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.pendente;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pendente: 'Pendente',
      preparo: 'Em Preparo',
      pronto: 'Pronto',
      entregue: 'Entregue',
      cancelado: 'Cancelado',
    };
    return texts[status as keyof typeof texts] || status;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vendas Hoje
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {stats.vendasHoje.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Faturamento do dia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pedidos Hoje
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.pedidosHoje}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total de pedidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ticket Médio
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {stats.ticketMedio.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Valor médio por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Estoque Baixo
            </CardTitle>
            <AlertTriangle className={`w-4 h-4 ${stats.estoqueBaixo > 0 ? 'text-red-500' : 'text-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.estoqueBaixo > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {stats.estoqueBaixo}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Itens com estoque baixo
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {pedidosRecentes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum pedido registrado ainda
            </div>
          ) : (
            <div className="space-y-4">
              {pedidosRecentes.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {pedido.clienteNome || 'Cliente sem nome'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pedido.tipoPedido} • {new Date(pedido.criadoEm).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        R$ {pedido.valorTotal?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(pedido.status)}`}>
                      {getStatusText(pedido.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
