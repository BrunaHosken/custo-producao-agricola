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
function culturaDesenvolvidas(_, { date, type }, ctx, info) {
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

      AND = [
        ...AND,
        { DataInicio_gte: startDate },
        { DataInicio_lte: endDate },
      ];
    }
    if (type === "Mensal") {
      const period = moment(date, "DD-MM-YYYY");
      const startDate = period.startOf("month").toISOString();
      const endDate = period.endOf("month").toISOString();

      AND = [
        ...AND,
        { DataInicio_gte: startDate },
        { DataInicio_lte: endDate },
      ];
    }
    if (type === "Anual") {
      const period = moment(date, "DD-MM-YYYY");
      const startDate = period.startOf("year").toISOString();
      const endDate = period.endOf("year").toISOString();

      AND = [
        ...AND,
        { DataInicio_gte: startDate },
        { DataInicio_lte: endDate },
      ];
    }
  }
  return ctx.db.query.culturaDesenvolvidas(
    {
      where: { AND },
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

function vendaItems(_, { date, type }, ctx, info) {
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

      AND = [
        ...AND,
        {
          Venda: {
            Data_gte: startDate,
            Data_lte: endDate,
          },
        },
      ];
    }
    if (type === "Mensal") {
      const period = moment(date, "DD-MM-YYYY");
      const startDate = period.startOf("month").toISOString();
      const endDate = period.endOf("month").toISOString();

      AND = [
        ...AND,
        {
          Venda: {
            Data_gte: startDate,
            Data_lte: endDate,
          },
        },
      ];
    }
    if (type === "Anual") {
      const period = moment(date, "DD-MM-YYYY");
      const startDate = period.startOf("year").toISOString();
      const endDate = period.endOf("year").toISOString();

      AND = [
        ...AND,
        {
          Venda: {
            Data_gte: startDate,
            Data_lte: endDate,
          },
        },
      ];
    }
  }
  return ctx.db.query.vendaItems(
    {
      where: { AND },
      orderBy: "Qtd_ASC",
    },
    info
  );
}

function culturaEtapas(_, { id }, ctx, info) {
  return ctx.db.query.culturaEtapas(
    {
      where: {
        CulturaDesenvolvida: {
          id: id,
        },
      },
      orderBy: "DescrEtapa_ASC",
    },
    info
  );
}
function usoInsumoReals(_, { id }, ctx, info) {
  return ctx.db.query.usoInsumoReals(
    {
      where: {
        CulturaEtapa: {
          id: id,
        },
      },
      orderBy: "Data_ASC",
    },
    info
  );
}
function usoInsumoPrevistoes(_, { id }, ctx, info) {
  return ctx.db.query.usoInsumoPrevistoes(
    {
      where: {
        CulturaEtapa: {
          id: id,
        },
      },
      orderBy: "Qtd_ASC",
    },
    info
  );
}
function servicoPrestadoes(_, { id }, ctx, info) {
  return ctx.db.query.servicoPrestadoes(
    {
      where: {
        CulturaEtapa: {
          id: id,
        },
      },
      orderBy: "Data_ASC",
    },
    info
  );
}
function servicoPrevistoes(_, { id }, ctx, info) {
  return ctx.db.query.servicoPrevistoes(
    {
      where: {
        CulturaEtapa: {
          id: id,
        },
      },
      orderBy: "DiasHomem_ASC",
    },
    info
  );
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
