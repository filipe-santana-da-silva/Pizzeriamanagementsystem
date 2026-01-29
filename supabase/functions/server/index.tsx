import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware para autenticação (opcional para rotas protegidas)
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
    // Permite acesso com chave anônima para desenvolvimento
    return next();
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: 'Unauthorized - Invalid or expired token' }, 401);
  }
  
  c.set('userId', user.id);
  c.set('userEmail', user.email);
  return next();
};

// Health check endpoint
app.get("/make-server-d5c5d82b/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== PEDIDOS ====================

// Listar todos os pedidos
app.get("/make-server-d5c5d82b/pedidos", async (c) => {
  try {
    const pedidos = await kv.getByPrefix('pedido:');
    return c.json({ pedidos: pedidos || [] });
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    return c.json({ error: 'Failed to fetch pedidos: ' + error.message }, 500);
  }
});

// Buscar pedido por ID
app.get("/make-server-d5c5d82b/pedidos/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const pedido = await kv.get(`pedido:${id}`);
    
    if (!pedido) {
      return c.json({ error: 'Pedido not found' }, 404);
    }
    
    return c.json({ pedido });
  } catch (error) {
    console.error('Error fetching pedido:', error);
    return c.json({ error: 'Failed to fetch pedido: ' + error.message }, 500);
  }
});

// Criar novo pedido
app.post("/make-server-d5c5d82b/pedidos", async (c) => {
  try {
    const body = await c.req.json();
    const pedidoId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const pedido = {
      id: pedidoId,
      clienteId: body.clienteId,
      clienteNome: body.clienteNome,
      itens: body.itens, // Array de { produtoId, quantidade, valor, observacoes }
      valorTotal: body.valorTotal,
      tipoPedido: body.tipoPedido, // 'balcao', 'delivery', 'retirada'
      status: 'pendente', // 'pendente', 'preparo', 'pronto', 'entregue', 'cancelado'
      endereco: body.endereco,
      telefone: body.telefone,
      formaPagamento: body.formaPagamento,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    
    // Salvar pedido
    await kv.set(`pedido:${pedidoId}`, pedido);
    
    // Atualizar estoque automaticamente
    if (body.itens && body.itens.length > 0) {
      for (const item of body.itens) {
        const produto = await kv.get(`produto:${item.produtoId}`);
        if (produto && produto.ingredientes) {
          for (const ing of produto.ingredientes) {
            const estoque = await kv.get(`estoque:${ing.ingredienteId}`);
            if (estoque) {
              const novaQuantidade = (estoque.quantidade || 0) - (ing.quantidade * item.quantidade);
              await kv.set(`estoque:${ing.ingredienteId}`, {
                ...estoque,
                quantidade: novaQuantidade,
                atualizadoEm: new Date().toISOString(),
              });
            }
          }
        }
      }
    }
    
    return c.json({ pedido }, 201);
  } catch (error) {
    console.error('Error creating pedido:', error);
    return c.json({ error: 'Failed to create pedido: ' + error.message }, 500);
  }
});

// Atualizar status do pedido
app.put("/make-server-d5c5d82b/pedidos/:id/status", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const pedido = await kv.get(`pedido:${id}`);
    if (!pedido) {
      return c.json({ error: 'Pedido not found' }, 404);
    }
    
    const pedidoAtualizado = {
      ...pedido,
      status: body.status,
      atualizadoEm: new Date().toISOString(),
    };
    
    await kv.set(`pedido:${id}`, pedidoAtualizado);
    
    return c.json({ pedido: pedidoAtualizado });
  } catch (error) {
    console.error('Error updating pedido status:', error);
    return c.json({ error: 'Failed to update pedido status: ' + error.message }, 500);
  }
});

// ==================== PRODUTOS (CARDÁPIO) ====================

// Listar todos os produtos
app.get("/make-server-d5c5d82b/produtos", async (c) => {
  try {
    const produtos = await kv.getByPrefix('produto:');
    return c.json({ produtos: produtos || [] });
  } catch (error) {
    console.error('Error fetching produtos:', error);
    return c.json({ error: 'Failed to fetch produtos: ' + error.message }, 500);
  }
});

// Criar novo produto
app.post("/make-server-d5c5d82b/produtos", async (c) => {
  try {
    const body = await c.req.json();
    const produtoId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const produto = {
      id: produtoId,
      nome: body.nome,
      categoria: body.categoria, // 'pizza', 'bebida', 'sobremesa'
      tamanho: body.tamanho, // 'pequena', 'media', 'grande', 'familia'
      preco: body.preco,
      descricao: body.descricao,
      ingredientes: body.ingredientes, // Array de { ingredienteId, quantidade }
      ativo: body.ativo !== undefined ? body.ativo : true,
      imagem: body.imagem,
      criadoEm: new Date().toISOString(),
    };
    
    await kv.set(`produto:${produtoId}`, produto);
    
    return c.json({ produto }, 201);
  } catch (error) {
    console.error('Error creating produto:', error);
    return c.json({ error: 'Failed to create produto: ' + error.message }, 500);
  }
});

// Atualizar produto
app.put("/make-server-d5c5d82b/produtos/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const produtoExistente = await kv.get(`produto:${id}`);
    if (!produtoExistente) {
      return c.json({ error: 'Produto not found' }, 404);
    }
    
    const produto = {
      ...produtoExistente,
      ...body,
      atualizadoEm: new Date().toISOString(),
    };
    
    await kv.set(`produto:${id}`, produto);
    
    return c.json({ produto });
  } catch (error) {
    console.error('Error updating produto:', error);
    return c.json({ error: 'Failed to update produto: ' + error.message }, 500);
  }
});

// ==================== ESTOQUE ====================

// Listar itens do estoque
app.get("/make-server-d5c5d82b/estoque", async (c) => {
  try {
    const estoque = await kv.getByPrefix('estoque:');
    return c.json({ estoque: estoque || [] });
  } catch (error) {
    console.error('Error fetching estoque:', error);
    return c.json({ error: 'Failed to fetch estoque: ' + error.message }, 500);
  }
});

// Adicionar/Atualizar item no estoque
app.post("/make-server-d5c5d82b/estoque", async (c) => {
  try {
    const body = await c.req.json();
    const itemId = body.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const item = {
      id: itemId,
      nome: body.nome,
      unidade: body.unidade, // 'kg', 'unidade', 'litro'
      quantidade: body.quantidade,
      quantidadeMinima: body.quantidadeMinima || 0,
      fornecedor: body.fornecedor,
      custoUnitario: body.custoUnitario,
      criadoEm: body.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    
    await kv.set(`estoque:${itemId}`, item);
    
    return c.json({ item }, 201);
  } catch (error) {
    console.error('Error creating/updating estoque item:', error);
    return c.json({ error: 'Failed to manage estoque item: ' + error.message }, 500);
  }
});

// Atualizar quantidade no estoque
app.put("/make-server-d5c5d82b/estoque/:id/quantidade", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const item = await kv.get(`estoque:${id}`);
    if (!item) {
      return c.json({ error: 'Estoque item not found' }, 404);
    }
    
    const itemAtualizado = {
      ...item,
      quantidade: body.quantidade,
      atualizadoEm: new Date().toISOString(),
    };
    
    await kv.set(`estoque:${id}`, itemAtualizado);
    
    return c.json({ item: itemAtualizado });
  } catch (error) {
    console.error('Error updating estoque quantity:', error);
    return c.json({ error: 'Failed to update quantity: ' + error.message }, 500);
  }
});

// ==================== CLIENTES ====================

// Listar clientes
app.get("/make-server-d5c5d82b/clientes", async (c) => {
  try {
    const clientes = await kv.getByPrefix('cliente:');
    return c.json({ clientes: clientes || [] });
  } catch (error) {
    console.error('Error fetching clientes:', error);
    return c.json({ error: 'Failed to fetch clientes: ' + error.message }, 500);
  }
});

// Criar cliente
app.post("/make-server-d5c5d82b/clientes", async (c) => {
  try {
    const body = await c.req.json();
    const clienteId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const cliente = {
      id: clienteId,
      nome: body.nome,
      telefone: body.telefone,
      email: body.email,
      endereco: body.endereco,
      pontosFidelidade: body.pontosFidelidade || 0,
      totalCompras: body.totalCompras || 0,
      pedidosRealizados: body.pedidosRealizados || 0,
      criadoEm: new Date().toISOString(),
    };
    
    await kv.set(`cliente:${clienteId}`, cliente);
    
    return c.json({ cliente }, 201);
  } catch (error) {
    console.error('Error creating cliente:', error);
    return c.json({ error: 'Failed to create cliente: ' + error.message }, 500);
  }
});

// Buscar cliente por telefone
app.get("/make-server-d5c5d82b/clientes/telefone/:telefone", async (c) => {
  try {
    const telefone = c.req.param('telefone');
    const clientes = await kv.getByPrefix('cliente:');
    
    const cliente = clientes.find((c: any) => c.telefone === telefone);
    
    if (!cliente) {
      return c.json({ error: 'Cliente not found' }, 404);
    }
    
    return c.json({ cliente });
  } catch (error) {
    console.error('Error fetching cliente by telefone:', error);
    return c.json({ error: 'Failed to fetch cliente: ' + error.message }, 500);
  }
});

// Atualizar pontos de fidelidade
app.put("/make-server-d5c5d82b/clientes/:id/pontos", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const cliente = await kv.get(`cliente:${id}`);
    if (!cliente) {
      return c.json({ error: 'Cliente not found' }, 404);
    }
    
    const clienteAtualizado = {
      ...cliente,
      pontosFidelidade: (cliente.pontosFidelidade || 0) + body.pontos,
      totalCompras: (cliente.totalCompras || 0) + (body.valorCompra || 0),
      pedidosRealizados: (cliente.pedidosRealizados || 0) + 1,
      atualizadoEm: new Date().toISOString(),
    };
    
    await kv.set(`cliente:${id}`, clienteAtualizado);
    
    return c.json({ cliente: clienteAtualizado });
  } catch (error) {
    console.error('Error updating cliente pontos:', error);
    return c.json({ error: 'Failed to update pontos: ' + error.message }, 500);
  }
});

// ==================== RELATÓRIOS ====================

// Relatório de vendas
app.get("/make-server-d5c5d82b/relatorios/vendas", async (c) => {
  try {
    const { periodo } = c.req.query(); // 'hoje', 'semana', 'mes'
    const pedidos = await kv.getByPrefix('pedido:');
    
    let dataInicio = new Date();
    if (periodo === 'hoje') {
      dataInicio.setHours(0, 0, 0, 0);
    } else if (periodo === 'semana') {
      dataInicio.setDate(dataInicio.getDate() - 7);
    } else if (periodo === 'mes') {
      dataInicio.setMonth(dataInicio.getMonth() - 1);
    }
    
    const pedidosFiltrados = pedidos.filter((p: any) => {
      const dataPedido = new Date(p.criadoEm);
      return dataPedido >= dataInicio && p.status !== 'cancelado';
    });
    
    const totalVendas = pedidosFiltrados.reduce((acc: number, p: any) => acc + (p.valorTotal || 0), 0);
    const quantidadePedidos = pedidosFiltrados.length;
    const ticketMedio = quantidadePedidos > 0 ? totalVendas / quantidadePedidos : 0;
    
    return c.json({
      periodo,
      totalVendas,
      quantidadePedidos,
      ticketMedio,
      pedidos: pedidosFiltrados,
    });
  } catch (error) {
    console.error('Error generating vendas report:', error);
    return c.json({ error: 'Failed to generate report: ' + error.message }, 500);
  }
});

// Produtos mais vendidos
app.get("/make-server-d5c5d82b/relatorios/produtos-populares", async (c) => {
  try {
    const pedidos = await kv.getByPrefix('pedido:');
    const produtosVendidos: any = {};
    
    pedidos.forEach((pedido: any) => {
      if (pedido.itens && pedido.status !== 'cancelado') {
        pedido.itens.forEach((item: any) => {
          if (!produtosVendidos[item.produtoId]) {
            produtosVendidos[item.produtoId] = {
              produtoId: item.produtoId,
              nome: item.nome || 'Produto',
              quantidade: 0,
              valorTotal: 0,
            };
          }
          produtosVendidos[item.produtoId].quantidade += item.quantidade;
          produtosVendidos[item.produtoId].valorTotal += item.valor * item.quantidade;
        });
      }
    });
    
    const ranking = Object.values(produtosVendidos).sort((a: any, b: any) => b.quantidade - a.quantidade);
    
    return c.json({ produtosPopulares: ranking });
  } catch (error) {
    console.error('Error generating popular products report:', error);
    return c.json({ error: 'Failed to generate report: ' + error.message }, 500);
  }
});

// Alertas de estoque baixo
app.get("/make-server-d5c5d82b/relatorios/estoque-baixo", async (c) => {
  try {
    const estoque = await kv.getByPrefix('estoque:');
    
    const itensBaixo = estoque.filter((item: any) => {
      return item.quantidade <= (item.quantidadeMinima || 0);
    });
    
    return c.json({ alertas: itensBaixo });
  } catch (error) {
    console.error('Error generating low stock report:', error);
    return c.json({ error: 'Failed to generate report: ' + error.message }, 500);
  }
});

Deno.serve(app.fetch);
