import { useEffect, useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';

export function Pedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoPedido, setNovoPedido] = useState({
    clienteNome: '',
    telefone: '',
    tipoPedido: 'delivery' as 'balcao' | 'delivery' | 'retirada',
    plataforma: 'proprio' as 'proprio' | 'whatsapp' | 'ifood' | 'rappi' | 'uber',
    numeroMesa: 1,
    endereco: '',
    formaPagamento: 'dinheiro',
    itens: [] as any[],
  });

  useEffect(() => {
    loadPedidos();
    loadProdutos();
  }, []);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      
      const mockPedidos = [
        { 
          id: 1, 
          clienteNome: 'João Silva', 
          tipoPedido: 'balcao',
          plataforma: 'proprio',
          numeroMesa: 5,
          status: 'pronto', 
          valorTotal: 85.50, 
          criadoEm: new Date().toISOString(),
          itens: [{ nome: 'Pizza Margherita', quantidade: 1, valor: 35.00 }],
          formaPagamento: 'dinheiro'
        },
        { 
          id: 2, 
          clienteNome: 'Maria Santos',
          tipoPedido: 'delivery',
          plataforma: 'whatsapp',
          endereco: 'Rua A, 123',
          status: 'preparo', 
          valorTotal: 120.00, 
          criadoEm: new Date().toISOString(),
          itens: [{ nome: 'Pizza Calabresa', quantidade: 2, valor: 38.00 }],
          formaPagamento: 'pix'
        },
        { 
          id: 3, 
          clienteNome: 'Carlos Oliveira',
          tipoPedido: 'retirada',
          plataforma: 'ifood',
          status: 'pendente', 
          valorTotal: 95.00, 
          criadoEm: new Date().toISOString(),
          itens: [{ nome: 'Pizza Frango', quantidade: 1, valor: 40.00 }],
          formaPagamento: 'cartao'
        },
      ];
      
      setPedidos(mockPedidos);
    } catch (error) {
      console.error('Error loading pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const loadProdutos = async () => {
    try {
      const mockProdutos = [
        { id: 1, nome: 'Pizza Margherita', valor: 35.00 },
        { id: 2, nome: 'Pizza Calabresa', valor: 38.00 },
        { id: 3, nome: 'Pizza Frango com Catupiry', valor: 40.00 },
        { id: 4, nome: 'Pizza Portuguesa', valor: 42.00 },
        { id: 5, nome: 'Refrigerante 2L', valor: 8.00 },
        { id: 6, nome: 'Cerveja 600ml', valor: 6.50 },
      ];
      
      setProdutos(mockProdutos);
    } catch (error) {
      console.error('Error loading produtos:', error);
    }
  };

  const handleCreatePedido = async () => {
    //toast.info('Funcionalidade desabilitada para demonstração');
  };

  const handleUpdateStatus = async (pedidoId: string, novoStatus: string) => {
    setPedidos(pedidos.map(p => 
      p.id === pedidoId ? { ...p, status: novoStatus } : p
    ));
    toast.success('Status atualizado');
  };

  const addItemToPedido = (produtoId: string) => {
    const produto = produtos.find(p => p.id === parseInt(produtoId));
    if (!produto) return;

    const newItem = {
      produtoId: produto.id,
      nome: produto.nome,
      quantidade: 1,
      valor: produto.valor,
      observacoes: '',
    };

    setNovoPedido(prev => ({
      ...prev,
      itens: [...prev.itens, newItem],
    }));
  };

  const removeItemFromPedido = (index: number) => {
    setNovoPedido(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index),
    }));
  };

  const updateItemQuantity = (index: number, quantidade: number) => {
    setNovoPedido(prev => ({
      ...prev,
      itens: prev.itens.map((item, i) =>
        i === index ? { ...item, quantidade } : item
      ),
    }));
  };

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.telefone?.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pendente: 'secondary',
      preparo: 'default',
      pronto: 'default',
      entregue: 'outline',
      cancelado: 'destructive',
    };
    return variants[status] || 'secondary';
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

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 mt-1">Gerencie todos os pedidos da pizzaria</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Pedido</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Cliente *</Label>
                  <Input
                    value={novoPedido.clienteNome}
                    onChange={(e) => setNovoPedido({ ...novoPedido, clienteNome: e.target.value })}
                    placeholder="João Silva"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={novoPedido.telefone}
                    onChange={(e) => setNovoPedido({ ...novoPedido, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Pedido</Label>
                  <Select
                    value={novoPedido.tipoPedido}
                    onValueChange={(value: any) => setNovoPedido({ ...novoPedido, tipoPedido: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balcao">Balcão</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="retirada">Retirada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Select
                    value={novoPedido.plataforma}
                    onValueChange={(value: any) => setNovoPedido({ ...novoPedido, plataforma: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proprio">Próprio Sistema</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="ifood">iFood</SelectItem>
                      <SelectItem value="rappi">Rappi</SelectItem>
                      <SelectItem value="uber">Uber Eats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {novoPedido.tipoPedido === 'balcao' && (
                <div className="space-y-2">
                  <Label>Número da Mesa</Label>
                  <Input
                    type="number"
                    min="1"
                    value={novoPedido.numeroMesa}
                    onChange={(e) => setNovoPedido({ ...novoPedido, numeroMesa: parseInt(e.target.value) })}
                  />
                </div>
              )}

              {novoPedido.tipoPedido === 'delivery' && (
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input
                    value={novoPedido.endereco}
                    onChange={(e) => setNovoPedido({ ...novoPedido, endereco: e.target.value })}
                    placeholder="Rua, número, bairro"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Select
                  value={novoPedido.formaPagamento}
                  onValueChange={(value) => setNovoPedido({ ...novoPedido, formaPagamento: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Adicionar Produto</Label>
                <Select onValueChange={addItemToPedido}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id.toString()}>
                        {produto.nome} - R$ {produto.valor?.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {novoPedido.itens.length > 0 && (
                <div className="space-y-2">
                  <Label>Itens do Pedido</Label>
                  <div className="border rounded-lg divide-y">
                    {novoPedido.itens.map((item, index) => (
                      <div key={index} className="p-3 flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="font-medium">{item.nome}</div>
                      <div className="text-sm text-gray-500">R$ {item.valor?.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                        className="w-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItemFromPedido(index)}
                      >
                        Remover
                      </Button>
                    </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-right font-bold text-lg">
                    Total: R$ {novoPedido.itens.reduce((acc, item) => acc + (item.valor * item.quantidade), 0).toFixed(2)}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreatePedido}>
                  Criar Pedido
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por cliente ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPedidos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-500">Nenhum pedido encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredPedidos.map((pedido) => (
              <Card key={pedido.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{pedido.clienteNome || 'Cliente sem nome'}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {pedido.telefone && `${pedido.telefone} • `}
                        {pedido.tipoPedido === 'balcao' && `Mesa ${pedido.numeroMesa} • `}
                        {pedido.tipoPedido === 'delivery' && `${pedido.endereco} • `}
                        {pedido.plataforma} • {new Date(pedido.criadoEm).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">R$ {pedido.valorTotal?.toFixed(2)}</div>
                      <p className="text-sm text-gray-500 mt-1">{pedido.status}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {pedido.itens && pedido.itens.length > 0 && (
                        <>
                          <p className="font-medium">Itens:</p>
                          {pedido.itens.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantidade}x {item.nome}</span>
                              <span className="text-gray-600">R$ {(item.valor * item.quantidade).toFixed(2)}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                    <Select
                      value={pedido.status}
                      onValueChange={(value) => handleUpdateStatus(pedido.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="preparo">Em Preparo</SelectItem>
                        <SelectItem value="pronto">Pronto</SelectItem>
                        <SelectItem value="entregue">Entregue</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
