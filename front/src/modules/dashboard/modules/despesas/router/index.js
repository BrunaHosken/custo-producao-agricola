const despesasHome = () => import("../views/Despesas.vue");
const despesasNew = () => import("../views/DespesasNew.vue");

export default [
  {
    path: "despesas",
    component: despesasHome,
  },
  {
    path: "despesas/new",
    component: despesasNew,
  },
];
