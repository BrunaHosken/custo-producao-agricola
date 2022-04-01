const etapasCulturaHome = () => import("../views/EtapasCultura.vue");
const etapasCulturaNew = () => import("../views/EtapasCulturaNew.vue");

export default [
  {
    path: "etapas-culturas",
    component: etapasCulturaHome,
  },
  {
    path: "etapas-culturas/new",
    component: etapasCulturaNew,
  },
];
