const culturasHome = () => import("../views/Culturas.vue");
const culturasNew = () => import("../views/CulturasNew.vue");

export default [
  {
    path: "culturas",
    component: culturasHome,
  },
  {
    path: "culturas/new",
    component: culturasNew,
  },
];
