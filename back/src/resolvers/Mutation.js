const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getAgricultorId } = require("../utils");
const JWT_SECRET = process.env.JWT_SECRET;
const moment = require("moment");

async function signup(_, args, ctx, info) {
  const Senha = await bcrypt.hash(args.Senha, 10);
  const agricultor = await ctx.db.mutation.createAgricultor({
    data: {
      ...args,
      Senha,
    },
  });

  const token = jwt.sign({ agricultorId: agricultor.id }, JWT_SECRET, {
    expiresIn: "2h",
  });

  return {
    token,
    agricultor,
  };
}

async function login(_, { Email, Senha }, ctx, info) {
  const agricultor = await ctx.db.query.agricultor({
    where: {
      Email,
    },
  });
  if (!agricultor) {
    throw new Error("Dados inválidos, verifique os campos novamente!");
  }

  const valid = await bcrypt.compare(Senha, agricultor.Senha);
  if (!valid) {
    throw new Error("Dados inválidos, verifique os campos novamente!");
  }
  const token = jwt.sign({ agricultorId: agricultor.id }, JWT_SECRET, {
    expiresIn: "2h",
  });

  return {
    token,
    agricultor,
  };
}

function createContato(_, { DescrContato }, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.mutation.createContato(
    {
      data: {
        DescrContato,
        Agricultor: {
          connect: {
            id: agricultorId,
          },
        },
      },
    },
    info
  );
}
function createTipoDespesa(_, { DescrTipoDespesa }, ctx, info) {
  return ctx.db.mutation.createTipoDespesa(
    {
      data: {
        DescrTipoDespesa,
      },
    },
    info
  );
}

function createDespesaRealizada(_, args, ctx, info) {
  const date = moment(args.Data);
  if (!date.isValid()) {
    throw new Error("Data inválida!");
  }
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.mutation.createDespesaRealizada(
    {
      data: {
        Agricultor: {
          connect: {
            id: agricultorId,
          },
        },
        TipoDespesa: {
          connect: {
            id: args.TipoDespesaId,
          },
        },

        DescrDetalhada: args.DescrDetalhada,
        Data: args.Data,
        Valor: args.Valor,
      },
    },
    info
  );
}

function createCliente(_, { NomeCliente }, ctx, info) {
  return ctx.db.mutation.createCliente(
    {
      data: {
        NomeCliente,
      },
    },
    info
  );
}

function createVenda(_, args, ctx, info) {
  const date = moment(args.Data);
  if (!date.isValid()) {
    throw new Error("Data inválida!");
  }
  return ctx.db.mutation.createVenda(
    {
      data: {
        Cliente: {
          connect: {
            id: args.ClienteId,
          },
        },
        Data: args.Data,
      },
    },
    info
  );
}

function createCultura(
  _,
  { DescrCultura, QtdEstimadaPorHectare, Und },
  ctx,
  info
) {
  return ctx.db.mutation.createCultura(
    {
      data: {
        DescrCultura,
        QtdEstimadaPorHectare,
        Und,
      },
    },
    info
  );
}

function createTipoInsumo(_, { NomeTipo }, ctx, info) {
  return ctx.db.mutation.createTipoInsumo(
    {
      data: {
        NomeTipo,
      },
    },
    info
  );
}
function createServico(_, { DescrServico, ValorDiaHomem }, ctx, info) {
  return ctx.db.mutation.createServico(
    {
      data: {
        DescrServico,
        ValorDiaHomem,
      },
    },
    info
  );
}

function createInsumo(_, args, ctx, info) {
  return ctx.db.mutation.createInsumo(
    {
      data: {
        TipoInsumo: {
          connect: {
            id: args.TipoInsumoId,
          },
        },
        DescrInsumo: args.DescrInsumo,
        PrecoUnit: args.PrecoUnit,
        Und: args.Und,
      },
    },
    info
  );
}

function createCulturaDesenvolvida(_, args, ctx, info) {
  const dateInicio = moment(args.DataInicio);
  const dateColheita = moment(args.DataColheita);
  if (!dateInicio.isValid() || !dateColheita.isValid()) {
    throw new Error("Data inválida!");
  }
  const agricultorId = getAgricultorId(ctx);
  console.log(agricultorId);
  return ctx.db.mutation.createCulturaDesenvolvida({
    data: {
      Agricultor: {
        connect: {
          id: agricultorId,
        },
      },
      Cultura: {
        connect: {
          id: args.CulturaId,
        },
      },
      AreaTerrenoHectares: args.AreaTerrenoHectares,
      DataInicio: args.DataInicio,
      DataColheita: args.DataColheita,
      QtdColhida: args.QtdColhida,
      Unidade: args.Unidade,
    },
  });
}
function createVendaItem(_, args, ctx, info) {
  return ctx.db.mutation.createVendaItem(
    {
      data: {
        Qtd: args.Qtd,
        Und: args.Und,
        PrecoUnit: args.PrecoUnit,
        Venda: {
          connect: {
            id: args.VendaId,
          },
        },
        CulturaDesenvolvida: {
          connect: {
            id: args.CulturaDesenvolvidaId,
          },
        },
      },
    },
    info
  );
}

module.exports = {
  signup,
  login,
  createContato,
  createTipoDespesa,
  createDespesaRealizada,
  createCliente,
  createVenda,
  createVendaItem,
  createCultura,
  createTipoInsumo,
  createServico,
  createInsumo,
  createCulturaDesenvolvida,
};
