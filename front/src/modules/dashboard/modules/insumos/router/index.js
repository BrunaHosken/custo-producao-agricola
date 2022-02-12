const insumosHome = () => import("../views/Insumos.vue");
const insumosNew = () => import("../views/InsumosNew.vue");

export default [
  {
    path: "insumos",
    component: insumosHome,
  },
  {
    path: "insumos/new",
    component: insumosNew,
  },
];
