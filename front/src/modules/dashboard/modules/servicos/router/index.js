const servicosHome = () => import("../views/Servicos.vue");
const servicosNew = () => import("../views/ServicosNew.vue");

export default [
  {
    path: "servicos",
    component: servicosHome,
  },
  {
    path: "servicos/new",
    component: servicosNew,
  },
];
