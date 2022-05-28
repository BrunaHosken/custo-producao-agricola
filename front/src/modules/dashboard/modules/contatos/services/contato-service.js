import apollo from "./../../../../../plugins/apollo";
import ContatoMutation from "./../graphql/Contato.gql";
import AgricultorQuery from "././../../../../auth/graphql/Agricultor.gql";
const createContato = async (variables) => {
  const response = await apollo.mutate({
    mutation: ContatoMutation,
    variables,
  });
  return response.data;
};

const agricultor = async (options = {}) => {
  const response = await apollo.query({
    query: AgricultorQuery,
    ...options,
  });
  return response.data.agricultor;
};

export default {
  createContato,
  agricultor,
};
