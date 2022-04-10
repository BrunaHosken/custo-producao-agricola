const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

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

module.exports = {
  signup,
  login,
};
