import { useEffect, useState } from 'react';
import { Plus, Search, AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { toast } from 'sonner';

export function Estoque() {
  const [estoque, setEstoque] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoItem, setNovoItem] = useState({
    nome: '',
    unidade: 'kg',
    quantidade: 0,
    quantidadeMinima: 0,
    fornecedor: '',
    custoUnitario: 0,
  });

  useEffect(() => {
    loadEstoque();
  }, []);

  const loadEstoque = async () => {
    try {
      setLoading(true);
      // TODO: Implementar integração com backend
      // Supabase foi removido do projeto
      
      // Dados mockados para apresentação
      const mockEstoque = [
        { id: 1, nome: 'Farinha', unidade: 'kg', quantidade: 25, quantidadeMinima: 10, fornecedor: 'Supplier X', custoUnitario: 5.50 },
        { id: 2, nome: 'Queijo Mozzarela', unidade: 'kg', quantidade: 8, quantidadeMinima: 10, fornecedor: 'Supplier Y', custoUnitario: 45.00 },
      ];
      
      setEstoque(mockEstoque);
    } catch (error) {
      console.error('Error loading estoque:', error);
      toast.error('Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    //toast.info('Funcionalidade desabilitada para demonstração');
  };

  const handleUpdateQuantidade = async (itemId: string, novaQuantidade: number) => {
    // Funcionalidade desabilitada para demonstração
  };

  const filteredEstoque = estoque.filter(item =>
    item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fornecedor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itensComEstoqueBaixo = filteredEstoque.filter(item =>
    item.quantidade <= (item.quantidadeMinima || 0)
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
          <p className="text-gray-500 mt-1">Controle de ingredientes e insumos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nome do Item *</Label>
                <Input
                  value={novoItem.nome}
                  onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
                  placeholder="Ex: Queijo Mussarela"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select
                    value={novoItem.unidade}
                    onValueChange={(value) => setNovoItem({ ...novoItem, unidade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Quilograma (kg)</SelectItem>
                      <SelectItem value="litro">Litro (L)</SelectItem>
                      <SelectItem value="unidade">Unidade</SelectItem>
                      <SelectItem value="pacote">Pacote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantidade Inicial</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={novoItem.quantidade}
                    onChange={(e) => setNovoItem({ ...novoItem, quantidade: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantidade Mínima</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={novoItem.quantidadeMinima}
                    onChange={(e) => setNovoItem({ ...novoItem, quantidadeMinima: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Custo Unitário</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={novoItem.custoUnitario}
                    onChange={(e) => setNovoItem({ ...novoItem, custoUnitario: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fornecedor</Label>
                <Input
                  value={novoItem.fornecedor}
                  onChange={(e) => setNovoItem({ ...novoItem, fornecedor: e.target.value })}
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateItem}>
                  Adicionar
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
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {itensComEstoqueBaixo.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{itensComEstoqueBaixo.length}</strong> {itensComEstoqueBaixo.length === 1 ? 'item está' : 'itens estão'} com estoque baixo ou zerado
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEstoque.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Package className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum item no estoque</p>
            </CardContent>
          </Card>
        ) : (
          filteredEstoque.map((item) => {
            const estoqueBaixo = item.quantidade <= (item.quantidadeMinima || 0);
            
            return (
              <Card key={item.id} className={estoqueBaixo ? 'border-red-300' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {item.nome}
                        {estoqueBaixo && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.fornecedor || 'Sem fornecedor'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quantidade</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.quantidade}
                        onChange={(e) => handleUpdateQuantidade(item.id, parseFloat(e.target.value) || 0)}
                        className="w-24 text-right"
                      />
                      <span className="text-sm text-gray-600">{item.unidade}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Mínimo</span>
                    <span className="font-medium">{item.quantidadeMinima} {item.unidade}</span>
                  </div>

                  {item.custoUnitario > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Custo Unit.</span>
                      <span className="font-medium">R$ {item.custoUnitario?.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Valor Total</span>
                      <span className="font-bold text-gray-900">
                        R$ {((item.quantidade || 0) * (item.custoUnitario || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
