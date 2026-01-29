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
import { projectId, publicAnonKey } from '/utils/supabase/info';

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d5c5d82b/pedidos`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      const pedidosOrdenados = (data.pedidos || []).sort(
        (a: any, b: any) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
      );
      setPedidos(pedidosOrdenados);
    } catch (error) {
      console.error('Error loading pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const loadProdutos = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d5c5d82b/produtos`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      console.error('Error loading produtos:', error);
    }
  };

  const handleCreatePedido = async () => {
    if (!novoPedido.clienteNome || novoPedido.itens.length === 0) {
      toast.error('Preencha o nome do cliente e adicione pelo menos um item');
      return;
    }

    try {
      const valorTotal = novoPedido.itens.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d5c5d82b/pedidos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...novoPedido,
            valorTotal,
          }),
        }
      );

      if (response.ok) {
        toast.success('Pedido criado com sucesso!');
        setIsDialogOpen(false);
        setNovoPedido({
          clienteNome: '',
          telefone: '',
          tipoPedido: 'delivery',
          endereco: '',
          formaPagamento: 'dinheiro',
          itens: [],
        });
        loadPedidos();
      } else {
        toast.error('Erro ao criar pedido');
      }
    } catch (error) {
      console.error('Error creating pedido:', error);
      toast.error('Erro ao criar pedido');
    }
  };

  const handleUpdateStatus = async (pedidoId: string, novoStatus: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d5c5d82b/pedidos/${pedidoId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status: novoStatus }),
        }
      );

      if (response.ok) {
        toast.success('Status atualizado com sucesso!');
        loadPedidos();
      } else {
        toast.error('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const addItemToPedido = (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;

    const newItem = {
      produtoId: produto.id,
      nome: produto.nome,
      quantidade: 1,
      valor: produto.preco,
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
              </div>

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
                <Label>Adicionar Produto</Label>
                <Select onValueChange={addItemToPedido}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.filter(p => p.ativo).map((produto) => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.nome} - R$ {produto.preco?.toFixed(2)}
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
                        <div className="flex-1">
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
                        {pedido.telefone} • {pedido.tipoPedido} • {new Date(pedido.criadoEm).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">R$ {pedido.valorTotal?.toFixed(2)}</div>
                      <Select
                        value={pedido.status}
                        onValueChange={(value) => handleUpdateStatus(pedido.id, value)}
                      >
                        <SelectTrigger className="mt-2">
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
                  </div>
                </CardHeader>
                <CardContent>
                  {pedido.itens && pedido.itens.length > 0 && (
                    <div className="space-y-2">
                      {pedido.itens.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantidade}x {item.nome}</span>
                          <span className="text-gray-600">R$ {(item.valor * item.quantidade).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {pedido.endereco && (
                    <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                      <strong>Endereço:</strong> {pedido.endereco}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
