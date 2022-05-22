const { getAgricultorId } = require("./../utils");
const moment = require("moment");
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
function despesaRealizadas(_, { date, type }, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  let AND = [
    {
      Agricultor: {
        id: agricultorId,
      },
    },
  ];

  if (date) {
    if (type === "Semanal") {
      const period = moment(date, "DD-MM-YYYY");
      const startDate = period.startOf("week").toISOString();
      const endDate = period.endOf("week").toISOString();

      AND = [...AND, { Data_gte: startDate }, { Data_lte: endDate }];
    }
    if (type === "Mensal") {
      const period = moment(date, "DD-MM-YYYY");
      const startDate = period.startOf("month").toISOString();
      const endDate = period.endOf("month").toISOString();

      AND = [...AND, { Data_gte: startDate }, { Data_lte: endDate }];
    }
    if (type === "Anual") {
      const period = moment(date, "DD-MM-YYYY");
      const startDate = period.startOf("year").toISOString();
      const endDate = period.endOf("year").toISOString();

      AND = [...AND, { Data_gte: startDate }, { Data_lte: endDate }];
    }
  }
  return ctx.db.query.despesaRealizadas(
    {
      where: { AND },
      orderBy: "Data_ASC",
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
