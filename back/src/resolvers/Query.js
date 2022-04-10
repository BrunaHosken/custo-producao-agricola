const { getAgricultorId } = require("./../utils");
function agricultor(_, args, ctx, info) {
  const agricultorId = getAgricultorId(ctx);
  return ctx.db.query.agricultor({ where: { id: agricultorId } }, info);
}

module.exports = {
  agricultor,
};
