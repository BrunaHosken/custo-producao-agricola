const custoProcucaoHome = () => import("../views/CustoProducao.vue");
const custoProcucaoNew = () => import("../views/CustoProducaoNew.vue");

export default [
  {
    path: "custo-producao",
    component: custoProcucaoHome,
  },
  {
    path: "custo-producao/new",
    component: custoProcucaoNew,
  },
];
