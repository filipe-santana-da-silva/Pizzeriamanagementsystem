import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { Switch } from '@/app/components/ui/switch';
import { toast } from 'sonner';

export function Cardapio() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    categoria: 'pizza',
    tamanho: 'media',
    preco: 0,
    descricao: '',
    ativo: true,
  });

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      setLoading(true);
      // TODO: Implementar integração com backend
      // Supabase foi removido do projeto
      
      // Dados mockados para apresentação
      const mockProdutos = [
        { id: 1, nome: 'Pizza Margherita', categoria: 'pizza', tamanho: 'media', preco: 30.00, ativo: true },
        { id: 2, nome: 'Pizza Calabresa', categoria: 'pizza', tamanho: 'media', preco: 32.00, ativo: true },
      ];
      
      setProdutos(mockProdutos);
    } catch (error) {
      console.error('Error loading produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduto = async () => {
    //toast.info('Funcionalidade desabilitada para demonstração');
  };

  const handleToggleAtivo = async (produtoId: string, ativo: boolean) => {
    // TODO: Implementar integração com backend
    return;
  };

  const filteredProdutos = produtos.filter(produto =>
    produto.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const produtosPorCategoria = filteredProdutos.reduce((acc: any, produto) => {
    const categoria = produto.categoria || 'outros';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(produto);
    return acc;
  }, {});

  const getCategoriaLabel = (categoria: string) => {
    const labels: any = {
      pizza: 'Pizzas',
      bebida: 'Bebidas',
      sobremesa: 'Sobremesas',
      outros: 'Outros',
    };
    return labels[categoria] || categoria;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cardápio</h1>
          <p className="text-gray-500 mt-1">Gerencie os produtos da pizzaria</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Produto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nome do Produto *</Label>
                <Input
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                  placeholder="Ex: Pizza Margherita"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={novoProduto.categoria}
                    onValueChange={(value) => setNovoProduto({ ...novoProduto, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pizza">Pizza</SelectItem>
                      <SelectItem value="bebida">Bebida</SelectItem>
                      <SelectItem value="sobremesa">Sobremesa</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tamanho</Label>
                  <Select
                    value={novoProduto.tamanho}
                    onValueChange={(value) => setNovoProduto({ ...novoProduto, tamanho: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequena">Pequena</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                      <SelectItem value="familia">Família</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preço *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={novoProduto.preco}
                  onChange={(e) => setNovoProduto({ ...novoProduto, preco: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={novoProduto.descricao}
                  onChange={(e) => setNovoProduto({ ...novoProduto, descricao: e.target.value })}
                  placeholder="Ingredientes e características do produto"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Produto Ativo</Label>
                <Switch
                  checked={novoProduto.ativo}
                  onCheckedChange={(checked) => setNovoProduto({ ...novoProduto, ativo: checked })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateProduto}>
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
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(produtosPorCategoria).map(([categoria, produtos]: [string, any]) => (
          <div key={categoria}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {getCategoriaLabel(categoria)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produtos.map((produto: any) => (
                <Card key={produto.id} className={!produto.ativo ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{produto.nome}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {produto.tamanho} • {produto.categoria}
                        </p>
                      </div>
                      <Switch
                        checked={produto.ativo}
                        onCheckedChange={(checked) => handleToggleAtivo(produto.id, checked)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {produto.descricao && (
                      <p className="text-sm text-gray-600 mb-4">{produto.descricao}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">
                        R$ {produto.preco?.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(produtosPorCategoria).length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500">Nenhum produto encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
