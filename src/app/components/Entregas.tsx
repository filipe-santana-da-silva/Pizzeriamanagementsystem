import { useEffect, useState } from 'react';
import { MapPin, Bike, Clock, CheckCircle, AlertCircle, User, Phone, MapPinned } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { toast } from 'sonner';

interface Entrega {
  id: string;
  numero: string;
  cliente: string;
  endereco: string;
  bairro: string;
  telefone: string;
  valor: number;
  status: 'pendente' | 'coletado' | 'em_transito' | 'entregue' | 'falha';
  motoboy?: string;
  inicio?: string;
  fim?: string;
  localizacao?: {
    lat: number;
    lng: number;
  };
}

interface Motoboy {
  id: string;
  nome: string;
  telefone: string;
  placa: string;
  status: 'disponivel' | 'em_entrega' | 'offline';
  entregas_realizadas: number;
  localizacao: {
    lat: number;
    lng: number;
  };
}

const COORDENADAS_BASE = {
  lat: -23.5505,
  lng: -46.6333, // São Paulo
};

export function Entregas() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [motoboys, setMotoboys] = useState<Motoboy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
    // Simular atualizações em tempo real
    const interval = setInterval(() => {
      updateMotoboysLocation();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data para motoboys
      const mockMotoboys: Motoboy[] = [
        {
          id: '1',
          nome: 'Carlos Silva',
          telefone: '(11) 99999-1111',
          placa: 'ABC-1234',
          status: 'em_entrega',
          entregas_realizadas: 12,
          localizacao: { lat: -23.5505 + Math.random() * 0.05, lng: -46.6333 + Math.random() * 0.05 },
        },
        {
          id: '2',
          nome: 'João Santos',
          telefone: '(11) 99999-2222',
          placa: 'DEF-5678',
          status: 'em_entrega',
          entregas_realizadas: 8,
          localizacao: { lat: -23.5505 + Math.random() * 0.05, lng: -46.6333 + Math.random() * 0.05 },
        },
        {
          id: '3',
          nome: 'Pedro Costa',
          telefone: '(11) 99999-3333',
          placa: 'GHI-9012',
          status: 'disponivel',
          entregas_realizadas: 15,
          localizacao: { lat: COORDENADAS_BASE.lat, lng: COORDENADAS_BASE.lng },
        },
        {
          id: '4',
          nome: 'Roberto Oliveira',
          telefone: '(11) 99999-4444',
          placa: 'JKL-3456',
          status: 'offline',
          entregas_realizadas: 10,
          localizacao: { lat: -23.5505 + Math.random() * 0.05, lng: -46.6333 + Math.random() * 0.05 },
        },
      ];

      // Mock data para entregas
      const mockEntregas: Entrega[] = [
        {
          id: '1',
          numero: 'ENT001',
          cliente: 'João Silva',
          endereco: 'Av. Paulista, 1000',
          bairro: 'Bela Vista',
          telefone: '(11) 3222-1111',
          valor: 85.50,
          status: 'entregue',
          motoboy: 'Carlos Silva',
          inicio: '14:30',
          fim: '14:55',
          localizacao: { lat: -23.5610, lng: -46.6560 },
        },
        {
          id: '2',
          numero: 'ENT002',
          cliente: 'Maria Santos',
          endereco: 'Rua Augusta, 500',
          bairro: 'Centro',
          telefone: '(11) 3222-2222',
          valor: 125.00,
          status: 'em_transito',
          motoboy: 'João Santos',
          inicio: '15:05',
          localizacao: { lat: -23.5495, lng: -46.6400 },
        },
        {
          id: '3',
          numero: 'ENT003',
          cliente: 'Pedro Costa',
          endereco: 'Av. Brigadeiro Faria Lima, 750',
          bairro: 'Pinheiros',
          telefone: '(11) 3222-3333',
          valor: 95.00,
          status: 'coletado',
          motoboy: 'Carlos Silva',
          inicio: '15:15',
          localizacao: { lat: -23.5680, lng: -46.6450 },
        },
        {
          id: '4',
          numero: 'ENT004',
          cliente: 'Ana Oliveira',
          endereco: 'Rua Oscar Freire, 300',
          bairro: 'Jardins',
          telefone: '(11) 3222-4444',
          valor: 110.50,
          status: 'pendente',
          localizacao: { lat: -23.5650, lng: -46.6500 },
        },
        {
          id: '5',
          numero: 'ENT005',
          cliente: 'Lucas Ferreira',
          endereco: 'Av. Imigrantes, 1500',
          bairro: 'Vila Mariana',
          telefone: '(11) 3222-5555',
          valor: 78.00,
          status: 'falha',
          motoboy: 'João Santos',
          inicio: '13:45',
        },
      ];

      setMotoboys(mockMotoboys);
      setEntregas(mockEntregas);
    } catch (error) {
      console.error('Error loading entregas:', error);
      toast.error('Erro ao carregar entregas');
    } finally {
      setLoading(false);
    }
  };

  const updateMotoboysLocation = () => {
    setMotoboys((prev) =>
      prev.map((motoboy) => {
        if (motoboy.status === 'em_entrega') {
          return {
            ...motoboy,
            localizacao: {
              lat: motoboy.localizacao.lat + (Math.random() - 0.5) * 0.003,
              lng: motoboy.localizacao.lng + (Math.random() - 0.5) * 0.003,
            },
          };
        }
        return motoboy;
      })
    );
  };

  const handleAtribuirEntrega = (motoboy: Motoboy) => {
    toast.success(`Entrega atribuída para ${motoboy.nome}`);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      entregue: 'bg-green-100 text-green-800',
      em_transito: 'bg-blue-100 text-blue-800',
      coletado: 'bg-yellow-100 text-yellow-800',
      pendente: 'bg-gray-100 text-gray-800',
      falha: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.pendente;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'entregue':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'em_transito':
        return <Bike className="w-4 h-4 text-blue-600" />;
      case 'coletado':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'falha':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <MapPin className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    const texts = {
      entregue: 'Entregue',
      em_transito: 'Em Trânsito',
      coletado: 'Coletado',
      pendente: 'Pendente',
      falha: 'Falha na Entrega',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getMotoboysStatusBadge = (status: string) => {
    const styles = {
      disponivel: 'bg-green-100 text-green-800',
      em_entrega: 'bg-blue-100 text-blue-800',
      offline: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.offline;
  };

  const getMotoboysStatusText = (status: string) => {
    const texts = {
      disponivel: 'Disponível',
      em_entrega: 'Em Entrega',
      offline: 'Offline',
    };
    return texts[status as keyof typeof texts] || status;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Carregando entregas...</div>
      </div>
    );
  }

  const entregasEmTransito = entregas.filter((e) => e.status === 'em_transito' || e.status === 'coletado').length;
  const entregasEntregues = entregas.filter((e) => e.status === 'entregue').length;
  const entregasFalhas = entregas.filter((e) => e.status === 'falha').length;
  const motoboysDisponiveis = motoboys.filter((m) => m.status === 'disponivel').length;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Entregas em Tempo Real</h1>
        <p className="text-gray-500 mt-1">Rastreamento de motoboys e entregas</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Em Trânsito
            </CardTitle>
            <Bike className="w-4 h-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{entregasEmTransito}</div>
            <p className="text-xs text-gray-500 mt-1">Entregas em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Entregues
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{entregasEntregues}</div>
            <p className="text-xs text-gray-500 mt-1">Hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Falhas
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{entregasFalhas}</div>
            <p className="text-xs text-gray-500 mt-1">Que precisam ação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Motoboys Disponíveis
            </CardTitle>
            <Bike className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{motoboysDisponiveis}</div>
            <p className="text-xs text-gray-500 mt-1">Prontos para trabalhar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa Simulado */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mapa de Entregas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 h-96 relative overflow-hidden">
                {/* Grid simulado */}
                <div className="absolute inset-0 opacity-10">
                  <div className="h-full grid grid-cols-4 gap-1">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="bg-blue-200"></div>
                    ))}
                  </div>
                </div>

                {/* Marcadores de motoboys */}
                {motoboys.map((motoboy) => {
                  const x = ((motoboy.localizacao.lng - COORDENADAS_BASE.lng) / 0.1) * 100 + 50;
                  const y = ((motoboy.localizacao.lat - COORDENADAS_BASE.lat) / 0.1) * 100 + 50;

                  return (
                    <div
                      key={motoboy.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      title={motoboy.nome}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg relative
                        ${
                          motoboy.status === 'disponivel'
                            ? 'bg-green-500'
                            : motoboy.status === 'em_entrega'
                            ? 'bg-blue-500'
                            : 'bg-gray-400'
                        }`}
                      >
                        <Bike className="w-4 h-4 text-white" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
                          {motoboy.nome}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Marcadores de entregas */}
                {entregas.map((entrega) => {
                  if (!entrega.localizacao) return null;

                  const x = ((entrega.localizacao.lng - COORDENADAS_BASE.lng) / 0.1) * 100 + 50;
                  const y = ((entrega.localizacao.lat - COORDENADAS_BASE.lat) / 0.1) * 100 + 50;

                  return (
                    <div
                      key={entrega.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      onClick={() => {
                        setSelectedEntrega(entrega);
                        setIsDetailDialogOpen(true);
                      }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg relative bg-red-500 border-2 border-white">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  );
                })}

                {/* Centro (Base) */}
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                  <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg border-2 border-white"></div>
                </div>

                {/* Legenda */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg text-xs space-y-1 z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Em Entrega</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Destino</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Motoboys */}
        <div>
          <Card className="h-96 overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-base">Motoboys</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {motoboys.map((motoboy) => (
                <div key={motoboy.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{motoboy.nome}</p>
                      <p className="text-xs text-gray-500">{motoboy.placa}</p>
                    </div>
                    <Badge className={getMotoboysStatusBadge(motoboy.status)}>
                      {getMotoboysStatusText(motoboy.status)}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs mb-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="w-3 h-3" />
                      {motoboy.telefone}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <CheckCircle className="w-3 h-3" />
                      {motoboy.entregas_realizadas} entregas
                    </div>
                  </div>
                  {motoboy.status === 'disponivel' && (
                    <Button size="sm" variant="outline" className="w-full text-xs h-7">
                      Atribuir
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabela de Entregas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Entregas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entregas.map((entrega) => (
              <div
                key={entrega.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  setSelectedEntrega(entrega);
                  setIsDetailDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(entrega.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{entrega.numero}</p>
                      <Badge className={getStatusBadge(entrega.status)}>
                        {getStatusText(entrega.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{entrega.cliente}</p>
                    <p className="text-xs text-gray-500">{entrega.endereco}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">R$ {entrega.valor.toFixed(2)}</p>
                  {entrega.motoboy && (
                    <p className="text-xs text-gray-500">{entrega.motoboy}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Entrega</DialogTitle>
          </DialogHeader>
          {selectedEntrega && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">NÚMERO</p>
                  <p className="text-sm font-bold text-gray-900">{selectedEntrega.numero}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">STATUS</p>
                  <Badge className={`${getStatusBadge(selectedEntrega.status)} w-fit`}>
                    {getStatusText(selectedEntrega.status)}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <User className="w-3 h-3" /> CLIENTE
                  </p>
                  <p className="text-sm text-gray-900">{selectedEntrega.cliente}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <MapPinned className="w-3 h-3" /> ENDEREÇO
                  </p>
                  <p className="text-sm text-gray-900">{selectedEntrega.endereco}</p>
                  <p className="text-xs text-gray-600">{selectedEntrega.bairro}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> TELEFONE
                  </p>
                  <p className="text-sm text-gray-900">{selectedEntrega.telefone}</p>
                </div>

                {selectedEntrega.motoboy && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <Bike className="w-3 h-3" /> MOTOBOY
                    </p>
                    <p className="text-sm text-gray-900">{selectedEntrega.motoboy}</p>
                  </div>
                )}

                {selectedEntrega.inicio && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500">INÍCIO</p>
                      <p className="text-sm text-gray-900">{selectedEntrega.inicio}</p>
                    </div>
                    {selectedEntrega.fim && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">FIM</p>
                        <p className="text-sm text-gray-900">{selectedEntrega.fim}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">Valor da Entrega</p>
                <p className="text-2xl font-bold text-blue-900">R$ {selectedEntrega.valor.toFixed(2)}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsDetailDialogOpen(false)}>
                  Fechar
                </Button>
                <Button className="flex-1">Ligar para Cliente</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
