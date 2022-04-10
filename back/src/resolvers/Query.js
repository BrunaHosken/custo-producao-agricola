function agricultor(_, args, ctx, info) {
  return ctx.db.query.agricultor({ where: { id: args.id } }, info);
}

module.exports = {
  agricultor,
};
