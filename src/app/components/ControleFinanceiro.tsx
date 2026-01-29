import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, CreditCard, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export function ControleFinanceiro() {
  const [periodo, setPeriodo] = useState('mes');
  const [resumo, setResumo] = useState<any>(null);
  const [fluxoCaixa, setFluxoCaixa] = useState<any[]>([]);
  const [despesas, setDespesas] = useState<any[]>([]);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDadosFinanceiros();
  }, [periodo]);

  const loadDadosFinanceiros = async () => {
    try {
      setLoading(true);

      // TODO: Implementar integração com backend
      // Supabase foi removido do projeto

      // Dados mockados para apresentação
      const mockResumo = {
        receita: 8450.75,
        despesa: 3240.50,
        lucro: 5210.25,
        contasReceber: 1950.00,
        contasPagar: 680.50,
        saldo: 5210.25,
      };

      const mockFluxoCaixa = [
        { dia: '01', receita: 850, despesa: 320 },
        { dia: '05', receita: 1200, despesa: 280 },
        { dia: '10', receita: 1450, despesa: 450 },
        { dia: '15', receita: 2100, despesa: 520 },
        { dia: '20', receita: 1850, despesa: 380 },
        { dia: '25', receita: 1000, despesa: 690 },
      ];

      const mockDespesas = [
        { categoria: 'Fornecedores', valor: 1200, percentual: 37 },
        { categoria: 'Salários', valor: 1000, percentual: 31 },
        { categoria: 'Aluguel', valor: 600, percentual: 18 },
        { categoria: 'Utilidades', valor: 440, percentual: 14 },
      ];

      const mockReceitas = [
        { id: 1, tipo: 'Venda Delivery', valor: 4200.00, data: '2025-01-28', status: 'recebido' },
        { id: 2, tipo: 'Venda Balcão', valor: 2150.75, data: '2025-01-28', status: 'recebido' },
        { id: 3, tipo: 'Venda Retirada', valor: 2100.00, data: '2025-01-28', status: 'recebido' },
      ];

      setResumo(mockResumo);
      setFluxoCaixa(mockFluxoCaixa);
      setDespesas(mockDespesas);
      setReceitas(mockReceitas);
    } catch (error) {
      console.error('Error loading dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  const getPeriodoLabel = (periodo: string) => {
    const labels: any = {
      semana: 'Última Semana',
      mes: 'Este Mês',
      trimestre: 'Este Trimestre',
      ano: 'Este Ano',
    };
    return labels[periodo] || periodo;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Carregando controle financeiro...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Controle Financeiro</h1>
          <p className="text-gray-500 mt-1">Gestão de receitas, despesas e fluxo de caixa</p>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semana">Última Semana</SelectItem>
            <SelectItem value="mes">Este Mês</SelectItem>
            <SelectItem value="trimestre">Este Trimestre</SelectItem>
            <SelectItem value="ano">Este Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Receita Total
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {resumo?.receita?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getPeriodoLabel(periodo)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Despesa Total
            </CardTitle>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {resumo?.despesa?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getPeriodoLabel(periodo)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Lucro Líquido
            </CardTitle>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {resumo?.lucro?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Receita - Despesa
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Saldo em Caixa
            </CardTitle>
            <Wallet className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {resumo?.saldo?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Disponível
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contas a Receber e Pagar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Contas a Receber
            </CardTitle>
            <CreditCard className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {resumo?.contasReceber?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Aguardando recebimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Contas a Pagar
            </CardTitle>
            <CreditCard className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {resumo?.contasPagar?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Vencimentos próximos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fluxo de Caixa */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Caixa - {getPeriodoLabel(periodo)}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fluxoCaixa}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value}`} />
              <Legend />
              <Bar dataKey="receita" fill="#10B981" name="Receita" />
              <Bar dataKey="despesa" fill="#EF4444" name="Despesa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribuição de Despesas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={despesas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, percentual }) => `${categoria} ${percentual}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {despesas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhamento de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {despesas.map((despesa) => (
                <div key={despesa.categoria} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[despesas.indexOf(despesa)] }}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{despesa.categoria}</p>
                      <p className="text-xs text-gray-500">{despesa.percentual}% do total</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">R$ {despesa.valor.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receitas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Receitas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Valor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {receitas.map((receita) => (
                  <tr key={receita.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{receita.tipo}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(receita.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-green-600">
                      R$ {receita.valor.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={receita.status === 'recebido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {receita.status === 'recebido' ? 'Recebido' : 'Pendente'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
