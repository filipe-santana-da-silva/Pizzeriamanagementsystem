import { useEffect, useState } from 'react';
import { Clock, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';

interface PedidoMesa {
  id: number;
  numeroMesa: number;
  itens: Array<{
    nome: string;
    quantidade: number;
  }>;
  status: 'pendente' | 'preparando' | 'pronto';
  criadoEm: Date;
}

export function Cozinha() {
  const [pedidos, setPedidos] = useState<PedidoMesa[]>([]);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = () => {
    const mockPedidos: PedidoMesa[] = [
      {
        id: 1,
        numeroMesa: 5,
        status: 'pendente',
        criadoEm: new Date(Date.now() - 5 * 60000),
        itens: [
          { nome: 'Pizza Margherita', quantidade: 1 },
          { nome: 'Pizza Calabresa', quantidade: 1 },
        ],
      },
      {
        id: 2,
        numeroMesa: 3,
        status: 'preparando',
        criadoEm: new Date(Date.now() - 10 * 60000),
        itens: [
          { nome: 'Pizza Frango com Catupiry', quantidade: 2 },
        ],
      },
      {
        id: 3,
        numeroMesa: 8,
        status: 'pendente',
        criadoEm: new Date(Date.now() - 2 * 60000),
        itens: [
          { nome: 'Pizza Portuguesa', quantidade: 1 },
          { nome: 'Refrigerante 2L', quantidade: 1 },
        ],
      },
      {
        id: 4,
        numeroMesa: 12,
        status: 'preparando',
        criadoEm: new Date(Date.now() - 8 * 60000),
        itens: [
          { nome: 'Pizza Margherita', quantidade: 1 },
        ],
      },
    ];

    setPedidos(mockPedidos);
  };

  const handleIniciarPreparo = (pedidoId: number) => {
    setPedidos(pedidos.map(p =>
      p.id === pedidoId ? { ...p, status: 'preparando' } : p
    ));
    toast.success('Pedido enviado para preparo');
  };

  const handleMarcarPronto = (pedidoId: number) => {
    setPedidos(pedidos.map(p =>
      p.id === pedidoId ? { ...p, status: 'pronto' } : p
    ));
    toast.success('Pedido pronto! Notify garçom');
  };

  const getTempoEspera = (criadoEm: Date) => {
    const agora = new Date();
    const diferenca = Math.floor((agora.getTime() - criadoEm.getTime()) / 60000);
    return `${diferenca}min`;
  };

  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente');
  const pedidosPreparando = pedidos.filter(p => p.status === 'preparando');
  const pedidosProntos = pedidos.filter(p => p.status === 'pronto');

  const renderizarPedidos = (lista: PedidoMesa[], status: 'pendente' | 'preparando' | 'pronto') => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {status === 'pendente' && 'Pendentes'}
            {status === 'preparando' && 'Preparando'}
            {status === 'pronto' && 'Pronto para Entrega'}
          </h2>
          <Badge variant="secondary">{lista.length}</Badge>
        </div>

        {lista.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum pedido
          </div>
        ) : (
          lista.map(pedido => (
            <Card key={pedido.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Mesa {pedido.numeroMesa}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{getTempoEspera(pedido.criadoEm)}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      status === 'pendente'
                        ? 'secondary'
                        : status === 'preparando'
                          ? 'default'
                          : 'outline'
                    }
                  >
                    {status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Itens:</p>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    {pedido.itens.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        {item.quantidade}x {item.nome}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {status === 'pendente' && (
                    <Button
                      onClick={() => handleIniciarPreparo(pedido.id)}
                      className="flex-1"
                    >
                      Iniciar Preparo
                    </Button>
                  )}

                  {status === 'preparando' && (
                    <Button
                      onClick={() => handleMarcarPronto(pedido.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Marcar Pronto
                    </Button>
                  )}

                  {status === 'pronto' && (
                    <div className="flex-1 text-center text-green-600 font-medium">
                      Aguardando garçom
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Controle da Cozinha</h1>
        <p className="text-gray-500 mt-1">Gerenciar pedidos das mesas e enviar para preparo</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{pedidosPendentes.length}</div>
              <p className="text-sm text-gray-500 mt-1">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{pedidosPreparando.length}</div>
              <p className="text-sm text-gray-500 mt-1">Preparando</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{pedidosProntos.length}</div>
              <p className="text-sm text-gray-500 mt-1">Pronto</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-1">
          {renderizarPedidos(pedidosPendentes, 'pendente')}
        </Card>

        <Card className="col-span-1">
          {renderizarPedidos(pedidosPreparando, 'preparando')}
        </Card>

        <Card className="col-span-1">
          {renderizarPedidos(pedidosProntos, 'pronto')}
        </Card>
      </div>
    </div>
  );
}
