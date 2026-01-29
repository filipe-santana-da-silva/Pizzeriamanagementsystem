import { useEffect, useState } from 'react';
import { Plus, Shield, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
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
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { toast } from 'sonner';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  role: 'admin' | 'gerente' | 'cozinheiro' | 'operador';
  ativo: boolean;
  criadoEm: string;
}

export function Permissoes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    telefone: '',
    role: 'operador' as 'admin' | 'gerente' | 'cozinheiro' | 'operador',
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = () => {
    const mockUsuarios: Usuario[] = [
      {
        id: 1,
        nome: 'Felipe Silva',
        email: 'felipe@pizzaria.com',
        telefone: '(11) 98765-4321',
        role: 'admin',
        ativo: true,
        criadoEm: '2025-01-15',
      },
      {
        id: 2,
        nome: 'Maria Santos',
        email: 'maria@pizzaria.com',
        telefone: '(11) 99999-8888',
        role: 'gerente',
        ativo: true,
        criadoEm: '2025-02-01',
      },
      {
        id: 3,
        nome: 'João Oliveira',
        email: 'joao@pizzaria.com',
        telefone: '(11) 97777-6666',
        role: 'cozinheiro',
        ativo: true,
        criadoEm: '2025-01-20',
      },
      {
        id: 4,
        nome: 'Ana Costa',
        email: 'ana@pizzaria.com',
        telefone: '(11) 96666-5555',
        role: 'operador',
        ativo: true,
        criadoEm: '2025-02-05',
      },
      {
        id: 5,
        nome: 'Roberto Alves',
        email: 'roberto@pizzaria.com',
        telefone: '(11) 95555-4444',
        role: 'operador',
        ativo: false,
        criadoEm: '2025-01-10',
      },
    ];

    setUsuarios(mockUsuarios);
  };

  const handleCreateUsuario = () => {
    // Funcionalidade desabilitada para demonstração
  };

  const handleToggleAtivo = (usuarioId: number) => {
    setUsuarios(usuarios.map(u =>
      u.id === usuarioId ? { ...u, ativo: !u.ativo } : u
    ));
    const usuario = usuarios.find(u => u.id === usuarioId);
    toast.success(`Usuário ${usuario?.ativo ? 'desativado' : 'ativado'}`);
  };

  const handleUpdateRole = (usuarioId: number, novoRole: string) => {
    setUsuarios(usuarios.map(u =>
      u.id === usuarioId ? { ...u, role: novoRole as Usuario['role'] } : u
    ));
    toast.success('Permissão atualizada');
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      gerente: 'Gerente',
      garcom: 'Garçom',
      cozinheiro: 'Cozinheiro',
      operador: 'Operador',
    };
    return labels[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      gerente: 'bg-blue-100 text-blue-800',
      cozinheiro: 'bg-orange-100 text-orange-800',
      operador: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const contagemPorRole = {
    admin: usuarios.filter(u => u.role === 'admin').length,
    gerente: usuarios.filter(u => u.role === 'gerente').length,
    cozinheiro: usuarios.filter(u => u.role === 'cozinheiro').length,
    operador: usuarios.filter(u => u.role === 'operador').length,
    ativos: usuarios.filter(u => u.ativo).length,
    inativos: usuarios.filter(u => !u.ativo).length,
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permissões de Usuário</h1>
          <p className="text-gray-500 mt-1">Gerenciar usuários e definir permissões de acesso</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  placeholder="Nome do usuário"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                  placeholder="email@pizzaria.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={novoUsuario.telefone}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label>Permissão</Label>
                <Select
                  value={novoUsuario.role}
                  onValueChange={(value: any) => setNovoUsuario({ ...novoUsuario, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="cozinheiro">Cozinheiro</SelectItem>
                    <SelectItem value="operador">Operador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUsuario}>
                  Criar Usuário
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-7 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{usuarios.length}</div>
              <p className="text-xs text-gray-500 mt-1">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{contagemPorRole.ativos}</div>
              <p className="text-xs text-gray-500 mt-1">Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{contagemPorRole.admin}</div>
              <p className="text-xs text-gray-500 mt-1">Admin</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{contagemPorRole.gerente}</div>
              <p className="text-xs text-gray-500 mt-1">Gerentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{contagemPorRole.cozinheiro}</div>
              <p className="text-xs text-gray-500 mt-1">Cozinha</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{contagemPorRole.operador}</div>
              <p className="text-xs text-gray-500 mt-1">Operadores</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {usuarios.map((usuario) => (
          <Card key={usuario.id} className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{usuario.nome}</CardTitle>
                    <p className="text-sm text-gray-500">{usuario.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getRoleBadgeColor(usuario.role)}>
                    {getRoleLabel(usuario.role)}
                  </Badge>
                  <Badge variant={usuario.ativo ? 'outline' : 'secondary'}>
                    {usuario.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>Telefone: {usuario.telefone}</p>
                  <p>Criado em: {usuario.criadoEm}</p>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={usuario.role}
                    onValueChange={(value) => handleUpdateRole(usuario.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="cozinheiro">Cozinheiro</SelectItem>
                      <SelectItem value="operador">Operador</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAtivo(usuario.id)}
                  >
                    {usuario.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
