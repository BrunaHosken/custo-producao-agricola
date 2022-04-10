function agricultor(_, args, ctx, info) {
  return ctx.db.query.agricultor(
    { where: { CodAgricultor: args.CodAgricultor } },
    info
  );
}

module.exports = {
  agricultor,
};
