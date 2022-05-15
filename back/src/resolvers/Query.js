const { getAgricultorId } = require("./../utils");
function agricultor(_, args, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.query.agricultor({ where: { id: agricultorId } }, info);
}

function tipoDespesas(_, args, ctx, info) {
  return ctx.db.query.tipoDespesas(info);
}

function tipoInsumoes(_, args, ctx, info) {
  return ctx.db.query.tipoInsumoes(
    {
      orderBy: "NomeTipo_ASC",
    },
    info
  );
}

function servicoes(_, args, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.query.servicoes(
    {
      where: {
        Agricultor: {
          id: agricultorId,
        },
      },
      orderBy: "DescrServico_ASC",
    },
    info
  );
}
function clientes(_, args, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.query.clientes(
    {
      where: {
        Agricultor: {
          id: agricultorId,
        },
      },
      orderBy: "NomeCliente_ASC",
    },
    info
  );
}
function culturas(_, args, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.query.culturas(
    {
      where: {
        Agricultor: {
          id: agricultorId,
        },
      },
      orderBy: "DescrCultura_ASC",
    },
    info
  );
}
function vendas(_, args, ctx, info) {
  return ctx.db.query.vendas({ orderBy: "Data_ASC" }, info);
}
function despesaRealizadas(_, args, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.query.despesaRealizadas(
    {
      where: {
        Agricultor: {
          id: agricultorId,
        },
      },

      orderBy: "DescrDetalhada_ASC",
    },
    info
  );
}
function culturaDesenvolvidas(_, args, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.query.culturaDesenvolvidas(
    {
      where: {
        Agricultor: {
          id: agricultorId,
        },
      },

      orderBy: "DataInicio_ASC",
    },
    info
  );
}
function insumoes(_, args, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.query.insumoes(
    {
      where: {
        Agricultor: {
          id: agricultorId,
        },
      },
      orderBy: "DescrInsumo_ASC",
    },
    info
  );
}
function vendaItems(_, args, ctx, info) {
  return ctx.db.query.vendaItems({ orderBy: "Qtd_ASC" }, info);
}
function culturaEtapas(_, args, ctx, info) {
  return ctx.db.query.culturaEtapas({ orderBy: "DescrEtapa_ASC" }, info);
}
function usoInsumoReals(_, args, ctx, info) {
  return ctx.db.query.usoInsumoReals({ orderBy: "Data_ASC" }, info);
}
function usoInsumoPrevistoes(_, args, ctx, info) {
  return ctx.db.query.usoInsumoPrevistoes({ orderBy: "Qtd_ASC" }, info);
}
function servicoPrestadoes(_, args, ctx, info) {
  return ctx.db.query.servicoPrestadoes({ orderBy: "Data_ASC" }, info);
}
function servicoPrevistoes(_, args, ctx, info) {
  return ctx.db.query.servicoPrevistoes({ orderBy: "DiasHomem_ASC" }, info);
}
module.exports = {
  agricultor,
  tipoDespesas,
  tipoInsumoes,
  servicoes,
  clientes,
  culturas,
  vendas,
  despesaRealizadas,
  culturaDesenvolvidas,
  insumoes,
  vendaItems,
  culturaEtapas,
  usoInsumoReals,
  usoInsumoPrevistoes,
  servicoPrestadoes,
  servicoPrevistoes,
};
