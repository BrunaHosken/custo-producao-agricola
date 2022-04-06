const { prisma } = require("./generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");
const resolvers = {
  Query: {
    agricultor(parent, args, context, info) {
      return prisma.agricultor({ CodAgricultor: args.CodAgricultor });
    },
  },
};

const server = new GraphQLServer({
  typeDefs: `${__dirname}/schema.graphql`,
  resolvers,
});

server.start().then(() => console.log("local: 4000"));
