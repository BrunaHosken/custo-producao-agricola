const vendasHome = () => import("../views/Vendas.vue");
const vendasNew = () => import("../views/VendasNew.vue");

export default [
  {
    path: "vendas",
    component: vendasHome,
  },
  {
    path: "vendas/new",
    component: vendasNew,
  },
];
