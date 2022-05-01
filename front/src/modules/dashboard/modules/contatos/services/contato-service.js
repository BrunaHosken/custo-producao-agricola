import apollo from "./../../../../../plugins/apollo";
import ContatoMutation from "./../graphql/Contato.gql";
const createContato = async (variables) => {
  const response = await apollo.mutate({
    mutation: ContatoMutation,
    variables,
  });
  return response.data;
};

export default {
  createContato,
};
