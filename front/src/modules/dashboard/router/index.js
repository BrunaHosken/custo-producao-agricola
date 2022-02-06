import configuracoesRoutes from "./../modules/configuracoes/router";
import despesasRoutes from "./../modules/despesas/router";
import culturasRoutes from "./../modules/culturas/router";
import custoProducaoRoutes from "./../modules/custo-producao/router";
import etapasCulturaRoutes from "./../modules/etapas-cultura/router";
import insumosRoutes from "./../modules/insumos/router";
import servicosRoutes from "./../modules/servicos/router";
import margemBrutaRoutes from "./../modules/margem-bruta/router";
import vendasRoutes from "./../modules/vendas/router";
import clientesRoutes from "./../modules/clientes/router";
import controleEstoqueRoutes from "./../modules/controle-estoque/router";
import relatoriosRoutes from "./../modules/relatorios/router";
import contatoRoutes from "./../modules/contatos/router";
const Dashboard = () => import("./../views/Dashboard.vue");

export default [
  {
    path: "/dashboard",
    component: Dashboard,
    // meta: { requiresAuth: true },
    children: [
      ...configuracoesRoutes,
      ...despesasRoutes,
      ...culturasRoutes,
      ...custoProducaoRoutes,
      ...etapasCulturaRoutes,
      ...insumosRoutes,
      ...servicosRoutes,
      ...margemBrutaRoutes,
      ...vendasRoutes,
      ...clientesRoutes,
      ...controleEstoqueRoutes,
      ...relatoriosRoutes,
      ...contatoRoutes,
    ],
  },
];
