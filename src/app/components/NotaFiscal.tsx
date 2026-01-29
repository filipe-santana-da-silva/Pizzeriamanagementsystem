import { useEffect, useState } from 'react';
import { Plus, Download, Search, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';

interface NotaFiscalItem {
  id: string;
  numero: string;
  cliente: string;
  cnpj?: string;
  dataEmissao: string;
  valorTotal: number;
  status: 'emitida' | 'cancelada' | 'denegada';
  serie: string;
  naturezaOperacao: string;
}

export function NotaFiscal() {
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novaNotaFiscal, setNovaNotaFiscal] = useState({
    cliente: '',
    cnpj: '',
    naturezaOperacao: 'venda',
    itens: [] as any[],
  });

  useEffect(() => {
    loadNotasFiscais();
  }, []);

  const loadNotasFiscais = async () => {
    try {
      setLoading(true);
      // TODO: Implementar integração com backend (SEFAZ)
      // Dados mockados para apresentação
      const mockNotasFiscais: NotaFiscalItem[] = [
        {
          id: '1',
          numero: '000001',
          cliente: 'João Silva',
          cnpj: '12.345.678/0001-90',
          dataEmissao: new Date(2026, 0, 28).toISOString(),
          valorTotal: 150.50,
          status: 'emitida',
          serie: '1',
          naturezaOperacao: 'Venda de Mercadoria',
        },
        {
          id: '2',
          numero: '000002',
          cliente: 'Maria Santos',
          cnpj: '98.765.432/0001-10',
          dataEmissao: new Date(2026, 0, 27).toISOString(),
          valorTotal: 280.00,
          status: 'emitida',
          serie: '1',
          naturezaOperacao: 'Venda de Mercadoria',
        },
        {
          id: '3',
          numero: '000003',
          cliente: 'Pedro Costa',
          cnpj: '55.123.456/0001-70',
          dataEmissao: new Date(2026, 0, 26).toISOString(),
          valorTotal: 420.75,
          status: 'emitida',
          serie: '1',
          naturezaOperacao: 'Venda de Mercadoria',
        },
        {
          id: '4',
          numero: '000004',
          cliente: 'Ana Oliveira',
          dataEmissao: new Date(2026, 0, 25).toISOString(),
          valorTotal: 95.00,
          status: 'cancelada',
          serie: '1',
          naturezaOperacao: 'Venda de Mercadoria',
        },
      ];

      setNotasFiscais(mockNotasFiscais);
    } catch (error) {
      console.error('Error loading notas fiscais:', error);
      toast.error('Erro ao carregar notas fiscais');
    } finally {
      setLoading(false);
    }
  };

  const handleEmitirNotaFiscal = async () => {
    if (!novaNotaFiscal.cliente) {
      toast.error('Preencha o nome do cliente');
      return;
    }

    // TODO: Implementar integração com SEFAZ para emissão real
    toast.success('Nota fiscal emitida com sucesso!');
    setIsDialogOpen(false);
    setNovaNotaFiscal({
      cliente: '',
      cnpj: '',
      naturezaOperacao: 'venda',
      itens: [],
    });
    loadNotasFiscais();
  };

  const handleDownloadXML = (numero: string) => {
    // Download de XML da NF-e simulado
  };

  const handleDownloadPDF = (numero: string) => {
    // Download de PDF da NF-e simulado
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      emitida: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      denegada: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status as keyof typeof styles] || styles.emitida;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'emitida') return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusText = (status: string) => {
    const texts = {
      emitida: 'Emitida',
      cancelada: 'Cancelada',
      denegada: 'Denegada',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const filteredNotasFiscais = notasFiscais.filter(nota =>
    nota.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nota.numero?.includes(searchTerm) ||
    nota.cnpj?.includes(searchTerm)
  );

  const totalArrecadado = notasFiscais
    .filter(n => n.status === 'emitida')
    .reduce((acc, n) => acc + n.valorTotal, 0);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Carregando notas fiscais...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notas Fiscais</h1>
          <p className="text-gray-500 mt-1">Gerenciamento de NF-e e emissão</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Emitir NF-e
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emitir Nova Nota Fiscal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Input
                  value={novaNotaFiscal.cliente}
                  onChange={(e) => setNovaNotaFiscal({ ...novaNotaFiscal, cliente: e.target.value })}
                  placeholder="Nome ou Razão Social"
                />
              </div>

              <div className="space-y-2">
                <Label>CNPJ/CPF</Label>
                <Input
                  value={novaNotaFiscal.cnpj}
                  onChange={(e) => setNovaNotaFiscal({ ...novaNotaFiscal, cnpj: e.target.value })}
                  placeholder="12.345.678/0001-90 ou 123.456.789-00"
                />
              </div>

              <div className="space-y-2">
                <Label>Natureza da Operação</Label>
                <Select
                  value={novaNotaFiscal.naturezaOperacao}
                  onValueChange={(value) => setNovaNotaFiscal({ ...novaNotaFiscal, naturezaOperacao: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda de Mercadoria</SelectItem>
                    <SelectItem value="servico">Prestação de Serviço</SelectItem>
                    <SelectItem value="devolucao">Devolução</SelectItem>
                    <SelectItem value="exportacao">Exportação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              

              <Button onClick={handleEmitirNotaFiscal} className="w-full">
                Emitir NF-e
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Arrecadado
            </CardTitle>
            <FileText className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              R$ {totalArrecadado.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              NF-e emitidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              NF-e Emitidas
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {notasFiscais.filter(n => n.status === 'emitida').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Neste mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              NF-e Canceladas
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {notasFiscais.filter(n => n.status === 'cancelada').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          placeholder="Pesquisar por cliente, número ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Tabela de Notas Fiscais */}
      <Card>
        <CardHeader>
          <CardTitle>Relação de Notas Fiscais</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotasFiscais.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma nota fiscal encontrada
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotasFiscais.map((nota) => (
                <div
                  key={nota.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div>
                      {getStatusIcon(nota.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">
                          NF-e {nota.numero} - Série {nota.serie}
                        </div>
                        <Badge className={getStatusBadge(nota.status)}>
                          {getStatusText(nota.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {nota.cliente} {nota.cnpj && `• ${nota.cnpj}`}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {nota.naturezaOperacao} • {new Date(nota.dataEmissao).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-bold text-gray-900">
                        R$ {nota.valorTotal.toFixed(2)}
                      </div>
                    </div>
                    {nota.status === 'emitida' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadXML(nota.numero)}
                          className="h-8"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          XML
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(nota.numero)}
                          className="h-8"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                      </div>
                    )}
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
