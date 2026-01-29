import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export function Relatorios() {
  const [periodo, setPeriodo] = useState('mes');
  const [vendas, setVendas] = useState<any>(null);
  const [produtosPopulares, setProdutosPopulares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatorios();
  }, [periodo]);

  const loadRelatorios = async () => {
    try {
      setLoading(true);

      // TODO: Implementar integração com backend para carregar relatórios
      // Supabase foi removido do projeto
      
      // Dados mockados para apresentação
      const mockVendas = {
        totalVendas: 2450.50,
        quantidadePedidos: 15,
        ticketMedio: 163.37,
        periodoAtual: getPeriodoLabel(periodo),
      };

      const mockProdutosPopulares = [
        { nome: 'Pizza Margherita', quantidade: 45, receita: 450 },
        { nome: 'Pizza Calabresa', quantidade: 38, receita: 380 },
        { nome: 'Pizza Portuguesa', quantidade: 32, receita: 320 },
        { nome: 'Refrigerante 2L', quantidade: 28, receita: 140 },
        { nome: 'Cerveja', quantidade: 25, receita: 125 },
      ];

      setVendas(mockVendas);
      setProdutosPopulares(mockProdutosPopulares);
    } catch (error) {
      console.error('Error loading relatorios:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'];

  const getPeriodoLabel = (periodo: string) => {
    const labels: any = {
      hoje: 'Hoje',
      semana: 'Última Semana',
      mes: 'Último Mês',
    };
    return labels[periodo] || periodo;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Carregando relatórios...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-500 mt-1">Análise de vendas e performance</p>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="semana">Última Semana</SelectItem>
            <SelectItem value="mes">Último Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Vendas
            </CardTitle>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {vendas?.totalVendas?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getPeriodoLabel(periodo)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Quantidade de Pedidos
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {vendas?.quantidadePedidos || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Pedidos concluídos
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
              R$ {vendas?.ticketMedio?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Valor médio por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Produtos Vendidos
            </CardTitle>
            <Package className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {produtosPopulares.reduce((acc, p) => acc + (p.quantidade || 0), 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total de itens
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Produtos Mais Vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          {produtosPopulares.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum dado disponível para este período
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={produtosPopulares}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="nome"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Distribuição de Vendas por Produto */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Vendas por Produto</CardTitle>
        </CardHeader>
        <CardContent>
          {produtosPopulares.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum dado disponível para este período
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={produtosPopulares.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nome, percent }) => `${nome} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="valorTotal"
                >
                  {produtosPopulares.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `R$ ${parseFloat(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {produtosPopulares.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum dado disponível para este período
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Produto</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Quantidade</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Valor Total</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosPopulares.map((produto, index) => {
                    const totalGeral = produtosPopulares.reduce((acc, p) => acc + (p.valorTotal || 0), 0);
                    const percentual = totalGeral > 0 ? (produto.valorTotal / totalGeral) * 100 : 0;
                    
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            {produto.nome}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">{produto.quantidade}</td>
                        <td className="text-right py-3 px-4 font-semibold">
                          R$ {produto.valorTotal?.toFixed(2)}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-600">
                          {percentual.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
